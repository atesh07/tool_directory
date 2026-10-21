"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { TOOLS, toolPath } from "@/data/tools";

const QUICK_LINKS = ["edit-pdf", "merge-pdf", "image-to-pdf", "pdf-to-image", "word-to-pdf"];

const Header = () => {
  const pathname = usePathname();
  const [showTools, setShowTools] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Only tools that really exist, so no menu item leads to a 404
  const tools = TOOLS.map((t) => ({ slug: t.slug, name: t.name, path: toolPath(t.slug), icon: t.icon }));
  const quick = QUICK_LINKS.map((slug) => tools.find((t) => t.slug === slug)).filter((t): t is NonNullable<typeof t> => !!t);

  const closeAll = () => {
    setShowTools(false);
    setIsMobileMenuOpen(false);
    setIsMobileToolsOpen(false);
  };

  // Close menus after navigating to another page
  useEffect(() => {
    closeAll();
  }, [pathname]);

  // Escape closes any open menu; a click outside closes the desktop dropdown
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    const onClick = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setShowTools(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  return (
    <header className="w-full bg-white border-b border-slate-300 relative z-[100]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[200] focus:rounded-lg focus:bg-[#0062cc] focus:px-4 focus:py-3 focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <div className="mx-auto h-16 px-4 md:px-7">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" onClick={closeAll} aria-label="ToolsTree home" className="flex min-h-[44px] items-center rounded-lg">
            <span className="text-2xl font-bold text-[#0066cc]">ToolsTree</span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main" className="hidden md:flex gap-4 lg:gap-6 items-center text-black relative">
            {/* Desktop tools dropdown: works with mouse hover, click, and keyboard */}
            <div
              ref={toolsRef}
              className="relative"
              onMouseEnter={() => setShowTools(true)}
              onMouseLeave={() => setShowTools(false)}
              onBlur={(e) => {
                if (!toolsRef.current?.contains(e.relatedTarget as Node)) setShowTools(false);
              }}
            >
              <button
                type="button"
                aria-expanded={showTools}
                aria-haspopup="true"
                aria-controls="tools-menu"
                onClick={() => setShowTools((v) => !v)}
                className="flex min-h-[44px] items-center gap-1 rounded-lg px-2 font-medium hover:text-[#0066cc] transition"
              >
                Tools <ChevronDown size={16} aria-hidden="true" className={`transition-transform ${showTools ? "rotate-180" : ""}`} />
              </button>

              {showTools && (
                <div
                  id="tools-menu"
                  className="absolute top-[48px] -left-10 lg:left-0 bg-white border border-gray-200 shadow-xl p-6 rounded-2xl grid grid-cols-2 lg:grid-cols-3 gap-2 w-[400px] lg:w-[520px]"
                >
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.path}
                        href={tool.path}
                        onClick={() => setShowTools(false)}
                        className="flex min-h-[44px] items-center gap-3 hover:bg-gray-100 p-2 rounded-lg text-sm text-black font-medium transition"
                      >
                        <Icon size={18} className="text-[#0066cc]" aria-hidden="true" />
                        {tool.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Desktop Quick Links */}
            {quick.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.path}
                aria-current={pathname === tool.path ? "page" : undefined}
                className={`flex min-h-[44px] items-center rounded-lg px-1 font-medium transition text-sm lg:text-base hover:text-[#0066cc] ${pathname === tool.path ? "text-[#0066cc]" : ""}`}
              >
                {tool.name}
              </Link>
            ))}
            <Link
              href="/guides"
              aria-current={pathname.startsWith("/guides") ? "page" : undefined}
              className={`flex min-h-[44px] items-center rounded-lg px-1 font-medium transition text-sm lg:text-base hover:text-[#0066cc] ${pathname.startsWith("/guides") ? "text-[#0066cc]" : ""}`}
            >
              Guides
            </Link>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/tools"
              className="flex min-h-[44px] items-center px-5 text-white bg-[#0066cc] rounded-lg hover:bg-[#005bb5] transition font-medium"
            >
              All Tools
            </Link>
          </div>

          {/* Mobile Menu Toggle & All Tools Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/tools"
              onClick={closeAll}
              className="flex min-h-[44px] items-center px-4 text-white bg-[#0066cc] rounded-lg hover:bg-[#005bb5] transition text-sm font-medium"
            >
              All Tools
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="grid h-11 w-11 place-items-center rounded-lg text-black"
            >
              {isMobileMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu Dropdown */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-2xl flex flex-col px-4 py-4 overflow-y-auto max-h-[calc(100vh-4rem)]"
        >
          {/* Mobile Tools Accordion */}
          <div className="border-b border-gray-200 pb-3 mb-3">
            <button
              type="button"
              onClick={() => setIsMobileToolsOpen((v) => !v)}
              aria-expanded={isMobileToolsOpen}
              aria-controls="mobile-tools"
              className="flex min-h-[48px] w-full items-center justify-between text-left text-lg text-black"
            >
              All tools
              <ChevronDown
                size={20}
                aria-hidden="true"
                className={`transition-transform duration-200 text-black ${isMobileToolsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isMobileToolsOpen && (
              <div id="mobile-tools" className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.path}
                      href={tool.path}
                      onClick={closeAll}
                      className="flex min-h-[48px] items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-medium transition border border-gray-100"
                    >
                      <Icon size={18} className="text-[#0066cc]" aria-hidden="true" />
                      {tool.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Quick Links */}
          <div className="flex flex-col text-base text-black">
            {quick.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.path}
                onClick={closeAll}
                aria-current={pathname === tool.path ? "page" : undefined}
                className="flex min-h-[48px] items-center hover:text-[#0066cc] transition"
              >
                {tool.name}
              </Link>
            ))}
            <Link href="/guides" onClick={closeAll} className="flex min-h-[48px] items-center hover:text-[#0066cc] transition">
              Guides
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
