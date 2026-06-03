import React, { useEffect, useState } from 'react';
import { Draft, listDrafts, deleteDraft, saveDraft } from '../db';

interface VersionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoad: (draft: Draft) => void;
    currentDraftId: string;
}

const VersionModal: React.FC<VersionModalProps> = ({ isOpen, onClose, onLoad, currentDraftId }) => {
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');

    const fetchDrafts = async () => {
        const data = await listDrafts();
        setDrafts(data);
    };

    useEffect(() => {
        if (isOpen) {
            fetchDrafts();
            setRenamingId(null);
        }
    }, [isOpen]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Delete this version? This cannot be undone.')) {
            await deleteDraft(id);
            fetchDrafts();
        }
    };

    const startRename = (e: React.MouseEvent, draft: Draft) => {
        e.stopPropagation();
        setRenamingId(draft.id);
        setRenameValue(draft.filename || '');
    };

    const commitRename = async (draft: Draft) => {
        const trimmed = renameValue.trim();
        if (trimmed && trimmed !== draft.filename) {
            await saveDraft(draft.id, draft.step, draft.formData, trimmed);
        }
        setRenamingId(null);
        fetchDrafts();
    };

    const handleRenameKey = (e: React.KeyboardEvent, draft: Draft) => {
        if (e.key === 'Enter') commitRename(draft);
        if (e.key === 'Escape') setRenamingId(null);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 9999
        }}>
            <div style={{
                background: '#fff', borderRadius: '14px', width: '92%', maxWidth: '520px',
                maxHeight: '80vh', display: 'flex', flexDirection: 'column',
                overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
            }}>
                {/* Header */}
                <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Saved Versions</h2>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: 2 }}>Click a name to rename · Click a row to load</div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8', lineHeight: 1 }}>×</button>
                </div>

                {/* List */}
                <div style={{ overflowY: 'auto', padding: '14px 16px', flex: 1 }}>
                    {drafts.length === 0 ? (
                        <p style={{ color: '#94a3b8', textAlign: 'center', margin: '20px 0', fontSize: 13 }}>No saved versions yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {drafts.map((draft) => {
                                const isCurrent = draft.id === currentDraftId;
                                const isRenaming = renamingId === draft.id;
                                return (
                                    <div
                                        key={draft.id}
                                        onClick={() => { if (!isRenaming) { onLoad(draft); onClose(); } }}
                                        style={{
                                            border: '1px solid ' + (isCurrent ? '#0891b2' : '#e2e8f0'),
                                            background: isCurrent ? '#ecfeff' : '#fafafa',
                                            borderRadius: '10px', padding: '10px 12px',
                                            cursor: isRenaming ? 'default' : 'pointer',
                                            display: 'flex', justifyContent: 'space-between',
                                            alignItems: 'center', gap: 8,
                                            transition: 'background 0.15s',
                                        }}
                                    >
                                        {/* Left: name + timestamp */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            {isRenaming ? (
                                                <input
                                                    autoFocus
                                                    value={renameValue}
                                                    onChange={e => setRenameValue(e.target.value)}
                                                    onBlur={() => commitRename(draft)}
                                                    onKeyDown={e => handleRenameKey(e, draft)}
                                                    onClick={e => e.stopPropagation()}
                                                    style={{
                                                        width: '100%', fontSize: '13px', fontWeight: 600,
                                                        border: '1px solid #0891b2', borderRadius: 6,
                                                        padding: '4px 8px', outline: 'none',
                                                        background: '#fff', color: '#0f172a',
                                                    }}
                                                    placeholder="Enter a name…"
                                                />
                                            ) : (
                                                <div
                                                    onClick={(e) => startRename(e, draft)}
                                                    title="Click to rename"
                                                    style={{
                                                        fontWeight: 600, color: '#0f172a', fontSize: '13px',
                                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                        cursor: 'text',
                                                        borderBottom: '1px dashed #cbd5e1',
                                                        display: 'inline-block', maxWidth: '100%',
                                                    }}
                                                >
                                                    {draft.filename || 'Untitled Draft'}
                                                    {isCurrent && (
                                                        <span style={{ marginLeft: 6, fontSize: '10px', background: '#0891b2', color: '#fff', padding: '1px 5px', borderRadius: 4 }}>
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: 3 }}>
                                                Saved {new Date(draft.updatedAt).toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Right: action buttons */}
                                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                            {!isRenaming && (
                                                <button
                                                    onClick={(e) => startRename(e, draft)}
                                                    title="Rename"
                                                    style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '5px 9px', borderRadius: 6, cursor: 'pointer', fontSize: '11px', fontWeight: 500 }}
                                                >
                                                    ✏️ Rename
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => handleDelete(e, draft.id)}
                                                title="Delete"
                                                style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '5px 9px', borderRadius: 6, cursor: 'pointer', fontSize: '11px', fontWeight: 500 }}
                                            >
                                                🗑 Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer hint */}
                <div style={{ padding: '10px 16px', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
                    Versions are stored locally in your browser
                </div>
            </div>
        </div>
    );
};

export default VersionModal;
