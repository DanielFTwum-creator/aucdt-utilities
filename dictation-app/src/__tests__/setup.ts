import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IndexedDB for JSDOM unit tests
class IDBRequestMock {
  result: any;
  error: any = null;
  onsuccess: any = null;
  onerror: any = null;
  onupgradeneeded: any = null;
}

class IDBTransactionMock {
  oncomplete: any = null;
  onerror: any = null;
  objectStore(name: string) {
    return {
      get: () => {
        const req = new IDBRequestMock();
        setTimeout(() => { if (req.onsuccess) req.onsuccess({ target: { result: null } }); }, 5);
        return req;
      },
      getAll: () => {
        const req = new IDBRequestMock();
        setTimeout(() => { if (req.onsuccess) req.onsuccess({ target: { result: [] } }); }, 5);
        return req;
      },
      put: () => {
        const req = new IDBRequestMock();
        setTimeout(() => { if (req.onsuccess) req.onsuccess({ target: { result: 'key' } }); }, 5);
        return req;
      },
      clear: () => {
        const req = new IDBRequestMock();
        setTimeout(() => { if (req.onsuccess) req.onsuccess({ target: { result: null } }); }, 5);
        return req;
      },
      delete: () => {
        const req = new IDBRequestMock();
        setTimeout(() => { if (req.onsuccess) req.onsuccess({ target: { result: null } }); }, 5);
        return req;
      }
    };
  }
}

class IDBDatabaseMock {
  objectStoreNames = {
    contains: () => false
  };
  createObjectStore() {
    return {
      createIndex: () => {}
    };
  }
  transaction() {
    return new IDBTransactionMock();
  }
  close() {}
}

const mockIndexedDB = {
  open: (name: string, version: number) => {
    const req = new IDBRequestMock();
    req.result = new IDBDatabaseMock();
    setTimeout(() => {
      if (req.onupgradeneeded) {
        req.onupgradeneeded({ target: { result: req.result } });
      }
      if (req.onsuccess) {
        req.onsuccess({ target: { result: req.result } });
      }
    }, 5);
    return req;
  }
};

Object.defineProperty(window, 'indexedDB', {
  value: mockIndexedDB,
  writable: true
});
Object.defineProperty(globalThis, 'indexedDB', {
  value: mockIndexedDB,
  writable: true
});
