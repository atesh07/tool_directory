import { Metadata } from "next";
import ToolClient from "./ToolClient";
import PopularTools from "../../Sections/PopularTools/PopularTools";

export const metadata: Metadata = {
  title: "Free PDF to Image Converter | Instant & Private",
  description: "Convert PDF pages into high-quality JPG images instantly in your browser. No files are uploaded to any server.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-12">
      
      {/* Hero Section */}
      <section className="text-center pt-8 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          PDF to <span className="text-[#0066cc]">Image</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Transform your PDF documents into high-resolution JPGs safely. 
          No uploads, no servers, just instant conversion right in your browser.
        </p>
      </section>

      {/* Main Tool Area */}
      <section className="max-w-4xl mx-auto px-4 w-full relative z-10 mb-16">
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-4 md:p-8">
          <ToolClient />
        </div>
      </section>


      {/* Popular Tools Section */}
      <PopularTools />
    </div>
  );
}