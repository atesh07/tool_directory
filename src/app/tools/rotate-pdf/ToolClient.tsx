"use client";

import { beginWork, endWork } from "@/lib/crashGuard";

import ErrorNotice from "@/components/tools/ErrorNotice";
import PageThumb from "@/components/tools/PageThumb";
import { openPdf, prefetchPdfJs } from "@/lib/pdfjs";
import UploadZone from "@/components/tools/UploadZone";
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
    const [done, setDone] = useState<string | null>(null);
    const [progress, setProgress] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    // The open PDF. Page previews are drawn from it only when they scroll into view.
    const pdfRef = useRef<any>(null);

    const handleFile = async (selectedFile: File) => {
        setError(null);
        setDone(null);
        const problem = await checkPdfFile(selectedFile);
        if (problem) {
            setError(problem);
            return;
        }

        setLoading(true);
        beginWork();
        setFile(selectedFile);

        setProgress("Opening PDF...");
        try {
            const pdf = await openPdf(selectedFile);
            pdfRef.current?.destroy?.();
            pdfRef.current = pdf;
            // One empty slot per page; the previews are drawn later, as they scroll into view
            setImages(new Array(pdf.numPages).fill(""));
            setRotations(new Array(pdf.numPages).fill(0));
        } catch (err) {
            setError(pdfErrorMessage(err));
            setFile(null);
        } finally {
            setLoading(false);
            endWork();
            setProgress("");
        }
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
        if (!file) return;
        setLoading(true);
        beginWork();
        try {
            // Loaded only when needed, so the page itself stays small and fast
            const { PDFDocument, degrees } = await import("pdf-lib");
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
            setDone(`rotated_${file.name} was downloaded. Check your Downloads folder.`);
        } catch (err) {
            setError(`Could not rotate this PDF. ${pdfErrorMessage(err)}`);
        } finally {
            setLoading(false);
            endWork();
        }
    };

    const startNew = () => {
        pdfRef.current?.destroy?.();
        pdfRef.current = null;
        setDone(null);
        setError(null);
        setFile(null);
        setImages([]);
        setRotations([]);
    };



    const retryPick = () => {
        setError(null);
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-8">
            <ErrorNotice message={error} onRetry={retryPick} retryLabel="Choose another file" onDismiss={() => setError(null)} />
            <ErrorNotice message={done} tone="success" onRetry={startNew} retryLabel="Rotate another PDF" onDismiss={() => setDone(null)} />
            {!file ? (
                <div className="max-w-3xl mx-auto">
                    <UploadZone
                        inputRef={fileInputRef}
                        accept="application/pdf"
                        noun="PDF"
                        buttonLabel="Select PDF"
                        hint="PDF files only, up to 150 MB. Password-protected PDFs cannot be opened."
                        onFiles={(files) => handleFile(files[0])}
                        onIntent={prefetchPdfJs}
                        loading={loading}
                        loadingText={progress || "Processing PDF..."}
                    />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Action Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200 gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="truncate font-semibold text-slate-700">{file.name}</span>
                            <span className="shrink-0 rounded border border-slate-200 bg-white px-2 py-1 text-sm text-slate-500">{images.length} page{images.length === 1 ? "" : "s"}</span>
                        </div>

                        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
                            <button
                                onClick={rotateAllLeft}
                                disabled={loading}
                                className="flex min-h-[44px] items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-sm font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <RotateCcw className="w-4 h-4" /> All Left
                            </button>
                            <button
                                onClick={rotateAllRight}
                                disabled={loading}
                                className="flex min-h-[44px] items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-sm font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <RotateCw className="w-4 h-4" /> All Right
                            </button>
                            <button
                                onClick={startNew}
                                disabled={loading}
                                className="flex min-h-[44px] items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition shadow-sm font-medium text-sm ml-auto md:ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 className="w-4 h-4" /> Discard
                            </button>
                        </div>
                    </div>

                    {/* Grid of pages */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((img, index) => (
                            <div key={index} className="[content-visibility:auto] [contain-intrinsic-size:auto_260px] group flex flex-col items-center bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-xl transition-all duration-300">

                                {/* Image Container */}
                                <div className="w-full aspect-square flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden mb-4 relative shadow-sm border border-slate-100">
                                    <PageThumb
                                        pdf={pdfRef.current}
                                        pageNumber={index + 1}
                                        scale={0.9}
                                        alt={`Page ${index + 1} preview`}
                                        className="flex h-full w-full items-center justify-center"
                                        imgClassName="max-w-full max-h-full transition-transform duration-300 ease-in-out"
                                        imgStyle={{ transform: `rotate(${rotations[index]}deg)` }}
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
                                        disabled={loading}
                                        aria-label={`Rotate page ${index + 1} left`}
                                        className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 hover:bg-[#0062cc] text-slate-600 hover:text-white transition-colors disabled:opacity-50"
                                        title="Rotate left"
                                    >
                                        <RotateCcw className="w-5 h-5" aria-hidden="true" />
                                    </button>
                                    <button
                                        onClick={() => rotatePageRight(index)}
                                        disabled={loading}
                                        aria-label={`Rotate page ${index + 1} right`}
                                        className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 hover:bg-[#0062cc] text-slate-600 hover:text-white transition-colors disabled:opacity-50"
                                        title="Rotate right"
                                    >
                                        <RotateCw className="w-5 h-5" aria-hidden="true" />
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
                            aria-busy={loading}
                            className={`w-full max-w-md min-h-[56px] py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3
                ${loading
                                    ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                                    : "bg-[#0062cc] text-white hover:bg-[#0052ad] hover:shadow-blue-500/30"}`}
                        >
                            {loading ? (
                                <>
                                    <RefreshCcw className="w-6 h-6 animate-spin" aria-hidden="true" />
                                    Preparing your PDF...
                                </>
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
