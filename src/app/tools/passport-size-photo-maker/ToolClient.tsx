"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Loader2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import CropFrame, { FaceGuide } from "@/components/tools/CropFrame";
import ErrorNotice from "@/components/tools/ErrorNotice";
import UploadZone from "@/components/tools/UploadZone";
import { beginWork, endWork } from "@/lib/crashGuard";
import { downloadBlob } from "@/lib/download";
import { canvasToJpeg, checkImage, withJpegDpi } from "@/lib/imageFile";
import { MAX_ZOOM, START_VIEW as START, clampView, photoHeight, prepareImage, releaseWork, renderFrame as render, type Label, type View, type Work } from "@/lib/photoFrame";

const MAX_MB = 30;
const DPI = 300;
const MM_W = 35;
const MM_H = 45;
const PX_W = 413; // 35 mm at 300 DPI
const PX_H = 531; // 45 mm at 300 DPI
const KB_OPTIONS = [0, 20, 50, 100, 200]; // 0 means no limit
const GAP = 2; // mm between photos on a sheet, room for the scissors

type Sheet = { id: "4x6" | "a4"; label: string; file: string; w: number; h: number; margin: number };

const SHEETS: Sheet[] = [
  { id: "4x6", label: "4 x 6 inch photo paper", file: "4x6", w: 152.4, h: 101.6, margin: 3 },
  { id: "a4", label: "A4 paper", file: "a4", w: 210, h: 297, margin: 8 },
];

function layout(sheet: Sheet) {
  const cols = Math.floor((sheet.w - 2 * sheet.margin + GAP) / (MM_W + GAP));
  const rows = Math.floor((sheet.h - 2 * sheet.margin + GAP) / (MM_H + GAP));
  const left = (sheet.w - (cols * MM_W + (cols - 1) * GAP)) / 2;
  const top = (sheet.h - (rows * MM_H + (rows - 1) * GAP)) / 2;
  const spot = (i: number) => ({ x: left + (i % cols) * (MM_W + GAP), y: top + Math.floor(i / cols) * (MM_H + GAP) });
  return { max: cols * rows, spot };
}

/** Single photo under a size limit: best quality first, then a smaller picture if quality alone is not enough. */
async function photoUnder(img: Work, view: View, label: Label | null, limit: number) {
  const canvas = document.createElement("canvas");
  try {
    let scale = 1;
    for (let attempt = 0; attempt < 10; attempt++) {
      const W = Math.round(PX_W * scale);
      const H = Math.round(PX_H * scale);
      render(canvas, img, W, H, view, label);
      const dpi = Math.round(W / (MM_W / 25.4));
      const best = await canvasToJpeg(canvas, 0.92);
      if (best.size <= limit) return { blob: await withJpegDpi(best, dpi), W, H };
      const low = await canvasToJpeg(canvas, 0.4);
      if (low.size <= limit) {
        let lo = 0.4;
        let hi = 0.92;
        let fit = low;
        for (let i = 0; i < 7; i++) {
          const mid = (lo + hi) / 2;
          const b = await canvasToJpeg(canvas, mid);
          if (b.size <= limit) {
            fit = b;
            lo = mid;
          } else hi = mid;
        }
        return { blob: await withJpegDpi(fit, dpi), W, H };
      }
      if (W <= 120) break;
      scale *= Math.max(0.5, Math.min(0.9, Math.sqrt(limit / low.size) * 0.95));
    }
    throw new Error("toosmall");
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

const errorText = (e: unknown) => {
  const m = e instanceof Error ? e.message : "";
  if (m === "toosmall") return "Could not get the photo under this size. Choose a larger size in KB.";
  if (m === "pixels") return "This picture is too large (over 100 megapixels) for the browser to handle.";
  if (e instanceof RangeError || /memory|allocation/i.test(m)) return "Your device ran out of memory. Close other tabs or try a smaller photo.";
  return "This picture could not be read. It may be damaged, so try a different one.";
};

const kb = (bytes: number) => Math.round(bytes / 1024);
const mm2pt = (mm: number) => (mm * 72) / 25.4;
const mm2px = (mm: number) => Math.round((mm * DPI) / 25.4);
const today = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const btn =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066cc] disabled:cursor-wait disabled:opacity-60";
const primary = `${btn} border-[#0066cc] bg-[#0066cc] text-white hover:bg-[#005bb5]`;
const plain = `${btn} border-slate-300 bg-white text-slate-800 hover:bg-slate-50`;
const pill = (active: boolean) => `${btn} ${active ? "border-[#0066cc] bg-[#0066cc] text-white" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"}`;
const field = "min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900";

export default function ToolClient() {
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<View>(START);
  const [guides, setGuides] = useState(true);
  const [labelOn, setLabelOn] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [limitKB, setLimitKB] = useState(0);
  const [sheetId, setSheetId] = useState<Sheet["id"]>("4x6");
  const [copies, setCopies] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const label: Label | null = labelOn ? { name: name.trim(), date: date.trim() } : null;
  const ph = photoHeight(PX_H, labelOn);
  const sheet = SHEETS.find((s) => s.id === sheetId) as Sheet;
  const grid = layout(sheet);
  const count = Math.min(grid.max, Math.max(1, Math.round(Number(copies)) || grid.max));

  // Date on the client only, so the server and browser render the same first HTML
  useEffect(() => setDate(today()), []);

  const update = (fn: (v: View) => View) => {
    if (!work) return;
    setView((v) => clampView(fn(v), work, PX_W, ph));
    setInfo("");
  };
  const open = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError(null);
    setInfo("");
    const problem = await checkImage(file, MAX_MB);
    if (problem) {
      setError(problem);
      return;
    }
    setLoading(true);
    try {
      const next = await prepareImage(file);
      setWork((old) => {
        releaseWork(old);
        return next;
      });
      setView(START);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading(false);
    }
  };

  /** Runs one export and turns any failure into a plain message */
  const exportWith = async (job: () => Promise<void>) => {
    setError(null);
    setInfo("");
    setBusy(true);
    beginWork();
    try {
      await job();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
      endWork();
    }
  };

  const fullPhoto = async (img: Work) => {
    const canvas = document.createElement("canvas");
    try {
      render(canvas, img, PX_W, PX_H, view, label);
      return await canvasToJpeg(canvas, 0.95);
    } finally {
      canvas.width = 0;
      canvas.height = 0;
    }
  };

  const downloadPhoto = () =>
    exportWith(async () => {
      if (!work) return;
      if (limitKB) {
        const r = await photoUnder(work, view, label, limitKB * 1000 - 1);
        downloadBlob(r.blob, `passport-photo-35x45mm-${limitKB}kb.jpg`);
        setInfo(`Saved: ${r.W} x ${r.H} px, ${kb(r.blob.size)} KB.`);
      } else {
        const blob = await withJpegDpi(await fullPhoto(work), DPI);
        downloadBlob(blob, "passport-photo-35x45mm.jpg");
        setInfo(`Saved: ${PX_W} x ${PX_H} px (35 x 45 mm at 300 DPI), ${kb(blob.size)} KB.`);
      }
    });

  const downloadSheetPdf = () =>
    exportWith(async () => {
      if (!work) return;
      const { PDFDocument, rgb } = await import("pdf-lib");
      const pdf = await PDFDocument.create();
      pdf.setTitle("Passport size photos 35 x 45 mm");
      const page = pdf.addPage([mm2pt(sheet.w), mm2pt(sheet.h)]);
      const jpg = await pdf.embedJpg(await (await fullPhoto(work)).arrayBuffer());
      for (let i = 0; i < count; i++) {
        const { x, y } = grid.spot(i);
        const box = { x: mm2pt(x), y: mm2pt(sheet.h - y - MM_H), width: mm2pt(MM_W), height: mm2pt(MM_H) };
        page.drawImage(jpg, box);
        page.drawRectangle({ ...box, borderColor: rgb(0.7, 0.7, 0.7), borderWidth: 0.3 });
      }
      const bytes = await pdf.save();
      downloadBlob(new Blob([bytes as unknown as BlobPart], { type: "application/pdf" }), `passport-photos-${sheet.file}.pdf`);
      setInfo(`Saved: ${count} photos on ${sheet.label}. Print at Actual size (100%).`);
    });

  const downloadSheetJpg = () =>
    exportWith(async () => {
      if (!work) return;
      const one = document.createElement("canvas");
      const canvas = document.createElement("canvas");
      try {
        render(one, work, PX_W, PX_H, view, label);
        canvas.width = mm2px(sheet.w);
        canvas.height = mm2px(sheet.h);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("canvas");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#b3b3b3";
        ctx.lineWidth = 1;
        for (let i = 0; i < count; i++) {
          const { x, y } = grid.spot(i);
          ctx.drawImage(one, mm2px(x), mm2px(y), PX_W, PX_H);
          ctx.strokeRect(mm2px(x) - 0.5, mm2px(y) - 0.5, PX_W + 1, PX_H + 1);
        }
        const blob = await withJpegDpi(await canvasToJpeg(canvas, 0.95), DPI);
        downloadBlob(blob, `passport-photos-${sheet.file}.jpg`);
        setInfo(`Saved: ${count} photos on ${sheet.label} (${canvas.width} x ${canvas.height} px, 300 DPI). Print at Actual size (100%).`);
      } finally {
        one.width = 0;
        canvas.width = 0;
      }
    });

  return (
    <div className="space-y-5">
      <ErrorNotice message={error} onDismiss={() => setError(null)} />

      <UploadZone
        accept="image/jpeg,image/png,image/webp"
        onFiles={open}
        buttonLabel={work ? "Choose another photo" : "Select photo"}
        hint={`One JPG, PNG or WebP photo, up to ${MAX_MB} MB. Stand in front of a plain white or light wall.`}
        noun="photo"
        compact={!!work}
        loading={loading}
        loadingText="Opening photo..."
        disabled={busy}
      />

      {work && (
        <>
          <div className="grid gap-6 md:grid-cols-[auto,1fr]">
            <div className="mx-auto w-[260px] sm:w-[300px]">
              <CropFrame
                work={work}
                view={view}
                label={label}
                width={PX_W}
                height={PX_H}
                onChange={update}
                overlay={guides ? <FaceGuide width={PX_W} height={PX_H} photoH={ph} /> : null}
              />
              <p className="mt-2 text-center text-xs text-slate-500">35 x 45 mm. Drag to move, pinch or scroll to zoom.</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                Put the top of the head on the upper line and the chin on the lower line, with the nose on the middle line. The face should fill most of the photo.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => update((v) => ({ ...v, zoom: v.zoom / 1.1 }))} className={plain} aria-label="Zoom out">
                  <ZoomOut size={18} aria-hidden="true" />
                </button>
                <input
                  type="range"
                  min={1}
                  max={MAX_ZOOM}
                  step={0.01}
                  value={view.zoom}
                  onChange={(e) => update((v) => ({ ...v, zoom: Number(e.target.value) }))}
                  aria-label="Zoom"
                  className="h-11 min-w-0 flex-1 accent-[#0066cc]"
                />
                <button type="button" onClick={() => update((v) => ({ ...v, zoom: v.zoom * 1.1 }))} className={plain} aria-label="Zoom in">
                  <ZoomIn size={18} aria-hidden="true" />
                </button>
              </div>
              <label className="block text-sm text-slate-800">
                Straighten ({view.tilt > 0 ? "+" : ""}
                {view.tilt}°)
                <input
                  type="range"
                  min={-15}
                  max={15}
                  step={0.5}
                  value={view.tilt}
                  onChange={(e) => update((v) => ({ ...v, tilt: Number(e.target.value) }))}
                  className="block h-11 w-full accent-[#0066cc]"
                />
              </label>
              <label className="block text-sm text-slate-800">
                Brightness ({view.light > 0 ? "+" : ""}
                {view.light}%)
                <input
                  type="range"
                  min={-30}
                  max={40}
                  step={1}
                  value={view.light}
                  onChange={(e) => update((v) => ({ ...v, light: Number(e.target.value) }))}
                  className="block h-11 w-full accent-[#0066cc]"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => update((v) => ({ ...v, turns: (v.turns + 1) % 4 }))} className={plain}>
                  <RotateCw size={18} aria-hidden="true" /> Turn 90°
                </button>
                <button type="button" onClick={() => update(() => START)} className={plain}>
                  <RotateCcw size={18} aria-hidden="true" /> Reset
                </button>
              </div>
              <label className="flex min-h-[44px] w-fit items-center gap-3 text-sm text-slate-800">
                <input type="checkbox" checked={guides} onChange={(e) => setGuides(e.target.checked)} className="h-5 w-5 accent-[#0066cc]" />
                Show face guide (not printed)
              </label>
              <label className="flex min-h-[44px] w-fit items-center gap-3 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={labelOn}
                  onChange={(e) => {
                    setLabelOn(e.target.checked);
                    if (work) setView((v) => clampView(v, work, PX_W, photoHeight(PX_H, e.target.checked)));
                    setInfo("");
                  }}
                  className="h-5 w-5 accent-[#0066cc]"
                />
                Add name and date below the face
              </label>
              {labelOn && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm text-slate-800">
                    Name
                    <input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={field} />
                  </label>
                  <label className="text-sm text-slate-800">
                    Date
                    <input value={date} maxLength={20} onChange={(e) => setDate(e.target.value)} placeholder="DD/MM/YYYY" className={field} />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <fieldset className="space-y-3 rounded-xl border border-slate-200 p-4">
              <legend className="px-2 text-sm font-semibold text-slate-900">Single photo for online forms</legend>
              <p className="text-sm text-slate-600">Size limit in KB (use what your form asks for)</p>
              <div className="flex flex-wrap gap-2">
                {KB_OPTIONS.map((k) => (
                  <button key={k} type="button" aria-pressed={limitKB === k} onClick={() => setLimitKB(k)} className={pill(limitKB === k)}>
                    {k ? `${k} KB` : "No limit"}
                  </button>
                ))}
              </div>
              <button type="button" onClick={downloadPhoto} disabled={busy} className={primary}>
                {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Download size={18} aria-hidden="true" />}
                Download photo (JPG)
              </button>
            </fieldset>

            <fieldset className="space-y-3 rounded-xl border border-slate-200 p-4">
              <legend className="px-2 text-sm font-semibold text-slate-900">Print sheet</legend>
              <div className="flex flex-wrap gap-2">
                {SHEETS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={sheetId === s.id}
                    onClick={() => {
                      setSheetId(s.id);
                      setCopies("");
                    }}
                    className={pill(sheetId === s.id)}
                  >
                    {s.id === "4x6" ? "4 x 6 inch" : "A4"} ({layout(s).max} photos)
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-800">
                Number of photos
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={grid.max}
                  value={copies}
                  onChange={(e) => setCopies(e.target.value)}
                  placeholder={String(grid.max)}
                  className={`${field} w-24`}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={downloadSheetPdf} disabled={busy} className={primary}>
                  <FileText size={18} aria-hidden="true" /> Download PDF
                </button>
                <button type="button" onClick={downloadSheetJpg} disabled={busy} className={plain}>
                  <Download size={18} aria-hidden="true" /> Download JPG
                </button>
              </div>
              <p className="text-xs text-slate-500">Print at Actual size or 100%, not Fit to page, so each photo comes out exactly 35 x 45 mm.</p>
            </fieldset>
          </div>

          <p className="text-sm text-slate-700" aria-live="polite">{info}</p>
        </>
      )}
    </div>
  );
}
