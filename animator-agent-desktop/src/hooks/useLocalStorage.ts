import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  const prefixedKey = `animator-${key}`;
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(prefixedKey);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(prefixedKey, JSON.stringify(state));
    } catch (e) {
      console.error(`[useLocalStorage] Failed to persist key "${prefixedKey}":`, e);
    }
  }, [state, prefixedKey]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      if (typeof value === 'function') {
        return (value as (prev: T) => T)(prev);
      }
      return value;
    });
  }, []);

  return [state, setValue];
}
