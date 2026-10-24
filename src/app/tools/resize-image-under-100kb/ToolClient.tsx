"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Loader2, Trash2, X } from "lucide-react";
import ErrorNotice from "@/components/tools/ErrorNotice";
import UploadZone from "@/components/tools/UploadZone";
import { beginWork, endWork } from "@/lib/crashGuard";
import { downloadBlob } from "@/lib/download";
import { canvasToJpeg as toBlob, checkImage, decodeImage as decode } from "@/lib/imageFile";

const MAX_FILES = 20;
const MAX_MB = 30;
const MAX_PIXELS = 100_000_000; // refuse pictures the browser could not hold in memory
const PRESETS = [20, 30, 50, 100, 200];

type Item = {
  id: number;
  file: File;
  status: "waiting" | "working" | "done" | "error";
  blob?: Blob;
  url?: string;
  width?: number;
  height?: number;
  note?: string;
  error?: string;
};

const kb = (bytes: number) => (bytes / 1024 >= 10 ? Math.round(bytes / 1024) : Math.round((bytes / 1024) * 10) / 10);
const baseName = (n: string) => n.replace(/\.[^.]+$/, "") || "image";
const tick = () => new Promise<void>((r) => setTimeout(r, 0));

type Settings = { limit: number; maxW: number; maxH: number; keepDims: boolean };

/** Finds the best quality (and, if needed, the smallest shrink) that gets the picture under the limit. */
async function squeeze(file: File, s: Settings): Promise<{ blob: Blob; width: number; height: number; note?: string }> {
  const img = await decode(file);
  const canvas = document.createElement("canvas");
  try {
    const { width: sw, height: sh } = img;
    if (!sw || !sh) throw new Error("size");
    if (sw * sh > MAX_PIXELS) throw new Error("pixels");
    let scale = Math.min(1, s.maxW > 0 ? s.maxW / sw : 1, s.maxH > 0 ? s.maxH / sh : 1);
    const limited = scale < 1;

    // Already small enough and nothing to change: hand the original back
    if (!limited && file.size <= s.limit) return { blob: file, width: sw, height: sh, note: "Already under the limit, so it was left as it is." };

    const floorQ = s.keepDims ? 0.05 : 0.55;
    for (let attempt = 0; attempt < 10; attempt++) {
      const w = Math.max(1, Math.round(sw * scale));
      const h = Math.max(1, Math.round(sh * scale));
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img.source, 0, 0, w, h);

      const best = await toBlob(canvas, 0.92);
      if (best.size <= s.limit) return { blob: best, width: w, height: h };
      const low = await toBlob(canvas, floorQ);
      if (low.size <= s.limit) {
        // The answer lies between the floor and 0.92: keep the highest quality that fits
        let lo = floorQ;
        let hi = 0.92;
        let fit = low;
        for (let i = 0; i < 7; i++) {
          const mid = (lo + hi) / 2;
          const b = await toBlob(canvas, mid);
          if (b.size <= s.limit) {
            fit = b;
            lo = mid;
          } else hi = mid;
        }
        return { blob: fit, width: w, height: h };
      }
      if (s.keepDims) throw new Error("toosmall");
      if (Math.min(w, h) <= 100) break;
      // Picture size drops with the square of the scale, so this lands close on the next try
      scale *= Math.max(0.5, Math.min(0.95, Math.sqrt(s.limit / low.size) * 0.95));
      await tick();
    }
    throw new Error("toosmall");
  } finally {
    img.close();
    canvas.width = 0;
    canvas.height = 0;
  }
}

const errorText = (e: unknown, limitKB: number) => {
  const m = e instanceof Error ? e.message : "";
  if (m === "toosmall") return `Could not get this picture under ${limitKB} KB. Choose a larger size, or untick Keep original dimensions.`;
  if (m === "pixels") return "This picture is too large (over 100 megapixels) for the browser to handle.";
  if (e instanceof RangeError || /memory|allocation/i.test(m)) return "Your device ran out of memory on this picture. Close other tabs or try a smaller photo.";
  return "This picture could not be read. It may be damaged, so try a different one.";
};

const btn =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066cc]";

export default function ToolClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [targetKB, setTargetKB] = useState(100);
  const [customText, setCustomText] = useState("");
  const [maxW, setMaxW] = useState("");
  const [maxH, setMaxH] = useState("");
  const [keepDims, setKeepDims] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(0);
  const itemsRef = useRef<Item[]>([]);
  itemsRef.current = items;

  // Release the result pictures when leaving the page
  useEffect(
    () => () => {
      itemsRef.current.forEach((i) => i.url && URL.revokeObjectURL(i.url));
    },
    [],
  );

  const patch = (id: number, p: Partial<Item>) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...p } : i)));

  const add = async (files: File[]) => {
    setError(null);
    const room = MAX_FILES - items.length;
    const picked = files.slice(0, Math.max(0, room));
    const problems: string[] = [];
    if (files.length > picked.length) problems.push(`Only ${MAX_FILES} photos can be added at a time.`);
    const checks = await Promise.all(picked.map((f) => checkImage(f, MAX_MB)));
    const ok: Item[] = [];
    picked.forEach((file, i) => {
      if (checks[i]) problems.push(checks[i] as string);
      else ok.push({ id: ++idRef.current, file, status: "waiting" });
    });
    if (problems.length) setError(problems.join(" "));
    if (ok.length) setItems((prev) => [...prev, ...ok]);
  };

  const remove = (id: number) =>
    setItems((prev) => {
      const gone = prev.find((i) => i.id === id);
      if (gone?.url) URL.revokeObjectURL(gone.url);
      return prev.filter((i) => i.id !== id);
    });

  const clearAll = () => {
    items.forEach((i) => i.url && URL.revokeObjectURL(i.url));
    setItems([]);
    setError(null);
  };

  const run = async () => {
    const custom = Number(customText);
    const useKB = customText && Number.isFinite(custom) ? Math.round(custom) : targetKB;
    if (useKB < 10 || useKB > 2000) {
      setError("Choose a size between 10 and 2000 KB.");
      return;
    }
    const settings: Settings = {
      limit: useKB * 1000 - 1,
      maxW: Math.max(0, Math.round(Number(maxW)) || 0),
      maxH: Math.max(0, Math.round(Number(maxH)) || 0),
      keepDims,
    };
    setError(null);
    setBusy(true);
    beginWork();
    const list = itemsRef.current;
    for (let n = 0; n < list.length; n++) {
      const it = list[n];
      if (it.url) URL.revokeObjectURL(it.url);
      patch(it.id, { status: "working", blob: undefined, url: undefined, note: undefined, error: undefined });
      setProgress(`Working on ${it.file.name} (${n + 1} of ${list.length})...`);
      await tick();
      try {
        const r = await squeeze(it.file, settings);
        patch(it.id, { status: "done", blob: r.blob, url: URL.createObjectURL(r.blob), width: r.width, height: r.height, note: r.note });
      } catch (e) {
        patch(it.id, { status: "error", error: errorText(e, useKB) });
      }
    }
    setProgress("");
    setBusy(false);
    endWork();
  };

  const fileName = (it: Item) => (it.blob === it.file ? it.file.name : `${baseName(it.file.name)}_${customText && Number(customText) ? Math.round(Number(customText)) : targetKB}kb.jpg`);

  const downloadAll = async () => {
    const done = items.filter((i) => i.status === "done" && i.blob);
    if (!done.length) return;
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const used = new Set<string>();
      done.forEach((i) => {
        let name = fileName(i);
        for (let k = 2; used.has(name); k++) name = name.replace(/(\.[^.]+)$/, `_${k}$1`);
        used.add(name);
        zip.file(name, i.blob as Blob);
      });
      downloadBlob(await zip.generateAsync({ type: "blob", compression: "STORE" }), "resized-images.zip");
    } catch {
      setError("Part of the tool could not be loaded. Check your internet connection and try again.");
    }
  };

  const doneCount = items.filter((i) => i.status === "done").length;
  const pill = (active: boolean) =>
    `${btn} ${active ? "border-[#0066cc] bg-[#0066cc] text-white" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"}`;
  const input = "min-h-[44px] w-28 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900";

  return (
    <div className="space-y-5">
      <ErrorNotice message={error} onDismiss={() => setError(null)} />

      <UploadZone
        accept="image/jpeg,image/png,image/webp"
        multiple
        onFiles={add}
        buttonLabel={items.length ? "Add more photos" : "Select photos"}
        hint={`JPG, PNG or WebP, up to ${MAX_MB} MB each, ${MAX_FILES} photos at a time`}
        noun="photo"
        compact={items.length > 0}
        disabled={busy}
      />

      <fieldset className="space-y-4 rounded-xl border border-slate-200 p-4">
        <legend className="px-2 text-sm font-semibold text-slate-900">Make each photo smaller than</legend>
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={!customText && targetKB === p}
              onClick={() => {
                setTargetKB(p);
                setCustomText("");
              }}
              className={pill(!customText && targetKB === p)}
            >
              {p} KB
            </button>
          ))}
          <label className="ml-1 flex items-center gap-2 text-sm text-slate-800">
            Other
            <input
              type="number"
              inputMode="numeric"
              min={10}
              max={2000}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="KB"
              className={input}
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-800">
          <label className="flex items-center gap-2">
            Max width
            <input type="number" inputMode="numeric" min={1} value={maxW} onChange={(e) => setMaxW(e.target.value)} placeholder="px" className={input} />
          </label>
          <label className="flex items-center gap-2">
            Max height
            <input type="number" inputMode="numeric" min={1} value={maxH} onChange={(e) => setMaxH(e.target.value)} placeholder="px" className={input} />
          </label>
          <span className="text-xs text-slate-500">Optional. The picture is fitted inside, never stretched.</span>
        </div>
        <label className="flex min-h-[44px] w-fit items-center gap-3 text-sm text-slate-800">
          <input type="checkbox" checked={keepDims} onChange={(e) => setKeepDims(e.target.checked)} className="h-5 w-5 accent-[#0066cc]" />
          Keep original dimensions (only the quality is lowered, so it may fail on big photos)
        </label>
      </fieldset>

      {items.length > 0 && (
        <>
          <ul className="space-y-3">
            {items.map((it) => (
              <li key={it.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {it.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.url} alt={`Preview of ${it.file.name}`} className="h-full w-full object-cover" />
                  ) : it.status === "working" ? (
                    <div className="grid h-full place-items-center text-slate-500"><Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" /></div>
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="break-all text-sm font-semibold text-slate-900">{it.file.name}</p>
                  <p className="text-sm text-slate-600">
                    {it.status === "done" && it.blob ? (
                      <>
                        {kb(it.file.size)} KB to <strong className="text-slate-900">{kb(it.blob.size)} KB</strong>
                        {it.width && it.height ? `, ${it.width} x ${it.height} px` : ""}
                      </>
                    ) : it.status === "error" ? (
                      <span className="text-red-700">{it.error}</span>
                    ) : it.status === "working" ? (
                      "Working..."
                    ) : (
                      `${kb(it.file.size)} KB, waiting`
                    )}
                  </p>
                  {it.note && <p className="text-xs text-slate-500">{it.note}</p>}
                </div>
                <div className="flex gap-2">
                  {it.status === "done" && it.blob && (
                    <button type="button" onClick={() => downloadBlob(it.blob as Blob, fileName(it))} className={`${btn} border-[#0066cc] bg-[#0066cc] text-white hover:bg-[#005bb5]`}>
                      <Download size={18} aria-hidden="true" /> Download
                    </button>
                  )}
                  <button type="button" onClick={() => remove(it.id)} disabled={busy} aria-label={`Remove ${it.file.name}`} className={`${btn} border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50`}>
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-sm text-slate-600" aria-live="polite">{progress}</p>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={run} disabled={busy} className={`${btn} border-[#0066cc] bg-[#0066cc] text-white hover:bg-[#005bb5] disabled:cursor-wait disabled:opacity-60`}>
              {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : null}
              {busy ? "Working..." : doneCount ? "Resize again" : `Resize to under ${customText && Number(customText) ? Math.round(Number(customText)) : targetKB} KB`}
            </button>
            {doneCount > 1 && (
              <button type="button" onClick={downloadAll} className={`${btn} border-slate-300 bg-white text-slate-800 hover:bg-slate-50`}>
                <Download size={18} aria-hidden="true" /> Download all (ZIP)
              </button>
            )}
            <button type="button" onClick={clearAll} disabled={busy} className={`${btn} border-slate-300 bg-white text-slate-800 hover:bg-slate-50 disabled:opacity-50`}>
              <Trash2 size={18} aria-hidden="true" /> Clear
            </button>
          </div>
        </>
      )}
    </div>
  );
}
