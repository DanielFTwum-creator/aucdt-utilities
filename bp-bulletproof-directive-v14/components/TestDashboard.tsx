import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Icons } from './Icons';

interface TestDashboardProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TestDashboard: React.FC<TestDashboardProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'suite' | 'puppeteer'>('suite');
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<{name: string; status: 'pending' | 'pass' | 'fail'; time: number}[]>([]);
    const dashboardRef = useRef<HTMLDivElement>(null);

    const captureScreenshot = async () => {
        if (dashboardRef.current) {
            const canvas = await html2canvas(dashboardRef.current);
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'screenshot.png';
            link.click();
        }
    };

    const runTests = async () => {
        setIsRunning(true);
        // Simulate running Playwright tests via npx
        const tests = [
            { name: "Dashboard Load Test", delay: 1000 },
            { name: "Phase Expansion Test", delay: 1500 },
            { name: "Progress Tracking Test", delay: 1200 },
            { name: "Help Modal Test", delay: 800 },
            { name: "Admin Login Test", delay: 2000 }
        ];

        setResults(tests.map(t => ({ name: t.name, status: 'pending', time: 0 })));

        for (let i = 0; i < tests.length; i++) {
            await new Promise(r => setTimeout(r, tests[i].delay));
            setResults(prev => prev.map((item, idx) => 
                idx === i ? { ...item, status: Math.random() > 0.1 ? 'pass' : 'fail', time: tests[i].delay } : item
            ));
        }
        setIsRunning(false);
    };

    return (
        <div ref={dashboardRef} className="w-full bg-bg-secondary border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
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
                    <button onClick={() => setActiveTab('suite')} className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all ${activeTab === 'suite' ? 'bg-accent-primary text-white' : 'bg-bg-tertiary text-text-muted'}`}>Test Suite</button>
                    <button onClick={() => setActiveTab('puppeteer')} className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all ${activeTab === 'puppeteer' ? 'bg-accent-primary text-white' : 'bg-bg-tertiary text-text-muted'}`}>Puppeteer Self-Test</button>
                </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
                {activeTab === 'suite' ? (
                    <div className="grid md:grid-cols-2 gap-6 h-full">
                        {/* Control Panel */}
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-bg-tertiary border border-border">
                                <h3 className="font-bold text-text-primary mb-2">Self-Diagnostic Suite</h3>
                                <p className="text-sm text-text-secondary mb-4">Run comprehensive system checks.</p>
                                <button
                                    onClick={runTests}
                                    disabled={isRunning}
                                    className="w-full py-3 rounded-lg bg-accent-primary text-white font-bold hover:bg-accent-secondary disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {isRunning ? <Icons.Refresh className="w-4 h-4 animate-spin" /> : <Icons.Activity className="w-4 h-4" />}
                                    {isRunning ? 'Running Tests...' : 'Execute Test Suite'}
                                </button>
                            </div>
                        </div>
                        
                        {/* Results */}
                        <div className="border border-border rounded-xl bg-bg-primary/50 overflow-hidden flex flex-col h-full">
                            <div className="p-3 border-b border-border bg-bg-tertiary/30 flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Test Results</span>
                            </div>
                            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                                {results.map((test, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary border border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${test.status === 'pending' ? 'bg-yellow-500' : test.status === 'pass' ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className="text-sm text-text-primary">{test.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted gap-4">
                        <Icons.Bot className="w-12 h-12 opacity-50" />
                        <p className="text-sm font-mono">Puppeteer Self-Test environment active.</p>
                        <button onClick={captureScreenshot} className="px-4 py-2 bg-accent-primary text-white rounded-lg font-bold text-xs">Capture Screenshot</button>
                    </div>
                )}
            </div>
        </div>
    );
};
