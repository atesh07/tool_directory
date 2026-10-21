"use client";

import Link from "next/link";
import { Mail, Heart, ArrowRight } from "lucide-react";
import { SITE, TOOLS, toolPath } from "@/data/tools";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand & Mission */}
          <div className="lg:pr-6">
            <Link href="/" className="text-2xl font-black tracking-tight text-[#0066cc] flex min-h-[44px] items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0066cc] flex items-center justify-center text-white text-lg">
                T
              </div>
              ToolsTree
            </Link>
            <p className="text-slate-500 mt-4 leading-relaxed">
              Free online tools to convert, edit, and manage PDFs and images easily — all in one secure place.
            </p>

            {/* Only real contact link; add social profiles here once they exist */}
            <div className="flex gap-3 mt-6">
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email us"
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#0066cc]/10 hover:text-[#0066cc] hover:border-[#0066cc]/20 transition-all duration-300"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* More Tools */}
          <div>
            <h3 className="font-bold text-slate-900 mb-5 tracking-wide">Quick Links</h3>
            <div className="flex flex-col gap-3 text-slate-500">
              {[
                ...TOOLS.slice(4).map((t) => ({ name: t.name, href: toolPath(t.slug) })),
                { name: "All tools", href: "/tools" },
              ].map((link, idx) => (
                <Link 
                  key={idx} 
                  href={link.href} 
                  className="flex min-h-[44px] items-center hover:text-[#0066cc] hover:translate-x-1 transition-all duration-300 w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="font-bold text-slate-900 mb-5 tracking-wide">Popular Tools</h3>
            <div className="flex flex-col gap-3 text-slate-500">
              {[
                ...TOOLS.slice(0, 4).map((t) => ({ name: t.name, icon: t.icon, href: toolPath(t.slug) })),
              ].map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <Link 
                    key={idx} 
                    href={tool.href} 
                    className="group flex min-h-[44px] items-center gap-2 hover:text-[#0066cc] transition-all duration-300 w-fit"
                  >
                    <Icon size={16} className="text-slate-400 group-hover:text-[#0066cc] transition-colors duration-300" /> 
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{tool.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-bold text-slate-900 mb-5 tracking-wide">Contact & Support</h3>
            <p className="text-slate-500 mb-4">
              Have suggestions or need help with a tool? We&apos;re here for you.
            </p>
            <a 
              href={`mailto:${SITE.email}`} 
              className="inline-flex min-h-[44px] items-center gap-2 font-medium text-[#0066cc] hover:text-[#005bb5] transition-colors"
            >
              {SITE.email}
              <ArrowRight size={16} />
            </a>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} ToolsTree. All rights reserved.</p>

          <div className="flex flex-wrap justify-center gap-x-6">
            <Link href="/about" className="flex min-h-[44px] items-center px-1 hover:text-[#0066cc] transition-colors">About</Link>
            <Link href="/contact" className="flex min-h-[44px] items-center px-1 hover:text-[#0066cc] transition-colors">Contact</Link>
            <Link href="/privacy" className="flex min-h-[44px] items-center px-1 hover:text-[#0066cc] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="flex min-h-[44px] items-center px-1 hover:text-[#0066cc] transition-colors">Terms of Service</Link>
          </div>

          <p className="flex items-center gap-1.5 font-medium">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> for creators
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;