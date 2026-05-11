import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useThemeStore } from '../../themeStore';
import { Server, Cpu, HardDrive, Clock, Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface SystemInfo {
  server: { uptime_formatted: string; started_at: string; node_version: string; platform: string; pid: number };
  memory: { rss_mb: string; heap_used_mb: string; heap_total_mb: string; external_mb: string };
  app: { name: string; app_id: number; version: string; environment: string };
}

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  duration: number;
  message: string;
}

export function Diagnostics() {
  const { isDark, isHighContrast } = useThemeStore();
  const [sysInfo, setSysInfo] = useState<SystemInfo | null>(null);
  const [tests, setTests] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const cardCls = clsx("p-5 rounded-xl border transition-colors",
    isHighContrast ? "bg-black border-yellow-400" : isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-100 shadow-sm"
  );
  const headCls = clsx("text-2xl font-bold", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900");
  const subCls = clsx("text-sm", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-400" : "text-slate-500");
  const labelCls = clsx("text-xs font-medium uppercase tracking-wider", isHighContrast ? "text-yellow-500" : isDark ? "text-slate-500" : "text-slate-400");
  const valCls = clsx("text-lg font-bold tabular-nums", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900");

  useEffect(() => {
    fetchSystemInfo();
    const interval = setInterval(fetchSystemInfo, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemInfo = async () => {
    try {
      const res = await axios.get('/api/v1/admin/system-info');
      setSysInfo(res.data);
    } catch {}
  };

  const runDiagnostics = async () => {
    setRunning(true);
    try {
      const res = await axios.post('/api/v1/admin/run-diagnostics');
      setTests(res.data.results);
    } catch { setTests([]); }
    setRunning(false);
  };

  return (
    <div className="space-y-8" role="region" aria-label="System Diagnostics">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={headCls}><Server className="inline mr-2" size={24} aria-hidden="true" />Diagnostics</h2>
          <p className={subCls}>System health and diagnostic tests</p>
        </div>
        <button
          onClick={runDiagnostics}
          disabled={running}
          aria-label="Run diagnostic tests"
          title="Run diagnostic tests"
          className={clsx("px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors focus:outline-none focus:ring-2",
            isHighContrast ? "bg-yellow-400 text-black hover:bg-yellow-300 focus:ring-yellow-400"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
            running && "opacity-60 cursor-not-allowed"
          )}
        >
          {running ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
          {running ? 'Running...' : 'Run Diagnostics'}
        </button>
      </div>

      {/* System Info Cards */}
      {sysInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={cardCls}>
            <div className={labelCls}>Uptime</div>
            <div className={valCls}>{sysInfo.server.uptime_formatted}</div>
            <Clock size={14} className={clsx("mt-1", isHighContrast ? "text-yellow-600" : "text-slate-400")} aria-hidden="true" />
          </div>
          <div className={cardCls}>
            <div className={labelCls}>Heap Used</div>
            <div className={valCls}>{sysInfo.memory.heap_used_mb} MB</div>
            <Cpu size={14} className={clsx("mt-1", isHighContrast ? "text-yellow-600" : "text-slate-400")} aria-hidden="true" />
          </div>
          <div className={cardCls}>
            <div className={labelCls}>RSS Memory</div>
            <div className={valCls}>{sysInfo.memory.rss_mb} MB</div>
            <HardDrive size={14} className={clsx("mt-1", isHighContrast ? "text-yellow-600" : "text-slate-400")} aria-hidden="true" />
          </div>
          <div className={cardCls}>
            <div className={labelCls}>Node.js</div>
            <div className={valCls}>{sysInfo.server.node_version}</div>
            <span className={clsx("text-xs", subCls)}>{sysInfo.server.platform} • PID {sysInfo.server.pid}</span>
          </div>
        </div>
      )}

      {/* App Info */}
      {sysInfo && (
        <div className={cardCls}>
          <h3 className={clsx("font-bold mb-3", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>Application</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['Name', sysInfo.app.name],
              ['App ID', sysInfo.app.app_id],
              ['Version', sysInfo.app.version],
              ['Environment', sysInfo.app.environment],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <div className={labelCls}>{label}</div>
                <div className={clsx("font-medium text-sm", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-300" : "text-slate-700")}>{String(value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Results */}
      {tests.length > 0 && (
        <div className={cardCls}>
          <h3 className={clsx("font-bold mb-4", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>Diagnostic Results</h3>
          <div className="space-y-2">
            {tests.map((t, i) => (
              <div key={i} className={clsx("flex items-center justify-between p-3 rounded-lg", isHighContrast ? "border border-yellow-400/30" : isDark ? "bg-slate-700/30" : "bg-slate-50")} role="listitem">
                <div className="flex items-center gap-3">
                  {t.status === 'pass' ? <CheckCircle size={18} className="text-emerald-500" aria-label="Passed" /> : <XCircle size={18} className="text-red-500" aria-label="Failed" />}
                  <div>
                    <span className={clsx("font-medium text-sm", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-200" : "text-slate-800")}>{t.name}</span>
                    <p className={clsx("text-xs", subCls)}>{t.message}</p>
                  </div>
                </div>
                <span className={clsx("text-xs tabular-nums", subCls)}>{t.duration}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
