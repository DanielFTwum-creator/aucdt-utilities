
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Grid, 
  Settings, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Microscope, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  FileText 
} from 'lucide-react';
import { PRESENTATION_SLIDES } from '../constants';
import { SlideType, SlideContent } from '../types';
import { 
  TitleSlide, 
  SectionSlide, 
  ContentSlide, 
  SplitSlide, 
  CTASlide, 
  UseCaseGridSlide, 
  SankeySlide 
} from './SlideLayouts';
import { AISandbox } from './AISandbox';

type Theme = 'light' | 'dark' | 'high-contrast';
type AdminTab = 'settings' | 'audit' | 'testing';

const SlideRenderer: React.FC<{ slide: SlideContent, onOpenSandbox: (prompt?: string, mode?: 'text' | 'image') => void }> = ({ slide, onOpenSandbox }) => {
  switch (slide.type) {
    case SlideType.TITLE: return <TitleSlide slide={slide} />;
    case SlideType.SECTION: return <SectionSlide slide={slide} />;
    case SlideType.CONTENT: return <ContentSlide slide={slide} onOpenSandbox={onOpenSandbox} />;
    case SlideType.USE_CASE_GRID: return <UseCaseGridSlide slide={slide} onOpenSandbox={onOpenSandbox} />;
    case SlideType.SPLIT: return <SplitSlide slide={slide} onOpenSandbox={onOpenSandbox} />;
    case SlideType.CTA: return <CTASlide slide={slide} />;
    case SlideType.SANKEY: return <SankeySlide slide={slide} />;
    default: return <ContentSlide slide={slide} onOpenSandbox={onOpenSandbox} />;
  }
};

const PresentationDeck: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [sandboxPrompt, setSandboxPrompt] = useState('');
  const [sandboxMode, setSandboxMode] = useState<'text' | 'image'>('text');
  
  // Admin & Security State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('settings');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [auditLogs, setAuditLogs] = useState<Array<{timestamp: number, action: string, details: any}>>([]);
  const [theme, setTheme] = useState<Theme>('light');
  const [testResult, setTestResult] = useState<{status: 'idle' | 'running' | 'pass' | 'fail', msg: string}>({status: 'idle', msg: ''});

  const currentSlideData = PRESENTATION_SLIDES[activeSlide];

  const addLog = useCallback((action: string, details: any = {}) => {
    const newLog = { timestamp: Date.now(), action, details };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  const changeSlide = useCallback((newIndex: number) => {
    if (newIndex === activeSlide || isTransitioning) return;
    setIsTransitioning(true);
    setActiveSlide(newIndex);
    addLog('NAV_SLIDE_CHANGE', { from: activeSlide, to: newIndex });
    setTimeout(() => setIsTransitioning(false), 500);
  }, [activeSlide, isTransitioning, addLog]);

  const goToNextSlide = useCallback(() => {
    if (activeSlide < PRESENTATION_SLIDES.length - 1) changeSlide(activeSlide + 1);
  }, [activeSlide, changeSlide]);

  const goToPrevSlide = useCallback(() => {
    if (activeSlide > 0) changeSlide(activeSlide - 1);
  }, [activeSlide, changeSlide]);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'smartscale2025') {
      setIsAuthenticated(true);
      addLog('ADMIN_AUTH_SUCCESS');
    } else {
      addLog('ADMIN_AUTH_FAIL', { attempt: passwordInput });
      alert('Access Denied: Invalid Administrative Credentials.');
      setPasswordInput('');
    }
  };

  const runSelfTest = () => {
    setTestResult({status: 'running', msg: 'Initiating System Diagnostic...'});
    addLog('DIAGNOSTIC_START');
    setTimeout(() => {
      const hasKey = !!process.env.API_KEY;
      if (hasKey) {
        setTestResult({status: 'pass', msg: 'System Clean: Gemini Link Operational.'});
        addLog('DIAGNOSTIC_PASS');
      } else {
        setTestResult({status: 'fail', msg: 'System Failure: API Environment Missing.'});
        addLog('DIAGNOSTIC_FAIL');
      }
    }, 1500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAdminOpen && !isAuthenticated) return;
      if (isSandboxOpen) {
        if (e.key === 'Escape') setIsSandboxOpen(false);
        return;
      }
      
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          goToNextSlide();
          break;
        case 'ArrowLeft':
          goToPrevSlide();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'n':
          setShowNotes(p => !p);
          break;
        case 'Escape':
          setShowOverview(false);
          setShowNotes(false);
          setIsAdminOpen(false);
          break;
        case 'a':
          if (!e.ctrlKey) setIsSandboxOpen(true);
          break;
        case 'A':
          if (e.ctrlKey && e.shiftKey) setIsAdminOpen(true);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide, isSandboxOpen, isAdminOpen, isAuthenticated]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const themeClasses = {
    'light': 'bg-white text-slate-900',
    'dark': 'bg-slate-950 text-slate-100',
    'high-contrast': 'bg-black text-yellow-400 font-bold'
  }[theme];

  if (showOverview) {
    return (
      <div className="min-h-screen bg-slate-900 p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-12 sticky top-0 bg-slate-900/90 py-6 backdrop-blur-md z-10 border-b border-white/10">
          <h2 className="text-white text-5xl font-bold">Project Deck Overview</h2>
          <button onClick={() => setShowOverview(false)} className="text-white hover:text-[#C97064] flex items-center gap-3 text-2xl transition-all">
            <Minimize2 size={36} /> Return to Presentation
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {PRESENTATION_SLIDES.map((slide, index) => (
            <button key={slide.id} onClick={() => { setActiveSlide(index); setShowOverview(false); }} className={`aspect-video rounded-3xl p-8 text-left border-4 transition-all hover:scale-105 ${activeSlide === index ? 'border-[#C97064] bg-slate-800' : 'border-white/5 bg-slate-800/50 hover:bg-slate-800'}`}>
              <span className="text-slate-500 block mb-3 text-sm font-bold uppercase tracking-widest">Slide {index + 1}</span>
              <h3 className="text-white font-bold text-xl line-clamp-2 leading-tight">{slide.title}</h3>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-screen overflow-hidden flex flex-col transition-colors duration-700 ${themeClasses}`}>
      {/* Slide Container */}
      <div className="flex-1 w-full relative">
        <div className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <SlideRenderer 
            slide={currentSlideData} 
            onOpenSandbox={(p, m) => { setSandboxPrompt(p || ''); setSandboxMode(m || 'text'); setIsSandboxOpen(true); }} 
          />
        </div>

        {/* Admin Modal */}
        {isAdminOpen && (
          <div className="absolute inset-0 z-[100] bg-black/85 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
            <div className="bg-white text-slate-900 w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {!isAuthenticated ? (
                <div className="p-20 text-center space-y-10">
                  <ShieldCheck size={100} className="mx-auto text-[#C97064] animate-bounce" />
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black tracking-tight">Admin Gate</h2>
                    <p className="text-slate-500 text-xl">Authorization required for platform diagnostics and auditing.</p>
                  </div>
                  <form onSubmit={handleAdminAuth} className="max-w-md mx-auto space-y-6">
                    <input 
                      type="password" 
                      value={passwordInput} 
                      onChange={e => setPasswordInput(e.target.value)} 
                      placeholder="Access Token" 
                      className="w-full p-6 text-3xl border-4 rounded-2xl text-center focus:border-[#C97064] outline-none transition-all placeholder:text-slate-300" 
                      autoFocus 
                    />
                    <button type="submit" className="w-full py-6 bg-[#C97064] text-white text-2xl font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#C97064]/20">Unlock Command Centre</button>
                  </form>
                  <button onClick={() => setIsAdminOpen(false)} className="text-slate-400 font-bold hover:text-slate-600 transition-colors">Abort Access</button>
                </div>
              ) : (
                <>
                  <div className="p-10 bg-[#C97064] text-white flex justify-between items-center shrink-0">
                    <h2 className="text-4xl font-black flex items-center gap-4"><ShieldCheck size={48} /> Command Centre</h2>
                    <button onClick={() => setIsAdminOpen(false)} className="p-3 hover:bg-white/20 rounded-full transition-colors"><X size={40}/></button>
                  </div>
                  <div className="flex border-b bg-slate-50">
                    {(['settings', 'audit', 'testing'] as AdminTab[]).map(tab => (
                      <button 
                        key={tab} 
                        onClick={() => { setActiveAdminTab(tab); addLog('ADMIN_TAB_SWITCH', { tab }); }} 
                        className={`px-12 py-6 text-xl font-black capitalize transition-all border-b-8 ${activeAdminTab === tab ? 'border-[#C97064] text-[#C97064] bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                    {activeAdminTab === 'settings' && (
                      <div className="space-y-12 animate-in fade-in duration-300">
                        <section className="space-y-6">
                          <h3 className="text-3xl font-black flex items-center gap-4 text-slate-800"><Settings size={32}/> Platform Experience</h3>
                          <div className="grid grid-cols-3 gap-6">
                            {(['light', 'dark', 'high-contrast'] as Theme[]).map(t => (
                              <button 
                                key={t} 
                                onClick={() => { setTheme(t); addLog('THEME_CHANGE', { theme: t }); }} 
                                className={`p-8 rounded-[2rem] border-4 capitalize font-black text-xl transition-all ${theme === t ? 'border-[#C97064] bg-[#C97064]/5 text-[#C97064]' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'}`}
                              >
                                {t.replace('-', ' ')}
                              </button>
                            ))}
                          </div>
                        </section>
                        <div className="p-10 bg-indigo-50 border-4 border-indigo-100 rounded-[3rem] space-y-6">
                          <h4 className="text-2xl font-black flex items-center gap-4 text-indigo-800"><Activity size={32}/> Active Session Telemetry</h4>
                          <div className="grid grid-cols-2 gap-6 text-indigo-700">
                            <div className="bg-white/70 p-6 rounded-2xl flex justify-between items-center">
                              <span className="font-bold">Gemini Engine Status:</span>
                              <span className="px-4 py-1 bg-green-500 text-white rounded-full text-sm font-black">ACTIVE</span>
                            </div>
                            <div className="bg-white/70 p-6 rounded-2xl flex justify-between items-center">
                              <span className="font-bold">Current Slide Marker:</span>
                              <span className="text-2xl font-black">#{activeSlide + 1}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeAdminTab === 'audit' && (
                      <div className="bg-slate-950 text-emerald-400 font-mono p-10 rounded-[3rem] h-full flex flex-col animate-in fade-in duration-300 border-4 border-slate-900 shadow-inner">
                        <h3 className="text-white text-2xl font-black mb-8 flex items-center gap-4"><Terminal size={32}/> Secure Audit Ledger</h3>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-6 custom-scrollbar">
                          {auditLogs.length === 0 ? (
                            <div className="text-slate-700 italic text-xl">Platform idle. No interaction data recorded.</div>
                          ) : auditLogs.map((log, i) => (
                            <div key={i} className="opacity-80 hover:opacity-100 transition-opacity flex gap-6 text-lg py-2 border-b border-white/5">
                              <span className="text-slate-600 font-bold">[{new Date(log.timestamp).toLocaleTimeString()}]</span> 
                              <span className="text-indigo-400 font-black tracking-widest">{log.action}</span>
                              <span className="text-slate-400 truncate">{JSON.stringify(log.details)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {activeAdminTab === 'testing' && (
                      <div className="space-y-10 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 gap-8">
                          <div className="bg-slate-50 border-4 border-dashed border-slate-200 p-12 rounded-[3rem] text-center space-y-8">
                            <Microscope size={64} className="mx-auto text-slate-300" />
                            <div className="space-y-3">
                              <h3 className="text-3xl font-black">Full Environment Check</h3>
                              <p className="text-slate-500">Verify API keys, asset routes, and state integrity across the current session.</p>
                            </div>
                            <button 
                              onClick={runSelfTest} 
                              disabled={testResult.status === 'running'} 
                              className="w-full max-w-md py-6 rounded-2xl bg-slate-900 text-white font-black text-xl hover:bg-black transition-all disabled:opacity-50 shadow-xl"
                            >
                              {testResult.status === 'running' ? 'Validating Nodes...' : 'Execute Connectivity Test'}
                            </button>
                            {testResult.status !== 'idle' && (
                              <div className={`p-8 rounded-[2rem] border-4 flex items-start gap-6 animate-in slide-in-from-top-4 text-left ${testResult.status === 'pass' ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
                                {testResult.status === 'pass' ? <CheckCircle2 className="shrink-0 mt-1" size={40}/> : <AlertCircle className="shrink-0 mt-1" size={40}/>}
                                <div>
                                  <p className="text-2xl font-black">{testResult.msg}</p>
                                  <p className="opacity-70 mt-2">Check finalized at {new Date().toLocaleTimeString()}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Speaker Notes Overlay */}
        {showNotes && (
          <div className="absolute top-12 right-12 w-[500px] bg-white/95 backdrop-blur-md text-slate-900 rounded-[3rem] shadow-2xl p-10 z-[60] border-4 border-[#C97064]/20 animate-in slide-in-from-top-6 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black text-[#C97064] flex items-center gap-4"><FileText size={32}/> Scripting Guide</h3>
              <button onClick={() => setShowNotes(false)} className="hover:text-slate-400 transition-colors"><X size={36}/></button>
            </div>
            <p className="text-2xl leading-relaxed text-slate-700 font-medium">{currentSlideData.speakerNotes || "Presenter guidance for this layout is not currently defined."}</p>
          </div>
        )}

        <AISandbox isOpen={isSandboxOpen} onClose={() => setIsSandboxOpen(false)} initialPrompt={sandboxPrompt} mode={sandboxMode} />
      </div>

      {/* Modern Control Bar */}
      <nav className={`h-32 ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'} border-t flex items-center justify-between px-16 shrink-0 z-50 transition-colors duration-700 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]`}>
        <div className="flex items-center gap-12">
          <div className="p-4 bg-[#C97064] rounded-2xl shadow-lg shadow-[#C97064]/20">
            <img src="https://thepitchhub.org/wp-content/uploads/2021/08/Copy-of-Untitled.svg" alt="The Pitch Hub" className="h-10 brightness-0 invert" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#C97064] font-black text-3xl tracking-tighter uppercase leading-none">SmartScale AI</span>
            <span className="text-slate-400 font-bold text-sm tracking-widest mt-1">SME TRAINING PLATFORM</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 rounded-[2rem] p-2 gap-2 mr-6">
            <button onClick={() => setIsSandboxOpen(true)} className="px-8 py-4 bg-[#C97064] text-white rounded-[1.5rem] hover:opacity-90 transition-all font-black flex items-center gap-3 shadow-lg shadow-[#C97064]/20" aria-label="Workshop Tool">
              <Sparkles size={24}/> AI WORKSHOP
            </button>
            <button onClick={() => setIsAdminOpen(true)} className="p-4 hover:bg-white text-slate-600 rounded-[1.5rem] transition-all hover:shadow-sm" title="Admin Centre">
              <Settings size={28}/>
            </button>
          </div>
          
          <div className="h-12 w-px bg-slate-200 mx-4" />
          
          <div className="flex items-center gap-3">
             <button onClick={() => setShowOverview(true)} className="p-5 hover:bg-slate-100 rounded-2xl transition-all" title="Deck Overview"><Grid size={32}/></button>
             <div className="flex gap-2">
                <button 
                  onClick={goToPrevSlide} 
                  disabled={activeSlide === 0} 
                  className="p-5 disabled:opacity-20 hover:bg-slate-100 rounded-2xl transition-all group"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={44} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center px-6 font-black text-2xl text-slate-300">
                  {String(activeSlide + 1).padStart(2, '0')} <span className="mx-2 text-slate-100">/</span> {String(PRESENTATION_SLIDES.length).padStart(2, '0')}
                </div>
                <button 
                  onClick={goToNextSlide} 
                  disabled={activeSlide === PRESENTATION_SLIDES.length - 1} 
                  className="p-5 disabled:opacity-20 hover:bg-slate-100 rounded-2xl transition-all group"
                  aria-label="Next Slide"
                >
                  <ChevronRight size={44} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
             <button onClick={toggleFullscreen} className="p-5 hover:bg-slate-100 rounded-2xl transition-all" title="Toggle Display">{isFullscreen ? <Minimize2 size={32}/> : <Maximize2 size={32}/>}</button>
          </div>
        </div>
      </nav>

      {/* Kinetic Progress Bar */}
      <div className="h-2 bg-slate-100 w-full relative z-[70]">
        <div 
          className="h-full bg-[#C97064] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_20px_rgba(201,112,100,0.6)]" 
          style={{ width: `${((activeSlide + 1) / PRESENTATION_SLIDES.length) * 100}%` }} 
        />
      </div>
    </div>
  );
};

export default PresentationDeck;
