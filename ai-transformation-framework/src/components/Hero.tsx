import { motion } from "motion/react";
import { content } from "../data";

interface HeroProps {
  onPrint?: () => void;
  isGenerating?: boolean;
}

export default function Hero({ onPrint, isGenerating }: HeroProps) {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center bg-[var(--bg-card)] overflow-hidden pt-24 pb-24 border-b border-[var(--border-card)]">
      <div className="max-w-4xl mx-auto px-8 text-center z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Masthead Subbar */}
          <div className="flex justify-center items-center gap-4 mb-12 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] border-b-2 border-double border-[var(--border-subtle)] pb-2">
            <span>VOL. 2026</span>
            <span>✦</span>
            <span>STRATEGIC MANDATE</span>
            <span>✦</span>
            <span>EDITION ▸▸▸▸</span>
          </div>

          {/* Masthead Title */}
          <h1 className="text-7xl md:text-9xl font-masthead tracking-tighter leading-[0.85] mb-8 text-black">
            {content.hero.title.split(" ").map((word, i) => (
              <span key={i} className={i === 1 ? "text-[var(--accent-red)]" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>

          <p className="text-xl md:text-2xl font-input text-[#333] mb-12 max-w-2xl mx-auto leading-relaxed">
            {content.hero.subtitle}
          </p>
          
          <div className="h-1 w-24 bg-[var(--accent-red)] mx-auto mb-12"></div>
          
          <button 
            onClick={onPrint}
            disabled={isGenerating}
            className="px-8 py-4 bg-[var(--accent-red)] text-white font-label text-sm tracking-[2px] uppercase hover:bg-[#990000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? "PROCESSING..." : "DOWNLOAD REPORT ⎙"}
          </button>
        </motion.div>
      </div>

      <div className="mt-12 w-full max-w-5xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-masthead italic mb-6 text-black">The Equation</h2>
          <p className="text-lg font-mono leading-relaxed text-[#444]">
            {content.hero.description}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-[var(--border-card)] p-8 aspect-video flex items-center justify-center shadow-none"
        >
           <div className="flex items-center gap-4 text-3xl md:text-5xl font-mono text-black">
             <span className="border-b-2 border-[var(--accent-red)]">L</span> × 
             <span className="border-b-2 border-[var(--accent-red)]">C</span> × 
             <span className="border-b-2 border-[var(--accent-red)]">T</span> × 
             <span className="border-b-2 border-[var(--accent-red)]">G</span> = 
             <span className="text-[var(--accent-red)] font-bold">IMPACT</span>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
