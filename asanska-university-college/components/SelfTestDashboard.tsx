import React, { useState } from 'react';
import { initialTests, runAllTests, TestResult } from '../utils/testRunner';
import { CheckCircleIcon, XCircleIcon } from './Icons';

const SelfTestDashboard: React.FC = () => {
    const [testResults, setTestResults] = useState<TestResult[]>(initialTests);
    const [isRunning, setIsRunning] = useState(false);

    const handleRunTests = async () => {
        setIsRunning(true);
        setTestResults(initialTests.map(t => ({ ...t, status: 'pending', logs: [] })));

        const onProgress = (result: Partial<TestResult>, index: number) => {
            setTestResults(prevResults => {
                const newResults = [...prevResults];
                newResults[index] = { ...newResults[index], ...result };
                return newResults;
            });
        };

        await runAllTests(onProgress);
        setIsRunning(false);
    };
    
    const StatusIndicator: React.FC<{ status: TestResult['status'] }> = ({ status }) => {
        switch (status) {
            case 'pass':
                return <span className="flex items-center text-green-500"><CheckCircleIcon className="w-5 h-5 mr-1" /> Pass</span>;
            case 'fail':
                return <span className="flex items-center text-red-500"><XCircleIcon className="w-5 h-5 mr-1" /> Fail</span>;
            case 'running':
                return <span className="text-blue-500 animate-pulse">Running...</span>;
            default:
                return <span className="text-gray-500">Pending</span>;
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-aucdt-primary dark:text-white">Puppeteer Self-Test Suite</h2>
                <button
                    onClick={handleRunTests}
                    disabled={isRunning}
                    className="bg-aucdt-secondary text-aucdt-primary font-bold py-2 px-6 rounded-full hover:bg-amber-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isRunning ? 'Tests in Progress...' : 'Run All Tests'}
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {testResults.map((result, index) => (
                        <li key={index} className="p-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-aucdt-dark-text dark:text-gray-200">{result.description}</span>
                                <span className="text-sm font-medium"><StatusIndicator status={result.status} /></span>
                            </div>
                            {result.logs && result.logs.length > 0 && (
                                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                    <pre className="text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
                                        {result.logs.join('\n')}
                                    </pre>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SelfTestDashboard;