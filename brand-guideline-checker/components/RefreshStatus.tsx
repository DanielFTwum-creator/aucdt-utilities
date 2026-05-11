import React from 'react';
import { RefreshCw, CheckCircle2, Shield, Activity, ListChecks, ChevronLeft } from 'lucide-react';

interface Props {
    onBack: () => void;
}

export const RefreshStatus: React.FC<Props> = ({ onBack }) => {
    const phases = [
        { id: 1, name: 'Foundation Setup', status: 'completed', desc: 'React 19.2.4 Verified • SRS v3.0.0 Baseline • Project Synchronization.' },
        { id: 2, name: 'Core Implementation', status: 'active', desc: 'Harding Admin Security • Refresh Monitoring • Boardroom Mode Themes.' },
        { id: 3, name: 'Testing Framework', status: 'pending', desc: 'E2E Puppeteer Suite • side-by-side Visual Verification • Screenshot History.' },
        { id: 4, name: 'Documentation & Diagrams', status: 'pending', desc: 'Architecture SVGs • Detailed Compliance Guides • React 19.2.4 Manifest.' },
        { id: 5, name: 'Final Alignment', status: 'pending', desc: '100% SRS Sync • Artifact Collation • Institutional Audit Finalization.' }
    ];

    return (
        <div className="max-w-4xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white border-2 border-[#D4AF37]/30 rounded-3xl shadow-subtle overflow-hidden">
                {/* Header */}
                <div className="bg-[#D4AF37]/5 p-8 border-b-2 border-[#D4AF37]/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#D4AF37] rounded-2xl shadow-lg shadow-[#D4AF37]/20 text-white">
                            <RefreshCw className="w-8 h-8 animate-spin-slow" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-[#2C1810] tracking-tight uppercase leading-none">Refresh Protocol</h2>
                            <p className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest mt-2 italic">Institutional Alignment v3.0.0</p>
                        </div>
                    </div>
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#D4AF37]/5 border-2 border-[#D4AF37]/30 text-[#2C1810] rounded-2xl font-bold text-sm transition-all"
                    >
                        <ChevronLeft size={18} />
                        Back to Checker
                    </button>
                </div>

                <div className="p-8 space-y-6 bg-[#FDFCF9]">
                    {phases.map((phase) => (
                        <div key={phase.id} className={`relative flex gap-6 p-6 rounded-2xl border-2 transition-all duration-500 ${
                            phase.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/30' :
                            phase.status === 'active' ? 'bg-[#D4AF37]/5 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10' :
                            'bg-gray-50 border-gray-100 opacity-40'
                        }`}>
                            <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                                phase.status === 'completed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
                                phase.status === 'active' ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/30 ring-4 ring-[#D4AF37]/10' :
                                'bg-gray-200 text-gray-400'
                            }`}>
                                {phase.status === 'completed' ? <CheckCircle2 size={24} /> : <span className="text-sm font-black">{phase.id}</span>}
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className={`font-black text-lg uppercase tracking-tight ${phase.status === 'pending' ? 'text-gray-400' : 'text-[#2C1810]'}`}>
                                        PHASE {phase.id}: {phase.name}
                                    </h3>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                        phase.status === 'completed' ? 'bg-emerald-500/20 text-emerald-600' :
                                        phase.status === 'active' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                                        'bg-gray-200 text-gray-400'
                                    }`}>
                                        {phase.status}
                                    </span>
                                </div>
                                <p className={`text-sm leading-relaxed ${phase.status === 'pending' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {phase.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Compliance Footer */}
                <div className="bg-[#2C1810] p-8 text-white flex items-center justify-between overflow-hidden relative group">
                    <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity text-[#D4AF37]">
                        <Shield size={200} className="translate-x-20 -translate-y-20" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <ListChecks className="text-[#D4AF37]" />
                            Institutional Manifest
                        </h3>
                        <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                            Strict adherence to React 19.2.4 and 100% gap analysis synchronization is mandated for institutional brand audit compatibility.
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10 text-center min-w-[160px] relative z-10">
                        <p className="text-[10px] uppercase font-black text-[#D4AF37] mb-1 tracking-tighter">React Version</p>
                        <p className="text-3xl font-black text-white tracking-tighter">19.2.4</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
