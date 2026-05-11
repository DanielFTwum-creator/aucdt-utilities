import React from "react";
import { 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Target 
} from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="mb-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-accent uppercase">
            <MapPin className="h-3 w-3" />
            Oyibi, Greater Accra · TUCHQ-2026
          </div>
          <h1 className="font-serif text-4xl leading-tight text-text md:text-5xl">
            July 2026 <span className="text-accent italic">Enrollment Plan</span>
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-text-muted">
            <Calendar className="h-4 w-4 text-accent" />
            May 11 — July 7
          </div>
          <div className="flex items-center gap-2 rounded-full border border-teal-border bg-teal-bg px-4 py-2 text-xs font-medium text-teal-text">
            <TrendingUp className="h-4 w-4" />
            Conversion Priority
          </div>
          <div className="flex items-center gap-2 rounded-full border border-amber-border bg-amber-bg px-4 py-2 text-xs font-medium text-amber-text">
            <Target className="h-4 w-4" />
            Target: 40%
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-2 border-t border-border pt-6">
        <div className="h-2 w-2 rounded-full bg-green animate-pulse" />
        <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">System Status: Nominal</span>
      </div>
    </header>
  );
};
