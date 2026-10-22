"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowDownUp, Check, Copy, FileUp, Trash2 } from "lucide-react";

type Mode = "encode" | "decode";

const MAX_FILE_MB = 1;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  // Built in pieces so a large input does not overflow the call stack
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

const toUrlSafe = (b64: string) => b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function convert(text: string, mode: Mode, urlSafe: boolean): { out: string; error: string | null } {
  if (!text) return { out: "", error: null };
  if (mode === "encode") {
    try {
      const b64 = bytesToBase64(new TextEncoder().encode(text));
      return { out: urlSafe ? toUrlSafe(b64) : b64, error: null };
    } catch {
      return { out: "", error: "This text cannot be encoded. It may contain a broken character." };
    }
  }
  // Spaces and line breaks are ignored; the URL-safe form is turned back into the standard one
  let clean = text.replace(/\s+/g, "");
  if (urlSafe) clean = clean.replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean) || clean.replace(/=+$/, "").length % 4 === 1) {
    return {
      out: "",
      error: urlSafe
        ? "This is not valid URL-safe Base64. Use only letters, numbers, - and _."
        : "This is not valid Base64. Use only letters, numbers, + and / (and = at the end). If it contains - and _, turn on URL-safe.",
    };
  }
  clean = clean.replace(/=+$/, "");
  clean += "=".repeat((4 - (clean.length % 4)) % 4);
  try {
    const binary = atob(clean);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return { out: new TextDecoder("utf-8", { fatal: true }).decode(bytes), error: null };
  } catch {
    return { out: "", error: "This Base64 is valid, but it does not hold text. It is probably a picture or another file, which cannot be shown here." };
  }
}

const btn =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066cc]";
const plain = `${btn} border-slate-300 bg-white text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50`;

export default function ToolClient() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileB64, setFileB64] = useState<{ name: string; value: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const text = useMemo(() => convert(input, mode, urlSafe), [input, mode, urlSafe]);
  // A chosen file replaces the text result until the visitor types again or clears
  const out = fileB64 ? (urlSafe ? toUrlSafe(fileB64.value) : fileB64.value) : text.out;
  const error = fileB64 ? null : text.error;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(out);
    } catch {
      (document.getElementById("b64-output") as HTMLTextAreaElement | null)?.select();
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    if (!out) return;
    setFileB64(null);
    setInput(out);
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const pickFile = (file: File | undefined) => {
    if (!file) return;
    setFileError(null);
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`This file is larger than ${MAX_FILE_MB} MB. Please choose a smaller file.`);
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setFileError("The file could not be read. Please try again.");
    reader.onload = () => {
      const result = String(reader.result);
      setFileB64({ name: file.name, value: result.slice(result.indexOf(",") + 1) });
      setMode("encode");
    };
    reader.readAsDataURL(file);
  };

  const clear = () => {
    setInput("");
    setFileB64(null);
    setFileError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const pill = (active: boolean) =>
    `${btn} ${active ? "border-[#0066cc] bg-[#0066cc] text-white" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"}`;

  return (
    <div className="space-y-5">
      <div role="group" aria-label="Direction" className="flex gap-2">
        <button type="button" aria-pressed={mode === "encode"} onClick={() => setMode("encode")} className={pill(mode === "encode")}>
          Encode
        </button>
        <button
          type="button"
          aria-pressed={mode === "decode"}
          onClick={() => {
            setFileB64(null);
            setMode("decode");
          }}
          className={pill(mode === "decode")}
        >
          Decode
        </button>
      </div>

      <label className="flex min-h-[44px] w-fit items-center gap-3 text-sm text-slate-800">
        <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} className="h-5 w-5 accent-[#0066cc]" />
        URL-safe Base64 (- and _ instead of + and /)
      </label>

      <div>
        <label htmlFor="b64-input" className="mb-2 block text-sm font-semibold text-slate-900">
          {mode === "encode" ? "Text to encode" : "Base64 to decode"}
        </label>
        <textarea
          id="b64-input"
          value={input}
          onChange={(e) => {
            setFileB64(null);
            setInput(e.target.value);
          }}
          rows={5}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder={mode === "encode" ? "Hello नमस्ते 😀" : "SGVsbG8gd29ybGQ="}
          className="w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm text-slate-900 focus:border-[#0066cc] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/30"
        />
        <p className="mt-1 text-xs text-slate-500">{input.length} characters</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input ref={fileRef} type="file" className="sr-only" tabIndex={-1} aria-label="Choose a file to encode" onChange={(e) => pickFile(e.target.files?.[0])} />
        <button type="button" onClick={() => fileRef.current?.click()} className={plain}>
          <FileUp size={18} aria-hidden="true" /> Choose file to encode
        </button>
        <span className="text-xs text-slate-500">Up to {MAX_FILE_MB} MB. Stays on your device.</span>
      </div>
      {fileB64 && <p className="text-sm text-slate-700">Encoded file: <strong>{fileB64.name}</strong></p>}
      {(error || fileError) && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error || fileError}
        </p>
      )}

      <div>
        <label htmlFor="b64-output" className="mb-2 block text-sm font-semibold text-slate-900">
          Result
        </label>
        <textarea
          id="b64-output"
          readOnly
          value={out}
          rows={5}
          spellCheck={false}
          placeholder="The result appears here"
          className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-sm text-slate-900"
        />
        <p className="mt-1 text-xs text-slate-500" aria-live="polite">
          {out ? `${out.length} characters` : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copy} disabled={!out} className={`${btn} border-[#0066cc] bg-[#0066cc] text-white hover:bg-[#005bb5] disabled:cursor-not-allowed disabled:opacity-50`}>
          {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          {copied ? "Copied" : "Copy result"}
        </button>
        <button type="button" onClick={swap} disabled={!out} className={plain}>
          <ArrowDownUp size={18} aria-hidden="true" /> Swap
        </button>
        <button type="button" onClick={clear} disabled={!input && !fileB64} className={plain}>
          <Trash2 size={18} aria-hidden="true" /> Clear
        </button>
      </div>
    </div>
  );
}
