import React, { useState, useEffect } from 'react';
import { ZoneID } from './types';
import { ZONES_DATA } from './data/zones';
import WorldMap from './components/WorldMap';
import ZoneDetail from './components/ZoneDetail';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import SelfTestDashboard from './components/SelfTestDashboard';

export type View = 'map' | 'zone' | 'admin_login' | 'admin_dashboard' | 'self_test';
export type Theme = 'light' | 'dark' | 'high-contrast';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('map');
  const [currentZoneId, setCurrentZoneId] = useState<ZoneID | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
  }, [theme]);

  const handleSelectZone = (zoneId: ZoneID) => {
    setCurrentZoneId(zoneId);
    setCurrentView('zone');
  };

  const handleBackToMap = () => {
    setCurrentZoneId(null);
    setCurrentView('map');
  };
  
  const handleNavigateToAdminLogin = () => {
    setCurrentView('admin_login');
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('admin_dashboard');
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('map');
  };

  const handleNavigateToSelfTest = () => {
    if (isAuthenticated) {
      setCurrentView('self_test');
    }
  };

  const handleBackToAdmin = () => {
    setCurrentView('admin_dashboard');
  }

  const renderContent = () => {
    switch(currentView) {
      case 'zone':
        const currentZone = ZONES_DATA.find(zone => zone.id === currentZoneId);
        if (currentZone) {
            return <ZoneDetail zone={currentZone} onBack={handleBackToMap} theme={theme} setTheme={setTheme} />;
        }
        // Fallback to map if zone is not found
        setCurrentView('map');
        return <WorldMap zones={ZONES_DATA} onSelectZone={handleSelectZone} onAdminClick={handleNavigateToAdminLogin} theme={theme} setTheme={setTheme} />;
      case 'admin_login':
        return <AdminLogin onLoginSuccess={handleLoginSuccess} onBack={handleBackToMap} />;
      case 'admin_dashboard':
        return <AdminDashboard onLogout={handleLogout} onNavigateToSelfTest={handleNavigateToSelfTest} />;
      case 'self_test':
        return <SelfTestDashboard onBack={handleBackToAdmin} />;
      case 'map':
      default:
        return <WorldMap zones={ZONES_DATA} onSelectZone={handleSelectZone} onAdminClick={handleNavigateToAdminLogin} theme={theme} setTheme={setTheme} />;
    }
  }

  return (
    <div className={`w-screen h-screen bg-sky-100 dark:bg-gray-900 overflow-hidden font-sans antialiased hc-bg-primary hc-text-primary`}>
      <div className="transition-opacity duration-500 ease-in-out h-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
