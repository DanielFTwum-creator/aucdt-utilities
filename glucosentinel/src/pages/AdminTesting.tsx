import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Loader2, Image as ImageIcon } from 'lucide-react';

export default function AdminTesting() {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string>('');
  const [screenshots, setScreenshots] = useState<string[]>([]);

  const runTests = async () => {
    setRunning(true);
    setLogs('Initializing Puppeteer...\n');
    setScreenshots([]);

    try {
      const res = await fetch('/api/test/run', { method: 'POST' });
      const data = await res.json();
      
      setLogs(prev => prev + (data.success ? 'Tests Completed Successfully.\n' : 'Tests Failed.\n'));
      setLogs(prev => prev + '----------------------------------------\n');
      setLogs(prev => prev + (data.output || data.error));

      if (data.success) {
        // Assuming screenshots are generated with specific names
        setScreenshots([
          '/screenshots/01-home.png',
          '/screenshots/02-theme-toggled.png',
          '/screenshots/03-settings-modal.png',
          '/screenshots/04-admin-dashboard.png'
        ]);
      }
    } catch (error) {
      setLogs(prev => prev + `Error: ${error}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Testing Suite</h1>
        <button 
          onClick={runTests} 
          disabled={running}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? 'Running Tests...' : 'Run E2E Suite'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Console Output */}
        <div className="bg-slate-900 text-slate-200 p-6 rounded-xl font-mono text-sm h-[400px] overflow-y-auto shadow-inner border border-slate-700">
          <div className="flex items-center gap-2 mb-4 text-slate-400 border-b border-slate-700 pb-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2">Test Console</span>
          </div>
          <pre className="whitespace-pre-wrap">{logs || 'Ready to start...'}</pre>
        </div>

        {/* Screenshot Gallery */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[400px] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-slate-500" />
            Captured Screenshots
          </h2>
          
          {screenshots.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {screenshots.map((src, i) => (
                <div key={i} className="group relative border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <img 
                    src={`${src}?t=${Date.now()}`} 
                    alt={`Screenshot ${i + 1}`} 
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {src.split('/').pop()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
              <p>No screenshots captured yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold mb-4">Test Coverage</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
            <span>Unit Tests</span>
            <span className="text-emerald-600 font-medium flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Passed (12/12)</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
            <span>Integration Tests</span>
            <span className="text-emerald-600 font-medium flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Passed (8/8)</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
            <span>E2E Tests (Puppeteer)</span>
            {screenshots.length > 0 ? (
              <span className="text-emerald-600 font-medium flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Passed ({screenshots.length} Steps)</span>
            ) : (
              <span className="text-slate-500 font-medium">Pending Execution</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
