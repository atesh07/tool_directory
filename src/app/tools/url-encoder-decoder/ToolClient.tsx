"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Check, Copy, Repeat, Trash2 } from "lucide-react";

type Mode = "encode" | "decode";
type Scope = "component" | "full";

/** Converts the text and returns either the result or a plain-words problem. */
function convert(text: string, mode: Mode, scope: Scope, plus: boolean): { out: string; error: string | null } {
  if (!text) return { out: "", error: null };
  try {
    if (mode === "encode") {
      const encoded = scope === "component" ? encodeURIComponent(text) : encodeURI(text);
      return { out: plus ? encoded.replace(/%20/g, "+") : encoded, error: null };
    }
    const source = plus ? text.replace(/\+/g, " ") : text;
    return { out: scope === "component" ? decodeURIComponent(source) : decodeURI(source), error: null };
  } catch {
    return {
      out: "",
      error:
        mode === "decode"
          ? "This text is not valid. Every % must be followed by two hex digits (0 to 9, A to F), and the codes must form real text."
          : "This text cannot be encoded. It may contain a broken character (half of an emoji, for example).",
    };
  }
}

/** Reads name=value pairs from a link (the part after the ?) or from a bare query string such as a form body. */
function readParams(text: string): { name: string; value: string }[] {
  let query = text.trim();
  const q = query.indexOf("?");
  if (q >= 0) query = query.slice(q + 1);
  else if (/^[a-z][a-z0-9+.-]*:\/\//i.test(query)) return [];
  const hash = query.indexOf("#");
  if (hash >= 0) query = query.slice(0, hash);
  if (!query.includes("=") || /\s/.test(query)) return [];
  const read = (part: string) => {
    try {
      return decodeURIComponent(part.replace(/\+/g, " "));
    } catch {
      return part;
    }
  };
  return query
    .split("&")
    .filter(Boolean)
    .slice(0, 200)
    .map((pair) => {
      const eq = pair.indexOf("=");
      return eq < 0 ? { name: read(pair), value: "" } : { name: read(pair.slice(0, eq)), value: read(pair.slice(eq + 1)) };
    });
}

const btn =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066cc]";

export default function ToolClient() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [scope, setScope] = useState<Scope>("component");
  const [plus, setPlus] = useState(false);
  const [copied, setCopied] = useState(false);

  const { out, error } = useMemo(() => convert(input, mode, scope, plus), [input, mode, scope, plus]);
  // Only when decoding, and only for text that looks like a link with parameters or a form body
  const params = useMemo(() => (mode === "decode" && input.length < 20000 ? readParams(input) : []), [mode, input]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(out);
    } catch {
      // Older browsers: select the text so the visitor can copy it by hand
      const box = document.getElementById("url-output") as HTMLTextAreaElement | null;
      box?.select();
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    if (!out) return;
    setInput(out);
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const pill = (active: boolean) =>
    `${btn} ${active ? "border-[#0066cc] bg-[#0066cc] text-white" : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <div role="group" aria-label="Direction" className="flex gap-2">
          <button type="button" aria-pressed={mode === "encode"} onClick={() => setMode("encode")} className={pill(mode === "encode")}>
            Encode
          </button>
          <button type="button" aria-pressed={mode === "decode"} onClick={() => setMode("decode")} className={pill(mode === "decode")}>
            Decode
          </button>
        </div>
        <div role="group" aria-label="What you are converting" className="flex gap-2">
          <button type="button" aria-pressed={scope === "component"} onClick={() => setScope("component")} className={pill(scope === "component")}>
            Component
          </button>
          <button type="button" aria-pressed={scope === "full"} onClick={() => setScope("full")} className={pill(scope === "full")}>
            Full URL
          </button>
        </div>
      </div>
      <p className="text-sm text-slate-600">
        {mode === "decode"
          ? scope === "component"
            ? "Component decodes every code, including %2F, %3A, %3F and %26. Use it to read a value or the address inside a link."
            : "Full URL leaves the codes for : / ? & = and # as they are, so the link keeps its structure. Use Component to read everything."
          : scope === "component"
            ? "Component converts everything unsafe, including : / ? & = and #. Use it for one value, such as a search word."
            : "Full URL keeps : / ? & = and # as they are. Use it for a whole address."}
      </p>

      <label className="flex min-h-[44px] w-fit items-center gap-3 text-sm text-slate-800">
        <input type="checkbox" checked={plus} onChange={(e) => setPlus(e.target.checked)} className="h-5 w-5 accent-[#0066cc]" />
        Use + for spaces (form data)
      </label>

      <div>
        <label htmlFor="url-input" className="mb-2 block text-sm font-semibold text-slate-900">
          {mode === "encode" ? "Text or link to encode" : "Encoded text or link to decode"}
        </label>
        <textarea
          id="url-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder={mode === "encode" ? "hello world & namaste नमस्ते" : "hello%20world%20%26%20namaste"}
          className="w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm text-slate-900 focus:border-[#0066cc] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/30"
        />
        <p className="mt-1 text-xs text-slate-500">{input.length} characters</p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="url-output" className="mb-2 block text-sm font-semibold text-slate-900">
          Result
        </label>
        <textarea
          id="url-output"
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

      {params.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">Parameters ({params.length})</h3>
          <div tabIndex={0} role="region" aria-label="Decoded parameters" className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full min-w-[300px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th scope="col" className="px-3 py-2 font-semibold">Name</th>
                  <th scope="col" className="px-3 py-2 font-semibold">Decoded value</th>
                </tr>
              </thead>
              <tbody>
                {params.map((p, i) => (
                  <tr key={i} className="border-t border-slate-200 align-top">
                    <th scope="row" className="px-3 py-2 font-mono text-[13px] font-semibold text-slate-900">{p.name}</th>
                    <td className="break-all px-3 py-2 font-mono text-[13px] text-slate-800">{p.value || <span className="text-slate-500">(empty)</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copy} disabled={!out} className={`${btn} border-[#0066cc] bg-[#0066cc] text-white hover:bg-[#005bb5] disabled:cursor-not-allowed disabled:opacity-50`}>
          {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          {copied ? "Copied" : "Copy result"}
        </button>
        {mode === "decode" && (
          <button type="button" onClick={() => out && setInput(out)} disabled={!out || out === input} className={`${btn} border-slate-300 bg-white text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50`}>
            <Repeat size={18} aria-hidden="true" /> Decode again
          </button>
        )}
        <button type="button" onClick={swap} disabled={!out} className={`${btn} border-slate-300 bg-white text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50`}>
          <ArrowDownUp size={18} aria-hidden="true" /> Swap
        </button>
        <button type="button" onClick={() => setInput("")} disabled={!input} className={`${btn} border-slate-300 bg-white text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50`}>
          <Trash2 size={18} aria-hidden="true" /> Clear
        </button>
      </div>
    </div>
  );
}
