import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    const store = useAuthStore.getState();
    store.logout();
  });

  describe('initial state', () => {
    it('should have isAuthenticated as false', () => {
      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });

    it('should have user as null', () => {
      const { user } = useAuthStore.getState();
      expect(user).toBeNull();
    });
  });

  describe('login', () => {
    it('should set isAuthenticated to true', () => {
      const { login } = useAuthStore.getState();
      login('admin');
      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(true);
    });

    it('should set user with provided username and admin role', () => {
      const { login } = useAuthStore.getState();
      login('testuser');
      const { user } = useAuthStore.getState();
      expect(user).not.toBeNull();
      expect(user?.name).toBe('testuser');
      expect(user?.role).toBe('admin');
    });

    it('should handle multiple logins', () => {
      const { login } = useAuthStore.getState();
      login('user1');
      let { user } = useAuthStore.getState();
      expect(user?.name).toBe('user1');

      login('user2');
      ({ user } = useAuthStore.getState());
      expect(user?.name).toBe('user2');
    });
  });

  describe('logout', () => {
    it('should set isAuthenticated to false', () => {
      const { login, logout } = useAuthStore.getState();
      login('admin');
      logout();
      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });

    it('should set user to null', () => {
      const { login, logout } = useAuthStore.getState();
      login('admin');
      logout();
      const { user } = useAuthStore.getState();
      expect(user).toBeNull();
    });

    it('should be idempotent (can logout twice)', () => {
      const { logout } = useAuthStore.getState();
      logout();
      logout();
      const { isAuthenticated, user } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
      expect(user).toBeNull();
    });
  });

  describe('state updates', () => {
    it('should update store state on login', () => {
      const { login } = useAuthStore.getState();
      login('admin');
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.name).toBe('admin');
    });
  });
});
