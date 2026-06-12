
import React, { useState } from 'react';
import { DashboardOverview } from './DashboardOverview';
import { PdfUploader } from './PdfUploader';
import { AuditLogViewer } from './AuditLogViewer';
import { SelfTestRunner } from './SelfTestRunner';

type Tab = 'overview' | 'curriculum' | 'audit' | 'testing';

const IconBook = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const IconChart = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const IconShield = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const IconBeaker = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-.477-2.387zM12 12V3m0 0l-3 3m3-3l3 3" /></svg>

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    
    const tabs = [
        { id: 'overview', label: 'Overview', icon: <IconChart /> },
        { id: 'curriculum', label: 'Curriculum AI', icon: <IconBook /> },
        { id: 'audit', label: 'Audit Log', icon: <IconShield /> },
        { id: 'testing', label: 'Self-Testing', icon: <IconBeaker /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <DashboardOverview />;
            case 'curriculum': return <PdfUploader />;
            case 'audit': return <AuditLogViewer />;
            case 'testing': return <SelfTestRunner />;
            default: return null;
        }
    };
    
    return (
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">Administrator Dashboard</h1>
            <div className="flex flex-col md:flex-row md:space-x-6">
                <div className="md:w-1/4 mb-6 md:mb-0">
                    <nav 
                        role="tablist"
                        aria-label="Admin Dashboard Tabs"
                        className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto pb-2"
                    >
                        {tabs.map(tab => (
                             <button
                                key={tab.id}
                                id={`tab-${tab.id}`}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                aria-controls={`panel-${tab.id}`}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`flex items-center text-left w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="md:w-3/4">
                    <div 
                        id={`panel-${activeTab}`}
                        role="tabpanel"
                        tabIndex={0}
                        aria-labelledby={`tab-${activeTab}`}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};
