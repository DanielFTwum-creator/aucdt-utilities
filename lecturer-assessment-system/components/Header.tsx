
import React from 'react';
import type { Tab } from '../types';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = ['Dashboard', 'Programmes', 'Submit Assessment', 'Results', 'Lecturers', 'Analytics', 'Admin'];

  return (
    <header className="bg-brand-primary-dark shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-text-light">Lecturer Assessment System</h1>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out
                    ${activeTab === tab 
                      ? 'bg-brand-secondary text-brand-primary-dark' 
                      : 'text-gray-300 hover:bg-brand-primary hover:text-brand-text-light'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </nav>
          <div className="md:hidden">
            <select
                onChange={(e) => onTabChange(e.target.value as Tab)}
                value={activeTab}
                className="bg-brand-primary text-brand-text-light rounded-md p-2"
            >
                {tabs.map(tab => <option key={tab} value={tab}>{tab}</option>)}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;