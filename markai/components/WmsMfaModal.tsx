import React, { useState } from 'react';
// @ts-ignore — qrcode ships without types; tsconfig is non-strict
import QRCode from 'qrcode';
import { useAuth } from '../contexts/AuthContext';
import { wmsMfaVerify, wmsMfaEnrollBegin, wmsMfaEnrollConfirm } from '../services/wmsAuthService';
import Spinner from './Spinner';

/**
 * TOTP step for WMS staff sign-in (archetype B — no routes, so the MFA page
 * becomes a modal over LoginView). Verify for enrolled users; QR enrolment wizard
 * for first-timers. Ported from the tsapro/umat MfaPage.
 */
const WmsMfaModal: React.FC = () => {
  const { wmsMfaTicket, clearWmsMfaTicket, adoptWmsSession } = useAuth();
  const [mode, setMode] = useState<'verify' | 'enroll'>('verify');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
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
      setQrDataUrl(await QRCode.toDataURL(res.otpauthUri, { margin: 1, width: 200 }));
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

  const codeInput = (
    <input
      value={code}
      onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
      inputMode="numeric" autoComplete="one-time-code" placeholder="123456" autoFocus
      className="w-full p-3 mb-4 text-center text-2xl tracking-[0.5em] bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary transition"
    />
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm bg-secondary rounded-xl shadow-2xl border border-default p-6 sm:p-8">
        {mode === 'verify' ? (
          <form onSubmit={verify}>
            <h2 className="text-xl font-bold text-primary mb-1">Two-factor verification</h2>
            <p className="text-sm text-secondary mb-4">Enter the 6-digit code from your authenticator app.</p>
            {codeInput}
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button type="submit" disabled={busy || code.length !== 6}
              className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition flex items-center justify-center disabled:opacity-50">
              {busy ? <Spinner /> : 'Verify'}
            </button>
            <button type="button" onClick={() => { setMode('enroll'); setError(null); setCode(''); }}
              className="w-full mt-2 text-sm text-secondary hover:text-primary transition">
              First time? Set up your authenticator
            </button>
            <button type="button" onClick={clearWmsMfaTicket}
              className="w-full mt-1 text-xs text-secondary hover:text-primary transition">
              ← Back to sign in
            </button>
          </form>
        ) : !enrolStarted ? (
          <div>
            <h2 className="text-xl font-bold text-primary mb-1">Set up two-factor authentication</h2>
            <p className="text-sm text-secondary mb-4">Your account requires an authenticator app (Google Authenticator, Authy, 1Password…). We’ll show a QR code to scan.</p>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button type="button" onClick={beginEnrol} disabled={busy}
              className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition flex items-center justify-center disabled:opacity-50">
              {busy ? <Spinner /> : 'Begin setup'}
            </button>
            <button type="button" onClick={() => { setMode('verify'); setError(null); }}
              className="w-full mt-2 text-sm text-secondary hover:text-primary transition">
              ← I already have a code
            </button>
          </div>
        ) : (
          <form onSubmit={confirmEnrol}>
            <h2 className="text-xl font-bold text-primary mb-1">Scan &amp; verify</h2>
            <p className="text-sm text-secondary mb-4">Scan this with your authenticator app, then enter the 6-digit code it shows.</p>
            {qrDataUrl && <img src={qrDataUrl} alt="Authenticator QR code" className="block mx-auto mb-3 rounded-lg" />}
            {secret && (
              <p className="text-xs text-secondary text-center break-all mb-3">
                Can’t scan? Enter this key manually:<br /><code>{secret}</code>
              </p>
            )}
            {codeInput}
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button type="submit" disabled={busy || code.length !== 6}
              className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition flex items-center justify-center disabled:opacity-50">
              {busy ? <Spinner /> : 'Confirm & continue'}
            </button>
            <button type="button" onClick={() => { setEnrolStarted(false); setError(null); setCode(''); }}
              className="w-full mt-2 text-sm text-secondary hover:text-primary transition">
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default WmsMfaModal;
