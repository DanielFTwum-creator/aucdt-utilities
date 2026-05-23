import React from "react";
import { motion } from "motion/react";
import { Essay } from "../data/essays";
import { Calendar, Tag, ChevronRight } from "lucide-react";

interface EssayCardProps {
  essay: Essay;
  isSelected: boolean;
  onSelect: (essay: Essay) => void;
  key?: any;
}

export default function EssayCard({ essay, isSelected, onSelect }: EssayCardProps) {
  // Helper to determine the style of the status word badge
  const getStatusBadgeStyle = (word?: string) => {
    if (!word || typeof word !== "string") {
      return "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800";
    }
    switch (word.toLowerCase()) {
      case "sautéed":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50";
      case "tinkering":
        return "bg-sky-100 text-sky-850 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/50";
      case "osmosing":
        return "bg-emerald-100 text-emerald-850 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50";
      case "befuddling":
        return "bg-rose-100 text-rose-850 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50";
      default:
        return "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800";
    }
  };

  return (
    <motion.div
      onClick={() => onSelect(essay)}
      className={`cursor-pointer group flex flex-col p-5 rounded border text-left transition-all duration-300 relative overflow-hidden ${
        isSelected
          ? "bg-zinc-900 border-zinc-900 shadow-md text-zinc-100 dark:bg-[#1A1918] dark:border-zinc-800"
          : "bg-[#FCFAF7] border-black/10 hover:border-black/25 hover:bg-[#F4F1EC] text-[#1A1A1A] dark:bg-[#1E1D1C] dark:border-white/10 dark:hover:bg-[#252423] dark:text-[#E2DFDA]"
      }`}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Decorative Part Indicator Background Overlay */}
      <span className="absolute -right-3 -bottom-3 text-7xl font-serif font-bold opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity dark:text-white">
        {String(essay.part).padStart(2, "0")}
      </span>

      {/* Header Info */}
      <div className="flex justify-between items-start gap-4 mb-2.5">
        <span className={`text-[10px] font-mono tracking-wider uppercase font-bold ${isSelected ? "text-zinc-400" : "text-zinc-500"}`}>
          PART {String(essay.part).padStart(2, "0")}
        </span>
        <span className="text-[10px] font-mono text-zinc-450 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {essay.publishDate}
        </span>
      </div>

      {/* Title */}
      <h3 className={`font-serif text-lg font-bold leading-snug tracking-tight mb-2 ${
        isSelected ? "text-white" : "text-black dark:text-[#F5F2EF] group-hover:text-amber-800 dark:group-hover:text-amber-400"
      }`}>
        {essay.title}
      </h3>

      {/* Poetic description snippet */}
      <p className={`text-xs font-serif leading-relaxed mb-4 line-clamp-2 ${
        isSelected ? "text-zinc-300" : "text-zinc-650 dark:text-zinc-400"
      }`}>
        {essay.snippet}
      </p>

      {/* Footer Info Row */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-black/5 dark:border-white/5">
        <div className="flex items-center space-x-2">
          <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">Status:</span>
          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border ${getStatusBadgeStyle(essay.statusWord)}`}>
            {essay.statusWord || "—"}
          </span>
        </div>
        <span className={`text-xs font-mono flex items-center gap-0.5 transition-transform duration-300 group-hover:translate-x-1 ${
          isSelected ? "text-amber-400" : "text-zinc-500 group-hover:text-amber-800 dark:group-hover:text-amber-400"
        }`}>
          Read <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.div>
  );
}
