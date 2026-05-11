
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { LogEntry } from '../types';

export const useAuditLog = () => {
  const [log, setLog] = useLocalStorage<LogEntry[]>('aucdt-audit-log', []);

  const addLogEntry = useCallback((eventType: string, eventData: object) => {
    const newEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      eventType,
      ...eventData
    };
    setLog(prevLog => [...prevLog, newEntry]);
  }, [setLog]);

  return { log, addLogEntry, setLog };
};
