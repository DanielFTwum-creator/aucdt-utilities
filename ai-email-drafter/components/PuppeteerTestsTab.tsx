import React, { useState, useEffect } from 'react';
import { TestResult } from '../types';
import { CheckCircleIcon, XCircleIcon, ClockIcon, CameraIcon, PlayCircleIcon } from './icons';

const testSuite: Omit<TestResult, 'status' | 'duration' | 'screenshot' | 'error'>[] = [
  { id: 1, description: 'Renders the main application view' },
  { id: 2, description: 'Allows typing in the "To" recipient field' },
  { id: 3, description: 'Allows typing in the "Subject" field' },
  { id: 4, description: 'Shows an error when generating draft without a recipient' },
  { id: 5, description: 'Successfully attaches an image file' },
  { id: 6, description: 'Generates a draft successfully with valid inputs' },
];

const FAILED_SCREENSHOT_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAIAAAA7i8FlAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGESURBVHhe7dFBDQAgEACxV/03BjqYVCIQx85s5857AAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEARgishkY87AAAAAElFTkSuQmCC';

export const PuppeteerTestsTab: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    // Set initial state for all tests to 'pending'
    const initialResults = testSuite.map(test => ({ ...test, status: 'pending' as const }));
    setResults(initialResults);
  }, []);

  const runTests = async () => {
    setIsTesting(true);
    const startTime = Date.now();
    
    // Reset status to pending before running
    const pendingResults = testSuite.map(test => ({ ...test, status: 'pending' as const }));
    setResults(pendingResults);

    for (const test of testSuite) {
      // Set current test to 'running'
      setResults(prev => prev.map(r => r.id === test.id ? { ...r, status: 'running' } : r));
      
      const testStartTime = Date.now();
      await new Promise(res => setTimeout(res, 700 + Math.random() * 800)); // Simulate test duration
      const duration = Date.now() - testStartTime;

      // This is a simulation. In a real scenario, Puppeteer would return pass/fail.
      // We'll deliberately fail one test to demonstrate the UI.
      const didPass = test.id !== 4; 

      const finalResult: TestResult = {
        ...test,
        status: didPass ? 'passed' : 'failed',
        duration,
        error: didPass ? undefined : 'AssertionError: Expected alert not found for empty recipient.',
        screenshot: didPass ? undefined : FAILED_SCREENSHOT_PLACEHOLDER,
      };

      setResults(prev => prev.map(r => r.id === test.id ? finalResult : r));
    }

    setIsTesting(false);
    setTotalTime(Date.now() - startTime);
  };
  
  const passedCount = results.filter(r => r.status === 'passed').length;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Puppeteer E2E Test Suite</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
                Simulating critical user journeys to ensure application stability.
            </p>
        </div>
        <button
            onClick={runTests}
            disabled={isTesting}
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 dark:disabled:bg-green-800 disabled:cursor-not-allowed"
        >
          {isTesting ? (
             <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running...
             </>
          ) : (
            <>
                <PlayCircleIcon className="w-5 h-5" />
                Run All Tests
            </>
          )}
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6">
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tests</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{testSuite.length}</dd>
            </div>
            <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Passed</dt>
                <dd className={`mt-1 text-2xl font-semibold ${passedCount > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>{passedCount}</dd>
            </div>
            <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Failed</dt>
                <dd className={`mt-1 text-2xl font-semibold ${testSuite.length - passedCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{isTesting || totalTime === 0 ? 0 : testSuite.length - passedCount}</dd>
            </div>
            <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Time</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{isTesting || totalTime === 0 ? `—` : `${(totalTime / 1000).toFixed(2)}s`}</dd>
            </div>
        </dl>
      </div>

      <div className="space-y-3">
        {results.map(result => (
          <div key={result.id} className="bg-gray-50 dark:bg-gray-800/80 rounded-lg p-4 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div>
                {result.status === 'passed' && <CheckCircleIcon className="w-6 h-6 text-green-500" />}
                {result.status === 'failed' && <XCircleIcon className="w-6 h-6 text-red-500" />}
                {result.status === 'running' && <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {result.status === 'pending' && <div className="w-6 h-6 flex items-center justify-center"><div className="w-2.5 h-2.5 bg-gray-400 dark:bg-gray-600 rounded-full"></div></div>}
              </div>
              <p className="flex-grow text-gray-800 dark:text-gray-200">{result.description}</p>
              {result.duration && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon className="w-4 h-4" />
                  <span>{result.duration}ms</span>
                </div>
              )}
            </div>
            {result.status === 'failed' && (
              <div className="mt-4 pl-10 border-l-2 border-red-500/30 ml-3">
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">Failure Details:</p>
                <pre className="mt-1 text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/50 p-3 rounded-md overflow-x-auto">
                  <code>{result.error}</code>
                </pre>
                <div className="mt-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2"><CameraIcon className="w-4 h-4"/>Screenshot:</p>
                    <img src={result.screenshot} alt={`Screenshot for failed test: ${result.description}`} className="border-2 border-red-300 dark:border-red-700 rounded-md max-w-full h-auto" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
