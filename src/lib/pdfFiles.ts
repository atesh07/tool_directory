// Shared checks and friendly error text for the PDF tools

export const MAX_PDF_MB = 150;
export const MAX_IMAGE_MB = 30;
export const MAX_DOCX_MB = 25;

/** Looks at the file itself (size, name and the first bytes) before any heavy work starts. Returns a message, or null if it looks fine. */
export async function checkPdfFile(file: File): Promise<string | null> {
  if (file.size === 0) return "This file is empty (0 bytes). Please choose a different PDF.";
  if (file.size > MAX_PDF_MB * 1024 * 1024) {
    return `This file is larger than ${MAX_PDF_MB} MB. Files this big can crash the browser tab, so please use a smaller one.`;
  }
  const looksLikePdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  if (!looksLikePdf) return "Please choose a PDF file (.pdf).";
  const head = new TextDecoder("latin1").decode(await file.slice(0, 1024).arrayBuffer());
  if (!head.includes("%PDF-")) return "This file is not a valid PDF, or it is damaged.";
  return null;
}

/** Turns whatever pdf.js or pdf-lib threw into one clear sentence for the visitor. */
export function pdfErrorMessage(err: unknown): string {
  const name = (err as { name?: string } | null)?.name ?? "";
  const text = err instanceof Error ? err.message : String(err ?? "");
  if (name === "PasswordException" || /password|encrypted/i.test(text)) {
    return "This PDF is password protected. Remove the password first, then try again.";
  }
  if (name === "InvalidPDFException" || /invalid pdf|failed to parse|no pdf header|xref|trailer|unexpected end/i.test(text)) {
    return "This PDF looks damaged or incomplete, so it could not be read.";
  }
  if (name === "MissingPDFException") return "The PDF could not be found. Please choose the file again.";
  return "Something went wrong while reading this PDF. Please try a different file.";
}

/** Same idea for images: checks the name, the size and the first bytes of the file. */
export async function checkImageFile(file: File): Promise<string | null> {
  if (file.size === 0) return `"${file.name}" is empty (0 bytes).`;
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) return `"${file.name}" is larger than ${MAX_IMAGE_MB} MB.`;
  if (!/^image\/(png|jpe?g)$/i.test(file.type) && !/\.(png|jpe?g)$/i.test(file.name)) {
    return `"${file.name}" is not a JPG or PNG image.`;
  }
  const b = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const isJpg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const isPng = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
  if (!isJpg && !isPng) return `"${file.name}" is not a real JPG or PNG image, or it is damaged.`;
  return null;
}
