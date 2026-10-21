"use client";

import ErrorNotice from "@/components/tools/ErrorNotice";
import { checkPdfFile, pdfErrorMessage } from "@/lib/pdfFiles";
import { downloadBlob } from "@/lib/download";

import { useState, useRef, useEffect } from "react";
import {
    Download,
    Trash2,
    RefreshCcw,
    Lock,
    XCircle,
    Undo2
} from "lucide-react";

export default function ToolClient() {
    const [file, setFile] = useState<File | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [deletedPages, setDeletedPages] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState("");
    const [isDragging, setIsDragging] = useState(false);
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

    const handleFile = async (selectedFile: File) => {
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
        const problem = await checkPdfFile(selectedFile);
        if (problem) {
            setError(problem);
            return;
        }

        setLoading(true);
        setFile(selectedFile);
        setDeletedPages(new Set());

        const reader = new FileReader();
        reader.onload = async function () {
            try {
                const typedarray = new Uint8Array(this.result as ArrayBuffer);
                const pdf = await pdfjsRef.current.getDocument({ data: typedarray }).promise;
                const imgs: string[] = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    setProgress(`Reading page ${i} of ${pdf.numPages}`);
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.0 }); // Slightly lower scale for faster render
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d")!;
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    await page.render({ canvasContext: context, viewport }).promise;
                    imgs.push(canvas.toDataURL("image/jpeg", 0.7));
                }

                setImages(imgs);
            } catch (err) {
                setError(pdfErrorMessage(err));
                setFile(null);
            } finally {
                setLoading(false);
                setProgress("");
            }
        };
        reader.onerror = () => {
            setError("The file could not be read. Please choose it again.");
            setFile(null);
            setLoading(false);
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const togglePageDeletion = (index: number) => {
        setDeletedPages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const processAndDownload = async () => {
        // Loaded only when needed, so the page itself stays small and fast
        const { PDFDocument } = await import("pdf-lib");
        if (!file) return;
        
        if (deletedPages.size === images.length) {
            setError("You cannot delete every page. Keep at least one page, or choose Reset selection.");
            return;
        }

        setLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            
            // Sort indices in descending order so removing a page doesn't shift the indices of subsequent pages to remove
            const indicesToRemove = Array.from(deletedPages).sort((a, b) => b - a);

            for (const index of indicesToRemove) {
                pdfDoc.removePage(index);
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
            downloadBlob(blob, `removed_pages_${file.name}`);
        } catch (err) {
            setError(`Could not remove the pages. ${pdfErrorMessage(err)}`);
        } finally {
            setLoading(false);
        }
    };

    const startNew = () => {
        setFile(null);
        setImages([]);
        setDeletedPages(new Set());
    };

    // Drag and drop events
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
            {!file ? (
                <div className="max-w-3xl mx-auto">
                    <div
                        onDragOver={onDragOver}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
              border-[2px] border-dashed p-10 md:p-14 text-center cursor-pointer 
              transition-all duration-300 group
              ${isDragging || loading
                                ? "border-[#0062cc] bg-blue-50/50"
                                : "border-slate-300 hover:border-[#0062cc] bg-white"}
            `}
                    >
                        <input
                            type="file"
                            accept="application/pdf"
                            ref={fileInputRef}
                            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                            className="hidden"
                        />

                        <div className="flex flex-col items-center justify-center space-y-4">
                            {loading ? (
                                <>
                                    <RefreshCcw className="w-10 h-10 animate-spin text-[#0062cc]" />
                                    <p className="text-xl font-medium text-slate-800">{progress || "Processing PDF..."}</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-slate-500 font-medium">Drop PDF file here or</p>
                                    <button className="bg-[#0062cc] hover:bg-[#0052ad] text-white text-lg font-bold py-3 px-12 rounded-lg transition-colors shadow-sm">
                                        Select PDF
                                    </button>
                                    <div className="mt-4 flex items-center justify-center text-sm text-slate-500 gap-1.5 pt-2">
                                        <Lock className="w-4 h-4" /> Your files are secure
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Action Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200 gap-4">
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-slate-700">{file.name}</span>
                            <span className="text-sm text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                {images.length} pages
                            </span>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                            <button
                                onClick={() => setDeletedPages(new Set())}
                                disabled={deletedPages.size === 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition shadow-sm font-medium text-sm
                                    ${deletedPages.size === 0 
                                        ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed" 
                                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                            >
                                <Undo2 className="w-4 h-4" /> Reset Selection
                            </button>
                            <button
                                onClick={startNew}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition shadow-sm font-medium text-sm ml-auto md:ml-2"
                            >
                                <Trash2 className="w-4 h-4" /> Discard File
                            </button>
                        </div>
                    </div>

                    {/* Information Banner */}
                    <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                        <Trash2 className="w-4 h-4" />
                        Click on the pages you want to remove. Selected pages will be excluded from the downloaded PDF.
                    </div>

                    {/* Grid of pages */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((img, index) => {
                            const isDeleted = deletedPages.has(index);
                            return (
                                <div 
                                    key={index} 
                                    onClick={() => togglePageDeletion(index)}
                                    className={`group flex flex-col items-center bg-white border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300
                                        ${isDeleted 
                                            ? "border-red-500 bg-red-50/30 scale-95 opacity-75" 
                                            : "border-slate-200 hover:shadow-xl hover:border-indigo-300"}`}
                                >
                                    {/* Image Container */}
                                    <div className="w-full aspect-auto flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden mb-3 relative shadow-sm border border-slate-100">
                                        <img
                                            src={img}
                                            alt={`Page ${index + 1}`}
                                            className={`max-w-full max-h-48 object-contain transition-all duration-300 ease-in-out
                                                ${isDeleted ? "grayscale sepia-[.3] hue-rotate-[-50deg] saturate-200" : ""}`}
                                        />

                                        {/* Status Overlay */}
                                        {isDeleted && (
                                            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center backdrop-blur-[1px]">
                                                <div className="bg-red-500 text-white rounded-full p-2 shadow-lg transform scale-110">
                                                    <XCircle className="w-8 h-8" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Page Badge */}
                                        <div className={`absolute top-2 left-2 text-white text-xs font-bold px-2.5 py-1 rounded-md z-10 transition-colors
                                            ${isDeleted ? "bg-red-600" : "bg-black/60"}`}>
                                            {index + 1}
                                        </div>
                                    </div>
                                    
                                    <span className={`font-medium text-sm transition-colors ${isDeleted ? "text-red-600 line-through" : "text-slate-600 group-hover:text-indigo-600"}`}>
                                        {isDeleted ? "Removed" : `Page ${index + 1}`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Download Button */}
                    <div className="pt-6 flex flex-col items-center justify-center gap-3">
                        {deletedPages.size === images.length && (
                            <p role="status" className="text-sm text-red-600 font-medium">
                                Every page is selected for removal. Keep at least one page to download.
                            </p>
                        )}
                        <button
                            onClick={processAndDownload}
                            disabled={loading || deletedPages.size === images.length}
                            className={`w-full max-w-md py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3
                ${loading || deletedPages.size === images.length
                                    ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                                    : "bg-[#0062cc] text-white hover:bg-[#0052ad] hover:shadow-blue-500/30"}`}
                        >
                            {loading ? (
                                <RefreshCcw className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Download className="w-6 h-6" />
                                    Download PDF {deletedPages.size > 0 && `(-${deletedPages.size} pages)`}
                                </>
                            )}
                        </button>
                        {deletedPages.size === images.length && images.length > 0 && (
                            <p className="text-red-500 text-sm font-medium">You cannot remove every page from the document.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
