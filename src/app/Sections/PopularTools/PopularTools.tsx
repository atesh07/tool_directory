"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock } from "lucide-react";
import { COMING_SOON, TOOLS, toolPath } from "@/data/tools";

type Tool = {
  title: string;
  description: string;
  href?: string;
  icon: any;
};

// Live tools link to their pages; planned tools are shown without a link so visitors never hit a 404
const tools: Tool[] = [
  ...TOOLS.map((t) => ({ title: t.name, description: t.intro, href: toolPath(t.slug), icon: t.icon })),
  ...COMING_SOON.map((name) => ({ title: name, description: "Coming soon", icon: Clock })),
];

const PopularTools = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    return tools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <section id="tools" className="w-full py-14 bg-slate-50 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Heading & Search Bar */}
        <div className="text-center mb-16 max-w-3xl mx-auto ">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Free PDF Tools
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Fast, simple, and powerful tools to manage, edit, and convert your PDFs in seconds.
          </p>

          {/* Search Input */}
          <div className="relative max-w-3xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-black group-focus-within:text-[#0066cc] transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-full text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all shadow-sm hover:shadow-md"
              placeholder="Search for tools (e.g. Image to PDF)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => {
              const Icon = tool.icon;
              const card = (
                <div className="h-full border border-slate-200 rounded-2xl p-6 bg-white hover:border-[#0066cc]/30 hover:shadow-xl hover:shadow-[#0066cc]/10 transition-all duration-300 group">
                          
                          {/* Icon Container with Group Hover */}
                          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#0066cc]/10 text-[#0066cc] mb-5 group-hover:bg-[#0066cc] group-hover:text-white transition-colors duration-300">
                            <Icon size={24} />
                          </div>
  
                          {/* Text Content */}
                          <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-[#0066cc] transition-colors flex items-center gap-2">
                            {tool.title}
                  {!tool.href && <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">Soon</span>}
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
              );

              return (
                <div key={tool.title} className="animate-fade-up">
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
            })
          ) : (
            // Empty State
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center animate-fade-up">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-2">No tools found</h3>
              <p className="text-slate-500">
                We couldn&apos;t find anything matching &quot;{searchQuery}&quot;. Try a different keyword.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularTools;


