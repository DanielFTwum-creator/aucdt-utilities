import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { 
  LayoutDashboard, Tent, Users, Calendar, 
  LogOut, Menu, Bell, FlaskConical 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { currentUser, logout, notifications } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const role = currentUser?.role;

  // Filter notifications based on user role
  const myNotifications = notifications.filter(n => {
      if (n.audience === 'All') return true;
      if (currentUser?.role === UserRole.ADMIN && n.audience === 'Admins') return true;
      if (currentUser?.role === UserRole.CAMPER && n.audience === 'Campers') return true;
      return false;
  });

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = role === UserRole.ADMIN ? [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'camps', label: 'Manage Camps', icon: Tent },
    { id: 'rooms', label: 'Room Allocation', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'reports', label: 'Reports', icon: Calendar },
    { id: 'testing', label: 'Testing', icon: FlaskConical },
  ] : [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'camps', label: 'Browse Camps', icon: Tent },
    { id: 'profile', label: 'My Profile', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        aria-label="Main navigation sidebar"
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-vbci-navy text-white transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-20 flex items-center px-8 border-b border-white/10">
            <div className="w-8 h-8 bg-vbci-gold rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                <span className="text-vbci-navy font-bold">V</span>
            </div>
          <span className="text-xl font-bold tracking-wide">myVBCI</span>
        </div>

        <nav aria-label="Site navigation" className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setSidebarOpen(false);
              }}
              aria-label={item.label}
              aria-current={currentPage === item.id ? 'page' : undefined}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-vbci-gold text-vbci-navy font-bold'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
          <button
            onClick={logout}
            aria-label="Sign out"
            className="w-full flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header role="banner" aria-label="Application header" className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-10">
          <button
            className="lg:hidden text-slate-500 hover:text-vbci-navy"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
          >
            <Menu className="w-6 h-6" aria-hidden="true" />
          </button>

          <div className="flex items-center space-x-4 ml-auto" ref={notifRef}>
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-slate-800">
                {currentUser?.title} {currentUser?.full_name}
              </span>
              <span className="text-xs text-slate-500 capitalize">{currentUser?.role.toLowerCase()}</span>
            </div>

            <div className="relative">
                <button
                  aria-label={`Notifications${myNotifications.length > 0 ? ` (${myNotifications.length} unread)` : ''}`}
                  aria-expanded={notificationsOpen}
                  aria-haspopup="true"
                  className={`p-2 rounded-full relative transition-colors ${notificationsOpen ? 'bg-slate-100 text-vbci-navy' : 'text-slate-400 hover:text-vbci-navy hover:bg-slate-100'}`}
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell className="w-5 h-5" />
                  {myNotifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                      <span className="bg-vbci-navy text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{myNotifications.length}</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {myNotifications.length === 0 ? (
                        <div className="p-8 text-center">
                           <Bell className="w-8 h-8 mx-auto text-slate-200 mb-2" />
                           <p className="text-slate-500 text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        myNotifications.map(n => (
                          <div key={n.id} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group text-left">
                             <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border ${
                                  n.type === 'Urgent' ? 'bg-red-50 text-red-700 border-red-100' :
                                  n.type === 'Warning' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                  n.type === 'Success' ? 'bg-green-50 text-green-700 border-green-100' :
                                  'bg-blue-50 text-blue-700 border-blue-100'
                                }`}>
                                  {n.type}
                                </span>
                                <span className="text-[10px] text-slate-400">{new Date(n.date).toLocaleDateString()}</span>
                             </div>
                             <h4 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-vbci-navy transition-colors">{n.title}</h4>
                             <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
            </div>

            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
               {currentUser?.full_name.charAt(0)}
            </div>
          </div>
        </header>

        <main id="main-content" aria-label="Page content" className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
