import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeSwitcher from '../ThemeSwitcher';
import Button from '../common/Button';

const TechbridgeLogo = () => (
  <img 
    src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" 
    alt="Techbridge Logo" 
    className="h-10 w-auto object-contain transition-transform group-hover:scale-110 duration-300"
  />
);

const Header: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive ? 'nav-active' : 'nav-inactive'
    }`;

  return (
    <header data-component="header" className="backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-[var(--color-border-header)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <TechbridgeLogo />
              <div className="ml-3 flex items-center">
                <span data-component="header-title-brand" className="text-lg sm:text-xl font-black tracking-wider uppercase">TECHBRIDGE</span>
                <span className="mx-2 h-6 w-[2px] bg-white/20 hidden sm:block"></span>
                <span data-component="header-title-app" className="text-base sm:text-lg font-medium opacity-90 tracking-tight">TSAP</span>
              </div>
            </Link>
            <div className="hidden lg:block">
              <div className="ml-10 flex items-baseline space-x-2">
                <NavLink to="/" className={navLinkClasses} end>
                  Calculator
                </NavLink>
                <NavLink to="/history" className={navLinkClasses}>
                  History
                </NavLink>
                <NavLink to="/admin" className={navLinkClasses}>
                  Admin Panel
                </NavLink>
                <NavLink to="/self-test" className={navLinkClasses}>
                  Self-Test
                </NavLink>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeSwitcher />
            <div className="h-6 w-[1px] bg-white/10 hidden sm:block mx-1"></div>
            <Button onClick={handleLogout} variant="secondary" className="!py-1.5 !px-4 text-xs font-bold uppercase tracking-wider">
              Logout
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;