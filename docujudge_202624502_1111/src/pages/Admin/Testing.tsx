import { useState } from 'react';
import { testRunner, TestResult } from '@/services/testRunner';
import { Play, CheckCircle, XCircle } from 'lucide-react';

export default function Testing() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    const res = await testRunner.runAll();
    setResults(res);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">System Testing Suite</h2>
        <button
          onClick={runTests}
          disabled={isRunning}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
            isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Play size={18} />
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </button>
      </div>

      <div className="grid gap-4">
        {results.length > 0 && results.map((result) => (
          <div 
            key={result.testId} 
            className={`bg-white dark:bg-gray-800 p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 ${
              result.passed ? 'border-green-200 dark:border-green-900' : 'border-red-200 dark:border-red-900'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {result.passed ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-red-500" size={20} />
                )}
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{result.testId}</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Executed at: {new Date(result.timestamp).toLocaleTimeString()}
              </p>
            </div>
            
            {result.screenshot && (
              <div className="md:w-48">
                <p className="text-xs text-gray-400 mb-1">Screenshot Capture:</p>
                <img 
                  src={result.screenshot} 
                  alt="Test Screenshot" 
                  className="w-full h-auto rounded border border-gray-200 dark:border-gray-700"
                />
              </div>
            )}
          </div>
        ))}

        {results.length === 0 && !isRunning && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            Click "Run All Tests" to execute the synthetic test suite.
          </div>
        )}
      </div>
    </div>
  );
}
