/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, RotateCcw, Footprints, Info, Bell, BellOff, 
  Settings, LogOut, Shield, ShieldCheck, X, Moon, Sun, Monitor,
  Activity, Terminal, CheckCircle, AlertCircle, RefreshCw, Eye
} from 'lucide-react';
import { soundService } from './services/soundService';

type Theme = 'dark' | 'light' | 'contrast';

export default function App() {
  const [intervalMinutes, setIntervalMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isActive, setIsActive] = useState(false);
  const [walkCount, setWalkCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('orbit-walk-theme') as Theme) || 'dark';
  });

  // Admin state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminTab, setAdminTab] = useState<'logs' | 'tests'>('logs');
  const [adminPassword, setAdminPassword] = useState('');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [adminError, setAdminError] = useState('');

  // Diagnostic state
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [diagnostics, setDiagnostics] = useState<any>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalSeconds = intervalMinutes * 60;

  // Persist Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('orbit-walk-theme', theme);
  }, [theme]);

  // Check Admin Auth on load
  useEffect(() => {
    fetch('/api/admin/verify')
      .then(res => res.json())
      .then(data => {
        setIsAdminAuthenticated(data.authenticated);
        if (data.authenticated) {
          fetchLogs();
          fetchDiagnostics();
        }
      });
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    setWalkCount((prev) => prev + 1);
    if (soundEnabled) {
      soundService.playDing();
    }
    setTimeLeft(totalSeconds);
  };

  const toggleTimer = () => {
    if (!isActive && soundEnabled) {
      soundService.playStart();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalSeconds);
  };

  const updateInterval = (val: number) => {
    if (isActive) return;
    const minutes = Math.max(5, Math.min(60, isNaN(val) ? 5 : val));
    setIntervalMinutes(minutes);
    setTimeLeft(minutes * 60);
  };

  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminPassword })
    });
    if (res.ok) {
      setIsAdminAuthenticated(true);
      setAdminPassword('');
      setAdminError('');
      fetchLogs();
      fetchDiagnostics();
    } else {
      setAdminError('Invalid authorization key.');
    }
  };

  const handleAdminLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAdminAuthenticated(false);
  };

  const fetchLogs = async () => {
    const res = await fetch('/api/admin/logs');
    if (res.ok) {
      const data = await res.json();
      setAuditLogs(data);
    }
  };

  const fetchDiagnostics = async () => {
    const res = await fetch('/api/admin/diagnostics');
    if (res.ok) {
      const data = await res.json();
      setDiagnostics(data);
    }
  };

  const runSystemTests = async () => {
    setIsTesting(true);
    setTestResults(null);
    try {
      const res = await fetch('/api/admin/run-tests', { method: 'POST' });
      const data = await res.json();
      setTestResults(data);
      fetchLogs(); // Log test run
      fetchDiagnostics(); // Refresh stats
    } catch (err) {
      setTestResults({ success: false, results: [{ name: 'Network Error', status: 'fail', message: 'Failed to reach backend test runner.' }] });
    } finally {
      setIsTesting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      mins: mins.toString().padStart(2, '0'),
      secs: secs.toString().padStart(2, '0')
    };
  };

  const timeParts = formatTime(timeLeft);
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className="w-full h-full min-h-screen flex flex-col overflow-hidden font-sans transition-colors duration-300">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Header */}
      <header className="p-8 md:p-12 flex justify-between items-center border-b border-[var(--border)] shrink-0 z-20">
        <div>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-[var(--accent)]" aria-hidden="true">Movement Engine v1.0</span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase text-[var(--text-primary)]">Orbit-Walk</h2>
        </div>
        <div className="flex gap-4 md:gap-8 items-center">
          {/* Theme Switcher */}
          <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border)]" role="radiogroup" aria-label="Theme Selection">
            {[
              { id: 'light', icon: Sun, label: 'Light' },
              { id: 'dark', icon: Moon, label: 'Dark' },
              { id: 'contrast', icon: Monitor, label: 'Contrast' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as Theme)}
                className={`p-2 rounded-md transition-all ${theme === t.id ? 'bg-[var(--accent)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                aria-label={`${t.label} Theme`}
                aria-checked={theme === t.id}
              >
                <t.icon size={16} />
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsAdminOpen(true)}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Admin Settings"
          >
            <Shield size={20} />
          </button>

          <motion.div 
            animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
              isActive ? 'border-[var(--accent)]' : 'border-[var(--border)]'
            }`}
          >
            <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${isActive ? 'bg-[var(--accent)]' : 'bg-[var(--text-secondary)]'}`} />
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 flex flex-col justify-center px-8 md:px-12 relative overflow-hidden bg-[var(--bg-primary)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 select-none pointer-events-none w-full text-center" aria-hidden="true">
          <motion.span className="text-[20rem] md:text-[40rem] font-black leading-none text-[var(--text-primary)] whitespace-nowrap">WALK</motion.span>
        </div>

        <div className="relative z-10" role="timer" aria-live="polite">
          <div className="flex items-baseline gap-2 md:gap-4 flex-wrap">
            <h1 className="text-[8rem] sm:text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter text-[var(--text-primary)] tabular-nums">
              {timeParts.mins}
            </h1>
            <div className="flex flex-col items-center">
              <span className={`text-4xl md:text-8xl font-black italic transition-colors ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>:</span>
              <span className="h-4"></span>
            </div>
            <h1 className={`text-[8rem] sm:text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter tabular-nums transition-colors ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
              {timeParts.secs}
            </h1>
          </div>
          
          <div className="mt-[-0.5rem] md:mt-[-2rem]">
            <p className="text-[3rem] sm:text-[5rem] md:text-[7rem] font-black uppercase leading-[0.85] tracking-tight text-[var(--text-primary)] max-w-4xl italic">
              UNTIL THE <span className="text-[var(--accent)]">DING.</span>
            </p>
            <p className="text-sm md:text-xl mt-6 text-[var(--text-secondary)] max-w-xl font-medium tracking-wide">
              Every {intervalMinutes} minutes is a fresh start. Techbridge ICT encourages daily motion for cognitive clarity.
            </p>
          </div>
        </div>
      </main>

      {/* Footer / Controls */}
      <footer className="grid grid-cols-2 md:grid-cols-4 border-t border-[var(--border)] shrink-0 bg-[var(--bg-secondary)]">
        <section className="p-6 md:p-8 border-r border-[var(--border)] bg-[var(--bg-secondary)]">
          <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-2 font-bold">Daily Progress</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl md:text-4xl font-black tracking-tighter text-[var(--text-primary)]">{walkCount}</p>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] font-bold uppercase tracking-widest">Sessions</p>
          </div>
          <div className="w-full bg-[var(--bg-tertiary)] h-1.5 mt-4 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="bg-[var(--accent)] h-full" />
          </div>
        </section>
        
        <section className="p-6 md:p-8 border-r border-[var(--border)] hidden sm:block">
          <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-2 font-bold">Interval Mode</p>
          <div className="flex items-center gap-2">
            <label htmlFor="interval-input" className="sr-only">Minutes Interval</label>
            <input 
              id="interval-input"
              type="number" min="5" max="60"
              value={intervalMinutes}
              onChange={(e) => updateInterval(parseInt(e.target.value))}
              disabled={isActive}
              className={`text-2xl md:text-4xl font-black tracking-tighter bg-transparent outline-none w-20 border-b-2 transition-all ${
                isActive ? 'text-[var(--text-secondary)] border-transparent' : 'text-[var(--text-primary)] border-[var(--accent)]/20 focus:border-[var(--accent)]'
              }`}
            />
            <span className="text-xs md:text-sm text-[var(--text-secondary)] font-bold uppercase tracking-widest pt-2">Mins</span>
          </div>
          <p className={`text-[10px] mt-2 font-black uppercase tracking-widest leading-none ${isActive ? 'text-[var(--text-secondary)]' : 'text-[var(--accent)]'}`}>
            {isActive ? 'Locked' : 'Adjustable'}
          </p>
        </section>

        <div className={`p-0 border-r border-[var(--border)] flex flex-col justify-center transition-all relative ${isActive ? 'bg-red-500/10' : 'bg-[var(--accent)] text-[var(--bg-primary)]'}`}>
          <button 
            onClick={toggleTimer}
            className="w-full h-full flex flex-col justify-center px-8 cursor-pointer active:scale-[0.98] transition-transform"
            aria-label={isActive ? 'Stop Timer' : 'Start Timer'}
          >
            <p className={`text-[9px] md:text-[10px] uppercase tracking-widest font-black mb-1 ${isActive ? 'text-red-500' : 'opacity-60'}`}>
              {isActive ? 'Halt Engine' : 'System Ready'}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black uppercase tracking-tighter">
                {isActive ? 'STOP NOW' : 'START NOW'}
              </span>
              {isActive ? <Pause size={20} /> : <Play size={20} className="fill-current" />}
            </div>
          </button>
          
          <button 
            onClick={resetTimer}
            className={`absolute top-4 right-4 p-2 rounded border active:rotate-[-180deg] transition-all duration-300 ${
              isActive ? 'border-red-500/20 text-red-500' : 'border-black/20 text-black/60'
            }`}
            aria-label="Reset Timer"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-6 md:p-8 flex flex-col justify-center cursor-pointer transition-all active:scale-[0.98] text-left ${
            soundEnabled ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
          }`}
          aria-label={soundEnabled ? 'Disable Sound' : 'Enable Sound'}
          aria-pressed={soundEnabled}
        >
          <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-black mb-1 opacity-60">Audio Status</p>
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-black uppercase tracking-tighter">
              {soundEnabled ? 'DING: ON' : 'DING: OFF'}
            </span>
            {soundEnabled ? <Bell size={20} /> : <BellOff size={20} />}
          </div>
        </button>
      </footer>

      {/* Admin Panel Overlay */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            role="dialog" aria-labelledby="admin-title"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border)] w-full max-w-2xl rounded-2xl max-h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-tertiary)]">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-[var(--accent)]" />
                  <h2 id="admin-title" className="text-xl font-bold font-display uppercase tracking-tight text-[var(--text-primary)]">TUC Admin Portal</h2>
                </div>
                <button onClick={() => setIsAdminOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><X /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {!isAdminAuthenticated ? (
                  <form onSubmit={handleAdminLogin} className="space-y-6 py-12 text-center max-w-sm mx-auto">
                    <p className="text-[var(--text-secondary)] text-sm">Enter the TUC-ICT authentication key to access audit logs and system configuration.</p>
                    <div className="space-y-4">
                      <input 
                        type="password" 
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Authentication Key"
                        required
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] p-4 rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                      />
                      {adminError && <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{adminError}</p>}
                      <button type="submit" className="w-full bg-[var(--accent)] text-[var(--bg-primary)] p-4 rounded-xl font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">Verify Identity</button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-8">
                    {/* Admin Tabs */}
                    <div className="flex gap-4 border-b border-[var(--border)] pb-4">
                      <button 
                        onClick={() => setAdminTab('logs')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${adminTab === 'logs' ? 'bg-[var(--accent)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
                      >
                        <Activity size={14} /> Audit Logs
                      </button>
                      <button 
                        onClick={() => setAdminTab('tests')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${adminTab === 'tests' ? 'bg-[var(--accent)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
                      >
                        <Terminal size={14} /> System Tests
                      </button>
                    </div>

                    {adminTab === 'logs' ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">Security Audit Logs</h3>
                          <button onClick={handleAdminLogout} className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                            <LogOut size={14} /> Clear Session
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                           {auditLogs.length === 0 ? (
                             <div className="p-12 text-center border-2 border-dashed border-[var(--border)] rounded-2xl text-[var(--text-secondary)]">No active records found.</div>
                           ) : (
                             auditLogs.map((log, i) => (
                               <div key={i} className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border)] flex flex-col md:flex-row justify-between gap-2">
                                 <div className="space-y-1">
                                   <div className="flex items-center gap-2">
                                     <span className="text-[10px] font-mono text-[var(--accent)]">[{log.admin}]</span>
                                     <span className="text-xs font-bold text-[var(--text-primary)]">{log.action}</span>
                                   </div>
                                   <p className="text-[10px] text-[var(--text-secondary)]">Resource: {log.resource} • IP: {log.ip}</p>
                                 </div>
                                 <time className="text-[10px] font-mono text-[var(--text-secondary)] opacity-60 self-end">
                                   {new Date(log.timestamp).toLocaleString()}
                                 </time>
                               </div>
                             ))
                           )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8 pb-12">
                        {/* Diagnostics Header */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: 'DB Status', value: diagnostics?.database || 'Pending', icon: Activity },
                            { label: 'FS Mode', value: diagnostics?.fileSystem || 'Pending', icon: Shield },
                            { label: 'Log Volume', value: diagnostics?.logSize || '0 KB', icon: Terminal },
                            { label: 'Node Env', value: diagnostics?.environment || 'Prod', icon: Monitor }
                          ].map((stat, i) => (
                            <div key={i} className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border)]">
                              <p className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] mb-1">{stat.label}</p>
                              <div className="flex items-center gap-2">
                                <stat.icon size={14} className="text-[var(--accent)]" />
                                <span className="text-xs font-bold text-[var(--text-primary)]">{stat.value}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Test Suite Trigger */}
                        <div className="bg-[var(--bg-tertiary)] p-6 rounded-2xl border border-[var(--border)] text-center">
                          <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2 uppercase tracking-tight">Puppeteer Engine</h4>
                          <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-md mx-auto">Trigger a server-side automated test suite to verify page load, timer initialization, and theme switching.</p>
                          <button 
                            onClick={runSystemTests}
                            disabled={isTesting}
                            className={`flex items-center gap-2 mx-auto px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all ${isTesting ? 'bg-[var(--border)] text-[var(--text-secondary)] cursor-not-allowed' : 'bg-[var(--accent)] text-[var(--bg-primary)] hover:scale-105 active:scale-95'}`}
                          >
                            {isTesting ? <RefreshCw className="animate-spin" /> : <Play size={18} fill="currentColor" />}
                            {isTesting ? 'Engine Running...' : 'Launch Test Suite'}
                          </button>
                        </div>

                        {/* Test Results */}
                        {testResults && (
                          <div className="space-y-4">
                            <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] flex justify-between">
                              Test Results
                              <span className="text-[var(--text-primary)]">{new Date(testResults.timestamp).toLocaleTimeString()}</span>
                            </h3>
                            <div className="space-y-2">
                              {testResults.results.map((res: any, i: number) => (
                                <div key={i} className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border)] flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {res.status === 'pass' ? <CheckCircle className="text-emerald-500" size={18} /> : <AlertCircle className="text-red-500" size={18} />}
                                    <div>
                                      <p className="text-sm font-bold text-[var(--text-primary)]">{res.name}</p>
                                      {res.message && <p className="text-[10px] text-[var(--text-secondary)] font-mono">{res.message}</p>}
                                    </div>
                                  </div>
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${res.status === 'pass' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {res.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
