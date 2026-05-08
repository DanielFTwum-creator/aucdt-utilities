
interface StatusBarProps {
  projectName?: string;
  lastAutoSave?: string;
}

export function StatusBar({ projectName = 'Studio_Intro_01', lastAutoSave = '2m ago' }: StatusBarProps) {
  return (
    <footer className="h-9 bg-[var(--c-bg-base)] border-t border-[var(--c-border-default)] px-5 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <span className="text-[var(--c-status-ok)] flex items-center gap-1.5 text-[11px] font-medium tracking-tight">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-status-ok)]" />
          Stable
        </span>
        <span className="text-[var(--c-text-muted)] font-mono text-[10px] bg-[var(--c-bg-panel)] px-2 py-0.5 rounded border border-[var(--c-border-default)]">
          GPU 42%
        </span>
        <span className="text-[var(--c-text-muted)] font-mono text-[10px] bg-[var(--c-bg-panel)] px-2 py-0.5 rounded border border-[var(--c-border-default)]">
          VRAM 6.2 / 16 GB
        </span>
      </div>
      <div className="flex items-center gap-5 text-[var(--c-text-muted)] text-[10px] font-mono">
        <span>{projectName}</span>
        <span className="text-[var(--c-border-hover)]">•</span>
        <span>Saved {lastAutoSave}</span>
      </div>
    </footer>
  );
}
