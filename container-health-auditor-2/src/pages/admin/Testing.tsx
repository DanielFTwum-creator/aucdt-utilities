import React from 'react';
import { useTestStore } from '../../testStore';
import { Play, CheckCircle, XCircle, Loader2, Camera, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

export function Testing() {
  const { results, isRunning, runTest, runAllTests, resetTests } = useTestStore();

  const tests = [
    { id: 1, name: 'Unit: Metrics Collector', description: 'Validate metric parsing and normalization logic' },
    { id: 2, name: 'Unit: Health Scorer', description: 'Verify weighted scoring algorithm accuracy' },
    { id: 3, name: 'Integration: DB Persistence', description: 'Test write/read operations to SQLite' },
    { id: 4, name: 'Integration: API Endpoints', description: 'Verify REST API response codes and payloads' },
    { id: 5, name: 'E2E: Dashboard Load', description: 'Simulate user loading dashboard and rendering charts' },
    { id: 6, name: 'Security: Auth Validation', description: 'Test JWT token validation and role checks' },
    { id: 7, name: 'Integration: Sentinel Orchestrator', description: 'Verify health report generation and remediation action simulation' },
  ];

  const handleCaptureScreenshot = () => {
    alert('Screenshot capture simulated! In a real environment, this would use Puppeteer to save a PNG.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Test Suites</h2>
          <p className="text-slate-500">Automated testing and validation framework.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={resetTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={18} />
            Reset
          </button>
          <button 
            onClick={handleCaptureScreenshot}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
          >
            <Camera size={18} />
            Capture Evidence
          </button>
          <button 
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
            Run All Suites
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {tests.map((test) => {
            const result = results[test.id];
            const status = result?.status || 'pending';

            return (
              <div key={test.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-900">{test.name}</h3>
                    {result?.duration && (
                      <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-500 font-mono">
                        {result.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{test.description}</p>
                  {result?.error && (
                    <p className="text-xs text-red-600 mt-2 font-mono bg-red-50 p-2 rounded border border-red-100">
                      {result.error}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  {status === 'running' ? (
                    <span className="flex items-center gap-2 text-blue-600 font-medium">
                      <Loader2 size={20} className="animate-spin" />
                      Running...
                    </span>
                  ) : status === 'pass' ? (
                    <span className="flex items-center gap-2 text-emerald-600 font-medium">
                      <CheckCircle size={20} />
                      Passed
                    </span>
                  ) : status === 'fail' ? (
                    <span className="flex items-center gap-2 text-red-600 font-medium">
                      <XCircle size={20} />
                      Failed
                    </span>
                  ) : (
                    <span className="text-slate-400 text-sm">Pending</span>
                  )}

                  <button 
                    onClick={() => runTest(test.id)}
                    disabled={isRunning || status === 'running'}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Play size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
