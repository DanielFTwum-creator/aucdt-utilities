
import React, { useState } from 'react';
import { Activity, Terminal, Shield, CheckCircle, AlertTriangle, Search, Trash2 } from 'lucide-react';
import { AuditLog } from '../types';

interface DiagnosticsProps {
  auditLogs: AuditLog[];
}

const Diagnostics: React.FC<DiagnosticsProps> = ({ auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'LOGS' | 'TESTS'>('LOGS');
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runSystemTests = () => {
    setIsRunningTests(true);
    setTimeout(() => setIsRunningTests(false), 2000);
  };

  return (
    <div className="space-y-8 animate-slide">
      <div className="bg-slate-900 rounded-[2.5rem] p-10 border-b-8 border-brand-gold shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-brand-gold">
              <Activity className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Unit Diagnostic Suite</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Infrastructure Integrity</h2>
          </div>
          <button 
            onClick={runSystemTests}
            className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isRunningTests ? 'bg-slate-700 text-slate-400' : 'bg-brand-gold text-brand-maroon hover:scale-105'}`}
            disabled={isRunningTests}
          >
            {isRunningTests ? 'Executing Puppeteer Suite...' : 'Run Production Tests'}
          </button>
        </div>
        <div className="absolute right-[-40px] top-[-40px] opacity-[0.03] text-white">
          <Shield size={300} fill="currentColor" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {[
            { id: 'LOGS', label: 'AUDIT LEDGER', icon: <Terminal size={18}/> },
            { id: 'TESTS', label: 'TEST ARTIFACTS', icon: <CheckCircle size={18}/> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 p-5 rounded-3xl font-black text-[10px] tracking-[0.2em] uppercase transition-all ${activeTab === tab.id ? 'bg-brand-maroon text-brand-gold shadow-xl scale-105' : 'bg-white text-slate-400 hover:text-brand-maroon border border-slate-100'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2.5rem] border-2 border-brand-maroon/5 shadow-2xl overflow-hidden min-h-[600px]">
            {activeTab === 'LOGS' ? (
              <div className="p-0">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" placeholder="Filter logs..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-maroon" />
                  </div>
                  <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
                <div className="p-6 space-y-4">
                  {auditLogs.length > 0 ? auditLogs.map(log => (
                    <div key={log.id} className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group">
                      <div className="p-2 bg-slate-100 text-slate-400 rounded-lg shrink-0 group-hover:bg-brand-gold group-hover:text-brand-maroon transition-colors"><Shield size={16}/></div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-brand-maroon tracking-wider">{log.action}</span>
                          <span className="text-[9px] font-bold text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700">{log.details}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No Log Entries Found</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-10 space-y-8">
                <div className="p-8 bg-brand-maroon/5 rounded-3xl border-2 border-dashed border-brand-maroon/20 flex flex-col items-center justify-center text-center space-y-4">
                  <Terminal size={48} className="text-brand-maroon/20" />
                  <div>
                    <h3 className="font-black text-brand-maroon">TEST ARTIFACTS</h3>
                    <p className="text-xs text-slate-500 font-bold max-w-xs mx-auto mt-2 uppercase tracking-tighter">Automated Puppeteer screenshots and PDF reports will populate here after test execution.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-video bg-slate-100 rounded-2xl border-2 border-slate-200 animate-pulse flex items-center justify-center">
                       <Shield className="text-slate-300" size={32} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnostics;
