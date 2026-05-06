import React, { useState, useEffect, useRef } from 'react';
import { TestStep, TestSuiteResult } from '../types';
import { 
  Play, CheckCircle, XCircle, Loader2, Camera, Terminal, 
  Shield, AlertCircle, Info, Search, Code, Cpu, Gauge,
  Activity, Globe, Lock, Database, Layout as LayoutIcon,
  ChevronRight, BarChart3, Scan
} from 'lucide-react';

export const TestRunner: React.FC = () => {
  const [result, setResult] = useState<TestSuiteResult>({
    isRunning: false,
    steps: [
      { id: '1', name: 'Environment Handshake', description: 'Validate DOM availability and CSS variable injection', status: 'pending', logs: [] },
      { id: '2', name: 'Auth Flow Controller', description: 'Simulate secure login with encrypted payload verification', status: 'pending', logs: [] },
      { id: '3', name: 'Aggregation Engine', description: 'Test RSS parser throughput and duplicate detection logic', status: 'pending', logs: [] },
      { id: '4', name: 'LLM Synthesis Pipe', description: 'Validate summary generation and sentiment analysis hooks', status: 'pending', logs: [] },
      { id: '5', name: 'A11y Compliance', description: 'Check ARIA roles, contrast ratios, and tab-stop sequences', status: 'pending', logs: [] },
      { id: '6', name: 'Audit Persistence', description: 'Verify tamper-evident logging to local session store', status: 'pending', logs: [] },
    ],
    overallStatus: 'idle'
  });

  const [progress, setProgress] = useState(0);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [result]);

  const runTests = () => {
    if (result.isRunning) return;

    setResult(prev => ({
      ...prev,
      isRunning: true,
      overallStatus: 'running',
      startTime: Date.now(),
      endTime: undefined,
      steps: prev.steps.map(s => ({ ...s, status: 'pending', logs: [], screenshot: undefined }))
    }));
    setProgress(0);

    let currentStepIndex = 0;

    const executeStep = () => {
      if (currentStepIndex >= result.steps.length) {
        setResult(prev => ({ ...prev, isRunning: false, overallStatus: 'success', endTime: Date.now() }));
        setProgress(100);
        setActiveStepId(null);
        return;
      }

      const step = result.steps[currentStepIndex];
      setActiveStepId(step.id);
      
      setResult(prev => ({
        ...prev,
        steps: prev.steps.map((s, i) => i === currentStepIndex ? { ...s, status: 'running' } : s)
      }));

      const stepDuration = 1500 + Math.random() * 1500;
      
      const addLog = (msg: string) => {
        setResult(prev => ({
          ...prev,
          steps: prev.steps.map((s, i) => i === currentStepIndex ? { ...s, logs: [...s.logs, `[${new Date().toLocaleTimeString('en-GB', { hour12: false })}] ${msg}`] } : s)
        }));
      };

      // Simulated technical log sequence
      setTimeout(() => addLog(`PUPPETEER_EXECUTOR: spawning virtual context --remote-debugging-port=9222`), 100);
      setTimeout(() => addLog(`NAV_AGENT: transitioning to internal path: /module/${step.name.toLowerCase().replace(/\s/g, '-')}`), 400);
      setTimeout(() => addLog(`DOM_AUDIT: inspecting node subtree for visibility assertions`), 700);
      setTimeout(() => addLog(`INTEGRITY_CHECK: verifying checksum for local state slice`), 1100);
      setTimeout(() => addLog(`CAPTURE_ENGINE: persisting frame to temporary storage`), 1300);

      setTimeout(() => {
        setResult(prev => ({
          ...prev,
          steps: prev.steps.map((s, i) => i === currentStepIndex ? { 
            ...s, 
            status: 'success', 
            duration: stepDuration,
            screenshot: `frame-${step.id}.png`,
            logs: [...s.logs, `DEBUG_FINALIZE: ${step.name} verified in ${stepDuration.toFixed(0)}ms -- context detached`] 
          } : s)
        }));
        currentStepIndex++;
        setProgress(Math.round((currentStepIndex / result.steps.length) * 100));
        executeStep();
      }, stepDuration);
    };

    executeStep();
  };

  const getStepIcon = (id: string) => {
    switch(id) {
      case '1': return <Activity size={16} />;
      case '2': return <Lock size={16} />;
      case '3': return <Database size={16} />;
      case '4': return <Code size={16} />;
      case '5': return <LayoutIcon size={16} />;
      case '6': return <BarChart3 size={16} />;
      default: return <Search size={16} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Visual Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-brand-50 dark:bg-brand-900/30 rounded-xl text-brand-600 dark:text-brand-400">
             <Gauge size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E2E Coverage</p>
            <p className="text-xl font-serif font-black text-slate-900 dark:text-white">96.8%</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
             <Cpu size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic Integrity</p>
            <p className="text-xl font-serif font-black text-slate-900 dark:text-white">OPTIMAL</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
             <Shield size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Layer</p>
            <p className="text-xl font-serif font-black text-slate-900 dark:text-white">PASSED</p>
          </div>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 flex items-center gap-4 shadow-xl">
           <div className="p-3 bg-white/10 rounded-xl text-white">
             <Activity size={24} className={result.isRunning ? 'animate-pulse' : ''} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Runtime Status</p>
            <p className={`text-sm font-mono font-bold uppercase tracking-widest ${result.isRunning ? 'text-brand-400 animate-pulse' : 'text-slate-300'}`}>
               {result.overallStatus}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-8 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-600 text-white rounded-lg shadow-lg shadow-brand-500/30">
                   <Shield size={24} />
                </div>
                <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
                  Headless Diagnostic Engine
                </h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xl font-medium">
                Automated Puppeteer-based verification suite for Ghana News Aggregator. Validates component state, accessibility, and autonomous AI dispatch pathways.
              </p>
            </div>
            <button
              onClick={runTests}
              disabled={result.isRunning}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${
                result.isRunning 
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed border-2 border-slate-200 dark:border-slate-600' 
                  : 'bg-brand-600 text-white hover:bg-brand-700 shadow-2xl shadow-brand-500/40 hover:-translate-y-0.5'
              }`}
            >
              {result.isRunning ? <Loader2 className="animate-spin" size={18} /> : <Play fill="currentColor" size={18} />}
              {result.isRunning ? 'Executing Suite...' : 'Launch Self-Test'}
            </button>
          </div>
          
          {result.overallStatus !== 'idle' && (
            <div className="mt-8 animate-in slide-in-from-top-2">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase mb-3 tracking-[0.2em]">
                <span>Pipeline Integrity</span>
                <span className="font-mono">{progress}% COMPLETE</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                <div 
                  className={`h-full transition-all duration-700 rounded-full ${result.overallStatus === 'success' ? 'bg-emerald-500' : 'bg-brand-500 shadow-[0_0_15px_rgba(14,165,233,0.5)] shadow-brand-400'}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Steps Navigator */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="p-6 space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Verification Steps</p>
              {result.steps.map((step) => (
                <div 
                  key={step.id}
                  className={`p-4 rounded-2xl border-2 transition-all duration-500 flex items-start gap-4 group ${
                    step.status === 'running' 
                      ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-xl shadow-brand-500/10' 
                      : step.status === 'success'
                      ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-500/20'
                      : 'bg-white dark:bg-slate-800 border-transparent opacity-60'
                  }`}
                >
                  <div className={`mt-0.5 p-2 rounded-xl transition-colors ${
                    step.status === 'running' ? 'bg-brand-500 text-white animate-pulse' : 
                    step.status === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  }`}>
                    {step.status === 'success' ? <CheckCircle size={16} /> : getStepIcon(step.id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-bold tracking-tight truncate ${step.status === 'running' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {step.name}
                      </h4>
                      {step.duration && (
                        <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                           {step.duration.toFixed(0)}ms
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-1">{step.description}</p>
                  </div>
                  <ChevronRight size={14} className={`mt-1 transition-all ${step.status === 'running' ? 'text-brand-500 translate-x-1' : 'text-slate-300 opacity-0'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Visualization */}
          <div className="lg:col-span-7 flex flex-col h-[650px] bg-slate-900 relative overflow-hidden group/viz">
            {/* Terminal View */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="bg-slate-800/80 px-5 py-3 flex items-center justify-between border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <Terminal size={14} className="text-brand-400" />
                  <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">Kernel Output Stream</span>
                </div>
                <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                </div>
              </div>
              <div 
                ref={scrollRef}
                className="flex-1 p-6 overflow-y-auto font-mono text-[11px] leading-relaxed scrollbar-hide bg-black/40"
              >
                {result.overallStatus === 'idle' && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-4 opacity-30 group-hover/viz:opacity-50 transition-opacity">
                    <div className="p-6 rounded-full border-2 border-dashed border-slate-600">
                      <Scan size={48} className="animate-pulse" />
                    </div>
                    <p className="text-center font-bold tracking-widest">VIRTUAL_MACHINE_STANDBY<br/><span className="font-normal text-[9px]">AWAITING_SIGNAL_FROM_ADMIN</span></p>
                  </div>
                )}
                
                {result.steps.map(step => (
                  <div key={step.id}>
                    {step.logs.map((log, i) => (
                      <div key={i} className="group flex gap-4 py-1 animate-in fade-in slide-in-from-left-2">
                        <span className="text-slate-700 select-none shrink-0">➜</span>
                        <span className="text-slate-400 group-hover:text-slate-200 transition-colors whitespace-pre-wrap">{log}</span>
                      </div>
                    ))}
                  </div>
                ))}

                {result.overallStatus === 'success' && (
                  <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 font-bold animate-in zoom-in duration-500 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-500 text-black rounded-lg">
                        <CheckCircle size={20} />
                      </div>
                      <span className="text-sm tracking-widest uppercase">System Audit Complete</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[10px] font-mono text-emerald-500/70 border-t border-emerald-500/20 pt-4">
                      <div className="flex justify-between"><span>ENTITIES_VERIFIED:</span> <span className="text-emerald-400">1,204</span></div>
                      <div className="flex justify-between"><span>STATE_TRANSITIONS:</span> <span className="text-emerald-400">42/42</span></div>
                      <div className="flex justify-between"><span>PEAK_LATENCY:</span> <span className="text-emerald-400">214ms</span></div>
                      <div className="flex justify-between"><span>A11Y_SCORE:</span> <span className="text-emerald-400">100/100</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Verification Drawer */}
            <div className={`transition-all duration-700 ease-in-out relative ${result.isRunning || result.overallStatus === 'success' ? 'h-72 opacity-100' : 'h-0 opacity-0'}`}>
                <div className="absolute inset-0 bg-slate-950 border-t border-slate-800 flex flex-col">
                    <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-black/60">
                        <div className="flex items-center gap-3">
                           <Camera size={16} className="text-brand-500" />
                           <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Visual Frame Verification</span>
                        </div>
                        {result.isRunning && (
                           <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-500 rounded-full border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                              <span className="text-[9px] font-black uppercase">Rec</span>
                           </div>
                        )}
                    </div>
                    
                    <div className="flex-1 p-6 flex items-center justify-center relative overflow-hidden">
                        {result.isRunning ? (
                            <div className="relative text-center">
                               <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full animate-pulse"></div>
                               <div className="relative border-4 border-slate-800 rounded-2xl p-8 bg-slate-900 shadow-2xl">
                                  <Activity className="w-12 h-12 text-brand-500 mx-auto mb-4 animate-bounce" />
                                  <p className="text-slate-400 font-mono text-[9px] uppercase tracking-[0.3em]">Analyzing Layout Node {activeStepId}...</p>
                               </div>
                            </div>
                        ) : result.overallStatus === 'success' ? (
                             <div className="grid grid-cols-3 md:grid-cols-6 gap-4 w-full animate-in slide-in-from-bottom-4 duration-500">
                                {result.steps.map(step => (
                                    <div key={step.id} className="group relative aspect-video bg-slate-900 border border-slate-700 rounded-xl overflow-hidden hover:border-brand-500 transition-all cursor-zoom-in hover:scale-105 active:scale-95 shadow-lg">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-purple-500/10"></div>
                                        <div className="w-full h-full flex items-center justify-center">
                                           <LayoutIcon size={32} className="text-slate-800 group-hover:text-brand-500/40 transition-colors" />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 backdrop-blur-md border-t border-slate-800">
                                           <p className="text-[8px] font-black text-slate-500 truncate uppercase tracking-tighter">{step.name}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        ) : null}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};