import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { HI_GUIDES, hiGuidePath } from "@/data/guides";
import { TOOLS, toolPath } from "@/data/tools";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "हिंदी में PDF गाइड",
  description: "PDF जोड़ना, फोटो से PDF बनाना और पेज हटाना: सीधे हिंदी में लिखे आसान गाइड, मोबाइल और लैपटॉप दोनों के लिए।",
  path: "/hi",
  ogTitle: "PDF guides in Hindi",
  locale: "hi_IN",
});

export default function HindiHub() {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50 pt-12 pb-20 px-4">
      <JsonLd data={breadcrumbJsonLd([{ name: "होम", path: "/" }, { name: "हिंदी गाइड", path: "/hi" }])} />
      <div className="max-w-3xl mx-auto">
        <header className="pt-8 pb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">हिंदी में PDF गाइड</h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            रोज़ के PDF कामों के लिए आसान गाइड, जो सीधे हिंदी में लिखे गए हैं। सारे टूल मुफ्त हैं और आपकी फाइल आपके ब्राउज़र से बाहर नहीं जाती।
          </p>
        </header>

        <ul className="space-y-4">
          {HI_GUIDES.map((g) => (
            <li key={g.slug}>
              <Link href={hiGuidePath(g.slug)} className="block rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#0066cc]/40 hover:shadow-lg transition">
                <h2 className="text-xl font-bold text-slate-900">{g.title}</h2>
                <p className="mt-2 leading-relaxed text-slate-600">{g.description}</p>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6" aria-labelledby="tools-hi">
          <h2 id="tools-hi" className="text-xl font-bold text-slate-900">टूल</h2>
          <p className="mt-2 text-slate-600">टूल के बटन और संदेश अभी अंग्रेज़ी में हैं, पर ऊपर के गाइड में हर बटन का मतलब बताया गया है।</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {TOOLS.map((t) => (
              <li key={t.slug}>
                <Link href={toolPath(t.slug)} className="inline-flex min-h-[44px] items-center rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:border-[#0066cc] hover:text-[#0066cc]">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
