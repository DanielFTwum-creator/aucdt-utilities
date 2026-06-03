import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore, api } from '../../lib/api';
import { useEffect, useRef, useState } from 'react';
import { LayoutDashboard, Monitor, Activity, Bell, Shield, ScrollText, Wifi, LogOut, Zap } from 'lucide-react';
import { clsx } from 'clsx';
const NAV = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/devices', label: 'Devices', icon: Monitor },
    { to: '/bandwidth', label: 'Bandwidth', icon: Activity },
    { to: '/alerts', label: 'Alerts', icon: Bell },
    { to: '/control', label: 'Control', icon: Shield },
    { to: '/audit', label: 'Audit Log', icon: ScrollText },
];
export function Layout() {
    const { logout, username } = useAuthStore();
    const navigate = useNavigate();
    const wsRef = useRef(null);
    const [wsStatus, setWsStatus] = useState('disconnected');
    const [lastEvent, setLastEvent] = useState('');
    const [tick, setTick] = useState(new Date());
    const { data: health } = useQuery({
        queryKey: ['health'],
        queryFn: api.health,
        refetchInterval: 15_000,
    });
    // Clock
    useEffect(() => {
        const t = setInterval(() => setTick(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    // WebSocket
    useEffect(() => {
        const connect = () => {
            const ws = new WebSocket(`ws://${window.location.host}/ws/realtime`);
            ws.onopen = () => setWsStatus('connected');
            ws.onclose = () => { setWsStatus('disconnected'); setTimeout(connect, 5000); };
            ws.onerror = () => ws.close();
            ws.onmessage = (e) => {
                try {
                    const msg = JSON.parse(e.data);
                    setLastEvent(msg.type || 'EVENT');
                }
                catch { /* ignore */ }
            };
            wsRef.current = ws;
        };
        connect();
        return () => wsRef.current?.close();
    }, []);
    function handleLogout() { logout(); navigate('/login'); }
    const activeAlerts = health?.activeAlerts ?? 0;
    const rogueDevices = health?.rogueDevices ?? 0;
    return (_jsxs("div", { className: "flex h-screen overflow-hidden bg-navy", style: { background: 'linear-gradient(135deg, #0D1B2E 0%, #0a1525 100%)' }, children: [_jsxs("aside", { className: "w-56 flex flex-col border-r border-gold/10 relative shrink-0", style: { background: 'rgba(13,27,46,0.95)', backgroundImage: 'linear-gradient(rgba(200,146,10,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,10,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }, children: [_jsx("div", { className: "px-4 py-5 border-b border-gold/10", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded flex items-center justify-center", style: { background: 'rgba(200,146,10,0.15)', border: '1px solid rgba(200,146,10,0.3)' }, children: _jsx(Wifi, { size: 16, className: "text-gold" }) }), _jsxs("div", { children: [_jsx("div", { className: "font-mono-display text-gold text-sm font-bold tracking-wider", children: "NETSCAN" }), _jsx("div", { className: "text-xs text-slate-500 font-mono-code", style: { fontSize: '10px' }, children: "TUC ICT \u2014 v1.0.0" })] })] }) }), _jsx("nav", { className: "flex-1 py-4 px-2 space-y-0.5", children: NAV.map(({ to, label, icon: Icon }) => (_jsx(NavLink, { to: to, end: to === '/', className: ({ isActive }) => clsx('flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-150 group', isActive
                                ? 'bg-gold/10 text-gold border border-gold/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'), children: ({ isActive }) => (_jsxs(_Fragment, { children: [_jsx(Icon, { size: 15, className: isActive ? 'text-gold' : 'text-slate-500 group-hover:text-slate-300' }), _jsx("span", { className: clsx('font-mono-code', isActive ? 'text-gold' : ''), style: { fontSize: '12px', letterSpacing: '0.05em' }, children: label.toUpperCase() }), label === 'Alerts' && activeAlerts > 0 && (_jsx("span", { className: "ml-auto text-xs px-1.5 py-0.5 rounded font-bold", style: { background: 'rgba(255,68,68,0.2)', color: '#FF4444', fontSize: '10px' }, children: activeAlerts })), label === 'Devices' && rogueDevices > 0 && (_jsxs("span", { className: "ml-auto text-xs px-1.5 py-0.5 rounded font-bold", style: { background: 'rgba(255,184,0,0.2)', color: '#FFB800', fontSize: '10px' }, children: [rogueDevices, "!"] }))] })) }, to))) }), _jsxs("div", { className: "px-4 py-4 border-t border-gold/10 space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: clsx('pulse-dot', wsStatus === 'connected' ? 'green' : 'red') }), _jsxs("span", { className: "text-xs font-mono-code text-slate-500", children: [wsStatus === 'connected' ? 'LIVE' : 'OFFLINE', lastEvent && ` · ${lastEvent}`] })] }), _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition-colors font-mono-code", style: { letterSpacing: '0.05em' }, children: [_jsx(LogOut, { size: 12 }), "LOGOUT"] })] })] }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "h-12 flex items-center px-6 gap-6 border-b border-gold/10 shrink-0", style: { background: 'rgba(13,27,46,0.8)', backdropFilter: 'blur(8px)' }, children: [_jsxs("div", { className: "flex items-center gap-4 text-xs font-mono-code text-slate-400", style: { letterSpacing: '0.08em' }, children: [_jsxs("span", { children: ["DEVICES: ", _jsx("span", { className: "text-scan-green", children: health?.activeDevices ?? '—' })] }), _jsx("span", { className: "text-slate-600", children: "|" }), _jsxs("span", { children: ["ROGUE: ", _jsx("span", { style: { color: rogueDevices > 0 ? '#FF4444' : '#00FF87' }, children: health?.rogueDevices ?? '—' })] }), _jsx("span", { className: "text-slate-600", children: "|" }), _jsxs("span", { children: ["ALERTS: ", _jsx("span", { style: { color: activeAlerts > 0 ? '#FFB800' : '#00FF87' }, children: activeAlerts })] }), _jsx("span", { className: "text-slate-600", children: "|" }), _jsxs("span", { children: ["WAN: ", _jsxs("span", { style: { color: (health?.wanUtilisationPct ?? 0) > 80 ? '#FF4444' : (health?.wanUtilisationPct ?? 0) > 60 ? '#FFB800' : '#00FF87' }, children: [health?.wanUtilisationPct?.toFixed(1) ?? '—', "%"] })] })] }), _jsxs("div", { className: "ml-auto flex items-center gap-4", children: [_jsxs("span", { className: "font-mono-display text-gold/60 text-xs", style: { letterSpacing: '0.1em' }, children: [tick.toLocaleTimeString('en-GB', { hour12: false }), " WAT"] }), _jsx("span", { className: "text-xs font-mono-code text-slate-500", children: username }), _jsxs("div", { className: "flex items-center gap-1 text-xs font-mono-code", style: { color: 'rgba(200,146,10,0.5)', fontSize: '10px' }, children: [_jsx(Zap, { size: 10 }), "MOCK MODE"] })] })] }), _jsx("main", { className: "flex-1 overflow-auto p-6", style: { background: 'radial-gradient(ellipse at top left, rgba(27,58,107,0.1) 0%, transparent 60%)' }, children: _jsx(Outlet, {}) })] })] }));
}
