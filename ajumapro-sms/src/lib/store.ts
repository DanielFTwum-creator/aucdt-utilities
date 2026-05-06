import { useState, useEffect, useCallback } from 'react';

export interface AuditLog {
  id: string;
  time: string;
  action: string;
  user: string;
  details: string;
}

// ── API helpers ───────────────────────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

// ── Audit Log Store ───────────────────────────────────────────────────────────

export const useAuditStore = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/audit', { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json() as { logs: AuditLog[] };
        setLogs(data.logs);
        return;
      }
    } catch {
      // fall through to localStorage
    }
    // Offline fallback
    const stored = localStorage.getItem('audit_logs');
    if (stored) setLogs(JSON.parse(stored));
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addLog = async (action: string, user: string, details: string) => {
    const optimistic: AuditLog = {
      id: Math.random().toString(36).slice(2, 9),
      time: new Date().toISOString(),
      action,
      user,
      details,
    };

    // Optimistic update
    setLogs(prev => [optimistic, ...prev]);

    try {
      await fetch('/api/audit', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ action, details }),
      });
      // Refresh from server
      fetchLogs();
    } catch {
      // Keep optimistic entry in local state; also persist to localStorage
      setLogs(prev => {
        localStorage.setItem('audit_logs', JSON.stringify(prev));
        return prev;
      });
    }
  };

  return { logs, addLog, refreshLogs: fetchLogs };
};

// ── Auth Store ────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    // Verify token with backend
    fetch('/api/auth/verify', { headers: authHeaders() })
      .then(r => {
        setIsAuthenticated(r.ok);
        if (!r.ok) localStorage.removeItem('auth_token');
      })
      .catch(() => {
        // Backend unreachable — fall back to localStorage flag
        setIsAuthenticated(localStorage.getItem('admin_auth') === 'true');
      });
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@ajumapro.com', password }),
      });

      if (res.ok) {
        const data = await res.json() as { token: string };
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('admin_auth', 'true');
        setIsAuthenticated(true);
        return true;
      }
    } catch {
      // Backend unreachable — fallback to hardcoded check for offline dev
      if (password === 'admin123') {
        localStorage.setItem('admin_auth', 'true');
        setIsAuthenticated(true);
        return true;
      }
    }
    return false;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', headers: authHeaders() });
    } catch {
      // ignore
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};
