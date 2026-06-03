// ── Auth Store (Zustand) ─────────────────────────────────────────────
import { create } from 'zustand';
export const useAuthStore = create((set) => ({
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
async function apiFetch(path, init) {
    const token = getToken();
    const res = await fetch(`${BASE}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...init?.headers,
        },
    });
    if (res.status === 401) {
        useAuthStore.getState().logout();
        throw new Error('Unauthorised');
    }
    if (!res.ok)
        throw new Error(`API error ${res.status}`);
    if (res.status === 204)
        return undefined;
    return res.json();
}
export const api = {
    login: (username, password) => apiFetch('/auth/login', {
        method: 'POST', body: JSON.stringify({ username, password })
    }),
    health: () => apiFetch('/health'),
    devices: {
        list: (status, search) => apiFetch(`/devices${status || search ? '?' : ''}${status ? `status=${status}` : ''}${status && search ? '&' : ''}${search ? `search=${search}` : ''}`),
        get: (id) => apiFetch(`/devices/${id}`),
        annotate: (id, label) => apiFetch(`/devices/${id}/annotate`, { method: 'POST', body: JSON.stringify({ label }) }),
    },
    scan: {
        trigger: (subnet) => apiFetch('/scan/trigger', {
            method: 'POST', body: JSON.stringify({ subnet })
        }),
    },
    bandwidth: {
        interfaces: () => apiFetch('/bandwidth/interfaces'),
        history: (iface, seconds = 3600) => apiFetch(`/bandwidth/history?${iface ? `iface=${iface}&` : ''}seconds=${seconds}`),
        topConsumers: (n = 10) => apiFetch(`/bandwidth/top-consumers?n=${n}`),
    },
    alerts: {
        list: (severity, status) => apiFetch(`/alerts${severity || status ? '?' : ''}${severity ? `severity=${severity}` : ''}${severity && status ? '&' : ''}${status ? `status=${status}` : ''}`),
        ack: (id, note) => apiFetch(`/alerts/${id}/ack`, { method: 'POST', body: JSON.stringify({ note }) }),
    },
    control: {
        block: (targetMac, reason) => apiFetch('/control/block', {
            method: 'POST', body: JSON.stringify({ targetMac, reason })
        }),
        list: () => apiFetch('/control/block'),
        unblock: (id) => apiFetch(`/control/block/${id}`, { method: 'DELETE' }),
    },
    audit: {
        list: (actionType, actor) => apiFetch(`/audit${actionType || actor ? '?' : ''}${actionType ? `actionType=${actionType}` : ''}${actionType && actor ? '&' : ''}${actor ? `actor=${actor}` : ''}`),
    },
};
