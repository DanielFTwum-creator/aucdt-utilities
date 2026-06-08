import { describe, it, expect, beforeEach } from 'vitest';

// Define localStorage Mock on global before importing api
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
global.localStorage = localStorageMock as any;

// Use dynamic import to avoid ESM import hoisting issues
const { useAuthStore } = await import('./lib/api');

describe('Auth Store (Zustand)', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().logout();
  });

  it('should initialize with null token and username', () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.username).toBeNull();
  });

  it('should login and set token and username in state and localStorage', () => {
    useAuthStore.getState().login('test-token', 'daniel.twum');
    
    const state = useAuthStore.getState();
    expect(state.token).toBe('test-token');
    expect(state.username).toBe('daniel.twum');
    expect(localStorage.getItem('netscan_token')).toBe('test-token');
    expect(localStorage.getItem('netscan_user')).toBe('daniel.twum');
  });

  it('should logout and clear state and localStorage', () => {
    useAuthStore.getState().login('test-token', 'daniel.twum');
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.username).toBeNull();
    expect(localStorage.getItem('netscan_token')).toBeNull();
    expect(localStorage.getItem('netscan_user')).toBeNull();
  });
});
