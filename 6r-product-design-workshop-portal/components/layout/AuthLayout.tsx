import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import Button from '../ui/Button';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-blue-50/10 dark:from-background-dark dark:to-gray-900 transition-colors duration-500 p-4">
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <Button onClick={toggleTheme} variant="ghost" size="sm" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
        </Button>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 space-y-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <Link to="/" className="inline-block mb-4">
            <img src="https://picsum.photos/60/60" alt="6R Workshop Logo" className="mx-auto h-16 w-16 rounded-full" />
          </Link>
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">{title}</h1>
          <p className="mt-2 text-subtle-text-light dark:text-subtle-text-dark">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;