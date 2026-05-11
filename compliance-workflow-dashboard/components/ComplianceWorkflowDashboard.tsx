import React, { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { Theme, PhaseStatus, PhaseStatuses } from '../types';
import { FRAMEWORKS } from '../constants';
import { CheckCircle2, Circle, Clock, AlertCircle, Copy, Check, ChevronDown, ChevronRight, Lock, Beaker, Loader } from './icons';
import { useLocalStorage } from '../hooks';
import ThemeSwitcher from './ThemeSwitcher';

// Lazy-loaded: defers @google/genai SDK + 80-test suite out of the initial bundle
const PlaywrightSelfTest = lazy(() => import('./PlaywrightSelfTest'));
// Lazy-loaded: modal never needed on first render
const AdminPanel = lazy(() => import('./AdminPanel'));

const ComplianceWorkflowDashboard = () => {
  const [selectedFramework, setSelectedFramework] = useState('standard');
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [phaseStatuses, setPhaseStatuses] = useLocalStorage<PhaseStatuses>('compliance-progress', {});
  const [copiedPhase, setCopiedPhase] = useState<string | null>(null);
  const [copiedItemsPhase, setCopiedItemsPhase] = useState<string | null>(null);
  const [theme, setTheme] = useLocalStorage<Theme>('compliance-theme', 'light');
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'testing'>('dashboard');

  const dashboardPanelRef = useRef<HTMLDivElement>(null);
  const testingPanelRef = useRef<HTMLDivElement>(null);

  // Apply theme to the document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-theme', theme);
  }, [theme]);

  // Manage focus between views
  useEffect(() => {
    if (activeView === 'dashboard') {
      dashboardPanelRef.current?.focus();
    } else {
      testingPanelRef.current?.focus();
    }
  }, [activeView]);


  const updatePhaseStatus = (phaseId: string, status: PhaseStatus) => {
    setPhaseStatuses(prevStatuses => {
        const newStatuses = { ...prevStatuses };
        if (status === null) {
            delete newStatuses[phaseId];
        } else {
            newStatuses[phaseId] = status;
        }
        return newStatuses;
    });
  };

  const copyToClipboard = async (text: string, phaseId: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPhase(phaseId);
      setTimeout(() => setCopiedPhase(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyItemsToClipboard = async (items: string[], phaseId: string) => {
    if (!items || items.length === 0) return;
    const text = items.map(item => `- ${item}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItemsPhase(phaseId);
      setTimeout(() => setCopiedItemsPhase(null), 2000);
    } catch (err) {
      console.error('Failed to copy items:', err);
    }
  };

  const getStatusIcon = (phaseId: string) => {
    const status = phaseStatuses[phaseId];
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'blocked':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500" />;
    }
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress for this framework? This cannot be undone.')) {
        const newStatuses = { ...phaseStatuses };
        FRAMEWORKS[selectedFramework].phases.forEach(phase => {
            delete newStatuses[phase.id];
        });
        setPhaseStatuses(newStatuses);
    }
  };

  const currentFramework = FRAMEWORKS[selectedFramework];

  // Logic to calculate overall progress percentage
  // Automatically updates when phaseStatuses or currentFramework changes
  const progressStats = useMemo(() => {
    const totalPhases = currentFramework.phases.length;
    const completedPhases = currentFramework.phases.filter(p => phaseStatuses[p.id] === 'complete').length;
    const percentage = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;
    
    return {
      total: totalPhases,
      completed: completedPhases,
      percentage
    };
  }, [currentFramework, phaseStatuses]);

  const { percentage: progress, completed, total } = progressStats;

  // Derive a CSS-safe color for the glow from the framework's Tailwind color class
  const getFrameworkGlowColor = () => {
    const colorMap: Record<string, string> = {
      'bg-blue-500':   '59,130,246',
      'bg-purple-500': '168,85,247',
      'bg-red-600':    '220,38,38',
      'bg-emerald-600':'5,150,105',
      'bg-indigo-600': '79,70,229',
      'bg-teal-600':   '13,148,136',
    };
    return colorMap[currentFramework.color] ?? '197,160,89';
  };

  const glowRgb = getFrameworkGlowColor();

  return (
    <>
      {/* ─── Global Surface: Radial gradient background ─── */}
      <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-[#F8F4EC] to-[#F0EAD8] dark:from-[#120E0B] dark:via-[#16110D] dark:to-[#1A140F] p-4 sm:p-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">

          {/* ─── Header ─── */}
          <header className="relative bg-white/80 dark:bg-[#1E1812]/80 backdrop-blur-md border-b-4 border-[#C5A059] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(197,160,89,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(197,160,89,0.08)] p-6 mb-6 overflow-hidden hc-bg hc-border">
            {/* Subtle gold shimmer accent top-right */}
            <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#C5A059]/10 blur-3xl" aria-hidden="true" />
            <div className="flex justify-between items-start gap-4 relative">
              <div>
                {/* Gold gradient title */}
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-[#2D241E] via-[#C5A059] to-[#8B6914] dark:from-[#EAE0D5] dark:via-[#C5A059] dark:to-[#A07830] bg-clip-text text-transparent hc-text-yellow">
                  Compliance Workflow Dashboard
                </h1>
                <p className="text-gray-500 dark:text-[#C5A059]/80 text-sm sm:text-base mt-1 hc-text">
                  AI Studio Project Refresh &amp; Compliance Implementation Tracker
                </p>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <ThemeSwitcher theme={theme} setTheme={setTheme} />
                <button
                  onClick={() => setIsAdminPanelOpen(true)}
                  className="p-2 rounded-full transition-all duration-200 text-[#2D241E] hover:text-[#C5A059] dark:text-[#EAE0D5] dark:hover:text-[#C5A059] bg-black/5 dark:bg-white/5 hover:bg-[#C5A059]/10 dark:hover:bg-[#C5A059]/10 border border-black/[0.06] dark:border-white/[0.06] hc-bg hc-border hc-text"
                  aria-label="Open Admin Panel"
                  title="Open Admin Panel"
                >
                  <Lock className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* ─── View Tabs ─── */}
          <div className="mb-6">
            <div className="border-b border-black/[0.08] dark:border-white/[0.08] hc-border">
              <nav className="-mb-px flex space-x-6" aria-label="View Selection" role="tablist">
                <button
                  id="dashboard-tab"
                  role="tab"
                  aria-selected={activeView === 'dashboard'}
                  aria-controls="dashboard-panel"
                  onClick={() => setActiveView('dashboard')}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:ring-offset-2 dark:focus:ring-offset-[#120E0B] ${
                    activeView === 'dashboard'
                      ? 'border-[#C5A059] text-[#2D241E] dark:text-[#C5A059] hc-text-yellow hc-border'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-slate-600'
                  }`}
                >
                  <CheckCircle2 className="-ml-0.5 mr-2 h-5 w-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  id="testing-tab"
                  role="tab"
                  aria-selected={activeView === 'testing'}
                  aria-controls="testing-panel"
                  onClick={() => setActiveView('testing')}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:ring-offset-2 dark:focus:ring-offset-[#120E0B] ${
                    activeView === 'testing'
                      ? 'border-[#C5A059] text-[#2D241E] dark:text-[#C5A059] hc-text-yellow hc-border'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-slate-600'
                  }`}
                >
                  <Beaker className="-ml-0.5 mr-2 h-5 w-5" />
                  <span>Playwright Self-Test</span>
                </button>
              </nav>
            </div>
          </div>
          
          {activeView === 'dashboard' ? (
            <div 
              id="dashboard-panel" 
              role="tabpanel" 
              aria-labelledby="dashboard-tab"
              tabIndex={-1}
              ref={dashboardPanelRef}
              className="outline-none"
            >
              {/* ─── Framework Selector ─── */}
              <section className="bg-white/70 dark:bg-[#1E1812]/70 backdrop-blur-sm rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] border border-black/[0.05] dark:border-white/[0.05] p-6 mb-6 hc-bg hc-border">
                <h2 className="text-lg font-semibold text-[#2D241E] dark:text-[#EAE0D5] mb-4 tracking-tight hc-text-yellow">Select Framework</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {Object.entries(FRAMEWORKS).map(([key, framework]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedFramework(key)}
                      aria-pressed={selectedFramework === key}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#120E0B] focus:ring-[#C5A059] hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${
                        selectedFramework === key
                          ? `${framework.color} text-white border-transparent shadow-lg`
                          : 'bg-white/80 text-gray-700 border-black/[0.08] hover:border-[#C5A059]/50 hover:bg-[#C5A059]/5 dark:bg-[#2A211A]/80 dark:text-[#EAE0D5] dark:border-white/[0.08] dark:hover:border-[#C5A059]/50 dark:hover:bg-[#C5A059]/5 hc-bg hc-border hc-text'
                      }`}
                    >
                      {/* Lit overlay for selected state */}
                      {selectedFramework === key && (
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" aria-hidden="true" />
                      )}
                      <div className="relative font-semibold text-sm">{framework.name}</div>
                      <div className="relative text-xs mt-1 opacity-80">{framework.phases.length} phases</div>
                    </button>
                  ))}
                </div>
              </section>

              {/* ─── Progress Bar & Summary (Sticky + Glassmorphism) ─── */}
              <section className="sticky top-0 z-20 bg-white/90 dark:bg-[#1A1410]/90 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-black/[0.06] dark:border-white/[0.06] p-6 mb-6 hc-bg hc-border">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-[#2D241E] dark:text-[#EAE0D5] tracking-tight hc-text-yellow">Overall Progress</h2>
                  <button
                    onClick={resetProgress}
                    className="text-sm text-red-500/80 hover:text-red-600 dark:text-red-400/80 dark:hover:text-red-400 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded"
                  >
                    Reset Progress
                  </button>
                </div>

                {/* Glow progress bar */}
                <div 
                  className="w-full bg-black/[0.06] dark:bg-white/[0.06] rounded-full h-4 mb-2 overflow-hidden hc-bg hc-border"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${currentFramework.name} completion progress`}
                >
                  <div
                    className={`h-4 rounded-full ${currentFramework.color} transition-all duration-500 ease-out`}
                    style={{
                      width: `${progress}%`,
                      boxShadow: progress > 0 ? `0 0 12px 2px rgba(${glowRgb},0.55), 0 0 4px 1px rgba(${glowRgb},0.35)` : 'none',
                    }}
                  />
                </div>

                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 hc-text">{progress}% Complete ({completed}/{total} phases)</p>
                  {progress === 100 && (
                    <span className="text-sm font-bold text-emerald-500 animate-pulse flex items-center bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Framework Completed!
                    </span>
                  )}
                </div>
                
                {/* Executive Summary */}
                <div className="border-t border-black/[0.06] dark:border-white/[0.06] pt-4">
                  <h3 className="text-sm font-semibold text-[#2D241E] dark:text-[#EAE0D5] mb-2">Executive Summary</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {progress === 100 
                      ? `All phases for ${currentFramework.name} have been successfully implemented and verified.`
                      : `Current focus: ${completed} of ${total} phases completed. Ensure all requirements for the active phase are met before proceeding.`
                    }
                  </p>
                </div>
              </section>

              {/* ─── Phase List ─── */}
              <main className="space-y-4">
                {currentFramework.phases.map((phase) => {
                  const statusVal = phaseStatuses[phase.id];
                  // Derive left-border color from framework color class
                  const accentBorder = currentFramework.color
                    .replace('bg-', 'border-l-')
                    .replace('-500', '-500')
                    .replace('-600', '-600');

                  return (
                    <div
                      key={phase.id}
                      className={`bg-white/80 dark:bg-[#1E1812]/80 backdrop-blur-sm rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_6px_24px_rgba(0,0,0,0.5)] border border-black/[0.05] dark:border-white/[0.05] overflow-hidden transition-all duration-300 border-l-4 ${accentBorder} hc-bg hc-border`}
                    >
                      {/* Phase Header */}
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1 min-w-0">
                            <div className="mt-1 flex-shrink-0">
                              {getStatusIcon(phase.id)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-[#2D241E] dark:text-[#EAE0D5] mb-2 truncate hc-text-yellow">{phase.name}</h3>

                              {/* Item Pills — translucent */}
                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex flex-wrap gap-2">
                                  {phase.items.map((item, i) => (
                                    <span
                                      key={i}
                                      className="text-xs bg-black/[0.06] text-gray-700 dark:bg-white/[0.07] dark:text-[#D4C5A9] px-3 py-1 rounded-full border border-black/[0.04] dark:border-white/[0.06] backdrop-blur-sm hc-bg hc-border hc-text"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyItemsToClipboard(phase.items, phase.id);
                                  }}
                                  className="p-1.5 rounded-md hover:bg-black/[0.06] dark:hover:bg-white/[0.06] text-gray-400 hover:text-[#C5A059] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                                  title="Copy items list"
                                  aria-label={`Copy items list for ${phase.name}`}
                                >
                                  {copiedItemsPhase === phase.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                            {phase.directive && (
                              <button
                                onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                                className="p-2 hover:bg-black/[0.06] dark:hover:bg-white/[0.06] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#C5A059] hc-hover-bg-gray"
                                aria-expanded={expandedPhase === phase.id}
                                aria-controls={`directive-${phase.id}`}
                                aria-label={expandedPhase === phase.id ? `Collapse directive for ${phase.name}` : `Expand directive for ${phase.name}`}
                              >
                                {expandedPhase === phase.id ? (
                                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 hc-text" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400 hc-text" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* ─── Status Controls — Segmented Control Design ─── */}
                        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={`Status for ${phase.name}`}>
                          {/* Wrapper gives the "segmented" visual */}
                          <div className="inline-flex rounded-xl overflow-hidden border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.03] p-0.5 gap-0.5">
                            <button 
                              onClick={() => updatePhaseStatus(phase.id, 'in-progress')} 
                              aria-pressed={statusVal === 'in-progress'}
                              aria-label={`Mark ${phase.name} as In Progress`}
                              className={`hc-btn px-3 py-1.5 rounded-[10px] text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400 ${
                                statusVal === 'in-progress'
                                  ? 'bg-yellow-500 text-white shadow-sm ring-2 ring-yellow-400/40 ring-offset-1 dark:ring-offset-[#1E1812]'
                                  : 'text-gray-600 hover:bg-black/[0.05] dark:text-[#C5B99A] dark:hover:bg-white/[0.06]'
                              }`}
                            >
                              In Progress
                            </button>
                            <button 
                              onClick={() => updatePhaseStatus(phase.id, 'complete')} 
                              aria-pressed={statusVal === 'complete'}
                              aria-label={`Mark ${phase.name} as Complete`}
                              className={`hc-btn px-3 py-1.5 rounded-[10px] text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-400 ${
                                statusVal === 'complete'
                                  ? 'bg-green-500 text-white shadow-sm ring-2 ring-green-400/40 ring-offset-1 dark:ring-offset-[#1E1812]'
                                  : 'text-gray-600 hover:bg-black/[0.05] dark:text-[#C5B99A] dark:hover:bg-white/[0.06]'
                              }`}
                            >
                              Complete
                            </button>
                            <button 
                              onClick={() => updatePhaseStatus(phase.id, 'blocked')} 
                              aria-pressed={statusVal === 'blocked'}
                              aria-label={`Mark ${phase.name} as Blocked`}
                              className={`hc-btn px-3 py-1.5 rounded-[10px] text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-400 ${
                                statusVal === 'blocked'
                                  ? 'bg-red-500 text-white shadow-sm ring-2 ring-red-400/40 ring-offset-1 dark:ring-offset-[#1E1812]'
                                  : 'text-gray-600 hover:bg-black/[0.05] dark:text-[#C5B99A] dark:hover:bg-white/[0.06]'
                              }`}
                            >
                              Blocked
                            </button>
                          </div>
                          {statusVal && (
                            <button 
                              onClick={() => updatePhaseStatus(phase.id, null)} 
                              aria-label={`Clear status for ${phase.name}`}
                              className="hc-btn px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm font-medium bg-black/[0.04] dark:bg-white/[0.04] text-gray-500 dark:text-[#C5B99A] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.06] transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      {/* ─── Expandable Directive — MacOS Editor Window ─── */}
                      {phase.directive && expandedPhase === phase.id && (
                        <div
                          id={`directive-${phase.id}`}
                          className="border-t border-black/[0.06] dark:border-white/[0.06] hc-bg hc-border"
                        >
                          {/* MacOS window chrome */}
                          <div className="bg-[#2A2118] dark:bg-[#0F0C09] px-4 py-3 flex items-center justify-between gap-3 border-b border-white/[0.06]">
                            {/* Traffic lights */}
                            <div className="flex items-center gap-1.5" aria-hidden="true">
                              <span className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-sm" />
                              <span className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-sm" />
                              <span className="w-3 h-3 rounded-full bg-[#28C840] shadow-sm" />
                              <span className="ml-3 text-xs text-white/30 font-mono select-none">directive.sh</span>
                            </div>
                            <h4 className="font-semibold text-[#EAE0D5]/70 text-xs tracking-wider uppercase">Copy &amp; Paste Directive</h4>
                            <button
                              onClick={() => copyToClipboard(phase.directive || '', phase.id)}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#C5A059] text-[#1A1208] rounded-lg hover:bg-[#D4B070] active:bg-[#B08D4C] transition-all text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C5A059] focus:ring-offset-[#2A2118]"
                              aria-label={`Copy directive for ${phase.name}`}
                            >
                              {copiedPhase === phase.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          {/* Code body */}
                          <pre className="bg-[#1C1510] dark:bg-[#0A0806] text-[#C8B99A] p-5 text-sm overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed selection:bg-[#C5A059]/30 selection:text-white hc-bg-code hc-text-code">
                            {phase.directive}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </main>

              {/* ─── Footer ─── */}
              <footer className="mt-8 bg-white/60 dark:bg-[#1E1812]/60 backdrop-blur-sm border border-[#C5A059]/20 dark:border-[#C5A059]/10 rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] hc-bg-info">
                <h3 className="font-semibold text-[#2D241E] dark:text-[#C5A059] mb-3 tracking-tight hc-text-info">Usage Instructions</h3>
                <ul className="text-sm text-[#3E3228] dark:text-[#C5B99A] list-disc list-inside space-y-1.5 hc-text">
                  <li>Click the arrow icon on a phase to expand and view the full directive.</li>
                  <li>Use "Copy" to copy the phase instructions to your clipboard.</li>
                  <li>Use the copy icon next to the phase items to copy the list of items.</li>
                  <li>Paste the directive into AI Studio and wait for completion confirmation.</li>
                  <li>Mark phases as "In Progress", "Complete", or "Blocked" to track your progress.</li>
                  <li>Your progress is automatically saved and will persist across sessions.</li>
                  <li>Switch between frameworks to manage different compliance implementations.</li>
                </ul>
                <div className="mt-5 pt-4 border-t border-[#C5A059]/15 text-xs text-center text-[#2D241E] dark:text-[#EAE0D5] opacity-50">
                  System Version 3.0 • Project Refresh Baseline
                </div>
              </footer>
            </div>
          ) : (
            <div 
              id="testing-panel" 
              role="tabpanel" 
              aria-labelledby="testing-tab"
              tabIndex={-1}
              ref={testingPanelRef}
              className="outline-none"
            >
              <Suspense fallback={
                <div className="flex items-center justify-center py-20 gap-3 text-gray-400 dark:text-gray-500">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Loading test suite…</span>
                </div>
              }>
                <PlaywrightSelfTest />
              </Suspense>
            </div>
          )}

        </div>
      </div>
      <Suspense fallback={null}>
        <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
      </Suspense>
    </>
  );
};

export default ComplianceWorkflowDashboard;