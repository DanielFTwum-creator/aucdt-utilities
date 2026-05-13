import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, AuthUser } from '../services/authService';

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
    const token = AuthService.getToken();
    if (!token) {
      const savedUser = localStorage.getItem('biochemai_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setIsAuthenticated(true);
          setUser(parsed);
        } catch { /* continue */ }
      }
      setIsLoading(false);
      return;
    }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* continue */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (userOrUsername: AuthUser | string, password?: string) => {
    if (typeof userOrUsername === 'object') {
      setIsAuthenticated(true);
      setUser(userOrUsername);
      localStorage.setItem('biochemai_user', JSON.stringify(userOrUsername));
      return { success: true };
    }
    const res = await AuthService.login(userOrUsername, password!);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await AuthService.register(username, email, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const logout = () => { AuthService.logout(); localStorage.removeItem('biochemai_user'); setIsAuthenticated(false); setUser(null); };

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
