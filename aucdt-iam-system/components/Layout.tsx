import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Role, Theme, User } from '../types';
import ThemeSwitcher from './ThemeSwitcher';

interface LayoutProps {
  user: User | null;
  theme: Theme;
  setTheme: (t: Theme) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, theme, setTheme, onLogout, children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkcard';

  if (!user) return <>{children}</>;

  return (
    <div className={`flex h-screen overflow-hidden`}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-darkcard shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col border-r dark:border-gray-700`}>
        <div className="flex flex-col items-center justify-center h-20 border-b dark:border-gray-700 bg-primary text-white font-bold">
          <div className="flex items-center">
             <i className="fas fa-graduation-cap text-secondary text-2xl mr-2" aria-hidden="true"></i> 
             <span className="text-xl tracking-wider">AUCDT</span>
          </div>
          <span className="text-[10px] text-secondary font-normal uppercase tracking-widest">IAM System</span>
        </div>
        <nav className="mt-5 px-4 space-y-2 flex-1" aria-label="Main Navigation">
          <Link to="/" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/')}`}>
            <i className="fas fa-tachometer-alt w-6" aria-hidden="true"></i> Dashboard
          </Link>
          
          {(user.role === Role.STUDENT || user.role === Role.ORGANIZATION) && (
            <Link to="/logbook" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/logbook')}`}>
              <i className="fas fa-book w-6" aria-hidden="true"></i> Logbook
            </Link>
          )}

          <Link to="/messages" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/messages')}`}>
            <i className="fas fa-envelope w-6" aria-hidden="true"></i> Messages
          </Link>

          {user.role === Role.STUDENT && (
            <Link to="/reports" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/reports')}`}>
              <i className="fas fa-file-pdf w-6" aria-hidden="true"></i> Reports
            </Link>
          )}

          {user.role === Role.ADMIN && (
            <Link to="/admin" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/admin')}`}>
              <i className="fas fa-shield-alt w-6" aria-hidden="true"></i> Admin Tools
            </Link>
          )}
        </nav>
        
        <div className="p-4 border-t dark:border-gray-700 space-y-2">
             <Link to="/docs" className={`flex items-center px-4 py-2 rounded-lg transition-colors text-sm ${isActive('/docs')}`}>
                <i className="fas fa-book-open w-6" aria-hidden="true"></i> Documentation
             </Link>
             <button 
                onClick={onLogout} 
                className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Logout"
             >
                <i className="fas fa-sign-out-alt w-6" aria-hidden="true"></i> Logout
             </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-darkcard shadow flex items-center justify-between px-6 z-10 border-b dark:border-gray-700" role="banner">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            className="md:hidden text-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
            aria-label="Toggle Sidebar"
            aria-expanded={isSidebarOpen}
          >
            <i className="fas fa-bars text-xl" aria-hidden="true"></i>
          </button>
          
          <div className="hidden md:block">
             <h1 className="text-lg font-bold text-primary dark:text-secondary">Asanska University College of Design and Technology</h1>
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <ThemeSwitcher onThemeChange={setTheme} />
            <div className="flex items-center space-x-2" role="status" aria-label="Current User">
                <img src={user.avatar} alt="" className="w-8 h-8 rounded-full border border-gray-200" aria-hidden="true" />
                <span className="text-sm font-medium hidden sm:block text-gray-800 dark:text-gray-200">{user.name} <span className="text-xs text-gray-500 dark:text-gray-400">({user.role})</span></span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-darkbg p-6" role="main">
          {children}
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
            onClick={() => setSidebarOpen(false)} 
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            aria-hidden="true"
        ></div>
      )}
    </div>
  );
};