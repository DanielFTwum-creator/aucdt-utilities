import { ClaudiaScene } from './ClaudiaScene';

interface PreviewPanelProps {
  frame: number;
}

export function PreviewPanel({ frame }: PreviewPanelProps) {
  return (
    <div className="lg:col-span-8 lg:row-span-4 bg-[#111113] border border-[#27272a] rounded-xl relative flex items-center justify-center overflow-hidden min-h-[300px]">
      <div className="absolute top-4 left-4 flex gap-2 z-50">
        <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-full text-[10px] text-white border border-white/10 uppercase tracking-wider">4K Preview</div>
        <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] border border-emerald-500/20 uppercase tracking-wider">Active Loop</div>
      </div>

      <div className="absolute inset-2 border-2 border-indigo-500/10 rounded-lg overflow-hidden isolate">
        <ClaudiaScene />
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-[60%] border-x-2 border-indigo-500/0 flex flex-col items-center justify-center relative pointer-events-none z-40">
        <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-indigo-500/50 mix-blend-screen" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-indigo-500/50 mix-blend-screen" />
      </div>

      <div className="absolute bottom-4 left-4 z-50">
        <div className="text-zinc-500 font-mono text-sm bg-black/40 px-2 py-1 rounded backdrop-blur">[RENDERING_FRAME_{frame}]</div>
        <div className="mt-4 flex gap-1 items-end pl-2">
          <div className="w-1 bg-indigo-500 h-8 opacity-60" />
          <div className="w-1 bg-indigo-500 h-12" />
          <div className="w-1 bg-indigo-500 h-6 opacity-80" />
          <div className="w-1 bg-indigo-500 h-16 text-xs text-white pl-2 leading-none">SYNC</div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-4 text-[10px] font-mono text-zinc-500 bg-black/40 px-3 py-1 rounded-full backdrop-blur z-50 shadow text-shadow">
        <span>FPS: 24.0</span>
        <span>DUR: 00:12:04</span>
        <span>RES: 3840x2160</span>
      </div>
    </div>
  );
}
