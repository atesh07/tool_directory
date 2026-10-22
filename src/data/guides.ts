import { WEB_GUIDES } from "./guides-web";

export type Block =
  | { t: "h2"; text: string }
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "tip"; text: string }
  | { t: "code"; label: string; text: string }
  | { t: "table"; head: string[]; rows: string[][] };

export type Guide = {
  slug: string;
  lang: "en" | "hi";
  title: string;
  /** Meta description, 70 to 160 characters */
  description: string;
  intro: string;
  /** Slug of the tool this guide is about */
  tool: string;
  published: string;
  updated: string;
  body: Block[];
  /** Slugs of other guides in the same language */
  related: string[];
};

export const guidePath = (slug: string) => `/guides/${slug}`;
export const hiGuidePath = (slug: string) => `/hi/guides/${slug}`;

export const GUIDES: Guide[] = [
  {
    slug: "merge-pdf-files-without-uploading",
    lang: "en",
    title: "How to Merge PDF Files Without Uploading Them",
    description:
      "Combine PDF files into one document right in your browser, with no upload. Steps, ordering tips and what to check before you send the file.",
    intro:
      "Most online PDF tools send your files to a server before they merge them. If the files are payslips, bank statements or copies of your ID, that is worth avoiding. Here is how to merge PDFs on your own device, and how to get a tidy result.",
    tool: "merge-pdf",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["split-pdf-by-page-range", "delete-pages-from-a-pdf"],
    body: [
      { t: "h2", text: "Why “no upload” matters" },
      {
        t: "p",
        text: "When a website merges your PDFs on its server, a copy of every file travels over the internet and sits on someone else's computer, even if only for an hour. Sites promise to delete files, but you cannot check. When the merge happens in your browser, the files never leave your phone or laptop, so there is nothing to delete and nothing that can leak.",
      },
      {
        t: "p",
        text: "You can check this yourself with ToolsTree: open your browser's developer tools, look at the Network tab while you merge, and you will see that no request carries your files.",
      },
      { t: "h2", text: "How to merge PDFs, step by step" },
      {
        t: "ol",
        items: [
          "Open the Merge PDF tool.",
          "Press Select PDFs and choose two or more files. On a computer you can also drag them onto the page.",
          "Put the files in order. Drag the cards, or press the left and right arrow buttons under a card. The number on each card is its place in the final document.",
          "If you added a wrong file, press the red button on its card to remove it.",
          "Press the merge button. The combined file is saved to your device as merged_<number>.pdf.",
        ],
      },
      { t: "h2", text: "Check the result before you send it" },
      {
        t: "ul",
        items: [
          "Open the new file and scroll to the place where one document ends and the next begins.",
          "Add up the page counts: the merged file should have exactly as many pages as the originals together.",
          "Look for pages that are sideways or upside down. A scan that went into the scanner the wrong way stays that way. Fix it with Rotate PDF.",
          "Look at the file size. Merging does not make files smaller, and many email services limit attachments to around 20 to 25 MB.",
        ],
      },
      { t: "h2", text: "Tips for a tidy merged document" },
      {
        t: "ul",
        items: [
          "Name the files with numbers before you start (01-cover.pdf, 02-form.pdf). You will recognise the cards at a glance.",
          "Photos have to become PDFs first. Use Image to PDF, then merge the result with the rest.",
          "Take out blank or unwanted pages before merging with Remove Pages. It is easier on one small file than on the big merged one.",
          "Page numbers printed inside the original documents stay as they were. The merged file is not renumbered.",
          "Bookmarks (the outline in the sidebar of a PDF reader) of the original files are not carried over; the pages are.",
        ],
      },
      { t: "h2", text: "When a file will not merge" },
      {
        t: "p",
        text: "A file that is password protected, damaged or empty is rejected as soon as you add it, and the message names the file. Remove the password in a PDF reader and add it again. If the browser tab becomes slow because the files are large, merge them in two batches and then merge the two results.",
      },
      {
        t: "tip",
        text: "Merge, combine and join mean the same thing here: putting several PDFs into one file.",
      },
    ],
  },
  {
    slug: "edit-text-in-a-pdf",
    lang: "en",
    title: "How to Edit Text in a PDF Without Changing the Font",
    description:
      "Why PDF text editing often changes the font, how to fix a word and keep the look, and what to do with scans. A free browser tool, explained.",
    intro:
      "You open a PDF to fix one word, type it in, and suddenly that line looks different from the rest. That is not your mistake: it comes from how PDFs store text. This guide explains why, and how to edit a PDF so the new words match the old ones.",
    tool: "edit-pdf",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["fix-a-sideways-pdf", "merge-pdf-files-without-uploading"],
    body: [
      { t: "h2", text: "Why a PDF is not like a Word document" },
      {
        t: "p",
        text: "A Word file keeps text as flowing paragraphs. A PDF was made to look identical on every screen and printer, so it stores each line, often each word, as a small piece placed at an exact spot on the page, with its own font, size and colour. There is no paragraph to reflow when you add a word.",
      },
      { t: "h2", text: "Why the font usually changes" },
      {
        t: "p",
        text: "To keep files small, a PDF normally embeds only the letters of a font that the document actually uses. If a line contains no letter “z”, the “z” is not in the file. When you type one, an editor has to take it from somewhere else. Many tools simply switch the whole line to a default font such as Arial or Times, and that is the change you see.",
      },
      { t: "h2", text: "How to edit and keep the same look" },
      {
        t: "ol",
        items: [
          "Open Edit PDF and choose your file. It must contain real text, not a scan.",
          "Click the line you want to change and type. To style only some words, select them first and press Bold or Italic.",
          "Use the zoom buttons to check small text, especially on a phone.",
          "Press Download PDF. Pages and images you did not touch stay as they were.",
        ],
      },
      {
        t: "p",
        text: "ToolsTree reads the font name stored in the PDF, loads the same or the closest matching open font, and draws your text in the same size and colour. For fonts that have no open version, such as some commercial fonts, the closest look-alike is used, so tiny differences in letter shapes can remain.",
      },
      { t: "h2", text: "What you cannot edit" },
      {
        t: "ul",
        items: [
          "Scans and photos saved as PDF. They contain pictures of text, not text. Try to select a word in a PDF reader: if you cannot, there is nothing to edit.",
          "Sideways or slanted text, such as margin labels and stamps. These lines are left exactly as they are.",
          "Password-protected files. Remove the password first.",
          "Letters outside the Latin alphabet, for example Hindi, and some symbols such as ₹. They are not supported yet and show as a question mark.",
          "Pictures. You can change text, not images.",
        ],
      },
      { t: "h2", text: "If you still have the original file" },
      {
        t: "p",
        text: "Changing the source is always better. If you made the PDF from Word or Google Docs, edit the original and export a new PDF. You get proper text flow and a clean file. Editing the PDF itself is for the times when the original is gone.",
      },
      { t: "h2", text: "A safety note" },
      {
        t: "p",
        text: "Edit PDF covers the old words with the new ones. It is not a redaction tool: the original text can still be inside the file, so never use it to hide private information. And use it only on your own documents. Changing identity documents, certificates, mark sheets or other official records is not allowed.",
      },
    ],
  },
  {
    slug: "photos-to-pdf-on-your-phone",
    lang: "en",
    title: "How to Turn Photos Into a PDF on Your Phone",
    description:
      "Make one PDF from photos or screenshots on Android or iPhone, in the right order and the right way up. Free, private and no app to install.",
    intro:
      "Forms, job applications and insurance claims often ask for “one PDF”. You only have photos on your phone. You do not need an app: a browser is enough. Here is how to get a clean PDF, and what to watch for.",
    tool: "image-to-pdf",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["merge-pdf-files-without-uploading", "fix-a-sideways-pdf"],
    body: [
      { t: "h2", text: "Take photos that make a good PDF" },
      {
        t: "ul",
        items: [
          "Put the paper on a flat surface and use daylight, so there are no shadows across the page.",
          "Hold the phone straight above the page. A slanted phone makes a slanted page.",
          "Fill the frame with the page, but do not cut the edges off.",
          "Take one photo per page, in the order you want them.",
        ],
      },
      { t: "h2", text: "Turn the photos into a PDF" },
      {
        t: "ol",
        items: [
          "Open the Image to PDF tool in your phone browser.",
          "Press Select Images and choose your photos from the gallery. You can pick several at once.",
          "Check the order. Use the arrow buttons under a photo to move it. The first photo becomes page 1.",
          "Remove a wrong photo with the red button on it.",
          "Press Convert to PDF. Each photo becomes one page and the PDF downloads.",
        ],
      },
      {
        t: "p",
        text: "On Android the file is usually in the Downloads folder. On an iPhone, Safari puts it in the Downloads folder inside the Files app.",
      },
      { t: "h2", text: "iPhone photos and the HEIC problem" },
      {
        t: "p",
        text: "Many iPhones save photos in a format called HEIC, which this tool cannot read. Open Settings, then Camera, then Formats, and choose Most Compatible. New photos are then saved as JPG. The tool accepts JPG and PNG images.",
      },
      { t: "h2", text: "Why photos come out the right way up" },
      {
        t: "p",
        text: "A phone stores a note inside every photo that says how the phone was held. Many converters ignore that note and produce sideways pages. ToolsTree applies it, so photos come out upright. If one page is still wrong, turn the finished PDF with Rotate PDF.",
      },
      { t: "h2", text: "Keep the file small enough to send" },
      {
        t: "p",
        text: "Each photo is stored at about print quality: a very large picture is scaled to roughly 300 dpi for an A4 page, and JPG is kept at high quality. A PDF with many photos can therefore be large. This tool does not compress to a target size such as 100 KB. If the file is too big for an email, use fewer photos or take them at a lower camera resolution.",
      },
      { t: "h2", text: "If something goes wrong" },
      {
        t: "ul",
        items: [
          "“Not a real JPG or PNG”: the file is probably HEIC renamed to .jpg. Export it as JPG from your photo app.",
          "Photos in the wrong order: move them with the arrow buttons before converting.",
          "The convert button is grey: add at least one image first.",
        ],
      },
    ],
  },
  {
    slug: "delete-pages-from-a-pdf",
    lang: "en",
    title: "How to Delete Pages From a PDF",
    description:
      "Remove blank, wrong or private pages from a PDF by clicking them. Learn when to delete pages and when to extract the ones you want instead.",
    intro:
      "A scan with blank pages, a report with a cover you do not need, a document where one page should not be shared: deleting pages is one of the most common PDF jobs. You can do it by looking at the pages instead of typing numbers.",
    tool: "remove-pages",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["split-pdf-by-page-range", "fix-a-sideways-pdf"],
    body: [
      { t: "h2", text: "Delete pages or extract pages?" },
      {
        t: "p",
        text: "They are two ways to get the same file. If you want to keep most of the document and drop a few pages, use Remove Pages. If you only want a small part of a long document, for example pages 12 to 15 of 100, it is quicker to extract those with Split PDF.",
      },
      { t: "h2", text: "How to delete pages, step by step" },
      {
        t: "ol",
        items: [
          "Open Remove Pages and choose your PDF. Every page appears as a small picture.",
          "Tap or click each page you want to remove. It turns red and says Removed. Tap it again to keep it.",
          "Look at the download button: it shows how many pages will be removed.",
          "Press Download PDF. Your new file is named removed_pages_<your file name>.pdf.",
        ],
      },
      { t: "h2", text: "Good habits" },
      {
        t: "ul",
        items: [
          "Your original file is not changed. Keep it until you have checked the new one.",
          "You cannot remove every page. At least one has to stay.",
          "Page numbers printed on the pages are not renumbered, so a document may jump from page 4 to page 6.",
          "With a keyboard, press Tab to reach a page and Enter or Space to mark it.",
        ],
      },
      { t: "h2", text: "Removing a page with private details" },
      {
        t: "p",
        text: "Before you send the new file, open it and look through every page. A phone number or address you meant to remove can appear on other pages as well, for example in a footer or a signature block.",
      },
      { t: "h2", text: "If the PDF will not open" },
      {
        t: "p",
        text: "A password-protected file cannot be opened by the tool. Remove the password in a PDF reader first. A damaged or incomplete download is rejected too; download the file again.",
      },
    ],
  },
  {
    slug: "fix-a-sideways-pdf",
    lang: "en",
    title: "How to Fix a Sideways or Upside-Down PDF",
    description:
      "Why PDF pages end up sideways, why viewer rotation does not last, and how to rotate one page or all pages and save the change in the file.",
    intro:
      "You open a PDF and half the pages lie on their side. You rotate them in your reader, close the file, and next time they are sideways again. Here is why, and how to make the fix permanent.",
    tool: "rotate-pdf",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["delete-pages-from-a-pdf", "edit-text-in-a-pdf"],
    body: [
      { t: "h2", text: "Why pages end up sideways" },
      {
        t: "ul",
        items: [
          "A paper page went into the scanner turned, or a landscape page was scanned as portrait.",
          "A photo of a document was taken with the phone held sideways.",
          "A document mixes portrait and landscape pages, such as a report with a wide table.",
        ],
      },
      { t: "h2", text: "Viewer rotation does not last" },
      {
        t: "p",
        text: "The rotate button in a PDF reader only changes how you see the page right now. The file is not changed, so the next person, and you next time, see it sideways again. To fix it for good, the rotation has to be saved inside the file.",
      },
      { t: "h2", text: "How to rotate and save it" },
      {
        t: "ol",
        items: [
          "Open Rotate PDF and choose your file.",
          "To turn one page, press the round left or right button under it. To turn every page, use All Left or All Right at the top.",
          "Look at the previews. They show the direction the final file will have.",
          "Press Download Rotated PDF.",
        ],
      },
      {
        t: "p",
        text: "Only the rotation setting of each page changes. The text and pictures are not redrawn, so quality stays exactly the same. Press a button twice to turn a page 180 degrees.",
      },
      { t: "h2", text: "A slightly crooked scan" },
      {
        t: "p",
        text: "This tool turns pages in steps of 90 degrees. A page that is only a few degrees off needs straightening, which is a different job. Many scanner and camera apps can do it when you take the picture. Convert the straightened pictures to a PDF with Image to PDF.",
      },
      { t: "h2", text: "Check before you print or send" },
      {
        t: "p",
        text: "Open the new file in a different PDF reader or on your phone and scroll through it. A correctly rotated page prints in the right direction too.",
      },
    ],
  },
  {
    slug: "pdf-to-jpg-quality-and-size",
    lang: "en",
    title: "PDF to JPG Quality and File Size Explained",
    description:
      "How sharp is a JPG made from a PDF page? Pixels, dpi, JPG versus PNG and which size you need for a website, a slide or a print.",
    intro:
      "Turning a PDF page into a picture sounds simple, until the picture looks blurry on a slide or is too big for a form. Understanding pixels makes the choice easy.",
    tool: "pdf-to-image",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["split-pdf-by-page-range", "photos-to-pdf-on-your-phone"],
    body: [
      { t: "h2", text: "Pixels, not dpi, decide sharpness on a screen" },
      {
        t: "p",
        text: "A PDF page has a size in points: an A4 page is about 595 by 842 points. Drawn at that size, the picture would be 595 by 842 pixels, which looks soft on a modern screen. Drawing it at twice the size gives 1190 by 1684 pixels, equal to about 144 dpi. That is the size ToolsTree uses for a normal page, and it is sharp on most screens.",
      },
      {
        t: "p",
        text: "For very large pages the size is capped at 4096 pixels on the long side. Without a cap, a poster-sized page would ask the browser for a picture so big it could crash the tab.",
      },
      { t: "h2", text: "What size do you need?" },
      {
        t: "ul",
        items: [
          "A website or a social post: about 1200 to 1600 pixels wide is plenty. The standard 2x picture of an A4 page (1190 pixels wide) is a good fit.",
          "A slide: the picture only has to cover the slide. About 1600 to 1900 pixels on the long side is fine.",
          "Printing on A4 at 300 dpi: you need 2480 by 3508 pixels, more than the standard size gives. For print, send the PDF itself instead of a picture of it.",
        ],
      },
      { t: "h2", text: "JPG or PNG?" },
      {
        t: "p",
        text: "JPG makes small files and suits photographs. On pages that are mostly sharp black text, JPG can leave a faint fuzz around the letters. PNG keeps text edges crisp but makes bigger files. ToolsTree saves JPG at 90 percent quality; PNG output is not available yet.",
      },
      { t: "h2", text: "Steps" },
      {
        t: "ol",
        items: [
          "Open PDF to Image and choose your PDF. A progress message counts the pages as they are converted.",
          "To keep every page, press Download all (ZIP). The files are named after your PDF, for example report_page-1.jpg.",
          "To keep one page, press Save JPG under it.",
        ],
      },
      { t: "h2", text: "If the files are too big" },
      {
        t: "p",
        text: "Pages with large photos or full-colour backgrounds make bigger JPGs than pages of plain text. This tool does not let you choose the quality. If you only need part of a long PDF, extract those pages first with Split PDF, then convert them.",
      },
    ],
  },
  {
    slug: "split-pdf-by-page-range",
    lang: "en",
    title: "How to Split a PDF by Page Range",
    description:
      "Learn the page range format, how to extract pages into a new PDF, split every page into its own file, and what the ZIP download contains.",
    intro:
      "A long PDF often has to be cut into parts: chapters, single pages, or just the pages someone asked for. Splitting by page range is simple once you know how ranges are written.",
    tool: "split-pdf",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["delete-pages-from-a-pdf", "merge-pdf-files-without-uploading"],
    body: [
      { t: "h2", text: "How page ranges are written" },
      {
        t: "p",
        text: "In Custom Ranges mode you type page numbers and dashes, separated by commas. Every comma-separated part becomes its own PDF.",
      },
      {
        t: "ul",
        items: [
          "5-9 makes one file with pages 5 to 9. This is the way to extract pages.",
          "1-3, 4-8 makes two files: pages 1 to 3, and pages 4 to 8.",
          "2, 9, 12 makes three files with one page each, not one file with three pages.",
          "Ranges may overlap. A page that is in two ranges appears in both files.",
        ],
      },
      { t: "h2", text: "Extract pages into one new PDF" },
      {
        t: "ol",
        items: [
          "Open Split PDF and choose your file. The page count is shown next to its name.",
          "Choose Custom Ranges and type one range, for example 12-15.",
          "The thumbnails of those pages are coloured, and the pages you did not choose are greyed out as Not included.",
          "Press the download button. One range gives one PDF.",
        ],
      },
      { t: "h2", text: "Other ways to split" },
      {
        t: "ul",
        items: [
          "Every Page: each page becomes its own PDF, packed into one ZIP.",
          "Every N Pages: the file is cut into parts of the number of pages you choose, such as 10 pages each. The last part can be shorter.",
        ],
      },
      { t: "h2", text: "What the download contains" },
      {
        t: "p",
        text: "One file downloads as a normal PDF. More than one file downloads together as a ZIP named after your PDF, with names such as report_pages_1-3.pdf. Open the ZIP on your phone or computer to get the separate PDFs.",
      },
      { t: "h2", text: "Pages that are not next to each other" },
      {
        t: "p",
        text: "One range always means pages in a row. To keep pages 2, 9 and 12 in one file, either delete all the other pages with Remove Pages, or extract each page and combine them with Merge PDF.",
      },
      { t: "h2", text: "If it shows an error" },
      {
        t: "p",
        text: "The message under the range box tells you what is wrong: usually a number larger than the page count, or a range written backwards such as 5-3. Fix it and the download button turns on again.",
      },
    ],
  },
  {
    slug: "word-to-pdf-what-changes",
    lang: "en",
    title: "Word to PDF: What Changes and What Doesn't",
    description:
      "What survives when a browser tool converts DOCX to PDF, what does not, and how to get the best result with or without Microsoft Word.",
    intro:
      "A converted PDF that looks different from your document is annoying. Knowing what a browser-based converter keeps, and what it drops, saves you from surprises, and tells you when another method is better.",
    tool: "word-to-pdf",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["merge-pdf-files-without-uploading", "edit-text-in-a-pdf"],
    body: [
      { t: "h2", text: "The best method, if you have Word" },
      {
        t: "p",
        text: "In Microsoft Word, choose File, then Save As, then PDF. Word draws its own layout, so the PDF matches your document exactly and its text stays selectable. Google Docs has File, Download, PDF document for the same job. Use a browser converter when you do not have either at hand.",
      },
      { t: "h2", text: "How ToolsTree converts a .docx file" },
      {
        t: "p",
        text: "The tool reads the contents of your .docx file, lays them out on A4 pages in your browser, and saves each page into the PDF as a picture. Nothing is uploaded. Page breaks are placed in the empty gaps between lines so that no line is cut in half. This is a beta tool.",
      },
      { t: "h2", text: "What is kept" },
      {
        t: "ul",
        items: [
          "Headings, paragraphs, bold and italic text",
          "Bulleted and numbered lists",
          "Tables",
          "Pictures inside the text",
        ],
      },
      { t: "h2", text: "What is not kept" },
      {
        t: "ul",
        items: [
          "Your fonts: a similar sans-serif font is used, so line breaks and the page count can change.",
          "Headers, footers and page numbers",
          "Text boxes, columns and footnotes",
          "Tracked changes and comments",
          "The ability to select, search or copy the text in the PDF, because pages are pictures",
        ],
      },
      { t: "h2", text: "Get a better result" },
      {
        t: "ul",
        items: [
          "Use simple formatting: normal paragraphs, headings and tables instead of text boxes and columns.",
          "Save old .doc files as .docx first. The tool does not read the old format.",
          "Keep the file under 25 MB. Documents longer than about 15 pages are drawn at a slightly lower resolution to keep the PDF at a sensible size.",
          "Open the finished PDF and scroll through it before you send it.",
        ],
      },
      { t: "h2", text: "Need the text to be editable or searchable?" },
      {
        t: "p",
        text: "Pictures of pages cannot be edited as text. Edit your Word file first, then convert. If you need a PDF with real text, use Save as PDF in Word or Google Docs.",
      },
    ],
  },
  ...WEB_GUIDES,
];

export const HI_GUIDES: Guide[] = [
  {
    slug: "pdf-merge-kaise-kare",
    lang: "hi",
    title: "PDF फाइलें एक साथ कैसे जोड़ें (मोबाइल और लैपटॉप पर)",
    description:
      "कई PDF फाइलों को एक में जोड़ने का आसान तरीका। कुछ इंस्टॉल करने की जरूरत नहीं, फाइल अपलोड नहीं होती। मोबाइल और लैपटॉप दोनों पर।",
    intro:
      "अगर आपके पास कई PDF फाइलें हैं और आपको उन्हें एक ही फाइल में चाहिए, तो इसके लिए कोई सॉफ्टवेयर इंस्टॉल करने की जरूरत नहीं है। ToolsTree का Merge PDF टूल आपके ब्राउज़र में ही काम करता है, इसलिए आपकी फाइलें किसी सर्वर पर नहीं जातीं।",
    tool: "merge-pdf",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["jpg-ko-pdf-kaise-banaye", "pdf-se-page-kaise-hataye"],
    body: [
      { t: "h2", text: "PDF जोड़ने के आसान स्टेप" },
      {
        t: "ol",
        items: [
          "Merge PDF टूल खोलें।",
          "“Select PDFs” बटन दबाकर दो या ज्यादा PDF फाइलें चुनें। लैपटॉप पर आप फाइलों को खींचकर (ड्रैग करके) भी डाल सकते हैं।",
          "हर फाइल एक कार्ड के रूप में दिखेगी। कार्ड के नीचे बने तीर (← →) दबाकर क्रम बदलें। कार्ड पर लिखा नंबर बताता है कि वह फाइल आखिरी PDF में किस नंबर पर आएगी।",
          "गलती से जुड़ गई फाइल को हटाने के लिए कार्ड के ऊपर बना लाल बटन दबाएं।",
          "नीचे “Merge” बटन दबाएं। जुड़ी हुई PDF आपके फोन या कंप्यूटर में डाउनलोड हो जाएगी।",
        ],
      },
      { t: "h2", text: "मोबाइल पर करते समय ध्यान रखें" },
      {
        t: "ul",
        items: [
          "फाइलें चुनते समय उस फोल्डर को खोलें जहां आपकी PDF रखी है, जैसे Downloads।",
          "ड्रैग करना मुश्किल लगे तो तीर वाले बटन इस्तेमाल करें।",
          "बहुत बड़ी या बहुत सारी फाइलें हों तो पहले थोड़ी-थोड़ी जोड़ें, फिर नतीजों को आपस में जोड़ें। फोन की मेमोरी कम होती है।",
        ],
      },
      { t: "h2", text: "फाइल जुड़ नहीं रही हो तो" },
      {
        t: "p",
        text: "अगर किसी फाइल पर पासवर्ड लगा है तो वह नहीं जुड़ सकती। टूल आपको उस फाइल का नाम बताएगा। पहले उसका पासवर्ड हटा लें और फिर कोशिश करें। अधूरी डाउनलोड हुई या खराब फाइल भी नहीं जुड़ पाती।",
      },
      { t: "h2", text: "जुड़ने के बाद क्या जांचें" },
      {
        t: "ul",
        items: [
          "कुल पेज उतने ही हों जितने सारी फाइलों के पेज मिलाकर बनते हैं।",
          "कोई पेज उल्टा या आड़ा तो नहीं है। हो तो Rotate PDF से सीधा कर लें।",
          "ईमेल से भेजना हो तो फाइल का साइज़ देख लें। जोड़ने से फाइल छोटी नहीं होती।",
        ],
      },
      {
        t: "tip",
        text: "ध्यान दें: पुरानी फाइलों के बुकमार्क नई फाइल में नहीं आते, सिर्फ पेज आते हैं।",
      },
    ],
  },
  {
    slug: "jpg-ko-pdf-kaise-banaye",
    lang: "hi",
    title: "फोटो (JPG) को PDF कैसे बनाएं: मोबाइल पर आसान तरीका",
    description:
      "फोन से खींची फोटो या स्क्रीनशॉट से एक PDF बनाएं, सही क्रम और सीधी दिशा में। मुफ्त है और फोटो अपलोड नहीं होती।",
    intro:
      "फॉर्म भरते समय या ईमेल करते समय अक्सर कागज़ात की फोटो को एक PDF में बदलना पड़ता है। इसके लिए कोई ऐप डाउनलोड करने की जरूरत नहीं है। ToolsTree का Image to PDF टूल सीधे फोन के ब्राउज़र में चलता है और आपकी फोटो कहीं अपलोड नहीं होती।",
    tool: "image-to-pdf",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["pdf-merge-kaise-kare", "pdf-se-page-kaise-hataye"],
    body: [
      { t: "h2", text: "अच्छी PDF के लिए फोटो कैसे खींचें" },
      {
        t: "ul",
        items: [
          "कागज़ को किसी समतल जगह पर रखें और दिन की रोशनी में फोटो लें, ताकि पेज पर परछाईं न पड़े।",
          "फोन को कागज़ के ठीक ऊपर सीधा पकड़ें, वरना पेज तिरछा दिखेगा।",
          "पूरा पेज फ्रेम में आए, पर किनारे कटें नहीं।",
          "एक पेज की एक फोटो लें, उसी क्रम में जिसमें आपको PDF चाहिए।",
        ],
      },
      { t: "h2", text: "फोटो से PDF बनाने के स्टेप" },
      {
        t: "ol",
        items: [
          "Image to PDF टूल खोलें।",
          "“Select Images” दबाएं और गैलरी से अपनी फोटो चुनें। एक साथ कई फोटो चुन सकते हैं।",
          "फोटो के नीचे बने तीर (← →) दबाकर क्रम ठीक करें। पहली फोटो PDF का पहला पेज बनेगी।",
          "गलत फोटो हटाने के लिए उस पर बना लाल बटन दबाएं।",
          "“Convert to PDF” दबाएं। हर फोटो एक पेज बन जाएगी और PDF डाउनलोड हो जाएगी।",
        ],
      },
      {
        t: "p",
        text: "एंड्रॉयड फोन में फाइल आमतौर पर Downloads फोल्डर में मिलती है। iPhone में Files ऐप खोलकर Downloads फोल्डर देखें।",
      },
      { t: "h2", text: "iPhone की फोटो और HEIC की दिक्कत" },
      {
        t: "p",
        text: "iPhone की फोटो कई बार HEIC फॉर्मेट में सेव होती हैं, जिसे यह टूल नहीं पढ़ता। Settings में Camera खोलें, फिर Formats में जाकर Most Compatible चुन लें। इसके बाद नई फोटो JPG में सेव होंगी। यह टूल सिर्फ JPG और PNG फोटो लेता है।",
      },
      { t: "h2", text: "फोटो उल्टी या आड़ी दिखे तो" },
      {
        t: "p",
        text: "फोन से खींची फोटो की दिशा अपने आप ठीक कर दी जाती है। फिर भी कोई पेज गलत दिशा में रह जाए तो बनी हुई PDF को Rotate PDF से सीधा कर लें।",
      },
      { t: "h2", text: "फाइल का साइज़ कैसे संभालें" },
      {
        t: "p",
        text: "हर फोटो अच्छी क्वालिटी में रखी जाती है, इसलिए ज्यादा फोटो वाली PDF बड़ी हो सकती है। अगर वह ईमेल की सीमा से बड़ी हो जाए तो कम फोटो डालें या कैमरे की रेजोल्यूशन थोड़ी कम रखें। यह टूल फाइल को किसी तय साइज़ (जैसे 100 KB) पर नहीं लाता।",
      },
    ],
  },
  {
    slug: "pdf-se-page-kaise-hataye",
    lang: "hi",
    title: "PDF से फालतू पेज कैसे हटाएं",
    description:
      "PDF में से खाली या गैर-जरूरी पेज हटाने का आसान तरीका। पेज देखकर चुनें और नई PDF डाउनलोड करें। मुफ्त और सुरक्षित।",
    intro:
      "स्कैन की हुई PDF में अक्सर खाली पेज आ जाते हैं, या किसी फाइल के कुछ पेज दूसरों को भेजने लायक नहीं होते। Remove Pages टूल में आप हर पेज देखकर तय कर सकते हैं कि कौन सा हटाना है। फाइल आपके ब्राउज़र में ही रहती है।",
    tool: "remove-pages",
    published: "2026-10-22",
    updated: "2026-10-22",
    related: ["pdf-merge-kaise-kare", "jpg-ko-pdf-kaise-banaye"],
    body: [
      { t: "h2", text: "स्टेप-बाय-स्टेप" },
      {
        t: "ol",
        items: [
          "Remove Pages टूल खोलें और अपनी PDF चुनें। सारे पेज छोटे चित्र की तरह दिखेंगे।",
          "जो पेज हटाना है उस पर टैप या क्लिक करें। वह लाल हो जाएगा और उस पर “Removed” लिखा आएगा। गलती हो जाए तो उसी पेज पर दोबारा टैप करें।",
          "डाउनलोड बटन पर दिखता है कि कितने पेज हटेंगे। “Download PDF” दबाएं।",
        ],
      },
      { t: "h2", text: "हटाना बेहतर है या कुछ पेज चुनकर रखना" },
      {
        t: "p",
        text: "अगर ज्यादातर पेज रखने हैं और थोड़े हटाने हैं तो Remove Pages ठीक रहता है। अगर बड़ी फाइल में से सिर्फ कुछ पेज चाहिए, जैसे 100 में से पेज 12 से 15, तो Split PDF में सिर्फ 12-15 लिखकर वही पेज निकाल लें।",
      },
      { t: "h2", text: "ध्यान रखने की बातें" },
      {
        t: "ul",
        items: [
          "आपकी असली फाइल नहीं बदलती, नई फाइल बनती है। जांचने से पहले पुरानी फाइल संभालकर रखें।",
          "सारे पेज नहीं हटाए जा सकते। कम से कम एक पेज रखना जरूरी है।",
          "पेज पर छपे नंबर (जैसे “पेज 5”) अपने आप नहीं बदलते।",
          "अगर PDF पर पासवर्ड लगा है तो टूल उसे नहीं खोल पाएगा। पहले पासवर्ड हटाएं।",
        ],
      },
      { t: "h2", text: "निजी जानकारी वाला पेज हटाते समय" },
      {
        t: "p",
        text: "किसी को फाइल भेजने से पहले नई PDF को पूरा खोलकर देख लें। कई बार फोन नंबर या पता दूसरे पेजों पर भी छपा होता है, जैसे सबसे नीचे या हस्ताक्षर वाली जगह पर।",
      },
    ],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
export const getHiGuide = (slug: string) => HI_GUIDES.find((g) => g.slug === slug);
