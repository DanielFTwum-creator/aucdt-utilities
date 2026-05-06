import React, { useState, Suspense, lazy } from 'react';

// Always-loaded (small, needed immediately)
import LoginView from './components/LoginView';
import Header from './components/Header';
import HomeView from './components/HomeView';
import FeatureDisabledView from './components/FeatureDisabledView';
import Spinner from './components/Spinner';

// Lazy-loaded views (split into separate chunks)
const ContentGenerator  = lazy(() => import('./components/ContentGenerator'));
const CalendarView      = lazy(() => import('./components/CalendarView'));
const ImageEditor       = lazy(() => import('./components/ImageEditor'));
const PricingPage       = lazy(() => import('./components/PricingPage'));
const AdminDashboard    = lazy(() => import('./components/AdminDashboard'));
const AdminLoginModal   = lazy(() => import('./components/AdminLoginModal'));
const TestingView       = lazy(() => import('./components/TestingView'));
const DemoRunner        = lazy(() => import('./components/DemoRunner'));
const LiveChatView      = lazy(() => import('./components/LiveChatView'));
const DemoVideoModal    = lazy(() => import('./components/DemoVideoModal'));

// Context Imports
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FeatureFlagsProvider, useFeatureFlags } from './contexts/FeatureFlagsContext';
import { PostsProvider, usePosts } from './contexts/PostsContext';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import { BookingProvider } from './contexts/BookingContext';

import { AppView, FeatureFlag } from './types';

const ViewLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Spinner className="w-10 h-10 border-accent-primary" />
  </div>
);

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAdmin();
  return isAdmin ? <>{children}</> : <FeatureDisabledView featureName="Admin Area Access" />;
};

const AppContent: React.FC = () => {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const { isAdmin, isCheckingAdmin } = useAdmin();
  const { featureFlags } = useFeatureFlags();
  const { addPost } = usePosts();

  const [activeView, setActiveView]           = useState<AppView>(AppView.HOME);
  const [isShowingAdminLogin, setAdminLogin]  = useState(false);
  const [isDemoRunning, setDemoRunning]       = useState(false);
  const [isShowingDemoVideo, setDemoVideo]    = useState(false);

  const handleAdminNavigate = () => {
    if (isAdmin) setActiveView(AppView.ADMIN);
    else setAdminLogin(true);
  };

  const enabled = (flag: FeatureFlag) => featureFlags[flag];

  if (isAuthLoading || isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <Spinner className="w-12 h-12 border-accent-primary" />
      </div>
    );
  }
  if (!currentUser) return <LoginView />;

  const renderView = () => {
    if (activeView === AppView.HOME) {
      return <HomeView onNavigate={setActiveView} onStartDemo={() => setDemoVideo(true)} />;
    }
    const inner = (() => {
      switch (activeView) {
        case AppView.GENERATOR:    return enabled(FeatureFlag.AI_CONTENT_GENERATION) ? <ContentGenerator /> : <FeatureDisabledView featureName="AI Content Generation" />;
        case AppView.IMAGE_EDITOR: return enabled(FeatureFlag.IMAGE_EDITING)         ? <ImageEditor />       : <FeatureDisabledView featureName="AI Image Tools" />;
        case AppView.CALENDAR:     return enabled(FeatureFlag.CAMPAIGN_SCHEDULING)   ? <CalendarView />      : <FeatureDisabledView featureName="Campaign Scheduling" />;
        case AppView.LIVE_CHAT:    return enabled(FeatureFlag.LIVE_AUDIO)            ? <LiveChatView />      : <FeatureDisabledView featureName="Live AI Chat" />;
        case AppView.ADMIN:        return <AdminRoute><AdminDashboard onNavigate={setActiveView} /></AdminRoute>;
        case AppView.PRICING:      return <PricingPage />;
        case AppView.TESTING_HOME: return <AdminRoute><TestingView onStartDemo={() => setDemoRunning(true)} /></AdminRoute>;
        default:                   return <HomeView onNavigate={setActiveView} onStartDemo={() => setDemoVideo(true)} />;
      }
    })();
    return <div className="p-4 sm:p-6 lg:p-8">{inner}</div>;
  };

  return (
    <div className="min-h-screen bg-primary text-primary font-sans transition-colors duration-300">
      <Header activeView={activeView} setActiveView={setActiveView} onAdminNavigate={handleAdminNavigate} />
      <main id="main-content">
        <Suspense fallback={<ViewLoader />}>
          {renderView()}
        </Suspense>
      </main>
      <Suspense fallback={null}>
        {isShowingAdminLogin && <AdminLoginModal onClose={() => setAdminLogin(false)} onLoginSuccess={() => { setAdminLogin(false); setActiveView(AppView.ADMIN); }} />}
        {isDemoRunning       && <DemoRunner onClose={() => setDemoRunning(false)} setActiveView={setActiveView} onSchedulePost={addPost} />}
        {isShowingDemoVideo  && <DemoVideoModal onClose={() => setDemoVideo(false)} />}
      </Suspense>
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <BookingProvider>
      <AuthProvider>
        <FeatureFlagsProvider>
          <PostsProvider>
            <AdminProvider>
              <AppContent />
            </AdminProvider>
          </PostsProvider>
        </FeatureFlagsProvider>
      </AuthProvider>
    </BookingProvider>
  </ThemeProvider>
);

export default App;
