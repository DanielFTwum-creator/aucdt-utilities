import React from "react";
import { useTheme } from "../hooks/useTheme";

interface DirectiveCodeProps {
  content: string;
  color: string;
}

export const DirectiveCode: React.FC<DirectiveCodeProps> = ({ content, color }) => {
  const { theme } = useTheme();
  const lines = content.split("\n");

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[#08081a] shadow-2xl">
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#0e0e22] border-b border-[var(--border)] flex items-center px-4 gap-2 z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-4 text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-widest">
          directive_v1.txt — {lines.length} lines
        </span>
      </div>
      
      <div className="pt-10 overflow-hidden group">
        <pre className="p-6 font-mono text-[13px] leading-relaxed text-[var(--text)] whitespace-pre-wrap break-words max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar italic-brackets">
          {lines.map((line, i) => {
            const isChecked = line.trimStart().startsWith("✅");
            const isUnchecked = line.trimStart().startsWith("☐");
            const isHeader = line.startsWith("---") || 
              (line === line.toUpperCase() && line.trim().length > 4 && 
               !line.includes("☐") && !line.includes("✅"));
            
            return (
              <div 
                key={i} 
                className={`transition-colors duration-150 ${
                  isChecked ? "text-[var(--success)] font-medium" : 
                  isUnchecked ? "text-[var(--text-muted)]" : 
                  isHeader ? "font-bold tracking-wide" : ""
                }`}
                style={{ color: isHeader ? color : undefined }}
              >
                {line || "\u00A0"}
              </div>
            );
          })}
        </pre>
        
        <div className="absolute top-12 right-6 opacity-5 pointer-events-none select-none text-9xl font-black italic gold-shimmer">
          {theme === "highContrast" ? "" : "DIRECTIVE"}
        </div>
      </div>
    </div>
  );
};
