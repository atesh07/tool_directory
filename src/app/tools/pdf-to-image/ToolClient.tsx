"use client";

import { beginWork, endWork } from "@/lib/crashGuard";

import ErrorNotice from "@/components/tools/ErrorNotice";
import PageThumb from "@/components/tools/PageThumb";
import UploadZone from "@/components/tools/UploadZone";
import { checkPdfFile, pdfErrorMessage } from "@/lib/pdfFiles";
import { downloadBlob } from "@/lib/download";
import { openPdf, prefetchPdfJs, renderPageToBlob } from "@/lib/pdfjs";

import { useRef, useState } from "react";
import { Download, CheckCircle2, Trash2 } from "lucide-react";

// A ZIP holds at most this many pages, so a long PDF never has to sit in memory all at once
const ZIP_PAGES = 100;

export default function ToolClient() {
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState("document");
  const [busy, setBusy] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // The open PDF. Page previews and images are drawn from it only when needed.
  const pdfRef = useRef<any>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setDone(null);
    const problem = await checkPdfFile(file);
    if (problem) {
      setError(problem);
      return;
    }
    setSourceName(file.name.replace(/\.pdf$/i, "") || "document");
    setLoading(true);
    beginWork();
    try {
      const pdf = await openPdf(file);
      pdfRef.current?.destroy?.();
      pdfRef.current = pdf;
      setPageCount(pdf.numPages);
    } catch (err) {
      setError(pdfErrorMessage(err));
    } finally {
      setLoading(false);
      endWork();
    }
  };

  // Full-size picture of one page: up to 2x, but never so large that the browser refuses to draw it
  const pageImage = (n: number) => renderPageToBlob(pdfRef.current, n, { scale: 2, maxSide: 4096, quality: 0.9 });

  const savePage = async (n: number) => {
    setBusy(`page-${n}`);
    setError(null);
    beginWork();
    try {
      downloadBlob(await pageImage(n), `${sourceName}_page-${n}.jpg`);
    } catch (err) {
      setError(pdfErrorMessage(err));
    } finally {
      setBusy(null);
      endWork();
    }
  };

  const saveRange = async (from: number, to: number) => {
    setError(null);
    setDone(null);
    beginWork();
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      for (let n = from; n <= to; n++) {
        setBusy(`Converting page ${n} of ${pageCount}...`);
        zip.file(`${sourceName}_page-${n}.jpg`, await pageImage(n));
      }
      setBusy("Packing the ZIP file...");
      // JPG pictures are already compressed, so they are stored as they are: faster and lighter on memory
      const blob = await zip.generateAsync({ type: "blob", compression: "STORE" });
      const suffix = pageCount > ZIP_PAGES ? `_pages-${from}-${to}` : "";
      downloadBlob(blob, `${sourceName}_images${suffix}.zip`);
      setDone(`${sourceName}_images${suffix}.zip was downloaded with ${to - from + 1} image${to === from ? "" : "s"}. Check your Downloads folder.`);
    } catch (err) {
      setError(
        /memory|allocation|canvas|range/i.test(String((err as Error)?.message ?? err))
          ? "Your device ran out of memory while converting. Try again with a smaller range, or save pages one by one."
          : pdfErrorMessage(err)
      );
    } finally {
      setBusy(null);
      endWork();
    }
  };

  const reset = () => {
    pdfRef.current?.destroy?.();
    pdfRef.current = null;
    setPageCount(0);
    setDone(null);
  };

  const retryPick = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const chunks = Array.from({ length: Math.ceil(pageCount / ZIP_PAGES) }, (_, i) => [i * ZIP_PAGES + 1, Math.min(pageCount, (i + 1) * ZIP_PAGES)] as const);

  return (
    <div className="space-y-8">
      <ErrorNotice message={error} onRetry={retryPick} retryLabel="Choose another file" onDismiss={() => setError(null)} />
      <ErrorNotice message={done} tone="success" onDismiss={() => setDone(null)} />
      {pageCount === 0 ? (
        <div className="max-w-3xl mx-auto">
          <UploadZone
            inputRef={fileInputRef}
            accept="application/pdf"
            noun="PDF"
            buttonLabel="Select PDF"
            hint="PDF files only, up to 150 MB. Every page becomes a JPG image."
            onFiles={(files) => handleFile(files[0])}
            onIntent={prefetchPdfJs}
            loading={loading}
            loadingText="Opening PDF..."
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 p-1.5 rounded-full text-white">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                </div>
                <p className="font-bold text-slate-700">{pageCount} page{pageCount === 1 ? "" : "s"} ready</p>
              </div>
              <button
                onClick={reset}
                disabled={!!busy}
                className="flex min-h-[48px] items-center gap-2 rounded-xl px-4 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" /> Start new
              </button>
            </div>

            <div className="flex flex-wrap gap-2" aria-busy={!!busy}>
              {chunks.map(([from, to]) => (
                <button
                  key={from}
                  onClick={() => (from === to && pageCount === 1 ? savePage(1) : saveRange(from, to))}
                  disabled={!!busy}
                  className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#0062cc] px-5 font-bold text-white hover:bg-[#0052ad] disabled:cursor-not-allowed disabled:bg-slate-300 sm:flex-none"
                >
                  <Download className="w-5 h-5" aria-hidden="true" />
                  {pageCount === 1
                    ? "Download image"
                    : chunks.length === 1
                      ? "Download all (ZIP)"
                      : `Pages ${from} to ${to} (ZIP)`}
                </button>
              ))}
            </div>
            {busy && !busy.startsWith("page-") && (
              <p role="status" className="text-sm font-medium text-slate-700">
                {busy}
              </p>
            )}
            {chunks.length > 1 && (
              <p className="text-sm text-slate-600">Long PDFs are packed in ZIP files of {ZIP_PAGES} pages, so your device does not run out of memory.</p>
            )}
          </div>

          {/* Previews are drawn only when they scroll into view */}
          <ol className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <li key={n} className="[content-visibility:auto] [contain-intrinsic-size:auto_260px] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="relative flex aspect-[3/4.2] items-center justify-center overflow-hidden bg-slate-100">
                  <PageThumb
                    pdf={pdfRef.current}
                    pageNumber={n}
                    scale={0.6}
                    alt={`Page ${n} as an image`}
                    className="flex h-full w-full items-center justify-center"
                    imgClassName="h-full w-full object-cover"
                    placeholderClassName="h-full w-full bg-slate-200 animate-pulse"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs font-bold text-white">Page {n}</span>
                </div>
                <button
                  onClick={() => savePage(n)}
                  disabled={!!busy}
                  aria-label={`Save page ${n} as a JPG image`}
                  className="flex min-h-[48px] items-center justify-center gap-2 border-t border-slate-200 text-sm font-bold text-[#0062cc] hover:bg-blue-50 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" aria-hidden="true" /> {busy === `page-${n}` ? "Preparing..." : "Save JPG"}
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
