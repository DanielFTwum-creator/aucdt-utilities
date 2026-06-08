
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginPage from './auth/LoginPage';
import CallbackPage from './auth/CallbackPage';
import MfaPage from './auth/MfaPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { StepCodesProvider } from './contexts/StepCodesContext';
import HistoryPage from './pages/HistoryPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GlobalStyles from './components/GlobalStyles';
import ClaudeAssistant from './components/ClaudeAssistant';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminPage     = lazy(() => import('./pages/AdminPage'));
const SelfTestPage  = lazy(() => import('./pages/SelfTestPage'));

// Served under /tsapro in production (vite base). BASE_URL is "/tsapro/" there and "/" in dev.
const basename = (((import.meta as any).env?.BASE_URL as string) || '/').replace(/\/$/, '') || '/';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StepCodesProvider>
          <GlobalStyles />
          <BrowserRouter basename={basename}>
            <Main />
          </BrowserRouter>
        </StepCodesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const Main: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen font-sans flex flex-col">
      {/* Accessibility: Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] font-bold rounded-md shadow-lg outline-none border-2 border-white focus:ring-4 focus:ring-blue-400"
      >
        Skip to main content
      </a>

      {user && <Header />}

      <main id="main-content" className="flex-grow p-4 sm:p-6 md:p-8 outline-none" tabIndex={-1}>
        <Suspense fallback={<div className="flex items-center justify-center h-64 text-[var(--color-text-secondary)]">Loading…</div>}>
          <Routes>
            {/* Public auth routes (SSO) */}
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
            <Route path="/auth/callback" element={<CallbackPage />} />
            <Route path="/mfa" element={<MfaPage />} />

            {/* Protected application routes */}
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="/self-test" element={<ProtectedRoute><SelfTestPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {user && <Footer />}
      {user && <ClaudeAssistant />}
    </div>
  );
};

export default App;
