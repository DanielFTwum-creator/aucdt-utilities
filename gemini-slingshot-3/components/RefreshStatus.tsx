import React from 'react';
import { RefreshCw, CheckCircle2, Shield, Activity, ListChecks, ChevronLeft, Zap } from 'lucide-react';

interface Props {
    onBack: () => void;
    themeStyles: any;
}

export const RefreshStatus: React.FC<Props> = ({ onBack, themeStyles }) => {
    const phases = [
        { id: 1, name: 'Foundation Setup', status: 'completed', desc: 'React 19.2.4 Verified • SRS v3.0.0 Baseline • Project Sync.' },
        { id: 2, name: 'Core Implementation', status: 'active', desc: 'Harding Admin Security • Refresh Monitoring • WCAG Audit.' },
        { id: 3, name: 'Testing Framework', status: 'pending', desc: 'E2E Puppeteer Suite • Logic Verification • Latency Benchmarking.' },
        { id: 4, name: 'Documentation & Diagrams', status: 'pending', desc: 'Architecture SVGs • Technical Guides • React 19.2.4 Manifest.' },
        { id: 5, name: 'Final Alignment', status: 'pending', desc: '100% SRS Sync • Artifact Collation • Institutional Audit.' }
    ];

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500" style={{ backgroundColor: themeStyles.bg }}>
            <div className="max-w-4xl w-full bg-opacity-95 rounded-3xl shadow-2xl overflow-hidden border-2" style={{ backgroundColor: themeStyles.panel, borderColor: themeStyles.border }}>
                {/* Header */}
                <div className="p-8 border-b-2 flex items-center justify-between" style={{ borderColor: themeStyles.border, backgroundColor: 'rgba(66, 133, 244, 0.05)' }}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl shadow-lg text-white" style={{ backgroundColor: themeStyles.accent }}>
                            <RefreshCw className="w-8 h-8 animate-spin-slow" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight uppercase" style={{ color: themeStyles.text }}>Refresh Protocol</h2>
                            <p className="font-bold text-xs uppercase tracking-widest mt-1 opacity-70" style={{ color: themeStyles.accent }}>Sequential Project Refinement v3.0.0</p>
                        </div>
                    </div>
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 px-6 py-3 border-2 rounded-2xl font-bold text-sm transition-all"
                        style={{ backgroundColor: themeStyles.bg, color: themeStyles.text, borderColor: themeStyles.border }}
                    >
                        <ChevronLeft size={18} />
                        Back to Cockpit
                    </button>
                </div>

                <div className="p-8 space-y-4">
                    {phases.map((phase) => (
                        <div key={phase.id} className={`relative flex gap-6 p-5 rounded-2xl border-2 transition-all duration-500 ${
                            phase.status === 'completed' ? 'border-emerald-500/30' :
                            phase.status === 'active' ? 'shadow-xl' :
                            'opacity-40'
                        }`} style={{ 
                            backgroundColor: phase.status === 'active' ? 'rgba(66, 133, 244, 0.05)' : 'transparent',
                            borderColor: phase.status === 'active' ? themeStyles.accent : themeStyles.border 
                        }}>
                            <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                                phase.status === 'completed' ? 'bg-emerald-500 text-white' :
                                phase.status === 'active' ? 'text-white' :
                                'bg-gray-800 text-gray-500'
                            }`} style={{ backgroundColor: phase.status === 'active' ? themeStyles.accent : undefined }}>
                                {phase.status === 'completed' ? <CheckCircle2 size={24} /> : <span className="text-sm font-black">{phase.id}</span>}
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-black text-lg uppercase tracking-tight" style={{ color: phase.status === 'pending' ? 'gray' : themeStyles.text }}>
                                        PHASE {phase.id}: {phase.name}
                                    </h3>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ 
                                        backgroundColor: phase.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(66, 133, 244, 0.1)',
                                        color: phase.status === 'completed' ? '#10b981' : themeStyles.accent
                                    }}>
                                        {phase.status}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed opacity-70" style={{ color: themeStyles.text }}>
                                    {phase.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-8 flex items-center justify-between border-t-2" style={{ backgroundColor: themeStyles.hud, borderColor: themeStyles.border }}>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2" style={{ color: themeStyles.text }}>
                            <ListChecks style={{ color: themeStyles.accent }} />
                            Compliance Manifest
                        </h3>
                        <p className="text-sm max-w-md leading-relaxed opacity-60" style={{ color: themeStyles.text }}>
                            Strict adherence to React 19.2.4 and 100% gap analysis synchronization is mandated for institutional audit compatibility.
                        </p>
                    </div>
                    <div className="backdrop-blur-md px-8 py-4 rounded-3xl border text-center min-w-[160px] relative z-10" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: themeStyles.border }}>
                        <p className="text-[10px] uppercase font-black mb-1 tracking-tighter opacity-60" style={{ color: themeStyles.text }}>React Version</p>
                        <p className="text-3xl font-black tracking-tighter" style={{ color: themeStyles.accent }}>19.2.4</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
