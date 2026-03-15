"use client";

import Link from "next/link";
import {
  Twitter,
  Mail,
  Heart,
  FileText,
  Image as ImageIcon,
  FilePlus,
  Linkedin,
  Layers,
  Scissors,
  Shrink,
  ArrowRight,
  FileSpreadsheet
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand & Mission */}
          <div className="lg:pr-6">
            <Link href="/" className="text-2xl font-black tracking-tight text-[#0066cc] flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0066cc] flex items-center justify-center text-white text-lg">
                T
              </div>
              ToolsTree
            </Link>
            <p className="text-slate-500 mt-4 leading-relaxed">
              Free online tools to convert, edit, and manage PDFs and images easily — all in one secure place.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {[Linkedin, Twitter, Mail].map((Icon, idx) => (
                <div 
                  key={idx} 
                  className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#0066cc]/10 hover:text-[#0066cc] hover:border-[#0066cc]/20 transition-all duration-300 cursor-pointer"
                >
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-slate-900 mb-5 tracking-wide">Quick Links</h3>
            <div className="flex flex-col gap-3 text-slate-500">
              {[
                { name: "Image to PDF", href: "/tools/image-to-pdf" },
                { name: "PDF to Image", href: "/tools/pdf-to-image" },
                { name: "Word to PDF", href: "/tools/word-to-pdf" },
                { name: "Excel to PDF", href: "/tools/excel-to-pdf" },
                { name: "PowerPoint to PDF", href: "/tools/ppt-to-pdf" },
                { name: "Protect PDF", href: "/tools/protect-pdf" },
              ].map((link, idx) => (
                <Link 
                  key={idx} 
                  href={link.href} 
                  className="hover:text-[#0066cc] hover:translate-x-1 transition-all duration-300 w-fit"
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
                { name: "Merge PDF", icon: Layers, href: "/tools/merge-pdf" },
                { name: "Split PDF", icon: Scissors, href: "/tools/split-pdf" },
                { name: "Compress PDF", icon: Shrink, href: "/tools/compress-pdf" },
                { name: "PDF to Word", icon: FileText, href: "/tools/pdf-to-word" },
                { name: "Delete PDF Pages", icon: FilePlus, href: "/tools/delete-pdf" },
                { name: "Compress Image", icon: ImageIcon, href: "/tools/compress-image" },
              ].map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <Link 
                    key={idx} 
                    href={tool.href} 
                    className="group flex items-center gap-2 hover:text-[#0066cc] transition-all duration-300 w-fit"
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
              Have suggestions or need help with a tool? We're here for you.
            </p>
            <a 
              href="mailto:support@toolstree.com" 
              className="inline-flex items-center gap-2 font-medium text-[#0066cc] hover:text-[#005bb5] transition-colors"
            >
              support@toolstree.com
              <ArrowRight size={16} />
            </a>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} ToolsTree. All rights reserved.</p>

          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#0066cc] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#0066cc] transition-colors">Terms of Service</Link>
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