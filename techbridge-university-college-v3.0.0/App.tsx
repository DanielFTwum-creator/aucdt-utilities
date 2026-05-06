
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.tsx';
import HeroSlider from './components/HeroSlider.tsx';
import CTASection from './components/CTASection.tsx';
import Programmes from './components/Programmes.tsx';
import Scholarship from './components/Scholarship.tsx';
import SecondaryCTA from './components/SecondaryCTA.tsx';
import Accreditation from './components/Accreditation.tsx';
import Footer from './components/Footer.tsx';
import AIChatAgent from './components/AIChatAgent.tsx';
import NewsFeed from './components/NewsFeed.tsx';
import Admin from './components/Admin.tsx';
import PuppeteerSelfTest from './components/PuppeteerSelfTest.tsx';
import AcademicsContainer from './components/Academics/AcademicsContainer.tsx';
import VisionMission from './components/About/VisionMission.tsx';
import GoverningCouncil from './components/About/GoverningCouncil.tsx';
import Resources from './components/Resources.tsx';
import ComingSoon from './components/ComingSoon.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { UIProvider } from './context/UIContext.tsx';

// Extend window interface for Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// ScrollToTop component to handle view transitions and Analytics tracking
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    // Handle special scrolling for the news-feed route which shares the home view
    if (pathname === '/news-feed') {
      // Small delay to ensure DOM is ready if navigating from another page
      setTimeout(() => {
        const newsSection = document.getElementById('news-feed-section');
        if (newsSection) {
          newsSection.scrollIntoView({ behavior: 'smooth' });
        } else {
           window.scrollTo(0, 0);
        }
      }, 100);
    } else {
      // Default behavior for other routes
      window.scrollTo(0, 0);
    }

    // Google Analytics Page View Tracking
    // Ensures internal SPA navigation is tracked as page views
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-FKXTELQ71R', {
        page_path: pathname,
      });
    }
  }, [pathname]);
  
  return null;
};

const HomeView = () => (
  <>
    <HeroSlider />
    <CTASection />
    <Programmes />
    <Scholarship />
    <div id="news-feed-section">
      <NewsFeed />
    </div>
    <SecondaryCTA />
    <Accreditation />
  </>
);

// Fix: Explicitly type AppLayout with React.FC<{ children: React.ReactNode }> to resolve children prop issues
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isTest = location.pathname.startsWith('/test');

  if (isAdmin) return <Admin onBack={() => window.location.hash = '#/'} />;
  if (isTest) return <PuppeteerSelfTest onBack={() => window.location.hash = '#/'} />;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col relative font-sans text-gray-900 dark:text-gray-100">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main-content" className="flex-grow focus:outline-none overflow-hidden" tabIndex={-1}>
        <div className="animate-fade-in-up">
          {children}
        </div>
      </main>
      <Footer 
        onAdminClick={() => window.location.hash = '#/admin'} 
        onTestClick={() => window.location.hash = '#/test'}
      />
      <AIChatAgent />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UIProvider>
        <HashRouter>
          <ScrollToTop />
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/about/vision" element={<VisionMission />} />
              <Route path="/about/council" element={<GoverningCouncil />} />
              <Route path="/academics/*" element={<AcademicsContainer subRoute="" />} />
              <Route path="/news-feed" element={<HomeView />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/about/story" element={<ComingSoon title="Our Story" />} />
              <Route path="/about/leadership" element={<ComingSoon title="Institutional Leadership" />} />
              <Route path="/about/rebrand" element={<ComingSoon title="The Rebrand Journey" />} />
              <Route path="/about/accreditation" element={<ComingSoon title="Institutional Accreditation" />} />
              <Route path="/research" element={<ComingSoon title="Research & Innovation" />} />
              <Route path="*" element={<ComingSoon title="Section Development" />} />
            </Routes>
          </AppLayout>
        </HashRouter>
      </UIProvider>
    </ThemeProvider>
  );
};

export default App;
