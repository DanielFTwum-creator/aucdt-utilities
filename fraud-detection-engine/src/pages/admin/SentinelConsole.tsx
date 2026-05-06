import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Shield, Terminal, Activity } from 'lucide-react';
import { useThemeStore } from '../../themeStore';
import { clsx } from 'clsx';

export function SentinelConsole() {
  const { isDark, isHighContrast } = useThemeStore();
  const [report, setReport] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const cardCls = clsx("p-6 rounded-xl border transition-colors",
    isHighContrast ? "bg-black border-yellow-400" : isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-100 shadow-sm"
  );
  const headCls = clsx("text-2xl font-bold flex items-center gap-2", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900");
  const subCls = clsx("text-sm", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-400" : "text-slate-500");

  const fetchReport = async () => {
    try {
      const res = await axios.get('/api/v1/sentinel/health-report');
      setReport(res.data);
      addLog('Fetched health report from App 137');
    } catch (err) {
      addLog('Error fetching health report');
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const simulateRemediation = async () => {
    setIsSimulating(true);
    addLog('Initiating autonomous remediation sequence...');
    try {
      await axios.post('/api/v1/sentinel/remediation', {
        action_taken: 'AUTO_SCALE',
        details: 'Automated remediation executed'
      });
      addLog('Remediation action executed: AUTO_SCALE');
    } catch (err) {
      addLog('Remediation execution failed');
    }
    setIsSimulating(false);
  };

  useEffect(() => {
    fetchReport();
    const interval = setInterval(fetchReport, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6" role="region" aria-label="Sentinel Console">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={headCls}>
            <Shield className={isHighContrast ? "text-yellow-400" : "text-blue-600"} aria-hidden="true" />
            Sentinel Interface
          </h2>
          <p className={subCls}>Direct link to The Sentinel AI Orchestrator</p>
        </div>
        <button
          onClick={simulateRemediation}
          disabled={isSimulating}
          aria-label="Simulate Remediation"
          className={clsx(
            "px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors focus:outline-none focus:ring-2",
            isHighContrast ? "bg-yellow-400 text-black hover:bg-yellow-300 focus:ring-yellow-400"
              : "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
            isSimulating && "opacity-60 cursor-not-allowed"
          )}
        >
          <Activity size={18} aria-hidden="true" />
          {isSimulating ? 'Executing...' : 'Simulate Remediation'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cardCls}>
          <h3 className={clsx("text-lg font-bold mb-4", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>Latest Health Report</h3>
          {report ? (
            <div className={clsx("p-4 rounded-lg font-mono text-xs overflow-auto max-h-[500px]", isHighContrast ? "bg-black text-yellow-300 border border-yellow-400/30" : "bg-slate-900 text-slate-300")}>
              <pre>{JSON.stringify(report, null, 2)}</pre>
            </div>
          ) : (
            <div className={clsx("text-center py-12", subCls)}>Loading report...</div>
          )}
        </div>

        <div className={clsx(cardCls, isHighContrast ? "bg-black border-yellow-400" : "bg-slate-900 border-slate-800")}>
          <h3 className={clsx("text-lg font-bold mb-4 flex items-center gap-2", isHighContrast ? "text-yellow-400" : "text-white")}>
            <Terminal size={20} aria-hidden="true" />
            Orchestrator Logs
          </h3>
          <div className="font-mono text-sm space-y-2 overflow-y-auto max-h-[500px]" role="log" aria-live="polite">
            {logs.map((log, i) => (
              <div key={i} className={clsx("border-l-2 pl-3 py-1", isHighContrast ? "text-yellow-300 border-yellow-600" : "text-emerald-400 border-emerald-800")}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
