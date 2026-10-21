import React from "react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#FAFAFA] flex items-center font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Premium Decorative Background Elements */}
      <div aria-hidden="true" className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full" style={{ background: "radial-gradient(closest-side, rgba(199,210,254,0.55), rgba(199,210,254,0))" }}></div>
      <div aria-hidden="true" className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(closest-side, rgba(233,213,255,0.55), rgba(233,213,255,0))" }}></div>
      
      {/* Refined Grid Pattern with Fade-Out Mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-16 items-center z-10">
        
        {/* Left Content */}
        <div className="max-w-xl relative z-20">
          
          {/* Sleek Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/60 border border-zinc-200/50 text-zinc-600 text-sm font-medium mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0066cc]/75 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0066cc]"></span>
            </span>
            Professional PDF Suite
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 leading-[1.05]">
            All PDF Tools in <br className="hidden md:block" />
            <span className="text-[#0066cc] bg-clip-text pb-2">
              One Workspace.
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-zinc-500 leading-relaxed font-light">
            Edit, merge, split, rotate and convert PDFs and images. 
            Everything runs in your browser, so your files are never uploaded.
          </p>

          {/* Premium CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="#tools" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0066cc] text-white font-medium rounded-2xl shadow-[0_8px_30px_rgb(0,102,204,0.12)] hover:bg-[#005bb5] hover:shadow-[0_8px_30px_rgb(0,102,204,0.2)] hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:ring-offset-2 active:scale-[0.98]">
              Explore Tools
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link href="#how-it-works" className="px-8 py-4 bg-white/50 border border-zinc-200/80 text-zinc-700 font-medium rounded-2xl shadow-sm hover:border-zinc-300 hover:bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:ring-offset-2 active:scale-[0.98]">
              Learn  More
            </Link>
          </div>
        </div>

        {/* Right Side - Refined Glassmorphic Cards */}
        <div className="relative flex justify-center items-center h-[500px] perspective-1000 z-10 pointer-events-none sm:pointer-events-auto">
          
          {/* Card 1: Background Left (Word) */}
          <div className="absolute w-56 h-72 bg-white/70 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white/60 transform -rotate-6 -translate-x-24 translate-y-8 transition-transform hover:-rotate-3 hover:-translate-y-2 duration-700 hidden sm:flex flex-col p-6">
            <div className="w-12 h-12 bg-blue-50/80 rounded-2xl flex items-center justify-center mb-5 text-blue-500 shadow-sm border border-blue-100/50">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16c-2.05 0-3.81-1.24-4.58-3h1.71c.63.9 1.68 1.5 2.87 1.5 1.93 0 3.5-1.57 3.5-3.5S13.93 9.5 12 9.5c-1.35 0-2.52.78-3.1 1.9l1.6 1.6h-4V9l1.3 1.3C8.69 8.92 10.23 8 12 8c2.76 0 5 2.24 5 5s-2.24 5-5 5z"/></svg>
            </div>
            <div className="h-2.5 bg-zinc-100 rounded-full w-full mb-4"></div>
            <div className="h-2.5 bg-zinc-100 rounded-full w-4/5 mb-4"></div>
            <div className="h-2.5 bg-zinc-100 rounded-full w-5/6"></div>
            <div className="mt-auto self-start text-[10px] uppercase tracking-wider font-bold text-blue-500 bg-blue-50/50 px-2.5 py-1 rounded-md border border-blue-100/50">.DOCX</div>
          </div>
          
          {/* Card 2: Background Right (Image) */}
          <div className="absolute w-56 h-72 bg-white/70 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white/60 transform rotate-6 translate-x-28 -translate-y-4 transition-transform hover:rotate-3 hover:-translate-y-6 duration-700 hidden sm:flex flex-col p-6">
             <div className="w-12 h-12 bg-emerald-50/80 rounded-2xl flex items-center justify-center mb-5 text-emerald-500 shadow-sm border border-emerald-100/50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            {/* Elegant Mock Image Area */}
            <div className="flex-1 rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200/50 mb-4 flex items-center justify-center overflow-hidden relative">
               <div className="absolute inset-0 bg-emerald-100/30"></div>
               <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-200 to-teal-100 blur-lg"></div>
            </div>
            <div className="mt-auto self-start text-[10px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-md border border-emerald-100/50">.JPG</div>
          </div>

          {/* Floating Small Badge: SVG (Gold Accent) */}
          <div className="absolute z-30 top-1/4 right-0 bg-white/90 p-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/80 transform rotate-3 animate-[bounce_4s_infinite] hidden lg:flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 border border-amber-100/50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            </div>
            <span className="text-xs font-bold text-zinc-700 tracking-wide pr-2">.SVG</span>
          </div>
          
          {/* Front Main Card: PDF */}
          <div className="relative z-20 w-80 h-[420px] bg-white/95 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(79,70,229,0.15)] border border-white flex flex-col p-7 transform transition-all duration-500 hover:-translate-y-2">
            
            {/* Inner Glow Detail */}
            <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-5 border-b border-zinc-100 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm border border-red-100/50">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/></svg>
                </div>
                <div>
                  <p className="font-semibold text-zinc-800 text-lg">Merge_Q3.pdf</p>
                  <p className="text-sm text-zinc-500 font-medium">2.4 MB</p>
                </div>
              </div>
            </div>
            
            {/* Elegant Conversion Process Animation */}
            <div className="space-y-5 flex-1 flex flex-col justify-center relative z-10">
               <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                 <div className="w-2/3 h-full bg-[#0066cc] rounded-full animate-[pulse_2s_ease-in-out_infinite] bg-[length:200%_auto]"></div>
               </div>
               <p className="text-center text-sm font-medium text-zinc-500 tracking-wide">Converting files...</p>
            </div>
            
            {/* Refined Footer Action */}
            <div className="mt-auto p-4 bg-zinc-900 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-zinc-800 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-zinc-900/20 relative z-10">
              <span className="text-white font-medium pl-2">Download PDF</span>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-zinc-900 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;