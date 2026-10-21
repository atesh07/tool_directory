import { Metadata } from "next";
import ToolClient from "./ToolClient";
import PopularTools from "../../Sections/PopularTools/PopularTools";

export const metadata: Metadata = {
  title: "Free PDF Text Editor - Edit PDF Text Online",
  description:
    "Edit text in your PDF directly in the browser. Fonts, size and colour are matched automatically. No uploads, 100% private.",
};

export default function EditPdfPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-12">

      {/* Hero Section */}
      <section className="text-center pt-8 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          Edit <span className="text-[#0066cc]">PDF</span> Text
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Click any text in your PDF and change it. The original font, size and
          colour are matched automatically. Everything happens in your browser.
        </p>
      </section>

      {/* Main Tool Area */}
      <section className="max-w-6xl mx-auto px-4 w-full relative z-10 mb-16">
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-4 md:p-8">
          <ToolClient />
        </div>
      </section>

      {/* Popular Tools Section */}
      <PopularTools />
    </div>
  );
}
