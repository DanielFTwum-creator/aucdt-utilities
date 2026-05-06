import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Camera, Loader2, Clock } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail';
  message?: string;
  screenshot?: string;
}

export default function TestingSuite() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setError(null);

    try {
      const response = await fetch('/api/admin/run-tests', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to execute tests');
      }

      const data = await response.json();
      setResults(data.results);
      setLastRun(new Date().toLocaleTimeString());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">System Testing Suite</h1>
          <p className="text-text-muted font-body">Automated Puppeteer tests for critical workflows</p>
        </div>
        <div className="flex items-center gap-4">
          {lastRun && (
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Clock size={16} />
              <span>Last run: {lastRun}</span>
            </div>
          )}
          <button
            onClick={runTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-medium shadow-sm"
          >
            {isRunning ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
            {isRunning ? 'Running Tests...' : 'Run Test Suite'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <XCircle size={20} />
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="grid gap-6">
          {/* Summary Card */}
          <div className="bg-bg-card rounded-xl p-4 border border-border-color flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="font-medium text-text-primary">{passCount} Passed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="font-medium text-text-primary">{failCount} Failed</span>
            </div>
          </div>

          {results.map((result, index) => (
            <div 
              key={index} 
              className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                result.status === 'pass' 
                  ? 'border-green-200/50 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800' 
                  : 'border-red-200/50 bg-red-50/50 dark:bg-red-900/10 dark:border-red-800'
              }`}
            >
              <div className="p-4 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {result.status === 'pass' ? (
                    <CheckCircle className="text-green-600 dark:text-green-400 shrink-0" size={24} />
                  ) : (
                    <XCircle className="text-red-600 dark:text-red-400 shrink-0" size={24} />
                  )}
                  <div>
                    <h3 className={`font-semibold font-display text-lg ${
                      result.status === 'pass' ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
                    }`}>
                      {result.name}
                    </h3>
                    {result.message && (
                      <p className="text-sm mt-1 text-red-700 dark:text-red-300 font-mono bg-red-100/50 dark:bg-red-900/30 p-2 rounded">
                        {result.message}
                      </p>
                    )}
                  </div>
                </div>
                {result.screenshot && (
                  <div className="flex items-center gap-1 text-xs font-medium text-text-muted bg-black/5 dark:bg-white/10 px-2 py-1 rounded">
                    <Camera size={14} />
                    Screenshot
                  </div>
                )}
              </div>
              
              {result.screenshot && (
                <div className="border-t border-border-color bg-black/5 dark:bg-black/40 p-4">
                  <img 
                    src={`data:image/png;base64,${result.screenshot}`} 
                    alt={`Screenshot for ${result.name}`}
                    className="rounded-lg shadow-lg max-w-full h-auto mx-auto border border-border-color"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {!isRunning && results.length === 0 && !error && (
        <div className="text-center py-16 bg-bg-card rounded-xl border border-dashed border-border-color">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="text-brand-primary" size={32} />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-1">Ready to Test</h3>
          <p className="text-text-muted">Click "Run Test Suite" to verify system integrity</p>
        </div>
      )}
    </div>
  );
}
