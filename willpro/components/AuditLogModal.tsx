import React from 'react';
import type { AuditLog } from '../App.tsx';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    logs: AuditLog[];
    onImport: () => void;
    onExport: () => void;
}

const AuditLogModal = ({ isOpen, onClose, logs, onImport, onExport }: ModalProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Audit Logs</h2>
                    <button onClick={onClose} className="modal-close-btn">&times;</button>
                </div>
                <div className="modal-body">
                    {logs.length === 0 ? (
                        <p>No audit logs available.</p>
                    ) : (
                        <table className="audit-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Event</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log, index) => (
                                    <tr key={index}>
                                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                                        <td>{log.event}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onImport}>Import Logs</button>
                    <button className="btn-primary" onClick={onExport} disabled={logs.length === 0}>Export Logs</button>
                </div>
            </div>
        </div>
    );
};

export default AuditLogModal;