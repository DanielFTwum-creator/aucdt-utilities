import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { wmsMfa, netscanSsoExchange, MfaResult } from '../../lib/wmsAuth';
import { useAuthStore } from '../../lib/api';

/**
 * TOTP MFA for NetScan staff (their WMS role requires it). Shown when the SSO callback returned an
 * mfa_ticket. On success the WMS access token is exchanged for a NetScan session (TUC-ICT-SRS-2026-013).
 */
export function MfaPage() {
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);
  const location = useLocation() as { state?: { mfaTicket?: string } };
  const [ticket, setTicket] = useState(location.state?.mfaTicket ?? '');
  const [mode, setMode] = useState<'verify' | 'enroll'>('verify');

  if (!ticket) return <Navigate to="/login" replace />;

  // WMS issued an access token -> exchange for a NetScan token and enter the app.
  const land = async (res: MfaResult) => {
    const r = await netscanSsoExchange(res.access_token as string);
    login(r.token, r.username);
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#060e1a' }}>
      <div className="w-full max-w-sm noc-card p-6">
        {mode === 'verify'
          ? <VerifyForm ticket={ticket} setTicket={setTicket} onDone={land} onEnrol={() => setMode('enroll')} />
          : <EnrolWizard ticket={ticket} setTicket={setTicket} onDone={land} onBack={() => setMode('verify')} />}
      </div>
    </div>
  );
}

const codeInput = "w-full bg-black/20 border border-white/10 rounded px-3 py-2.5 text-center text-lg tracking-[0.4em] font-mono-code text-slate-200 focus:outline-none focus:border-gold/50";
const btn = "w-full py-2.5 rounded font-mono-code text-sm tracking-widest transition-all disabled:opacity-50 mt-3";
const btnStyle = { background: 'rgba(200,146,10,0.15)', border: '1px solid rgba(200,146,10,0.4)', color: '#C8920A' };
const linkBtn = "w-full py-2 text-xs font-mono-code text-slate-500 hover:text-slate-300 mt-2";
const errBox = "flex items-start gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded p-3 mt-3";

function VerifyForm({ ticket, setTicket, onDone, onEnrol }: {
  ticket: string; setTicket: (t: string) => void; onDone: (r: MfaResult) => void; onEnrol: () => void;
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const res = await wmsMfa('/api/auth/mfa/verify', { mfa_ticket: ticket, code });
      if (res.mfa_ticket) { setTicket(res.mfa_ticket); throw new Error(res.error || 'Invalid code'); }
      if (!res.access_token) throw new Error(res.error || 'Verification failed');
      await onDone(res);
    } catch (err: any) { setError(err?.message || 'Invalid code'); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={verify}>
      <h1 className="font-mono-display text-lg text-gold tracking-widest text-center mb-1">TWO-FACTOR</h1>
      <p className="text-slate-500 text-xs text-center mb-5 font-mono-code">Enter the 6-digit code from your authenticator</p>
      <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        inputMode="numeric" autoComplete="one-time-code" placeholder="123456" autoFocus className={codeInput} />
      {error && <div className={errBox}>{error}</div>}
      <button type="submit" disabled={busy || code.length !== 6} className={btn} style={btnStyle}>{busy ? 'VERIFYING…' : 'VERIFY'}</button>
      <button type="button" onClick={onEnrol} className={linkBtn}>First time? Set up your authenticator</button>
    </form>
  );
}

function EnrolWizard({ ticket, setTicket, onDone, onBack }: {
  ticket: string; setTicket: (t: string) => void; onDone: (r: MfaResult) => void; onBack: () => void;
}) {
  const [secret, setSecret] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const begin = async () => {
    setBusy(true); setError('');
    try {
      const res = await wmsMfa('/api/auth/mfa/enroll/begin', { mfa_ticket: ticket });
      if (!res.secret || !res.otpauthUri) throw new Error(res.error || 'Could not start enrolment');
      setSecret(res.secret);
      setQr(await QRCode.toDataURL(res.otpauthUri, { margin: 1, width: 200 }));
    } catch (err: any) { setError(err?.message || 'Could not start enrolment'); }
    finally { setBusy(false); }
  };

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret) return;
    setBusy(true); setError('');
    try {
      const res = await wmsMfa('/api/auth/mfa/enroll/confirm', { mfa_ticket: ticket, secret, code });
      if (res.mfa_ticket) { setTicket(res.mfa_ticket); throw new Error(res.error || 'Invalid code'); }
      if (!res.access_token) throw new Error(res.error || 'Confirmation failed');
      await onDone(res);
    } catch (err: any) { setError(err?.message || 'Invalid code'); }
    finally { setBusy(false); }
  };

  if (!secret) {
    return (
      <div>
        <h1 className="font-mono-display text-lg text-gold tracking-widest text-center mb-1">SET UP MFA</h1>
        <p className="text-slate-500 text-xs text-center mb-5 font-mono-code">Your role requires an authenticator app</p>
        {error && <div className={errBox}>{error}</div>}
        <button type="button" onClick={begin} disabled={busy} className={btn} style={btnStyle}>{busy ? 'PREPARING…' : 'BEGIN SETUP'}</button>
        <button type="button" onClick={onBack} className={linkBtn}>← I already have a code</button>
      </div>
    );
  }

  return (
    <form onSubmit={confirm}>
      <h1 className="font-mono-display text-lg text-gold tracking-widest text-center mb-1">SCAN &amp; VERIFY</h1>
      {qr && <img src={qr} alt="Authenticator QR" className="mx-auto mb-3 rounded" />}
      {secret && <p className="text-[10px] text-slate-500 text-center break-all font-mono-code mb-3">Manual key: {secret}</p>}
      <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        inputMode="numeric" autoComplete="one-time-code" placeholder="123456" autoFocus className={codeInput} />
      {error && <div className={errBox}>{error}</div>}
      <button type="submit" disabled={busy || code.length !== 6} className={btn} style={btnStyle}>{busy ? 'CONFIRMING…' : 'CONFIRM'}</button>
      <button type="button" onClick={onBack} className={linkBtn}>← Back</button>
    </form>
  );
}
