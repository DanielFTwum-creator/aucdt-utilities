import { AuditLogEntry } from '../types';

const STORAGE_KEY = 'aucdt_audit_logs';

export const logAction = (action: string, details: string, user: string = 'System') => {
  const newEntry: AuditLogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action,
    details,
    user
  };
  
  try {
    const existing = getLogs();
    // Keep last 100 logs to prevent overflow in local storage
    const updated = [newEntry, ...existing].slice(0, 100); 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save audit log", error);
  }
};

export const getLogs = (): AuditLogEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const clearLogs = () => {
  localStorage.removeItem(STORAGE_KEY);
  logAction('AUDIT_CLEAR', 'Audit logs cleared by admin', 'Admin');
};
