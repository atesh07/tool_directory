"use client";

import ErrorNotice from "@/components/tools/ErrorNotice";
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
  const [isDragging, setIsDragging] = useState(false);
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

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const retryPick = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8">
      <ErrorNotice message={error} onRetry={retryPick} retryLabel="Choose another file" onDismiss={() => setError(null)} />
      {images.length === 0 ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => !loading && fileInputRef.current?.click()}
          className={`
            group border-2 border-dashed max-w-3xl mx-auto bg-white rounded-none py-16 px-10 text-center cursor-pointer 
            transition-all duration-300 shadow-sm
            ${isDragging || loading 
              ? "border-[#0066cc] bg-blue-50/30" 
              : "border-slate-300 hover:border-slate-400 hover:bg-slate-50/50"}
          `}
        >
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-5">
            {loading ? (
              <div className="space-y-4 w-full max-w-xs">
                <p className="text-xl font-bold text-slate-800">Processing Pages...</p>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-[#0066cc] transition-all duration-300" 
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                   />
                </div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
                  {progress.current} / {progress.total} Completed
                </p>
              </div>
            ) : (
              <>
                <p className="text-slate-500 text-sm">{isDragging ? "Drop to extract images" : "Drop PDF file here or"}</p>
                
                <div className="bg-[#0066cc] hover:bg-[#005bb5] text-white font-semibold text-lg py-3 px-12 rounded-lg transition-colors shadow-sm">
                  Select PDF
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 text-xs pt-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Your files are secure</span>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-1.5 rounded-full text-white">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="font-bold text-slate-700">{images.length} Pages Ready</p>
            </div>
            <button
              onClick={() => setImages([])}
              className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 transition"
            >
              <Trash2 className="w-4 h-4" /> Start New
            </button>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img, index) => (
              <div key={index} className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="aspect-[3/4.2] bg-slate-100 overflow-hidden relative">
                  <img
                    src={img}
                    alt={`Page ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a
                      href={img}
                      download={`page-${index + 1}.jpg`}
                      className="bg-white text-indigo-600 p-4 rounded-full hover:scale-110 transition shadow-2xl"
                    >
                      <Download className="w-6 h-6" />
                    </a>
                  </div>

                  {/* Page Badge */}
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-md">
                    PAGE {index + 1}
                  </div>
                </div>
                
                <div className="p-3 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-2">
                    <FileImage className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">JPG High-Res</span>
                  </div>
                  <a
                    href={img}
                    download={`page-${index + 1}.jpg`}
                    className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800"
                  >
                    Save
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}