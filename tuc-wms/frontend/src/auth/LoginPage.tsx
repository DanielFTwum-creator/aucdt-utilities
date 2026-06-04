import React from 'react';

const TUC_LOGO = 'https://techbridge.edu.gh/static/TUC_LOGO_1.png';

/**
 * Single "Continue with Google" affordance (SRS §3.4 — no email/password,
 * no role selector). Navigates to the backend OAuth initiation URL, which
 * begins the Google authorization-code flow.
 */
export default function LoginPage() {
  const error = new URLSearchParams(window.location.search).get('reason');

  const continueWithGoogle = () => {
    // Full-page navigation (not fetch) — Spring Security handles the redirect.
    window.location.href = '/api/auth/google';
  };

  return (
    <div style={wrap}>
      <div style={card}>
        <img src={TUC_LOGO} alt="TUC" width={64} style={{ borderRadius: '50%', marginBottom: 16, border: '3px solid var(--tuc-gold)' }} />
        <div style={brand}>Techbridge University College</div>
        <h1 style={title}>Work Management System</h1>
        <p style={subtitle}>Sign in with your TUC Google Workspace account.</p>

        {error === 'domain' && <div style={err}>Only @techbridge.edu.gh accounts are permitted.</div>}
        {error === 'deactivated' && <div style={err}>Your TUC-WMS account has been deactivated.</div>}
        {error === 'oauth' && <div style={err}>Sign-in failed. Please try again.</div>}

        <button onClick={continueWithGoogle} style={googleBtn}>
          <GoogleG /> Continue with Google
        </button>
        <p style={hint}>Use your <strong>@techbridge.edu.gh</strong> account.</p>
      </div>
    </div>
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

const wrap: React.CSSProperties = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 };
const card: React.CSSProperties = { background: 'var(--card)', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 420, textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid var(--border)' };
const brand: React.CSSProperties = { fontSize: 10, color: 'var(--tuc-gold)', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 };
const title: React.CSSProperties = { fontSize: 20, fontWeight: 800, color: 'var(--tuc-maroon)', margin: '4px 0 6px' };
const subtitle: React.CSSProperties = { fontSize: 13, color: 'var(--muted)', marginBottom: 24 };
const googleBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '12px', background: '#fff', color: '#1c1612', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' };
const hint: React.CSSProperties = { fontSize: 11, color: 'var(--muted)', marginTop: 14 };
const err: React.CSSProperties = { background: 'rgba(192,57,43,0.08)', color: 'var(--danger)', borderRadius: 8, padding: '10px 12px', fontSize: 13, marginBottom: 16 };
