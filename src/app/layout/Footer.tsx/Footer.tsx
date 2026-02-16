"use client";

import Link from "next/link";
import {
  Github,
  Twitter,
  Mail,
  Heart,
  FileText,
  Image,
  FilePlus,
  FacebookIcon,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t ">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold text-blue-600">ToolsTree</Link>
            <p className="text-sm text-gray-600 mt-3">
              Free online tools to convert, edit, and manage PDFs and images
              easily — all in one place.
            </p>

            {/* Social */}
            <div className="flex gap-3 text-black mt-4">
              <Linkedin className="cursor-pointer hover:text-blue-600" />
              <Twitter className="cursor-pointer hover:text-blue-600" />
              <Mail className="cursor-pointer hover:text-blue-600" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-black mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <Link href="/tools/image-to-pdf">Image to PDF</Link>
              <Link href="/tools/pdf-to-image">PDF to Image</Link>
              <Link href="/tools/word-to-pdf">Word to PDF</Link>
            </div>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="font-semibold text-black mb-3">Popular Tools</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <Link href="/tools/image-to-pdf" className="flex items-center gap-2">
                <Image size={16} /> Image to PDF
              </Link>
              <Link href="/tools/pdf-to-word" className="flex items-center gap-2">
                <FileText size={16} /> PDF to Word
              </Link>
              <Link href="/tools/delete-pdf" className="flex items-center gap-2">
                <FilePlus size={16} /> Delete PDF Page
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-black mb-3">Contact</h3>
            <p className="text-sm text-gray-600">
              Have suggestions or feedback?
            </p>
            <p className="text-sm text-black mt-2">support@toolstree.com</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-10 pt-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 ToolsTree. All rights reserved.</p>

          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Made with <Heart size={14} className="text-red-500" /> for creators
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
