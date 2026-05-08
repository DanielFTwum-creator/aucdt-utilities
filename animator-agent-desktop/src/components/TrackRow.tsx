import { memo } from 'react';
import type { Track } from '../types/animation';

interface TrackRowProps {
  track: Track;
  index: number;
  onKeyframeToggle: (trackIdx: number, segIdx: number, keyIdx: number) => void;
}

export const TrackRow = memo(function TrackRow({ track, index, onKeyframeToggle }: TrackRowProps) {
  return (
    <div className="flex items-center text-[10px] gap-3 group px-1">
      <span className="w-24 text-zinc-500 group-hover:text-zinc-300 font-mono transition-colors">{track.name}</span>
      <div className="flex-1 h-5 bg-[#09090b] border border-[#27272a] rounded relative overflow-hidden group-hover:border-[#3f3f46] transition-colors">
        {track.segments.map((seg, j) => (
          <div key={j} style={{ left: `${seg.left}%`, width: `${seg.width}%` }} className={`absolute h-full bg-zinc-800 border-x border-zinc-600`}>
            <div className={`absolute inset-0 ${track.bg}`} />
            {seg.keys.map((k, idx) => (
              <div
                key={idx}
                onClick={() => onKeyframeToggle(index, j, idx)}
                style={{ left: `${k.pos}%` }}
                className={`absolute top-[4px] w-1.5 h-3 cursor-pointer rounded-sm hover:scale-125 transition-all ${k.enabled ? 'bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]' : 'bg-transparent border border-zinc-500'}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});
