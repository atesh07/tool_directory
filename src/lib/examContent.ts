import type { Faq } from "@/data/tools";
import type { DocRule, ExamSpec } from "@/data/exam-specs";

// Page text built from an exam's rules, so every exam page states its own numbers.

export const kbRange = (d: Pick<DocRule, "minKB" | "maxKB">) => (d.minKB ? `${d.minKB} to ${d.maxKB} KB` : `up to ${d.maxKB} KB`);
const range = kbRange;
const px = (d: DocRule) => `${d.width} x ${d.height} px`;
const photoOf = (e: ExamSpec) => e.docs.find((d) => d.kind === "photo");
const signOf = (e: ExamSpec) => e.docs.find((d) => d.kind === "signature");

/** SSC and RRB take the photo live, so their pages are about the signature only */
export const hasPhoto = (e: ExamSpec) => !!photoOf(e);
/** Titles stay under about 58 characters, so the site name still fits in search results */
const fitTitle = (long: string, short: string) => (long.length <= 58 ? long : short);
const titleCase = (t: string) => t.replace(/\b\w/g, (c) => c.toUpperCase());
const kbShort = (d: DocRule) => (d.minKB ? `${d.minKB}-${d.maxKB} KB` : `Under ${d.maxKB} KB`);

export function examTitle(e: ExamSpec) {
  const p = photoOf(e);
  if (!p) {
    const s = e.docs[0];
    return fitTitle(`${e.name} Signature Resize Online: ${kbShort(s)}, Photo Rules`, `${e.name} Signature Resize: ${kbShort(s)}, Photo Rules`);
  }
  return fitTitle(`${e.name} Photo & Signature Resize Online: ${kbShort(p)}`, `${e.name} Photo & Signature Resize: ${kbShort(p)}`);
}

export function examDescription(e: ExamSpec) {
  const p = photoOf(e);
  const s = signOf(e);
  const parts = [p && `photo ${range(p)}`, s && `signature ${range(s)}`].filter(Boolean).join(", ");
  if (!p) return `Resize your ${e.name} ${parts} to the exact size for the online form, plus the live photo rules. Free, works on mobile, nothing is uploaded.`;
  return `Resize your ${e.name} ${parts} to the exact size for the online form. Crop, compress and check, free. Nothing is uploaded.`;
}

export function examH1(e: ExamSpec): [string, string] {
  return hasPhoto(e) ? [`${e.name} Photo & Signature`, "Resizer"] : [`${e.name} Signature`, "Resizer"];
}

export function examSteps(e: ExamSpec) {
  const names = e.docs.map((d) => d.label.toLowerCase());
  const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} or ${names[names.length - 1]}` : names[0];
  const p = photoOf(e);
  return [
    names.length > 1
      ? { title: "Pick the document", text: `${e.name} is already selected. Choose ${list}; the size and KB range from ${e.source} are applied for you.` }
      : { title: "Sign on white paper", text: `Sign with a black pen on plain white paper and take a clear picture of it. The ${e.name} size and KB range are already selected.` },
    { title: "Add your picture", text: "Choose the picture from your gallery or take a new one. JPG, PNG, WebP and iPhone HEIC pictures work." },
    {
      title: "Crop and adjust",
      text: p?.nameDate
        ? "Drag and zoom until the face fits the guide, then type your name and the date the photo was taken for the strip below the face."
        : p
          ? "Drag and zoom until the face fits the guide (or the signature fills the box). Fix the brightness or contrast if needed."
          : "Drag and zoom until the signature fills the box with a little white space around it. Raise the contrast if the ink looks pale.",
    },
    { title: "Make and download", text: `Press Make. The file comes out inside the allowed KB range with a green check, ready to upload to the ${e.name} form.` },
  ];
}

export function examFaq(e: ExamSpec): Faq[] {
  const p = photoOf(e);
  const s = signOf(e);
  const out: Faq[] = [];
  if (p) {
    out.push({
      q: `What is the ${e.name} photo size?`,
      a: `${p.sizeText}, as a ${p.format} file of ${range(p)}. The tool makes it ${px(p)}${p.minWidth ? ` (the form accepts down to ${p.minWidth} x ${p.minHeight} px)` : ""}.${p.background ? ` ${p.background}` : ""}`,
    });
  }
  if (s) {
    out.push({ q: `What is the ${e.name} signature size?`, a: `${s.sizeText}, as a ${s.format} file of ${range(s)}. The tool makes it ${px(s)}. Sign with a black or dark blue pen on plain white paper.` });
  }
  e.docs
    .filter((d) => d.kind !== "photo" && d.kind !== "signature")
    .forEach((d) => out.push({ q: `What size should the ${e.name} ${d.label.toLowerCase()} be?`, a: `${d.sizeText}, ${d.format}, ${range(d)}.${d.notes?.length ? ` ${d.notes[0]}` : ""}` }));
  out.push(...e.faq);
  out.push({
    q: `Are these ${e.name} rules up to date?`,
    a: `They were last checked on ${e.lastVerified} against ${e.source}. Rules can change with every notification, so compare them with the latest one on the official website before you upload.`,
  });
  return out;
}

/** Reasons a form refuses the upload, starting with the ones that apply to this exam's rules */
export function rejectionReasons(e: ExamSpec) {
  const p = photoOf(e);
  const s = signOf(e);
  const out: string[] = [];
  if (p) out.push(`The photo is outside ${range(p)}. Files that are too small are refused as well as files that are too big.`);
  if (s) out.push(`The signature is outside ${range(s)}, or it is a photo of the whole page instead of a close crop of the signature.`);
  if (p?.nameDate) out.push("The name and the date of taking the photo are missing from the photo, or the text is cut off or unreadable.");
  if (!p) {
    out.push(
      "The signature is blurred, very small inside the picture, or written in capital letters.",
      "It was signed on lined or coloured paper, or with a pencil or a light pen.",
      "For the live photo: poor light, a busy background, a cap, mask or glasses, or the face partly outside the frame.",
      "For the live photo: a picture of an old printed photo or of a screen held in front of the camera.",
    );
    return out;
  }
  out.push(
    "The face is too small, cut off at the top, or turned to one side.",
    "The background is dark, patterned or has shadows, or the photo is blurred, too dark or too bright.",
    "A selfie, a group photo, a photo of a printed photo, or an old photo was used.",
    "The file is a PNG, HEIC or PDF when the form wants JPG, or it was renamed instead of converted.",
  );
  return out;
}

export function examTips(e: ExamSpec) {
  const p = photoOf(e);
  if (!p) {
    return [
      "Sign a little larger than usual with a black pen on plain white paper, so the signature stays sharp in a small file.",
      "Photograph it from straight above in daylight. A tilted or shadowed picture looks blurred once it is made small.",
      "Crop close: the signature should fill most of the frame, with a thin white margin.",
      "Before the live photo, sit facing a window in front of a plain wall, keep the phone at eye level and remove cap, mask and glasses.",
      `Use the same signature you will make at the ${e.name} exam centre; a mismatch can cancel the candidature.`,
    ];
  }
  return [
    p?.background ?? "Stand in front of a plain white or light wall, facing a window, so the face is evenly lit without shadows.",
    "Keep the face straight and fill about three quarters of the photo height, from the top of the hair to the chin. Eyes open, mouth closed, no caps or dark glasses.",
    "Sign on plain white paper with a black or dark blue pen, press firmly, and photograph it from straight above in daylight.",
    "Crop closely around the signature or thumb mark. White space wastes the size limit and makes the mark look small.",
    `Use the same photo everywhere in the ${e.name} application and keep a few prints; the same photo is often needed at the exam centre.`,
  ];
}

/* ---------- Pages for one document (signature, thumb impression, declaration) ---------- */

export const docPagePath = (e: ExamSpec, d: DocRule) => `/exam-photo-resizer/${e.slug}/${d.id}`;
/** Documents that get their own page; the photo is the exam page itself */
export const docPages = (e: ExamSpec) => (hasPhoto(e) ? e.docs.filter((d) => d.kind !== "photo") : []);

const docWord = (d: DocRule) => d.label.toLowerCase();

export function docTitle(e: ExamSpec, d: DocRule) {
  const name = `${e.name} ${titleCase(d.label)}`;
  const size = d.minWidth ? "" : `, ${d.width}x${d.height} px`;
  return fitTitle(`${name} Resize Online: ${kbShort(d)}${size}`, `${name} Resize: ${kbShort(d)}${size}`);
}

export function docDescription(e: ExamSpec, d: DocRule) {
  return `Resize your ${e.name} ${docWord(d)} to ${px(d)} and ${kbRange(d)} as a ${d.format} for the online form. Free, works on mobile, nothing is uploaded.`;
}

const HOW: Record<DocRule["kind"], string[]> = {
  photo: [],
  signature: [
    "Sign on plain white paper with a black pen, in your normal handwriting, not in capital letters.",
    "Photograph the signature from straight above in daylight, so there are no shadows or tilt.",
    "Zoom in until the signature fills the frame with a little white space around it.",
  ],
  thumb: [
    "Press your thumb lightly on a stamp pad (black or blue ink) and then once on plain white paper. Lift it straight up.",
    "Photograph the mark from straight above in good light. The lines of the thumb should be visible.",
    "Zoom in until the mark fills most of the frame.",
  ],
  declaration: [
    "Copy the exact declaration text from the notification on white paper, in English, with a black pen and not in capital letters.",
    "Write it inside an area about twice as wide as it is tall, so it fits the frame without tiny letters.",
    "Photograph the page from straight above and zoom in until the text fills the frame.",
  ],
};

export function docSteps(e: ExamSpec, d: DocRule) {
  const how = HOW[d.kind];
  return [
    { title: `Prepare the ${docWord(d)}`, text: how[0] },
    { title: "Take a clear picture", text: how[1] },
    { title: "Fit it in the frame", text: `${how[2]} The frame already has the ${e.name} shape of ${d.width} x ${d.height} px.` },
    { title: "Make and download", text: `Press Make. The file comes out as a ${d.format} of ${kbRange(d)} with a green check for ${e.name}.` },
  ];
}

export function docFaq(e: ExamSpec, d: DocRule): Faq[] {
  const w = docWord(d);
  const out: Faq[] = [
    { q: `What is the ${e.name} ${w} size?`, a: `${d.sizeText}, as a ${d.format} of ${kbRange(d)}. The tool makes it ${px(d)}.` },
    {
      q: `My ${w} file is too small. How do I reach ${d.minKB || "the minimum"} KB?`,
      a: d.minKB
        ? `A clean ${w} on white paper makes a very small file. The tool first saves at full quality and, if that is still under ${d.minKB} KB, adds empty data that viewers ignore, so the file reaches the minimum without changing the picture.`
        : `${e.name} sets no minimum for the ${w}, only a maximum of ${d.maxKB} KB, so a small file is fine.`,
    },
    { q: `Can I make the ${e.name} ${w} on my phone?`, a: "Yes. Take the picture with the phone camera, open this page in the browser, fit it in the frame and download the file. Nothing needs to be installed and nothing is uploaded." },
  ];
  if (d.notes?.length) out.push({ q: `Any special rule for the ${e.name} ${w}?`, a: d.notes.join(" ") });
  out.push({ q: `How do I resize the ${e.name} photo?`, a: `Use the main ${e.name} photo and signature resizer page for the photo. It also has the full size table for every ${e.name} document.` });
  return out;
}

export function docRejections(d: DocRule) {
  const w = docWord(d);
  const common = [`The file is outside ${kbRange(d)}, or it is not a ${d.format}.`];
  const byKind: Record<DocRule["kind"], string[]> = {
    photo: [],
    signature: ["The signature is in capital letters, or does not match the one you will make at the exam.", "It was signed on lined or coloured paper, or with a pencil or a light pen.", "The whole page was uploaded instead of a close crop of the signature."],
    thumb: ["The mark is smudged or too dark, so the lines of the thumb cannot be seen.", "Too much ink was used, or the thumb was pressed twice.", "The picture is tilted or in poor light."],
    declaration: ["The text does not match the wording in the notification, or a word is missing.", "It is written in capital letters, in another language, or typed instead of handwritten.", "The letters are too small to read because the text was written across a whole page."],
  };
  return [...common, ...byKind[d.kind], `A ${w} from another person or an old application was used.`];
}
