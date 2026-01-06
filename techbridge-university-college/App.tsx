
import React, { useState, useEffect, useCallback } from 'react';
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
import ComingSoon from './components/ComingSoon.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'test' | 'academics' | 'coming-soon'>('home');
  const [subRoute, setSubRoute] = useState('');
  const [pageTitle, setPageTitle] = useState('');

  const handleHashChange = useCallback(() => {
    // FAILSAFE NORMALIZATION: 
    // Strips all leading/trailing slashes and hash symbols to get a clean segments string.
    const rawHash = window.location.hash || '#/';
    const pathContent = rawHash.includes('#') ? rawHash.split('#')[1] : '/';
    const cleanPath = pathContent.replace(/^\/+/, '').replace(/\/+$/, '');
    
    console.debug(`[TUC Router] Navigating to: ${cleanPath || 'Home'}`);

    const titleMap: Record<string, string> = {
      'about/story': 'Our Story',
      'about/leadership': 'Institutional Leadership',
      'about/vision': 'Vision & Mission',
      'about/rebrand': 'The Rebrand Journey',
      'about/council': 'Governing Council',
      'about/accreditation': 'Institutional Accreditation',
      'academics/students': 'Student Life & Resources',
      'research': 'Research & Innovation',
    };

    const segments = cleanPath.split('/').filter(Boolean);
    const root = segments[0] || '';

    // Direct Route matching
    if (root === 'admin') {
      setCurrentView('admin');
    } else if (root === 'test') {
      setCurrentView('test');
    } else if (root === 'academics') {
      if (cleanPath === 'academics/students') {
        setCurrentView('coming-soon');
        setPageTitle(titleMap[cleanPath]);
      } else {
        // We pass the clean path to the academics container for internal routing
        setCurrentView('academics');
        setSubRoute(cleanPath);
      }
    } else if (root === 'news-feed' || cleanPath === '') {
      setCurrentView('home');
      if (root === 'news-feed') {
        setTimeout(() => {
          document.getElementById('news-feed-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      // Fallback for unknown or under-construction routes
      setCurrentView('coming-soon');
      setPageTitle(titleMap[cleanPath] || cleanPath.split('/').pop()?.replace(/-/g, ' ') || 'Section Development');
    }
    
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [handleHashChange]);

  const navigateTo = (path: string) => {
    window.location.hash = path;
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col relative font-sans text-gray-900 dark:text-gray-100">
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-tuc-maroon text-white px-4 py-2 rounded font-bold shadow-lg"
        >
          Skip to main content
        </a>

        {currentView === 'admin' ? (
          <Admin onBack={() => navigateTo('/')} />
        ) : currentView === 'test' ? (
          <PuppeteerSelfTest onBack={() => navigateTo('/')} />
        ) : (
          <>
            <Header onChatToggle={() => setIsChatOpen(!isChatOpen)} />
            <main id="main-content" className="flex-grow focus:outline-none" tabIndex={-1}>
              {currentView === 'home' ? (
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
              ) : currentView === 'academics' ? (
                <AcademicsContainer subRoute={subRoute} />
              ) : (
                <ComingSoon title={pageTitle} />
              )}
            </main>
            <Footer 
              onAdminClick={() => navigateTo('admin')} 
              onTestClick={() => navigateTo('test')}
            />
            <AIChatAgent 
              isOpen={isChatOpen} 
              onClose={() => setIsChatOpen(false)} 
              onOpen={() => setIsChatOpen(true)}
            />
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
