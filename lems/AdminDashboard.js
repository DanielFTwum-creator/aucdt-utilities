import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import OverviewTab from '../components/tabs/OverviewTab';
import ResultsTab from '../components/tabs/ResultsTab';
import LecturersTab from '../components/tabs/LecturersTab';
import ProgrammesTab from '../components/tabs/ProgrammesTab';
import AnalyticsTab from '../components/tabs/AnalyticsTab';
import AdminPanelTab from '../components/tabs/AdminPanelTab';
import GuidesTab from '../components/tabs/GuidesTab';
import SelfTestTab from '../components/tabs/SelfTestTab';
import '../styles/AdminDashboard.css';

function AdminDashboard({ theme, onThemeChange, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'programmes', label: 'Programmes' },
    { id: 'results', label: 'Results' },
    { id: 'lecturers', label: 'Lecturers' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'guides', label: 'Guides' },
    { id: 'admin', label: 'Admin Panel' },
    { id: 'selftest', label: 'Self Test' },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'programmes':
        return <ProgrammesTab />;
      case 'results':
        return <ResultsTab />;
      case 'lecturers':
        return <LecturersTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'guides':
        return <GuidesTab />;
      case 'admin':
        return <AdminPanelTab />;
      case 'selftest':
        return <SelfTestTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="admin-dashboard">
      <Header theme={theme} onThemeChange={onThemeChange} />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="tabs-navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

