import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
const IFACE_COLOURS = ['#00FF87', '#C8920A', '#00CFFF', '#FFB800', '#B87FFF'];
function formatBytes(bytes) {
    if (bytes < 1024)
        return `${bytes}B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
function IfaceBar({ name, pct, colour, capacityMbps, bytesIn, bytesOut }) {
    return (_jsxs("div", { className: "noc-card p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "font-mono-code text-xs text-slate-300 tracking-wide", children: name }), _jsxs("span", { className: "font-mono-display text-sm", style: { color: pct > 80 ? '#FF4444' : pct > 60 ? '#FFB800' : colour }, children: [pct.toFixed(1), "%"] })] }), _jsx("div", { className: "h-2 rounded-full bg-black/40 overflow-hidden mb-2", children: _jsx("div", { className: "h-full rounded-full transition-all duration-500", style: { width: `${pct}%`, background: pct > 80 ? '#FF4444' : pct > 60 ? '#FFB800' : colour } }) }), _jsxs("div", { className: "flex justify-between text-xs font-mono-code text-slate-500", children: [_jsxs("span", { children: ["\u2193 ", formatBytes(bytesIn), "/s"] }), _jsxs("span", { children: [capacityMbps, " Mbps cap"] }), _jsxs("span", { children: ["\u2191 ", formatBytes(bytesOut), "/s"] })] })] }));
}
const PERIODS = [
    { label: '1H', seconds: 3600 },
    { label: '6H', seconds: 21600 },
    { label: '24H', seconds: 86400 },
    { label: '7D', seconds: 604800 },
];
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length)
        return null;
    return (_jsxs("div", { className: "noc-card p-3 text-xs font-mono-code", children: [_jsx("p", { className: "text-slate-400 mb-1", children: label }), payload.map((p) => (_jsxs("p", { style: { color: p.color }, children: [p.name, ": ", p.value?.toFixed(1), "%"] }, p.name)))] }));
};
export function BandwidthPage() {
    const [period, setPeriod] = useState(PERIODS[2]);
    const [selectedIface, setSelectedIface] = useState('');
    const { data: interfaces = [] } = useQuery({ queryKey: ['bw-interfaces'], queryFn: api.bandwidth.interfaces, refetchInterval: 15_000 });
    const { data: history = [] } = useQuery({
        queryKey: ['bw-history', selectedIface, period.seconds],
        queryFn: () => api.bandwidth.history(selectedIface || undefined, period.seconds),
        refetchInterval: 30_000,
    });
    const { data: topN = [] } = useQuery({ queryKey: ['bw-top'], queryFn: () => api.bandwidth.topConsumers(10) });
    // Pivot history data for Recharts (one row per timestamp, columns per interface)
    const chartData = (() => {
        const grouped = {};
        history.forEach(s => {
            const t = format(new Date(s.sampledAt), 'HH:mm');
            if (!grouped[t])
                grouped[t] = { time: t };
            grouped[t][s.interfaceName] = s.utilisationPct;
        });
        return Object.values(grouped).slice(-120); // last 120 points
    })();
    const ifaceNames = [...new Set(history.map(s => s.interfaceName))];
    return (_jsxs("div", { className: "space-y-5 animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-mono-display text-xl text-gold tracking-widest", children: "BANDWIDTH MONITOR" }), _jsxs("p", { className: "text-xs text-slate-500 font-mono-code mt-0.5", children: ["SNMP polling \u00B7 30s intervals \u00B7 ", interfaces.length, " interfaces"] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: interfaces.map((iface, i) => (_jsx(IfaceBar, { name: iface.name, pct: iface.utilisationPct, colour: IFACE_COLOURS[i % IFACE_COLOURS.length], capacityMbps: iface.capacityMbps, bytesIn: iface.bytesIn, bytesOut: iface.bytesOut }, iface.id))) }), _jsxs("div", { className: "noc-card p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-5", children: [_jsx("h2", { className: "font-mono-code text-xs text-slate-400 tracking-widest", children: "UTILISATION HISTORY" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("select", { value: selectedIface, onChange: e => setSelectedIface(e.target.value), className: "bg-black/30 border border-white/10 rounded px-2 py-1 text-xs font-mono-code text-slate-300 focus:outline-none", children: [_jsx("option", { value: "", children: "ALL INTERFACES" }), interfaces.map(i => _jsx("option", { value: i.name, children: i.name }, i.id))] }), _jsx("div", { className: "flex gap-1", children: PERIODS.map(p => (_jsx("button", { onClick: () => setPeriod(p), className: "px-2.5 py-1 rounded text-xs font-mono-code transition-all", style: period === p
                                                ? { background: 'rgba(200,146,10,0.15)', border: '1px solid rgba(200,146,10,0.4)', color: '#C8920A' }
                                                : { border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }, children: p.label }, p.label))) })] })] }), _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: chartData, margin: { top: 0, right: 0, left: -20, bottom: 0 }, children: [_jsx("defs", { children: ifaceNames.map((name, i) => (_jsxs("linearGradient", { id: `grad-${i}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: IFACE_COLOURS[i % IFACE_COLOURS.length], stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: IFACE_COLOURS[i % IFACE_COLOURS.length], stopOpacity: 0 })] }, name))) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.04)" }), _jsx(XAxis, { dataKey: "time", tick: { fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }, tickLine: false, axisLine: false, interval: "preserveStartEnd" }), _jsx(YAxis, { domain: [0, 100], tick: { fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }, tickLine: false, axisLine: false, tickFormatter: v => `${v}%` }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), ifaceNames.map((name, i) => (_jsx(Area, { type: "monotone", dataKey: name, stroke: IFACE_COLOURS[i % IFACE_COLOURS.length], strokeWidth: 1.5, fill: `url(#grad-${i})`, dot: false }, name)))] }) }) })] }), _jsxs("div", { className: "noc-card p-5", children: [_jsx("h2", { className: "font-mono-code text-xs text-slate-400 tracking-widest mb-4", children: "TOP BANDWIDTH CONSUMERS" }), _jsx("div", { className: "space-y-2", children: topN.map((c, i) => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-xs font-mono-code text-slate-600 w-4", children: i + 1 }), _jsx("span", { className: "font-mono-code text-xs text-scan-blue w-28", children: c.ip }), _jsx("span", { className: "text-xs text-slate-400 flex-1 truncate", children: c.label || c.hostname || 'Unknown device' }), _jsxs("div", { className: "flex items-center gap-2 w-40", children: [_jsx("div", { className: "flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full rounded-full", style: {
                                                    width: `${Math.min(100, (c.estimatedMbps / 20) * 100)}%`,
                                                    background: c.estimatedMbps > 15 ? '#FF4444' : c.estimatedMbps > 8 ? '#FFB800' : '#00FF87'
                                                } }) }), _jsxs("span", { className: "font-mono-code text-xs text-slate-300 w-16 text-right", children: [c.estimatedMbps, " Mbps"] })] })] }, c.deviceId))) })] })] }));
}
