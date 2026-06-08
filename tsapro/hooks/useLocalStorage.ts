// Persistent state hook. Despite the historical name, storage is now backed by
// IndexedDB via the synchronous-cache store (lib/persistentStore), with a one-time
// migration from the old localStorage values. The hook API is unchanged, so
// existing callers (StepCodes, Theme) need no changes.
import React, { useState, useEffect } from 'react';
import { getItem, setItem } from '../lib/persistentStore';

function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => getItem<T>(key, initialValue));

  useEffect(() => {
    setItem(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
