"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileImage,
  FileText,
  FilePlus,
  Scissors,
  Combine,
  RotateCw,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const Header = () => {
  const [showTools, setShowTools] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);

  const tools = [
    { name: "Image to PDF", path: "/tools/image-to-pdf", icon: FileImage },
    { name: "PDF to Image", path: "/tools/pdf-to-image", icon: FileImage },
    { name: "Compress PDF", path: "/tools/compress-pdf", icon: FileText },
    { name: "Merge PDF", path: "/tools/merge-pdf", icon: Combine },
    { name: "Split PDF", path: "/tools/split-pdf", icon: Scissors },
    { name: "JPG to PDF", path: "/tools/jpg-to-pdf", icon: FileImage },
    { name: "Delete PDF Page", path: "/tools/delete-pdf", icon: FilePlus },
    { name: "Word to PDF", path: "/tools/word-to-pdf", icon: FileText },
    { name: "PDF to Word", path: "/tools/pdf-to-word", icon: FileText },
    { name: "Rotate PDF", path: "/tools/rotate-pdf", icon: RotateCw },
  ];

  // Helper to close mobile menus after navigation
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileToolsOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-black/40 relative z-[100]">
      <div className="mx-auto h-16 px-4 md:px-7">
        <div className="flex justify-between items-center h-full">
          
          {/* Logo */}
          <Link href="/" onClick={closeMobileMenu}>
            <span className="text-2xl font-bold text-blue-600/90 cursor-pointer">
              ToolsTree
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-4 lg:gap-6 items-center text-black relative">
            
            {/* Desktop All Tools Dropdown */}
            <div
              className="relative py-4"
              onMouseEnter={() => setShowTools(true)}
              onMouseLeave={() => setShowTools(false)}
            >
              <div className="flex items-center gap-1 cursor-pointer font-medium hover:text-blue-600 transition">
                All Tools <ChevronDown size={16} />
              </div>

              {showTools && (
                <div className="absolute top-[52px] -left-10 lg:left-0 bg-white border border-gray-200 shadow-xl p-6 rounded-2xl grid grid-cols-2 lg:grid-cols-3 gap-4 w-[400px] lg:w-[520px]">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.path}
                        href={tool.path}
                        onClick={() => setShowTools(false)}
                        className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg text-sm text-black font-medium transition"
                      >
                        <Icon size={18} className="text-blue-600" />
                        {tool.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Desktop Quick Links */}
            <Link href="/tools/image-to-pdf" className="hover:text-blue-600 font-medium transition text-sm lg:text-base">
              Image to PDF
            </Link>
            <Link href="/tools/pdf-to-image" className="hover:text-blue-600 font-medium transition text-sm lg:text-base">
              PDF to Image
            </Link>
            <Link href="/tools/delete-pdf" className="hover:text-blue-600 font-medium transition text-sm lg:text-base">
              Delete PDF
            </Link>
            <Link href="/tools/word-to-pdf" className="hover:text-blue-600 font-medium transition text-sm lg:text-base">
              Word to PDF
            </Link>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <button className="px-5 py-2 cursor-pointer text-white bg-blue-600 rounded-md hover:bg-blue-700 transition font-medium">
              Donate
            </button>
          </div>

          {/* Mobile Menu Toggle & Donate Button */}
          <div className="flex md:hidden items-center gap-3">
            <button className="px-4 py-1.5 cursor-pointer text-white bg-blue-600 rounded-md hover:bg-blue-700 transition text-sm font-medium">
              Donate
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-black p-1 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-2xl  flex flex-col px-6 py-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
          
          {/* Mobile All Tools Accordion */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <button
              onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
              className="flex justify-between items-center w-full text-left  text-black text-lg py-2"
            >
              All Tools
              <ChevronDown
                size={20}
                className={`transition-transform duration-200 text-black ${
                  isMobileToolsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMobileToolsOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pl-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.path}
                      href={tool.path}
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-medium transition border border-gray-100"
                    >
                      <Icon size={18} className="text-blue-600" />
                      {tool.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Quick Links */}
          <div className="flex flex-col gap-5 py-2  text-base text-black">
            <Link href="/tools/image-to-pdf" onClick={closeMobileMenu} className="hover:text-blue-600 transition">
              Image to PDF
            </Link>
            <Link href="/tools/pdf-to-image" onClick={closeMobileMenu} className="hover:text-blue-600 transition">
              PDF to Image
            </Link>
            <Link href="/tools/delete-pdf" onClick={closeMobileMenu} className="hover:text-blue-600 transition">
              Delete PDF Page
            </Link>
            <Link href="/tools/word-to-pdf" onClick={closeMobileMenu} className="hover:text-blue-600 transition">
              Word to PDF
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;