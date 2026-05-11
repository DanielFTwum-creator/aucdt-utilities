/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Trait } from './types';
import Phase1 from './components/Phase1';
import Phase2 from './components/Phase2';

// ── Admin ─────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'admin123';
const ADMIN_SESSION_KEY = 'parachute-quiz-admin';
const AUDIT_LOG_KEY = 'parachute-quiz-audit';
interface AuditEntry { id: string; timestamp: string; action: string; details?: string; }
function getAuditLogs(): AuditEntry[] { try { return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]'); } catch { return []; } }
function appendAuditLog(action: string, details?: string) {
  const logs = getAuditLogs();
  logs.unshift({ id: Date.now().toString(), timestamp: new Date().toISOString(), action, details });
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
}
function AdminLoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [pwd, setPwd] = useState(''); const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (pwd === ADMIN_PASSWORD) { sessionStorage.setItem(ADMIN_SESSION_KEY, 'true'); appendAuditLog('ADMIN_LOGIN_SUCCESS'); onSuccess(); } else { appendAuditLog('ADMIN_LOGIN_FAIL'); setError('Invalid password.'); setPwd(''); } };
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="admin-login-title" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-2xl">
        <h2 id="admin-login-title" className="text-lg font-bold mb-6 text-gray-900">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label htmlFor="admin-pwd" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="admin-pwd" type="password" value={pwd} onChange={e => { setPwd(e.target.value); setError(''); }} autoFocus required aria-describedby={error ? 'admin-err' : undefined} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            {error && <p id="admin-err" role="alert" className="mt-1 text-xs text-red-500">{error}</p>}</div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-accent text-white py-2 rounded-md text-sm font-semibold hover:opacity-90">Authenticate</button>
            <button type="button" onClick={onClose} className="px-4 border border-gray-300 text-gray-600 py-2 rounded-md text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [logs, setLogs] = useState<AuditEntry[]>([]); const [tab, setTab] = useState<'logs'|'diagnostics'>('logs'); const [storageTest, setStorageTest] = useState<'idle'|'pass'|'fail'>('idle');
  useEffect(() => { setLogs(getAuditLogs()); }, []);
  const handleLogout = () => { appendAuditLog('ADMIN_LOGOUT'); sessionStorage.removeItem(ADMIN_SESSION_KEY); onClose(); };
  const runStorageTest = () => { try { localStorage.setItem('__diag__','1'); localStorage.removeItem('__diag__'); setStorageTest('pass'); appendAuditLog('DIAGNOSTIC_RUN','localStorage: PASS'); } catch { setStorageTest('fail'); appendAuditLog('DIAGNOSTIC_RUN','localStorage: FAIL'); } };
  return (
    <div role="main" aria-label="Admin Dashboard" className="fixed inset-0 z-50 bg-bg overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-6 text-text-main">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <h1 className="text-xl font-bold">Admin Dashboard — Personality Quiz</h1>
          <button onClick={handleLogout} aria-label="Logout from admin" className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200">Logout</button>
        </div>
        <div role="tablist" aria-label="Admin sections" className="flex gap-2">
          {(['logs','diagnostics'] as const).map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium ${tab===t?'bg-accent text-white':'bg-surface text-text-dim hover:text-text-main'}`}>{t==='logs'?'Audit Log':'Diagnostics'}</button>)}
        </div>
        {tab==='logs' && <section aria-label="Audit log"><table className="w-full text-sm border border-border rounded-lg overflow-hidden" aria-label="Admin activity log"><thead className="bg-surface"><tr><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-text-dim">Timestamp</th><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-text-dim">Action</th><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-text-dim">Details</th></tr></thead><tbody className="divide-y divide-border">{logs.length===0?<tr><td colSpan={3} className="px-4 py-8 text-center text-text-dim">No entries yet.</td></tr>:logs.map(l=><tr key={l.id}><td className="px-4 py-2 text-text-dim text-xs">{new Date(l.timestamp).toLocaleString()}</td><td className="px-4 py-2 text-accent font-mono text-xs">{l.action}</td><td className="px-4 py-2 text-text-dim text-xs">{l.details||'—'}</td></tr>)}</tbody></table></section>}
        {tab==='diagnostics' && <section aria-label="System diagnostics" className="space-y-4"><div className="flex items-center justify-between p-4 bg-surface border border-border rounded-lg"><div><p className="text-sm font-medium">LocalStorage Access</p><p className="text-xs text-text-dim">Verifies browser storage</p></div><div className="flex items-center gap-3">{storageTest!=='idle'&&<span role="status" className={`text-xs font-bold px-2 py-1 rounded ${storageTest==='pass'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{storageTest.toUpperCase()}</span>}<button onClick={runStorageTest} className="px-3 py-1.5 bg-bg border border-border text-accent rounded text-xs font-medium hover:bg-surface">Run Test</button></div></div></section>}
      </div>
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState(1);
  const [top10, setTop10] = useState<Trait[]>([]);
  const [top3, setTop3] = useState<Trait[]>([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const check = () => { if (window.location.hash === '#/admin') { sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true' ? setShowAdmin(true) : setShowAdminLogin(true); } };
    check(); window.addEventListener('hashchange', check); return () => window.removeEventListener('hashchange', check);
  }, []);
  const handleAdminClose = useCallback(() => { setShowAdmin(false); window.location.hash = ''; }, []);

  const addTrait = (trait: Trait) => {
    if (top10.length < 10 && !top10.find(t => t.id === trait.id)) {
      setTop10([...top10, trait]);
    }
  };

  const removeTrait = (trait: Trait) => {
    setTop10(top10.filter(t => t.id !== trait.id));
  };

  const moveTrait = (index: number, direction: number) => {
    const newTop10 = [...top10];
    const item = newTop10.splice(index, 1)[0];
    newTop10.splice(index + direction, 0, item);
    setTop10(newTop10);
  };

  const toggleTraitInTop3 = (trait: Trait) => {
    if (top3.find(t => t.id === trait.id)) {
      setTop3(top3.filter(t => t.id !== trait.id));
    } else if (top3.length < 3) {
      setTop3([...top3, trait]);
    }
  };

  return (
    <>
    {showAdmin && <AdminDashboard onClose={handleAdminClose} />}
    {showAdminLogin && <AdminLoginModal onClose={() => { setShowAdminLogin(false); window.location.hash = ''; }} onSuccess={() => { setShowAdminLogin(false); setShowAdmin(true); }} />}
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-md">Skip to main content</a>
    <main id="main-content" className="min-h-screen bg-bg text-text-main flex flex-col">
      <header className="px-12 pt-10 pb-6 flex justify-between items-end" role="banner">
        <div className="brand-group">
          <h1 className="text-[72px] font-extrabold leading-[0.9] -tracking-[2px] uppercase">Which traits define you?</h1>
          <p className="font-mono text-xs text-accent mt-3 uppercase tracking-[2px]">Identify your core personality markers</p>
        </div>
        <div className="phase-indicator text-right">
          <h2 className="text-sm uppercase tracking-[2px] text-text-dim" aria-live="polite">Phase 0{phase} / 03</h2>
          <p className="text-xs text-accent">Selection (Top 10)</p>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-[1fr,320px] gap-6 px-12 pb-12 overflow-hidden">
      {phase === 1 && (
        <Phase1
          selected={top10}
          onAdd={addTrait}
          onRemove={removeTrait}
          onMove={moveTrait}
          onNext={() => setPhase(2)}
        />
      )}
      {phase === 2 && (
        <Phase2
          top10={top10}
          selectedTop3={top3}
          onToggle={toggleTraitInTop3}
          onNext={() => setPhase(3)}
        />
      )}
      {phase === 3 && (
        <div className="flex flex-col gap-6" role="region" aria-label="Phase 3: Reveal">
          <h2 className="text-2xl font-bold">Your Top Traits</h2>
          <div className="flex gap-4">
            {top3.map(t => <div key={t.id} className="p-4 bg-surface border border-border" aria-label={`Trait: ${t.label}`}>{t.label}</div>)}
          </div>
          <button onClick={() => { setPhase(1); setTop10([]); setTop3([]); }} className="btn" aria-label="Restart quiz from beginning">Start Over</button>
        </div>
      )}
      </div>
      <footer className="text-center py-3 text-xs text-text-dim border-t border-border">
        <button type="button" onClick={() => { window.location.hash = '#/admin'; }} aria-label="Open admin dashboard" className="hover:text-text-main transition-colors">Admin</button>
      </footer>
    </main>
    </>
  );
}
