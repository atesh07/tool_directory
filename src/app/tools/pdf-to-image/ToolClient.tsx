"use client";

import ErrorNotice from "@/components/tools/ErrorNotice";
import UploadZone from "@/components/tools/UploadZone";
import { downloadBlob } from "@/lib/download";
import { checkPdfFile, pdfErrorMessage } from "@/lib/pdfFiles";

import { useState, useRef, useEffect } from "react";
import { 
  Upload, 
  FileImage, 
  Download, 
  RefreshCcw, 
  CheckCircle2, 
  Trash2, 
  MousePointer2,
  Lock 
} from "lucide-react";

export default function ToolClient() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState("document");
  const [zipping, setZipping] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfjsRef = useRef<any>(null);

  useEffect(() => {
    const loadPdfJs = async () => {
      const pdfjsLib = await import("pdfjs-dist/build/pdf");
      const worker = await import("pdfjs-dist/build/pdf.worker.min.js");
      pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default;
      pdfjsRef.current = pdfjsLib;
    };
    loadPdfJs();
  }, []);

  const handleFile = async (file: File) => {
    setError(null);
    // The PDF reader loads in the background; wait for it instead of ignoring the file
    let waited = 0;
    while (!pdfjsRef.current && waited < 100) {
      await new Promise((r) => setTimeout(r, 100));
      waited++;
    }
    if (!pdfjsRef.current) {
      setError("The PDF reader is still loading. Please try again in a moment.");
      return;
    }
    const problem = await checkPdfFile(file);
    if (problem) {
      setError(problem);
      return;
    }

    setDone(null);
    setSourceName(file.name.replace(/\.pdf$/i, "") || "document");
    setLoading(true);
    setImages([]);

    const reader = new FileReader();
    reader.onload = async function () {
      try {
        const typedarray = new Uint8Array(this.result as ArrayBuffer);
        const pdf = await pdfjsRef.current.getDocument({ data: typedarray }).promise;
        const imgs: string[] = [];
        
        setProgress({ current: 0, total: pdf.numPages });

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          // 2x for sharp images, but never so large that the browser refuses to draw the page
          const base = page.getViewport({ scale: 1 });
          const scale = Math.min(2, 4096 / Math.max(base.width, base.height));
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;
          imgs.push(canvas.toDataURL("image/jpeg", 0.9));
          setProgress(prev => ({ ...prev, current: i }));
        }

        setImages(imgs);
      } catch (err) {
        setError(pdfErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError("The file could not be read. Please choose it again.");
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };



  const downloadAll = async () => {
    setZipping(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      images.forEach((img, i) => zip.file(`${sourceName}_page-${i + 1}.jpg`, img.split(",")[1], { base64: true }));
      downloadBlob(await zip.generateAsync({ type: "blob" }), `${sourceName}_images.zip`);
      setDone(`${sourceName}_images.zip was downloaded with ${images.length} image${images.length === 1 ? "" : "s"}. Check your Downloads folder.`);
    } catch {
      setError("The images could not be zipped. Please save the pages one by one instead.");
    } finally {
      setZipping(false);
    }
  };

  const retryPick = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8">
      <ErrorNotice message={error} onRetry={retryPick} retryLabel="Choose another file" onDismiss={() => setError(null)} />
      <ErrorNotice message={done} tone="success" onDismiss={() => setDone(null)} />
      {images.length === 0 ? (
        <div className="max-w-3xl mx-auto">
          <UploadZone
            inputRef={fileInputRef}
            accept="application/pdf"
            noun="PDF"
            buttonLabel="Select PDF"
            hint="PDF files only, up to 150 MB. Every page becomes a JPG image."
            onFiles={(files) => handleFile(files[0])}
            loading={loading}
            loadingText={progress.total ? `Converting page ${Math.min(progress.current + 1, progress.total)} of ${progress.total}...` : "Reading PDF..."}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-1.5 rounded-full text-white">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              </div>
              <p className="font-bold text-slate-700">{images.length} page{images.length === 1 ? "" : "s"} ready</p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <button
                onClick={downloadAll}
                disabled={zipping}
                aria-busy={zipping}
                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#0062cc] px-5 font-bold text-white hover:bg-[#0052ad] disabled:cursor-not-allowed disabled:bg-slate-300 sm:flex-none"
              >
                <Download className="w-5 h-5" aria-hidden="true" />
                {zipping ? "Zipping..." : images.length === 1 ? "Download image" : "Download all (ZIP)"}
              </button>
              <button
                onClick={() => {
                  setImages([]);
                  setDone(null);
                }}
                disabled={zipping}
                className="flex min-h-[48px] items-center gap-2 rounded-xl px-4 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" /> Start new
              </button>
            </div>
          </div>

          {/* Image Grid */}
          <ol className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {images.map((img, index) => (
              <li key={index} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="relative aspect-[3/4.2] overflow-hidden bg-slate-100">
                  <img src={img} alt={`Page ${index + 1} as an image`} className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs font-bold text-white">Page {index + 1}</span>
                </div>
                <a
                  href={img}
                  download={`${sourceName}_page-${index + 1}.jpg`}
                  aria-label={`Save page ${index + 1} as a JPG image`}
                  className="flex min-h-[48px] items-center justify-center gap-2 border-t border-slate-200 text-sm font-bold text-[#0062cc] hover:bg-blue-50"
                >
                  <Download className="w-4 h-4" aria-hidden="true" /> Save JPG
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
