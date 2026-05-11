import React, { useState, useCallback } from 'react';
import { runTestSuite, TestSuiteResult } from './testRunner';
import { MockScreenshot } from './MockScreenshot';
import { TestIcon } from '../Icons';

type TestStatus = 'idle' | 'running' | 'complete';

export const TestContainer: React.FC = () => {
    const [status, setStatus] = useState<TestStatus>('idle');
    const [results, setResults] = useState<TestSuiteResult[]>([]);

    const handleRunTests = useCallback(() => {
        setStatus('running');
        setResults([]);
        
        runTestSuite((progress) => {
            setResults(progress);
        }).then((finalResults) => {
            setResults(finalResults);
            setStatus('complete');
        });
    }, []);
    
    const getStatusBadge = (status: 'running' | 'pass' | 'fail' | 'idle') => {
        switch (status) {
            case 'running': return <span className="text-xs font-bold text-[var(--color-warning)]">RUNNING...</span>;
            case 'pass': return <span className="text-xs font-bold text-[var(--color-success)]">PASS</span>;
            case 'fail': return <span className="text-xs font-bold text-[var(--color-error)]">FAIL</span>;
            default: return null;
        }
    };

    return (
        <div className="w-full space-y-8">
            <div className="bg-[var(--color-bg-secondary)] p-6 sm:p-8 rounded-2xl shadow-lg border border-[var(--color-border-primary)]">
                <div className="flex items-center mb-4">
                    <TestIcon className="w-8 h-8 text-[var(--color-accent-primary)] mr-3" />
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">E2E Self-Test</h1>
                </div>
                <p className="text-[var(--color-text-secondary)] mb-6">
                    This is a simulated end-to-end test suite that verifies the critical user journeys of the application. Click the button below to run the tests and see the results in real-time.
                </p>
                <button
                    onClick={handleRunTests}
                    disabled={status === 'running'}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-[var(--color-text-on-accent)] bg-[var(--color-accent-primary)] rounded-lg hover:bg-[var(--color-accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-primary)] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {status === 'running' ? 'Tests in Progress...' : 'Run Full Test Suite'}
                </button>
            </div>
            
            {results.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Test Results</h2>
                    {results.map((suite, suiteIndex) => (
                        <div key={suiteIndex} className="bg-[var(--color-bg-secondary)] p-4 sm:p-6 rounded-2xl shadow-lg border border-[var(--color-border-primary)]">
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex justify-between items-center">
                                <span>{suite.name}</span>
                                {getStatusBadge(suite.status)}
                            </h3>
                            <div className="space-y-4">
                                {suite.tests.map((test, testIndex) => (
                                    <div key={testIndex} className="border-t border-[var(--color-border-primary)] pt-4">
                                        <p className="font-semibold text-[var(--color-text-secondary)] flex justify-between items-center">
                                            <span>{test.description}</span>
                                            {getStatusBadge(test.status)}
                                        </p>
                                        {test.status !== 'idle' && test.status !== 'running' && (
                                           <div className="mt-3">
                                              <p className="text-sm font-medium text-[var(--color-text-tertiary)] mb-2">Visual Confirmation:</p>
                                              <MockScreenshot state={test.screenshotState} />
                                           </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};