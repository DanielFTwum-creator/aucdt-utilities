import { FormData } from './App';

const DB_NAME = 'willpro_db';
const STORE_NAME = 'drafts';
const DRAFT_ID = 'current';

interface Draft {
  id: string;
  step: number;
  formData: FormData;
  updatedAt: string;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function saveDraft(step: number, formData: FormData): Promise<void> {
  const db = await openDatabase();
  const store = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME);
  const draft: Draft = {
    id: DRAFT_ID,
    step,
    formData,
    updatedAt: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const request = store.put(draft);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function loadDraft(): Promise<Draft | null> {
  const db = await openDatabase();
  const store = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.get(DRAFT_ID);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

export async function deleteDraft(): Promise<void> {
  const db = await openDatabase();
  const store = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.delete(DRAFT_ID);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
