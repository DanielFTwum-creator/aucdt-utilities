import React, { useState, useEffect } from 'react';
import { AuditLogEntry } from '../types';
import { Shield, Lock, Activity, Eye, EyeOff, LogIn, AlertCircle, TestTube2, Bot, RefreshCw } from 'lucide-react';
import TestView from './TestView';
import AgentView from './AgentView';

interface AdminViewProps {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  auditLogs: AuditLogEntry[];
  initialTab?: 'logs' | 'testing' | 'agent' | 'refresh';
}

type AdminTab = 'logs' | 'testing' | 'agent' | 'refresh';

const AdminView: React.FC<AdminViewProps> = ({ isAuthenticated, login, auditLogs, initialTab = 'logs' }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab as AdminTab);

  useEffect(() => {
    if (initialTab && (initialTab === 'logs' || initialTab === 'testing' || initialTab === 'agent')) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setError('Invalid administration credentials.');
      setPassword('');
    } else {
      setError('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full">
              <Lock className="w-8 h-8 text-slate-700 dark:text-slate-200" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">Restricted Access</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Please authenticate to view sensitive logs.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  placeholder="Enter password..."
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="flex items-center text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <LogIn size={18} className="mr-2" />
              Authenticate
            </button>
          </form>
          <p className="text-xs text-center text-slate-400 mt-6">Hint: default password is 'admin'</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Tabs */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'logs' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
        >
            <Shield size={16} />
            <span>Security Logs</span>
        </button>
        <button
            onClick={() => setActiveTab('testing')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'testing' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
        >
            <TestTube2 size={16} />
            <span>Puppeteer Self-Test</span>
        </button>
        <button
            onClick={() => setActiveTab('refresh')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'refresh' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
        >
            <RefreshCw size={16} />
            <span>Refresh Status</span>
        </button>
      </div>

      {activeTab === 'refresh' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Project Refresh Status</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Monitoring Phased Refinement Protocol.</p>
                  </div>
                </div>
                <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-md">
                   Phase 2 Active
                </div>
             </div>

             <div className="space-y-4">
                {/* Phase 1 */}
                <div className="flex gap-4 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Activity size={18} />
                   </div>
                   <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                         <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight">PHASE 1: FOUNDATION SETUP</h3>
                         <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">COMPLETED</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                         React 19.2.4 Verified • IEEE SRS v3.0.0 Generated • Project Synchronization Complete.
                      </p>
                   </div>
                </div>

                {/* Phase 2 */}
                <div className="flex gap-4 p-4 rounded-xl border border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20 ring-1 ring-blue-500/20">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white animate-pulse">
                      <Shield size={18} />
                   </div>
                   <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                         <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight">PHASE 2: CORE IMPLEMENTATION</h3>
                         <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">IN PROGRESS</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                         Harding Admin Security • Implementing Audit Persistence • Verifying WCAG Accessibility.
                      </p>
                   </div>
                </div>

                {/* Phase 3 */}
                <div className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 opacity-60">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                      <TestTube2 size={18} />
                   </div>
                   <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                         <h3 className="text-sm font-bold text-slate-400 uppercase tracking-tight">PHASE 3: TESTING FRAMEWORK</h3>
                         <span className="text-[10px] font-bold text-slate-300 uppercase">PENDING</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                         E2E Puppeteer Suite Integration • Real-time Simulation Results • Screenshot Gallery.
                      </p>
                   </div>
                </div>

                {/* Phase 4 */}
                <div className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 opacity-60">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                      <Activity size={18} />
                   </div>
                   <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                         <h3 className="text-sm font-bold text-slate-400 uppercase tracking-tight">PHASE 4: DOCUMENTATION & DIAGRAMS</h3>
                         <span className="text-[10px] font-bold text-slate-300 uppercase">PENDING</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                         System/Data Architecture SVGs • Comprehensive Project Guides • React 19.2.4 Manifest.
                      </p>
                   </div>
                </div>

                {/* Phase 5 */}
                <div className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 opacity-60">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                      <Shield size={18} />
                   </div>
                   <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                         <h3 className="text-sm font-bold text-slate-400 uppercase tracking-tight">PHASE 5: FINAL ALIGNMENT</h3>
                         <span className="text-[10px] font-bold text-slate-300 uppercase">PENDING</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                         SRS Synchronization • Document Collation • Final 100% Alignment Verification.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Shield className="text-emerald-600 dark:text-emerald-400 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Security Audit Log</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tracking sensitive system actions.</p>
                </div>
              </div>
              <div className="text-right">
                 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                   <Activity size={14} className="mr-1" />
                   Live Monitoring
                 </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Timestamp</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3 rounded-tr-lg">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400">No events logged yet.</td>
                    </tr>
                  ) : (
                    auditLogs.slice().reverse().map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs">{log.timestamp}</td>
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{log.user}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                            log.action.includes('LOGIN') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                            log.action.includes('FAILED') ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{log.details}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-4 rounded-lg flex items-start gap-3">
             <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
             <div>
                <h3 className="font-bold text-amber-900 dark:text-amber-200 text-sm">System Note</h3>
                <p className="text-sm text-amber-800 dark:text-amber-300/80">
                   Audit logs are currently stored in session memory. Logs will be cleared upon browser refresh.
                </p>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'testing' && (
        <div className="h-[700px] bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 p-1">
             <TestView />
        </div>
      )}

      {activeTab === 'agent' && (
          <AgentView />
      )}
    </div>
  );
};

export default AdminView;
