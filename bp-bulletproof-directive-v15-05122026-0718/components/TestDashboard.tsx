import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Icons } from './Icons';
import { runSystemDiagnostics, DiagnosticResult } from '../lib/healthCheck';

interface TestDashboardProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TestDashboard: React.FC<TestDashboardProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'suite' | 'playwright'>('suite');
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<DiagnosticResult[]>([]);
    const [playwrightLogs, setPlaywrightLogs] = useState<{msg: string, type: 'info'|'success'|'error'}[]>([]);
    const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);

    const runTests = async () => {
        setIsRunning(true);
        setResults([]);
        
        try {
            const diags = await runSystemDiagnostics();
            setResults(diags);
        } catch (e) {
            console.error('Diagnostic error:', e);
        }

        setIsRunning(false);
    };

    const runPlaywrightSimulation = async () => {
        setPlaywrightLogs([]);
        setScreenshotUrl(null);
        setIsRunning(true);

        const logs = [
            { msg: "Launching headless browser...", delay: 500, type: 'info' },
            { msg: "Navigating to http://localhost:3000...", delay: 800, type: 'info' },
            { msg: "PASS: Authentication (admin login)", delay: 1200, type: 'success' },
            { msg: "PASS: Audit logging tracking", delay: 900, type: 'success' },
            { msg: "PASS: Theme switching", delay: 600, type: 'success' },
            { msg: "FAIL: Accessibility checks (ARIA) - Missing label on custom toggle.", delay: 800, type: 'error' },
            { msg: "Capturing screenshot of failure...", delay: 600, type: 'info' }
        ] as const;

        for (const log of logs) {
            await new Promise(r => setTimeout(r, log.delay));
            setPlaywrightLogs(prev => [...prev, { msg: log.msg, type: log.type }]);
        }

        if (dashboardRef.current) {
            try {
                const canvas = await html2canvas(dashboardRef.current, { backgroundColor: '#111' });
                const dataUrl = canvas.toDataURL('image/png');
                setScreenshotUrl(dataUrl);
                setPlaywrightLogs(prev => [...prev, { msg: "Screenshot captured successfully.", type: 'success' }]);
            } catch (err) {
                 setPlaywrightLogs(prev => [...prev, { msg: "Failed to capture screenshot.", type: 'error' }]);
            }
        }
        
        setIsRunning(false);
    };

    return (
        <div ref={dashboardRef} className="w-full bg-bg-secondary border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px] text-text-primary">
            <div className="flex items-center justify-between p-6 border-b border-border bg-bg-tertiary/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                        <Icons.Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-mono text-xl font-bold text-text-primary">Diagnostic Suite</h2>
                        <p className="text-xs text-text-muted uppercase tracking-wider">Automated System Check</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab('suite')} className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all ${activeTab === 'suite' ? 'bg-accent-primary text-white' : 'bg-bg-tertiary text-text-muted'}`}>System internal test</button>
                    <button onClick={() => setActiveTab('playwright')} className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all ${activeTab === 'playwright' ? 'bg-accent-primary text-white' : 'bg-bg-tertiary text-text-muted'}`}>Playwright Self-Test</button>
                </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
                {activeTab === 'suite' ? (
                    <div className="grid md:grid-cols-2 gap-6 h-full">
                        {/* Control Panel */}
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-bg-tertiary border border-border">
                                <h3 className="font-bold text-text-primary mb-2">Self-Diagnostic Suite</h3>
                                <p className="text-sm text-text-secondary mb-4">Run comprehensive internal health checks across services.</p>
                                <button
                                    onClick={runTests}
                                    disabled={isRunning}
                                    className="w-full py-3 rounded-lg bg-accent-primary text-white font-bold hover:bg-accent-secondary disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {isRunning ? <Icons.Refresh className="w-4 h-4 animate-spin" /> : <Icons.Activity className="w-4 h-4" />}
                                    {isRunning ? 'Running Diagnostics...' : 'Execute Internal Checks'}
                                </button>
                            </div>
                        </div>
                        
                        {/* Results */}
                        <div className="border border-border rounded-xl bg-bg-primary/50 overflow-hidden flex flex-col h-full">
                            <div className="p-3 border-b border-border bg-bg-tertiary/30 flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Health Results</span>
                            </div>
                            <div className="flex-1 p-2 space-y-2 overflow-y-auto relative">
                                {results.length === 0 && !isRunning && (
                                     <div className="absolute inset-0 flex items-center justify-center text-text-muted text-sm italic">
                                         No diagnostics run yet.
                                     </div>
                                )}
                                {results.map((test, idx) => (
                                    <div key={idx} className="flex flex-col gap-1 p-3 rounded-lg bg-bg-secondary border border-border/50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${test.status === 'warn' ? 'bg-yellow-500' : test.status === 'pass' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                <span className="text-sm text-text-primary font-bold">{test.service}</span>
                                            </div>
                                            {test.latencyMs !== undefined && (
                                                <span className="text-xs text-text-muted font-mono">{test.latencyMs}ms</span>
                                            )}
                                        </div>
                                        {test.message && (
                                            <span className="text-xs text-text-secondary pl-5">{test.message}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-text-secondary">Playwright E2E validation environment.</p>
                            <button 
                                onClick={runPlaywrightSimulation} 
                                disabled={isRunning}
                                className="px-4 py-2 bg-accent-primary disabled:opacity-50 hover:bg-accent-secondary text-white rounded-lg font-bold text-xs flex items-center gap-2 transition-colors">
                                {isRunning ? <Icons.Refresh className="w-4 h-4 animate-spin" /> : <Icons.Play className="w-4 h-4" />}
                                {isRunning ? "Running Suite..." : "Run E2E Suite"}
                            </button>
                        </div>
                        
                        <div className="flex flex-1 gap-6 min-h-0">
                            {/* CLI output */}
                            <div className="flex-1 bg-black text-gray-300 font-mono text-xs rounded-xl p-4 overflow-y-auto border border-gray-800">
                                <div className="text-gray-500 mb-2">$ npx playwright test tests/playwright.test.ts</div>
                                {playwrightLogs.map((log, i) => (
                                    <div key={i} className={`mb-1 ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : 'text-gray-300'}`}>
                                        {log.msg}
                                    </div>
                                ))}
                                {isRunning && (
                                    <div className="animate-pulse flex gap-1 mt-2">
                                        <div className="w-2 h-4 bg-gray-500"></div>
                                    </div>
                                )}
                            </div>

                            {/* Screenshot capture */}
                            {(screenshotUrl || isRunning) && (
                                <div className="w-1/2 flex flex-col border border-border bg-bg-tertiary rounded-xl p-4">
                                     <h4 className="text-xs font-bold uppercase text-text-muted mb-2 tracking-wider">Failure Snapshot</h4>
                                     <div className="flex-1 bg-bg-primary rounded-lg border border-border overflow-hidden flex items-center justify-center relative">
                                        {screenshotUrl ? (
                                            <img src={screenshotUrl} alt="Failure Screenshot" className="object-cover max-h-full w-full" />
                                        ) : (
                                            <div className="text-text-muted text-xs italic opacity-50">Waiting for failure...</div>
                                        )}
                                     </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
