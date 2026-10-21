"use client";

import { beginWork, endWork } from "@/lib/crashGuard";

import ErrorNotice from "@/components/tools/ErrorNotice";
import UploadZone from "@/components/tools/UploadZone";
import { checkImageFile } from "@/lib/pdfFiles";

import { useState, useRef } from "react";
import { 
  Upload, 
  X, 
  FileText, 
  Trash2, 
  Download, 
  Image as ImageIcon, 
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ToolClient() {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [progress, setProgress] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Upload Handler ---
  const handleImageUpload = async (picked: File[]) => {
    if (picked.length === 0) return;
    setError(null);
    setDone(null);
    const checks = await Promise.all(picked.map(checkImageFile));
    const problems = checks.filter((c): c is string => !!c);
    const newFiles = picked.filter((_, i) => !checks[i]);
    if (problems.length) setError(`${problems.join(" ")} Only JPG and PNG images up to 30 MB can be added.`);
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...newFiles]);
    setImageUrls((prev) => [...prev, ...newUrls]);
  };

  // Keyboard and touch friendly alternative to dragging
  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const nextImages = [...images];
    const nextUrls = [...imageUrls];
    [nextImages[index], nextImages[target]] = [nextImages[target], nextImages[index]];
    [nextUrls[index], nextUrls[target]] = [nextUrls[target], nextUrls[index]];
    setImages(nextImages);
    setImageUrls(nextUrls);
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
    setDone(null);
    imageUrls.forEach((url) => URL.revokeObjectURL(url));
    setImages([]);
    setImageUrls([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- PDF Generation ---
  const convertToPdf = async () => {
    if (images.length === 0) {
      setError("Add at least one JPG or PNG image first.");
      return;
    }
    setError(null);
    setLoading(true);
    beginWork();
    let current = "";
    try {
      // Loaded only when needed, so the page itself stays small and fast
      const jsPDF = (await import("jspdf")).default;
      const pdf = new jsPDF();
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;
      // About 300 dpi on A4; bigger pictures are scaled down so the PDF stays small and the tab does not run out of memory
      const MAX_PX = 3508;

      for (let i = 0; i < images.length; i++) {
        current = images[i].name;
        setProgress(`Adding image ${i + 1} of ${images.length}`);

        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const el = new Image();
          el.onload = () => resolve(el);
          el.onerror = () => reject(new Error("decode"));
          el.src = imageUrls[i];
        });

        // Drawing through a canvas applies the photo's rotation (phone photos) and the size limit
        const scale = Math.min(1, MAX_PX / Math.max(img.naturalWidth, img.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("canvas");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const isPng = /png/i.test(images[i].type);
        const data = canvas.toDataURL(isPng ? "image/png" : "image/jpeg", 0.92);

        const ratio = canvas.width / canvas.height;
        let w = maxWidth;
        let h = maxWidth / ratio;
        if (h > maxHeight) {
          h = maxHeight;
          w = maxHeight * ratio;
        }
        if (i > 0) pdf.addPage();
        pdf.addImage(data, isPng ? "PNG" : "JPEG", (pageWidth - w) / 2, (pageHeight - h) / 2, w, h);
      }

      current = "";
      pdf.save("converted-document.pdf");
      setDone(`converted-document.pdf was downloaded with ${images.length} page${images.length === 1 ? "" : "s"}. Check your Downloads folder.`);
    } catch (err) {
      setError(
        current
          ? `"${current}" could not be added. It may be damaged or too large for this browser.`
          : "Could not create the PDF. Please try fewer or smaller images."
      );
    } finally {
      setLoading(false);
      endWork();
      setProgress("");
    }
  };

  return (
    <div className="space-y-8">
      <ErrorNotice message={error} onDismiss={() => setError(null)} />
      <ErrorNotice message={done} tone="success" onRetry={clearAll} retryLabel="Convert more images" onDismiss={() => setDone(null)} />
      {/* Upload Area */}
      <div className="max-w-3xl mx-auto">
        <UploadZone
          accept="image/png,image/jpeg"
          multiple
          noun="images"
          buttonLabel={images.length ? "Add more images" : "Select Images"}
          hint="JPG and PNG images, up to 30 MB each. Large photos are scaled to print size automatically."
          onFiles={handleImageUpload}
          disabled={loading}
          inputRef={fileInputRef}
          compact={images.length > 0}
        />
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
              disabled={loading}
              className="flex min-h-[44px] items-center gap-1 rounded-lg px-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>

          <ol className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <li
                key={url}
                draggable={!loading}
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`relative flex flex-col overflow-hidden rounded-xl border-2 bg-slate-50 transition-all sm:cursor-grab
                  ${draggedIndex === index ? "opacity-50 border-indigo-400 scale-95" : "border-slate-200 hover:border-indigo-200 hover:shadow-md"}`}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                  <img src={url} alt="" className="h-full w-full object-cover pointer-events-none" />
                  <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs font-bold text-white">Page {index + 1}</span>
                  {/* Always visible so it works on touch screens and with a keyboard */}
                  <button
                    onClick={() => removeImage(index)}
                    disabled={loading}
                    aria-label={`Remove ${images[index]?.name ?? `image ${index + 1}`}`}
                    className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex flex-col gap-2 p-2">
                  <p className="truncate text-xs font-medium text-slate-700" title={images[index]?.name}>{images[index]?.name}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveImage(index, -1)}
                      disabled={index === 0 || loading}
                      aria-label={`Move ${images[index]?.name ?? `image ${index + 1}`} earlier`}
                      className="grid h-11 flex-1 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => moveImage(index, 1)}
                      disabled={index === images.length - 1 || loading}
                      aria-label={`Move ${images[index]?.name ?? `image ${index + 1}`} later`}
                      className="grid h-11 flex-1 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-center text-sm text-slate-500">
            Tip: use the arrows, or drag the pictures, to change the PDF page order.
          </p>
        </div>
      )}

      {/* Convert Button */}
      <div className="flex flex-col gap-3">
        <button
          onClick={convertToPdf}
          disabled={loading || images.length === 0}
          aria-busy={loading}
          className={`
            w-full min-h-[56px] py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-colors shadow-sm
            ${
              loading || images.length === 0
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-[#0066cc] hover:bg-[#005bb5] text-white"
            }
          `}
        >
          {loading ? (
            progress || "Converting..."
          ) : images.length === 0 ? (
            <>Add images to convert</>
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