import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuditLogEntry } from '../types';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  auditLogs: AuditLogEntry[];
  addLog: (action: string, resource: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('lf_admin_auth') === 'true';
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('lf_audit_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lf_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addLog = (action: string, resource: string) => {
    const newLog: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      actor: 'admin',
      resource
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 100));
  };

  const login = (password: string) => {
    // In a real app, this would be a server-side check
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('lf_admin_auth', 'true');
      addLog('LOGIN', 'Admin Dashboard');
      return true;
    }
    addLog('FAILED_LOGIN_ATTEMPT', 'Admin Login');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('lf_admin_auth');
    addLog('LOGOUT', 'Admin Dashboard');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, auditLogs, addLog }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
};
