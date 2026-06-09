import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wmsExchangeCode, netscanSsoExchange } from '../../lib/wmsAuth';
import { useAuthStore } from '../../lib/api';

/**
 * Handles the WMS SSO redirect (TUC-ICT-SRS-2026-013):
 *   ?code=…        -> exchange for a WMS token, then NetScan sso-exchange -> enter app
 *   ?mfa_ticket=…  -> route to the MFA screen
 *   ?error=…       -> back to login with the reason
 */
export function CallbackPage() {
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);
  const [error, setError] = useState('');
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const p = new URLSearchParams(window.location.search);
    const code = p.get('code');
    const mfaTicket = p.get('mfa_ticket');
    const err = p.get('error');

    if (err) { navigate(`/login?reason=${encodeURIComponent(err)}`, { replace: true }); return; }
    if (mfaTicket) { navigate('/mfa', { replace: true, state: { mfaTicket } }); return; }
    if (code) {
      (async () => {
        try {
          const wmsToken = await wmsExchangeCode(code);
          const r = await netscanSsoExchange(wmsToken);
          login(r.token, r.username);
          navigate('/', { replace: true });
        } catch (e: any) {
          setError(e?.message || 'Sign-in failed');
        }
      })();
      return;
    }
    navigate('/login', { replace: true });
  }, [navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center font-mono-code text-sm"
         style={{ background: '#060e1a' }}>
      {error
        ? <span className="text-red-400">{error} · <a href="/login" className="underline text-gold">retry</a></span>
        : <span className="text-slate-400 tracking-widest">AUTHENTICATING…</span>}
    </div>
  );
}
