/**
 * Audit Logger Service
 * 
 * Tracks and logs user actions for security and compliance:
 * - Login/logout events
 * - Data exports
 * - Filter changes
 * - Admin actions
 * - System settings changes
 * 
 * Logs stored in localStorage (production: backend database)
 */

class AuditLogger {
  constructor() {
    this.STORAGE_KEY = 'audit_logs';
    this.MAX_LOGS = 1000; // Maximum logs to keep
  }

  /**
   * Log an event
   */
  log(action, details = {}, severity = 'info') {
    const logEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      action,
      details,
      severity, // 'info' | 'warning' | 'error' | 'critical'
      user: this.getCurrentUser(),
      sessionId: this.getSessionId(),
      ipAddress: 'N/A', // Future: Get from backend
      userAgent: navigator.userAgent
    };

    // Store log
    this.storeLog(logEntry);

    // Console log for development
    const emoji = this.getSeverityEmoji(severity);
    console.log(`${emoji} [AUDIT] ${action}:`, details);

    return logEntry;
  }

  /**
   * Log authentication event
   */
  logAuth(action, username, success) {
    return this.log(
      action,
      { username, success, timestamp: new Date().toISOString() },
      success ? 'info' : 'warning'
    );
  }

  /**
   * Log data export
   */
  logExport(format, recordCount, filters = {}) {
    return this.log(
      'DATA_EXPORT',
      {
        format,
        recordCount,
        filters,
        timestamp: new Date().toISOString()
      },
      'info'
    );
  }

  /**
   * Log filter change
   */
  logFilterChange(filterType, value) {
    return this.log(
      'FILTER_CHANGE',
      {
        filterType,
        value,
        timestamp: new Date().toISOString()
      },
      'info'
    );
  }

  /**
   * Log data access
   */
  logDataAccess(dataType, action) {
    return this.log(
      'DATA_ACCESS',
      {
        dataType,
        action,
        timestamp: new Date().toISOString()
      },
      'info'
    );
  }

  /**
   * Log admin action
   */
  logAdminAction(action, details) {
    return this.log(
      'ADMIN_ACTION',
      {
        action,
        ...details,
        timestamp: new Date().toISOString()
      },
      'warning'
    );
  }

  /**
   * Log error
   */
  logError(errorType, errorMessage, stackTrace) {
    return this.log(
      'ERROR',
      {
        errorType,
        errorMessage,
        stackTrace,
        timestamp: new Date().toISOString()
      },
      'error'
    );
  }

  /**
   * Log security event
   */
  logSecurity(event, details) {
    return this.log(
      'SECURITY_EVENT',
      {
        event,
        ...details,
        timestamp: new Date().toISOString()
      },
      'critical'
    );
  }

  /**
   * Get all logs
   */
  getLogs(filters = {}) {
    const logs = this.getAllLogs();
    
    let filtered = logs;

    // Filter by severity
    if (filters.severity) {
      filtered = filtered.filter(log => log.severity === filters.severity);
    }

    // Filter by action
    if (filters.action) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(filters.action.toLowerCase())
      );
    }

    // Filter by user
    if (filters.user) {
      filtered = filtered.filter(log => 
        log.user?.toLowerCase().includes(filters.user.toLowerCase())
      );
    }

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) <= new Date(filters.endDate)
      );
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return filtered;
  }

  /**
   * Get logs by action type
   */
  getLogsByAction(action) {
    return this.getLogs({ action });
  }

  /**
   * Get logs by severity
   */
  getLogsBySeverity(severity) {
    return this.getLogs({ severity });
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count = 100) {
    const logs = this.getAllLogs();
    return logs.slice(0, count);
  }

  /**
   * Get log statistics
   */
  getStatistics() {
    const logs = this.getAllLogs();
    
    const stats = {
      total: logs.length,
      bySeverity: {
        info: 0,
        warning: 0,
        error: 0,
        critical: 0
      },
      byAction: {},
      recentActivity: {
        last24Hours: 0,
        lastWeek: 0,
        lastMonth: 0
      }
    };

    const now = new Date();
    const day = 24 * 60 * 60 * 1000;

    logs.forEach(log => {
      // Count by severity
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;

      // Count by action
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;

      // Count recent activity
      const logTime = new Date(log.timestamp);
      const timeDiff = now - logTime;

      if (timeDiff < day) stats.recentActivity.last24Hours++;
      if (timeDiff < 7 * day) stats.recentActivity.lastWeek++;
      if (timeDiff < 30 * day) stats.recentActivity.lastMonth++;
    });

    return stats;
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('🗑️ All audit logs cleared');
  }

  /**
   * Clear old logs (keep last N)
   */
  clearOldLogs(keepCount = 500) {
    const logs = this.getAllLogs();
    if (logs.length > keepCount) {
      const logsToKeep = logs.slice(0, keepCount);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logsToKeep));
      console.log(`🗑️ Cleared ${logs.length - keepCount} old audit logs`);
    }
  }

  /**
   * Export logs to CSV
   */
  exportLogs() {
    const logs = this.getAllLogs();
    
    let csv = 'Timestamp,Action,Severity,User,Details\n';
    
    logs.forEach(log => {
      const details = JSON.stringify(log.details).replace(/"/g, '""');
      csv += `"${log.timestamp}","${log.action}","${log.severity}","${log.user}","${details}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    console.log('📥 Audit logs exported to CSV');
  }

  // ==================== Private Methods ====================

  /**
   * Store log entry
   */
  storeLog(logEntry) {
    try {
      const logs = this.getAllLogs();
      logs.unshift(logEntry); // Add to beginning

      // Keep only MAX_LOGS
      if (logs.length > this.MAX_LOGS) {
        logs.length = this.MAX_LOGS;
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to store audit log:', error);
    }
  }

  /**
   * Get all logs from storage
   */
  getAllLogs() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to retrieve audit logs:', error);
      return [];
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    // Future: Get from auth context
    return localStorage.getItem('current_user') || 'admin';
  }

  /**
   * Get or create session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get emoji for severity level
   */
  getSeverityEmoji(severity) {
    const emojis = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      critical: '🚨'
    };
    return emojis[severity] || 'ℹ️';
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger();
export default auditLogger;
