import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { CATEGORIES, COMING_SOON, TOOLS, toolPath } from "@/data/tools";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "All Free Online Tools: PDF, Image & Developer",
  description: "Every free ToolsTree tool: edit, merge, split and convert PDFs, make passport size photos, resize images to 100KB, and encode or decode URL, Base64 and JSON. No sign-up.",
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

        <div className="space-y-14">
          {CATEGORIES.map((cat) => (
            <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
              <h2 id={`cat-${cat.id}`} className="text-2xl font-bold text-slate-900">{cat.name}</h2>
              <p className="mt-1 mb-6 text-slate-600">{cat.description}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOOLS.filter((t) => t.category === cat.id).map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.slug}
                      href={toolPath(tool.slug)}
                      className="block bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#0066cc]/40 hover:shadow-lg transition"
                    >
                      <span className="w-12 h-12 rounded-xl bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center mb-4">
                        <Icon size={24} aria-hidden="true" />
                      </span>
                      <h3 className="font-semibold text-lg text-slate-900 mb-1">{tool.name}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{tool.intro}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <Link
          href="/exam-photo-resizer"
          className="mt-14 block rounded-2xl border border-[#0066cc]/30 bg-white p-6 transition hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold text-slate-900">Exam Photo & Signature Resizer</h2>
          <p className="mt-1 text-sm text-slate-600">
            Photo, signature and thumb impression in the exact size and KB range for SSC, UPSC, IBPS, SBI, RRB, NEET, JEE and Gujarat OJAS forms.
          </p>
        </Link>

        <p className="mt-14 text-center text-slate-600">
          Not sure which tool you need?{" "}
          <Link href="/guides" className="font-semibold text-[#0066cc] underline">
            Read the step-by-step guides
          </Link>
          .
        </p>

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
