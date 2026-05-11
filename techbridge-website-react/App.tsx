
import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Admin from './components/Admin';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import Programmes from './components/Programmes';
import Scholarship from './components/Scholarship';
import TestRunner from './components/TestRunner';
import VirtualAssistant from './components/VirtualAssistant';

type Theme = 'light' | 'dark' | 'high-contrast';
type View = 'home' | 'admin';

const App: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [currentView, setCurrentView] = useState<View>('home');
  const [isTesting, setIsTesting] = useState(false);

  // Initialize theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('tuc_theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
    localStorage.setItem('tuc_theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  }

  const handleStartTests = () => {
    setIsTesting(true);
    setCurrentView('home'); // Switch to home to run visual tests
  }

  const handleTestsComplete = () => {
    setIsTesting(false);
    setCurrentView('admin');
  }

  if (currentView === 'admin' && !isTesting) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <Admin onLogout={() => handleNavigate('home')} onRunTests={handleStartTests} />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 flex flex-col relative transition-colors duration-300">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      {isTesting && <TestRunner onComplete={handleTestsComplete} setTheme={setTheme} />}

      <Header theme={theme} setTheme={setTheme} onNavigate={handleNavigate} />
      
      <main id="main-content" className="flex-grow">
        <HeroSlider />
        <CallToAction />
        <Programmes />
        <Scholarship />
        <section className="py-12 bg-[#f7f7f7] dark:bg-gray-800">
          <div className="container mx-auto px-4">
             <div className="max-w-4xl mx-auto text-center">
                <p className="text-gray-600 dark:text-gray-300 leading-loose text-lg font-light">
                  Our pedagogical mission is to prepare our students for professional excellence in design and entrepreneurship. Our broader ethos is to foster creativity, innovation, inspire leadership, use of technology and educate students to commit to sustainability.
                </p>
             </div>
          </div>
        </section>
      </main>
      <Footer onNavigate={handleNavigate} />

      <VirtualAssistant />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 bg-gray-800 dark:bg-gray-700 text-white p-3 rounded-md shadow-lg hover:bg-opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-tuc-gold"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default App;
