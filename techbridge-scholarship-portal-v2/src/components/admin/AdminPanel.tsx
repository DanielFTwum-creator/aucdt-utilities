import React, { useState, useEffect } from 'react';
import { Lock, LogOut, ShieldAlert, Trash2, RefreshCw, Activity, ArrowRight } from 'lucide-react';
import { Input } from '../ui/Input';
import { Tooltip } from '../ui/Tooltip';
import { getLogs, clearLogs, logAction, AuditLogEntry } from '../../services/auditLog';
import { TestDashboard } from './TestDashboard';

interface Props {
  onLogout: () => void;
  onRunSimulation: () => Promise<void>;
}

const ADMIN_PASSWORD = "TUC-SEC-01"; 

export const AdminPanel: React.FC<Props> = ({ onLogout, onRunSimulation }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'security' | 'testing'>('security');

  useEffect(() => {
    if (isAuthenticated) {
      refreshLogs();
    }
  }, [isAuthenticated]);

  const refreshLogs = () => {
    setLogs(getLogs());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      logAction('ADMIN_LOGIN_SUCCESS', 'User logged into admin panel', 'Admin');
      setError("");
    } else {
      setError("Invalid password");
      logAction('ADMIN_LOGIN_FAILED', 'Failed login attempt', 'Anonymous');
    }
  };

  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to delete all audit logs?")) {
      clearLogs();
      refreshLogs();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-24 animate-fade-up">
        <div className="bg-white dark:bg-tuc-ink border border-tuc-gold/30 p-12 relative overflow-hidden transition-colors duration-500">
          <div className="text-center mb-12">
            <h2 className="font-display font-black text-4xl text-tuc-ink dark:text-white uppercase mb-2">Staff Portal</h2>
            <p className="font-body italic text-[#444444] dark:text-tuc-cream/60 text-xl font-medium">
              Restricted Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <Input
              label="Access Code"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              autoFocus
              className="text-center tracking-widest text-2xl"
            />
            <button
              type="submit"
              className="w-full py-4 bg-tuc-gold hover:bg-white text-tuc-ink transition-all font-label tracking-widest uppercase text-sm flex items-center justify-center gap-2"
            >
              Authenticate <ArrowRight size={16} />
            </button>
          </form>
          
          <div className="mt-8 text-center">
             <span className="font-label text-[10px] uppercase tracking-widest text-tuc-gold/40">Secure Connection // TUC-SEC-01</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex justify-between items-end border-b border-tuc-gold/30 pb-6">
        <div>
            <span className="font-label text-tuc-gold tracking-widest text-xs block mb-2">Administrative Control</span>
            <h2 className="font-display font-black text-4xl text-tuc-ink dark:text-white uppercase">
                {activeTab === 'security' ? 'Security Audit' : 'Diagnostics'}
            </h2>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex gap-4">
                <button 
                    onClick={() => setActiveTab('security')}
                    className={`pb-2 transition-all font-label tracking-widest uppercase text-sm ${activeTab === 'security' ? 'text-tuc-gold border-b-2 border-tuc-gold' : 'text-tuc-ink/40 dark:text-tuc-cream/40 hover:text-tuc-gold'}`}
                >
                    Log Feed
                </button>
                <button 
                    onClick={() => setActiveTab('testing')}
                    className={`pb-2 transition-all font-label tracking-widest uppercase text-sm ${activeTab === 'testing' ? 'text-tuc-gold border-b-2 border-tuc-gold' : 'text-tuc-ink/40 dark:text-tuc-cream/40 hover:text-tuc-gold'}`}
                >
                    Simulator
                </button>
            </div>
            <button
              onClick={() => {
                  logAction('ADMIN_LOGOUT', 'User logged out', 'Admin');
                  onLogout();
              }}
              className="text-tuc-ink/40 dark:text-tuc-cream/40 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
        </div>
      </div>

      {activeTab === 'testing' ? (
          <TestDashboard onRunSimulation={onRunSimulation} />
      ) : (
        <div className="border border-tuc-gold/20 bg-white/50 dark:bg-tuc-ink/50 transition-colors duration-500">
            <div className="p-6 border-b border-tuc-gold/20 flex justify-between items-center bg-tuc-gold/5">
                <h3 className="font-label tracking-widest uppercase text-sm text-tuc-gold">Activity Stream</h3>
                <div className="flex gap-4">
                    <Tooltip content="Refresh Feed">
                      <button onClick={refreshLogs} className="text-tuc-ink/40 dark:text-tuc-cream/40 hover:text-tuc-gold transition-colors" title="Refresh">
                          <RefreshCw size={16} />
                      </button>
                    </Tooltip>
                    <Tooltip content="Clear History">
                      <button onClick={handleClearLogs} className="text-tuc-ink/40 dark:text-tuc-cream/40 hover:text-red-500 transition-colors" title="Clear Logs">
                          <Trash2 size={16} />
                      </button>
                    </Tooltip>
                </div>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-white dark:bg-tuc-ink border-b border-tuc-gold/20">
                <tr>
                    <th className="px-6 py-4 font-label tracking-widest uppercase text-xs text-tuc-ink/40 dark:text-tuc-cream/40">Time</th>
                    <th className="px-6 py-4 font-label tracking-widest uppercase text-xs text-tuc-ink/40 dark:text-tuc-cream/40">Event</th>
                    <th className="px-6 py-4 font-label tracking-widest uppercase text-xs text-tuc-ink/40 dark:text-tuc-cream/40">Actor</th>
                    <th className="px-6 py-4 font-label tracking-widest uppercase text-xs text-tuc-ink/40 dark:text-tuc-cream/40">Context</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-tuc-gold/10">
                {logs.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="px-6 py-12 text-center font-body italic text-tuc-ink/40 dark:text-tuc-cream/40">No activity recorded yet.</td>
                    </tr>
                ) : (
                    logs.map((log) => (
                        <tr key={log.id} className="hover:bg-tuc-gold/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-tuc-gold/60">
                            {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4 font-label tracking-wider text-xs text-tuc-ink dark:text-white uppercase">{log.action}</td>
                        <td className="px-6 py-4">
                            <span className="inline-block px-2 py-1 bg-tuc-gold/10 border border-tuc-gold/20 rounded-sm font-mono text-[10px] text-tuc-gold uppercase">
                                {log.user}
                            </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-[#444444] dark:text-tuc-cream/60 max-w-xs truncate font-medium">
                            {log.details || '-'}
                        </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        </div>
      )}
    </div>
  );
};
