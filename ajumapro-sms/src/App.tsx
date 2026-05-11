import { useState, useEffect } from 'react';
import Cover from './pages/Cover';
import Admin from './pages/Admin';
import Docs from './pages/Docs';

export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [theme, setTheme] = useState<'dark' | 'light' | 'hc'>(
    (localStorage.getItem('app_theme') as any) || 'dark'
  );

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? '' : `theme-${theme}`;
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : prev === 'light' ? 'hc' : 'dark');
  };

  return (
    <div className="min-h-screen bg-ink text-cream selection:bg-gold selection:text-ink overflow-x-hidden transition-colors duration-300">
      {/* Global Grain Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      
      {/* Global Accent Bars */}
      <div className="h-1 w-full bg-gold fixed top-0 z-50"></div>
      <div className="h-1 w-full bg-gold fixed bottom-0 z-50"></div>

      {/* Global Ghost Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <span className="text-[120vh] font-playfair font-black text-transparent opacity-10 select-none" style={{ WebkitTextStroke: '2px var(--accent-gold)' }}>A</span>
      </div>

      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border border-gold bg-ink text-gold flex items-center justify-center hover:bg-gold hover:text-ink transition-colors shadow-lg"
        aria-label="Toggle Theme (Dark, Light, High Contrast)"
        title="Toggle Theme"
      >
        <span className="font-bebas text-lg mt-1">{theme.toUpperCase()}</span>
      </button>

      {route === '#/' && <Cover />}
      {route.startsWith('#/admin') && <Admin />}
      {route.startsWith('#/docs') && <Docs />}
    </div>
  );
}
