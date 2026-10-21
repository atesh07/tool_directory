"use client";

import React, { useRef, useState } from "react";
import { Info } from "lucide-react";
import ErrorNotice from "@/components/tools/ErrorNotice";
import UploadZone from "@/components/tools/UploadZone";
import { downloadBlob } from "@/lib/download";
import { MAX_DOCX_MB } from "@/lib/pdfFiles";

// A4 at 96 dpi
const PAGE_W = 794;
const PAGE_H = 1123;
const MARGIN = 48; // top and bottom margin on every page
const BASE_SCALE = 2; // sharpness of the page pictures
const MAX_CANVAS_PX = 30000; // browsers refuse canvases much taller than this

/** Checks the file itself before any work starts. */
async function checkDocx(file: File): Promise<string | null> {
  if (file.size === 0) return "This file is empty (0 bytes). Please choose a different document.";
  if (file.size > MAX_DOCX_MB * 1024 * 1024) return `This file is larger than ${MAX_DOCX_MB} MB. Large documents can crash the browser tab.`;
  if (/\.doc$/i.test(file.name)) return "Old .doc files are not supported. Open it in Word and save it as .docx first.";
  if (!/\.docx$/i.test(file.name)) return "Please choose a Word document (.docx).";
  const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  if (head[0] !== 0x50 || head[1] !== 0x4b) return "This file is not a valid .docx, or it is damaged.";
  return null;
}

export default function ToolClient() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const convertToPdf = async (file: File | undefined) => {
    if (!file) return;

    setError(null);
    setDone(null);
    const problem = await checkDocx(file);
    if (problem) {
      setError(problem);
      return;
    }

    setLoading(true);
    let container: HTMLDivElement | null = null;
    try {
      setStatus("Loading converter...");
      // Loaded only when needed, so the page itself stays small and fast
      const [mammothModule, html2canvasModule, jspdfModule] = await Promise.all([
        import("mammoth/mammoth.browser.min.js"),
        import("html2canvas"),
        import("jspdf"),
      ]);
      const mammoth: any = (mammothModule as any).convertToHtml ? mammothModule : (mammothModule as any).default;
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = jspdfModule;

      setStatus("Reading document...");
      const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });

      // Render the document off-screen at A4 width
      container = document.createElement("div");
      container.style.cssText = `position:absolute;left:-9999px;top:0;width:${PAGE_W}px;box-sizing:border-box;padding:0 48px;display:flow-root;background:#fff;color:#111;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;`;
      container.innerHTML = `<style>
        img{max-width:100%;height:auto}
        table{border-collapse:collapse;max-width:100%}
        td,th{border:1px solid #999;padding:4px 8px;vertical-align:top}
        h1,h2,h3,h4{line-height:1.25}
        p{margin:0 0 10px}
      </style>${result.value}`;
      document.body.appendChild(container);

      if (!result.value.trim()) throw new Error("empty");

      // Pages are cut by looking at the finished picture and splitting in a blank gap, so no text line is ever cut in half
      const totalH = Math.max(container.scrollHeight, 1) + 24;
      const usable = PAGE_H - 2 * MARGIN;
      // Long documents use a slightly lower resolution so the PDF does not become huge
      const SCALE = Math.ceil(totalH / usable) > 15 ? 1.5 : BASE_SCALE;
      const quality = SCALE < BASE_SCALE ? 0.85 : 0.92;
      const top = container.getBoundingClientRect().top + window.scrollY;

      // One picture of the whole document when it fits in a canvas; very long documents are drawn page by page
      let full: HTMLCanvasElement | null = null;
      if (totalH * SCALE <= MAX_CANVAS_PX) {
        setStatus("Drawing pages...");
        full = await html2canvas(container, { scale: SCALE, useCORS: true, backgroundColor: "#ffffff", height: totalH });
      }

      // A strip of the picture starting y px from the top, h px tall
      const getStrip = async (y: number, h: number) => {
        const strip = document.createElement("canvas");
        strip.width = PAGE_W * SCALE;
        strip.height = Math.round(h * SCALE);
        const sctx = strip.getContext("2d");
        if (!sctx) throw new Error("canvas");
        sctx.fillStyle = "#ffffff";
        sctx.fillRect(0, 0, strip.width, strip.height);
        if (full) {
          const sh = Math.max(0, Math.min(h * SCALE, full.height - y * SCALE));
          if (sh > 0) sctx.drawImage(full, 0, y * SCALE, full.width, sh, 0, 0, strip.width, sh);
        } else {
          const part = await html2canvas(container!, {
            scale: SCALE,
            useCORS: true,
            backgroundColor: "#ffffff",
            y: top + y,
            height: h,
            windowHeight: totalH,
          });
          sctx.drawImage(part, 0, 0);
        }
        return strip;
      };

      // For every pixel row of a strip: does it contain anything other than white?
      const inkRows = (strip: HTMLCanvasElement) => {
        const w = strip.width;
        const data = strip.getContext("2d")!.getImageData(0, 0, w, strip.height).data;
        const rows = new Uint8Array(strip.height);
        for (let row = 0; row < strip.height; row++) {
          for (let col = 0; col < w; col += 2) {
            const i = (row * w + col) * 4;
            if (data[i] < 235 || data[i + 1] < 235 || data[i + 2] < 235) {
              rows[row] = 1;
              break;
            }
          }
        }
        return rows;
      };

      const pdf = new jsPDF("p", "mm", "a4");
      const estimate = Math.max(1, Math.ceil(totalH / usable));
      let y = 0;
      let pages = 0;
      while (y < totalH) {
        const stripH = usable + 40; // a little extra so a gap just past the page limit can still be found
        const strip = await getStrip(y, stripH);
        const rows = inkRows(strip);
        const lastInk = rows.lastIndexOf(1);
        const atEnd = y + stripH >= totalH;
        if (lastInk < 0) {
          if (atEnd) break;
          y += usable; // a long empty stretch: skip it
          continue;
        }

        let cut: number; // in css px
        if (atEnd && lastInk / SCALE <= usable) {
          cut = Math.min(usable, lastInk / SCALE + 12);
        } else {
          // the blank gap (at least 5 px tall) closest to the bottom of the page, in the lower 65% of it
          const minGap = 5 * SCALE;
          const lo = Math.floor(usable * 0.35 * SCALE);
          let found = -1;
          let runEnd = -1;
          for (let r = Math.floor(usable * SCALE); r >= lo; r--) {
            if (rows[r] === 0) {
              if (runEnd < 0) runEnd = r;
              if (runEnd - r + 1 >= minGap) {
                found = Math.round((r + runEnd) / 2);
                break;
              }
            } else {
              runEnd = -1;
            }
          }
          cut = found >= 0 ? found / SCALE : usable;
        }

        pages++;
        setStatus(`Creating page ${pages} of about ${Math.max(estimate, pages)}...`);
        const page = document.createElement("canvas");
        page.width = PAGE_W * SCALE;
        page.height = PAGE_H * SCALE;
        const ctx = page.getContext("2d");
        if (!ctx) throw new Error("canvas");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, page.width, page.height);
        const cutPx = Math.max(1, Math.round(cut * SCALE));
        ctx.drawImage(strip, 0, 0, strip.width, cutPx, 0, MARGIN * SCALE, strip.width, cutPx);
        if (pages > 1) pdf.addPage();
        pdf.addImage(page.toDataURL("image/jpeg", quality), "JPEG", 0, 0, 210, 297);
        y += cut;
        if (atEnd && lastInk / SCALE <= usable) break;
      }
      if (pages === 0) throw new Error("empty");

      setStatus("Saving...");
      const name = `${file.name.replace(/\.docx$/i, "")}.pdf`;
      downloadBlob(pdf.output("blob"), name);
      setDone(`${name} was downloaded with ${pages} page${pages === 1 ? "" : "s"}. Check your Downloads folder.`);
    } catch (err) {
      console.error("Conversion error:", err);
      setError(
        err instanceof Error && err.message === "empty"
          ? "This document has no content that can be converted."
          : "This file could not be converted. Make sure it is a valid .docx file that opens in Word."
      );
    } finally {
      container?.remove();
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <div className="space-y-4">
      <ErrorNotice message={error} onRetry={() => inputRef.current?.click()} retryLabel="Choose another file" onDismiss={() => setError(null)} />

      <ErrorNotice message={done} tone="success" onRetry={() => inputRef.current?.click()} retryLabel="Convert another document" onDismiss={() => setDone(null)} />

      <UploadZone
        inputRef={inputRef}
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        noun="Word document"
        buttonLabel="Select Word Document"
        hint="Word .docx files only, up to 25 MB. Old .doc files are not supported."
        onFiles={(files) => convertToPdf(files[0])}
        loading={loading}
        loadingText={status || "Processing..."}
      />

      <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
        <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          Beta: the PDF is made from pictures of your document pages, so its text cannot be selected or searched. Very
          complex layouts may look different from Word.
        </p>
      </div>
    </div>
  );
}
