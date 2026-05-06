import React, { useState } from 'react';
import { Aulogo, MenuIcon, CloseIcon } from './Icons';
import ThemeSwitcher from './ThemeSwitcher';

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <li>
    <a href={href} className="text-aucdt-primary dark:text-gray-200 theme-high-contrast:text-yellow-300 font-semibold hover:text-aucdt-secondary dark:hover:text-amber-400 transition-colors duration-300">
      {children}
    </a>
  </li>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-aucdt-background dark:bg-gray-800 theme-high-contrast:bg-black sticky top-0 z-50 shadow-md">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <a href="/" title="Home" className="flex items-center space-x-2">
                <Aulogo className="h-12 w-auto" />
                <div>
                  <span className="block font-bold text-aucdt-primary dark:text-gray-100 theme-high-contrast:text-white text-lg leading-tight">ASANSKA UNIVERSITY COLLEGE</span>
                  <span className="block text-aucdt-primary dark:text-gray-300 theme-high-contrast:text-gray-200 text-xs leading-tight">OF DESIGN AND TECHNOLOGY</span>
                </div>
              </a>
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="hidden lg:block">
                <ul className="flex items-center space-x-8">
                  <NavLink href="#top">Home</NavLink>
                  <NavLink href="#top">About Us</NavLink>
                  <NavLink href="#programs">Programmes</NavLink>
                  <NavLink href="#top">Admissions</NavLink>
                  <NavLink href="#top">Contact Us</NavLink>
                </ul>
              </nav>
              <ThemeSwitcher />
              <div className="lg:hidden">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="p-2" 
                  aria-label="Open main menu"
                  aria-expanded={isMenuOpen}
                >
                  {isMenuOpen ? <CloseIcon className="w-6 h-6 text-aucdt-primary dark:text-gray-200" /> : <MenuIcon className="w-6 h-6 text-aucdt-primary dark:text-gray-200" />}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 w-full bg-aucdt-background dark:bg-gray-800 theme-high-contrast:bg-black shadow-lg transition-transform duration-300 ease-in-out ${isMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-full'}`}>
          <nav className="p-6">
            <ul className="flex flex-col space-y-4 text-center">
              <NavLink href="#top">Home</NavLink>
              <NavLink href="#top">About Us</NavLink>
              <NavLink href="#programs">Programmes</NavLink>
              <NavLink href="#top">Admissions</NavLink>
              <NavLink href="#top">Contact Us</NavLink>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
