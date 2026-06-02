import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  onClose: () => void;
  hideCancel?: boolean;
  // mode prop kept for API compat but ignored — all users use magic link
  mode?: 'access' | 'admin';
}

const TUC_LOGO = 'https://techbridge.edu.gh/static/TUC_LOGO_1.png';

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, hideCancel = false }) => {
  const { setSession } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [resolvedEmail, setResolvedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Handle magic link click — ?token=&otp= in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const otp = params.get('otp');

    if (token && otp) {
      setVerifying(true);
      window.history.replaceState({}, '', window.location.pathname);
      fetch('/dmcdai/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: token, otp }),
      })
        .then(r => r.json().then(d => ({ ok: r.ok, data: d })))
        .then(({ ok, data }) => {
          if (!ok) { setLinkError(data.message || 'This link has expired or already been used.'); setVerifying(false); return; }
          setSession(data.token, data.user);
          onClose();
        })
        .catch((err) => { setLinkError(`Network error — please try again. (${err?.message || 'fetch failed'})`); setVerifying(false); });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = `${firstName.trim().toLowerCase()}.${lastName.trim().toLowerCase()}@techbridge.edu.gh`;
    setLoading(true);
    try {
      const res = await fetch('/dmcdai/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setLinkError(data.message || 'Name not found — check your spelling'); setLoading(false); return; }
      setResolvedEmail(email);
      setLinkSent(true);
    } catch {
      setLinkError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setLinkSent(false); setLinkError(''); setFirstName(''); setLastName(''); setResolvedEmail(''); };

  const cardStyle: React.CSSProperties = {
    background: 'var(--color-background-card)',
    borderRadius: 12,
    padding: '40px 36px',
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
    border: '1px solid var(--color-border-card)',
    textAlign: 'center',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid var(--color-border-input)',
    background: 'var(--color-background-input)',
    color: 'var(--color-foreground)',
    fontSize: 14,
    boxSizing: 'border-box',
  };

  const btnPrimary: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    background: '#6b0020',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 16,
  };

  // Verifying spinner
  if (verifying) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
        <div style={cardStyle}>
          <div style={{ width: 36, height: 36, border: '4px solid rgba(107,0,32,0.2)', borderTopColor: '#6b0020', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ fontSize: 15, color: '#6b0020', fontWeight: 600 }}>Signing you in…</div>
        </div>
      </div>
    );
  }

  // Link expired / error
  if (linkError && !linkSent) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
        <div style={cardStyle}>
          <img src={TUC_LOGO} alt="TUC" width={56} style={{ borderRadius: '50%', marginBottom: 12 }} />
          <div style={{ fontSize: 17, fontWeight: 800, color: '#6b0020', marginBottom: 8 }}>🔗 Link expired</div>
          <div style={{ fontSize: 13, color: 'var(--color-foreground-muted)', lineHeight: 1.7, marginBottom: 24 }}>
            {linkError}<br />Links expire after 15 minutes and can only be used once.
          </div>
          <button style={btnPrimary} onClick={reset}>Request a new link</button>
        </div>
      </div>
    );
  }

  // Check your email
  if (linkSent) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
        <div style={cardStyle}>
          <img src={TUC_LOGO} alt="TUC" width={56} style={{ borderRadius: '50%', marginBottom: 12 }} />
          <div style={{ fontSize: 18, fontWeight: 800, color: '#6b0020', marginBottom: 8 }}>📬 Check your email</div>
          <div style={{ fontSize: 13, color: 'var(--color-foreground-muted)', lineHeight: 1.7, marginBottom: 20 }}>
            A sign-in link has been sent to<br />
            <strong style={{ color: 'var(--color-foreground)' }}>{resolvedEmail}</strong><br />
            Click the link to access DMCDAI.
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-foreground-muted)', padding: '10px 14px', background: 'rgba(107,0,32,0.04)', borderRadius: 8, marginBottom: 16 }}>
            The link expires in <strong>15 minutes</strong> and can only be used once.
          </div>
          <a href="https://mail.google.com/a/techbridge.edu.gh" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#16a34a', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            <span style={{ fontSize: 16 }}>📩</span> Open TUC Inbox
          </a>
          <br />
          <button onClick={reset} style={{ marginTop: 12, background: 'none', border: 'none', color: '#6b0020', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
            Use a different name
          </button>
        </div>
      </div>
    );
  }

  // First Name + Last Name form
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
      aria-modal="true" role="dialog" aria-labelledby="login-title"
    >
      <div style={cardStyle}>
        <img src={TUC_LOGO} alt="TUC" width={64} style={{ borderRadius: '50%', marginBottom: 12, border: '3px solid #f5a800' }} />
        <div style={{ fontSize: 10, color: '#f5a800', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Techbridge University College</div>
        <h2 id="login-title" style={{ fontSize: 17, fontWeight: 800, color: 'var(--color-foreground)', marginBottom: 4, marginTop: 0 }}>Digital Media & Communication Design</h2>
        <div style={{ fontSize: 12, color: 'var(--color-foreground-muted)', marginBottom: 28 }}>Enter your name to receive a sign-in link</div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-foreground-muted)', display: 'block', marginBottom: 4 }}>First Name</label>
              <input style={inputStyle} type="text" placeholder="Daniel" value={firstName}
                onChange={e => setFirstName(e.target.value)} autoFocus required />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-foreground-muted)', display: 'block', marginBottom: 4 }}>Last Name</label>
              <input style={inputStyle} type="text" placeholder="Twum" value={lastName}
                onChange={e => setLastName(e.target.value)} required />
            </div>
          </div>

          {linkError && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 8, textAlign: 'left' }}>{linkError}</p>}

          <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Sending…' : 'Send Login Link'}
          </button>
        </form>

        {!hideCancel && (
          <button onClick={onClose} style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--color-foreground-muted)', fontSize: 12, cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
