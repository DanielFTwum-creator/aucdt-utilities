import { describe, it, expect, beforeEach } from 'vitest';

const AUDIT_LOG_KEY = 'impact-ventures-audit-logs';

interface AuditEntry { id: string; timestamp: string; action: string; details?: string; }

function getAuditLogs(): AuditEntry[] {
  try { return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]'); } catch { return []; }
}
function appendAuditLog(action: string, details?: string) {
  const logs = getAuditLogs();
  logs.unshift({ id: Date.now().toString() + Math.random(), timestamp: new Date().toISOString(), action, details });
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
}

describe('audit log behaviour', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty', () => {
    expect(getAuditLogs()).toEqual([]);
  });

  it('appends entries newest-first', () => {
    appendAuditLog('FIRST');
    appendAuditLog('SECOND');
    const logs = getAuditLogs();
    expect(logs[0].action).toBe('SECOND');
    expect(logs[1].action).toBe('FIRST');
  });

  it('persists details when provided', () => {
    appendAuditLog('TEST_ACTION', 'with details');
    expect(getAuditLogs()[0].details).toBe('with details');
  });

  it('caps at 200 entries (oldest dropped)', () => {
    for (let i = 0; i < 250; i++) appendAuditLog('ENTRY_' + i);
    const logs = getAuditLogs();
    expect(logs.length).toBe(200);
    expect(logs[0].action).toBe('ENTRY_249');
    expect(logs[199].action).toBe('ENTRY_50');
  });

  it('returns empty array if storage holds invalid JSON', () => {
    localStorage.setItem(AUDIT_LOG_KEY, 'not-json{');
    expect(getAuditLogs()).toEqual([]);
  });
});
