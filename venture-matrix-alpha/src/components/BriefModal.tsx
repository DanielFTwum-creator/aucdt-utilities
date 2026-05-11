import React, { useState, useEffect } from 'react';
import { Venture, Brief } from '../types';
import { generateBrief } from '../lib/gemini';
import { useVenture } from '../context/VentureContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, AlertTriangle, CheckCircle, FileText, Loader2, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAdminAuth } from '../context/AdminContext';

interface BriefModalProps {
  venture: Venture | null;
  onClose: () => void;
}

export default function BriefModal({ venture, onClose }: BriefModalProps) {
  const { state, dispatch } = useVenture();
  const { incrementApiCount } = useAdminAuth();
  const [localLoading, setLocalLoading] = useState(false);

  const fetchBrief = async () => {
    if (!venture) return;
    
    setLocalLoading(true);
    dispatch({ type: 'SET_BRIEF_LOADING', payload: { id: venture.id, loading: true } });
    dispatch({ type: 'SET_BRIEF_ERROR', payload: { id: venture.id, error: null } });

    try {
      const brief = await generateBrief(venture);
      dispatch({ type: 'SET_BRIEF_SUCCESS', payload: { id: venture.id, brief } });
      incrementApiCount();
    } catch (err: any) {
      dispatch({ type: 'SET_BRIEF_ERROR', payload: { id: venture.id, error: err.message } });
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    if (venture && !state.briefCache[venture.id]) {
      fetchBrief();
    }
  }, [venture]);

  if (!venture) return null;

  const brief = state.briefCache[venture.id];
  const loading = state.briefLoading[venture.id] || localLoading;
  const error = state.briefError[venture.id];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#050a12]/95 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0a1624] border border-[#1c3450] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-cyan shadow-[0_0_15px_rgba(0,212,255,0.5)]" />
          
          <header className="p-8 pb-6 border-b border-white/5 flex justify-between items-start bg-gradient-to-b from-brand-cyan/[0.03] to-transparent">
            <div className="space-y-1">
              <div className="flex items-center gap-3 text-brand-cyan">
                <Cpu size={14} className="animate-pulse" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.4em]">NEURAL_SYNTHESIS // V.X102</span>
              </div>
              <h2 className="text-4xl font-display font-bold text-[#e8f4ff] tracking-[0.1em] uppercase">{venture.name}</h2>
              <p className="text-xs font-mono text-[#4d7a9e] uppercase tracking-widest opacity-60">Structural Strategic Evaluation</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-600 hover:text-white transition-colors hover:bg-white/5 rounded-sm">
              <X size={20} />
            </button>
          </header>

          <div className="p-10 min-h-[400px] max-h-[70vh] overflow-y-auto custom-scrollbar relative">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.05),transparent_70%)]" />
            
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-8 relative">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-brand-cyan/20 rounded-full" />
                  <motion.div 
                    className="absolute inset-0 border-4 border-t-brand-cyan rounded-full shadow-[0_0_20px_rgba(0,212,255,0.4)]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-2 border border-brand-cyan/10 rounded-full animate-pulse" />
                </div>
                <div className="space-y-2 text-center relative">
                   <p className="text-base font-mono font-bold text-brand-cyan uppercase tracking-[0.2em] animate-pulse">Running Backpropagation Override...</p>
                   <p className="text-[11px] font-mono text-slate-400 uppercase tracking-[0.1em] opacity-60">Consulting Gemini Neural Network</p>
                </div>
              </div>
            ) : error ? (
              <div className="py-20 flex flex-col items-center gap-6 text-center">
                <div className="w-16 h-16 bg-brand-red/5 border border-brand-red/20 flex items-center justify-center">
                  <AlertTriangle className="text-brand-red" size={32} />
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-mono font-bold text-brand-red uppercase">{error}</p>
                  <button 
                    onClick={fetchBrief}
                    className="flex items-center gap-2 mx-auto px-6 py-3 border border-brand-red/40 text-brand-red text-[10px] font-mono font-bold uppercase hover:bg-brand-red hover:text-white transition-all"
                  >
                    <RefreshCcw size={14} />
                    Retry Linkage
                  </button>
                </div>
              </div>
            ) : brief ? (
              <div className="space-y-12">
                <div className="border-l-2 border-brand-cyan pl-8 py-2">
                  <h3 className="text-2xl font-display font-bold text-white tracking-tight mb-2 italic">“{brief.headline}”</h3>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[11px] font-mono font-bold uppercase">Confidence: {(brief.confidenceScore * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-10">
                   <section className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <FileText size={14} />
                      <h4 className="text-xs font-mono font-bold uppercase tracking-widest">Executive Summary</h4>
                    </div>
                    <p className="text-base font-mono text-white leading-loose italic">{brief.executiveSummary}</p>
                   </section>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <section className="space-y-4">
                        <div className="flex items-center gap-3 text-brand-amber">
                          <AlertTriangle size={14} />
                          <h4 className="text-xs font-mono font-bold uppercase tracking-widest">Risk Assessment</h4>
                        </div>
                        <p className="text-sm font-mono text-slate-200 leading-relaxed italic border-l border-brand-amber/20 pl-4">{brief.riskAssessment}</p>
                      </section>

                      <section className="space-y-4">
                        <div className="flex items-center gap-3 text-brand-mint">
                          <CheckCircle size={14} />
                          <h4 className="text-xs font-mono font-bold uppercase tracking-widest">Recommendation</h4>
                        </div>
                        <p className="text-sm font-mono text-slate-200 leading-relaxed italic border-l border-brand-mint/20 pl-4">{brief.strategicRecommendation}</p>
                      </section>
                   </div>
                </div>
              </div>
            ) : null}
          </div>

          <footer className="p-8 border-t border-white/5 flex justify-between items-center bg-[#03080f]/50">
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <span className="text-[11px] font-mono text-[#4d7a9e] uppercase">Sector:</span>
                 <span className="text-[11px] font-mono font-bold text-[#e8f4ff] uppercase">{venture.sector}</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="text-[11px] font-mono text-[#4d7a9e] uppercase">Stage:</span>
                 <span className="text-[11px] font-mono font-bold text-[#e8f4ff] uppercase">{venture.stage}</span>
               </div>
             </div>
             <p className="text-[10px] font-mono text-[#2a5070] uppercase">Output generated at: {brief?.generatedAt ? new Date(brief.generatedAt).toLocaleTimeString() : 'N/A'}</p>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
