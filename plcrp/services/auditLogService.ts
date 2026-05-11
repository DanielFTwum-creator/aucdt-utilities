import type { AuditLog } from '../types';

const AUDIT_KEY = 'plcrp-audit-logs';

export const getLogs = (): AuditLog[] => {
  try {
    return JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
  } catch {
    return [];
  }
};

export const addLog = (action: string, options?: { entityType?: AuditLog['entityType']; entityId?: string; result?: AuditLog['result'] }): void => {
  try {
    const logs = getLogs();
    const entry: AuditLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      action,
      ...options,
    };
    logs.unshift(entry);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(logs.slice(0, 500)));
  } catch {
    // localStorage unavailable — silently skip
  }
};

export const clearLogs = (): void => {
  localStorage.removeItem(AUDIT_KEY);
};
