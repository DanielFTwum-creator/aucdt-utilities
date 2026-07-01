import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

type Mode = 'login' | 'register';

export const LoginView: React.FC = () => {
  const { login } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  // Login-screen privacy (PATTERNS.md #6): fields render read-only until first focus
  // so the browser can't pre-fill the last user's email on shared machines.
  const [fieldsUnlocked, setFieldsUnlocked] = useState(false);
  const unlockFields = () => setFieldsUnlocked(true);

  const eqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = eqRef.current;
    if (!container) return;
    container.innerHTML = '';
    const RASTA = ['#CE1126', '#FCD116', '#009B48'];
    for (let i = 0; i < 18; i++) {
      const bar = document.createElement('div');
      const h = 8 + Math.random() * 28;
      bar.style.cssText = `
        width: 3px;
        height: ${h}px;
        background: ${RASTA[i % 3]};
        border-radius: 2px;
        animation: eqBounce ${0.5 + Math.random() * 0.7}s ease-in-out infinite alternate;
        animation-delay: ${i * 0.06}s;
        opacity: 0.7;
      `;
      container.appendChild(bar);
    }
  }, []);

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google login is not configured on this deployment.');
      return;
    }
    const redirectUri =
      import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
      `${window.location.origin}/patois/auth/google/callback`;
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'select_account',
      state,
    });
    setIsRedirecting(true);
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  };

  const clearForm = () => {
    setIdentifier('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleModeChange = (next: Mode) => {
    setMode(next);
    clearForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        if (!identifier || !password) throw new Error('Please enter your username/email and password.');
        await login(identifier, password);
        setIsRedirecting(true);
      } else {
        if (!username || !email || !password) throw new Error('All fields are required.');
        if (password !== confirmPassword) throw new Error('Passwords do not match.');
        await login({ name: username, email }, password);
        setIsRedirecting(true);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(160deg, #0d1a0d 0%, #1a0a0a 40%, #1a1a0a 70%, #0d1a0d 100%)',
        opacity: isRedirecting ? 0 : 1,
        transition: 'opacity 0.4s ease',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rokkitt:wght@700;900&display=swap');
        @keyframes eqBounce { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }
        @keyframes rastaFlow {
          0%   { color: #CE1126; }
          33%  { color: #FCD116; }
          66%  { color: #009B48; }
          100% { color: #CE1126; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .rasta-title {
          font-family: 'Rokkitt', serif;
          animation: rastaFlow 4s linear infinite;
        }
        .login-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #f5f5f5;
          font-size: 0.9rem;
          padding: 12px 16px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-input:focus {
          border-color: #FCD116;
          box-shadow: 0 0 0 3px rgba(252,209,22,0.12);
        }
        .login-input::placeholder { color: rgba(255,255,255,0.2); }
        .rasta-btn {
          background: linear-gradient(135deg, #009B48, #1db954);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-weight: 900;
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 14px;
          width: 100%;
          cursor: pointer;
          transition: filter 0.2s, transform 0.1s;
        }
        .rasta-btn:hover:not(:disabled) { filter: brightness(1.15); transform: translateY(-1px); }
        .rasta-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .google-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          color: #e5e5e5;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 13px;
          width: 100%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.2s, border-color 0.2s;
        }
        .google-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.25);
        }
        .google-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .input-wrap { position: relative; }
        .input-icon {
          position: absolute; top: 50%; right: 14px; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.3); padding: 0; line-height: 1;
          transition: color 0.2s;
        }
        .input-icon:hover { color: #FCD116; }
        .field-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 6px;
        }
      `}</style>

      {/* Rasta top stripe */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, #CE1126 33%, #FCD116 33% 66%, #009B48 66%)', flexShrink: 0 }} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">

        {/* Brand header */}
        <div className="text-center mb-10">
          <div
            ref={eqRef}
            style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, height: 40, marginBottom: 16 }}
          />
          <h1 className="rasta-title" style={{ fontSize: '2.6rem', fontWeight: 900, letterSpacing: '-0.01em', marginBottom: 6 }}>
            Patois Lyricist
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            AI-Powered Reggae &amp; Dancehall Generator
          </p>
        </div>

        {/* Login card */}
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24,
            padding: '36px 32px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <h2 style={{ color: '#f5f5f5', fontSize: '1.1rem', fontWeight: 900, textAlign: 'center', marginBottom: 4, letterSpacing: '-0.01em' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', textAlign: 'center', marginBottom: 24 }}>
            {mode === 'login' ? 'Sign in to access your riddim laboratory' : 'Join the movement — create your account'}
          </p>

          {/* Google SSO */}
          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={isSubmitting || isRedirecting}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div className="divider-line" />
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>or</span>
            <div className="divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'login' ? (
              <div>
                <label className="field-label" htmlFor="identifier">Username or Email</label>
                <input
                  id="identifier"
                  className="login-input"
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="Enter username or email"
                  disabled={isSubmitting}
                  readOnly={!fieldsUnlocked}
                  onFocus={unlockFields}
                  autoComplete="off"
                  required
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="field-label" htmlFor="username">Username</label>
                  <input id="username" className="login-input" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" disabled={isSubmitting} required />
                </div>
                <div>
                  <label className="field-label" htmlFor="email">Email</label>
                  <input id="email" className="login-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" disabled={isSubmitting} required />
                </div>
              </>
            )}

            <div>
              <label className="field-label" htmlFor="login-password">Password</label>
              <div className="input-wrap">
                <input
                  id="login-password"
                  className="login-input"
                  style={{ paddingRight: 44 }}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isSubmitting}
                  readOnly={!fieldsUnlocked}
                  onFocus={unlockFields}
                  autoComplete="new-password"
                  required
                />
                <button type="button" className="input-icon" onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="field-label" htmlFor="confirm-password">Confirm Password</label>
                <div className="input-wrap">
                  <input
                    id="confirm-password"
                    className="login-input"
                    style={{ paddingRight: 44 }}
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    disabled={isSubmitting}
                    required
                  />
                  <button type="button" className="input-icon" onClick={() => setShowConfirmPassword(p => !p)} tabIndex={-1}>
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p style={{ color: '#f87171', fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>{error}</p>
            )}

            <button type="submit" className="rasta-btn" disabled={isSubmitting || isRedirecting} style={{ marginTop: 4 }}>
              {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Mode toggle */}
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
              style={{ background: 'none', border: 'none', color: '#FCD116', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: '0.8rem' }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Footer note */}
        <p style={{ marginTop: 32, color: 'rgba(255,255,255,0.12)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center' }}>
          Techbridge University College · Secure Auth v2
        </p>
      </div>
    </div>
  );
};
