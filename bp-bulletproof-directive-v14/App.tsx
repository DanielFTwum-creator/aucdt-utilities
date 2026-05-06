import React, { useState, useEffect } from 'react';
import { Framework, ToastMessage, AuditLog } from './types';
import { FRAMEWORKS } from './constants';
import { PhaseCard } from './components/PhaseCard';
import { ProgressBar } from './components/ProgressBar';
import { Toast } from './components/Toast';
import { Icons } from './components/Icons';
import { DocViewer } from './components/DocViewer';
import { AdminPanel } from './components/AdminPanel';
import { HelpModal } from './components/HelpModal';
import { Tooltip } from './components/Tooltip';
import { PrimaryAIAgent } from './components/PrimaryAIAgent';

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
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // AI Assistant Control
  const [assistantInput, setAssistantInput] = useState<string | undefined>(undefined);
  const [forceOpenAssistant, setForceOpenAssistant] = useState(false);

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

  const refineDirective = (text: string) => {
    setAssistantInput(`Can you help me refine this Phase Directive for better results?\n\n\`\`\`\n${text}\n\`\`\``);
    setForceOpenAssistant(true);
    setTimeout(() => setForceOpenAssistant(false), 100);
    logAction('AI_REFINE', 'Triggered AI refinement');
  };

  const copyToClipboard = async (text: string, phaseId: number, isAuto: boolean = false) => {
    try {
      await navigator.clipboard.writeText(text);
      const message = isAuto
        ? `Phase ${phaseId} directive ready!`
        : `Phase ${phaseId} directive copied!`;
      
      showToast(message, 'success', {
        label: 'Refine with AI',
        onClick: () => refineDirective(text)
      });
      if (!isAuto) logAction('COPY_DIRECTIVE', `Phase ${phaseId}`);
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
    <div className="min-h-screen relative font-sans selection:bg-accent-primary/30 selection:text-text-primary pb-20 overflow-x-hidden">

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* ── Header ── */}
        <header className="mb-10 animate-slide-up">
          {/* Top bar: logo + nav */}
          <div className="flex items-center justify-between gap-4 mb-8">
            {/* Logotype */}
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 shrink-0 animate-gold-pulse">
                <div className="absolute inset-0 rounded-xl bg-accent-primary/10 rotate-3" />
                <div className="relative w-full h-full rounded-xl border border-accent-primary/30 bg-bg-tertiary flex items-center justify-center">
                  <span className="font-display text-2xl text-accent-primary leading-none tracking-widest">BP</span>
                </div>
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl tracking-widest text-gold-shimmer leading-none">
                  Bulletproof Directive
                </h1>
                <p className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em] mt-1">
                  Compliance Workflow Dashboard
                  <span className="ml-2 px-1.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary/70 text-[9px] font-bold">v14</span>
                </p>
              </div>
            </div>

            {/* Nav actions */}
            <nav className="flex items-center gap-1" aria-label="Application controls">
              <Tooltip content={`Switch to ${theme === 'dark' ? 'Light' : theme === 'light' ? 'High Contrast' : 'Dark'} Mode`}>
                <button type="button" onClick={toggleTheme} aria-label={getThemeLabel()}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-all">
                  {getThemeIcon()}
                </button>
              </Tooltip>
              <Tooltip content="Help & Support">
                <button type="button" onClick={() => setShowHelp(true)} aria-label="Help"
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-all">
                  <Icons.HelpCircle className="w-4 h-4" />
                </button>
              </Tooltip>
              <Tooltip content="Documentation">
                <button type="button" onClick={() => setShowDocs(true)} aria-label="Documentation"
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-all">
                  <Icons.FileText className="w-4 h-4" />
                </button>
              </Tooltip>
              <div className="w-px h-5 bg-border mx-1" aria-hidden="true" />
              <Tooltip content="Admin Security Panel">
                <button type="button" onClick={() => window.location.hash = '#/admin'} aria-label="Admin panel"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-bg-tertiary text-text-muted hover:border-accent-primary hover:text-accent-primary transition-all font-mono text-xs">
                  <Icons.Lock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              </Tooltip>
            </nav>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap items-center gap-3 mb-8 animate-fade-in anim-delay-1">
            <StatChip label="Phases" value={currentFramework.phases.length} color="text-text-secondary" />
            <StatChip label="Complete" value={completedPhases.length} color="text-emerald-400" highlight={completedPhases.length > 0} />
            <StatChip label="Pending" value={currentFramework.phases.length - completedPhases.length} color="text-text-muted" />
            <div className="h-4 w-px bg-border" aria-hidden="true" />
            <div className="flex-1 min-w-[180px] max-w-xs">
              <ProgressBar
                progress={progress}
                completedCount={completedPhases.length}
                totalCount={currentFramework.phases.length}
              />
            </div>
          </div>
        </header>

        {/* ── Framework Selection ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8 animate-fade-in anim-delay-2">
            {FRAMEWORKS.map(f => (
                <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                        setCurrentFramework(f);
                        setCompletedPhases([]);
                        setExpandedPhases([]);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 group ${
                        currentFramework.id === f.id
                            ? 'border-accent-primary/60 bg-accent-primary/5 shadow-[0_0_20px_rgba(200,168,75,0.08)]'
                            : 'border-border bg-bg-secondary hover:border-accent-primary/40 hover:bg-bg-tertiary'
                    }`}
                >
                    <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-mono text-sm font-bold leading-tight transition-colors ${currentFramework.id === f.id ? 'text-accent-primary' : 'text-text-primary group-hover:text-text-primary'}`}>
                            {f.title}
                        </h3>
                        <span className={`shrink-0 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                            currentFramework.id === f.id ? 'bg-accent-primary/20 text-accent-primary' : 'bg-bg-tertiary text-text-muted'
                        }`}>
                            {f.phases.length}ph
                        </span>
                    </div>
                </button>
            ))}
        </div>

        {/* ── Controls toolbar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 px-4 py-3 rounded-xl border border-border bg-bg-secondary/60 animate-fade-in anim-delay-3">
          {/* Filter tabs */}
          <div className="flex gap-1.5" role="tablist" aria-label="Phase filter">
            {(['all', 'completed', 'pending'] as const).map((f) => {
              const active = filter === f;
              const cls = `px-4 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
                active ? 'bg-accent-primary text-bg-primary' : 'text-text-muted hover:text-text-primary hover:bg-bg-tertiary'
              }`;
              return active
                ? <button key={f} type="button" role="tab" aria-selected="true"  onClick={() => setFilter(f)} className={cls}>{f}</button>
                : <button key={f} type="button" role="tab" aria-selected="false" onClick={() => setFilter(f)} className={cls}>{f}</button>;
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <ControlBtn onClick={expandAll}    icon={<Icons.Maximize />} label="Expand"   tooltip="Open all phase cards" />
            <ControlBtn onClick={collapseAll}  icon={<Icons.Minimize />} label="Collapse" tooltip="Close all phase cards" />
            <ControlBtn onClick={resetProgress} icon={<Icons.Refresh />}  label="Reset"    tooltip="Clear all progress" />
          </div>
        </div>

        {/* Phase Grid */}
        <div className="grid gap-6">
          {filteredPhases.length > 0 ? (
            filteredPhases.map((phase, idx) => (
                <div key={phase.id} className={`animate-slide-up phase-delay-${Math.min(idx, 9)}`}>
                <PhaseCard
                    phase={phase}
                    isExpanded={expandedPhases.includes(phase.id)}
                    isCompleted={completedPhases.includes(phase.id)}
                    onToggleExpand={() => togglePhase(phase.id)}
                    onToggleComplete={() => toggleCompletion(phase.id)}
                    onCopyDirective={() => copyToClipboard(phase.directive, phase.id)}
                    onRefineDirective={(text) => refineDirective(text)}
                />
                </div>
            ))
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-3xl animate-fade-in bg-bg-secondary/50">
                <div className="mb-4 inline-flex p-4 rounded-full bg-bg-tertiary text-text-muted">
                    <Icons.AlertCircle className="w-8 h-8" />
                </div>
                <p className="text-text-secondary font-mono text-lg">No {filter} phases found.</p>
                <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className="mt-4 text-accent-primary hover:text-accent-secondary text-sm font-bold uppercase tracking-wider font-mono transition-colors"
                >
                    Clear Filter
                </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-border text-center text-text-muted pb-10">
          <p className="font-mono text-sm mb-2 text-text-primary">Compliance Workflow Dashboard</p>
          <p className="text-sm">Ensuring production-grade quality for every deployment.</p>
          <div className="mt-2 text-xs text-text-muted opacity-50 font-mono">
            React 19.2.4 Verified
          </div>
        </footer>
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
      
      {/* AI Assistant Chat */}
      <PrimaryAIAgent 
        externalInput={assistantInput} 
        onInputConsumed={() => setAssistantInput(undefined)}
        forceOpen={forceOpenAssistant}
      />

      {toast && <Toast message={toast.message} type={toast.type} action={toast.action} />}
    </div>
  );
};

const ControlBtn: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string; tooltip?: string }> = ({ onClick, icon, label, tooltip }) => (
  <Tooltip content={tooltip || label}>
    <button
      type="button"
      onClick={onClick}
      aria-label={tooltip || label}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-tertiary border border-border text-text-primary text-sm font-mono font-medium hover:bg-bg-secondary hover:border-accent-primary transition-all duration-200 active:scale-95"
    >
      {React.isValidElement(icon) 
        ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4" }) 
        : icon
      }
      <span>{label}</span>
    </button>
  </Tooltip>
);

const StatChip: React.FC<{ label: string; value: number; color: string; highlight?: boolean }> = ({ label, value, color, highlight }) => (
  <div className={`flex items-baseline gap-1.5 px-3 py-1.5 rounded-lg border bg-bg-secondary ${highlight ? 'border-accent-primary/20' : 'border-border'}`}>
    <span className={`font-mono text-lg font-bold leading-none ${color}`}>{value}</span>
    <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">{label}</span>
  </div>
);

export default App;
