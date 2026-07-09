import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { wmsAuthBase } from '../services/wmsAuthService';

// WMS SSO sign-in screen for Patois Lyricist (Google-only, archetype B). Replaces
// the old bespoke Google-OAuth + username/password form. "Continue with Google"
// hands off to WMS, which runs Google OAuth + TOTP and gates to @techbridge.edu.gh.

const RASTA = ['#CE1126', '#FCD116', '#009B48'];

const errorMessage = (reason: string): string => {
  switch (reason) {
    case 'domain': return 'Only @techbridge.edu.gh accounts are permitted.';
    case 'deactivated': return 'Your account has been deactivated.';
    default: return 'Sign-in failed. Please try again.';
  }
};

export const PatoisWmsLogin: React.FC = () => {
  const { wmsError } = useAuth();
  const eqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = eqRef.current;
    if (!container) return;
    container.innerHTML = '';
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

  const signIn = () => {
    window.location.href = `${wmsAuthBase}/api/auth/google?app=patois`;
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #0d1a0d 0%, #1a0a0a 40%, #1a1a0a 70%, #0d1a0d 100%)' }}
    >
      <style>{`
        @keyframes eqBounce { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }
        @keyframes rastaFlow {
          0% { color: #CE1126; } 33% { color: #FCD116; } 66% { color: #009B48; } 100% { color: #CE1126; }
        }
        .rasta-title { font-family: 'Rokkitt', Georgia, 'Times New Roman', serif; animation: rastaFlow 4s linear infinite; }
        .google-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          color: #e5e5e5;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 14px;
          width: 100%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.2s, border-color 0.2s;
        }
        .google-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); }
      `}</style>

      {/* Rasta top stripe */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, #CE1126 33%, #FCD116 33% 66%, #009B48 66%)', flexShrink: 0 }} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center mb-10">
          <div ref={eqRef} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, height: 40, marginBottom: 16 }} />
          <h1 className="rasta-title" style={{ fontSize: '2.6rem', fontWeight: 900, letterSpacing: '-0.01em', marginBottom: 6 }}>
            Patois Lyricist
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            AI-Powered Reggae &amp; Dancehall Generator
          </p>
        </div>

        <div
          style={{
            width: '100%', maxWidth: 420,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24, padding: '36px 32px', backdropFilter: 'blur(12px)',
          }}
        >
          <h2 style={{ color: '#f5f5f5', fontSize: '1.1rem', fontWeight: 900, textAlign: 'center', marginBottom: 4, letterSpacing: '-0.01em' }}>
            Welcome
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', textAlign: 'center', marginBottom: 24 }}>
            Sign in with your Techbridge account to access your riddim laboratory
          </p>

          {wmsError && (
            <p style={{ color: '#f87171', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center', marginBottom: 16 }}>
              {errorMessage(wmsError)}
            </p>
          )}

          <button type="button" className="google-btn" onClick={signIn}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', textAlign: 'center', marginTop: 16 }}>
            Techbridge staff &amp; students
          </p>
        </div>

        <p style={{ marginTop: 32, color: 'rgba(255,255,255,0.12)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center' }}>
          Techbridge University College · WMS Single Sign-On
        </p>
      </div>
    </div>
  );
};
