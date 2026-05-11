import { useAnimator } from '../context/AnimatorContext';

export function StatusBar() {
  const { history, lastSavedAt } = useAnimator();

  const getTimeSince = (timestamp: number | null): string => {
    if (!timestamp) return 'never';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <footer
      className="h-9 bg-[var(--c-bg-base)] border-t border-[var(--c-border-default)] px-5 flex items-center justify-between shrink-0"
      role="contentinfo"
      aria-label="Application status bar"
    >
      <div className="flex items-center gap-4">
        <span className="text-[var(--c-status-ok)] flex items-center gap-1.5 text-[11px] font-medium tracking-tight" aria-label="System status: stable">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-status-ok)]" aria-hidden="true" />
          Stable
        </span>
        <span className="text-[var(--c-text-muted)] font-mono text-[10px] bg-[var(--c-bg-panel)] px-2 py-0.5 rounded border border-[var(--c-border-default)]" aria-label="GPU usage 42%">
          GPU 42%
        </span>
        <span className="text-[var(--c-text-muted)] font-mono text-[10px] bg-[var(--c-bg-panel)] px-2 py-0.5 rounded border border-[var(--c-border-default)]" aria-label="VRAM usage 6.2 of 16 GB">
          VRAM 6.2 / 16 GB
        </span>
      </div>
      <div className="flex items-center gap-5 text-[var(--c-text-muted)] text-[10px] font-mono">
        <span>{history.present.name}</span>
        <span className="text-[var(--c-border-hover)]" aria-hidden="true">•</span>
        <span aria-live="polite">Saved {getTimeSince(lastSavedAt)}</span>
      </div>
    </footer>
  );
}
