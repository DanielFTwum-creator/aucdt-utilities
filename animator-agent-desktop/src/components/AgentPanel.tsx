import { useState } from 'react';

export function AgentPanel() {
  const [instruction, setInstruction] = useState('');

  return (
    <div className="lg:col-span-4 lg:row-span-4 bg-[var(--c-bg-panel)] border border-[var(--c-border-default)] rounded-xl flex flex-col p-5 overflow-hidden">
      <div className="flex items-center gap-2 mb-5 shrink-0 pb-3 border-b border-[var(--c-border-default)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-accent-soft)]" />
        <span className="text-xs font-medium text-[var(--c-text-secondary)] tracking-[-0.01em]">Agent Instructions</span>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-[var(--c-bg-raised)] p-3 rounded border border-[var(--c-border-default)]">
          <div className="text-[10px] text-[var(--c-text-muted)] mb-1 font-mono">PROMPT</div>
          <p className="text-sm text-zinc-300">"Enhance the lighting on the central character and add a slow parallax drift to the background elements over 120 frames."</p>
        </div>
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3 text-xs text-[var(--c-text-secondary)]">
            <div className="w-2 h-2 rounded-full bg-[var(--c-status-ok)] shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            <span>Analyzing scene depth markers...</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--c-text-secondary)]">
            <div className="w-2 h-2 rounded-full bg-[var(--c-accent-mid)] shadow-[0_0_8px_rgba(90,133,255,0.5)]" />
            <span>Calculating spline interpolations...</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--c-text-secondary)]">
            <div className="w-2 h-2 rounded-full bg-[var(--c-accent-mid)]" />
            <span className="text-[var(--c-text-primary)]">Applying volumetric god-rays to L04...</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--c-text-muted)] opacity-50">
            <div className="w-2 h-2 rounded-full bg-[var(--c-border-default)]" />
            <span>Optimizing vertex cache...</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500 opacity-50">
            <div className="w-2 h-2 rounded-full bg-zinc-600" />
            <span>Syncing audio tracks...</span>
          </div>
        </div>
      </div>
      <div className="mt-4 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            className="w-full bg-[var(--c-bg-base)] border border-[var(--c-border-default)] rounded px-4 py-3 text-xs text-[var(--c-text-primary)] focus:outline-none focus:border-[var(--c-accent-mid)] focus:ring-1 focus:ring-[var(--c-accent-tint)] transition-colors"
            placeholder="Enter new animation instruction..."
          />
          <div className="absolute right-2 top-0 bottom-0 flex items-center">
            <div className="text-[10px] bg-[var(--c-bg-panel)] px-1.5 py-1 rounded text-[var(--c-text-muted)] font-mono tracking-wider">CMD+K</div>
          </div>
        </div>
      </div>
    </div>
  );
}
