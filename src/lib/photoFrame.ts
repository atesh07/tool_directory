import { decodeImage } from "@/lib/imageFile";

// Framing a photo inside a fixed box: the maths for zoom, shift and turn, and drawing the result at any pixel size.
// Used by the passport photo maker and the exam photo resizer.

export type Work = { source: HTMLCanvasElement; width: number; height: number };
/** Zoom, shift (as a share of the frame width), quarter turns, fine tilt in degrees, brightness and contrast in percent */
export type View = { zoom: number; x: number; y: number; turns: number; tilt: number; light: number; contrast: number };
export type Label = { name: string; date: string };

export const START_VIEW: View = { zoom: 1, x: 0, y: 0, turns: 0, tilt: 0, light: 0, contrast: 0 };
export const MAX_ZOOM = 4;
const MAX_PIXELS = 100_000_000; // refuse pictures the browser could not hold in memory
/** Share of the height used by the name and date strip */
export const BAND = 0.18;

export const photoHeight = (H: number, label: boolean) => (label ? Math.round(H * (1 - BAND)) : H);

/** Scale and allowed shift that keep the frame fully covered by the photo, whatever the zoom and angle. */
function geometry(iw: number, ih: number, W: number, H: number, v: View) {
  const a = ((v.turns * 90 + v.tilt) * Math.PI) / 180;
  const c = Math.abs(Math.cos(a));
  const s = Math.abs(Math.sin(a));
  const bw = W * c + H * s; // the frame, seen along the photo's own axes
  const bh = W * s + H * c;
  const scale = Math.max(bw / iw, bh / ih) * v.zoom;
  return { a, scale, slackX: (iw * scale - bw) / 2, slackY: (ih * scale - bh) / 2 };
}

/** Keeps the zoom in range and stops the photo from being dragged so far that white shows at an edge. */
export function clampView(v: View, img: Work, W: number, H: number): View {
  const zoom = Math.min(MAX_ZOOM, Math.max(1, v.zoom));
  const g = geometry(img.width, img.height, W, H, { ...v, zoom });
  const dx = v.x * W;
  const dy = v.y * W;
  const cos = Math.cos(g.a);
  const sin = Math.sin(g.a);
  const u = Math.max(-g.slackX, Math.min(g.slackX, dx * cos + dy * sin));
  const w = Math.max(-g.slackY, Math.min(g.slackY, -dx * sin + dy * cos));
  return { ...v, zoom, x: (u * cos - w * sin) / W, y: (u * sin + w * cos) / W };
}

/** Draws the finished picture (and the name strip, if any) at any pixel size with the same framing. */
export function renderFrame(canvas: HTMLCanvasElement, img: Work, W: number, H: number, view: View, label: Label | null) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  const ph = photoHeight(H, !!label);
  // White first, so a transparent PNG ends up on white
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  const v = clampView(view, img, W, ph);
  const g = geometry(img.width, img.height, W, ph, v);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, ph);
  ctx.clip();
  ctx.translate(W / 2 + v.x * W, ph / 2 + v.y * W);
  ctx.rotate(g.a);
  ctx.scale(g.scale, g.scale);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img.source, -img.width / 2, -img.height / 2);
  ctx.restore();

  if (v.light || v.contrast) {
    // Done by hand because canvas filters are missing in some Safari versions
    const f = 1 + v.light / 100;
    const k = 1 + v.contrast / 100;
    const data = ctx.getImageData(0, 0, W, ph);
    const p = data.data;
    for (let i = 0; i < p.length; i += 4) {
      p[i] = (p[i] * f - 128) * k + 128;
      p[i + 1] = (p[i + 1] * f - 128) * k + 128;
      p[i + 2] = (p[i + 2] * f - 128) * k + 128;
    }
    ctx.putImageData(data, 0, 0);
  }

  if (label) {
    const band = H - ph;
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const line = (text: string, size: number, weight: string, y: number) => {
      if (!text) return;
      let s = size;
      ctx.font = `${weight} ${s}px Arial, Helvetica, sans-serif`;
      while (s > 6 && ctx.measureText(text).width > W * 0.94) {
        s -= 1;
        ctx.font = `${weight} ${s}px Arial, Helvetica, sans-serif`;
      }
      ctx.fillText(text, W / 2, y);
    };
    const both = label.name && label.date;
    line(label.name, Math.round(band * 0.34), "bold", ph + band * (both ? 0.32 : 0.5));
    line(label.date, Math.round(band * 0.28), "normal", ph + band * (both ? 0.74 : 0.5));
  }
}

/** Reads the photo once and keeps a smaller copy, so moving and zooming stay smooth on phones. */
export async function prepareImage(file: Blob, maxSide = 2000): Promise<Work> {
  const img = await decodeImage(file);
  const temp: HTMLCanvasElement[] = [];
  try {
    if (!img.width || !img.height) throw new Error("size");
    if (img.width * img.height > MAX_PIXELS) throw new Error("pixels");
    const r = Math.min(1, maxSide / Math.max(img.width, img.height));
    const tw = Math.max(1, Math.round(img.width * r));
    const th = Math.max(1, Math.round(img.height * r));
    let src: CanvasImageSource = img.source;
    let w = img.width;
    let h = img.height;
    // Halve in steps: one big jump down makes the picture grainy in some browsers
    while (w / 2 >= tw) {
      const c = document.createElement("canvas");
      c.width = Math.round(w / 2);
      c.height = Math.round(h / 2);
      const ctx = c.getContext("2d");
      if (!ctx) throw new Error("canvas");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(src, 0, 0, c.width, c.height);
      temp.push(c);
      src = c;
      w = c.width;
      h = c.height;
    }
    const out = document.createElement("canvas");
    out.width = tw;
    out.height = th;
    const ctx = out.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(src, 0, 0, tw, th);
    return { source: out, width: tw, height: th };
  } finally {
    img.close();
    temp.forEach((c) => {
      c.width = 0;
      c.height = 0;
    });
  }
}

/** Frees the memory a prepared photo holds */
export const releaseWork = (w: Work | null) => {
  if (!w) return;
  w.source.width = 0;
  w.source.height = 0;
};
