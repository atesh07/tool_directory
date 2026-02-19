import ToolClient from "./ToolClient";

export const metadata = {
  title: "Compress PDF - Reduce PDF File Size",
  description: "Easily compress your PDF files without losing quality.",
};

export default function CompressPDFPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Compress PDF</h1>
          <p className="text-gray-600">Reduce file size while optimizing for maximal PDF quality.</p>
        </div>
        
        <ToolClient />
      </div>
    </div>
  );
}