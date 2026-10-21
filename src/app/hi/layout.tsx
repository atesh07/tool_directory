import { Noto_Sans_Devanagari } from "next/font/google";

// Hindi pages only: the main font has no Devanagari letters
const hindi = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["400", "600", "700"], display: "swap" });

export default function HindiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="hi" className={hindi.className}>
      {children}
    </div>
  );
}
