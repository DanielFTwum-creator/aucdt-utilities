import { useState, useEffect, useRef } from 'react';
import type { Track } from '../types/animation';
import { TransportControls } from './TransportControls';
import { TrackRow } from './TrackRow';

interface TimelinePanelProps {
  tracks: Track[];
  onKeyframeToggle: (trackIdx: number, segIdx: number, keyIdx: number) => void;
}

export function TimelinePanel({ tracks, onKeyframeToggle }: TimelinePanelProps) {
  const [, setFrame] = useState(0);
  const [playheadPos, setPlayheadPos] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const stopPlayback = () => {
    setIsPlaying(false);
    setPlayheadPos(0);
    setFrame(0);
  };

  useEffect(() => {
    if (!isScrubbing && isPlaying) {
      const interval = setInterval(() => {
        setFrame((f) => f + 1);
        setPlayheadPos((p) => (p + 0.1) % 100);
      }, 1000 / 24);
      return () => clearInterval(interval);
    }
  }, [isScrubbing, isPlaying]);

  const handleTimelineMouseDown = (e: React.MouseEvent) => {
    setIsScrubbing(true);
    updatePlayhead(e);
  };

  const updatePlayhead = (e: MouseEvent | React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      let newPos = ((e.clientX - rect.left) / rect.width) * 100;
      newPos = Math.max(0, Math.min(100, newPos));
      setPlayheadPos(newPos);
      setFrame(Math.floor(newPos * 6));
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isScrubbing) {
        updatePlayhead(e);
      }
    };
    const handleMouseUp = () => {
      setIsScrubbing(false);
    };

    if (isScrubbing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScrubbing]);

  return (
    <div className="lg:col-span-12 lg:row-span-2 bg-[var(--c-bg-panel)] border border-[var(--c-border-default)] rounded-xl flex flex-col p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-3 shrink-0">
        <div className="flex items-center gap-6">
          <TransportControls variant="compact" isPlaying={isPlaying} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onStop={stopPlayback} />
          <div className="text-xs font-mono text-[var(--c-accent-soft)] bg-[var(--c-accent-tint)] px-2.5 py-1 rounded-md border border-[var(--c-border-default)]">
            00:04:12 / 00:10:00
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1.5 bg-[var(--c-bg-raised)] hover:text-[var(--c-text-primary)] cursor-pointer transition-colors rounded text-[10px] font-medium text-[var(--c-text-secondary)]">
            Curve Editor
          </div>
          <div className="px-3 py-1.5 bg-[var(--c-accent-strong)] rounded text-[10px] font-medium text-white">
            Keyframes
          </div>
        </div>
      </div>

      <div
        className="flex-1 border-t border-[var(--c-border-default)] pt-3 relative flex flex-col gap-2 overflow-y-auto overflow-x-hidden min-h-0 custom-scrollbar cursor-ew-resize"
        ref={timelineRef}
        onMouseDown={handleTimelineMouseDown}
      >
        {/* Playhead */}
        <div className="absolute top-0 bottom-0 w-px bg-[var(--c-accent-mid)] z-10 pointer-events-none" style={{ left: `${playheadPos}%`, boxShadow: '0 0 6px var(--c-accent-glow)' }}>
          <div className="w-2 h-2 bg-[var(--c-accent-soft)] rounded-sm -ml-[3.5px] -mt-0 shadow-[0_0_8px_var(--c-accent-glow)]" />
        </div>

        {/* Tracks */}
        {tracks.map((track, i) => (
          <TrackRow key={track.id} track={track} index={i} onKeyframeToggle={onKeyframeToggle} />
        ))}

        {/* Timeline ticks */}
        <div className="mt-auto flex items-end justify-between px-28 font-mono text-[9px] text-zinc-600 pb-1">
          <span>0f</span>
          <span>100f</span>
          <span>200f</span>
          <span>300f</span>
          <span>400f</span>
          <span>500f</span>
          <span>600f</span>
        </div>
      </div>
    </div>
  );
}
