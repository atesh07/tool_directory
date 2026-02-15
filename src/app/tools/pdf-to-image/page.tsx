import { Metadata } from "next";
import ToolClient from "./ToolClient";
import { ShieldCheck, Zap, Lock, Smartphone, Download, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Free PDF to Image Converter | Instant & Private",
  description: "Convert PDF pages into high-quality JPG images instantly in your browser. No files are uploaded to any server.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto px-4 py-5">
        {/* Header Section */}
        <div className="text-center mb-5">
         
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            PDF to <span className="text-blue-600">Image</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Transform your PDF documents into high-resolution JPGs safely. 
            No uploads, no servers, just instant conversion.
          </p>
        </div>

        {/* Main Tool Component */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden mb-20">
          <ToolClient />
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-slate-600 leading-relaxed">
              Conversion happens in milliseconds because it uses your own computer's power. No waiting for server queues.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Maximum Privacy</h3>
            <p className="text-slate-600 leading-relaxed">
              Your files never leave your device. We don't see your data, and we don't store your PDFs on any server.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Install Required</h3>
            <p className="text-slate-600 leading-relaxed">
              Works directly in your Chrome, Safari, or Firefox browser. No bloated software or plugins needed.
            </p>
          </div>
        </div>

        {/* How it Works / FAQ Section */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">How it works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-bold text-lg">Select your PDF</h4>
                  <p className="text-slate-400">Click the upload box to choose a file from your computer or phone.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-bold text-lg">Instant Rendering</h4>
                  <p className="text-slate-400">Our tool reads the PDF pages and renders them as high-quality images immediately.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-bold text-lg">Download individual pages</h4>
                  <p className="text-slate-400">Pick the specific pages you need and save them as JPG files to your gallery.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative background element */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-slate-400 text-sm border-t border-slate-200 pt-8">
          <p>© {new Date().getFullYear()} PDF2IMG Tool • Built with Next.js • Privacy Guaranteed</p>
        </footer>
      </div>
    </div>
  );
}