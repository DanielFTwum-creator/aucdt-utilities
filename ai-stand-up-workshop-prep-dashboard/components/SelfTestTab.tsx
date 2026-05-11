import React, { useState } from 'react';
import { TestResult, TestStatus } from '../types';
import { TEST_SUITES } from '../tests/userJourneys';

const SelfTestTab: React.FC = () => {
    const [results, setResults] = useState<TestResult[]>([]);
    const [isTesting, setIsTesting] = useState(false);
    const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'completed'>('idle');

    const runTests = async () => {
        setIsTesting(true);
        setOverallStatus('running');
        const initialResults: TestResult[] = TEST_SUITES.map(suite => ({
            suiteId: suite.id,
            title: suite.title,
            status: 'running',
            stepResults: suite.steps.map(step => ({
                description: step.description,
                status: 'pending',
                log: 'Waiting to run...'
            }))
        }));
        setResults(initialResults);

        for (let i = 0; i < TEST_SUITES.length; i++) {
            const suite = TEST_SUITES[i];
            let suitePassed = true;

            for (let j = 0; j < suite.steps.length; j++) {
                const step = suite.steps[j];
                
                // Update step to running
                setResults(prev => prev.map(r => r.suiteId === suite.id ? { ...r, stepResults: r.stepResults.map((sr, idx) => idx === j ? { ...sr, status: 'running', log: 'Executing...' } : sr) } : r));
                
                try {
                    const success = await step.action();
                    if (!success) throw new Error('Assertion failed');
                    
                    // Update step to pass
                    setResults(prev => prev.map(r => r.suiteId === suite.id ? { ...r, stepResults: r.stepResults.map((sr, idx) => idx === j ? { ...sr, status: 'pass', log: `✅ OK - Screenshot: ${step.description} completed.` } : sr) } : r));

                } catch (error) {
                    suitePassed = false;
                    // Update step to fail
                     setResults(prev => prev.map(r => r.suiteId === suite.id ? { ...r, stepResults: r.stepResults.map((sr, idx) => idx === j ? { ...sr, status: 'fail', log: `❌ FAIL - ${error instanceof Error ? error.message : 'Unknown error'}` } : sr) } : r));
                    break; 
                }
            }
            
            // Update suite status
            setResults(prev => prev.map(r => r.suiteId === suite.id ? { ...r, status: suitePassed ? 'pass' : 'fail' } : r));
        }

        setIsTesting(false);
        setOverallStatus('completed');
    };

    const StatusIcon: React.FC<{ status: TestStatus }> = ({ status }) => {
        switch (status) {
            case 'pass': return <span className="text-green-500">✔</span>;
            case 'fail': return <span className="text-red-500">✖</span>;
            case 'running': return <span className="text-yellow-500 animate-spin">●</span>;
            case 'pending': return <span className="text-[var(--color-text-muted)]">○</span>;
            default: return null;
        }
    };
    
    const passedCount = results.filter(r => r.status === 'pass').length;
    const totalCount = results.length;

    return (
        <section className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-[1.8rem] font-semibold text-[var(--color-text-primary)]">Puppeteer Self-Test Suite</h2>
                    <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">
                        This panel simulates a Puppeteer test run for critical user journeys directly in your browser.
                    </p>
                </div>
                <button
                    onClick={runTests}
                    disabled={isTesting}
                    className="py-2 px-6 rounded-md font-semibold text-[var(--color-text-inverted)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)] disabled:bg-[var(--color-text-muted)] disabled:cursor-not-allowed"
                >
                    {isTesting ? 'Running...' : 'Run Self-Test Suite'}
                </button>
            </div>

            <div className="bg-[var(--color-surface)] rounded-lg shadow-md border-l-4 border-[var(--color-accent)] p-6">
                {overallStatus === 'idle' && <p className="text-center text-[var(--color-text-muted)]">Click the button to start the test suite.</p>}
                {overallStatus !== 'idle' && (
                    <>
                        <div className="mb-4 p-3 bg-[var(--color-background)] rounded">
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                                Test Summary: {overallStatus === 'completed' ? `${passedCount} / ${totalCount} suites passed` : 'In Progress...'}
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {results.map(result => (
                                <details key={result.suiteId} className="bg-[var(--color-background)] rounded-lg border border-[var(--color-border)] overflow-hidden">
                                    <summary className="p-3 font-medium text-[var(--color-text-primary)] cursor-pointer hover:bg-[var(--color-border)]/20 flex items-center gap-3">
                                        <StatusIcon status={result.status} />
                                        <span>{result.title}</span>
                                    </summary>
                                    <div className="p-3 border-t border-[var(--color-border)]">
                                        <ul className="space-y-2">
                                            {result.stepResults.map((step, index) => (
                                                <li key={index} className="flex items-start gap-3 text-sm">
                                                    <div className="mt-1"><StatusIcon status={step.status} /></div>
                                                    <div className="flex-1">
                                                        <p className="text-[var(--color-text-secondary)]">{step.description}</p>
                                                        <p className="text-xs text-[var(--color-text-muted)] font-mono">{step.log}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default SelfTestTab;
