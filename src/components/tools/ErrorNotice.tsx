"use client";

import { AlertTriangle, CheckCircle2, Info, RotateCcw, X } from "lucide-react";

/** Inline message shown above a tool when something goes wrong, with a way to retry. */
export default function ErrorNotice({
  message,
  onRetry,
  retryLabel = "Try another file",
  onDismiss,
  tone = "error",
}: {
  message: string | null;
  onRetry?: () => void;
  retryLabel?: string;
  onDismiss?: () => void;
  /** "info" is a calm blue note for things that worked but need explaining */
  tone?: "error" | "info" | "success";
}) {
  if (!message) return null;
  const palette =
    tone === "success"
      ? "border-green-200 bg-green-50 text-green-900"
      : tone === "info"
        ? "border-blue-200 bg-blue-50 text-blue-900"
        : "border-red-200 bg-red-50 text-red-800";
  const Icon = tone === "success" ? CheckCircle2 : tone === "info" ? Info : AlertTriangle;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex items-start gap-3 rounded-xl border p-4 ${palette}`}>
      <Icon className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
      <div className="flex-1 text-sm leading-relaxed">
        <p className="font-medium">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" /> {retryLabel}
          </button>
        )}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Dismiss message" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg opacity-70 hover:opacity-100">
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
