# ai-stand-up-workshop-prep-dashboard - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for ai-stand-up-workshop-prep-dashboard.

### FILE: (environment files omitted)

> Environment files are never committed. See the repo's own `.env.example`
> for variable names; real values live only in the server's untracked
> `.env.local` / `.env.production`. This block was removed by the fleet
> secret-scrub (blueprint minus secrets).

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: App.tsx
```typescript
import React from 'react';
import { TabId } from './types';
import { TABS } from './constants';
import Header from './components/Header';
import Tabs from './components/Tabs';
import OverviewTab from './components/OverviewTab';
import TeamStatusTab from './components/TeamStatusTab';
import WorkshopTab from './components/WorkshopTab';
import ConceptsTab from './components/ConceptsTab';
import AdminTab from './components/AdminTab';
import SelfTestTab from './components/SelfTestTab';
import { useAppContext } from './context/AppContext';

const App: React.FC = () => {
    const { activeTab, setActiveTab } = useAppContext();
    const contentRef = React.useRef<HTMLDivElement>(null);

    const handleTabChange = (tabId: TabId) => {
        setActiveTab(tabId);
        setTimeout(() => {
            contentRef.current?.focus();
        }, 0);
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab />;
            case 'status':
                return <TeamStatusTab />;
            case 'workshop':
                return <WorkshopTab />;
            case 'concepts':
                return <ConceptsTab />;
            case 'admin':
                return <AdminTab />;
            case 'selftest':
                return <SelfTestTab />;
            default:
                return <OverviewTab />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Header />
            <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={handleTabChange} />
            <main>
                 <div
                    ref={contentRef}
                    role="tabpanel"
                    id={`panel-${activeTab}`}
                    aria-labelledby={`tab-${activeTab}`}
                    tabIndex={-1}
                    className="outline-none"
                >
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default App;
```

### FILE: components/AdminTab.tsx
```typescript
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const AdminTab: React.FC = () => {
    const { isAuthenticated, login, logout, auditLogs } = useAppContext();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(password);
        if (!success) {
            setError('Invalid password. Please try again.');
            setPassword('');
        } else {
            setError('');
            setPassword('');
        }
    };

    if (!isAuthenticated) {
        return (
            <section className="max-w-md mx-auto p-6 bg-[var(--color-surface)] rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                <h2 className="text-[1.8rem] font-semibold text-[var(--color-text-primary)] mb-4">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-primary)]">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-[var(--color-border)] shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                            required
                            aria-describedby="password-error"
                        />
                    </div>
                    {error && <p id="password-error" className="text-sm text-red-500">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-md font-semibold text-[var(--color-text-inverted)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]"
                    >
                        Login
                    </button>
                </form>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-[1.8rem] font-semibold text-[var(--color-text-primary)]">Admin Panel</h2>
                <button
                    onClick={logout}
                    className="py-2 px-4 rounded-md font-semibold text-[var(--color-text-inverted)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]"
                >
                    Logout
                </button>
            </div>

            <div className="bg-[var(--color-surface)] rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                <h3 className="text-[1.5rem] font-medium text-[var(--color-text-primary)] p-4 border-b border-[var(--color-border)]">Audit Log</h3>
                <div className="p-4 max-h-96 overflow-y-auto">
                    {auditLogs.length > 0 ? (
                         <table className="w-full text-left">
                            <thead className="sticky top-0 bg-[var(--color-surface)]">
                                <tr>
                                    <th className="p-2 text-sm font-semibold text-[var(--color-text-muted)] uppercase">Timestamp</th>
                                    <th className="p-2 text-sm font-semibold text-[var(--color-text-muted)] uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLogs.map((log, index) => (
                                    <tr key={index} className="border-b border-[var(--color-border)] last:border-b-0">
                                        <td className="p-2 text-sm text-[var(--color-text-secondary)] font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="p-2 text-sm text-[var(--color-text-secondary)]">{log.action}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-base text-[var(--color-text-secondary)]">No audit logs yet.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AdminTab;

```

### FILE: components/AIAgent.tsx
```typescript
import React from 'react';

/**
 * AIAgent Component
 * 
 * This component serves as the primary integration point for future AI-driven functionalities.
 * In Phase 1, it is a placeholder to establish the architectural foundation.
 * 
 * Future Capabilities:
 * - Dynamically generating meeting summaries from transcripts.
 * - Identifying key topics and blockers using Natural Language Processing.
 * - Powering interactive Q&A sessions about the project status.
 */
const AIAgent: React.FC = () => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-[#2E4034] mt-8">
            <h3 className="text-[1.5rem] font-medium text-[#2C1810] mb-3">AI Agent Status</h3>
            <p className="text-base text-[#2C1810]/90 leading-[1.6]">
                AI Agent component initialized. Ready for Phase 2 integration.
            </p>
        </div>
    );
};

export default AIAgent;

```

### FILE: components/ConceptsTab.tsx
```typescript
import React from 'react';
import { TECH_CONCEPTS } from '../constants';

const ConceptsTab: React.FC = () => {
    return (
        <section className="space-y-4 animate-fade-in">
            <h2 className="text-[1.8rem] font-semibold text-[var(--color-text-primary)] mb-4">Technical Concepts</h2>
            <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] mb-6">
                This section provides simple explanations for the technical terms and acronyms discussed during the meeting.
            </p>
            
            <div className="space-y-3">
                {TECH_CONCEPTS.map((concept, index) => (
                    <details key={index} className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] overflow-hidden">
                        <summary className="p-4 font-medium text-[var(--color-text-primary)] cursor-pointer hover:bg-[var(--color-background)] flex justify-between items-center">
                            <span>{concept.title}</span>
                            <span className="details-arrow text-[var(--color-text-muted)]"></span>
                        </summary>
                        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                            <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">{concept.description}</p>
                        </div>
                    </details>
                ))}
            </div>
        </section>
    );
};

export default ConceptsTab;
```

### FILE: components/DonutChart.tsx
```typescript
import React, { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Legend, Tooltip, ChartOptions, ChartConfiguration } from 'chart.js';
import { useAppContext } from '../context/AppContext';

Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

const chartData = {
    labels: ['Gemini Free Apps', 'Gemini 2.5 Pro Apps'],
    data: [76, 127],
};

const DonutChart: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);
    const { theme } = useAppContext();

    const themeColors = {
        light: { primary: '#8B1538', accent: '#D4AF37', text: '#2C1810' },
        dark: { primary: '#b13e61', accent: '#e0c56c', text: '#f0f0f0' },
        'high-contrast': { primary: '#FFFF00', accent: '#00FFFF', text: '#FFFFFF' },
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const currentThemeColors = themeColors[theme];

        const options: ChartOptions<'doughnut'> = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: currentThemeColors.text,
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} apps`;
                        }
                    }
                }
            }
        };

        const config: ChartConfiguration<'doughnut'> = {
            type: 'doughnut',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'AI Apps Generated',
                    data: chartData.data,
                    backgroundColor: [currentThemeColors.primary, currentThemeColors.accent],
                    borderColor: [currentThemeColors.primary, currentThemeColors.accent],
                    borderWidth: 1
                }]
            },
            options: options
        };

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, config);

        return () => {
            chartRef.current?.destroy();
        };
    }, [theme]);

    return (
        <div className="relative w-full max-w-lg mx-auto h-80 md:h-96">
            <div className="sr-only">
                <table>
                    <caption>Daniel's AI App Generation (Last 3 Months)</caption>
                    <thead>
                        <tr>
                            <th>App Type</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{chartData.labels[0]}</td>
                            <td>{chartData.data[0]}</td>
                        </tr>
                        <tr>
                            <td>{chartData.labels[1]}</td>
                            <td>{chartData.data[1]}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <canvas ref={canvasRef} role="img" aria-label="A donut chart showing 76 Gemini Free Apps and 127 Gemini 2.5 Pro Apps."></canvas>
        </div>
    );
};

export default DonutChart;
```

### FILE: components/Header.tsx
```typescript
import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const Header: React.FC = () => {
    return (
        <header className="mb-8 border-b border-[var(--color-border)] pb-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-[2.5rem] leading-tight font-bold text-[var(--color-text-primary)] mb-2">Team Stand-up & AI Workshop Strategy</h1>
                    <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">An interactive summary of the team's progress, technical blockers, and preparation for the upcoming AI workshop.</p>
                </div>
                <ThemeSwitcher />
            </div>
        </header>
    );
};

export default Header;
```

### FILE: components/OverviewTab.tsx
```typescript
import React from 'react';
import DonutChart from './DonutChart';

const OverviewTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <section>
                <h2 className="text-[1.8rem] font-semibold text-[var(--color-text-primary)] mb-4">Meeting Overview</h2>
                <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] mb-6">
                    This section summarizes the key discussion points and blockers identified during the stand-up meeting. The team covered technical hurdles in development and deployment, as well as a detailed plan for an upcoming AI presentation aimed at faculty.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[var(--color-surface)] p-5 rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                        <h3 className="font-medium text-[1.5rem] text-[var(--color-primary-dark)] mb-1">Main Topic: AI Workshop</h3>
                        <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">Daniel is preparing a crucial presentation for Monday at 8:00 AM to demonstrate the practical use of AI in digital media, targeting skeptical faculty members.</p>
                    </div>
                    <div className="bg-[var(--color-surface)] p-5 rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                        <h3 className="font-medium text-[1.5rem] text-red-500 mb-1">Jerry's Blocker: Single Device</h3>
                        <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">Jerry's progress is slowed as he must use the same tablet for both taking student attendance and uploading results, creating a critical bottleneck.</p>
                    </div>
                    <div className="bg-[var(--color-surface)] p-5 rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                        <h3 className="font-medium text-[1.5rem] text-red-500 mb-1">Mandela's Blocker: `pnpm`</h3>
                        <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">Mandela is facing package compatibility issues between `pnpm` and older packages in the Angular UI project, preventing successful SQA deployment.</p>
                    </div>
                </div>
            </section>
            
            <section>
                <h2 className="text-[1.8rem] font-semibold text-[var(--color-text-primary)] mb-4">Daniel's AI App Generation (Last 3 Months)</h2>
                <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] mb-6">
                    To illustrate his experience ahead of the workshop, Daniel mentioned the volume of AI applications he has generated. This chart visualizes the breakdown between the free Gemini model and the more advanced Gemini 2.5 Pro.
                </p>
                <div className="bg-[var(--color-surface)] p-6 rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                    <DonutChart />
                </div>
            </section>
        </div>
    );
};

export default OverviewTab;
```

### FILE: components/SelfTestTab.tsx
```typescript
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

```

### FILE: components/Tabs.tsx
```typescript
import React from 'react';
import { Tab, TabId } from '../types';

interface TabsProps {
    tabs: Tab[];
    activeTab: TabId;
    setActiveTab: (tabId: TabId) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <nav role="tablist" aria-label="Main content" className="flex border-b border-[var(--color-border)] mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    role="tab"
                    aria-controls={`panel-${tab.id}`}
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[var(--color-text-muted)] border-b-2 border-transparent hover:text-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${activeTab === tab.id ? 'border-[var(--color-primary)] text-[var(--color-primary)] font-semibold' : ''}`}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default Tabs;
```

### FILE: components/TeamStatusTab.tsx
```typescript
import React, { useState } from 'react';
import { TeamMemberId } from '../types';
import { TEAM_MEMBERS } from '../constants';

const TeamStatusTab: React.FC = () => {
    const [activeMember, setActiveMember] = useState<TeamMemberId>('daniel');
    const member = TEAM_MEMBERS[activeMember];

    return (
        <section className="space-y-6 animate-fade-in" aria-labelledby="team-status-heading">
            <h2 id="team-status-heading" className="text-[1.8rem] font-semibold text-[var(--color-text-primary)] mb-4">Team Status & Blockers</h2>
            <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] mb-6">
                Click on a team member to see their detailed update, including completed tasks, current work, and any impediments slowing them down.
            </p>
            
            <div role="tablist" aria-label="Team members" className="flex flex-wrap gap-2 mb-6">
                {Object.values(TEAM_MEMBERS).map((m) => (
                    <button
                        key={m.id}
                        id={`status-tab-${m.id}`}
                        role="tab"
                        aria-controls="status-panel"
                        aria-selected={activeMember === m.id}
                        onClick={() => setActiveMember(m.id)}
                        className={`py-2 px-4 rounded-full text-sm font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-text-inverted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${activeMember === m.id ? 'bg-[var(--color-accent)] text-[var(--color-text-inverted)] border-[var(--color-accent)]' : ''}`}
                    >
                        {m.name}
                    </button>
                ))}
            </div>

            <div id="status-panel" role="tabpanel" aria-labelledby={`status-tab-${activeMember}`} className="bg-[var(--color-surface)] rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                <div className="p-6">
                    <h3 className="text-[1.5rem] font-medium text-[var(--color-text-primary)] mb-3">{member.name}</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase">Update</h4>
                            <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">{member.update}</p>
                        </div>
                        <div>
                            <h4 className={`text-sm font-semibold uppercase ${member.blocker.isCritical ? 'text-red-500' : 'text-[var(--color-text-muted)]'}`}>Blocker</h4>
                            <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">{member.blocker.text}</p>
                        </div>
                        {member.quote && (
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase">Key Quote</h4>
                                <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] italic border-l-4 border-[var(--color-accent)] pl-4">{member.quote}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TeamStatusTab;
```

### FILE: components/ThemeSwitcher.tsx
```typescript
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Theme } from '../types';

const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useAppContext();

    const themes: { id: Theme; label: string }[] = [
        { id: 'light', label: 'Light' },
        { id: 'dark', label: 'Dark' },
        { id: 'high-contrast', label: 'Contrast' },
    ];

    return (
        <div className="flex items-center space-x-2 p-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)]">
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    aria-pressed={theme === t.id}
                    className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                        theme === t.id
                            ? 'bg-[var(--color-accent)] text-[var(--color-text-inverted)]'
                            : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                    }`}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
};

export default ThemeSwitcher;

```

### FILE: components/WorkshopTab.tsx
```typescript
import React, { useState, useMemo } from 'react';

const WorkshopTab: React.FC = () => {
    const [mallType, setMallType] = useState('Luxury Mall');
    const [time, setTime] = useState('Nighttime');
    const [angle, setAngle] = useState('Wide Angle');
    const [useGreenScreen, setUseGreenScreen] = useState(true);

    const generatedPrompt = useMemo(() => {
        let prompt = `A ${angle.toLowerCase()} image of a ${mallType.toLowerCase()} during ${time.toLowerCase()}.`;
        if (useGreenScreen) {
            prompt += " The main subject should be in the foreground, with a flat green screen background for easy replacement.";
        }
        return prompt;
    }, [mallType, time, angle, useGreenScreen]);

    return (
        <div className="space-y-8 animate-fade-in">
            <section>
                <h2 className="text-[1.8rem] font-semibold text-[var(--color-text-primary)] mb-4">AI Workshop Deep Dive</h2>
                <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">The primary focus of the meeting was Daniel's strategy for the Monday AI workshop. The goal is to shift the faculty's perspective from viewing AI as a cheating tool to seeing it as a powerful creative assistant.</p>
            </section>

            <section>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">The Demo: From Inspiration to Creation</h3>
                <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] mb-6">Daniel's presentation will demonstrate a practical workflow using AI Studio's UI to generate an image from a simple idea and then use that asset in a video editor like CapCut.</p>

                <div className="space-y-6">
                    <div className="text-center text-2xl font-bold text-[var(--color-text-primary)]/40">▼</div>

                    <div className="bg-[var(--color-surface)] p-6 rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                        <h4 className="text-[1.5rem] font-medium text-[var(--color-primary-dark)] mb-4">Step 1 & 2: Idea & AI Studio (Interactive Demo)</h4>
                        <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] mb-4">Instead of complex prompting, use simple UI controls to generate a base image. Try the controls below to see how the prompt is built.</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label htmlFor="demo-mall-type" className="block text-sm font-medium text-[var(--color-text-primary)]">Mall Type</label>
                                <select id="demo-mall-type" value={mallType} onChange={(e) => setMallType(e.target.value)} className="mt-1 block w-full rounded-md border-[var(--color-border)] shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm bg-[var(--color-surface)] text-[var(--color-text-primary)]">
                                    <option>Traditional Mall</option>
                                    <option>Lifestyle Outlet</option>
                                    <option>Luxury Mall</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="demo-time" className="block text-sm font-medium text-[var(--color-text-primary)]">Time / Weather</label>
                                <select id="demo-time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 block w-full rounded-md border-[var(--color-border)] shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm bg-[var(--color-surface)] text-[var(--color-text-primary)]">
                                    <option>Daytime</option>
                                    <option>Nighttime</option>
                                    <option>Rain</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="demo-angle" className="block text-sm font-medium text-[var(--color-text-primary)]">Angle</label>
                                <select id="demo-angle" value={angle} onChange={(e) => setAngle(e.target.value)} className="mt-1 block w-full rounded-md border-[var(--color-border)] shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm bg-[var(--color-surface)] text-[var(--color-text-primary)]">
                                    <option>Eye-level</option>
                                    <option>Wide Angle</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <div className="relative flex items-start">
                                    <div className="flex h-5 items-center">
                                        <input id="demo-green-screen" type="checkbox" checked={useGreenScreen} onChange={(e) => setUseGreenScreen(e.target.checked)} className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-[var(--color-surface)]" />
                                    </div>
                                    <div className="ml-2 text-sm">
                                        <label htmlFor="demo-green-screen" className="font-medium text-[var(--color-text-primary)]">Use Green Screen</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--color-background)] p-4 rounded">
                            <p className="text-sm font-semibold text-[var(--color-text-muted)] uppercase">Generated Prompt:</p>
                            <pre className="text-sm text-[var(--color-text-primary)] whitespace-pre-wrap font-mono">{generatedPrompt}</pre>
                        </div>
                    </div>

                    <div className="text-center text-2xl font-bold text-[var(--color-text-primary)]/40">▼</div>

                    <div className="bg-[var(--color-surface)] p-6 rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                        <h4 className="text-[1.5rem] font-medium text-[var(--color-primary-dark)] mb-3">Step 3: Edit in CapCut</h4>
                        <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] mb-4">The downloaded image with the green screen is imported into a video editor. The green screen acts as a placeholder for another video layer.</p>
                        <div className="bg-[var(--color-background)] p-4 rounded flex items-center space-x-4">
                            <div className="text-sm p-2 bg-green-200 text-green-800 rounded">Video Layer (Dancers)</div>
                            <div className="text-lg font-bold text-[var(--color-text-muted)]">+</div>
                            <div className="text-sm p-2 bg-[var(--color-primary)]/20 text-[var(--color-primary-dark)] rounded">Image Layer (Mall)</div>
                            <div className="text-lg font-bold text-[var(--color-text-muted)]">=</div>
                            <div className="text-sm p-2 bg-[#2E4034]/20 text-[#2E4034] rounded">Final Composite Video</div>
                        </div>
                    </div>

                    <div className="text-center text-2xl font-bold text-[var(--color-text-primary)]/40">▼</div>

                    <div className="bg-[var(--color-accent)]/30 p-6 rounded-lg border border-[var(--color-accent)]">
                        <h4 className="text-lg font-semibold text-[var(--color-primary-dark)] mb-3">The Point: AI as a Tool</h4>
                        <p className="text-[var(--color-text-primary)] text-base leading-[1.6]">"It's not about the use of AI and previous work. It's about how they are able to use it. <span className="font-bold">How do you utilize artificial intelligence to help you get things done.</span>"</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WorkshopTab;
```

### FILE: constants.ts
```typescript
import { Tab, TeamMember, TechConcept, TeamMemberId } from './types';

export const TABS: Tab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'status', label: 'Team Status' },
    { id: 'workshop', label: 'AI Workshop Deep Dive' },
    { id: 'concepts', label: 'Tech Concepts' },
    { id: 'admin', label: 'Admin' },
    { id: 'selftest', label: 'Puppeteer Self-Test' },
];

export const TEAM_MEMBERS: Record<TeamMemberId, TeamMember> = {
    daniel: {
        id: 'daniel',
        name: 'Daniel Twum',
        update: 'Preparing for the AI workshop on Monday. Also dealing with a YouTube copyright flag on a new video due to background music. Highlighted that the AI detection is "getting amazingly better."',
        blocker: {
            text: 'No technical blockers, but facing a strategic challenge with faculty skepticism towards AI adoption.',
            isCritical: false,
        },
        quote: '"Think of judgment day when you are doing these things. Judgment Day, they will see this guy unknowingly reduce the volume... to hide the fact that he stole that the lumbers music."'
    },
    mandela: {
        id: 'mandela',
        name: 'Mandela Vudugah',
        update: 'Successfully pulled the dev front-end (Angular UI) into SQA. Working on the pipeline YAML file, which he identifies as part of "Infrastructure via code" (CI/CD).',
        blocker: {
            text: 'The SQA environment uses `pnpm`, which is incompatible with some old packages in the Angular project. He is currently working on removing these old packages to achieve compatibility.',
            isCritical: true,
        },
    },
    jerry: {
        id: 'jerry',
        name: 'Jerry',
        update: 'Completed some uploads and uploaded one new item this morning. Also responsible for taking student attendance. Daniel noted his job is "not easy" due to distractions.',
        blocker: {
            text: 'Progress is "slowing down" because he has only one tablet. He must use this single device to both take attendance for incoming students and perform the upload of results.',
            isCritical: true,
        },
    }
};

export const TECH_CONCEPTS: TechConcept[] = [
    {
        title: 'YouTube Copyright AI',
        description: 'A sophisticated system YouTube uses to automatically detect copyrighted material (especially music) in uploaded videos. It can flag a video immediately upon posting, as Daniel experienced. Mandela suggested lowering the volume and talking over it, but Daniel noted the AI is "getting amazingly better" at catching such tricks.'
    },
    {
        title: 'CI/CD (Infrastructure via Code)',
        description: 'Stands for Continuous Integration / Continuous Deployment. Daniel referred to this as "coding infrastructure via code." In this context, Mandela\'s `pipeline.yaml` file is the "code" that defines the "infrastructure." This file tells the system (Bitbucket) how to automatically take the application code, build it, and deploy it (e.g., as WAR files) to the correct servers (like SQA).'
    },
    {
        title: '`pnpm` (Performant npm)',
        description: 'A package manager for JavaScript (like `npm` or `yarn`). Mandela\'s blocker is that the SQA server uses `pnpm`, but the Angular project has older packages that are not compatible with it. He must remove or update these packages before the automated CI/CD pipeline will work.'
    },
    {
        title: 'Green Screen (Chroma Key)',
        description: 'A "trick used in Hollywood" where a subject is filmed against a solid-colored (usually bright green) background. In post-production, a video editor (like CapCut) can digitally remove the green color and replace it with any other image or video. Daniel\'s demo will use AI to *generate* an image that already includes a green screen, ready for this process.'
    }
];
```

### FILE: context/AppContext.tsx
```typescript
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Theme, AuditLog, AppContextState, TabId } from '../types';

const AppContext = createContext<AppContextState | undefined>(undefined);

const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme');
        return (savedTheme as Theme) || 'light';
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark', 'high-contrast');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const addAuditLog = (action: string) => {
        const newLog: AuditLog = {
            timestamp: new Date().toISOString(),
            action,
        };
        setAuditLogs(prevLogs => [newLog, ...prevLogs]);
    };
    
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        addAuditLog(`Theme changed to ${newTheme}`);
    }

    const login = (password: string): boolean => {
        if (password =[REDACTED_CREDENTIAL]
            setIsAuthenticated(true);
            addAuditLog('Admin login successful.');
            return true;
        }
        addAuditLog('Admin login failed.');
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        addAuditLog('Admin logged out.');
        setActiveTab('overview');
    };

    const value: AppContextState = {
        theme,
        setTheme,
        isAuthenticated,
        login,
        logout,
        auditLogs,
        addAuditLog,
        activeTab,
        setActiveTab
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextState => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

```

### FILE: CREATION.md
```md
# ai-stand-up-workshop-prep-dashboard

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: Dockerfile
```text
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

```

### FILE: docs/AdministratorGuide.md
```md
# Administrator Guide
## for AI Stand-up & Workshop Prep Dashboard

### Version 1.0

---

### 1. Introduction

This guide provides instructions for administrators on how to access and use the administrative features of the AI Stand-up & Workshop Prep Dashboard. The primary administrative function is to review an audit log of key user actions within the application.

### 2. Accessing the Admin Panel

The administrative section is a protected area of the application.

1.  **Navigate to the Admin Tab:** Open the application in your web browser. In the main navigation bar at the top of the page, click on the **"Admin"** tab.
2.  **View the Login Form:** You will be presented with a secure login form. Access to the rest of the application is still available by clicking other tabs, but the admin features will remain locked.

### 3. Authentication

#### 3.1 Logging In

To gain access to the admin panel, you must authenticate with the correct password.

1.  **Enter Password:** In the provided password field, enter the administrator password.
    -   **Default Password:** `admin123`
2.  **Submit:** Click the "Login" button.

-   **On Success:** If the password is correct, the login form will be replaced by the Admin Panel, which displays the Audit Log. A "Login successful" message will be added to the log.
-   **On Failure:** If the password is incorrect, an "Invalid password" error message will appear below the input field. The input field will be cleared, and a "Login failed" message will be recorded in the audit log.

#### 3.2 Logging Out

For security, always log out of the admin panel when you are finished.

1.  **Click Logout:** In the top right corner of the Admin Panel, click the **"Logout"** button.
2.  **Confirmation:** You will be immediately logged out and returned to the Admin login screen. The application will also automatically navigate you back to the "Overview" tab. A "Logged out" event will be recorded in the audit log.

### 4. Using the Admin Panel

The main feature of the Admin Panel is the Audit Log.

#### 4.1 Understanding the Audit Log

The Audit Log provides a chronological record of important events that occur within the application. This is useful for monitoring user activity and troubleshooting.

-   **Layout:** The log is displayed in a table with two columns:
    -   **Timestamp:** The precise date and time the event occurred, displayed in your local timezone.
    -   **Action:** A human-readable description of the event.

-   **Tracked Actions:** The following actions are currently recorded in the audit log:
    -   `Admin login successful.`
    -   `Admin login failed.`
    -   `Admin logged out.`
    -   `Theme changed to [light/dark/high-contrast].`

-   **Scrolling:** If the log contains more entries than can fit in the view, a scrollbar will appear to allow you to review older events. The newest events always appear at the top.

### 5. Security Considerations

-   **Hardcoded Password:** In this version of the application, the administrator password (`admin123`) is hardcoded directly into the source code. For any production or security-sensitive environment, this is a major vulnerability.
-   **Recommendation:** For a real-world deployment, authentication should be handled by a secure, server-side system with encrypted password storage and user management. The current implementation is for demonstration purposes only.

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — ai-stand-up-&-workshop-prep-dashboard

**Application:** ai-stand-up-&-workshop-prep-dashboard
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_ai-stand-up-&-workshop-prep-dashboard_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — ai-stand-up-&-workshop-prep-dashboard

**Application:** ai-stand-up-&-workshop-prep-dashboard
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd ai-stand-up-&-workshop-prep-dashboard
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build ai-stand-up-&-workshop-prep-dashboard
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up ai-stand-up-&-workshop-prep-dashboard
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DeploymentGuide.md
```md
# Deployment Guide
## for AI Stand-up & Workshop Prep Dashboard

### Version 1.0

---

### 1. Introduction

This guide provides step-by-step instructions for building and deploying the AI Stand-up & Workshop Prep Dashboard to a production environment.

The application is a client-side Single Page Application (SPA) built with React. This means the deployment process involves generating a set of static HTML, CSS, and JavaScript files that can be served by any modern web server or static hosting provider.

### 2. Prerequisites

Before you begin, ensure you have the following software installed on your local machine:
-   **Node.js** (LTS version recommended)
-   **npm** (comes with Node.js) or a compatible package manager like **pnpm** or **yarn**.
-   **Git** for cloning the source code repository.

### 3. Build Process

The first step is to create a production-ready build of the application. This process transpiles the TypeScript/React code, bundles all assets, and optimizes them for performance.

1.  **Clone the Repository:**
    Open your terminal, navigate to the directory where you want to store the project, and run the following command:
    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2.  **Install Dependencies:**
    Install all the necessary project dependencies by running:
    ```bash
    npm install
    ```
    *(Use `pnpm install` or `yarn` if you prefer those package managers.)*

3.  **Create the Production Build:**
    Run the build script. (Note: A standard `build` script is assumed in `package.json`).
    ```bash
    npm run build
    ```
    This command will generate a `dist` or `build` folder in your project's root directory. This folder contains all the static files (e.g., `index.html`, bundled `.js` and `.css` files) that you will deploy.

### 4. Deployment

Once you have the production build folder, you can deploy it using any static site hosting service. Below are instructions for some popular choices. The general principle is to upload the *contents* of your `build` or `dist` directory to the hosting provider.

#### 4.1 Option A: Vercel

Vercel is a zero-configuration deployment platform that is ideal for React applications.

1.  **Sign up/Log in:** Go to [vercel.com](https://vercel.com) and create an account (you can use your GitHub account).
2.  **Import Project:** From your Vercel dashboard, click "Add New... > Project".
3.  **Connect Git Repository:** Import the Git repository containing your project.
4.  **Configure Project:** Vercel will automatically detect that it is a React project. The default settings are usually correct:
    -   **Framework Preset:** `Create React App` (or `Vite` if applicable)
    -   **Build Command:** `npm run build`
    -   **Output Directory:** `build` or `dist`
5.  **Deploy:** Click the "Deploy" button. Vercel will build and deploy your site, providing you with a live URL.

#### 4.2 Option B: Netlify

Netlify offers a similar drag-and-drop or Git-based deployment workflow.

1.  **Sign up/Log in:** Go to [netlify.com](https://netlify.com) and create an account.
2.  **Drag and Drop:**
    -   On your Netlify dashboard, find the "Sites" section.
    -   Drag the `build` or `dist` folder from your local machine and drop it into the designated area in the Netlify UI.
    -   Netlify will upload the files and provide you with a live URL.
3.  **Git-based (Recommended):**
    -   Follow the on-screen instructions to connect your Git repository.
    -   Set the build command to `npm run build` and the publish directory to `build` or `dist`.
    -   Netlify will automatically deploy your site whenever you push changes to your repository.

#### 4.3 Option C: GitHub Pages

You can host your static site for free directly from your GitHub repository.

1.  **Install `gh-pages`:**
    ```bash
    npm install --save-dev gh-pages
    ```
2.  **Update `package.json`:**
    Add a `homepage` field to your `package.json`:
    ```json
    "homepage": "https://<your-username>.github.io/<your-repo-name>"
    ```
    Add the following scripts to the `scripts` section:
    ```json
    "scripts": {
      "predeploy": "npm run build",
      "deploy": "gh-pages -d build"
    }
    ```
3.  **Deploy:**
    Run the deploy script:
    ```bash
    npm run deploy
    ```
    This will build your application and push the contents of the `build` folder to a `gh-pages` branch in your repository, which will be served as your live site.

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Ai Stand Up & Workshop Prep Dashboard
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Ai Stand Up & Workshop Prep Dashboard**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Ai Stand Up & Workshop Prep Dashboard** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Ai Stand Up & Workshop Prep Dashboard** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âŒ Non-compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âŒ Non-compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/TESTING.md
```md
# Testing Guide — ai-stand-up-&-workshop-prep-dashboard

**Application:** ai-stand-up-&-workshop-prep-dashboard
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd ai-stand-up-&-workshop-prep-dashboard
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/TestingGuide.md
```md
# Testing Guide
## for AI Stand-up & Workshop Prep Dashboard

### Version 1.0

---

### 1. Introduction

This document outlines the testing procedures for the AI Stand-up & Workshop Prep Dashboard. It covers both the built-in automated self-testing capabilities and a checklist for essential manual tests to ensure application quality and functionality.

### 2. Automated Self-Testing Framework

The application includes an integrated self-testing panel that simulates a Playwright test suite, allowing for quick verification of critical user journeys directly within the browser.

#### 2.1 Accessing the Test Panel

1.  Open the application in your web browser.
2.  In the main navigation bar, click on the **"Playwright Self-Test"** tab.

#### 2.2 Running the Test Suite

1.  Click the **"Run Self-Test Suite"** button located in the top right of the panel.
2.  The button will become disabled and change its text to "Running..." while the tests are in progress.
3.  The test results will appear and update in real-time as the suites are executed.

#### 2.3 Interpreting the Results

The results panel provides a summary and a detailed breakdown of the test run.

-   **Test Summary:** A top-level summary shows the overall progress and the final count of passed vs. total test suites.
-   **Test Suites:** Each test suite is displayed in a collapsible accordion panel.
    -   **Status Icon:**
        -   `✔` (Green Check): The entire suite passed successfully.
        -   `✖` (Red X): The suite failed because one of its steps failed.
        -   `●` (Spinning Circle): The suite is currently running.
    -   **Title:** Describes the user journey being tested (e.g., "User Journey: Theme Switching").
-   **Test Steps:** Expanding a suite reveals the individual steps.
    -   **Status Icon:**
        -   `✔` (Green Check): The step's assertion passed.
        -   `✖` (Red X): The step's assertion failed.
        -   `●` (Spinning Circle): The step is currently running.
        -   `○` (Empty Circle): The step is pending execution.
    -   **Log:** A descriptive message provides context for the result.
        -   **On Pass:** `✅ OK - Screenshot: [Description] completed.` (The log simulates a screenshot capture upon success).
        -   **On Fail:** `❌ FAIL - [Error message]`.

### 3. Manual Testing Checklist

Manual testing should be performed to catch issues that automated tests might miss, especially related to visual presentation and usability.

#### TC-1: Theme Switching
| Step | Action                                             | Expected Result                                                                                               |
| :--- | :------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| 1.1  | Click the **"Dark"** theme button in the header.       | The application smoothly transitions to a dark color scheme. All text, backgrounds, and components are legible. |
| 1.2  | Click the **"Contrast"** theme button.                 | The application transitions to a high-contrast (black and white with bright accents) theme.                   |
| 1.3  | Click the **"Light"** theme button.                    | The application returns to the default light theme.                                                           |
| 1.4  | Refresh the page after selecting a theme.          | The selected theme (e.g., Dark) should persist after the refresh.                                             |

#### TC-2: Tab Navigation & Content
| Step | Action                                             | Expected Result                                                                   |
| :--- | :------------------------------------------------- | :-------------------------------------------------------------------------------- |
| 2.1  | Click the **"Team Status"** tab.                     | The "Team Status & Blockers" content is displayed. The tab is visually highlighted. |
| 2.2  | In the Team Status view, click on "Mandela".       | The content updates to show Mandela's status. The "Mandela" button is highlighted.  |
| 2.3  | Click the **"AI Workshop"** tab.                     | The "AI Workshop Deep Dive" content is displayed.                                 |
| 2.4  | On the Workshop tab, change a value in a dropdown. | The "Generated Prompt" text block updates instantly to reflect the change.        |
| 2.5  | Click the **"Tech Concepts"** tab.                   | The "Technical Concepts" content is displayed.                                    |
| 2.6  | On the Concepts tab, click a concept title.        | The details for that concept expand. Clicking again collapses it.                 |

#### TC-3: Admin Authentication
| Step | Action                                                               | Expected Result                                                                      |
| :--- | :------------------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| 3.1  | Navigate to the **"Admin"** tab.                                     | The admin login form is displayed.                                                   |
| 3.2  | Enter an incorrect password (e.g., "password") and click "Login".    | An "Invalid password" error message appears. The input field is cleared.             |
| 3.3  | Enter the correct password (`admin123`) and click "Login".           | The Admin Panel with the Audit Log table is displayed.                               |
| 3.4  | While logged in, switch to another theme.                          | The Audit Log should show a new entry: "Theme changed to [new theme]".               |
| 3.5  | Click the **"Logout"** button.                                       | You are returned to the login screen. The app navigates to the "Overview" tab.       |
| 3.6  | Log back in and check the Audit Log.                                 | The log should contain entries for the failed login, successful login, and logout.   |

```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="AI Stand-up & Workshop Prep" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="AI Stand-up & Workshop Prep" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Stand-up & Workshop Prep</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-background: #F8F6F0;
            --color-text-primary: #2C1810;
            --color-text-secondary: #2C1810/0.9;
            --color-text-muted: #2C1810/0.7;
            --color-text-inverted: #FFFFFF;
            --color-surface: #FFFFFF;
            --color-primary: #8B1538;
            --color-primary-dark: #6B1028;
            --color-accent: #D4AF37;
            --color-border: #E6D5C7;
            --color-shadow: rgba(0,0,0,0.1);
        }

        html.dark {
            --color-background: #1a1a1a;
            --color-text-primary: #f0f0f0;
            --color-text-secondary: #d1d1d1;
            --color-text-muted: #a0a0a0;
            --color-text-inverted: #1a1a1a;
            --color-surface: #2a2a2a;
            --color-primary: #b13e61;
            --color-primary-dark: #c46281;
            --color-accent: #e0c56c;
            --color-border: #444444;
            --color-shadow: rgba(255,255,255,0.1);
        }

        html.high-contrast {
            --color-background: #000000;
            --color-text-primary: #FFFFFF;
            --color-text-secondary: #F0F0F0;
            --color-text-muted: #d1d1d1;
            --color-text-inverted: #000000;
            --color-surface: #000000;
            --color-primary: #FFFF00;
            --color-primary-dark: #FFFF00;
            --color-accent: #00FFFF;
            --color-border: #FFFFFF;
            --color-shadow: rgba(255,255,255,0.5);
        }

        body {
            font-family: 'Poppins', sans-serif;
            background-color: var(--color-background);
            color: var(--color-text-primary);
            transition: background-color 0.3s, color 0.3s;
        }

        .details-arrow::after {
            content: ' ▼';
            font-size: 0.7em;
            transition: transform 0.2s;
        }
        details[open] .details-arrow::after {
            transform: rotate(180deg);
        }
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }
    </style>
<script type="importmap">
{
  "imports": {
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "chart.js": "https://aistudiocdn.com/chart.js@^4.5.1"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
<body class="bg-[var(--color-background)] text-[var(--color-text-primary)]">
    <div id="root"></div>
<script type="module" src="/index.tsx"></script>
</body>
</html>
```

### FILE: index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
```

### FILE: metadata.json
```json
{
  "name": "AI Stand-up & Workshop Prep Dashboard",
  "description": "An interactive dashboard that summarizes a team's stand-up meeting. It visualizes progress with charts, details team member statuses and blockers, outlines a strategy for an AI workshop, and explains key technical concepts discussed.",
  "requestFramePermissions": []
}
```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "name": "ai-stand-up-&-workshop-prep-dashboard",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "chart.js": "^4.5.1"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1mv-gbyuaQ7sbGD1JCKTM99KGYQWgg61e

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — ai-stand-up-&-workshop-prep-dashboard
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('ai-stand-up-&-workshop-prep-dashboard E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: SRS.md
```md

```

### FILE: tests/userJourneys.ts
```typescript
import { TestSuite } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const query = <T extends HTMLElement>(selector: string): T => {
    const el = document.querySelector<T>(selector);
    if (!el) throw new Error(`Element not found: ${selector}`);
    return el;
};

export const TEST_SUITES: TestSuite[] = [
    {
        id: 'theme-switching',
        title: 'User Journey: Theme Switching',
        steps: [
            {
                description: 'Click "Dark" theme button',
                action: async () => {
                    query<HTMLButtonElement>('button[aria-pressed="false"]:nth-of-type(2)').click();
                    await delay(300);
                    return document.documentElement.classList.contains('dark');
                }
            },
            {
                description: 'Verify Dark theme is active',
                action: async () => {
                    return document.documentElement.classList.contains('dark');
                }
            },
            {
                description: 'Click "Contrast" theme button',
                action: async () => {
                    query<HTMLButtonElement>('button[aria-pressed="false"]').click();
                    await delay(300);
                    return document.documentElement.classList.contains('high-contrast');
                }
            },
             {
                description: 'Click "Light" theme button',
                action: async () => {
                    query<HTMLButtonElement>('button[aria-pressed="false"]').click();
                    await delay(300);
                    return document.documentElement.classList.contains('light');
                }
            }
        ]
    },
    {
        id: 'tab-navigation',
        title: 'User Journey: Main Tab Navigation',
        steps: [
            {
                description: 'Navigate to Team Status tab',
                action: async () => {
                    query<HTMLButtonElement>('#tab-status').click();
                    await delay(100);
                    return query('h2').innerText.includes('Team Status & Blockers');
                }
            },
            {
                description: 'Navigate to AI Workshop tab',
                action: async () => {
                    query<HTMLButtonElement>('#tab-workshop').click();
                    await delay(100);
                    return query('h2').innerText.includes('AI Workshop Deep Dive');
                }
            },
            {
                description: 'Navigate back to Overview tab',
                action: async () => {
                    query<HTMLButtonElement>('#tab-overview').click();
                    await delay(100);
                    return query('h2').innerText.includes('Meeting Overview');
                }
            }
        ]
    },
    {
        id: 'admin-auth',
        title: 'User Journey: Admin Authentication',
        steps: [
            {
                description: 'Navigate to Admin tab',
                action: async () => {
                    query<HTMLButtonElement>('#tab-admin').click();
                    await delay(100);
                    return query('h2').innerText.includes('Admin Login');
                }
            },
            {
                description: 'Attempt login with wrong password',
                action: async () => {
                    const passInput = query<HTMLInputElement>('#password');
                    passInput.value = 'wrongpassword';
                    passInput.dispatchEvent(new Event('input', { bubbles: true }));
                    query<HTMLButtonElement>('form button[type="submit"]').click();
                    await delay(100);
                    return query('#password-error').innerText.includes('Invalid password');
                }
            },
            {
                description: 'Login with correct password',
                action: async () => {
                    const passInput = query<HTMLInputElement>('#password');
                    passInput.value = 'admin123';
                    passInput.dispatchEvent(new Event('input', { bubbles: true }));
                    query<HTMLButtonElement>('form button[type="submit"]').click();
                    await delay(100);
                    return query('h2').innerText.includes('Admin Panel');
                }
            },
            {
                description: 'Logout from Admin Panel',
                action: async () => {
                    query<HTMLButtonElement>('section button:not([type="submit"])').click();
                    await delay(100);
                     return query('h2').innerText.includes('Admin Login');
                }
            }
        ]
    }
];

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: types.ts
```typescript
export type TabId = 'overview' | 'status' | 'workshop' | 'concepts' | 'admin' | 'selftest';
export type TeamMemberId = 'daniel' | 'mandela' | 'jerry';
export type Theme = 'light' | 'dark' | 'high-contrast';

export interface Tab {
    id: TabId;
    label: string;
}

export interface TeamMember {
    id: TeamMemberId;
    name: string;
    update: string;
    blocker: {
        text: string;
        isCritical: boolean;
    };
    quote?: string;
}

export interface TechConcept {
    title: string;
    description: string;
}

export interface AuditLog {
    timestamp: string;
    action: string;
}

export interface AppContextState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isAuthenticated: boolean;
    login: (password: string) => boolean;
    logout: () => void;
    auditLogs: AuditLog[];
    addAuditLog: (action: string) => void;
    activeTab: TabId;
    setActiveTab: (tabId: TabId) => void;
}

// Types for Self-Testing Framework
export type TestStatus = 'pending' | 'running' | 'pass' | 'fail';

export interface TestStep {
    description: string;
    action: () => Promise<boolean>;
}

export interface TestSuite {
    id: string;
    title: string;
    steps: TestStep[];
}

export interface TestResult {
    suiteId: string;
    title: string;
    status: TestStatus;
    stepResults: {
        description: string;
        status: TestStatus;
        log: string;
    }[];
}
```

### FILE: vite.config.ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
  ,
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) return 'vendor-react-dom';
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    }
  };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — ai-stand-up-&-workshop-prep-dashboard
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — ai-stand-up-&-workshop-prep-dashboard
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

