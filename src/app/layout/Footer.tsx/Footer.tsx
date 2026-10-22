import Link from "next/link";
import { Mail, ShieldCheck, Zap, BadgeCheck } from "lucide-react";
import { SITE, TOOLS, toolPath, type CategoryId } from "@/data/tools";

// Footer columns: which tool categories go together under one heading
const COLUMNS: { title: string; categories: CategoryId[] }[] = [
  { title: "Edit PDF", categories: ["organize"] },
  { title: "Convert", categories: ["to-pdf", "from-pdf"] },
  { title: "Image & Web", categories: ["images", "web"] },
];

const COMPANY = [
  { name: "Guides", href: "/guides" },
  { name: "हिंदी", href: "/hi" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const TRUST = [
  { icon: ShieldCheck, text: "Files stay on your device" },
  { icon: Zap, text: "No sign-up, no limits" },
  { icon: BadgeCheck, text: "Free, no watermark" },
];

const linkClass =
  "flex min-h-[44px] w-fit items-center text-slate-600 transition-colors duration-200 hover:text-[#0066cc]";
const headingClass = "mb-3 text-sm font-bold uppercase tracking-wider text-slate-900";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        {/* Trust strip */}
        <ul className="flex flex-col gap-2 border-b border-slate-200 py-6 sm:flex-row sm:justify-between">
          {TRUST.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Icon size={18} className="shrink-0 text-[#0066cc]" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] lg:gap-x-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 lg:pr-6">
            <Link href="/" className="flex min-h-[44px] w-fit items-center gap-2 text-2xl font-black tracking-tight text-[#0066cc]">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0066cc] text-lg text-white">T</span>
              ToolsTree
            </Link>
            <p className="mt-3 max-w-sm leading-relaxed text-slate-600">
              Free online tools to convert, edit and manage PDFs and images, all in one secure place.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 break-all font-medium text-[#0066cc] hover:text-[#005bb5]"
            >
              <Mail size={18} className="shrink-0" aria-hidden="true" />
              {SITE.email}
            </a>
          </div>

          {/* Tool columns, built from the tool list so new tools show up on their own */}
          {COLUMNS.map((col) => {
            const tools = TOOLS.filter((t) => col.categories.includes(t.category));
            return (
              <nav key={col.title} aria-label={col.title}>
                <h3 className={headingClass}>{col.title}</h3>
                <ul>
                  {tools.map((t) => (
                    <li key={t.slug}>
                      <Link href={toolPath(t.slug)} className={linkClass}>
                        {t.name}
                      </Link>
                    </li>
                  ))}
                  {col.title === "Image & Web" && (
                    <li>
                      <Link href="/tools" className={`${linkClass} font-semibold text-[#0066cc]`}>
                        All tools →
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            );
          })}

          {/* Company */}
          <nav aria-label="Company">
            <h3 className={headingClass}>Company</h3>
            <ul>
              {COMPANY.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 py-4 text-sm text-slate-600 md:flex-row">
          <p>© {new Date().getFullYear()} ToolsTree. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6">
            <Link href="/privacy" className="flex min-h-[44px] items-center hover:text-[#0066cc]">Privacy Policy</Link>
            <Link href="/terms" className="flex min-h-[44px] items-center hover:text-[#0066cc]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
