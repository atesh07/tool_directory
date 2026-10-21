"use client";

import { AlertTriangle, Info, RotateCcw, X } from "lucide-react";

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
  tone?: "error" | "info";
}) {
  if (!message) return null;
  const info = tone === "info";
  return (
    <div
      role={info ? "status" : "alert"}
      className={`flex items-start gap-3 rounded-xl border p-4 ${info ? "border-blue-200 bg-blue-50 text-blue-900" : "border-red-200 bg-red-50 text-red-800"}`}
    >
      {info ? <Info className="w-5 h-5 mt-0.5 shrink-0" /> : <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />}
      <div className="flex-1 text-sm leading-relaxed">
        <p className="font-medium">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {retryLabel}
          </button>
        )}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Dismiss message" className="opacity-60 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
