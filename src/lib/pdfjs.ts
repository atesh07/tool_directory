// One place that loads PDF.js, and only when a visitor actually opens a PDF (it is about 400 kB with its worker).

let pending: Promise<any> | null = null;

export function loadPdfJs(): Promise<any> {
  if (!pending) {
    pending = (async () => {
      const lib = await import("pdfjs-dist/build/pdf");
      const worker = await import("pdfjs-dist/build/pdf.worker.min.js");
      lib.GlobalWorkerOptions.workerSrc = worker.default;
      return lib;
    })();
    // If loading fails (for example the connection dropped), allow another try next time
    pending.catch(() => {
      pending = null;
    });
  }
  return pending;
}

/** Starts loading in the background, for example when the visitor points at the upload button */
export function prefetchPdfJs() {
  loadPdfJs().catch(() => undefined);
}

/** Opens a PDF file for reading. Pages are drawn one at a time later, so memory use stays small. */
export async function openPdf(file: File): Promise<any> {
  const pdfjs = await loadPdfJs();
  const data = new Uint8Array(await file.arrayBuffer());
  return pdfjs.getDocument({ data }).promise;
}

/** Draws one page and returns it as a JPEG. The canvas is released straight away. */
export async function renderPageToBlob(
  pdf: any,
  pageNumber: number,
  options: { scale: number; maxSide?: number; quality?: number }
): Promise<Blob> {
  const page = await pdf.getPage(pageNumber);
  try {
    const base = page.getViewport({ scale: 1 });
    const limit = options.maxSide ? options.maxSide / Math.max(base.width, base.height) : Infinity;
    const viewport = page.getViewport({ scale: Math.min(options.scale, limit) });
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    // JPEG has no transparency; draw on white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", options.quality ?? 0.8));
    canvas.width = 0;
    canvas.height = 0;
    if (!blob) throw new Error("canvas");
    return blob;
  } finally {
    page.cleanup();
  }
}
