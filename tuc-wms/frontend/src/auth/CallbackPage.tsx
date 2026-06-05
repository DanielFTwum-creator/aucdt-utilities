import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rawPost } from '../api';
import { useAuth, WmsUser } from './AuthContext';

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

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const mfaTicket = params.get('mfa_ticket');
    const err = params.get('error');

    if (err) { navigate(`/login?reason=${encodeURIComponent(err)}`, { replace: true }); return; }

    if (mfaTicket) {
      navigate('/mfa', { replace: true, state: { mfaTicket } });
      return;
    }

    if (code) {
      // rawPost bypasses the 401-retry/onAuthLost loop — a 401 here means
      // "invalid or expired handoff code", not a lost session.
      rawPost<{ access_token: string; user: WmsUser }>('/api/auth/exchange', { code })
        .then(({ access_token, user }) => {
          // Store the access token in memory for any immediate in-flight requests,
          // but use a hard redirect to '/' rather than react-router navigate().
          //
          // WHY: setSession() schedules a React state update (setUser) which is
          // asynchronous. If we call navigate('/') immediately after, ProtectedRoute
          // renders before React flushes that update, sees user=null, and bounces
          // the user back to /login. A hard redirect remounts the whole app fresh;
          // AuthContext's startup refresh then succeeds using the wms_refresh cookie
          // that the /exchange response already set on the browser.
          setSession(access_token, user);
          window.location.replace('/');
        })
        .catch((e) => setError(e.message || 'Sign-in failed'));
      return;
    }

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
