import React from 'react';
import { RefreshCw, CheckCircle2, Shield, Activity, ListChecks, ChevronLeft, BarChart3 } from 'lucide-react';
import Button from './common/Button';

interface Props {
    onBack: () => void;
}

const RefreshStatus: React.FC<Props> = ({ onBack }) => {
    const phases = [
        { id: 1, name: 'Foundation Setup', status: 'completed', desc: 'React 19.2.4 Verified • SRS v3.0.0 Baseline • Institutional Payroll Sync.' },
        { id: 2, name: 'Core Implementation', status: 'active', desc: 'Harding Admin Security • Refresh Monitoring • Boardroom Mode.' },
        { id: 3, name: 'Testing Framework', status: 'pending', desc: 'E2E Puppeteer Suite • 2025 Tax Band Verification • Discrepancy Audit.' },
        { id: 4, name: 'Documentation & Diagrams', status: 'pending', desc: 'Architecture SVGs • Fiscal Compliance Guides • React 19.2.4 Manifest.' },
        { id: 5, name: 'Final Alignment', status: 'pending', desc: '100% SRS Sync • Artifact Collation • Boardroom Presentation.' }
    ];

    return (
        <div className="max-w-4xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white dark:bg-slate-900 border-2 border-[#C8A84B]/30 rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#C8A84B]/5 p-8 border-b-2 border-[#C8A84B]/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#C8A84B] rounded-2xl shadow-lg shadow-[#C8A84B]/20 text-[#2C1810]">
                            <RefreshCw className="w-8 h-8 animate-spin-slow" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Refresh Protocol</h2>
                            <p className="text-[#C8A84B] font-bold text-xs uppercase tracking-widest mt-2 italic">Institutional Alignment v3.0.0</p>
                        </div>
                    </div>
                    <Button 
                        onClick={onBack}
                        variant="secondary"
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm"
                    >
                        <ChevronLeft size={18} />
                        Back to Admin
                    </Button>
                </div>

                <div className="p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950/50">
                    {phases.map((phase) => (
                        <div key={phase.id} className={`relative flex gap-6 p-6 rounded-2xl border-2 transition-all duration-500 ${
                            phase.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/30' :
                            phase.status === 'active' ? 'bg-[#C8A84B]/5 border-[#C8A84B] shadow-xl shadow-[#C8A84B]/10' :
                            'bg-gray-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 opacity-40'
                        }`}>
                            <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                                phase.status === 'completed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
                                phase.status === 'active' ? 'bg-[#C8A84B] text-[#2C1810] shadow-lg shadow-[#C8A84B]/30 ring-4 ring-[#C8A84B]/10' :
                                'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500'
                            }`}>
                                {phase.status === 'completed' ? <CheckCircle2 size={24} /> : <span className="text-sm font-black">{phase.id}</span>}
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className={`font-black text-lg uppercase tracking-tight ${phase.status === 'pending' ? 'text-gray-400' : 'text-slate-900 dark:text-white'}`}>
                                        PHASE {phase.id}: {phase.name}
                                    </h3>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                        phase.status === 'completed' ? 'bg-emerald-500/20 text-emerald-600' :
                                        phase.status === 'active' ? 'bg-[#C8A84B]/20 text-[#C8A84B]' :
                                        'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-500'
                                    }`}>
                                        {phase.status}
                                    </span>
                                </div>
                                <p className={`text-sm leading-relaxed ${phase.status === 'pending' ? 'text-gray-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {phase.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Compliance Footer */}
                <div className="bg-[#2C1810] p-8 text-white flex items-center justify-between overflow-hidden relative group">
                    <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity text-[#C8A84B]">
                        <BarChart3 size={200} className="translate-x-20 -translate-y-20" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <ListChecks className="text-[#C8A84B]" />
                            Institutional Manifest
                        </h3>
                        <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                            Strict adherence to React 19.2.4 and 100% gap analysis synchronization is mandated for institutional audit compatibility.
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10 text-center min-w-[160px] relative z-10">
                        <p className="text-[10px] uppercase font-black text-[#C8A84B] mb-1 tracking-tighter">React Version</p>
                        <p className="text-3xl font-black text-white tracking-tighter">19.2.4</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefreshStatus;
