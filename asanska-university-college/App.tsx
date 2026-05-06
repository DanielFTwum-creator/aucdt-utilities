import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Welcome from './components/Welcome';
import Programs from './components/Programs';
import WhatToExpect from './components/WhatToExpect';
import HowToApply from './components/HowToApply';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import EntryRequirements from './components/EntryRequirements';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { logAdminAction } from './utils/logger';

const PublicSite: React.FC<{ onAdminLoginClick: () => void }> = ({ onAdminLoginClick }) => (
  <>
    <Header />
    <main>
      <Hero />
      <Welcome />
      <Programs />
      <WhatToExpect />
      <HowToApply />
      <EntryRequirements />
      <Gallery />
    </main>
    <Footer onAdminLoginClick={onAdminLoginClick} />
  </>
);


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    logAdminAction('Admin successfully logged in.');
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    logAdminAction('Admin logged out.');
  };

  return (
    <div className="bg-aucdt-background dark:bg-gray-900 text-aucdt-dark-text dark:text-gray-200 overflow-x-hidden theme-high-contrast:bg-black theme-high-contrast:text-white">
      {isLoggedIn ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <PublicSite onAdminLoginClick={() => setShowLogin(true)} />
      )}
      {showLogin && <AdminLogin onLoginSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default App;
