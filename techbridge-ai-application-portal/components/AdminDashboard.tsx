import React, { useState } from 'react';
import { getAuditLogs, logAction } from '../services/auditService';
import { runSelfTests } from '../tests/selfTests';

import { TestResult } from '../types';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const logs = getAuditLogs().reverse();
    const [activeTab, setActiveTab] = useState('audit');
    const [isTesting, setIsTesting] = useState(false);
    const [testResults, setTestResults] = useState<TestResult[]>([]);

    const handleRunTests = async () => {
        setIsTesting(true);
        setTestResults([]);
        logAction('Admin started Puppeteer self-test suite');
        
        const onProgress = (result: TestResult) => {
            setTestResults(prevResults => [...prevResults, result]);
        };

        await runSelfTests(onProgress);

        setIsTesting(false);
        logAction('Admin finished Puppeteer self-test suite');
    };

    return (
        <div className="min-h-screen bg-brand-ink text-brand-cream p-4 sm:p-6 lg:p-8 font-cormorant relative">
            <div className="grain-overlay"></div>
            <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex justify-between items-end mb-8 border-b border-brand-gold/30 pb-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-brand-cream uppercase tracking-tight">Admin Dashboard</h1>
                        <p className="text-brand-gold italic text-lg mt-1">System Diagnostics & Security Logs</p>
                    </div>
                    <button onClick={onLogout} className="py-2 px-6 bg-transparent border border-brand-gold text-brand-gold font-bebas tracking-wider hover:bg-brand-gold hover:text-brand-ink transition-all uppercase text-lg">Logout</button>
                </div>

                <div className="mb-8">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('audit')}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-bebas text-xl tracking-wide transition-colors ${
                                activeTab === 'audit'
                                    ? 'border-brand-gold text-brand-gold'
                                    : 'border-transparent text-brand-gold-pale/50 hover:text-brand-gold-pale hover:border-brand-gold/30'
                            }`}
                            aria-current={activeTab === 'audit' ? 'page' : undefined}
                        >
                            Audit Log
                        </button>
                        <button
                            onClick={() => setActiveTab('testing')}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-bebas text-xl tracking-wide transition-colors ${
                                activeTab === 'testing'
                                    ? 'border-brand-gold text-brand-gold'
                                    : 'border-transparent text-brand-gold-pale/50 hover:text-brand-gold-pale hover:border-brand-gold/30'
                            }`}
                            aria-current={activeTab === 'testing' ? 'page' : undefined}
                        >
                            Puppeteer Self-Test
                        </button>
                    </nav>
                </div>

                {activeTab === 'audit' && (
                    <div className="bg-brand-card-bg border border-brand-gold/20 p-6 shadow-2xl">
                        <h2 className="text-2xl font-playfair italic text-brand-gold mb-4">System Activity Log</h2>
                        <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {logs.length > 0 ? (
                                <ul className="space-y-0 divide-y divide-brand-gold/10">
                                    {logs.map((log, index) => (
                                        <li key={index} className="text-sm p-3 hover:bg-brand-gold/5 transition-colors flex justify-between items-center font-dm-sans">
                                            <span className="text-brand-cream">{log.action}</span>
                                            <span className="font-mono text-brand-gold-pale/60 text-xs">{new Date(log.timestamp).toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-brand-gold-pale/50 italic">No audit logs found.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'testing' && (
                    <div className="bg-brand-card-bg border border-brand-gold/20 p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-playfair italic text-brand-gold">Self-Testing Suite</h2>
                                <p className="text-brand-gold-pale/60 font-dm-sans text-sm mt-1 max-w-xl">
                                    Simulates critical user journeys to ensure application integrity. Failures will include a screenshot of the page state.
                                </p>
                            </div>
                            <button
                                onClick={handleRunTests}
                                disabled={isTesting}
                                className="inline-flex items-center justify-center py-3 px-6 bg-brand-gold text-brand-ink font-bebas tracking-wider hover:bg-brand-gold-light transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-gold/10"
                            >
                                {isTesting && (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-ink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {isTesting ? 'Running Tests...' : 'Run Puppeteer Tests'}
                            </button>
                        </div>
                        
                        <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {testResults.length === 0 && !isTesting && <div className="text-center py-12 border-2 border-dashed border-brand-gold/20"><p className="text-brand-gold-pale/50 font-playfair italic text-xl">Ready to execute test suite.</p></div>}
                            {isTesting && testResults.length === 0 && <div className="text-center py-12"><p className="text-brand-gold animate-pulse font-bebas text-xl tracking-wider">Initializing test suite...</p></div>}
                            {testResults.map((result, index) => (
                                <div key={index} className="p-4 bg-brand-ink/50 border-l-4 border-brand-gold/50 hover:border-brand-gold transition-colors">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium font-dm-sans text-brand-cream">{result.description}</p>
                                        <span className={`px-3 py-1 text-xs font-bold font-bebas tracking-wider uppercase ${result.status === 'PASS' ? 'text-green-400 bg-green-900/20 border border-green-900/50' : 'text-red-400 bg-red-900/20 border border-red-900/50'}`}>
                                            {result.status}
                                        </span>
                                    </div>
                                    {result.status === 'FAIL' && (
                                        <div className="mt-3 pt-3 border-t border-brand-gold/10">
                                            <p className="text-sm text-red-400 font-mono bg-red-900/10 p-2 border border-red-900/30 mb-2">Error: {result.error}</p>
                                            {result.screenshot && (
                                                <div className="mt-2">
                                                    <p className="text-xs font-bebas tracking-wider text-brand-gold-pale mb-1 uppercase">Failure Screenshot:</p>
                                                    <img src={result.screenshot} alt={`Screenshot for failed test: ${result.description}`} className="w-full border border-red-500/30 opacity-80 hover:opacity-100 transition-opacity" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
