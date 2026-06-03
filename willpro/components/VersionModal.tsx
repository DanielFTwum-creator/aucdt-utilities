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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div>
                        <h2>Saved Versions</h2>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: 4 }}>
                            Click a name to rename inline · Click a row to restore version
                        </div>
                    </div>
                    <button onClick={onClose} className="modal-close-btn">&times;</button>
                </div>

                {/* List */}
                <div className="modal-body" style={{ padding: '4px 0' }}>
                    {drafts.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: '40px 0', fontSize: '14px' }}>
                            No saved versions yet.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {drafts.map((draft) => {
                                const isCurrent = draft.id === currentDraftId;
                                const isRenaming = renamingId === draft.id;
                                return (
                                    <div
                                        key={draft.id}
                                        onClick={() => { if (!isRenaming) { onLoad(draft); onClose(); } }}
                                        style={{
                                            border: isCurrent ? '1.5px solid var(--accent-gold)' : '1px solid #CBD5E1',
                                            background: isCurrent ? 'var(--accent-gold-light)' : '#FFFFFF',
                                            borderRadius: '10px',
                                            padding: '14px 18px',
                                            cursor: isRenaming ? 'default' : 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '12px',
                                            transition: 'all 0.2s',
                                            boxShadow: isCurrent ? '0 4px 12px rgba(181, 138, 61, 0.08)' : 'var(--shadow-sm)',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isRenaming && !isCurrent) {
                                                e.currentTarget.style.borderColor = 'rgba(181, 138, 61, 0.4)';
                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isRenaming && !isCurrent) {
                                                e.currentTarget.style.borderColor = '#CBD5E1';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }
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
                                                        width: '100%',
                                                        fontSize: '13px',
                                                        fontWeight: 600,
                                                        border: '1.5px solid var(--accent-gold)',
                                                        borderRadius: '6px',
                                                        padding: '6px 10px',
                                                        outline: 'none',
                                                        background: '#fff',
                                                        color: 'var(--text-heading)',
                                                    }}
                                                    placeholder="Enter a name…"
                                                />
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                    <span
                                                        onClick={(e) => startRename(e, draft)}
                                                        title="Click to rename"
                                                        style={{
                                                            fontWeight: 700,
                                                            color: 'var(--text-heading)',
                                                            fontSize: '14px',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            cursor: 'text',
                                                            borderBottom: '1px dashed var(--accent-gold)',
                                                            display: 'inline-block',
                                                            maxWidth: '240px',
                                                        }}
                                                    >
                                                        {draft.filename || 'Untitled Draft'}
                                                    </span>
                                                    {isCurrent && (
                                                        <span style={{
                                                            fontSize: '9px',
                                                            fontWeight: 800,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.05em',
                                                            background: 'linear-gradient(135deg, var(--accent-gold), #9F762E)',
                                                            color: '#fff',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px'
                                                        }}>
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: 4 }}>
                                                Saved {new Date(draft.updatedAt).toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Right: action buttons */}
                                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                            {!isRenaming && (
                                                <button
                                                    onClick={(e) => startRename(e, draft)}
                                                    title="Rename"
                                                    style={{
                                                        background: 'rgba(181, 138, 61, 0.08)',
                                                        color: 'var(--accent-gold)',
                                                        border: 'none',
                                                        padding: '6px 12px',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        transition: 'all 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'var(--accent-gold)';
                                                        e.currentTarget.style.color = '#fff';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'rgba(181, 138, 61, 0.08)';
                                                        e.currentTarget.style.color = 'var(--accent-gold)';
                                                    }}
                                                >
                                                    ✏️ Rename
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => handleDelete(e, draft.id)}
                                                title="Delete"
                                                style={{
                                                    background: 'rgba(239, 68, 68, 0.08)',
                                                    color: '#EF4444',
                                                    border: 'none',
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    transition: 'all 0.2s',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#EF4444';
                                                    e.currentTarget.style.color = '#fff';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                                                    e.currentTarget.style.color = '#EF4444';
                                                }}
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
                <div style={{ padding: '16px 0 0 0', borderTop: '1px solid rgba(181, 138, 61, 0.12)', fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    Versions are stored securely in your browser's offline storage.
                </div>
            </div>
        </div>
    );
};

export default VersionModal;
