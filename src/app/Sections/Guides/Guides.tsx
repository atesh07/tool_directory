import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GUIDES, guidePath } from "@/data/guides";
import { getTool } from "@/data/tools";

// Home page block that links to the guides (helps visitors and gives the guides internal links)
export default function Guides() {
  const latest = GUIDES.slice(0, 4);
  return (
    <section className="w-full bg-white border-t py-20" aria-labelledby="home-guides">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <h2 id="home-guides" className="text-3xl md:text-4xl font-extrabold text-slate-900">
              PDF guides
            </h2>
            <p className="mt-3 text-lg text-slate-600">Step-by-step help for the jobs people ask about most, with the limits explained.</p>
          </div>
          <Link href="/guides" className="inline-flex min-h-[44px] items-center gap-1 font-semibold text-[#0066cc] hover:underline">
            All guides <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((g) => (
            <Link key={g.slug} href={guidePath(g.slug)} className="block rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:border-[#0066cc]/40 hover:bg-white hover:shadow-md transition">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#0062cc]">{getTool(g.tool)?.name}</span>
              <h3 className="mt-1 font-bold text-slate-900 leading-snug">{g.title}</h3>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-slate-600">
          हिंदी में पढ़ना चाहते हैं?{" "}
          <Link href="/hi" className="font-semibold text-[#0066cc] underline">
            हिंदी गाइड देखें
          </Link>
        </p>
      </div>
    </section>
  );
}
