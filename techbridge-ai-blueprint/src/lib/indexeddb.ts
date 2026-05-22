// IndexedDB storage for offline-first data persistence
const DB_NAME = 'techbridge_ai_blueprint';
const DB_VERSION = 1;
const STORE_PROJECTS = 'projects';

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create projects store with indexed fields
      if (!database.objectStoreNames.contains(STORE_PROJECTS)) {
        const projectStore = database.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
        projectStore.createIndex('ownerId', 'ownerId', { unique: false });
        projectStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
  data?: unknown;
}

// Save project
export async function saveProject(project: Project): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_PROJECTS], 'readwrite');
    const store = transaction.objectStore(STORE_PROJECTS);
    const request = store.put({
      ...project,
      updatedAt: Date.now(),
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Get projects by owner
export async function getProjectsByOwner(ownerId: string): Promise<Project[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_PROJECTS], 'readonly');
    const store = transaction.objectStore(STORE_PROJECTS);
    const index = store.index('ownerId');
    const request = index.getAll(ownerId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as Project[]);
  });
}

// Get single project
export async function getProject(id: string): Promise<Project | null> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_PROJECTS], 'readonly');
    const store = transaction.objectStore(STORE_PROJECTS);
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as Project | null);
  });
}

// Delete project
export async function deleteProject(id: string): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_PROJECTS], 'readwrite');
    const store = transaction.objectStore(STORE_PROJECTS);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Clear all projects for owner (useful for logout)
export async function clearProjectsByOwner(ownerId: string): Promise<void> {
  const database = await initDB();
  const projects = await getProjectsByOwner(ownerId);

  for (const project of projects) {
    await deleteProject(project.id);
  }
}

// Clear entire database
export async function clearDB(): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_PROJECTS], 'readwrite');
    const store = transaction.objectStore(STORE_PROJECTS);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
