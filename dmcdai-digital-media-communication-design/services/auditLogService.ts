import type { AuditLog } from '../types';
import { dbService } from './dbService';

export const getLogs = async (): Promise<AuditLog[]> => {
  try {
    const logs = await dbService.getAllLogs();
    // Sort by timestamp descending (newest first)
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Failed to retrieve audit logs:', error);
    return [];
  }
};

export const addLog = async (action: string): Promise<void> => {
  try {
    const newLog: AuditLog = {
      timestamp: new Date().toISOString(),
      action,
    };
    await dbService.addLog(newLog);
  } catch (error) {
    console.error('Failed to add audit log:', error);
  }
};

export const clearLogs = async (): Promise<void> => {
  try {
    await dbService.clearLogs();
  } catch (error) {
    console.error('Failed to clear audit logs:', error);
  }
}
