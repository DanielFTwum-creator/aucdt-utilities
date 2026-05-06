import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { ROUTES, AVATAR_PLACEHOLDER_URL } from '../../constants';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // In a real app, navigate to a search results page
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      {/* Left section: Menu icon, Logo, App Name */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onMenuClick} className="lg:hidden" aria-label="Open sidebar menu">
          <Menu size={24} />
        </Button>
        <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2">
          <img src="https://picsum.photos/40/40" alt="6R Workshop Logo" className="h-8 w-8 rounded-full" />
          <span className="text-xl font-bold text-text-light dark:text-text-dark hidden md:block">6R Workshop</span>
        </Link>
      </div>

      {/* Centre section: Search Bar */}
      <div className="flex-1 max-w-lg mx-4 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Input
            type="search"
            placeholder="Search modules, quests, resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-blue-500 focus:ring-primary dark:focus:ring-blue-500"
            aria-label="Search"
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </form>
      </div>

      {/* Right section: Notifications, User Avatar, Theme Toggle */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <Button variant="ghost" size="sm" aria-label="Notifications">
          <Bell size={20} />
          {/* Example notification badge */}
          <span className="absolute top-1 right-1 h-2 w-2 bg-error rounded-full"></span>
        </Button>

        {/* Theme Toggle */}
        <Button onClick={toggleTheme} variant="ghost" size="sm" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
        </Button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center space-x-2 focus:outline-none"
            aria-label="User profile menu"
            aria-haspopup="true"
            aria-expanded={isProfileMenuOpen}
          >
            <img
              src={user?.avatarUrl || AVATAR_PLACEHOLDER_URL}
              alt={user?.fullName || 'User'}
              className="h-9 w-9 rounded-full border-2 border-primary object-cover"
            />
          </button>
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
              <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-600">
                Signed in as <strong className="font-semibold">{user?.fullName || 'Guest'}</strong>
              </span>
              <Link to={ROUTES.PROFILE} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => setIsProfileMenuOpen(false)}>
                <User size={16} className="mr-2" /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-error hover:bg-red-50 dark:hover:bg-red-800"
                role="menuitem"
              >
                <LogOut size={16} className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;