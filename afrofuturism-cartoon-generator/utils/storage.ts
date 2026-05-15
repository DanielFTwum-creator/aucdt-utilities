import { LibraryEntry, AuditEntry } from '../types';

const LIBRARY_KEY = 'afrofuturism-cg-library';
const AUDIT_KEY = 'afrofuturism-cg-audit';

export function getLibrary(): LibraryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LIBRARY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveToLibrary(entry: LibraryEntry): void {
  const lib = getLibrary();
  lib.unshift(entry);
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(lib.slice(0, 200)));
}

export function deleteFromLibrary(id: string): void {
  const lib = getLibrary().filter(e => e.id !== id);
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(lib));
}

export function getAuditLogs(): AuditEntry[] {
  try {
    return JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
  } catch {
    return [];
  }
}

export function appendAuditLog(action: string, details?: string): void {
  const logs = getAuditLogs();
  logs.unshift({ id: Date.now().toString(), timestamp: new Date().toISOString(), action, details });
  localStorage.setItem(AUDIT_KEY, JSON.stringify(logs.slice(0, 500)));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function clearLibrary(): void {
  localStorage.removeItem(LIBRARY_KEY);
}
