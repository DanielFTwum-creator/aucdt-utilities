import { createContext, useContext, useCallback, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  user: string;
  details: string;
  category: 'auth' | 'project' | 'track' | 'export' | 'admin' | 'system';
}

interface AuditContextType {
  entries: AuditEntry[];
  log: (action: string, details: string, category: AuditEntry['category']) => void;
  clear: () => void;
}

const MAX_ENTRIES = 500;

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export function AuditProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useLocalStorage<AuditEntry[]>('audit-log', []);

  const log = useCallback((action: string, details: string, category: AuditEntry['category']) => {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      action,
      user: 'admin',
      details,
      category,
    };
    setEntries((prev: AuditEntry[]) => [entry, ...prev].slice(0, MAX_ENTRIES));
  }, [setEntries]);

  const clear = useCallback(() => {
    setEntries([]);
  }, [setEntries]);

  return (
    <AuditContext.Provider value={{ entries, log, clear }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error('useAudit must be used within AuditProvider');
  }
  return context;
}
