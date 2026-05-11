import React from 'react';
import { RefreshCw, CheckCircle2, Shield, Activity, ListChecks, ChevronLeft, Wallet } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
    onBack: () => void;
}

export const RefreshStatus: React.FC<Props> = ({ onBack }) => {
    const { theme } = useTheme();
    const phases = [
        { id: 1, name: 'Foundation Setup', status: 'completed', desc: 'React 19.2.4 Verified • IEEE SRS v3.0.0 Baseline • Financial Data Sync.' },
        { id: 2, name: 'Core Implementation', status: 'active', desc: 'Harding Admin Security • Refresh Monitoring • Boardroom Themes.' },
        { id: 3, name: 'Testing Framework', status: 'pending', desc: 'E2E Puppeteer Suite • Affordability Logic Verification • Chart Precision.' },
        { id: 4, name: 'Documentation & Diagrams', status: 'pending', desc: 'Architecture SVGs • Fiscal Compliance Guides • React 19.2.4 Manifest.' },
        { id: 5, name: 'Final Alignment', status: 'pending', desc: '100% SRS Sync • Artifact Collation • Institutional Briefing Finalization.' }
    ];

    const isDark = theme === 'dark' || theme === 'high-contrast';

    return (
        <div className="max-w-4xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className={`border-2 rounded-3xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900 border-[#C8A84B]/30' : 'bg-white border-[#C8A84B]/20'}`}>
                {/* Header */}
                <div className={`p-8 border-b-2 flex items-center justify-between ${isDark ? 'bg-[#C8A84B]/5 border-[#C8A84B]/20' : 'bg-[#C8A84B]/5 border-[#C8A84B]/10'}`}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#C8A84B] rounded-2xl shadow-lg shadow-[#C8A84B]/20 text-[#2C1810]">
                            <RefreshCw className="w-8 h-8 animate-spin-slow" />
                        </div>
                        <div>
                            <h2 className={`text-3xl font-black tracking-tight uppercase leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>Refresh Protocol</h2>
                            <p className="text-[#C8A84B] font-bold text-xs uppercase tracking-widest mt-2 italic">Institutional Alignment v3.0.0</p>
                        </div>
                    </div>
                    <button 
                        onClick={onBack}
                        className={`flex items-center gap-2 px-6 py-3 border-2 rounded-2xl font-bold text-sm transition-all shadow-sm ${isDark ? 'bg-slate-800 border-[#C8A84B]/30 text-white hover:bg-[#C8A84B]/10' : 'bg-white border-[#C8A84B]/20 text-slate-900 hover:bg-[#C8A84B]/5'}`}
                    >
                        <ChevronLeft size={18} />
                        Back to Cockpit
                    </button>
                </div>

                <div className={`p-8 space-y-6 ${isDark ? 'bg-slate-950/50' : 'bg-slate-50/50'}`}>
                    {phases.map((phase) => (
                        <div key={phase.id} className={`relative flex gap-6 p-6 rounded-2xl border-2 transition-all duration-500 ${
                            phase.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/30' :
                            phase.status === 'active' ? 'bg-[#C8A84B]/5 border-[#C8A84B] shadow-xl shadow-[#C8A84B]/10' :
                            'opacity-40'
                        } ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                            <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                                phase.status === 'completed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
                                phase.status === 'active' ? 'bg-[#C8A84B] text-[#2C1810] shadow-lg shadow-[#C8A84B]/30 ring-4 ring-[#C8A84B]/10' :
                                isDark ? 'bg-slate-800 text-slate-500' : 'bg-gray-200 text-gray-400'
                            }`}>
                                {phase.status === 'completed' ? <CheckCircle2 size={24} /> : <span className="text-sm font-black">{phase.id}</span>}
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className={`font-black text-lg uppercase tracking-tight ${phase.status === 'pending' ? 'text-gray-500' : isDark ? 'text-white' : 'text-slate-900'}`}>
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
                                <p className={`text-sm leading-relaxed ${phase.status === 'pending' ? 'text-gray-500' : isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {phase.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Compliance Footer */}
                <div className={`p-8 text-white flex items-center justify-between overflow-hidden relative group ${isDark ? 'bg-slate-950 border-t-2 border-[#C8A84B]/20' : 'bg-[#2C1810]'}`}>
                    <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity text-[#C8A84B]">
                        <Wallet size={200} className="translate-x-20 -translate-y-20" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <ListChecks className="text-[#C8A84B]" />
                            Institutional Manifest
                        </h3>
                        <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                            Strict adherence to React 19.2.4 and 100% gap analysis synchronization is mandated for institutional financial audit compatibility.
                        </p>
                    </div>
                    <div className={`backdrop-blur-md px-8 py-4 rounded-3xl border text-center min-w-[160px] relative z-10 ${isDark ? 'bg-white/5 border-[#C8A84B]/30' : 'bg-white/10 border-white/10'}`}>
                        <p className="text-[10px] uppercase font-black text-[#C8A84B] mb-1 tracking-tighter">React Version</p>
                        <p className="text-3xl font-black text-white tracking-tighter">19.2.4</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
