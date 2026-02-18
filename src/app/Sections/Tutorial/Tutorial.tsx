"use client";

import { motion } from "motion/react";
import { Upload, PlayCircle, Download } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Upload",
    desc: "Select the Word, Excel, PowerPoint, PDF or other file you wish to convert.",
    icon: Upload,
  },
  {
    number: "2",
    title: "Start processing",
    desc: "Our converter will transform your file to or from PDF in seconds.",
    icon: PlayCircle,
  },
  {
    number: "3",
    title: "Download",
    desc: "Download your converted document instantly after processing.",
    icon: Download,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative w-full bg-white border-t py-24 z-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* HOW IT WORKS HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            How to Convert Files for Free
          </h2>
          <p className="text-slate-600 mt-4 text-lg">
            Three simple steps to get your perfectly formatted document.
          </p>
        </motion.div>

        {/* STEPS SECTION */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent -z-10" />

          <div className="grid md:grid-cols-3 gap-12 md:gap-6 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Number & Icon Wrapper */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-slate-50 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:border-blue-100 transition-transform duration-300">
                      <Icon size={36} strokeWidth={1.5} />
                    </div>
                    {/* Floating Step Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-md">
                      {step.number}
                    </div>
                  </div>

                  <h4 className="font-bold text-xl text-slate-900 mb-3">
                    {step.title}
                  </h4>
                  <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}