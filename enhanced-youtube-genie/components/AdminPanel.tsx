import React, { useState, useEffect, useCallback } from 'react';

// Admin password is stored as a sessionStorage flag after successful entry.
// The password itself lives in the ADMIN_PASSWORD env var (server-side only).
// For the client-side gate, we use a hardcoded default that the admin can
// change by setting VITE_ADMIN_PASSWORD at build time.
const ADMIN_SESSION_KEY = 'youtube-genie-admin-auth';
const ADMIN_PASSWORD    = import.meta.env.VITE_ADMIN_PASSWORD ?? 'tuc-ict-2026';
const STATS_KEY         = 'youtube-genie-stats';
const FORM_KEY          = 'youtube-genie-form-data';

interface Stats {
  generations: number;
  lastUsed: string | null;
}

// ── Audit log: last 20 generations stored in sessionStorage ──────
const AUDIT_KEY = 'youtube-genie-admin-audit';

function recordAuditEvent(event: string) {
  const raw = sessionStorage.getItem(AUDIT_KEY) ?? '[]';
  const log: { ts: string; event: string }[] = JSON.parse(raw);
  log.unshift({ ts: new Date().toISOString(), event });
  sessionStorage.setItem(AUDIT_KEY, JSON.stringify(log.slice(0, 20)));
}

function getAuditLog(): { ts: string; event: string }[] {
  try {
    return JSON.parse(sessionStorage.getItem(AUDIT_KEY) ?? '[]');
  } catch {
    return [];
  }
}

// ── Password gate ─────────────────────────────────────────────────
function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [attempts, setAttempts] = useState(0);
  const locked = attempts >= 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
      recordAuditEvent('Admin login successful');
      onSuccess();
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setError(next >= 5 ? 'Too many attempts. Close and reopen the panel.' : 'Incorrect password.');
      setPassword('');
    }
  };

  return (
    <div
      className="max-w-sm mx-auto mt-16 p-8 rounded-xl"
      style={{ background: 'var(--tuc-surface)', border: '1px solid var(--tuc-border)' }}
    >
      <h2
        className="text-xl font-bold mb-1"
        style={{ color: 'var(--tuc-gold)', fontFamily: "'Playfair Display', serif" }}
      >
        Admin Access
      </h2>
      <p className="text-xs mb-6" style={{ color: 'var(--tuc-text-muted)' }}>
        YouTube Description Genie — restricted area
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--tuc-text-muted)' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            disabled={locked}
            autoFocus
            className="w-full px-3 py-2 rounded-md text-sm outline-none"
            style={{
              background: 'var(--tuc-input-bg)',
              border: '1px solid ' + (error ? 'var(--tuc-error)' : 'var(--tuc-border)'),
              color: 'var(--tuc-text)',
            }}
          />
        </div>

        {error && (
          <p className="text-xs" style={{ color: 'var(--tuc-error)' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={locked || !password}
          className="w-full py-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-40"
          style={{ background: 'var(--tuc-gold)', color: 'var(--tuc-bg)' }}
        >
          Enter
        </button>
      </form>
    </div>
  );
}

// ── Admin dashboard ───────────────────────────────────────────────
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats]     = useState<Stats>({ generations: 0, lastUsed: null });
  const [auditLog, setAuditLog] = useState<{ ts: string; event: string }[]>([]);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (raw) setStats(JSON.parse(raw) as Stats);
    } catch { /* empty */ }
    setAuditLog(getAuditLog());
  }, []);

  const handleClearStats = useCallback(() => {
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(FORM_KEY);
    setStats({ generations: 0, lastUsed: null });
    setCleared(true);
    recordAuditEvent('Admin cleared all stats and form data');
    setAuditLog(getAuditLog());
  }, []);

  const handleAdminLogout = useCallback(() => {
    recordAuditEvent('Admin logout');
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    onLogout();
  }, [onLogout]);

  const formatDate = (iso: string | null) => {
    if (!iso) return 'Never';
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2
          className="text-xl font-bold"
          style={{ color: 'var(--tuc-gold)', fontFamily: "'Playfair Display', serif" }}
        >
          Admin Panel
        </h2>
        <button
          onClick={handleAdminLogout}
          className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          style={{ background: 'var(--tuc-surface-2)', color: 'var(--tuc-text-muted)' }}
        >
          Exit Admin
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className="p-5 rounded-xl"
          style={{ background: 'var(--tuc-surface)', border: '1px solid var(--tuc-border)' }}
        >
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--tuc-text-muted)' }}>
            Total Generations
          </p>
          <p className="text-4xl font-bold" style={{ color: 'var(--tuc-gold)' }}>
            {stats.generations}
          </p>
        </div>
        <div
          className="p-5 rounded-xl"
          style={{ background: 'var(--tuc-surface)', border: '1px solid var(--tuc-border)' }}
        >
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--tuc-text-muted)' }}>
            Last Used
          </p>
          <p className="text-base font-semibold" style={{ color: 'var(--tuc-text)' }}>
            {formatDate(stats.lastUsed)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div
        className="p-5 rounded-xl"
        style={{ background: 'var(--tuc-surface)', border: '1px solid var(--tuc-border)' }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--tuc-text)' }}>
          Data Management
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleClearStats}
            disabled={cleared}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-40"
            style={{ background: 'var(--tuc-error-bg)', color: 'var(--tuc-error)', border: '1px solid var(--tuc-error)' }}
          >
            {cleared ? 'Cleared' : 'Clear All Stats and Form Data'}
          </button>
        </div>
        <p className="mt-2 text-xs" style={{ color: 'var(--tuc-text-muted)' }}>
          Removes generation count, last-used timestamp, and saved form data from this browser.
        </p>
      </div>

      {/* Audit log */}
      <div
        className="p-5 rounded-xl"
        style={{ background: 'var(--tuc-surface)', border: '1px solid var(--tuc-border)' }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--tuc-text)' }}>
          Session Audit Log
        </h3>
        {auditLog.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--tuc-text-muted)' }}>No events this session.</p>
        ) : (
          <ul className="space-y-2">
            {auditLog.map((entry, i) => (
              <li key={i} className="flex gap-3 text-xs">
                <span className="flex-shrink-0 font-mono" style={{ color: 'var(--tuc-text-muted)' }}>
                  {new Date(entry.ts).toLocaleTimeString('en-GB')}
                </span>
                <span style={{ color: 'var(--tuc-text)' }}>{entry.event}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs" style={{ color: 'var(--tuc-text-muted)' }}>
          Session-only. Clears when the browser tab is closed.
        </p>
      </div>
    </div>
  );
}

// ── Exported component ────────────────────────────────────────────
export function AdminPanel({ onBack }: { onBack: () => void }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'
  );

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <AdminDashboard
      onLogout={() => {
        setAuthed(false);
        onBack();
      }}
    />
  );
}
