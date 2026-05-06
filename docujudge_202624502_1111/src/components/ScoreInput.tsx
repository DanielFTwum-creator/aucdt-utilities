import { Criterion } from '@/constants';

interface ScoreInputProps {
  criterion: Criterion;
  value: number;
  onChange: (val: number) => void;
}

export default function ScoreInput({ criterion, value, onChange }: ScoreInputProps) {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-end mb-2">
        <label className="font-label text-[9px] tracking-[3px] text-text-label uppercase">
          {criterion.label}
        </label>
        <span className="font-label text-[9px] text-text-label uppercase tracking-widest">
          MAX {criterion.maxScore}
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Large Number Input */}
        <div className="relative">
          <input
            type="number"
            min="0"
            max={criterion.maxScore}
            value={value}
            onChange={(e) => {
              const val = Math.min(Math.max(0, Number(e.target.value)), criterion.maxScore);
              onChange(val);
            }}
            className="w-16 bg-transparent border-b border-gray-400 font-label text-2xl font-bold text-black focus:border-accent-red focus:outline-none text-center p-0 m-0"
          />
        </div>

        {/* Brutalist Slider */}
        <div className="flex-1 relative h-6 flex items-center">
          {/* Track */}
          <div className="absolute w-full h-2 bg-gray-300"></div>
          
          {/* Fill */}
          <div 
            className="absolute h-2 bg-accent-red transition-all duration-100 ease-out"
            style={{ width: `${(value / criterion.maxScore) * 100}%` }}
          ></div>
          
          {/* Thumb (Invisible native input on top) */}
          <input
            type="range"
            min="0"
            max={criterion.maxScore}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
          />
          
          {/* Visual Thumb */}
          <div 
            className="absolute w-4 h-4 bg-white border-2 border-accent-red rounded-full pointer-events-none transition-all duration-100 ease-out shadow-sm"
            style={{ 
              left: `calc(${(value / criterion.maxScore) * 100}% - 8px)` 
            }}
          ></div>
        </div>
      </div>
      
      {criterion.description && (
        <p className="text-xs font-mono text-gray-500 mt-2 leading-tight">
          {criterion.description}
        </p>
      )}
    </div>
  );
}
