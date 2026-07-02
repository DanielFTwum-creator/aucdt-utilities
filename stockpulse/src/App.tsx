import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import type { View, IndexData } from './types';

import AuthModal from './components/Auth/AuthModal';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Watchlist from './components/Watchlist';
import Portfolio from './components/Portfolio';
import PaperTrading from './components/PaperTrading';
import AlertsPanel from './components/AlertsPanel';
import AISignals from './components/AISignals';
import NewsPanel from './components/NewsPanel';
import SubscriptionModal from './components/SubscriptionModal';
import AdminPanel from './components/Admin/AdminPanel';
import ErrorBoundary from './components/ErrorBoundary';
import Guide from './components/Guide';

function hashToView(): View {
  const hash = window.location.hash.replace('#/', '').split('?')[0] as View;
  const valid: View[] = ['watchlist', 'portfolio', 'paper', 'alerts', 'ai', 'news', 'screener', 'admin', 'guide'];
  return valid.includes(hash) ? hash : 'watchlist';
}

export default function App() {
  const { user, token, loading: authLoading, error: authError, login, register, logout, upgradeToPremiun, authFetch, loginWithGoogle, clearError } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();

  const [view, setView] = useState<View>(hashToView);
  const [showAuth, setShowAuth] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [alertCount, setAlertCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setView(hashToView());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigateTo = (v: View) => {
    setView(v);
    window.location.hash = `/${v}`;
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    fetch('/api/market/indices')
      .then(r => r.ok ? r.json() : [])
      .then(setIndices)
      .catch(() => {});
    const timer = setInterval(() => {
      fetch('/api/market/indices')
        .then(r => r.ok ? r.json() : [])
        .then(setIndices)
        .catch(() => {});
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) return;
    authFetch('/api/alerts')
      .then(r => r.ok ? r.json() : [])
      .then((data: { active: number }[]) => setAlertCount(data.filter((a) => a.active === 1).length))
      .catch(() => {});
  }, [user, authFetch]);

  const handleUpgrade = async () => {
    const ok = await upgradeToPremiun();
    return ok;
  };

  const sharedProps = { user, authFetch, onLoginClick: () => setShowAuth(true), onUpgrade: () => setShowUpgrade(true) };

  return (
    <div className={`flex h-screen w-full max-w-[100vw] overflow-x-hidden overflow-y-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white`}>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-[240px] md:w-[200px] h-full transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-[240px] md:translate-x-0'}
      `}>
        <Sidebar
          activeView={view}
          onViewChange={navigateTo}
          user={user}
          onLoginClick={() => { setShowAuth(true); setIsMobileMenuOpen(false); }}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar
          user={user}
          indices={indices}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLoginClick={() => setShowAuth(true)}
          onLogout={logout}
          onUpgradeClick={() => setShowUpgrade(true)}
          alertCount={alertCount}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto" role="main" id="main-content">
          {view === 'watchlist' && <Watchlist {...sharedProps} />}
          {view === 'portfolio' && (
            <ErrorBoundary>
              <Portfolio user={user} authFetch={authFetch} onLoginClick={() => setShowAuth(true)} />
            </ErrorBoundary>
          )}
          {view === 'paper' && <PaperTrading user={user} authFetch={authFetch} onLoginClick={() => setShowAuth(true)} />}
          {view === 'alerts' && <AlertsPanel {...sharedProps} />}
          {view === 'ai' && <AISignals {...sharedProps} />}
          {view === 'news' && <NewsPanel />}
          {view === 'screener' && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Stock Screener</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-4">Filter thousands of stocks by price, market cap, sector, P/E, EPS growth, RSI, 52-week range, volume, and dividend yield.</p>
              {user?.tier !== 'premium' ? (
                <button type="button" onClick={() => setShowUpgrade(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm">
                  Upgrade to access Screener
                </button>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 text-sm">Stock screener — coming soon.</p>
              )}
            </div>
          )}
          {view === 'admin' && <AdminPanel user={user} authFetch={authFetch} onLoginClick={() => setShowAuth(true)} />}
          {view === 'guide' && <Guide />}
        </main>
      </div>

      {showAuth && (
        <AuthModal
          onLogin={async (email, password) => {
            const ok = await login(email, password);
            if (ok) setShowAuth(false);
            return ok;
          }}
          onRegister={async (email, password, name) => {
            const ok = await register(email, password, name);
            if (ok) setShowAuth(false);
            return ok;
          }}
          onGoogleLogin={loginWithGoogle}
          onClose={() => { setShowAuth(false); clearError(); }}
          error={authError}
          loading={authLoading}
        />
      )}

      {showUpgrade && (
        <SubscriptionModal
          onClose={() => setShowUpgrade(false)}
          onUpgrade={handleUpgrade}
          user={user}
          loading={authLoading}
        />
      )}
    </div>
  );
}
