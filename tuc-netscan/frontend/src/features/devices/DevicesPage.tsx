import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Device } from '../../lib/api';
import { Search, Tag, Ban, RefreshCw, Filter, ChevronDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';

const STATUS_COLOURS: Record<string, string> = {
  ACTIVE:   '#00FF87',
  INACTIVE: '#64748b',
  BLOCKED:  '#FF4444',
  ROGUE:    '#FFB800',
};

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLOURS[status] ?? '#64748b';
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono-code"
          style={{background: `${color}15`, color, border: `1px solid ${color}30`}}>
      <span className="w-1.5 h-1.5 rounded-full" style={{background: color}} />
      {status}
    </span>
  );
}

function AnnotateModal({ device, onClose }: { device: Device; onClose: () => void }) {
  const [label, setLabel] = useState(device.label ?? '');
  const qc = useQueryClient();
  const mut = useMutation({
    mutationFn: () => api.devices.annotate(device.id, label),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['devices'] }); onClose(); }
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="noc-card w-full max-w-sm p-6">
        <h3 className="font-mono-code text-xs text-slate-400 tracking-widest mb-4">ANNOTATE DEVICE</h3>
        <p className="text-sm text-slate-300 mb-4">{device.mac} · {device.ip}</p>
        <input value={label} onChange={e => setLabel(e.target.value)}
          placeholder="e.g. Admin Block Printer"
          className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-slate-200 font-mono-code mb-4 focus:outline-none focus:border-gold/40" />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 text-xs font-mono-code text-slate-400 border border-white/10 rounded hover:border-white/20">CANCEL</button>
          <button onClick={() => mut.mutate()} disabled={!label.trim()}
            className="flex-1 py-2 text-xs font-mono-code rounded disabled:opacity-40"
            style={{background: 'rgba(200,146,10,0.15)', border: '1px solid rgba(200,146,10,0.4)', color: '#C8920A'}}>
            SAVE LABEL
          </button>
        </div>
      </div>
    </div>
  );
}

function BlockModal({ device, onClose }: { device: Device; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const qc = useQueryClient();
  const mut = useMutation({
    mutationFn: () => api.control.block(device.mac, reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['devices'] }); onClose(); }
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="noc-card w-full max-w-sm p-6">
        <h3 className="font-mono-code text-xs tracking-widest mb-1" style={{color: '#FF4444'}}>BLOCK DEVICE</h3>
        <p className="text-xs text-slate-500 mb-4">This generates a firewall script. Apply on the campus gateway as root.</p>
        <div className="bg-black/30 rounded p-3 mb-4 text-xs font-mono-code text-slate-300 space-y-1">
          <div><span className="text-slate-500">MAC:</span> {device.mac}</div>
          <div><span className="text-slate-500">IP: </span> {device.ip}</div>
        </div>
        <label className="block text-xs font-mono-code text-slate-400 tracking-widest mb-1.5">REASON (REQUIRED)</label>
        <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
          placeholder="Describe why this device is being blocked..."
          className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-slate-200 font-mono-code mb-4 focus:outline-none focus:border-red-500/40 resize-none" />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 text-xs font-mono-code text-slate-400 border border-white/10 rounded hover:border-white/20">CANCEL</button>
          <button onClick={() => mut.mutate()} disabled={!reason.trim() || mut.isPending}
            className="flex-1 py-2 text-xs font-mono-code rounded disabled:opacity-40"
            style={{background: 'rgba(255,68,68,0.15)', border: '1px solid rgba(255,68,68,0.4)', color: '#FF4444'}}>
            {mut.isPending ? 'BLOCKING...' : 'CONFIRM BLOCK'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DevicesPage() {
  const [search, setSearch]       = useState('');
  const [statusF, setStatusF]     = useState('');
  const [annotating, setAnnotating] = useState<Device | null>(null);
  const [blocking, setBlocking]   = useState<Device | null>(null);
  const qc = useQueryClient();

  const { data: devices = [], isLoading, refetch } = useQuery({
    queryKey: ['devices', statusF, search],
    queryFn: () => api.devices.list(statusF || undefined, search || undefined),
  });

  const STATUS_FILTERS = ['', 'ACTIVE', 'INACTIVE', 'BLOCKED', 'ROGUE'];

  const counts = {
    all:      devices.length,
    active:   devices.filter(d => d.status === 'ACTIVE').length,
    rogue:    devices.filter(d => d.status === 'ROGUE').length,
    blocked:  devices.filter(d => d.status === 'BLOCKED').length,
    inactive: devices.filter(d => d.status === 'INACTIVE').length,
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono-display text-xl text-gold tracking-widest">DEVICE REGISTRY</h1>
          <p className="text-xs text-slate-500 font-mono-code mt-0.5">{devices.length} device{devices.length !== 1 ? 's' : ''} · ARP scan every 60s</p>
        </div>
        <button onClick={() => { api.scan.trigger(); refetch(); }}
          className="flex items-center gap-2 px-3 py-2 rounded text-xs font-mono-code transition-colors"
          style={{background: 'rgba(200,146,10,0.1)', border: '1px solid rgba(200,146,10,0.3)', color: '#C8920A'}}>
          <RefreshCw size={12} /> SCAN NOW
        </button>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search IP, MAC, hostname..."
            className="bg-black/20 border border-white/10 rounded px-3 py-2 pl-9 text-sm text-slate-200 font-mono-code w-64 focus:outline-none focus:border-gold/30" />
        </div>
        <div className="flex gap-1">
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setStatusF(s)}
              className={clsx('px-3 py-1.5 rounded text-xs font-mono-code transition-all tracking-wider',
                statusF === s
                  ? 'text-gold border border-gold/40 bg-gold/10'
                  : 'text-slate-500 border border-white/5 hover:border-white/15 hover:text-slate-300')}>
              {s || 'ALL'} {s && counts[s.toLowerCase() as keyof typeof counts] !== undefined && `(${counts[s.toLowerCase() as keyof typeof counts]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="noc-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{borderBottom: '1px solid rgba(200,146,10,0.15)'}}>
                {['ID', 'MAC ADDRESS', 'IP ADDRESS', 'HOSTNAME / LABEL', 'MANUFACTURER', 'STATUS', 'LAST SEEN', 'ADR', 'ACTIONS'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-mono-code text-slate-500 tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={9} className="text-center py-12 text-slate-500 font-mono-code text-xs">LOADING...</td></tr>
              ) : devices.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-slate-500 font-mono-code text-xs">NO DEVICES FOUND</td></tr>
              ) : (
                devices.map((d, i) => (
                  <tr key={d.id} style={{borderBottom: '1px solid rgba(255,255,255,0.03)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.1)'}}>
                    <td className="px-4 py-3 font-mono-code text-xs text-slate-500">{d.id}</td>
                    <td className="px-4 py-3 font-mono-code text-xs text-slate-300 whitespace-nowrap">{d.mac}</td>
                    <td className="px-4 py-3 font-mono-code text-xs text-scan-blue whitespace-nowrap">{d.ip}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="text-sm text-slate-200 truncate">{d.label || d.hostname || <span className="text-slate-600 italic">unknown</span>}</div>
                      {d.label && d.hostname && <div className="text-xs text-slate-500 font-mono-code truncate">{d.hostname}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 max-w-[160px] truncate">{d.manufacturer || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono-code whitespace-nowrap">
                      {formatDistanceToNow(new Date(d.lastSeen), { addSuffix: true })}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono-code text-center">
                      <span style={{color: d.inAdr ? '#00FF87' : '#64748b'}}>{d.inAdr ? '✓' : '✗'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setAnnotating(d)}
                          className="p-1.5 rounded hover:bg-gold/10 transition-colors" title="Annotate">
                          <Tag size={12} className="text-gold/60 hover:text-gold" />
                        </button>
                        {d.status !== 'BLOCKED' && (
                          <button onClick={() => setBlocking(d)}
                            className="p-1.5 rounded hover:bg-red-500/10 transition-colors" title="Block device">
                            <Ban size={12} className="text-red-500/50 hover:text-red-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {annotating && <AnnotateModal device={annotating} onClose={() => setAnnotating(null)} />}
      {blocking   && <BlockModal   device={blocking}   onClose={() => setBlocking(null)} />}
    </div>
  );
}
