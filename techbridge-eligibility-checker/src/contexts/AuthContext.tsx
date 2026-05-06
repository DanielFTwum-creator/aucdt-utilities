import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
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
      setIsLoading(false);
      return;
    }
    AuthService.validateToken(token)
      .then((res) => {
        if (res.valid && res.user) {
          setIsAuthenticated(true);
          setUser(res.user);
        } else {
          AuthService.logout();
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        // Backend unreachable — preserve existing state
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) {
      setIsAuthenticated(true);
      setUser(res.user);
    }
    return { success: res.success, message: res.message };
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
