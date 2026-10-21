import Link from "next/link";
import { Check, ChevronDown, Lock } from "lucide-react";
import JsonLd from "./JsonLd";
import { TOOLS, getTool, toolPath } from "@/data/tools";
import { breadcrumbJsonLd, faqJsonLd, howToJsonLd, softwareJsonLd } from "@/lib/seo";

/**
 * Shared page for every tool. The server-rendered copy below the tool (steps, features, FAQ, related tools)
 * is what search engines read, so every tool page gets the same complete SEO structure.
 */
export default function ToolPage({ slug, children }: { slug: string; children: React.ReactNode }) {
  const tool = getTool(slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  const related = tool.related.map((s) => getTool(s)).filter((t): t is NonNullable<typeof t> => !!t);
  const others = TOOLS.filter((t) => t.slug !== slug && !tool.related.includes(t.slug));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-12">
      <JsonLd
        data={[
          softwareJsonLd(tool),
          faqJsonLd(tool.faq),
          howToJsonLd(tool),
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
          <Lock className="w-4 h-4" /> Free, no sign-up. Your files never leave your browser.
        </p>
      </header>

      {/* The tool */}
      <main id="main-content" className={`${tool.wide ? "max-w-6xl" : "max-w-4xl"} mx-auto px-4 w-full relative z-10 mb-16`}>
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-4 md:p-8">{children}</div>
      </main>

      {/* How to */}
      <section className="max-w-5xl mx-auto px-4 w-full py-12" aria-labelledby="how-to">
        <h2 id="how-to" className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10">
          How to use {tool.name}
        </h2>
        <ol className="grid md:grid-cols-3 gap-8">
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

      {/* Features */}
      <section className="bg-white border-y border-slate-200 py-12" aria-labelledby="why">
        <div className="max-w-5xl mx-auto px-4">
          <h2 id="why" className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10">
            Why use ToolsTree {tool.name}?
          </h2>
          <ul className="grid sm:grid-cols-2 gap-6">
            {tool.features.map((f) => (
              <li key={f.title} className="flex gap-3">
                <Check className="w-5 h-5 text-[#0066cc] mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 w-full py-12" aria-labelledby="faq">
        <h2 id="faq" className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {tool.faq.map((item) => (
            <details key={item.q} className="group bg-white border border-slate-200 rounded-xl p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                {item.q}
                <ChevronDown className="w-5 h-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related tools: internal links help both visitors and crawlers */}
      <section className="max-w-5xl mx-auto px-4 w-full pb-16" aria-labelledby="more">
        <h2 id="more" className="text-2xl font-bold text-slate-900 text-center mb-8">
          More free PDF tools
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
                  <Icon size={20} />
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
    </div>
  );
}
