import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { runPlaywrightTests, TEST_SUITES } from '../services/playwrightService';
import { TestStatus, TestResult, TestSuite, TestCase } from '../types';
import { Play, Loader2, CheckCircle2, XCircle, Clock, Image as ImageIcon, ChevronDown, ChevronRight, FlaskConical } from 'lucide-react';

type TestResultsMap = Record<string, TestResult>;

const getStatusIcon = (status: TestStatus) => {
    switch (status) {
        case TestStatus.PENDING:
            return <Clock size={18} className="text-slate-400" />;
        case TestStatus.RUNNING:
            return <Loader2 size={18} className="text-blue-500 animate-spin" />;
        case TestStatus.PASSED:
            return <CheckCircle2 size={18} className="text-green-500" />;
        case TestStatus.FAILED:
            return <XCircle size={18} className="text-red-500" />;
    }
};

const TestResultItem: React.FC<{ test: TestCase, result: TestResult | undefined }> = ({ test, result }) => {
    const status = result?.status || TestStatus.PENDING;

    return (
        <div className="pl-6 border-l-2 border-slate-200 ml-4 py-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {getStatusIcon(status)}
                    <span className="text-slate-700">{test.description}</span>
                </div>
                {result?.duration && (
                    <span className="text-xs text-slate-400 font-mono">{result.duration}ms</span>
                )}
            </div>
            {status === TestStatus.FAILED && (
                <div className="mt-2 ml-9 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-bold text-red-700">Error:</p>
                    <p className="text-xs text-red-600 font-mono break-words">{result?.error}</p>
                    {result?.screenshot && (
                        <div className="mt-2">
                            <a 
                                href={result.screenshot} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                                <ImageIcon size={12} /> View Screenshot
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const TestSuiteItem: React.FC<{ suite: TestSuite, results: TestResultsMap }> = ({ suite, results }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button 
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                     {isOpen ? <ChevronDown size={20} className="text-slate-500" /> : <ChevronRight size={20} className="text-slate-500" />}
                    <h3 className="font-bold text-lg text-slate-800">{suite.title}</h3>
                </div>
            </button>
            {isOpen && (
                <div className="p-4 space-y-2">
                    {suite.tests.map(test => (
                        <TestResultItem key={test.id} test={test} result={results[test.id]} />
                    ))}
                </div>
            )}
        </div>
    );
};

const AdminTesting: React.FC = () => {
    const storeContext = useStore();
    const [results, setResults] = useState<TestResultsMap>({});
    const [isRunning, setIsRunning] = useState(false);

    const handleRunTests = async () => {
        setIsRunning(true);
        setResults({});
        
        const onTestUpdate = (testId: string, result: TestResult) => {
            setResults(prev => ({...prev, [testId]: result}));
        };

        await runPlaywrightTests(storeContext, onTestUpdate);
        setIsRunning(false);
    };

    const summary = useMemo(() => {
        const allTests = TEST_SUITES.flatMap(s => s.tests);
        const total = allTests.length;
        // Fix: Explicitly type `r` as `TestResult` to help TypeScript infer the correct type, resolving the "Property 'status' does not exist on type 'unknown'" error.
        const passed = Object.values(results).filter((r: TestResult) => r.status === TestStatus.PASSED).length;
        const failed = Object.values(results).filter((r: TestResult) => r.status === TestStatus.FAILED).length;
        const pending = total - passed - failed;
        return { total, passed, failed, pending };
    }, [results]);

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FlaskConical className="text-vbci-navy" />
                        Playwright Self-Test Suite
                    </h1>
                    <p className="text-slate-500">Run end-to-end tests for critical user journeys.</p>
                </div>
                <button 
                    onClick={handleRunTests}
                    disabled={isRunning}
                    className="bg-vbci-navy text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-vbci-navyLight transition-colors shadow-sm disabled:opacity-60 disabled:cursor-wait"
                >
                    {isRunning ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} />}
                    {isRunning ? 'Tests Running...' : 'Run All Tests'}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Tests', value: summary.total, color: 'text-slate-600', bg: 'bg-slate-100' },
                    { label: 'Passed', value: summary.passed, color: 'text-green-600', bg: 'bg-green-100' },
                    { label: 'Failed', value: summary.failed, color: 'text-red-600', bg: 'bg-red-100' },
                    { label: 'Pending', value: summary.pending, color: 'text-blue-600', bg: 'bg-blue-100' },
                ].map((stat, idx) => (
                    <div key={idx} className={`p-4 rounded-xl shadow-sm border ${stat.bg.replace('bg-','border-')} `}>
                        <p className={`text-sm font-medium ${stat.color}`}>{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                {TEST_SUITES.map(suite => (
                    <TestSuiteItem key={suite.id} suite={suite} results={results} />
                ))}
            </div>
        </div>
    );
};

export default AdminTesting;
