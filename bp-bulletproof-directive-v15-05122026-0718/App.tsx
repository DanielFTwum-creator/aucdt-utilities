import React, { useState, useEffect } from 'react';
import { Framework, ToastMessage, AuditLog } from './types';
import { FRAMEWORKS } from './constants';
import { PhaseCard } from './components/PhaseCard';
import { ProgressBar } from './components/ProgressBar';
import { Toast } from './components/Toast';
import { Icons } from './components/Icons';
import { DocViewer } from './components/DocViewer';
import AdminPanel from './components/AdminPanel';
import { HelpModal } from './components/HelpModal';
import { Tooltip } from './components/Tooltip';
import { PlaywrightRunner } from './components/PlaywrightRunner';

const App: React.FC = () => {
  const [currentFramework, setCurrentFramework] = useState<Framework>(FRAMEWORKS[0]);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [expandedPhases, setExpandedPhases] = useState<number[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light' | 'high-contrast'>('dark');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  
  // Routing State
  const [route, setRoute] = useState<string>(window.location.hash || '#/');
  
  // New Feature States
  const [showDocs, setShowDocs] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTesting, setShowTesting] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Initialize theme
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Handle Routing
  useEffect(() => {
    const handleHashChange = () => {
        setRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success', action?: ToastMessage['action']) => {
    setToast({ message, type, action });
    const duration = action ? 6000 : 3000;
    setTimeout(() => setToast(prev => prev?.message === message ? null : prev), duration);
  };

  const logAction = (action: string, details?: string) => {
    const newLog: AuditLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        action,
        user: 'User',
        details
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  const copyToClipboard = async (text: string, identifier: number | string, isAuto: boolean = false) => {
    try {
      await navigator.clipboard.writeText(text);
      
      let subject = typeof identifier === 'number' ? `Phase ${identifier}` : identifier;
      
      const message = isAuto
        ? `${subject} directive ready!`
        : `${subject} directive copied!`;
      
      showToast(message, 'success');
      if (!isAuto) logAction('COPY_DIRECTIVE', subject);
    } catch (err) {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const togglePhase = (phaseId: number) => {
    const isCurrentlyExpanded = expandedPhases.includes(phaseId);
    
    setExpandedPhases(prev =>
      prev.includes(phaseId)
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );

    if (!isCurrentlyExpanded) {
      const phase = currentFramework.phases.find(p => p.id === phaseId);
      if (phase) {
        copyToClipboard(phase.directive, phase.id, true);
      }
      logAction('EXPAND_PHASE', `Phase ${phaseId}`);
    } else {
      logAction('COLLAPSE_PHASE', `Phase ${phaseId}`);
    }
  };

  const toggleCompletion = (phaseId: number) => {
    setCompletedPhases(prev => {
      const isComplete = prev.includes(phaseId);
      logAction(isComplete ? 'UNMARK_COMPLETE' : 'MARK_COMPLETE', `Phase ${phaseId}`);
      return isComplete
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId];
    });
  };

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset all progress?")) {
        setCompletedPhases([]);
        setExpandedPhases([]);
        showToast('Progress reset successfully', 'success');
        logAction('RESET_PROGRESS', 'All phases cleared');
    }
  };

  const expandAll = () => {
      setExpandedPhases(currentFramework.phases.map(p => p.id));
      logAction('EXPAND_ALL');
  };
  
  const collapseAll = () => {
      setExpandedPhases([]);
      logAction('COLLAPSE_ALL');
  };
  
  const toggleTheme = () => {
    setTheme(prev => {
        const next = prev === 'dark' ? 'light' : prev === 'light' ? 'high-contrast' : 'dark';
        logAction('CHANGE_THEME', next);
        return next;
    });
  };
  
  const getThemeIcon = () => {
    switch (theme) {
        case 'light': return <Icons.Sun />;
        case 'high-contrast': return <Icons.Contrast />;
        default: return <Icons.Moon />;
    }
  };
  
  const getThemeLabel = () => {
    switch (theme) {
        case 'light': return 'Light Mode';
        case 'high-contrast': return 'High Contrast';
        default: return 'Dark Mode';
    }
  };

  const getPhaseColorClass = (id: number) => {
    switch(id) {
        case 1: return 'bg-phase-1';
        case 2: return 'bg-phase-2';
        case 3: return 'bg-phase-3';
        case 4: return 'bg-phase-4';
        case 5: return 'bg-phase-5';
        default: return 'bg-accent-primary';
    }
  };

  // ----------------------------------------------------------------------
  // RENDER: ADMIN VIEW
  // ----------------------------------------------------------------------
  if (route.startsWith('#/admin')) {
      return (
          <div className="min-h-screen bg-bg-primary text-text-primary">
              <AdminPanel 
                currentRoute={route} 
                auditLogs={auditLogs} 
                onNavigate={(newRoute) => window.location.hash = newRoute}
                onReturnToApp={() => window.location.hash = '#/'}
              />
          </div>
      );
  }

  // ----------------------------------------------------------------------
  // RENDER: PUBLIC APP VIEW
  // ----------------------------------------------------------------------
  const progress = (completedPhases.length / currentFramework.phases.length) * 100;
  const filteredPhases = currentFramework.phases.filter(phase => {
    if (filter === 'all') return true;
    const isCompleted = completedPhases.includes(phase.id);
    return filter === 'completed' ? isCompleted : !isCompleted;
  });

  return (
    <div className="min-h-screen relative font-sans selection:bg-accent-primary selection:text-white pb-20 overflow-x-hidden" style={{ zoom: 1.1 }}>
      {/* Noise Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

            <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 h-[100dvh] flex flex-col overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 flex-1 min-h-0">
          
          {/* Left Panel: Dashboard */}
          <div className="col-span-1 lg:col-span-4 xl:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 pb-2 h-full">
            
            {/* Header Card */}
            <div className="bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-border rounded-3xl p-5 relative overflow-hidden flex flex-col justify-center shadow-sm group shrink-0">
              <div className="absolute top-3 right-3 flex gap-1">
                <Tooltip content="Playwright Self-Test"><button onClick={() => setShowTesting(true)} className="p-2 bg-bg-primary rounded-xl border border-border/50 text-text-muted hover:text-accent-primary hover:border-accent-primary transition-all"><Icons.Terminal className="w-3.5 h-3.5"/></button></Tooltip>
                <Tooltip content="Help & Support"><button onClick={() => setShowHelp(true)} className="p-2 bg-bg-primary rounded-xl border border-border/50 text-text-muted hover:text-accent-primary hover:border-accent-primary transition-all"><Icons.HelpCircle className="w-3.5 h-3.5"/></button></Tooltip>
                <Tooltip content="Documentation"><button onClick={() => setShowDocs(true)} className="p-2 bg-bg-primary rounded-xl border border-border/50 text-text-muted hover:text-accent-primary hover:border-accent-primary transition-all"><Icons.FileText className="w-3.5 h-3.5"/></button></Tooltip>
                <Tooltip content="Admin Context"><button onClick={() => window.location.hash = '#/admin'} className="p-2 bg-bg-primary rounded-xl border border-border/50 text-text-muted hover:text-accent-primary hover:border-accent-primary transition-all"><Icons.Lock className="w-3.5 h-3.5"/></button></Tooltip>
              </div>
              
              <div className="flex items-center gap-3 mb-3 mt-1">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary shadow-lg shadow-accent-primary/20 transform transition-transform group-hover:scale-105 shrink-0">
                  <span className="font-mono text-base font-bold text-white">BP</span>
                </div>
                <h1 className="font-mono text-lg font-bold text-text-primary tracking-tight leading-tight">
                  Compliance<br/>Workflow
                </h1>
              </div>
              <p className="text-text-secondary text-[11px] leading-tight">
                A unified bento dashboard to track progression across frameworks.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0">
               {/* Progress Card */}
              <div className="bg-bg-secondary border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-accent-primary/50 transition-colors">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icons.Activity className="w-3.5 h-3.5 text-accent-primary" />
                    <h3 className="font-bold text-[11px] text-text-secondary">Progress</h3>
                  </div>
                  <p className="text-xl font-mono font-bold text-text-primary mt-1">{completedPhases.length} <span className="text-xs text-text-muted">/ {currentFramework.phases.length}</span></p>
                </div>
                <div className="mt-3">
                  <ProgressBar progress={progress} completedCount={completedPhases.length} totalCount={currentFramework.phases.length} />
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-bg-secondary border border-border rounded-2xl p-3 flex flex-col justify-center shadow-sm hover:border-accent-primary/50 transition-colors">
                  <div className="grid grid-cols-2 gap-1.5 h-full">
                     <button onClick={expandAll} className="rounded-xl bg-bg-tertiary border border-border text-[9px] uppercase font-bold tracking-wider hover:border-accent-primary hover:text-accent-primary transition-all flex flex-col items-center justify-center gap-1 py-1.5 text-text-muted"><Icons.Maximize className="w-3.5 h-3.5" /> Expand</button>
                     <button onClick={collapseAll} className="rounded-xl bg-bg-tertiary border border-border text-[9px] uppercase font-bold tracking-wider hover:border-accent-primary hover:text-accent-primary transition-all flex flex-col items-center justify-center gap-1 py-1.5 text-text-muted"><Icons.Minimize className="w-3.5 h-3.5" /> Collapse</button>
                     <button onClick={resetProgress} className="rounded-xl bg-bg-tertiary border border-border text-[9px] uppercase font-bold tracking-wider hover:border-accent-primary hover:text-accent-primary transition-all flex flex-col items-center justify-center gap-1 py-1.5 text-text-muted"><Icons.Refresh className="w-3.5 h-3.5" /> Reset</button>
                     <button onClick={toggleTheme} className="rounded-xl bg-bg-tertiary border border-border text-[9px] uppercase font-bold tracking-wider hover:border-accent-primary hover:text-accent-primary transition-all flex flex-col items-center justify-center gap-1 py-1.5 text-text-muted">{getThemeIcon()} Theme</button>
                  </div>
              </div>

              {/* Single Shot Actions */}
              <div className="bg-bg-secondary border border-border rounded-2xl p-3 flex flex-col shadow-sm hover:border-accent-primary/50 transition-colors">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icons.Settings className="w-3.5 h-3.5 text-accent-primary" />
                    <h3 className="font-bold text-[11px] text-text-secondary">Single Shot Export</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button onClick={async () => {
                      const { SINGLE_SHOT_CLAUDE } = await import('./constants');
                      copyToClipboard(SINGLE_SHOT_CLAUDE, 'Claude Single Shot', false);
                    }} className="rounded-xl bg-bg-tertiary border border-border text-[9px] uppercase font-bold tracking-wider hover:border-accent-primary hover:text-accent-primary transition-all py-1.5 text-text-muted">
                        Claude Code
                    </button>
                    <button onClick={async () => {
                      const { SINGLE_SHOT_AISTUDIO } = await import('./constants');
                      copyToClipboard(SINGLE_SHOT_AISTUDIO, 'AI Studio Single Shot', false);
                    }} className="rounded-xl bg-bg-tertiary border border-border text-[9px] uppercase font-bold tracking-wider hover:border-accent-primary hover:text-accent-primary transition-all py-1.5 text-text-muted">
                        AI Studio
                    </button>
                  </div>
              </div>
            </div>

            {/* Framework List */}
            <div className="flex flex-col gap-2 shrink-0">
              {FRAMEWORKS.map((f) => (
                 <button
                   key={f.id}
                   onClick={() => {
                       setCurrentFramework(f);
                       setCompletedPhases([]);
                       setExpandedPhases([]);
                   }}
                   className={`w-full p-3 rounded-2xl border ${currentFramework.id === f.id ? 'border-accent-primary bg-accent-primary/5 shadow-sm' : 'border-border bg-bg-secondary shadow-sm'} flex items-center justify-between text-left hover:border-accent-primary transition-all group`}
                 >
                    <div>
                       <h3 className="font-bold text-text-primary text-[11px] group-hover:text-accent-primary transition-colors leading-tight">{f.title}</h3>
                       <p className="text-[9px] text-text-secondary mt-0.5 opacity-80">{f.phases.length} phases</p>
                    </div>
                    {currentFramework.id === f.id ? (
                       <div className="flex items-center gap-1.5 bg-accent-primary/10 px-2 py-1 rounded-md">
                         <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                         <span className="text-[9px] uppercase font-mono font-bold text-accent-primary tracking-wider hidden sm:inline-block">Active</span>
                       </div>
                    ) : (
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <Icons.Eye className="w-4 h-4 text-text-muted" />
                       </div>
                    )}
                 </button>
              ))}
            </div>
            
            {/* Phase Context Display */}
            {expandedPhases.length > 0 && (
              <div className="bg-bg-secondary border border-border rounded-2xl p-4 shadow-sm flex flex-col shrink-0 mt-2">
                  <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                          <Icons.Eye className="w-4 h-4 text-accent-primary" />
                          <h3 className="font-bold text-xs text-text-secondary">Current Focus</h3>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-bg-tertiary px-1.5 py-0.5 rounded border border-border text-text-muted">{expandedPhases.length} selected</span>
                  </div>
                  <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                    {expandedPhases.sort((a, b) => a - b).map(id => {
                      const phase = currentFramework.phases.find(p => p.id === id);
                      if (!phase) return null;
                      return (
                        <div key={id} className="p-2.5 rounded-xl bg-bg-tertiary border border-border/50 flex gap-2.5 items-start shadow-sm">
                          <div className={`mt-1 w-1.5 h-1.5 rounded-full ${getPhaseColorClass(id)} shrink-0`} />
                          <div>
                             <h4 className="text-[11px] font-bold text-text-primary mb-0.5 tracking-tight">PHASE {id}: {phase.title}</h4>
                             <p className="text-[9px] text-text-secondary leading-relaxed opacity-90">{phase.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
              </div>
            )}
            <div className="pb-4"></div>
          </div>

          {/* Right Panel: Phases & Timeline */}
          <div className="col-span-1 lg:col-span-8 xl:col-span-9 flex flex-col h-full overflow-hidden">
            {/* Filter Tabs & Timeline Header */}
            <div className="flex flex-row justify-between items-center gap-4 bg-bg-secondary border border-border rounded-[20px] p-2 mb-4 shrink-0 shadow-sm animate-fade-in mx-1">
                <h2 className="text-sm font-bold font-mono tracking-tight text-text-primary ml-3 hidden sm:block">Engagement Timeline</h2>
                <div className="flex justify-center gap-1 w-full sm:w-auto">
                    {(['all', 'completed', 'pending'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`
                                flex-1 sm:flex-none px-4 py-1.5 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider transition-all duration-300
                                ${filter === f 
                                    ? 'bg-accent-primary text-white shadow-sm' 
                                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/70'
                                }
                            `}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Expanded Phase Descriptions */}
            <div className="mb-4 mx-1 animate-fade-in shrink-0">
               {expandedPhases.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {expandedPhases.sort((a, b) => a - b).map(id => {
                      const phase = currentFramework.phases.find(p => p.id === id);
                      if (!phase) return null;
                      return (
                        <div key={id} className="bg-bg-secondary border border-border p-3 rounded-2xl flex items-start gap-3 shadow-sm">
                          <div className={`mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${getPhaseColorClass(id)}`} />
                          <div>
                            <h4 className="text-[11px] font-bold text-text-primary mb-0.5 tracking-tight line-clamp-1">Phase {id}: {phase.title}</h4>
                            <p className="text-[10px] text-text-secondary leading-snug line-clamp-2">{phase.description}</p>
                          </div>
                        </div>
                      )
                    })}
                 </div>
               ) : (
                 <div className="bg-bg-secondary/50 border border-dashed border-border/60 py-3 px-4 rounded-2xl flex items-center justify-center text-center shadow-sm">
                    <p className="text-[10px] font-mono text-text-muted tracking-wide uppercase">Expand a phase below to view its context here</p>
                 </div>
               )}
            </div>

            {/* Phase Grid Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-1 pb-10 mt-1">
              <div className="grid gap-4">
                {filteredPhases.length > 0 ? (
                  filteredPhases.map((phase, idx) => (
                      <div key={phase.id} className="animate-slide-up" style={{ animationDelay: `${Math.min(idx * 50, 500)}ms` }}>
                      <PhaseCard
                          phase={phase}
                          isExpanded={expandedPhases.includes(phase.id)}
                          isCompleted={completedPhases.includes(phase.id)}
                          onToggleExpand={() => togglePhase(phase.id)}
                          onToggleComplete={() => toggleCompletion(phase.id)}
                          onCopyDirective={() => copyToClipboard(phase.directive, phase.id)}
                      />
                      </div>
                  ))
                ) : (
                  <div className="text-center py-12 border border-dashed border-border rounded-3xl animate-fade-in bg-bg-secondary/50">
                      <div className="mb-3 inline-flex p-3 rounded-full bg-bg-tertiary text-text-muted">
                          <Icons.AlertCircle className="w-6 h-6" />
                      </div>
                      <p className="text-text-secondary font-mono text-sm">No {filter} phases found.</p>
                      <button 
                          onClick={() => setFilter('all')}
                          className="mt-3 text-accent-primary hover:text-accent-secondary text-[10px] font-bold uppercase tracking-wider font-mono transition-colors"
                      >
                          Clear Filter
                      </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>


      {/* Modals */}
      <DocViewer 
        isOpen={showDocs} 
        onClose={() => setShowDocs(false)} 
        currentFramework={currentFramework}
        completedPhases={completedPhases}
      />
      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
      />
      <PlaywrightRunner
        isOpen={showTesting}
        onClose={() => setShowTesting(false)}
      />

      {toast && <Toast message={toast.message} type={toast.type} action={toast.action} />}
    </div>
  );
};

export default App;
