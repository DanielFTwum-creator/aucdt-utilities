import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { TestResults } from './TestResults';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  screenshot?: string;
  error?: string;
  steps?: Array<{
    description: string;
    status: 'passed' | 'failed';
    timestamp: number;
  }>;
}

interface TestSuiteResult {
  suiteName: string;
  tests: TestResult[];
  totalPassed: number;
  totalFailed: number;
  totalSkipped: number;
  totalDuration: number;
}

interface TestResponse {
  success: boolean;
  results: TestSuiteResult[];
  timestamp: string;
  error?: string;
}

export function TestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestSuiteResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post<TestResponse>(
        '/api/tests/run',
        {},
        { timeout: 60000 }
      );

      if (response.data.success) {
        setResults(response.data.results);
      } else {
        setError(response.data.error || 'Test execution failed');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message || 'Failed to connect to test server');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsRunning(false);
    }
  };

  const getTotalStats = () => {
    if (!results) return { passed: 0, failed: 0, skipped: 0, duration: 0 };

    return results.reduce(
      (acc, suite) => ({
        passed: acc.passed + suite.totalPassed,
        failed: acc.failed + suite.totalFailed,
        skipped: acc.skipped + suite.totalSkipped,
        duration: acc.duration + suite.totalDuration
      }),
      { passed: 0, failed: 0, skipped: 0, duration: 0 }
    );
  };

  const stats = getTotalStats();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-serif font-bold text-white mb-4">
          Puppeteer Self-Test Suite
        </h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-6">
          Run comprehensive end-to-end tests on critical user journeys and performance metrics
        </p>

        <button
          onClick={runTests}
          disabled={isRunning}
          className={`
            inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg
            transition-all shadow-lg
            ${
              isRunning
                ? 'bg-academic-slate cursor-not-allowed'
                : 'bg-academic-gold hover:bg-academic-amber text-academic-navy hover:scale-105'
            }
          `}
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-6 h-6 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              Run All Tests
            </>
          )}
        </button>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-2">Test Execution Error</h3>
              <p className="text-white/80">{error}</p>
              <p className="text-white/60 text-sm mt-2">
                Make sure the test server is running on port 8080
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Statistics Summary */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            label="Passed"
            value={stats.passed}
            color="green"
          />
          <StatCard
            icon={<XCircle className="w-6 h-6" />}
            label="Failed"
            value={stats.failed}
            color="red"
          />
          <StatCard
            icon={<AlertCircle className="w-6 h-6" />}
            label="Skipped"
            value={stats.skipped}
            color="yellow"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="Duration"
            value={`${(stats.duration / 1000).toFixed(2)}s`}
            color="blue"
          />
        </motion.div>
      )}

      {/* Test Results */}
      {results && <TestResults results={results} />}

      {/* Instructions */}
      {!isRunning && !results && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10"
        >
          <h3 className="text-xl font-semibold text-white mb-4">About These Tests</h3>
          <div className="text-white/70 space-y-3">
            <p>
              This test suite uses Puppeteer to perform end-to-end testing of critical user
              journeys and performance metrics.
            </p>
            <p>Test categories include:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Homepage load and rendering verification</li>
              <li>Navigation menu functionality</li>
              <li>Interactive feature card testing</li>
              <li>Call-to-action button validation</li>
              <li>Responsive design on mobile viewports</li>
              <li>Page load performance metrics</li>
              <li>Animation smoothness analysis</li>
            </ul>
            <p className="text-sm text-white/60 mt-4">
              Note: Screenshots are captured for each test to provide visual confirmation of the
              application state.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: 'green' | 'red' | 'yellow' | 'blue';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    green: 'text-green-400 bg-green-500/10 border-green-500/30',
    red: 'text-red-400 bg-red-500/10 border-red-500/30',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
  };

  return (
    <div className={`${colorClasses[color]} rounded-xl p-6 border`}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm font-medium text-white/80">{label}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
