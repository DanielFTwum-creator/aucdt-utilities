import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { AuditLogEntry, GeminiModel, FeatureFlag } from '../types';
import { storageService } from '../services/storageService';
import { useFeatureFlags } from './FeatureFlagsContext';
import { sendNotification } from '../services/notificationService';

interface AdminContextType {
  isAdmin: boolean; 
  isCheckingAdmin: boolean; 
  auditLogs: AuditLogEntry[];
  geminiModel: GeminiModel; 
  adminLogin: (password: string) => Promise<boolean>;
  adminLogout: () => void; 
  setGeminiModel: (model: GeminiModel) => void;
  onToggleFlag: (flag: FeatureFlag) => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toggleFlag: toggleFeatureFlag, featureFlags } = useFeatureFlags();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [geminiModel, setGeminiModelState] = useState<GeminiModel>(GeminiModel.FLASH);

  const addAuditLog = useCallback(async (action: string, details?: string) => {
    const newLog: AuditLogEntry = { id: `${Date.now()}`, timestamp: new Date().toISOString(), action, details };
    setAuditLogs(prev => { 
      const updated = [newLog, ...prev]; 
      storageService.setAuditLogs(updated); 
      return updated; 
    });
  }, []);

  useEffect(() => {
    (async () => {
      const logs = await storageService.getAuditLogs(); setAuditLogs(logs);
      const model = await storageService.getGeminiModel(); setGeminiModelState(model);
      const sessionIsAdmin = sessionStorage.getItem('isAdmin') === 'true'; setIsAdmin(sessionIsAdmin);
      setIsCheckingAdmin(false);
    })();
  }, []);

  const adminLogin = useCallback(async (password: string): Promise<boolean> => {
    // In a real app, this should come from a secure config. Using a hardcoded value for this client-side demo.
    const adminPassword = 'admin123';
    const timestamp = new Date().toISOString();

    if (password === adminPassword) {
      setIsAdmin(true); 
      sessionStorage.setItem('isAdmin', 'true');
      await addAuditLog('ADMIN_LOGIN_SUCCESS');
      
      sendNotification({
          to: 'security@markai.com',
          subject: '[INFO] Successful Admin Login on MarkAI',
          body: `A successful admin login occurred at <strong>${timestamp}</strong>.`
      });

      return true;
    } else {
      await addAuditLog('ADMIN_LOGIN_FAIL', `Attempt with pass: "${password}"`);
      
      sendNotification({
          to: 'security@markai.com',
          subject: '[SECURITY ALERT] Failed Admin Login Attempt on MarkAI',
          body: `A FAILED admin login attempt occurred at <strong>${timestamp}</strong>. The password used was: "<strong>${password}</strong>".`
      });

      return false;
    }
  }, [addAuditLog]);

  const adminLogout = useCallback(async () => {
    setIsAdmin(false); 
    sessionStorage.removeItem('isAdmin');
    await addAuditLog('ADMIN_LOGOUT');
  }, [addAuditLog]);

  const setGeminiModel = useCallback(async (model: GeminiModel) => {
    setGeminiModelState(model); 
    await storageService.setGeminiModel(model);
    await addAuditLog('ADMIN_MODEL_CHANGED', `Set to: ${model}`);
  }, [addAuditLog]);
  
  const onToggleFlag = useCallback(async (flag: FeatureFlag) => {
      toggleFeatureFlag(flag);
      await addAuditLog('ADMIN_FEATURE_FLAG_TOGGLED', `Flag: ${flag}, New state: ${!featureFlags[flag]}`);
  }, [addAuditLog, toggleFeatureFlag, featureFlags]);

  return (
    <AdminContext.Provider value={{ isAdmin, isCheckingAdmin, auditLogs, geminiModel, adminLogin, adminLogout, setGeminiModel, onToggleFlag }}>
      {children}
    </AdminContext.Provider>
  );
};