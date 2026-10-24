export type ImageKind = "jpg" | "png" | "webp" | "heic";

/** Tells the real picture type from the first bytes, whatever the file name says */
export async function sniffImage(file: Blob): Promise<ImageKind | null> {
  const b = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "webp";
  if (String.fromCharCode(b[4], b[5], b[6], b[7]) === "ftyp" && /^(heic|heix|hevc|heim|heis|mif1|msf1)/.test(String.fromCharCode(b[8], b[9], b[10], b[11]))) return "heic";
  return null;
}

/** Checks a picture before any work starts: size, kind, and the first bytes (a renamed file is caught here). */
export async function checkImage(file: File, maxMB: number, opts: { allowHeic?: boolean } = {}): Promise<string | null> {
  if (file.size === 0) return `"${file.name}" is empty (0 bytes).`;
  if (file.size > maxMB * 1024 * 1024) return `"${file.name}" is larger than ${maxMB} MB.`;
  const kind = await sniffImage(file);
  if (kind === "heic" && !opts.allowHeic) return `"${file.name}" is a HEIC photo, which is not supported. Share or save it as JPG first.`;
  if (!kind) return `"${file.name}" is not a JPG, PNG or WebP image, or it is damaged.`;
  return null;
}

/** Reads a picture into something a canvas can draw. Phone photos come out the right way up. */
export async function decodeImage(file: Blob): Promise<{ source: CanvasImageSource; width: number; height: number; close: () => void }> {
  if (typeof createImageBitmap === "function") {
    try {
      const bmp = await createImageBitmap(file);
      return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() };
    } catch {
      // fall through to the image element
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, close: () => URL.revokeObjectURL(url) };
  } catch (e) {
    URL.revokeObjectURL(url);
    throw e;
  }
}

export const canvasToJpeg = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("canvas"))), "image/jpeg", quality));

/** Writes the print resolution into a JPG's JFIF header, so photo apps and printers know its size in mm. */
export async function withJpegDpi(blob: Blob, dpi: number): Promise<Blob> {
  const b = new Uint8Array(await blob.arrayBuffer());
  const jfif = b[2] === 0xff && b[3] === 0xe0 && b[6] === 0x4a && b[7] === 0x46 && b[8] === 0x49 && b[9] === 0x46 && b[10] === 0;
  if (!jfif) return blob;
  b[13] = 1; // dots per inch
  b[14] = dpi >> 8;
  b[15] = dpi & 0xff;
  b[16] = dpi >> 8;
  b[17] = dpi & 0xff;
  return new Blob([b], { type: "image/jpeg" });
}
