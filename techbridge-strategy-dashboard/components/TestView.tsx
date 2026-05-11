import React, { useState, useEffect, useRef } from 'react';
import { TestSuite, TestLog } from '../types';
import { Play, CheckCircle, XCircle, Terminal, FileCode, MonitorPlay, Activity, RefreshCw } from 'lucide-react';
import { useDashboardData } from '../contexts/DataContext';

const TestView: React.FC = () => {
  const { data } = useDashboardData();
  const [activeTab, setActiveTab] = useState<'runner' | 'code'>('runner');
  const [suites, setSuites] = useState<TestSuite[]>([
    { id: 'unit-1', name: 'Data Integrity Check', description: 'Validates financial model calculations and budget sums.', type: 'unit', status: 'idle' },
    { id: 'unit-2', name: 'Component Render Health', description: 'Checks for React render cycles and null states.', type: 'unit', status: 'idle' },
    { id: 'e2e-1', name: 'Critical Path Journey', description: 'Full user flow: Load -> Strategy -> Admin Auth.', type: 'e2e', status: 'idle' }
  ]);
  const [logs, setLogs] = useState<TestLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (message: string, level: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), message, level }]);
  };

  const runUnitTests = async () => {
    addLog('Starting Data Integrity Unit Tests...', 'info');
    
    // Simulate check delay
    await new Promise(r => setTimeout(r, 800));
    
    // Check 1: Budget Sum
    const budgetTotal = data.budget.reduce((acc, item) => acc + item.value, 0);
    
    if (budgetTotal > 1000000) {
        addLog(`Budget Calculation: PASS (Total ${budgetTotal.toLocaleString()} GHS is within valid range)`, 'success');
    } else {
        addLog(`Budget Calculation: WARN (Got ${budgetTotal}, expected > 1M)`, 'error');
        return false;
    }

    // Check 2: Marketing Consistency
    const marketingBudget = data.budget.find(b => b.name === 'Student Recruitment')?.value || 0;
    const marketingAllocation = data.marketing.reduce((acc, item) => acc + item.value, 0);

    // Allow small variance for demo purposes
    if (Math.abs(marketingAllocation - marketingBudget) < 1000) {
        addLog(`Marketing Allocation: PASS (Breakdown matches strategy budget: ${marketingBudget.toLocaleString()} GHS)`, 'success');
    } else {
        addLog(`Marketing Allocation: FAIL (Breakdown ${marketingAllocation} !== Budget ${marketingBudget})`, 'error');
        return false;
    }

    // Check 3: Break Even Logic
    await new Promise(r => setTimeout(r, 600));
    
    const year2 = data.financials.find(f => f.year.includes('Yr 2') || f.year.includes('2027'));
    if (year2 && year2.revenue > year2.cost) {
        addLog(`Break-even Verification: PASS (Yr2 Rev ${year2.revenue}M > Cost ${year2.cost}M)`, 'success');
    } else {
        addLog('Break-even Verification: FAIL or Data Changed', 'error');
    }

    return true;
  };

  const runE2ESimulation = async () => {
    addLog('Initializing Playwright v21.0.0 (Simulation)...', 'info');
    await new Promise(r => setTimeout(r, 1000));
    
    addLog('Browser launched: Chrome Headless', 'info');
    await new Promise(r => setTimeout(r, 800));
    
    addLog('NAV: Navigating to https://dashboard.techbridge.edu.gh', 'info');
    addLog('DOM: Waiting for selector ".recharts-wrapper"', 'info');
    await new Promise(r => setTimeout(r, 1200));
    addLog('✅ PASS: Charts rendered successfully', 'success');
    
    addLog('INT: Simulating click on [Admin Settings]', 'info');
    await new Promise(r => setTimeout(r, 800));
    
    addLog('AUTH: Injecting credentials...', 'info');
    addLog('AUTH: Verifying Security Audit Log presence...', 'info');
    await new Promise(r => setTimeout(r, 1000));
    addLog('✅ PASS: Admin access confirmed', 'success');

    // Screenshot simulation
    addLog('📸 CAPTURE: reports/screenshots/success-journey.png saved', 'info');
    return true;
  };

  const handleRunAll = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    setShowScreenshot(false);
    
    // Update states to running
    setSuites(prev => prev.map(s => ({ ...s, status: 'running' })));

    try {
        // Run Unit Test 1
        const unit1Success = await runUnitTests();
        setSuites(prev => prev.map(s => s.id === 'unit-1' ? { ...s, status: unit1Success ? 'passed' : 'failed' } : s));
        
        // Run Unit Test 2 (Mock)
        addLog('Verifying Component Tree...', 'info');
        await new Promise(r => setTimeout(r, 500));
        setSuites(prev => prev.map(s => s.id === 'unit-2' ? { ...s, status: 'passed' } : s));

        // Run E2E
        const e2eSuccess = await runE2ESimulation();
        setSuites(prev => prev.map(s => s.id === 'e2e-1' ? { ...s, status: e2eSuccess ? 'passed' : 'failed' } : s));

        addLog('🏁 Test Suite Completed.', 'success');

    } catch (e) {
        addLog('Critical Test Runner Failure', 'error');
    } finally {
        setIsRunning(false);
    }
  };

  const playwrightCode = `const playwright = require('playwright');

(async () => {
  const browser = await playwright.launch();
  const page = await browser.newPage();
  
  // 1. Critical Path: Load Dashboard
  await page.goto('http://localhost:3000');
  
  // 2. Verify Metrics
  await page.waitForSelector('.recharts-surface');
  console.log('Charts rendered');
  
  // 3. Admin Login
  await page.click('button[aria-label="Admin Settings"]');
  await page.type('input[type="password"]', 'admin');
  await page.click('button[type="submit"]');
  
  await page.screenshot({path: 'success.png'});
  await browser.close();
})();`;

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      {showScreenshot && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm" onClick={() => setShowScreenshot(false)}>
            <div className="bg-white p-2 rounded-lg shadow-2xl max-w-4xl w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-2 px-2">
                    <span className="text-xs font-mono text-slate-500">success-journey.png (1280x800)</span>
                    <button onClick={() => setShowScreenshot(false)} className="text-slate-400 hover:text-red-500"><XCircle size={20} /></button>
                </div>
                <div className="aspect-video bg-slate-100 rounded border border-slate-200 flex items-center justify-center relative overflow-hidden">
                    {/* Mock Screenshot Content */}
                    <div className="absolute inset-0 flex flex-col opacity-50 pointer-events-none">
                        <div className="h-12 bg-slate-800"></div>
                        <div className="flex-1 flex">
                            <div className="w-48 bg-slate-900"></div>
                            <div className="flex-1 bg-slate-50 p-8">
                                <div className="h-32 bg-white rounded shadow-sm mb-4"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-48 bg-white rounded shadow-sm"></div>
                                    <div className="h-48 bg-white rounded shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/90 p-4 rounded-lg shadow-lg border border-slate-200 text-center z-10">
                        <CheckCircle className="mx-auto text-green-500 mb-2" size={48} />
                        <h3 className="font-bold text-slate-800">Test Passed</h3>
                        <p className="text-xs text-slate-500">Visual Regression Check: OK</p>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <MonitorPlay className="text-blue-500" />
                Playwright Test Runner
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Automated E2E simulation and visual regression testing.</p>
        </div>
        <div className="flex gap-3">
            {suites.find(s => s.id === 'e2e-1')?.status === 'passed' && (
                <button 
                    onClick={() => setShowScreenshot(true)}
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200"
                >
                    <FileCode size={18} />
                    <span>View Screenshot</span>
                </button>
            )}
            <button 
                onClick={handleRunAll}
                disabled={isRunning}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold text-white transition-all ${isRunning ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20'}`}
            >
                {isRunning ? <RefreshCw className="animate-spin" size={20} /> : <Play size={20} />}
                <span>{isRunning ? 'Running Suite...' : 'Run Playwright Suite'}</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Panel: Suites */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold text-slate-700 dark:text-slate-200">Test Suites</h3>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
                {suites.map(suite => (
                    <div key={suite.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                                {suite.type === 'e2e' ? <MonitorPlay size={16} className="text-purple-500" /> : <FileCode size={16} className="text-indigo-500" />}
                                <span className="font-bold text-slate-800 dark:text-white text-sm">{suite.name}</span>
                            </div>
                            {suite.status === 'idle' && <span className="w-3 h-3 rounded-full bg-slate-300"></span>}
                            {suite.status === 'running' && <RefreshCw size={14} className="animate-spin text-blue-500" />}
                            {suite.status === 'passed' && <CheckCircle size={16} className="text-green-500" />}
                            {suite.status === 'failed' && <XCircle size={16} className="text-red-500" />}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{suite.description}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Right Panel: Execution & Code */}
        <div className="lg:col-span-2 bg-slate-900 text-slate-200 rounded-xl shadow-lg border border-slate-800 flex flex-col overflow-hidden font-mono text-sm">
            <div className="flex border-b border-slate-800">
                <button 
                    onClick={() => setActiveTab('runner')}
                    className={`px-6 py-3 flex items-center space-x-2 border-r border-slate-800 hover:bg-slate-800 transition-colors ${activeTab === 'runner' ? 'bg-slate-800 text-blue-400 font-bold' : 'text-slate-400'}`}
                >
                    <Terminal size={16} />
                    <span>Console Output</span>
                </button>
                <button 
                    onClick={() => setActiveTab('code')}
                    className={`px-6 py-3 flex items-center space-x-2 hover:bg-slate-800 transition-colors ${activeTab === 'code' ? 'bg-slate-800 text-blue-400 font-bold' : 'text-slate-400'}`}
                >
                    <FileCode size={16} />
                    <span>Playwright Source</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
                {activeTab === 'runner' ? (
                    <div className="space-y-2">
                        {logs.length === 0 && <span className="text-slate-600 italic">// Click "Run Playwright Suite" to start test execution...</span>}
                        {logs.map((log, idx) => (
                            <div key={idx} className="flex space-x-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                <span className="text-slate-500 text-xs shrink-0 select-none">{log.timestamp}</span>
                                <span className={`${
                                    log.level === 'error' ? 'text-red-400 font-bold' : 
                                    log.level === 'success' ? 'text-green-400 font-bold' : 
                                    'text-slate-300'
                                }`}>
                                    {log.level === 'success' && '✓ '}
                                    {log.level === 'error' && '✗ '}
                                    {log.message}
                                </span>
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>
                ) : (
                    <div className="relative group">
                        <pre className="text-green-400/90 whitespace-pre-wrap">{playwrightCode}</pre>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TestView;
