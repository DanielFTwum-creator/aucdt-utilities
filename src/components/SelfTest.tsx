import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import axios from 'axios';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshot?: string;
  steps?: string[];
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  totalDuration: number;
  passed: number;
  failed: number;
  skipped: number;
}

interface TestStatus {
  isRunning: boolean;
  hasResults: boolean;
  timestamp: string;
}

const API_BASE_URL = 'http://localhost:8080/api';

export function SelfTest() {
  const [testSuite, setTestSuite] = useState<TestSuite | null>(null);
  const [testStatus, setTestStatus] = useState<TestStatus | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);

  // Poll for test status
  useEffect(() => {
    const pollStatus = async () => {
      try {
        const response = await axios.get<TestStatus>(`${API_BASE_URL}/tests/status`);
        setTestStatus(response.data);

        if (!response.data.isRunning && response.data.hasResults && !testSuite) {
          // Fetch results if tests completed
          fetchResults();
        }
      } catch (err) {
        console.error('Failed to fetch test status:', err);
      }
    };

    const interval = setInterval(pollStatus, 2000);
    pollStatus(); // Initial call

    return () => clearInterval(interval);
  }, [testSuite]);

  const fetchResults = async () => {
    try {
      const response = await axios.get<TestSuite>(`${API_BASE_URL}/tests/results`);
      setTestSuite(response.data);
      setIsRunning(false);
    } catch (err) {
      console.error('Failed to fetch test results:', err);
    }
  };

  const runTests = async () => {
    setError(null);
    setIsRunning(true);
    setTestSuite(null);

    try {
      await axios.post(`${API_BASE_URL}/tests/run`, {
        baseUrl: window.location.origin,
      });

      // Wait for tests to complete
      const checkInterval = setInterval(async () => {
        try {
          const statusResponse = await axios.get<TestStatus>(`${API_BASE_URL}/tests/status`);

          if (!statusResponse.data.isRunning && statusResponse.data.hasResults) {
            clearInterval(checkInterval);
            await fetchResults();
          }
        } catch (err) {
          console.error('Failed to check test status:', err);
        }
      }, 2000);

      // Timeout after 2 minutes
      setTimeout(() => {
        clearInterval(checkInterval);
        if (isRunning) {
          setError('Test execution timed out');
          setIsRunning(false);
        }
      }, 120000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start tests');
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: 'passed' | 'failed' | 'skipped') => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'skipped':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: 'passed' | 'failed' | 'skipped') => {
    switch (status) {
      case 'passed':
        return 'bg-green-500/10 border-green-500/20';
      case 'failed':
        return 'bg-red-500/10 border-red-500/20';
      case 'skipped':
        return 'bg-yellow-500/10 border-yellow-500/20';
    }
  };

  const toggleTestExpanded = (testName: string) => {
    setExpandedTest(expandedTest === testName ? null : testName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-navy to-academic-blue py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-serif font-bold text-white mb-4">
            Puppeteer Self-Test
          </h1>
          <p className="text-white/80 text-lg">
            Automated end-to-end testing for critical user journeys
          </p>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={runTests}
                disabled={isRunning}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  isRunning
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-academic-gold hover:bg-academic-amber text-academic-navy hover:scale-105'
                }`}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Run All Tests
                  </>
                )}
              </button>

              {testSuite && !isRunning && (
                <button
                  onClick={runTests}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  Rerun
                </button>
              )}
            </div>

            {testStatus && (
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="w-5 h-5" />
                <span className="text-sm">
                  {testStatus.isRunning ? 'Running...' : 'Ready'}
                </span>
              </div>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200"
            >
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Test Results Summary */}
        {testSuite && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">{testSuite.name}</h2>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-white/60 text-sm mb-1">Total Tests</div>
                <div className="text-3xl font-bold text-white">{testSuite.tests.length}</div>
              </div>

              <div className="bg-green-500/10 rounded-xl p-4">
                <div className="text-green-200/80 text-sm mb-1">Passed</div>
                <div className="text-3xl font-bold text-green-400">{testSuite.passed}</div>
              </div>

              <div className="bg-red-500/10 rounded-xl p-4">
                <div className="text-red-200/80 text-sm mb-1">Failed</div>
                <div className="text-3xl font-bold text-red-400">{testSuite.failed}</div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-white/60 text-sm mb-1">Duration</div>
                <div className="text-3xl font-bold text-white">
                  {(testSuite.totalDuration / 1000).toFixed(1)}s
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Test Results Details */}
        {testSuite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {testSuite.tests.map((test, index) => (
              <motion.div
                key={test.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl border ${getStatusColor(
                  test.status
                )} overflow-hidden`}
              >
                <div
                  className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => toggleTestExpanded(test.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(test.status)}
                      <div>
                        <h3 className="text-xl font-semibold text-white">{test.name}</h3>
                        <p className="text-white/60 text-sm">{test.duration}ms</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          test.status === 'passed'
                            ? 'bg-green-500/20 text-green-300'
                            : test.status === 'failed'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                      >
                        {test.status.toUpperCase()}
                      </span>

                      {expandedTest === test.name ? (
                        <ChevronUp className="w-5 h-5 text-white/60" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/60" />
                      )}
                    </div>
                  </div>

                  {test.error && (
                    <div className="mt-4 p-4 bg-red-500/20 rounded-xl">
                      <p className="text-red-200 font-mono text-sm">{test.error}</p>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {expandedTest === test.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/20"
                    >
                      <div className="p-6 space-y-4">
                        {/* Test Steps */}
                        {test.steps && test.steps.length > 0 && (
                          <div>
                            <h4 className="text-white font-semibold mb-3">Test Steps:</h4>
                            <div className="space-y-2">
                              {test.steps.map((step, stepIndex) => (
                                <div
                                  key={stepIndex}
                                  className="flex items-start gap-3 text-white/80 text-sm"
                                >
                                  <span className="text-academic-gold font-mono">
                                    {stepIndex + 1}.
                                  </span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Screenshot */}
                        {test.screenshot && (
                          <div>
                            <h4 className="text-white font-semibold mb-3">Screenshot:</h4>
                            <div className="rounded-xl overflow-hidden border border-white/20">
                              <img
                                src={test.screenshot}
                                alt={`Screenshot for ${test.name}`}
                                className="w-full h-auto"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!testSuite && !isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center"
          >
            <Play className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No Tests Run Yet</h3>
            <p className="text-white/60">
              Click "Run All Tests" to start the automated test suite
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {isRunning && !testSuite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center"
          >
            <Loader2 className="w-16 h-16 text-academic-gold mx-auto mb-4 animate-spin" />
            <h3 className="text-2xl font-semibold text-white mb-2">Running Tests...</h3>
            <p className="text-white/60">This may take a few moments</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
