import { AuditLog } from '../types';

class AuditService {
  private logs: AuditLog[] = [];

  constructor() {
    // Seed some initial logs
    this.logs = [
      {
        id: 'aud-001',
        user: 'system',
        action: 'SYSTEM_STARTUP',
        target: 'Core Services',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'SUCCESS',
        details: 'System initialized successfully'
      },
      {
        id: 'aud-002',
        user: 'daniel.admin',
        action: 'UPDATE_JOB',
        target: 'Job #1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'SUCCESS',
        details: 'Changed schedule cron expression'
      }
    ];
  }

  log(user: string, action: string, target: string, status: 'SUCCESS' | 'FAILURE' = 'SUCCESS', details?: string) {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      user,
      action,
      target,
      timestamp: new Date().toISOString(),
      status,
      details
    };
    this.logs.unshift(newLog);
    console.log(`[AUDIT] ${action} by ${user}: ${status}`);
    return newLog;
  }

  getLogs(): AuditLog[] {
    return this.logs;
  }
}

export const auditService = new AuditService();