import { useState, useCallback, useEffect } from 'react';
import type { User } from '../types';

const API = '/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('sp_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sp_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveSession = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('sp_token', newToken);
    localStorage.setItem('sp_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('sp_token');
    localStorage.removeItem('sp_user');
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Login failed');
      saveSession(data.token, data.user);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [saveSession]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Registration failed');
      saveSession(data.token, data.user);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [saveSession]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const upgradeToPremiun = useCallback(async () => {
    if (!token) return false;
    setLoading(true);
    try {
      const r = await fetch(`${API}/auth/upgrade`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      if (user) saveSession(data.token, { ...user, tier: 'premium' });
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, user, saveSession]);

  const authFetch = useCallback((url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  }, [token]);

  // Handle Google OAuth callback — backend redirects to /?sp_token=JWT
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spToken = params.get('sp_token');
    const authError = params.get('auth_error');

    if (authError) {
      setError('Google sign-in failed. Please try again.');
      window.history.replaceState(null, '', window.location.pathname + window.location.hash);
      return;
    }

    if (!spToken) return;
    window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    setLoading(true);
    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${spToken}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((u: User) => saveSession(spToken, u))
      .catch(() => setError('Google sign-in failed. Please try again.'))
      .finally(() => setLoading(false));
  }, [saveSession]);

  const loginWithGoogle = useCallback(() => {
    window.location.href = '/api/auth/google';
  }, []);

  return { user, token, loading, error, login, register, logout, upgradeToPremiun, authFetch, loginWithGoogle, clearError: () => setError(null) };
}
