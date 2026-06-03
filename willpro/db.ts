import { FormData } from './App';

const DB_NAME = 'willpro_db';
const STORE_NAME = 'drafts';
export interface Draft {
  id: string;
  step: number;
  formData: FormData;
  updatedAt: string;
  filename?: string;
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

export async function saveDraft(id: string, step: number, formData: FormData, filename?: string): Promise<void> {
  const db = await openDatabase();
  const store = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME);
  const draft: Draft = {
    id,
    step,
    formData,
    updatedAt: new Date().toISOString(),
    filename,
  };

  return new Promise((resolve, reject) => {
    const request = store.put(draft);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function loadDraft(id: string): Promise<Draft | null> {
  const db = await openDatabase();
  const store = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

export async function listDrafts(): Promise<Draft[]> {
  const db = await openDatabase();
  const store = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME);
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const drafts = (request.result as Draft[]) || [];
      drafts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      resolve(drafts);
    };
  });
}

export async function getMostRecentDraft(): Promise<Draft | null> {
  const drafts = await listDrafts();
  return drafts.length > 0 ? drafts[0] : null;
}

export async function deleteDraft(id: string): Promise<void> {
  const db = await openDatabase();
  const store = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
