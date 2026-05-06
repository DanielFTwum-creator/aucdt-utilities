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
