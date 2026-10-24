"use client";

import { useEffect, useRef } from "react";
import { renderFrame, type Label, type View, type Work } from "@/lib/photoFrame";

type Props = {
  work: Work;
  view: View;
  label: Label | null;
  /** Pixel size the preview is drawn at; its shape is the shape of the result */
  width: number;
  height: number;
  /** Called with a change to apply; the tool keeps the view inside the photo */
  onChange: (fn: (v: View) => View) => void;
  /** Drawn on top of the preview and never saved, such as a face guide */
  overlay?: React.ReactNode;
  className?: string;
};

/**
 * Live preview of the framed photo. Drag to move, pinch or scroll to zoom, or use the arrow keys and + / -.
 * What is shown is drawn by the same code that makes the download, so they always match.
 */
export default function CropFrame({ work, view, label, width, height, onChange, overlay, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const changeRef = useRef(onChange);
  changeRef.current = onChange;

  const labelName = label?.name;
  const labelDate = label?.date;
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        if (canvasRef.current) renderFrame(canvasRef.current, work, width, height, view, labelName === undefined ? null : { name: labelName, date: labelDate ?? "" });
      } catch {
        /* a failed preview frame is redrawn on the next change */
      }
    });
    return () => cancelAnimationFrame(id);
  }, [work, view, labelName, labelDate, width, height]);

  // Mouse wheel zooms; it has to be a non-passive listener to stop the page from scrolling
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const f = e.deltaY < 0 ? 1.06 : 1 / 1.06;
      changeRef.current((v) => ({ ...v, zoom: v.zoom * f }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const map = pointers.current;
    const prev = map.get(e.pointerId);
    if (!prev) return;
    const w = e.currentTarget.getBoundingClientRect().width || 1;
    if (map.size === 1) {
      const dx = (e.clientX - prev.x) / w;
      const dy = (e.clientY - prev.y) / w;
      onChange((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
    } else if (map.size === 2) {
      // Pinch: zoom by how much the distance between the two fingers changed
      const other = Array.from(map.entries()).find(([id]) => id !== e.pointerId)?.[1];
      if (other) {
        const before = Math.hypot(prev.x - other.x, prev.y - other.y);
        const after = Math.hypot(e.clientX - other.x, e.clientY - other.y);
        if (before > 0) onChange((v) => ({ ...v, zoom: v.zoom * (after / before) }));
      }
    }
    map.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 0.05 : 0.01;
    const moves: Record<string, (v: View) => View> = {
      ArrowLeft: (v) => ({ ...v, x: v.x - step }),
      ArrowRight: (v) => ({ ...v, x: v.x + step }),
      ArrowUp: (v) => ({ ...v, y: v.y - step }),
      ArrowDown: (v) => ({ ...v, y: v.y + step }),
      "+": (v) => ({ ...v, zoom: v.zoom * 1.06 }),
      "=": (v) => ({ ...v, zoom: v.zoom * 1.06 }),
      "-": (v) => ({ ...v, zoom: v.zoom / 1.06 }),
    };
    const fn = moves[e.key];
    if (!fn) return;
    e.preventDefault();
    onChange(fn);
  };

  return (
    <div
      ref={frameRef}
      tabIndex={0}
      role="group"
      aria-label="Photo position. Drag to move, pinch or scroll to zoom. With the keyboard, use the arrow keys to move and plus or minus to zoom."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      style={{ aspectRatio: `${width} / ${height}` }}
      className={`relative w-full cursor-move touch-none select-none overflow-hidden border border-slate-300 bg-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066cc] ${className}`}
    >
      <canvas ref={canvasRef} width={width} height={height} className="block h-full w-full" />
      {overlay}
    </div>
  );
}

/** Dashed face guide for photos: top of the head, chin and the middle line. Shown on screen only. */
export function FaceGuide({ width, height, photoH }: { width: number; height: number; photoH: number }) {
  const top = photoH * 0.08;
  const chin = photoH * 0.8;
  const font = Math.max(10, Math.round(width * 0.044));
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <g fill="none" stroke="#0066cc" strokeWidth={Math.max(1, width / 200)} strokeDasharray="8 6" opacity="0.85">
        <ellipse cx={width / 2} cy={(top + chin) / 2} rx={width * 0.3} ry={(chin - top) / 2} />
        <line x1="0" x2={width} y1={top} y2={top} />
        <line x1="0" x2={width} y1={chin} y2={chin} />
        <line x1={width / 2} x2={width / 2} y1="0" y2={photoH} />
      </g>
      <g fill="#0066cc" fontSize={font} fontFamily="Arial, sans-serif" fontWeight="bold">
        <text x="6" y={top - 6}>Top of head</text>
        <text x="6" y={chin + font + 2}>Chin</text>
      </g>
    </svg>
  );
}
