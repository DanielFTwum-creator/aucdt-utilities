import React from "react";

interface TopBarProps {
  doneCount: number;
  total: number;
}

export const TopBar: React.FC<TopBarProps> = ({ doneCount, total }) => {
  const percentage = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return (
    <header className="h-16 px-6 flex items-center gap-4 bg-[var(--surface)] border-b border-[var(--border)] shrink-0 shadow-sm relative z-10">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
        🤖
      </div>
      <div className="flex-1">
        <h1 className="text-sm font-bold tracking-tight">AI Studio Directive Workflow</h1>
        <p className="text-[11px] text-[var(--text-muted)]">Sequential precision directives</p>
      </div>
      
      <div className="w-48 text-right hidden sm:block">
        <div className="flex justify-between items-center mb-1.5 px-1">
          <span className="text-[10px] uppercase font-bold text-[var(--text-dim)] tracking-wider">Progress</span>
          <span className="text-[10px] font-bold text-[var(--success)]">{doneCount}/{total} PHASES</span>
        </div>
        <div className="h-1.5 w-full bg-[var(--surface-alt)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </header>
  );
};
