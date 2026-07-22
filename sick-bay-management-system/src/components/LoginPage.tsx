import React, { useState } from 'react';
import { wmsBase, mfaVerify, mfaEnrollBegin, mfaEnrollConfirm, type WmsSession } from '../lib/wmsAuth';
import { ShieldAlert, LogIn, KeyRound, QrCode, ArrowLeft, Loader2, AlertCircle, Smartphone, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CareProLogo from './CareProLogo';

/**
 * WMS SSO sign-in page for SickBay (TUC-ICT-SRS-2026-004).
 * No local passwords — staff use their @techbridge.edu.gh Workspace account.
 * When WMS requires TOTP, it returns an mfa_ticket and the MFA modal handles
 * verify / first-time enrolment with Google Authenticator.
 */

interface LoginPageProps {
  wmsError: string | null;
  mfaTicket: string | null;
  onMfaTicket: (ticket: string | null) => void;
  onSession: (session: WmsSession) => void;
}

export default function LoginPage({ wmsError, mfaTicket, onMfaTicket, onSession }: LoginPageProps) {
  const continueWithGoogle = () => {
    window.location.href = `${wmsBase}/api/auth/google?app=sickbay`;
  };

  if (wmsError) {
    const isDomain = wmsError === 'oauth' || wmsError === 'domain';
    const isDeactivated = wmsError === 'deactivated';

    return (
      <div className="login-page login-page--error">
        <div className="login-bg-gradient" />
        <motion.div
          className="auth-error-card"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="auth-error-icon">
            {isDeactivated ? <Lock size={48} /> : <AlertCircle size={48} />}
          </div>
          <h2 className="auth-error-title">
            {isDomain ? 'Wrong Google Account'
              : isDeactivated ? 'Account Deactivated'
              : 'Sign-in Failed'}
          </h2>
          <p className="auth-error-body">
            {isDomain
              ? <>SickBay is only accessible to <strong>@techbridge.edu.gh</strong> institutional accounts. Personal Gmail addresses are not permitted.</>
              : isDeactivated
              ? <>Your TUC account has been deactivated. Contact the ICT Division to restore access.</>
              : <>An error occurred during sign-in. Please try again or contact ICT if the problem persists.</>
            }
          </p>
          {isDomain && (
            <p className="auth-error-hint">
              Make sure you select your <strong>TUC Workspace</strong> account in the Google sign-in window, not a personal account.
            </p>
          )}
          <button type="button" className="login-button" onClick={continueWithGoogle}>
            <LogIn size={18} />
            Try a different account
          </button>
          <a href="mailto:ict@techbridge.edu.gh" className="auth-error-contact">
            Contact ICT Support
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-bg-gradient" />
      
      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="login-box">
          {/* Hospital / Medical Cross Branding */}
          <div className="login-logo-section">
            <div className="login-logo-wrapper">
              <CareProLogo size={64} />
            </div>
            <h1 className="login-title">SickBay</h1>
            <p className="login-subtitle">Campus Health Management System</p>
          </div>
          
          <div className="login-divider" />

          {/* Institution Badge */}
          <div className="login-institution">
            <img
              src="https://techbridge.edu.gh/static/TUC_LOGO_small.png"
              alt="TUC"
              className="login-tuc-logo"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span>Techbridge University College</span>
          </div>

          <button type="button" className="login-button login-button--google" onClick={continueWithGoogle}>
            <svg width="18" height="18" viewBox="0 0 48 48" className="google-icon">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <p className="login-footer">
            Staff use their <strong>@techbridge.edu.gh</strong> institutional sign-in.
            <br />
            <small>Secured by WMS Single Sign-On with Google Authenticator MFA.</small>
          </p>
        </div>
      </motion.div>

      {/* TOTP MFA Modal */}
      <AnimatePresence>
        {mfaTicket && (
          <MfaModal ticket={mfaTicket} setTicket={onMfaTicket} onDone={onSession} />
        )}
      </AnimatePresence>
    </div>
  );
}


/* ── TOTP MFA Modal ────────────────────────────────────────────────────── */

interface MfaModalProps {
  ticket: string;
  setTicket: (t: string | null) => void;
  onDone: (session: WmsSession) => void;
}

function MfaModal({ ticket, setTicket, onDone }: MfaModalProps) {
  const [mode, setMode] = useState<'verify' | 'enroll'>('verify');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try { onDone(await mfaVerify(ticket, code)); }
    catch (err: any) { setError(err.message || 'Invalid code'); }
    finally { setBusy(false); }
  };

  const begin = async () => {
    setBusy(true); setError(null);
    try {
      const res = await mfaEnrollBegin(ticket);
      setSecret(res.secret);
      // Generate QR code via Google Charts API (no external dep required)
      setQrDataUrl(`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(res.otpauthUri)}`);
      setStarted(true);
    } catch (err: any) { setError(err.message || 'Could not start enrolment'); }
    finally { setBusy(false); }
  };

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret) return;
    setBusy(true); setError(null);
    try { onDone(await mfaEnrollConfirm(ticket, secret, code)); }
    catch (err: any) { setError(err.message || 'Invalid code'); }
    finally { setBusy(false); }
  };

  return (
    <motion.div
      className="mfa-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="mfa-card"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {mode === 'verify' ? (
          <form onSubmit={verify}>
            <div className="mfa-icon-wrap">
              <KeyRound size={32} />
            </div>
            <h2 className="mfa-title">Two-Factor Verification</h2>
            <p className="mfa-desc">Enter the 6-digit code from your authenticator app (Google Authenticator, Authy, etc.).</p>
            
            <input
              className="mfa-input"
              value={code}
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              onChange={handleCodeChange}
            />
            
            {error && (
              <div className="mfa-error">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            
            <button type="submit" className="mfa-button" disabled={busy || code.length !== 6}>
              {busy ? <><Loader2 size={16} className="spin" /> Verifying…</> : <>Verify</>}
            </button>
            
            <button
              type="button"
              className="mfa-link-button"
              onClick={() => { setMode('enroll'); setError(null); setCode(''); }}
            >
              <Smartphone size={14} />
              First time? Set up your authenticator
            </button>
            
            <button type="button" className="mfa-link-button" onClick={() => setTicket(null)}>
              <ArrowLeft size={14} />
              Back to sign in
            </button>
          </form>
        ) : !started ? (
          <div>
            <div className="mfa-icon-wrap">
              <QrCode size={32} />
            </div>
            <h2 className="mfa-title">Set Up Two-Factor Auth</h2>
            <p className="mfa-desc">
              Your account requires an authenticator app (Google Authenticator, Authy, etc.).
              We'll show a QR code for you to scan.
            </p>
            
            {error && (
              <div className="mfa-error">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            
            <button type="button" className="mfa-button" onClick={begin} disabled={busy}>
              {busy ? <><Loader2 size={16} className="spin" /> Preparing…</> : <>Begin Setup</>}
            </button>
            
            <button
              type="button"
              className="mfa-link-button"
              onClick={() => { setMode('verify'); setError(null); }}
            >
              <ArrowLeft size={14} />
              I already have a code
            </button>
          </div>
        ) : (
          <form onSubmit={confirm}>
            <div className="mfa-icon-wrap">
              <QrCode size={32} />
            </div>
            <h2 className="mfa-title">Scan & Verify</h2>
            
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Authenticator QR code"
                className="mfa-qr"
              />
            )}
            
            {secret && (
              <p className="mfa-secret-fallback">
                Can't scan? Enter this key manually:<br />
                <code className="mfa-secret-code">{secret}</code>
              </p>
            )}
            
            <input
              className="mfa-input"
              value={code}
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              onChange={handleCodeChange}
            />
            
            {error && (
              <div className="mfa-error">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            
            <button type="submit" className="mfa-button" disabled={busy || code.length !== 6}>
              {busy ? <><Loader2 size={16} className="spin" /> Confirming…</> : <>Confirm & Continue</>}
            </button>
            
            <button
              type="button"
              className="mfa-link-button"
              onClick={() => { setStarted(false); setError(null); setCode(''); }}
            >
              <ArrowLeft size={14} />
              Back
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
