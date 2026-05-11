
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { LayoutDashboard, Calendar, BarChart2, FileJson, BookLock, Bell, FileText } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const commonLinks = [
    { to: '/', text: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/timetable', text: 'Timetable', icon: <Calendar size={20} /> },
    { to: '/notifications', text: 'Notifications', icon: <Bell size={20} /> },
  ];

  const adminLinks = [
    { to: '/reports', text: 'Reporting', icon: <BarChart2 size={20} /> },
    { to: '/data-management', text: 'Import/Export', icon: <FileJson size={20} /> },
    { to: '/audit-log', text: 'Audit Log', icon: <BookLock size={20} /> },
  ];

  const links = user?.role === UserRole.ADMIN ? [...commonLinks, ...adminLinks] : commonLinks;

  return (
    <div className="flex flex-col h-full bg-aucdt-brown text-white">
      <div className="p-4 border-b border-aucdt-green">
        <h2 className="text-2xl font-bold text-aucdt-gold">TMS</h2>
        <p className="text-xs text-gray-400">Timetable Management</p>
      </div>
      <nav className="flex-1 p-2">
        <ul>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 my-1 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-aucdt-green text-white'
                      : 'text-gray-300 hover:bg-aucdt-green/50 hover:text-white'
                  }`
                }
              >
                {link.icon}
                <span className="ml-4 font-medium">{link.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-aucdt-green">
        <a href="#/help" className="flex items-center text-gray-300 hover:text-white">
          <FileText size={20} />
          <span className="ml-4">User Manual</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
