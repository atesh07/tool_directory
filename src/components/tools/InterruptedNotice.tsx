"use client";

import { useEffect, useState } from "react";
import ErrorNotice from "./ErrorNotice";
import { wasInterrupted } from "@/lib/crashGuard";

/** Shown after the browser killed the page while a file was being processed (almost always: not enough memory) */
export default function InterruptedNotice() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (wasInterrupted()) setShow(true);
  }, []);
  return (
    <ErrorNotice
      message={
        show
          ? "The page closed while it was working on a file. This usually means the file was too big for your device's memory. Try a smaller file, split the PDF first, close other tabs, or use a computer."
          : null
      }
      onDismiss={() => setShow(false)}
    />
  );
}
