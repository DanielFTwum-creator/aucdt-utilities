
import React, { useState, useEffect } from 'react';
import { Lock, LogOut, ShieldAlert, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';
import { logAction, getLogs, clearLogs, AuditLogEntry } from '../lib/auditLogger';
import { ADMIN_CONFIG } from '../constants';

interface AdminProps {
  onBack: () => void;
}

const Admin: React.FC<AdminProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLogs(getLogs());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Account temporarily locked. Please wait.`);
      return;
    }

    if (password === ADMIN_CONFIG.password) {
      setIsAuthenticated(true);
      logAction('LOGIN_SUCCESS', 'Administrator logged in successfully');
      setError('');
      setLoginAttempts(0);
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      logAction('LOGIN_FAILURE', `Failed login attempt (${newAttempts}/${ADMIN_CONFIG.maxLoginAttempts})`);
      
      if (newAttempts >= ADMIN_CONFIG.maxLoginAttempts) {
        setIsLocked(true);
        setError(`Too many failed attempts. Locked for ${ADMIN_CONFIG.lockoutTimeMs / 1000} seconds.`);
        logAction('SECURITY_LOCKOUT', 'Admin login locked due to excessive failed attempts');
        
        setTimeout(() => {
          setIsLocked(false);
          setLoginAttempts(0);
          setError('');
          logAction('SECURITY_UNLOCK', 'Admin login lockout expired');
        }, ADMIN_CONFIG.lockoutTimeMs);
      } else {
        setError('Invalid password');
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
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full border border-gray-100 dark:border-gray-700">
          <div className="flex justify-center mb-6">
            <div className={`p-3 rounded-full ${isLocked ? 'bg-red-600' : 'bg-aucdt-maroon'}`} aria-hidden="true">
              <Lock className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">Admin Portal</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Please authenticate to continue</p>
          
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-aucdt-maroon focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {error && (
              <div id="login-error" className="flex items-center text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded" role="alert">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={isLocked}
              className={`w-full font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                isLocked 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-aucdt-maroon hover:bg-red-900 text-white'
              }`}
            >
              <span>{isLocked ? 'Locked' : 'Authenticate'}</span>
            </button>
          </form>
          <button 
            onClick={onBack}
            className="w-full mt-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm flex items-center justify-center"
          >
            <ArrowLeft size={14} className="mr-1" aria-hidden="true" /> Return to Main Site
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
               <ShieldAlert className="mr-3 text-aucdt-maroon" aria-hidden="true" />
               Security Audit Dashboard
             </h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
               Logged in as Super Admin
             </p>
          </div>
          <nav className="flex space-x-4" aria-label="Admin controls">
            <button 
                onClick={onBack}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
                Return Home
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center"
            >
              <LogOut size={18} className="mr-2" aria-hidden="true" /> Logout
            </button>
          </nav>
        </header>

        <section className="grid grid-cols-1 gap-6" aria-labelledby="audit-logs-title">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 id="audit-logs-title" className="text-lg font-bold text-gray-800 dark:text-white">Audit Logs</h2>
              <button
                onClick={handleClearLogs}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center"
                aria-label="Clear all audit logs"
              >
                <Trash2 size={14} className="mr-2" aria-hidden="true" /> Clear Logs
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th scope="col" className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                    <th scope="col" className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                    <th scope="col" className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                    <th scope="col" className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200 font-medium">{log.user}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            log.action.includes('SUCCESS') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            log.action.includes('FAILURE') || log.action.includes('LOCKOUT') ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{log.details}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No audit logs found.
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
