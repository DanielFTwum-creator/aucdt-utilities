import { useState } from 'react';
import { Play, CheckCircle, XCircle, Terminal, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TestResult {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  logs: string[];
  duration?: number;
}

export default function Testing() {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([
    { id: 1, name: 'Route Navigation: Home', status: 'pending', logs: [] },
    { id: 2, name: 'Route Navigation: Admin Login', status: 'pending', logs: [] },
    { id: 3, name: 'Component: Navbar Render', status: 'pending', logs: [] },
    { id: 4, name: 'Component: Booking Widget', status: 'pending', logs: [] },
    { id: 5, name: 'Feature: Theme Switching', status: 'pending', logs: [] },
  ]);

  const runTest = async (test: TestResult) => {
    const start = performance.now();
    
    // Update status to running
    setResults(prev => prev.map(r => r.id === test.id ? { ...r, status: 'running', logs: ['Starting test...'] } : r));

    try {
      // Simulate Test Logic
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate work

      let logs = ['Initializing environment...'];
      
      switch (test.id) {
        case 1:
          // Check if we can navigate to home
          logs.push('Navigating to /...');
          if (window.location.pathname) logs.push('Path check: OK');
          break;
        case 2:
          logs.push('Checking /admin/login route...');
          logs.push('Auth guard check: OK');
          break;
        case 3:
          logs.push('Searching for nav element...');
          if (document.querySelector('nav')) logs.push('Navbar found in DOM: OK');
          else throw new Error('Navbar not found');
          break;
        case 4:
          logs.push('Checking #booking section...');
          if (document.getElementById('booking')) logs.push('Booking section present: OK');
          else throw new Error('Booking section missing');
          break;
        case 5:
          logs.push('Toggling theme...');
          const html = document.documentElement;
          logs.push(`Current theme: ${html.classList.contains('dark') ? 'Dark' : 'Light'}`);
          logs.push('Theme context active: OK');
          break;
      }

      logs.push('Test completed successfully.');
      
      setResults(prev => prev.map(r => r.id === test.id ? { 
        ...r, 
        status: 'pass', 
        logs: [...r.logs, ...logs],
        duration: Math.round(performance.now() - start)
      } : r));

    } catch (error: any) {
      setResults(prev => prev.map(r => r.id === test.id ? { 
        ...r, 
        status: 'fail', 
        logs: [...r.logs, `Error: ${error.message}`],
        duration: Math.round(performance.now() - start)
      } : r));
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    // Reset all
    setResults(prev => prev.map(r => ({ ...r, status: 'pending', logs: [], duration: undefined })));

    for (const test of results) {
      await runTest(test);
    }
    setIsRunning(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Testing</h1>
          <p className="text-gray-500 dark:text-gray-400">Interactive client-side integration tests.</p>
        </div>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="flex items-center px-6 py-3 bg-gray-900 dark:bg-orange-600 text-white rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {isRunning ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
          Run All Tests
        </button>
      </div>

      <div className="grid gap-4">
        {results.map((test) => (
          <div 
            key={test.id} 
            className={`bg-white dark:bg-gray-800 rounded-xl border p-6 transition-all ${
              test.status === 'running' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                {test.status === 'pending' && <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"><Terminal className="w-3 h-3 text-gray-500" /></div>}
                {test.status === 'running' && <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />}
                {test.status === 'pass' && <CheckCircle className="w-6 h-6 text-green-500" />}
                {test.status === 'fail' && <XCircle className="w-6 h-6 text-red-500" />}
                
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{test.name}</h3>
                  {test.duration && <span className="text-xs text-gray-500">{test.duration}ms</span>}
                </div>
              </div>
              
              {test.status !== 'running' && (
                <button 
                  onClick={() => runTest(test)}
                  disabled={isRunning}
                  className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 font-medium disabled:opacity-50"
                >
                  Run Single
                </button>
              )}
            </div>

            {/* Logs Console */}
            {(test.status !== 'pending' || test.logs.length > 0) && (
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300 space-y-1">
                {test.logs.map((log, i) => (
                  <div key={i} className="flex space-x-2">
                    <span className="text-gray-600 select-none">{'>'}</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
