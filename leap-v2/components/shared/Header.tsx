
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import type { AppContextType } from '../../types';

interface HeaderProps {
  currentPage: 'student' | 'admin';
  setCurrentPage: (page: 'student' | 'admin') => void;
  isAdmin: boolean;
}

// Icon Components
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const ContrastIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5A6.5 6.5 0 0012 5.5V18.5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5.5A6.5 6.5 0 005.5 12h13A6.5 6.5 0 0012 5.5z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;

export const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, isAdmin }) => {
  const { theme, setTheme, handleLogout } = useContext(AppContext) as AppContextType;

  const handleThemeChange = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('high-contrast');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <SunIcon />;
    if (theme === 'dark') return <MoonIcon />;
    return <ContrastIcon />;
  };
  
  // Render new student header only in light/dark mode on the student page when not logged in
  if (currentPage === 'student' && !isAdmin && theme !== 'high-contrast') {
    return (
      <header className="sticky top-0 z-50 bg-gradient-to-r from-red-900/95 to-red-800/95 backdrop-blur-md border-b border-red-700/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                Assessment Portal
              </h1>
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-200">
                  <PhoneIcon /> <span>+233 (0) 54 012 4400</span>
                </div>
                <div className="flex items-center gap-2 text-gray-200">
                  <PhoneIcon /> <span>+233 (0) 54 012 4488</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleThemeChange} className="p-2 rounded-full text-white hover:bg-white/10 transition-colors" aria-label="Toggle theme">
                 { theme === 'light' ? <SunIcon/> : <MoonIcon/> }
              </button>
              <button onClick={() => setCurrentPage('admin')} className="px-6 py-2 bg-amber-500 hover:bg-amber-600 rounded-full font-semibold text-white transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50">
                Admin
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Fallback to original header for Admin page or High Contrast mode
  return (
    <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md transition-colors duration-300`}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h1 className="text-xl md:text-2xl font-bold">LEAP</h1>
        </div>
        <div className="flex items-center space-x-4">
           {!isAdmin && (
             <nav className="flex space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button onClick={() => setCurrentPage('student')} className={`px-3 py-1 text-sm font-medium rounded-md ${currentPage === 'student' ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Student</button>
                <button onClick={() => setCurrentPage('admin')} className={`px-3 py-1 text-sm font-medium rounded-md ${currentPage === 'admin' ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Admin</button>
            </nav>
           )}
          {isAdmin && (
            <button onClick={handleLogout} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Logout</button>
          )}
          <button onClick={handleThemeChange} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle theme">
            {getThemeIcon()}
          </button>
        </div>
      </div>
    </header>
  );
};
