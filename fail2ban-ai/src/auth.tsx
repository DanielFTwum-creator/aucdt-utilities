import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

// WMS SSO gate for fail2ban-ai (TUC-ICT-SRS-2026-013, archetype B, staff-only).
// fail2ban-ai exposes the server's banned-IP list, attack origins and exposed
// services — reconnaissance-grade data — so it is gated behind WMS SSO before
// any public exposure. Wraps the app: silently adopts an existing WMS session,
// otherwise shows "Continue with Google". Holds the WMS access token in memory
// and injects it into every same-origin /api/ request via a global fetch
// wrapper, so the app components authenticate transparently.

const WMS = (import.meta as any).env?.VITE_WMS_BASE ?? 'https://wms.techbridge.edu.gh';
const APP_ID = 'fail2ban-ai';
// Sub-path base (e.g. '/fail2ban-ai/'); Vite injects BASE_URL from vite.config.
const APP_BASE = (import.meta as any).env?.BASE_URL ?? '/';
const API_PREFIX = `${APP_BASE}api/`; // e.g. '/fail2ban-ai/api/'

let wmsToken: string | null = null;

// ── Global fetch wrapper: attach the WMS token to this app's API calls only ──
// Same-origin '/fail2ban-ai/api/...' calls get the Bearer token; external calls
// (e.g. the ipwho.is geolocation lookup) are left untouched.
const _fetch = window.fetch.bind(window);
window.fetch = ((input: any, init: any = {}) => {
  const url = typeof input === 'string' ? input : (input?.url ?? '');
  if (wmsToken && typeof url === 'string' && url.startsWith(API_PREFIX)) {
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
// /fail2ban-ai/auth/callback (which would break relative navigation).
const cleanUrl = () => window.history.replaceState({}, '', APP_BASE);

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
      // No callback params: a returning session lands here, sometimes still on
      // the /auth/callback path. Normalise the URL back to the app base.
      if (!window.location.pathname.endsWith('/') || window.location.search) cleanUrl();
      const t = await silentRefresh();
      if (t) { wmsToken = t; setStatus('authed'); } else setStatus('login');
    })();
  }, []);

  if (status === 'booting') return <Centre>CONNECTING…</Centre>;
  if (status === 'login') return <Login reason={reason} />;
  if (status === 'mfa') return <Mfa ticket={mfaTicket} onAuthed={t => { wmsToken = t; setStatus('authed'); }} onFail={() => setStatus('login')} />;
  return <>{children}</>;
}

// ── UI ──
const bg: React.CSSProperties = { minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0b1220', fontFamily: 'ui-monospace, monospace', color: '#cbd5e1', padding: 24 };
const card: React.CSSProperties = { width: '100%', maxWidth: 380, background: '#0f1a2e', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 12, padding: 32, textAlign: 'center' };
const accent = '#38bdf8';
const btn: React.CSSProperties = { width: '100%', padding: '12px', marginTop: 14, background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.4)', color: accent, borderRadius: 8, fontSize: 14, letterSpacing: 2, cursor: 'pointer' };
const codeInput: React.CSSProperties = { width: '100%', padding: 12, textAlign: 'center', fontSize: 20, letterSpacing: 8, background: '#0b1220', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8, color: '#e2e8f0', boxSizing: 'border-box' };
const errStyle: React.CSSProperties = { color: '#f87171', fontSize: 12, marginTop: 12 };

const Centre = ({ children }: { children: React.ReactNode }) =>
  <div style={bg}><span style={{ letterSpacing: 4, color: '#64748b', fontSize: 13 }}>{children}</span></div>;

function Login({ reason }: { reason: string }) {
  return (
    <div style={bg}><div style={card}>
      <div style={{ color: accent, fontSize: 22, fontWeight: 800, letterSpacing: 4 }}>FAIL2BAN AI</div>
      <div style={{ color: '#64748b', fontSize: 11, letterSpacing: 3, marginTop: 4 }}>THREAT INTELLIGENCE CONSOLE</div>
      {reason && <div style={errStyle}>{reason === 'domain' ? 'Only @techbridge.edu.gh accounts are permitted.' : reason === 'deactivated' ? 'Your account has been deactivated.' : 'Sign-in failed. Please try again.'}</div>}
      <button style={btn} onClick={() => { window.location.href = `${WMS}/api/auth/google?app=${APP_ID}`; }}>CONTINUE WITH GOOGLE</button>
      <div style={{ color: '#475569', fontSize: 10, marginTop: 14 }}>Techbridge staff access only</div>
    </div></div>
  );
}

function Mfa({ ticket, onAuthed, onFail }: { ticket: string; onAuthed: (t: string) => void; onFail: () => void }) {
  const [mode, setMode] = useState<'verify' | 'enroll'>('verify');
  const [t, setT] = useState(ticket);
  const [code, setCode] = useState('');
  const [secret, setSecret] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!t) { onFail(); return null; }

  const land = (access: string) => onAuthed(access);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const path = mode === 'verify' ? '/api/auth/mfa/verify' : '/api/auth/mfa/enroll/confirm';
      const body: any = mode === 'verify' ? { mfa_ticket: t, code } : { mfa_ticket: t, secret, code };
      const res = await (await wmsPost(path, body)).json();
      if (res.access_token) { land(res.access_token); return; }
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
      setQr(await QRCode.toDataURL(res.otpauthUri, { margin: 1, width: 190 }));
      setMode('enroll');
    } catch (err: any) { setError(err?.message || 'Could not start enrolment'); }
    finally { setBusy(false); }
  };

  return (
    <div style={bg}><div style={card}>
      <div style={{ color: accent, fontSize: 16, fontWeight: 800, letterSpacing: 3 }}>{mode === 'verify' ? 'TWO-FACTOR' : 'SET UP MFA'}</div>
      {mode === 'enroll' && qr && <img src={qr} alt="QR" style={{ display: 'block', margin: '14px auto', borderRadius: 6 }} />}
      {mode === 'enroll' && secret && <div style={{ fontSize: 10, color: '#64748b', wordBreak: 'break-all', marginBottom: 10 }}>Manual key: {secret}</div>}
      <form onSubmit={submit}>
        <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="123456" autoFocus style={{ ...codeInput, marginTop: 14 }} />
        {error && <div style={errStyle}>{error}</div>}
        <button type="submit" disabled={busy || code.length !== 6} style={btn}>{busy ? '…' : (mode === 'verify' ? 'VERIFY' : 'CONFIRM')}</button>
      </form>
      {mode === 'verify' && <button onClick={beginEnrol} disabled={busy} style={{ ...btn, background: 'none', border: 'none', color: '#64748b', fontSize: 11 }}>First time? Set up authenticator</button>}
    </div></div>
  );
}
