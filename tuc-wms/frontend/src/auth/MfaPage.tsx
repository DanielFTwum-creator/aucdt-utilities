import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { rawPost } from '../api';
import { useAuth, WmsUser } from './AuthContext';

/**
 * TOTP MFA step for HOD / SystemAdmin (FR-AUTH-008). Shown only when the OAuth
 * callback returned an mfa_ticket. Submits ticket + 6-digit code; on success the
 * backend issues the JWT (same shape as /exchange).
 */
export default function MfaPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const location = useLocation() as { state?: { mfaTicket?: string } };
  const [ticket, setTicket] = useState(location.state?.mfaTicket ?? '');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!ticket) return <Navigate to="/login" replace />;

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      // rawPost bypasses 401-retry — a 401 here means wrong TOTP, not lost session.
      const res = await rawPost<{ access_token: string; user: WmsUser }>('/api/auth/mfa/verify', { mfa_ticket: ticket, code });
      // Backend re-issues a fresh ticket when TOTP code is wrong; update state for retry.
      if ((res as any).mfa_ticket) { setTicket((res as any).mfa_ticket); throw new Error((res as any).error || 'Invalid code'); }
      setSession(res.access_token, res.user);
      navigate('/', { replace: true });
    } catch (err: any) {
      // The backend re-issues a fresh ticket on a wrong code; surface a retry.
      setError(err.message || 'Invalid code');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <form onSubmit={verify} style={card}>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--tuc-maroon)', marginTop: 0 }}>Two-factor verification</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Enter the 6-digit code from your authenticator app.</p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric" autoComplete="one-time-code" placeholder="123456" autoFocus
          style={input}
        />
        {error && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={busy || code.length !== 6} style={btn}>
          {busy ? 'Verifying…' : 'Verify'}
        </button>
      </form>
    </div>
  );
}

const card: React.CSSProperties = { background: 'var(--card)', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 380, border: '1px solid var(--border)', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' };
const input: React.CSSProperties = { width: '100%', padding: '12px', fontSize: 22, letterSpacing: 8, textAlign: 'center', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 14 };
const btn: React.CSSProperties = { width: '100%', padding: '12px', background: 'var(--tuc-maroon)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' };
