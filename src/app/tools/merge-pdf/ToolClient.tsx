"use client";

import { beginWork, endWork } from "@/lib/crashGuard";

import ErrorNotice from "@/components/tools/ErrorNotice";
import UploadZone from "@/components/tools/UploadZone";
import { checkPdfFile, pdfErrorMessage } from "@/lib/pdfFiles";
import { downloadBlob } from "@/lib/download";

import { useState, useRef } from "react";
import { 
  Upload, 
  X, 
  FileText, 
  Trash2, 
  Download, 
  FileCheck, 
  MousePointer2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// PDF.js is only needed once a file is added, and its worker is served from our own site (not a third-party CDN)
let pdfjsPromise: Promise<any> | null = null;
const loadPdfJs = () =>
  (pdfjsPromise ||= (async () => {
    const lib = await import("pdfjs-dist/build/pdf");
    const worker = await import("pdfjs-dist/build/pdf.worker.min.js");
    lib.GlobalWorkerOptions.workerSrc = worker.default;
    return lib;
  })());

interface PDFItem {
  id: string;
  file: File;
  preview: string;
}

export default function ToolClient() {
  const [items, setItems] = useState<PDFItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Generate Thumbnail (also proves the PDF can be read) ---
  const generateThumbnail = async (file: File): Promise<{ preview: string; problem?: string }> => {
    try {
      const data = await file.arrayBuffer();
      const pdfjs = await loadPdfJs();
      const pdf = await pdfjs.getDocument({ data }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.4 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      if (context) {
        await page.render({ canvasContext: context, viewport }).promise;
        return { preview: canvas.toDataURL() };
      }
      return { preview: "" };
    } catch (e) {
      console.error(e);
      return { preview: "", problem: pdfErrorMessage(e) };
    }
  };

  // --- Upload Handler ---
  const handleFileUpload = async (files: FileList | File[] | null) => {
    if (!files) return;
    setError(null);
    setDone(null);
    setLoading(true);
    beginWork();

    // Check every file first and say exactly which ones were left out and why
    const validFiles: File[] = [];
    const problems: string[] = [];
    for (const f of Array.from(files)) {
      const problem = await checkPdfFile(f);
      if (problem) problems.push(`"${f.name}": ${problem}`);
      else validFiles.push(f);
    }
    const checked = await Promise.all(
      validFiles.map(async (file) => ({ file, thumb: await generateThumbnail(file) }))
    );
    const newItems: PDFItem[] = [];
    for (const { file, thumb } of checked) {
      if (thumb.problem) problems.push(`"${file.name}": ${thumb.problem}`);
      else newItems.push({ id: crypto.randomUUID(), file, preview: thumb.preview });
    }
    if (problems.length) setError(`${problems.length === 1 ? "One file was" : `${problems.length} files were`} not added. ${problems.join(" ")}`);

    setItems((prev) => [...prev, ...newItems]);
    setLoading(false);
    endWork();
    // Allow choosing the same file again after it was removed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Reordering Handlers ---
  const handleReorderStart = (index: number) => setDraggedIndex(index);
  
  const handleReorderDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const newItems = [...items];
    const [movedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, movedItem);
    setItems(newItems);
    setDraggedIndex(null);
  };

  // Keyboard and touch friendly alternative to dragging
  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  };

  // --- Drag & Drop Container Handlers ---
  const onDragContainer = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else setIsDragging(false);
  };

  const onDropContainer = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // --- Actions ---
  const removeFile = (id: string) => setItems(prev => prev.filter(item => item.id !== id));
  const clearAll = () => {
    setItems([]);
    setDone(null);
  };

  const mergePdfs = async () => {
    if (items.length < 2) return;
    setError(null);
    setLoading(true);
    beginWork();
    let current = "";
    try {
      // Loaded only when needed, so the page itself stays small and fast
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();
      for (const item of items) {
        current = item.file.name;
        const bytes = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(p => mergedPdf.addPage(p));
      }
      current = "";
      const pdfBytes = await mergedPdf.save();
      const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
      new Uint8Array(pdfBuffer).set(pdfBytes);
      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      const name = `merged_${Date.now()}.pdf`;
      downloadBlob(blob, name);
      setDone(`${name} was downloaded with ${items.length} files combined. Check your Downloads folder.`);
    } catch (err) {
      setError(current ? `"${current}" could not be merged. ${pdfErrorMessage(err)}` : `Could not merge these files. ${pdfErrorMessage(err)}`);
    } finally {
      setLoading(false);
      endWork();
    }
  };

  return (
    <div className="space-y-8">
      <ErrorNotice message={error} onDismiss={() => setError(null)} />
      <ErrorNotice message={done} tone="success" onRetry={clearAll} retryLabel="Merge more files" onDismiss={() => setDone(null)} />
      {/* Upload Area */}
      <div className="max-w-3xl mx-auto">
        <UploadZone
          inputRef={fileInputRef}
          accept=".pdf,application/pdf"
          multiple
          noun="PDF files"
          buttonLabel={items.length ? "Add more PDFs" : "Select PDFs"}
          hint="PDF files only, up to 150 MB each. Add two or more. Password-protected PDFs cannot be merged."
          onFiles={handleFileUpload}
          loading={loading && !items.length}
          loadingText="Reading your PDFs..."
          disabled={loading}
          compact={items.length > 0}
        />
      </div>

      {/* Draggable Grid */}
      {items.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-500" />
              Document Order ({items.length})
            </h3>
            <button
              onClick={clearAll}
              disabled={loading}
              className="flex min-h-[44px] items-center gap-1 rounded-lg px-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>

          <ol className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item, index) => (
              <li
                key={item.id}
                draggable={!loading}
                onDragStart={() => handleReorderStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleReorderDrop(index)}
                className={`relative flex flex-col overflow-hidden rounded-2xl border-2 bg-slate-50 transition-all sm:cursor-grab
                  ${draggedIndex === index ? "opacity-40 border-indigo-400 scale-95" : "border-slate-200 hover:border-indigo-200 hover:shadow-lg"}`}
              >
                {/* PDF Thumbnail */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                  {item.preview ? (
                    <img src={item.preview} alt="" className="h-full w-full object-cover pointer-events-none" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FileText className="h-12 w-12 text-slate-300" aria-hidden="true" />
                    </div>
                  )}
                  <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs font-bold text-white">#{index + 1}</span>
                  {/* Always visible so it works on touch screens and with a keyboard */}
                  <button
                    onClick={() => removeFile(item.id)}
                    disabled={loading}
                    aria-label={`Remove ${item.file.name}`}
                    className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Name and order controls */}
                <div className="flex flex-col gap-2 p-2">
                  <p className="truncate text-xs font-medium text-slate-700" title={item.file.name}>{item.file.name}</p>
                  <div className="flex gap-2">
                  <button
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0 || loading}
                    aria-label={`Move ${item.file.name} earlier`}
                    className="grid h-11 flex-1 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 1)}
                    disabled={index === items.length - 1 || loading}
                    aria-label={`Move ${item.file.name} later`}
                    className="grid h-11 flex-1 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-center text-sm text-slate-500">
            Tip: use the arrows, or drag the cards, to change the merge order.
          </p>
        </div>
      )}

      {/* Convert Button */}
      <div className="pt-4">
        <button
          onClick={mergePdfs}
          disabled={items.length < 2 || loading}
          aria-busy={loading}
          className={`w-full min-h-[56px] py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-colors shadow-sm
            ${items.length < 2 || loading
              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-[#0066cc] hover:bg-[#005bb5] text-white"}`}
        >
          {loading ? (
            <>
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-white/30 border-t-white" aria-hidden="true" />
              Working...
            </>
          ) : items.length < 2 ? (
            <>Add {items.length === 0 ? "two or more PDFs" : "one more PDF"} to merge</>
          ) : (
            <>
              <Download className="w-6 h-6" aria-hidden="true" />
              Merge {items.length} PDF Files
            </>
          )}
        </button>
      </div>
    </div>
  );
}