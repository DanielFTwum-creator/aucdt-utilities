import { db } from "./db";

export function logAudit(action: string, details: string, user: string = "admin") {
  const stmt = db.prepare("INSERT INTO audit_logs (action, details, user, timestamp) VALUES (?, ?, ?, ?)");
  stmt.run(action, details, user, new Date().toISOString());
}

export function getAuditLogs() {
  return db.prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100").all();
}
