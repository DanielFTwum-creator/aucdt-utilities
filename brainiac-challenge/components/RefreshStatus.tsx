import React from 'react';
import { View } from '../types';
import { RefreshCw, Shield, CheckCircle2, Zap, Activity, FileText, ChevronLeft } from 'lucide-react';

interface Props {
    setView: (view: View) => void;
}

const RefreshStatus: React.FC<Props> = ({ setView }) => {
    const phases = [
        { id: 1, name: 'Foundation Setup', status: 'completed', desc: 'React 19.2.4 Verified • SRS v3.0.0 Baseline • Project Sync.' },
        { id: 2, name: 'Core Implementation', status: 'active', desc: 'Harding Admin Security • Refresh Monitoring • Boardroom Themes.' },
        { id: 3, name: 'Testing Framework', status: 'pending', desc: 'E2E Puppeteer Suite • Logic Verification • Screenshot History.' },
        { id: 4, name: 'Documentation & Diagrams', status: 'pending', desc: 'Architecture SVGs • Detailed Guides • React 19.2.4 Manifest.' },
        { id: 5, name: 'Final Alignment', status: 'pending', desc: '100% SRS Sync • /docs Collation • Institutional Handover.' }
    ];

    return (
        <div className="max-w-4xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-[#1a2e28] border-2 border-[#7C3AED]/30 rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#7C3AED]/10 p-8 border-b-2 border-[#7C3AED]/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#7C3AED] rounded-2xl shadow-lg shadow-[#7C3AED]/20 text-white">
                            <RefreshCw className="w-8 h-8 animate-spin-slow" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Refresh Protocol</h2>
                            <p className="text-[#0EA5E9] font-bold text-xs uppercase tracking-widest mt-1 italic">Sequential Project Refinement v3.0.0</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setView(View.AUDIT_LOG)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#142520] hover:bg-[#1a2e28] border-2 border-[#7C3AED]/30 text-white rounded-2xl font-bold text-sm transition-all"
                    >
                        <ChevronLeft size={18} />
                        Back to Admin
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {phases.map((phase) => (
                        <div key={phase.id} className={`relative flex gap-6 p-6 rounded-2xl border-2 transition-all duration-500 ${
                            phase.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/30' :
                            phase.status === 'active' ? 'bg-[#7C3AED]/5 border-[#7C3AED] shadow-xl shadow-[#7C3AED]/10' :
                            'bg-black/20 border-slate-800 opacity-40'
                        }`}>
                            <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                                phase.status === 'completed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
                                phase.status === 'active' ? 'bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/30 ring-4 ring-[#7C3AED]/10' :
                                'bg-slate-800 text-slate-500'
                            }`}>
                                {phase.status === 'completed' ? <CheckCircle2 size={24} /> : <span className="text-sm font-black">{phase.id}</span>}
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className={`font-black text-lg uppercase tracking-tight ${phase.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>
                                        PHASE {phase.id}: {phase.name}
                                    </h3>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                        phase.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                        phase.status === 'active' ? 'bg-[#7C3AED]/20 text-[#7C3AED]' :
                                        'bg-slate-800 text-slate-500'
                                    }`}>
                                        {phase.status}
                                    </span>
                                </div>
                                <p className={`text-sm leading-relaxed ${phase.status === 'pending' ? 'text-slate-600' : 'text-slate-400'}`}>
                                    {phase.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Banner */}
                <div className="bg-[#0F172A] p-8 text-white flex items-center justify-between overflow-hidden relative group">
                    <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Activity size={200} className="translate-x-20 -translate-y-20" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Compliance Manifest</h3>
                        <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                            Strict adherence to React 19.2.4 and 100% gap analysis synchronization is mandated for institutional audit compatibility.
                        </p>
                    </div>
                    <div className="bg-[#7C3AED]/20 backdrop-blur-md px-8 py-4 rounded-3xl border border-[#7C3AED]/30 text-center min-w-[160px] relative z-10">
                        <p className="text-[10px] uppercase font-black text-[#7C3AED] mb-1 tracking-tighter">React Version</p>
                        <p className="text-3xl font-black text-white tracking-tighter">19.2.4</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefreshStatus;
