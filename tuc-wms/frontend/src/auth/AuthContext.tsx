import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, post, rawPost, setAccessToken, setOnAuthLost } from '../api';

export interface WmsUser {
  email: string;
  name: string;
  role: string;
  photoUrl?: string;
}

interface AuthState {
  user: WmsUser | null;
  loading: boolean;          // true while the initial silent-refresh runs
  setSession: (accessToken: string, user: WmsUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<WmsUser | null>(null);
  const [loading, setLoading] = useState(true);

  const clear = useCallback(() => { setAccessToken(null); setUser(null); }, []);

  const setSession = useCallback((accessToken: string, u: WmsUser) => {
    setAccessToken(accessToken);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    try { await post('/api/auth/logout'); } catch { /* ignore */ }
    clear();
  }, [clear]);

  // On load, attempt a silent refresh (HttpOnly cookie) to restore the session
  // without forcing a re-login.
  //
  // Use rawPost (not post) so the expected 401 when there is no cookie does
  // NOT trigger the api() 401-retry loop, which would fire a second refresh
  // request and show two red errors in the console.
  //
  // onAuthLost is armed AFTER the startup attempt completes so it never fires
  // on the expected no-cookie 401 that occurs on the /auth/callback page.
  useEffect(() => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      setLoading(false);
      // Only arm the mid-flight session-loss handler AFTER startup completes.
      setOnAuthLost(clear);
    };
    // Safety net: never let the splash hang. If the startup auth calls stall
    // (network/proxy), give up after 10s and fall through to the login screen.
    const timer = setTimeout(() => { setAccessToken(null); finish(); }, 10000);
    (async () => {
      try {
        const data = await rawPost<{ access_token: string; user: WmsUser }>('/api/auth/refresh');
        setAccessToken(data.access_token);
        // Confirm the user via /api/me (authoritative role/profile).
        const me = await api<WmsUser & { mfaEnrolled?: boolean }>('/api/me');
        setUser({ email: me.email, name: me.name, role: me.role, photoUrl: me.photoUrl });
      } catch {
        // Startup refresh failed (expected on /auth/callback — no cookie yet).
        // Do NOT call clear() here: the CallbackPage exchange may have already
        // called setSession() concurrently, and clear() would wipe it.
        setAccessToken(null);
      } finally {
        clearTimeout(timer);
        finish();
      }
    })();
    return () => clearTimeout(timer);
  }, [clear]);

  return (
    <AuthContext.Provider value={{ user, loading, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
