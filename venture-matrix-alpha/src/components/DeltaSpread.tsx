import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface DeltaRowProps {
  label: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
}

export default function DeltaSpread({ label, value, max, color, unit = '' }: DeltaRowProps) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="space-y-4 group">
       <div className="flex justify-between items-end">
          <div className="flex items-center gap-3">
             <div className={cn("w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-150", value >= 0 ? "bg-brand-cyan" : "bg-red-500")} />
             <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest transition-colors group-hover:text-slate-300">{label}</span>
          </div>
          <span className="text-xl font-display font-bold text-white tracking-widest">
            {value > 0 ? '+' : ''}{value}{unit}
          </span>
       </div>
       
       <div className="relative h-[2px] bg-white/5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-white/10 rounded-full flex items-center justify-center">
             <div className="w-1 h-1 bg-white/20 rounded-full" />
          </div>
          
          <div className="absolute top-0 bottom-0 left-1/2 transition-all duration-1000 ease-out" 
               style={{ 
                 left: value >= 0 ? '50%' : `${50 + percentage / 2}%`,
                 width: `${Math.abs(percentage / 2)}%`,
                 backgroundColor: color,
                 boxShadow: `0 0 10px ${color}`
               }} 
          />
       </div>
    </div>
  );
}
