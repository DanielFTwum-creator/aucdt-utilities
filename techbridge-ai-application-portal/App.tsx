import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryFilters from './components/CategoryFilters';
import AppGrid from './components/AppGrid';
import Footer from './components/Footer';
import Pagination from './components/Pagination';
import FeatureBand from './components/FeatureBand';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import TableOfContents from './components/TableOfContents';
import { LoginView } from './components/LoginView';
import { useAuth } from './contexts/AuthContext';
import { AI_APPLICATIONS, CATEGORIES } from './constants';
import { Category, Theme } from './types';
import { logAction } from './services/auditService';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function App() {
  const { isAuthenticated, logout: authLogout } = useAuth();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All Apps'>('All Apps');
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('techbridge_theme') as Theme | null;
    if (savedTheme) return savedTheme;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
      return sessionStorage.getItem('techbridge_auth') === 'true';
  });
  const [showAdmin, setShowAdmin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  
  const APPS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [showIndex, setShowIndex] = useState(false);

  const handleLogout = () => {
    authLogout();
    setShowAdmin(false);
    logAction('Admin logged out');
  };

  // Session Timeout Logic
  useEffect(() => {
      let timeoutId: NodeJS.Timeout;

      const resetTimer = () => {
          if (isAuthenticated) {
              clearTimeout(timeoutId);
              timeoutId = setTimeout(() => {
                  handleLogout();
                  alert('Session timed out due to inactivity.');
              }, SESSION_TIMEOUT);
          }
      };

      if (isAuthenticated) {
          window.addEventListener('mousemove', resetTimer);
          window.addEventListener('keydown', resetTimer);
          window.addEventListener('click', resetTimer);
          resetTimer(); // Start timer
      }

      return () => {
          clearTimeout(timeoutId);
          window.removeEventListener('mousemove', resetTimer);
          window.removeEventListener('keydown', resetTimer);
          window.removeEventListener('click', resetTimer);
      };
  }, [isAuthenticated]);

  // Lockout Timer Logic
  useEffect(() => {
      if (lockoutUntil) {
          const remaining = lockoutUntil - Date.now();
          if (remaining > 0) {
              const timer = setTimeout(() => {
                  setLockoutUntil(null);
                  setLoginAttempts(0);
              }, remaining);
              return () => clearTimeout(timer);
          } else {
              // eslint-disable-next-line react-hooks/set-state-in-effect
              setLockoutUntil(null);
              setLoginAttempts(0);
          }
      }
  }, [lockoutUntil]);

  // Apply theme on mount and change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('techbridge_theme', newTheme);
  };

  const hashPassword = async (password: string): Promise<string> => {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleLogin = async (password: string) => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
        const remaining = Math.ceil((lockoutUntil - Date.now()) / 60000);
        setLoginError(`Account locked. Try again in ${remaining} minutes.`);
        return;
    }

    if (lockoutUntil && Date.now() > lockoutUntil) {
        setLockoutUntil(null);
        setLoginAttempts(0);
    }

    const envHash = (import.meta as any).env?.VITE_ADMIN_PASSWORD_HASH;
    const inputHash = await hashPassword(password);

    if (inputHash === envHash) {
      setIsAuthenticated(true);
      sessionStorage.setItem('techbridge_auth', 'true');
      setShowAdmin(true); // Ensure dashboard shows
      setLoginError(null);
      setLoginAttempts(0);
      logAction('Admin login successful');
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          const lockoutTime = Date.now() + LOCKOUT_DURATION;
          setLockoutUntil(lockoutTime);
          setLoginError(`Too many failed attempts. Locked out for 15 minutes.`);
          logAction('Admin account locked out due to excessive failed login attempts');
      } else {
          setLoginError(`Incorrect password. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`);
          logAction('Admin login failed: incorrect password');
      }
    }
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
        setShowAdmin(true);
    } else {
        setShowAdmin(true);
        setLoginError(null); // Reset error on open
    }
    if (!isAuthenticated) {
        logAction('Admin access attempt');
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: Category | 'All Apps') => {
    setActiveCategory(category);
    setCurrentPage(1);
    setShowIndex(false); // Close mobile index if open
    window.scrollTo({ top: document.getElementById('main-content')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowIndex(false);
  };

  const filteredApps = useMemo(() => {
    return AI_APPLICATIONS.filter(app => {
      const matchesCategory = activeCategory === 'All Apps' || app.category === activeCategory;
      const matchesSearch = searchTerm === '' ||
        app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const totalPages = Math.ceil(filteredApps.length / APPS_PER_PAGE);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * APPS_PER_PAGE,
    currentPage * APPS_PER_PAGE
  );

  const categoryCounts = useMemo(() => {
    const counts: { [key in Category | 'All Apps']: number } = {
      'All Apps': AI_APPLICATIONS.length,
      [Category.Research]: 0,
      [Category.Development]: 0,
      [Category.Analysis]: 0,
      [Category.Education]: 0,
    };
    AI_APPLICATIONS.forEach(app => {
      counts[app.category]++;
    });
    return counts;
  }, []);

  if (showAdmin && isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-ink text-brand-cream font-cormorant relative overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-brand-gold focus:text-brand-ink focus:px-4 focus:py-2 focus:font-bold">
        Skip to main content
      </a>
      <div className="grain-overlay"></div>
      
      <Header 
        totalApps={AI_APPLICATIONS.length} 
        theme={theme}
        onThemeChange={changeTheme}
        onAdminClick={handleAdminClick}
        onIndexClick={() => setShowIndex(true)}
      />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden animate-fade-up delay-200">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-playfair font-bold text-brand-gold opacity-[0.03] pointer-events-none select-none leading-none">
              T
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <span className="font-bebas text-brand-gold tracking-[0.2em] text-lg md:text-xl mb-4 block">PRESTIGE EDITION • VOL. III</span>
              <h1 className="font-playfair font-black text-5xl md:text-8xl text-brand-cream uppercase tracking-tight leading-[0.9] mb-2">
                  The AI Revolution
              </h1>
              <h2 className="font-playfair italic text-3xl md:text-5xl text-brand-gold mb-8">
                  Shaping the Future of Ghana
              </h2>
              <p className="max-w-2xl mx-auto font-cormorant text-xl md:text-2xl text-brand-cream/80 leading-relaxed italic">
                  "An exclusive collection of next-generation tools designed for the modern academic pioneer."
              </p>
          </div>
      </section>

      <FeatureBand />

      <main id="main-content" className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10 animate-fade-up delay-400">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar (Left on large screens) */}
            <aside className="lg:col-span-3 hidden lg:block border-r border-brand-gold/20 pr-8">
                <div className="sticky top-8 space-y-12">
                    <TableOfContents 
                        activeCategory={activeCategory} 
                        onCategoryChange={handleCategoryChange}
                        onScrollToTop={handleScrollToTop}
                    />

                    <div className="bg-brand-card-bg border border-brand-gold/20 p-6 relative">
                        <span className="absolute top-4 left-4 text-6xl font-playfair text-brand-gold opacity-20 leading-none">“</span>
                        <p className="font-playfair italic text-brand-gold-pale text-lg leading-relaxed relative z-10 pt-4">
                            Technology is best when it brings people together. We are building the bridge to tomorrow.
                        </p>
                        <div className="mt-4 flex items-center space-x-3">
                            <div className="h-px w-8 bg-brand-gold/50"></div>
                            <span className="font-bebas text-brand-gold tracking-wider text-sm">Dean of Innovation</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
                <section aria-labelledby="filter-and-search-apps" className="mb-12">
                  <h2 id="filter-and-search-apps" className="sr-only">Filter and search applications</h2>
                  <div className="space-y-8">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={handleSearch} />
                    <CategoryFilters
                      categories={CATEGORIES}
                      activeCategory={activeCategory}
                      setActiveCategory={handleCategoryChange}
                      categoryCounts={categoryCounts}
                    />
                  </div>
                </section>

                <section aria-labelledby="ai-applications-grid">
                    <h2 id="ai-applications-grid" className="sr-only">AI Applications</h2>
                    <div className="sr-only" aria-live="polite" role="status">
                      {`${filteredApps.length} application${filteredApps.length !== 1 ? 's' : ''} found.`}
                    </div>
                    
                    {/* Gold Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent mb-12"></div>

                    {paginatedApps.length > 0 ? (
                        <>
                            <AppGrid apps={paginatedApps} />
                            <div className="mt-12">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-24 border border-brand-gold/10 bg-brand-card-bg/30">
                            <p className="font-playfair italic text-2xl text-brand-gold">No applications found matching your criteria.</p>
                            <p className="mt-4 font-dm-sans text-brand-gold-pale/60 uppercase tracking-wider text-sm">Try adjusting your search or filter parameters.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
      </main>
      <Footer />

      {/* Mobile Index Modal */}
      {showIndex && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowIndex(false)}>
            <div className="w-80 h-full bg-brand-ink border-l border-brand-gold p-8 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-8 border-b border-brand-gold/30 pb-4">
                    <h2 className="font-playfair text-2xl text-brand-cream">Index</h2>
                    <button onClick={() => setShowIndex(false)} className="text-brand-gold hover:text-brand-cream">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <TableOfContents 
                    activeCategory={activeCategory} 
                    onCategoryChange={handleCategoryChange}
                    onScrollToTop={handleScrollToTop}
                />
            </div>
        </div>
      )}

      {showAdmin && !isAuthenticated && (
        <AdminLogin 
            onLogin={handleLogin} 
            onCancel={() => setShowAdmin(false)} 
            error={loginError}
            isLockedOut={!!lockoutUntil}
        />
      )}
    </div>
  );
}

export default App;
