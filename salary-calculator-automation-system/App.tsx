import React, { useState } from 'react';
import LoginScreen from './components/Login';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return <MainLayout onLogout={handleLogout} />;
};

export default App;
