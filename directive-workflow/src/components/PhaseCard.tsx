import { CheckCircle, Copy } from "lucide-react";
import React from "react";
import type { Phase } from "../types";
import { Badge } from "./Badge";
import { DirectiveCode } from "./DirectiveCode";

interface PhaseCardProps {
  phase: Phase;
  isDone: boolean;
  onToggleDone: () => void;
  onCopy: () => void;
  copied: boolean;
}

export const PhaseCard: React.FC<PhaseCardProps> = ({ 
  phase, 
  isDone, 
  onToggleDone, 
  onCopy, 
  copied 
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--surface-alt)]/30">
      <div className="p-8 border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
        <div className="flex items-start gap-6 max-w-6xl mx-auto w-full">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-2xl"
            style={{ 
              background: phase.gradient,
              boxShadow: `0 12px 32px ${phase.color}44`
            }}
          >
            {phase.icon}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge label={phase.label} color={phase.color} />
              <Badge label={phase.tag} color={phase.color} />
            </div>
            <h2 className="text-2xl font-black text-[var(--text)] tracking-tight mb-1">{phase.title}</h2>
            <p className="text-sm text-[var(--text-muted)] font-medium">{phase.subtitle}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onToggleDone}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-bold text-xs transition-all duration-300 ${
                isDone 
                ? "bg-[var(--success)] shadow-lg shadow-emerald-500/20 text-white border-transparent" 
                : "bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-dim)]"
              }`}
            >
              {isDone ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-sm border-2 border-currentColor" />}
              {isDone ? "PHASE COMPLETE" : "MARK COMPLETE"}
            </button>
            
            <button
              onClick={onCopy}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white transition-all duration-300 shadow-xl ${
                copied ? "bg-[var(--success)]" : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:-translate-y-0.5"
              }`}
              style={{ 
                backgroundColor: copied ? undefined : phase.color,
                boxShadow: copied ? "0 10px 25px rgba(16, 185, 129, 0.4)" : `0 10px 25px ${phase.color}55`
              }}
            >
              <Copy size={14} />
              {copied ? "COPIED TO CLIPBOARD" : "COPY DIRECTIVE"}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto w-full">
          <DirectiveCode content={phase.content} color={phase.color} />
        </div>
      </div>
    </div>
  );
};
