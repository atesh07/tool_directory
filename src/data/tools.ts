import {
  Combine,
  FileImage,
  FileText,
  FilePlus,
  Pencil,
  RotateCw,
  Scissors,
  type LucideIcon,
} from "lucide-react";

export type Faq = { q: string; a: string };

export type Tool = {
  slug: string;
  name: string;
  /** Page <title>; the site name is added by the layout template */
  title: string;
  /** Meta description, kept under ~155 characters */
  description: string;
  keywords: string[];
  /** Short line under the H1 */
  intro: string;
  /** H1 split so the last word can be highlighted */
  heading: [string, string];
  icon: LucideIcon;
  steps: { title: string; text: string }[];
  features: { title: string; text: string }[];
  faq: Faq[];
  related: string[];
  /** Wider tool area for editors */
  wide?: boolean;
};

export const SITE = {
  name: "ToolsTree",
  tagline: "Free online PDF tools",
  description:
    "Free online PDF tools that run in your browser: edit, merge, split, rotate, convert and manage PDFs without uploading your files.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  // Shown on the Contact, Privacy and Terms pages. Set NEXT_PUBLIC_CONTACT_EMAIL to use another address.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "ehteshamshaikh101@gmail.com",
};

const privacyFaq: Faq = {
  q: "Is it safe to use? Are my files uploaded?",
  a: "Your file is processed inside your own browser. It is not uploaded to our servers, so nobody else can see it.",
};

const freeFaq: Faq = {
  q: "Is it really free?",
  a: "Yes. You can use it as often as you like with no sign-up, watermark or trial limit.",
};

export const TOOLS: Tool[] = [
  {
    slug: "edit-pdf",
    name: "Edit PDF",
    title: "Edit PDF Text Online Free",
    description:
      "Edit text in your PDF online for free. Change words, bold or italic text, with the original font and colour matched. Private: files stay in your browser.",
    keywords: ["edit pdf", "pdf text editor", "edit pdf online free", "change text in pdf", "pdf editor no upload"],
    intro:
      "Click any text in your PDF and change it. Fonts, size and colour are matched to the original. Everything happens in your browser.",
    heading: ["Edit", "PDF Text"],
    icon: Pencil,
    wide: true,
    steps: [
      { title: "Upload your PDF", text: "Drop a PDF onto the page. Every line of text becomes clickable." },
      { title: "Click and type", text: "Edit the text, or select part of a line and press Bold or Italic." },
      { title: "Download", text: "Save the edited PDF. Untouched pages and images stay exactly as they were." },
    ],
    features: [
      { title: "Font matching", text: "The closest matching font, size and colour are used so new text blends in." },
      { title: "Bold and italic", text: "Style a single word instead of the whole line." },
      { title: "Links and icons kept", text: "Underlined links, emoji and icons are left untouched." },
      { title: "Private by design", text: "Your document is never sent to a server." },
    ],
    faq: [
      freeFaq,
      privacyFaq,
      {
        q: "Will the edited text look the same as the original?",
        a: "We match the font family, weight, size and colour. Fonts that are not available online are replaced by the closest similar font, so a small difference in letter shapes is possible.",
      },
      {
        q: "Can I edit scanned PDFs?",
        a: "Not yet. Scanned PDFs are images without real text, so there is nothing to click. Use a PDF with selectable text.",
      },
      {
        q: "Can I edit password-protected PDFs?",
        a: "Protected files can be edited, but they are saved as page images with your text drawn on top, so unchanged text can no longer be selected.",
      },
    ],
    related: ["merge-pdf", "split-pdf", "rotate-pdf"],
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    title: "Merge PDF Files Online Free",
    description:
      "Combine multiple PDF files into one document. Upload, reorder the files and download instantly. Free, no sign-up, files never leave your browser.",
    keywords: ["merge pdf", "combine pdf", "join pdf files", "merge pdf online free", "pdf merger"],
    intro: "Combine several PDFs into one document. Upload, rearrange and download in seconds.",
    heading: ["Merge", "PDF Files"],
    icon: Combine,
    steps: [
      { title: "Add your PDFs", text: "Select two or more PDF files, or drag them onto the page." },
      { title: "Arrange the order", text: "Drag the files into the order you want." },
      { title: "Merge and download", text: "Click merge and save the single combined PDF." },
    ],
    features: [
      { title: "Any number of files", text: "Combine as many PDFs as your device can handle." },
      { title: "Drag to reorder", text: "Set the exact order before merging." },
      { title: "No quality loss", text: "Pages are copied as they are, not re-compressed." },
      { title: "Private", text: "Merging happens on your device." },
    ],
    faq: [
      freeFaq,
      privacyFaq,
      { q: "How many PDFs can I merge?", a: "There is no fixed limit. Very large files depend on the memory of your device." },
      { q: "Will merging reduce quality?", a: "No. Pages are copied directly into the new file without re-compression." },
    ],
    related: ["split-pdf", "remove-pages", "rotate-pdf"],
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    title: "Split PDF Online Free",
    description:
      "Split a PDF by page range, into single pages, or into equal parts. Download as a ZIP. Free and private, processed in your browser.",
    keywords: ["split pdf", "separate pdf pages", "extract pages from pdf", "split pdf online free", "pdf splitter"],
    intro: "Separate one PDF into several files. Choose page ranges, split every page, or cut into equal parts.",
    heading: ["Split", "PDF"],
    icon: Scissors,
    steps: [
      { title: "Upload a PDF", text: "Choose the file you want to split." },
      { title: "Choose how to split", text: "Enter page ranges, split every page, or set a fixed number of pages per file." },
      { title: "Download", text: "Get your files bundled in one ZIP archive." },
    ],
    features: [
      { title: "Custom ranges", text: "Split exactly where you want, for example 1-3, 4-8." },
      { title: "Every page", text: "Turn each page into its own PDF." },
      { title: "ZIP download", text: "Multiple results arrive in one tidy archive." },
      { title: "Private", text: "Your file stays on your device." },
    ],
    faq: [
      freeFaq,
      privacyFaq,
      { q: "Can I extract only some pages?", a: "Yes. Enter the page ranges you need and download just those pages." },
      { q: "In what format do I get the result?", a: "Several files are downloaded together as a ZIP archive." },
    ],
    related: ["remove-pages", "merge-pdf", "rotate-pdf"],
  },
  {
    slug: "remove-pages",
    name: "Remove Pages",
    title: "Remove Pages from PDF Online Free",
    description:
      "Delete unwanted pages from a PDF. Pick pages visually and download the cleaned file. Free, no sign-up, and private in your browser.",
    keywords: ["remove pages from pdf", "delete pdf pages", "delete pages from pdf online", "pdf page remover"],
    intro: "Select the pages you do not need and remove them. The rest of your PDF stays untouched.",
    heading: ["Remove", "PDF Pages"],
    icon: FilePlus,
    steps: [
      { title: "Upload your PDF", text: "Every page appears as a thumbnail." },
      { title: "Select pages to delete", text: "Click the pages you want to remove." },
      { title: "Download", text: "Save the PDF without those pages." },
    ],
    features: [
      { title: "Visual selection", text: "See each page before you delete it." },
      { title: "Multiple pages", text: "Remove one page or many at once." },
      { title: "Original kept", text: "Your uploaded file is never changed." },
      { title: "Private", text: "Processing happens in your browser." },
    ],
    faq: [
      freeFaq,
      privacyFaq,
      { q: "Can I undo a deletion?", a: "Yes. Deselect the page before downloading. Your original file is never modified." },
      { q: "Will the other pages change?", a: "No. The remaining pages are kept exactly as they were." },
    ],
    related: ["split-pdf", "merge-pdf", "rotate-pdf"],
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    title: "Rotate PDF Pages Online Free",
    description:
      "Rotate PDF pages left or right, one by one or all together. Fix sideways scans fast. Free, private, and nothing is uploaded.",
    keywords: ["rotate pdf", "rotate pdf pages", "rotate pdf online free", "fix sideways pdf"],
    intro: "Turn pages 90° left or right, individually or all at once, and save the corrected PDF.",
    heading: ["Rotate", "PDF"],
    icon: RotateCw,
    steps: [
      { title: "Upload your PDF", text: "All pages show up as previews." },
      { title: "Rotate", text: "Rotate a single page or every page left or right." },
      { title: "Download", text: "Save the PDF with the new orientation." },
    ],
    features: [
      { title: "Per page or all pages", text: "Fix just one scanned page or the whole document." },
      { title: "Live preview", text: "See the result before you save." },
      { title: "Lossless", text: "Only the page orientation changes." },
      { title: "Private", text: "Your PDF never leaves your device." },
    ],
    faq: [
      freeFaq,
      privacyFaq,
      { q: "Can I rotate only some pages?", a: "Yes. Use the buttons on each page, or rotate all pages at once." },
      { q: "Does rotating reduce quality?", a: "No. The page content is not re-rendered, only its rotation is changed." },
    ],
    related: ["merge-pdf", "split-pdf", "edit-pdf"],
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    title: "Image to PDF Converter (JPG, PNG) Free",
    description:
      "Convert JPG and PNG images to a PDF. Reorder pictures, smart-scale to the page and download instantly. Free, no sign-up, and private.",
    keywords: ["image to pdf", "jpg to pdf", "png to pdf", "convert images to pdf", "photo to pdf"],
    intro: "Turn photos and images into a clean PDF. Reorder them, scale them to fit, and download.",
    heading: ["Image to", "PDF"],
    icon: FileImage,
    steps: [
      { title: "Add images", text: "Select JPG or PNG files, one or many." },
      { title: "Arrange them", text: "Drag to set the page order." },
      { title: "Create the PDF", text: "Download your images combined as one PDF." },
    ],
    features: [
      { title: "JPG and PNG", text: "The most common image formats are supported." },
      { title: "Smart scaling", text: "Images are fitted to the page without distortion." },
      { title: "Reorder", text: "Put the pictures in any order." },
      { title: "Private", text: "Conversion happens in your browser." },
    ],
    faq: [
      freeFaq,
      privacyFaq,
      { q: "Which image formats work?", a: "JPG/JPEG and PNG images are supported." },
      { q: "Can I put many images in one PDF?", a: "Yes. Each image becomes its own page, in the order you choose." },
    ],
    related: ["pdf-to-image", "merge-pdf", "word-to-pdf"],
  },
  {
    slug: "pdf-to-image",
    name: "PDF to Image",
    title: "PDF to JPG Converter Online Free",
    description:
      "Convert each page of a PDF to a high-quality JPG image. Free, instant, and private: nothing is uploaded to a server.",
    keywords: ["pdf to jpg", "pdf to image", "convert pdf to jpg", "pdf to png", "pdf page to image"],
    intro: "Turn PDF pages into high-resolution JPG images, right in your browser.",
    heading: ["PDF to", "Image"],
    icon: FileImage,
    steps: [
      { title: "Upload your PDF", text: "Choose the document you want to convert." },
      { title: "Convert", text: "Each page is rendered as an image." },
      { title: "Download", text: "Save the images you need." },
    ],
    features: [
      { title: "High resolution", text: "Pages are rendered sharply, ready to share or print." },
      { title: "All pages", text: "Every page becomes its own image." },
      { title: "Fast", text: "Runs on your device, with no queue." },
      { title: "Private", text: "Your PDF is never uploaded." },
    ],
    faq: [
      freeFaq,
      privacyFaq,
      { q: "What image format do I get?", a: "Pages are saved as JPG images." },
      { q: "Is there a page limit?", a: "No fixed limit. Very large documents depend on your device's memory." },
    ],
    related: ["image-to-pdf", "split-pdf", "edit-pdf"],
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    title: "Word to PDF Converter Online Free",
    description:
      "Convert Word (.docx) files to PDF in your browser. Free, fast and private: your document is never uploaded.",
    keywords: ["word to pdf", "docx to pdf", "convert word to pdf", "word to pdf online free"],
    intro: "Convert a Word document to PDF. Processing happens locally, so your file stays private.",
    heading: ["Word to", "PDF"],
    icon: FileText,
    steps: [
      { title: "Upload a .docx", text: "Select the Word file from your device." },
      { title: "Convert", text: "The document is turned into a PDF layout." },
      { title: "Download", text: "Save the PDF instantly." },
    ],
    features: [
      { title: "DOCX support", text: "Works with modern .docx files." },
      { title: "No waiting", text: "No upload and no queue." },
      { title: "Common formatting", text: "Headings, paragraphs, lists and images are converted." },
      { title: "Private", text: "The document is converted on your device." },
    ],
    faq: [
      freeFaq,
      privacyFaq,
      { q: "Will complex formatting be kept?", a: "Common formatting such as headings, lists and images is converted. Very complex layouts may look different from Word." },
      { q: "Is the text in the PDF selectable?", a: "The converted PDF is made from a rendered picture of your document, so its text cannot be selected or searched. Use it for sharing and printing." },
      { q: "Does it support old .doc files?", a: "Only modern .docx files are supported." },
    ],
    related: ["image-to-pdf", "merge-pdf", "edit-pdf"],
  },
];

/** Tools planned but not built yet. They are shown as "coming soon" and are not linked or indexed. */
export const COMING_SOON = [
  "Compress PDF",
  "PDF to Word",
  "Protect PDF",
  "Unlock PDF",
  "Watermark PDF",
  "Sign PDF",
  "Page Numbers",
  "Organize PDF",
  "Extract Pages",
  "OCR PDF",
  "Excel to PDF",
  "PowerPoint to PDF",
];

export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
export const toolPath = (slug: string) => `/tools/${slug}`;

export const HOME_FAQ: Faq[] = [
  {
    q: "Is ToolsTree free?",
    a: "Yes. All tools are free to use with no sign-up, watermark or daily limit.",
  },
  {
    q: "Are my files uploaded to your servers?",
    a: "No. Files are processed inside your browser, so your documents stay on your device.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. Everything runs in your web browser on desktop, tablet or phone.",
  },
  {
    q: "Which PDF tools are available?",
    a: "You can edit PDF text, merge, split, rotate, remove pages, convert images to PDF, PDF to images, and Word to PDF. More tools are on the way.",
  },
];
