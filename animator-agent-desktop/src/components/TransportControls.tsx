
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
      <div className="flex gap-2">
        <button onClick={onStop} className="w-6 h-6 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 transition-colors rounded text-xs" title="Stop">
          ⏹
        </button>
        <button onClick={isPlaying ? onPause : onPlay} className={`w-6 h-6 flex items-center justify-center transition-colors text-white rounded text-xs ${isPlaying ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.3)]'}`} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 border border-[#27272a] rounded overflow-hidden bg-[#18181b] p-0.5">
      <button
        onClick={onPlay}
        className={`w-8 h-7 flex items-center justify-center rounded-sm transition-colors text-xs ${isPlaying ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
        title="Play"
      >
        ▶
      </button>
      <button
        onClick={onPause}
        className={`w-8 h-7 flex items-center justify-center rounded-sm transition-colors text-xs ${!isPlaying ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
        title="Pause"
      >
        ⏸
      </button>
      <button
        onClick={onStop}
        className="w-8 h-7 flex items-center justify-center rounded-sm transition-colors text-xs text-zinc-500 hover:text-white hover:bg-zinc-800"
        title="Stop"
      >
        ⏹
      </button>
    </div>
  );
}
