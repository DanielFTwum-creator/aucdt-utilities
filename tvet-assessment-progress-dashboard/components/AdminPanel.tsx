
import React, { useState } from 'react';
import { Shield, Activity, FileText, ArrowLeft, Monitor, Moon, Sun, Eye, Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { DashboardData, CalculatedStats, AuditLogEntry, Theme, TestResult } from '../types';

interface Props {
  data: DashboardData;
  stats: CalculatedStats;
  auditLog: AuditLogEntry[];
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  onExit: () => void;
  onRunTests: () => void;
  testResults: TestResult[];
}

const AdminPanel: React.FC<Props> = ({ data, stats, auditLog, currentTheme, onThemeChange, onExit, onRunTests, testResults }) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'testing'>('monitor');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-[var(--text-main)]">System Administration</h1>
            <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">Authorized Access Only • Session Active</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[var(--bg-app)] p-1 rounded-lg border border-[var(--border-color)] mr-4">
            <button
               onClick={() => setActiveTab('monitor')}
               className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${activeTab === 'monitor' ? 'bg-[var(--text-main)] text-[var(--bg-app)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              Monitor
            </button>
            <button
               onClick={() => setActiveTab('testing')}
               className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${activeTab === 'testing' ? 'bg-[var(--text-main)] text-[var(--bg-app)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              Test Suite
            </button>
          </div>
          <button 
            onClick={onExit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--border-color)] hover:bg-white/10 transition-colors text-[var(--text-main)] font-bold text-xs uppercase"
            aria-label="Return to Dashboard"
          >
            <ArrowLeft size={16} />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {activeTab === 'monitor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Diagnostics & Theme */}
          <div className="space-y-8">
            {/* Theme Selector */}
            <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] space-y-4">
               <div className="flex items-center gap-2 mb-4">
                <Monitor size={18} className="text-[var(--text-muted)]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Interface Theme</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onThemeChange('dark')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${currentTheme === 'dark' ? 'bg-slate-800 border-emerald-500 text-emerald-400' : 'border-[var(--border-color)] text-[var(--text-muted)] hover:bg-white/5'}`}
                  aria-label="Switch to Dark Theme"
                  aria-pressed={currentTheme === 'dark'}
                >
                  <Moon size={20} />
                  <span className="text-[10px] font-bold uppercase">Dark</span>
                </button>
                <button
                  onClick={() => onThemeChange('light')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${currentTheme === 'light' ? 'bg-white border-emerald-500 text-emerald-600' : 'border-[var(--border-color)] text-[var(--text-muted)] hover:bg-white/5'}`}
                  aria-label="Switch to Light Theme"
                  aria-pressed={currentTheme === 'light'}
                >
                  <Sun size={20} />
                  <span className="text-[10px] font-bold uppercase">Light</span>
                </button>
                <button
                  onClick={() => onThemeChange('contrast')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${currentTheme === 'contrast' ? 'bg-black border-yellow-400 text-yellow-400' : 'border-[var(--border-color)] text-[var(--text-muted)] hover:bg-white/5'}`}
                  aria-label="Switch to High Contrast Theme"
                  aria-pressed={currentTheme === 'contrast'}
                >
                  <Eye size={20} />
                  <span className="text-[10px] font-bold uppercase">Contrast</span>
                </button>
              </div>
            </div>

            {/* System Health / Raw Data */}
            <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] h-[400px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={18} className="text-[var(--text-muted)]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Live Diagnostics</h3>
              </div>
              <div className="flex-1 overflow-auto bg-black/20 rounded-lg p-4 font-mono text-[10px] text-[var(--text-muted)]">
                <pre>{JSON.stringify({ 
                  meta: {
                    version: "2.0.0",
                    build: "stable",
                    environment: "client-side"
                  },
                  appState: data,
                  calculatedStats: {
                    ...stats,
                    gapTrend: `Array(${stats.gapTrend.length})`,
                    burnupTrend: `Array(${stats.burnupTrend.length})`
                  }
                }, null, 2)}</pre>
              </div>
            </div>
          </div>

          {/* Right Column: Audit Log */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] flex flex-col h-[600px] lg:h-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[var(--text-muted)]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Audit Trail</h3>
              </div>
              <span className="text-[10px] font-mono bg-[var(--border-color)] px-2 py-1 rounded text-[var(--text-main)]">
                {auditLog.length} Records
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {auditLog.length === 0 ? (
                <div className="text-center py-20 text-[var(--text-muted)] italic text-sm">No actions recorded yet.</div>
              ) : (
                auditLog.map((log) => (
                  <div key={log.id} className="grid grid-cols-12 gap-4 p-3 rounded-lg bg-[var(--bg-app)] border border-[var(--border-color)] items-center text-xs font-mono">
                    <div className="col-span-3 text-[var(--text-muted)]">{log.timestamp.split('T')[1].split('.')[0]}</div>
                    <div className="col-span-3 font-bold text-[var(--accent-primary)] uppercase">{log.action}</div>
                    <div className="col-span-6 text-[var(--text-main)] truncate" title={log.details}>{log.details}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 animate-in fade-in">
          <div className="p-8 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-center space-y-6">
            <div className="max-w-xl mx-auto space-y-4">
               <h2 className="text-xl font-black uppercase text-[var(--text-main)]">Automated Verification Suite</h2>
               <p className="text-[var(--text-muted)]">
                 The integrated test runner executes a series of Puppeteer-simulated actions against the live DOM. 
                 This verifies core functionality including interaction, state logic, and visual rendering without leaving the browser.
               </p>
               <button 
                onClick={onRunTests}
                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
               >
                 <Play size={20} fill="currentColor" />
                 Launch Diagnostics
               </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={18} className="text-[var(--text-muted)]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Last Execution Results</h3>
            </div>
            
            <div className="space-y-2">
              {testResults.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-[var(--border-color)] rounded-xl">
                  <AlertCircle size={32} className="mx-auto text-[var(--text-muted)] mb-2 opacity-50" />
                  <p className="text-[var(--text-muted)] font-mono text-xs">No test results available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {testResults.map((result) => (
                    <div key={result.id} className={`flex items-center justify-between p-4 rounded-lg border ${result.status === 'pass' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                      <div className="flex items-center gap-4">
                        {result.status === 'pass' ? <CheckCircle size={20} className="text-emerald-500" /> : <XCircle size={20} className="text-red-500" />}
                        <div>
                          <p className="font-bold text-sm text-[var(--text-main)]">{result.name}</p>
                          {result.error && <p className="text-xs font-mono text-red-400 mt-1">{result.error}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${result.status === 'pass' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {result.status.toUpperCase()}
                        </span>
                        <p className="text-[10px] font-mono text-[var(--text-muted)] mt-1">{result.duration}ms</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
