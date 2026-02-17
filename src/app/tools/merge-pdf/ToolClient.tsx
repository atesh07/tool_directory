"use client";

import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";
import { 
  Upload, 
  X, 
  FileText, 
  Trash2, 
  Download, 
  FileCheck, 
  GripVertical,
  MousePointer2
} from "lucide-react";

// PDF.js Worker Configuration
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface PDFItem {
  id: string;
  file: File;
  preview: string;
}

export default function ToolClient() {
  const [items, setItems] = useState<PDFItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Generate Thumbnail ---
  const generateThumbnail = async (file: File): Promise<string> => {
    try {
      const data = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.4 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      if (context) {
        await page.render({ canvasContext: context, viewport }).promise;
        return canvas.toDataURL();
      }
    } catch (e) { console.error(e); }
    return "";
  };

  // --- Upload Handler ---
  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    setLoading(true);
    const validFiles = Array.from(files).filter(f => f.type === "application/pdf");
    
    const newItems = await Promise.all(
      validFiles.map(async (file) => ({
        id: crypto.randomUUID(),
        file,
        preview: await generateThumbnail(file)
      }))
    );

    setItems((prev) => [...prev, ...newItems]);
    setLoading(false);
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
  const clearAll = () => setItems([]);

  const mergePdfs = async () => {
    if (items.length < 2) return;
    setLoading(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const item of items) {
        const bytes = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(p => mergedPdf.addPage(p));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `merged_${Date.now()}.pdf`;
      a.click();
    } catch (err) {
      alert("Error merging. Ensure files aren't encrypted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div
        onDragOver={onDragContainer}
        onDragEnter={onDragContainer}
        onDragLeave={onDragContainer}
        onDrop={onDropContainer}
        onClick={() => fileInputRef.current?.click()}
        className={`group border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ease-in-out
          ${isDragging 
            ? "border-indigo-500 bg-indigo-100 scale-[1.01]" 
            : "border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400"}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf"
          multiple
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-5 bg-white rounded-2xl shadow-md transition-transform duration-500 
            ${isDragging ? "rotate-12 scale-110" : "group-hover:scale-110"}`}>
            {isDragging ? <MousePointer2 className="w-10 h-10 text-indigo-600" /> : <Upload className="w-10 h-10 text-indigo-600" />}
          </div>
          <div>
            <p className="text-xl font-bold text-slate-700">
              {isDragging ? "Release to upload" : "Click or drag PDFs here"}
            </p>
            <p className="text-slate-500 mt-1">Single or multiple files supported</p>
          </div>
        </div>
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
              className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleReorderStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleReorderDrop(index)}
                className={`relative group aspect-[3/4.2] rounded-2xl border-2 bg-slate-50 cursor-grab active:cursor-grabbing transition-all
                  ${draggedIndex === index 
                    ? "opacity-40 border-indigo-400 scale-95" 
                    : "border-transparent hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1"}`}
              >
                {/* PDF Thumbnail */}
                <div className="w-full h-full overflow-hidden rounded-xl">
                  {item.preview ? (
                    <img src={item.preview} alt="PDF Preview" className="w-full h-full object-cover pointer-events-none" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-12 h-12 text-slate-200" />
                    </div>
                  )}
                </div>

                {/* Badge & Icons */}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-black px-2 py-1 rounded-md backdrop-blur-sm">
                  #{index + 1}
                </div>
                <div className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <GripVertical className="w-4 h-4 text-slate-600" />
                </div>

                {/* Remove Action */}
                <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(item.id); }}
                    className="bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 shadow-xl transform hover:scale-110 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Filename label */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                   <p className="text-[10px] text-white font-medium truncate px-1">{item.file.name}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-6 font-medium tracking-wide italic">
            Tip: Drag and drop cards to change the merge sequence.
          </p>
        </div>
      )}

      {/* Convert Button */}
      <div className="pt-4">
        <button
          onClick={mergePdfs}
          disabled={items.length < 2 || loading}
          className={`w-full py-5 rounded-[2rem] font-black text-xl shadow-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3
            ${items.length < 2 || loading
              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-95 hover:shadow-indigo-500/40 hover:-translate-y-0.5"}`}
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Download className="w-6 h-6" />
              Merge {items.length} PDF Files
            </>
          )}
        </button>
      </div>
    </div>
  );
}