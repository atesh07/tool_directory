"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Download, Trash2 } from "lucide-react";
import { downloadBlob } from "@/lib/download";

type Mode = "format" | "minify";
type Indent = "2" | "4" | "tab";

const MAX_MB = 2;

/** Same data with keys in alphabetical order, at every level. */
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, sortKeys((value as Record<string, unknown>)[k])]),
    );
  }
  return value;
}

/** Works out the line and column of a parse error, whichever browser wrote the message. */
function locate(message: string, text: string): { line: number; col: number } | null {
  const lc = /line (\d+) column (\d+)/i.exec(message);
  if (lc) return { line: Number(lc[1]), col: Number(lc[2]) };
  const pos = /position (\d+)/i.exec(message);
  if (!pos) return null;
  const before = text.slice(0, Number(pos[1]));
  const lines = before.split("\n");
  return { line: lines.length, col: lines[lines.length - 1].length + 1 };
}

type Result = { out: string; error: string | null; at: { line: number; col: number; text: string } | null };

function run(text: string, mode: Mode, indent: Indent, sort: boolean): Result {
  if (!text.trim()) return { out: "", error: null, at: null };
  if (text.length > MAX_MB * 1024 * 1024) return { out: "", error: `This input is larger than ${MAX_MB} MB. Please use a smaller piece.`, at: null };
  try {
    let data: unknown = JSON.parse(text);
    if (sort) data = sortKeys(data);
    const space = mode === "minify" ? undefined : indent === "tab" ? "\t" : Number(indent);
    return { out: JSON.stringify(data, null, space), error: null, at: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const at = locate(message, text);
    return {
      out: "",
      error: message.replace(/^JSON\.parse: /, ""),
      at: at ? { ...at, text: (text.split("\n")[at.line - 1] ?? "").slice(0, 200) } : null,
    };
  }
}

const btn =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066cc]";
const plain = `${btn} border-slate-300 bg-white text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50`;

export default function ToolClient() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("format");
  const [indent, setIndent] = useState<Indent>("2");
  const [sort, setSort] = useState(false);
  const [copied, setCopied] = useState(false);

  const { out, error, at } = useMemo(() => run(input, mode, indent, sort), [input, mode, indent, sort]);
  const valid = !!input.trim() && !error;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(out);
    } catch {
      (document.getElementById("json-output") as HTMLTextAreaElement | null)?.select();
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const pill = (active: boolean) =>
    `${btn} ${active ? "border-[#0066cc] bg-[#0066cc] text-white" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Action" className="flex gap-2">
          <button type="button" aria-pressed={mode === "format"} onClick={() => setMode("format")} className={pill(mode === "format")}>
            Format
          </button>
          <button type="button" aria-pressed={mode === "minify"} onClick={() => setMode("minify")} className={pill(mode === "minify")}>
            Minify
          </button>
        </div>
        {mode === "format" && (
          <div className="flex items-center gap-2">
            <label htmlFor="json-indent" className="text-sm text-slate-800">
              Indent
            </label>
            <select
              id="json-indent"
              value={indent}
              onChange={(e) => setIndent(e.target.value as Indent)}
              className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tab</option>
            </select>
          </div>
        )}
        <label className="flex min-h-[44px] items-center gap-3 text-sm text-slate-800">
          <input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} className="h-5 w-5 accent-[#0066cc]" />
          Sort keys A to Z
        </label>
      </div>

      <div>
        <label htmlFor="json-input" className="mb-2 block text-sm font-semibold text-slate-900">
          JSON
        </label>
        <textarea
          id="json-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={10}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder='{"name":"ToolsTree","tools":[1,2,3]}'
          className="w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm text-slate-900 focus:border-[#0066cc] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/30"
        />
      </div>

      <div aria-live="polite">
        {valid && (
          <p className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900">
            <Check size={18} aria-hidden="true" /> Valid JSON
          </p>
        )}
        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <p className="font-semibold">Not valid JSON{at ? ` (line ${at.line}, column ${at.col})` : ""}</p>
            <p className="mt-1">{error}</p>
            {at && at.text && <pre className="mt-2 overflow-x-auto rounded bg-white/70 p-2 font-mono text-xs text-red-900">{at.text}</pre>}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="json-output" className="mb-2 block text-sm font-semibold text-slate-900">
          Result
        </label>
        <textarea
          id="json-output"
          readOnly
          value={out}
          rows={10}
          spellCheck={false}
          placeholder="The result appears here"
          className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-sm text-slate-900"
        />
        <p className="mt-1 text-xs text-slate-500">{out ? `${out.length} characters` : ""}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copy} disabled={!out} className={`${btn} border-[#0066cc] bg-[#0066cc] text-white hover:bg-[#005bb5] disabled:cursor-not-allowed disabled:opacity-50`}>
          {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          {copied ? "Copied" : "Copy result"}
        </button>
        <button type="button" onClick={() => downloadBlob(new Blob([out], { type: "application/json" }), "formatted.json")} disabled={!out} className={plain}>
          <Download size={18} aria-hidden="true" /> Download
        </button>
        <button type="button" onClick={() => setInput("")} disabled={!input} className={plain}>
          <Trash2 size={18} aria-hidden="true" /> Clear
        </button>
      </div>
    </div>
  );
}
