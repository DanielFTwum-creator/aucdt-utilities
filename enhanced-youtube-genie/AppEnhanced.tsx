import React, { useState, useCallback, useEffect } from 'react';
import { InputFormEnhanced } from './components/InputFormEnhanced';
import { OutputDisplay } from './components/OutputDisplay';
import { AdminPanel } from './components/AdminPanel';
import { generateDescription, checkAPIAvailability } from './services/geminiServiceEnhanced';
import type { FormData } from './types';
import { DESCRIPTION_TEMPLATE } from './constants';
import { SparklesIcon, AlertTriangleIcon } from './components/ui/iconsEnhanced';
import { useLogout } from './AuthGate';

// ── Types ─────────────────────────────────────────────────────────
type AppState = 'setup' | 'loading' | 'results' | 'error';
type AppMode  = 'generator' | 'admin';
type Theme    = 'dark' | 'light' | 'high-contrast';

const THEME_KEY = 'youtube-genie-theme';
const FORM_KEY  = 'youtube-genie-form-data';
const STATS_KEY = 'youtube-genie-stats';

const EMPTY_FORM: FormData = {
  songTitle: '',
  artistName: '',
  youtubeHandle: '@',
  genres: '',
  influences: '',
  vibeKeywords: '',
  chorusLine: '',
  lyrics: '',
  credits: '',
};

const DEFAULT_FORM: FormData = {
  songTitle: 'Run Away Riddim Mix',
  artistName: 'Kudjo Twum',
  youtubeHandle: '@KudjoTwum',
  genres: 'Dub Reggae, Dark Pop, Electropop, Dancehall',
  influences: 'Bob Marley and The Wailers, Steel Pulse, Third World',
  vibeKeywords: 'Eerie, driving, anthemic, confessional, raw',
  chorusLine: "Yuh cyan run 'way from yuhself!",
  lyrics: DESCRIPTION_TEMPLATE.split('--- LYRICS --')[1]?.trim() ?? '',
  credits: 'Produced/Mixed/Vocals: Kudjo Twum\nArtwork: Kudjo Twum',
};

// ── Theme helpers ─────────────────────────────────────────────────
function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function cycleTheme(current: Theme): Theme {
  const order: Theme[] = ['dark', 'light', 'high-contrast'];
  return order[(order.indexOf(current) + 1) % order.length];
}

function themeLabel(theme: Theme): string {
  return { dark: 'Dark', light: 'Light', 'high-contrast': 'High Contrast' }[theme];
}

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === 'light') {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" strokeWidth="2" />
        <path strokeLinecap="round" strokeWidth="2"
          d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    );
  }
  if (theme === 'high-contrast') {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" strokeWidth="2" />
        <path strokeLinecap="round" strokeWidth="2" d="M12 3a9 9 0 010 18V3z" fill="currentColor" />
      </svg>
    );
  }
  // dark
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────
const AppEnhanced: React.FC = () => {
  const handleLogout = useLogout();

  // Mode — generator or admin (driven by URL hash)
  const [appMode, setAppMode] = useState<AppMode>(() =>
    window.location.hash === '#/admin' ? 'admin' : 'generator'
  );

  // State machine
  const [appState, setAppState] = useState<AppState>('setup');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form data — restore from localStorage on mount
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(FORM_KEY);
      return saved ? (JSON.parse(saved) as FormData) : DEFAULT_FORM;
    } catch {
      return DEFAULT_FORM;
    }
  });

  // Theme — read from localStorage (also primed by index.html inline script)
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    return stored && ['dark', 'light', 'high-contrast'].includes(stored) ? stored : 'dark';
  });

  // API status
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  useEffect(() => {
    checkAPIAvailability()
      .then(ok => setApiStatus(ok ? 'available' : 'unavailable'))
      .catch(() => setApiStatus('unavailable'));
  }, []);

  // Persist form data with debounce
  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem(FORM_KEY, JSON.stringify(formData));
    }, 800);
    return () => clearTimeout(id);
  }, [formData]);

  // Sync URL hash when mode changes
  useEffect(() => {
    window.location.hash = appMode === 'admin' ? '/admin' : '';
  }, [appMode]);

  // Respond to browser back/forward navigation
  useEffect(() => {
    const onHash = () => setAppMode(window.location.hash === '#/admin' ? 'admin' : 'generator');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const handleThemeToggle = useCallback(() => {
    const next = cycleTheme(theme);
    setTheme(next);
    applyTheme(next);
  }, [theme]);

  // ── Generator actions ──────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    setAppState('loading');
    setGeneratedDescription('');
    setErrorMessage('');

    try {
      const result = await generateDescription(formData);
      setGeneratedDescription(result);
      setAppState('results');

      // Update usage stats
      const raw = localStorage.getItem(STATS_KEY) ?? '{"generations":0,"lastUsed":null}';
      const stats = JSON.parse(raw) as { generations: number; lastUsed: string | null };
      localStorage.setItem(STATS_KEY, JSON.stringify({
        generations: stats.generations + 1,
        lastUsed: new Date().toISOString(),
      }));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unknown error occurred.');
      setAppState('error');
    }
  }, [formData]);

  const handleReset = useCallback(() => {
    setAppState('setup');
    setGeneratedDescription('');
    setErrorMessage('');
  }, []);

  const handleClearForm = useCallback(() => {
    setFormData(EMPTY_FORM);
    setAppState('setup');
    setGeneratedDescription('');
    setErrorMessage('');
    localStorage.removeItem(FORM_KEY);
  }, []);

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen font-sans p-4 sm:p-6 lg:p-8"
      style={{ background: 'var(--tuc-bg)', color: 'var(--tuc-text)' }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <SparklesIcon className="w-8 h-8 flex-shrink-0" style={{ color: 'var(--tuc-gold)' }} />
              <div>
                <h1
                  className="text-2xl sm:text-3xl font-bold tracking-tight"
                  style={{ color: 'var(--tuc-gold)', fontFamily: "'Playfair Display', serif" }}
                >
                  YouTube Description Genie
                </h1>
                <p
                  className="text-xs tracking-widest"
                  style={{ color: 'var(--tuc-text-muted)', fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  TECHBRIDGE UNIVERSITY COLLEGE
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* API status pill */}
              {apiStatus !== 'checking' && (
                <span
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: apiStatus === 'available' ? 'rgba(74,222,128,0.1)' : 'var(--tuc-error-bg)',
                    color:      apiStatus === 'available' ? 'var(--tuc-success)'    : 'var(--tuc-error)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
                  {apiStatus === 'available' ? 'AI ready' : 'AI unavailable'}
                </span>
              )}

              {/* Theme toggle */}
              <button
                onClick={handleThemeToggle}
                title={`Switch to ${themeLabel(cycleTheme(theme))} theme`}
                aria-label={`Theme: ${themeLabel(theme)}. Click to cycle.`}
                className="p-2 rounded-lg transition-colors"
                style={{ background: 'var(--tuc-gold-dim)', color: 'var(--tuc-text-muted)' }}
              >
                <ThemeIcon theme={theme} />
              </button>

              {/* Admin toggle */}
              <button
                onClick={() => setAppMode(m => m === 'admin' ? 'generator' : 'admin')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{
                  background: appMode === 'admin' ? 'var(--tuc-gold)' : 'var(--tuc-gold-dim)',
                  color:      appMode === 'admin' ? 'var(--tuc-bg)'   : 'var(--tuc-text-muted)',
                }}
              >
                {appMode === 'admin' ? '← Back' : 'Admin'}
              </button>

              {/* Sign out */}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{ background: 'var(--tuc-surface-2)', color: 'var(--tuc-text-muted)' }}
              >
                Sign out
              </button>
            </div>
          </div>

          <p className="text-sm" style={{ color: 'var(--tuc-text-muted)' }}>
            Craft the perfect YouTube description for your music with AI.
          </p>

          {/* AI unavailable warning */}
          {apiStatus === 'unavailable' && (
            <div
              className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--tuc-error-bg)', color: 'var(--tuc-error)', border: '1px solid var(--tuc-error)' }}
            >
              <AlertTriangleIcon className="w-4 h-4 flex-shrink-0" />
              AI service unavailable. Check the server connection.
            </div>
          )}
        </header>

        {/* Main content — admin or generator */}
        {appMode === 'admin' ? (
          <AdminPanel onBack={() => setAppMode('generator')} />
        ) : (
          <>
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <InputFormEnhanced
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleGenerate}
                isLoading={appState === 'loading'}
              />
              <OutputDisplay
                description={appState === 'results' ? generatedDescription : ''}
                isLoading={appState === 'loading'}
                error={appState === 'error' ? errorMessage : null}
              />
            </main>

            {/* Post-generation / error actions */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {(appState === 'results' || appState === 'error') && (
                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-md text-sm font-semibold transition-colors"
                  style={{ background: 'var(--tuc-gold)', color: 'var(--tuc-bg)' }}
                >
                  {appState === 'error' ? 'Try Again' : 'Generate Another'}
                </button>
              )}
              <button
                onClick={handleClearForm}
                disabled={appState === 'loading'}
                className="px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-40"
                style={{ border: '1px solid var(--tuc-border)', color: 'var(--tuc-text-muted)' }}
              >
                Clear Form
              </button>
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-xs" style={{ color: 'var(--tuc-text-muted)' }}>
          <p>Powered by Gemini via TUC WMS proxy. Built for TUC by TUC ICT.</p>
        </footer>
      </div>
    </div>
  );
};

export default AppEnhanced;
