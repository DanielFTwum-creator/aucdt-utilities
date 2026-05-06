import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  onClose: () => void;
  mode?: 'access' | 'admin';
  hideCancel?: boolean;
}

const ACCESS_DOMAIN = '@techbridge.edu.gh';

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, mode = 'admin', hideCancel = false }) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const { requestOtp, verifyOtp, loginAdmin, pendingEmail } = useAuth();

  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'email') {
      const otp = await requestOtp(email);
      if (!otp) {
        setError(`Only ${ACCESS_DOMAIN} addresses can access this application.`);
        return;
      }
      setError('');
      setInfo('A verification code has been sent to your Techbridge email.');
      setStep('otp');
      return;
    }
    if (verifyOtp(code.trim())) {
      onClose();
    } else {
      setError('Incorrect verification code. Please try again.');
      setCode('');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      onClose();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const title = mode === 'access' ? 'Techbridge 2FA Login' : 'Admin Login';
  const buttonText = mode === 'access' ? (step === 'email' ? 'Send code' : 'Verify code') : 'Login';

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div className="bg-[var(--color-background-card)] p-8 rounded-lg shadow-2xl w-full max-w-sm border border-[var(--color-border-card)]">
        <h2 id="login-modal-title" className="text-2xl font-bold text-[var(--color-foreground)] mb-4 font-playfair">{title}</h2>
        <form onSubmit={mode === 'access' ? handleAccessSubmit : handleAdminSubmit} aria-label={`${title} form`}>
          {mode === 'access' ? (
            step === 'email' ? (
              <>
                <label htmlFor="plcrp-email" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2">
                  Techbridge Email Address
                </label>
                <input
                  id="plcrp-email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); setInfo(''); }}
                  autoComplete="email"
                  aria-required="true"
                  className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
                  autoFocus
                />
              </>
            ) : (
              <>
                <label htmlFor="plcrp-email-ro" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2">Email</label>
                <input id="plcrp-email-ro" type="email" value={pendingEmail ?? email} disabled className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground-muted)]" />
                <label htmlFor="plcrp-otp" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2 mt-4">Verification Code</label>
                <input
                  id="plcrp-otp"
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={e => { setCode(e.target.value); setError(''); }}
                  aria-required="true"
                  className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  autoFocus
                />
              </>
            )
          ) : (
            <>
              <label htmlFor="plcrp-admin-password" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2">Password</label>
              <input
                id="plcrp-admin-password"
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
                aria-required="true"
                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] transition font-mono"
                autoFocus
              />
            </>
          )}
          {info && <p role="status" className="text-green-400 text-sm mt-2">{info}</p>}
          {error && <p role="alert" aria-live="assertive" className="text-red-400 text-sm mt-2">{error}</p>}
          <div className="mt-6 flex justify-end gap-4">
            {!hideCancel && (
              <button type="button" onClick={onClose} aria-label="Cancel login" className="px-4 py-2 rounded-md text-sm font-semibold text-[var(--color-foreground)] hover:bg-[var(--color-background-card-hover)] transition">
                Cancel
              </button>
            )}
            <button type="submit" aria-label={buttonText} className="px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition">
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
