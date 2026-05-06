import React, { useMemo, useState, useEffect, useCallback } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { DEFAULT_CONTENT } from './constants';
import { parseQmd } from './services/parser';
import { generateHtmlForExport } from './services/export';
import type { PresentationData } from './types';
import { useHistory } from './hooks/useHistory';
import Logo from './components/Logo';

// ── Admin ─────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'admin123';
const ADMIN_SESSION_KEY = 'quarto-editor-admin';
const AUDIT_LOG_KEY = 'quarto-editor-audit';
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
            <input id="admin-pwd" type="password" value={pwd} onChange={e => { setPwd(e.target.value); setError(''); }} autoFocus required aria-describedby={error ? 'admin-err' : undefined} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1538]" />
            {error && <p id="admin-err" role="alert" className="mt-1 text-xs text-red-500">{error}</p>}</div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-[#8B1538] text-white py-2 rounded-md text-sm font-semibold hover:bg-[#7a122f]">Authenticate</button>
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
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard — Quarto Editor</h1>
          <button onClick={handleLogout} aria-label="Logout from admin" className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200">Logout</button>
        </div>
        <div role="tablist" aria-label="Admin sections" className="flex gap-2">
          {(['logs','diagnostics'] as const).map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium ${tab===t?'bg-[#8B1538] text-white':'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{t==='logs'?'Audit Log':'Diagnostics'}</button>)}
        </div>
        {tab==='logs' && <section aria-label="Audit log"><table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden" aria-label="Admin activity log"><thead className="bg-gray-100"><tr><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Timestamp</th><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Action</th><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Details</th></tr></thead><tbody className="divide-y divide-gray-100">{logs.length===0?<tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No entries yet.</td></tr>:logs.map(l=><tr key={l.id}><td className="px-4 py-2 text-gray-500 text-xs">{new Date(l.timestamp).toLocaleString()}</td><td className="px-4 py-2 text-[#8B1538] font-mono text-xs">{l.action}</td><td className="px-4 py-2 text-gray-400 text-xs">{l.details||'—'}</td></tr>)}</tbody></table></section>}
        {tab==='diagnostics' && <section aria-label="System diagnostics" className="space-y-4"><div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"><div><p className="text-sm font-medium text-gray-900">LocalStorage Access</p><p className="text-xs text-gray-500">Verifies browser storage</p></div><div className="flex items-center gap-3">{storageTest!=='idle'&&<span role="status" className={`text-xs font-bold px-2 py-1 rounded ${storageTest==='pass'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{storageTest.toUpperCase()}</span>}<button onClick={runStorageTest} className="px-3 py-1.5 bg-red-50 border border-red-200 text-[#8B1538] rounded text-xs font-medium hover:bg-red-100">Run Test</button></div></div><div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"><div><p className="text-sm font-medium text-gray-900">Saved Presentation</p><p className="text-xs text-gray-500">Checks localStorage for saved content</p></div><span role="status" className={`text-xs font-bold px-2 py-1 rounded ${localStorage.getItem('aucdt-presentation-content')?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{localStorage.getItem('aucdt-presentation-content')?'SAVED':'DEFAULT'}</span></div></section>}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  useEffect(() => {
    const check = () => { if (window.location.hash === '#/admin') { sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true' ? setShowAdmin(true) : setShowAdminLogin(true); } };
    check(); window.addEventListener('hashchange', check); return () => window.removeEventListener('hashchange', check);
  }, []);
  const handleAdminClose = useCallback(() => { setShowAdmin(false); window.location.hash = ''; }, []);

  const getInitialContent = (): string => {
    try {
      const savedContent = localStorage.getItem('aucdt-presentation-content');
      return savedContent ?? DEFAULT_CONTENT;
    } catch (error) {
      console.warn('Could not read from localStorage:', error);
      return DEFAULT_CONTENT;
    }
  };

  const {
    state: content,
    set: setContent,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory<string>(getInitialContent());

  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    setIsSaved(false);
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('aucdt-presentation-content', content);
        setIsSaved(true);
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [content]);

  const presentationData: PresentationData = useMemo(() => parseQmd(content), [content]);

  const getTimestamp = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  };

  const handleExport = () => {
    const html = generateHtmlForExport(presentationData);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const safeTitle = presentationData.frontmatter.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'presentation';
    const timestamp = getTimestamp();
    a.download = `${safeTitle}_${timestamp}.html`;
    a.href = url;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  };

  const handleExportQmd = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const safeTitle = presentationData.frontmatter.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'presentation';
    const timestamp = getTimestamp();
    a.download = `${safeTitle}_${timestamp}.qmd`;
    a.href = url;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  };

  return (
    <>
    {showAdmin && <AdminDashboard onClose={handleAdminClose} />}
    {showAdminLogin && <AdminLoginModal onClose={() => { setShowAdminLogin(false); window.location.hash = ''; }} onSuccess={() => { setShowAdminLogin(false); setShowAdmin(true); }} />}
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#8B1538] focus:text-white focus:rounded-md">Skip to main content</a>
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="bg-[#8B1538] text-white p-3 shadow-md z-10 flex justify-between items-center">
        <Logo />
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportQmd}
            className="bg-gray-200 text-[#8B1538] font-semibold py-2 px-4 rounded-md shadow-md hover:bg-gray-300 transition-colors"
            title="Download presentation source as a .qmd file"
          >
            Export to QMD
          </button>
          <button
            onClick={handleExport}
            className="bg-white text-[#8B1538] font-semibold py-2 px-4 rounded-md shadow-md hover:bg-gray-100 transition-colors"
            title="Download presentation as a self-contained HTML file"
          >
            Export to HTML
          </button>
        </div>
      </header>
      <main id="main-content" className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
        <Editor
          value={content}
          onChange={setContent}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          isSaved={isSaved}
        />
        <Preview data={presentationData} />
      </main>
      <footer className="text-center py-2 text-xs text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <button type="button" onClick={() => { window.location.hash = '#/admin'; }} aria-label="Open admin dashboard" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Admin</button>
      </footer>
    </div>
    </>
  );
};

export default App;