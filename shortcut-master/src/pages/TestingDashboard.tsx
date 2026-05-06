import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, Loader2, Camera, ShieldAlert } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface TestResult {
  name: string;
  status: 'passed' | 'failed';
  detail: string;
}

export default function TestingDashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addLog } = useAdmin();

  const runTest = async (testId: string) => {
    setIsRunning(true);
    setResults([]);
    setScreenshot(null);
    setError(null);
    
    try {
      const response = await fetch('/api/tests/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
        setScreenshot(data.screenshot);
        addLog('Self-Test Run', `Executed ${testId} test suite. Results: ${data.results.length} checks.`);
      } else {
        setError(data.error || 'Test execution failed.');
        addLog('Self-Test Failed', `Test suite ${testId} failed: ${data.error}`);
      }
    } catch (err: any) {
      setError(err.message);
      addLog('Self-Test Error', `Network error during test execution: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Puppeteer Self-Test</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Run automated browser tests to verify critical user journeys.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => runTest('critical-path')}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all font-bold shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              Run Critical Path
            </button>
            <button
              onClick={() => runTest('admin-auth')}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 disabled:opacity-50 transition-all font-bold"
            >
              {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldAlert className="w-5 h-5" />}
              Test Admin Auth
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 mb-8 flex items-center gap-3">
            <XCircle className="w-6 h-6" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Results List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-500" />
              Test Results
            </h3>
            {results.length === 0 && !isRunning && !error && (
              <div className="py-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl text-slate-400">
                <p>No tests run yet. Click a button above to start.</p>
              </div>
            )}
            {isRunning && (
              <div className="py-12 text-center space-y-4">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
                <p className="text-slate-500 animate-pulse">Launching headless browser...</p>
              </div>
            )}
            <div className="space-y-3">
              {results.map((res, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                  {res.status === 'passed' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{res.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{res.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Screenshot Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-500" />
              Visual Confirmation
            </h3>
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center relative">
              {screenshot ? (
                <img src={screenshot} alt="Test Screenshot" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-8">
                  <Camera className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Screenshot will appear here after test completion.</p>
                </div>
              )}
              {isRunning && (
                <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Capturing Viewport</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
