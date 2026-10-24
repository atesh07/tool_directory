import Link from "next/link";
import { Check, Lock } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { FaqList, OtherTools, Steps } from "@/components/seo/ExamSections";
import ExamResizerLoader from "@/components/tools/exam/ExamResizerLoader";
import type { Faq } from "@/data/tools";
import { EXAMS, EXAM_GROUPS, EXAM_HUB_PATH, examPath, toRules } from "@/data/exam-specs";
import { kbRange } from "@/lib/examContent";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, howToJsonLd, webAppJsonLd } from "@/lib/seo";

const TITLE = "Exam Photo & Signature Resizer: SSC, UPSC, IBPS, NEET";
const DESCRIPTION =
  "Resize your photo, signature and thumb impression for SSC, UPSC, IBPS, SBI, RRB, NEET, JEE and Gujarat OJAS forms, or any custom size and KB range. Free, no upload.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: EXAM_HUB_PATH,
  keywords: [
    "exam photo resizer", "photo and signature resizer", "photo resize for online form", "signature resize 10 to 20 kb", "photo resize 20 to 50 kb",
    "ssc photo resize", "upsc photo resize", "ibps photo resize", "sbi photo resize", "rrb photo resize", "neet photo resize", "jee main photo resize",
    "ojas photo resize 15 kb", "thumb impression resize", "handwritten declaration resize", "government exam photo size",
  ],
});

const STEPS = [
  { title: "Choose your exam", text: "Pick the exam from the list, or open its own page. For any other form, choose Custom size and type its width, height and KB range." },
  { title: "Choose the document", text: "Photo, signature, thumb impression or handwritten declaration: the size and KB range for it are applied automatically." },
  { title: "Crop the picture", text: "Drag, pinch and zoom inside the frame. It has the exact shape the form wants, so nothing gets stretched." },
  { title: "Make and download", text: "The file is made inside the allowed KB range and checked. Download it and upload it to the form." },
];

const FAQ: Faq[] = [
  { q: "How do I resize a photo between 20 KB and 50 KB?", a: "Choose your exam, or Custom size with 20 and 50 as the KB range, add the photo, crop it and press Make. The tool keeps the best quality that stays inside the range." },
  { q: "My signature comes out smaller than the minimum KB. What now?", a: "A clean signature on white paper is very small as a file. The tool first uses full quality and, if that is still under the minimum, adds empty data that viewers ignore, so the file passes the minimum without changing the picture." },
  { q: "Does 1 KB mean 1000 or 1024 bytes here?", a: "Portals differ, so the tool plays safe both ways: the file is at least the minimum counted with 1024 bytes and at most the maximum counted with 1000 bytes." },
  { q: "Can I use an iPhone photo?", a: "Yes. HEIC photos from iPhones are converted to JPG in your browser before cropping." },
  { q: "Is my photo uploaded?", a: "No. Everything happens in your browser. The photo and signature never leave your device." },
  { q: "My exam is not in the list. Can I still use it?", a: "Yes. Choose Custom size and enter the width and height in pixels and the minimum and maximum KB from your notification." },
  { q: "Are the exam rules up to date?", a: "Each exam shows the date its rules were last checked and a link to the official website. Rules can change with every notification, so always compare before you upload." },
];

export default function ExamHubPage() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col bg-slate-50 pt-12">
      <JsonLd
        data={[
          webAppJsonLd("Exam Photo & Signature Resizer", EXAM_HUB_PATH, DESCRIPTION),
          howToJsonLd("How to resize a photo and signature for an exam form", STEPS),
          faqJsonLd(FAQ),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Exam Photo Resizer", path: EXAM_HUB_PATH },
          ]),
        ]}
      />

      <header className="px-4 pb-10 pt-8 text-center">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
          <Link href="/" className="inline-flex min-h-[44px] items-center px-1 hover:text-[#0066cc]">Home</Link>
          <span className="mx-1" aria-hidden="true">/</span>
          <span aria-current="page" className="text-slate-700">Exam Photo Resizer</span>
        </nav>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Exam Photo & Signature <span className="text-[#0066cc]">Resizer</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Get your photo, signature, thumb impression and declaration to the exact pixel size and KB range of Indian government exam forms, or any size you type.
        </p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-slate-500">
          <Lock className="h-4 w-4" aria-hidden="true" /> Free, no sign-up. Your photo never leaves your device.
        </p>
      </header>

      <div className="relative z-10 mx-auto mb-16 w-full max-w-4xl px-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-8">
          <ExamResizerLoader exams={EXAMS.map(toRules)} />
        </div>
      </div>

      <section className="mx-auto w-full max-w-5xl px-4 pb-12" aria-labelledby="exams">
        <h2 id="exams" className="mb-2 text-2xl font-bold text-slate-900 md:text-3xl">Choose your exam</h2>
        <p className="mb-6 text-slate-700">Each exam has its own page with the full size table, tips and questions.</p>
        <div className="space-y-8">
          {EXAM_GROUPS.map((g) => {
            const list = EXAMS.filter((e) => e.group === g.id);
            if (!list.length) return null;
            return (
              <div key={g.id}>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">{g.name}</h3>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((e) => {
                    const p = e.docs.find((d) => d.kind === "photo");
                    const s = e.docs.find((d) => d.kind === "signature");
                    return (
                      <li key={e.slug}>
                        <Link href={examPath(e.slug)} className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition hover:border-[#0066cc]/40 hover:shadow-md">
                          <span className="font-semibold text-slate-900">{e.name} {p ? "photo" : "signature"} resizer</span>
                          <span className="mt-1 block text-sm text-slate-600">
                            {p ? `Photo ${kbRange(p)}` : "Live photo"}
                            {s ? `, signature ${kbRange(s)}` : ""}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-12" aria-labelledby="how-to">
        <div className="mx-auto max-w-5xl px-4">
          <h2 id="how-to" className="mb-8 text-2xl font-bold text-slate-900 md:text-3xl">How to resize a photo and signature for an exam form</h2>
          <Steps steps={STEPS} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-12" aria-labelledby="guide">
        <h2 id="guide" className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">Guide: getting the upload right the first time</h2>
        <div className="space-y-4 leading-relaxed text-slate-700">
          <p>
            Every form checks three things: the file type (almost always JPG), the size in pixels or centimetres, and the file size in KB. Most rejections come from the
            last one. A phone photo is 2 to 5 MB, while forms ask for 10 to 50 KB, and some also refuse files that are too small.
          </p>
          <h3 className="pt-2 text-lg font-semibold text-slate-900">The photo</h3>
          <p>
            Take it in daylight in front of a plain white or light wall, with someone else holding the phone at eye level. Look straight at the camera, keep both ears
            visible, and do not wear caps or dark glasses. Crop so the face fills most of the frame.
          </p>
          <h3 className="pt-2 text-lg font-semibold text-slate-900">The signature and thumb impression</h3>
          <p>
            Sign on plain white paper with a black pen (some forms allow dark blue), in your normal handwriting, not in capital letters. For a thumb impression, use a
            stamp pad and press once without smudging. Photograph both from straight above and crop closely.
          </p>
          <h3 className="pt-2 text-lg font-semibold text-slate-900">Before you upload</h3>
          <ul className="space-y-2">
            {[
              "Open the downloaded file and zoom in: the face and signature must be sharp.",
              "Check the size shown with the green tick against the latest notification.",
              "Keep the original photo. If the rules change, start again from it, not from the small file.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#0066cc]" aria-hidden="true" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 pb-12" aria-labelledby="faq">
        <h2 id="faq" className="mb-6 text-2xl font-bold text-slate-900 md:text-3xl">Frequently asked questions</h2>
        <FaqList faq={FAQ} />
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 pb-16" aria-labelledby="more">
        <h2 id="more" className="mb-4 text-2xl font-bold text-slate-900">More tools for your application</h2>
        <OtherTools />
      </section>
    </main>
  );
}
