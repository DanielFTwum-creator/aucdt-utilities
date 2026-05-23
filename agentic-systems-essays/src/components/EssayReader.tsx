import React, { useState } from "react";
import { Essay } from "../types";
import { Clock, Tag, ChevronLeft, ChevronRight, Activity, HelpCircle, BookOpen, Bookmark, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import DelegationVisualizer from "./DelegationVisualizer";
import ContextVisualizer from "./ContextVisualizer";
import MemoryVisualizer from "./MemoryVisualizer";
import DocDebtVisualizer from "./DocDebtVisualizer";
import PortVisualizer from "./PortVisualizer";

const getCategoryMetadata = (id: number) => {
  switch (id) {
    case 1:
      return {
        name: "Autonomous Agency",
        colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        contrastColorClass: "bg-black text-emerald-400 border-emerald-400 border",
        icon: <Cpu className="w-3.5 h-3.5" />
      };
    case 2:
      return {
        name: "Prompt & Compute",
        colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        contrastColorClass: "bg-black text-amber-400 border-amber-400 border",
        icon: <Activity className="w-3.5 h-3.5" />
      };
    case 3:
      return {
        name: "System Memory",
        colorClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
        contrastColorClass: "bg-black text-cyan-400 border-cyan-400 border",
        icon: <BookOpen className="w-3.5 h-3.5" />
      };
    case 4:
      return {
        name: "Technical Debt",
        colorClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        contrastColorClass: "bg-black text-rose-400 border-rose-400 border",
        icon: <Tag className="w-3.5 h-3.5" />
      };
    case 5:
      return {
        name: "Interface & Execution",
        colorClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
        contrastColorClass: "bg-black text-violet-400 border-violet-400 border",
        icon: <Bookmark className="w-3.5 h-3.5" />
      };
    default:
      return {
        name: "Design & Research",
        colorClass: "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20",
        contrastColorClass: "bg-black text-white border-white border",
        icon: <Bookmark className="w-3.5 h-3.5" />
      };
  }
};

interface EssayReaderProps {
  essay: Essay;
  theme?: string;
  onNext?: () => void;
  onPrev?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function EssayReader({ essay, theme = "light", onNext, onPrev, hasPrev, hasNext }: EssayReaderProps) {
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  // Return corresponding visualizer component for the active essay ID
  const renderVisualizer = (id: number) => {
    switch (id) {
      case 1:
        return <DelegationVisualizer />;
      case 2:
        return <ContextVisualizer />;
      case 3:
        return <MemoryVisualizer />;
      case 4:
        return <DocDebtVisualizer />;
      case 5:
        return <PortVisualizer />;
      default:
        return null;
    }
  };

  // Helper to parse text and inject beautiful interactive semantic highlights for key industry essays
  const processParagraph = (text: string) => {
    const wordsToHighlight = [
      { word: "befuddling", trigger: "overnight-delegation", tip: "Befuddlement: The cognitive friction that occurs when humans realize standard hand-typing labor is no longer required." },
      { word: "sautéed", trigger: "sauté", tip: "Sautéing: Running contextual instructions through low-temp self-correction passes to condense semantics and reduce token count." },
      { word: "tinkering", trigger: "tinker", tip: "Tinkering: Small-scale continuous refinements of docstrings and naming structures to reduce architectural complexity." },
      { word: "osmosing", trigger: "osmosis", tip: "Osmosing: Passive status where an agent reads environment variables and crawls file lists without taking decisive action." },
      { word: "Port 3007", trigger: "port", tip: "Port 3007: The designated local playground telemetry binding that marks transition into active, goal-directed executing agency." }
    ];

    // Simple replacement pattern
    let elements: (string | React.ReactNode)[] = [text];

    wordsToHighlight.forEach(({ word, trigger, tip }) => {
      const newElements: (string | React.ReactNode)[] = [];
      elements.forEach(el => {
        if (typeof el === "string") {
          const parts = el.split(new RegExp(`(${word})`, "g"));
          parts.forEach(part => {
            if (part === word) {
              newElements.push(
                <span
                  key={word}
                  onMouseEnter={() => setActiveHighlight(trigger)}
                  onMouseLeave={() => setActiveHighlight(null)}
                  className={`relative cursor-help font-semibold border-b border-dashed px-1 py-0.5 rounded transition-all duration-300 group inline-block ${
                    theme === "dark" 
                      ? "text-white bg-neutral-800 border-neutral-500 hover:bg-neutral-700" 
                      : theme === "high-contrast" 
                      ? "text-[#FACC15] bg-black border-[#FACC15] hover:bg-white/10" 
                      : "text-[#1A1A1A] bg-black/5 border-black/40 hover:bg-black/10"
                  }`}
                >
                  {word}
                  <AnimatePresence>
                    {activeHighlight === trigger && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 p-4 text-[11px] font-serif rounded-lg shadow-xl w-[250px] z-50 text-left leading-relaxed pointer-events-none border ${
                          theme === "dark" 
                            ? "bg-neutral-900 border-neutral-700 text-white" 
                            : theme === "high-contrast" 
                            ? "bg-black border-2 border-[#FACC15] text-white" 
                            : "bg-white border-black/15 text-[#1A1A1A]"
                        }`}
                      >
                        <span className="font-sans font-bold block mb-1.5 uppercase tracking-wider text-[8.5px] opacity-60">Glossary Definition</span>
                        {tip}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              );
            } else {
              newElements.push(part);
            }
          });
        } else {
          newElements.push(el);
        }
      });
      elements = newElements;
    });

    return elements;
  };

  // Split contents by paragraph breaks and format nicely
  const paragraphs = essay.content.split("\n\n");

  // Dynamic reading time estimation
  const wordCount = essay.content.trim().split(/\s+/).filter(Boolean).length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const catMeta = getCategoryMetadata(essay.id);

  return (
    <div className="space-y-12">
      {/* Essay Content Area */}
      <article className={`rounded-lg p-6 md:p-12 font-serif shadow-xs border transition-colors duration-300 ${
        theme === "dark" 
          ? "bg-[#1C1C1C] border-neutral-800 text-neutral-100" 
          : theme === "high-contrast" 
          ? "bg-black border-2 border-white text-white" 
          : "bg-white border-black/10 text-black"
      }`}>
        {/* Essay Meta Headers */}
        <div className={`flex flex-wrap items-center gap-4 mb-8 border-b pb-6 ${
          theme === "dark" ? "border-neutral-800" : "border-black/5"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`font-sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
              theme === "high-contrast" ? "bg-[#FACC15] text-black" : "bg-current/10 text-current"
            }`}>
              Part {essay.part}
            </span>
          </div>
          <span className="opacity-35 font-sans text-xs hidden md:inline">&bull;</span>
          
          <div className="flex items-center gap-2">
            <span className={`font-sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border flex items-center gap-1.5 transition-colors ${
              theme === "high-contrast" 
                ? catMeta.contrastColorClass 
                : `${catMeta.colorClass} border-current/10`
            }`}>
              {catMeta.icon}
              <span>{catMeta.name}</span>
            </span>
          </div>

          <span className="opacity-35 font-sans text-xs hidden md:inline">&bull;</span>
          <div className="flex items-center gap-1.5 opacity-60 font-sans text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{essay.publishDate}</span>
          </div>
          <span className="opacity-35 font-sans text-xs hidden md:inline">&bull;</span>
          <div className="flex items-center gap-1.5 opacity-60 font-sans text-xs" title={`Word count: ${wordCount} words`}>
            <BookOpen className="w-3.5 h-3.5 text-current opacity-70" />
            <span>{readTimeMin} min read</span>
          </div>
          <span className="opacity-35 font-sans text-xs hidden md:inline">&bull;</span>
          <div className="flex items-center gap-1.5 font-sans text-xs border-none">
            <Tag className="w-3.5 h-3.5 opacity-60" />
            <span className={`uppercase font-sans font-bold text-[10px] tracking-wide px-2 py-0.5 rounded ${
              theme === "high-contrast" ? "bg-white text-black" : "bg-current/5 text-current"
            }`}>{essay.statusWord}</span>
          </div>
        </div>

        {/* Essay Main Display Title */}
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl md:text-6xl font-serif italic tracking-tight leading-tight">
            {essay.title}
          </h1>
          <p className="text-lg md:text-xl opacity-80 italic font-serif leading-relaxed">
            &ldquo;{essay.theme}&rdquo;
          </p>
        </div>

        {/* Narrative Paragraph Blocks */}
        <div className="space-y-6 text-[15px] md:text-[17px] opacity-90 font-serif leading-relaxed max-w-2xl">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{processParagraph(p)}</p>
          ))}
        </div>

        {/* Pagination navigation controls */}
        <div className={`flex justify-between items-center mt-12 pt-8 border-t ${
          theme === "dark" ? "border-neutral-800" : "border-black/10"
        }`}>
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className={`flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-wider py-2 px-4 rounded border transition-all cursor-pointer ${
              theme === "dark" 
                ? "bg-neutral-800 hover:bg-neutral-750 text-white border-neutral-700 disabled:opacity-20" 
                : theme === "high-contrast" 
                ? "bg-black hover:bg-neutral-900 text-white border-white border-2 disabled:opacity-20" 
                : "bg-white hover:bg-neutral-50 text-black border-black/10 hover:border-black disabled:opacity-30"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Prev Log
          </button>
          
          <span className="text-[10px] font-sans uppercase tracking-widest opacity-50">
            Log {essay.part} of 5
          </span>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-wider py-2 px-4 rounded border transition-all cursor-pointer ${
              theme === "dark" 
                ? "bg-neutral-800 hover:bg-neutral-750 text-white border-neutral-700 disabled:opacity-20" 
                : theme === "high-contrast" 
                ? "bg-black hover:bg-neutral-900 text-white border-white border-2 disabled:opacity-20" 
                : "bg-white hover:bg-neutral-50 text-black border-black/10 hover:border-black disabled:opacity-30"
            }`}
          >
            Next Log
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </article>

      {/* Embedded Diagrams Representation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Activity className="w-4 h-4 animate-pulse" />
          <h4 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">
            Active Diagram Simulation Block
          </h4>
        </div>

        <div className={`p-1 rounded-lg shadow-xs border ${
          theme === "dark" 
            ? "bg-[#1C1C1C] border-neutral-800" 
            : theme === "high-contrast" 
            ? "bg-black border-2 border-white" 
            : "bg-white border-black/10"
        }`}>
          {renderVisualizer(essay.id)}
        </div>

        {essay.screenshotsDescription && (
          <div className={`px-5 py-3.5 rounded-lg border flex items-start gap-2.5 ${
            theme === "dark" 
              ? "bg-[#1C1C1C] border-neutral-800" 
              : theme === "high-contrast" 
              ? "bg-black border-2 border-white" 
              : "bg-white border-black/10"
          }`}>
            <HelpCircle className="w-4 h-4 opacity-50 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest block opacity-70">
                Core Architectural Metaphor Specs:
              </span>
              <span className="text-xs opacity-80 italic font-serif">
                {essay.screenshotsDescription}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
