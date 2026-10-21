import Link from "next/link";
import { TOOLS, toolPath } from "@/data/tools";

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-24">
      <p className="text-sm font-semibold text-[#0066cc]">404</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-3 text-slate-500 max-w-md">The page you are looking for does not exist. Try one of our free PDF tools instead.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {TOOLS.map((tool) => (
          <Link key={tool.slug} href={toolPath(tool.slug)} className="px-4 py-2 rounded-full border border-slate-200 bg-white text-sm text-slate-700 hover:border-[#0066cc] hover:text-[#0066cc]">
            {tool.name}
          </Link>
        ))}
      </div>
      <Link href="/" className="mt-8 text-[#0066cc] font-medium hover:underline">Back to home</Link>
    </main>
  );
}
