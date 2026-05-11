
import { Activity, Database, Lock, LogOut, RefreshCw, Server, Shield, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { getLogs, logAction } from '../services/auditLog';
import { AuditEntry } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewChange?: (v: any) => void;
}

const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 Minutes

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onViewChange }) => {
  const [pass, setPass] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // SOC 2: Session Inactivity Monitor
  useEffect(() => {
    if (!isAuth) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetInactivityTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logAction('system_guard', 'SESSION_TIMEOUT', 'Automatic termination due to inactivity (300s).');
        onLogout();
        alert("Session expired due to inactivity.");
      }, SESSION_TIMEOUT_MS);
    };

    // Attach listeners for user activity
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer);

    // Start timer immediately
    resetInactivityTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      window.removeEventListener('click', resetInactivityTimer);
      window.removeEventListener('scroll', resetInactivityTimer);
    };
  }, [isAuth, onLogout]);

  const fetchLogs = () => {
    setLogs(getLogs());
    // Small delay to ensure render before scrolling
    setTimeout(() => {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    if (isAuth) {
      fetchLogs();
    }
  }, [isAuth]);

  const handleRefreshLogs = () => {
    setIsRefreshing(true);
    fetchLogs();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Integrated Protocol: admin123 static key for simulation
    if (pass === 'admin123' || pass === 'tb_admin_2025') {
      setIsAuth(true);
      setError('');
      logAction('admin_system', 'LOGIN_SUCCESS', 'High-level node authentication achieved.');
    } else {
      setError('System Access Denied. Integrity mismatch.');
      logAction('guest', 'LOGIN_FAILURE', `Attempted node breach with code: ${pass}`);
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-techbridge-cream dark:bg-slate-900 px-4">
        <form onSubmit={handleLogin} className="bg-white dark:bg-slate-800 p-12 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-techbridge-beige dark:border-slate-700 animate-fade-in-up">
          <div className="flex items-center justify-center mb-10 opacity-0 animate-fade-in-up delay-100">
            <div className="w-20 h-20 bg-techbridge-burgundy rounded-[2rem] flex items-center justify-center text-white shadow-[0_10px_30px_-10px_rgba(139,21,56,0.5)]">
              <Shield size={40} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-center mb-2 text-techbridge-burgundy dark:text-white tracking-tighter uppercase opacity-0 animate-fade-in-up delay-200">Root Access</h2>
          <p className="text-xs text-center font-bold text-techbridge-gold mb-10 uppercase tracking-widest opacity-0 animate-fade-in-up delay-300">Security Clearance Required</p>
          
          <div className="opacity-0 animate-fade-in-up delay-400">
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="Authorized Access Key" 
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full bg-techbridge-cream dark:bg-slate-700 border border-techbridge-beige dark:border-slate-600 rounded-2xl pl-12 pr-5 py-4 mb-4 focus:ring-4 focus:ring-techbridge-burgundy/20 outline-none dark:text-white font-medium transition-all"
              />
            </div>
            {error && <p className="text-red-500 text-xs mb-4 text-center font-bold animate-pulse">{error}</p>}
            <button type="submit" className="w-full bg-techbridge-burgundy text-white font-black py-4 rounded-2xl hover:bg-techbridge-burgundy-dark transition-all shadow-lg active:scale-95 uppercase tracking-widest text-sm focus:ring-4 focus:ring-techbridge-gold/50 outline-none">
              Authorize Node
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-12 px-4 md:px-8 lg:px-16 bg-techbridge-cream dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3">
               <h2 className="text-5xl font-black text-techbridge-burgundy dark:text-white tracking-tighter uppercase">Control Node</h2>
               <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider animate-pulse flex items-center gap-1">
                 <Lock size={10} /> Secure
               </span>
            </div>
            <div className="h-1.5 w-24 bg-techbridge-gold mt-2 rounded-full"></div>
            <p className="text-gray-500 font-medium mt-4">University baseline and cross-departmental audit trails.</p>
          </div>
          <button 
            onClick={() => { logAction('admin_system', 'LOGOUT', 'User closed session'); onLogout(); }} 
            className="bg-white dark:bg-slate-800 border-2 border-red-500 text-red-500 px-8 py-3 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all shadow-sm uppercase tracking-widest text-xs focus:ring-4 focus:ring-red-200 outline-none flex items-center gap-2"
            aria-label="Disconnect secure session"
          >
            <LogOut size={14} /> Disconnect Session
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] brand-shadow border border-techbridge-beige dark:border-slate-700">
              <h3 className="text-2xl font-black mb-8 dark:text-white tracking-tight uppercase text-techbridge-burgundy flex justify-between items-center">
                Audit Intelligence
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleRefreshLogs} 
                    className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-all ${isRefreshing ? 'animate-spin text-techbridge-gold' : 'text-gray-400'}`}
                    title="Sync Logs"
                  >
                    <RefreshCw size={16} />
                  </button>
                  <span className="text-[10px] bg-green-500/10 text-green-600 px-3 py-1 rounded-full border border-green-500/20 font-bold flex items-center gap-1">
                    <Activity size={10} /> Live Feed
                  </span>
                </div>
              </h3>
              <div className="overflow-y-auto max-h-[500px] pr-4 custom-scrollbar" role="log" aria-label="System Audit Logs">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-white dark:bg-slate-800 z-10 shadow-sm">
                    <tr className="border-b dark:border-slate-700 text-techbridge-gold uppercase tracking-[0.2em] text-[10px] font-black">
                      <th className="pb-4 pt-2 font-black pl-2">Time Code</th>
                      <th className="pb-4 pt-2 font-black">Node User</th>
                      <th className="pb-4 pt-2 font-black">Operation</th>
                      <th className="pb-4 pt-2 font-black">Telemetry Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-700">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-techbridge-cream/50 dark:hover:bg-slate-700/50 transition-colors group">
                        <td className="py-5 pl-2 text-gray-400 font-mono text-[10px] group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-5 font-black text-techbridge-burgundy dark:text-white text-xs">
                          {log.user}
                        </td>
                        <td className="py-5">
                            <span className={`px-3 py-1 rounded-lg font-bold text-[9px] uppercase border ${
                              log.action.includes('SUCCESS') ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                              log.action.includes('FAILURE') || log.action.includes('TIMEOUT') ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                              'bg-techbridge-beige/30 dark:bg-slate-700 text-techbridge-burgundy dark:text-techbridge-gold border-techbridge-beige/50'
                            }`}>
                                {log.action}
                            </span>
                        </td>
                        <td className="py-5 text-gray-500 dark:text-gray-400 font-medium text-xs truncate max-w-[200px]" title={log.details}>
                          {log.details}
                        </td>
                      </tr>
                    ))}
                    <div ref={logEndRef} />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="space-y-10">
             <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] brand-shadow border border-techbridge-beige dark:border-slate-700">
              <h3 className="text-2xl font-black mb-6 dark:text-white tracking-tight uppercase text-techbridge-burgundy flex items-center gap-2">
                <Server size={24} className="text-techbridge-gold" /> System Health
              </h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center p-5 bg-techbridge-cream dark:bg-green-900/10 rounded-[1.5rem] border border-techbridge-beige dark:border-slate-600">
                  <span className="text-xs font-black uppercase tracking-widest text-techbridge-burgundy dark:text-white">Public Grid</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-green-600 uppercase">99.9% Up</span>
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-5 bg-techbridge-cream dark:bg-blue-900/10 rounded-[1.5rem] border border-techbridge-beige dark:border-slate-600">
                  <span className="text-xs font-black uppercase tracking-widest text-techbridge-burgundy dark:text-white">LLM Latency</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">120ms Sync</span>
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-5 bg-techbridge-cream dark:bg-purple-900/10 rounded-[1.5rem] border border-techbridge-beige dark:border-slate-600">
                  <span className="text-xs font-black uppercase tracking-widest text-techbridge-burgundy dark:text-white">Registry</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-purple-600 uppercase">52 Tools</span>
                    <span className="w-2.5 h-2.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-techbridge-gold flex items-center gap-2">
                  <Database size={12} /> Administrative Actions
                </h4>
                <button 
                  onClick={() => onViewChange?.('test')}
                  className="w-full py-4 bg-techbridge-burgundy text-white font-black rounded-2xl hover:scale-[1.02] transition-all shadow-md uppercase tracking-widest text-xs border border-techbridge-burgundy/20 focus:ring-4 focus:ring-techbridge-gold/50 outline-none flex items-center justify-center gap-2"
                >
                   Diagnostic Hub
                </button>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    logAction('admin_system', 'CACHE_PURGE', 'Security cache manually cleared');
                    window.location.reload();
                  }}
                  className="w-full py-4 bg-techbridge-gold text-techbridge-burgundy-dark font-black rounded-2xl hover:scale-[1.02] transition-all shadow-md uppercase tracking-widest text-xs focus:ring-4 focus:ring-techbridge-burgundy/20 outline-none flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} /> Purge Security Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
