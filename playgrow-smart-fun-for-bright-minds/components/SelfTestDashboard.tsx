import React, { useState, useEffect } from 'react';
import { PUPPETEER_TEST_SUITE } from '../tests/playwrightSuite';
import { TestStatus, TestSuite } from '../types';
import { BackIcon } from './icons';

interface SelfTestDashboardProps {
  onBack: () => void;
}

const StatusIndicator: React.FC<{ status: TestStatus }> = ({ status }) => {
    const baseClasses = "w-5 h-5 rounded-full flex items-center justify-center";
    switch (status) {
        case 'running':
            return <div className={`${baseClasses} bg-blue-200`}><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div></div>;
        case 'passed':
            return <div className={`${baseClasses} bg-green-200 text-green-700`}>✓</div>;
        case 'failed':
            return <div className={`${baseClasses} bg-red-200 text-red-700`}>✗</div>;
        case 'pending':
        default:
            return <div className={`${baseClasses} bg-gray-200`}></div>;
    }
};

const SelfTestDashboard: React.FC<SelfTestDashboardProps> = ({ onBack }) => {
    const [testResults, setTestResults] = useState<Record<string, TestStatus>>({});
    const [currentLog, setCurrentLog] = useState('Tests pending. Click "Run Full Test Suite" to start.');
    const [currentScreenshot, setCurrentScreenshot] = useState<string | null>(null);
    const [isTesting, setIsTesting] = useState(false);
    const [completedTests, setCompletedTests] = useState(0);

    useEffect(() => {
        const initialResults: Record<string, TestStatus> = {};
        PUPPETEER_TEST_SUITE.forEach(suite => {
            initialResults[suite.id] = 'pending';
        });
        setTestResults(initialResults);
    }, []);
    
    const runTests = async () => {
        setIsTesting(true);
        setCurrentLog('Initializing test suite...');
        setCompletedTests(0);

        const initialResults: Record<string, TestStatus> = {};
        PUPPETEER_TEST_SUITE.forEach(suite => {
            initialResults[suite.id] = 'pending';
        });
        setTestResults(initialResults);
        await new Promise(res => setTimeout(res, 500));


        for (const suite of PUPPETEER_TEST_SUITE) {
            setTestResults(prev => ({ ...prev, [suite.id]: 'running' }));
            let suitePassed = true;

            for (const step of suite.steps) {
                setCurrentLog(`[${suite.title}] ${step.description}`);
                setCurrentScreenshot(step.screenshot);
                await new Promise(res => setTimeout(res, step.duration));
                
                if (step.shouldFail) {
                    suitePassed = false;
                    break;
                }
            }
            
            setTestResults(prev => ({ ...prev, [suite.id]: suitePassed ? 'passed' : 'failed' }));
            setCompletedTests(prev => prev + 1);
        }

        setCurrentLog('All tests completed.');
        setIsTesting(false);
        setTimeout(() => {
            setCurrentScreenshot(null);
            setCurrentLog('Tests pending. Click "Run Full Test Suite" to start.');
        }, 5000)
    };
    
    const totalTests = PUPPETEER_TEST_SUITE.length;
    const progress = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-800 p-4 sm:p-8 hc-bg-primary">
        <header className="relative flex items-center justify-center mb-6">
             <button 
                onClick={onBack} 
                className="absolute left-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-400 hc-bg-secondary hc-border"
                aria-label="Back to Admin Dashboard"
            >
                <BackIcon className="w-6 h-6 text-gray-600 dark:text-gray-300 hc-accent" />
            </button>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-gray-100 hc-text-primary">Playwright Self-Test</h1>
        </header>
        
        <div className="mb-6">
            <button 
                onClick={runTests}
                disabled={isTesting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-green-400 disabled:bg-gray-400 disabled:cursor-not-allowed hc-bg-secondary hc-border hc-accent"
            >
                {isTesting ? 'Testing in Progress...' : 'Run Full Test Suite'}
            </button>
        </div>
        
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
            {/* Suites */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col hc-bg-secondary hc-border">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 hc-text-primary">Test Suites</h2>
                <div className="space-y-4 overflow-y-auto">
                    {PUPPETEER_TEST_SUITE.map(suite => (
                        <div key={suite.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hc-bg-primary hc-border">
                           <div className="flex items-center justify-between">
                             <h3 className="font-bold text-gray-700 dark:text-gray-200 hc-text-primary">{suite.title}</h3>
                             <StatusIndicator status={testResults[suite.id] || 'pending'} />
                           </div>
                           <p className="text-sm text-gray-500 dark:text-gray-400 hc-text-secondary">{suite.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Log & Screenshot */}
            <div className="lg:col-span-3 grid grid-rows-3 gap-6 min-h-0">
                <div className="row-span-1 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col hc-bg-secondary hc-border">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 hc-text-primary">Live Log</h2>
                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2 hc-bg-primary hc-border">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
                    </div>
                    <div className="flex-1 bg-gray-800 dark:bg-black text-white font-mono text-sm p-3 rounded-lg overflow-y-auto hc-bg-primary hc-border">
                       <p className="whitespace-pre-wrap animate-pulse">{currentLog}</p>
                    </div>
                </div>
                <div className="row-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center hc-bg-secondary hc-border">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 self-start hc-text-primary">Screenshot Viewer</h2>
                    <div className="flex-1 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden hc-bg-primary hc-border">
                        {currentScreenshot ? (
                             <img src={currentScreenshot} alt="Current test step screenshot" className="object-contain max-w-full max-h-full" />
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 hc-text-secondary">No test running</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
};

export default SelfTestDashboard;
