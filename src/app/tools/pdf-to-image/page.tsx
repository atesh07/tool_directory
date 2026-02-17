import { Metadata } from "next";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "Free PDF to Image Converter | Instant & Private",
  description: "Convert PDF pages into high-quality JPG images instantly in your browser. No files are uploaded to any server.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="text-center pt-6 pb-6 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
          PDF to <span className="text-indigo-600">Image</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Transform your PDF documents into high-resolution JPGs safely. 
          No uploads, no servers, just instant conversion right in your browser.
        </p>
      </section>

      {/* Main Tool Area */}
      <section className="max-w-4xl mx-auto px-4 relative z-10 pb-12">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20 ring-1 ring-slate-900/5">
          <ToolClient />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <FeatureCard 
            icon="⚡" 
            title="Lightning Fast" 
            desc="Conversion happens in milliseconds using your computer's power. No server queues." 
          />
          <FeatureCard 
            icon="🔒" 
            title="Maximum Privacy" 
            desc="Your files never leave your device. We don't see or store your sensitive data." 
          />
          <FeatureCard 
            icon="📱" 
            title="No Install" 
            desc="Works directly in your browser. No bloated software or plugins required." 
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4 bg-indigo-50 w-16 h-16 flex items-center justify-center rounded-2xl mx-auto">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}