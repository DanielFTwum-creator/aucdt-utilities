// ── Types ────────────────────────────────────────────────────────────
export interface Device {
  id: number; mac: string; ip: string; hostname: string | null;
  manufacturer: string | null; label: string | null; status: DeviceStatus;
  inAdr: boolean; firstSeen: string; lastSeen: string;
}
export type DeviceStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'ROGUE';

export interface Alert {
  id: number; alertType: string; severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string; message: string; deviceId: number | null;
  status: 'ACTIVE' | 'ACKNOWLEDGED'; ackNote: string | null;
  ackedBy: string | null; ackedAt: string | null; createdAt: string;
}

export interface InterfaceStatus {
  id: number; name: string; description: string; ip: string;
  capacityMbps: number; utilisationPct: number; bytesIn: number; bytesOut: number;
}

export interface BwSample {
  interfaceName: string; bytesIn: number;
  bytesOut: number; utilisationPct: number; sampledAt: string;
}

export interface BlockEntry {
  id: number; deviceId: number; mac: string; reason: string;
  blockedBy: string; blockedAt: string; active: boolean;
}

export interface AuditEntry {
  id: number; actor: string; actionType: string; targetId: string;
  reason: string; createdAt: string;
}

export interface SystemHealth {
  dbOk: boolean; activeDevices: number; rogueDevices: number;
  activeAlerts: number; wanUtilisationPct: number; lastScan: string;
}

// ── Auth Store (Zustand) ─────────────────────────────────────────────
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('netscan_token'),
  username: localStorage.getItem('netscan_user'),
  login: (token, username) => {
    localStorage.setItem('netscan_token', token);
    localStorage.setItem('netscan_user', username);
    set({ token, username });
  },
  logout: () => {
    localStorage.removeItem('netscan_token');
    localStorage.removeItem('netscan_user');
    set({ token: null, username: null });
  },
}));

// ── API Client ────────────────────────────────────────────────────────
// Phase 1 migration: NetScan API is now served by WMS.
// Dev: the Vite proxy rewrites /api → http://localhost:8080 (WMS dev server).
// Prod: same relative path works because netscan.techbridge.edu.gh proxies /api to wms.techbridge.edu.gh.
const BASE = '/api/v1/netscan';

function getToken() { return localStorage.getItem('netscan_token'); }

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (res.status === 401) { useAuthStore.getState().logout(); throw new Error('Unauthorised'); }
  if (!res.ok) throw new Error(`API error ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  health: () => apiFetch<SystemHealth>('/scan/health'),

  devices: {
    list:     (status?: string, search?: string) => {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (search) params.set('search', search);
      const qs = params.toString();
      return apiFetch<Device[]>(`/devices${qs ? '?' + qs : ''}`);
    },
    get:      (id: number) => apiFetch<Device>(`/devices/${id}`),
    annotate: (id: number, label: string) =>
      apiFetch<void>(`/devices/${id}/annotate`, { method: 'POST', body: JSON.stringify({ label }) }),
  },

  scan: {
    trigger: (subnet?: string) =>
      apiFetch<{ status: string; deviceCount: number }>('/scan/trigger', {
        method: 'POST', body: JSON.stringify({ subnet })
      }),
  },

  bandwidth: {
    interfaces: () => apiFetch<InterfaceStatus[]>('/bandwidth/interfaces'),
    history:    (iface?: string) =>
      apiFetch<BwSample[]>(iface ? `/bandwidth/interfaces/${iface}/history` : '/bandwidth/history'),
  },

  alerts: {
    list: (severity?: string, status?: string) => {
      const params = new URLSearchParams();
      if (severity) params.set('severity', severity);
      if (status)   params.set('status', status);
      const qs = params.toString();
      return apiFetch<Alert[]>(`/alerts${qs ? '?' + qs : ''}`);
    },
    ack: (id: number, note: string) =>
      apiFetch<void>(`/alerts/${id}/ack`, { method: 'POST', body: JSON.stringify({ note }) }),
  },

  control: {
    block:   (targetMac: string, reason: string) =>
      apiFetch<{ blockId: number; script: string; message: string }>('/control/block', {
        method: 'POST', body: JSON.stringify({ targetMac, reason })
      }),
    list:    () => apiFetch<BlockEntry[]>('/control/blocklist'),
    unblock: (id: number) => apiFetch<void>(`/control/unblock/${id}`, { method: 'DELETE' }),
  },

  audit: {
    list: (actionType?: string, actor?: string) => {
      const params = new URLSearchParams();
      if (actionType) params.set('actionType', actionType);
      if (actor)      params.set('actor', actor);
      const qs = params.toString();
      return apiFetch<AuditEntry[]>(`/audit${qs ? '?' + qs : ''}`);
    },
  },
};
