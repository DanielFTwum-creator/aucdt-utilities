
import React, { useState, useEffect } from 'react';
import { Lock, LogOut, ShieldAlert, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';
import { logAction, getLogs, clearLogs, AuditLogEntry } from '../lib/auditLogger.ts';
import { ADMIN_CONFIG } from '../constants.ts';

interface AdminProps {
  onBack: () => void;
}

const STORAGE_KEY_ATTEMPTS = 'admin_login_attempts';
const STORAGE_KEY_LOCKOUT = 'admin_lockout_until';

const Admin: React.FC<AdminProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);

  // Initialize state from local storage on mount
  useEffect(() => {
    const lockoutUntil = localStorage.getItem(STORAGE_KEY_LOCKOUT);
    if (lockoutUntil) {
      const remainingTime = parseInt(lockoutUntil, 10) - Date.now();
      if (remainingTime > 0) {
        setIsLocked(true);
        startLockoutTimer(remainingTime);
      } else {
        localStorage.removeItem(STORAGE_KEY_LOCKOUT);
        localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
      }
    }

    if (isAuthenticated) {
      setLogs(getLogs());
    }
  }, [isAuthenticated]);

  const startLockoutTimer = (durationMs: number) => {
    setLockoutTimer(Math.ceil(durationMs / 1000));
    
    // Update visual timer every second
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setIsLocked(false);
          setLockoutTimer(null);
          localStorage.removeItem(STORAGE_KEY_LOCKOUT);
          localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
          setError('');
          logAction('SECURITY_UNLOCK', 'Admin login lockout expired');
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      return;
    }

    if (password === ADMIN_CONFIG.password) {
      setIsAuthenticated(true);
      logAction('LOGIN_SUCCESS', 'Administrator logged in successfully');
      setError('');
      // Reset security counters
      localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
      localStorage.removeItem(STORAGE_KEY_LOCKOUT);
    } else {
      const currentAttempts = parseInt(localStorage.getItem(STORAGE_KEY_ATTEMPTS) || '0', 10) + 1;
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, currentAttempts.toString());
      
      logAction('LOGIN_FAILURE', `Failed login attempt (${currentAttempts}/${ADMIN_CONFIG.maxLoginAttempts})`);
      
      if (currentAttempts >= ADMIN_CONFIG.maxLoginAttempts) {
        setIsLocked(true);
        const lockoutUntil = Date.now() + ADMIN_CONFIG.lockoutTimeMs;
        localStorage.setItem(STORAGE_KEY_LOCKOUT, lockoutUntil.toString());
        
        setError(`Too many failed attempts.`);
        logAction('SECURITY_LOCKOUT', 'Admin login locked due to excessive failed attempts');
        startLockoutTimer(ADMIN_CONFIG.lockoutTimeMs);
      } else {
        setError(`Invalid password. ${ADMIN_CONFIG.maxLoginAttempts - currentAttempts} attempts remaining.`);
      }
    }
  };

  const handleLogout = () => {
    logAction('LOGOUT', 'Administrator logged out');
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear the audit logs? This action cannot be undone.')) {
      clearLogs();
      setLogs(getLogs());
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full border border-gray-100 dark:border-gray-700">
          <div className="flex justify-center mb-6">
            <div className={`p-3 rounded-full transition-colors duration-300 ${isLocked ? 'bg-red-600' : 'bg-tuc-forest'}`} aria-hidden="true">
              <Lock className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">Admin Portal</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            {isLocked ? `Security Lockout Active` : `Please authenticate to continue`}
          </p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
                aria-invalid={!!error}
                aria-describedby={error ? "login-error" : undefined}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-tuc-forest focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800"
                placeholder={isLocked ? "Access Suspended" : "Enter admin password"}
                autoFocus
              />
            </div>
            
            {/* Error / Status Message Area */}
            <div aria-live="polite" className="min-h-[3rem]">
              {isLocked && (
                 <div className="flex items-center text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                   <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                   <span className="text-sm font-bold">Locked for {lockoutTimer}s</span>
                 </div>
              )}
              {!isLocked && error && (
                <div id="login-error" className="flex items-center text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded" role="alert">
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLocked}
              className={`w-full font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-md focus:outline-none focus:ring-2 focus:ring-tuc-gold ${
                isLocked 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-tuc-forest hover:bg-tuc-midnight text-white hover:shadow-lg'
              }`}
            >
              <span>{isLocked ? 'Locked' : 'Authenticate'}</span>
            </button>
          </form>
          <button 
            onClick={onBack}
            className="w-full mt-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm flex items-center justify-center font-medium transition-colors p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-tuc-gold"
          >
            <ArrowLeft size={16} className="mr-2" aria-hidden="true" /> Return to Main Site
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm gap-4 border border-gray-100 dark:border-gray-700">
          <div>
             <h1 className="text-2xl font-black text-gray-800 dark:text-white flex items-center uppercase tracking-tight">
               <ShieldAlert className="mr-3 text-tuc-forest" aria-hidden="true" />
               Security Audit Dashboard
             </h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">
               Session Active • Super Admin Privileges
             </p>
          </div>
          <nav className="flex space-x-4" aria-label="Admin controls">
            <button 
                onClick={onBack}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-bold text-sm focus:outline-none focus:ring-2 focus:ring-tuc-gold"
            >
                Return Home
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center font-bold text-sm focus:outline-none focus:ring-2 focus:ring-tuc-gold"
            >
              <LogOut size={18} className="mr-2" aria-hidden="true" /> Logout
            </button>
          </nav>
        </header>

        <section className="grid grid-cols-1 gap-6" aria-labelledby="audit-logs-title">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 id="audit-logs-title" className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-wider">System Event Log</h2>
              <button
                onClick={handleClearLogs}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Clear all audit logs"
              >
                <Trash2 size={14} className="mr-2" aria-hidden="true" /> Clear History
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-700">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th scope="col" className="py-4 px-6 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                    <th scope="col" className="py-4 px-6 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">User</th>
                    <th scope="col" className="py-4 px-6 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Action</th>
                    <th scope="col" className="py-4 px-6 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-4 px-6 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap font-mono">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-800 dark:text-gray-200 font-bold">{log.user}</td>
                        <td className="py-4 px-6 text-sm">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            log.action.includes('SUCCESS') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            log.action.includes('FAILURE') || log.action.includes('LOCKOUT') ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300 font-medium">{log.details}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-400 dark:text-gray-500 font-medium italic">
                        No audit logs found. System is clean.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Admin;
