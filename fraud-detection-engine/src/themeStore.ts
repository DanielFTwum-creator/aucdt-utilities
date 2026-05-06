import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  isHighContrast: boolean;
  setTheme: (mode: ThemeMode) => void;
  cycleTheme: () => void;
}

const STORAGE_KEY = 'fde-theme-mode';

function loadSavedTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'high-contrast') return saved;
  } catch {}
  return 'light';
}

function applyThemeToDOM(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove('dark', 'high-contrast');
  if (mode === 'dark') root.classList.add('dark');
  if (mode === 'high-contrast') root.classList.add('high-contrast');
}

const initialMode = loadSavedTheme();
applyThemeToDOM(initialMode);

export const useThemeStore = create<ThemeState>((set) => ({
  mode: initialMode,
  isDark: initialMode === 'dark',
  isHighContrast: initialMode === 'high-contrast',
  setTheme: (mode: ThemeMode) => {
    localStorage.setItem(STORAGE_KEY, mode);
    applyThemeToDOM(mode);
    set({ mode, isDark: mode === 'dark', isHighContrast: mode === 'high-contrast' });
  },
  cycleTheme: () => set((state) => {
    const order: ThemeMode[] = ['light', 'dark', 'high-contrast'];
    const nextIndex = (order.indexOf(state.mode) + 1) % order.length;
    const next = order[nextIndex];
    localStorage.setItem(STORAGE_KEY, next);
    applyThemeToDOM(next);
    return { mode: next, isDark: next === 'dark', isHighContrast: next === 'high-contrast' };
  }),
}));
