import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, post, setAccessToken, setOnAuthLost } from '../api';

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
  // IMPORTANT: onAuthLost is registered AFTER the startup refresh resolves so
  // the "session lost mid-flight" handler never fires on the expected
  // "no cookie yet" 401 that occurs on the /auth/callback page.
  useEffect(() => {
    (async () => {
      try {
        const data = await post<{ access_token: string; user: WmsUser }>('/api/auth/refresh');
        setAccessToken(data.access_token);
        // confirm the user via /api/me (authoritative role/profile)
        const me = await api<WmsUser & { mfaEnrolled?: boolean }>('/api/me');
        setUser({ email: me.email, name: me.name, role: me.role, photoUrl: me.photoUrl });
      } catch {
        clear();
      } finally {
        setLoading(false);
        // Only arm the mid-flight session-loss handler AFTER startup completes.
        setOnAuthLost(clear);
      }
    })();
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
