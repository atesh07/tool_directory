"use client";

import { useRef, useState } from "react";
import { Lock, RefreshCcw, UploadCloud } from "lucide-react";

type Props = {
  /** Same ref the tool uses to open the picker from elsewhere (for example a "Choose another file" button) */
  inputRef?: React.RefObject<HTMLInputElement>;
  accept: string;
  multiple?: boolean;
  /** Called with the chosen or dropped files */
  onFiles: (files: File[]) => void;
  /** Big button text, e.g. "Select PDF" */
  buttonLabel: string;
  /** What can be uploaded and the limits, shown before the visitor picks anything */
  hint: string;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  /** Short word for the file type, used in the drop text and accessible name, e.g. "PDF" */
  noun?: string;
  /** Smaller version used once files are already added, so the list stays near the top on phones */
  compact?: boolean;
  /** Called when the visitor points at, touches or focuses the area, a good moment to start loading what the tool needs */
  onIntent?: () => void;
};

/**
 * One upload area for every tool: a real button (keyboard and screen-reader friendly), drag and drop,
 * and the limits stated up front. Works the same on phone, tablet and desktop.
 */
export default function UploadZone({
  inputRef,
  accept,
  multiple,
  onFiles,
  buttonLabel,
  hint,
  loading,
  loadingText = "Working...",
  disabled,
  noun = "file",
  compact,
  onIntent,
}: Props) {
  const ownRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? ownRef;
  const [dragging, setDragging] = useState(false);
  const blocked = !!loading || !!disabled;

  const open = () => {
    if (!blocked) ref.current?.click();
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!blocked) setDragging(true);
      }}
      onPointerEnter={onIntent}
      onTouchStart={onIntent}
      onFocusCapture={onIntent}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (blocked) return;
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
      onClick={(e) => {
        // A click anywhere in the area opens the picker, except on the real button which does it itself
        if ((e.target as HTMLElement).closest("button")) return;
        open();
      }}
      className={`rounded-2xl border-2 border-dashed px-4 text-center transition-colors ${compact ? "py-5" : "py-10 sm:px-8 sm:py-14"} ${
        dragging ? "border-[#0062cc] bg-blue-50" : "border-slate-300 bg-white hover:border-[#0062cc]/60"
      } ${blocked ? "cursor-wait" : "cursor-pointer"}`}
    >
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          // Reset so picking the same file again still counts as a new choice
          e.target.value = "";
          if (files.length) onFiles(files);
        }}
      />

      <div className="flex flex-col items-center gap-4">
        {loading ? (
          <div role="status" className="flex flex-col items-center gap-3">
            <RefreshCcw className="w-10 h-10 animate-spin text-[#0062cc]" aria-hidden="true" />
            <p className="text-lg font-medium text-slate-800">{loadingText}</p>
          </div>
        ) : (
          <>
            {!compact && (
              <>
                <UploadCloud className="w-12 h-12 text-[#0062cc]/70" aria-hidden="true" />
                <p className="text-slate-600 font-medium">
                  <span className="hidden sm:inline">Drag and drop your {noun} here, or</span>
                  <span className="sm:hidden">{multiple ? `Choose ${noun} from your device` : `Choose a ${noun} from your device`}</span>
                </p>
              </>
            )}
            <button
              type="button"
              onClick={open}
              disabled={blocked}
              aria-describedby="upload-hint"
              className="min-h-[52px] w-full sm:w-auto rounded-xl bg-[#0062cc] px-10 text-lg font-bold text-white shadow-sm transition-colors hover:bg-[#0052ad] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {buttonLabel}
            </button>
            <p id="upload-hint" className="text-sm text-slate-500 max-w-md">
              {hint}
            </p>
            {!compact && (
              <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" /> Your file stays on your device
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
