import { Facebook, Instagram, Linkedin, MapPin, Menu, Search, Twitter, X, Youtube } from 'lucide-react';
import React, { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
  theme: 'light' | 'dark' | 'high-contrast';
  setTheme: (theme: 'light' | 'dark' | 'high-contrast') => void;
  onNavigate: (view: 'home' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-tuc-maroon text-tuc-gold text-sm py-2 lg:py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0">
            {/* Left Contact Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
              <div className="flex items-start gap-2 max-w-[250px]">
                <MapPin className="flex-shrink-0 mt-1 w-4 h-4" />
                <span className="text-xs sm:text-sm">
                  Location: Oyibi (off Adenta - Dodowa Road) <br className="hidden sm:block" />
                  <a href="#top" className="underline hover:text-white transition-colors">GM-274-6332</a>
                </span>
              </div>
              <div className="hidden lg:block h-8 w-px bg-tuc-gold opacity-30"></div>
              <div className="flex flex-col text-xs sm:text-sm">
                <span>Email: info@tuc.edu.gh</span>
                <span>Postal: P. O. Box VV 179, Oyibi - Accra.</span>
              </div>
              <div className="hidden lg:block h-8 w-px bg-tuc-gold opacity-30"></div>
              <div className="flex flex-col text-xs sm:text-sm">
                <span>Mobile 1: +233 (0) 54 012 4400</span>
                <span>Mobile 2: +233 (0) 54 012 4488</span>
              </div>
            </div>

            {/* Right Socials & Gradient Text */}
            <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                  <a key={i} href="#top" className="bg-white/10 p-1.5 rounded hover:bg-tuc-gold hover:text-tuc-maroon transition-all duration-300" aria-label="Social Link">
                    <Icon size={14} />
                  </a>
                ))}
              </div>
              <div className="hidden xl:block font-semibold bg-clip-text text-transparent bg-gradient-to-r from-tuc-beige via-tuc-gold to-tuc-beige animate-pulse">
                January 2026 Admissions in Progress
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-24 lg:h-28">
            {/* Logo */}
            <div className="flex-shrink-0 w-48 sm:w-64 lg:w-72">
              <a href="#top" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
                <img 
                  src="https://aucdt.edu.gh/tuc/TUC_LOGO.png" 
                  alt="TUC Logo" 
                  className="w-full h-auto object-contain dark:brightness-110"
                />
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center flex-grow justify-end gap-2">
              <nav>
                <ul className="flex items-center gap-6 text-[15px] font-medium text-tuc-maroon dark:text-gray-200">
                  <li><a href="#top" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="hover:text-tuc-green transition-colors">Home</a></li>
                  <li className="relative group h-full py-8 cursor-pointer">
                    <span className="flex items-center hover:text-tuc-green transition-colors" tabIndex={0}>About Us</span>
                    {/* Dropdown placeholder */}
                    <div className="absolute top-full left-0 w-48 bg-white dark:bg-gray-800 shadow-lg border-t-4 border-tuc-gold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                      <ul className="py-2 text-sm text-gray-600 dark:text-gray-300">
                        <li><a href="#top" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-tuc-maroon">History</a></li>
                        <li><a href="#top" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-tuc-maroon">Vision & Mission</a></li>
                        <li><a href="#top" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-tuc-maroon">Governing Council</a></li>
                      </ul>
                    </div>
                  </li>
                  <li><a href="#top" className="hover:text-tuc-green transition-colors">Academics</a></li>
                  <li><a href="#top" className="hover:text-tuc-green transition-colors">Departments</a></li>
                  <li><a href="#top" className="hover:text-tuc-green transition-colors">Admissions</a></li>
                  <li><a href="#top" className="hover:text-tuc-green transition-colors">Newsroom</a></li>
                </ul>
              </nav>

              <div className="ml-6 flex items-center gap-4">
                <ThemeSwitcher theme={theme} setTheme={setTheme} />
                
                <a 
                  href="https://portal.tuc.edu.gh/admissions/#/home" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-tuc-gold text-tuc-maroon font-bold px-6 py-3 rounded shadow-md hover:bg-tuc-maroon hover:text-tuc-gold transition-all duration-300"
                >
                  APPLY NOW!
                </a>
                <button className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-tuc-maroon dark:text-gray-300" aria-label="Search">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-4">
              <ThemeSwitcher theme={theme} setTheme={setTheme} />
              <button onClick={toggleMenu} className="text-tuc-maroon dark:text-white p-2" aria-label="Toggle Menu">
                {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 absolute w-full left-0 top-full shadow-xl z-50">
            <ul className="flex flex-col py-4 text-tuc-maroon dark:text-gray-200 font-medium">
              <li><a href="#top" onClick={(e) => { e.preventDefault(); onNavigate('home'); setIsMenuOpen(false); }} className="block px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent hover:border-tuc-gold">Home</a></li>
              <li><a href="#top" className="block px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent hover:border-tuc-gold">About Us</a></li>
              <li><a href="#top" className="block px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent hover:border-tuc-gold">Academics</a></li>
              <li><a href="#top" className="block px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent hover:border-tuc-gold">Departments</a></li>
              <li><a href="#top" className="block px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent hover:border-tuc-gold">Admissions</a></li>
              <li><a href="#top" className="block px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent hover:border-tuc-gold">Newsroom</a></li>
              <li className="px-6 py-4">
                <a 
                  href="#top" 
                  className="block text-center bg-tuc-gold text-tuc-maroon font-bold px-6 py-3 rounded shadow-md"
                >
                  APPLY NOW!
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;