import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  wmsExchange, wmsSilentSession, wmsLogout, WmsSession,
} from '../services/wmsAuthService';

// WMS SSO adapter for Patois Lyricist (archetype B — TUC-ICT-SRS-2026-013).
// Sign-in is delegated to WMS (Google OAuth + TOTP, domain-gated to
// @techbridge.edu.gh — all TUC students + staff). This provider keeps the same
// useAuth() surface the app already consumes ({ user, logout }), so App.tsx is
// untouched; underneath, it runs the fleet-standard WMS flow: silent session
// adoption, code exchange, and the MFA challenge. The WMS access token is held in
// memory and injected into this app's /patois/api/ calls by the fetch wrapper below.

interface AuthUser { email: string; name?: string; id?: string; }

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  /** Set when the WMS callback returned an MFA challenge — the login view shows the TOTP modal. */
  wmsMfaTicket: string | null;
  clearWmsMfaTicket: () => void;
  /** WMS callback error marker (domain | deactivated | oauth) for login messaging. */
  wmsError: string | null;
  /** Complete a WMS login (exchange or MFA result) — maps the WMS user into the app. */
  adoptWmsSession: (session: WmsSession) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Served at /patois/ (matches vite base). Hardcoded so the value is stable regardless of build config.
const APP_PATH = '/patois/';

// ── Token store + fetch wrapper ──────────────────────────────────────────────
// Hold the WMS access token in memory and attach it to this app's own API calls
// (/patois/api/... in prod, /api/... in dev). Cross-origin WMS calls and other
// apps' paths are left untouched.
let wmsToken: string | null = null;

const _fetch = window.fetch.bind(window);
window.fetch = ((input: any, init: any = {}) => {
  const url = typeof input === 'string' ? input : (input?.url ?? '');
  const isOwnApi = typeof url === 'string' && (url.startsWith('/patois/api/') || url.startsWith('/api/'));
  if (wmsToken && isOwnApi) {
    const headers = new Headers(init.headers ?? (typeof input !== 'string' ? input.headers : undefined));
    headers.set('Authorization', `Bearer ${wmsToken}`);
    return _fetch(input, { ...init, headers });
  }
  return _fetch(input, init);
}) as typeof window.fetch;

const mapWmsUser = (s: WmsSession): AuthUser => ({
  id: `wms:${s.user.email}`,
  email: s.user.email,
  name: s.user.name || s.user.email,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wmsMfaTicket, setWmsMfaTicket] = useState<string | null>(null);
  const [wmsError, setWmsError] = useState<string | null>(null);

  const adoptWmsSession = useCallback((session: WmsSession) => {
    wmsToken = session.access_token;
    setWmsMfaTicket(null);
    setWmsError(null);
    setUser(mapWmsUser(session));
  }, []);

  const logout = useCallback(() => {
    // Clear the fleet refresh cookie too, or the silent adoption below would sign
    // the user straight back in on the next visit.
    wmsLogout();
    wmsToken = null;
    setUser(null);
  }, []);

  useEffect(() => {
    (async () => {
      // The WMS OAuth callback lands on /patois/auth/callback?code|mfa_ticket|error
      // (served by the SPA fallback). Handle the params, then clean the URL.
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const ticket = params.get('mfa_ticket');
      const err = params.get('error');
      if (code || ticket || err) window.history.replaceState(null, '', APP_PATH);

      try {
        if (err) { setWmsError(err); return; }
        if (ticket) { setWmsMfaTicket(ticket); return; }
        if (code) {
          try { adoptWmsSession(await wmsExchange(code)); }
          catch { setWmsError('oauth'); }
          return;
        }
        // Normal load: silently adopt an existing fleet session (user already
        // signed into another WMS-SSO app on *.techbridge.edu.gh).
        const session = await wmsSilentSession();
        if (session) adoptWmsSession(session);
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isLoading, logout,
      wmsMfaTicket, clearWmsMfaTicket: () => setWmsMfaTicket(null),
      wmsError, adoptWmsSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
