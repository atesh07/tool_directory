"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Upload, 
  FileImage, 
  Download, 
  RefreshCcw, 
  CheckCircle2, 
  Trash2, 
  MousePointer2 
} from "lucide-react";

export default function ToolClient() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
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
    if (!pdfjsRef.current) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
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
      } catch (err) {
        alert("Error processing PDF. It might be password protected.");
      } finally {
        setLoading(false);
      }
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

  return (
    <div className="space-y-8">
      {images.length === 0 ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-3 border-dashed rounded-3xl p-12 md:p-20 text-center cursor-pointer 
            transition-all duration-300 group
            ${isDragging || loading 
              ? "border-indigo-500 bg-indigo-50/80" 
              : "border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50/50"}
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
            <div className={`w-20 h-20 bg-white shadow-lg text-indigo-600 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 
              ${isDragging ? "scale-110 rotate-6" : "group-hover:scale-110"}`}>
              {loading ? (
                <RefreshCcw className="w-10 h-10 animate-spin" />
              ) : isDragging ? (
                <MousePointer2 className="w-10 h-10" />
              ) : (
                <Upload className="w-10 h-10" />
              )}
            </div>

            {loading ? (
              <div className="space-y-4 w-full max-w-xs">
                <p className="text-xl font-bold text-slate-800">Processing Pages...</p>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-indigo-600 transition-all duration-300" 
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                   />
                </div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
                  {progress.current} / {progress.total} Completed
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  {isDragging ? "Drop to convert" : "Upload PDF to Image"}
                </h3>
                <p className="text-slate-500">Every page will become a high-quality JPG</p>
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