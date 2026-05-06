import React from 'react';
import { NavLink, Link } from 'react-router-dom'; // Fix: Import Link
import { Home, BookOpen, Layout, Briefcase, Users, X } from 'lucide-react';
import { ROUTES, MODULES_DATA } from '../../constants';
import Button from '../ui/Button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: Home },
    { name: 'Modules', path: ROUTES.MODULES, icon: BookOpen },
    { name: 'Portfolio', path: ROUTES.PORTFOLIO, icon: Briefcase },
    { name: 'Showcase', path: ROUTES.SHOWCASE, icon: Users },
    { name: 'Profile', path: ROUTES.PROFILE, icon: Layout },
  ];

  return (
    <>
      {/* Overlay for mobile sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg p-4 z-50 transform transition-transform duration-300 ease-in-out
                   lg:relative lg:translate-x-0 lg:shadow-none
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2 text-xl font-bold text-primary dark:text-blue-400">
            <img src="https://picsum.photos/40/40" alt="6R Workshop Logo" className="h-8 w-8 rounded-full" />
            <span>6R Workshop</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden" aria-label="Close sidebar">
            <X size={24} />
          </Button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path.split('/')[1] === 'modules' ? `${ROUTES.MODULES}/${MODULES_DATA[0].id}` : item.path} // Link to first module if path is /modules
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md transition-colors duration-200
                 ${isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`
              }
            >
              <item.icon size={20} className="mr-3" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Module Sub-navigation (example for Modules link) */}
        {/*
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Modules</h4>
          <nav className="space-y-1">
            {MODULES_DATA.map((module) => (
              <NavLink
                key={module.id}
                to={`${ROUTES.MODULES}/${module.id}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center pl-6 pr-4 py-1.5 rounded-md text-sm transition-colors duration-200
                   ${isActive
                    ? 'bg-primary/20 text-primary dark:bg-blue-900/30 dark:text-blue-300 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`
                }
              >
                <span>{module.id}: {module.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        */}
      </aside>
    </>
  );
};

export default Sidebar;