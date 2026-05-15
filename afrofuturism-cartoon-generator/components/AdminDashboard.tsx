import React, { useState, useEffect } from 'react';
import { AuditEntry } from '../types';
import { getAuditLogs, appendAuditLog, clearLibrary } from '../utils/storage';

const ADMIN_PASSWORD = 'tuc-admin-2026';
const ADMIN_SESSION_KEY = 'afrofuturism-cg-admin';

// ── Login modal ────────────────────────────────────────────────────────────────
const AdminLoginModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      appendAuditLog('ADMIN_LOGIN_SUCCESS');
      onSuccess();
    } else {
      appendAuditLog('ADMIN_LOGIN_FAIL');
      setError('Invalid password.');
      setPwd('');
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="admin-title" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e0020] border border-purple-700/50 rounded-2xl p-8 w-full max-w-sm shadow-2xl shadow-purple-900/50">
        <h2 id="admin-title" className="text-lg font-bold text-amber-300 mb-2">Admin Access</h2>
        <p className="text-xs text-purple-400 mb-6">Afrofuturism Cartoon Generator — Secure Area</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-pwd" className="block text-sm font-medium text-purple-200 mb-1.5">Password</label>
            <input
              id="admin-pwd" type="password" value={pwd}
              onChange={e => { setPwd(e.target.value); setError(''); }}
              autoFocus required
              aria-describedby={error ? 'admin-err' : undefined}
              className="w-full bg-black/60 border border-purple-700/50 rounded-xl px-4 py-3 text-sm text-purple-100 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-colors"
            />
            {error && <p id="admin-err" role="alert" className="mt-1 text-xs text-red-400">{error}</p>}
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 text-black py-2.5 rounded-xl text-sm font-semibold hover:from-amber-500 hover:to-amber-400 transition-colors">
              Authenticate
            </button>
            <button type="button" onClick={onClose} className="px-4 border border-purple-700/40 text-purple-400 py-2.5 rounded-xl text-sm hover:bg-purple-900/20 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Dashboard ──────────────────────────────────────────────────────────────────
const AdminDashboardPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [tab, setTab] = useState<'logs' | 'diagnostics'>('logs');
  const [storageTest, setStorageTest] = useState<'idle' | 'pass' | 'fail'>('idle');

  useEffect(() => { setLogs(getAuditLogs()); }, []);

  const handleLogout = () => {
    appendAuditLog('ADMIN_LOGOUT');
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    onClose();
  };

  const handleClearLibrary = () => {
    if (!confirm('Clear entire library? This cannot be undone.')) return;
    clearLibrary();
    appendAuditLog('LIBRARY_CLEARED');
    alert('Library cleared.');
  };

  const runStorageTest = () => {
    try {
      localStorage.setItem('__diag__', '1');
      localStorage.removeItem('__diag__');
      setStorageTest('pass');
      appendAuditLog('DIAGNOSTIC_RUN', 'localStorage: PASS');
    } catch {
      setStorageTest('fail');
      appendAuditLog('DIAGNOSTIC_RUN', 'localStorage: FAIL');
    }
  };

  const ACTION_COLOURS: Record<string, string> = {
    FULL_ANALYSIS: 'text-amber-400',
    QUICK_ANALYSIS: 'text-cyan-400',
    GENERATE_BRIEF: 'text-teal-400',
    COMPARE: 'text-purple-400',
    ADMIN_LOGIN_SUCCESS: 'text-emerald-400',
    ADMIN_LOGIN_FAIL: 'text-red-400',
    ADMIN_LOGOUT: 'text-orange-400',
    DELETE_ENTRY: 'text-red-400',
  };

  return (
    <div role="main" aria-label="Admin Dashboard" className="fixed inset-0 z-50 bg-[#050010] overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-800/40 pb-6">
          <div>
            <h1 className="text-xl font-bold text-amber-300">Admin Dashboard</h1>
            <p className="text-xs text-purple-400 mt-0.5">Afrofuturism Cartoon Generator — TUC ICT</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleClearLibrary} className="px-4 py-2 text-xs border border-red-700/40 text-red-400 hover:bg-red-900/20 rounded-xl transition-colors">
              Clear Library
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-900/30 text-red-300 rounded-xl text-sm font-medium hover:bg-red-900/50 transition-colors border border-red-700/40">
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div role="tablist" className="flex gap-2">
          {(['logs', 'diagnostics'] as const).map(t => (
            <button
              key={t} role="tab" aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                tab === t
                  ? 'bg-amber-600 text-black border-amber-500'
                  : 'border-purple-700/40 text-purple-400 hover:text-purple-200'
              }`}
            >
              {t === 'logs' ? 'Audit Log' : 'Diagnostics'}
            </button>
          ))}
        </div>

        {tab === 'logs' && (
          <section aria-label="Audit log">
            <div className="rounded-xl border border-purple-800/30 overflow-hidden">
              <table className="w-full text-xs" aria-label="Audit activity log">
                <thead className="bg-purple-950/60">
                  <tr>
                    <th className="text-left px-4 py-3 text-purple-400 font-medium">Timestamp</th>
                    <th className="text-left px-4 py-3 text-purple-400 font-medium">Action</th>
                    <th className="text-left px-4 py-3 text-purple-400 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-purple-500">No audit entries yet</td>
                    </tr>
                  ) : (
                    logs.map((log, i) => (
                      <tr key={log.id} className={`border-t border-purple-800/20 ${i % 2 === 0 ? 'bg-black/20' : ''}`}>
                        <td className="px-4 py-3 text-purple-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'medium' })}
                        </td>
                        <td className={`px-4 py-3 font-mono font-medium ${ACTION_COLOURS[log.action] || 'text-purple-300'}`}>
                          {log.action}
                        </td>
                        <td className="px-4 py-3 text-purple-400 max-w-xs truncate">{log.details || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === 'diagnostics' && (
          <section aria-label="System diagnostics" className="space-y-5">
            <div className="rounded-xl border border-purple-800/30 bg-black/30 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">System Status</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <DiagRow label="Audit Entries" value={String(logs.length)} />
                <DiagRow label="Library Size" value={`${(JSON.stringify(localStorage.getItem('afrofuturism-cg-library') || '').length / 1024).toFixed(1)} KB`} />
                <DiagRow label="Browser" value={navigator.userAgent.split(' ').slice(-2).join(' ')} />
              </div>
              <button
                onClick={runStorageTest}
                className="px-4 py-2 border border-purple-700/40 text-purple-300 rounded-xl text-sm hover:bg-purple-900/20 transition-colors"
              >
                Run Storage Test
              </button>
              {storageTest !== 'idle' && (
                <p className={`text-sm font-medium ${storageTest === 'pass' ? 'text-emerald-400' : 'text-red-400'}`}>
                  localStorage: {storageTest === 'pass' ? '✓ PASS' : '✗ FAIL'}
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// ── Exported component ─────────────────────────────────────────────────────────
interface AdminDashboardProps { onClose: () => void; }

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true');
  const [showLogin, setShowLogin] = useState(!authed);

  if (!authed) {
    return showLogin ? (
      <AdminLoginModal onClose={onClose} onSuccess={() => { setAuthed(true); setShowLogin(false); }} />
    ) : null;
  }

  return <AdminDashboardPanel onClose={() => { setAuthed(false); onClose(); }} />;
};

const DiagRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs text-purple-500">{label}</p>
    <p className="text-sm text-purple-200 font-medium truncate">{value}</p>
  </div>
);

export default AdminDashboard;
