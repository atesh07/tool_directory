import { Metadata } from 'next';
import ToolClient from "./ToolClint";

// --- SEO METADATA ---
export const metadata: Metadata = {
  title: "Free Word to PDF Converter | Fast & Secure DOCX to PDF",
  description: "Convert your Word (.docx) files to PDF instantly in your browser. No file uploads to servers, 100% private and secure file conversion.",
  keywords: ["Word to PDF", "DOCX to PDF converter", "Next.js file tool", "browser-based converter", "convert docx to pdf free"],
  openGraph: {
    title: "Secure Word to PDF Converter",
    description: "Convert DOCX to PDF without uploading files to a server.",
    type: "website",
    url: "https://yourdomain.com/tools/word-to-pdf", // Replace with your actual URL
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function WordToPdfPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Semantic Header for SEO */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Online Word to PDF Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The safest way to convert <strong>.docx files</strong> to PDF. 
            Processing happens locally in your browser—your data never touches our servers.
          </p>
        </header>

        <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <ToolClient />
        </section>

        {/* SEO Content Section - Helps Google understand the tool */}
        <article className="mt-16 prose prose-slate max-w-none border-t pt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How to convert Word to PDF?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800">1. Upload</h3>
              <p>Select your .docx file from your computer or mobile device.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">2. Convert</h3>
              <p>Our tool parses the Word structure and prepares a high-quality PDF layout.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">3. Download</h3>
              <p>Your PDF is generated instantly for download. No waiting in queues!</p>
            </div>
          </div>
        </article>

        <footer className="mt-12 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} YourToolBrand. Supports all modern .docx formats.</p>
        </footer>
      </div>
    </main>
  );
}