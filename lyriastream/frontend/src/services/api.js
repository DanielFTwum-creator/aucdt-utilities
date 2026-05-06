import axios from 'axios';
const BASE = import.meta.env.VITE_API_BASE_URL || '';
// ── Axios instance ────────────────────────────────────────────────────────────
const http = axios.create({
    baseURL: `${BASE}/api/v1`,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, // send httpOnly refresh cookie
});
// ── Auth token injection ──────────────────────────────────────────────────────
export function setAccessToken(token) {
    if (token)
        http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else
        delete http.defaults.headers.common['Authorization'];
}
// ── Auth failure callback (registered by App) ─────────────────────────────────
let _onAuthFailure = null;
export function registerAuthFailureHandler(cb) { _onAuthFailure = cb; }
// ── Refresh interceptor ───────────────────────────────────────────────────────
http.interceptors.response.use((r) => r, async (err) => {
    const cfg = err.config;
    // Skip retry for auth endpoints to avoid infinite loops
    const isAuthEndpoint = cfg?.url?.includes('/auth/');
    if (err.response?.status === 401 && cfg && !cfg._retry && !isAuthEndpoint) {
        cfg._retry = true;
        try {
            const { data } = await http.post('/auth/refresh');
            setAccessToken(data.accessToken);
            cfg.headers['Authorization'] = `Bearer ${data.accessToken}`;
            return http(cfg);
        }
        catch {
            setAccessToken(null);
            _onAuthFailure?.();
        }
    }
    return Promise.reject(err);
});
// ── Auth ──────────────────────────────────────────────────────────────────────
export const auth = {
    register: (email, password, displayName) => http.post('/auth/register', { email, password, displayName }),
    login: (email, password, totpCode) => http.post('/auth/login', { email, password, totpCode }),
    refresh: () => http.post('/auth/refresh'),
    logout: () => { setAccessToken(null); },
};
// ── Generation ────────────────────────────────────────────────────────────────
export const generation = {
    submit: (params) => http.post('/generate', {
        prompt: params.prompt,
        genre: params.genre,
        mood: params.mood,
        tempo_bpm: params.tempoBpm,
        key: params.key,
        duration_sec: params.durationSec,
        seed: params.seed,
        quality_mode: params.qualityMode,
        blend_override: params.blendOverride,
    }),
    preview: (prompt, genre, durationSec = 10) => http.get('/generate/preview', {
        params: { prompt, genre, duration_sec: durationSec },
    }),
    status: (jobId) => http.get(`/jobs/${jobId}/status`),
    /** Returns SSE EventSource URL — caller creates EventSource directly */
    streamUrl: (jobId) => `${BASE}/api/v1/stream/${jobId}`,
    /** Returns chunked audio URL for <audio> element */
    audioStreamUrl: (jobId) => `${BASE}/api/v1/audio/${jobId}/stream`,
    downloadUrl: (jobId, format) => `${BASE}/api/v1/audio/${jobId}/download?format=${format.toLowerCase()}`,
};
// ── Tracks ────────────────────────────────────────────────────────────────────
export const tracks = {
    list: (page = 0, size = 20) => http.get('/tracks', {
        params: { page, size },
    }),
    get: (uuid) => http.get(`/tracks/${uuid}`),
    update: (uuid, patch) => http.patch(`/tracks/${uuid}`, patch),
    delete: (uuid) => http.delete(`/tracks/${uuid}`),
    shareUrl: (uuid) => http.post(`/tracks/${uuid}/share`),
};
// ── Licences ──────────────────────────────────────────────────────────────────
export const licences = {
    get: (uuid) => http.get(`/licences/${uuid}`),
};
// ── Admin ─────────────────────────────────────────────────────────────────────
export const admin = {
    dashboard: () => http.get('/admin/dashboard'),
    models: {
        list: () => http.get('/admin/models'),
        load: (id) => http.post(`/admin/models/${id}/load`),
        unload: (id) => http.post(`/admin/models/${id}/unload`),
    },
    users: {
        list: (page = 0) => http.get('/admin/users', { params: { page } }),
        suspend: (uuid) => http.patch(`/admin/users/${uuid}/suspend`),
        setQuota: (uuid, dailyQuota) => http.patch(`/admin/users/${uuid}/quota`, { dailyQuota }),
    },
    auditLogs: (page = 0) => http.get('/admin/audit-logs', { params: { page } }),
    gpuCosts: () => http.get('/admin/gpu-costs'),
};
