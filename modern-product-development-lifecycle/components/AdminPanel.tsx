import React, { useState, useEffect } from 'react';
import { logAdminAction, getAdminLogs, AuditLog } from '../utils/auditLogger';
import { TestResult } from '../types';
import { runTestSuite } from '../tests/playwright';
import { CheckCircleIcon, XCircleIcon, ClockIcon, InformationCircleIcon } from './icons';


// In a real app, this would be a secure environment variable.
const ADMIN_PASSWORD = 'admin_password_123'; 
const SESSION_AUTH_KEY = 'pdl-admin-authed';

interface AdminPanelProps {
    onClose: () => void;
    onClearAllData: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onClearAllData }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
    });
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [activeTab, setActiveTab] = useState<'actions' | 'tests'>('actions');

    // State for self-testing
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [isTesting, setIsTesting] = useState(false);
    const [screenshotModal, setScreenshotModal] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            setLogs(getAdminLogs());
            if (activeTab === 'actions') {
                logAdminAction('Admin panel accessed');
            }
        }
    }, [isAuthenticated, activeTab]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
            setError('');
        } else {
            setError('Incorrect password.');
        }
    };

    const handleLogout = () => {
        logAdminAction('Admin logged out');
        setIsAuthenticated(false);
        sessionStorage.removeItem(SESSION_AUTH_KEY);
        onClose();
    };

    const handleClearData = () => {
        if (window.confirm('Are you sure you want to clear all project data? This cannot be undone.')) {
            localStorage.removeItem('projectName');
            localStorage.removeItem('projectProgress');
            logAdminAction('Cleared all project data');
            onClearAllData();
            setLogs(getAdminLogs());
            alert('All project data has been cleared.');
        }
    };

    const handleExportData = () => {
        try {
            const data = {
                projectName: localStorage.getItem('projectName'),
                projectProgress: JSON.parse(localStorage.getItem('projectProgress') || '{}'),
            };
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
            const link = document.createElement('a');
            link.href = jsonString;
            link.download = `pdl-export-${new Date().toISOString()}.json`;
            link.click();
            logAdminAction('Exported project data');
            setLogs(getAdminLogs());
        } catch (e) {
            alert('Failed to export data.');
            console.error(e);
        }
    };

    const handleRunTests = async () => {
        setIsTesting(true);
        logAdminAction('Started self-test suite');
        setLogs(getAdminLogs());
        await runTestSuite((results) => {
            setTestResults([...results]);
        });
        setIsTesting(false);
        logAdminAction('Finished self-test suite');
        setLogs(getAdminLogs());
    };
    
    const renderTestStatusIcon = (status: TestResult['status']) => {
        switch (status) {
            case 'pass': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
            case 'fail': return <XCircleIcon className="w-5 h-5 text-red-500" />;
            case 'running': return <InformationCircleIcon className="w-5 h-5 text-sky-500 animate-spin" />;
            case 'pending': return <ClockIcon className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-panel-title"
        >
            <div className="bg-white dark:bg-slate-800 hc:bg-black hc:border hc:border-yellow-300 w-full max-w-2xl rounded-lg shadow-2xl max-h-[90vh] flex flex-col">
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 hc:border-yellow-300/50 flex justify-between items-center flex-shrink-0">
                    <h2 id="admin-panel-title" className="text-lg font-bold text-slate-900 dark:text-white hc:text-yellow-300">Admin Panel</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-2xl leading-none" aria-label="Close Admin Panel">&times;</button>
                </header>
                
                <div className="p-6 overflow-y-auto">
                    {!isAuthenticated ? (
                        <form onSubmit={handleLogin}>
                            <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200 hc:text-yellow-300/90">Authentication Required</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 hc:text-yellow-300/80 mt-1 mb-4">Enter the admin password to continue.</p>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex-grow p-2 bg-slate-100 dark:bg-slate-700 hc:bg-black border border-slate-300 dark:border-slate-600 hc:border-yellow-300/60 rounded-md"
                                    placeholder="Password"
                                    aria-label="Admin Password"
                                />
                                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-500 hc:bg-yellow-300 hc:text-black">Login</button>
                            </div>
                            {error && <p className="text-red-500 text-sm mt-2" role="alert">{error}</p>}
                        </form>
                    ) : (
                        <div>
                             <div className="border-b border-slate-200 dark:border-slate-700 hc:border-yellow-300/50 mb-6">
                                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                    <button onClick={() => setActiveTab('actions')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'actions' ? 'border-sky-500 hc:border-yellow-300 text-sky-600 dark:text-sky-400 hc:text-yellow-300' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                                        Actions & Logs
                                    </button>
                                    <button onClick={() => setActiveTab('tests')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tests' ? 'border-sky-500 hc:border-yellow-300 text-sky-600 dark:text-sky-400 hc:text-yellow-300' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                                        Self-Test
                                    </button>
                                </nav>
                            </div>
                            
                            {activeTab === 'actions' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200 hc:text-yellow-300/90">Actions</h3>
                                        <div className="flex flex-wrap gap-4 mt-2">
                                            <button onClick={handleExportData} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hc:bg-black hc:border hc:border-yellow-300/50 text-slate-800 dark:text-slate-200 hc:text-yellow-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">Export Data</button>
                                            <button onClick={handleClearData} className="px-4 py-2 bg-red-600/10 text-red-600 rounded-md hover:bg-red-600/20">Clear All Data</button>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200 hc:text-yellow-300/90 mb-2">Audit Log</h3>
                                        <div className="border border-slate-200 dark:border-slate-700 hc:border-yellow-300/50 rounded-lg max-h-64 overflow-y-auto">
                                            <table className="w-full text-sm">
                                                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-700/50 hc:bg-black">
                                                    <tr>
                                                        <th className="text-left p-3 font-semibold">Timestamp</th>
                                                        <th className="text-left p-3 font-semibold">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 hc:divide-yellow-300/50">
                                                    {logs.length > 0 ? logs.map(log => (
                                                        <tr key={log.timestamp}>
                                                            <td className="p-3 text-slate-600 dark:text-slate-400 hc:text-yellow-300/80 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                                                            <td className="p-3">{log.action}</td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan={2} className="p-3 text-center text-slate-500">No logs found.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                             {activeTab === 'tests' && (
                                <div>
                                    <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200 hc:text-yellow-300/90">Playwright Self-Test Suite</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 hc:text-yellow-300/80 mt-1 mb-4">Run a simulated end-to-end test suite to verify critical user journeys.</p>
                                    <button onClick={handleRunTests} disabled={isTesting} className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-500 disabled:bg-slate-400 hc:bg-yellow-300 hc:text-black">
                                        {isTesting ? 'Running Tests...' : 'Run Test Suite'}
                                    </button>
                                    
                                    <div className="mt-6 border border-slate-200 dark:border-slate-700 hc:border-yellow-300/50 rounded-lg max-h-80 overflow-y-auto">
                                        <ul className="divide-y divide-slate-200 dark:divide-slate-700 hc:divide-yellow-300/50">
                                            {testResults.map(result => (
                                                <li key={result.name} className="p-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            {renderTestStatusIcon(result.status)}
                                                            <span className="font-medium">{result.name}</span>
                                                        </div>
                                                        {result.duration && <span className="text-xs text-slate-500 font-mono">{result.duration}ms</span>}
                                                    </div>
                                                    {result.status === 'fail' && (
                                                        <div className="ml-8 mt-2 text-sm text-red-500 bg-red-500/10 p-3 rounded-md">
                                                            <p className="font-semibold">Error: {result.error}</p>
                                                            {result.screenshot && (
                                                                <button onClick={() => setScreenshotModal(result.screenshot!)} className="text-sky-500 hover:underline mt-1">View Screenshot</button>
                                                            )}
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {isAuthenticated && (
                     <footer className="p-4 border-t border-slate-200 dark:border-slate-700 hc:border-yellow-300/50 text-right flex-shrink-0">
                        <button onClick={handleLogout} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hc:bg-black hc:border hc:border-yellow-300/50 text-slate-800 dark:text-slate-200 hc:text-yellow-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">Logout</button>
                    </footer>
                )}
            </div>
            {screenshotModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={() => setScreenshotModal(null)}>
                    <img src={screenshotModal} alt="Test failure screenshot" className="max-w-[90vw] max-h-[90vh] object-contain" />
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
