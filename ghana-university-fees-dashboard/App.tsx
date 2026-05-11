import React, { useState } from 'react';
import FeesComparisonDashboard from './components/FeesComparisonDashboard';
import AdminPanel from './components/AdminPanel';
import { RefreshStatus } from './components/RefreshStatus';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import AuditService from './services/AuditService';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Theme } from './types';

const Header: React.FC<{ currentView: 'public' | 'admin' | 'refresh', onViewChange: (v: 'public' | 'admin' | 'refresh') => void }> = ({ currentView, onViewChange }) => {
  const { theme, setTheme } = useTheme();

  const handleViewChange = (v: 'public' | 'admin' | 'refresh') => {
    onViewChange(v);
    AuditService.log('UI_NAV', `Navigated to ${v.toUpperCase()} view`, 'INFO');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 border-b backdrop-blur-md ${
      theme === 'dark' 
        ? 'bg-gray-900/80 border-gray-700/50 text-white' 
        : 'bg-white/80 border-gray-200/50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => handleViewChange('public')}
        >
          <div className={`p-2 rounded-lg transition-colors ${
            theme === 'dark' ? 'bg-blue-900/30 group-hover:bg-blue-900/50' : 'bg-blue-50 group-hover:bg-blue-100'
          }`}>
            <svg 
              className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            EduData Ghana
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleViewChange('refresh')}
            className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${
              currentView === 'refresh' ? 'text-blue-500' : 'text-gray-400 hover:text-blue-400'
            }`}
          >
            Refresh Protocol
          </button>
          {/* Theme Selector */}
          <div className={`flex p-1 rounded-full border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
          }`}>
            {(['light', 'dark', 'high-contrast'] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                  theme === t 
                    ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-300 scale-105' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                aria-label={`Switch to ${t} theme`}
              >
                {t === 'high-contrast' ? 'HC' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleViewChange(currentView === 'public' ? 'admin' : 'public')}
            className={`text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-600' 
                : 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-200'
            }`}
          >
            {currentView === 'public' ? 'Admin Access' : 'Public Dashboard'}
          </button>
        </div>
      </div>
    </header>
  );
};

const MainContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'public' | 'admin' | 'refresh'>('public');
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'
    }`}>
      <Header currentView={currentView === 'refresh' ? 'admin' : currentView} onViewChange={setCurrentView} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="animate-fade-in-up">
          {currentView === 'public' ? (
            <FeesComparisonDashboard />
          ) : currentView === 'admin' ? (
            <AdminPanel />
          ) : (
            <RefreshStatus onBack={() => setCurrentView('public')} />
          )}
        </div>
      </main>

      <footer className={`border-t mt-auto transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-white border-gray-100 text-gray-500'
      }`}>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm font-medium">
            &copy; {new Date().getFullYear()} EduData Ghana.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0 text-sm">
            <span className="hover:text-blue-500 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-blue-500 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-blue-500 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <MainContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;