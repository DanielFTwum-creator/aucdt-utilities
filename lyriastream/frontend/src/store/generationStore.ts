/**
 * generationStore — global state for active generation session.
 * Tracks job lifecycle, SSE events, blend recipe live updates, and quota.
 */
import { create } from 'zustand'
import type {
  GenerationParams, GenerationResponse, ComputeMode,
  ProgressEvent, BlendUpdateEvent, DoneEvent, ErrorEvent,
} from '@/types'

type Phase = 'idle' | 'submitting' | 'generating' | 'streaming' | 'complete' | 'error'

interface GenerationState {
  // Current job
  phase:          Phase
  jobId:          string | null
  computeMode:    ComputeMode | null
  blendRecipe:    Record<string, number>
  activeModel:    string | null       // from blend_update events
  progress:       number              // 0–100
  etaMs:          number
  errorMessage:   string | null
  completedTrack: DoneEvent | null

  // Quota
  quotaRemaining: number

  // Actions
  startSubmit:       (params: GenerationParams) => void
  onSubmitSuccess:   (resp: GenerationResponse) => void
  onProgress:        (e: ProgressEvent) => void
  onBlendUpdate:     (e: BlendUpdateEvent) => void
  onDone:            (e: DoneEvent) => void
  onError:           (e: ErrorEvent) => void
  reset:             () => void
  setQuota:          (n: number) => void
}

const INITIAL: Pick<GenerationState,
  'phase'|'jobId'|'computeMode'|'blendRecipe'|'activeModel'|
  'progress'|'etaMs'|'errorMessage'|'completedTrack'
> = {
  phase:          'idle',
  jobId:          null,
  computeMode:    null,
  blendRecipe:    {},
  activeModel:    null,
  progress:       0,
  etaMs:          0,
  errorMessage:   null,
  completedTrack: null,
}

export const useGenerationStore = create<GenerationState>((set) => ({
  ...INITIAL,
  quotaRemaining: 0,

  startSubmit: (_params) => set({ ...INITIAL, phase: 'submitting' }),

  onSubmitSuccess: (resp) => set({
    phase:          'generating',
    jobId:          resp.jobId,
    computeMode:    resp.computeMode,
    blendRecipe:    resp.blendRecipe,
    etaMs:          resp.estimatedTtfbSec * 1000,
    quotaRemaining: resp.quotaRemaining,
  }),

  onProgress: (e) => set({
    progress: e.pct,
    etaMs:    e.etaMs,
    phase:    'generating',
  }),

  onBlendUpdate: (e) => set({
    activeModel: e.activeModel,
    // Update recipe weight to show live contribution
    blendRecipe: (state => ({
      ...state.blendRecipe,
      [e.activeModel]: e.weight,
    }))(useGenerationStore.getState()),
  }),

  onDone: (e) => set({
    phase:          'complete',
    progress:       100,
    completedTrack: e,
    blendRecipe:    e.blendRecipe,
    activeModel:    null,
  }),

  onError: (e) => set({
    phase:        e.fallback ? 'generating' : 'error',
    errorMessage: e.fallback ? null : (e.message ?? `Generation failed (${e.code})`),
  }),

  reset: () => set({ ...INITIAL }),
  setQuota: (n) => set({ quotaRemaining: n }),
}))

// ── Auth store ────────────────────────────────────────────────────────────────
import type { AuthUser } from '@/types'

interface AuthState {
  user:    AuthUser | null
  token:   string | null
  setAuth: (user: AuthUser, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user:  null,
  token: null,
  setAuth:   (user, token) => set({ user, token }),
  clearAuth: ()            => set({ user: null, token: null }),
}))

// ── Theme store ───────────────────────────────────────────────────────────────
import type { Theme } from '@/types'

interface ThemeState {
  theme:    Theme
  setTheme: (t: Theme) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('ls-theme') as Theme) || 'dark',
  setTheme: (theme) => {
    localStorage.setItem('ls-theme', theme)
    // Apply to <html> element
    const root = document.documentElement
    root.className = theme === 'dark' ? 'dark' : theme === 'high-contrast' ? 'dark hc' : ''
    set({ theme })
  },
}))
