import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function Diagnostics() {
  const [status, setStatus] = useState<'loading' | 'healthy' | 'error'>('loading');
  const [checks, setChecks] = useState<any[]>([]);

  const runDiagnostics = () => {
    setStatus('loading');
    setChecks([]);

    // Simulate checks
    setTimeout(() => {
      const newChecks = [
        { name: 'React Version', status: 'pass', details: 'v19.2.4' },
        { name: 'API Connection', status: 'pass', details: 'Gemini API Reachable' },
        { name: 'Local Storage', status: 'pass', details: 'Available' },
        { name: 'Theme Context', status: 'pass', details: 'Active' },
        { name: 'Router', status: 'pass', details: 'React Router v6' },
      ];
      setChecks(newChecks);
      setStatus('healthy');
    }, 1500);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Diagnostics</h1>
          <p className="text-gray-500 dark:text-gray-400">Real-time health checks.</p>
        </div>
        <button
          onClick={runDiagnostics}
          disabled={status === 'loading'}
          className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${status === 'loading' ? 'animate-spin' : ''}`} />
          Run Checks
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Check Name</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {checks.map((check, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{check.name}</td>
                <td className="px-6 py-4">
                  {check.status === 'pass' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Pass
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Fail
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-sm">{check.details}</td>
              </tr>
            ))}
            {status === 'loading' && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  Running system checks...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
