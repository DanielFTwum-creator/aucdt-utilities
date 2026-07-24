import React, { createContext, useContext, useState } from 'react';
import { AuthState, AuditLog } from '../types';

interface AuthContextType extends AuthState {
  auditLogs: AuditLog[];
  logAction: (action: string, details: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('admin123'); // Default configurable password
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      action,
      details,
      actor: 'Admin'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const login = (inputPassword: string) => {
    if (inputPassword === password) {
      setIsAuthenticated(true);
      logAction('LOGIN', 'Admin logged in successfully');
      return true;
    }
    logAction('LOGIN_FAILED', 'Invalid password attempt');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    logAction('LOGOUT', 'Admin logged out');
  };

  const updatePassword = (newPassword: string) => {
    setPassword(newPassword);
    logAction('SECURITY_UPDATE', 'Admin password changed');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, updatePassword, auditLogs, logAction }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
