import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { GUIDES, HI_GUIDES, guidePath } from "@/data/guides";
import { getTool } from "@/data/tools";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "PDF Guides and Tutorials",
  description: "Practical, step-by-step guides for everyday PDF jobs: merge, split, edit, rotate, delete pages and convert, with the limits explained honestly.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50 pt-12 pb-20 px-4">
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: GUIDES.map((g, i) => ({ "@type": "ListItem", position: i + 1, name: g.title, url: absoluteUrl(guidePath(g.slug)) })),
          },
        ]}
      />
      <div className="max-w-4xl mx-auto">
        <header className="pt-8 pb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            PDF <span className="text-[#0066cc]">Guides</span>
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Short, practical guides for the PDF jobs people really do. Each one explains the steps, the limits and what to check before you send a file.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          {GUIDES.map((g) => {
            const tool = getTool(g.tool);
            return (
              <Link key={g.slug} href={guidePath(g.slug)} className="block rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#0066cc]/40 hover:shadow-lg transition">
                {tool && <span className="text-xs font-semibold uppercase tracking-wide text-[#0062cc]">{tool.name}</span>}
                <h2 className="mt-1 text-lg font-bold text-slate-900">{g.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{g.description}</p>
              </Link>
            );
          })}
        </div>

        <section className="mt-14 rounded-2xl border border-slate-200 bg-white p-6" aria-labelledby="hindi">
          <h2 id="hindi" className="text-xl font-bold text-slate-900">हिंदी में गाइड</h2>
          <p className="mt-2 text-slate-600">
            हिंदी के गाइड अलग से, सीधे हिंदी में लिखे गए हैं ({HI_GUIDES.length} गाइड)।{" "}
            <Link href="/hi" className="font-semibold text-[#0066cc] underline">हिंदी गाइड देखें</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
