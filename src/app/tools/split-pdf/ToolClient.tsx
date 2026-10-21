"use client";

import ErrorNotice from "@/components/tools/ErrorNotice";
import UploadZone from "@/components/tools/UploadZone";
import { checkPdfFile, pdfErrorMessage } from "@/lib/pdfFiles";
import { downloadBlob } from "@/lib/download";

import { useState, useRef, useEffect, useMemo } from "react";
import {
    Download,
    Trash2,
    RefreshCcw,
    Lock,
    Scissors
} from "lucide-react";

type SplitMode = "ranges" | "every" | "fixed";

const GROUP_COLORS = [
    "bg-indigo-600",
    "bg-emerald-600",
    "bg-amber-600",
    "bg-rose-600",
    "bg-sky-600",
    "bg-purple-600",
];

// Parses input like "1-3, 5, 8-10" into zero-based page index groups
function parseRanges(input: string, numPages: number): { groups: number[][]; error: string | null } {
    const parts = input.split(",").map(p => p.trim()).filter(Boolean);
    if (parts.length === 0) return { groups: [], error: "Enter at least one page range." };

    const groups: number[][] = [];
    for (const part of parts) {
        const match = part.match(/^(\d+)\s*(?:-\s*(\d+))?$/);
        if (!match) return { groups: [], error: `"${part}" is not a valid range.` };

        const start = parseInt(match[1], 10);
        const end = match[2] ? parseInt(match[2], 10) : start;
        if (start < 1 || end > numPages || start > end) {
            return { groups: [], error: `"${part}" is outside pages 1-${numPages}.` };
        }

        const group: number[] = [];
        for (let i = start; i <= end; i++) group.push(i - 1);
        groups.push(group);
    }
    return { groups, error: null };
}

export default function ToolClient() {
    const [file, setFile] = useState<File | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [mode, setMode] = useState<SplitMode>("ranges");
    const [rangeInput, setRangeInput] = useState("");
    const [chunkSize, setChunkSize] = useState(2);
    const [loading, setLoading] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const [done, setDone] = useState<string | null>(null);
    const [progress, setProgress] = useState("");
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

    const numPages = images.length;

    const { groups, error } = useMemo(() => {
        if (numPages === 0) return { groups: [] as number[][], error: null };
        if (mode === "every") {
            return { groups: images.map((_, i) => [i]), error: null };
        }
        if (mode === "fixed") {
            if (!Number.isInteger(chunkSize) || chunkSize < 1) {
                return { groups: [], error: "Pages per file must be at least 1." };
            }
            const result: number[][] = [];
            for (let i = 0; i < numPages; i += chunkSize) {
                result.push(images.slice(i, i + chunkSize).map((_, j) => i + j));
            }
            return { groups: result, error: null };
        }
        return parseRanges(rangeInput, numPages);
    }, [mode, rangeInput, chunkSize, images, numPages]);

    // Map each page to the first output file it belongs to, for the thumbnail badges
    const pageGroup = useMemo(() => {
        const map = new Map<number, number>();
        groups.forEach((group, g) => group.forEach(p => { if (!map.has(p)) map.set(p, g); }));
        return map;
    }, [groups]);

    const handleFile = async (selectedFile: File) => {
        setNotice(null);
        setDone(null);
        // The PDF reader loads in the background; wait for it instead of ignoring the file
        let waited = 0;
        while (!pdfjsRef.current && waited < 100) {
            await new Promise((r) => setTimeout(r, 100));
            waited++;
        }
        if (!pdfjsRef.current) {
            setNotice("The PDF reader is still loading. Please try again in a moment.");
            return;
        }
        const problem = await checkPdfFile(selectedFile);
        if (problem) {
            setNotice(problem);
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

                for (let i = 1; i <= pdf.numPages; i++) {
                    setProgress(`Reading page ${i} of ${pdf.numPages}`);
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 0.6 });
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d")!;
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    await page.render({ canvasContext: context, viewport }).promise;
                    imgs.push(canvas.toDataURL("image/jpeg", 0.7));
                }

                setImages(imgs);
                setRangeInput(pdf.numPages > 1 ? `1-${Math.ceil(pdf.numPages / 2)}, ${Math.ceil(pdf.numPages / 2) + 1}-${pdf.numPages}` : "1");
            } catch (err) {
                setNotice(pdfErrorMessage(err));
                setFile(null);
            } finally {
                setLoading(false);
                setProgress("");
            }
        };
        reader.onerror = () => {
            setNotice("The file could not be read. Please choose it again.");
            setFile(null);
            setLoading(false);
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const processAndDownload = async () => {
        // Loaded only when needed, so the page itself stays small and fast
        const [{ PDFDocument }, { default: JSZip }] = await Promise.all([import("pdf-lib"), import("jszip")]);
        if (!file || error || groups.length === 0) return;

        setLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const sourceDoc = await PDFDocument.load(arrayBuffer);
            const baseName = file.name.replace(/\.pdf$/i, "");

            const outputs: { name: string; bytes: Uint8Array }[] = [];
            for (const group of groups) {
                const newDoc = await PDFDocument.create();
                const pages = await newDoc.copyPages(sourceDoc, group);
                pages.forEach(page => newDoc.addPage(page));

                const first = group[0] + 1;
                const last = group[group.length - 1] + 1;
                const label = first === last ? `page_${first}` : `pages_${first}-${last}`;
                outputs.push({ name: `${baseName}_${label}.pdf`, bytes: await newDoc.save() });
            }

            if (outputs.length === 1) {
                downloadBlob(new Blob([outputs[0].bytes as unknown as BlobPart], { type: "application/pdf" }), outputs[0].name);
                setDone(`${outputs[0].name} was downloaded. Check your Downloads folder.`);
            } else {
                const zip = new JSZip();
                outputs.forEach(o => zip.file(o.name, o.bytes));
                const zipBlob = await zip.generateAsync({ type: "blob" });
                downloadBlob(zipBlob, `${baseName}_split.zip`);
                setDone(`${baseName}_split.zip was downloaded with ${outputs.length} PDF files. Check your Downloads folder.`);
            }
        } catch (err) {
            setNotice(`Could not split this PDF. ${pdfErrorMessage(err)}`);
        } finally {
            setLoading(false);
        }
    };

    const startNew = () => {
        setDone(null);
        setNotice(null);
        setFile(null);
        setImages([]);
        setRangeInput("");
    };



    const modeButton = (value: SplitMode, label: string) => (
        <button
            onClick={() => setMode(value)}
            aria-pressed={mode === value}
            disabled={loading}
            className={`flex-1 min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium transition border disabled:opacity-50
                ${mode === value
                    ? "bg-[#0062cc] border-[#0062cc] text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
        >
            {label}
        </button>
    );

    const retryPick = () => {
        setNotice(null);
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-8">
            <ErrorNotice message={notice} onRetry={retryPick} retryLabel="Choose another file" onDismiss={() => setNotice(null)} />
            <ErrorNotice message={done} tone="success" onRetry={startNew} retryLabel="Split another PDF" onDismiss={() => setDone(null)} />
            {!file ? (
                <div className="max-w-3xl mx-auto">
                    <UploadZone
                        inputRef={fileInputRef}
                        accept="application/pdf"
                        noun="PDF"
                        buttonLabel="Select PDF"
                        hint="PDF files only, up to 150 MB. Password-protected PDFs cannot be opened."
                        onFiles={(files) => handleFile(files[0])}
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
                            <span className="text-sm text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                {numPages} pages
                            </span>
                        </div>

                        <button
                            onClick={startNew}
                            disabled={loading}
                            className="flex min-h-[44px] items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition shadow-sm font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Trash2 className="w-4 h-4" /> Discard File
                        </button>
                    </div>

                    {/* Split Options */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                            {modeButton("ranges", "Custom Ranges")}
                            {modeButton("every", "Every Page")}
                            {modeButton("fixed", "Every N Pages")}
                        </div>

                        {mode === "ranges" && (
                            <div className="space-y-2">
                                <label htmlFor="split-ranges" className="block text-sm font-medium text-slate-700">
                                    Page ranges (each range becomes a separate PDF)
                                </label>
                                <input
                                    id="split-ranges"
                                    type="text"
                                    inputMode="text"
                                    aria-invalid={!!error}
                                    value={rangeInput}
                                    onChange={(e) => setRangeInput(e.target.value)}
                                    placeholder="e.g. 1-3, 5, 8-10"
                                    className="w-full min-h-[44px] px-4 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>
                        )}

                        {mode === "fixed" && (
                            <div className="space-y-2">
                                <label htmlFor="split-chunk" className="block text-sm font-medium text-slate-700">
                                    Pages per file
                                </label>
                                <input
                                    id="split-chunk"
                                    type="number"
                                    inputMode="numeric"
                                    min={1}
                                    max={numPages}
                                    value={chunkSize}
                                    onChange={(e) => setChunkSize(parseInt(e.target.value, 10))}
                                    className="w-32 min-h-[44px] px-4 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>
                        )}

                        {error ? (
                            <p role="alert" className="text-red-600 text-sm font-medium">{error}</p>
                        ) : (
                            <p className="text-sm text-slate-500">
                                This will create <span className="font-semibold text-slate-700">{groups.length}</span>{" "}
                                {groups.length === 1 ? "PDF file" : "PDF files (downloaded as ZIP)"}.
                            </p>
                        )}
                    </div>

                    {/* Grid of pages */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((img, index) => {
                            const group = pageGroup.get(index);
                            const included = group !== undefined;
                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col items-center bg-white border-2 rounded-2xl p-4 transition-all duration-300
                                        ${included ? "border-slate-200" : "border-slate-100 opacity-40"}`}
                                >
                                    <div className="w-full aspect-auto flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden mb-3 relative shadow-sm border border-slate-100">
                                        <img
                                            src={img}
                                            alt=""
                                            className="max-w-full max-h-48 object-contain"
                                        />

                                        {/* Page Badge */}
                                        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-md z-10">
                                            {index + 1}
                                        </div>

                                        {/* Output File Badge */}
                                        {included && (
                                            <div className={`absolute top-2 right-2 text-white text-xs font-bold px-2.5 py-1 rounded-md z-10 ${GROUP_COLORS[group % GROUP_COLORS.length]}`}>
                                                File {group + 1}
                                            </div>
                                        )}
                                    </div>

                                    <span className="font-medium text-sm text-slate-600">
                                        {included ? `Page ${index + 1}` : "Not included"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Download Button */}
                    <div className="pt-6 flex flex-col items-center justify-center gap-3">
                        <button
                            onClick={processAndDownload}
                            disabled={loading || !!error || groups.length === 0}
                            aria-busy={loading}
                            className={`w-full max-w-md min-h-[56px] py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3
                ${loading || error || groups.length === 0
                                    ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                                    : "bg-[#0062cc] text-white hover:bg-[#0052ad] hover:shadow-blue-500/30"}`}
                        >
                            {loading ? (
                                <>
                                    <RefreshCcw className="w-6 h-6 animate-spin" aria-hidden="true" />
                                    Preparing your files...
                                </>
                            ) : groups.length > 1 ? (
                                <>
                                    <Download className="w-6 h-6" />
                                    Split &amp; Download ZIP
                                </>
                            ) : (
                                <>
                                    <Scissors className="w-6 h-6" />
                                    Split &amp; Download PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
