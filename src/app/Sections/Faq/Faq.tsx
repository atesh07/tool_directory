import { ChevronDown } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { HOME_FAQ } from "@/data/tools";
import { faqJsonLd } from "@/lib/seo";

export default function Faq() {
  return (
    <section className="w-full bg-slate-50 border-t py-20" aria-labelledby="home-faq">
      <JsonLd data={faqJsonLd(HOME_FAQ)} />
      <div className="max-w-3xl mx-auto px-6">
        <h2 id="home-faq" className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center mb-10">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {HOME_FAQ.map((item) => (
            <details key={item.q} className="group bg-white border border-slate-200 rounded-xl">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-slate-900">
                {item.q}
                <ChevronDown className="w-5 h-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
