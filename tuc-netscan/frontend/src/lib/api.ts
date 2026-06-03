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
  interfaceId: number; interfaceName: string; bytesIn: number;
  bytesOut: number; utilisationPct: number; sampledAt: string;
}

export interface BlockEntry {
  id: number; deviceId: number; mac: string; reason: string;
  blockedBy: string; blockedAt: string; active: boolean; script: string;
}

export interface AuditEntry {
  id: number; actor: string; actionType: string; targetId: string;
  reason: string; createdAt: string;
}

export interface SystemHealth {
  dbOk: boolean; redisOk: boolean; activeDevices: number; rogueDevices: number;
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
const BASE = '/api/v1';

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
  login: (username: string, password: string) =>
    apiFetch<{ token: string; username: string }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ username, password })
    }),

  health:  () => apiFetch<SystemHealth>('/health'),

  devices: {
    list:     (status?: string, search?: string) =>
      apiFetch<Device[]>(`/devices${status || search ? '?' : ''}${status ? `status=${status}` : ''}${status && search ? '&' : ''}${search ? `search=${search}` : ''}`),
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
    interfaces:   () => apiFetch<InterfaceStatus[]>('/bandwidth/interfaces'),
    history:      (iface?: string, seconds = 3600) =>
      apiFetch<BwSample[]>(`/bandwidth/history?${iface ? `iface=${iface}&` : ''}seconds=${seconds}`),
    topConsumers: (n = 10) => apiFetch<any[]>(`/bandwidth/top-consumers?n=${n}`),
  },

  alerts: {
    list: (severity?: string, status?: string) =>
      apiFetch<Alert[]>(`/alerts${severity || status ? '?' : ''}${severity ? `severity=${severity}` : ''}${severity && status ? '&' : ''}${status ? `status=${status}` : ''}`),
    ack:  (id: number, note: string) =>
      apiFetch<void>(`/alerts/${id}/ack`, { method: 'POST', body: JSON.stringify({ note }) }),
  },

  control: {
    block:   (targetMac: string, reason: string) =>
      apiFetch<{ blockId: number; script: string; message: string }>('/control/block', {
        method: 'POST', body: JSON.stringify({ targetMac, reason })
      }),
    list:    () => apiFetch<BlockEntry[]>('/control/block'),
    unblock: (id: number) => apiFetch<void>(`/control/block/${id}`, { method: 'DELETE' }),
  },

  audit: {
    list: (actionType?: string, actor?: string) =>
      apiFetch<AuditEntry[]>(`/audit${actionType || actor ? '?' : ''}${actionType ? `actionType=${actionType}` : ''}${actionType && actor ? '&' : ''}${actor ? `actor=${actor}` : ''}`),
  },
};
