
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { StepCodesProvider } from './contexts/StepCodesContext';
import LoginPage from './pages/LoginPage';
import HistoryPage from './pages/HistoryPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GlobalStyles from './components/GlobalStyles';
import ClaudeAssistant from './components/ClaudeAssistant';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminPage     = lazy(() => import('./pages/AdminPage'));
const SelfTestPage  = lazy(() => import('./pages/SelfTestPage'));

const App: React.FC = () => {
  return (
    // ThemeProvider is placed at the top level to ensure that the selected theme
    // persists across all parts of the application. The theme chosen on the login
    // page is saved to localStorage and is then applied to the dashboard and
    // other pages after successful authentication.
    <ThemeProvider>
      <AuthProvider>
        <StepCodesProvider>
          <GlobalStyles />
          <HashRouter>
            <Main />
          </HashRouter>
        </StepCodesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const Main: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen font-sans flex flex-col">
            {/* Accessibility: Skip to Content Link */}
            <a 
                href="#main-content" 
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] font-bold rounded-md shadow-lg outline-none border-2 border-white focus:ring-4 focus:ring-blue-400"
            >
                Skip to main content
            </a>

            {isAuthenticated && <Header />}
            
            <main id="main-content" className="flex-grow p-4 sm:p-6 md:p-8 outline-none" tabIndex={-1}>
                <Suspense fallback={<div className="flex items-center justify-center h-64 text-[var(--color-text-secondary)]">Loading…</div>}>
                    <Routes>
                        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
                        <Route path="/" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
                        <Route path="/history" element={isAuthenticated ? <HistoryPage /> : <Navigate to="/login" />} />
                        <Route path="/admin" element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" />} />
                        <Route path="/self-test" element={isAuthenticated ? <SelfTestPage /> : <Navigate to="/login" />} />
                        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
                    </Routes>
                </Suspense>
            </main>
            {isAuthenticated && <Footer />}
            {isAuthenticated && <ClaudeAssistant />}
        </div>
    );
}

export default App;
