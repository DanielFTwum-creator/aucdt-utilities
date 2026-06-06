import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { rawPost } from '../api';
import { useAuth, WmsUser } from './AuthContext';

type SessionResp = { access_token: string; user: WmsUser };

/**
 * TOTP MFA for HOD / SystemAdmin (FR-AUTH-008). Shown when the OAuth callback returned
 * an mfa_ticket. Two modes on one page:
 *   - Verify   (returning, already enrolled): enter 6-digit code → JWT.
 *   - Enrol    (first time): "Set up authenticator" → QR + secret → confirm code → JWT.
 * Both use the same mfa_ticket, so a brand-new MFA-role user can enrol before any JWT exists.
 */
export default function MfaPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const location = useLocation() as { state?: { mfaTicket?: string } };
  const [ticket, setTicket] = useState(location.state?.mfaTicket ?? '');
  const [mode, setMode] = useState<'verify' | 'enroll'>('verify');

  if (!ticket) return <Navigate to="/login" replace />;

  const land = (res: SessionResp) => {
    flushSync(() => setSession(res.access_token, res.user));
    navigate('/', { replace: true });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={card}>
        {mode === 'verify'
          ? <VerifyForm ticket={ticket} setTicket={setTicket} onDone={land} onEnrol={() => setMode('enroll')} />
          : <EnrolWizard ticket={ticket} setTicket={setTicket} onDone={land} onBack={() => setMode('verify')} />}
      </div>
    </div>
  );
}

function VerifyForm({ ticket, setTicket, onDone, onEnrol }: {
  ticket: string; setTicket: (t: string) => void; onDone: (r: SessionResp) => void; onEnrol: () => void;
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const res = await rawPost<SessionResp & { mfa_ticket?: string; error?: string }>('/api/auth/mfa/verify', { mfa_ticket: ticket, code });
      if (res.mfa_ticket) { setTicket(res.mfa_ticket); throw new Error(res.error || 'Invalid code'); }
      onDone(res);
    } catch (err: any) { setError(err.message || 'Invalid code'); }
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
    </form>
  );
}

function EnrolWizard({ ticket, setTicket, onDone, onBack }: {
  ticket: string; setTicket: (t: string) => void; onDone: (r: SessionResp) => void; onBack: () => void;
}) {
  const [secret, setSecret] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [started, setStarted] = useState(false);

  const begin = async () => {
    setBusy(true); setError(null);
    try {
      const res = await rawPost<{ secret: string; otpauthUri: string }>('/api/auth/mfa/enroll/begin', { mfa_ticket: ticket });
      setSecret(res.secret);
      setQrDataUrl(await QRCode.toDataURL(res.otpauthUri, { margin: 1, width: 200 }));
      setStarted(true);
    } catch (err: any) { setError(err.message || 'Could not start enrolment'); }
    finally { setBusy(false); }
  };

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret) return;
    setBusy(true); setError(null);
    try {
      const res = await rawPost<SessionResp & { mfa_ticket?: string; error?: string }>('/api/auth/mfa/enroll/confirm', { mfa_ticket: ticket, secret, code });
      if (res.mfa_ticket) { setTicket(res.mfa_ticket); throw new Error(res.error || 'Invalid code'); }
      onDone(res);
    } catch (err: any) { setError(err.message || 'Invalid code'); }
    finally { setBusy(false); }
  };

  if (!started) {
    return (
      <div>
        <h1 style={h1}>Set up two-factor authentication</h1>
        <p style={sub}>Your role requires an authenticator app (Google Authenticator, Authy, 1Password…). We’ll show a QR code to scan.</p>
        {error && <div style={errText}>{error}</div>}
        <button type="button" onClick={begin} disabled={busy} style={btn}>{busy ? 'Preparing…' : 'Begin setup'}</button>
        <button type="button" onClick={onBack} style={linkBtn}>← I already have a code</button>
      </div>
    );
  }

  return (
    <form onSubmit={confirm}>
      <h1 style={h1}>Scan & verify</h1>
      <p style={sub}>Scan this with your authenticator app, then enter the 6-digit code it shows.</p>
      {qrDataUrl && <img src={qrDataUrl} alt="Authenticator QR code" style={{ display: 'block', margin: '0 auto 12px', borderRadius: 8 }} />}
      {secret && (
        <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', wordBreak: 'break-all' }}>
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

const card: React.CSSProperties = { background: 'var(--card)', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 380, border: '1px solid var(--border)', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' };
const h1: React.CSSProperties = { fontSize: 18, fontWeight: 800, color: 'var(--tuc-maroon)', marginTop: 0 };
const sub: React.CSSProperties = { fontSize: 13, color: 'var(--muted)' };
const codeInput: React.CSSProperties = { width: '100%', padding: '12px', fontSize: 22, letterSpacing: 8, textAlign: 'center', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 14 };
const errText: React.CSSProperties = { color: 'var(--danger)', fontSize: 13, marginBottom: 12 };
const btn: React.CSSProperties = { width: '100%', padding: '12px', background: 'var(--tuc-maroon)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' };
const linkBtn: React.CSSProperties = { width: '100%', padding: '10px', background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, cursor: 'pointer', marginTop: 8 };
