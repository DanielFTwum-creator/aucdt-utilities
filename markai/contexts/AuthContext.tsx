
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType { 
  currentUser: User | null; 
  isLoading: boolean; 
  login: (user: User) => void; 
  logout: () => void; 
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    (async () => { 
      setCurrentUser(await storageService.getCurrentUser()); 
      setIsLoading(false); 
    })(); 
  }, []);

  const login = useCallback(async (user: User) => { 
    setCurrentUser(user); 
    await storageService.setCurrentUser(user); 
  }, []);

  const logout = useCallback(async () => { 
    setCurrentUser(null); 
    await storageService.setCurrentUser(null); 
  }, []);

  return <AuthContext.Provider value={{ currentUser, isLoading, login, logout }}>{children}</AuthContext.Provider>;
};
