"use client";

import dynamic from "next/dynamic";
import type { ExamRules } from "@/data/exam-specs";

/** Same height as the tool before a photo is chosen, so nothing below it jumps when it appears */
function Skeleton() {
  return (
    <div className="min-h-[460px] animate-pulse space-y-5" aria-busy="true" aria-label="Loading the tool">
      <div className="h-10 rounded-lg bg-slate-100" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-[68px] rounded-lg bg-slate-100" />
        <div className="h-[68px] rounded-lg bg-slate-100" />
      </div>
      <div className="h-20 rounded-xl bg-slate-100" />
      <div className="h-56 rounded-2xl border-2 border-dashed border-slate-200" />
    </div>
  );
}

// The tool only works in the browser, so it is loaded after the page text, which keeps the first paint fast
const ExamResizer = dynamic(() => import("./ExamResizer"), { ssr: false, loading: Skeleton });

export default function ExamResizerLoader(props: { exams: ExamRules[]; initialExam?: string; initialDoc?: string }) {
  return (
    <div className="min-h-[460px]">
      <ExamResizer {...props} />
    </div>
  );
}
