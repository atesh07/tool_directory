// Getting a JPG inside a file size range, such as 20 to 50 KB, without touching the page.
// The search only needs an encoder, so it is plain logic that can be tested without a browser.

/** Makes a JPG of the picture at this size and quality (0 to 1) */
export type Encoder = (width: number, height: number, quality: number) => Promise<Uint8Array>;

export type FitOptions = {
  /** Preferred size in pixels */
  width: number;
  height: number;
  /** Smallest size the form accepts, same shape. Leave out when the size must be exact */
  minWidth?: number;
  minHeight?: number;
  minBytes: number;
  maxBytes: number;
  encode: Encoder;
};

export type FitResult = { bytes: Uint8Array; width: number; height: number; quality: number; padded: boolean };

const TOP_Q = 0.92;

/**
 * Highest quality that fits under the maximum; if quality alone is not enough, a smaller picture, never below the
 * smallest allowed size. A result under the minimum is first tried at full quality, then padded (see padJpeg),
 * so the file always ends up inside the range. Throws Error("toosmall") when the maximum cannot be reached.
 */
export async function fitToRange(o: FitOptions): Promise<FitResult> {
  if (o.minBytes > o.maxBytes) throw new RangeError("range");
  const minW = Math.min(o.width, o.minWidth ?? o.width);
  const minH = Math.min(o.height, o.minHeight ?? o.height);
  const lift = (r: FitResult): FitResult =>
    r.bytes.length >= o.minBytes ? r : { ...r, bytes: padJpeg(r.bytes, o.minBytes), padded: true };

  let scale = 1;
  for (let attempt = 0; attempt < 12; attempt++) {
    const w = Math.max(minW, Math.round(o.width * scale));
    const h = Math.max(minH, Math.round(o.height * scale));
    const atMin = w <= minW && h <= minH;

    const top = await o.encode(w, h, TOP_Q);
    if (top.length <= o.maxBytes) {
      if (top.length >= o.minBytes) return { bytes: top, width: w, height: h, quality: TOP_Q, padded: false };
      // Too small: full quality first, padding only if that is still not enough
      const full = await o.encode(w, h, 1);
      if (full.length <= o.maxBytes) return lift({ bytes: full, width: w, height: h, quality: 1, padded: false });
      return lift({ bytes: top, width: w, height: h, quality: TOP_Q, padded: false });
    }

    // While the picture may still get smaller, do not drop the quality too far; at the smallest size, go as low as needed
    const floorQ = atMin ? 0.05 : 0.5;
    const low = await o.encode(w, h, floorQ);
    if (low.length <= o.maxBytes) {
      let lo = floorQ;
      let hi = TOP_Q;
      let fit = low;
      for (let i = 0; i < 8; i++) {
        const mid = (lo + hi) / 2;
        const b = await o.encode(w, h, mid);
        if (b.length <= o.maxBytes) {
          fit = b;
          lo = mid;
        } else hi = mid;
      }
      return lift({ bytes: fit, width: w, height: h, quality: lo, padded: false });
    }
    if (atMin) break;
    // File size drops roughly with the square of the scale, so this lands close on the next try
    scale *= Math.max(0.5, Math.min(0.95, Math.sqrt(o.maxBytes / low.length) * 0.95));
  }
  throw new Error("toosmall");
}

/**
 * Makes a JPG bigger without changing the picture, by adding comment blocks that every viewer skips.
 * Needed when a form sets a minimum size that a small, simple picture (such as a signature) does not reach.
 */
export function padJpeg(src: Uint8Array, target: number): Uint8Array {
  let need = target - src.length;
  if (need <= 0) return src;
  if (src[0] !== 0xff || src[1] !== 0xd8) throw new Error("notjpeg");
  // Insert after the start marker, and after the JFIF header when it comes first, so it stays first
  let at = 2;
  if (src[2] === 0xff && src[3] === 0xe0) at = 4 + ((src[4] << 8) | src[5]);
  const parts: Uint8Array[] = [];
  while (need > 0) {
    const total = Math.min(65537, Math.max(4, need)); // marker (2) + length field (2) + filler
    const seg = new Uint8Array(total);
    seg[0] = 0xff;
    seg[1] = 0xfe;
    seg[2] = (total - 2) >> 8;
    seg[3] = (total - 2) & 0xff;
    parts.push(seg);
    need -= total;
  }
  const extra = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(src.length + extra);
  out.set(src.subarray(0, at), 0);
  let pos = at;
  for (const p of parts) {
    out.set(p, pos);
    pos += p.length;
  }
  out.set(src.subarray(at), pos);
  return out;
}

/**
 * Byte limits for a range given in KB. Portals count 1 KB as 1000 or 1024 bytes, so the minimum uses 1024 and the
 * maximum 1000: the file then passes either way.
 */
export const kbRangeToBytes = (minKB: number, maxKB: number) => ({ minBytes: Math.ceil(minKB * 1024), maxBytes: Math.floor(maxKB * 1000) - 1 });

/** Size of the result as most portals show it (1 KB = 1024 bytes), to one decimal */
export const toKB = (bytes: number) => Math.round((bytes / 1024) * 10) / 10;
