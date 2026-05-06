import Hero from "../components/Hero";
import Chapter from "../components/Chapter";
import { content } from "../data";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { Toaster, toast } from "sonner";

export default function Home() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!reportRef.current) return;
    
    setIsGenerating(true);
    const toastId = toast.loading("GENERATING REPORT SCENE...");
    
    try {
      const element = reportRef.current;
      
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#F5F0E8', // Match bg-card
        width: 1440,
        style: {
          width: '1440px',
          height: 'auto',
          transform: 'none',
          margin: '0',
        }
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [1440, element.scrollHeight]
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, 1440, element.scrollHeight);
      pdf.save('AI_STUDIO_DIRECTIVE.pdf');
      
      toast.success("ASSET SECURED", { id: toastId });
    } catch (error) {
      console.error("Failed to generate PDF", error);
      toast.error("SEQUENCE FAILED", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col lg:flex-row">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--accent-red)',
          borderRadius: '0px',
          fontFamily: 'var(--font-mono)'
        }
      }} />
      
      {/* LEFT COLUMN: THE SCRIPT (CONTENT) */}
      <div className="w-full lg:w-3/4 bg-[var(--bg-primary)] p-0 lg:pr-0">
        <div ref={reportRef} className="bg-[var(--bg-card)] text-[#111] min-h-screen">
          <main>
            <Hero onPrint={handleDownload} isGenerating={isGenerating} />
            {content.chapters.map((chapter, index) => (
              <Chapter 
                key={chapter.id}
                id={chapter.id}
                number={chapter.number}
                title={chapter.title}
                headline={chapter.headline}
                whyMatters={chapter.whyMatters}
                stages={chapter.stages}
                stat={chapter.stat}
                chart={chapter.chart}
                isLast={index === content.chapters.length - 1}
              />
            ))}
          </main>
          
          <footer className="bg-[var(--bg-elevated)] text-[var(--text-primary)] py-24 border-t-4 border-[var(--accent-red)]">
            <div className="max-w-4xl mx-auto px-12 text-center">
              <h2 className="font-masthead text-5xl mb-8 uppercase tracking-tighter">
                End of Scene
              </h2>
              <div className="font-mono text-[var(--text-muted)] text-sm uppercase tracking-widest">
                © 2026 AI Transformation Framework. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* RIGHT COLUMN: THE VERDICT (CONTROLS) */}
      <div className="w-full lg:w-1/4 bg-[var(--bg-elevated)] border-l border-[var(--border-subtle)] lg:h-screen lg:sticky lg:top-0 overflow-y-auto flex flex-col">
        {/* Header Bar */}
        <div className="bg-[var(--accent-red)] p-4">
          <h3 className="font-label text-white text-xl tracking-[3px] font-bold uppercase text-center">
            The Verdict
          </h3>
        </div>

        {/* Navigation / TOC */}
        <div className="p-8 flex-grow">
          <div className="mb-12">
            <h4 className="font-mono text-[var(--accent-red)] text-xs uppercase mb-6 tracking-widest border-b border-[var(--border-subtle)] pb-2">
              Scene Select
            </h4>
            <nav className="flex flex-col gap-4">
              {content.chapters.map((chapter) => (
                <a 
                  key={chapter.id} 
                  href={`#${chapter.id}`}
                  className="group flex items-baseline gap-3 hover:text-[var(--accent-red)] transition-colors"
                >
                  <span className="font-mono text-[var(--text-muted)] text-xs group-hover:text-[var(--accent-red)]">
                    SC.{chapter.number}
                  </span>
                  <span className="font-label text-sm uppercase tracking-widest text-white">
                    {chapter.title}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div>
            <h4 className="font-mono text-[var(--accent-red)] text-xs uppercase mb-6 tracking-widest border-b border-[var(--border-subtle)] pb-2">
              Production Actions
            </h4>
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full py-4 bg-[var(--accent-red)] text-white font-label text-sm tracking-[2px] uppercase hover:bg-[#990000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center"
              >
                {isGenerating ? "PROCESSING..." : "DOWNLOAD REPORT ⎙"}
              </button>
              
              <button className="w-full py-4 bg-transparent border border-[var(--border-subtle)] text-[var(--text-muted)] font-label text-sm tracking-[2px] uppercase hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] transition-colors text-center">
                CONTACT SALES ▶
              </button>
            </div>
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="p-8 border-t border-[var(--border-subtle)]">
          <div className="font-mono text-[var(--text-muted)] text-[10px] uppercase leading-relaxed">
            VOL. 2026 ✦ DATE {new Date().toLocaleDateString()} <br/>
            EDITION ▸▸▸▸
          </div>
        </div>
      </div>
    </div>
  );
}
