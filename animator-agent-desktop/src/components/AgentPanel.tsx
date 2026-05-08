import { useState } from 'react';

export function AgentPanel() {
  const [instruction, setInstruction] = useState('');

  return (
    <div className="lg:col-span-4 lg:row-span-4 bg-[#111113] border border-[#27272a] rounded-xl flex flex-col p-5 overflow-hidden">
      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 shrink-0">Agent Logic & Instructions</div>
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-[#18181b] p-3 rounded border border-[#27272a]">
          <div className="text-[10px] text-indigo-400 mb-1 font-mono">USER PROMPT</div>
          <p className="text-sm text-zinc-300">"Enhance the lighting on the central character and add a slow parallax drift to the background elements over 120 frames."</p>
        </div>
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span>Analyzing scene depth markers...</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <span>Calculating spline interpolations...</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-white">Applying volumetric god-rays to L04...</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500 opacity-50">
            <div className="w-2 h-2 rounded-full bg-zinc-600" />
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
            className="w-full bg-[#09090b] border border-[#27272a] rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            placeholder="Enter new animation instruction..."
          />
          <div className="absolute right-2 top-0 bottom-0 flex items-center">
            <div className="text-[10px] bg-zinc-800 px-1.5 py-1 rounded text-zinc-400 font-mono tracking-wider">CMD+K</div>
          </div>
        </div>
      </div>
    </div>
  );
}
