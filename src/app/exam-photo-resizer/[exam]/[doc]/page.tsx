import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Lock } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { FaqList, OtherTools, QuickFacts, Steps } from "@/components/seo/ExamSections";
import ExamResizerLoader from "@/components/tools/exam/ExamResizerLoader";
import { EXAMS, EXAM_HUB_PATH, examPath, getExam, toRules } from "@/data/exam-specs";
import { docDescription, docFaq, docPagePath, docPages, docRejections, docSteps, docTitle } from "@/lib/examContent";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, howToJsonLd, webAppJsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return EXAMS.flatMap((e) => docPages(e).map((d) => ({ exam: e.slug, doc: d.id })));
}

const find = (params: { exam: string; doc: string }) => {
  const exam = getExam(params.exam);
  const doc = exam ? docPages(exam).find((d) => d.id === params.doc) : undefined;
  return exam && doc ? { exam, doc } : null;
};

export function generateMetadata({ params }: { params: { exam: string; doc: string } }) {
  const found = find(params);
  if (!found) return {};
  const { exam, doc } = found;
  return buildMetadata({
    title: docTitle(exam, doc),
    description: docDescription(exam, doc),
    path: docPagePath(exam, doc),
    keywords: [`${exam.name} ${doc.label} size`, `${exam.name} ${doc.label} resize`, `${exam.name} ${doc.label} kb`].map((k) => k.toLowerCase()),
  });
}

export default function ExamDocPage({ params }: { params: { exam: string; doc: string } }) {
  const found = find(params);
  if (!found) notFound();
  const { exam, doc } = found;
  const path = docPagePath(exam, doc);
  const steps = docSteps(exam, doc);
  const faq = docFaq(exam, doc);
  const word = doc.label.toLowerCase();
  const siblings = docPages(exam).filter((d) => d.id !== doc.id);

  return (
    <main id="main-content" className="flex min-h-screen flex-col bg-slate-50 pt-12">
      <JsonLd
        data={[
          webAppJsonLd(`${exam.name} ${doc.label} Resizer`, path, docDescription(exam, doc)),
          howToJsonLd(`How to resize the ${exam.name} ${word}`, steps),
          faqJsonLd(faq),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Exam Photo Resizer", path: EXAM_HUB_PATH },
            { name: exam.name, path: examPath(exam.slug) },
            { name: doc.label, path },
          ]),
        ]}
      />

      <header className="px-4 pb-8 pt-8 text-center">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
          <Link href="/" className="inline-flex min-h-[44px] items-center px-1 hover:text-[#0066cc]">Home</Link>
          <span className="mx-1" aria-hidden="true">/</span>
          <Link href={EXAM_HUB_PATH} className="inline-flex min-h-[44px] items-center px-1 hover:text-[#0066cc]">Exam Photo Resizer</Link>
          <span className="mx-1" aria-hidden="true">/</span>
          <Link href={examPath(exam.slug)} className="inline-flex min-h-[44px] items-center px-1 hover:text-[#0066cc]">{exam.name}</Link>
          <span className="mx-1" aria-hidden="true">/</span>
          <span aria-current="page" className="text-slate-700">{doc.label}</span>
        </nav>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          {exam.name} {doc.label} <span className="text-[#0066cc]">Resizer</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Make your {exam.name} {word} {doc.width} x {doc.height} px and {doc.minKB ? `${doc.minKB} to ${doc.maxKB} KB` : `under ${doc.maxKB} KB`} in a minute, on your phone or computer.
        </p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-slate-500">
          <Lock className="h-4 w-4" aria-hidden="true" /> Free, no sign-up. Your picture never leaves your device.
        </p>
      </header>

      <div className="mx-auto mb-8 w-full max-w-4xl px-4">
        <QuickFacts exam={exam} only={doc.id} />
      </div>

      <div className="relative z-10 mx-auto mb-16 w-full max-w-4xl px-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-8">
          <ExamResizerLoader exams={EXAMS.map(toRules)} initialExam={exam.slug} initialDoc={doc.id} />
        </div>
      </div>

      <section className="border-y border-slate-200 bg-white py-12" aria-labelledby="how-to">
        <div className="mx-auto max-w-5xl px-4">
          <h2 id="how-to" className="mb-8 text-2xl font-bold text-slate-900 md:text-3xl">How to make the {exam.name} {word}</h2>
          <Steps steps={steps} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-12" aria-labelledby="rejected">
        <h2 id="rejected" className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">Why the {word} gets rejected</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-700">
          {docRejections(doc).map((r) => (
            <li key={r.slice(0, 40)}>{r}</li>
          ))}
        </ul>
        {!doc.verified && (
          <p className="mt-6 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            This size is not yet confirmed from the latest notification. Check it on the official website before you upload.
          </p>
        )}
        <p className="mt-6 text-sm text-slate-600">
          Rules from {exam.source}, last checked on <time dateTime={exam.lastVerified}>{exam.lastVerified}</time>.{" "}
          <a href={exam.officialSourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[#0066cc] underline">
            Official website
          </a>
        </p>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 pb-12" aria-labelledby="faq">
        <h2 id="faq" className="mb-6 text-2xl font-bold text-slate-900 md:text-3xl">{exam.name} {word} FAQ</h2>
        <FaqList faq={faq} />
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 pb-16" aria-labelledby="more">
        <h2 id="more" className="mb-4 text-2xl font-bold text-slate-900">Other {exam.name} documents</h2>
        <ul className="mb-6 flex flex-wrap gap-2">
          <li>
            <Link href={examPath(exam.slug)} className="inline-flex min-h-[44px] items-center rounded-full border border-[#0066cc] bg-white px-4 text-sm font-semibold text-[#0066cc]">
              {exam.name} photo
            </Link>
          </li>
          {siblings.map((d) => (
            <li key={d.id}>
              <Link href={docPagePath(exam, d)} className="inline-flex min-h-[44px] items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 hover:border-[#0066cc] hover:text-[#0066cc]">
                {exam.name} {d.label.toLowerCase()}
              </Link>
            </li>
          ))}
        </ul>
        <OtherTools />
      </section>
    </main>
  );
}
