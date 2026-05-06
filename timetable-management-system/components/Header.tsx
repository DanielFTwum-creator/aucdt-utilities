
import { Bell, LogOut, User as UserIcon } from 'lucide-react';
import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center">
            {children}
            <h1 className="text-xl md:text-2xl font-bold text-aucdt-green ml-4">TUC Timetable</h1>
        </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 text-aucdt-brown">
            <Bell size={20} />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <div className="flex items-center space-x-2">
            <UserIcon size={20} className="text-aucdt-brown"/>
          <div>
            <div className="font-semibold">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.role}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-aucdt-green rounded-md hover:bg-aucdt-green/90 transition-colors"
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
