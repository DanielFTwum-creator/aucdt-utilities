import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useThemeStore } from './themeStore';

describe('themeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'high-contrast');
    vi.clearAllMocks();
    // Reset store to default
    const store = useThemeStore.getState();
    store.setTheme('light');
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initial state', () => {
    it('should default to light theme', () => {
      const { mode } = useThemeStore.getState();
      expect(mode).toBe('light');
    });

    it('should set isDark to false for light theme', () => {
      const { isDark } = useThemeStore.getState();
      expect(isDark).toBe(false);
    });

    it('should set isHighContrast to false for light theme', () => {
      const { isHighContrast } = useThemeStore.getState();
      expect(isHighContrast).toBe(false);
    });
  });

  describe('setTheme', () => {
    it('should change mode to dark', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('dark');
      const { mode } = useThemeStore.getState();
      expect(mode).toBe('dark');
    });

    it('should update isDark when setting dark theme', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('dark');
      const { isDark } = useThemeStore.getState();
      expect(isDark).toBe(true);
    });

    it('should update isHighContrast when setting high-contrast theme', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('high-contrast');
      const { isHighContrast } = useThemeStore.getState();
      expect(isHighContrast).toBe(true);
    });

    it('should set isDark to false when switching to light', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('dark');
      setTheme('light');
      const { isDark } = useThemeStore.getState();
      expect(isDark).toBe(false);
    });

    it('should persist theme to localStorage', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('dark');
      const saved = localStorage.getItem('fde-theme-mode');
      expect(saved).toBe('dark');
    });

    it('should apply theme class to document root', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove previous theme classes when switching', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      setTheme('high-contrast');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
    });
  });

  describe('cycleTheme', () => {
    it('should cycle from light to dark', () => {
      const { cycleTheme } = useThemeStore.getState();
      cycleTheme();
      const { mode } = useThemeStore.getState();
      expect(mode).toBe('dark');
    });

    it('should cycle from dark to high-contrast', () => {
      const { setTheme, cycleTheme } = useThemeStore.getState();
      setTheme('dark');
      cycleTheme();
      const { mode } = useThemeStore.getState();
      expect(mode).toBe('high-contrast');
    });

    it('should cycle from high-contrast back to light', () => {
      const { setTheme, cycleTheme } = useThemeStore.getState();
      setTheme('high-contrast');
      cycleTheme();
      const { mode } = useThemeStore.getState();
      expect(mode).toBe('light');
    });

    it('should update isDark flag during cycle', () => {
      const { cycleTheme } = useThemeStore.getState();
      cycleTheme(); // light -> dark
      let { isDark } = useThemeStore.getState();
      expect(isDark).toBe(true);

      cycleTheme(); // dark -> high-contrast
      ({ isDark } = useThemeStore.getState());
      expect(isDark).toBe(false);
    });

    it('should update isHighContrast flag during cycle', () => {
      const { cycleTheme } = useThemeStore.getState();
      cycleTheme(); // light -> dark
      cycleTheme(); // dark -> high-contrast
      const { isHighContrast } = useThemeStore.getState();
      expect(isHighContrast).toBe(true);
    });

    it('should persist cycled theme to localStorage', () => {
      const { cycleTheme } = useThemeStore.getState();
      cycleTheme();
      const saved = localStorage.getItem('fde-theme-mode');
      expect(saved).toBe('dark');
    });

    it('should apply cycled theme to document', () => {
      const { cycleTheme } = useThemeStore.getState();
      cycleTheme(); // light -> dark
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      cycleTheme(); // dark -> high-contrast
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
    });

    it('should handle rapid cycling', () => {
      const { cycleTheme } = useThemeStore.getState();
      cycleTheme();
      cycleTheme();
      cycleTheme();
      const { mode } = useThemeStore.getState();
      expect(mode).toBe('light'); // Back to start after 3 cycles
    });
  });

  describe('state updates', () => {
    it('should update store state on theme change', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('dark');
      const state = useThemeStore.getState();
      expect(state.mode).toBe('dark');
      expect(state.isDark).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle setting same theme twice', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('dark');
      setTheme('dark');
      const { mode } = useThemeStore.getState();
      expect(mode).toBe('dark');
    });

    it('should handle setting theme after localStorage has been cleared', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('dark');
      localStorage.clear();
      setTheme('light');
      // Should still work without throwing
      const { mode } = useThemeStore.getState();
      expect(mode).toBe('light');
    });
  });
});
