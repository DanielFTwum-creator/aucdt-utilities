import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, setToken, getToken, clearToken } from '../services/apiClient';
import { auditService } from '../services/auditService';

interface LoginResponse {
  token: string;
  username: string;
  role: string;
  name: string;
}

interface MeResponse {
  id: number;
  username: string;
  name: string;
  role: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, rehydrate from token if present
  useEffect(() => {
    const token = getToken();
    if (!token) { setIsLoading(false); return; }

    api.get<MeResponse>('/auth/me')
      .then(me => setUser({ id: me.id, username: me.username, name: me.name, role: me.role as User['role'] }))
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.post<LoginResponse>('/auth/login', { username, password });
    setToken(res.token);
    const me = await api.get<MeResponse>('/auth/me');
    const newUser: User = { id: me.id, username: me.username, name: me.name, role: me.role as User['role'] };
    setUser(newUser);
    auditService.log(username, 'LOGIN', 'Auth System', 'SUCCESS');
  };

  const logout = () => {
    if (user) auditService.log(user.username, 'LOGOUT', 'Auth System', 'SUCCESS');
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
