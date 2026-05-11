
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-aucdt-light text-aucdt-brown">
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-aucdt-brown text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-shrink-0`}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header>
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 text-aucdt-brown focus:outline-none focus:ring-2 focus:ring-inset focus:ring-aucdt-gold"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </Header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-aucdt-light p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
