export interface Note {
  id: string;
  title: string;
  rawTranscription: string;
  polishedNote: string;
  timestamp: number;
}

export class RecordingStore {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'tuc-dictation-db';
  private readonly STORE_NAME = 'recordings';
  private readonly HISTORY_STORE = 'history';
  private readonly MAX_AGE_MS = 24 * 60 * 60 * 1000;

  async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, 2);
      req.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(this.HISTORY_STORE)) {
          db.createObjectStore(this.HISTORY_STORE, { keyPath: 'id' }); // Changed to use explicit id
        }
      };
      req.onsuccess = () => { this.db = req.result; resolve(); };
      req.onerror = () => reject(req.error);
    });
  }

  async save(chunks: Blob[], mimeType: string, startedAt: number,
             extra?: { accumulatedTranscript?: string; title?: string }): Promise<void> {
    if (!this.db) return;
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.STORE_NAME, 'readwrite');
      tx.objectStore(this.STORE_NAME).put({
        id: 'current', chunks, mimeType, startedAt, chunkCount: chunks.length,
        accumulatedTranscript: extra?.accumulatedTranscript ?? '',
        title: extra?.title ?? '',
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async load(): Promise<{ chunks: Blob[]; mimeType: string; startedAt: number; accumulatedTranscript?: string; title?: string } | null> {
    if (!this.db) return null;
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.STORE_NAME, 'readonly');
      const req = tx.objectStore(this.STORE_NAME).get('current');
      req.onsuccess = () => {
        const rec = req.result;
        if (!rec) return resolve(null);
        if (Date.now() - rec.startedAt > this.MAX_AGE_MS) {
          this.clear();
          return resolve(null);
        }
        resolve(rec);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) return;
    return new Promise((resolve) => {
      const tx = this.db!.transaction(this.STORE_NAME, 'readwrite');
      tx.objectStore(this.STORE_NAME).delete('current');
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  }

  async saveNote(note: Note): Promise<void> {
    if (!this.db) return;
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.HISTORY_STORE, 'readwrite');
      tx.objectStore(this.HISTORY_STORE).put(note);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async loadHistory(): Promise<Note[]> {
    if (!this.db) return [];
    return new Promise((resolve) => {
      const tx = this.db!.transaction(this.HISTORY_STORE, 'readonly');
      const req = tx.objectStore(this.HISTORY_STORE).getAll();
      req.onsuccess = () => {
        const notes = req.result as Note[];
        notes.sort((a, b) => b.timestamp - a.timestamp);
        resolve(notes);
      };
      req.onerror = () => resolve([]);
    });
  }
}
