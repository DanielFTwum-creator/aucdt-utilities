
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';
import { wmsExchange, wmsSilentSession, wmsLogout, WmsSession } from '../services/wmsAuthService';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  /** Set when the WMS callback returned an MFA challenge — LoginView shows the TOTP modal. */
  wmsMfaTicket: string | null;
  clearWmsMfaTicket: () => void;
  /** WMS callback error marker (domain | deactivated | oauth) for LoginView messaging. */
  wmsError: string | null;
  /** Complete a WMS login (exchange or MFA result) — maps the WMS user into the app. */
  adoptWmsSession: (session: WmsSession) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Vite base is './' so BASE_URL is useless here — the app is served at /markai/.
const APP_PATH = '/markai/';

const mapWmsUser = (s: WmsSession): User => ({
  id: `wms:${s.user.email}`,
  email: s.user.email,
  name: s.user.name || s.user.email,
  tier: 'free',
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wmsMfaTicket, setWmsMfaTicket] = useState<string | null>(null);
  const [wmsError, setWmsError] = useState<string | null>(null);

  const login = useCallback(async (user: User) => {
    setCurrentUser(user);
    await storageService.setCurrentUser(user);
  }, []);

  const adoptWmsSession = useCallback((session: WmsSession) => {
    setWmsMfaTicket(null);
    setWmsError(null);
    login(mapWmsUser(session));
  }, [login]);

  const logout = useCallback(async () => {
    // SSO users: also clear the fleet refresh cookie, or the silent adoption
    // below would sign them straight back in on the next visit.
    if (currentUser?.id?.startsWith('wms:')) wmsLogout();
    setCurrentUser(null);
    await storageService.setCurrentUser(null);
  }, [currentUser]);

  useEffect(() => {
    (async () => {
      // The WMS OAuth callback lands on /markai/auth/callback?code|mfa_ticket|error
      // (served by the SPA fallback) — handle the params, then clean the URL.
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

        // Normal load: restore the local session; otherwise silently adopt an
        // existing fleet session (user already signed into another WMS-SSO app).
        const stored = await storageService.getCurrentUser();
        if (stored) { setCurrentUser(stored); return; }
        const session = await wmsSilentSession();
        if (session) await login(mapWmsUser(session));
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser, isLoading, login, logout,
      wmsMfaTicket, clearWmsMfaTicket: () => setWmsMfaTicket(null),
      wmsError, adoptWmsSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
