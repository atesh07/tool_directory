import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/data/tools";
import type { ExamSpec } from "@/data/exam-specs";
import { docPagePath, docPages, kbRange } from "@/lib/examContent";

// Pieces shared by the exam photo resizer hub and the exam pages. All server-rendered text.

export function SpecTable({ exam }: { exam: ExamSpec }) {
  return (
    <div tabIndex={0} role="region" aria-label={`${exam.name} upload sizes`} className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-900">
          <tr>
            <th scope="col" className="px-3 py-2 font-semibold">Document</th>
            <th scope="col" className="px-3 py-2 font-semibold">Size in the notification</th>
            <th scope="col" className="px-3 py-2 font-semibold">File size</th>
            <th scope="col" className="px-3 py-2 font-semibold">Format</th>
            <th scope="col" className="px-3 py-2 font-semibold">This tool makes</th>
          </tr>
        </thead>
        <tbody>
          {exam.docs.map((d) => (
            <tr key={d.id} className="border-t border-slate-200 align-top">
              <th scope="row" className="px-3 py-2 font-semibold text-slate-900">
                {d.label}
                {!d.verified && <span className="ml-1 text-xs font-normal text-amber-700">(to be confirmed)</span>}
              </th>
              <td className="px-3 py-2 text-slate-700">{d.sizeText}</td>
              <td className="px-3 py-2 text-slate-700">{kbRange(d)}</td>
              <td className="px-3 py-2 text-slate-700">{d.format}</td>
              <td className="px-3 py-2 text-slate-700">
                {d.width} x {d.height} px{d.nameDate ? ", with name and date" : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FaqList({ faq }: { faq: Faq[] }) {
  return (
    <div className="space-y-3">
      {faq.map((item) => (
        <details key={item.q} className="group rounded-xl border border-slate-200 bg-white">
          <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-slate-900">
            {item.q}
            <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Steps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.title}>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#0066cc] font-bold text-white">{i + 1}</div>
          <h3 className="mb-1 font-semibold text-slate-900">{s.title}</h3>
          <p className="text-sm leading-relaxed text-slate-600">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

/** Links to the other tools that help with an application: the KB resizer, passport photos and PDFs */
export function OtherTools() {
  const links = [
    { href: "/tools/resize-image-under-100kb", name: "Resize & Compress Image to 100KB", text: "Any picture under a KB limit, several at once." },
    { href: "/tools/passport-size-photo-maker", name: "Passport Size Photo Maker", text: "35 x 45 mm photos and 4x6 or A4 print sheets." },
    { href: "/tools/image-to-pdf", name: "Image to PDF", text: "Certificates and ID cards as one PDF." },
    { href: "/tools/merge-pdf", name: "Merge PDF", text: "Put several documents into one file for upload." },
  ];
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition hover:border-[#0066cc]/40 hover:shadow-md">
            <span className="font-semibold text-slate-900">{l.name}</span>
            <span className="mt-1 block text-sm text-slate-600">{l.text}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** The sizes at a glance, one card per document, so the answer is visible before any scrolling */
export function QuickFacts({ exam, only }: { exam: ExamSpec; only?: string }) {
  const docs = only ? exam.docs.filter((d) => d.id === only) : exam.docs;
  const live = !only && !exam.docs.some((d) => d.kind === "photo");
  return (
    <section aria-label={`${exam.name} sizes at a glance`} className={`grid gap-3 ${docs.length > 1 || live ? "grid-cols-2 lg:grid-cols-4" : "mx-auto max-w-md"}`}>
      {live && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Photo</p>
          <p className="mt-1 text-xl font-bold text-slate-900">Live capture</p>
          <p className="text-sm text-slate-600">Taken by camera in the form, not uploaded</p>
        </div>
      )}
      {docs.map((d) => (
        <div key={d.id} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{d.label}</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{kbRange(d)}</p>
          <p className="text-sm text-slate-600">
            {d.width} x {d.height} px, {d.format}
          </p>
          {!only && docPages(exam).some((x) => x.id === d.id) && (
            <Link href={docPagePath(exam, d)} className="mt-2 inline-flex min-h-[44px] items-center text-sm font-medium text-[#0066cc] underline">
              {d.label} guide
            </Link>
          )}
        </div>
      ))}
    </section>
  );
}
