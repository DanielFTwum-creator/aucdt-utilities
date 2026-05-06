import React from 'react';
import { Sun, Moon, Contrast, Phone, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { DashboardTab } from '../types';

interface NavbarProps {
  isAuthenticated: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
  onNavigateToTab: (tab: DashboardTab) => void;
  theme: 'light' | 'dark' | 'high-contrast';
  onToggleTheme: () => void;
}

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button onClick={onClick} className="text-[#F4E4BC] hover:text-white hover:bg-white/10 transition-colors duration-200 font-medium px-3 py-2 rounded-md text-sm [.high-contrast_&]:text-yellow-300 [.high-contrast_&]:hover:bg-yellow-300 [.high-contrast_&]:hover:text-black">
        {children}
    </button>
);

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onAdminClick, onLogout, onNavigateToTab, theme, onToggleTheme }) => {
  return (
    <nav className="bg-[#8B1538] sticky top-0 z-50 [.high-contrast_&]:bg-black [.high-contrast_&]:border-b-2 [.high-contrast_&]:border-yellow-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
             <div className="text-white text-xl font-bold tracking-wide [.high-contrast_&]:text-yellow-300">
                Assessment Portal
             </div>
             <div className="hidden lg:flex items-center space-x-4 text-xs text-[#F4E4BC] [.high-contrast_&]:text-yellow-300 border-l border-white/20 pl-4">
                <div className="flex items-center gap-1">
                    <Phone size={14}/>
                    <span>+233 (0) 54 012 4400</span>
                </div>
                 <div className="flex items-center gap-1">
                    <Phone size={14}/>
                    <span>+233 (0) 54 012 4488</span>
                </div>
             </div>
            {isAuthenticated && (
                <div className="hidden md:flex items-center space-x-1">
                    <NavLink onClick={() => onNavigateToTab('overview')}>Dashboard</NavLink>
                    <NavLink onClick={() => onNavigateToTab('programmes')}>Programmes</NavLink>
                    <NavLink onClick={() => onNavigateToTab('evaluations')}>Results</NavLink>
                    <NavLink onClick={() => onNavigateToTab('lecturers')}>Lecturers</NavLink>
                    <NavLink onClick={() => onNavigateToTab('analytics')}>Analytics</NavLink>
                    <NavLink onClick={() => onNavigateToTab('guides')}>Guides</NavLink>
                    <NavLink onClick={() => onNavigateToTab('selfTest')}>Self Test</NavLink>
                    <NavLink onClick={() => onNavigateToTab('admin')}>Admin Panel</NavLink>
                </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-1 text-[#F4E4BC] hover:text-white transition-colors [.high-contrast_&]:text-yellow-300"><Facebook size={18} /></a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)" className="p-1 text-[#F4E4BC] hover:text-white transition-colors [.high-contrast_&]:text-yellow-300"><svg role="img" aria-hidden="true" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-1 text-[#F4E4BC] hover:text-white transition-colors [.high-contrast_&]:text-yellow-300"><Instagram size={18} /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-1 text-[#F4E4BC] hover:text-white transition-colors [.high-contrast_&]:text-yellow-300"><Linkedin size={18} /></a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Youtube" className="p-1 text-[#F4E4BC] hover:text-white transition-colors [.high-contrast_&]:text-yellow-300"><Youtube size={18} /></a>
            </div>
            {isAuthenticated ? (
                <>
                    <button
                        onClick={onToggleTheme}
                        className="p-2 rounded-full text-[#F4E4BC] hover:text-white hover:bg-white/10 transition-colors [.high-contrast_&]:text-yellow-300"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <Moon size={20} /> : theme === 'dark' ? <Contrast size={20} /> : <Sun size={20} />}
                    </button>
                    <button
                      onClick={onLogout}
                      className="bg-transparent border border-[#F4E4BC] text-[#F4E4BC] font-bold py-2 px-4 rounded-lg hover:bg-[#F4E4BC] hover:text-[#6B1028] transition-colors duration-200 text-sm [.high-contrast_&]:bg-black [.high-contrast_&]:border-2 [.high-contrast_&]:border-yellow-300 [.high-contrast_&]:text-yellow-300 [.high-contrast_&]:hover:bg-yellow-300 [.high-contrast_&]:hover:text-black"
                    >
                      Logout
                    </button>
                </>
            ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onToggleTheme}
                    className="p-2 rounded-full text-[#F4E4BC] hover:text-white hover:bg-white/10 transition-colors [.high-contrast_&]:text-yellow-300"
                    aria-label="Toggle theme"
                  >
                    {theme === 'light' ? <Moon size={20} /> : theme === 'dark' ? <Contrast size={20} /> : <Sun size={20} />}
                  </button>
                  <button
                    onClick={onAdminClick}
                    className="bg-[#D4AF37] hover:bg-opacity-90 text-[#6B1028] font-bold py-2 px-4 rounded-lg transition-colors text-sm [.high-contrast_&]:bg-yellow-300 [.high-contrast_&]:hover:bg-yellow-400"
                  >
                    Admin
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;