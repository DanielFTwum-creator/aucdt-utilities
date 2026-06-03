import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore, api } from '../../lib/api';
import { useEffect, useRef, useState } from 'react';
import {
  LayoutDashboard, Monitor, Activity, Bell, Shield, ScrollText,
  Wifi, LogOut, RefreshCw, Zap
} from 'lucide-react';
import { clsx } from 'clsx';

const NAV = [
  { to: '/',          label: 'Overview',   icon: LayoutDashboard },
  { to: '/devices',   label: 'Devices',    icon: Monitor },
  { to: '/bandwidth', label: 'Bandwidth',  icon: Activity },
  { to: '/alerts',    label: 'Alerts',     icon: Bell },
  { to: '/control',   label: 'Control',    icon: Shield },
  { to: '/audit',     label: 'Audit Log',  icon: ScrollText },
];

export function Layout() {
  const { logout, username } = useAuthStore();
  const navigate = useNavigate();
  const wsRef = useRef<WebSocket | null>(null);
  const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [lastEvent, setLastEvent] = useState<string>('');
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
      ws.onopen  = () => setWsStatus('connected');
      ws.onclose = () => { setWsStatus('disconnected'); setTimeout(connect, 5000); };
      ws.onerror = () => ws.close();
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          setLastEvent(msg.type || 'EVENT');
        } catch { /* ignore */ }
      };
      wsRef.current = ws;
    };
    connect();
    return () => wsRef.current?.close();
  }, []);

  function handleLogout() { logout(); navigate('/login'); }

  const activeAlerts = health?.activeAlerts ?? 0;
  const rogueDevices = health?.rogueDevices ?? 0;

  return (
    <div className="flex h-screen overflow-hidden bg-navy" style={{background: 'linear-gradient(135deg, #0D1B2E 0%, #0a1525 100%)'}}>

      {/* Sidebar */}
      <aside className="w-56 flex flex-col border-r border-gold/10 relative shrink-0"
             style={{background: 'rgba(13,27,46,0.95)', backgroundImage: 'linear-gradient(rgba(200,146,10,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,10,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px'}}>

        {/* Logo */}
        <div className="px-4 py-5 border-b border-gold/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{background: 'rgba(200,146,10,0.15)', border: '1px solid rgba(200,146,10,0.3)'}}>
              <Wifi size={16} className="text-gold" />
            </div>
            <div>
              <div className="font-mono-display text-gold text-sm font-bold tracking-wider">NETSCAN</div>
              <div className="text-xs text-slate-500 font-mono-code" style={{fontSize: '10px'}}>TUC ICT — v1.0.0</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-150 group',
                isActive
                  ? 'bg-gold/10 text-gold border border-gold/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              )}>
              {({ isActive }) => (
                <>
                  <Icon size={15} className={isActive ? 'text-gold' : 'text-slate-500 group-hover:text-slate-300'} />
                  <span className={clsx('font-mono-code', isActive ? 'text-gold' : '')} style={{fontSize: '12px', letterSpacing: '0.05em'}}>{label.toUpperCase()}</span>
                  {label === 'Alerts' && activeAlerts > 0 && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded font-bold" style={{background: 'rgba(255,68,68,0.2)', color: '#FF4444', fontSize: '10px'}}>{activeAlerts}</span>
                  )}
                  {label === 'Devices' && rogueDevices > 0 && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded font-bold" style={{background: 'rgba(255,184,0,0.2)', color: '#FFB800', fontSize: '10px'}}>{rogueDevices}!</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom status */}
        <div className="px-4 py-4 border-t border-gold/10 space-y-2">
          <div className="flex items-center gap-2">
            <span className={clsx('pulse-dot', wsStatus === 'connected' ? 'green' : 'red')} />
            <span className="text-xs font-mono-code text-slate-500">
              {wsStatus === 'connected' ? 'LIVE' : 'OFFLINE'}
              {lastEvent && ` · ${lastEvent}`}
            </span>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition-colors font-mono-code"
            style={{letterSpacing: '0.05em'}}>
            <LogOut size={12} />
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="h-12 flex items-center px-6 gap-6 border-b border-gold/10 shrink-0"
                style={{background: 'rgba(13,27,46,0.8)', backdropFilter: 'blur(8px)'}}>

          {/* Status pills */}
          <div className="flex items-center gap-4 text-xs font-mono-code text-slate-400" style={{letterSpacing: '0.08em'}}>
            <span>DEVICES: <span className="text-scan-green">{health?.activeDevices ?? '—'}</span></span>
            <span className="text-slate-600">|</span>
            <span>ROGUE: <span style={{color: rogueDevices > 0 ? '#FF4444' : '#00FF87'}}>{health?.rogueDevices ?? '—'}</span></span>
            <span className="text-slate-600">|</span>
            <span>ALERTS: <span style={{color: activeAlerts > 0 ? '#FFB800' : '#00FF87'}}>{activeAlerts}</span></span>
            <span className="text-slate-600">|</span>
            <span>WAN: <span style={{color: (health?.wanUtilisationPct ?? 0) > 80 ? '#FF4444' : (health?.wanUtilisationPct ?? 0) > 60 ? '#FFB800' : '#00FF87'}}>
              {health?.wanUtilisationPct?.toFixed(1) ?? '—'}%
            </span></span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span className="font-mono-display text-gold/60 text-xs" style={{letterSpacing: '0.1em'}}>
              {tick.toLocaleTimeString('en-GB', {hour12: false})} WAT
            </span>
            <span className="text-xs font-mono-code text-slate-500">{username}</span>
            <div className="flex items-center gap-1 text-xs font-mono-code" style={{color: 'rgba(200,146,10,0.5)', fontSize: '10px'}}>
              <Zap size={10} />
              MOCK MODE
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6" style={{background: 'radial-gradient(ellipse at top left, rgba(27,58,107,0.1) 0%, transparent 60%)'}}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
