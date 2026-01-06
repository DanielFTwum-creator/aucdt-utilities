
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, MessageCircle, Menu, X, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { NAV_ITEMS, LOGO_URL, SOCIAL_LINKS } from '../constants.ts';
import ThemeToggle from './ThemeToggle.tsx';

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
  </svg>
);

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.11-1.47-.17-.12-.32-.26-.47-.39v6.52c.03 2.11-.64 4.31-2.26 5.74-1.63 1.48-3.95 2.05-6.09 1.45-2.02-.51-3.79-2.07-4.57-4-1.02-2.56-.23-5.78 1.95-7.51 1.42-1.16 3.32-1.61 5.12-1.2v4.19c-.89-.25-1.89-.13-2.67.38-.85.54-1.34 1.55-1.24 2.55.1 1.34 1.25 2.45 2.58 2.44 1.35-.02 2.46-1.12 2.48-2.47V0z" />
  </svg>
);

interface HeaderProps {
  onChatToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onChatToggle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<number | null>(null);
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState<number | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      mobileMenuRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  // Handle clicking outside to close desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutside = dropdownRefs.current.every(ref => ref && !ref.contains(target));
      if (isOutside) {
        setActiveDesktopDropdown(null);
      }
    };

    if (activeDesktopDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeDesktopDropdown]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveMobileSubmenu(null);
  };

  const toggleDesktopDropdown = (idx: number) => {
    setActiveDesktopDropdown(activeDesktopDropdown === idx ? null : idx);
  };

  return (
    <header className="w-full z-50 font-sans" role="banner">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-3 px-4 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5 lg:gap-8">
            <a href="#/" className="flex-shrink-0 group py-1" aria-label="Techbridge University College Home">
              <img 
                src={LOGO_URL} 
                alt="TUC Logo" 
                className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
            </a>
            <div className="hidden sm:block text-left">
              <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-tuc-gold uppercase tracking-tighter leading-none mb-1">Techbridge University College</h1>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-4 bg-tuc-maroon/20 rounded-full"></div>
                <p className="text-tuc-maroon dark:text-gray-400 italic text-[10px] md:text-xs lg:text-sm font-bold tracking-tight">Formerly AsanSka University College of Design and Technology</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-3">
             <div className="flex items-center space-x-4">
                <ThemeToggle />
                <button onClick={onChatToggle} className="p-2 text-tuc-maroon dark:text-tuc-gold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" aria-label="Toggle AI Chat Assistant">
                  <MessageCircle size={22} aria-hidden="true" />
                </button>
             </div>
             <div className="text-[9px] uppercase font-black text-tuc-maroon dark:text-tuc-gold tracking-[0.2em] px-3 py-1 bg-tuc-gold/10 rounded-full border border-tuc-gold/20">January 2026 Admissions Open</div>
          </div>
        </div>
      </div>

      <nav className={`w-full bg-tuc-maroon text-white transition-all duration-300 ${isScrolled ? 'fixed top-0 shadow-xl' : 'relative'}`} aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="hidden lg:flex items-center">
            {NAV_ITEMS.map((item, idx) => (
              <div 
                key={idx} 
                className="relative group"
                ref={el => { dropdownRefs.current[idx] = el; }}
              >
                {item.children ? (
                  <button 
                    onClick={() => toggleDesktopDropdown(idx)}
                    className="px-5 py-5 text-[11px] font-black hover:bg-tuc-gold hover:text-tuc-maroon transition-all flex items-center gap-1.5 uppercase tracking-widest text-left"
                    aria-haspopup="true"
                    aria-expanded={activeDesktopDropdown === idx}
                  >
                    {item.label}
                    <ChevronDown 
                      size={12} 
                      className={`opacity-60 transition-transform duration-200 ${activeDesktopDropdown === idx ? 'rotate-180' : ''}`} 
                      aria-hidden="true" 
                    />
                  </button>
                ) : (
                  <a href={item.href} className="px-5 py-5 text-[11px] font-black hover:bg-tuc-gold hover:text-tuc-maroon transition-all flex items-center gap-1.5 uppercase tracking-widest">
                    {item.label}
                  </a>
                )}
                {item.children && (
                  <div 
                    className={`absolute top-full left-0 w-64 bg-white shadow-2xl transition-all duration-300 border-t-[4px] border-tuc-gold z-50 py-2 rounded-b-xl overflow-hidden ${
                      activeDesktopDropdown === idx 
                        ? 'opacity-100 visible translate-y-0' 
                        : 'opacity-0 invisible translate-y-2'
                    }`}
                    role="menu"
                  >
                    {item.children.map((child, cIdx) => (
                      <a 
                        key={cIdx} 
                        href={child.href}
                        onClick={() => setActiveDesktopDropdown(null)}
                        className="block px-6 py-3 text-[13px] font-bold text-tuc-maroon hover:bg-gray-50 hover:text-tuc-gold transition-colors tracking-tight text-left"
                        role="menuitem"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-2.5 mx-6">
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-tuc-gold/60 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-maroon transition-all duration-300" aria-label="Facebook"><Facebook size={14} /></a>
            <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-tuc-gold/60 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-maroon transition-all duration-300" aria-label="X"><XIcon size={14} /></a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-tuc-gold/60 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-maroon transition-all duration-300" aria-label="Instagram"><Instagram size={14} /></a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-tuc-gold/60 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-maroon transition-all duration-300" aria-label="TikTok"><TikTokIcon size={14} /></a>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-tuc-gold/60 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-maroon transition-all duration-300" aria-label="LinkedIn"><Linkedin size={14} /></a>
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-tuc-gold/60 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-maroon transition-all duration-300" aria-label="YouTube"><Youtube size={14} /></a>
          </div>

          <div className="flex-1 lg:flex-none flex justify-end lg:block py-2.5">
            <a href="https://portal.aucdt.edu.gh/admissions/#/home" className="bg-tuc-gold text-tuc-maroon px-8 py-2.5 rounded-sm font-black text-[11px] hover:bg-white transition-all shadow-lg uppercase tracking-widest">Apply Now</a>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-white p-2 ml-4 focus:outline-none" aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      <div 
        ref={mobileMenuRef}
        className={`lg:hidden fixed inset-0 z-[60] bg-white dark:bg-tuc-dark pt-20 px-6 overflow-y-auto transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col space-y-4">
          <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-4 text-left">
            <h2 className="text-xl font-bold text-tuc-gold uppercase">Techbridge University College</h2>
            <p className="text-tuc-maroon dark:text-gray-400 italic text-xs">Design and Build a Nation!</p>
          </div>
          {NAV_ITEMS.map((item, idx) => (
            <div key={idx} className="border-b border-gray-100 dark:border-gray-800 pb-2 text-left">
              <div className="flex justify-between items-center py-2">
                {item.children ? (
                  <button 
                    onClick={() => setActiveMobileSubmenu(activeMobileSubmenu === idx ? null : idx)}
                    className="text-lg font-bold text-tuc-maroon dark:text-white uppercase flex-1 text-left"
                  >
                    {item.label}
                  </button>
                ) : (
                  <a 
                    href={item.href} 
                    onClick={closeMobileMenu} 
                    className="text-lg font-bold text-tuc-maroon dark:text-white uppercase flex-1"
                  >
                    {item.label}
                  </a>
                )}
                {item.children && (
                  <button 
                    onClick={() => setActiveMobileSubmenu(activeMobileSubmenu === idx ? null : idx)} 
                    className="p-2 text-tuc-maroon dark:text-tuc-gold"
                    aria-label={`Toggle ${item.label} submenu`}
                  >
                    <ChevronDown size={20} className={`transition-transform ${activeMobileSubmenu === idx ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
              {item.children && activeMobileSubmenu === idx && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mt-2 space-y-3 text-left">
                  {item.children.map((child, cIdx) => (
                    <a key={cIdx} href={child.href} onClick={closeMobileMenu} className="block text-sm text-tuc-maroon dark:text-gray-300 font-medium">{child.label}</a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-center space-x-4 py-6 border-t border-gray-100 dark:border-gray-800">
             <a href={SOCIAL_LINKS.facebook} className="text-tuc-maroon dark:text-tuc-gold"><Facebook /></a>
             <a href={SOCIAL_LINKS.twitter} className="text-tuc-maroon dark:text-tuc-gold"><XIcon /></a>
             <a href={SOCIAL_LINKS.instagram} className="text-tuc-maroon dark:text-tuc-gold"><Instagram /></a>
             <a href={SOCIAL_LINKS.tiktok} className="text-tuc-maroon dark:text-tuc-gold"><TikTokIcon /></a>
          </div>
          <a href="https://portal.aucdt.edu.gh/admissions/#/home" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu} className="block w-full bg-tuc-maroon text-white text-center py-4 rounded-sm font-bold uppercase tracking-widest mt-2">Start Application</a>
          <button onClick={closeMobileMenu} className="flex items-center justify-center gap-2 text-gray-500 py-4"><X size={20} /> Close Menu</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
