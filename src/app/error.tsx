"use client";

import Link from "next/link";
import { useEffect } from "react";

// Shown if something breaks while a page is running. It never shows a blank screen or a technical message.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-24">
      <h1 className="text-3xl font-bold text-slate-900">Something went wrong</h1>
      <p className="mt-3 text-slate-600 max-w-md">
        The page hit a problem. Your files were not uploaded anywhere. Try again. If it keeps happening with a big file, use a smaller one or
        split the PDF first.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="min-h-[48px] rounded-xl bg-[#0062cc] px-6 font-bold text-white hover:bg-[#0052ad]">
          Try again
        </button>
        <Link href="/" className="inline-flex min-h-[48px] items-center rounded-xl border border-slate-300 bg-white px-6 font-semibold text-slate-700 hover:bg-slate-50">
          Back to home
        </Link>
      </div>
    </main>
  );
}
