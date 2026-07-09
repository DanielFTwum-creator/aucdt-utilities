import React, { useEffect, useState, createContext, useContext } from 'react';

// WMS SSO gate for Brand Guideline Checker (archetype B — TUC-ICT-SRS-2026-013).
// Sign-in is delegated to WMS (Google OAuth + TOTP MFA), domain-gated to
// @techbridge.edu.gh so all TUC members (students + staff) can use the tool.
// Replaces the bespoke Google-OAuth + client-secret flow. The WMS access token is
// held in memory and injected into this app's /brand-guideline-checker/api/ calls
// via a global fetch wrapper, so the app's service layer authenticates transparently.

const WMS = (import.meta as any).env?.VITE_WMS_BASE ?? 'https://wms.techbridge.edu.gh';
const APP_ID = 'brand-guideline-checker';
// Sub-path base in production (vite base is './', so BASE_URL is unreliable here).
const APP_BASE = '/brand-guideline-checker/';
const API_PREFIXES = [`${APP_BASE}api/`, '/api/']; // prod sub-path + dev

let wmsToken: string | null = null;

// ── Global fetch wrapper: attach the WMS token to this app's API calls only ──
const _fetch = window.fetch.bind(window);
window.fetch = ((input: any, init: any = {}) => {
  const url = typeof input === 'string' ? input : (input?.url ?? '');
  const isOwnApi = typeof url === 'string' && API_PREFIXES.some(p => url.startsWith(p));
  if (wmsToken && isOwnApi) {
    const headers = new Headers(init.headers ?? (typeof input !== 'string' ? input.headers : undefined));
    headers.set('Authorization', `Bearer ${wmsToken}`);
    return _fetch(input, { ...init, headers });
  }
  return _fetch(input, init);
}) as typeof window.fetch;

const wmsPost = (path: string, body?: unknown) =>
  _fetch(`${WMS}${path}`, {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

async function silentRefresh(): Promise<string | null> {
  try { const r = await wmsPost('/api/auth/refresh'); return r.ok ? (await r.json()).access_token : null; }
  catch { return null; }
}
async function exchangeCode(code: string): Promise<string> {
  const r = await wmsPost('/api/auth/exchange', { code });
  if (!r.ok) throw new Error('exchange failed');
  return (await r.json()).access_token;
}
// Return to the app base after the SSO callback so the URL doesn't stick on
// /brand-guideline-checker/auth/callback (which would break relative navigation).
const cleanUrl = () => window.history.replaceState({}, '', APP_BASE);

const AuthContext = createContext<{ handleLogout: () => void } | null>(null);

export function useLogout() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useLogout must be used inside AuthGate');
  return ctx.handleLogout;
}

type Status = 'booting' | 'login' | 'mfa' | 'authed';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('booting');
  const [mfaTicket, setMfaTicket] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const code = p.get('code'), ticket = p.get('mfa_ticket'), err = p.get('error');
    (async () => {
      if (err) { setReason(err); setStatus('login'); cleanUrl(); return; }
      if (ticket) { setMfaTicket(ticket); setStatus('mfa'); cleanUrl(); return; }
      if (code) {
        try { wmsToken = await exchangeCode(code); setStatus('authed'); }
        catch { setReason('oauth'); setStatus('login'); }
        cleanUrl(); return;
      }
      // No callback params: a returning session lands here. Normalise the URL, then
      // silently adopt an existing fleet session (signed into another WMS-SSO app).
      if (!window.location.pathname.endsWith('/') || window.location.search) cleanUrl();
      const t = await silentRefresh();
      if (t) { wmsToken = t; setStatus('authed'); } else setStatus('login');
    })();
  }, []);

  const handleLogout = () => {
    wmsPost('/api/auth/logout').catch(() => { /* best effort */ });
    wmsToken = null;
    window.location.href = APP_BASE;
  };

  if (status === 'booting') return <Centre>CONNECTING…</Centre>;
  if (status === 'login') return <Login reason={reason} />;
  if (status === 'mfa') return <Mfa ticket={mfaTicket} onAuthed={t => { wmsToken = t; setStatus('authed'); }} onFail={() => setStatus('login')} />;
  return <AuthContext.Provider value={{ handleLogout }}>{children}</AuthContext.Provider>;
}

// ── UI (light theme, matches the checker's #F8F6F0 / gold aesthetic) ──
const bg: React.CSSProperties = { minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#F8F6F0', fontFamily: 'Inter, system-ui, sans-serif', color: '#2C1810', padding: 24 };
const card: React.CSSProperties = { width: '100%', maxWidth: 400, background: '#fff', border: '1px solid #ece7db', borderTop: '4px solid #C8A84B', borderRadius: 16, padding: 36, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' };
const accent = '#1a1f3c';
const btn: React.CSSProperties = { width: '100%', padding: 12, marginTop: 16, background: '#fff', border: '1.5px solid #d1d5e0', borderRadius: 8, fontSize: 14, fontWeight: 600, color: accent, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 };
const codeInput: React.CSSProperties = { width: '100%', padding: 12, textAlign: 'center', fontSize: 20, letterSpacing: 8, background: '#fbfaf7', border: '1px solid #d1d5e0', borderRadius: 8, color: '#2C1810', boxSizing: 'border-box' };
const errStyle: React.CSSProperties = { color: '#991b1b', fontSize: 12, marginTop: 12, background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: 10 };

const Centre = ({ children }: { children: React.ReactNode }) =>
  <div style={bg}><span style={{ letterSpacing: 4, color: '#8b90b8', fontSize: 13 }}>{children}</span></div>;

const GoogleIcon = () => (
  <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

function Login({ reason }: { reason: string }) {
  return (
    <div style={bg}><div style={card}>
      <div style={{ width: 48, height: 48, background: accent, borderRadius: 12, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 24, margin: '0 auto 12px' }}>🎨</div>
      <div style={{ color: accent, fontSize: 20, fontWeight: 800 }}>Brand Guideline Checker</div>
      <div style={{ color: '#8b90b8', fontSize: 12, marginTop: 4 }}>Techbridge AI Tools</div>
      {reason && <div style={errStyle}>{reason === 'domain' ? 'Only @techbridge.edu.gh accounts are permitted.' : reason === 'deactivated' ? 'Your account has been deactivated.' : 'Sign-in failed. Please try again.'}</div>}
      <button style={btn} onClick={() => { window.location.href = `${WMS}/api/auth/google?app=${APP_ID}`; }}>
        <GoogleIcon /> Continue with Google
      </button>
      <div style={{ color: '#8b90b8', fontSize: 11, marginTop: 16 }}>Techbridge staff &amp; students</div>
    </div></div>
  );
}

function Mfa({ ticket, onAuthed, onFail }: { ticket: string; onAuthed: (t: string) => void; onFail: () => void }) {
  const [mode, setMode] = useState<'verify' | 'enroll'>('verify');
  const [t, setT] = useState(ticket);
  const [code, setCode] = useState('');
  const [secret, setSecret] = useState<string | null>(null);
  const [otpauthUri, setOtpauthUri] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!t) { onFail(); return null; }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const path = mode === 'verify' ? '/api/auth/mfa/verify' : '/api/auth/mfa/enroll/confirm';
      const body: any = mode === 'verify' ? { mfa_ticket: t, code } : { mfa_ticket: t, secret, code };
      const res = await (await wmsPost(path, body)).json();
      if (res.access_token) { onAuthed(res.access_token); return; }
      if (res.mfa_ticket) setT(res.mfa_ticket);
      throw new Error(res.error || 'Invalid code');
    } catch (err: any) { setError(err?.message || 'Invalid code'); }
    finally { setBusy(false); }
  };

  const beginEnrol = async () => {
    setBusy(true); setError('');
    try {
      const res = await (await wmsPost('/api/auth/mfa/enroll/begin', { mfa_ticket: t })).json();
      if (!res.secret) throw new Error(res.error || 'Could not start enrolment');
      setSecret(res.secret);
      setOtpauthUri(res.otpauthUri || null);
      setMode('enroll');
    } catch (err: any) { setError(err?.message || 'Could not start enrolment'); }
    finally { setBusy(false); }
  };

  return (
    <div style={bg}><div style={card}>
      <div style={{ color: accent, fontSize: 16, fontWeight: 800 }}>{mode === 'verify' ? 'TWO-FACTOR' : 'SET UP MFA'}</div>
      {mode === 'enroll' && secret && (
        <div style={{ background: '#fbfaf7', border: '1px solid #ece7db', borderRadius: 8, padding: 12, margin: '12px 0', textAlign: 'left' }}>
          <div style={{ color: '#8b90b8', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Setup key</div>
          <code style={{ color: '#2C1810', fontSize: 13, wordBreak: 'break-all' }}>{secret}</code>
          {otpauthUri && <div style={{ color: '#b6b2a6', fontSize: 10, wordBreak: 'break-all', marginTop: 6 }}>{otpauthUri}</div>}
        </div>
      )}
      <form onSubmit={submit}>
        <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="123456" autoFocus style={{ ...codeInput, marginTop: 14 }} />
        {error && <div style={errStyle}>{error}</div>}
        <button type="submit" disabled={busy || code.length !== 6} style={{ ...btn, opacity: busy || code.length !== 6 ? 0.5 : 1 }}>{busy ? '…' : (mode === 'verify' ? 'VERIFY' : 'CONFIRM')}</button>
      </form>
      {mode === 'verify'
        ? <button onClick={beginEnrol} disabled={busy} style={{ ...btn, border: 'none', color: '#8b90b8', fontSize: 12, marginTop: 8 }}>First time? Set up authenticator</button>
        : <button onClick={() => { setMode('verify'); setError(''); setCode(''); }} style={{ ...btn, border: 'none', color: '#8b90b8', fontSize: 12, marginTop: 8 }}>← I already have a code</button>}
    </div></div>
  );
}
