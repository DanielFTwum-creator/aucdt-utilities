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

// NOTE: This password is not secure and is for educational demonstration purposes only.
// In a real application, authentication would be handled by a secure backend service.
const ADMIN_PASSWORD = 'dmcdai-admin-2025-secure';
const ADMIN_SESSION_KEY = 'dmcdAI-admin-session';
const AUTH_SESSION_KEY = 'dmcdAI-auth-session';
const AUTH_SESSION_EMAIL_KEY = 'dmcdAI-auth-email';
const AUTH_DOMAIN = '@techbridge.edu.gh';
const AUTOMATED_2FA = import.meta.env.VITE_AUTOMATED_2FA === 'true';
const IS_DEV_MODE = import.meta.env.MODE !== 'production';

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

    if (adminSessionActive) {
      setIsAdmin(true);
      setIsAuthenticated(true);
    }
    if (authSessionActive && storedEmail) {
      setIsAuthenticated(true);
      setUserEmail(storedEmail);
    }
  }, []);

  const isValidTechbridgeEmail = (email: string) => {
    const normalized = email.trim().toLowerCase();
    return normalized.endsWith(AUTH_DOMAIN) && normalized.includes('@');
  };

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const generateOtpEmailTemplate = (otp: string, email: string): string => {
    const displayName = email.split('@')[0];
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
        .container { background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 6px; margin-bottom: 25px; text-align: center; }
        h1 { margin: 0; font-size: 24px; }
        .subtitle { margin: 5px 0 0 0; opacity: 0.9; }
        .section { margin-bottom: 25px; }
        .info-grid { display: grid; grid-template-columns: 120px 1fr; gap: 8px; margin-bottom: 15px; }
        .info-label { font-weight: 500; color: #718096; }
        .info-value { color: #2d3748; }
        .message-box { background: #f7fafc; border-left: 4px solid #667eea; padding: 20px; border-radius: 4px; margin: 15px 0; text-align: center; }
        .otp-code { font-size: 48px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 20px 0; font-family: monospace; }
        .expiry-notice { color: #718096; font-size: 14px; margin-top: 15px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #718096; }
        .signature { margin-top: 20px; font-style: italic; color: #4a5568; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Techbridge Access Verification</h1>
            <p class="subtitle">2FA Authentication Code</p>
        </div>

        <div class="section">
            <div class="info-grid">
                <div class="info-label">Recipient:</div>
                <div class="info-value">${displayName}</div>
                <div class="info-label">Type:</div>
                <div class="info-value">Authentication Code</div>
            </div>
        </div>

        <div class="section">
            <div class="message-box">
                <p style="margin-bottom: 10px;">Your Techbridge verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p class="expiry-notice">This code expires in 10 minutes.</p>
            </div>
        </div>

        <div class="footer">
            <p>If you didn't request this code, please ignore this email.</p>
            <div class="signature">
                Best regards,<br>
                The Techbridge Team
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  const requestOtp = async (email: string): Promise<string | null> => {
    const normalized = email.trim().toLowerCase();
    if (!isValidTechbridgeEmail(normalized)) {
      return null;
    }

    const otp = generateOtp();
    const registrationId = Date.now().toString();
    const displayName = normalized.split('@')[0];

    const payload = {
      applicantId: registrationId,
      fullName: displayName,
      message: generateOtpEmailTemplate(otp, normalized),
      receiverEmailId: normalized,
      senderEmailId: 'info@techbridge.edu.gh',
      subject: 'Techbridge Access Verification Code'
    };

    try {
      const activatedAutomated2FA = AUTOMATED_2FA || (typeof window !== 'undefined' && (window as any).__dmcdaiAuto2FAEnabled === true);
      if (!activatedAutomated2FA) {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          addLog(`OTP email send failed for ${normalized}: ${JSON.stringify(errorData)}`);
          return null;
        }
      } else {
        addLog(`Automated 2FA active: skipping email send for ${normalized}`);
      }

      setPendingEmail(normalized);
      setPendingOtpCode(otp);
      if (typeof window !== 'undefined' && (activatedAutomated2FA || IS_DEV_MODE)) {
        (window as any).__dmcdaiPendingOtp = otp;
      }
      setIsAuthenticated(false);
      setUserEmail(null);
      sessionStorage.removeItem(AUTH_SESSION_KEY);
      sessionStorage.removeItem(AUTH_SESSION_EMAIL_KEY);
      addLog(`OTP requested for ${normalized}`);
      return otp;
    } catch (error) {
      addLog(`OTP email send exception for ${normalized}: ${String(error)}`);
      return null;
    }
  };

  const verifyOtp = (code: string): boolean => {
    if (pendingOtpCode && pendingEmail && code === pendingOtpCode) {
      setIsAuthenticated(true);
      setUserEmail(pendingEmail);
      try {
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
        sessionStorage.setItem(AUTH_SESSION_EMAIL_KEY, pendingEmail);
      } catch {
        // sessionStorage unavailable (e.g. private mode) — session won't persist across reload
      }
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
    isAuthenticated,
    userEmail,
    isAdmin,
    pendingEmail,
    requestOtp,
    verifyOtp,
    loginAdmin,
    logout,
  }), [isAuthenticated, userEmail, isAdmin, pendingEmail]);

  return (
    <AuthContext.Provider value={value}>
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
