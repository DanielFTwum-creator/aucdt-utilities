import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Shield, CheckCircle, AlertTriangle, Terminal, Activity } from 'lucide-react';

export function SentinelConsole() {
  const [report, setReport] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const fetchReport = async () => {
    try {
      const res = await axios.get('/api/v1/sentinel/health-report');
      setReport(res.data);
      addLog('Fetched health report from CHA-110');
    } catch (err) {
      addLog('Error fetching health report');
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const simulateRemediation = async () => {
    addLog('Initiating autonomous remediation sequence...');
    try {
      await axios.post('/api/v1/sentinel/remediation', {
        alert_id: 1,
        action_taken: 'SCALE_HORIZONTAL',
        details: 'Scaled deployment from 3 to 5 replicas'
      });
      addLog('Remediation action executed: SCALE_HORIZONTAL');
      addLog('Alert #1 status updated to IN_PROGRESS');
    } catch (err) {
      addLog('Remediation execution failed');
    }
  };

  useEffect(() => {
    fetchReport();
    const interval = setInterval(fetchReport, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="text-blue-600" />
            Sentinel Interface
          </h2>
          <p className="text-slate-500">Direct link to The Sentinel AI Orchestrator.</p>
        </div>
        <button 
          onClick={simulateRemediation}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2"
        >
          <Activity size={18} />
          Simulate Remediation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Report View */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Latest Health Report</h3>
          {report ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Overall Score</span>
                <span className="font-bold text-emerald-600 text-xl">{report.ecosystem_health.overall_score}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Unhealthy Containers</p>
                  <p className="font-bold text-red-600 text-xl">{report.ecosystem_health.unhealthy_containers}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Active Alerts</p>
                  <p className="font-bold text-yellow-600 text-xl">{report.active_alerts.length}</p>
                </div>
              </div>
              <div className="bg-slate-900 text-slate-300 p-4 rounded-lg font-mono text-xs overflow-auto max-h-64">
                <pre>{JSON.stringify(report, null, 2)}</pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">Loading report...</div>
          )}
        </div>

        {/* Sentinel Logs */}
        <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Terminal size={20} />
            Orchestrator Logs
          </h3>
          <div className="flex-1 font-mono text-sm space-y-2 overflow-y-auto max-h-[500px]">
            {logs.map((log, i) => (
              <div key={i} className="text-emerald-400 border-l-2 border-emerald-800 pl-3 py-1">
                {log}
              </div>
            ))}
            {logs.length === 0 && <div className="text-slate-600 italic">Waiting for events...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
