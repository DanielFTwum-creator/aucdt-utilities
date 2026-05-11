import React from 'react';

export default function ScoreGauge({ value, label, color }: { value: number, label: string, color: string }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex items-center gap-4 group/gauge">
      <div className="relative w-12 h-12">
        <svg className="w-full h-full -rotate-90">
          <circle cx="24" cy="24" r={radius} className="fill-none stroke-white/5" strokeWidth="4" />
          <circle 
            cx="24" cy="24" r={radius} 
            className="fill-none transition-all duration-1000 ease-out" 
            strokeWidth="4" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset}
            stroke={color}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-mono font-bold text-white">{value}</span>
      </div>
      <div className="space-y-0.5">
        <span className="block text-[10px] font-mono font-bold text-[#4d7a9e] uppercase tracking-widest group-hover/gauge:text-[#8ab4d4] transition-colors">{label}</span>
      </div>
    </div>
  );
}
