import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, AuthUser } from '../services/authService';
import { initSessionService, createSession, restoreSession, destroySession } from '../services/sessionService';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (userOrUsername: AuthUser | string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (u: string, e: string, p: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);

        // Initialize IndexedDB session service
        await initSessionService();

        // 1. Check for user data in URL (from OAuth callback)
        const urlUser = params.get('user');
        if (urlUser) {
          try {
            const userData = JSON.parse(atob(urlUser)) as AuthUser;
            setIsAuthenticated(true);
            setUser(userData);
            localStorage.setItem('biochemai_user', JSON.stringify(userData));
            await createSession(userData.email, userData.username);
            // Hard redirect to reload without URL params
            window.location.href = '/biochemai/';
            return;
          } catch (e) {
            console.error('Failed to parse user from URL:', e);
          }
        }

        // 2. Check for server-set cookie from OAuth callback (one-shot)
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith('biochemai_user='))
          ?.split('=')[1];
        if (cookieValue) {
          try {
            const userData = JSON.parse(atob(decodeURIComponent(cookieValue))) as AuthUser;
            setIsAuthenticated(true);
            setUser(userData);
            localStorage.setItem('biochemai_user', JSON.stringify(userData));
            await createSession(userData.email, userData.username);
            document.cookie = 'biochemai_user=; max-age=0; path=/biochemai/';
            setIsLoading(false);
            return;
          } catch (e) {
            console.error('Failed to parse user cookie:', e);
          }
        }

        const token = AuthService.getToken();
        if (!token) {
          // Try to restore from IndexedDB
          const savedUser = localStorage.getItem('biochemai_user');
          if (savedUser) {
            try {
              const parsed = JSON.parse(savedUser);
              const session = await restoreSession(parsed.email);
              if (session) {
                setIsAuthenticated(true);
                setUser(parsed);
              } else {
                localStorage.removeItem('biochemai_user');
              }
            } catch { /* continue */ }
          }
          setIsLoading(false);
          return;
        }

        AuthService.validateToken(token)
          .then((res: any) => {
            if (res.valid && res.user) {
              setIsAuthenticated(true);
              setUser(res.user);
            }
            else {
              AuthService.logout();
              setIsAuthenticated(false);
            }
          })
          .catch(() => { /* continue */ })
          .finally(() => setIsLoading(false));
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (userOrUsername: AuthUser | string, password?: string) => {
    if (typeof userOrUsername === 'object') {
      setIsAuthenticated(true);
      setUser(userOrUsername);
      localStorage.setItem('biochemai_user', JSON.stringify(userOrUsername));
      // Persist session to IndexedDB
      await createSession(userOrUsername.email, userOrUsername.name);
      return { success: true };
    }
    const res = await AuthService.login(userOrUsername, password!);
    if (res.success && res.user) {
      setIsAuthenticated(true);
      setUser(res.user);
      localStorage.setItem('biochemai_user', JSON.stringify(res.user));
      // Persist session to IndexedDB
      await createSession(res.user.email, res.user.name);
    }
    return { success: res.success, message: res.message };
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await AuthService.register(username, email, password);
    if (res.success && res.user) {
      setIsAuthenticated(true);
      setUser(res.user);
      localStorage.setItem('biochemai_user', JSON.stringify(res.user));
      // Persist session to IndexedDB
      await createSession(res.user.email, res.user.name);
    }
    return { success: res.success, message: res.message };
  };

  const logout = async () => {
    AuthService.logout();
    localStorage.removeItem('biochemai_user');
    if (user?.email) {
      await destroySession(user.email);
    }
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
