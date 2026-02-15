"use client";

import { useState, useRef, useEffect } from "react";
// Note: If you don't have lucide-react, you can replace these with plain text or SVG
import { Upload, FileImage, Download, RefreshCcw, CheckCircle2 } from "lucide-react";

export default function ToolClient() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
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
    if (!pdfjsRef.current) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    setLoading(true);
    setImages([]);

    const reader = new FileReader();
    reader.onload = async function () {
      const typedarray = new Uint8Array(this.result as ArrayBuffer);
      const pdf = await pdfjsRef.current.getDocument({ data: typedarray }).promise;
      const imgs: string[] = [];
      
      setProgress({ current: 0, total: pdf.numPages });

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        imgs.push(canvas.toDataURL("image/jpeg", 0.9));
        setProgress(prev => ({ ...prev, current: i }));
      }

      setImages(imgs);
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-6 md:p-10">
      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-3 border-dashed rounded-3xl p-12 md:p-20 text-center cursor-pointer 
            transition-all duration-300 group
            ${loading ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-400 hover:bg-slate-50"}
          `}
        >
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            className="hidden"
          />

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {loading ? <RefreshCcw className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
            </div>

            {loading ? (
              <div className="space-y-3">
                <p className="text-xl font-bold text-slate-800">Converting Pages...</p>
                <p className="text-slate-500 font-medium tracking-tight">
                  {progress.current} / {progress.total} Completed
                </p>
                <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden mx-auto">
                   <div 
                    className="h-full bg-blue-600 transition-all duration-300" 
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                   />
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Click to Upload PDF</h3>
                <p className="text-slate-500">Each page will be converted into a high-quality JPG</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-green-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-700">{images.length} Pages Processed</p>
            </div>
            <button
              onClick={() => setImages([])}
              className="text-sm font-bold text-slate-500 hover:text-red-500 transition"
            >
              Start New Conversion
            </button>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, index) => (
              <div key={index} className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-[3/4] bg-slate-100 overflow-hidden relative">
                  <img
                    src={img}
                    alt={`Page ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a
                      href={img}
                      download={`page-${index + 1}.jpg`}
                      className="bg-white text-slate-900 p-3 rounded-full hover:bg-blue-600 hover:text-white transition shadow-lg"
                    >
                      <Download className="w-6 h-6" />
                    </a>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center bg-white border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <FileImage className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-600">Page {index + 1}</span>
                  </div>
                  <a
                    href={img}
                    download={`page-${index + 1}.jpg`}
                    className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition"
                  >
                    Download
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