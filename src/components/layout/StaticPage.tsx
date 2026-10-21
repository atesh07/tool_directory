import Link from "next/link";

// Simple readable layout for About / Contact / Privacy / Terms
export default function StaticPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50 pt-12 pb-20 px-4">
      <article className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl p-6 md:p-10">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:text-[#0066cc]">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{title}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{title}</h1>
        {updated && <p className="text-sm text-slate-400 mb-8">Last updated: {updated}</p>}
        <div className="space-y-4 text-slate-600 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-[#0066cc] [&_a]:underline">
          {children}
        </div>
      </article>
    </main>
  );
}
