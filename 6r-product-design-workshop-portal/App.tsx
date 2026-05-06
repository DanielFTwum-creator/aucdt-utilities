import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import OnboardingPage from './pages/Auth/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ModuleOverviewPage from './pages/Modules/ModuleOverviewPage';
import LessonPage from './pages/Modules/LessonPage';
import DesignAuditQuestPage from './pages/Quests/DesignAuditQuestPage';
import PortfolioPage from './pages/PortfolioPage';
import ShowcasePage from './pages/ShowcasePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { ROUTES } from './constants';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background-light dark:bg-background-dark">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`${theme}-theme min-h-screen flex flex-col`}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="*"
          element={isAuthenticated ? (
            user?.onboardingCompleted ? (
              <Routes>
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route path={`${ROUTES.MODULES}/:moduleId`} element={<ModuleOverviewPage />} />
                <Route path={`${ROUTES.MODULES}/:moduleId/lesson/:lessonId`} element={<LessonPage />} />
                <Route path={`${ROUTES.MODULES}/:moduleId/quest/:questId`} element={<DesignAuditQuestPage />} />
                <Route path={ROUTES.PORTFOLIO} element={<PortfolioPage />} />
                <Route path={ROUTES.SHOWCASE} element={<ShowcasePage />} />
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                <Route path={ROUTES.ONBOARDING} element={<Navigate to={ROUTES.DASHBOARD} />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            ) : (
              <Routes>
                <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />
                <Route path="*" element={<Navigate to={ROUTES.ONBOARDING} />} />
              </Routes>
            )
          ) : (
            <Navigate to={ROUTES.LOGIN} />
          )}
        />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <Router>
            <AppContent />
          </Router>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;