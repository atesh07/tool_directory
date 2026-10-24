import Link from "next/link";
import { BookOpen, Check, ChevronDown, Lock } from "lucide-react";
import JsonLd from "./JsonLd";
import InterruptedNotice from "@/components/tools/InterruptedNotice";
import { TOOLS, getTool, toolPath } from "@/data/tools";
import { getGuide, guidePath } from "@/data/guides";
import { breadcrumbJsonLd, faqJsonLd, softwareJsonLd } from "@/lib/seo";

/**
 * Shared page for every tool. Everything below the tool is plain server-rendered text (what it does, limits,
 * troubleshooting, FAQ, links), which is what search engines and visitors who scroll read.
 */
export default function ToolPage({ slug, children }: { slug: string; children: React.ReactNode }) {
  const tool = getTool(slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  const related = tool.related.map((s) => getTool(s)).filter((t): t is NonNullable<typeof t> => !!t);
  const others = TOOLS.filter((t) => t.slug !== slug && !tool.related.includes(t.slug));
  const guides = tool.guides.map((g) => getGuide(g)).filter((g): g is NonNullable<typeof g> => !!g);

  return (
    <main id="main-content" className="min-h-screen bg-slate-50 flex flex-col pt-12">
      <JsonLd
        data={[
          softwareJsonLd(tool),
          faqJsonLd(tool.faq),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: tool.name, path: toolPath(tool.slug) },
          ]),
        ]}
      />

      {/* Hero */}
      <header className="text-center pt-8 pb-10 px-4">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-4">
          <Link href="/" className="inline-flex min-h-[44px] items-center px-1 hover:text-[#0066cc]">Home</Link>
          <span className="mx-1" aria-hidden="true">/</span>
          <Link href="/tools" className="inline-flex min-h-[44px] items-center px-1 hover:text-[#0066cc]">Tools</Link>
          <span className="mx-1" aria-hidden="true">/</span>
          <span aria-current="page" className="text-slate-700">{tool.name}</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          {tool.heading[0]} <span className="text-[#0066cc]">{tool.heading[1]}</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">{tool.intro}</p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-slate-500">
          <Lock className="w-4 h-4" aria-hidden="true" /> Free, no sign-up. Everything runs in your browser.
        </p>
      </header>

      {/* The tool */}
      <div className={`${tool.wide ? "max-w-6xl" : "max-w-4xl"} mx-auto px-4 w-full relative z-10 mb-16`}>
        <div className="space-y-4">
          <InterruptedNotice />
          <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-4 md:p-8">{children}</div>
        </div>
      </div>

      {/* How to */}
      <section className="max-w-5xl mx-auto px-4 w-full py-12" aria-labelledby="how-to">
        <h2 id="how-to" className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10">
          How to use {tool.name}
        </h2>
        <ol className={`grid gap-8 ${tool.steps.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
          {tool.steps.map((step, i) => (
            <li key={step.title} className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[#0066cc] text-white flex items-center justify-center font-bold">
                {i + 1}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* What it does */}
      <section className="bg-white border-y border-slate-200 py-12" aria-labelledby="about">
        <div className="max-w-3xl mx-auto px-4">
          <h2 id="about" className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            About {tool.name}
          </h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            {tool.about.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <h3 className="mt-8 mb-3 text-lg font-semibold text-slate-900">When it helps</h3>
          <ul className="space-y-2">
            {tool.useCases.map((u) => (
              <li key={u} className="flex gap-3 text-slate-700">
                <Check className="w-5 h-5 text-[#0066cc] mt-0.5 shrink-0" aria-hidden="true" />
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Formats and limits */}
      <section className="max-w-3xl mx-auto px-4 w-full py-12" aria-labelledby="specs">
        <h2 id="specs" className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Supported files and limits
        </h2>
        <dl className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {tool.specs.map((row, i) => (
            <div key={row.label} className={`grid gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4 ${i % 2 ? "bg-slate-50" : ""}`}>
              <dt className="text-sm font-semibold text-slate-900">{row.label}</dt>
              <dd className="text-sm text-slate-700 sm:col-span-2">{row.value}</dd>
            </div>
          ))}
        </dl>
        {tool.reference && (
          <div className="mt-10">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">{tool.reference.heading}</h3>
            <p className="mb-3 text-sm text-slate-600">{tool.reference.intro}</p>
            <div tabIndex={0} role="region" aria-label={tool.reference.heading} className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full min-w-[360px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-900">
                  <tr>
                    {tool.reference.head.map((h) => (
                      <th key={h} scope="col" className="px-3 py-2 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tool.reference.rows.map((row) => (
                    <tr key={row[0]} className="border-t border-slate-200">
                      {row.map((cell, c) =>
                        c === 0 ? (
                          <th key={c} scope="row" className="px-3 py-2 font-mono text-[13px] font-semibold text-slate-900">{cell}</th>
                        ) : (
                          <td key={c} className="px-3 py-2 text-slate-700">{cell}</td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <h3 className="mt-8 mb-3 text-lg font-semibold text-slate-900">Good to know</h3>
        <ul className="list-disc space-y-2 pl-5 text-slate-700">
          {tool.limits.map((l) => (
            <li key={l.slice(0, 40)}>{l}</li>
          ))}
        </ul>
      </section>

      {/* Troubleshooting */}
      <section className="bg-white border-y border-slate-200 py-12" aria-labelledby="trouble">
        <div className="max-w-3xl mx-auto px-4">
          <h2 id="trouble" className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Troubleshooting
          </h2>
          <dl className="space-y-5">
            {tool.troubleshooting.map((t) => (
              <div key={t.problem}>
                <dt className="font-semibold text-slate-900">{t.problem}</dt>
                <dd className="mt-1 text-slate-700 leading-relaxed">{t.fix}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 w-full py-12" aria-labelledby="faq">
        <h2 id="faq" className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {tool.faq.map((item) => (
            <details key={item.q} className="group bg-white border border-slate-200 rounded-xl">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-slate-900">
                {item.q}
                <ChevronDown className="w-5 h-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* What to do next: links written as sentences, not just a grid */}
      {(tool.next.length > 0 || guides.length > 0) && (
      <section className="max-w-3xl mx-auto px-4 w-full pb-8" aria-labelledby="next">
        <h2 id="next" className="text-2xl font-bold text-slate-900 mb-4">
          What to do next
        </h2>
        <ul className="space-y-2 text-slate-700">
          {tool.next.map((n) => {
            const t = getTool(n.slug);
            const name = n.name ?? t?.name;
            if (!name) return null;
            return (
              <li key={n.slug}>
                {n.text}{" "}
                <Link href={n.href ?? toolPath(n.slug)} className="font-medium text-[#0066cc] underline">
                  Open {name}
                </Link>
              </li>
            );
          })}
        </ul>
        {guides.length > 0 && (
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="flex items-center gap-2 font-semibold text-slate-900">
              <BookOpen className="w-5 h-5 text-[#0066cc]" aria-hidden="true" /> Read the guide
            </p>
            <ul className="mt-2 space-y-1">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link href={guidePath(g.slug)} className="font-medium text-[#0066cc] underline">
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      )}

      {/* Related tools */}
      <section className="max-w-5xl mx-auto px-4 w-full pb-16" aria-labelledby="more">
        <h2 id="more" className="text-2xl font-bold text-slate-900 text-center mb-8">
          More free tools
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...related, ...others].slice(0, 6).map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.slug}
                href={toolPath(t.slug)}
                className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-[#0066cc]/40 hover:shadow-md transition"
              >
                <span className="w-10 h-10 rounded-lg bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center shrink-0">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-slate-900">{t.name}</span>
                  <span className="block text-sm text-slate-500 leading-snug">{t.intro}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
