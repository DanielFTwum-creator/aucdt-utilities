import { CheckCircle2, ChevronRight } from "lucide-react";
import React from "react";
import { PHASES } from "../data/phases";

interface SidebarProps {
  activeId: string;
  completed: Record<string, boolean>;
  onSelect: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeId, completed, onSelect }) => {
  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface-alt)] flex flex-col shrink-0 h-full overflow-hidden">
      <div className="p-4 border-b border-[var(--border)]">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-dim)]">
          Workflow Navigation
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {PHASES.map((phase) => {
          const isActive = activeId === phase.id;
          const isDone = !!completed[phase.id];
          
          return (
            <button
              key={phase.id}
              onClick={() => onSelect(phase.id)}
              className={`w-full group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                isActive ? "bg-[var(--surface)] shadow-md border border-[var(--border)]" : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div 
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 transition-all duration-200 ${
                  isActive ? "scale-110 shadow-lg" : "grayscale opacity-50"
                }`}
                style={{ 
                  background: isActive ? phase.gradient : "transparent",
                  boxShadow: isActive ? `0 4px 12px ${phase.color}33` : "none"
                }}
              >
                {phase.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isActive ? "" : "text-[var(--text-dim)]"}`} style={{ color: isActive ? phase.color : undefined }}>
                  {phase.label}
                </div>
                <div className={`text-xs font-semibold truncate ${isActive ? "text-[var(--text)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-muted)]"}`}>
                  {phase.title}
                </div>
              </div>
              
              {isDone && <CheckCircle2 size={14} className="text-[var(--success)] shrink-0" />}
              {isActive && !isDone && <ChevronRight size={14} className="text-[var(--text-dim)] opacity-50 shrink-0" />}
            </button>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)] animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Live Environment</span>
        </div>
        <div className="text-[9px] text-[var(--text-dim)] font-mono uppercase tracking-tighter">
          ver: 1.0.0-PRO / stable
        </div>
      </div>
    </aside>
  );
};
