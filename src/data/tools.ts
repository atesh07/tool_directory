import {
  Binary,
  Braces,
  Combine,
  FileImage,
  FileText,
  FilePlus,
  Link2,
  Pencil,
  RotateCw,
  Scissors,
  Shrink,
  type LucideIcon,
} from "lucide-react";

export type Faq = { q: string; a: string };

export type CategoryId = "organize" | "to-pdf" | "from-pdf" | "images" | "web";

export type Tool = {
  slug: string;
  name: string;
  category: CategoryId;
  /** Page <title>; the site name is added by the layout template */
  title: string;
  /** Meta description, kept under ~160 characters */
  description: string;
  keywords: string[];
  /** Short line under the H1 and on cards */
  intro: string;
  /** H1 split so the last word can be highlighted */
  heading: [string, string];
  icon: LucideIcon;
  steps: { title: string; text: string }[];
  /** What the tool does and how it works, in plain words (2 to 3 short paragraphs) */
  about: string[];
  useCases: string[];
  /** Supported files and limits, shown as a table before anyone uploads */
  specs: { label: string; value: string }[];
  /** Honest limitations */
  limits: string[];
  troubleshooting: { problem: string; fix: string }[];
  faq: Faq[];
  /** Sentences that link to other tools inside the text */
  next: { slug: string; text: string }[];
  /** Guides (slugs from data/guides.ts) shown on this page */
  guides: string[];
  related: string[];
  /** Optional lookup table shown after the specs (for example a list of codes) */
  reference?: { heading: string; intro: string; head: string[]; rows: string[][] };
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

export const CATEGORIES: { id: CategoryId; name: string; description: string }[] = [
  {
    id: "organize",
    name: "Edit and organize PDFs",
    description: "Change text, put files together, take them apart, drop pages or turn them the right way up.",
  },
  {
    id: "to-pdf",
    name: "Convert to PDF",
    description: "Turn photos, screenshots and Word documents into a PDF you can share or print.",
  },
  {
    id: "from-pdf",
    name: "Convert from PDF",
    description: "Turn PDF pages into pictures for slides, posts and websites.",
  },
  {
    id: "images",
    name: "Image tools",
    description: "Make photos smaller so they fit the upload limits of forms, portals and email.",
  },
  {
    id: "web",
    name: "Web and text tools",
    description: "Small everyday helpers for links, text and web work. They run in your browser too.",
  },
];

export const TOOLS: Tool[] = [
  {
    slug: "edit-pdf",
    name: "Edit PDF",
    category: "organize",
    title: "Edit PDF Text Online Free, Same Font",
    description:
      "Edit text in your PDF online with the font, size and colour matched. Free, no sign-up, and your file never leaves your browser.",
    keywords: ["edit pdf text", "edit pdf online free", "edit pdf text same font", "change text in pdf", "edit pdf without login"],
    intro:
      "Click any text in your PDF and change it. The original font, size and colour are matched, and your file stays in your browser.",
    heading: ["Edit", "PDF Text"],
    icon: Pencil,
    wide: true,
    steps: [
      { title: "Open your PDF", text: "Choose a PDF whose text can be selected (not a scan). Every line on the page becomes clickable." },
      { title: "Click and type", text: "Click a line and type. To style only some words, select them first and press Bold or Italic." },
      { title: "Check the page", text: "Use the zoom buttons to look closely. The page you see is the page you will download." },
      { title: "Download", text: "Press Download PDF. Pages and images you did not touch stay exactly as they were." },
    ],
    about: [
      "A PDF does not store text the way a Word document does. Each line is placed on the page as separate pieces, each with its own font, size and position. That is why many online editors change the font of everything you touch: they do not have the font the document used.",
      "Edit PDF reads those pieces, finds which font each one uses, and loads the same or the closest matching open font. The words you type are drawn in that font, in the same size and colour, so they blend into the words around them. By default the whole page is rebuilt in the matching font so edited and untouched lines look alike. If you prefer to leave every untouched line exactly as the PDF drew it, switch off “Convert all text first”.",
      "Everything happens in your browser. The PDF is not uploaded, so you can fix your own CV, invoice or letter without sending it to a server.",
    ],
    useCases: [
      "Fix a typo or an old date in a CV, letter or invoice you made yourself",
      "Update a phone number or address in a flyer when you no longer have the original file",
      "Change one word in a report or brochure without rebuilding the layout",
      "Make a word bold or italic in a finished PDF",
    ],
    specs: [
      { label: "Works with", value: "PDF files that contain real text (not scans or photos)" },
      { label: "Largest file", value: "150 MB" },
      { label: "Result", value: "A new PDF named edited_<your file name>.pdf" },
      { label: "Fonts", value: "Matching open fonts are fetched while you edit; standard fonts are used if you are offline" },
      { label: "Where it runs", value: "In your browser. Nothing is uploaded." },
      { label: "Account needed", value: "No" },
    ],
    limits: [
      "Scanned PDFs are pictures of text, so there is nothing to click. ToolsTree tells you when it finds no editable text.",
      "Text is edited line by line, as the PDF stores it, not as a flowing paragraph. If you make a line longer, the next line does not move down.",
      "Letters outside the Latin alphabet, such as Hindi (Devanagari), and some symbols such as ₹ are not supported yet and appear as ?. Support is planned.",
      "PDFs with a password cannot be opened. PDFs whose pages are rotated or use an offset page box are saved as page images with your text on top. They look the same, but text can no longer be selected and links stop working.",
      "Edit PDF covers the old text; it is not a redaction tool. Do not use it to hide private information, because the original words can still be inside the file. Use real redaction software for that.",
      "Use it for your own documents only. Changing identity documents, certificates, mark sheets or other official records is not allowed (see the Terms).",
    ],
    troubleshooting: [
      { problem: "It says no editable text was found", fix: "The PDF is probably a scan or a photo saved as PDF. Open it in a PDF reader and try to select a word: if you cannot, there is no text to edit." },
      { problem: "The new text looks a little different from the old text", fix: "The original font may not exist as an open font, so the closest match is used. Keep “Convert all text first” switched on so the whole page uses one font." },
      { problem: "Hindi or ₹ turns into question marks", fix: "Those characters are not supported yet. Keep the original word or use a different tool for that line." },
      { problem: "The Download button is greyed out", fix: "It switches on after your first change. Click a line and type something." },
      { problem: "The text is too small on my phone", fix: "The page is shrunk to fit the screen. Use the plus button in the toolbar to zoom in, then tap the line you want to change." },
      { problem: "A longer line now touches the next word", fix: "Lines do not reflow. Shorten the line or edit the word next to it as well." },
    ],
    faq: [
      { q: "Is it free to edit a PDF here?", a: "Yes. There is no sign-up, no watermark and no limit on how many PDFs you edit." },
      { q: "Is my PDF sent to a server when I edit it?", a: "No. The PDF is opened and changed inside your browser. The only thing fetched from the internet is the matching fonts; nothing from your document is sent." },
      { q: "Can I edit a PDF and keep the same font?", a: "Usually yes. Edit PDF finds the font each line uses and loads the same or the closest matching open font. For fonts that have no open version, such as some commercial fonts, the closest look-alike is used, so tiny differences in letter shapes are possible." },
      { q: "Can I edit a scanned PDF?", a: "Not with this tool. A scan has no text, only a picture of it. You would need OCR (text recognition) first, which ToolsTree does not offer yet." },
      { q: "Can I add new text boxes or images?", a: "Not yet. You can change, delete or restyle text that is already on the page." },
      { q: "Can I edit a PDF on my phone?", a: "Yes, in a modern phone browser. The page fits the screen and you can zoom in with the toolbar to tap small lines." },
      { q: "Is the old text really gone after I edit it?", a: "Not always. In most files the old words are hidden under the new ones but can still be inside the PDF. Do not use this tool to remove confidential information." },
    ],
    next: [
      { slug: "merge-pdf", text: "Finished editing? Put it together with other documents using Merge PDF." },
      { slug: "remove-pages", text: "Delete pages you do not need with Remove Pages." },
      { slug: "rotate-pdf", text: "If a page is sideways, fix it first with Rotate PDF." },
    ],
    guides: ["edit-text-in-a-pdf"],
    related: ["merge-pdf", "remove-pages", "rotate-pdf"],
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    category: "organize",
    title: "Merge PDF Files Online Free",
    description:
      "Combine PDF files into one document. Drag to reorder, then download. Free, no sign-up, and your files never leave your browser.",
    keywords: ["merge pdf", "combine pdf", "join pdf files", "merge pdf online free", "merge pdf without upload"],
    intro: "Combine several PDFs into one document. Add the files, put them in order and download.",
    heading: ["Merge", "PDF Files"],
    icon: Combine,
    steps: [
      { title: "Add your PDFs", text: "Choose two or more PDF files, or drag them onto the page. You can add more at any time." },
      { title: "Set the order", text: "Drag the cards, or use the arrow buttons under each one. The number on a card is its place in the final file." },
      { title: "Remove mistakes", text: "Press the red button on a card to take a file out of the list." },
      { title: "Merge and download", text: "Press the merge button. The combined PDF is saved to your device." },
    ],
    about: [
      "Merging copies every page of each PDF, in the order you choose, into one new file. The pages are copied as they are, so text stays sharp and nothing is recompressed.",
      "The arrow buttons make it easy to reorder on a phone, where dragging is awkward, and they work with a keyboard too. Files that cannot be read (damaged or password protected) are rejected as soon as you add them, with the file name in the message, so you do not find out after waiting.",
      "Because the work happens in your browser, confidential files such as payslips, bank statements or ID copies are not sent to anyone.",
    ],
    useCases: [
      "Join scanned pages with a typed cover letter",
      "Put several invoices or receipts into one file for an email",
      "Combine lecture notes or chapters into one document",
      "Assemble an application with certificates in the order the form asks for",
    ],
    specs: [
      { label: "Works with", value: "PDF files, two or more" },
      { label: "Largest file", value: "150 MB each" },
      { label: "Order", value: "Drag the cards or use the arrow buttons" },
      { label: "Result", value: "One PDF named merged_<number>.pdf" },
      { label: "Password-protected PDFs", value: "Not supported; they are rejected when you add them" },
      { label: "Where it runs", value: "In your browser. Nothing is uploaded." },
    ],
    limits: [
      "Bookmarks (the outline in the sidebar) and document properties of the original files are not carried over; the pages are.",
      "Page numbers printed inside the PDFs stay as they were. The merged file is not renumbered.",
      "This tool does not shrink files, so the result is about as big as the files together. Very large or many files need a lot of memory on small devices.",
      "Only PDFs can be merged. Turn photos into PDF first with Image to PDF, and Word files with Word to PDF.",
    ],
    troubleshooting: [
      { problem: "One file was not added", fix: "The message names the file. It is usually password protected, damaged, empty or not a real PDF. Remove the password in a PDF reader and add it again." },
      { problem: "The merge button is disabled", fix: "You need at least two PDFs in the list." },
      { problem: "The pages are in the wrong order", fix: "Use the left and right arrow buttons under a card to move it, then merge again." },
      { problem: "The merged file is too big to email", fix: "Merging does not compress. Remove files you do not need, or split off only the pages you must send with Split PDF." },
      { problem: "The browser tab becomes slow or crashes", fix: "Merge fewer or smaller files at a time, then merge the results together." },
    ],
    faq: [
      { q: "Is merging free, and is there a limit?", a: "Yes, it is free with no account and no watermark. The only limit is the memory of your device." },
      { q: "Are my files uploaded when I merge them?", a: "No. Every file is read and combined on your own device. You can confirm it in your browser's developer tools: the Network tab shows that no request carries your files." },
      { q: "How many PDFs can I merge?", a: "There is no fixed number. The limit is the memory of your device: a phone handles a few dozen normal files, a laptop many more." },
      { q: "Does merging reduce quality?", a: "No. Pages are copied directly into the new file without recompression, so text and images look exactly as before." },
      { q: "Is combining PDFs the same as merging them?", a: "Yes. Merge, combine and join all mean putting several PDFs into one file." },
      { q: "Can I merge a PDF with a JPG?", a: "Convert the picture first with Image to PDF, then merge the two PDFs." },
    ],
    next: [
      { slug: "split-pdf", text: "Need only part of the result? Cut it up again with Split PDF." },
      { slug: "remove-pages", text: "Drop pages you do not need with Remove Pages." },
      { slug: "image-to-pdf", text: "Have photos or screenshots? Turn them into a PDF with Image to PDF first." },
    ],
    guides: ["merge-pdf-files-without-uploading"],
    related: ["split-pdf", "remove-pages", "image-to-pdf"],
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    category: "organize",
    title: "Split PDF & Extract Pages Free",
    description:
      "Split a PDF by page range, into single pages or equal parts, and extract the pages you need. Free, private, and runs in your browser.",
    keywords: ["split pdf", "extract pages from pdf", "separate pdf pages", "split pdf by page range", "split pdf online free"],
    intro: "Split one PDF into several files, or pull out just the pages you need.",
    heading: ["Split", "PDF"],
    icon: Scissors,
    steps: [
      { title: "Open your PDF", text: "Choose the PDF. Thumbnails of its pages appear." },
      { title: "Pick how to split", text: "Custom ranges (for example 1-3, 5, 8-10), every page as its own file, or a fixed number of pages per file." },
      { title: "Check the colours", text: "Each output file has its own colour on the thumbnails, and the page tells you how many files it will make." },
      { title: "Download", text: "One file downloads as a PDF. Several files download together in one ZIP." },
    ],
    about: [
      "Split PDF makes new PDFs out of pages of an existing one. Each range you type becomes its own file, so “1-3, 4-8” gives two PDFs, and a single range such as “5-9” simply extracts those pages into one new PDF.",
      "The thumbnails are colour-coded by output file, so you can see before downloading which page lands where. Pages not covered by any range are greyed out as “Not included”.",
      "The original file is never changed. Everything happens in your browser, so the pages never leave your device.",
    ],
    useCases: [
      "Extract the pages of a long document that you need to send",
      "Cut a scanned book or file into chapters",
      "Save every page as a separate PDF (for example one per payslip)",
      "Split a big PDF into parts that fit an email size limit",
    ],
    specs: [
      { label: "Works with", value: "One PDF file" },
      { label: "Largest file", value: "150 MB" },
      { label: "Modes", value: "Custom ranges, every page, every N pages" },
      { label: "Range format", value: "Numbers and dashes separated by commas, for example 1-3, 5, 8-10" },
      { label: "Result", value: "One PDF, or a ZIP of PDFs when there are several files" },
      { label: "Where it runs", value: "In your browser. Nothing is uploaded." },
    ],
    limits: [
      "Password-protected PDFs cannot be opened.",
      "Bookmarks of the original file are not carried over to the new files.",
      "Page ranges can overlap. A page in two ranges appears in both files.",
      "Splitting does not make the pages smaller: a 50-page file split in two gives two files that together are about as big as the original.",
    ],
    troubleshooting: [
      { problem: "It says a range is outside the pages", fix: "The page count is shown next to the file name. Use numbers from 1 to that count, and put the smaller number first (3-5, not 5-3)." },
      { problem: "I only get one big file when I wanted several", fix: "Each comma-separated range becomes its own file. Write 1-2, 3-4 instead of 1-4." },
      { problem: "The download is a ZIP and I wanted a PDF", fix: "When your ranges make more than one file, they are packed into a ZIP. Use a single range to get one PDF." },
      { problem: "The split button is disabled", fix: "Fix the message under the range box first; the button turns on when the ranges are valid." },
    ],
    faq: [
      { q: "Do I need to pay or sign up to split a PDF?", a: "No. Splitting is free, with no account and no daily limit." },
      { q: "Does my PDF leave my device when I split it?", a: "No. The pages are cut apart in your browser, and the ZIP is built on your device, not on a server." },
      { q: "How do I extract pages from a PDF?", a: "Choose Custom Ranges and type the pages you want as one range, for example 4-7. You get a new PDF with only those pages. Every extra range makes another file. To keep pages that are not next to each other (such as 2, 9 and 12) in one file, extract them and combine them with Merge PDF, or delete all the other pages with Remove Pages." },
      { q: "Can I split every page into its own file?", a: "Yes. Choose Every Page. The files download together in one ZIP." },
      { q: "In what format do I get several files?", a: "As a single ZIP file that contains one PDF per range." },
      { q: "Will the original PDF be changed?", a: "No. Your file stays as it is; new files are created on your device." },
    ],
    next: [
      { slug: "remove-pages", text: "If you only want to delete a few pages, Remove Pages is quicker." },
      { slug: "merge-pdf", text: "Want to put pieces back together in a new order? Use Merge PDF." },
      { slug: "pdf-to-image", text: "Need the pages as pictures? Use PDF to Image." },
    ],
    guides: ["split-pdf-by-page-range"],
    related: ["remove-pages", "merge-pdf", "pdf-to-image"],
  },
  {
    slug: "remove-pages",
    name: "Remove Pages",
    category: "organize",
    title: "Delete Pages from PDF Online Free",
    description:
      "Remove or delete unwanted pages from a PDF. Click the pages you do not need and download the cleaned file. Free and private.",
    keywords: ["delete pages from pdf", "remove pages from pdf", "remove pages from pdf free", "delete pdf pages online"],
    intro: "Click the pages you do not need and download the PDF without them.",
    heading: ["Remove", "PDF Pages"],
    icon: FilePlus,
    steps: [
      { title: "Open your PDF", text: "Every page appears as a thumbnail." },
      { title: "Select pages to remove", text: "Tap or click a page. It turns red and is marked Removed. Tap it again to keep it." },
      { title: "Check the count", text: "The download button shows how many pages will be removed." },
      { title: "Download", text: "Save the PDF without those pages." },
    ],
    about: [
      "Remove Pages deletes the pages you mark and keeps the rest exactly as they were. You see every page before you decide, which is safer than typing page numbers from memory.",
      "The thumbnails work with touch, mouse and keyboard (Tab to a page, then Enter or Space). The tool will not let you remove every page: at least one has to stay.",
      "Your original file is not changed, and nothing is uploaded.",
    ],
    useCases: [
      "Delete blank pages from a scan",
      "Take out the cover or advertisement pages before sharing",
      "Remove a page with private details before emailing a document",
      "Trim a long report down to the pages that matter",
    ],
    specs: [
      { label: "Works with", value: "One PDF file" },
      { label: "Largest file", value: "150 MB" },
      { label: "How to choose pages", value: "Tap or click thumbnails (keyboard: Enter or Space)" },
      { label: "Rule", value: "At least one page must stay" },
      { label: "Result", value: "A new PDF named removed_pages_<your file name>.pdf" },
      { label: "Where it runs", value: "In your browser. Nothing is uploaded." },
    ],
    limits: [
      "Password-protected PDFs cannot be opened.",
      "Every page is drawn as a small preview first, so a PDF with hundreds of pages takes a while to appear.",
      "Bookmarks that pointed to deleted pages are not kept.",
      "Deleting a page from the new file does not change your original, so keep the original if you may need those pages again.",
    ],
    troubleshooting: [
      { problem: "The download button is greyed out", fix: "You have marked every page for removal. Tap a page to keep it, or use Reset Selection." },
      { problem: "I marked the wrong page", fix: "Tap it again to un-mark it, or press Reset Selection to start over." },
      { problem: "Pages take a long time to appear", fix: "Large PDFs are previewed page by page. Wait for the progress text to finish, or split the file into parts first." },
      { problem: "It says the PDF is password protected", fix: "Remove the password in a PDF reader first, then try again." },
    ],
    faq: [
      { q: "Is Remove Pages free?", a: "Yes, with no sign-up and no limit on files or pages." },
      { q: "Is it safe to remove pages with private details?", a: "Yes in the sense that the file never leaves your device: the previews and the new PDF are made in your browser. Always open the new file and check that the private details are gone from every page." },
      { q: "How do I delete a page from a PDF?", a: "Open the file, tap the page you want to delete so it turns red, then press Download PDF." },
      { q: "Can I delete several pages at once?", a: "Yes. Mark as many pages as you like. The button shows how many will be removed." },
      { q: "Is deleting different from extracting?", a: "They are two sides of the same job. Remove Pages keeps everything except what you mark. Split PDF keeps only the pages you list." },
      { q: "Does it work on a phone?", a: "Yes. The pages are large touch targets and the layout fits small screens." },
    ],
    next: [
      { slug: "split-pdf", text: "To keep only certain pages instead, use Split PDF." },
      { slug: "rotate-pdf", text: "If pages are sideways rather than unwanted, use Rotate PDF." },
      { slug: "merge-pdf", text: "Then combine the cleaned file with others in Merge PDF." },
    ],
    guides: ["delete-pages-from-a-pdf"],
    related: ["split-pdf", "rotate-pdf", "merge-pdf"],
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    category: "organize",
    title: "Rotate PDF Pages Online Free",
    description:
      "Rotate PDF pages left or right, one by one or all together, and save them that way for good. Free, private, no upload.",
    keywords: ["rotate pdf", "rotate pdf pages", "rotate pdf online free", "fix sideways pdf", "rotate pdf permanently"],
    intro: "Turn pages 90° left or right, one at a time or all together, and save the PDF that way.",
    heading: ["Rotate", "PDF"],
    icon: RotateCw,
    steps: [
      { title: "Open your PDF", text: "Every page appears as a preview." },
      { title: "Rotate", text: "Use the two round buttons under a page for that page, or All Left and All Right at the top." },
      { title: "Look at the previews", text: "The previews turn as you click, so you see the final direction before saving." },
      { title: "Download", text: "Save the PDF. The new direction is stored in the file." },
    ],
    about: [
      "Many viewers let you rotate a page only while you are looking at it. Close the file and it is sideways again. Rotate PDF changes the rotation setting stored inside the file, so every viewer shows the page the way you set it.",
      "Only the rotation changes. The text, images and quality of each page are not touched, because the page is not re-drawn.",
      "You can fix a single scanned page that went in sideways or turn the whole document, and the preview shows the result before you download.",
    ],
    useCases: [
      "Fix a page that was scanned sideways or upside down",
      "Make a landscape table readable on a portrait document",
      "Turn a whole photographed document the right way up",
      "Prepare a PDF so it prints in the right direction",
    ],
    specs: [
      { label: "Works with", value: "One PDF file" },
      { label: "Largest file", value: "150 MB" },
      { label: "Turns", value: "90° steps, left or right, per page or all pages" },
      { label: "Result", value: "A new PDF named rotated_<your file name>.pdf" },
      { label: "Quality", value: "Unchanged. Only the page rotation setting is edited." },
      { label: "Where it runs", value: "In your browser. Nothing is uploaded." },
    ],
    limits: [
      "Password-protected PDFs cannot be opened.",
      "Rotation moves in steps of 90°. Straightening a slightly crooked scan (for example 3°) is not possible here.",
      "Every page is drawn as a preview first, so very long PDFs take a moment to appear.",
    ],
    troubleshooting: [
      { problem: "The preview turned but the downloaded file looks the same", fix: "Check that you pressed Download after rotating. Some old viewers cache the file, so close and reopen it." },
      { problem: "I rotated the wrong page", fix: "Press the opposite round button on that page to turn it back." },
      { problem: "The scan is slightly crooked", fix: "This tool only turns by 90°. Straighten the scan with a photo or scanner app, then convert it with Image to PDF." },
      { problem: "It says the PDF is damaged", fix: "The file may be incomplete. Download it again from where you got it." },
    ],
    faq: [
      { q: "Does rotating cost anything?", a: "No. It is free, needs no account and adds no watermark." },
      { q: "Is my file uploaded to rotate it?", a: "No. The rotation is applied inside your browser and the new PDF is created on your device." },
      { q: "How do I rotate a PDF permanently?", a: "Rotate the pages here and download the new file. The rotation is saved inside the PDF, so it stays that way in every viewer." },
      { q: "Can I rotate only one page?", a: "Yes. Use the round buttons under that page. Or turn every page at once with All Left or All Right." },
      { q: "Does rotating reduce quality?", a: "No. The page content is not re-drawn, only its rotation setting changes." },
      { q: "Can I rotate 180 degrees?", a: "Yes, press the same direction twice." },
    ],
    next: [
      { slug: "remove-pages", text: "Have blank or extra pages too? Remove them with Remove Pages." },
      { slug: "merge-pdf", text: "Then combine the corrected file with others in Merge PDF." },
      { slug: "edit-pdf", text: "Need to change some text on the page? Use Edit PDF." },
    ],
    guides: ["fix-a-sideways-pdf"],
    related: ["remove-pages", "merge-pdf", "edit-pdf"],
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    category: "to-pdf",
    title: "JPG & PNG to PDF Converter Free",
    description:
      "Convert JPG and PNG images to one PDF. Reorder pictures, fix phone-photo rotation and download. Free, no sign-up, private.",
    keywords: ["jpg to pdf", "png to pdf", "image to pdf", "convert photos to pdf", "jpg to pdf converter free"],
    intro: "Turn photos, scans and screenshots into one tidy PDF. Put them in order and download.",
    heading: ["Image to", "PDF"],
    icon: FileImage,
    steps: [
      { title: "Add your images", text: "Choose JPG or PNG files (several at once is fine) or drag them onto the page." },
      { title: "Set the order", text: "Drag the pictures, or use the arrow buttons under each one. Page 1 is the first page of the PDF." },
      { title: "Remove mistakes", text: "Press the red button on a picture to take it out." },
      { title: "Convert", text: "Press Convert to PDF. Each picture becomes one page." },
    ],
    about: [
      "Each image becomes its own A4 page, centred, with a 10 mm margin and scaled to fit without stretching. Photos taken on a phone are turned the right way up automatically, which many converters get wrong.",
      "Very large pictures are scaled down to about 300 dpi for A4 (3508 pixels on the long side), so a 12 MB camera photo does not make a 12 MB PDF page. PNG images with transparent areas get a white background.",
      "Because this runs in your browser, photos of documents, ID cards or bills are not sent to a server.",
    ],
    useCases: [
      "Turn photos of a handwritten or printed document into one PDF",
      "Combine screenshots into a single file to email",
      "Make a PDF of scanned certificates for an application form",
      "Put several receipts into one file in the right order",
    ],
    specs: [
      { label: "Works with", value: "JPG, JPEG and PNG images" },
      { label: "Not supported", value: "HEIC, WebP, GIF, TIFF, BMP (convert them to JPG first)" },
      { label: "Largest image", value: "30 MB each" },
      { label: "Page size", value: "A4, image centred with a 10 mm margin" },
      { label: "Result", value: "A PDF named converted-document.pdf, one image per page" },
      { label: "Where it runs", value: "In your browser. Nothing is uploaded." },
    ],
    limits: [
      "Only JPG and PNG images. iPhone photos in HEIC format must be converted to JPG first (many phones can share them as JPG).",
      "Pages are always A4 portrait; the image is fitted inside it, so a wide picture leaves white space above and below.",
      "This does not shrink files to a target size such as 100 KB. Very large photos are scaled to print size, but JPG quality is kept high.",
      "The text in a photo cannot be selected or searched afterwards; it stays a picture.",
    ],
    troubleshooting: [
      { problem: "It says an image is not a real JPG or PNG", fix: "The file may be another format with the wrong extension, such as HEIC renamed to .jpg. Export it as JPG from your photo app." },
      { problem: "A photo is sideways in the PDF", fix: "Phone photos are turned automatically. If one is still wrong, rotate the finished PDF with Rotate PDF." },
      { problem: "The PDF is bigger than I want for email", fix: "Use fewer or smaller pictures. Each photo is stored at print quality." },
      { problem: "The convert button is greyed out", fix: "Add at least one image first." },
      { problem: "Pictures are in the wrong order", fix: "Use the left and right arrow buttons under a picture to move it." },
    ],
    faq: [
      { q: "Is the JPG to PDF converter free?", a: "Yes. There is no sign-up, no watermark and no limit on the number of pictures." },
      { q: "Are my photos uploaded?", a: "No. Your pictures are read, turned the right way up and placed into the PDF in your browser. They are not sent anywhere, which matters for photos of documents or ID cards." },
      { q: "How do I convert JPG to PDF?", a: "Add your JPG files, put them in order, and press Convert to PDF. Each picture becomes one page of the PDF." },
      { q: "Can I convert PNG to PDF too?", a: "Yes. JPG and PNG can even be mixed in one PDF." },
      { q: "Can I put many images in one PDF?", a: "Yes, as many as your device can handle. They appear in the order shown on the page." },
      { q: "Will the image quality drop?", a: "Pictures larger than print size for A4 are scaled down to about 300 dpi. Smaller pictures keep their size. JPG is saved at high quality." },
      { q: "Can I make the PDF under 100 KB or 200 KB?", a: "Not with this tool. It does not compress to a target size." },
    ],
    next: [
      { slug: "merge-pdf", text: "Want to combine this PDF with other documents? Use Merge PDF." },
      { slug: "rotate-pdf", text: "If a page needs turning, use Rotate PDF." },
      { slug: "pdf-to-image", text: "Need to go the other way, from PDF to pictures? Use PDF to Image." },
      { slug: "resize-image-under-100kb", text: "Photos too big and making the PDF heavy? Make them smaller first with Resize & Compress Image to 100KB." },
    ],
    guides: ["photos-to-pdf-on-your-phone"],
    related: ["merge-pdf", "rotate-pdf", "pdf-to-image"],
  },
  {
    slug: "pdf-to-image",
    name: "PDF to Image",
    category: "from-pdf",
    title: "PDF to JPG Converter Online Free",
    description:
      "Convert every page of a PDF to a high-quality JPG image and download them all as a ZIP. Free, private, and runs in your browser.",
    keywords: ["pdf to jpg", "pdf to image", "convert pdf to jpg", "pdf to jpg high quality", "pdf pages to images"],
    intro: "Turn each page of a PDF into a sharp JPG image, one by one or all in a ZIP.",
    heading: ["PDF to", "Image"],
    icon: FileImage,
    steps: [
      { title: "Open your PDF", text: "Choose a PDF. A progress message shows each page as it is converted." },
      { title: "Look at the pages", text: "Every page appears as an image preview." },
      { title: "Save", text: "Press Download all (ZIP), or Save JPG under any single page." },
    ],
    about: [
      "PDF to Image draws each page the way a PDF reader would and saves the result as a JPG. Pages are drawn at up to twice their normal screen size, which is sharp enough for slides, social posts and websites, and the size is limited to 4096 pixels on the long side so very large pages do not crash the browser.",
      "You can save one page or all of them: Download all packs every page into one ZIP, named after your PDF, with files such as report_page-1.jpg.",
      "The work happens in your browser, so the document is never uploaded.",
    ],
    useCases: [
      "Put a PDF page into a presentation or a website",
      "Share one page as a picture in a chat or on social media",
      "Make a thumbnail or cover image of a document",
      "Send a page to someone who cannot open PDFs",
    ],
    specs: [
      { label: "Works with", value: "PDF files" },
      { label: "Largest file", value: "150 MB" },
      { label: "Image format", value: "JPG (quality 90%)" },
      { label: "Image size", value: "Up to 2x the page size, never more than 4096 pixels on the long side" },
      { label: "Result", value: "A ZIP of JPG files, or a single JPG per page" },
      { label: "Where it runs", value: "In your browser. Nothing is uploaded." },
    ],
    limits: [
      "Output is JPG only. There is no PNG option yet, so transparent backgrounds become white.",
      "Password-protected PDFs cannot be opened.",
      "Pictures are made for screens (about 144 dpi for a normal page), not for large-format printing.",
      "A long PDF means many images in memory at once, which may be slow on a phone. Split it into parts first if needed.",
    ],
    troubleshooting: [
      { problem: "The images look soft when I zoom in", fix: "They are made at up to 2x page size. For more detail on a small page, zoom your PDF reader to a large size and take a screenshot, or ask for PNG support." },
      { problem: "Conversion is slow or stops", fix: "The PDF may be very long or heavy. Split it into smaller parts first with Split PDF." },
      { problem: "It says the PDF is password protected", fix: "Remove the password in a PDF reader first and try again." },
      { problem: "I only want one page", fix: "Use Save JPG under that page. You do not have to download the ZIP." },
    ],
    faq: [
      { q: "Is converting PDF to JPG free?", a: "Yes, with no account, no watermark and no page limit beyond what your device can handle." },
      { q: "Is my PDF uploaded during conversion?", a: "No. Each page is drawn and saved as a JPG in your browser." },
      { q: "How do I convert a PDF to JPG?", a: "Open the PDF and wait for the pages to appear. Press Download all (ZIP) for every page or Save JPG under a single page." },
      { q: "What is the image quality?", a: "Each page is drawn at up to twice its normal size and saved as a JPG at 90% quality. The long side is never more than 4096 pixels." },
      { q: "Can I get PNG instead of JPG?", a: "Not yet." },
      { q: "Can I convert only some pages?", a: "Yes. Save only the pages you want, or first extract them with Split PDF." },
    ],
    next: [
      { slug: "split-pdf", text: "To convert only a few pages, extract them first with Split PDF." },
      { slug: "image-to-pdf", text: "To turn pictures back into a PDF, use Image to PDF." },
      { slug: "edit-pdf", text: "Want to change text on the page before saving it as an image? Use Edit PDF." },
      { slug: "resize-image-under-100kb", text: "Need the saved picture under a size limit, such as 100 KB? Use Resize & Compress Image to 100KB." },
    ],
    guides: ["pdf-to-jpg-quality-and-size"],
    related: ["split-pdf", "image-to-pdf", "edit-pdf"],
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    category: "to-pdf",
    title: "Word to PDF Converter (DOCX) Free",
    description:
      "Convert Word (.docx) files to PDF in your browser. Free, no sign-up, and your document is never uploaded. Beta: pages are saved as pictures.",
    keywords: ["word to pdf", "docx to pdf", "convert docx to pdf", "word to pdf converter free"],
    intro: "Turn a Word (.docx) document into a PDF without uploading it anywhere.",
    heading: ["Word to", "PDF"],
    icon: FileText,
    steps: [
      { title: "Choose a .docx file", text: "Pick the Word document from your device. Old .doc files must be saved as .docx first." },
      { title: "Wait a moment", text: "The page shows what it is doing: reading the document, drawing pages, creating each page." },
      { title: "Download", text: "The PDF is saved automatically, and a message tells you how many pages it has." },
    ],
    about: [
      "Word to PDF reads your .docx file, keeps its headings, paragraphs, bold and italic text, lists, tables and pictures, lays them out on A4 pages and saves the result as a PDF. Page breaks are placed in the gaps between lines so no line is cut in half.",
      "This is a beta tool. Instead of using Word's own layout engine, it draws your document and saves each page as a picture. That makes it work in any browser with no upload, but it also means the text in the PDF cannot be selected or searched, and complex layouts can look different from Word.",
      "If you have Word itself, its own Save as PDF gives the best result. Use this tool when you do not have Word at hand or cannot install anything.",
    ],
    useCases: [
      "Send a letter or assignment as a PDF from a computer without Word",
      "Turn a simple report or notes document into a file that looks the same everywhere",
      "Convert a document without uploading private content to a website",
      "Print-ready copy of a plain text document",
    ],
    specs: [
      { label: "Works with", value: "Word .docx files" },
      { label: "Not supported", value: "Old .doc files (save them as .docx in Word first)" },
      { label: "Largest file", value: "25 MB" },
      { label: "Page size", value: "A4, with margins" },
      { label: "Result", value: "A PDF with the same name as your document; each page is a picture" },
      { label: "Where it runs", value: "In your browser. Nothing is uploaded." },
    ],
    limits: [
      "Text in the PDF is part of a picture: it cannot be selected, searched or copied.",
      "Fonts are replaced by a similar sans-serif font, so line breaks and page counts can differ from Word.",
      "Headers, footers, page numbers, text boxes, columns, footnotes and tracked changes are not reproduced.",
      "Very long documents (over about 15 pages) are drawn at a slightly lower resolution to keep the file size reasonable.",
      "Document pictures are included, but complex floating pictures may move.",
    ],
    troubleshooting: [
      { problem: "It says the file is not a valid .docx", fix: "Open it in Word and use Save As, choosing Word Document (.docx). A .doc file renamed to .docx will not work." },
      { problem: "The layout looks different from Word", fix: "Only basic formatting is supported. Remove text boxes and columns in your document, or use Word's own Save as PDF for a faithful copy." },
      { problem: "I cannot select text in the PDF", fix: "That is expected: pages are saved as pictures. For text you can select, use Word's Save as PDF." },
      { problem: "The PDF is large", fix: "Each page is stored as a picture. Long documents make bigger files." },
      { problem: "Nothing happens after choosing the file", fix: "Check that the file is under 25 MB. A message appears above the upload area for any problem." },
    ],
    faq: [
      { q: "Is the Word to PDF converter free?", a: "Yes, with no sign-up and no watermark. It is a beta, so read the limits above." },
      { q: "Is my Word document uploaded?", a: "No. The document is read and drawn in your browser. This is why you can use it for private documents." },
      { q: "How do I convert DOCX to PDF?", a: "Choose your .docx file here and the PDF downloads automatically. It runs entirely in your browser." },
      { q: "Is the text in the PDF selectable?", a: "No. Each page is saved as a picture, so the text cannot be selected or searched. This is a known limit of the beta." },
      { q: "Will my formatting be kept?", a: "Headings, paragraphs, bold and italic, lists, tables and pictures are. Headers, footers, columns, text boxes and exact fonts are not." },
      { q: "Does it work with .doc files?", a: "No, only .docx. Open an old .doc file in Word and save it as .docx first." },
      { q: "Is there a better way if I have Word?", a: "Yes. In Word, choose File, then Save As, then PDF. It keeps your exact layout and selectable text." },
    ],
    next: [
      { slug: "merge-pdf", text: "Combine the converted PDF with other documents using Merge PDF." },
      { slug: "edit-pdf", text: "Note: the pictures in this PDF cannot be edited as text. For text you can change, edit your Word file before converting." },
      { slug: "image-to-pdf", text: "Have pictures or scans instead of Word files? Use Image to PDF." },
    ],
    guides: ["word-to-pdf-what-changes"],
    related: ["merge-pdf", "image-to-pdf", "edit-pdf"],
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder & Decoder",
    category: "web",
    title: "URL Decode & Encode Online Free",
    description:
      "Decode or encode a URL online: query strings, %20 %22 %25 %2B %40 codes, JSON and Hindi text. Shows each parameter. Free, instant, nothing is uploaded.",
    keywords: [
      "url decoder", "url encoder", "decode url online", "encoded url online", "decode url string", "decode url params",
      "url encoded query string", "url encoded value", "url encoded example", "url encoded json", "url encoded base64",
      "decode url characters", "decode facebook url", "decode youtube url", "percent encoding", "encodeURIComponent online",
    ],
    intro: "Decode an encoded URL into readable text, or encode text so it is safe inside a link. Query parameters are listed for you.",
    heading: ["URL Encoder &", "Decoder"],
    icon: Link2,
    wide: false,
    steps: [
      { title: "Paste your text or link", text: "Type or paste into the box. The result appears as you type, so there is no button to press." },
      { title: "Choose Encode or Decode", text: "Decode turns codes like %20, %22 and %2B back into normal text, and lists the parameters of a link. Encode does the reverse." },
      { title: "Copy the result", text: "Press Copy, or Swap to move the result into the input and convert it the other way." },
    ],
    about: [
      "A web address can only contain a small set of characters. Spaces, accents, Hindi letters, emoji and symbols such as &, ? and # must be written as a percent sign followed by two hex digits, for example a space becomes %20. This is called URL encoding or percent-encoding.",
      "This tool does that in your browser using the same functions websites use (encodeURIComponent and encodeURI). Choose Component to encode a single value, such as a search word or a query parameter. Choose Full URL to encode a whole address while keeping its : / ? & = # characters in place.",
      "Decoding reverses the process. If the link has a query string (the part after the ?), a table lists every parameter with its decoded value, which is the quickest way to read long links from Facebook, YouTube or an API. If the result still has % codes in it, the text was encoded twice and Decode again removes the second layer. A broken % code is reported instead of showing garbage, and nothing you type is sent anywhere.",
      "Looking for code instead of a web page? The guide on URL encoding in JavaScript, PHP, Java, Python and more shows the exact function for each language, and the list of URL encoded characters explains codes such as %22, %25, %2B and %40.",
    ],
    useCases: [
      "Put a search phrase or name with spaces into a link or query string",
      "Read a long link full of %20 and %2F codes",
      "Check what a tracking or redirect link really contains",
      "Prepare Hindi, Urdu or emoji text so it works in a URL",
      "Read the real address inside a long Facebook or YouTube redirect link",
      "Open up URL encoded JSON or a form body (name=value&name=value) to read it",
      "Check what encodeURIComponent, urlencode or quote would give, without writing code",
    ],
    specs: [
      { label: "Works with", value: "Any text, including Hindi and other languages, and emoji" },
      { label: "Modes", value: "Encode or decode; Component (single value) or Full URL" },
      { label: "Spaces", value: "%20 by default; optional + for form-style data" },
      { label: "Parameters", value: "A table of names and decoded values appears when the link has a query string" },
      { label: "Size", value: "Limited only by what your browser can handle" },
      { label: "Where it runs", value: "In your browser. Nothing is uploaded." },
    ],
    reference: {
      heading: "Common URL encoded characters",
      intro: "The codes people look up most. Paste any of them into the box above with Decode selected to check.",
      head: ["Code", "Character", "Notes"],
      rows: [
        ["%20", "space", "Written + in form data"],
        ["%22", "double quote \"", "Seen in URL encoded JSON"],
        ["%25", "percent sign %", "%2520 means encoded twice"],
        ["%2B", "plus sign +", "A bare + means a space in a query string"],
        ["%40", "at sign @", "In email addresses inside links"],
        ["%26", "ampersand &", "Separates parameters"],
        ["%3D", "equals sign =", "Separates a name from its value"],
        ["%3F", "question mark ?", "Starts the query string"],
        ["%23", "hash #", "Starts the fragment"],
        ["%2F", "slash /", "Separates parts of a path"],
        ["%3A", "colon :", "As in https%3A%2F%2F"],
        ["%0A", "new line (LF)", "Windows text uses %0D%0A"],
      ],
    },
    limits: [
      "Encoding is not encryption. Anyone can decode a URL-encoded value, so do not use it to hide secrets.",
      "Full URL mode keeps characters like ? & = # as they are, so it will not fix a value that itself contains them. Use Component for single values.",
      "Text is converted as UTF-8, which is what modern websites expect. Old pages that use other encodings may decode differently.",
    ],
    troubleshooting: [
      { problem: "It says the text is not valid", fix: "A % must be followed by two hex digits (0 to 9, A to F). Look for a stray % in the text, or a link that was cut off in the middle of a code." },
      { problem: "My link stopped working after encoding", fix: "You probably used Component on a whole URL, which also encodes the : and /. Use Full URL for a whole address." },
      { problem: "I see + instead of spaces", fix: "Turn on the plus option when decoding form data, where + stands for a space." },
      { problem: "Decoded text shows odd symbols", fix: "The original was probably not UTF-8. Try a different source, or decode part of it at a time." },
      { problem: "The result still has %25 or %20 in it", fix: "The text was encoded twice. Press Decode again to remove the second layer." },
      { problem: "A plus sign turned into a space", fix: "In a query string a bare + means a space. To keep a real plus it must be written %2B. Turn the plus option off when decoding something that is not form data." },
    ],
    faq: [
      { q: "How do I decode a URL?", a: "Paste the link or text into the box, choose Decode, and read the result. If the link has a query string, each parameter is listed with its decoded value." },
      { q: "What is URL encoding?", a: "It is a way to write special characters in a link as a % sign and two hex digits, so the link is understood everywhere. A space becomes %20." },
      { q: "What do %22, %25, %2B and %40 mean?", a: "%22 is a double quote, %25 is a percent sign, %2B is a plus sign and %40 is an at sign (@). The table above lists the other common codes." },
      { q: "What is the difference between Component and Full URL?", a: "Component encodes everything unsafe, including : / ? & = and #, so use it for one value. Full URL leaves those characters alone, so use it for a whole address. When decoding, Component decodes every code; Full URL leaves %2F, %3F, %26 and similar codes as they are." },
      { q: "Why do I see %2520 in my link?", a: "The text was encoded twice: the % of %20 became %25. Decode once to get %20, then press Decode again for the space." },
      { q: "How do I decode a URL in JavaScript, PHP, Java or Python?", a: "JavaScript uses decodeURIComponent, PHP uses rawurldecode or urldecode, Java uses URLDecoder.decode with UTF-8 and Python uses urllib.parse.unquote. Our guide has copy-ready code for these and for C#, Ruby, Rust and Dart." },
      { q: "What is a URL encoded body or query string?", a: "It is data written as name=value pairs joined with &, with special characters encoded. In a link it comes after the ?, and in a form post it is the request body." },
      { q: "How is a newline or a double quote URL encoded?", a: "A new line is %0A (Windows text uses %0D%0A) and a double quote is %22." },
      { q: "Is a dot URL encoded?", a: "No, a dot is always safe and stays as it is. If you see %2E, it decodes to a dot." },
      { q: "Can I decode a Facebook or YouTube link?", a: "Yes. Paste the whole link and choose Decode. The real address is inside a parameter, such as u on Facebook or q on YouTube redirect links. Decoding shows the address but does not tell you whether the site is safe." },
      { q: "How do I handle URL encoded JSON or Base64?", a: "URL decode it here first. For JSON, paste the result into the JSON Formatter. For Base64, paste it into the Base64 Encoder & Decoder. A + inside Base64 may have turned into a space in the link and should be put back as +." },
      { q: "Is this URL decoder free, and is my text sent anywhere?", a: "It is free with no sign-up. The conversion runs in your browser, so links and text with private information stay on your device." },
      { q: "Is URL encoding the same as encryption?", a: "No. Anyone can decode it. It only makes text safe to put inside a link." },
    ],
    next: [
      { slug: "base64-encoder-decoder", text: "Found a Base64 value inside the link? Read it with the Base64 Encoder & Decoder." },
      { slug: "json-formatter", text: "Decoded URL encoded JSON? Make it readable with the JSON Formatter & Validator." },
    ],
    guides: ["url-encoding-explained-with-examples", "url-encoded-characters-list", "url-encode-decode-in-javascript-php-java-python", "decode-facebook-and-youtube-links"],
    related: ["base64-encoder-decoder", "json-formatter"],
  },
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder & Decoder",
    category: "web",
    title: "Base64 Encoder & Decoder Online Free",
    description:
      "Encode text or a file to Base64, or decode Base64 back to text. Supports Hindi and emoji, and URL-safe Base64. Free, instant, and nothing is uploaded.",
    keywords: ["base64 encode", "base64 decode", "base64 encoder decoder online", "text to base64", "file to base64", "url safe base64"],
    intro: "Turn text or a small file into Base64, or turn Base64 back into readable text.",
    heading: ["Base64 Encoder &", "Decoder"],
    icon: Binary,
    steps: [
      { title: "Paste text or choose a file", text: "Type or paste into the box. To encode a file instead, press Choose file." },
      { title: "Choose Encode or Decode", text: "Encode makes Base64 from your text. Decode reads Base64 and shows the text inside it." },
      { title: "Copy the result", text: "Press Copy result, or Swap to send the result back into the input and convert the other way." },
    ],
    about: [
      "Base64 is a way to write any data using only letters, numbers, + and /. It is used to put small files and text inside emails, web pages, JSON and configuration files, where raw bytes would break things. The result is about one third longer than the original.",
      "This tool converts text as UTF-8, so Hindi, accented letters and emoji come out right and decode back correctly. You can also pick the URL-safe form, which uses - and _ instead of + and /, and leaves off the = padding, for use inside links and tokens.",
      "Everything happens in your browser. Your text and files are not sent anywhere. Base64 is only a way of writing data, not a way of hiding it: anyone can decode it.",
    ],
    useCases: [
      "Read what is inside a Base64 string from an API, email or config file",
      "Prepare text or a small image to put inside JSON or HTML",
      "Convert text with Hindi or emoji without it turning into garbage",
      "Make a URL-safe Base64 value for a link or token",
    ],
    specs: [
      { label: "Works with", value: "Any text, including Hindi and emoji, and small files for encoding" },
      { label: "Modes", value: "Encode or decode; standard or URL-safe Base64" },
      { label: "Largest file", value: "1 MB (encoding only)" },
      { label: "Decoding", value: "Shows the result as text; spaces and line breaks inside the Base64 are ignored" },
      { label: "Where it runs", value: "In your browser. Nothing is uploaded." },
    ],
    limits: [
      "Base64 is not encryption. Anyone can decode it, so never use it to protect a password or secret.",
      "Decoding shows text only. If the Base64 holds a picture or another binary file, the tool says so instead of showing broken characters.",
      "File encoding is limited to 1 MB so the page stays fast, and the result is about a third larger than the file.",
    ],
    troubleshooting: [
      { problem: "It says the text is not valid Base64", fix: "Base64 uses only letters, numbers, + / and = (or - and _ in the URL-safe form). Check for a missing or extra character, or a copy that was cut off." },
      { problem: "It says the result is not text", fix: "The Base64 holds a file or other binary data, not text, so it cannot be shown here." },
      { problem: "Decoded Hindi or emoji looks wrong", fix: "The original text may not have been UTF-8 when it was encoded. Encode it again here and use that value." },
      { problem: "My Base64 has - and _ in it", fix: "That is the URL-safe form. Turn on the URL-safe option before decoding." },
    ],
    faq: [
      { q: "What is Base64?", a: "A way to write data using only 64 safe characters (A to Z, a to z, 0 to 9, + and /). It lets text and files travel safely through systems that only accept plain text." },
      { q: "Is Base64 encryption?", a: "No. It only changes how data is written. Anyone can decode it, so it gives no protection." },
      { q: "Does it work with Hindi and emoji?", a: "Yes. Text is converted as UTF-8, so Hindi, other languages and emoji encode and decode correctly." },
      { q: "What is URL-safe Base64?", a: "A variant that uses - and _ instead of + and / and drops the = padding, so the value can sit inside a link without extra encoding." },
      { q: "Is my data sent to a server?", a: "No. Encoding and decoding run in your browser, so text and files stay on your device." },
      { q: "Is this Base64 tool free?", a: "Yes, free with no sign-up." },
    ],
    next: [
      { slug: "url-encoder-decoder", text: "Putting a value into a link? Make it link-safe with the URL Encoder & Decoder." },
    ],
    guides: ["url-encoding-explained-with-examples"],
    related: ["url-encoder-decoder", "json-formatter"],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    category: "web",
    title: "JSON Formatter & Validator Online Free",
    description:
      "Format, beautify, minify and validate JSON online. Shows the exact line and column of an error. Free, instant, and your data never leaves your browser.",
    keywords: ["json formatter", "json validator", "json beautifier", "format json online", "minify json", "json pretty print"],
    intro: "Paste JSON to make it readable, shrink it, or find the exact spot where it is broken.",
    heading: ["JSON Formatter &", "Validator"],
    icon: Braces,
    steps: [
      { title: "Paste your JSON", text: "Paste or type into the box. It is checked as you type, so you see right away whether it is valid." },
      { title: "Choose how to show it", text: "Format adds line breaks and indents. Minify removes all extra space. You can pick 2 spaces, 4 spaces or tabs, and sort the keys." },
      { title: "Copy or download", text: "Press Copy result or Download to save it as a .json file. If the JSON is broken, the message shows the line and column." },
    ],
    about: [
      "JSON is the text format used by most websites, apps and APIs to send data. It is easy for computers to read but hard for people when it is squeezed onto one line. This tool lays it out with indents so you can read it, or squeezes it into the smallest size for sending.",
      "It also checks that your JSON is valid. When something is wrong, such as a missing comma, a trailing comma or single quotes instead of double quotes, it tells you the line and column and shows the line, so you can fix it quickly.",
      "Everything runs in your browser using its built-in JSON support. Your data is not uploaded, which is why it is safe to use with private API responses and config files.",
    ],
    useCases: [
      "Read an API response that arrives as one long line",
      "Find the missing comma or quote that breaks a config file",
      "Shrink JSON before putting it in a request or a file",
      "Sort the keys so two JSON files are easy to compare",
    ],
    specs: [
      { label: "Works with", value: "Any JSON text: objects, arrays, strings, numbers, true, false and null" },
      { label: "Actions", value: "Format, minify, validate; sort keys; 2 spaces, 4 spaces or tabs" },
      { label: "Largest input", value: "2 MB (about 2 million characters)" },
      { label: "Errors", value: "Shows the line, column and the line of text where the problem is" },
      { label: "Where it runs", value: "In your browser. Nothing is uploaded." },
    ],
    limits: [
      "Only strict JSON is accepted. Comments, trailing commas, single quotes and unquoted keys are errors, as in most programs.",
      "Whole numbers larger than 9007199254740991 can lose their last digits, because browsers read numbers as doubles. Keep big IDs as strings.",
      "If a key appears twice in the same object, only the last one is kept.",
      "Inputs over 2 MB are refused, because showing very long text makes the page slow.",
    ],
    troubleshooting: [
      { problem: "It says unexpected token or unexpected character", fix: "Look at the line and column shown. The cause is usually just before it: a missing comma, an extra comma at the end, or a missing quote." },
      { problem: "My JSON uses single quotes", fix: "JSON requires double quotes around keys and text. Replace the single quotes with double quotes." },
      { problem: "It fails on comments", fix: "JSON does not allow comments. Remove the // and /* */ parts." },
      { problem: "A long number changed", fix: "Numbers above 9007199254740991 lose precision in browsers. Put such IDs inside quotes so they stay exact." },
      { problem: "It says the input is empty", fix: "Paste some JSON into the box. Whitespace alone is not valid JSON." },
    ],
    faq: [
      { q: "What is a JSON formatter?", a: "A tool that adds line breaks and indents to JSON so a person can read it. It is also called a JSON beautifier or pretty printer." },
      { q: "How do I validate JSON?", a: "Paste it in. If it is valid you see a green message, and if not you see the line and column of the first error." },
      { q: "Is my JSON uploaded anywhere?", a: "No. It is read and formatted in your browser, so API responses and config files stay on your device." },
      { q: "What does minify do?", a: "It removes all spaces and line breaks, giving the smallest text with the same data. It is useful before sending JSON or storing it." },
      { q: "Why do I get an error for a trailing comma?", a: "Strict JSON does not allow a comma after the last item. Delete it and the JSON will be valid." },
      { q: "Is this JSON formatter free?", a: "Yes, free with no sign-up." },
    ],
    next: [
      { slug: "base64-encoder-decoder", text: "Need to put JSON inside a token or another text field? Encode it with the Base64 Encoder & Decoder." },
      { slug: "url-encoder-decoder", text: "Sending JSON in a link? Make it safe with the URL Encoder & Decoder." },
    ],
    guides: ["url-encoding-explained-with-examples"],
    related: ["base64-encoder-decoder", "url-encoder-decoder"],
  },
  {
    slug: "resize-image-under-100kb",
    name: "Resize Image Under 100KB",
    category: "images",
    title: "Resize & Compress Image to 100KB Free",
    description:
      "Resize or compress a JPG, PNG or WebP photo to 100 KB, or 20, 30, 50 KB, online. Works for photos and signatures. Free, and your picture never leaves your device.",
    keywords: [
      "reduce image size to 100kb", "resize photo to 100kb", "compress image to 100kb", "image resizer in 100 kb", "photo resizer 100kb jpg",
      "compress jpg to 100kb", "compress png to 100kb", "resize jpeg to 100kb", "photo resize to 50kb", "photo resize to 30kb", "photo resize to 20kb",
      "image size reducer", "online image kb reducer", "image compressor in kb", "photo compressor online", "passport photo resize 100kb", "signature resize to 100kb",
    ],
    intro: "Reduce a photo or signature to under 100 KB (or 20, 30, 50, 200 KB) for forms, portals and email, without uploading it.",
    heading: ["Resize & Compress Image to", "100KB"],
    icon: Shrink,
    steps: [
      { title: "Choose your photos", text: "Pick one or more JPG, PNG or WebP images. On a phone you can choose from the gallery or take a new photo." },
      { title: "Set the size", text: "100 KB is already selected. Tap 20, 30, 50 or 200 KB, or type your own number. You can also limit the width and height." },
      { title: "Resize and download", text: "Press the button. Each photo shows its new size, and you can download it, or all of them as one ZIP." },
    ],
    about: [
      "Many online forms and portals refuse a photo that is larger than a certain size, often 50 KB, 100 KB or 200 KB. This tool makes your picture smaller than the size you choose, so the upload goes through.",
      "It tries the best quality first. If the file is still too big, it lowers the quality a little at a time, and if that is not enough it makes the picture slightly smaller in pixels. It stops at the highest quality that fits, so the result is just under your limit, not far below it. Everything happens in your browser, so the photo is not uploaded anywhere.",
      "People call this by many names: image resizer, image compressor, photo size reducer, KB reducer. They all mean the same job here: make the file smaller in KB. The tool does both things that change file size, it lowers the JPG quality and, only if needed, the picture size in pixels. PNG and WebP images are converted to JPG, so a PNG ends up as a JPG under your size.",
      "The result is always a JPG, because JPG gives the smallest file for photos. A PNG with a see-through background gets a white background. Flat graphics, screenshots and text can look slightly soft at very small sizes; a photo of a face or a signature on white paper usually looks fine at 50 KB or more.",
    ],
    useCases: [
      "Upload a passport-size photo or signature to a form that has a size limit",
      "Attach pictures to an email or a job application that rejects big files",
      "Make a profile picture small enough for a website or app",
      "Reduce a passport-style photo or a scanned signature to the size an application form asks for",
      "Shrink phone photos before sharing so they send faster on a slow connection",
    ],
    specs: [
      { label: "Works with", value: "JPG, PNG and WebP images" },
      { label: "Not supported", value: "HEIC or HEIF photos from iPhones (save or share them as JPG first), GIF, and PDF" },
      { label: "Target sizes", value: "20, 30, 50, 100 and 200 KB, or any size from 10 to 2000 KB" },
      { label: "Size count", value: "The result is under your number whether a form counts 1 KB as 1000 or 1024 bytes" },
      { label: "Largest photo", value: "30 MB each, up to 20 photos at a time" },
      { label: "Result", value: "A JPG. A transparent PNG gets a white background. A photo that is already under your limit is returned unchanged" },
      { label: "Where it runs", value: "In your browser. Nothing is uploaded." },
    ],
    reference: {
      heading: "Which size should I choose?",
      intro: "Use the size your form or website asks for. If it does not say, this is a starting point.",
      head: ["Size", "Often used for", "What to expect"],
      rows: [
        ["20 KB", "Signatures and small thumbnails", "Very small. Photos lose a lot of detail, and large photos shrink in pixels"],
        ["30 KB", "Small profile pictures and ID-style photos", "Fine for a face at small size; fine print becomes soft"],
        ["50 KB", "Passport-style photos, signatures, small attachments", "Good for a face and a signature; keep the background plain"],
        ["100 KB", "Photos for forms and job portals, profile pictures", "Clear for most photos at normal screen size"],
        ["200 KB", "Larger attachments, photos with more detail", "Close to the original for web use"],
      ],
    },
    limits: [
      "Very small targets on large photos force the picture to become smaller in pixels. If a form also needs exact pixel sizes, set the maximum width and height here.",
      "The result is just under your target, but it is not guaranteed to be exactly that size. Some portals want an exact range, for example between 20 and 50 KB; check the result before you upload.",
      "A signature or photo with a plain white or light background compresses best. A busy background uses up the size limit and leaves less room for the face.",
      "Quality always drops when a photo is made much smaller. Compare the preview with the original before you submit it.",
      "Only the picture is kept. Information stored in the photo, such as the camera and location, is removed.",
    ],
    troubleshooting: [
      { problem: "It says the photo cannot be made small enough", fix: "Untick Keep original dimensions, or choose a larger size such as 200 KB. Photos that are mostly fine detail need more room." },
      { problem: "It does not accept my iPhone photo", fix: "HEIC photos are not supported. On iPhone, share the picture and choose JPG or Most Compatible, or take a screenshot of it, then try again." },
      { problem: "The picture looks blurry", fix: "The size limit forced a small file. Try a larger target, or crop the photo to the part you need before using it." },
      { problem: "The form still says the file is too big", fix: "Check what the form counts. Choose a smaller target, for example 90 KB instead of 100 KB, and try again." },
      { problem: "The background of my PNG turned white", fix: "JPG cannot be transparent. Use the PNG itself if it already meets the limit." },
      { problem: "The form wants a file bigger than a minimum size (for example at least 20 KB)", fix: "This tool makes the file smaller, not bigger. Choose a target a little above the minimum, then check the size shown before you upload." },
      { problem: "My signature looks pale or broken at 20 KB", fix: "Photograph it on white paper in good light with a dark pen, crop close to the signature, and set a maximum width of about 400 pixels before you resize." },
    ],
    faq: [
      { q: "How do I reduce image size to 100 KB?", a: "Choose your photo, keep 100 KB selected and press the button. The tool lowers the quality and, if needed, the pixel size until the file is under 100 KB, then you download it." },
      { q: "How do I resize a photo to 50 KB, 30 KB or 20 KB?", a: "Tap 50, 30 or 20 KB (or type the number under Other) and press the button. Smaller sizes lower the quality more, and large photos also shrink in pixels, so a plain background and a closer crop give a clearer result." },
      { q: "Can I compress a PNG to 100 KB?", a: "Yes. The PNG is converted to a JPG, which is much smaller for photos, and the result is under your size. Transparent areas become white. If the PNG is already under the limit, it is returned unchanged." },
      { q: "What is the difference between resizing and compressing an image?", a: "Resizing changes the width and height in pixels. Compressing lowers the quality to save space. To reach a size in KB both are used, and this tool uses the least of each that is needed." },
      { q: "Does the quality drop?", a: "A little, because a smaller file has to hold less detail. The tool keeps the highest quality that still fits your limit, so it does not shrink more than needed." },
      { q: "Can I resize my passport photo or signature to 100 KB?", a: "Yes. Choose 100 KB (or the size your form asks for), and set a maximum width and height if the form also lists pixel sizes. Check the form's own rules for size, format and background before you upload." },
      { q: "Is my photo uploaded?", a: "No. The photo is read and compressed in your browser, so private pictures such as ID photos stay on your device." },
      { q: "Can I make an image exactly 100 KB?", a: "The result is just under the size you choose, usually within a few KB of it, not exactly that number. If a form needs a range, check the size shown and adjust the target." },
      { q: "Is 100 KB the same as 100,000 or 102,400 bytes?", a: "Programs differ. This tool keeps the result under 100,000 bytes, so it is under 100 KB by either count." },
      { q: "Can I set the width and height?", a: "Yes. Fill in the maximum width and height, and the picture is made to fit inside them while keeping its shape. It is never stretched." },
      { q: "Can I resize many photos at once?", a: "Yes, up to 20 at a time. Download each one, or all of them together as a ZIP." },
      { q: "Which formats work?", a: "JPG, JPEG, PNG and WebP go in, and a JPG comes out. HEIC photos from iPhones are not supported yet." },
      { q: "Does it work on a phone?", a: "Yes. Choose the photo from your gallery or take a new one, resize it, and download the result. Nothing needs to be installed." },
      { q: "Is it free?", a: "Yes, free with no sign-up and no watermark." },
    ],
    next: [
      { slug: "image-to-pdf", text: "Need the smaller photo inside a PDF? Use Image to PDF." },
      { slug: "pdf-to-image", text: "Have the photo inside a PDF? Take it out as a picture with PDF to Image, then resize it here." },
    ],
    guides: ["reduce-image-size-to-100kb", "photo-and-signature-size-for-online-forms"],
    related: ["image-to-pdf", "pdf-to-image"],
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
  "OCR PDF",
  "Excel to PDF",
  "PowerPoint to PDF",
];

export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
export const toolPath = (slug: string) => `/tools/${slug}`;

export const HOME_FAQ: Faq[] = [
  {
    q: "Is ToolsTree free?",
    a: "Yes. Every tool is free, with no sign-up, no watermark and no daily limit.",
  },
  {
    q: "Are my files uploaded to your servers?",
    a: "No. Files are processed inside your browser, so your documents stay on your device.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. Everything runs in your web browser on a computer, tablet or phone.",
  },
  {
    q: "Which PDF tools are available?",
    a: "You can edit PDF text, merge, split, rotate, remove pages, convert images to PDF, PDF pages to JPG, and Word (.docx) files to PDF. More tools such as compress and protect are planned.",
  },
  {
    q: "Which tool should I use to…",
    a: "Change a word in a PDF: Edit PDF. Put files together: Merge PDF. Keep only some pages: Split PDF. Delete pages: Remove Pages. Fix a sideways page: Rotate PDF. Photos to a document: Image to PDF. A page as a picture: PDF to Image. A Word file as PDF: Word to PDF.",
  },
];
