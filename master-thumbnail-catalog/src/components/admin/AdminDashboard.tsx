import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Shield, FileText, Activity, LogOut, PlayCircle } from 'lucide-react';
import { Diagnostics } from './Diagnostics';
import { TestSuite } from './TestSuite';

export const AdminDashboard: React.FC = () => {
  const { logout, logs } = useAdmin();
  const [activeTab, setActiveTab] = React.useState<'diagnostics' | 'logs' | 'testing'>('diagnostics');

  return (
    <div className="h-full flex flex-col bg-[var(--bg-primary)]">
      {/* Admin Header */}
      <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="text-[var(--accent-color)]" size={24} />
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Admin Console</h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
          aria-label="Logout"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </header>

      {/* Admin Tabs */}
      <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50 px-6">
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'diagnostics'
              ? 'border-[var(--accent-color)] text-[var(--accent-text)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Activity size={16} />
          System Diagnostics
        </button>
        <button
          onClick={() => setActiveTab('testing')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'testing'
              ? 'border-[var(--accent-color)] text-[var(--accent-text)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <PlayCircle size={16} />
          Self-Test Suite
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'border-[var(--accent-color)] text-[var(--accent-text)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <FileText size={16} />
          Audit Logs
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'diagnostics' ? (
          <Diagnostics />
        ) : activeTab === 'testing' ? (
          <TestSuite />
        ) : (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Audit Logs</h2>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--bg-tertiary)] text-[var(--text-secondary)] uppercase tracking-wider font-medium">
                  <tr>
                    <th className="px-6 py-3">Timestamp</th>
                    <th className="px-6 py-3">Action</th>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                        No logs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                        <td className="px-6 py-4 text-[var(--text-secondary)] font-mono text-xs">
                          {log.timestamp.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-[var(--text-primary)] font-medium">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            log.action.includes('LOGIN') ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            log.action.includes('LOGOUT') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[var(--text-secondary)]">
                          {log.user}
                        </td>
                        <td className="px-6 py-4 text-[var(--text-secondary)]">
                          {log.details}
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
    </div>
  );
};
