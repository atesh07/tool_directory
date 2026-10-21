import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";
import JsonLd from "./JsonLd";
import { getTool, toolPath } from "@/data/tools";
import { getGuide, getHiGuide, guidePath, hiGuidePath, type Guide } from "@/data/guides";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const TEXT = {
  en: { home: "Home", guides: "Guides", updated: "Updated", tryIt: "Try it now", open: "Open", more: "More guides", min: "min read", tool: "Free tool" },
  hi: { home: "होम", guides: "गाइड", updated: "अपडेट", tryIt: "अभी आज़माएं", open: "खोलें", more: "और गाइड", min: "मिनट", tool: "मुफ्त टूल" },
};

const readMinutes = (g: Guide) => {
  const words = [g.intro, ...g.body.map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : ""))].join(" ").split(/\s+/).length;
  return Math.max(2, Math.round(words / (g.lang === "hi" ? 150 : 200)));
};

/** One guide page. English and Hindi guides share it; the Hindi ones sit under /hi and are written natively, not translated. */
export default function GuideArticle({ guide }: { guide: Guide }) {
  const tx = TEXT[guide.lang];
  const tool = getTool(guide.tool);
  const path = guide.lang === "hi" ? hiGuidePath(guide.slug) : guidePath(guide.slug);
  const listPath = guide.lang === "hi" ? "/hi" : "/guides";
  const related = guide.related
    .map((s) => (guide.lang === "hi" ? getHiGuide(s) : getGuide(s)))
    .filter((g): g is Guide => !!g);
  const dateText = new Date(guide.updated).toLocaleDateString(guide.lang === "hi" ? "hi-IN" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main id="main-content" className="min-h-screen bg-slate-50 pt-12 pb-20 px-4">
      <JsonLd
        data={[
          articleJsonLd(guide, path),
          breadcrumbJsonLd([
            { name: tx.home, path: "/" },
            { name: tx.guides, path: listPath },
            { name: guide.title, path },
          ]),
        ]}
      />
      <article className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl p-6 md:p-10">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-4">
          <Link href="/" className="inline-flex min-h-[44px] items-center px-1 hover:text-[#0066cc]">{tx.home}</Link>
          <span className="mx-1" aria-hidden="true">/</span>
          <Link href={listPath} className="inline-flex min-h-[44px] items-center px-1 hover:text-[#0066cc]">{tx.guides}</Link>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">{guide.title}</h1>
        <p className="mt-3 text-sm text-slate-500">
          {tx.updated} {dateText} · {readMinutes(guide)} {tx.min}
        </p>
        <p className="mt-6 text-lg text-slate-700 leading-relaxed">{guide.intro}</p>

        {tool && (
          <Link
            href={toolPath(tool.slug)}
            className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 hover:border-blue-300"
          >
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wide text-[#0062cc]">{tx.tool}</span>
              <span className="block font-semibold text-slate-900">{tool.name}</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-[#0062cc]">
              {tx.open} <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </Link>
        )}

        <div className="mt-8 space-y-4 text-slate-700 leading-relaxed">
          {guide.body.map((b, i) => {
            if (b.t === "h2") return <h2 key={i} className="pt-4 text-2xl font-bold text-slate-900">{b.text}</h2>;
            if (b.t === "p") return <p key={i}>{b.text}</p>;
            if (b.t === "ul")
              return (
                <ul key={i} className="list-disc space-y-2 pl-6">
                  {b.items.map((it) => <li key={it.slice(0, 50)}>{it}</li>)}
                </ul>
              );
            if (b.t === "ol")
              return (
                <ol key={i} className="list-decimal space-y-2 pl-6">
                  {b.items.map((it) => <li key={it.slice(0, 50)}>{it}</li>)}
                </ol>
              );
            return (
              <p key={i} className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
                <Lightbulb className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{b.text}</span>
              </p>
            );
          })}
        </div>

        {tool && (
          <div className="mt-10 rounded-xl bg-[#0062cc] p-6 text-white">
            <p className="text-lg font-bold">{tx.tryIt}: {tool.name}</p>
            <p className="mt-1 text-blue-100">{tool.intro}</p>
            <Link href={toolPath(tool.slug)} className="mt-4 inline-flex min-h-[48px] items-center rounded-lg bg-white px-6 font-bold text-[#0062cc] hover:bg-blue-50">
              {tx.open} {tool.name}
            </Link>
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-10" aria-labelledby="more-guides">
            <h2 id="more-guides" className="text-xl font-bold text-slate-900">{tx.more}</h2>
            <ul className="mt-3 space-y-2">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link href={g.lang === "hi" ? hiGuidePath(g.slug) : guidePath(g.slug)} className="font-medium text-[#0066cc] underline">
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
  );
}
