import React, { useState, useEffect } from 'react';
import type { User } from '../App';
import { getLogs, AuditEntry, logAction, exportLogsToCSV } from '../services/auditLogService';
import { secureGetItem } from '../services/storageService';

interface AdminPanelProps {
    currentUser: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser }) => {
    const [users, setUsers] = useState<Record<string, User>>({});
    const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
    const [filterUser, setFilterUser] = useState<string>('');
    const [confirmingDeleteFor, setConfirmingDeleteFor] = useState<string | null>(null);
    const [adminPassword, setAdminPassword] = useState<string>('');
    const [deleteError, setDeleteError] = useState<string>('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const storedUsers = secureGetItem<Record<string, User>>('patoisLyricistUsers');
        setUsers(storedUsers || {});
        setAuditLog(getLogs());
    };

    const handleConfirmDelete = () => {
        if (!confirmingDeleteFor) return;
        const allUsers = secureGetItem<Record<string, User>>('patoisLyricistUsers') || {};
        const adminUser = allUsers[currentUser];

        if (adminUser && adminUser.password === adminPassword) {
            localStorage.removeItem(`patoisLyricistHistory_${confirmingDeleteFor}`);
            logAction(currentUser, 'Admin Data Purge Confirmed', { targetUser: confirmingDeleteFor, role: 'admin' });
            setConfirmingDeleteFor(null);
            setAdminPassword('');
            setDeleteError('');
            loadData();
        } else {
            setDeleteError('Incorrect identity token provided.');
            logAction(currentUser, 'Admin Data Purge Failed Auth', { targetUser: confirmingDeleteFor });
        }
    };
    
    const filteredLogs = auditLog
        .filter(log => filterUser ? log.user === filterUser : true)
        .sort((a, b) => b.id - a.id);

    return (
        <div className="bg-card backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-primary text-primary" role="region" aria-label="Administrative Controls">
            <h2 className="text-3xl font-bold mb-6 text-center text-title uppercase tracking-widest">Governance Dashboard</h2>

            <section className="mb-8" aria-labelledby="users-list-heading">
                <h3 id="users-list-heading" className="text-xl font-semibold mb-4 text-title border-b border-primary pb-2 flex justify-between">
                    <span>Identity Repository</span>
                    <span className="text-xs opacity-50" aria-label={`${Object.keys(users).length} users total`}>{Object.keys(users).length} Active Entities</span>
                </h3>
                <div className="max-h-60 overflow-auto">
                    <table className="w-full text-left text-sm" role="table">
                        <thead className="bg-gray-800/80 sticky top-0">
                            <tr>
                                <th className="p-3" scope="col">Identity</th>
                                <th className="p-3" scope="col">Auth Role</th>
                                <th className="p-3" scope="col">Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(users).map((username) => (
                                <tr key={username} className="border-b border-primary/20 hover:bg-white/5 transition-colors">
                                    <td className="p-3 font-medium">{username}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${users[username].role === 'admin' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'}`}>
                                            {users[username].role}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button 
                                            onClick={() => { setConfirmingDeleteFor(username); setDeleteError(''); }}
                                            className="text-red-400 hover:text-red-300 text-xs font-bold underline decoration-dotted transition-colors"
                                            disabled={username === currentUser}
                                            aria-label={`Purge history for ${username}`}
                                        >
                                            Purge History
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section aria-labelledby="audit-trail-heading">
                <div className="flex justify-between items-center mb-4 border-b border-primary pb-2">
                    <h3 id="audit-trail-heading" className="text-xl font-semibold text-title">Governance Audit Trail</h3>
                    <button 
                        onClick={() => {
                            exportLogsToCSV();
                            logAction(currentUser, 'Audit Log Exported', { type: 'CSV' });
                        }}
                        className="text-xs bg-title text-black font-black px-4 py-2 rounded-full hover:opacity-80 transition-opacity uppercase"
                        aria-label="Export audit logs to CSV for SOC 2 compliance"
                    >
                        Export CSV
                    </button>
                </div>
                <div className="mb-4 flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col gap-1 flex-1">
                       <label htmlFor="log-filter" className="text-[10px] uppercase font-bold opacity-40 ml-1">Filter by Identity</label>
                       <select id="log-filter" value={filterUser} onChange={e => setFilterUser(e.target.value)} className="bg-input border-2 border-primary rounded-xl p-3 text-xs focus:border-title outline-none">
                            <option value="">Global Overview</option>
                            {Object.keys(users).map(u => <option key={u} value={u}>{u}</option>)}
                       </select>
                    </div>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
                    {filteredLogs.length > 0 ? filteredLogs.map(log => (
                        <div key={log.id} className="text-[10px] border-b border-white/5 pb-3 last:border-0 last:pb-0">
                            <div className="flex justify-between text-yellow-500/80 mb-1 font-mono">
                                <span>{new Date(log.timestamp).toLocaleString()}</span>
                                <span className="text-blue-400">ID: {log.user}</span>
                            </div>
                            <div className="text-gray-200 font-black mb-1 uppercase tracking-tighter text-xs">{log.action}</div>
                            <div className="bg-black/30 p-3 rounded-xl font-mono text-gray-500 overflow-x-auto">
                                <div className="mb-1 text-gray-400">Payload: <span className="text-gray-500">{JSON.stringify(log.details)}</span></div>
                                <div className="opacity-40 text-[9px]">Forensics: {log.metadata.resolution} • {log.metadata.userAgent.substring(0, 80)}...</div>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-600 py-10 uppercase text-xs font-bold tracking-widest">No entries found for current filter</p>
                    )}
                </div>
            </section>

            {confirmingDeleteFor && (
                <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="purge-modal-title">
                    <div className="bg-gray-900 p-8 rounded-[2rem] shadow-2xl border-2 border-red-500/30 max-w-md w-full">
                        <h4 id="purge-modal-title" className="text-2xl font-black text-red-500 mb-2 uppercase tracking-tighter">Security Authorization</h4>
                        <p className="text-sm text-gray-400 mb-6">You are attempting a destructive operation on <span className="text-white font-black underline decoration-red-500">{confirmingDeleteFor}'s</span> data repository. Re-verify your administrative identity token to proceed.</p>
                        <div className="mb-6">
                            <label htmlFor="admin-token" className="sr-only">Admin Password</label>
                            <input
                                id="admin-token"
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="w-full p-5 bg-black border-2 border-primary rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all placeholder:opacity-30"
                                placeholder="Verification Token"
                                autoFocus
                            />
                            {deleteError && <p className="text-red-400 text-xs mt-2 font-bold px-1" role="alert">{deleteError}</p>}
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => { setConfirmingDeleteFor(null); setAdminPassword(''); }} className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl font-black uppercase tracking-widest transition-colors">Cancel</button>
                            <button onClick={handleConfirmDelete} className="flex-1 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-black uppercase tracking-widest transition-colors shadow-lg shadow-red-600/20">Authorize</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;