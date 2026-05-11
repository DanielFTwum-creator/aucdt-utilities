import React, { useState } from 'react';
import { useVenture } from '../context/VentureContext';
import { useVentureFilter } from '../hooks/useVentureFilter';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon,
  Zap,
  BarChart3,
  FileText,
  SortAsc,
  SortDesc,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Venture, VentureSector, VentureStage } from '../types';
import { useNavigate } from 'react-router-dom';
import BriefModal from '../components/BriefModal';
import SystemBriefModal from '../components/SystemBriefModal';
import VentureCard from '../components/VentureCard';

export default function MatrixView() {
  const { state, dispatch } = useVenture();
  const { filteredVentures } = useVentureFilter();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSystemBriefOpen, setIsSystemBriefOpen] = useState(false);
  const [selectedVentureForBrief, setSelectedVentureForBrief] = useState<Venture | null>(null);
  const navigate = useNavigate();

  const handleCompareToggle = (id: string) => {
    dispatch({ type: 'TOGGLE_COMPARE', payload: id });
  };

  const openComparison = () => {
    if (state.selectedForCompare.length === 2) {
      navigate(`/compare?ids=${state.selectedForCompare.join(',')}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#03080f] text-[#e8f4ff] p-6 md:p-10 lg:p-14 selection:bg-brand-cyan/30">
      <div className="noise-overlay" />
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-brand-cyan">
            <Zap size={14} className="animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.4em]">NODE_ALPHA // MATRIX_COMMAND</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.8] text-[#e8f4ff]">
            VENTURE <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#e8f4ff]/40 to-[#e8f4ff]/10" style={{ WebkitTextStroke: '1px rgba(232, 244, 255, 0.1)' }}>MATRIX</span>
          </h1>
          <p className="text-[#8ab4d4] max-w-xl text-xs font-mono uppercase tracking-[0.2em] leading-relaxed">
            Multivariate risk/reward synthesis balancing commercial liquidity against sovereign societal advancement vectors.
          </p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setIsSystemBriefOpen(true)}
            className="bg-[#0a1624] border border-[#1c3450] p-5 min-w-[60px] flex items-center justify-center text-[#4d7a9e] hover:text-brand-cyan hover:border-brand-cyan transition-all group"
            title="System Executive Summary"
          >
            <FileText size={24} className="group-hover:scale-110 transition-transform" />
          </button>
          <div className="bg-[#0a1624] border border-[#1c3450] p-5 min-w-[140px] space-y-1">
            <span className="block text-[10px] font-mono font-bold text-[#4d7a9e] uppercase tracking-widest">ASSETS_MAPPED</span>
            <span className="text-3xl font-display font-bold text-white tracking-tighter">{filteredVentures.length}</span>
          </div>
          <div className="bg-[#0a1624] border border-[#1c3450] p-5 min-w-[140px] space-y-1">
            <span className="block text-[10px] font-mono font-bold text-[#4d7a9e] uppercase tracking-widest">SYSTEM_VERSION</span>
            <span className="text-3xl font-display font-bold text-brand-cyan tracking-tighter">α.2.9</span>
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <section className="sticky top-10 z-30 mb-12 flex flex-col md:flex-row gap-4 relative">
        <div className="flex-1 group relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4d7a9e] group-focus-within:text-brand-cyan transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="FILTER BY NEURAL_SIGNATURE..."
            className="w-full bg-[#0a1624] border border-[#1c3450] py-4 pl-12 pr-6 font-mono text-xs uppercase tracking-widest text-[#e8f4ff] placeholder:text-[#4d7a9e] focus:outline-none focus:border-brand-cyan transition-all"
            value={state.filters.searchTerm}
            onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { searchTerm: e.target.value } })}
          />
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "flex items-center gap-3 px-8 py-4 border font-mono text-xs font-bold uppercase tracking-widest transition-all",
              isFilterOpen ? "bg-brand-cyan text-[#03080f] border-brand-cyan" : "bg-[#0a1624] border-[#1c3450] text-[#8ab4d4] hover:border-[#2e5a80] hover:text-[#e8f4ff]"
            )}
          >
            <Filter size={14} />
            {isFilterOpen ? 'ACTIVE_FILTER' : 'REFINE_SEARCH'}
          </button>

          <div className="flex bg-[#0a1624] border border-[#1c3450] p-1 gap-1">
            <div className="relative group/sort flex items-center px-4 gap-2 border-r border-[#1c3450]">
              <span className="text-[10px] font-mono font-bold text-[#4d7a9e] uppercase tracking-widest">Sort:</span>
              <select 
                value={state.sortKey}
                onChange={(e) => dispatch({ type: 'SET_SORT', payload: { key: e.target.value as any } })}
                className="bg-transparent text-xs font-mono font-bold text-[#8ab4d4] uppercase tracking-widest focus:outline-none appearance-none cursor-pointer pr-4"
              >
                <option value="gScore" className="bg-[#0a1624]">G_Score</option>
                <option value="mScore" className="bg-[#0a1624]">M_Score</option>
                <option value="roiProjection" className="bg-[#0a1624]">ROI</option>
                <option value="name" className="bg-[#0a1624]">Name</option>
                <option value="founded" className="bg-[#0a1624]">Founded</option>
              </select>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                <ChevronDown size={12} className="text-[#4d7a9e]" />
              </div>
            </div>

            <button 
              onClick={() => dispatch({ type: 'SET_SORT', payload: { key: state.sortKey } })}
              className="p-3 text-[#4d7a9e] hover:text-brand-cyan transition-all"
              title={state.sortDir === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
            >
              {state.sortDir === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
            </button>

            <div className="w-[1px] bg-[#1c3450] mx-1" />

            <button onClick={() => setViewMode('grid')} className={cn("p-3 transition-all", viewMode === 'grid' ? "bg-brand-cyan/10 text-brand-cyan" : "text-[#4d7a9e] hover:text-[#8ab4d4]")}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setViewMode('table')} className={cn("p-3 transition-all", viewMode === 'table' ? "bg-brand-cyan/10 text-brand-cyan" : "text-[#4d7a9e] hover:text-[#8ab4d4]")}>
              <TableIcon size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Advanced Filters Overlay */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-12"
          >
            <div className="bg-[#0a1624] border border-[#1c3450] p-10 grid grid-cols-1 md:grid-cols-3 gap-12 relative">
               <div className="space-y-6">
                <h3 className="text-xs font-mono font-bold text-[#4d7a9e] uppercase tracking-widest">Surgical Sectors</h3>
                <div className="flex flex-wrap gap-2">
                  {['HealthAI', 'FinAI', 'EdAI', 'ClimateAI', 'DefenceAI', 'EnterpriseAI'].map((s) => (
                    <button 
                      key={s}
                      onClick={() => {
                        const sectors = state.filters.sectors.includes(s as VentureSector) 
                          ? state.filters.sectors.filter(sec => sec !== s)
                          : [...state.filters.sectors, s as VentureSector];
                        dispatch({ type: 'SET_FILTERS', payload: { sectors } });
                      }}
                      className={cn(
                        "px-3 py-1.5 border text-xs font-mono font-bold uppercase tracking-wider transition-all",
                        state.filters.sectors.includes(s as VentureSector) ? "bg-brand-cyan text-[#03080f] border-brand-cyan" : "border-[#1c3450] text-[#8ab4d4] hover:border-[#2e5a80] hover:text-[#e8f4ff]"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-mono font-bold text-[#4d7a9e] uppercase tracking-widest">Growth Stages</h3>
                <div className="flex flex-wrap gap-2">
                  {['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth'].map((s) => (
                    <button 
                      key={s}
                      onClick={() => {
                        const stages = state.filters.stages.includes(s as VentureStage) 
                          ? state.filters.stages.filter(sec => sec !== s)
                          : [...state.filters.stages, s as VentureStage];
                        dispatch({ type: 'SET_FILTERS', payload: { stages } });
                      }}
                      className={cn(
                        "px-3 py-1.5 border text-xs font-mono font-bold uppercase tracking-wider transition-all",
                        state.filters.stages.includes(s as VentureStage) ? "bg-brand-cyan text-[#03080f] border-brand-cyan" : "border-[#1c3450] text-[#8ab4d4] hover:border-[#2e5a80] hover:text-[#e8f4ff]"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-mono font-bold text-[#4d7a9e] uppercase tracking-widest">Score Vector: ROI</h3>
                <div className="px-2">
                  <input 
                    type="range" min="0" max="10" step="0.1" 
                    className="w-full accent-brand-cyan" 
                    value={state.filters.roiRange[0]}
                    onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { roiRange: [parseFloat(e.target.value), 10] } })}
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-mono text-[#4d7a9e]">
                    <span>MIN_ROI: {state.filters.roiRange[0]}x</span>
                    <span>MAX_LIMIT: 10.0x</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid View */}
      <section className="relative z-10">
        <div className={cn(
          "grid gap-8",
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
          {filteredVentures.map((v) => (
            <VentureCard 
              key={v.id} 
              venture={v} 
              isTable={viewMode === 'table'} 
              onBrief={() => setSelectedVentureForBrief(v)}
              isSelected={state.selectedForCompare.includes(v.id)}
              onCompare={() => handleCompareToggle(v.id)}
            />
          ))}
        </div>

        {filteredVentures.length === 0 && (
          <div className="py-32 flex flex-col items-center text-center space-y-4">
            <BarChart3 size={48} className="text-slate-800" />
            <h3 className="text-xl font-display font-bold text-slate-600 uppercase">No Matches Found in Neural Archive</h3>
          </div>
        )}
      </section>

      {/* Floating Compare Action */}
      <AnimatePresence>
        {state.selectedForCompare.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#0a1624] border border-brand-cyan/40 p-4 px-8 shadow-[0_0_50px_rgba(0,212,255,0.15)] flex items-center gap-10"
          >
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-widest">{state.selectedForCompare.length} ASSET_STACKED</span>
              <div className="flex -space-x-2">
                {state.selectedForCompare.map(id => (
                  <div key={id} className="w-6 h-6 bg-brand-cyan rounded-full border-2 border-[#0a1624] flex items-center justify-center text-xs font-bold text-[#03080f]">
                    {state.ventures.find(v => v.id === id)?.name[0]}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => dispatch({ type: 'CLEAR_COMPARE' })}
                className="text-xs font-mono font-bold text-[#4d7a9e] uppercase tracking-widest hover:text-[#e8f4ff]"
              >
                Clear
              </button>
              <button 
                onClick={openComparison}
                disabled={state.selectedForCompare.length !== 2}
                className={cn(
                  "px-6 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-all",
                  state.selectedForCompare.length === 2 ? "bg-brand-cyan text-[#03080f] hover:bg-white" : "bg-slate-800 text-slate-600 cursor-not-allowed"
                )}
              >
                Launch Comparison
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SystemBriefModal 
        isOpen={isSystemBriefOpen}
        onClose={() => setIsSystemBriefOpen(false)}
      />

      <BriefModal venture={selectedVentureForBrief} onClose={() => setSelectedVentureForBrief(null)} />
    </div>
  );
}
