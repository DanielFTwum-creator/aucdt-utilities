import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { tracks as trackApi, licences as licenceApi } from '@/services/api';
export function TrackLibrary() {
    const [trackList, setTrackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [licence, setLicence] = useState(null);
    const [licenceTrack, setLicenceTrack] = useState(null);
    const load = async () => {
        setLoading(true);
        try {
            const { data } = await trackApi.list();
            setTrackList(data.content ?? []);
        }
        catch { /* silent */ }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => { void load(); }, []);
    const handleDelete = async (uuid) => {
        if (!confirm('Delete this track? You have 30 days to recover it.'))
            return;
        await trackApi.delete(uuid);
        setTrackList(prev => prev.filter(t => t.uuid !== uuid));
    };
    const handleLicence = async (uuid) => {
        setLicenceTrack(uuid);
        try {
            const { data } = await licenceApi.get(uuid);
            setLicence(data);
        }
        catch {
            setLicence(null);
        }
    };
    if (loading)
        return (_jsxs("div", { className: "flex items-center justify-center h-40 text-gray-500", children: [_jsx("span", { className: "animate-spin mr-2", children: "\u27F3" }), " Loading library\u2026"] }));
    if (trackList.length === 0)
        return (_jsxs("div", { className: "text-center py-16 text-gray-600", children: [_jsx("p", { className: "text-4xl mb-3", children: "\uD83C\uDFB5" }), _jsx("p", { children: "No tracks yet \u2014 generate your first one above!" })] }));
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: trackList.map(track => (_jsx(TrackCard, { track: track, onDelete: (uuid) => void handleDelete(uuid), onLicence: (uuid) => void handleLicence(uuid) }, track.uuid))) }), licence && licenceTrack && (_jsx(LicenceModal, { cert: licence, onClose: () => { setLicence(null); setLicenceTrack(null); } }))] }));
}
// ── Track card ────────────────────────────────────────────────────────────────
function TrackCard({ track, onDelete, onLicence, }) {
    const fmtDuration = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    return (_jsxs("div", { className: "rounded-xl bg-navy-800 border border-navy-700 p-4\n                    hover:border-brand-600 transition-colors group animate-fade-in", children: [_jsx("div", { className: "h-28 rounded-lg bg-gradient-to-br from-navy-700 to-brand-900\n                      flex items-center justify-center mb-3 overflow-hidden", children: _jsx("span", { className: "text-4xl opacity-50 group-hover:opacity-80 transition", children: "\uD83C\uDFB5" }) }), _jsx("p", { className: "text-sm font-semibold text-white truncate", children: track.title }), _jsx("p", { className: "text-xs text-gray-500 mt-0.5 truncate", children: track.prompt }), _jsxs("div", { className: "flex items-center gap-2 mt-2 flex-wrap", children: [track.genre && (_jsx("span", { className: "px-2 py-0.5 bg-brand-900 text-brand-300 rounded-full text-[10px]", children: track.genre })), _jsx("span", { className: "text-[10px] text-gray-600 font-mono", children: fmtDuration(track.durationSeconds) }), track.tempoBpm && (_jsxs("span", { className: "text-[10px] text-gray-600", children: [track.tempoBpm, " BPM"] })), _jsx("span", { className: `text-[10px] px-1.5 rounded font-mono
          ${track.qualityMode === 'gpu_full' ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'}`, children: track.qualityMode })] }), track.blendRecipe && Object.keys(track.blendRecipe).length > 0 && (_jsx("div", { className: "flex h-1.5 rounded-full overflow-hidden mt-3 gap-px", children: Object.entries(track.blendRecipe).map(([m, w]) => (_jsx("div", { className: "rounded-full", style: {
                        flex: w,
                        background: { musicgen_medium: '#0e7c6e', riffusion: '#7c3aed',
                            musicgen_large: '#1e6b3a', stable_audio_open: '#d97706',
                            audioldm2: '#2563eb' }[m] ?? '#0e7c6e',
                    }, title: `${m}: ${Math.round(w * 100)}%` }, m))) })), _jsxs("div", { className: "flex gap-2 mt-3", children: [_jsx("a", { href: `/api/v1/audio/${track.uuid}/download?format=mp3`, download: true, className: "flex-1 text-center text-xs py-1.5 rounded-lg bg-navy-700\n                     hover:bg-navy-600 text-gray-300 transition", children: "\u2B07 MP3" }), _jsx("button", { onClick: () => onLicence(track.uuid), title: "View royalty-free licence", className: "px-2.5 py-1.5 rounded-lg bg-navy-700 hover:bg-brand-800\n                     text-gray-300 text-xs transition", children: "\uD83D\uDCDC" }), _jsx("button", { onClick: () => onDelete(track.uuid), className: "px-2.5 py-1.5 rounded-lg bg-navy-700 hover:bg-red-900\n                     text-gray-400 hover:text-red-300 text-xs transition", children: "\uD83D\uDDD1" })] })] }));
}
// ── Licence modal ─────────────────────────────────────────────────────────────
function LicenceModal({ cert, onClose }) {
    return (_jsx("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm z-50\n                 flex items-center justify-center p-4", onClick: onClose, children: _jsxs("div", { className: "bg-navy-800 rounded-2xl border border-brand-700 p-6 max-w-md w-full\n                   animate-slide-up", onClick: e => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-semibold text-white", children: "\uD83D\uDCDC Royalty-Free Licence" }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-white", children: "\u2715" })] }), _jsxs("div", { className: "space-y-3 text-sm", children: [_jsx(Row, { label: "Licence UUID", value: cert.licenceUuid, mono: true }), _jsx(Row, { label: "Track UUID", value: cert.trackUuid, mono: true }), _jsx(Row, { label: "Licence Type", value: cert.licenceType }), _jsx(Row, { label: "SPDX ID", value: cert.spdxIdentifier, mono: true }), _jsx(Row, { label: "Issued", value: new Date(cert.generationTimestamp).toLocaleString() }), _jsx(Row, { label: "SHA-256", value: cert.sha256Hash.slice(0, 16) + '…', mono: true })] }), cert.modelLicences?.length > 0 && (_jsxs("div", { className: "mt-4", children: [_jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wide mb-2", children: "Model Licences" }), cert.modelLicences.map(ml => (_jsxs("div", { className: "flex justify-between text-xs text-gray-400 py-1\n                              border-b border-navy-700 last:border-0", children: [_jsx("span", { children: ml.modelId }), _jsx("span", { className: "font-mono text-brand-400", children: ml.spdxIdentifier })] }, ml.modelId)))] })), _jsx("div", { className: "mt-5 p-3 rounded-lg bg-brand-900/40 border border-brand-800", children: _jsx("p", { className: "text-xs text-brand-300", children: "\u2705 This track is royalty-free. You may use it commercially, distribute it, and modify it. S-Rail attribution required if Stable Audio model was used." }) }), _jsx("button", { onClick: onClose, className: "mt-4 w-full py-2 rounded-lg bg-navy-700 hover:bg-navy-600\n                     text-sm text-gray-300 transition", children: "Close" })] }) }));
}
function Row({ label, value, mono }) {
    return (_jsxs("div", { className: "flex justify-between gap-4", children: [_jsx("span", { className: "text-gray-500 flex-none", children: label }), _jsx("span", { className: `text-gray-200 truncate text-right ${mono ? 'font-mono text-xs' : ''}`, children: value })] }));
}
