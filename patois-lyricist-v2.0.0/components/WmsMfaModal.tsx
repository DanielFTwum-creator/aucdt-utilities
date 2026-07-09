import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { wmsMfaVerify, wmsMfaEnrollBegin, wmsMfaEnrollConfirm } from '../services/wmsAuthService';

// TOTP step for WMS sign-in (archetype B — no routes, so MFA is a modal over the
// login screen). Verify for enrolled users; a manual-key enrolment wizard for
// first-timers. Enrolment shows the secret and otpauth URI as text rather than a
// QR image, so the migration needs no extra dependency — most TUC members are
// already enrolled through another fleet app and only ever see the verify step.

export const WmsMfaModal: React.FC = () => {
  const { wmsMfaTicket, clearWmsMfaTicket, adoptWmsSession } = useAuth();
  const [mode, setMode] = useState<'verify' | 'enroll'>('verify');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const [otpauthUri, setOtpauthUri] = useState<string | null>(null);
  const [enrolStarted, setEnrolStarted] = useState(false);

  if (!wmsMfaTicket) return null;

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try { adoptWmsSession(await wmsMfaVerify(wmsMfaTicket, code)); }
    catch (err) { setError(err instanceof Error ? err.message : 'Invalid code'); }
    finally { setBusy(false); }
  };

  const beginEnrol = async () => {
    setBusy(true); setError(null);
    try {
      const res = await wmsMfaEnrollBegin(wmsMfaTicket);
      setSecret(res.secret);
      setOtpauthUri(res.otpauthUri);
      setEnrolStarted(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not start enrolment'); }
    finally { setBusy(false); }
  };

  const confirmEnrol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret) return;
    setBusy(true); setError(null);
    try { adoptWmsSession(await wmsMfaEnrollConfirm(wmsMfaTicket, secret, code)); }
    catch (err) { setError(err instanceof Error ? err.message : 'Invalid code'); }
    finally { setBusy(false); }
  };

  const btn: React.CSSProperties = {
    width: '100%', padding: 14, borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, #009B48, #1db954)', color: '#fff',
    fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase',
    cursor: 'pointer', marginTop: 8,
  };
  const linkBtn: React.CSSProperties = {
    width: '100%', marginTop: 10, background: 'none', border: 'none',
    color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', cursor: 'pointer',
  };
  const codeInput = (
    <input
      value={code}
      onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
      inputMode="numeric" autoComplete="one-time-code" placeholder="123456" autoFocus
      style={{
        width: '100%', padding: 12, marginTop: 6, textAlign: 'center', fontSize: '1.4rem',
        letterSpacing: '0.5em', background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#f5f5f5', boxSizing: 'border-box',
      }}
    />
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 380, background: '#12100c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: 28 }}>
        <div style={{ height: 4, background: 'linear-gradient(90deg, #CE1126 33%, #FCD116 33% 66%, #009B48 66%)', borderRadius: 2, marginBottom: 18 }} />
        {mode === 'verify' ? (
          <form onSubmit={verify}>
            <h2 style={{ color: '#f5f5f5', fontSize: '1.05rem', fontWeight: 900, margin: 0 }}>Two-factor verification</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: '6px 0 4px' }}>Enter the 6-digit code from your authenticator app.</p>
            {codeInput}
            {error && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: 10 }}>{error}</p>}
            <button type="submit" disabled={busy || code.length !== 6} style={{ ...btn, opacity: busy || code.length !== 6 ? 0.5 : 1 }}>{busy ? '…' : 'Verify'}</button>
            <button type="button" onClick={() => { setMode('enroll'); setError(null); setCode(''); }} style={linkBtn}>First time? Set up your authenticator</button>
            <button type="button" onClick={clearWmsMfaTicket} style={{ ...linkBtn, fontSize: '0.72rem' }}>← Back to sign in</button>
          </form>
        ) : !enrolStarted ? (
          <div>
            <h2 style={{ color: '#f5f5f5', fontSize: '1.05rem', fontWeight: 900, margin: 0 }}>Set up two-factor</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: '6px 0 4px' }}>Your account needs an authenticator app (Google Authenticator, Authy, 1Password…). We'll give you a setup key.</p>
            {error && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: 10 }}>{error}</p>}
            <button type="button" onClick={beginEnrol} disabled={busy} style={{ ...btn, opacity: busy ? 0.5 : 1 }}>{busy ? '…' : 'Begin setup'}</button>
            <button type="button" onClick={() => { setMode('verify'); setError(null); }} style={linkBtn}>← I already have a code</button>
          </div>
        ) : (
          <form onSubmit={confirmEnrol}>
            <h2 style={{ color: '#f5f5f5', fontSize: '1.05rem', fontWeight: 900, margin: 0 }}>Add &amp; verify</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: '6px 0 8px' }}>Add this key to your authenticator app, then enter the 6-digit code it shows.</p>
            {secret && (
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Setup key</div>
                <code style={{ color: '#FCD116', fontSize: '0.85rem', wordBreak: 'break-all' }}>{secret}</code>
                {otpauthUri && (
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem', wordBreak: 'break-all', marginTop: 6 }}>{otpauthUri}</div>
                )}
              </div>
            )}
            {codeInput}
            {error && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: 10 }}>{error}</p>}
            <button type="submit" disabled={busy || code.length !== 6} style={{ ...btn, opacity: busy || code.length !== 6 ? 0.5 : 1 }}>{busy ? '…' : 'Confirm & continue'}</button>
            <button type="button" onClick={() => { setEnrolStarted(false); setError(null); setCode(''); }} style={linkBtn}>← Back</button>
          </form>
        )}
      </div>
    </div>
  );
};
