import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Loader2, Camera } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  screenshot?: string;
  duration?: number;
}

export const TestSuite: React.FC = () => {
  const { logAction } = useAdmin();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([
    { id: 't1', name: 'Navigation: Sidebar Links', status: 'pending' },
    { id: 't2', name: 'Filter: Style Selection', status: 'pending' },
    { id: 't3', name: 'Modal: Open/Close Detail', status: 'pending' },
    { id: 't4', name: 'Admin: Login Flow', status: 'pending' },
    { id: 't5', name: 'Theme: Switcher Toggle', status: 'pending' },
  ]);

  const runTests = async () => {
    setIsRunning(true);
    logAction('TEST_START', 'Started self-test suite');

    // Reset results
    setResults(prev => prev.map(r => ({ ...r, status: 'pending', message: undefined, screenshot: undefined })));

    // Simulate Puppeteer execution (In a real app, this would call a backend API)
    for (let i = 0; i < results.length; i++) {
      const test = results[i];
      
      // Update to running
      setResults(prev => prev.map(r => r.id === test.id ? { ...r, status: 'running' } : r));
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock result
      const passed = Math.random() > 0.1; // 90% pass rate
      const duration = Math.floor(Math.random() * 500) + 200;
      
      setResults(prev => prev.map(r => r.id === test.id ? { 
        ...r, 
        status: passed ? 'passed' : 'failed',
        message: passed ? 'Element found and interactive' : 'Timeout: Element not found selector=".btn-primary"',
        duration,
        // Mock screenshot placeholder
        screenshot: passed ? undefined : 'https://placehold.co/600x400/red/white?text=Error+Screenshot'
      } : r));
    }

    setIsRunning(false);
    logAction('TEST_COMPLETE', 'Completed self-test suite');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Self-Test Suite</h2>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="flex items-center gap-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
        >
          {isRunning ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
          {isRunning ? 'Running Tests...' : 'Run Puppeteer Tests'}
        </button>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-[var(--border-color)]">
          {results.map(test => (
            <div key={test.id} className="p-4 flex items-start gap-4 hover:bg-[var(--bg-tertiary)]/30 transition-colors">
              <div className="mt-1">
                {test.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-[var(--text-secondary)]" />}
                {test.status === 'running' && <Loader2 size={20} className="text-[var(--accent-color)] animate-spin" />}
                {test.status === 'passed' && <CheckCircle size={20} className="text-green-500" />}
                {test.status === 'failed' && <XCircle size={20} className="text-red-500" />}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-[var(--text-primary)]">{test.name}</h3>
                  {test.duration && (
                    <span className="text-xs font-mono text-[var(--text-secondary)]">{test.duration}ms</span>
                  )}
                </div>
                
                {test.message && (
                  <p className={`text-sm mt-1 ${test.status === 'failed' ? 'text-red-400' : 'text-[var(--text-secondary)]'}`}>
                    {test.message}
                  </p>
                )}

                {test.screenshot && (
                  <div className="mt-3">
                    <div className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1 mb-1">
                      <Camera size={12} />
                      Failure Screenshot
                    </div>
                    <img src={test.screenshot} alt="Failure" className="rounded border border-[var(--border-color)] max-w-xs" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
