
import React, { createContext, useContext, useMemo, useState } from 'react';
import { DEFAULT_PASSWORD, MIN_PASSWORD_LENGTH } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';
import { addLog } from '../services/auditLogService';
import { authService } from '../services/AuthService';
import { AuditLogEvent } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (current: string, newPass: string) => { success: boolean, message: string };
  user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [password, setPassword] = useLocalStorage<string>('tuc-salary-password', DEFAULT_PASSWORD);

  // Validate token on mount
  React.useEffect(() => {
    const validate = async () => {
      const savedToken = localStorage.getItem('tsapro_token');
      if (savedToken) {
        const result = await authService.validateToken(savedToken);
        if (result.success && result.valid) {
          setIsAuthenticated(true);
          setUser(result.user);
        } else {
          logout();
        }
      }
    };
    validate();
  }, []);

  const login = async (enteredPassword: string): Promise<boolean> => {
    try {
      const result = await authService.login(enteredPassword);
      if (result.success && result.token) {
        setIsAuthenticated(true);
        setUser(result.user);
        localStorage.setItem('tsapro_token', result.token);
        addLog(AuditLogEvent.LOGIN_SUCCESS);
        return true;
      } else {
        addLog(AuditLogEvent.LOGIN_FAILURE, result.message || 'Invalid password entered.');
        return false;
      }
    } catch (error) {
      addLog(AuditLogEvent.LOGIN_FAILURE, 'Auth API unavailable');
      return false;
    }
  };

  const logout = (): void => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('tsapro_token');
    authService.logout();
    addLog(AuditLogEvent.LOGOUT);
  };

  const changePassword = (current: string, newPass: string): { success: boolean, message: string } => {
    if (current !== password) {
      addLog(AuditLogEvent.PASSWORD_CHANGE_FAILURE, 'Incorrect current password provided.');
      return { success: false, message: 'Current password is incorrect.' };
    }
    if (newPass.length < MIN_PASSWORD_LENGTH) {
      addLog(AuditLogEvent.PASSWORD_CHANGE_FAILURE, 'New password did not meet length requirement.');
      return { success: false, message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` };
    }
    if (newPass === current) {
      addLog(AuditLogEvent.PASSWORD_CHANGE_FAILURE, 'New password is identical to current password.');
      return { success: false, message: 'New password must differ from the current password.' };
    }
    setPassword(newPass);
    addLog(AuditLogEvent.PASSWORD_CHANGE_SUCCESS);
    return { success: true, message: 'Password changed successfully.' };
  };

  const value = useMemo(() => ({
    isAuthenticated,
    login,
    logout,
    changePassword,
    user,
  }), [isAuthenticated, password, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
