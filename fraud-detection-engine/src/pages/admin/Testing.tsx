import React, { useState } from 'react';
import axios from 'axios';
import { useThemeStore } from '../../themeStore';
import { Bug, Play, CheckCircle, XCircle, Loader2, Save } from 'lucide-react';
import { clsx } from 'clsx';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  duration: number;
  message: string;
}

export function Testing() {
  const { isDark, isHighContrast } = useThemeStore();
  const [running, setRunning] = useState(false);
  const [runningE2E, setRunningE2E] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [e2eResults, setE2eResults] = useState<any>(null);
  const [summary, setSummary] = useState<{ total: number; passed: number; failed: number } | null>(null);

  const cardCls = clsx("p-5 rounded-xl border transition-colors",
    isHighContrast ? "bg-black border-yellow-400" : isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-100 shadow-sm"
  );
  const headCls = clsx("text-2xl font-bold", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900");
  const subCls = clsx("text-sm", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-400" : "text-slate-500");

  const runTests = async () => {
    setRunning(true);
    setResults([]);
    setSummary(null);
    try {
      const res = await axios.post('/api/v1/admin/run-diagnostics');
      setResults(res.data.results);
      setSummary(res.data.summary);
    } catch {
      setResults([{ name: 'Diagnostics API', status: 'fail', duration: 0, message: 'Failed to reach API endpoint' }]);
      setSummary({ total: 1, passed: 0, failed: 1 });
    }
    setRunning(false);
  };

  const runE2E = async () => {
    setRunningE2E(true);
    setE2eResults(null);
    try {
      const res = await axios.post('/api/v1/admin/run-e2e');
      setE2eResults(res.data);
    } catch {
      setE2eResults({ success: false, stderr: 'Failed to run E2E endpoint' });
    }
    setRunningE2E(false);
  };

  return (
    <div className="space-y-8" role="region" aria-label="System Testing">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={headCls}><Bug className="inline mr-2" size={24} aria-hidden="true" />Testing Suite</h2>
          <p className={subCls}>End-to-end and component diagnostics</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runTests}
            disabled={running || runningE2E}
            aria-label="Run backend diagnostics"
            title="Run diagnostics"
            className={clsx("px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors focus:outline-none focus:ring-2",
              isHighContrast ? "bg-yellow-400 text-black hover:bg-yellow-300 focus:ring-yellow-400"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
              (running || runningE2E) && "opacity-60 cursor-not-allowed"
            )}
          >
            {running ? <Loader2 className="animate-spin" size={16} /> : <Bug size={16} />}
            {running ? 'Executing...' : 'Run Diagnostics'}
          </button>
          <button
            onClick={runE2E}
            disabled={running || runningE2E}
            aria-label="Run E2E UI Tests"
            title="Run E2E UI Tests"
            className={clsx("px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors focus:outline-none focus:ring-2",
              isHighContrast ? "bg-yellow-400 text-black hover:bg-yellow-300 focus:ring-yellow-400"
                : "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
              (running || runningE2E) && "opacity-60 cursor-not-allowed"
            )}
          >
            {runningE2E ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
            {runningE2E ? 'Running Playwright...' : 'Run E2E Suite'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className={cardCls}>
            <h3 className={clsx("font-bold mb-4", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>Test Results</h3>
            
            {results.length === 0 && !running && (
              <div className="text-center py-12">
                <Play className={clsx("mx-auto mb-3", isHighContrast ? "text-yellow-600" : "text-slate-300")} size={40} aria-hidden="true" />
                <p className={clsx("font-medium", isHighContrast ? "text-yellow-400" : isDark ? "text-slate-300" : "text-slate-600")}>No tests run yet</p>
                <p className={subCls}>Click 'Run Test Suite' to begin diagnostics</p>
              </div>
            )}

            {running && (
              <div className="text-center py-12">
                <Loader2 className={clsx("mx-auto mb-3 animate-spin", isHighContrast ? "text-yellow-400" : "text-blue-500")} size={40} aria-hidden="true" />
                <p className={clsx("font-medium", isHighContrast ? "text-yellow-400" : isDark ? "text-slate-300" : "text-slate-600")}>Executing test suite...</p>
                <p className={subCls}>This may take a few moments</p>
              </div>
            )}

            {!running && results.length > 0 && (
              <div className="space-y-2" role="list" aria-label="Test result items">
                {results.map((r, i) => (
                  <div key={i} className={clsx("flex items-start gap-3 p-3 rounded-lg", isHighContrast ? "border border-yellow-400/30" : isDark ? "bg-slate-700/30" : "bg-slate-50")} role="listitem">
                    <div className="mt-0.5">
                      {r.status === 'pass' ? <CheckCircle size={18} className="text-emerald-500" aria-hidden="true" /> 
                        : <XCircle size={18} className="text-red-500" aria-hidden="true" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className={clsx("font-medium text-sm", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-200" : "text-slate-800")}>{r.name}</span>
                        <span className={clsx("text-xs tabular-nums", subCls)}>{r.duration}ms</span>
                      </div>
                      <p className={clsx("text-xs mt-1 font-mono", r.status === 'fail' ? "text-red-400" : subCls)}>{r.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* E2E Results */}
          <div className={cardCls}>
            <h3 className={clsx("font-bold mb-4", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>Playwright E2E Results</h3>
            
            {runningE2E && (
              <div className="text-center py-12">
                <Loader2 className={clsx("mx-auto mb-3 animate-spin", isHighContrast ? "text-yellow-400" : "text-purple-500")} size={40} aria-hidden="true" />
                <p className={clsx("font-medium", isHighContrast ? "text-yellow-400" : isDark ? "text-slate-300" : "text-slate-600")}>Running UI Tests...</p>
                <p className={subCls}>This executes a real browser in the background.</p>
              </div>
            )}

            {!runningE2E && e2eResults && (
              <div className="space-y-4">
                <div className={clsx("p-4 rounded-lg flex items-center justify-between border", e2eResults.success ? "border-emerald-500/30 bg-emerald-500/10" : "border-red-500/30 bg-red-500/10")}>
                  <div className="flex items-center gap-2">
                    {e2eResults.success ? <CheckCircle className="text-emerald-500" /> : <XCircle className="text-red-500" />}
                    <span className={clsx("font-bold", e2eResults.success ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                      {e2eResults.success ? "Suite Passed" : "Suite Failed"}
                    </span>
                  </div>
                  {e2eResults.results?.stats && (
                    <span className={subCls}>
                      {e2eResults.results.stats.expected} passed, {e2eResults.results.stats.unexpected} failed
                    </span>
                  )}
                </div>
                
                {e2eResults.stdout && (
                  <div className="bg-slate-900 text-slate-300 p-4 rounded-lg font-mono text-xs overflow-auto max-h-[400px]">
                    <pre>{e2eResults.stdout}</pre>
                  </div>
                )}
              </div>
            )}

            {!runningE2E && !e2eResults && (
              <div className="text-center py-8">
                <p className={subCls}>Click 'Run E2E Suite' to execute Playwright tests</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className={cardCls}>
            <h3 className={clsx("font-bold mb-4", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>Summary</h3>
            {summary ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={subCls}>Total Tests</span>
                  <span className={clsx("font-bold text-lg", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>{summary.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={subCls}>Passed</span>
                  <span className="font-bold text-lg text-emerald-500">{summary.passed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={subCls}>Failed</span>
                  <span className={clsx("font-bold text-lg", summary.failed > 0 ? "text-red-500" : isDark ? "text-white" : "text-slate-900")}>{summary.failed}</span>
                </div>
                
                <div className={clsx("mt-4 p-3 rounded-lg text-sm font-medium text-center",
                  summary.failed === 0 
                    ? isHighContrast ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400" : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : isHighContrast ? "bg-red-900 text-white border border-red-500" : "bg-red-100 text-red-700 border border-red-200"
                )}>
                  {summary.failed === 0 ? 'All Systems Go' : 'System Needs Attention'}
                </div>
              </div>
            ) : (
              <div className={clsx("text-sm text-center py-6", subCls)}>Run tests to see summary</div>
            )}
          </div>

          <div className={cardCls}>
            <h3 className={clsx("font-bold mb-2 flex items-center gap-2", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>
              <Save size={16} aria-hidden="true" /> Export Report
            </h3>
            <p className={clsx("text-xs mb-4", subCls)}>Download diagnostic results for compliance auditing.</p>
            <button 
              disabled={!summary}
              className={clsx("w-full py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2",
                !summary ? "opacity-50 cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                  : isHighContrast ? "bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/40 border border-yellow-400 focus:ring-yellow-400"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 focus:ring-slate-400"
              )}
            >
              Download PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
