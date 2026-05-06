
import React from 'react';

interface Props {
  total: number;
  completed: number;
  colorClass: string;
  markerLabel?: string;
  secondaryMarker?: number;
}

const ProgressBar: React.FC<Props> = ({ total, completed, colorClass, markerLabel, secondaryMarker }) => {
  const tiles = 50; // Use a fixed number of visual tiles for the bar
  const progressRatio = completed / (total || 1);
  const secondaryRatio = secondaryMarker ? secondaryMarker / total : null;
  const completedTiles = Math.floor(tiles * progressRatio);

  return (
    <div className="relative pt-6 pb-2 print:pb-0">
      {/* Dynamic Marker */}
      <div 
        className="absolute top-0 transition-all duration-500 ease-out print:hidden"
        style={{ left: `${Math.min(progressRatio * 100, 100)}%`, transform: 'translateX(-50%)' }}
      >
        <div className="flex flex-col items-center">
          <div className="px-2 py-0.5 bg-amber-500 rounded text-[9px] font-black text-black whitespace-nowrap mb-1 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-black"></span>
            NOW • {markerLabel}
          </div>
          <div className="w-px h-6 bg-amber-500/50"></div>
        </div>
      </div>

      {/* The Bar */}
      <div className="flex gap-1 h-8 bg-slate-900/80 rounded-lg p-1 border border-white/5 overflow-hidden print:bg-slate-100 print:border-slate-300 print:h-6">
        {Array.from({ length: tiles }).map((_, i) => {
          const isFilled = i < completedTiles;
          const isSecondary = secondaryMarker && i === Math.floor(tiles * (secondaryRatio || 0));

          return (
            <div 
              key={i}
              style={{ transitionDelay: `${i * 10}ms` }}
              className={`flex-1 rounded-sm transition-all duration-700 ${
                isFilled ? (colorClass + ' print:bg-slate-900') : 'bg-slate-800/40 print:bg-slate-200'
              } ${isSecondary ? 'border-l-2 border-red-500/50 relative overflow-visible print:border-slate-400' : ''}`}
            >
              {isSecondary && (
                <div className="absolute -top-8 left-0 text-[8px] text-red-500 whitespace-nowrap font-bold uppercase opacity-60 print:hidden">
                  Target: Day {secondaryMarker}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
