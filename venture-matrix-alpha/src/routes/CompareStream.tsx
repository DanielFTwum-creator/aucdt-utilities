import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVenture } from '../context/VentureContext';
import { computeCompareSession } from '../lib/deltaAnalytics';
import { 
  ArrowLeft, 
  BarChart3, 
  Maximize2, 
  ChevronRight,
  TrendingUp,
  Triangle,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Venture } from '../types';
import DeltaSpread from '../components/DeltaSpread';

export default function CompareStream() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useVenture();
  
  const ids = searchParams.get('ids')?.split(',') || [];
  
  const ventureA = state.ventures.find(v => v.id === ids[0]);
  const ventureB = state.ventures.find(v => v.id === ids[1]);

  const session = useMemo(() => {
    if (ventureA && ventureB) {
      return computeCompareSession(ventureA, ventureB);
    }
    return null;
  }, [ventureA, ventureB]);

  if (!ventureA || !ventureB || !session) {
    return (
      <div className="min-h-screen bg-[#050a12] flex flex-col items-center justify-center space-y-8">
        <div className="w-20 h-20 bg-brand-cyan/5 border border-brand-cyan/20 flex items-center justify-center">
          <BarChart3 className="text-brand-cyan" size={40} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest">Comparison Context Corrupted</h2>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Insufficient Asset Handshake</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="px-10 py-4 bg-brand-cyan text-[#050a12] font-bold uppercase text-xs tracking-widest hover:bg-white transition-all"
        >
          Return to Matrix
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050a12] text-white selection:bg-brand-cyan/30">
      <div className="noise-overlay" />
      
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-[#050a12]/80 backdrop-blur-md border-b border-white/5 p-6 md:p-8 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-4 text-slate-500 hover:text-white transition-colors group"
        >
          <div className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-white transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.3em]">RESUME_MATRIX_VIEW</span>
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-brand-cyan mb-1">
             <BarChart3 size={14} />
             <span className="text-xs font-mono font-bold uppercase tracking-[0.4em]">DELTA_ANALYTICS_STREAM</span>
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tighter uppercase">HEAD_TO_HEAD <span className="text-slate-700">COMPARISON</span></h1>
        </div>

        <div className="w-10" /> {/* Spacer */}
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12 lg:p-20 space-y-24">
        {/* Side-by-Side Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a2d42]">
          <VenturePanel venture={ventureA} isDominant={session.dominantId === ventureA.id} />
          <VenturePanel venture={ventureB} isDominant={session.dominantId === ventureB.id} />
        </div>

        {/* Delta Spread Section */}
        <section className="bg-[#0c1520] border border-[#1a2d42] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-cyan" />
          
          <div className="flex flex-col md:flex-row gap-20 items-start">
             <div className="w-full md:w-1/3 space-y-6">
                <div className="flex items-center gap-3 text-brand-cyan">
                  <TrendingUp size={18} />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-[0.4em]">DELTA_SPREAD_LOG</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-display font-bold text-white uppercase tracking-tighter leading-tight">
                    {session.spread} Variance <span className="text-slate-700 uppercase">Detection</span>
                  </p>
                  <p className="text-xs font-mono text-slate-500 uppercase leading-relaxed italic">
                    Automated divergence analysis between selected asset vectors. High delta indices suggest significant risk/reward partition.
                  </p>
                </div>
                
                <div className="pt-8">
                   <div className={cn(
                     "inline-flex items-center gap-3 px-6 py-2 border font-mono text-xs font-bold uppercase tracking-widest",
                     session.spread === 'narrow' ? "bg-green-500/10 border-green-500/40 text-green-400" :
                     session.spread === 'moderate' ? "bg-amber-500/10 border-amber-500/40 text-amber-400" :
                     "bg-red-500/10 border-red-500/40 text-red-400"
                   )}>
                    Spread: {session.spread}
                   </div>
                </div>
             </div>

              <div className="flex-1 w-full space-y-16">
                 <DeltaSpread label="G_SCORE_DELTA" value={session.deltaG} max={100} color="var(--accent-green)" />
                 <DeltaSpread label="M_SCORE_DELTA" value={session.deltaM} max={100} color="var(--accent-cyan)" />
                 <DeltaSpread label="ROI_DELTA_PROJ" value={session.deltaROI} max={10} unit="x" color="white" />
              </div>
           </div>
        </section>

        {/* Strategic Invariant */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-8 py-20 border-t border-white/5">
           <Info className="text-slate-700" size={32} />
           <p className="text-xs font-mono text-slate-600 uppercase tracking-[0.2em] leading-loose">
             "The selection of {ventureA.name} vs {ventureB.name} reveals a {session.deltaROI.toFixed(1)}x ROI split. {session.dominantId === ventureA.id ? ventureA.name : ventureB.name} remains the high-conviction dominant asset in this pair."
           </p>
           <div className="flex items-center gap-4 text-[10px] font-mono text-slate-800 font-bold uppercase tracking-widest">
             <span className="border-b border-slate-800 pb-1 px-2">Computed_at: {new Date().toISOString().split('T')[1].slice(0, 8)}</span>
             <span className="border-b border-slate-800 pb-1 px-2">Verification: PASS</span>
           </div>
        </div>
      </main>

      <footer className="p-10 border-t border-white/5 relative z-10 flex flex-col md:flex-row justify-between items-center bg-[#050a12]">
         <div className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-6 md:mb-0">
           Proprietary Venture Stream v2.94 // alpha_node
         </div>
         <div className="flex gap-8">
            <span className="text-[10px] font-mono font-bold text-slate-700 hover:text-white cursor-pointer uppercase tracking-widest transition-colors">Methodology_Archive</span>
            <span className="text-[10px] font-mono font-bold text-slate-700 hover:text-white cursor-pointer uppercase tracking-widest transition-colors">Neural_Diagnostics</span>
         </div>
      </footer>
    </div>
  );
}

function VenturePanel({ venture, isDominant }: { venture: Venture, isDominant: boolean }) {
  return (
    <div className="bg-[#0c1520] p-12 md:p-16 space-y-12 relative group">
       {isDominant && (
         <div className="absolute top-8 right-8 flex items-center gap-2 px-4 py-1.5 bg-brand-cyan/10 border border-brand-cyan/40 text-brand-cyan text-xs font-mono font-bold uppercase tracking-widest">
           Dominant_Asset
         </div>
       )}

       <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">{venture.stage} // {venture.sector}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-widest uppercase leading-none">{venture.name}</h2>
          <p className="text-sm font-mono text-slate-500 leading-relaxed max-w-sm italic">“{venture.tagline}”</p>
       </div>

       <div className="grid grid-cols-2 gap-12 border-y border-white/5 py-12">
          <div className="space-y-4">
             <div className="flex justify-between items-end">
               <span className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">G_SCORE</span>
               <span className="text-2xl font-display font-bold text-brand-green">{venture.gScore}</span>
             </div>
             <div className="h-1 bg-white/5 overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${venture.gScore}%` }} className="h-full bg-brand-green" transition={{ duration: 1, ease: 'easeOut' }} />
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-end">
               <span className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">M_SCORE</span>
               <span className="text-2xl font-display font-bold text-brand-cyan">{venture.mScore}</span>
             </div>
             <div className="h-1 bg-white/5 overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${venture.mScore}%` }} className="h-full bg-brand-cyan" transition={{ duration: 1, ease: 'easeOut' }} />
             </div>
          </div>
       </div>

       <div className="flex items-center gap-6">
          <div className="space-y-1">
             <span className="block text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest">PROJECTED_ROI</span>
             <span className="text-3xl font-display font-bold text-white tracking-tighter">{venture.roiProjection}x</span>
          </div>
          <div className="space-y-1">
             <span className="block text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest">TEAM_SIZE</span>
             <span className="text-3xl font-display font-bold text-slate-400 tracking-tighter">{venture.teamSize}</span>
          </div>
       </div>
    </div>
  );
}
