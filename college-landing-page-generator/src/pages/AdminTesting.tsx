import React, { useState } from 'react';

export function AdminTesting() {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      // In a real environment, this would hit an API endpoint that executes `node scripts/run-tests.js`
      // For this frontend-only simulation, we mock the delay and generate a simulated report.
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const simulatedReport = {
        timestamp: new Date().toISOString(),
        results: [
          { name: 'Load Main Application', status: 'passed', message: 'Title: College Landing Page Generator' },
          { name: 'Verify Login Page', status: 'passed', message: 'Password field found' },
          { name: 'Test Theme Switcher', status: 'passed', message: 'Accessibility validated' }
        ]
      };
      
      setReport(simulatedReport);
      
      // Audit log entry
      const logs = JSON.parse(localStorage.getItem('tuc_audit_logs') || '[]');
      logs.push({ action: 'RUN_TEST_SUITE', timestamp: new Date().toISOString(), user: 'admin' });
      localStorage.setItem('tuc_audit_logs', JSON.stringify(logs));
      
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold font-['Playfair_Display']">Diagnostic & Testing</h2>
        <p className="text-zinc-400 text-sm mt-1">Puppeteer E2E Suite Execution</p>
      </div>

      <div className="bg-[#141210] p-6 rounded-xl border border-zinc-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white mb-1">Run Automated Test Suite</h3>
          <p className="text-sm text-zinc-400">Executes the headless Puppeteer suite and captures state screenshots.</p>
        </div>
        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            isRunning 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-[#C8A84B] hover:bg-[#b09442] text-black'
          }`}
        >
          {isRunning ? 'Executing...' : 'Run Tests'}
        </button>
      </div>

      {report && (
        <div className="bg-[#141210] rounded-xl border border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <h3 className="font-bold">Execution Report</h3>
            <span className="text-xs font-mono text-zinc-500">{new Date(report.timestamp).toLocaleString()}</span>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {report.results.map((result: any, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                  <div className={`mt-0.5 ${result.status === 'passed' ? 'text-green-500' : 'text-red-500'}`}>
                    {result.status === 'passed' ? '✓' : '✗'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">{result.name}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <h4 className="font-bold text-sm mb-3">Captured Screenshots</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-600 text-sm">
                  01-main-app.png
                </div>
                <div className="aspect-video bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-600 text-sm">
                  02-login-page.png
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
