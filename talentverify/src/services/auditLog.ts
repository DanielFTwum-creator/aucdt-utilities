export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  userName: string; // Note: Backend joins might be needed to get names if not stored in logs table, but for now we'll rely on what we have or just display IDs if names aren't in DB logs table (DB table has user_id). 
  // Actually, the DB table `audit_logs` has `user_id`. It doesn't store `userName`.
  // The frontend `AuditLogEntry` expects `userName`.
  // The backend `GET /logs` returns raw DB rows: `user_id`, `action`, `entity_type`, `entity_id`, `details`, `timestamp`.
  // We need to map this or update the backend to join with users.
  // For simplicity in this phase, let's update the backend to join users.
  details: string;
}

export const AuditLogService = {
  log: async (action: string, userId: string, userName: string, details: string) => {
    try {
      await fetch('/api/admin/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          userId,
          details: `${userName}: ${details}`, // Storing username in details for now as a quick fix since DB schema is fixed
          entityType: 'system'
        })
      });
    } catch (e) {
      console.error('Failed to log audit event', e);
    }
  },

  getLogs: async (): Promise<AuditLogEntry[]> => {
    try {
      const res = await fetch('/api/admin/logs');
      if (!res.ok) return [];
      const data = await res.json();
      // Map DB rows to frontend interface
      return data.map((row: any) => ({
        id: row.id,
        timestamp: row.timestamp,
        action: row.action,
        userId: row.user_id,
        userName: row.user_name || 'System',
        details: row.details
      }));
    } catch (e) {
      console.error('Failed to fetch logs', e);
      return [];
    }
  }
};
