"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, // Added Search icon
  FileText,
  Image,
  Combine,
  Scissors,
  Minimize2,
  FileSignature,
  FileUp,
  FileDown,
  Lock,
  Unlock,
  RotateCw,
  Type,
  FileImage,
  FilePlus,
  Trash2,
  Layers,
  Stamp,
  Pencil,
  ScanLine,
  FileCheck,
  Files,
  FileSearch,
} from "lucide-react";

type Tool = {
  title: string;
  description: string;
  href: string;
  icon: any;
};

const tools: Tool[] = [
  { title: "PDF to Word", description: "Convert PDF into editable Word file", href: "/tools/pdf-to-word", icon: FileText },
  { title: "Word to PDF", description: "Convert Word documents to PDF", href: "/tools/word-to-pdf", icon: Files },
  { title: "Merge PDF", description: "Combine multiple PDFs into one", href: "/tools/merge-pdf", icon: Combine },
  { title: "Split PDF", description: "Split PDF into separate pages", href: "/tools/split-pdf", icon: Scissors },
  { title: "Compress PDF", description: "Reduce PDF file size easily", href: "/tools/compress-pdf", icon: Minimize2 },
  { title: "Sign PDF", description: "Add digital signature to PDF", href: "/tools/sign-pdf", icon: FileSignature },
  { title: "Image to PDF", description: "Convert images into PDF", href: "/tools/image-to-pdf", icon: Image },
  { title: "PDF to Image", description: "Export PDF pages as images", href: "/tools/pdf-to-image", icon: FileImage },
  { title: "Rotate PDF", description: "Rotate PDF pages quickly", href: "/tools/rotate-pdf", icon: RotateCw },
  { title: "Protect PDF", description: "Add password protection", href: "/tools/protect-pdf", icon: Lock },
  { title: "Unlock PDF", description: "Remove PDF password", href: "/tools/unlock-pdf", icon: Unlock },
  { title: "Add Page Numbers", description: "Insert page numbers in PDF", href: "/tools/page-numbers", icon: Type },
  { title: "Watermark PDF", description: "Add watermark to PDF", href: "/tools/watermark", icon: Stamp },
  { title: "Edit PDF", description: "Edit text and images in PDF", href: "/tools/edit-pdf", icon: Pencil },
  { title: "Organize PDF", description: "Reorder PDF pages easily", href: "/tools/organize-pdf", icon: Layers },
  { title: "Scan to PDF", description: "Create PDF from scan", href: "/tools/scan-to-pdf", icon: ScanLine },
  { title: "Remove Pages", description: "Remove pages from PDF", href: "/tools/remove-pages", icon: Trash2 },
  { title: "Extract Pages", description: "Extract selected pages", href: "/tools/extract-pages", icon: FilePlus },
  { title: "OCR PDF", description: "Make scanned PDF searchable", href: "/tools/ocr-pdf", icon: FileSearch },
  { title: "Validate PDF", description: "Check PDF file integrity", href: "/tools/validate-pdf", icon: FileCheck },
  { title: "Upload PDF", description: "Upload and manage PDF files", href: "/tools/upload-pdf", icon: FileUp },
  { title: "Download PDF", description: "Export processed PDF", href: "/tools/download-pdf", icon: FileDown },
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
    <section className="w-full py-14 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Heading & Search Bar */}
        <div className="text-center mb-16 max-w-3xl mx-auto ">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Most Popular Tools
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Fast, simple, and powerful tools to manage, edit, and convert your PDFs in seconds.
          </p>

          {/* Search Input */}
          <div className="relative max-w-3xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-black group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-full text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
              placeholder="Search for tools (e.g. Image to PDF)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tools Grid */}
        <motion.div layout className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => {
                const Icon = tool.icon;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    key={tool.title} // Used title as key for stable animations
                  >
                    <Link href={tool.href} className="block h-full">
                      <div className="h-full border border-slate-200 rounded-2xl p-6 bg-white hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group">
                        
                        {/* Icon Container with Group Hover */}
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                          <Icon size={24} />
                        </div>

                        {/* Text Content */}
                        <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              // Empty State
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-2">No tools found</h3>
                <p className="text-slate-500">
                  We couldn't find anything matching "{searchQuery}". Try a different keyword.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularTools;


