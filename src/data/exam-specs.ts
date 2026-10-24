import type { Faq } from "./tools";

// Every exam's upload rules live here and only here. Pages, the tool, the sitemap and the structured data are all
// built from this list, so updating a number for a new notification means changing this file alone.
// Rules change every year: set `verified: true` only after reading the latest official notification, and update
// `lastVerified` on the exam when you do.

export type DocKind = "photo" | "signature" | "thumb" | "declaration";

export type DocRule = {
  /** Used in the file name, e.g. "photo" gives ssc-cgl-photo-35kb.jpg */
  id: string;
  kind: DocKind;
  label: string;
  /** Size of the file the tool makes, in pixels */
  width: number;
  height: number;
  /** Smallest size the form accepts (same shape), when the notification gives a range instead of one size */
  minWidth?: number;
  minHeight?: number;
  /** The size as the notification states it, shown to visitors, e.g. "3.5 cm x 4.5 cm" */
  sizeText: string;
  /** Written into the JPG when the size is given in cm, so the file measures right */
  dpi?: number;
  minKB: number;
  maxKB: number;
  format: "JPG";
  /** Exact file name the portal wants (UPSC asks for photo.jpg and signature.jpg) */
  fileName?: string;
  /** The form wants the name and the date of the photo printed on it */
  nameDate?: boolean;
  background?: string;
  notes?: string[];
  /** False until the numbers are checked against the latest official notification */
  verified: boolean;
};

export type ExamGroup = "SSC" | "UPSC" | "NTA" | "Banking" | "Railways" | "Gujarat";

export type ExamSpec = {
  slug: string;
  /** Short name used in titles, e.g. "SSC CGL" */
  name: string;
  fullName: string;
  body: string;
  group: ExamGroup;
  docs: DocRule[];
  officialSourceUrl: string;
  /** Date the rules were last checked (YYYY-MM-DD); shown on the page */
  lastVerified: string;
  /** Which notification the numbers come from, e.g. "SSC CGL 2025" */
  source: string;
  /** One paragraph written for this exam */
  intro: string;
  /** Points that apply to this exam only */
  notes: string[];
  /** Written questions for this exam; more are generated from the rules */
  faq: Faq[];
  keywords: string[];
  related: string[];
};

export const EXAM_GROUPS: { id: ExamGroup; name: string }[] = [
  { id: "SSC", name: "Staff Selection Commission (SSC)" },
  { id: "UPSC", name: "Union Public Service Commission (UPSC)" },
  { id: "NTA", name: "National Testing Agency (NTA)" },
  { id: "Banking", name: "Bank exams (IBPS and SBI)" },
  { id: "Railways", name: "Railway Recruitment Boards (RRB)" },
  { id: "Gujarat", name: "Gujarat state exams (OJAS)" },
];

// IBPS and SBI use the same four images (checked in IBPS PO/Clerk XVI and SBI PO/Clerk 2026 notifications)
const BANK_DOCS: DocRule[] = [
  {
    id: "photo", kind: "photo", label: "Photo", width: 200, height: 230,
    sizeText: "4.5 cm x 3.5 cm, 200 x 230 pixels (preferred)", minKB: 20, maxKB: 50, format: "JPG",
    background: "Recent colour photo on a light, preferably white, background. No caps or dark glasses; religious headwear is allowed if the face is fully visible.",
    verified: true,
  },
  {
    id: "signature", kind: "signature", label: "Signature", width: 140, height: 60,
    sizeText: "140 x 60 pixels (preferred)", minKB: 10, maxKB: 20, format: "JPG",
    notes: ["Black ink on white paper, not in capital letters. It must match the signature you make on the exam day."],
    verified: true,
  },
  {
    id: "left-thumb", kind: "thumb", label: "Left thumb", width: 240, height: 240, dpi: 200,
    sizeText: "3 cm x 3 cm, 240 x 240 pixels at 200 DPI", minKB: 20, maxKB: 50, format: "JPG",
    notes: ["Black or blue ink on white paper. Without a left thumb, use the right thumb, then a finger."],
    verified: true,
  },
  {
    id: "declaration", kind: "declaration", label: "Declaration", width: 800, height: 400, dpi: 200,
    sizeText: "10 cm x 5 cm, 800 x 400 pixels at 200 DPI", minKB: 50, maxKB: 100, format: "JPG",
    notes: ["Handwritten in English with black ink, not in capital letters, in the exact words given in the notification."],
    verified: true,
  },
];

// OJAS (Gujarat) gives centimetres only and a 15 KB maximum; the tool uses 100 DPI for the pixel size
const OJAS_DOCS: DocRule[] = [
  {
    id: "photo", kind: "photo", label: "Photo", width: 142, height: 197, dpi: 100,
    sizeText: "5 cm high x 3.6 cm wide", minKB: 0, maxKB: 15, format: "JPG",
    background: "Recent colour passport size photo on a plain light background.",
    verified: true,
  },
  {
    id: "signature", kind: "signature", label: "Signature", width: 295, height: 98, dpi: 100,
    sizeText: "2.5 cm high x 7.5 cm wide", minKB: 0, maxKB: 15, format: "JPG",
    notes: ["Black or blue ink on white paper, clearly readable."],
    verified: true,
  },
];

const bankExam = (e: Omit<ExamSpec, "group" | "docs" | "lastVerified">): ExamSpec => ({ ...e, group: "Banking", docs: BANK_DOCS, lastVerified: "2026-10-24" });

const BANK_EXAMS: ExamSpec[] = [
  bankExam({
    slug: "ibps-po",
    name: "IBPS PO",
    fullName: "IBPS Probationary Officer / Management Trainee (CRP PO/MT)",
    body: "the Institute of Banking Personnel Selection (IBPS)",
    officialSourceUrl: "https://www.ibps.in/",
    source: "the IBPS CRP PO/MT-XVI notification (30 June 2026)",
    intro:
      "IBPS PO needs four images: a 200 x 230 pixel photo of 20 to 50 KB, a 140 x 60 pixel signature of 10 to 20 KB, a left thumb impression and a handwritten declaration. The tool makes each one at the preferred size inside its KB range.",
    notes: [
      "A live photo is also taken through the webcam or phone during registration.",
      "Scan or photograph the documents at 200 DPI or more, in colour.",
      "Using the same photo at every stage matters: it is compared at the exam and at the interview.",
    ],
    faq: [
      { q: "What should the IBPS PO declaration say?", a: "Copy the exact text from the notification, which starts with \"I, (your name), hereby declare\". Write it in English in your own handwriting with black ink, not in capital letters." },
      { q: "Can I use a photo with spectacles for IBPS?", a: "Yes, if there is no glare and the eyes are clearly visible. Dark or tinted glasses are not allowed." },
    ],
    keywords: ["ibps po photo size", "ibps photo resize", "ibps signature size 10 to 20 kb", "ibps thumb impression size", "ibps declaration size 800x400", "ibps photo 200x230"],
    related: ["ibps-clerk", "sbi-po", "sbi-clerk"],
  }),
  bankExam({
    slug: "ibps-clerk",
    name: "IBPS Clerk",
    fullName: "IBPS Customer Service Associate (CRP CSA, Clerk)",
    body: "the Institute of Banking Personnel Selection (IBPS)",
    officialSourceUrl: "https://www.ibps.in/",
    source: "the IBPS CRP CSA-XVI notification (2026)",
    intro:
      "The IBPS Clerk (CSA) form takes the same four images as IBPS PO: photo 200 x 230 px in 20 to 50 KB, signature 140 x 60 px in 10 to 20 KB, left thumb 240 x 240 px and handwritten declaration 800 x 400 px.",
    notes: [
      "Applicants who already have these four images from IBPS PO can reuse them if they still meet the rules.",
      "If the signature uploaded and the one at the exam do not match, the candidature can be cancelled.",
    ],
    faq: [
      { q: "Is the IBPS Clerk photo size different from IBPS PO?", a: "No. Both 2026 notifications give the same sizes for all four images." },
      { q: "My thumb impression looks smudged. What should I do?", a: "Use a little stamp pad ink, press once and lift straight up. Photograph it in daylight and crop closely before making the file." },
    ],
    keywords: ["ibps clerk photo size", "ibps clerk signature size", "ibps clerk photo resize", "ibps csa photo size", "ibps clerk thumb impression size"],
    related: ["ibps-po", "sbi-clerk"],
  }),
  bankExam({
    slug: "sbi-po",
    name: "SBI PO",
    fullName: "State Bank of India Probationary Officer",
    body: "the State Bank of India",
    officialSourceUrl: "https://sbi.bank.in/web/careers",
    source: "SBI advertisement CRPD/PO/2026-27/09",
    intro:
      "SBI PO uses the same image rules as IBPS: a 200 x 230 pixel photo of 20 to 50 KB, a 140 x 60 pixel signature of 10 to 20 KB, a 240 x 240 pixel left thumb impression and an 800 x 400 pixel handwritten declaration.",
    notes: [
      "A live photo is captured during registration as well.",
      "Keep spare prints of the same photo for the exam and the interview.",
    ],
    faq: [
      { q: "Can I use my IBPS PO photo for SBI PO?", a: "Yes, as long as it is recent and the files meet the same sizes, which they do in the 2026 notifications." },
      { q: "Does the SBI declaration text differ from IBPS?", a: "The idea is the same, but copy the exact wording from the SBI advertisement you are applying for." },
    ],
    keywords: ["sbi po photo size", "sbi po signature size", "sbi photo resize", "sbi po thumb impression size", "sbi declaration size"],
    related: ["sbi-clerk", "ibps-po"],
  }),
  bankExam({
    slug: "sbi-clerk",
    name: "SBI Clerk",
    fullName: "State Bank of India Junior Associate (Customer Support and Sales)",
    body: "the State Bank of India",
    officialSourceUrl: "https://sbi.bank.in/web/careers",
    source: "SBI advertisement CRPD/CR/2026-27/17",
    intro:
      "SBI Clerk (Junior Associate) asks for a photo of 200 x 230 px in 20 to 50 KB, a signature of 140 x 60 px in 10 to 20 KB, a left thumb impression and a handwritten declaration, the same sizes as the bank PO exams.",
    notes: [
      "The declaration text for Junior Associate also includes your date of birth and ends with a line that the signature, photo and thumb impression are yours. Copy it exactly from the advertisement.",
      "Keep about 8 copies of the uploaded photo; two extra copies are needed on the exam day.",
    ],
    faq: [
      { q: "What is written in the SBI Clerk declaration?", a: "Your name, date of birth and a statement that the information is correct, plus a line that the signature, photo and left thumb impression are yours. Use the exact text from the advertisement." },
      { q: "How many photos do I need for SBI Clerk?", a: "The advertisement advises keeping about 8 copies of the same photo you uploaded, with two needed on the exam day." },
    ],
    keywords: ["sbi clerk photo size", "sbi junior associate photo size", "sbi clerk signature size", "sbi clerk declaration format", "sbi clerk photo resize"],
    related: ["sbi-po", "ibps-clerk"],
  }),
];

// SSC: about 6.0 x 2.0 cm, 10 to 20 KB; the tool uses 300 DPI as the GD notice states
const SSC_SIGNATURE: DocRule = {
  id: "signature", kind: "signature", label: "Signature", width: 709, height: 236, dpi: 300,
  sizeText: "about 6.0 cm x 2.0 cm", minKB: 10, maxKB: 20, format: "JPG",
  notes: ["Blurred or very small signatures are rejected. Sign large, in your normal signature."],
  verified: true,
};
const LIVE_PHOTO_SSC = "The photo is captured live in the form by webcam or phone (or the SSC app through a QR code). Old photos and photos of a photo are rejected: sit in good light in front of a plain wall, camera at eye level, no cap, mask or glasses.";

const sscExam = (e: Omit<ExamSpec, "group" | "docs" | "lastVerified" | "body" | "officialSourceUrl">): ExamSpec => ({
  ...e,
  notes: [LIVE_PHOTO_SSC, ...e.notes],
  group: "SSC",
  body: "the Staff Selection Commission (SSC)",
  docs: [SSC_SIGNATURE],
  officialSourceUrl: "https://ssc.gov.in/",
  lastVerified: "2026-10-24",
});

// UPSC Common Application Form: limits enforced by upsconline.nic.in (checked 24 Oct 2026)
const UPSC_DOCS: DocRule[] = [
  {
    id: "photo", kind: "photo", label: "Photo", width: 450, height: 600, minWidth: 300, minHeight: 400, fileName: "photo.jpg",
    sizeText: "No pixel size given (the live photo is cropped at 3:4)", minKB: 20, maxKB: 200, format: "JPG",
    background: "Recent colour photo on a plain white background, face covering at least 75% of it, eyes open, looking at the camera.",
    verified: true,
  },
  {
    id: "signature", kind: "signature", label: "Signature", width: 450, height: 450, minWidth: 350, minHeight: 350, fileName: "signature.jpg",
    sizeText: "350 to 500 pixels in width and height, three signatures one under the other", minKB: 20, maxKB: 100, format: "JPG",
    notes: ["Sign three times, one under the other, in black ink on plain unruled white paper."],
    verified: true,
  },
];
const upscExam = (e: Omit<ExamSpec, "group" | "docs" | "lastVerified" | "body" | "officialSourceUrl">): ExamSpec => ({
  ...e,
  notes: ["A live photo is also taken during the form by webcam, or by phone through a QR code, and must match the uploaded photo.", ...e.notes],
  group: "UPSC",
  body: "the Union Public Service Commission (UPSC)",
  docs: UPSC_DOCS,
  officialSourceUrl: "https://upsconline.nic.in/",
  lastVerified: "2026-10-24",
});

// RRB: at least 140 x 60 px, 100 DPI or more, inside a 35 x 20 mm box; the tool makes 350 x 200 px (254 DPI)
const rrbSignature = (verified: boolean): DocRule => ({
  id: "signature", kind: "signature", label: "Signature", width: 350, height: 200, dpi: 254,
  sizeText: "at least 140 x 60 pixels, 100 DPI or more, in a 35 x 20 mm box", minKB: 30, maxKB: 49, format: "JPG",
  notes: ["Black ink on white paper, in running handwriting, not block or capital letters."],
  verified,
});
const rrbExam = ({ verified, ...e }: Omit<ExamSpec, "group" | "docs" | "lastVerified" | "body" | "officialSourceUrl"> & { verified: boolean }): ExamSpec => ({
  ...e,
  notes: ["The photo is captured live by webcam or the phone's front camera. Old photos are not accepted.", ...e.notes],
  group: "Railways",
  body: "the Railway Recruitment Boards (RRB)",
  docs: [rrbSignature(verified)],
  officialSourceUrl: "https://rrbsecunderabad.gov.in/",
  lastVerified: "2026-10-24",
});

export const EXAMS: ExamSpec[] = [
  // ---------- SSC: the photo is taken live in the form, only the signature is uploaded ----------
  sscExam({
    slug: "ssc-cgl",
    name: "SSC CGL",
    fullName: "SSC Combined Graduate Level Examination",
    source: "the SSC CGL 2026 notice (21 May 2026)",
    intro:
      "In the SSC CGL form the photo is taken live with your webcam or phone camera, so there is no photo file to resize. The one image you upload is your signature: a JPG of 10 to 20 KB, about 6 cm wide and 2 cm high.",
    notes: [
      "Paragraph 9.6 of the 2026 notice gives the signature as about 6.0 x 2.0 cm, while one annexure says 4.0 x 2.0 cm. The KB range (10 to 20 KB) is the same in both, and that is what the form checks.",
    ],
    faq: [
      { q: "Do I need to upload a photo for SSC CGL?", a: "No. Since 2024 SSC takes the photo live during the application, by webcam or by the mobile app through a QR code. Old photos and photos of photos are rejected." },
      { q: "Why is my SSC CGL signature rejected?", a: "Usually it is blurred, very small inside the image, or outside 10 to 20 KB. Sign larger than usual, crop close and make the file here." },
    ],
    keywords: ["ssc cgl signature size", "ssc cgl signature resize", "ssc signature 10 to 20 kb", "ssc cgl photo size", "ssc cgl live photo", "ssc signature 6 x 2 cm"],
    related: ["ssc-chsl", "ssc-mts", "ssc-gd"],
  }),
  sscExam({
    slug: "ssc-chsl",
    name: "SSC CHSL",
    fullName: "SSC Combined Higher Secondary (10+2) Level Examination",
    source: "the SSC CHSL 2025 notice (23 June 2025)",
    intro:
      "SSC CHSL follows the same pattern as CGL: the photo is captured live in the form and only the signature is uploaded, as a 10 to 20 KB JPG of about 6 x 2 cm.",
    notes: [
      "The 2026 CHSL notice was not out when these rules were checked; the numbers come from the 2025 notice.",
      "As in CGL, one annexure gives the signature as 4.0 x 2.0 cm. The 10 to 20 KB range is the same.",
    ],
    faq: [
      { q: "Is the SSC CHSL signature size the same as CGL?", a: "Yes: a JPG of 10 to 20 KB, about 6 x 2 cm." },
      { q: "How do I take the SSC CHSL live photo?", a: "Sit in good light in front of a plain wall, camera at eye level, without cap, mask or glasses, and keep the whole face inside the frame on screen." },
    ],
    keywords: ["ssc chsl signature size", "ssc chsl signature resize", "ssc chsl photo size", "chsl signature 10 to 20 kb"],
    related: ["ssc-cgl", "ssc-mts", "ssc-gd"],
  }),
  sscExam({
    slug: "ssc-mts",
    name: "SSC MTS",
    fullName: "SSC Multi Tasking (Non-Technical) Staff and Havaldar Examination",
    source: "the SSC MTS and Havaldar 2025 notice (26 June 2025)",
    intro:
      "For SSC MTS and Havaldar, upload only your signature, a 10 to 20 KB JPG of about 6 cm x 2 cm. The photo is captured live while you fill the form.",
    notes: ["The 2026 MTS notice was not out when these rules were checked; the numbers come from the 2025 notice."],
    faq: [
      { q: "What is the SSC MTS signature size?", a: "A JPG of 10 to 20 KB, about 6.0 cm wide and 2.0 cm high." },
      { q: "Can I sign in capital letters for SSC MTS?", a: "Use your normal signature, the same one you will sign at the exam. A blurred or tiny signature is rejected." },
    ],
    keywords: ["ssc mts signature size", "ssc mts signature resize", "ssc mts photo size", "havaldar signature size"],
    related: ["ssc-gd", "ssc-chsl", "ssc-cgl"],
  }),
  sscExam({
    slug: "ssc-gd",
    name: "SSC GD",
    fullName: "SSC Constable (General Duty) Examination",
    source: "the SSC GD Constable 2026 notice (1 December 2025)",
    intro:
      "SSC GD Constable takes your photo live with the face inside a red box on screen. The signature is the only upload: a horizontal signature of about 6 x 2 cm at 300 DPI, as a 10 to 20 KB JPG.",
    notes: ["The signature must be horizontal. Small signatures are rejected, so sign large and crop close."],
    faq: [
      { q: "What is the SSC GD signature size?", a: "About 6.0 x 2.0 cm at 300 DPI, which is about 709 x 236 pixels, as a JPG of 10 to 20 KB." },
      { q: "What are the SSC GD live photo rules?", a: "Keep your face inside the red box, with no cap, mask, glasses or earphones, in good light in front of a plain background." },
    ],
    keywords: ["ssc gd signature size", "ssc gd signature resize", "ssc gd photo size", "ssc gd 10 to 20 kb signature"],
    related: ["ssc-mts", "ssc-cgl", "rrb-group-d"],
  }),

  // ---------- UPSC: one Common Application Form for CSE, NDA and CDS ----------
  upscExam({
    slug: "upsc-cse",
    name: "UPSC CSE",
    fullName: "UPSC Civil Services Examination",
    source: "the UPSC CSE 2026 notice and the upsconline portal limits",
    intro:
      "The UPSC Civil Services form takes a photo of 20 to 200 KB and one image with your signature written three times, 350 to 500 pixels each way and 20 to 100 KB. A live photo is taken as well and must match the uploaded one.",
    notes: [
      "The files must be named photo and signature (photo.jpg and signature.jpg). The tool saves them with these names.",
      "A photo ID card (20 to 200 KB JPG) and the 10th certificate (50 to 300 KB PDF) are uploaded too. The PDF can be made with Image to PDF.",
    ],
    faq: [
      { q: "How do I make the UPSC signature with three signatures?", a: "Sign three times, one under the other, in black ink on plain unruled white paper. Photograph it, choose Signature here and fit all three inside the square frame." },
      { q: "Does the UPSC photo need my name and date?", a: "The 2026 rules do not ask for it. They ask for a recent colour photo on a plain white background with the face covering at least 75% of it." },
    ],
    keywords: ["upsc photo size", "upsc signature size", "upsc photo resize", "upsc three signature", "upsc photo 20 to 200 kb", "upsc signature 350 x 350"],
    related: ["upsc-nda", "upsc-cds", "ssc-cgl"],
  }),
  upscExam({
    slug: "upsc-nda",
    name: "UPSC NDA",
    fullName: "UPSC National Defence Academy and Naval Academy Examination",
    source: "the UPSC NDA and NA (II) 2026 notice and the upsconline portal limits",
    intro:
      "NDA applications use the same UPSC Common Application Form as Civil Services: a 20 to 200 KB photo, a three-signature image of 20 to 100 KB, and a live photo taken during the form.",
    notes: [
      "Name the files photo.jpg and signature.jpg. The tool does this for you.",
      "Defence exams look closely at the photo match at the SSB interview, so use a recent photo and keep prints of the same one.",
    ],
    faq: [
      { q: "Is the NDA photo size the same as UPSC CSE?", a: "Yes. All UPSC exams now use one Common Application Form with the same photo and signature rules." },
      { q: "Can I use a photo in school uniform for NDA?", a: "The rules ask for a recent colour photo on a plain white background; they do not mention uniform. A plain shirt is the safe choice." },
    ],
    keywords: ["nda photo size", "nda signature size", "nda photo resize", "upsc nda photo 20 to 200 kb"],
    related: ["upsc-cds", "upsc-cse"],
  }),
  upscExam({
    slug: "upsc-cds",
    name: "UPSC CDS",
    fullName: "UPSC Combined Defence Services Examination",
    source: "the UPSC CDS (II) 2026 notice and the upsconline portal limits",
    intro:
      "CDS uses the UPSC Common Application Form too, so the photo is 20 to 200 KB, the signature image (three signatures) is 350 to 500 pixels and 20 to 100 KB, and a live photo is captured during the application.",
    notes: ["Name the files photo.jpg and signature.jpg. The tool does this for you."],
    faq: [
      { q: "What is the CDS signature size?", a: "One JPG with three identical signatures, between 350 and 500 pixels in width and height, and 20 to 100 KB." },
      { q: "Do I upload a new photo for every UPSC exam?", a: "The photo is part of your UPSC profile. Update it if it is no longer recent, and keep it the same as your live photo." },
    ],
    keywords: ["cds photo size", "cds signature size", "cds photo resize", "upsc cds signature 3 times"],
    related: ["upsc-nda", "upsc-cse"],
  }),

  // ---------- RRB: live photo, signature uploaded ----------
  rrbExam({
    slug: "rrb-ntpc",
    name: "RRB NTPC",
    fullName: "RRB Non-Technical Popular Categories (Graduate and Under-Graduate)",
    source: "CEN 06/2026 and CEN 07/2026",
    verified: false, // TODO: read from an official rrb*.gov.in copy; this was checked in mirror copies of the CEN
    intro:
      "In RRB NTPC 2026 the photo is taken live, and the signature is uploaded as a JPG of 30 to 49 KB, at least 140 x 60 pixels, written in running handwriting inside a 35 x 20 mm box.",
    notes: [
      "For the live photo: a pure plain white background, dark (not white) clothes, the head filling at least half the photo and nothing below the chest.",
      "A thumb impression in place of a signature is a reason for rejection.",
    ],
    faq: [
      { q: "Why is the RRB signature 30 to 49 KB?", a: "That is the range in the 2026 CEN. A signature is usually a much smaller file, so the tool saves it at full quality and adds empty data that viewers ignore to reach 30 KB." },
      { q: "What if my RRB live photo does not match my ID?", a: "The CEN says you then upload the Annexure form signed by a Gazetted Officer. Take the live photo in good light to avoid this." },
    ],
    keywords: ["rrb ntpc signature size", "rrb ntpc photo size", "rrb signature 30 to 49 kb", "rrb ntpc signature resize", "rrb live photo"],
    related: ["rrb-group-d", "ssc-cgl"],
  }),
  rrbExam({
    slug: "rrb-group-d",
    name: "RRB Group D",
    fullName: "RRB Level 1 (Group D) posts",
    source: "CEN 09/2025 (Level 1), detailed notice of 30 January 2026",
    verified: true,
    intro:
      "RRB Group D captures the photo live and asks you to upload the signature as a 30 to 49 KB JPG, at least 140 x 60 pixels at 100 DPI or more, in black ink running handwriting.",
    notes: ["Do not sign in block or capital letters. The signature should fit a 35 x 20 mm box."],
    faq: [
      { q: "What is the RRB Group D signature size?", a: "A JPG of 30 to 49 KB, at least 140 x 60 pixels, scanned at 100 DPI or more. The tool makes it 350 x 200 pixels, the shape of the 35 x 20 mm box." },
      { q: "Do I need a photo file for RRB Group D?", a: "No, the photo is taken live with a webcam or the phone's front camera during the application." },
    ],
    keywords: ["rrb group d signature size", "rrb group d photo size", "rrb group d signature resize", "rrb signature 30 to 49 kb"],
    related: ["rrb-ntpc", "ssc-gd"],
  }),
  // ---------- NTA ----------
  {
    slug: "neet-ug",
    name: "NEET UG",
    fullName: "National Eligibility cum Entrance Test (Undergraduate)",
    body: "the National Testing Agency (NTA)",
    group: "NTA",
    docs: [
      {
        id: "photo", kind: "photo", label: "Photo", width: 413, height: 531, minWidth: 240, minHeight: 309,
        sizeText: "Passport size (no pixel size given)", minKB: 10, maxKB: 200, format: "JPG",
        background: "White background, colour or black and white, with about 80% of the picture being the face, ears visible and no mask.",
        notes: ["The photo must have been taken after 1 January 2026."],
        verified: true,
      },
      { id: "signature", kind: "signature", label: "Signature", width: 600, height: 200, minWidth: 300, minHeight: 100, sizeText: "No pixel size given", minKB: 10, maxKB: 100, format: "JPG", verified: true },
      {
        id: "fingers-thumb", kind: "thumb", label: "Fingers and thumbs", width: 1000, height: 600, minWidth: 500, minHeight: 300,
        sizeText: "Left and right hand fingers and thumb impressions, no pixel size given", minKB: 50, maxKB: 200, format: "JPG",
        notes: ["The bulletin gives 10 to 200 KB in one place and 50 to 300 KB in another, so the tool keeps it between 50 and 200 KB, which satisfies both."],
        verified: true,
      },
    ],
    officialSourceUrl: "https://neet.nta.nic.in/",
    lastVerified: "2026-10-24",
    source: "the NEET UG 2026 Information Bulletin",
    intro:
      "NEET UG asks for a passport size photo of 10 to 200 KB, a signature of 10 to 100 KB and one image of the fingers and thumbs of both hands. No pixel size is fixed, so the KB range and a clear face are what matter.",
    notes: [
      "A live photo is also captured by webcam or phone during the application and matched with your Aadhaar photo. It is separate from the uploaded photo.",
      "Keep 6 to 8 passport size and 4 to 6 postcard size (4 x 6 inch) colour prints with a white background. The postcard photo is pasted on the admit card proforma and is not uploaded.",
      "The 2026 bulletin does not ask for the name and date to be printed on the uploaded photo. The name strip is left off unless you turn it on.",
    ],
    faq: [
      { q: "Do I need my name and date on the NEET photo?", a: "Not according to the NEET UG 2026 bulletin. Older years and some coaching sites mention it. If a newer bulletin asks for it, turn on Name and date on photo in the tool." },
      { q: "How do I upload the fingers and thumb impression for NEET?", a: "Put the impressions of the fingers and thumbs of both hands on one white sheet, photograph it from above, choose Fingers and thumbs here and crop it so all marks are inside the frame." },
    ],
    keywords: ["neet photo size", "neet ug photo resize", "neet signature size", "neet photo 10kb to 200kb", "neet thumb impression size", "neet photo resize online"],
    related: ["jee-main", "upsc-cse", "ssc-cgl"],
  },
  {
    slug: "jee-main",
    name: "JEE Main",
    fullName: "Joint Entrance Examination (Main)",
    body: "the National Testing Agency (NTA)",
    group: "NTA",
    docs: [
      {
        id: "photo", kind: "photo", label: "Photo", width: 413, height: 531, minWidth: 240, minHeight: 309,
        sizeText: "Passport size (no pixel size given)", minKB: 10, maxKB: 200, format: "JPG",
        background: "Colour photo, white background, about 80% face, ears visible, no mask.",
        verified: true,
      },
      { id: "signature", kind: "signature", label: "Signature", width: 600, height: 200, minWidth: 300, minHeight: 100, sizeText: "No pixel size given", minKB: 10, maxKB: 100, format: "JPG", verified: true },
    ],
    officialSourceUrl: "https://jeemain.nta.nic.in/",
    lastVerified: "2026-10-24",
    source: "the JEE Main 2026 Information Bulletin",
    intro:
      "The JEE Main form needs a recent colour photo of 10 to 200 KB and a signature of 10 to 100 KB, both as JPG. Some websites still show 10 to 300 KB or 4 to 30 KB from older years; those are out of date.",
    notes: [
      "A live photo is captured by webcam or phone while filling the form. The uploaded photo is a separate, recent passport size photo.",
      "The 2027 bulletin was not out when these rules were checked. Compare with it once it is published.",
    ],
    faq: [
      { q: "Is the JEE Main photo size 10 to 300 KB?", a: "Not in the 2026 bulletin. It says 10 to 200 KB for the photo and 10 to 100 KB for the signature." },
      { q: "Can I use the same photo for JEE Main and NEET?", a: "Yes, if it meets both sets of rules: white background, face about 80% of the picture, ears visible. NEET also wants it taken after 1 January 2026." },
    ],
    keywords: ["jee main photo size", "jee main photo resize", "jee main signature size", "jee photo 10 to 200 kb", "jee main photo resize online"],
    related: ["neet-ug", "ibps-po"],
  },

  // ---------- Banking ----------
  ...BANK_EXAMS,

  // ---------- Gujarat (OJAS) ----------
  {
    slug: "gpsc",
    name: "GPSC",
    fullName: "Gujarat Public Service Commission recruitment",
    body: "the Gujarat Public Service Commission on GPSC OJAS",
    group: "Gujarat",
    docs: OJAS_DOCS,
    officialSourceUrl: "https://gpsc-ojas.gujarat.gov.in/",
    lastVerified: "2026-10-24",
    source: "the GPSC OJAS How to Apply instructions",
    intro:
      "GPSC applications on gpsc-ojas.gujarat.gov.in take a photo of 5 cm x 3.6 cm and a signature of 2.5 cm x 7.5 cm, each as a JPG of at most 15 KB. The limit is small, so a close crop and a plain background matter.",
    notes: [
      "These are the portal's standing rules, not tied to one advertisement. Read the advertisement for your post as well.",
      "The photo and signature are uploaded once and linked to your OJAS confirmation number, so get them right before you confirm.",
    ],
    faq: [
      { q: "What is the GPSC photo size in pixels?", a: "GPSC gives the size in centimetres only: 3.6 cm wide and 5 cm high. The tool makes 142 x 197 pixels, which is that size at 100 DPI and fits easily under 15 KB." },
      { q: "Is there a minimum KB for GPSC?", a: "No minimum is given, only a maximum of 15 KB." },
    ],
    keywords: ["gpsc photo size", "gpsc ojas photo resize", "ojas photo 15 kb", "gpsc signature size", "ojas signature resize"],
    related: ["gsssb", "gujarat-police"],
  },
  {
    slug: "gsssb",
    name: "GSSSB",
    fullName: "Gujarat Subordinate Service Selection Board recruitment",
    body: "the Gujarat Subordinate Service Selection Board on OJAS",
    group: "Gujarat",
    docs: OJAS_DOCS,
    officialSourceUrl: "https://ojas.gujarat.gov.in/",
    lastVerified: "2026-10-24",
    source: "the OJAS upload instructions",
    intro:
      "GSSSB forms are filled on ojas.gujarat.gov.in, where the photo must be 5 cm long and 3.6 cm wide and the signature 2.5 cm by 7.5 cm, each a JPG of no more than 15 KB.",
    notes: [
      "Sign in black or blue ink on white paper.",
      "Some websites say the photo must have a white background and be less than a year old. That is not in the OJAS instructions we checked; follow your advertisement.",
    ],
    faq: [
      { q: "Why does OJAS refuse my photo?", a: "Most often the file is over 15 KB or is not a JPG. Make it here with GSSSB selected and the file stays under 15 KB as a JPG." },
      { q: "Can I use the same photo for GSSSB and GPSC?", a: "Yes. Both use the same OJAS sizes: photo 5 x 3.6 cm and signature 2.5 x 7.5 cm, at most 15 KB each." },
    ],
    keywords: ["gsssb photo size", "gsssb photo resize", "ojas photo size", "ojas photo resize 15kb", "gsssb signature size"],
    related: ["gpsc", "gujarat-police"],
  },
  {
    slug: "gujarat-police",
    name: "Gujarat Police",
    fullName: "Gujarat Police LRD and PSI recruitment",
    body: "the Gujarat Police Recruitment Board on OJAS",
    group: "Gujarat",
    docs: OJAS_DOCS,
    officialSourceUrl: "https://gprb.gujarat.gov.in/",
    lastVerified: "2026-10-24",
    source: "Gujarat Police Recruitment Board advertisement GPRB/202526/1 and the OJAS instructions",
    intro:
      "Gujarat Police LRD and PSI applications are filled on OJAS. The advertisement asks for a recent colour passport size photo and a clear signature, each a JPG of at most 15 KB, in the OJAS sizes of 5 x 3.6 cm and 2.5 x 7.5 cm.",
    notes: [
      "The advertisement GPRB/202526/1 covers both PSI and LRD (Lokrakshak) posts in one form.",
      "The signature must be clearly readable. Sign larger than usual on white paper so it stays sharp in a small file.",
    ],
    faq: [
      { q: "What is the photo size for Gujarat Police LRD?", a: "A JPG of at most 15 KB. OJAS asks for 5 cm high and 3.6 cm wide; the tool makes 142 x 197 pixels." },
      { q: "Is the LRD and PSI photo the same?", a: "Yes, in the 2025-26 recruitment both posts use one application on OJAS with the same photo and signature rules." },
    ],
    keywords: ["gujarat police photo size", "lrd photo size", "lrd photo resize", "psi photo size gujarat", "ojas lrd photo resize"],
    related: ["gpsc", "gsssb"],
  },
];

export const getExam = (slug: string) => EXAMS.find((e) => e.slug === slug);
export const examPath = (slug: string) => `/exam-photo-resizer/${slug}`;
export const EXAM_HUB_PATH = "/exam-photo-resizer";
export const isExamVerified = (e: ExamSpec) => e.docs.every((d) => d.verified);
/** Newest check date across all exams, for the hub page and the sitemap */
export const EXAMS_UPDATED = () => EXAMS.reduce((a, e) => (e.lastVerified > a ? e.lastVerified : a), "2026-10-24");

/** The rule data the tool needs in the browser (the page text stays on the server) */
export type ExamRules = Pick<ExamSpec, "slug" | "name" | "group" | "docs" | "lastVerified" | "officialSourceUrl">;
export const toRules = (e: ExamSpec): ExamRules => ({
  slug: e.slug,
  name: e.name,
  group: e.group,
  docs: e.docs,
  lastVerified: e.lastVerified,
  officialSourceUrl: e.officialSourceUrl,
});
