
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircle, Menu, X, Facebook, Instagram, Linkedin, Search } from 'lucide-react';
import { NAV_ITEMS, LOGO_URL, SOCIAL_LINKS } from '../constants.ts';
import ThemeToggle from './ThemeToggle.tsx';
import { useUI } from '../context/UIContext.tsx';

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

// Helper to flatten nested navigation items for search
const flattenNavItems = (items: typeof NAV_ITEMS) => {
  let flat: { label: string; href: string }[] = [];
  items.forEach(item => {
    flat.push({ label: item.label, href: item.href });
    if (item.children) {
      flat = [...flat, ...flattenNavItems(item.children)];
    }
  });
  return flat;
};

interface SocialLinkProps {
  href: string;
  platform: string;
  icon: React.ElementType;
  size?: number;
  className?: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, platform, icon: Icon, size = 14, className }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className={`group relative flex items-center justify-center ${className}`} 
    aria-label={`Follow on ${platform}`}
  >
    <Icon size={size} />
    {/* Custom Tooltip */}
    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg min-w-max">
      Follow on {platform}
      {/* Tiny Arrow */}
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-white"></span>
    </span>
  </a>
);

const Header: React.FC = () => {
  const { toggleChat } = useUI();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<number | null>(null);
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState<number | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{ label: string; href: string }[]>([]);
  
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      // Clear search when closed
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [isSearchVisible]);

  // Debounced Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        const flatItems = flattenNavItems(NAV_ITEMS);
        const results = flatItems.filter((item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
        // Remove duplicates based on href
        const uniqueResults = Array.from(new Map(results.map(item => [item.href, item])).values());
        setSearchResults(uniqueResults);
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutside = dropdownRefs.current.every(ref => ref && !ref.contains(target));
      if (isOutside) {
        setActiveDesktopDropdown(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDesktopDropdown(null);
        setIsMobileMenuOpen(false);
        setIsSearchVisible(false);
      }
    };

    if (activeDesktopDropdown !== null || isMobileMenuOpen || isSearchVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [activeDesktopDropdown, isMobileMenuOpen, isSearchVisible]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveMobileSubmenu(null);
  };

  const toggleDesktopDropdown = (idx: number) => {
    setActiveDesktopDropdown(activeDesktopDropdown === idx ? null : idx);
  };

  const isExternalLink = (href: string) => href.startsWith('http');

  const NavLink: React.FC<{ item: any; className: string; onClick?: () => void }> = ({ item, className, onClick }) => {
    if (isExternalLink(item.href)) {
      return (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
          {item.label}
        </a>
      );
    }
    return (
      <Link to={item.href} className={className} onClick={onClick}>
        {item.label}
      </Link>
    );
  };

  return (
    <header className="w-full z-50 font-sans" role="banner">
      {/* Upper Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-4 lg:py-6 px-4 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-10 flex-1 min-w-0">
            <Link to="/" className="flex-shrink-0 group block" aria-label="Techbridge University College Home">
              <img 
                src={LOGO_URL} 
                alt="TUC Logo" 
                className="h-20 xs:h-32 sm:h-36 md:h-40 lg:h-48 w-auto object-contain transition-all duration-300 group-hover:scale-105" 
              />
            </Link>
            <div className="flex flex-col min-w-0">
              <h1 className="text-[13px] xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-tuc-maroon dark:text-tuc-maroon uppercase tracking-tighter leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                Techbridge <span className="text-tuc-gold">University College</span>
              </h1>
              <div className="flex items-center gap-2 sm:gap-4 mt-1.5">
                <div className="hidden xs:block h-0.5 w-6 sm:w-10 bg-tuc-maroon/30 rounded-full"></div>
                <p className="text-tuc-maroon dark:text-tuc-maroon italic text-[13px] xs:text-[15px] sm:text-[19px] md:text-[21px] font-bold tracking-tight line-clamp-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  Formerly AsanSka University College of Design and Technology
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-end gap-3 shrink-0">
             <div className="flex items-center space-x-4">
                <div className={`relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 transition-all duration-300 ${isSearchVisible ? 'w-64' : 'w-10'}`}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search catalog..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`bg-transparent border-none outline-none text-xs font-bold px-4 py-2.5 text-gray-700 dark:text-gray-200 transition-all duration-300 placeholder:text-gray-400 ${
                      isSearchVisible ? 'w-full opacity-100' : 'w-0 opacity-0 pointer-events-none'
                    }`}
                  />
                  <button 
                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                    className="absolute right-0 p-2.5 text-tuc-forest dark:text-tuc-gold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded-full"
                    aria-label="Toggle search"
                    title="Toggle search"
                  >
                    {isSearchVisible ? <X size={18} /> : <Search size={18} />}
                  </button>

                  {/* Search Results Dropdown */}
                  {isSearchVisible && searchTerm && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[300px] overflow-y-auto z-[60]">
                      {searchResults.length > 0 ? (
                        <ul>
                          {searchResults.map((result, idx) => (
                            <li key={idx} className="border-b border-gray-50 dark:border-gray-800 last:border-none">
                              <NavLink 
                                item={result}
                                className="block px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-tuc-forest hover:text-white dark:hover:bg-tuc-gold dark:hover:text-tuc-forest transition-colors truncate"
                                onClick={() => {
                                  setIsSearchVisible(false);
                                  setSearchTerm('');
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 text-xs font-bold text-gray-400 text-center italic">
                          No matches found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <ThemeToggle />
                <button onClick={toggleChat} className="p-2.5 bg-tuc-forest/5 text-tuc-forest dark:text-tuc-gold hover:bg-tuc-gold hover:text-tuc-forest rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-tuc-gold" aria-label="Toggle AI Chat Assistant" title="Toggle AI Chat Assistant">
                  <MessageCircle size={20} aria-hidden="true" />
                </button>
             </div>
             <div className="text-[9px] uppercase font-black text-tuc-forest dark:text-tuc-gold tracking-[0.2em] px-3 py-1 bg-tuc-gold/10 rounded-full border border-tuc-gold/25">
               July 2026 Admissions Open
             </div>
          </div>

          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button 
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="p-1.5 text-tuc-forest dark:text-tuc-gold hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded-full"
              aria-label="Search"
              title="Search"
            >
              <Search size={22} />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-tuc-forest dark:text-white p-1.5 focus:outline-none hover:scale-110 transition-transform focus:ring-2 focus:ring-tuc-gold rounded-full" 
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              title={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <nav className={`w-full bg-tuc-forest text-white transition-all duration-300 ${isScrolled ? 'fixed top-0 shadow-2xl z-[100]' : 'relative'}`} aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="hidden lg:flex items-center">
            {NAV_ITEMS.map((item, idx) => (
              <div 
                key={idx} 
                className="relative group"
                ref={el => { dropdownRefs.current[idx] = el; }}
              >
                {item.children ? (
                  <>
                    <button 
                      onClick={() => toggleDesktopDropdown(idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleDesktopDropdown(idx);
                        }
                      }}
                      className="px-6 py-5 text-[11px] font-black hover:bg-tuc-gold hover:text-tuc-forest transition-all flex items-center gap-2 uppercase tracking-widest text-left whitespace-nowrap focus:bg-tuc-gold focus:text-tuc-forest focus:outline-none"
                      aria-haspopup="true"
                      aria-expanded={activeDesktopDropdown === idx}
                    >
                      {item.label}
                      <ChevronDown 
                        size={14} 
                        className={`opacity-70 transition-transform duration-200 ${activeDesktopDropdown === idx ? 'rotate-180' : ''}`} 
                        aria-hidden="true" 
                      />
                    </button>
                    <div 
                      className={`absolute top-full left-0 w-64 bg-white shadow-2xl transition-all duration-300 border-t-[4px] border-tuc-gold z-50 py-2 ${
                        activeDesktopDropdown === idx 
                          ? 'opacity-100 visible translate-y-0' 
                          : 'opacity-0 invisible translate-y-2'
                      }`}
                      role="menu"
                    >
                      {item.children.map((child, cIdx) => (
                        <div key={cIdx} role="menuitem">
                          <NavLink 
                            item={child}
                            onClick={() => setActiveDesktopDropdown(null)}
                            className="block px-6 py-4 text-[13px] font-bold text-tuc-forest hover:bg-gray-50 transition-colors tracking-tight text-left focus:bg-gray-100 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <NavLink item={item} className="px-6 py-5 text-[11px] font-black hover:bg-tuc-gold hover:text-tuc-forest transition-all flex items-center gap-2 uppercase tracking-widest whitespace-nowrap focus:bg-tuc-gold focus:text-tuc-forest focus:outline-none" />
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-3 mx-6">
            <SocialLink href={SOCIAL_LINKS.facebook} platform="Facebook" icon={Facebook} className="w-8 h-8 rounded-full border border-tuc-gold/40 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-forest transition-all duration-300" />
            <SocialLink href={SOCIAL_LINKS.twitter} platform="X (Twitter)" icon={XIcon} className="w-8 h-8 rounded-full border border-tuc-gold/40 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-forest transition-all duration-300" />
            <SocialLink href={SOCIAL_LINKS.instagram} platform="Instagram" icon={Instagram} className="w-8 h-8 rounded-full border border-tuc-gold/40 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-forest transition-all duration-300" />
            <SocialLink href={SOCIAL_LINKS.tiktok} platform="TikTok" icon={TikTokIcon} className="w-8 h-8 rounded-full border border-tuc-gold/40 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-forest transition-all duration-300" />
            <SocialLink href={SOCIAL_LINKS.linkedin} platform="LinkedIn" icon={Linkedin} className="w-8 h-8 rounded-full border border-tuc-gold/40 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-forest transition-all duration-300" />
          </div>

          <div className="flex-1 lg:flex-none flex justify-end lg:block py-3">
            <a href="https://portal.aucdt.edu.gh/admissions/#/home" className="bg-tuc-gold text-tuc-forest px-8 py-2.5 rounded-[0.75rem] font-black text-[11px] hover:bg-white transition-all shadow-lg uppercase tracking-widest whitespace-nowrap focus:outline-none focus:ring-4 focus:ring-white/50">Apply Now</a>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div 
        ref={mobileMenuRef}
        tabIndex={-1}
        className={`lg:hidden fixed inset-0 z-[110] bg-white dark:bg-tuc-midnight pt-20 px-6 overflow-y-auto transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        <div className="flex flex-col space-y-6 text-left pb-12">
          <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-8 flex items-center gap-6">
            <img src={LOGO_URL} alt="TUC" className="h-28 w-auto object-contain" />
            <div>
              <h2 className="text-xl font-black text-tuc-forest dark:text-tuc-gold uppercase leading-tight">Techbridge <br/> University</h2>
              <p className="text-gray-400 italic text-[10px] mt-1 font-bold uppercase tracking-widest">Build What Comes Next</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <ThemeToggle />
            <button onClick={toggleChat} className="p-3 bg-tuc-gold/15 text-tuc-forest dark:text-tuc-gold rounded-2xl shadow-sm" aria-label="Toggle AI Chat Assistant" title="Toggle AI Chat Assistant">
              <MessageCircle size={22} />
            </button>
          </div>

          {NAV_ITEMS.map((item, idx) => (
            <div key={idx} className="border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex justify-between items-center py-3">
                {item.children ? (
                  <button 
                    onClick={() => setActiveMobileSubmenu(activeMobileSubmenu === idx ? null : idx)}
                    className="text-lg font-black text-tuc-forest dark:text-white uppercase flex-1 text-left tracking-tighter"
                    aria-expanded={activeMobileSubmenu === idx}
                  >
                    {item.label}
                  </button>
                ) : (
                  <NavLink item={item} onClick={closeMobileMenu} className="text-lg font-black text-tuc-forest dark:text-white uppercase flex-1 tracking-tighter" />
                )}
                {item.children && (
                  <button 
                    onClick={() => setActiveMobileSubmenu(activeMobileSubmenu === idx ? null : idx)} 
                    className="p-2 text-tuc-forest dark:text-tuc-gold"
                    aria-label={`Toggle ${item.label} submenu`}
                    title={`Toggle ${item.label} submenu`}
                  >
                    <ChevronDown size={22} className={`transition-transform duration-300 ${activeMobileSubmenu === idx ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
              {item.children && activeMobileSubmenu === idx && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mt-3 space-y-4 animate-fade-in-up border border-gray-100 dark:border-gray-700">
                  {item.children.map((child, cIdx) => (
                    <NavLink key={cIdx} item={child} onClick={closeMobileMenu} className="block text-sm text-tuc-forest dark:text-gray-300 font-bold uppercase tracking-tight" />
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-center space-x-6 py-6 border-t border-gray-100 dark:border-gray-800 mt-4">
             <SocialLink href={SOCIAL_LINKS.facebook} platform="Facebook" icon={Facebook} size={20} className="text-tuc-forest dark:text-tuc-gold transition-transform hover:scale-110" />
             <SocialLink href={SOCIAL_LINKS.twitter} platform="X (Twitter)" icon={XIcon} size={20} className="text-tuc-forest dark:text-tuc-gold transition-transform hover:scale-110" />
             <SocialLink href={SOCIAL_LINKS.instagram} platform="Instagram" icon={Instagram} size={20} className="text-tuc-forest dark:text-tuc-gold transition-transform hover:scale-110" />
          </div>
          <a href="https://portal.aucdt.edu.gh/admissions/#/home" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu} className="block w-full bg-tuc-forest text-white text-center py-5 rounded-[1.25rem] font-black uppercase tracking-[0.2em] shadow-xl mt-4 active:scale-95 transition-transform">Start Application</a>
          <button onClick={closeMobileMenu} className="flex items-center justify-center gap-2 text-gray-400 font-bold py-6 uppercase text-[10px] tracking-widest w-full"><X size={18} /> Close Navigation</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
