/**
 * Audit Logging System
 * Tracks all administrative actions and user interactions
 */

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  userRole?: string;
  details: {
    [key: string]: unknown;
  };
  status: 'success' | 'failure' | 'warning';
  ipAddress?: string;
  userAgent?: string;
  affectedResources?: string[];
  changesDiff?: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
}

export class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private maxLogs: number = 10000;
  private storageKey: string = 'aucdt_audit_logs';

  constructor() {
    this.loadLogsFromStorage();
  }

  /**
   * Log an administrative action
   */
  public logAdminAction(
    action: string,
    details: Record<string, unknown>,
    userId: string,
    status: 'success' | 'failure' = 'success'
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      userId,
      details,
      status,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      ipAddress: '127.0.0.1' // In production, get actual IP from backend
    };

    this.logs.unshift(entry);
    this.enforceMaxLogs();
    this.saveToStorage();

    return entry;
  }

  /**
   * Log user login event
   */
  public logLogin(userId: string, username: string, success: boolean = true): AuditLogEntry {
    return this.logAdminAction(
      'user_login',
      { userId, username, ipAddress: this.getClientIP() },
      userId,
      success ? 'success' : 'failure'
    );
  }

  /**
   * Log user logout event
   */
  public logLogout(userId: string, username: string): AuditLogEntry {
    return this.logAdminAction(
      'user_logout',
      { userId, username },
      userId,
      'success'
    );
  }

  /**
   * Log data modification
   */
  public logDataModification(
    userId: string,
    resourceType: string,
    resourceId: string,
    before: Record<string, unknown>,
    after: Record<string, unknown>
  ): AuditLogEntry {
    return this.logAdminAction(
      'data_modified',
      {
        resourceType,
        resourceId,
        changesCount: Object.keys(after).length
      },
      userId,
      'success'
    );
  }

  /**
   * Log export action
   */
  public logExport(
    userId: string,
    exportType: string,
    recordCount: number,
    format: string
  ): AuditLogEntry {
    return this.logAdminAction(
      'data_exported',
      {
        exportType,
        recordCount,
        format,
        timestamp: new Date().toISOString()
      },
      userId,
      'success'
    );
  }

  /**
   * Log access to sensitive data
   */
  public logSensitiveAccess(
    userId: string,
    dataType: string,
    recordCount: number
  ): AuditLogEntry {
    return this.logAdminAction(
      'sensitive_data_accessed',
      {
        dataType,
        recordCount,
        accessTime: new Date().toISOString()
      },
      userId,
      'success'
    );
  }

  /**
   * Log configuration change
   */
  public logConfigChange(
    userId: string,
    configKey: string,
    oldValue: unknown,
    newValue: unknown
  ): AuditLogEntry {
    return this.logAdminAction(
      'config_changed',
      {
        configKey,
        oldValue,
        newValue
      },
      userId,
      'success'
    );
  }

  /**
   * Log security event
   */
  public logSecurityEvent(
    action: string,
    userId: string,
    details: Record<string, unknown>,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): AuditLogEntry {
    const status = severity === 'critical' ? 'failure' : 'warning';
    const entry = this.logAdminAction(
      `security_${action}`,
      { ...details, severity },
      userId,
      status as 'success' | 'failure'
    );
    
    // In production, alert on critical events
    if (severity === 'critical') {
      console.error(`[CRITICAL SECURITY EVENT] ${action}:`, details);
    }

    return entry;
  }

  /**
   * Get all audit logs
   */
  public getLogs(limit?: number): AuditLogEntry[] {
    return limit ? this.logs.slice(0, limit) : this.logs;
  }

  /**
   * Get logs filtered by user
   */
  public getLogsByUser(userId: string): AuditLogEntry[] {
    return this.logs.filter(log => log.userId === userId);
  }

  /**
   * Get logs filtered by action
   */
  public getLogsByAction(action: string): AuditLogEntry[] {
    return this.logs.filter(log => log.action === action);
  }

  /**
   * Get logs filtered by date range
   */
  public getLogsByDateRange(startDate: Date, endDate: Date): AuditLogEntry[] {
    const start = startDate.getTime();
    const end = endDate.getTime();
    return this.logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= start && logTime <= end;
    });
  }

  /**
   * Get logs by status
   */
  public getLogsByStatus(status: 'success' | 'failure' | 'warning'): AuditLogEntry[] {
    return this.logs.filter(log => log.status === status);
  }

  /**
   * Search logs by action or details
   */
  public searchLogs(query: string): AuditLogEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.logs.filter(log =>
      log.action.toLowerCase().includes(lowerQuery) ||
      JSON.stringify(log.details).toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Export logs as JSON
   */
  public exportLogsAsJSON(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Export logs as CSV
   */
  public exportLogsAsCSV(): string {
    const headers = ['ID', 'Timestamp', 'Action', 'User ID', 'Status', 'Details'];
    const rows = this.logs.map(log => [
      log.id,
      log.timestamp,
      log.action,
      log.userId,
      log.status,
      JSON.stringify(log.details).replace(/"/g, '""')
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  }

  /**
   * Clear all logs
   */
  public clearAllLogs(): void {
    this.logs = [];
    this.saveToStorage();
    console.warn('All audit logs have been cleared');
  }

  /**
   * Delete logs older than specified days
   */
  public deleteLogsOlderThan(days: number): number {
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
    const initialLength = this.logs.length;
    this.logs = this.logs.filter(log => new Date(log.timestamp).getTime() > cutoffTime);
    this.saveToStorage();
    return initialLength - this.logs.length;
  }

  /**
   * Get log statistics
   */
  public getStatistics() {
    const stats = {
      totalLogs: this.logs.length,
      successCount: this.logs.filter(l => l.status === 'success').length,
      failureCount: this.logs.filter(l => l.status === 'failure').length,
      warningCount: this.logs.filter(l => l.status === 'warning').length,
      uniqueUsers: new Set(this.logs.map(l => l.userId)).size,
      uniqueActions: new Set(this.logs.map(l => l.action)).size,
      dateRange: {
        oldest: this.logs.length > 0 ? this.logs[this.logs.length - 1].timestamp : null,
        newest: this.logs.length > 0 ? this.logs[0].timestamp : null
      },
      actionCounts: {} as Record<string, number>
    };

    // Count actions
    this.logs.forEach(log => {
      stats.actionCounts[log.action] = (stats.actionCounts[log.action] || 0) + 1;
    });

    return stats;
  }

  // Private methods

  private getClientIP(): string {
    // This is a placeholder. In production, get the actual IP from backend
    return '127.0.0.1';
  }

  private enforceMaxLogs(): void {
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
      }
    } catch (error) {
      console.error('Failed to save audit logs to storage:', error);
    }
  }

  private loadLogsFromStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.logs = JSON.parse(stored);
        }
      }
    } catch (error) {
      console.error('Failed to load audit logs from storage:', error);
      this.logs = [];
    }
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger();
