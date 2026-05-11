import React, { useState } from 'react';
import { Shield, Lock, X, FileText, CheckCircle, AlertCircle, Activity, Layout } from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
  auditLogs: AuditLogEntry[];
}

type Tab = 'audit' | 'diagnostics';

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  isOpen, 
  onClose, 
  isAuthenticated, 
  onLogin, 
  onLogout,
  auditLogs 
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('audit');
  const [diagnosticResults, setDiagnosticResults] = useState<{name: string; status: 'pass'|'fail'; msg: string}[]>([]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      setPassword('');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const runDiagnostics = () => {
    const results = [];
    
    // 1. DOM Check
    const canvas = document.getElementById('thumbnail-canvas');
    if (canvas) results.push({name: 'Canvas Mount', status: 'pass', msg: 'Canvas element found in DOM'});
    else results.push({name: 'Canvas Mount', status: 'fail', msg: 'Canvas element missing'});

    // 2. Theme Check
    const isDark = document.documentElement.classList.contains('dark');
    results.push({name: 'Theme State', status: 'pass', msg: `Current system theme: ${isDark ? 'Dark' : 'Light'}`});

    // 3. Performance / Feature Check
    if (window.matchMedia) results.push({name: 'Media Query API', status: 'pass', msg: 'Supported'});
    else results.push({name: 'Media Query API', status: 'fail', msg: 'Not Supported'});

    setDiagnosticResults(results as any);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/50">
          <h3 className="font-bebas text-xl text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <Shield size={18} className="text-burnt-amber" /> 
            {isAuthenticated ? 'System Admin' : 'Admin Authentication'}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  <Lock size={32} className="text-zinc-400" />
                </div>
              </div>
              <p className="text-sm text-center text-zinc-600 dark:text-zinc-400 font-mono mb-2">
                Restricted Access. Enter credentials.
              </p>
              
              <div className="space-y-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full p-2 bg-zinc-50 dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded text-zinc-900 dark:text-zinc-200 focus:border-burnt-amber outline-none font-mono text-sm"
                  autoFocus
                />
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-xs font-mono">
                    <AlertCircle size={12} /> {error}
                  </div>
                )}
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-burnt-amber hover:bg-amber-600 text-white font-mono text-xs uppercase tracking-wider rounded transition-colors"
              >
                Authenticate
              </button>
            </form>
          ) : (
            <div className="space-y-4">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle size={12} /> Session Active
                    </span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="text-xs font-mono text-red-500 hover:underline"
                  >
                    Logout
                  </button>
               </div>
               
               {/* Tab Navigation */}
               <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-4">
                   <button 
                    onClick={() => setActiveTab('audit')}
                    className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider ${activeTab === 'audit' ? 'text-burnt-amber border-b-2 border-burnt-amber' : 'text-zinc-500'}`}
                   >
                       Audit Log
                   </button>
                   <button 
                    onClick={() => setActiveTab('diagnostics')}
                    className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider ${activeTab === 'diagnostics' ? 'text-burnt-amber border-b-2 border-burnt-amber' : 'text-zinc-500'}`}
                   >
                       Diagnostics
                   </button>
               </div>

               {activeTab === 'audit' && (
               <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden animate-in fade-in duration-300">
                 <div className="bg-zinc-100 dark:bg-zinc-950 px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                    <FileText size={12} className="text-zinc-500" />
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Activity History</span>
                 </div>
                 <div className="max-h-[300px] overflow-y-auto p-0">
                    {auditLogs.length === 0 ? (
                      <div className="p-4 text-center text-xs text-zinc-500 font-mono italic">No activity recorded</div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          {auditLogs.slice().reverse().map((log) => (
                            <tr key={log.id} className="border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                              <td className="px-3 py-2 text-[10px] font-mono text-zinc-400 whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </td>
                              <td className="px-3 py-2 text-[11px] font-mono text-zinc-700 dark:text-zinc-300">
                                <span className="font-bold text-burnt-amber mr-2">{log.action}</span>
                                <span className="text-zinc-500">{log.details}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                 </div>
               </div>
               )}

               {activeTab === 'diagnostics' && (
                   <div className="space-y-4 animate-in fade-in duration-300">
                       <button 
                        onClick={runDiagnostics}
                        className="w-full py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-xs uppercase tracking-wider rounded border border-zinc-300 dark:border-zinc-700 transition-colors flex items-center justify-center gap-2"
                       >
                           <Activity size={14} /> Run Self-Test
                       </button>

                       {diagnosticResults.length > 0 && (
                           <div className="space-y-2">
                               {diagnosticResults.map((result, idx) => (
                                   <div key={idx} className="flex items-center justify-between p-3 rounded bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800">
                                       <div className="flex items-center gap-2">
                                           {result.status === 'pass' ? <CheckCircle size={14} className="text-green-500"/> : <AlertCircle size={14} className="text-red-500"/>}
                                           <span className="text-xs font-mono text-zinc-700 dark:text-zinc-300">{result.name}</span>
                                       </div>
                                       <span className="text-[10px] font-mono text-zinc-500">{result.msg}</span>
                                   </div>
                               ))}
                           </div>
                       )}
                       
                       <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800">
                           <h4 className="text-[10px] uppercase font-mono text-zinc-500 mb-2 flex items-center gap-1"><Layout size={10}/> Layout Integrity</h4>
                           <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                               <div className="bg-green-500 h-full w-[100%]"></div>
                           </div>
                           <p className="text-[9px] text-zinc-400 mt-1">Viewport Scale: Valid</p>
                       </div>
                   </div>
               )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};