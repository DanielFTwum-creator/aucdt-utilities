import React, { useState } from 'react';
import { Icons } from './Icons';
import { AuditLog } from '../types';
import { GapAnalysis } from './GapAnalysis';
import { TestDashboard } from './TestDashboard';
import { PatentApplication } from './PatentApplication';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { addAuditLog } from '../lib/db';

interface AdminPanelProps {
    currentRoute: string;
    auditLogs: AuditLog[];
    onNavigate: (route: string) => void;
    onReturnToApp: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentRoute, auditLogs, onNavigate, onReturnToApp }) => {
    const { isAuthenticated, login } = useAdminAuth();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleNavigate = (route: string) => {
        addAuditLog('NAVIGATE', `Navigated to ${route}`);
        onNavigate(route);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(password);
        if (success) {
            addAuditLog('LOGIN', 'Admin authenticated');
            setError('');
            if (currentRoute === '#/admin') handleNavigate('#/admin/dashboard');
        } else {
            setError('Invalid access key');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-bg-primary">
                <div className="w-full max-w-md bg-bg-secondary border border-border rounded-2xl shadow-2xl overflow-hidden p-8 animate-slide-up">
                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-500 mb-4">
                            <Icons.Shield className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary font-mono">Restricted Access</h2>
                        <p className="text-text-muted mt-2">Bulletproof Directive Admin</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label htmlFor="admin-password" className="text-xs font-mono font-bold text-text-secondary uppercase">Access Key</label>
                            <input
                                id="admin-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-border text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                                autoFocus
                                aria-required="true"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm font-mono text-center bg-red-500/10 py-2 rounded" role="alert">{error}</p>}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-accent-primary text-white font-bold hover:bg-accent-secondary transition-colors"
                        >
                            Authenticate
                        </button>
                    </form>
                    <button onClick={onReturnToApp} className="w-full mt-4 py-2 text-sm text-text-muted hover:text-text-primary transition-colors">
                        Return to Application
                    </button>
                    <p className="text-center text-[10px] text-text-muted mt-6 opacity-50 font-mono">
                        Secured by Standard 830 Protocol
                    </p>
                </div>
            </div>
        );
    }

    // Render Authenticated View
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-bg-secondary border-r border-border flex flex-col hidden md:flex">
                <div className="p-6 border-b border-border flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
                        <Icons.Lock className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-bold text-text-primary">Admin Suite</h2>
                        <p className="text-[10px] text-text-muted font-mono uppercase">System V2.0</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavButton 
                        active={currentRoute.includes('/dashboard')} 
                        onClick={() => handleNavigate('#/admin/dashboard')}
                        icon={<Icons.Activity />}
                        label="Dashboard"
                    />
                    <NavButton 
                        active={currentRoute.includes('/diagnostics')} 
                        onClick={() => handleNavigate('#/admin/diagnostics')}
                        icon={<Icons.Activity className="rotate-90" />}
                        label="Diagnostics"
                    />
                    <NavButton 
                        active={currentRoute.includes('/gap-analysis')} 
                        onClick={() => handleNavigate('#/admin/gap-analysis')}
                        icon={<Icons.FileText />}
                        label="Gap Analysis"
                    />
                    <NavButton 
                        active={currentRoute.includes('/logs')} 
                        onClick={() => handleNavigate('#/admin/logs')}
                        icon={<Icons.FileText />} // Using FileText as generic list icon
                        label="Audit Logs"
                    />
                    <NavButton 
                        active={currentRoute.includes('/diagrams')} 
                        onClick={() => handleNavigate('#/admin/diagrams')}
                        icon={<Icons.Image />}
                        label="Diagrams"
                    />
                    <NavButton 
                        active={currentRoute.includes('/patent')} 
                        onClick={() => handleNavigate('#/admin/patent')}
                        icon={<Icons.FileText />}
                        label="Patent App"
                    />
                </nav>

                <div className="p-4 border-t border-border">
                    <button 
                        onClick={onReturnToApp}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-tertiary transition-colors"
                    >
                        <Icons.X className="w-4 h-4" />
                        <span>Exit Admin</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col bg-bg-primary overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden h-16 border-b border-border bg-bg-secondary flex items-center justify-between px-4">
                    <h2 className="font-bold text-text-primary">Admin Panel</h2>
                    <button onClick={onReturnToApp} aria-label="Close Admin Panel"><Icons.X className="w-6 h-6 text-text-muted" /></button>
                </header>

                {/* Mobile Nav (Simple horizontal for mobile) */}
                 <div className="md:hidden flex overflow-x-auto p-2 gap-2 border-b border-border bg-bg-tertiary">
                    <MobileNavButton active={currentRoute.includes('/dashboard')} onClick={() => handleNavigate('#/admin/dashboard')} label="Dash" />
                    <MobileNavButton active={currentRoute.includes('/diagnostics')} onClick={() => handleNavigate('#/admin/diagnostics')} label="Tests" />
                    <MobileNavButton active={currentRoute.includes('/gap-analysis')} onClick={() => handleNavigate('#/admin/gap-analysis')} label="Gap Analysis" />
                    <MobileNavButton active={currentRoute.includes('/logs')} onClick={() => handleNavigate('#/admin/logs')} label="Logs" />
                    <MobileNavButton active={currentRoute.includes('/diagrams')} onClick={() => handleNavigate('#/admin/diagrams')} label="Diagrams" />
                    <MobileNavButton active={currentRoute.includes('/patent')} onClick={() => handleNavigate('#/admin/patent')} label="Patent" />
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {currentRoute.includes('/diagnostics') && (
                         <div className="animate-fade-in max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold text-text-primary mb-6 font-mono">System Diagnostics</h2>
                            <TestDashboard isOpen={true} onClose={() => {}} /> 
                            {/* Note: We reuse the inner logic of TestDashboard, ignoring modal props since we wrap it */}
                        </div>
                    )}

                    {currentRoute.includes('/gap-analysis') && (
                        <div className="animate-fade-in max-w-5xl mx-auto">
                            <h2 className="text-2xl font-bold text-text-primary mb-6 font-mono">Gap Analysis Report</h2>
                            <GapAnalysis />
                        </div>
                    )}

                    {currentRoute.includes('/logs') && (
                        <div className="animate-fade-in max-w-4xl mx-auto">
                             <div className="flex items-center justify-between mb-6">
                                 <h2 className="text-2xl font-bold text-text-primary font-mono">Audit Logs</h2>
                                 <span className="text-xs font-mono px-3 py-1 rounded bg-bg-tertiary border border-border text-text-muted">
                                     {auditLogs.length} Records
                                 </span>
                             </div>
                             <div className="bg-bg-secondary rounded-xl border border-border overflow-hidden">
                                 {auditLogs.length === 0 ? (
                                     <div className="p-12 text-center text-text-muted">No logs recorded yet.</div>
                                 ) : (
                                     <table className="w-full text-sm text-left">
                                         <thead className="bg-bg-tertiary text-text-muted font-mono text-xs uppercase">
                                             <tr>
                                                 <th className="px-6 py-3">Timestamp</th>
                                                 <th className="px-6 py-3">User</th>
                                                 <th className="px-6 py-3">Action</th>
                                                 <th className="px-6 py-3">Details</th>
                                             </tr>
                                         </thead>
                                         <tbody className="divide-y divide-border/50">
                                             {[...auditLogs].reverse().map(log => (
                                                 <tr key={log.id} className="hover:bg-bg-tertiary/20">
                                                     <td className="px-6 py-3 font-mono text-text-muted">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                                     <td className="px-6 py-3 text-text-primary">{log.user}</td>
                                                     <td className="px-6 py-3 font-bold text-accent-primary font-mono text-xs uppercase">{log.action}</td>
                                                     <td className="px-6 py-3 text-text-secondary">{log.details || '-'}</td>
                                                 </tr>
                                             ))}
                                         </tbody>
                                     </table>
                                 )}
                             </div>
                        </div>
                    )}

                    {currentRoute.includes('/diagrams') && (
                        <div className="animate-fade-in max-w-5xl mx-auto">
                             <h2 className="text-2xl font-bold text-text-primary mb-6 font-mono">System Diagrams</h2>
                             <div className="grid gap-8">
                                 <div className="bg-bg-secondary p-6 rounded-xl border border-border">
                                     <h3 className="text-lg font-bold text-text-primary mb-4 font-mono">System Architecture</h3>
                                     <div className="bg-white p-4 rounded-lg overflow-x-auto">
                                         <img src="/docs/Architecture.svg" alt="System Architecture" className="w-full" />
                                     </div>
                                 </div>
                                 <div className="bg-bg-secondary p-6 rounded-xl border border-border">
                                     <h3 className="text-lg font-bold text-text-primary mb-4 font-mono">Database Structure</h3>
                                     <div className="bg-white p-4 rounded-lg overflow-x-auto">
                                         <img src="/docs/Database.svg" alt="Database Structure" className="w-full" />
                                     </div>
                                 </div>
                             </div>
                        </div>
                    )}

                    {currentRoute.includes('/patent') && (
                        <div className="animate-fade-in max-w-5xl mx-auto">
                            <h2 className="text-2xl font-bold text-text-primary mb-6 font-mono">Patent Application</h2>
                            <PatentApplication />
                        </div>
                    )}

                    {(currentRoute === '#/admin' || currentRoute.includes('/dashboard')) && (
                        <div className="animate-fade-in max-w-5xl mx-auto">
                            <h2 className="text-2xl font-bold text-text-primary mb-6 font-mono">Security Overview</h2>
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="p-6 rounded-xl bg-bg-secondary border border-border">
                                    <h3 className="text-text-muted text-xs font-mono uppercase mb-2">System Status</h3>
                                    <div className="text-2xl font-bold text-green-500 flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                        Operational
                                    </div>
                                </div>
                                <div className="p-6 rounded-xl bg-bg-secondary border border-border">
                                    <h3 className="text-text-muted text-xs font-mono uppercase mb-2">Security Level</h3>
                                    <div className="text-2xl font-bold text-accent-primary">High (Level 3)</div>
                                </div>
                                <div className="p-6 rounded-xl bg-bg-secondary border border-border">
                                    <h3 className="text-text-muted text-xs font-mono uppercase mb-2">React Version</h3>
                                    <div className="text-2xl font-bold text-text-primary">v19.2.5</div>
                                </div>
                            </div>
                            
                            <div className="p-6 rounded-xl bg-bg-tertiary/20 border border-dashed border-border flex flex-col items-center justify-center text-center py-12">
                                <Icons.Activity className="w-12 h-12 text-text-muted opacity-20 mb-4" />
                                <p className="text-text-muted max-w-md">Select an admin module from the sidebar to begin diagnostics or audit review.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        aria-label={label}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-mono text-sm ${
            active 
            ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
            : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary border border-transparent'
        }`}
    >
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4" })
          : icon
        }
        <span>{label}</span>
    </button>
);

const MobileNavButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        aria-label={label}
        className={`px-3 py-1.5 rounded text-xs font-bold font-mono whitespace-nowrap ${
            active ? 'bg-accent-primary text-white' : 'bg-bg-secondary text-text-muted'
        }`}
    >
        {label}
    </button>
);
