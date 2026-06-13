import React, { useState } from 'react';
import QRCode from 'qrcode';
import './LoginPage.css';
import { wmsBase, mfaVerify, mfaEnrollBegin, mfaEnrollConfirm } from './wmsAuth';

/**
 * WMS SSO sign-in (TUC-ICT-SRS-2026-013). No local passwords — staff and
 * students alike use their @techbridge.edu.gh Workspace account. When the
 * IdP demands TOTP it returns an mfa_ticket and the modal below handles
 * verify / first-time enrolment.
 */
function LoginPage({ wmsError, mfaTicket, onMfaTicket, onSession }) {
  const continueWithGoogle = () => {
    window.location.href = `${wmsBase}/api/auth/google?app=lems`;
  };

  const errorMessage =
    wmsError === 'domain' ? 'Only @techbridge.edu.gh accounts can sign in.'
      : wmsError === 'deactivated' ? 'Your account has been deactivated.'
      : wmsError ? 'Sign-in failed. Please try again.'
      : null;

  return (
    <div className="login-page">
      <video
        className="login-bg-video"
        src="https://techbridge.edu.gh/static/campus_tour.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="login-bg-overlay" />
      <div className="login-container">
        <div className="login-box">
          <img
            src="https://techbridge.edu.gh/static/TUC_LOGO_small.png"
            alt="TUC"
            width="64"
            height="64"
            style={{ display: 'block', margin: '0 auto 12px', objectFit: 'contain' }}
          />
          <h1 style={{ textAlign: 'center', marginBottom: 4 }}>LEMS</h1>
          <p style={{ textAlign: 'center', marginBottom: 24 }}>
            Lecturer Assessment &amp; Evaluation Portal
            <br />
            <small>Sign in with your TUC Workspace account.</small>
          </p>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <button type="button" className="login-button" onClick={continueWithGoogle}>
            Continue with Google
          </button>

          <p className="login-footer">
            Staff and students use the same <strong>@techbridge.edu.gh</strong> sign-in.
            <br />
            Evaluations are submitted anonymously.
          </p>
        </div>
      </div>

      {mfaTicket && (
        <MfaModal ticket={mfaTicket} setTicket={onMfaTicket} onDone={onSession} />
      )}
    </div>
  );
}

function MfaModal({ ticket, setTicket, onDone }) {
  const [mode, setMode] = useState('verify');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [secret, setSecret] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [started, setStarted] = useState(false);

  const overlay = {
    position: 'fixed', inset: 0, zIndex: 50, display: 'flex',
    alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', padding: 16,
  };
  const card = {
    background: '#fff', borderRadius: 12, padding: '28px 26px',
    width: '100%', maxWidth: 380, boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
  };
  const input = {
    width: '100%', padding: 12, fontSize: 22, letterSpacing: '0.4em', textAlign: 'center',
    border: '1px solid #cbd5e1', borderRadius: 8, margin: '12px 0', boxSizing: 'border-box',
  };
  const btn = {
    width: '100%', padding: 12, background: '#6b0020', color: '#fff', border: 'none',
    borderRadius: 8, fontWeight: 700, cursor: 'pointer',
  };
  const linkBtn = {
    width: '100%', padding: 8, background: 'none', border: 'none',
    color: '#64748b', fontSize: 12, cursor: 'pointer', marginTop: 6,
  };

  const verify = async (e) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try { onDone(await mfaVerify(ticket, code)); }
    catch (err) { setError(err.message || 'Invalid code'); }
    finally { setBusy(false); }
  };

  const begin = async () => {
    setBusy(true); setError(null);
    try {
      const res = await mfaEnrollBegin(ticket);
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
    try { onDone(await mfaEnrollConfirm(ticket, secret, code)); }
    catch (err) { setError(err.message || 'Invalid code'); }
    finally { setBusy(false); }
  };

  return (
    <div style={overlay}>
      <div style={card}>
        {mode === 'verify' ? (
          <form onSubmit={verify}>
            <h2 style={{ marginTop: 0 }}>Two-factor verification</h2>
            <p>Enter the 6-digit code from your authenticator app.</p>
            <input style={input} value={code} autoFocus inputMode="numeric"
              autoComplete="one-time-code" placeholder="123456"
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" style={btn} disabled={busy || code.length !== 6}>
              {busy ? 'Verifying…' : 'Verify'}
            </button>
            <button type="button" style={linkBtn}
              onClick={() => { setMode('enroll'); setError(null); setCode(''); }}>
              First time? Set up your authenticator
            </button>
            <button type="button" style={linkBtn} onClick={() => setTicket(null)}>
              ← Back to sign in
            </button>
          </form>
        ) : !started ? (
          <div>
            <h2 style={{ marginTop: 0 }}>Set up two-factor authentication</h2>
            <p>Your account requires an authenticator app (Google Authenticator, Authy…). We’ll show a QR code to scan.</p>
            {error && <div className="error-message">{error}</div>}
            <button type="button" style={btn} onClick={begin} disabled={busy}>
              {busy ? 'Preparing…' : 'Begin setup'}
            </button>
            <button type="button" style={linkBtn}
              onClick={() => { setMode('verify'); setError(null); }}>
              ← I already have a code
            </button>
          </div>
        ) : (
          <form onSubmit={confirm}>
            <h2 style={{ marginTop: 0 }}>Scan &amp; verify</h2>
            {qrDataUrl && <img src={qrDataUrl} alt="Authenticator QR code"
              style={{ display: 'block', margin: '0 auto 10px', borderRadius: 8 }} />}
            {secret && (
              <p style={{ fontSize: 11, color: '#64748b', textAlign: 'center', wordBreak: 'break-all' }}>
                Can’t scan? Enter this key manually:<br /><code>{secret}</code>
              </p>
            )}
            <input style={input} value={code} autoFocus inputMode="numeric"
              autoComplete="one-time-code" placeholder="123456"
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" style={btn} disabled={busy || code.length !== 6}>
              {busy ? 'Confirming…' : 'Confirm & continue'}
            </button>
            <button type="button" style={linkBtn}
              onClick={() => { setStarted(false); setError(null); setCode(''); }}>
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
