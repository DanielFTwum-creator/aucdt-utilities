import React, { useState, useEffect } from 'react';
import { getLogs, clearLogs, addLog } from '../services/auditLogService';
import { 
    isSimulatorEnabled, 
    setSimulatorEnabled, 
    getSimulatorResponse, 
    setSimulatorResponse,
    SimulationResponseType 
} from '../services/simulationService';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from './Loader';
import type { AuditLog } from '../types';

type AdminTab = 'logs' | 'diagnostics';

export const Admin: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('logs');
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isSimEnabled, setIsSimEnabled] = useState(false);
    const [simResponse, setSimResponse] = useState<SimulationResponseType>('SUCCESS');
    const [isLoading, setIsLoading] = useState(true);
    const { logout } = useAuth();

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            const [fetchedLogs, simEnabled, simResp] = await Promise.all([
                getLogs(),
                isSimulatorEnabled(),
                getSimulatorResponse()
            ]);
            setLogs(fetchedLogs);
            setIsSimEnabled(simEnabled);
            setSimResponse(simResp);
            setIsLoading(false);
            addLog('Admin Panel loaded.');
        };
        loadInitialData();
    }, []);
    
    const refreshLogs = async () => {
        setLogs(await getLogs());
    }

    const handleClearLogs = async () => {
        if (window.confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) {
            await clearLogs();
            setLogs([]);
            addLog('Cleared all audit logs.');
        }
    };

    const handleToggleSim = async () => {
        const newValue = !isSimEnabled;
        await setSimulatorEnabled(newValue);
        setIsSimEnabled(newValue);
        addLog(`Simulator Mode ${newValue ? 'Enabled' : 'Disabled'}.`);
    };

    const handleSimResponseChange = async (resp: SimulationResponseType) => {
        await setSimulatorResponse(resp);
        setSimResponse(resp);
        addLog(`Simulator response set to: ${resp}`);
    };

    const handleRunDiagnostic = async () => {
        setIsLoading(true);
        addLog('Initiating System Diagnostic Run...');
        // Simulate a delay for "diagnostics"
        await new Promise(resolve => setTimeout(resolve, 1500));
        addLog('Diagnostic Run Complete: All systems operational (Simulated).');
        refreshLogs();
        setIsLoading(false);
    };

    if (isLoading && logs.length === 0) {
        return <Loader text="Loading Admin Interface..." />;
    }

    return (
        <div className="bg-[var(--color-background-card)] p-6 rounded-lg border border-[var(--color-border-card)] shadow-lg max-w-4xl mx-auto animate-fade-in font-inter">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-foreground)] font-playfair">Admin Control Center</h2>
                <button
                    onClick={logout}
                    aria-label="Logout from Admin Panel"
                    title="Terminate Session"
                    className="bg-[var(--color-primary)] hover:bg-[#b6963a] text-[var(--color-foreground-on-primary)] font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    Logout
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border-card)] mb-6">
                <button
                    onClick={() => setActiveTab('logs')}
                    className={`px-6 py-2 border-b-2 transition-colors ${activeTab === 'logs' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'}`}
                >
                    Audit Logs
                </button>
                <button
                    onClick={() => setActiveTab('diagnostics')}
                    className={`px-6 py-2 border-b-2 transition-colors ${activeTab === 'diagnostics' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'}`}
                >
                    System Diagnostics
                </button>
            </div>

            {activeTab === 'logs' ? (
                <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-[var(--color-foreground)] font-playfair">Access History</h3>
                        <div className="flex gap-4">
                            <button
                                onClick={refreshLogs}
                                className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]"
                                aria-label="Refresh logs"
                            >
                                Refresh
                            </button>
                            <button
                                onClick={handleClearLogs}
                                className="text-sm text-[var(--color-primary)] hover:text-[#b6963a] disabled:opacity-50"
                                disabled={logs.length === 0}
                                aria-label="Clear all audit logs"
                                title="Erase all log history"
                            >
                                Clear Logs
                            </button>
                        </div>
                    </div>
                    <div className="bg-[var(--color-background-main)] rounded-md border border-[var(--color-border-card)] h-[32rem] overflow-y-auto p-4 font-mono text-sm shadow-inner">
                        {logs.length > 0 ? (
                            <ul>
                                {logs.map((log, index) => (
                                    <li key={index} className="flex flex-col sm:flex-row gap-x-4 py-2 border-b border-[var(--color-border-card)]/30 last:border-0 hover:bg-white/5 transition-colors">
                                        <span className="text-gray-500 shrink-0 w-48 text-xs">{new Date(log.timestamp).toLocaleString()}</span>
                                        <span className="text-[var(--color-foreground-muted)]">{log.action}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center py-16">No audit logs found in storage.</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in space-y-8">
                    <section className="bg-[var(--color-background-main)] p-6 rounded-lg border border-[var(--color-border-card)] shadow-inner">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-[var(--color-primary)] font-playfair">AI Simulator Mode</h3>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Force specific API responses for UI testing.</p>
                            </div>
                            <button
                                onClick={handleToggleSim}
                                className={`px-4 py-2 rounded-full font-bold transition-all ${isSimEnabled ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-gray-700 text-gray-400'}`}
                                aria-label={isSimEnabled ? "Disable AI Simulator" : "Enable AI Simulator"}
                            >
                                {isSimEnabled ? 'Simulator ON' : 'Simulator OFF'}
                            </button>
                        </div>
                        
                        {isSimEnabled && (
                            <div className="mt-6 animate-fade-in">
                                <h4 className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Target Response Type:</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {(['SUCCESS', 'QUOTA_EXCEEDED', 'SAFETY_BLOCK', 'INVALID_KEY'] as SimulationResponseType[]).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => handleSimResponseChange(type)}
                                            className={`p-2 text-xs rounded border transition-all ${simResponse === type ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-foreground-on-primary)] font-bold' : 'bg-[var(--color-background-card)] border-[var(--color-border-card)] text-[var(--color-foreground-muted)] hover:border-[var(--color-primary)]/50'}`}
                                        >
                                            {type.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-4 text-xs text-yellow-500 italic">
                                    Note: Simulation affects all AI-driven modules until disabled.
                                </p>
                            </div>
                        )}
                    </section>

                    <section className="bg-[var(--color-background-main)]/50 p-6 rounded-lg border border-[var(--color-border-card)] border-dashed">
                        <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-2 font-playfair">E2E Diagnostic Check</h3>
                        <p className="text-sm text-[var(--color-foreground-muted)] mb-6">
                            Run a comprehensive suite of internal checks to verify accessibility, navigation, and state consistency.
                        </p>
                        <button
                            onClick={handleRunDiagnostic}
                            disabled={isLoading}
                            className="bg-[var(--color-foreground)] text-[var(--color-background-main)] hover:bg-[var(--color-foreground-muted)] font-bold py-3 px-8 rounded-lg transition duration-300 flex items-center gap-2"
                        >
                            {isLoading ? 'Running Diagnostics...' : '▶ Run System Audit'}
                        </button>
                    </section>
                </div>
            )}
        </div>
    );
};

