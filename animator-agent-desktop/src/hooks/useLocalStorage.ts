import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initial: T): [T, (value: T) => void] {
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
    localStorage.setItem(prefixedKey, JSON.stringify(state));
  }, [state, prefixedKey]);

  return [state, setState];
}
