
import { getItem, setItem, removeItem } from '../lib/persistentStore';
import { AuditLogEntry, AuditLogEvent } from '../types';

const LOG_KEY = 'tuc-salary-audit-log';

export const addLog = (event: AuditLogEvent, details?: string): void => {
  try {
    const logs = getLogs();
    const newLog: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      event,
      details,
    };
    // Prepend new log to have the most recent first
    setItem(LOG_KEY, [newLog, ...logs]);
  } catch (error) {
    console.error("Failed to add audit log:", error);
  }
};

export const getLogs = (): AuditLogEntry[] => {
  try {
    return getItem<AuditLogEntry[]>(LOG_KEY, []);
  } catch (error) {
    console.error("Failed to retrieve audit logs:", error);
    return [];
  }
};

export const clearLogs = (): void => {
  try {
    removeItem(LOG_KEY);
    // Immediately log the clearing action to maintain trail continuity
    addLog(AuditLogEvent.AUDIT_LOG_CLEARED, "All previous logs deleted manually by administrator.");
  } catch (error) {
    console.error("Failed to clear logs:", error);
  }
};
