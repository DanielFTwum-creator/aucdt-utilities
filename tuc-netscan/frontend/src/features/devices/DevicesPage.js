import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Search, Tag, Ban, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';
const STATUS_COLOURS = {
    ACTIVE: '#00FF87',
    INACTIVE: '#64748b',
    BLOCKED: '#FF4444',
    ROGUE: '#FFB800',
};
function StatusBadge({ status }) {
    const color = STATUS_COLOURS[status] ?? '#64748b';
    return (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono-code", style: { background: `${color}15`, color, border: `1px solid ${color}30` }, children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full", style: { background: color } }), status] }));
}
function AnnotateModal({ device, onClose }) {
    const [label, setLabel] = useState(device.label ?? '');
    const qc = useQueryClient();
    const mut = useMutation({
        mutationFn: () => api.devices.annotate(device.id, label),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['devices'] }); onClose(); }
    });
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm", children: _jsxs("div", { className: "noc-card w-full max-w-sm p-6", children: [_jsx("h3", { className: "font-mono-code text-xs text-slate-400 tracking-widest mb-4", children: "ANNOTATE DEVICE" }), _jsxs("p", { className: "text-sm text-slate-300 mb-4", children: [device.mac, " \u00B7 ", device.ip] }), _jsx("input", { value: label, onChange: e => setLabel(e.target.value), placeholder: "e.g. Admin Block Printer", className: "w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-slate-200 font-mono-code mb-4 focus:outline-none focus:border-gold/40" }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: onClose, className: "flex-1 py-2 text-xs font-mono-code text-slate-400 border border-white/10 rounded hover:border-white/20", children: "CANCEL" }), _jsx("button", { onClick: () => mut.mutate(), disabled: !label.trim(), className: "flex-1 py-2 text-xs font-mono-code rounded disabled:opacity-40", style: { background: 'rgba(200,146,10,0.15)', border: '1px solid rgba(200,146,10,0.4)', color: '#C8920A' }, children: "SAVE LABEL" })] })] }) }));
}
function BlockModal({ device, onClose }) {
    const [reason, setReason] = useState('');
    const qc = useQueryClient();
    const mut = useMutation({
        mutationFn: () => api.control.block(device.mac, reason),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['devices'] }); onClose(); }
    });
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm", children: _jsxs("div", { className: "noc-card w-full max-w-sm p-6", children: [_jsx("h3", { className: "font-mono-code text-xs tracking-widest mb-1", style: { color: '#FF4444' }, children: "BLOCK DEVICE" }), _jsx("p", { className: "text-xs text-slate-500 mb-4", children: "This generates a firewall script. Apply on the campus gateway as root." }), _jsxs("div", { className: "bg-black/30 rounded p-3 mb-4 text-xs font-mono-code text-slate-300 space-y-1", children: [_jsxs("div", { children: [_jsx("span", { className: "text-slate-500", children: "MAC:" }), " ", device.mac] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-500", children: "IP: " }), " ", device.ip] })] }), _jsx("label", { className: "block text-xs font-mono-code text-slate-400 tracking-widest mb-1.5", children: "REASON (REQUIRED)" }), _jsx("textarea", { value: reason, onChange: e => setReason(e.target.value), rows: 3, placeholder: "Describe why this device is being blocked...", className: "w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-slate-200 font-mono-code mb-4 focus:outline-none focus:border-red-500/40 resize-none" }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: onClose, className: "flex-1 py-2 text-xs font-mono-code text-slate-400 border border-white/10 rounded hover:border-white/20", children: "CANCEL" }), _jsx("button", { onClick: () => mut.mutate(), disabled: !reason.trim() || mut.isPending, className: "flex-1 py-2 text-xs font-mono-code rounded disabled:opacity-40", style: { background: 'rgba(255,68,68,0.15)', border: '1px solid rgba(255,68,68,0.4)', color: '#FF4444' }, children: mut.isPending ? 'BLOCKING...' : 'CONFIRM BLOCK' })] })] }) }));
}
export function DevicesPage() {
    const [search, setSearch] = useState('');
    const [statusF, setStatusF] = useState('');
    const [annotating, setAnnotating] = useState(null);
    const [blocking, setBlocking] = useState(null);
    const qc = useQueryClient();
    const { data: devices = [], isLoading, refetch } = useQuery({
        queryKey: ['devices', statusF, search],
        queryFn: () => api.devices.list(statusF || undefined, search || undefined),
    });
    const STATUS_FILTERS = ['', 'ACTIVE', 'INACTIVE', 'BLOCKED', 'ROGUE'];
    const counts = {
        all: devices.length,
        active: devices.filter(d => d.status === 'ACTIVE').length,
        rogue: devices.filter(d => d.status === 'ROGUE').length,
        blocked: devices.filter(d => d.status === 'BLOCKED').length,
        inactive: devices.filter(d => d.status === 'INACTIVE').length,
    };
    return (_jsxs("div", { className: "space-y-5 animate-fade-in", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-mono-display text-xl text-gold tracking-widest", children: "DEVICE REGISTRY" }), _jsxs("p", { className: "text-xs text-slate-500 font-mono-code mt-0.5", children: [devices.length, " device", devices.length !== 1 ? 's' : '', " \u00B7 ARP scan every 60s"] })] }), _jsxs("button", { onClick: () => { api.scan.trigger(); refetch(); }, className: "flex items-center gap-2 px-3 py-2 rounded text-xs font-mono-code transition-colors", style: { background: 'rgba(200,146,10,0.1)', border: '1px solid rgba(200,146,10,0.3)', color: '#C8920A' }, children: [_jsx(RefreshCw, { size: 12 }), " SCAN NOW"] })] }), _jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { size: 13, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" }), _jsx("input", { value: search, onChange: e => setSearch(e.target.value), placeholder: "Search IP, MAC, hostname...", className: "bg-black/20 border border-white/10 rounded px-3 py-2 pl-9 text-sm text-slate-200 font-mono-code w-64 focus:outline-none focus:border-gold/30" })] }), _jsx("div", { className: "flex gap-1", children: STATUS_FILTERS.map(s => (_jsxs("button", { onClick: () => setStatusF(s), className: clsx('px-3 py-1.5 rounded text-xs font-mono-code transition-all tracking-wider', statusF === s
                                ? 'text-gold border border-gold/40 bg-gold/10'
                                : 'text-slate-500 border border-white/5 hover:border-white/15 hover:text-slate-300'), children: [s || 'ALL', " ", s && counts[s.toLowerCase()] !== undefined && `(${counts[s.toLowerCase()]})`] }, s))) })] }), _jsx("div", { className: "noc-card overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsx("tr", { style: { borderBottom: '1px solid rgba(200,146,10,0.15)' }, children: ['ID', 'MAC ADDRESS', 'IP ADDRESS', 'HOSTNAME / LABEL', 'MANUFACTURER', 'STATUS', 'LAST SEEN', 'ADR', 'ACTIONS'].map(h => (_jsx("th", { className: "text-left px-4 py-3 text-xs font-mono-code text-slate-500 tracking-widest whitespace-nowrap", children: h }, h))) }) }), _jsx("tbody", { children: isLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: 9, className: "text-center py-12 text-slate-500 font-mono-code text-xs", children: "LOADING..." }) })) : devices.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 9, className: "text-center py-12 text-slate-500 font-mono-code text-xs", children: "NO DEVICES FOUND" }) })) : (devices.map((d, i) => (_jsxs("tr", { style: { borderBottom: '1px solid rgba(255,255,255,0.03)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.1)' }, children: [_jsx("td", { className: "px-4 py-3 font-mono-code text-xs text-slate-500", children: d.id }), _jsx("td", { className: "px-4 py-3 font-mono-code text-xs text-slate-300 whitespace-nowrap", children: d.mac }), _jsx("td", { className: "px-4 py-3 font-mono-code text-xs text-scan-blue whitespace-nowrap", children: d.ip }), _jsxs("td", { className: "px-4 py-3 max-w-xs", children: [_jsx("div", { className: "text-sm text-slate-200 truncate", children: d.label || d.hostname || _jsx("span", { className: "text-slate-600 italic", children: "unknown" }) }), d.label && d.hostname && _jsx("div", { className: "text-xs text-slate-500 font-mono-code truncate", children: d.hostname })] }), _jsx("td", { className: "px-4 py-3 text-xs text-slate-400 max-w-[160px] truncate", children: d.manufacturer || '—' }), _jsx("td", { className: "px-4 py-3", children: _jsx(StatusBadge, { status: d.status }) }), _jsx("td", { className: "px-4 py-3 text-xs text-slate-500 font-mono-code whitespace-nowrap", children: formatDistanceToNow(new Date(d.lastSeen), { addSuffix: true }) }), _jsx("td", { className: "px-4 py-3 text-xs font-mono-code text-center", children: _jsx("span", { style: { color: d.inAdr ? '#00FF87' : '#64748b' }, children: d.inAdr ? '✓' : '✗' }) }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => setAnnotating(d), className: "p-1.5 rounded hover:bg-gold/10 transition-colors", title: "Annotate", children: _jsx(Tag, { size: 12, className: "text-gold/60 hover:text-gold" }) }), d.status !== 'BLOCKED' && (_jsx("button", { onClick: () => setBlocking(d), className: "p-1.5 rounded hover:bg-red-500/10 transition-colors", title: "Block device", children: _jsx(Ban, { size: 12, className: "text-red-500/50 hover:text-red-400" }) }))] }) })] }, d.id)))) })] }) }) }), annotating && _jsx(AnnotateModal, { device: annotating, onClose: () => setAnnotating(null) }), blocking && _jsx(BlockModal, { device: blocking, onClose: () => setBlocking(null) })] }));
}
