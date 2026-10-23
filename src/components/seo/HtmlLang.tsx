"use client";

import { useEffect } from "react";

// The root layout always renders <html lang="en">; this switches it while a page in another language is open
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.lang;
    html.lang = lang;
    return () => {
      html.lang = previous;
    };
  }, [lang]);
  return null;
}
