import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ContentManager from './components/ContentManager';
import AssetLibrary from './components/AssetLibrary';
import EventManager from './components/EventManager';
import AnalyticsView from './components/AnalyticsView';
import AdminPanel from './components/AdminPanel';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'content':
        return <ContentManager />;
      case 'assets':
        return <AssetLibrary />;
      case 'events':
        return <EventManager />;
      case 'analytics':
        return <AnalyticsView />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            {renderContent()}
          </Layout>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;