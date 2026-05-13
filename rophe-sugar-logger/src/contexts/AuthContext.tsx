import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, User } from '../services/authService';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  register: (u: string, e: string, p: string) => Promise<{ success: boolean; message?: string }>;
  googleLogin: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = AuthService.getToken();
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* continue */ })
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

  const googleLogin = (googleUser: User) => {
    const user: User = { id: googleUser.id, username: googleUser.username, email: googleUser.email };
    setIsAuthenticated(true);
    setUser(user);
    const token = `google-${googleUser.id}-${Date.now()}`;
    localStorage.setItem('biochemai_token', token);
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
