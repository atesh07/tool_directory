"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock } from "lucide-react";
import { CATEGORIES, COMING_SOON, TOOLS, toolPath, type CategoryId } from "@/data/tools";

type Item = {
  title: string;
  description: string;
  href?: string;
  icon: any;
  category?: CategoryId;
};

// Live tools link to their pages; planned tools are shown without a link so visitors never hit a 404
const items: Item[] = [
  ...TOOLS.map((t) => ({ title: t.name, description: t.intro, href: toolPath(t.slug), icon: t.icon, category: t.category })),
  ...COMING_SOON.map((name) => ({ title: name, description: "Coming soon", icon: Clock })),
];

function Card({ tool }: { tool: Item }) {
  const Icon = tool.icon;
  const card = (
    <div className="h-full border border-slate-200 rounded-2xl p-6 bg-white hover:border-[#0066cc]/30 hover:shadow-xl hover:shadow-[#0066cc]/10 transition-all duration-300 group">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#0066cc]/10 text-[#0066cc] mb-5 group-hover:bg-[#0066cc] group-hover:text-white transition-colors duration-300">
        <Icon size={24} aria-hidden="true" />
      </div>
      <p className="font-semibold text-slate-900 mb-2 group-hover:text-[#0066cc] transition-colors flex items-center gap-2">
        {tool.title}
        {!tool.href && (
          <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
            Soon
          </span>
        )}
      </p>
      <p className="text-sm text-slate-600 leading-relaxed">{tool.description}</p>
    </div>
  );
  return (
    <div className="animate-fade-up">
      {tool.href ? (
        <Link href={tool.href} className="block h-full">
          {card}
        </Link>
      ) : (
        <div className="block h-full opacity-60 cursor-default" aria-disabled="true">
          {card}
        </div>
      )}
    </div>
  );
}

const PopularTools = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.trim().toLowerCase();

  // While searching, show one flat list of matches; otherwise show the tools grouped by what they do
  const filtered = useMemo(
    () => items.filter((tool) => tool.title.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query)),
    [query]
  );

  return (
    <section id="tools" className="w-full py-14 bg-slate-50 scroll-mt-16" aria-labelledby="tools-heading">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading & Search Bar */}
        <div className="text-center mb-12 max-w-3xl mx-auto ">
          <h2 id="tools-heading" className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Free PDF Tools
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Pick what you want to do. Every tool runs in your browser, so your files stay on your device.
          </p>

          <div className="relative max-w-3xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500 group-focus-within:text-[#0066cc] transition-colors" aria-hidden="true" />
            </div>
            <input
              type="search"
              aria-label="Search the tools"
              className="block w-full min-h-[48px] pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-full text-black placeholder-slate-500 transition-all shadow-sm hover:shadow-md"
              placeholder="Search for tools (for example: merge, JPG to PDF)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {query ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" aria-live="polite">
            {filtered.length > 0 ? (
              filtered.map((tool) => <Card key={tool.title} tool={tool} />)
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center animate-fade-up">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-400" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-2">No tools found</h3>
                <p className="text-slate-500">
                  We couldn&apos;t find anything matching &quot;{searchQuery}&quot;. Try a different word.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <h3 className="text-2xl font-bold text-slate-900">{cat.name}</h3>
                <p className="mt-1 mb-6 text-slate-600">{cat.description}</p>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {items.filter((i) => i.category === cat.id).map((tool) => (
                    <Card key={tool.title} tool={tool} />
                  ))}
                </div>
              </div>
            ))}
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Coming soon</h3>
              <p className="mt-1 mb-6 text-slate-600">On the list, not built yet.</p>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.filter((i) => !i.category).map((tool) => (
                  <Card key={tool.title} tool={tool} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularTools;
