import React, { useState, useCallback } from 'react';
import { runTestSuite, TestSuiteResult } from './testRunner';
import { RealScreenshot } from './RealScreenshot';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

type TestStatus = 'idle' | 'running' | 'complete';

export const TestContainer: React.FC = () => {
    const [status, setStatus] = useState<TestStatus>('idle');
    const [results, setResults] = useState<TestSuiteResult[]>([]);

    const handleRunTests = useCallback(() => {
        console.log('[E2E] User clicked "Run Full Test Suite"');
        setStatus('running');
        setResults([]);

        runTestSuite((progress) => {
            setResults(progress);
        }).then((finalResults) => {
            console.log('[E2E] All tests completed, displaying results');
            setResults(finalResults);
            setStatus('complete');
        }).catch((error) => {
            console.error('[E2E] Test suite error:', error);
            setStatus('complete');
        });
    }, []);

    const getStatusBadge = (status: 'running' | 'pass' | 'fail' | 'idle') => {
        switch (status) {
            case 'running':
                return <span className="text-xs font-bold text-amber-600">RUNNING...</span>;
            case 'pass':
                return <span className="text-xs font-bold text-green-600">PASS</span>;
            case 'fail':
                return <span className="text-xs font-bold text-red-600">FAIL</span>;
            default:
                return null;
        }
    };

    const getStatusIcon = (status: 'running' | 'pass' | 'fail' | 'idle') => {
        switch (status) {
            case 'running':
                return <Activity className="w-5 h-5 text-amber-600 animate-spin" />;
            case 'pass':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'fail':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            default:
                return null;
        }
    };

    return (
        <div className="relative w-full space-y-8">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1F3864]/10 flex items-center justify-center mr-4">
                        <Activity className="w-6 h-6 text-[#1F3864]" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">E2E Self-Test</h1>
                </div>
                <p className="text-slate-600 mb-6 text-sm">
                    This test suite verifies critical user journeys. To see real screenshots from the actual running application, run <code className="bg-gray-100 px-2 py-1 rounded text-[12px] font-mono">pnpm run test:e2e:screenshots</code> which captures actual browser screenshots using Playwright.
                </p>
                <button
                    onClick={handleRunTests}
                    disabled={status === 'running'}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-[#2E75B6] rounded-xl hover:bg-[#1F3864] focus:outline-none focus:ring-4 focus:ring-blue-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {status === 'running' ? (
                        <>
                            <Activity className="w-5 h-5 animate-spin" />
                            Tests in Progress...
                        </>
                    ) : (
                        'Run Full Test Suite'
                    )}
                </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900">Test Results</h2>
                    {results.map((suite, suiteIndex) => (
                        <div key={suiteIndex} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-slate-900">{suite.name}</h3>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(suite.status)}
                                    {getStatusBadge(suite.status)}
                                </div>
                            </div>
                            <div className="space-y-6">
                                {suite.tests.map((test, testIndex) => (
                                    <div key={testIndex} className="border-t border-slate-200 pt-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="font-medium text-slate-700 text-sm">{test.description}</p>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(test.status)}
                                                {getStatusBadge(test.status)}
                                            </div>
                                        </div>
                                        {test.status !== 'idle' && test.status !== 'running' && (
                                            <div className="mt-3">
                                                <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                                                    📸 Captured Screenshot:
                                                </p>
                                                <RealScreenshot state={test.screenshotState} />
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
