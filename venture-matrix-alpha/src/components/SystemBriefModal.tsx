import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Cpu, Info, Shield, Target } from 'lucide-react';

interface SystemBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SystemBriefModal({ isOpen, onClose }: SystemBriefModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#03080f]/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a1624] border border-[#1c3450] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-cyan shadow-[0_0_15px_rgba(0,212,255,0.5)]" />
            
            <div className="p-8 border-b border-white/5 flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-3 text-brand-cyan">
                  <Cpu size={14} className="animate-pulse" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.4em]">SYSTEM_MANIFEST // EXEC_SUMMARY</span>
                </div>
                <h2 className="text-4xl font-display font-bold text-[#e8f4ff] tracking-[0.1em] uppercase">Venture Matrix Alpha</h2>
                <p className="text-xs font-mono text-[#4d7a9e] uppercase tracking-widest opacity-60">The Global Liquidity & Impact Engine</p>
              </div>
              <button onClick={onClose} className="p-2 text-slate-600 hover:text-white transition-colors hover:bg-white/5 rounded-sm">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-10">
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-brand-cyan">
                  <Info size={16} />
                  <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-[#e8f4ff]">Concept Overview</h3>
                </div>
                <div className="text-base font-mono text-[#8ab4d4] leading-relaxed space-y-4">
                  <p>
                    Venture Matrix Alpha is a next-generation neural strategic dashboard designed for high-conviction capital allocation across global advancement sectors.
                  </p>
                  <p>
                    By synthesizing multivariate data streams including market sentiment, technological readiness, and societal impact vectors, the system provides a 360-degree tactical view of the venture landscape.
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-4 border-l border-brand-cyan/20 pl-4">
                  <div className="flex items-center gap-3 text-brand-cyan">
                    <Target size={16} />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#e8f4ff]">Core Metrics</h3>
                  </div>
                  <ul className="text-xs font-mono text-[#8ab4d4] space-y-3">
                    <li><strong className="text-white">G_SCORE:</strong> Global Impact Index (Sustainability & Social Infrastructure contribution).</li>
                    <li><strong className="text-white">M_SCORE:</strong> Market Readiness Index (Commercial viability & scalability).</li>
                    <li><strong className="text-white">ROI_PROJ:</strong> 5-year projected returns based on backpropagated market models.</li>
                  </ul>
                </section>

                <section className="space-y-4 border-l border-brand-red/20 pl-4">
                  <div className="flex items-center gap-3 text-brand-red">
                    <Shield size={16} />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#e8f4ff]">Risk Surveillance</h3>
                  </div>
                  <p className="text-xs font-mono text-[#c4607a] leading-relaxed">
                    Integrated AI-driven threat detection monitoring for technological obsolescence, regulatory headwinds, and structural fragilities within early-stage ventures.
                  </p>
                </section>
              </div>

              <section className="bg-brand-cyan/5 border border-brand-cyan/10 p-6">
                <p className="text-xs font-mono text-[#4d7a9e] leading-relaxed italic">
                  "This platform serves as the bridge between raw financial data and sovereign strategic intent."
                </p>
              </section>
            </div>

            <footer className="p-8 border-t border-white/5 flex justify-between items-center bg-[#03080f]/50">
               <span className="text-[10px] font-mono text-[#4d7a9e] uppercase">System Version α.2.9.4 // Active Deployment</span>
               <p className="text-[10px] font-mono text-[#2a5070] uppercase">Authorized Access Only</p>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
