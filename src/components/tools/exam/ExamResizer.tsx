"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, Loader2, Lock, RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import CropFrame, { FaceGuide } from "@/components/tools/CropFrame";
import ErrorNotice from "@/components/tools/ErrorNotice";
import UploadZone from "@/components/tools/UploadZone";
import { EXAM_GROUPS, type DocRule, type ExamRules } from "@/data/exam-specs";
import { beginWork, endWork } from "@/lib/crashGuard";
import { downloadBlob } from "@/lib/download";
import { canvasToJpeg, checkImage, sniffImage, withJpegDpi } from "@/lib/imageFile";
import { fitToRange, kbRangeToBytes, toKB } from "@/lib/imageResize";
import { kbRange } from "@/lib/examContent";
import { MAX_ZOOM, START_VIEW, clampView, photoHeight, prepareImage, releaseWork, renderFrame, type View, type Work } from "@/lib/photoFrame";

const MAX_MB = 15;
const PREVIEW_LONG = 480; // preview is drawn with this many pixels on its long side
const CUSTOM = "custom";

type Result = { url: string; blob: Blob; width: number; height: number; padded: boolean; name: string };
type Custom = { width: string; height: string; minKB: string; maxKB: string; kind: "photo" | "signature" };

const errorText = (e: unknown) => {
  const m = e instanceof Error ? e.message : "";
  if (m === "toosmall") return "This picture cannot be made small enough at the required size. Crop closer, use a plainer background, or check the size range.";
  if (m === "pixels") return "This picture is too large (over 100 megapixels) for the browser to handle.";
  if (m === "heic") return "This iPhone (HEIC) photo could not be converted. On the iPhone, share it as JPG (Most Compatible) and try again.";
  if (m === "loader") return "Part of the tool could not be loaded. Check your internet connection and try again.";
  if (e instanceof RangeError || /memory|allocation/i.test(m)) return "Your device ran out of memory. Close other tabs, or try a smaller photo.";
  return "This picture could not be read. It may be damaged, so try a different one.";
};

const today = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

/** Rule built from what the visitor typed in Custom size mode, or an explanation of what is wrong */
function customRule(c: Custom): DocRule | string {
  const width = Math.round(Number(c.width));
  const height = Math.round(Number(c.height));
  const minKB = Number(c.minKB || 0);
  const maxKB = Number(c.maxKB);
  if (!(width >= 50 && width <= 3000 && height >= 50 && height <= 3000)) return "Enter a width and height between 50 and 3000 pixels.";
  if (!(maxKB >= 2 && maxKB <= 5000)) return "Enter a maximum size between 2 and 5000 KB.";
  if (!(minKB >= 0 && minKB < maxKB * 0.95)) return "The minimum size must be smaller than the maximum.";
  return {
    id: c.kind,
    kind: c.kind,
    label: c.kind === "photo" ? "Photo" : "Signature",
    width,
    height,
    sizeText: `${width} x ${height} px`,
    minKB,
    maxKB,
    format: "JPG",
    verified: true,
  };
}

const btn =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066cc] disabled:cursor-wait disabled:opacity-60";
const primary = `${btn} border-[#0066cc] bg-[#0066cc] text-white hover:bg-[#005bb5]`;
const plain = `${btn} border-slate-300 bg-white text-slate-800 hover:bg-slate-50`;
const pill = (active: boolean) => `${btn} ${active ? "border-[#0066cc] bg-[#0066cc] text-white" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"}`;
const field = "mt-1 min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900";

const StepTitle = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0066cc] text-sm font-bold text-white" aria-hidden="true">{n}</span>
    {children}
  </h3>
);

export default function ExamResizer({ exams, initialExam = CUSTOM, initialDoc = "" }: { exams: ExamRules[]; initialExam?: string; initialDoc?: string }) {
  const [examSlug, setExamSlug] = useState(initialExam);
  const [docId, setDocId] = useState(initialDoc);
  const [custom, setCustom] = useState<Custom>({ width: "200", height: "230", minKB: "20", maxKB: "50", kind: "photo" });
  const [work, setWork] = useState<Work | null>(null);
  const [beforeUrl, setBeforeUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [view, setView] = useState<View>(START_VIEW);
  const [guides, setGuides] = useState(true);
  const [labelOn, setLabelOn] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const urls = useRef<{ before: string; result: string }>({ before: "", result: "" });

  const exam = exams.find((e) => e.slug === examSlug) ?? null;
  const doc = exam ? exam.docs.find((d) => d.id === docId) ?? exam.docs[0] : null;
  const custRule = useMemo(() => customRule(custom), [custom]);
  const rule: DocRule | null = exam ? doc : typeof custRule === "string" ? null : custRule;

  // Preview keeps the shape of the result but is drawn large enough to see the face
  const ps = rule ? PREVIEW_LONG / Math.max(rule.width, rule.height) : 1;
  const pw = rule ? Math.round(rule.width * ps) : 0;
  const pht = rule ? Math.round(rule.height * ps) : 0;
  const isPhoto = rule?.kind === "photo";
  const label = labelOn && isPhoto ? { name: name.trim(), date: date.trim() } : null;

  useEffect(() => setDate(today()), []);

  // Free the pictures when leaving the page
  useEffect(
    () => () => {
      if (urls.current.before) URL.revokeObjectURL(urls.current.before);
      if (urls.current.result) URL.revokeObjectURL(urls.current.result);
    },
    [],
  );
  useEffect(() => () => releaseWork(work), [work]);

  const clearResult = () => {
    if (urls.current.result) URL.revokeObjectURL(urls.current.result);
    urls.current.result = "";
    setResult(null);
    setStatus("");
  };

  // A new exam, document or size starts the framing again and turns the name strip on when the form needs it
  const ruleKey = rule ? `${examSlug}:${rule.id}:${rule.width}x${rule.height}` : "";
  useEffect(() => {
    clearResult();
    setView(START_VIEW);
    setLabelOn(!!rule?.nameDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruleKey]);

  const update = (fn: (v: View) => View) => {
    if (!work || !rule) return;
    setView((v) => clampView(fn(v), work, pw, photoHeight(pht, !!label)));
    if (result) clearResult();
  };

  const open = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError(null);
    clearResult();
    if (typeof HTMLCanvasElement === "undefined" || !HTMLCanvasElement.prototype.toBlob) {
      setError("This browser cannot edit pictures. Please update it, or use Chrome, Safari, Edge or Firefox.");
      return;
    }
    const problem = await checkImage(file, MAX_MB, { allowHeic: true });
    if (problem) {
      setError(problem);
      return;
    }
    setLoading("Opening photo...");
    beginWork();
    try {
      let source: Blob = file;
      let next: Work;
      if ((await sniffImage(file)) === "heic") {
        try {
          next = await prepareImage(file); // Safari reads HEIC by itself
        } catch {
          setLoading("Converting iPhone photo...");
          let heicTo: typeof import("heic-to").heicTo;
          try {
            heicTo = (await import("heic-to")).heicTo;
          } catch {
            throw new Error("loader");
          }
          try {
            source = await heicTo({ blob: file, type: "image/jpeg", quality: 0.92 });
          } catch {
            throw new Error("heic");
          }
          next = await prepareImage(source);
        }
      } else {
        next = await prepareImage(file);
      }
      if (urls.current.before) URL.revokeObjectURL(urls.current.before);
      urls.current.before = URL.createObjectURL(source);
      setBeforeUrl(urls.current.before);
      setFileName(file.name);
      setWork(next);
      setView(START_VIEW);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading("");
      endWork();
    }
  };

  const make = async () => {
    if (!work || !rule) return;
    setError(null);
    clearResult();
    setBusy(true);
    setStatus("Making the file...");
    beginWork();
    const canvas = document.createElement("canvas");
    let drawn = "";
    try {
      const { minBytes, maxBytes } = kbRangeToBytes(rule.minKB, rule.maxKB);
      const r = await fitToRange({
        width: rule.width,
        height: rule.height,
        minWidth: rule.minWidth,
        minHeight: rule.minHeight,
        minBytes,
        maxBytes,
        encode: async (w, h, q) => {
          // Draw once per size; only the quality changes between tries
          if (drawn !== `${w}x${h}`) {
            renderFrame(canvas, work, w, h, view, label);
            drawn = `${w}x${h}`;
          }
          return new Uint8Array(await (await canvasToJpeg(canvas, q)).arrayBuffer());
        },
      });
      let blob: Blob = new Blob([r.bytes as unknown as BlobPart], { type: "image/jpeg" });
      if (rule.dpi) blob = await withJpegDpi(blob, Math.round((rule.dpi * r.width) / rule.width));
      const kb = Math.round(toKB(blob.size));
      const base = exam ? `${exam.slug}-${rule.id}` : `${rule.id}-${r.width}x${r.height}`;
      urls.current.result = URL.createObjectURL(blob);
      setResult({ url: urls.current.result, blob, width: r.width, height: r.height, padded: r.padded, name: rule.fileName ?? `${base}-${kb}kb.jpg` });
      setStatus(`Done: ${r.width} x ${r.height} px, ${toKB(blob.size)} KB.`);
    } catch (e) {
      setStatus("");
      setError(errorText(e));
    } finally {
      canvas.width = 0;
      canvas.height = 0;
      setBusy(false);
      endWork();
    }
  };

  const sizeOk = result && rule ? result.blob.size >= rule.minKB * 1024 && result.blob.size <= rule.maxKB * 1000 : false;
  const dimsOk = result && rule ? result.width >= (rule.minWidth ?? rule.width) && result.width <= rule.width && result.height >= (rule.minHeight ?? rule.height) && result.height <= rule.height : false;
  const passes = sizeOk && dimsOk;

  return (
    <div className="space-y-5">
      <p className="flex items-start gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-900">
        <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Your photo is processed on this device only. It is never uploaded to any server.
      </p>
      <ErrorNotice message={error} onDismiss={() => setError(null)} />

      <StepTitle n={1}>Choose exam and document</StepTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-900">
          Exam
          <select value={examSlug} onChange={(e) => { setExamSlug(e.target.value); setDocId(""); }} className={field}>
            <option value={CUSTOM}>Custom size (any other form)</option>
            {EXAM_GROUPS.map((g) => {
              const list = exams.filter((e) => e.group === g.id);
              if (!list.length) return null;
              return (
                <optgroup key={g.id} label={g.name}>
                  {list.map((e) => (
                    <option key={e.slug} value={e.slug}>{e.name}</option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </label>
        {exam && (
          <fieldset>
            <legend className="text-sm font-semibold text-slate-900">Document</legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {exam.docs.map((d) => (
                <button key={d.id} type="button" aria-pressed={doc?.id === d.id} onClick={() => setDocId(d.id)} className={pill(doc?.id === d.id)}>
                  {d.label}
                </button>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      {!exam && (
        <fieldset className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-5">
          <legend className="px-2 text-sm font-semibold text-slate-900">Your form&apos;s rules</legend>
          <label className="col-span-2 text-sm text-slate-800 sm:col-span-1">
            Type
            <select value={custom.kind} onChange={(e) => setCustom({ ...custom, kind: e.target.value === "signature" ? "signature" : "photo" })} className={field}>
              <option value="photo">Photo</option>
              <option value="signature">Signature / other</option>
            </select>
          </label>
          {(
            [
              ["width", "Width (px)"],
              ["height", "Height (px)"],
              ["minKB", "Min size (KB)"],
              ["maxKB", "Max size (KB)"],
            ] as const
          ).map(([key, text]) => (
            <label key={key} className="text-sm text-slate-800">
              {text}
              <input type="number" inputMode="numeric" min={0} value={custom[key]} onChange={(e) => setCustom({ ...custom, [key]: e.target.value })} className={field} />
            </label>
          ))}
          {typeof custRule === "string" && <p className="col-span-2 text-sm text-red-700 sm:col-span-5">{custRule}</p>}
        </fieldset>
      )}

      {rule && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
          <p className="font-semibold text-slate-900">{exam ? `${exam.name} ${rule.label.toLowerCase()}` : "Your file"} will be made as:</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {[`${rule.width} x ${rule.height} px`, kbRange(rule), rule.format].map((c) => (
              <li key={c} className="rounded-full border border-[#0066cc]/30 bg-white px-3 py-1 font-semibold text-[#0066cc]">{c}</li>
            ))}
          </ul>
          {exam && !rule.verified && (
            <p className="mt-2 flex items-start gap-2 text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Not yet checked against the latest notification. Compare with the official rules before you upload.
            </p>
          )}
          {exam && (
            <details className="mt-2">
              <summary className="cursor-pointer py-2 font-medium text-[#0066cc]">Full rules for this {rule.label.toLowerCase()}</summary>
              <p>Size in the notification: {rule.sizeText}.{rule.minWidth ? ` Smallest accepted here: ${rule.minWidth} x ${rule.minHeight} px.` : ""}</p>
              {rule.background && <p className="mt-1">{rule.background}</p>}
              {rule.notes?.map((n) => (
                <p key={n} className="mt-1">{n}</p>
              ))}
              <p className="mt-2 text-xs text-slate-600">
                Rules last checked {exam.lastVerified}.{" "}
                <a href={exam.officialSourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[#0066cc] underline">
                  Official website
                </a>
              </p>
            </details>
          )}
        </div>
      )}

      <StepTitle n={2}>Add your {rule?.kind === "photo" || !rule ? "photo" : rule.label.toLowerCase()}</StepTitle>
      <UploadZone
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
        onFiles={open}
        buttonLabel={work ? "Choose another picture" : `Select ${rule?.kind === "photo" || !rule ? "photo" : rule.label.toLowerCase()}`}
        hint={`JPG, PNG, WebP or iPhone HEIC, up to ${MAX_MB} MB.`}
        noun="picture"
        compact={!!work}
        loading={!!loading}
        loadingText={loading}
        disabled={busy}
      />

      {work && rule && (
        <>
          <StepTitle n={3}>Fit it in the frame, then make the file</StepTitle>
          <div className="grid gap-6 md:grid-cols-[auto,1fr]">
            <div className={`mx-auto ${rule.width >= rule.height ? "w-full max-w-[340px]" : "w-[240px] sm:w-[280px]"}`}>
              <CropFrame
                work={work}
                view={view}
                label={label}
                width={pw}
                height={pht}
                onChange={update}
                overlay={guides && isPhoto ? <FaceGuide width={pw} height={pht} photoH={photoHeight(pht, !!label)} /> : null}
              />
              <p className="mt-2 text-center text-xs text-slate-500">Drag to move, pinch or scroll to zoom.</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                {isPhoto
                  ? "Put the top of the head on the upper line and the chin on the lower line. The face should fill most of the photo."
                  : "Zoom in so the signature or mark fills the box, with a little white space around it."}
              </p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => update((v) => ({ ...v, zoom: v.zoom / 1.1 }))} className={plain} aria-label="Zoom out">
                  <ZoomOut size={18} aria-hidden="true" />
                </button>
                <input type="range" min={1} max={MAX_ZOOM} step={0.01} value={view.zoom} onChange={(e) => update((v) => ({ ...v, zoom: Number(e.target.value) }))} aria-label="Zoom" className="h-11 min-w-0 flex-1 accent-[#0066cc]" />
                <button type="button" onClick={() => update((v) => ({ ...v, zoom: v.zoom * 1.1 }))} className={plain} aria-label="Zoom in">
                  <ZoomIn size={18} aria-hidden="true" />
                </button>
              </div>
              <details className="rounded-lg border border-slate-200 px-3">
                <summary className="cursor-pointer py-3 text-sm font-medium text-slate-800">More options: turn, straighten, brightness, contrast</summary>
                <div className="space-y-3 pb-3">
              {(
                [
                  ["tilt", "Straighten", -15, 15, 0.5, "°"],
                  ["light", "Brightness", -30, 40, 1, "%"],
                  ["contrast", "Contrast", -30, 50, 1, "%"],
                ] as const
              ).map(([key, text, min, max, step, unit]) => (
                <label key={key} className="block text-sm text-slate-800">
                  {text} ({view[key] > 0 ? "+" : ""}
                  {view[key]}
                  {unit})
                  <input type="range" min={min} max={max} step={step} value={view[key]} onChange={(e) => update((v) => ({ ...v, [key]: Number(e.target.value) }))} className="block h-11 w-full accent-[#0066cc]" />
                </label>
              ))}
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => update((v) => ({ ...v, turns: (v.turns + 1) % 4 }))} className={plain}>
                  <RotateCw size={18} aria-hidden="true" /> Turn 90°
                </button>
                <button type="button" onClick={() => update(() => START_VIEW)} className={plain}>
                  <RotateCcw size={18} aria-hidden="true" /> Reset
                </button>
              </div>
                </div>
              </details>
              {isPhoto && (
                <>
                  <label className="flex min-h-[44px] w-fit items-center gap-3 text-sm text-slate-800">
                    <input type="checkbox" checked={guides} onChange={(e) => setGuides(e.target.checked)} className="h-5 w-5 accent-[#0066cc]" />
                    Show face guide (not saved)
                  </label>
                  <label className="flex min-h-[44px] w-fit items-center gap-3 text-sm text-slate-800">
                    <input
                      type="checkbox"
                      checked={labelOn}
                      onChange={(e) => {
                        setLabelOn(e.target.checked);
                        setView((v) => clampView(v, work, pw, photoHeight(pht, e.target.checked)));
                        clearResult();
                      }}
                      className="h-5 w-5 accent-[#0066cc]"
                    />
                    Name and date on photo{rule.nameDate ? " (this form asks for it)" : ""}
                  </label>
                  {labelOn && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="text-sm text-slate-800">
                        Name
                        <input value={name} maxLength={40} onChange={(e) => { setName(e.target.value); clearResult(); }} placeholder="Your name" className={field} />
                      </label>
                      <label className="text-sm text-slate-800">
                        Date photo was taken
                        <input value={date} maxLength={20} onChange={(e) => { setDate(e.target.value); clearResult(); }} placeholder="DD/MM/YYYY" className={field} />
                      </label>
                    </div>
                  )}
                </>
              )}
              <button type="button" onClick={make} disabled={busy} className={`${primary} w-full sm:w-auto`}>
                {busy && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
                {busy ? "Working..." : `Make ${kbRange(rule)} file`}
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-700" aria-live="polite">{status}</p>

          {result && (
            <section aria-label="Result" className="space-y-4 rounded-xl border border-slate-200 p-4">
              <div className="grid grid-cols-2 gap-4">
                <figure className="text-center">
                  <div className="flex h-40 items-center justify-center rounded-lg bg-slate-100 p-2">
                    <img src={beforeUrl} alt={`Original picture ${fileName}`} className="max-h-full max-w-full object-contain" />
                  </div>
                  <figcaption className="mt-1 text-xs text-slate-600">Before</figcaption>
                </figure>
                <figure className="text-center">
                  <div className="flex h-40 items-center justify-center rounded-lg bg-slate-100 p-2">
                    <img src={result.url} alt={`Resized ${rule.label.toLowerCase()}, ${result.width} by ${result.height} pixels`} className="max-h-full max-w-full object-contain" />
                  </div>
                  <figcaption className="mt-1 text-xs text-slate-600">
                    After: {result.width} x {result.height} px, {toKB(result.blob.size)} KB
                  </figcaption>
                </figure>
              </div>
              {passes ? (
                <p className="flex items-start gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-800">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  {exam ? `Meets ${exam.name} ${rule.label.toLowerCase()} requirements` : "Meets your size rules"}: {rule.format}, {result.width} x {result.height} px, {toKB(result.blob.size)} KB (allowed {kbRange(rule)})
                </p>
              ) : (
                <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  The file is outside the allowed range. Try a closer crop or a plainer background.
                </p>
              )}
              {result.padded && <p className="text-xs text-slate-600">The picture was very simple, so empty data was added to reach the minimum size. The picture itself is unchanged.</p>}
              {exam && !rule.verified && <p className="text-xs text-amber-800">These rules are not yet checked against the latest notification. Confirm the size and KB range on the official website.</p>}
              <button type="button" onClick={() => downloadBlob(result.blob, result.name)} className={primary}>
                <Download size={18} aria-hidden="true" /> Download {result.name}
              </button>
            </section>
          )}
        </>
      )}
    </div>
  );
}
