import React, { useEffect, useState } from 'react';
import { Draft, listDrafts, deleteDraft } from '../db';

interface VersionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoad: (draft: Draft) => void;
    currentDraftId: string;
}

const VersionModal: React.FC<VersionModalProps> = ({ isOpen, onClose, onLoad, currentDraftId }) => {
    const [drafts, setDrafts] = useState<Draft[]>([]);

    const fetchDrafts = async () => {
        const data = await listDrafts();
        setDrafts(data);
    };

    useEffect(() => {
        if (isOpen) {
            fetchDrafts();
        }
    }, [isOpen]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this version?')) {
            await deleteDraft(id);
            if (id === currentDraftId) {
                alert('You deleted the currently active draft. Please load another version or refresh to start a new one.');
            }
            fetchDrafts();
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 9999
        }}>
            <div style={{
                background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '500px',
                maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Saved Versions</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
                </div>
                <div style={{ overflowY: 'auto', padding: '20px', flex: 1 }}>
                    {drafts.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', margin: 0 }}>No saved versions found.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {drafts.map((draft) => (
                                <div
                                    key={draft.id}
                                    onClick={() => { onLoad(draft); onClose(); }}
                                    style={{
                                        border: '1px solid ' + (draft.id === currentDraftId ? '#0891b2' : '#e2e8f0'),
                                        background: draft.id === currentDraftId ? '#ecfeff' : '#fff',
                                        borderRadius: '8px', padding: '12px', cursor: 'pointer',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                                            {draft.filename || 'Untitled Draft'}
                                            {draft.id === currentDraftId && <span style={{ marginLeft: '8px', fontSize: '11px', background: '#0891b2', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>Current</span>}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                                            Last saved: {new Date(draft.updatedAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => handleDelete(e, draft.id)}
                                        style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VersionModal;
