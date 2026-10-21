import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { COMING_SOON, TOOLS, toolPath } from "@/data/tools";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "All Free PDF Tools",
  description: "Browse all free ToolsTree PDF tools: edit PDF text, merge, split, rotate, remove pages, and convert between PDF, images and Word. No sign-up.",
  path: "/tools",
});

export default function ToolsIndexPage() {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50 pt-12 pb-20 px-4">
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Tools", path: "/tools" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: TOOLS.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: absoluteUrl(toolPath(t.slug)) })),
          },
        ]}
      />
      <div className="max-w-6xl mx-auto">
        <header className="text-center pt-8 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            All <span className="text-[#0066cc]">PDF Tools</span>
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Free tools to edit, merge, split, rotate and convert PDF files. Everything runs in your browser, so your files stay private.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={toolPath(tool.slug)}
                className="block bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#0066cc]/40 hover:shadow-lg transition"
              >
                <span className="w-12 h-12 rounded-xl bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center mb-4">
                  <Icon size={24} />
                </span>
                <h2 className="font-semibold text-lg text-slate-900 mb-1">{tool.name}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{tool.intro}</p>
              </Link>
            );
          })}
        </div>

        <section className="mt-16 text-center" aria-labelledby="soon">
          <h2 id="soon" className="text-xl font-semibold text-slate-900 mb-4">Coming soon</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {COMING_SOON.map((name) => (
              <span key={name} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-sm text-slate-500">{name}</span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
