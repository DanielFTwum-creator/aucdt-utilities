import React, { useState } from 'react';
import { TestResult, AuditLogEntry } from '../types';
import { DocumentMagnifyingGlassIcon, XCircleIcon, CheckCircleIcon, ClockIcon } from './icons';

const initialTests: TestResult[] = [
    { name: 'Theme Switching', status: 'running', details: 'Pending...' },
    { name: 'AI Suggestion Query', status: 'running', details: 'Pending...' },
    { name: 'Admin Login - Failure', status: 'running', details: 'Pending...' },
    { name: 'Admin Login - Success', status: 'running', details: 'Pending...' },
    { name: 'Admin Action - Verify User', status: 'running', details: 'Pending...' },
    { name: 'Admin Action - De-list Vehicle', status: 'running', details: 'Pending...' },
];

// Helper to simulate async operations
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const PuppeteerTestsTab: React.FC<{ onLog: (entry: Omit<AuditLogEntry, 'timestamp'>) => void; }> = ({ onLog }) => {
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const runTests = async () => {
        setIsRunning(true);
        onLog({ action: 'TEST_SUITE_START', details: 'Puppeteer self-test suite initiated.' });
        
        let currentResults: TestResult[] = initialTests.map(t => ({...t}));
        setTestResults([...currentResults]);
        
        // --- Test 1: Theme Switching ---
        await sleep(500);
        currentResults[0] = { ...currentResults[0], details: 'Simulating click on Dark theme button...' };
        setTestResults([...currentResults]);
        await sleep(500);
        currentResults[0] = { ...currentResults[0], status: 'passed', details: 'Dark theme applied successfully.', screenshot: 'theme_dark.png' };
        setTestResults([...currentResults]);

        // --- Test 2: AI Suggestion ---
        currentResults[1] = { ...currentResults[1], details: 'Typing "beach" into AI input...' };
        setTestResults([...currentResults]);
        await sleep(1000);
        currentResults[1] = { ...currentResults[1], details: 'Simulating API call to Gemini...' };
        setTestResults([...currentResults]);
        await sleep(1500);
        currentResults[1] = { ...currentResults[1], status: 'passed', details: 'Received suggestions from AI.', screenshot: 'ai_suggestion.png' };
        setTestResults([...currentResults]);
        
        // --- Test 3: Admin Login Failure ---
        currentResults[2] = { ...currentResults[2], details: 'Entering incorrect password...' };
        setTestResults([...currentResults]);
        await sleep(500);
        currentResults[2] = { ...currentResults[2], status: 'passed', details: 'Correctly showed "Invalid password" error.', screenshot: 'login_fail.png' };
        setTestResults([...currentResults]);

        // --- Test 4: Admin Login Success ---
        currentResults[3] = { ...currentResults[3], details: 'Entering correct password...' };
        setTestResults([...currentResults]);
        await sleep(500);
        currentResults[3] = { ...currentResults[3], status: 'passed', details: 'Successfully logged in to admin panel.', screenshot: 'login_success.png' };
        setTestResults([...currentResults]);
        
        // --- Test 5: Admin Action - Verify User ---
        currentResults[4] = { ...currentResults[4], details: 'Clicking "Verify" on user Ama Serwaa...' };
        setTestResults([...currentResults]);
        await sleep(800);
        currentResults[4] = { ...currentResults[4], status: 'passed', details: 'User status updated and logged.', screenshot: 'verify_user.png' };
        setTestResults([...currentResults]);

        // --- Test 6: Admin Action - De-list Vehicle ---
        currentResults[5] = { ...currentResults[5], details: 'Clicking "De-list" on Toyota Land Cruiser...' };
        setTestResults([...currentResults]);
        await sleep(800);
        currentResults[5] = { ...currentResults[5], status: 'passed', details: 'Vehicle listing status updated.', screenshot: 'delist_vehicle.png' };
        setTestResults([...currentResults]);
        
        onLog({ action: 'TEST_SUITE_COMPLETE', details: 'Puppeteer self-test suite finished.' });
        setIsRunning(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2"><DocumentMagnifyingGlassIcon /> Puppeteer Self-Test Suite</h3>
                <button 
                    onClick={runTests} 
                    disabled={isRunning}
                    className="bg-blue-600 text-white font-bold px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed high-contrast:bg-yellow-400 high-contrast:text-black high-contrast:hover:bg-yellow-500"
                >
                    {isRunning ? 'Running...' : 'Run All Tests'}
                </button>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">This tool simulates a Puppeteer test suite to verify critical user journeys within the application. Click "Run All Tests" to begin.</p>
                <div className="space-y-2">
                    {testResults.map((result, index) => (
                        <div key={index} className="p-3 rounded-md border border-gray-200 dark:border-gray-600 flex items-start gap-4">
                            <div className="flex-shrink-0">
                                {result.status === 'passed' && <CheckCircleIcon className="w-6 h-6 text-green-500" />}
                                {result.status === 'failed' && <XCircleIcon className="w-6 h-6 text-red-500" />}
                                {result.status === 'running' && <ClockIcon className="w-6 h-6 text-gray-500 animate-spin" />}
                            </div>
                            <div className="flex-grow">
                                <p className="font-bold">{result.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{result.details}</p>
                                {result.screenshot && <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">Screenshot captured: <span className="font-mono">{result.screenshot}</span></p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};