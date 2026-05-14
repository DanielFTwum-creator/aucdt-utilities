import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { getAdminConfig, setAdminConfig, addAuditLog, getAuditLog, AuditLogEntry } from '../lib/db';
import { useAuth } from './AuthContext';

interface AdminContextType {
  isAdmin: boolean;
  isCheckingAdmin: boolean;
  auditLogs: AuditLogEntry[];
  adminLogin: (password: string) => Promise<boolean>;
  adminLogout: () => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    (async () => {
      const logs = await getAuditLog();
      setAuditLogs(logs);
      // Auto-grant admin access if user authenticated via MARKAI OAuth
      if (isAuthenticated) {
        setIsAdmin(true);
        sessionStorage.setItem('isAdmin', 'true');
      } else {
        const sessionIsAdmin = sessionStorage.getItem('isAdmin') === 'true';
        setIsAdmin(sessionIsAdmin);
      }
      setIsCheckingAdmin(false);
    })();
  }, [isAuthenticated]);

  const adminLogin = useCallback(async (inputPassword: string): Promise<boolean> => {
    const storedPassword = await getAdminConfig('adminPassword');

    if (!storedPassword) {
      await setAdminConfig('adminPassword', inputPassword);
      await addAuditLog('Admin Login', 'First admin password set.');
      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', 'true');
      return true;
    }

    if (inputPassword === storedPassword) {
      await addAuditLog('Admin Login', 'Successful login.');
      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', 'true');
      const logs = await getAuditLog();
      setAuditLogs(logs);
      return true;
    }

    await addAuditLog('Admin Login Attempt', 'Failed login attempt.');
    return false;
  }, []);

  const adminLogout = useCallback(async () => {
    await addAuditLog('Admin Logout', 'User logged out.');
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, isCheckingAdmin, auditLogs, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
};
