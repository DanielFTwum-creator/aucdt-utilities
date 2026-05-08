
interface TransportControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  variant?: 'compact' | 'standard';
}

export function TransportControls({ isPlaying, onPlay, onPause, onStop, variant = 'standard' }: TransportControlsProps) {
  if (variant === 'compact') {
    return (
      <div className="flex gap-2" role="toolbar" aria-label="Playback controls">
        <button
          type="button"
          onClick={onStop}
          className="w-6 h-6 flex items-center justify-center bg-[var(--c-border-default)] hover:bg-[var(--c-border-hover)] transition-colors rounded text-xs text-[var(--c-text-primary)]"
          title="Stop playback"
          aria-label="Stop playback"
        >
          ⏹
        </button>
        <button
          type="button"
          onClick={isPlaying ? onPause : onPlay}
          className={`w-6 h-6 flex items-center justify-center transition-colors text-white rounded text-xs ${isPlaying ? 'bg-[var(--c-border-hover)] hover:bg-[var(--c-border-default)]' : 'bg-[var(--c-accent-strong)] hover:bg-[var(--c-accent-mid)] shadow-[0_0_10px_var(--c-accent-glow)]'}`}
          title={isPlaying ? 'Pause playback' : 'Play animation'}
          aria-label={isPlaying ? 'Pause playback' : 'Play animation'}
          aria-pressed={isPlaying}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 border border-[var(--c-border-default)] rounded-md bg-[var(--c-bg-raised)] p-0.5" role="toolbar" aria-label="Playback controls">
      <button
        type="button"
        onClick={onPlay}
        className={`w-8 h-7 flex items-center justify-center rounded-sm transition-colors text-xs ${isPlaying ? 'bg-[var(--c-accent-strong)] text-white shadow-sm' : 'text-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] hover:bg-[var(--c-border-default)]'}`}
        title="Play animation"
        aria-label="Play animation"
        aria-pressed={isPlaying}
      >
        ▶
      </button>
      <button
        type="button"
        onClick={onPause}
        className={`w-8 h-7 flex items-center justify-center rounded-sm transition-colors text-xs ${!isPlaying ? 'bg-[var(--c-border-hover)] text-white' : 'text-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] hover:bg-[var(--c-border-default)]'}`}
        title="Pause playback"
        aria-label="Pause playback"
      >
        ⏸
      </button>
      <button
        type="button"
        onClick={onStop}
        className="w-8 h-7 flex items-center justify-center rounded-sm transition-colors text-xs text-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] hover:bg-[var(--c-border-default)]"
        title="Stop and reset"
        aria-label="Stop and reset playback"
      >
        ⏹
      </button>
    </div>
  );
}
