import React, { useState, useEffect, useCallback } from 'react';
import { SlidesConverter } from './components/SlidesConverter';

// ── Admin ─────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'admin123';
const ADMIN_SESSION_KEY = 'qmd-slides-admin';
const AUDIT_LOG_KEY = 'qmd-slides-audit';
interface AuditEntry { id: string; timestamp: string; action: string; details?: string; }
function getAuditLogs(): AuditEntry[] { try { return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]'); } catch { return []; } }
function appendAuditLog(action: string, details?: string) {
  const logs = getAuditLogs();
  logs.unshift({ id: Date.now().toString(), timestamp: new Date().toISOString(), action, details });
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
}
const AdminLoginModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [pwd, setPwd] = useState(''); const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (pwd === ADMIN_PASSWORD) { sessionStorage.setItem(ADMIN_SESSION_KEY, 'true'); appendAuditLog('ADMIN_LOGIN_SUCCESS'); onSuccess(); } else { appendAuditLog('ADMIN_LOGIN_FAIL'); setError('Invalid password.'); setPwd(''); } };
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="admin-login-title" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-2xl">
        <h2 id="admin-login-title" className="text-lg font-bold mb-6 text-gray-900">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label htmlFor="admin-pwd" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="admin-pwd" type="password" value={pwd} onChange={e => { setPwd(e.target.value); setError(''); }} autoFocus required aria-describedby={error ? 'admin-err' : undefined} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700" />
            {error && <p id="admin-err" role="alert" className="mt-1 text-xs text-red-500">{error}</p>}</div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-red-800 text-white py-2 rounded-md text-sm font-semibold hover:bg-red-900">Authenticate</button>
            <button type="button" onClick={onClose} className="px-4 border border-gray-300 text-gray-600 py-2 rounded-md text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
const AdminDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [logs, setLogs] = useState<AuditEntry[]>([]); const [tab, setTab] = useState<'logs'|'diagnostics'>('logs'); const [storageTest, setStorageTest] = useState<'idle'|'pass'|'fail'>('idle');
  useEffect(() => { setLogs(getAuditLogs()); }, []);
  const handleLogout = () => { appendAuditLog('ADMIN_LOGOUT'); sessionStorage.removeItem(ADMIN_SESSION_KEY); onClose(); };
  const runStorageTest = () => { try { localStorage.setItem('__diag__','1'); localStorage.removeItem('__diag__'); setStorageTest('pass'); appendAuditLog('DIAGNOSTIC_RUN','localStorage: PASS'); } catch { setStorageTest('fail'); appendAuditLog('DIAGNOSTIC_RUN','localStorage: FAIL'); } };
  return (
    <div role="main" aria-label="Admin Dashboard" className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard — QMD to Google Slides</h1>
          <button onClick={handleLogout} aria-label="Logout from admin" className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200">Logout</button>
        </div>
        <div role="tablist" aria-label="Admin sections" className="flex gap-2">
          {(['logs','diagnostics'] as const).map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium ${tab===t?'bg-red-800 text-white':'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{t==='logs'?'Audit Log':'Diagnostics'}</button>)}
        </div>
        {tab==='logs' && <section aria-label="Audit log"><table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden" aria-label="Admin activity log"><thead className="bg-gray-100"><tr><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Timestamp</th><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Action</th><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Details</th></tr></thead><tbody className="divide-y divide-gray-100">{logs.length===0?<tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No entries yet.</td></tr>:logs.map(l=><tr key={l.id}><td className="px-4 py-2 text-gray-500 text-xs">{new Date(l.timestamp).toLocaleString()}</td><td className="px-4 py-2 text-red-800 font-mono text-xs">{l.action}</td><td className="px-4 py-2 text-gray-400 text-xs">{l.details||'—'}</td></tr>)}</tbody></table></section>}
        {tab==='diagnostics' && <section aria-label="System diagnostics" className="space-y-4"><div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"><div><p className="text-sm font-medium text-gray-900">LocalStorage Access</p><p className="text-xs text-gray-500">Verifies browser storage</p></div><div className="flex items-center gap-3">{storageTest!=='idle'&&<span role="status" className={`text-xs font-bold px-2 py-1 rounded ${storageTest==='pass'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{storageTest.toUpperCase()}</span>}<button onClick={runStorageTest} className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-800 rounded text-xs font-medium hover:bg-red-100">Run Test</button></div></div></section>}
      </div>
    </div>
  );
};

function App(): React.ReactElement {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  useEffect(() => {
    const check = () => { if (window.location.hash === '#/admin') { sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true' ? setShowAdmin(true) : setShowAdminLogin(true); } };
    check(); window.addEventListener('hashchange', check); return () => window.removeEventListener('hashchange', check);
  }, []);
  const handleAdminClose = useCallback(() => { setShowAdmin(false); window.location.hash = ''; }, []);

  return (
    <>
    {showAdmin && <AdminDashboard onClose={handleAdminClose} />}
    {showAdminLogin && <AdminLoginModal onClose={() => { setShowAdminLogin(false); window.location.hash = ''; }} onSuccess={() => { setShowAdminLogin(false); setShowAdmin(true); }} />}
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-red-800 focus:text-white focus:rounded-md">Skip to main content</a>
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-red-900 to-red-700 font-sans text-gray-800">
      <SlidesConverter />
      <footer className="text-center pb-4 text-xs text-red-200/60">
        <button type="button" onClick={() => { window.location.hash = '#/admin'; }} aria-label="Open admin dashboard" className="hover:text-white transition-colors">Admin</button>
      </footer>
    </div>
    </>
  );
}

export default App;
