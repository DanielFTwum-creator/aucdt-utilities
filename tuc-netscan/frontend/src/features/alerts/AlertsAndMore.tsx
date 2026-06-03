// ── AlertsPage ────────────────────────────────────────────────────────
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Alert } from '../../lib/api';
import { CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function SeverityIcon({ s }: { s: string }) {
  if (s === 'CRITICAL') return <AlertTriangle size={14} style={{color: '#FF4444'}} />;
  if (s === 'WARNING')  return <AlertCircle  size={14} style={{color: '#FFB800'}} />;
  return <Info size={14} style={{color: '#00CFFF'}} />;
}

function AckModal({ alert, onClose }: { alert: Alert; onClose: () => void }) {
  const [note, setNote] = useState('');
  const qc = useQueryClient();
  const mut = useMutation({
    mutationFn: () => api.alerts.ack(alert.id, note),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['alerts'] }); qc.invalidateQueries({ queryKey: ['health'] }); onClose(); }
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="noc-card w-full max-w-md p-6">
        <h3 className="font-mono-code text-xs text-slate-400 tracking-widest mb-3">ACKNOWLEDGE ALERT #{alert.id}</h3>
        <p className="text-sm text-slate-200 mb-1">{alert.title}</p>
        <p className="text-xs text-slate-500 mb-4">{alert.message}</p>
        <label className="block text-xs font-mono-code text-slate-400 tracking-widest mb-1.5">ACK NOTE (REQUIRED)</label>
        <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
          placeholder="Describe the action taken or why this alert is being acknowledged..."
          className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-slate-200 font-mono-code mb-4 focus:outline-none focus:border-gold/40 resize-none" />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 text-xs font-mono-code text-slate-400 border border-white/10 rounded">CANCEL</button>
          <button onClick={() => mut.mutate()} disabled={!note.trim() || mut.isPending}
            className="flex-1 py-2 text-xs font-mono-code rounded disabled:opacity-40"
            style={{background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.3)', color: '#00FF87'}}>
            {mut.isPending ? 'ACKNOWLEDGING...' : 'ACKNOWLEDGE'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AlertsPage() {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'ACKNOWLEDGED'>('ACTIVE');
  const [sevFilter, setSevFilter] = useState('');
  const [acking, setAcking] = useState<Alert | null>(null);

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts', filter, sevFilter],
    queryFn: () => api.alerts.list(sevFilter || undefined, filter === 'ALL' ? undefined : filter),
    refetchInterval: 15_000,
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-mono-display text-xl text-gold tracking-widest">ALERTS</h1>
        <p className="text-xs text-slate-500 font-mono-code mt-0.5">{alerts.filter(a => a.status === 'ACTIVE').length} active</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {(['ALL', 'ACTIVE', 'ACKNOWLEDGED'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded text-xs font-mono-code tracking-wider transition-all"
            style={filter === f
              ? {background: 'rgba(200,146,10,0.15)', border: '1px solid rgba(200,146,10,0.4)', color: '#C8920A'}
              : {border: '1px solid rgba(255,255,255,0.08)', color: '#64748b'}}>
            {f}
          </button>
        ))}
        <div className="w-px h-5 bg-white/10" />
        {['', 'CRITICAL', 'WARNING', 'INFO'].map(s => (
          <button key={s} onClick={() => setSevFilter(s)}
            className="px-3 py-1.5 rounded text-xs font-mono-code tracking-wider transition-all"
            style={sevFilter === s
              ? {background: 'rgba(200,146,10,0.15)', border: '1px solid rgba(200,146,10,0.4)', color: '#C8920A'}
              : {border: '1px solid rgba(255,255,255,0.08)', color: '#64748b'}}>
            {s || 'ALL SEV.'}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {alerts.length === 0 ? (
          <div className="noc-card p-12 text-center">
            <CheckCircle size={32} className="mx-auto mb-3" style={{color: '#00FF87'}} />
            <p className="font-mono-code text-xs text-slate-500">NO ALERTS MATCHING FILTER</p>
          </div>
        ) : (
          alerts.map(a => (
            <div key={a.id} className="noc-card p-4 flex items-start gap-4"
                 style={{borderLeftWidth: '3px', borderLeftColor: a.severity === 'CRITICAL' ? '#FF4444' : a.severity === 'WARNING' ? '#FFB800' : '#00CFFF'}}>
              <SeverityIcon s={a.severity} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm text-slate-200 font-medium">{a.title}</span>
                  <span className="text-xs font-mono-code text-slate-600">{a.alertType}</span>
                </div>
                <p className="text-xs text-slate-400">{a.message}</p>
                {a.status === 'ACKNOWLEDGED' && (
                  <p className="text-xs text-slate-600 mt-1 font-mono-code">
                    ACK'd by {a.ackedBy} · {a.ackNote}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-600 font-mono-code mb-2">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</p>
                {a.status === 'ACTIVE' && (
                  <button onClick={() => setAcking(a)}
                    className="px-3 py-1 rounded text-xs font-mono-code transition-colors"
                    style={{background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)', color: '#00FF87'}}>
                    ACK
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {acking && <AckModal alert={acking} onClose={() => setAcking(null)} />}
    </div>
  );
}

// ── ControlPage ───────────────────────────────────────────────────────
import { Shield, Unlock, Copy, Check } from 'lucide-react';
import type { BlockEntry } from '../../lib/api';

export function ControlPage() {
  const [scriptModal, setScriptModal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const qc = useQueryClient();

  const { data: blocks = [] } = useQuery({ queryKey: ['blocks'], queryFn: api.control.list, refetchInterval: 30_000 });

  const unblockMut = useMutation({
    mutationFn: (id: number) => api.control.unblock(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blocks'] }); qc.invalidateQueries({ queryKey: ['devices'] }); }
  });

  function copyScript(script: string) {
    navigator.clipboard.writeText(script).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-mono-display text-xl text-gold tracking-widest">DEVICE CONTROL</h1>
        <p className="text-xs text-slate-500 font-mono-code mt-0.5">{blocks.filter(b => b.active).length} active block{blocks.filter(b => b.active).length !== 1 ? 's' : ''} · Use the Devices panel to block a device</p>
      </div>

      <div className="noc-card p-4 text-xs font-mono-code" style={{borderColor: 'rgba(255,184,0,0.2)', background: 'rgba(255,184,0,0.03)'}}>
        <p className="text-amber-400 flex items-center gap-2">
          <AlertTriangle size={12} />
          IMPORTANT: Blocking a device generates an iptables script. SSH to the campus gateway and apply it as root.
        </p>
      </div>

      <div className="noc-card overflow-hidden">
        <div className="px-5 py-3 border-b border-gold/10">
          <h2 className="font-mono-code text-xs text-slate-400 tracking-widest">BLOCK LIST</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{borderBottom: '1px solid rgba(200,146,10,0.1)'}}>
              {['ID', 'MAC', 'REASON', 'BLOCKED BY', 'BLOCKED AT', 'STATUS', 'ACTIONS'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-mono-code text-slate-500 tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blocks.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-slate-500 font-mono-code text-xs">NO BLOCKS CONFIGURED</td></tr>
            ) : (
              blocks.map(b => (
                <tr key={b.id} style={{borderBottom: '1px solid rgba(255,255,255,0.03)'}}>
                  <td className="px-4 py-3 font-mono-code text-xs text-slate-500">{b.id}</td>
                  <td className="px-4 py-3 font-mono-code text-xs text-scan-blue">{b.mac}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-xs truncate">{b.reason}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono-code">{b.blockedBy}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono-code whitespace-nowrap">
                    {formatDistanceToNow(new Date(b.blockedAt), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono-code px-2 py-0.5 rounded"
                          style={b.active
                            ? {background: 'rgba(255,68,68,0.1)', color: '#FF4444', border: '1px solid rgba(255,68,68,0.2)'}
                            : {background: 'rgba(100,116,139,0.1)', color: '#64748b', border: '1px solid rgba(100,116,139,0.2)'}}>
                      {b.active ? 'ACTIVE' : 'REMOVED'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setScriptModal(b.script)}
                        className="p-1.5 rounded hover:bg-gold/10 transition-colors" title="View firewall script">
                        <Copy size={12} className="text-gold/50 hover:text-gold" />
                      </button>
                      {b.active && (
                        <button onClick={() => unblockMut.mutate(b.id)}
                          className="p-1.5 rounded hover:bg-green-500/10 transition-colors" title="Unblock device">
                          <Unlock size={12} className="text-green-500/50 hover:text-green-400" />
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

      {scriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="noc-card w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono-code text-xs text-slate-400 tracking-widest">GENERATED FIREWALL SCRIPT</h3>
              <button onClick={() => copyScript(scriptModal)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono-code"
                style={{background: 'rgba(200,146,10,0.1)', border: '1px solid rgba(200,146,10,0.3)', color: '#C8920A'}}>
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? 'COPIED' : 'COPY'}
              </button>
            </div>
            <pre className="bg-black/40 rounded p-4 text-xs font-mono-code text-green-400 overflow-auto max-h-80 whitespace-pre">{scriptModal}</pre>
            <button onClick={() => setScriptModal(null)}
              className="mt-4 w-full py-2 text-xs font-mono-code text-slate-400 border border-white/10 rounded hover:border-white/20">
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── AuditPage ─────────────────────────────────────────────────────────
import { ScrollText } from 'lucide-react';

export function AuditPage() {
  const [actionFilter, setActionFilter] = useState('');

  const { data: log = [] } = useQuery({
    queryKey: ['audit', actionFilter],
    queryFn: () => api.audit.list(actionFilter || undefined),
    refetchInterval: 30_000,
  });

  const ACTION_TYPES = ['', 'BLOCK', 'UNBLOCK', 'ANNOTATE', 'ACK_ALERT', 'SCAN'];
  const ACTION_COLOURS: Record<string, string> = {
    BLOCK: '#FF4444', UNBLOCK: '#00FF87', ANNOTATE: '#C8920A',
    ACK_ALERT: '#00CFFF', SCAN: '#FFB800'
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-mono-display text-xl text-gold tracking-widest">AUDIT LOG</h1>
        <p className="text-xs text-slate-500 font-mono-code mt-0.5">{log.length} entries · append-only · 5 year retention</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {ACTION_TYPES.map(a => (
          <button key={a} onClick={() => setActionFilter(a)}
            className="px-3 py-1.5 rounded text-xs font-mono-code tracking-wider transition-all"
            style={actionFilter === a
              ? {background: 'rgba(200,146,10,0.15)', border: '1px solid rgba(200,146,10,0.4)', color: '#C8920A'}
              : {border: '1px solid rgba(255,255,255,0.08)', color: '#64748b'}}>
            {a || 'ALL ACTIONS'}
          </button>
        ))}
      </div>

      <div className="noc-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{borderBottom: '1px solid rgba(200,146,10,0.1)'}}>
              {['ID', 'ACTOR', 'ACTION', 'TARGET', 'REASON', 'TIMESTAMP'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-mono-code text-slate-500 tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {log.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-slate-500 font-mono-code text-xs">NO AUDIT ENTRIES</td></tr>
            ) : (
              log.map((e, i) => (
                <tr key={e.id} style={{borderBottom: '1px solid rgba(255,255,255,0.03)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.1)'}}>
                  <td className="px-4 py-3 font-mono-code text-xs text-slate-600">{e.id}</td>
                  <td className="px-4 py-3 font-mono-code text-xs text-gold/80">{e.actor}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono-code px-2 py-0.5 rounded"
                          style={{color: ACTION_COLOURS[e.actionType] ?? '#64748b', background: `${ACTION_COLOURS[e.actionType] ?? '#64748b'}15`, border: `1px solid ${ACTION_COLOURS[e.actionType] ?? '#64748b'}30`}}>
                      {e.actionType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono-code text-xs text-scan-blue">{e.targetId}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-xs truncate">{e.reason}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono-code whitespace-nowrap">
                    {formatDistanceToNow(new Date(e.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
