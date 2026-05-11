import axios, { type AxiosInstance, type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type {
  GenerationParams, GenerationResponse, BlendRecipePreview,
  Track, LicenceCertificate, LoginResponse, ModelInfo,
} from '@/types'

const BASE = import.meta.env.VITE_API_BASE_URL || ''

// ── Axios instance ────────────────────────────────────────────────────────────
const http: AxiosInstance = axios.create({
  baseURL: `${BASE}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,   // send httpOnly refresh cookie
})

// ── Auth token injection ──────────────────────────────────────────────────────
export function setAccessToken(token: string | null) {
  if (token) http.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else        delete http.defaults.headers.common['Authorization']
}

// ── Auth failure callback (registered by App) ─────────────────────────────────
let _onAuthFailure: (() => void) | null = null
export function registerAuthFailureHandler(cb: () => void) { _onAuthFailure = cb }

// ── Refresh interceptor ───────────────────────────────────────────────────────
http.interceptors.response.use(
  (r: AxiosResponse) => r,
  async (err: AxiosError) => {
    const cfg = err.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    // Skip retry for auth endpoints to avoid infinite loops
    const isAuthEndpoint = cfg?.url?.includes('/auth/')
    if (err.response?.status === 401 && cfg && !cfg._retry && !isAuthEndpoint) {
      cfg._retry = true
      try {
        const { data } = await http.post<LoginResponse>('/auth/refresh')
        setAccessToken(data.accessToken)
        cfg.headers['Authorization'] = `Bearer ${data.accessToken}`
        return http(cfg)
      } catch {
        setAccessToken(null)
        _onAuthFailure?.()
      }
    }
    return Promise.reject(err)
  },
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const auth = {
  register: (email: string, password: string, displayName?: string) =>
    http.post('/auth/register', { email, password, displayName }),

  login: (email: string, password: string, totpCode?: string) =>
    http.post<LoginResponse>('/auth/login', { email, password, totpCode }),

  refresh: () =>
    http.post<{ accessToken: string }>('/auth/refresh'),

  logout: () => { setAccessToken(null) },
}

// ── Generation ────────────────────────────────────────────────────────────────
export const generation = {
  submit: (params: GenerationParams) =>
    http.post<GenerationResponse>('/generate', {
      prompt:        params.prompt,
      genre:         params.genre,
      mood:          params.mood,
      tempo_bpm:     params.tempoBpm,
      key:           params.key,
      duration_sec:  params.durationSec,
      seed:          params.seed,
      quality_mode:  params.qualityMode,
      blend_override: params.blendOverride,
    }),

  preview: (prompt: string, genre?: string, durationSec = 10) =>
    http.get<BlendRecipePreview>('/generate/preview', {
      params: { prompt, genre, duration_sec: durationSec },
    }),

  status: (jobId: string) =>
    http.get(`/jobs/${jobId}/status`),

  /** Returns SSE EventSource URL — caller creates EventSource directly */
  streamUrl: (jobId: string) => `${BASE}/api/v1/stream/${jobId}`,

  /** Returns chunked audio URL for <audio> element */
  audioStreamUrl: (jobId: string) => `${BASE}/api/v1/audio/${jobId}/stream`,

  downloadUrl: (jobId: string, format: string) =>
    `${BASE}/api/v1/audio/${jobId}/download?format=${format.toLowerCase()}`,
}

// ── Tracks ────────────────────────────────────────────────────────────────────
export const tracks = {
  list: (page = 0, size = 20) =>
    http.get<{ content: Track[]; totalElements: number }>('/tracks', {
      params: { page, size },
    }),

  get: (uuid: string) =>
    http.get<Track>(`/tracks/${uuid}`),

  update: (uuid: string, patch: Partial<Pick<Track, 'title' | 'isPublic'>>) =>
    http.patch<Track>(`/tracks/${uuid}`, patch),

  delete: (uuid: string) =>
    http.delete(`/tracks/${uuid}`),

  shareUrl: (uuid: string) =>
    http.post<{ url: string; expiresAt: string }>(`/tracks/${uuid}/share`),
}

// ── Licences ──────────────────────────────────────────────────────────────────
export const licences = {
  get: (uuid: string) =>
    http.get<LicenceCertificate>(`/licences/${uuid}`),
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export const admin = {
  dashboard: () =>
    http.get('/admin/dashboard'),

  models: {
    list: () => http.get<ModelInfo[]>('/admin/models'),
    load: (id: string) => http.post(`/admin/models/${id}/load`),
    unload: (id: string) => http.post(`/admin/models/${id}/unload`),
  },

  users: {
    list: (page = 0) => http.get('/admin/users', { params: { page } }),
    suspend: (uuid: string) => http.patch(`/admin/users/${uuid}/suspend`),
    setQuota: (uuid: string, dailyQuota: number) =>
      http.patch(`/admin/users/${uuid}/quota`, { dailyQuota }),
  },

  auditLogs: (page = 0) =>
    http.get('/admin/audit-logs', { params: { page } }),

  gpuCosts: () =>
    http.get('/admin/gpu-costs'),
}
