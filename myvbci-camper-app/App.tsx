import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import CampRegistration from './pages/CampRegistration';
import AdminCamps from './pages/AdminCamps';
import AdminRooms from './pages/AdminRooms';
import AdminNotifications from './pages/AdminNotifications';
import AdminTesting from './pages/AdminTesting';
import { AIAssistant } from './components/AIAssistant';
import { UserRole } from './types';

// Placeholder components for other routes
const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-in fade-in zoom-in duration-500">
    <div className="text-6xl mb-4 grayscale opacity-50">🚧</div>
    <h2 className="text-2xl font-bold text-slate-600 mb-2">{title}</h2>
    <p className="text-slate-400">This feature is currently under construction.</p>
  </div>
);

const AppContent: React.FC = () => {
  const { currentUser } = useStore();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!currentUser) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return currentUser.role === UserRole.ADMIN ? <AdminDashboard /> : <CampRegistration onBack={() => setCurrentPage('profile')} />;
      case 'camps':
        return currentUser.role === UserRole.ADMIN ? <AdminCamps /> : <CampRegistration onBack={() => setCurrentPage('profile')} />;
      case 'rooms':
        return currentUser.role === UserRole.ADMIN ? <AdminRooms /> : <ComingSoon title="Room Allocation" />;
      case 'notifications':
        return currentUser.role === UserRole.ADMIN ? <AdminNotifications /> : <ComingSoon title="Notifications" />;
      case 'reports':
        return <ComingSoon title="Financial Reports" />;
      case 'testing':
        return currentUser.role === UserRole.ADMIN ? <AdminTesting /> : <ComingSoon title="Testing" />;
      case 'profile':
        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-6 text-vbci-navy border-b pb-4">My Profile</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100 items-center">
                        <span className="text-slate-500 col-span-1">Full Name</span>
                        <span className="font-medium text-slate-800 col-span-2">{currentUser.full_name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100 items-center">
                        <span className="text-slate-500 col-span-1">Email Address</span>
                        <span className="font-medium text-slate-800 col-span-2">{currentUser.email}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100 items-center">
                        <span className="text-slate-500 col-span-1">Account Type</span>
                        <div className="col-span-2">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentUser.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                {currentUser.role}
                            </span>
                        </div>
                    </div>
                     <div className="grid grid-cols-3 gap-4 py-3 items-center">
                        <span className="text-slate-500 col-span-1">Member Since</span>
                        <span className="font-medium text-slate-800 col-span-2">{new Date(currentUser.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
      {currentUser.role === UserRole.CAMPER && <AIAssistant />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
