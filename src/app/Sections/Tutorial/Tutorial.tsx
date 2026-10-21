import { Upload, PlayCircle, Download } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Upload",
    desc: "Choose a PDF, Word (.docx) or image file from your device.",
    icon: Upload,
  },
  {
    number: "2",
    title: "Start processing",
    desc: "The tool works on your file inside your browser, so nothing is uploaded.",
    icon: PlayCircle,
  },
  {
    number: "3",
    title: "Download",
    desc: "Download the finished file as soon as it is ready.",
    icon: Download,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full bg-white border-t py-24 z-0 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* HOW IT WORKS HEADER */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            How to Use Our PDF Tools
          </h2>
          <p className="text-slate-600 mt-4 text-lg">
            Three simple steps, free and without an account.
          </p>
        </div>

        {/* STEPS SECTION */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-[#0066cc]/30 to-transparent -z-10" />

          <div className="grid md:grid-cols-3 gap-12 md:gap-6 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={index}
                  style={{ animationDelay: `${index * 0.15}s` }}
                  className="flex flex-col items-center text-center group animate-fade-up"
                >
                  {/* Number & Icon Wrapper */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-slate-50 flex items-center justify-center text-[#0066cc] group-hover:scale-110 group-hover:border-[#0066cc]/20 transition-transform duration-300">
                      <Icon size={36} strokeWidth={1.5} />
                    </div>
                    {/* Floating Step Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#0066cc] text-white flex items-center justify-center text-sm font-bold shadow-md">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="font-bold text-xl text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}