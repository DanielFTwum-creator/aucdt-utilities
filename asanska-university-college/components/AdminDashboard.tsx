import React, { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import SelfTestDashboard from './SelfTestDashboard';
import { BeakerIcon } from './Icons';

type Tab = 'dashboard' | 'testing';

const AdminDashboard: React.FC<{ onLogout: () => void; }> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

    return (
        <div className="min-h-screen bg-aucdt-background dark:bg-gray-900 text-aucdt-dark-text dark:text-gray-200">
            <div className="bg-white dark:bg-gray-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-aucdt-primary dark:text-white">Admin Dashboard</h1>
                        <button
                            onClick={onLogout}
                            className="bg-aucdt-primary text-white font-bold py-2 px-6 rounded-full text-sm hover:bg-aucdt-secondary hover:text-aucdt-primary transition-all duration-300"
                        >
                            Log Out
                        </button>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`${
                                    activeTab === 'dashboard'
                                    ? 'border-aucdt-secondary text-aucdt-primary dark:border-amber-400 dark:text-amber-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('testing')}
                                className={`${
                                    activeTab === 'testing'
                                    ? 'border-aucdt-secondary text-aucdt-primary dark:border-amber-400 dark:text-amber-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                            >
                                <BeakerIcon className="w-5 h-5 mr-2" />
                                Puppeteer Self-Test
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {activeTab === 'dashboard' && (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-aucdt-primary dark:text-white mb-4">Welcome, Administrator.</h2>
                        <p className="text-xl mb-8">Select a tab to manage the application.</p>
                        
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 inline-flex items-center space-x-4">
                            <span className="font-semibold">Theme Control:</span>
                            <ThemeSwitcher />
                        </div>
                    </div>
                )}
                {activeTab === 'testing' && (
                    <SelfTestDashboard />
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;