import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Check, Lock } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { FaqList, OtherTools, QuickFacts, SpecTable, Steps } from "@/components/seo/ExamSections";
import ExamResizerLoader from "@/components/tools/exam/ExamResizerLoader";
import { EXAMS, EXAM_HUB_PATH, examPath, getExam, isExamVerified, toRules } from "@/data/exam-specs";
import { examDescription, examFaq, examH1, examSteps, examTips, examTitle, hasPhoto, rejectionReasons } from "@/lib/examContent";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, howToJsonLd, webAppJsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return EXAMS.map((e) => ({ exam: e.slug }));
}

export function generateMetadata({ params }: { params: { exam: string } }) {
  const exam = getExam(params.exam);
  if (!exam) return {};
  return buildMetadata({ title: examTitle(exam), description: examDescription(exam), path: examPath(exam.slug), keywords: exam.keywords });
}

export default function ExamPage({ params }: { params: { exam: string } }) {
  const exam = getExam(params.exam);
  if (!exam) notFound();
  const path = examPath(exam.slug);
  const steps = examSteps(exam);
  const faq = examFaq(exam);
  const h1 = examH1(exam);
  const verified = isExamVerified(exam);
  const what = hasPhoto(exam) ? "photo and signature" : "signature";
  const related = exam.related.map((s) => getExam(s)).filter((e): e is NonNullable<typeof e> => !!e);

  return (
    <main id="main-content" className="flex min-h-screen flex-col bg-slate-50 pt-12">
      <JsonLd
        data={[
          webAppJsonLd(`${h1[0]} ${h1[1]}`, path, examDescription(exam)),
          howToJsonLd(`How to resize the ${exam.name} ${what}`, steps),
          faqJsonLd(faq),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Exam Photo Resizer", path: EXAM_HUB_PATH },
            { name: exam.name, path },
          ]),
        ]}
      />

      <header className="px-4 pb-10 pt-8 text-center">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
          <Link href="/" className="inline-flex min-h-[44px] items-center px-1 hover:text-[#0066cc]">Home</Link>
          <span className="mx-1" aria-hidden="true">/</span>
          <Link href={EXAM_HUB_PATH} className="inline-flex min-h-[44px] items-center px-1 hover:text-[#0066cc]">Exam Photo Resizer</Link>
          <span className="mx-1" aria-hidden="true">/</span>
          <span aria-current="page" className="text-slate-700">{exam.name}</span>
        </nav>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          {h1[0]} <span className="text-[#0066cc]">{h1[1]}</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">{exam.intro}</p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-slate-500">
          <Lock className="h-4 w-4" aria-hidden="true" /> Free, no sign-up. Your photo never leaves your device.
        </p>
      </header>

      <div className="mx-auto mb-8 w-full max-w-4xl px-4">
        <QuickFacts exam={exam} />
      </div>

      <div className="relative z-10 mx-auto mb-16 w-full max-w-4xl px-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-8">
          <ExamResizerLoader exams={EXAMS.map(toRules)} initialExam={exam.slug} />
        </div>
      </div>

      <section className="mx-auto w-full max-w-3xl px-4 py-10" aria-labelledby="sizes">
        <h2 id="sizes" className="mb-3 text-2xl font-bold text-slate-900 md:text-3xl">{exam.name} {what} size</h2>
        <p className="mb-4 text-slate-700">
          {exam.fullName}, conducted by {exam.body}. Upload rules from {exam.source}:
        </p>
        <SpecTable exam={exam} />
        <p className="mt-3 text-sm text-slate-600">
          Rules last checked on <time dateTime={exam.lastVerified}>{exam.lastVerified}</time>.{" "}
          <a href={exam.officialSourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[#0066cc] underline">
            Official website
          </a>
        </p>
        {!verified && (
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Some of these numbers are not yet confirmed from the latest notification. Check them on the official website before you upload.
          </p>
        )}
        {exam.notes.length > 0 && (
          <>
            <h3 className="mb-2 mt-8 text-lg font-semibold text-slate-900">Good to know for {exam.name}</h3>
            <ul className="list-disc space-y-2 pl-5 text-slate-700">
              {exam.notes.map((n) => (
                <li key={n.slice(0, 40)}>{n}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="border-y border-slate-200 bg-white py-12" aria-labelledby="how-to">
        <div className="mx-auto max-w-5xl px-4">
          <h2 id="how-to" className="mb-8 text-2xl font-bold text-slate-900 md:text-3xl">How to resize the {exam.name} {what}</h2>
          <Steps steps={steps} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-12" aria-labelledby="rejected">
        <h2 id="rejected" className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">Why {exam.name} {hasPhoto(exam) ? "photos" : "uploads"} get rejected</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-700">
          {rejectionReasons(exam).map((r) => (
            <li key={r.slice(0, 40)}>{r}</li>
          ))}
        </ul>
        <h2 className="mb-4 mt-10 text-2xl font-bold text-slate-900 md:text-3xl">Tips for a clear {what}</h2>
        <ul className="space-y-2">
          {examTips(exam).map((t) => (
            <li key={t.slice(0, 40)} className="flex gap-3 text-slate-700">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#0066cc]" aria-hidden="true" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 pb-12" aria-labelledby="faq">
        <h2 id="faq" className="mb-6 text-2xl font-bold text-slate-900 md:text-3xl">{exam.name} {what} FAQ</h2>
        <FaqList faq={faq} />
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 pb-16" aria-labelledby="more">
        <h2 id="more" className="mb-4 text-2xl font-bold text-slate-900">Other exams and tools</h2>
        {related.length > 0 && (
          <ul className="mb-6 flex flex-wrap gap-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={examPath(r.slug)} className="inline-flex min-h-[44px] items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 hover:border-[#0066cc] hover:text-[#0066cc]">
                  {r.name} {hasPhoto(r) ? "photo" : "signature"} resizer
                </Link>
              </li>
            ))}
            <li>
              <Link href={EXAM_HUB_PATH} className="inline-flex min-h-[44px] items-center rounded-full border border-[#0066cc] bg-white px-4 text-sm font-semibold text-[#0066cc]">
                All exams →
              </Link>
            </li>
          </ul>
        )}
        <OtherTools />
      </section>
    </main>
  );
}
