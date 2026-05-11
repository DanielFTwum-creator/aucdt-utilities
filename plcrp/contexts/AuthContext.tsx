import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { addLog } from '../services/auditLogService';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  isAdmin: boolean;
  pendingEmail: string | null;
  requestOtp: (email: string) => Promise<string | null>;
  verifyOtp: (code: string) => boolean;
  loginAdmin: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'plcrp-admin-2025';
const ADMIN_SESSION_KEY = 'plcrp-admin-session';
const AUTH_SESSION_KEY = 'plcrp-auth-session';
const AUTH_SESSION_EMAIL_KEY = 'plcrp-auth-email';
const AUTH_DOMAIN = '@techbridge.edu.gh';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingOtpCode, setPendingOtpCode] = useState<string | null>(null);

  useEffect(() => {
    const adminSessionActive = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    const authSessionActive = sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
    const storedEmail = sessionStorage.getItem(AUTH_SESSION_EMAIL_KEY);
    if (adminSessionActive) { setIsAdmin(true); setIsAuthenticated(true); }
    if (authSessionActive && storedEmail) { setIsAuthenticated(true); setUserEmail(storedEmail); }
  }, []);

  const isValidTechbridgeEmail = (email: string) =>
    email.trim().toLowerCase().endsWith(AUTH_DOMAIN);

  const requestOtp = async (email: string): Promise<string | null> => {
    const normalized = email.trim().toLowerCase();
    if (!isValidTechbridgeEmail(normalized)) return null;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setPendingEmail(normalized);
    setPendingOtpCode(otp);
    if (import.meta.env.MODE !== 'production') {
      (window as any).__plcrpPendingOtp = otp;
    }
    addLog(`OTP requested for ${normalized}`);
    return otp;
  };

  const verifyOtp = (code: string): boolean => {
    if (pendingOtpCode && pendingEmail && code === pendingOtpCode) {
      setIsAuthenticated(true);
      setUserEmail(pendingEmail);
      sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      sessionStorage.setItem(AUTH_SESSION_EMAIL_KEY, pendingEmail);
      setPendingEmail(null);
      setPendingOtpCode(null);
      addLog(`User logged in: ${pendingEmail}`);
      return true;
    }
    addLog('OTP verification failed.');
    return false;
  };

  const loginAdmin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      addLog('Admin login successful.');
      return true;
    }
    addLog('Admin login failed (incorrect password).');
    return false;
  };

  const logout = () => {
    addLog('User logged out.');
    setIsAuthenticated(false);
    setUserEmail(null);
    setIsAdmin(false);
    setPendingEmail(null);
    setPendingOtpCode(null);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_EMAIL_KEY);
  };

  const value = useMemo(() => ({
    isAuthenticated, userEmail, isAdmin, pendingEmail,
    requestOtp, verifyOtp, loginAdmin, logout,
  }), [isAuthenticated, userEmail, isAdmin, pendingEmail]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
