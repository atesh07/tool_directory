import React from "react";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-slate-50 flex items-center font-sans">
      {/* Decorative Background Elements - Moved away from just blue */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse transition-all duration-1000"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-5 grid md:grid-cols-2 gap-16 items-center z-10">
        
        {/* Left Content */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100/50 border border-violet-200 text-violet-700 text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-violet-600"></span>
            Make it Simple
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            All PDF Tools in <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-blue-600 to-fuchsia-600 text-transparent bg-clip-text">
              One Place.
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed">
            Fast, simple, and secure PDF tools to make your work easier. 
            Merge, split, compress, convert, and protect your files—directly in your browser.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-semibold rounded-xl shadow-sm hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 active:scale-95">
              Explore Tools
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button className="px-8 py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-violet-200 hover:bg-violet-50/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 active:scale-95">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Side - Multi-format Floating Cards */}
        <div className="relative flex justify-center items-center h-[400px] lg:h-[500px] perspective-1000">
          
          {/* Card 1: Word Document (Blue Accent) */}
          <div className="absolute w-56 h-72 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 transform -rotate-12 -translate-x-20 translate-y-12 transition-transform hover:-rotate-6 hover:-translate-y-2 duration-500 hidden sm:flex flex-col p-5">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16c-2.05 0-3.81-1.24-4.58-3h1.71c.63.9 1.68 1.5 2.87 1.5 1.93 0 3.5-1.57 3.5-3.5S13.93 9.5 12 9.5c-1.35 0-2.52.78-3.1 1.9l1.6 1.6h-4V9l1.3 1.3C8.69 8.92 10.23 8 12 8c2.76 0 5 2.24 5 5s-2.24 5-5 5z"/></svg>
            </div>
            <div className="h-3 bg-slate-100 rounded w-full mb-3"></div>
            <div className="h-3 bg-slate-100 rounded w-4/5 mb-3"></div>
            <div className="h-3 bg-slate-100 rounded w-5/6"></div>
            <div className="mt-auto self-end text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">.DOCX</div>
          </div>
          
          {/* Card 2: Image / JPG (Emerald Accent) */}
          <div className="absolute w-56 h-72 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 transform rotate-12 translate-x-24 -translate-y-4 transition-transform hover:rotate-6 hover:-translate-y-6 duration-500 hidden sm:flex flex-col p-5">
             <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            {/* Mock Image Area */}
            <div className="flex-1 bg-slate-50 rounded-lg border border-slate-100 mb-4 flex items-center justify-center overflow-hidden">
               <div className="w-16 h-16 rounded-full bg-emerald-100/50 blur-xl"></div>
            </div>
            <div className="mt-auto self-start text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">.JPG / .PNG</div>
          </div>

          {/* Floating Small Badge: SVG (Orange Accent) */}
          <div className="absolute z-20 top-1/4 right-8 bg-white p-3 rounded-xl shadow-lg border border-slate-100 transform rotate-3 animate-pulse  shadow-orange-900/5 hidden md:flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            </div>
            <span className="text-sm font-bold text-slate-700">.SVG</span>
          </div>
          
          {/* Front Main Card: PDF (Red Accent) */}
          <div className="relative z-10 w-72 h-96 bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col p-6 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-fuchsia-900/10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-inner">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Merge.pdf</h3>
                  <p className="text-xs text-slate-400">2.4 MB</p>
                </div>
              </div>
            </div>
            
            {/* Conversion Process Animation Mockup */}
            <div className="space-y-4 flex-1 flex flex-col justify-center relative">
               <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div className="w-2/3 h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"></div>
               </div>
               <p className="text-center text-sm font-medium text-slate-500">Converting files...</p>
            </div>
            
            {/* Footer / Action */}
            <div className="mt-auto p-4 bg-slate-900 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-colors shadow-lg">
              <span className="text-white font-medium text-sm">Download PDF</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-900 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;