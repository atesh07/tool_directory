"use client";

import { Fragment, useState, useRef, useEffect } from "react";
import { PDFDocument, StandardFonts, rgb, setCharacterSpacing } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { loadWebFace, type WebFace } from "./webFonts";
import { RefreshCcw, Download, Trash2, Lock, Bold, Italic } from "lucide-react";

const SCALE = 1.5;
// Resolution used when a PDF has to be rebuilt from page images (protected files)
const FLAT_SCALE = 3;

type TextItem = {
    id: number;
    original: string;
    text: string;
    // PDF-space geometry (points, origin bottom-left)
    x: number;
    y: number;
    width: number;
    size: number;
    // Screen-space geometry (px at SCALE)
    left: number;
    top: number;
    boxWidth: number;
    boxHeight: number;
    fontSize: number;
    // Matched style
    cssFont: string;
    fontKey: string;
    rawName: string;
    // Key into the web-face map; changes when the user overrides bold/italic
    faceKey: string;
    origBold: boolean;
    origItalic: boolean;
    styleChanged: boolean;
    cssOverride?: string;
    // Underline (e.g. links) drawn under the text, in screen px at SCALE; redrawn at the new text width
    underline?: { offset: number; thick: number; color: [number, number, number] };
    wipeHeight: number;
    // Screen-space left edge of the original text (shared by pieces of a split run)
    coverLeft: number;
    // True for the pieces created when a run is split to style only part of it
    fromSplit?: boolean;
    // Stack of the PDF's own font, used to measure where the unchanged start of a run ends
    origStack: string;
    // What the editable element contains (never rewritten by React, so the caret is never disturbed)
    domText: string;
    // Extra space per character so the substitute font is exactly as wide as the PDF's own line (screen px)
    tracking: number;
    // Area of the original text that must be covered on export (split pieces share the original area)
    coverX: number;
    coverWidth: number;
    hasEmbeddedFace: boolean;
    locked: boolean;
    bold: boolean;
    italic: boolean;
    family: "sans" | "serif" | "mono";
    color: [number, number, number];
    bg: [number, number, number];
};

type FontInfo = {
    name: string;
    style: string;
    uses: number;
    kind: "text" | "icon";
};

type PageData = {
    image: string;
    width: number;
    height: number;
    pdfHeight: number;
    items: TextItem[];
};

// Icon / symbol fonts: their text is glyph names (e.g. "Phone-Alt"), so they are never edited or redrawn
const isIconFont = (name: string) => /awesome|icon|symbol|dingbat|wingding|cmsy|cmmi|cmex|material|glyph/i.test(name);

// Subset fonts only hold the glyphs the PDF used. For any other letter the browser needs a fallback that is
// already bold/italic itself, so each variant is declared as a weight-400 face pointing at the right system font.
const FALLBACK_FACES: Record<TextItem["family"], string[][]> = {
    // [regular, bold, italic, bold italic]
    sans: [
        ["Arial", "ArialMT", "Helvetica", "HelveticaNeue"],
        ["Arial Bold", "Arial-BoldMT", "Helvetica Bold", "Helvetica-Bold", "HelveticaNeue-Bold"],
        ["Arial Italic", "Arial-ItalicMT", "Helvetica Oblique", "Helvetica-Oblique", "HelveticaNeue-Italic"],
        ["Arial Bold Italic", "Arial-BoldItalicMT", "Helvetica Bold Oblique", "Helvetica-BoldOblique", "HelveticaNeue-BoldItalic"],
    ],
    serif: [
        ["Times New Roman", "TimesNewRomanPSMT", "Times"],
        ["Times New Roman Bold", "TimesNewRomanPS-BoldMT", "Times Bold", "Times-Bold"],
        ["Times New Roman Italic", "TimesNewRomanPS-ItalicMT", "Times Italic", "Times-Italic"],
        ["Times New Roman Bold Italic", "TimesNewRomanPS-BoldItalicMT", "Times Bold Italic", "Times-BoldItalic"],
    ],
    mono: [
        ["Courier New", "CourierNewPSMT", "Courier", "Menlo Regular"],
        ["Courier New Bold", "CourierNewPS-BoldMT", "Courier Bold", "Menlo Bold"],
        ["Courier New Italic", "CourierNewPS-ItalicMT", "Courier Oblique", "Menlo Italic"],
        ["Courier New Bold Italic", "CourierNewPS-BoldItalicMT", "Courier Bold Oblique", "Menlo Bold Italic"],
    ],
};
const fallbackName = (family: TextItem["family"], bold: boolean, italic: boolean) =>
    `pdfedit-${family}-${(bold ? 1 : 0) + (italic ? 2 : 0)}`;
const FALLBACK_CSS = (Object.keys(FALLBACK_FACES) as TextItem["family"][])
    .flatMap((family) =>
        FALLBACK_FACES[family].map((locals, v) =>
            `@font-face{font-family:"${fallbackName(family, v === 1 || v === 3, v >= 2)}";font-weight:400;font-style:normal;src:${locals.map((l) => `local("${l}")`).join(",")};}`
        )
    )
    .join("\n");

// Emoji, bullets and other pictographs are kept exactly as the PDF drew them
const EMOJI_RE = /\p{Extended_Pictographic}|\u20e3|\ufffd/u;
const isStaticRun = (str: string, fontName: string) =>
    /emoji/i.test(fontName) || EMOJI_RE.test(str) || /^\s*[•·▪●○■□◆◇]\s*$/.test(str);

// Looks just under the baseline for a thin line spanning the whole run (an underline)
function detectUnderline(
    ctx: CanvasRenderingContext2D,
    left: number,
    baseline: number,
    fontSize: number,
    width: number,
    bg: [number, number, number]
) {
    const x = Math.max(0, Math.floor(left + 2));
    const w = Math.floor(width - 4);
    const y0 = Math.max(0, Math.floor(baseline + fontSize * 0.02));
    const h = Math.ceil(fontSize * 0.3);
    if (w < 8 || y0 + h > ctx.canvas.height) return undefined;
    const d = ctx.getImageData(x, y0, w, h).data;
    let first = -1;
    let rows = 0;
    let color: [number, number, number] = [0, 0, 0];
    for (let row = 0; row < h; row++) {
        let hit = 0;
        for (let col = 0; col < w; col++) {
            const i = (row * w + col) * 4;
            if (Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 120) hit++;
        }
        if (hit / w >= 0.8) {
            if (first < 0) {
                first = row;
                const m = (row * w + Math.floor(w / 2)) * 4;
                color = [d[m], d[m + 1], d[m + 2]];
            }
            rows++;
        } else if (first >= 0) break;
    }
    if (first < 0) return undefined;
    return { offset: y0 + first - baseline, thick: Math.max(1, rows), color };
}

// Only runs the user changed are rewritten; everything else stays exactly as the PDF has it
const isEdited = (it: TextItem) => !it.locked && (it.text !== it.original || it.styleChanged || !!it.fromSplit);

const css = (c: [number, number, number]) => `rgb(${c[0]},${c[1]},${c[2]})`;

function detectStyle(rawName: string, genericFamily: string) {
    const name = rawName.replace(/^[A-Z]{6}\+/, "");
    const bold = /bold|black|heavy|semibold|demi/i.test(name);
    const italic = /italic|oblique/i.test(name);
    let family: "sans" | "serif" | "mono" = "sans";
    if (/courier|mono|consolas|menlo/i.test(name) || genericFamily === "monospace") family = "mono";
    else if (/times|serif|georgia|garamond|minion|cambria|palatino|book/i.test(name) && !/sans/i.test(name)) family = "serif";
    else if (genericFamily === "serif" && !/arial|helvet|calibri|verdana|sans/i.test(name)) family = "serif";
    return { bold, italic, family };
}

function sampleColors(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    x = Math.max(0, Math.floor(x));
    y = Math.max(0, Math.floor(y));
    w = Math.max(1, Math.min(Math.ceil(w), ctx.canvas.width - x));
    h = Math.max(1, Math.min(Math.ceil(h), ctx.canvas.height - y));
    const d = ctx.getImageData(x, y, w, h).data;

    // Background = most frequent exact colour, so a white page stays pure white instead of drifting to near-white
    const counts = new Map<number, number>();
    for (let i = 0; i < d.length; i += 4) {
        const k = (d[i] << 16) | (d[i + 1] << 8) | d[i + 2];
        counts.set(k, (counts.get(k) || 0) + 1);
    }
    let best = 0;
    let max = 0;
    counts.forEach((v, k) => { if (v > max) { max = v; best = k; } });
    const bg: [number, number, number] = [(best >> 16) & 255, (best >> 8) & 255, best & 255];

    // Text = pixel furthest from the background
    let far = 0;
    let color: [number, number, number] = [0, 0, 0];
    for (let i = 0; i < d.length; i += 4) {
        const dist = Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]);
        if (dist > far) { far = dist; color = [d[i], d[i + 1], d[i + 2]]; }
    }
    return { bg, color };
}

export default function ToolClient() {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PageData[]>([]);
    const [fonts, setFonts] = useState<FontInfo[]>([]);
    const [loading, setLoading] = useState(false);
    // true: every line is first rebuilt in a matching font, so edits never change the look of a line
    const [convertAll, setConvertAll] = useState(true);
    const [activeKey, setActiveKey] = useState<{ page: number; id: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pdfjsRef = useRef<any>(null);
    // Original font programs pulled out of the PDF, keyed by font object name
    const measureCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const nextIdRef = useRef(1_000_000);
    const webFacesRef = useRef<Map<string, WebFace | null>>(new Map());
    const fontDataRef = useRef<Map<string, Uint8Array>>(new Map());

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
        if (!pdfjsRef.current) return;
        if (selectedFile.type !== "application/pdf") {
            alert("Please upload a valid PDF file.");
            return;
        }

        setLoading(true);
        setFile(selectedFile);

        try {
            const data = new Uint8Array(await selectedFile.arrayBuffer());
            const pdfjs = pdfjsRef.current;
            const pdf = await pdfjs.getDocument({ data, fontExtraProperties: true }).promise;
            fontDataRef.current = new Map();
            const fontStats = new Map<string, FontInfo>();
            const result: PageData[] = [];

            for (let p = 1; p <= pdf.numPages; p++) {
                const page = await pdf.getPage(p);
                const viewport = page.getViewport({ scale: SCALE });
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: ctx, viewport }).promise;

                const content = await page.getTextContent();
                const items: TextItem[] = [];

                content.items.forEach((it: any, idx: number) => {
                    if (!it.str || !it.str.trim()) return;
                    const tx = pdfjs.Util.transform(viewport.transform, it.transform);
                    const fontSize = Math.hypot(tx[2], tx[3]);
                    const boxWidth = it.width * SCALE;
                    const left = tx[4];
                    const top = tx[5] - fontSize * 0.88;
                    const boxHeight = fontSize * 1.1;

                    let rawName = "";
                    let loadedName = "";
                    try {
                        const f = page.commonObjs.get(it.fontName);
                        rawName = f?.name || "";
                        loadedName = f?.loadedName || "";
                    } catch { /* font not resolved, fall back below */ }
                    const fontKey = `${p}:${it.fontName}`;
                    try {
                        const f = page.commonObjs.get(it.fontName);
                        if (f?.data && !fontDataRef.current.has(fontKey)) fontDataRef.current.set(fontKey, new Uint8Array(f.data));
                    } catch { /* no embedded program (e.g. Type3), standard font fallback is used */ }
                    const generic = content.styles[it.fontName]?.fontFamily || "sans-serif";
                    const style = detectStyle(rawName, generic);
                    const locked = isIconFont(rawName) || isStaticRun(it.str, rawName);

                    const label = rawName.replace(/^[A-Z]{6}\+/, "") || it.fontName;
                    const stat = fontStats.get(label) || {
                        name: label,
                        style: locked ? (/emoji/i.test(rawName) ? "Emoji (kept exactly as is)" : "Icon / symbol (kept exactly as is)") : [style.bold ? "Bold" : "Regular", style.italic ? "Italic" : ""].filter(Boolean).join(" "),
                        uses: 0,
                        kind: locked ? "icon" : "text",
                    } as FontInfo;
                    stat.uses++;
                    fontStats.set(label, stat);

                    const { bg, color } = sampleColors(ctx, left, top, boxWidth, boxHeight);

                    const underline = locked ? undefined : detectUnderline(ctx, left, tx[5], fontSize, boxWidth, bg);
                    const wipeHeight = underline ? Math.max(boxHeight, tx[5] + underline.offset + underline.thick + 1 - top) : boxHeight;

                    // The embedded font is registered by pdf.js, so the browser can render the exact face
                    const generic2 = style.family === "mono" ? "monospace" : style.family === "serif" ? "serif" : "sans-serif";
                    const fb = `"${fallbackName(style.family, style.bold, style.italic)}", ${generic2}`;
                    const cssFont = loadedName ? `"${loadedName}", ${fb}` : fb;

                    items.push({
                        id: idx,
                        original: it.str,
                        text: it.str,
                        x: it.transform[4],
                        y: it.transform[5],
                        width: it.width,
                        size: Math.hypot(it.transform[2], it.transform[3]),
                        left, top, boxWidth, boxHeight, fontSize,
                        cssFont, origStack: loadedName ? `"${loadedName}", ${fb}` : fb, domText: it.str, tracking: 0, fontKey, rawName, underline, wipeHeight, coverLeft: left, coverX: it.transform[4], coverWidth: it.width, faceKey: rawName, origBold: style.bold, origItalic: style.italic, styleChanged: false, hasEmbeddedFace: !!loadedName, locked, color, bg, ...style,
                    });
                });

                // Hidden text layers sit on top of visible text; keep the one that actually has ink under it
                const inkIn = (it: TextItem, x0: number, x1: number) => {
                    const w = Math.floor(x1 - x0);
                    if (w < 3) return 0;
                    const x = Math.max(0, Math.floor(x0));
                    const y = Math.max(0, Math.floor(it.top));
                    const d = ctx.getImageData(x, y, Math.min(w, canvas.width - x), Math.min(Math.ceil(it.boxHeight), canvas.height - y)).data;
                    let n = 0;
                    for (let i = 0; i < d.length; i += 4) {
                        if (Math.abs(d[i] - it.bg[0]) + Math.abs(d[i + 1] - it.bg[1]) + Math.abs(d[i + 2] - it.bg[2]) > 120) n++;
                    }
                    return n;
                };
                for (let a = 0; a < items.length; a++) {
                    for (let b = a + 1; b < items.length; b++) {
                        const A = items[a];
                        const B = items[b];
                        if (A.locked || B.locked) continue;
                        if (Math.abs(A.top - B.top) > A.fontSize * 0.5) continue;
                        const overlap = Math.min(A.left + A.boxWidth, B.left + B.boxWidth) - Math.max(A.left, B.left);
                        if (overlap < Math.min(A.boxWidth, B.boxWidth) * 0.5) continue;
                        const [lo, hi] = A.left <= B.left ? [A, B] : [B, A];
                        // Ink in the part of each run the other one does not cover
                        const inkLo = inkIn(lo, lo.left, hi.left);
                        const inkHi = inkIn(hi, lo.left + lo.boxWidth, hi.left + hi.boxWidth);
                        const ghost = inkLo === inkHi ? A : inkLo < inkHi ? lo : hi;
                        ghost.locked = true;
                    }
                }

                result.push({
                    image: canvas.toDataURL("image/png"),
                    width: viewport.width,
                    height: viewport.height,
                    pdfHeight: viewport.height / SCALE,
                    items,
                });
            }
            // Fetch complete versions of the PDF's fonts so any new letter matches (not just the embedded subset)
            const faces = new Map<string, WebFace | null>();
            const familyOf = new Map<string, TextItem["family"]>();
            result.forEach((pg) => pg.items.forEach((i) => { if (!i.locked && i.rawName && !familyOf.has(i.rawName)) familyOf.set(i.rawName, i.family); }));
            await Promise.all(Array.from(familyOf).map(async ([n, fam]) => faces.set(n, await loadWebFace(n, {}, fam))));
            webFacesRef.current = faces;
            result.forEach((pg) =>
                pg.items.forEach((it) => {
                    const web = faces.get(it.rawName);
                    if (!web) return;
                    it.cssFont = `"${web.cssName}", ${it.cssFont}`;
                    // Spread or squeeze letters a little so this font fills exactly the width the PDF's own font did
                    const natural = measure(it.text, it.fontSize, it.cssFont);
                    const n = Array.from(it.text).length;
                    if (n > 1 && natural > 0) {
                        const fit = (it.boxWidth - natural) / n;
                        it.tracking = Math.max(-it.fontSize * 0.12, Math.min(it.fontSize * 0.12, fit));
                    }
                })
            );
            setPages(result);
            setFonts(Array.from(fontStats.values()));
        } catch (err) {
            alert("Error reading PDF. It may be password protected.");
            setFile(null);
        } finally {
            setLoading(false);
        }
    };

    const updateText = (pageIdx: number, itemId: number, text: string) => {
        setPages((prev) =>
            prev.map((pg, i) =>
                i !== pageIdx ? pg : { ...pg, items: pg.items.map((it) => (it.id === itemId ? { ...it, text } : it)) }
            )
        );
    };

    const activeItem = activeKey ? pages[activeKey.page]?.items.find((i) => i.id === activeKey.id) : undefined;

    // Resolves everything an item needs to show/save a given bold/italic combination
    const resolveStyle = async (it: TextItem, bold: boolean, italic: boolean) => {
        const styleChanged = bold !== it.origBold || italic !== it.origItalic;
        let cssOverride: string | undefined;
        let faceKey = it.rawName;
        if (styleChanged) {
            // A changed style can't reuse the PDF's own subset, so fetch the matching weight/slant of the same family
            const web = await loadWebFace(it.rawName, { bold, italic });
            faceKey = `${it.rawName}|${bold}|${italic}`;
            webFacesRef.current.set(faceKey, web);
            const generic = it.family === "mono" ? "monospace" : it.family === "serif" ? "serif" : "sans-serif";
            cssOverride = `${web ? `"${web.cssName}", ` : ""}"${fallbackName(it.family, bold, italic)}", ${generic}`;
        }
        return { bold, italic, styleChanged, cssOverride, faceKey };
    };

    const measure = (text: string, fontSize: number, family: string) => {
        const ctx = (measureCanvasRef.current ||= document.createElement("canvas")).getContext("2d")!;
        ctx.font = `${fontSize}px ${family}`;
        return ctx.measureText(text).width;
    };

    // Text before the first change keeps the PDF's own pixels; only the rest of the run is rewritten.
    // Returns how many characters that untouched start has and how wide it is on screen.
    const layoutOf = (it: TextItem) => {
        if (convertAll || it.styleChanged || it.fromSplit) return { prefixLen: 0, prefixPx: 0 };
        const a = it.original;
        const b = it.text;
        let n = 0;
        while (n < a.length && n < b.length && a[n] === b[n]) n++;
        if (n === 0) return { prefixLen: 0, prefixPx: 0 };
        const full = measure(a, it.fontSize, it.origStack);
        const k = full > 0 ? (it.coverWidth * SCALE) / full : 1;
        return { prefixLen: n, prefixPx: measure(a.slice(0, n), it.fontSize, it.origStack) * k };
    };

    const toggleStyle = async (kind: "bold" | "italic") => {
        if (!activeKey || !activeItem) return;
        const it = activeItem;
        const bold = kind === "bold" ? !it.bold : it.bold;
        const italic = kind === "italic" ? !it.italic : it.italic;

        // Read what is really on screen (typing is only saved to state on blur) and what is selected
        const el = document.activeElement as HTMLElement | null;
        const live = el && el.dataset.item === `${activeKey.page}:${it.id}` ? el : null;
        const text = live ? live.textContent ?? it.text : it.text;
        let start = 0;
        let end = text.length;
        const sel = window.getSelection();
        if (live && sel && sel.rangeCount && !sel.isCollapsed && live.contains(sel.anchorNode) && live.contains(sel.focusNode)) {
            const range = sel.getRangeAt(0);
            const pre = range.cloneRange();
            pre.selectNodeContents(live);
            pre.setEnd(range.startContainer, range.startOffset);
            start = pre.toString().length;
            end = start + range.toString().length;
        }

        // Whole line (nothing selected, or everything selected)
        if (start === 0 && end >= text.length) {
            const style = await resolveStyle(it, bold, italic);
            setPages((prev) =>
                prev.map((pg, i) =>
                    i !== activeKey.page ? pg : { ...pg, items: pg.items.map((x) => (x.id === it.id ? { ...x, text, ...style } : x)) }
                )
            );
            return;
        }

        // Only part of the line: split it into before / selected / after, each laid out where it belongs
        const parts = [
            { text: text.slice(0, start), bold: it.bold, italic: it.italic },
            { text: text.slice(start, end), bold, italic },
            { text: text.slice(end), bold: it.bold, italic: it.italic },
        ].filter((x) => x.text.length > 0);

        const pristine = text === it.original && !it.styleChanged && !it.fromSplit;
        const total = measure(text, it.fontSize, it.origStack);
        // Scale so the PDF's own font measures exactly as wide as it really is in the file
        const k = total > 0 ? (it.coverWidth * SCALE) / total : 1;
        const pieces: TextItem[] = [];
        let offset = 0; // where each piece starts in the original line
        let shift = 0; // how far pieces move because of the new style's width
        for (const part of parts) {
            const style = await resolveStyle(it, part.bold, part.italic);
            const changed = part.bold !== it.bold || part.italic !== it.italic;
            const w0 = measure(part.text, it.fontSize, it.origStack) * k; // width in the PDF
            const w1 = changed ? measure(part.text, it.fontSize, style.cssOverride ?? it.cssFont) : w0; // width as redrawn
            const base = {
                ...it,
                ...style,
                id: nextIdRef.current++,
                text: part.text,
                domText: part.text,
                boxWidth: w1,
                width: w1 / SCALE,
            };
            if (pristine) {
                const untouched = !changed && Math.abs(shift) < 0.6;
                pieces.push({
                    ...base,
                    original: changed ? "" : part.text,
                    fromSplit: !untouched,
                    left: it.left + offset + shift,
                    x: it.x + (offset + shift) / SCALE,
                    // Each piece covers only its own part of the original line
                    coverLeft: it.coverLeft + offset,
                    coverX: it.coverX + offset / SCALE,
                    coverWidth: w0 / SCALE,
                });
            } else {
                pieces.push({
                    ...base,
                    original: changed ? "" : part.text,
                    fromSplit: true,
                    left: it.left + offset + shift,
                    x: it.x + (offset + shift) / SCALE,
                    coverWidth: 0,
                });
            }
            shift += w1 - w0;
            offset += w0;
        }
        // A line that was already edited can't be mapped back to the original, so its first piece covers the whole area
        if (!pristine) pieces[0].coverWidth = it.coverWidth;
        setActiveKey(null);
        setPages((prev) =>
            prev.map((pg, i) => {
                if (i !== activeKey.page) return pg;
                const idx = pg.items.findIndex((x) => x.id === it.id);
                const items = [...pg.items];
                items.splice(idx, 1, ...pieces);
                return { ...pg, items };
            })
        );
    };

    // Whether a run is drawn by us (true) or left as the PDF has it (false)
    const isRedrawn = (it: TextItem) => !it.locked && (convertAll || isEdited(it));

    const editedCount = pages.reduce((n, pg) => n + pg.items.filter(isEdited).length, 0);

    const processAndDownload = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const sourceBytes = await file.arrayBuffer();
            // Protected PDFs can be read for display but can't be edited in place; they are rebuilt from page images instead
            let flat = false;
            let pdfDoc: PDFDocument;
            try {
                pdfDoc = await PDFDocument.load(sourceBytes, { updateMetadata: false });
            } catch (loadErr) {
                console.warn("Falling back to a rebuilt PDF", loadErr);
                flat = true;
                pdfDoc = await PDFDocument.create();
            }
            const fontMap = {
                sans: [StandardFonts.Helvetica, StandardFonts.HelveticaBold, StandardFonts.HelveticaOblique, StandardFonts.HelveticaBoldOblique],
                serif: [StandardFonts.TimesRoman, StandardFonts.TimesRomanBold, StandardFonts.TimesRomanItalic, StandardFonts.TimesRomanBoldItalic],
                mono: [StandardFonts.Courier, StandardFonts.CourierBold, StandardFonts.CourierOblique, StandardFonts.CourierBoldOblique],
            };
            pdfDoc.registerFontkit(fontkit);
            const cache = new Map<string, any>();
            const getFallback = async (it: TextItem) => {
                const name = fontMap[it.family][(it.bold ? 1 : 0) + (it.italic ? 2 : 0)];
                if (!cache.has(name)) cache.set(name, await pdfDoc.embedFont(name));
                return cache.get(name);
            };
            // The PDF's own font, re-embedded; null when it can't be reused
            const getOriginal = async (it: TextItem) => {
                // Complete web version first (every letter available), then the PDF's own subset
                const webKey = `web:${it.faceKey}`;
                if (!cache.has(webKey)) {
                    let web = null;
                    const face = webFacesRef.current.get(it.faceKey);
                    if (face) { try { web = await pdfDoc.embedFont(face.bytes, { subset: true }); } catch { web = null; } }
                    cache.set(webKey, web);
                }
                if (cache.get(webKey)) return cache.get(webKey);
                // A user-changed style can't use the original subset (it has the old weight)
                if (it.styleChanged) return null;
                if (cache.has(it.fontKey)) return cache.get(it.fontKey);
                let font = null;
                const bytes = fontDataRef.current.get(it.fontKey);
                if (bytes) {
                    try { font = await pdfDoc.embedFont(bytes, { subset: true }); } catch { font = null; }
                }
                cache.set(it.fontKey, font);
                return font;
            };
            const clamp = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n / 255)) : 0);
            const toRgb = (c: [number, number, number]) => rgb(clamp(c[0]), clamp(c[1]), clamp(c[2]));

            let skipped = 0;
            if (flat) {
                const src = await pdfjsRef.current.getDocument({ data: new Uint8Array(sourceBytes.slice(0)) }).promise;
                for (let p = 0; p < pages.length; p++) {
                    const page = await src.getPage(p + 1);
                    const viewport = page.getViewport({ scale: FLAT_SCALE });
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d")!;
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    await page.render({ canvasContext: ctx, viewport }).promise;
                    // Wipe only the runs that were changed; they are redrawn as real text on top
                    const k = FLAT_SCALE / SCALE;
                    for (const it of pages[p].items) {
                        if (!isRedrawn(it) || it.coverWidth <= 0) continue;
                        ctx.fillStyle = css(it.bg);
                        const lay = layoutOf(it);
                        ctx.fillRect((it.coverLeft + lay.prefixPx - 1) * k, it.top * k, (it.coverWidth * SCALE - lay.prefixPx + 2) * k, it.wipeHeight * k);
                    }
                    const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.92));
                    const img = await pdfDoc.embedJpg(new Uint8Array(await blob.arrayBuffer()));
                    const out = pdfDoc.addPage([pages[p].width / SCALE, pages[p].height / SCALE]);
                    out.drawImage(img, { x: 0, y: 0, width: out.getWidth(), height: out.getHeight() });
                }
            }
            const pdfPages = pdfDoc.getPages();
            for (let p = 0; p < pages.length; p++) {
                for (const it of pages[p].items) {
                    // Untouched text is left exactly as the PDF has it
                    if (!isRedrawn(it)) continue;
                    try {
                    const page = pdfPages[p];
                    const original = await getOriginal(it);
                    const fallback = await getFallback(it);
                    const lay = layoutOf(it);
                    const prefixPdf = lay.prefixPx / SCALE;
                    const tailText = it.text.slice(lay.prefixLen);

                    // Cover the original text with the sampled background
                    if (!flat && it.coverWidth > 0) {
                        const below = it.underline ? (it.underline.offset + it.underline.thick + 1) / SCALE : 0;
                        const bottom = Math.max(it.size * 0.22, below);
                        page.drawRectangle({
                            x: it.coverX + prefixPdf - 1,
                            y: it.y - bottom,
                            width: Math.max(0, it.coverWidth - prefixPdf) + 2,
                            height: it.size * 0.88 + bottom,
                            color: toRgb(it.bg),
                        });
                    }

                    // Split into runs: characters the original font has, and the rest in the closest standard font
                    const supported: Set<number> | null = original ? new Set(original.getCharacterSet()) : null;
                    const runs: { font: any; text: string }[] = [];
                    for (const ch of Array.from(tailText)) {
                        let font = supported && supported.has(ch.codePointAt(0)!) ? original : fallback;
                        let out = ch;
                        if (font === fallback) {
                            try { fallback.encodeText(ch); } catch { out = "?"; }
                        }
                        const last = runs[runs.length - 1];
                        if (last && last.font === font) last.text += out;
                        else runs.push({ font, text: out });
                    }
                    if (!tailText.trim()) continue;

                    const size = it.size;

                    const startX = it.x + prefixPdf;
                    let x = startX;
                    // Same per-character spacing as the preview so line widths match
                    const tc = it.tracking / SCALE;
                    if (tc) page.pushOperators(setCharacterSpacing(tc));
                    for (const run of runs) {
                        page.drawText(run.text, { x, y: it.y, size, font: run.font, color: toRgb(it.color) });
                        x += run.font.widthOfTextAtSize(run.text, size) + tc * Array.from(run.text).length;
                    }
                    if (tc) page.pushOperators(setCharacterSpacing(0));
                    // Redraw the underline to the new text's width
                    if (it.underline) {
                        page.drawRectangle({
                            x: startX,
                            y: it.y - (it.underline.offset + it.underline.thick) / SCALE,
                            width: x - startX,
                            height: it.underline.thick / SCALE,
                            color: toRgb(it.underline.color),
                        });
                    }
                    } catch (itemErr) {
                        // One bad run must not lose the whole save; keep going and report it
                        console.error("Could not redraw text run", it.text, itemErr);
                        skipped++;
                    }
                }
            }

            const bytes = await pdfDoc.save();
            const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `edited_${file.name}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            // Revoking straight away can cancel the download, leaving a broken file
            setTimeout(() => URL.revokeObjectURL(url), 30000);
            if (flat) alert("This PDF is protected, so it was saved as page images with your text drawn on top. It looks the same but the unchanged text can no longer be selected.");
            if (skipped > 0) alert(`Saved, but ${skipped} text run${skipped === 1 ? "" : "s"} could not be redrawn and kept the original text.`);
        } catch (err) {
            console.error("Save failed", err);
            alert(`Error saving PDF: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setLoading(false);
        }
    };

    const startNew = () => {
        setFile(null);
        setPages([]);
        setFonts([]);
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
            <style dangerouslySetInnerHTML={{ __html: FALLBACK_CSS }} />
            {!file || pages.length === 0 ? (
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
                                    <p className="text-xl font-medium text-slate-800">Reading PDF...</p>
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
                        <div className="flex flex-col">
                            <span className="font-semibold text-slate-700">{file.name}</span>
                            <span className="text-sm text-slate-500">
                                Click any text to edit it. {editedCount} change{editedCount === 1 ? "" : "s"} so far.
                            </span>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <button
                                onClick={processAndDownload}
                                disabled={loading || editedCount === 0}
                                className="flex items-center gap-2 px-5 py-2 bg-[#0062cc] hover:bg-[#0052ad] disabled:opacity-50 text-white rounded-lg transition shadow-sm font-bold text-sm"
                            >
                                {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                Download PDF
                            </button>
                            <button
                                onClick={startNew}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition shadow-sm font-medium text-sm ml-auto md:ml-2"
                            >
                                <Trash2 className="w-4 h-4" /> Discard
                            </button>
                        </div>
                    </div>

                    {/* Style toolbar */}
                    <div className="sticky top-2 z-20 flex items-center gap-2 bg-white/95 backdrop-blur border border-slate-200 rounded-xl px-4 py-2 shadow-sm w-fit mx-auto">
                        <button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => toggleStyle("bold")}
                            disabled={!activeItem}
                            title="Bold (Ctrl/Cmd+B)"
                            className={`p-2 rounded-lg border transition disabled:opacity-40 ${activeItem?.bold ? "bg-[#0062cc] text-white border-[#0062cc]" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"}`}
                        >
                            <Bold className="w-4 h-4" />
                        </button>
                        <button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => toggleStyle("italic")}
                            disabled={!activeItem}
                            title="Italic (Ctrl/Cmd+I)"
                            className={`p-2 rounded-lg border transition disabled:opacity-40 ${activeItem?.italic ? "bg-[#0062cc] text-white border-[#0062cc]" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"}`}
                        >
                            <Italic className="w-4 h-4" />
                        </button>
                        <label className="flex items-center gap-1.5 text-xs text-slate-600 pl-3 ml-1 border-l border-slate-200 cursor-pointer select-none">
                            <input type="checkbox" checked={convertAll} onChange={(e) => setConvertAll(e.target.checked)} />
                            Convert all text first
                        </label>
                        <span className="text-xs text-slate-500 pl-1">
                            {activeItem ? "Applies to the selected text (or the whole line if nothing is selected)" : "Click a text line, then choose Bold or Italic"}
                        </span>
                    </div>

                    {/* Fonts found in the PDF */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <p className="text-sm font-semibold text-slate-700 mb-2">Fonts detected in this PDF</p>
                        <div className="flex flex-wrap gap-2">
                            {fonts.map((f) => (
                                <span
                                    key={f.name}
                                    className={`text-xs px-3 py-1.5 rounded-full border ${f.kind === "icon" ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-white border-slate-200 text-slate-700"}`}
                                >
                                    <b>{f.name}</b> · {f.style} · {f.uses} text run{f.uses === 1 ? "" : "s"}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Pages */}
                    <div className="flex flex-col items-center gap-8 overflow-x-auto">
                        {pages.map((pg, pageIdx) => (
                            <div key={pageIdx} className="relative shadow-md border border-slate-200 bg-white shrink-0" style={{ width: pg.width, height: pg.height }}>
                                <img src={pg.image} alt={`Page ${pageIdx + 1}`} width={pg.width} height={pg.height} draggable={false} className="absolute inset-0 select-none" />

                                {pg.items.filter((it) => !it.locked).map((it) => {
                                    const key = `${pageIdx}-${it.id}`;
                                    const touched = isRedrawn(it);
                                    const lay = touched ? layoutOf(it) : { prefixLen: 0, prefixPx: 0 };
                                    const decoration = it.underline
                                        ? { textDecorationLine: "underline" as const, textDecorationColor: css(it.underline.color), textDecorationThickness: `${it.underline.thick}px` }
                                        : {};
                                    return (
                                        <Fragment key={key}>
                                        {touched && it.coverWidth > 0 && (
                                            // Hides only the part of the original that is being rewritten; the untouched start stays as the PDF drew it
                                            <div
                                                className="absolute pointer-events-none"
                                                style={{ left: it.coverLeft + lay.prefixPx - 1, top: it.top, width: it.coverWidth * SCALE - lay.prefixPx + 2, height: it.wipeHeight, backgroundColor: css(it.bg) }}
                                            />
                                        )}
                                        {touched && (
                                            <div
                                                className="absolute pointer-events-none whitespace-pre"
                                                style={{
                                                    left: it.left + lay.prefixPx,
                                                    top: it.top,
                                                    height: it.wipeHeight,
                                                    lineHeight: `${it.boxHeight}px`,
                                                    fontSize: it.fontSize,
                                                    fontFamily: it.cssOverride ?? it.cssFont,
                                                    // Every face in the stack is already bold/italic where needed; styling again would double it
                                                    fontWeight: 400,
                                                    fontStyle: "normal",
                                                    color: css(it.color),
                                                    letterSpacing: it.tracking || undefined,
                                                    ...decoration,
                                                }}
                                            >
                                                {it.text.slice(lay.prefixLen)}
                                            </div>
                                        )}
                                        <div
                                            contentEditable
                                            data-item={`${pageIdx}:${it.id}`}
                                            suppressContentEditableWarning
                                            spellCheck={false}
                                            onFocus={() => setActiveKey({ page: pageIdx, id: it.id })}
                                            onKeyDown={(e) => {
                                                if ((e.metaKey || e.ctrlKey) && (e.key === "b" || e.key === "i")) {
                                                    e.preventDefault();
                                                    toggleStyle(e.key === "b" ? "bold" : "italic");
                                                }
                                            }}
                                            onInput={(e) => updateText(pageIdx, it.id, e.currentTarget.textContent ?? "")}
                                            onBlur={() => setActiveKey(null)}
                                            className="absolute outline-none whitespace-pre cursor-text hover:outline hover:outline-1 hover:outline-[#0062cc]/60 focus:outline focus:outline-2 focus:outline-[#0062cc]"
                                            style={{
                                                left: it.left,
                                                top: it.top,
                                                minWidth: it.boxWidth,
                                                height: it.wipeHeight,
                                                lineHeight: `${it.boxHeight}px`,
                                                fontSize: it.fontSize,
                                                // The text itself is drawn by the layers above; this layer only takes typing, so its caret follows the PDF's own font
                                                fontFamily: convertAll || it.styleChanged ? it.cssOverride ?? it.cssFont : it.origStack,
                                                letterSpacing: convertAll || it.styleChanged ? it.tracking || undefined : undefined,
                                                fontWeight: 400,
                                                fontStyle: "normal",
                                                color: "transparent",
                                                caretColor: css(it.color),
                                                backgroundColor: "transparent",
                                            }}
                                        >
                                            {it.domText}
                                        </div>
                                        </Fragment>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
