import React, { useState, useEffect } from 'react';
import { Venture } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { BarChart3, Plus, ArrowUpRight, AlertTriangle, Loader2, Zap } from 'lucide-react';
import ScoreGauge from './ScoreGauge';
import { getStageColor } from '../lib/scoreCalculator';
import { summarizeRisks, summarizeOpportunities } from '../lib/gemini';

interface VentureCardProps {
  key?: string;
  venture: Venture;
  isTable: boolean;
  onBrief: () => void;
  isSelected: boolean;
  onCompare: () => void;
}

export default function VentureCard({ venture, isTable, onBrief, isSelected, onCompare }: VentureCardProps) {
  const [riskSummary, setRiskSummary] = useState<string | null>(null);
  const [oppSummary, setOppSummary] = useState<string | null>(null);
  const [loadingRisks, setLoadingRisks] = useState(false);
  const [loadingOpps, setLoadingOpps] = useState(false);
  const [showGDetails, setShowGDetails] = useState(false);

  useEffect(() => {
    async function fetchSummaries() {
      if (!riskSummary && !loadingRisks) {
        setLoadingRisks(true);
        summarizeRisks(venture.name, venture.keyRisks)
          .then(setRiskSummary)
          .catch(err => console.error('Failed to fetch risk summary:', err))
          .finally(() => setLoadingRisks(false));
      }
      
      if (!oppSummary && !loadingOpps) {
        setLoadingOpps(true);
        summarizeOpportunities(venture.name, venture.keyOpportunities)
          .then(setOppSummary)
          .catch(err => console.error('Failed to fetch opportunity summary:', err))
          .finally(() => setLoadingOpps(false));
      }
    }
    fetchSummaries();
  }, [venture.id]);

  return (
    <motion.div 
      layout
      className={cn(
        "group relative bg-[#0a1624] border border-[#1c3450] hover:border-[#2e5a80] transition-all cursor-default overflow-hidden rounded-sm",
        isTable ? "flex items-center p-6 gap-8" : "flex flex-col p-8 pt-10"
      )}
    >
       {!isTable && (
        <span className="absolute -right-4 -top-8 text-[112px] font-mono font-black text-[#e8f4ff] opacity-[0.06] pointer-events-none tracking-tighter transition-all group-hover:opacity-[0.08] select-none z-0">
          #{venture.id.split('-')[1]}
        </span>
      )}

      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-[2px] z-10 transition-all duration-300",
        isSelected ? "bg-brand-cyan" : "bg-brand-cyan/20 group-hover:bg-brand-cyan"
      )} />
      
      <div className={cn("flex-1 relative z-10", isTable && "flex items-center gap-10")}>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <span className={cn(
              "text-[10px] font-mono font-bold px-2 py-0.5 border uppercase tracking-widest rounded-[2px]",
              venture.stage === 'Pre-Seed' ? "bg-[#2a1650] text-[#b87fff] border-[#5a2fb0]" :
              venture.stage === 'Seed' ? "bg-[#0a2535] text-[#00d4ff] border-[#0077aa]" :
              venture.stage === 'Series A' ? "bg-[#2a1a00] text-[#ffb800] border-[#806000]" :
              venture.stage === 'Series B' ? "bg-[#0a2515] text-[#00e87a] border-[#006030]" :
              "bg-[#1a2030] text-[#e8f4ff] border-[#4a5a70]"
            )}>
              {venture.stage}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#0a1a28] text-[#8ab4d4] border border-[#1c3450] uppercase tracking-widest rounded-[2px]">
              {venture.sector}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-display font-bold text-[#e8f4ff] tracking-widest uppercase">{venture.name}</h3>
          <p className="text-xs font-mono text-[#8ab4d4] uppercase tracking-widest line-clamp-1 opacity-80">{venture.tagline}</p>
        </div>

        <div className={cn("mt-8 mb-8 grid grid-cols-2 gap-8", isTable && "mt-0 mb-0 w-80")}>
          <div onClick={() => setShowGDetails(!showGDetails)} className="cursor-pointer hover:opacity-80 transition-opacity">
            <ScoreGauge value={venture.gScore} label="G_SCORE" color="var(--score-g)" />
          </div>
          <ScoreGauge value={venture.mScore} label="M_SCORE" color="var(--score-m)" />
        </div>

        <AnimatePresence>
          {showGDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8 border-l-2 border-brand-green/30 pl-4 space-y-4 bg-brand-green/[0.02] py-2"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-brand-green uppercase tracking-widest opacity-80">Definition</span>
                <p className="text-xs font-mono text-[#8ab4d4] leading-relaxed">
                  Represents positive societal impact and alignment with sustainable development goals. Evaluates long-term stability and social infrastructure contribution.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-brand-green uppercase tracking-widest opacity-80">Impact_Assessment</span>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider border rounded-[2px]",
                    venture.gScore >= 90 ? "bg-[#0a2515] border-[#006030] text-[#00e87a]" :
                    venture.gScore >= 70 ? "bg-[#0a2515]/60 border-[#006030]/60 text-[#00e87a]/90" :
                    "bg-slate-500/10 border-slate-500/40 text-slate-400"
                  )}>
                    {venture.gScore >= 90 ? 'Transformative' : 
                     venture.gScore >= 70 ? 'High Impact' : 
                     venture.gScore >= 50 ? 'Moderate Impact' : 'Limited/Negative'}
                  </div>
                  <span className="text-[11px] font-mono text-[#4d7a9e] italic">
                    Level {Math.floor(venture.gScore / 10)} protocol clearance.
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={cn(
          "p-4 bg-[#1a0a0e] border border-[#3d1020] border-l-2 border-l-brand-red rounded-sm overflow-hidden mb-4",
          isTable && "h-full flex flex-col justify-center max-w-xs mb-0"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={10} className="text-brand-red" />
            <span className="text-[10px] font-mono font-bold text-brand-red uppercase tracking-widest whitespace-nowrap">AI_RISK_SURVEILLANCE</span>
          </div>
          <div className="min-h-[32px] flex items-center">
            {loadingRisks ? (
              <div className="flex items-center gap-2">
                <Loader2 size={10} className="text-[#8ab4d4] animate-spin" />
                <span className="text-[11px] font-mono text-[#8ab4d4] italic">Synthesizing threat vectors...</span>
              </div>
            ) : (
              <p className="text-xs font-mono text-[#c4607a] leading-relaxed italic">
                {riskSummary || "System idle. Risk data pending analysis."}
              </p>
            )}
          </div>
        </div>

        <div className={cn(
          "p-4 bg-[#071a14] border border-[#0d3525] border-l-2 border-l-brand-green rounded-sm overflow-hidden",
          isTable ? "h-full flex flex-col justify-center max-w-xs" : "mb-8"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={10} className="text-brand-green" />
            <span className="text-[10px] font-mono font-bold text-brand-green uppercase tracking-widest whitespace-nowrap">AI_OPPORTUNITY_MATRIX</span>
          </div>
          <div className="min-h-[32px] flex items-center">
            {loadingOpps ? (
              <div className="flex items-center gap-2">
                <Loader2 size={10} className="text-[#8ab4d4] animate-spin" />
                <span className="text-[11px] font-mono text-[#8ab4d4] italic">Mapping growth trajectories...</span>
              </div>
            ) : (
              <p className="text-xs font-mono text-[#4aaa78] leading-relaxed italic">
                {oppSummary || "System idle. Opportunity data pending scan."}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className={cn("flex items-center justify-between pt-6 border-t border-[#1c3450] relative z-10", isTable && "border-t-0 pt-0 ml-auto gap-6")}>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-display font-bold text-[#e8f4ff] leading-none">{venture.roiProjection}x</span>
          <span className="text-[10px] font-mono text-[#4d7a9e] uppercase tracking-widest font-bold">ROI_PROJ</span>
        </div>
        
        <div className="flex gap-2">
           <button 
            onClick={onCompare}
            className={cn(
              "p-3 border transition-all rounded-[2px]",
              isSelected ? "bg-brand-cyan border-brand-cyan text-[#03080f]" : "border-[#1c3450] text-[#4d7a9e] hover:text-[#e8f4ff] hover:border-brand-cyan hover:bg-brand-cyan/5"
            )}
          >
            {isSelected ? <BarChart3 size={14} /> : <Plus size={14} />}
          </button>
          <button 
            onClick={onBrief}
            className="px-4 py-2 bg-brand-cyan/10 border border-brand-cyan/40 text-brand-cyan font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-brand-cyan hover:text-[#03080f] transition-all flex items-center gap-2 rounded-[2px] shadow-[0_0_15px_rgba(0,212,255,0.1)]"
          >
            Briefing
            <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
