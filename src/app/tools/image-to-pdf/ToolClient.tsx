"use client";

import { useState, useRef } from "react";
import jsPDF from "jspdf";
import { 
  Upload, 
  X, 
  FileText, 
  Trash2, 
  Download, 
  Image as ImageIcon, 
  GripVertical 
} from "lucide-react";

export default function ToolClient() {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Upload Handler ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));

      setImages((prev) => [...prev, ...newFiles]);
      setImageUrls((prev) => [...prev, ...newUrls]);
    }
  };

  // --- Drag & Drop Handlers ---
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    // Create copies of arrays
    const newImages = [...images];
    const newUrls = [...imageUrls];

    // Remove the item from the old position
    const [movedImage] = newImages.splice(draggedIndex, 1);
    const [movedUrl] = newUrls.splice(draggedIndex, 1);

    // Insert at the new position
    newImages.splice(dropIndex, 0, movedImage);
    newUrls.splice(dropIndex, 0, movedUrl);

    // Update state
    setImages(newImages);
    setImageUrls(newUrls);
    setDraggedIndex(null);
  };

  // --- Remove Specific Image ---
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newUrls = [...imageUrls];

    URL.revokeObjectURL(newUrls[index]); // Cleanup memory
    newImages.splice(index, 1);
    newUrls.splice(index, 1);

    setImages(newImages);
    setImageUrls(newUrls);
  };

  // --- Clear All ---
  const clearAll = () => {
    imageUrls.forEach((url) => URL.revokeObjectURL(url));
    setImages([]);
    setImageUrls([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- PDF Generation ---
  const convertToPdf = async () => {
    if (images.length === 0) {
      alert("File is empty! Please upload images first.");
      return;
    }

    setLoading(true);
    const pdf = new jsPDF();
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    for (let i = 0; i < images.length; i++) {
      const imgUrl = imageUrls[i];

      // Load image to get dimensions
      const imgProps = await new Promise<{
        width: number;
        height: number;
        ratio: number;
      }>((resolve) => {
        const img = new Image();
        img.src = imgUrl;
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height,
            ratio: img.width / img.height,
          });
        };
      });

      // Calculate PDF dimensions
      let pdfImgWidth = maxWidth;
      let pdfImgHeight = maxWidth / imgProps.ratio;

      if (pdfImgHeight > maxHeight) {
        pdfImgHeight = maxHeight;
        pdfImgWidth = maxHeight * imgProps.ratio;
      }

      const xOffset = (pageWidth - pdfImgWidth) / 2;
      const yOffset = (pageHeight - pdfImgHeight) / 2;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgUrl, "JPEG", xOffset, yOffset, pdfImgWidth, pdfImgHeight);
    }

    pdf.save("converted-document.pdf");
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="group border-3 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400 rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 ease-in-out"
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/jpg"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-white rounded-full shadow-md group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-700">
              Click to upload or drag images here
            </p>
            <p className="text-slate-500 mt-1 text-sm">
              JPG, PNG supported
            </p>
          </div>
        </div>
      </div>

      {/* Draggable Grid */}
      {images.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-500" />
              Rearrange Images ({images.length})
            </h3>
            <button
              onClick={clearAll}
              className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`
                  relative group aspect-[3/4] rounded-xl overflow-hidden border-2 bg-slate-50 cursor-grab active:cursor-grabbing transition-all
                  ${
                    draggedIndex === index
                      ? "opacity-50 border-indigo-400 scale-95"
                      : "border-transparent hover:border-indigo-200 hover:shadow-md"
                  }
                `}
              >
                {/* Image */}
                <img
                  src={url}
                  alt={`Page ${index + 1}`}
                  className="w-full h-full object-cover pointer-events-none"
                />

                {/* Page Number Badge */}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                  Page {index + 1}
                </div>

                {/* Drag Handle Icon (Visual Cue) */}
                <div className="absolute top-2 right-2 p-1 bg-white/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-slate-600" />
                </div>

                {/* Remove Button Overlay */}
                <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent drag start when clicking remove
                      removeImage(index);
                    }}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">
            Tip: Drag and drop images to change the PDF page order.
          </p>
        </div>
      )}

      {/* Convert Button */}
      <div className="flex flex-col gap-3">
        <button
          onClick={convertToPdf}
          disabled={loading}
          className={`
            w-full py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]
            ${
              loading
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-95 hover:shadow-indigo-500/25"
            }
          `}
        >
          {loading ? (
            "Converting..."
          ) : (
            <>
              <Download className="w-6 h-6" />
              Convert to PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
}