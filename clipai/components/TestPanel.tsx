import React, { useState, useCallback } from 'react';
import { Test, TestContext, TestResult, TestStatus } from '../types';
import ALL_TESTS from '../utils/tests';
import { PlayIcon, CheckCircleIcon, XCircleIcon } from '../constants';

interface TestPanelProps {
    onBack: () => void;
    stateSetters: any;
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

const getInitialResults = (): Record<string, TestResult> => {
    return ALL_TESTS.reduce((acc, test) => {
        acc[test.name] = { status: 'idle', message: '', duration: 0 };
        return acc;
    }, {} as Record<string, TestResult>);
};

const TestPanel: React.FC<TestPanelProps> = ({ onBack, stateSetters, canvasRef }) => {
    const [results, setResults] = useState<Record<string, TestResult>>(getInitialResults());
    const [isRunning, setIsRunning] = useState(false);
    const [globalStatus, setGlobalStatus] = useState<TestStatus>('idle');

    const takeScreenshot = useCallback(() => {
        return canvasRef.current?.toDataURL('image/png');
    }, [canvasRef]);

    const waitForRender = useCallback((delay: number = 100) => {
        return new Promise<void>(resolve => setTimeout(resolve, delay));
    }, []);
    
    const getCanvasPixelData = useCallback(() => {
        const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true });
        if (!ctx || !canvasRef.current) return undefined;
        return ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height).data;
    }, [canvasRef]);

    const runAllTests = async () => {
        setIsRunning(true);
        setGlobalStatus('running');
        let allPassed = true;

        const testContext: TestContext = {
            ...stateSetters,
            canvasRef,
            takeScreenshot,
            waitForRender,
            getCanvasPixelData,
        };

        for (const test of ALL_TESTS) {
            setResults(prev => ({
                ...prev,
                [test.name]: { ...prev[test.name], status: 'running' }
            }));

            const startTime = performance.now();
            try {
                const result = await test.run(testContext);
                const endTime = performance.now();
                setResults(prev => ({
                    ...prev,
                    [test.name]: { ...result, status: 'pass', duration: endTime - startTime }
                }));
            } catch (e: any) {
                allPassed = false;
                const endTime = performance.now();
                const isSkipped = e.message?.includes('SKIPPED');
                setResults(prev => ({
                    ...prev,
                    [test.name]: {
                        status: isSkipped ? 'skipped' : 'fail',
                        message: e.message || 'An unknown error occurred.',
                        duration: endTime - startTime,
                    }
                }));
            }
             // Reset state between tests for isolation
            stateSetters.setMediaSource(null);
            stateSetters.setShape('circle');
            stateSetters.setClippingMode('fill');
            stateSetters.setCustomSvgPath(null);
            await waitForRender();
        }

        setGlobalStatus(allPassed ? 'pass' : 'fail');
        setIsRunning(false);
    };
    
    const resetTests = () => {
        setResults(getInitialResults());
        setGlobalStatus('idle');
    }

    const StatusIcon = ({ status }: { status: TestStatus }) => {
        switch (status) {
            case 'running': return <div className="spinner h-5 w-5 border-2 rounded-full" />;
            case 'pass': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'fail': return <XCircleIcon className="h-5 w-5 text-red-500" />;
            case 'skipped': return <span className="text-yellow-500 text-sm font-bold">S</span>;
            default: return <div className="h-5 w-5" />;
        }
    };

    return (
        <div className="hc-bg hc-border hc-text max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white hc-text">Puppeteer Self-Test</h2>
                <button onClick={onBack} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                    Back to Admin
                </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
                <button onClick={runAllTests} disabled={isRunning} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-300 transition-colors">
                    <PlayIcon className="h-5 w-5"/>
                    {isRunning ? 'Running...' : 'Run All Tests'}
                </button>
                <button onClick={resetTests} disabled={isRunning} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors">
                    Reset
                </button>
            </div>

            <div className="space-y-4">
                {ALL_TESTS.map(test => {
                    const result = results[test.name];
                    return (
                        <div key={test.name} className={`p-4 rounded-lg border ${result.status === 'fail' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'}`}>
                            <div className="flex items-start gap-4">
                                <StatusIcon status={result.status} />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{test.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{test.description}</p>
                                    {result.status !== 'idle' && result.status !== 'running' && (
                                        <div className="mt-2 text-sm">
                                            <p className={`font-medium ${result.status === 'pass' ? 'text-green-700 dark:text-green-400' : result.status === 'fail' ? 'text-red-700 dark:text-red-400' : 'text-yellow-700 dark:text-yellow-400'}`}>
                                               STATUS: {result.status.toUpperCase()} ({(result.duration / 1000).toFixed(2)}s)
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300">{result.message}</p>
                                        </div>
                                    )}
                                </div>
                                {result.screenshot && (
                                    <div className="ml-4">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Screenshot</p>
                                        <img src={result.screenshot} alt={`Screenshot for ${test.name}`} className="w-24 h-24 border-2 border-purple-300 rounded-md"/>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default TestPanel;