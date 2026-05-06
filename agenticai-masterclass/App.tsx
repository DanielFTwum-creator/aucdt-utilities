import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './components/ThemeProvider';
import { LandingPage } from './pages/LandingPage';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminLogin } from './pages/Admin/AdminLogin';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleAdminLogout = () => {
      setIsAdminAuthenticated(false);
      window.location.hash = '#/';
  };

  const renderContent = () => {
    if (route.startsWith('#/admin')) {
      if (!isAdminAuthenticated) {
          return <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />;
      }
      return <AdminDashboard onLogout={handleAdminLogout} />;
    }
    
    // Default Route
    return <LandingPage />;
  };

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key={route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default App;