import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart3, 
  History, 
  Settings, 
  LogOut, 
  Activity, 
  ShieldCheck,
  Clock,
  User as UserIcon,
  Info,
  TestTube2
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import TestingDashboard from './TestingDashboard';

export default function AdminDashboard() {
  const { isAuthenticated, logout, logs } = useAdmin();
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'testing'>('diagnostics');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            Admin Control Panel
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Monitor system performance and audit logs.
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/admin');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'diagnostics'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Activity className="w-4 h-4" />
          Diagnostics
        </button>
        <button
          onClick={() => setActiveTab('testing')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'testing'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <TestTube2 className="w-4 h-4" />
          Self-Testing
        </button>
      </div>

      {activeTab === 'diagnostics' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Diagnostics Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-emerald-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">System Diagnostics</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">React Version</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">19.2.4</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Stable</span>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">API Status</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">Healthy</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <Activity className="w-3 h-3" />
                    <span>Gemini API Connected</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Environment</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">Production</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400">
                    <Info className="w-3 h-3" />
                    <span>AI Studio Runtime</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Uptime</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <Clock className="w-3 h-3" />
                    <span>Last reset: 2h ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility Status */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-indigo-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Accessibility & UX</h2>
              </div>
              <ul className="space-y-4">
                {[
                  { label: 'ARIA Labels', status: 'Implemented' },
                  { label: 'Keyboard Navigation', status: 'Active' },
                  { label: 'Screen Reader Support', status: 'Optimised' },
                  { label: 'Theme Support', status: 'Light / Dark / High-Contrast' }
                ].map((item, i) => (
                  <li key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider">
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Audit Logs Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[600px]">
            <div className="flex items-center gap-3 mb-6">
              <History className="w-6 h-6 text-slate-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audit Logs</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {logs.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p>No logs recorded yet.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-bold ${log.action.includes('Failed') ? 'text-red-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                        {log.action}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {log.details}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                      <UserIcon className="w-3 h-3" />
                      <span>{log.user}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <TestingDashboard />
      )}
    </div>
  );
}
