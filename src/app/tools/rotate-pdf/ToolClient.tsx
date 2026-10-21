"use client";

import ErrorNotice from "@/components/tools/ErrorNotice";
import { checkPdfFile, pdfErrorMessage } from "@/lib/pdfFiles";
import { downloadBlob } from "@/lib/download";

import { useState, useRef, useEffect } from "react";
import {
    Upload,
    Download,
    Trash2,
    MousePointer2,
    RefreshCcw,
    RotateCcw,
    RotateCw,
    Lock
} from "lucide-react";

export default function ToolClient() {
    const [file, setFile] = useState<File | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [rotations, setRotations] = useState<number[]>([]);
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

        const reader = new FileReader();
        reader.onload = async function () {
            try {
                const typedarray = new Uint8Array(this.result as ArrayBuffer);
                const pdf = await pdfjsRef.current.getDocument({ data: typedarray }).promise;
                const imgs: string[] = [];
                const rots: number[] = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    setProgress(`Reading page ${i} of ${pdf.numPages}`);
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d")!;
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    await page.render({ canvasContext: context, viewport }).promise;
                    imgs.push(canvas.toDataURL("image/jpeg", 0.8));
                    rots.push(0);
                }

                setImages(imgs);
                setRotations(rots);
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

    const rotateAllLeft = () => {
        setRotations(prev => prev.map(r => (r - 90 + 360) % 360));
    };

    const rotateAllRight = () => {
        setRotations(prev => prev.map(r => (r + 90) % 360));
    };

    const rotatePageLeft = (index: number) => {
        setRotations(prev => {
            const newRots = [...prev];
            newRots[index] = (newRots[index] - 90 + 360) % 360;
            return newRots;
        });
    };

    const rotatePageRight = (index: number) => {
        setRotations(prev => {
            const newRots = [...prev];
            newRots[index] = (newRots[index] + 90) % 360;
            return newRots;
        });
    };

    const processAndDownload = async () => {
        // Loaded only when needed, so the page itself stays small and fast
        const { PDFDocument, degrees } = await import("pdf-lib");
        if (!file) return;
        setLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();

            for (let i = 0; i < pages.length; i++) {
                if (rotations[i] !== 0) {
                    const currentPage = pages[i];
                    const currentRotation = currentPage.getRotation().angle;
                    currentPage.setRotation(degrees(currentRotation + rotations[i]));
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
            downloadBlob(blob, `rotated_${file.name}`);
        } catch (err) {
            setError(`Could not rotate this PDF. ${pdfErrorMessage(err)}`);
        } finally {
            setLoading(false);
        }
    };

    const startNew = () => {
        setFile(null);
        setImages([]);
        setRotations([]);
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
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                            <button
                                onClick={rotateAllLeft}
                                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-sm font-medium text-sm"
                            >
                                <RotateCcw className="w-4 h-4" /> All Left
                            </button>
                            <button
                                onClick={rotateAllRight}
                                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-sm font-medium text-sm"
                            >
                                <RotateCw className="w-4 h-4" /> All Right
                            </button>
                            <button
                                onClick={startNew}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition shadow-sm font-medium text-sm ml-auto md:ml-2"
                            >
                                <Trash2 className="w-4 h-4" /> Discard
                            </button>
                        </div>
                    </div>

                    {/* Grid of pages */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((img, index) => (
                            <div key={index} className="group flex flex-col items-center bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-xl transition-all duration-300">

                                {/* Image Container */}
                                <div className="w-full aspect-square flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden mb-4 relative shadow-sm border border-slate-100">
                                    <img
                                        src={img}
                                        alt={`Page ${index + 1}`}
                                        className="max-w-full max-h-full transition-transform duration-300 ease-in-out"
                                        style={{ transform: `rotate(${rotations[index]}deg)` }}
                                    />

                                    {/* Page Badge */}
                                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-md z-10">
                                        {index + 1}
                                    </div>
                                </div>

                                {/* Individual Rotate Controls */}
                                <div className="flex items-center justify-center gap-4 w-full">
                                    <button
                                        onClick={() => rotatePageLeft(index)}
                                        className="p-2.5 rounded-full bg-slate-100 hover:bg-[#0062cc] text-slate-600 hover:text-white transition-colors"
                                        title="Rotate Left"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => rotatePageRight(index)}
                                        className="p-2.5 rounded-full bg-slate-100 hover:bg-[#0062cc] text-slate-600 hover:text-white transition-colors"
                                        title="Rotate Right"
                                    >
                                        <RotateCw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Download Button */}
                    <div className="pt-6 flex justify-center">
                        <button
                            onClick={processAndDownload}
                            disabled={loading}
                            className={`w-full max-w-md py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3
                ${loading
                                    ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                                    : "bg-[#0062cc] text-white hover:bg-[#0052ad] hover:shadow-blue-500/30"}`}
                        >
                            {loading ? (
                                <RefreshCcw className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Download className="w-6 h-6" />
                                    Download Rotated PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
