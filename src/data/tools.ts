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

export type CategoryId = "organize" | "to-pdf" | "from-pdf";

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
