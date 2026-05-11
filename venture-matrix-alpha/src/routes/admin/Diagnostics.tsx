import React from 'react';
import { useVenture } from '../../context/VentureContext';
import { useAdminAuth } from '../../context/AdminContext';
import { 
  Terminal, 
  ChevronLeft, 
  Trash2, 
  Download, 
  RotateCcw,
  Cpu,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Diagnostics() {
  const { state: ventureState, dispatch } = useVenture();
  const { state: adminState } = useAdminAuth();

  const clearCache = () => {
    dispatch({ type: 'CLEAR_CACHE' });
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ventureState.ventures, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "venture_matrix_archive.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="p-8 md:p-12 lg:p-16 space-y-16 max-w-7xl mx-auto relative z-10">
       <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
           <Link to="/admin" className="flex items-center gap-3 text-slate-500 hover:text-brand-cyan transition-colors group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.4em]">BACK_TO_DASHBOARD</span>
          </Link>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter">DEEP_DIAG <span className="text-slate-800">V4.9</span></h1>
        </div>
        
        <div className="flex gap-4">
           <button 
            onClick={clearCache}
            className="flex items-center gap-3 px-8 py-4 border border-brand-red/30 text-brand-red text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all"
           >
            <Trash2 size={14} />
            Flush Cache
           </button>
           <button 
            onClick={exportData}
            className="flex items-center gap-3 px-8 py-4 bg-brand-cyan text-[#050a12] text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-white transition-all"
           >
            <Download size={14} />
            Export Archive
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* System Core Dump */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Terminal size={18} className="text-brand-cyan" />
                 <h2 className="text-xs font-mono font-bold text-white uppercase tracking-[0.3em]">VentureContext_State_Dump</h2>
              </div>
              <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                Last_Polled: {new Date().toLocaleTimeString()}
              </div>
           </div>
           
           <div className="bg-[#0c1520] border border-[#1a2d42] p-8 max-h-[600px] overflow-auto custom-scrollbar relative">
              <div className="absolute top-4 right-4 text-[8px] font-mono text-slate-700 bg-black/40 px-2 py-1 uppercase">JSON_SERIALIZED</div>
              <pre className="text-[10px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(ventureState, (key, value) => {
                  if (key === 'ventures' && Array.isArray(value)) return `[Array(${value.length})]`;
                  return value;
                }, 2)}
              </pre>
           </div>
        </div>

        {/* Diagnostic Metadata */}
        <div className="space-y-12">
           <section className="bg-[#0c1520] border border-[#1a2d42] p-10 space-y-8">
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-[0.3em] flex items-center gap-3 italic">
                <Cpu size={16} />
                Kernel Metadata
              </h2>
              <div className="space-y-6">
                 <DiagMeta label="Session Start" value={new Date(adminState.sessionStart).toLocaleString()} />
                 <DiagMeta label="Neural Version" value="1.5.0-Flash" />
                 <DiagMeta label="React Core" value="19.2.4" />
                 <DiagMeta label="Vite Bridge" value="6.2.0" />
                 <DiagMeta label="Auth Protocol" value="Alpha_PIN_SHA256" />
              </div>
           </section>

           <section className="bg-brand-cyan/5 border border-brand-cyan/20 p-10 space-y-8">
              <h2 className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-[0.3em] flex items-center gap-3">
                <ShieldCheck size={16} />
                Security Invariants
              </h2>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                    <div className="w-1 h-1 bg-brand-cyan rounded-full" />
                    <span>Cross-Origin Frame: Restricted</span>
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                    <div className="w-1 h-1 bg-brand-cyan rounded-full" />
                    <span>HMR Execution: Disabled</span>
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                    <div className="w-1 h-1 bg-brand-cyan rounded-full" />
                    <span>Neural Context: Sanitized</span>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}

function DiagMeta({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
      <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">{label}</span>
      <span className="text-[10px] font-mono text-white tracking-wider">{value}</span>
    </div>
  );
}
