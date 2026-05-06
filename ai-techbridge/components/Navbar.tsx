
import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../App';
import { TECHBRIDGE_PRIMARY, TECHBRIDGE_GOLD } from '../constants';

interface NavbarProps {
  currentView: string;
  onViewChange: (v: any) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Campus', view: 'home' },
    { label: 'Directory', view: 'directory' },
    { label: 'Docs', view: 'docs' },
    { label: 'Admin', view: 'admin' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-8 lg:px-16 py-4 ${
      isScrolled || currentView !== 'home' ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-techbridge-beige/30' : 'bg-transparent'
    }`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => onViewChange('home')}>
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform p-1">
             <img src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" alt="TechBridge Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className={`text-xl md:text-2xl font-black tracking-tighter leading-none ${
              isScrolled || currentView !== 'home' ? 'text-techbridge-burgundy dark:text-white' : 'text-white'
            }`}>
              TECHBRIDGE
            </h1>
            <span className="text-[10px] font-black text-techbridge-gold uppercase tracking-[0.3em]">AI HUB</span>
          </div>
        </div>
        
        <div className="hidden md:flex gap-4 items-center">
          {navItems.map(item => (
            <button 
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
                currentView === item.view 
                  ? 'bg-techbridge-burgundy text-white shadow-xl shadow-techbridge-burgundy/20' 
                  : isScrolled || currentView !== 'home' 
                    ? 'text-gray-800 dark:text-gray-200 hover:bg-techbridge-cream dark:hover:bg-slate-800' 
                    : 'text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <div className="flex items-center gap-2 ml-4 p-1.5 bg-techbridge-cream dark:bg-slate-800 rounded-full border border-techbridge-beige dark:border-slate-700 shadow-inner">
            <button onClick={() => setTheme('light')} className={`p-2 rounded-full transition-all hover:scale-110 ${theme === 'light' ? 'bg-white shadow-lg text-techbridge-gold' : 'text-gray-400'}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
            </button>
            <button onClick={() => setTheme('dark')} className={`p-2 rounded-full transition-all hover:scale-110 ${theme === 'dark' ? 'bg-slate-700 shadow-lg text-blue-400' : 'text-gray-400'}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
            </button>
            <button onClick={() => setTheme('contrast')} className={`p-2 rounded-full transition-all hover:scale-110 ${theme === 'contrast' ? 'bg-black shadow-lg text-white' : 'text-gray-400'}`}>
              <span className="text-[10px] font-black">HC</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
