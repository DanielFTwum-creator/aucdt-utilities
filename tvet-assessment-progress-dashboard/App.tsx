
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Share2, Settings, Check, RefreshCw, Download, FileText, Table, FileBox, Clock as ClockIcon, Image as ImageIcon, ClipboardList, Plus, Minus, Lock, LogOut, Printer } from 'lucide-react';
import { toPng } from 'html-to-image';
import { DashboardData, CalculatedStats, Theme, AppView, AuditLogEntry, TestResult, Notification } from './types';
import DashboardView from './components/DashboardView';
import ControlPanel from './components/ControlPanel';
import AdminPanel from './components/AdminPanel';
import TestRunner from './components/TestRunner';
import ToastContainer from './components/Toast';

/**
 * TVET Assessment Progress Dashboard - Core Application
 * Handles state management, URL synchronization, and analytical computations.
 */
const App: React.FC = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // State Initialization
  const [data, setData] = useState<DashboardData>(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() - 40);
    
    return {
      totalAssessments: Number(params.get('total')) || 67,
      completed: Number(params.get('done')) || 37, 
      startDate: params.get('start') || defaultStart.toISOString().split('T')[0],
      targetRate: Number(params.get('target')) || 4,
      logoUrl: params.get('logo') || 'https://techbridge.edu.gh/static/TUC_LOGO_1.png',
      title: params.get('title') || 'Assessment Analytics Engine',
      itemLabel: params.get('label') || 'Assessments',
    };
  });

  const [view, setView] = useState<AppView>('dashboard');
  const [theme, setTheme] = useState<Theme>('dark');
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showControls, setShowControls] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  // UI State
  const [copied, setCopied] = useState(false);
  const [reportCopied, setReportCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [trendPeriod, setTrendPeriod] = useState(7);
  const [headerLogoError, setHeaderLogoError] = useState(false);

  // Sync Theme to Body
  useEffect(() => {
    document.body.className = `dashboard-bg min-h-screen theme-${theme}`;
  }, [theme]);

  // Real-time clock synchronization
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync state to URL hash
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    params.set('total', data.totalAssessments.toString());
    params.set('done', data.completed.toString());
    params.set('start', data.startDate);
    params.set('target', data.targetRate.toString());
    params.set('logo', data.logoUrl);
    params.set('title', data.title);
    params.set('label', data.itemLabel);
    // Preserve view state in hash if it's admin (optional, but requested)
    if (view === 'admin' && isAuthenticated) {
        params.set('view', 'admin');
    } else {
        params.delete('view');
    }
    
    // Only update hash if it actually changes to prevent loop
    const newHash = params.toString();
    if (window.location.hash.slice(1) !== newHash) {
        window.location.hash = newHash;
    }
  }, [data, view, isAuthenticated]);

  // Load View from Hash on Mount
  useEffect(() => {
      const params = new URLSearchParams(window.location.hash.slice(1));
      if (params.get('view') === 'admin') {
          // If hash says admin but not auth, show login
          setView('login');
      }
  }, []);

  const notify = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000); // Auto dismiss
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const logAction = (action: string, details: string) => {
    const entry: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      details
    };
    setAuditLog(prev => [entry, ...prev]);
  };

  const handleDataChange = (newData: DashboardData, reason: string) => {
    setData(newData);
    logAction('UPDATE', reason);
    
    // Trigger notification for significant updates
    if (reason.startsWith('Quick Update')) {
      notify('success', `Updated: ${reason.split(': ')[1]}`);
    } else if (reason === 'Restored Factory Defaults') {
      notify('info', 'System reset to factory defaults');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side auth
    if (passwordInput === 'admin123') {
      setIsAuthenticated(true);
      setView('admin');
      setPasswordInput('');
      setLoginError(false);
      logAction('AUTH', 'Admin login successful');
      notify('success', 'Authenticated as Administrator');
    } else {
      setLoginError(true);
      logAction('AUTH_FAIL', 'Failed login attempt');
      notify('error', 'Access Denied: Invalid Key');
    }
  };

  const runTests = () => {
    setView('testing');
    logAction('TEST', 'Launched automated test suite');
    notify('info', 'Starting Diagnostic Suite...');
  };

  const handleTestComplete = (results: TestResult[]) => {
    setTestResults(results);
    setView('admin');
    const passed = results.filter(r => r.status === 'pass').length;
    logAction('TEST_COMPLETE', `Tests finished. Passed: ${passed}/${results.length}`);
    notify(passed === results.length ? 'success' : 'error', `Tests Complete: ${passed}/${results.length} Passed`);
  };

  // Derived metrics
  const stats: CalculatedStats = useMemo(() => {
    const start = new Date(data.startDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const remaining = Math.max(0, data.totalAssessments - data.completed);
    const progressPercent = (data.completed / data.totalAssessments) * 100;
    const actualRate = data.completed / daysElapsed;
    const daysRemainingAtTarget = Math.ceil(remaining / (data.targetRate || 1));
    const projectedFinishDay = daysElapsed + daysRemainingAtTarget;
    const projectedEnd = new Date();
    projectedEnd.setDate(today.getDate() + daysRemainingAtTarget);
    const expectedAtCurrentDay = data.targetRate * daysElapsed;
    const shortfall = expectedAtCurrentDay - data.completed;
    const originalFinishDay = Math.ceil(data.totalAssessments / (data.targetRate || 1));

    const gapTrend = Array.from({ length: trendPeriod }).map((_, i) => {
      const d = Math.max(1, daysElapsed - (trendPeriod - 1 - i));
      const simulatedCompleted = (data.completed / daysElapsed) * d;
      const targetAtD = data.targetRate * d;
      return { day: d, gap: Math.max(0, targetAtD - simulatedCompleted) };
    });

    const horizonDays = Math.max(projectedFinishDay, originalFinishDay, daysElapsed) + 5;
    const burnupTrend = Array.from({ length: horizonDays + 1 }).map((_, i) => {
      const day = i;
      const targetVal = Math.min(data.totalAssessments, day * data.targetRate);
      let actualVal: number | null = null;
      if (day <= daysElapsed) {
        actualVal = (data.completed / Math.max(1, daysElapsed)) * day;
      }
      let projectedVal: number | null = null;
      if (day >= daysElapsed) {
        const projection = data.completed + ((day - daysElapsed) * actualRate);
        projectedVal = Math.min(data.totalAssessments, projection);
        if (day === daysElapsed) projectedVal = data.completed;
      }
      return { day, target: Number(targetVal.toFixed(1)), actual: actualVal !== null ? Number(actualVal.toFixed(1)) : null, projected: projectedVal !== null ? Number(projectedVal.toFixed(1)) : null };
    });

    return { daysElapsed, remaining, progressPercent, actualRate, daysRemainingAtTarget, projectedFinishDay, weeklyTarget: data.targetRate * 7, originalFinishDay, gapMultiplier: data.targetRate / (actualRate || 0.0001), expectedAtCurrentDay, shortfall, avgDaysEach: daysElapsed / (data.completed || 1), todayDate: today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), projectedEndDate: projectedEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), gapTrend, burnupTrend };
  }, [data, trendPeriod]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    notify('success', 'Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyReport = () => {
    const report = `📊 ${data.title} - Status Report\n📅 ${stats.todayDate}\n\n✅ Status: ${data.completed}/${data.totalAssessments} ${data.itemLabel} (${Math.round(stats.progressPercent)}%)\n🚀 Velocity: ${stats.actualRate.toFixed(2)}/day (Target: ${data.targetRate})\n🏁 Est. Finish: ${stats.projectedEndDate}\n⚠️ Gap: ${stats.shortfall > 0 ? `${stats.shortfall.toFixed(0)} units behind` : 'On Track'}\n\n🔗 Dashboard: ${window.location.href}`.trim();
    navigator.clipboard.writeText(report);
    setReportCopied(true);
    notify('success', 'Status Report copied to clipboard');
    setTimeout(() => setReportCopied(false), 2000);
  };

  const handleExportPNG = async () => {
    if (!dashboardRef.current || isCapturing) return;
    setIsCapturing(true);
    notify('info', 'Generating High-Res Snapshot...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 250));
      
      let dataUrl;
      try {
        // Attempt 1: Try with CORS enabled (High Quality, includes images)
        dataUrl = await toPng(dashboardRef.current, { 
          cacheBust: true, 
          backgroundColor: '#0a0e14', 
          style: { padding: '24px', borderRadius: '16px' },
          useCORS: true,
          pixelRatio: 2
        });
      } catch (e) {
        console.warn('Export failed with CORS, retrying without external images...');
        // Attempt 2: Filter out images (Fallback)
        dataUrl = await toPng(dashboardRef.current, { 
          cacheBust: true, 
          backgroundColor: '#0a0e14', 
          style: { padding: '24px', borderRadius: '16px' },
          pixelRatio: 2,
          filter: (node) => node.tagName !== 'IMG' // Exclude images
        });
        notify('error', 'CORS restricted. Generated without external images.');
      }

      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `dashboard-export-${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        notify('success', 'Snapshot downloaded successfully');
      }
    } catch (err) { 
      console.error('Export failed completely:', err); 
      notify('error', 'Snapshot generation failed.');
    } finally { setIsCapturing(false); }
  };

  const handlePrintCanvas = async () => {
    if (!dashboardRef.current || isCapturing) return;
    setIsCapturing(true);
    notify('info', 'Preparing Print View...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 250));
      
      let dataUrl;
      try {
        // Attempt 1: Try with CORS
        dataUrl = await toPng(dashboardRef.current, { 
          cacheBust: true, 
          backgroundColor: '#0a0e14', 
          pixelRatio: 2,
          useCORS: true
        });
      } catch (e) {
        // Attempt 2: Fallback without images
        console.warn('Print capture failed with CORS, retrying without images...');
        dataUrl = await toPng(dashboardRef.current, { 
          cacheBust: true, 
          backgroundColor: '#0a0e14', 
          pixelRatio: 2,
          filter: (node) => node.tagName !== 'IMG'
        });
        notify('error', 'CORS restricted. Printing without images.');
      }
      
      if (dataUrl) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>${data.title} - Print View</title>
                <style>
                  body { margin: 0; background-color: #0a0e14; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; padding: 20px; }
                  img { width: 100%; max-width: 1200px; height: auto; box-shadow: 0 0 20px rgba(0,0,0,0.5); border-radius: 12px; }
                  @media print {
                    body { background-color: #0a0e14 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 0; }
                    img { box-shadow: none; border-radius: 0; max-width: 100%; }
                    @page { margin: 10mm; size: landscape; }
                  }
                </style>
              </head>
              <body>
                <img src="${dataUrl}" alt="Dashboard Capture" />
                <script>
                  window.onload = function() {
                    setTimeout(function() {
                      window.print();
                    }, 500);
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
          notify('success', 'Print dialog opened');
        }
      }
    } catch (err) {
      console.error('Print capture failed:', err);
      notify('error', 'Could not generate print view.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleReset = () => {
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() - 40);
    handleDataChange({
      totalAssessments: 67, completed: 37, startDate: defaultStart.toISOString().split('T')[0], targetRate: 4, logoUrl: 'https://techbridge.edu.gh/static/TUC_LOGO_1.png', title: 'Assessment Analytics Engine', itemLabel: 'Assessments',
    }, 'Restored Factory Defaults');
  };

  // Login Screen
  if (view === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ToastContainer notifications={notifications} onDismiss={dismissNotification} />
        <form onSubmit={handleLogin} className="w-full max-w-md bg-[var(--bg-panel)] border border-[var(--border-color)] p-8 rounded-2xl space-y-6 animate-in zoom-in-95">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4">
              <Lock size={24} />
            </div>
            <h2 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tight">System Access</h2>
            <p className="text-[var(--text-muted)] text-sm font-mono mt-2">Restricted Area: Authorized Personnel Only</p>
          </div>
          <div>
            <input 
              type="password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter Access Key..."
              className="w-full bg-[var(--bg-app)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              autoFocus
            />
            {loginError && <p className="text-red-400 text-xs font-mono mt-2">Access Denied: Invalid Key</p>}
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={() => setView('dashboard')} className="flex-1 py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-white/5 font-bold text-xs uppercase transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase transition-colors shadow-lg shadow-emerald-900/20">
              Authenticate
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Admin View
  if (view === 'admin' && isAuthenticated) {
    return (
      <div className="min-h-screen p-8">
         <ToastContainer notifications={notifications} onDismiss={dismissNotification} />
         <AdminPanel 
            data={data} 
            stats={stats} 
            auditLog={auditLog} 
            currentTheme={theme}
            onThemeChange={setTheme}
            onExit={() => {
              setView('dashboard');
              notify('info', 'Admin session ended');
            }}
            onRunTests={runTests}
            testResults={testResults}
         />
      </div>
    );
  }

  // Standard Dashboard View (Supports Normal + Testing Mode)
  return (
    <div className="relative min-h-screen flex flex-col print:bg-white print:text-black">
      {view === 'testing' && <TestRunner onComplete={handleTestComplete} />}
      <ToastContainer notifications={notifications} onDismiss={dismissNotification} />
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-app)]/90 backdrop-blur-xl border-b border-[var(--border-color)] p-4 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
             {data.logoUrl && !headerLogoError && (
               <img 
                 src={data.logoUrl} 
                 alt="Organization Logo" 
                 className="h-8 w-auto object-contain"
                 onError={() => setHeaderLogoError(true)} 
               />
             )}
            <div className="h-8 w-px bg-[var(--border-color)] hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
              <div className="flex flex-col">
                <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)] uppercase font-bold">Live Telemetry</span>
                <span className="text-xs font-black text-[var(--text-main)] uppercase tracking-tight">{stats.todayDate}</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 border-l border-[var(--border-color)] pl-6 text-[var(--accent-primary)] font-mono text-sm">
            <ClockIcon size={14} className="opacity-50" />
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]" title="Restore Baseline" aria-label="Reset Data">
            <RefreshCw size={18} />
          </button>
          
          <button onClick={() => setShowControls(!showControls)} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${showControls ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 'bg-[var(--bg-app)] border-[var(--border-color)] text-[var(--text-muted)] hover:bg-white/10'}`} aria-label="Toggle Config">
            <Settings size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Config</span>
          </button>

          <button onClick={() => setView('login')} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]" title="Admin Login" aria-label="Admin Login">
            <Lock size={18} />
          </button>
          
          <div className="h-6 w-px bg-[var(--border-color)] mx-1" />

          <button onClick={handleCopyReport} className="flex p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400 hover:bg-indigo-500/20 transition-all active:scale-95" title="Copy Status Report" aria-label="Copy Report">
            {reportCopied ? <Check size={18} /> : <ClipboardList size={18} />}
          </button>
          
          <button onClick={handleExportPNG} disabled={isCapturing} className="p-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-all active:scale-95" title="Download Snapshot" aria-label="Export PNG">
            <ImageIcon size={18} className={isCapturing ? 'animate-spin' : ''} />
          </button>

          <button onClick={handlePrintCanvas} disabled={isCapturing} className="p-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-all active:scale-95" title="Print View" aria-label="Print View">
            <Printer size={18} className={isCapturing ? 'animate-pulse' : ''} />
          </button>
          
          <button onClick={handleShare} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-all text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/20 active:scale-95" aria-label="Share Link">
            {copied ? <Check size={18} /> : <Share2 size={18} />}
            <span>{copied ? 'Copied' : 'Share Link'}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full print:pt-0">
        {showControls && (
          <div className="mb-8 p-6 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 print:hidden">
            <ControlPanel data={data} onChange={handleDataChange} />
          </div>
        )}
        
        <div ref={dashboardRef} className="rounded-2xl transition-all">
          <DashboardView 
            data={data} 
            stats={stats} 
            trendPeriod={trendPeriod} 
            onTrendPeriodChange={setTrendPeriod} 
            onDataChange={handleDataChange}
          />
        </div>
      </main>

      <footer className="py-8 border-t border-[var(--border-color)] bg-black/20 text-center print:hidden">
        <p className="text-[var(--text-muted)] text-[10px] font-mono tracking-widest uppercase">
          Precision Metrics Dashboard // System Version v3.0.0-PHASE3
        </p>
      </footer>
    </div>
  );
};

export default App;
