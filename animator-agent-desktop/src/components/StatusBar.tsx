
interface StatusBarProps {
  projectName?: string;
  lastAutoSave?: string;
}

export function StatusBar({ projectName = 'Untitled Project', lastAutoSave = '2m ago' }: StatusBarProps) {
  return (
    <footer className="h-10 bg-[#09090b] border-t border-[#27272a] px-6 flex items-center justify-between text-[10px] shrink-0">
      <div className="flex gap-5">
        <span className="text-emerald-500 flex items-center gap-1.5 font-medium tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
          System Stable
        </span>
        <span className="text-zinc-500 font-mono bg-[#111113] px-2 py-0.5 rounded border border-[#27272a]">GPU: 42%</span>
        <span className="text-zinc-500 font-mono bg-[#111113] px-2 py-0.5 rounded border border-[#27272a]">VRAM: 6.2GB / 16GB</span>
      </div>
      <div className="flex gap-5 text-zinc-500 font-mono">
        <span>Project: {projectName}</span>
        <span>Auto-save: {lastAutoSave}</span>
      </div>
    </footer>
  );
}
