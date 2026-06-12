import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import OverviewTab from './OverviewTab';
import ResultsTab from './ResultsTab';
import LecturersTab from './LecturersTab';
import ProgrammesTab from './ProgrammesTab';
import AnalyticsTab from './AnalyticsTab';
import AdminPanelTab from './AdminPanelTab';
import GuidesTab from './GuidesTab';
import SelfTestTab from './SelfTestTab';
import './AdminDashboard.css';

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

