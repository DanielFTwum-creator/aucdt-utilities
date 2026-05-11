import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface TestRunnerProps {
  addLogEntry: (action: string) => void;
  onCaptureScreenshot: () => void;
  canCapture: boolean;
  onGenerateSample: () => void;
}

type TestResult = 'pass' | 'fail' | 'idle';

const TestRunner: React.FC<TestRunnerProps> = ({ addLogEntry, onCaptureScreenshot, canCapture, onGenerateSample }) => {
  const [selfTestResult, setSelfTestResult] = useState<TestResult>('idle');
  
  const handleGenerate = () => {
    addLogEntry('TestRunner: Triggered sample generation.');
    onGenerateSample();
  }

  const handleCapture = () => {
    if (canCapture) {
      addLogEntry('TestRunner: Triggered screenshot capture.');
      onCaptureScreenshot();
    }
  }
  
  const handleSelfTest = () => {
    addLogEntry('TestRunner: Started self-test.');
    // In a real app, process.env is a build-time substitution.
    // For this environment, we check for a placeholder value.
    // A more robust check might involve a lightweight API ping.
    if (process.env.API_KEY && process.env.API_KEY.length > 5) {
      setSelfTestResult('pass');
      addLogEntry('TestRunner: Self-test passed (API_KEY seems to be configured).');
    } else {
      setSelfTestResult('fail');
      addLogEntry('TestRunner: Self-test failed (API_KEY is missing or invalid).');
    }
  }

  return (
    <div className="text-gray-900 dark:text-white hc-text">
      <h2 className="text-2xl font-bold text-center mb-4">E2E Testing Control</h2>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8 hc-text">
        Use these controls to simulate user actions and run diagnostics.
      </p>
      
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-8 hc-border">
          <h3 className="text-lg font-semibold mb-3">System Self-Test</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 hc-text">Check for critical configurations like the API key.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSelfTest}
              className="px-5 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors hc-primary"
              title="Run a quick diagnostic check"
            >
              Run Self-Test
            </button>
            {selfTestResult === 'pass' && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle size={20} />
                <span className="font-semibold">Pass: API Key is configured.</span>
              </div>
            )}
            {selfTestResult === 'fail' && (
              <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
                <XCircle size={20} />
                <span className="font-semibold">Fail: API Key not found.</span>
              </div>
            )}
          </div>
      </div>
      
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hc-border">
        <h3 className="text-lg font-semibold mb-3">Flyer Actions</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleGenerate} 
            className="px-6 py-3 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors hc-primary"
            title="Start the flyer generation process using the default prompt"
          >
            Generate Sample Flyer
          </button>
          <button 
            onClick={handleCapture} 
            className="px-6 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canCapture}
            title="Download a screenshot of the currently displayed flyer"
          >
            Capture Flyer Screenshot
          </button>
        </div>
        {!canCapture && (
           <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 hc-text">
              A flyer must be generated before a screenshot can be captured.
           </p>
        )}
      </div>

    </div>
  );
};

export default TestRunner;