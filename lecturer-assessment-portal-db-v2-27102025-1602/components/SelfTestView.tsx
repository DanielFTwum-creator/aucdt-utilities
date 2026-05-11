import React, { useState, useCallback, useEffect } from 'react';
// FIX: Added 'X' to the import list to resolve the "Cannot find name 'X'" error.
import { Bot, Play, CheckCircle, XCircle, Loader, Clock, Camera, X } from 'lucide-react';
import { Test, TestResult } from '../types';
import { testSuite } from '../playwright-test-suite';

type TestStatus = 'pending' | 'running' | 'pass' | 'fail';

interface TestRunState {
    status: TestStatus;
    result: TestResult | null;
}

const statusConfig = {
    pending: { icon: Clock, color: 'text-slate-400', label: 'Pending' },
    running: { icon: Loader, color: 'text-sky-500 [.high-contrast_&]:text-cyan-400 animate-spin', label: 'Running...' },
    pass: { icon: CheckCircle, color: 'text-emerald-500 [.high-contrast_&]:text-green-400', label: 'Pass' },
    fail: { icon: XCircle, color: 'text-red-500', label: 'Fail' },
};

const ScreenshotModal: React.FC<{ imageUrl: string; onClose: () => void; testTitle: string }> = ({ imageUrl, onClose, testTitle }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex justify-center items-center p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border-2 [.high-contrast_&]:border-yellow-300 p-4 rounded-lg shadow-xl w-full max-w-4xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
             <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white">Screenshot for: <span className="font-normal">{testTitle}</span></h3>
             <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Close screenshot viewer"
            >
                <X className="text-slate-500" />
            </button>
        </div>
        <div className="bg-slate-100 dark:bg-slate-900 [.high-contrast_&]:bg-slate-800 p-2 rounded">
            <img src={imageUrl} alt={`Screenshot for ${testTitle}`} className="w-full h-auto object-contain rounded" />
        </div>
      </div>
    </div>
)};


const SelfTestView: React.FC = () => {
    const [testStates, setTestStates] = useState<Record<string, TestRunState>>(
        testSuite.reduce((acc, test) => {
            acc[test.title] = { status: 'pending', result: null };
            return acc;
        }, {} as Record<string, TestRunState>)
    );
    const [isSuiteRunning, setIsSuiteRunning] = useState(false);
    const [suiteResult, setSuiteResult] = useState<{ total: number, passed: number, duration: number } | null>(null);
    const [screenshotToShow, setScreenshotToShow] = useState<{ url: string; title: string } | null>(null);

    const runTestSuite = useCallback(async () => {
        setIsSuiteRunning(true);
        setSuiteResult(null);
        
        // Reset states before running
        const initialStates = testSuite.reduce((acc, test) => {
            acc[test.title] = { status: 'pending', result: null };
            return acc;
        }, {} as Record<string, TestRunState>);
        setTestStates(initialStates);
        
        const suiteStartTime = performance.now();
        let passedCount = 0;

        for (const test of testSuite) {
            // Set current test to running
            setTestStates(prev => ({
                ...prev,
                [test.title]: { ...prev[test.title], status: 'running' }
            }));

            try {
                const result = await test.run();
                if (result.success) {
                    passedCount++;
                }
                setTestStates(prev => ({
                    ...prev,
                    [test.title]: { status: result.success ? 'pass' : 'fail', result }
                }));
            } catch (error) {
                const result: TestResult = {
                    success: false,
                    log: error instanceof Error ? error.message : "An unknown error occurred.",
                    duration: 0,
                };
                setTestStates(prev => ({
                    ...prev,
                    [test.title]: { status: 'fail', result }
                }));
            }
        }
        
        const suiteDuration = performance.now() - suiteStartTime;
        setSuiteResult({ total: testSuite.length, passed: passedCount, duration: suiteDuration });
        setIsSuiteRunning(false);

    }, []);

    return (
        <div className="space-y-8">
            <div className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Bot size={32} className="text-sky-500 [.high-contrast_&]:text-cyan-400 flex-shrink-0" />
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white">
                            End-to-End Self-Test Suite
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 [.high-contrast_&]:text-slate-300 mt-1">
                            This panel runs a demonstration of the application's automated E2E tests to verify core functionalities.
                        </p>
                    </div>
                    <div className="sm:ml-auto w-full sm:w-auto">
                        <button
                            onClick={runTestSuite}
                            disabled={isSuiteRunning}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#8B1538] text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-slate-400 [.high-contrast_&]:bg-black [.high-contrast_&]:border-2 [.high-contrast_&]:border-yellow-300 [.high-contrast_&]:text-yellow-300 [.high-contrast_&]:hover:bg-yellow-300 [.high-contrast_&]:hover:text-black [.high-contrast_&]:disabled:border-slate-700 [.high-contrast_&]:disabled:text-slate-500 disabled:cursor-not-allowed"
                        >
                            {isSuiteRunning ? (
                                <>
                                    <Loader size={20} className="animate-spin" />
                                    <span>Running...</span>
                                </>
                            ) : (
                                <>
                                    <Play size={20} />
                                    <span>Run E2E Test Suite</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 [.high-contrast_&]:border-yellow-300">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 [.high-contrast_&]:text-white">
                        Test Results
                    </h3>
                    {suiteResult && (
                        <div className={`mt-2 text-sm font-semibold flex items-center gap-4 ${suiteResult.passed === suiteResult.total ? 'text-emerald-600 dark:text-emerald-400 [.high-contrast_&]:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            <span>{suiteResult.passed} / {suiteResult.total} tests passed</span>
                            <span className="text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300 font-normal">({(suiteResult.duration / 1000).toFixed(2)}s)</span>
                        </div>
                    )}
                </div>
                
                <ul className="divide-y divide-slate-200 dark:divide-slate-700 [.high-contrast_&]:divide-yellow-300/50">
                    {testSuite.map(test => {
                        const { status, result } = testStates[test.title];
                        const { icon: Icon, color, label } = statusConfig[status];

                        return (
                            <li key={test.title} className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 [.high-contrast_&]:text-white">{test.title}</p>
                                        {result && (
                                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 [.high-contrast_&]:text-slate-300">
                                                {result.log}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0 text-sm">
                                        {result?.screenshotDataUrl && (
                                            <button
                                                onClick={() => setScreenshotToShow({ url: result.screenshotDataUrl!, title: test.title })}
                                                className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                                title="View Screenshot"
                                                aria-label="View Screenshot"
                                            >
                                                <Camera size={16} />
                                            </button>
                                        )}
                                        {result && (
                                            <span className="text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300 w-12 text-right">
                                                {(result.duration / 1000).toFixed(2)}s
                                            </span>
                                        )}
                                        <span className={`flex items-center gap-1.5 font-bold w-20 ${color}`}>
                                            <Icon size={16} />
                                            {label}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            {screenshotToShow && (
                <ScreenshotModal 
                    imageUrl={screenshotToShow.url}
                    testTitle={screenshotToShow.title}
                    onClose={() => setScreenshotToShow(null)}
                />
            )}
        </div>
    );
};

export default SelfTestView;