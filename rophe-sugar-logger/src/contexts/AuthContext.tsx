import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, User } from '../services/authService';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (userOrUsername: User | string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (u: string, e: string, p: string) => Promise<{ success: boolean; message?: string }>;
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
    if (!token) {
      const savedUser = localStorage.getItem('rophe_sugar_logger_user');
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

  const login = async (userOrUsername: User | string, password?: string) => {
    if (typeof userOrUsername === 'object') {
      setIsAuthenticated(true);
      setUser(userOrUsername);
      localStorage.setItem('rophe_sugar_logger_user', JSON.stringify(userOrUsername));
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

  const logout = () => { AuthService.logout(); localStorage.removeItem('rophe_sugar_logger_user'); setIsAuthenticated(false); setUser(null); };

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
