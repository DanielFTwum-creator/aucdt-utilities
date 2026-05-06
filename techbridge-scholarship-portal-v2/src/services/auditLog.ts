export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details?: string;
  user: string;
}

const STORAGE_KEY = 'techbridge_audit_logs';

export const logAction = (action: string, details?: string, user: string = 'System') => {
  const newEntry: AuditLogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action,
    details,
    user
  };

  const existingLogs = getLogs();
  const updatedLogs = [newEntry, ...existingLogs].slice(0, 100); // Keep last 100 logs
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
  console.log(`[AUDIT] ${action}: ${details}`);
};

export const getLogs = (): AuditLogEntry[] => {
  try {
    const logs = localStorage.getItem(STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (e) {
    return [];
  }
};

export const clearLogs = () => {
  localStorage.removeItem(STORAGE_KEY);
  logAction('AUDIT_LOGS_CLEARED', 'Administrator cleared the audit logs', 'Admin');
};