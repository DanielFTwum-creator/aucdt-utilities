/**
 * generationStore — global state for active generation session.
 * Tracks job lifecycle, SSE events, blend recipe live updates, and quota.
 */
import { create } from 'zustand';
const INITIAL = {
    phase: 'idle',
    jobId: null,
    computeMode: null,
    blendRecipe: {},
    activeModel: null,
    progress: 0,
    etaMs: 0,
    errorMessage: null,
    completedTrack: null,
};
export const useGenerationStore = create((set) => ({
    ...INITIAL,
    quotaRemaining: 0,
    startSubmit: (_params) => set({ ...INITIAL, phase: 'submitting' }),
    onSubmitSuccess: (resp) => set({
        phase: 'generating',
        jobId: resp.jobId,
        computeMode: resp.computeMode,
        blendRecipe: resp.blendRecipe,
        etaMs: resp.estimatedTtfbSec * 1000,
        quotaRemaining: resp.quotaRemaining,
    }),
    onProgress: (e) => set({
        progress: e.pct,
        etaMs: e.etaMs,
        phase: 'generating',
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
        phase: 'complete',
        progress: 100,
        completedTrack: e,
        blendRecipe: e.blendRecipe,
        activeModel: null,
    }),
    onError: (e) => set({
        phase: e.fallback ? 'generating' : 'error',
        errorMessage: e.fallback ? null : (e.message ?? `Generation failed (${e.code})`),
    }),
    reset: () => set({ ...INITIAL }),
    setQuota: (n) => set({ quotaRemaining: n }),
}));
export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    setAuth: (user, token) => set({ user, token }),
    clearAuth: () => set({ user: null, token: null }),
}));
export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('ls-theme') || 'dark',
    setTheme: (theme) => {
        localStorage.setItem('ls-theme', theme);
        // Apply to <html> element
        const root = document.documentElement;
        root.className = theme === 'dark' ? 'dark' : theme === 'high-contrast' ? 'dark hc' : '';
        set({ theme });
    },
}));
