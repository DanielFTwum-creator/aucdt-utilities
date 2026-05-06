
import { AuditEntry } from '../types';

const AUDIT_STORAGE_KEY = 'tb_audit_logs';

export const logAction = (user: string, action: string, details: string) => {
  const logs: AuditEntry[] = JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || '[]');
  const entry: AuditEntry = {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    user,
    action,
    details
  };
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([entry, ...logs].slice(0, 100)));
};

export const getLogs = (): AuditEntry[] => {
  return JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || '[]');
};
