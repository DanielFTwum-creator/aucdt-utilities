import React, { useState, useEffect } from 'react';
import { Flyer } from './components/Flyer';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { AdminPanel } from './components/AdminPanel';
import { LoginView } from './components/LoginView';
import { useAuth } from './contexts/AuthContext';
import { ThemeMode } from './types';
import { auditLogger } from './utils/audit';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    auditLogger.log('App Started', `Initial theme: ${theme}`);
    
    // Accessibility: Allow opening admin with Ctrl+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdmin(prev => !prev);
        auditLogger.log('Admin Panel Toggle', 'Keyboard Shortcut Used');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 transition-colors duration-300"
         style={{ backgroundColor: 'var(--bg-root)' }}>
      
      {/* Accessibility / Theme Controls */}
      <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />

      {/* Main Flyer */}
      <Flyer />

      {/* Footer Admin Link (Accessible) */}
      <button 
        onClick={() => { setShowAdmin(true); auditLogger.log('Admin Panel Toggle', 'Footer Link Clicked'); }}
        className="fixed bottom-2 right-2 text-[10px] opacity-20 hover:opacity-100 transition-opacity"
        style={{ color: 'var(--text-secondary)' }}
      >
        Admin
      </button>

      {/* Admin Modal */}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
};

export default App;