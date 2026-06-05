import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rawPost } from '../api';
import { useAuth, WmsUser } from './AuthContext';

// ─── Debug logger ────────────────────────────────────────────────────────────
const CB = (msg: string, data?: unknown) =>
  console.log(`%c[WMS-CB] ${msg}`, 'color:#6366f1;font-weight:bold', ...(data !== undefined ? [data] : []));
const CBE = (msg: string, data?: unknown) =>
  console.error(`%c[WMS-CB] ${msg}`, 'color:#ef4444;font-weight:bold', ...(data !== undefined ? [data] : []));

/**
 * Handles the backend OAuth redirect (AUTH_API.md):
 *   ?code=…        -> exchange for a JWT + refresh cookie, then go to the app
 *   ?mfa_ticket=…  -> route to the MFA screen (HOD/SystemAdmin)
 *   ?error=…       -> back to login with the reason
 */
export default function CallbackPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;     // guard against StrictMode double-run
    ran.current = true;

    CB('▶ CallbackPage mounted', { href: window.location.href });

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const mfaTicket = params.get('mfa_ticket');
    const err = params.get('error');

    CB('URL params', { code: code ? `${code.slice(0, 20)}… (len=${code.length})` : null, mfaTicket: !!mfaTicket, err });

    if (err) {
      CBE('error param — redirecting to /login', { err });
      navigate(`/login?reason=${encodeURIComponent(err)}`, { replace: true });
      return;
    }

    if (mfaTicket) {
      CB('mfa_ticket present — navigating to /mfa');
      navigate('/mfa', { replace: true, state: { mfaTicket } });
      return;
    }

    if (code) {
      CB('code present — calling /api/auth/exchange');
      rawPost<{ access_token: string; user: WmsUser }>('/api/auth/exchange', { code })
        .then(({ access_token, user }) => {
          CB('exchange ✅ — session set, hard redirect to /', {
            token: access_token.slice(0, 20) + '…',
            user,
          });
          setSession(access_token, user);
          window.location.replace('/');
        })
        .catch((e) => {
          CBE('exchange ❌', { message: e.message, code: code.slice(0, 20) + '…' });
          setError(e.message || 'Sign-in failed');
        });
      return;
    }

    CBE('no code / mfa_ticket / error in URL — redirecting to /login');
    navigate('/login', { replace: true });
  }, [navigate, setSession]);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      {error
        ? <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--danger)' }}>{error}</p>
            <a href="/login">Back to sign in</a>
          </div>
        : <p style={{ color: 'var(--muted)' }}>Signing you in…</p>}
    </div>
  );
}
