import React from 'react';
import { authBase } from './api';

/**
 * Single "Continue with Google" affordance — no email/password. Navigates to the WMS
 * SSO backend OAuth entry with ?app=tsapro so the backend redirects back to this app
 * after authentication (TUC-ICT-SDD-2026-001).
 */
export default function LoginPage() {
  const reason = new URLSearchParams(window.location.search).get('reason');

  const continueWithGoogle = () => {
    window.location.href = `${authBase}/api/auth/google?app=tsapro`;
  };

  return (
    <div style={wrap}>
      <div style={card}>
        <img src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" alt="TUC" width={60}
          style={{ marginBottom: 16, objectFit: 'contain' }} />
        <div style={brand}>Techbridge University College</div>
        <h1 style={title}>Salary &amp; Promotion Assistant</h1>
        <p style={subtitle}>Sign in with your TUC Google Workspace account.</p>

        {reason === 'domain' && <div style={err}>Only @techbridge.edu.gh accounts are permitted.</div>}
        {reason === 'deactivated' && <div style={err}>Your account has been deactivated.</div>}
        {reason === 'oauth' && <div style={err}>Sign-in failed. Please try again.</div>}

        <button type="button" onClick={continueWithGoogle} style={googleBtn}>
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

const MAROON = '#7a1722';
const GOLD = '#c79a3b';
const wrap: React.CSSProperties = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' };
const card: React.CSSProperties = { background: '#fff', borderRadius: 20, padding: '56px 52px', width: '100%', maxWidth: 520, textAlign: 'center', boxShadow: '0 10px 48px rgba(0,0,0,0.10)', border: '1px solid #e5e7eb' };
const brand: React.CSSProperties = { fontSize: 13, color: GOLD, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 };
const title: React.CSSProperties = { fontSize: 32, fontWeight: 800, color: MAROON, margin: '6px 0 10px', lineHeight: 1.15 };
const subtitle: React.CSSProperties = { fontSize: 17, color: '#64748b', marginBottom: 32 };
const googleBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '16px', background: '#fff', color: '#1c1612', border: '1px solid #d1d5db', borderRadius: 10, fontSize: 17, fontWeight: 600, cursor: 'pointer' };
const hint: React.CSSProperties = { fontSize: 14, color: '#94a3b8', marginTop: 18 };
const err: React.CSSProperties = { background: 'rgba(192,57,43,0.08)', color: '#c0392b', borderRadius: 8, padding: '12px 14px', fontSize: 15, marginBottom: 18 };
