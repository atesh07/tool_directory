"use client";

import { useEffect, useRef, useState } from "react";
import { renderPageToBlob } from "@/lib/pdfjs";

// Draw one page at a time. A queue stops hundreds of thumbnails from asking PDF.js for work at once.
let queue: Promise<unknown> = Promise.resolve();
const enqueue = <T,>(job: () => Promise<T>): Promise<T> => {
  const run = queue.then(job, job);
  queue = run.catch(() => undefined);
  return run;
};

type Props = {
  pdf: any;
  pageNumber: number;
  /** How big to draw the preview (1 = real page size) */
  scale: number;
  alt?: string;
  className?: string;
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
  placeholderClassName?: string;
};

/**
 * A page preview that is only drawn when it scrolls near the screen, and stored as a small JPEG.
 * A 2000-page PDF opens at once and uses very little memory, because only the pages you look at are drawn.
 */
export default function PageThumb({
  pdf,
  pageNumber,
  scale,
  alt = "",
  className = "flex w-full items-center justify-center",
  imgClassName,
  imgStyle,
  placeholderClassName = "h-40 w-28 rounded bg-slate-200 animate-pulse",
}: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el || !pdf || src) return;
    let cancelled = false;
    let url: string | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        enqueue(async () => {
          if (cancelled) return;
          const blob = await renderPageToBlob(pdf, pageNumber, { scale, quality: 0.75 });
          if (cancelled) return;
          url = URL.createObjectURL(blob);
          setSrc(url);
        }).catch(() => !cancelled && setFailed(true));
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [pdf, pageNumber, scale, src]);

  // Free the picture when the page disappears (new file, discard)
  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [src]);

  return (
    <div ref={box} className={className}>
      {src ? (
        <img src={src} alt={alt} className={imgClassName} style={imgStyle} />
      ) : (
        <div className={failed ? "h-40 w-28 rounded bg-red-50" : placeholderClassName} aria-hidden="true" />
      )}
    </div>
  );
}