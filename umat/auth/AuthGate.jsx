// WMS SSO gate for UMAT (archetype B — no router; TUC-ICT-SDD-2026-001).
// On mount: handle the WMS callback params (?code / ?mfa_ticket / ?error) landing
// on /umat/auth/callback, then clean the URL; otherwise attempt a silent
// refresh (shared .techbridge.edu.gh cookie) to adopt an existing fleet session.
// Staff-only: WMS domain-gates @techbridge.edu.gh accounts.
import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { api, post, rawPost, setAccessToken, setOnAuthLost, authBase } from './api.js';

const APP_ID = 'umat';
const BASE = import.meta.env.BASE_URL || '/umat/';

export default function AuthGate({ children }) {
  const [phase, setPhase] = useState('boot');       // boot | login | mfa | authed
  const [user, setUser] = useState(null);
  const [reason, setReason] = useState(null);       // login error marker
  const [mfaTicket, setMfaTicket] = useState(null);
  const ran = useRef(false);

  const land = ({ access_token, user: u }) => {
    setAccessToken(access_token);
    setUser(u);
    setPhase('authed');
  };

  const toLogin = (why) => {
    setAccessToken(null);
    setUser(null);
    setReason(why || null);
    setPhase('login');
  };

  useEffect(() => {
    if (ran.current) return;                        // guard against StrictMode double-run
    ran.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const ticket = params.get('mfa_ticket');
    const err = params.get('error');
    if (code || ticket || err) window.history.replaceState(null, '', BASE);

    if (err) { toLogin(err); return; }
    if (ticket) { setMfaTicket(ticket); setPhase('mfa'); return; }
    if (code) {
      rawPost('/api/auth/exchange', { code })
        .then((res) => { setOnAuthLost(() => toLogin(null)); land(res); })
        .catch(() => toLogin('oauth'));
      return;
    }

    // No callback params — silent refresh to adopt an existing fleet session.
    (async () => {
      try {
        const data = await rawPost('/api/auth/refresh');
        setAccessToken(data.access_token);
        const me = await api('/api/me');
        setOnAuthLost(() => toLogin(null));
        setUser(me);
        setPhase('authed');
      } catch {
        toLogin(null);
      }
    })();
  }, []);

  const logout = async () => {
    try { await post('/api/auth/logout'); } catch { /* ignore */ }
    toLogin(null);
  };

  if (phase === 'boot') {
    return <div style={centre}><p style={{ color: '#64748b' }}>Signing you in…</p></div>;
  }
  if (phase === 'login') return <LoginView reason={reason} />;
  if (phase === 'mfa') {
    return <MfaView ticket={mfaTicket} setTicket={setMfaTicket}
      onDone={(res) => { setOnAuthLost(() => toLogin(null)); land(res); }}
      onCancel={() => toLogin(null)} />;
  }

  return (
    <>
      <div style={strip}>
        <span>Signed in as <strong>{user?.email}</strong></span>
        <button type="button" onClick={logout} style={stripBtn}>Sign out</button>
      </div>
      {children}
    </>
  );
}

function LoginView({ reason }) {
  const continueWithGoogle = () => {
    window.location.href = `${authBase}/api/auth/google?app=${APP_ID}`;
  };

  return (
    <div style={wrap}>
      <div style={card}>
        <img src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" alt="TUC" width={60}
          style={{ marginBottom: 16, objectFit: 'contain' }} />
        <div style={brand}>Techbridge University College</div>
        <h1 style={title}>UMaT Tracker</h1>
        <p style={tagline}>Curriculum Recommendations Tracker</p>
        <p style={subtitle}>Sign in with your TUC Google Workspace account.</p>

        {reason === 'domain' && <div style={errBox}>Only @techbridge.edu.gh accounts are permitted.</div>}
        {reason === 'deactivated' && <div style={errBox}>Your account has been deactivated.</div>}
        {reason === 'oauth' && <div style={errBox}>Sign-in failed. Please try again.</div>}

        <button type="button" onClick={continueWithGoogle} style={googleBtn}>
          <GoogleG /> Continue with Google
        </button>
        <p style={hint}>Use your <strong>@techbridge.edu.gh</strong> account.</p>
      </div>
    </div>
  );
}

function MfaView({ ticket, setTicket, onDone, onCancel }) {
  const [mode, setMode] = useState('verify');
  return (
    <div style={centre}>
      <div style={mfaCard}>
        {mode === 'verify'
          ? <VerifyForm ticket={ticket} setTicket={setTicket} onDone={onDone} onEnrol={() => setMode('enroll')} onCancel={onCancel} />
          : <EnrolWizard ticket={ticket} setTicket={setTicket} onDone={onDone} onBack={() => setMode('verify')} />}
      </div>
    </div>
  );
}

function VerifyForm({ ticket, setTicket, onDone, onEnrol, onCancel }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const verify = async (e) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const res = await rawPost('/api/auth/mfa/verify', { mfa_ticket: ticket, code });
      if (res.mfa_ticket) { setTicket(res.mfa_ticket); throw new Error(res.error || 'Invalid code'); }
      onDone(res);
    } catch (err) { setError(err.message || 'Invalid code'); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={verify}>
      <h1 style={h1}>Two-factor verification</h1>
      <p style={sub}>Enter the 6-digit code from your authenticator app.</p>
      <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        inputMode="numeric" autoComplete="one-time-code" placeholder="123456" autoFocus style={codeInput} />
      {error && <div style={errText}>{error}</div>}
      <button type="submit" disabled={busy || code.length !== 6} style={btn}>{busy ? 'Verifying…' : 'Verify'}</button>
      <button type="button" onClick={onEnrol} style={linkBtn}>First time? Set up your authenticator</button>
      <button type="button" onClick={onCancel} style={linkBtn}>← Back to sign in</button>
    </form>
  );
}

function EnrolWizard({ ticket, setTicket, onDone, onBack }) {
  const [secret, setSecret] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [started, setStarted] = useState(false);

  const begin = async () => {
    setBusy(true); setError(null);
    try {
      const res = await rawPost('/api/auth/mfa/enroll/begin', { mfa_ticket: ticket });
      setSecret(res.secret);
      setQrDataUrl(await QRCode.toDataURL(res.otpauthUri, { margin: 1, width: 200 }));
      setStarted(true);
    } catch (err) { setError(err.message || 'Could not start enrolment'); }
    finally { setBusy(false); }
  };

  const confirm = async (e) => {
    e.preventDefault();
    if (!secret) return;
    setBusy(true); setError(null);
    try {
      const res = await rawPost('/api/auth/mfa/enroll/confirm', { mfa_ticket: ticket, secret, code });
      if (res.mfa_ticket) { setTicket(res.mfa_ticket); throw new Error(res.error || 'Invalid code'); }
      onDone(res);
    } catch (err) { setError(err.message || 'Invalid code'); }
    finally { setBusy(false); }
  };

  if (!started) {
    return (
      <div>
        <h1 style={h1}>Set up two-factor authentication</h1>
        <p style={sub}>Your account requires an authenticator app (Google Authenticator, Authy, 1Password…). We’ll show a QR code to scan.</p>
        {error && <div style={errText}>{error}</div>}
        <button type="button" onClick={begin} disabled={busy} style={btn}>{busy ? 'Preparing…' : 'Begin setup'}</button>
        <button type="button" onClick={onBack} style={linkBtn}>← I already have a code</button>
      </div>
    );
  }

  return (
    <form onSubmit={confirm}>
      <h1 style={h1}>Scan &amp; verify</h1>
      <p style={sub}>Scan this with your authenticator app, then enter the 6-digit code it shows.</p>
      {qrDataUrl && <img src={qrDataUrl} alt="Authenticator QR code" style={{ display: 'block', margin: '0 auto 12px', borderRadius: 8 }} />}
      {secret && (
        <p style={{ fontSize: 11, color: '#64748b', textAlign: 'center', wordBreak: 'break-all' }}>
          Can’t scan? Enter this key manually:<br /><code style={{ fontSize: 12 }}>{secret}</code>
        </p>
      )}
      <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        inputMode="numeric" autoComplete="one-time-code" placeholder="123456" autoFocus style={codeInput} />
      {error && <div style={errText}>{error}</div>}
      <button type="submit" disabled={busy || code.length !== 6} style={btn}>{busy ? 'Confirming…' : 'Confirm & continue'}</button>
      <button type="button" onClick={onBack} style={linkBtn}>← Back</button>
    </form>
  );
}

const GoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" style={{ marginRight: 10 }}>
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.1 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.9 6.1C12.2 13.2 17.6 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-2.8-.4-4.1H24v7.8h12.4c-.3 2.1-1.6 5.2-4.6 7.3l7.1 5.5c4.2-3.9 6.6-9.6 6.6-16.5z" />
    <path fill="#FBBC05" d="M10.4 28.6a14.5 14.5 0 0 1 0-9.2l-7.9-6.1a24 24 0 0 0 0 21.4l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.3-4.6 2.3-8.8 2.3-6.4 0-11.8-3.7-13.6-9.4l-7.9 6.1C6.4 42.6 14.6 48 24 48z" />
  </svg>
);

const MAROON = '#7a1722';
const GOLD = '#c79a3b';
const FONT = "'IBM Plex Sans', system-ui, -apple-system, sans-serif";
const centre = { minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f8f7f4', fontFamily: FONT };
const wrap = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#f8f7f4', fontFamily: FONT };
const card = { background: '#fff', borderRadius: 20, padding: '56px 52px', width: '100%', maxWidth: 520, textAlign: 'center', boxShadow: '0 10px 48px rgba(0,0,0,0.10)', border: '1px solid #e5e7eb' };
const mfaCard = { background: '#fff', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 380, border: '1px solid #e5e7eb', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', fontFamily: FONT };
const brand = { fontSize: 13, color: GOLD, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 };
const title = { fontSize: 36, fontWeight: 800, color: MAROON, margin: '6px 0 4px', lineHeight: 1.1, letterSpacing: '-0.5px' };
const tagline = { fontSize: 16, color: '#475569', fontWeight: 600, margin: '0 0 14px' };
const subtitle = { fontSize: 15, color: '#64748b', marginBottom: 32 };
const googleBtn = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '16px', background: '#fff', color: '#1c1612', border: '1px solid #d1d5db', borderRadius: 10, fontSize: 17, fontWeight: 600, cursor: 'pointer' };
const hint = { fontSize: 14, color: '#94a3b8', marginTop: 18 };
const errBox = { background: 'rgba(192,57,43,0.08)', color: '#c0392b', borderRadius: 8, padding: '12px 14px', fontSize: 15, marginBottom: 18 };
const h1 = { fontSize: 18, fontWeight: 800, color: MAROON, marginTop: 0 };
const sub = { fontSize: 13, color: '#64748b' };
const codeInput = { width: '100%', padding: '12px', fontSize: 22, letterSpacing: 8, textAlign: 'center', border: '1px solid #d1d5db', borderRadius: 8, marginBottom: 14, boxSizing: 'border-box' };
const errText = { color: '#c0392b', fontSize: 13, marginBottom: 12 };
const btn = { width: '100%', padding: '12px', background: MAROON, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' };
const linkBtn = { width: '100%', padding: '10px', background: 'none', border: 'none', color: '#64748b', fontSize: 12, cursor: 'pointer', marginTop: 8 };
const strip = { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: '6px 16px', background: MAROON, color: '#fff', fontSize: 12, fontFamily: FONT };
const stripBtn = { background: 'rgba(255,255,255,0.14)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '3px 10px', fontSize: 12, cursor: 'pointer' };
