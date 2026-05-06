import React, { createContext, useState, ReactNode } from 'react';
import type { AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, this would be a more secure secret.
const ADMIN_PASSWORD = 'password123';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = async (password: string): Promise<boolean> => {
    // Simulate an async login process
    await new Promise(res => setTimeout(res, 500));
    if (password === ADMIN_PASSWORD) {
      setUser('admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};