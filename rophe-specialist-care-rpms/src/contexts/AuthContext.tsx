import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: any | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  register: (u: string, e: string, p: string) => Promise<{ success: boolean; message?: string }>;
  googleLogin: (user: any) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = AuthService.getToken();
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* backend unreachable — keep state */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await AuthService.register(username, email, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const googleLogin = (googleUser: any) => {
    const user = { id: googleUser.id, username: googleUser.username, email: googleUser.email };
    setIsAuthenticated(true);
    setUser(user);
    const token = `google-${googleUser.id}-${Date.now()}`;
    localStorage.setItem('rophe_specialist_care_rpms_token', token);
  };

  const logout = () => { AuthService.logout(); setIsAuthenticated(false); setUser(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, googleLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
