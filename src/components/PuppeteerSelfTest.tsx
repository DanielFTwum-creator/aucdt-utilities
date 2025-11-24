import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle, XCircle, Loader2, Image as ImageIcon, Clock, ArrowLeft, GraduationCap } from 'lucide-react';
import axios from 'axios';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'running';
  duration?: number;
  error?: string;
  screenshot?: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  totalDuration: number;
  passed: number;
  failed: number;
}

interface PuppeteerSelfTestProps {
  onBack?: () => void;
}

export function PuppeteerSelfTest({ onBack }: PuppeteerSelfTestProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestSuite | null>(null);
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
  const [showScreenshot, setShowScreenshot] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setResults(null);
    setSelectedTest(null);

    try {
      // Start tests
      await axios.post('http://localhost:3001/api/tests/run');

      // Poll for results
      const pollInterval = setInterval(async () => {
        try {
          const response = await axios.get('http://localhost:3001/api/tests/results');

          if (response.data.status === 'completed' && response.data.results) {
            setResults(response.data.results);
            setIsRunning(false);
            clearInterval(pollInterval);
          }
        } catch (error) {
          console.error('Error polling results:', error);
        }
      }, 1000);

      // Timeout after 2 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        setIsRunning(false);
      }, 120000);
    } catch (error) {
      console.error('Error running tests:', error);
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-navy to-academic-blue">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-academic-gold" />
            <h1 className="text-2xl font-serif font-bold text-white">ThesisAI</h1>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
        >
          {/* Test Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-white mb-2">
                Puppeteer Self-Test Suite
              </h2>
              <p className="text-white/70">
                Run comprehensive end-to-end tests with real-time results and screenshots
              </p>
            </div>
            <button
              onClick={runTests}
              disabled={isRunning}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                isRunning
                  ? 'bg-academic-slate cursor-not-allowed'
                  : 'bg-academic-gold hover:bg-academic-amber text-academic-navy'
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
                  Run Tests
                </>
              )}
            </button>
          </div>

          {/* Results Summary */}
          {results && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-white/60 text-sm mb-1">Total Tests</div>
                <div className="text-3xl font-bold text-white">
                  {results.tests.length}
                </div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                <div className="text-green-200 text-sm mb-1">Passed</div>
                <div className="text-3xl font-bold text-green-400">
                  {results.passed}
                </div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
                <div className="text-red-200 text-sm mb-1">Failed</div>
                <div className="text-3xl font-bold text-red-400">
                  {results.failed}
                </div>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                <div className="text-blue-200 text-sm mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Duration
                </div>
                <div className="text-3xl font-bold text-blue-400">
                  {(results.totalDuration / 1000).toFixed(2)}s
                </div>
              </div>
            </motion.div>
          )}

          {/* Test Results List */}
          {results && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white mb-4">Test Results</h3>
              <AnimatePresence mode="popLayout">
                {results.tests.map((test, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedTest(test);
                      setShowScreenshot(true);
                    }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(test.status)}
                        <div className="flex-1">
                          <div className="text-white font-medium">{test.name}</div>
                          {test.error && (
                            <div className="text-red-400 text-sm mt-1">
                              Error: {test.error}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {test.screenshot && (
                          <ImageIcon className="w-4 h-4 text-white/50" />
                        )}
                        {test.duration !== undefined && (
                          <span className="text-white/60 text-sm">
                            {test.duration}ms
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Loading State */}
          {isRunning && !results && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-16 h-16 text-academic-gold animate-spin mb-4" />
              <p className="text-white/70 text-lg">Running Puppeteer tests...</p>
              <p className="text-white/50 text-sm mt-2">
                This may take a minute or two
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isRunning && !results && (
            <div className="flex flex-col items-center justify-center py-20">
              <Play className="w-16 h-16 text-white/30 mb-4" />
              <p className="text-white/70 text-lg mb-2">Ready to run tests</p>
              <p className="text-white/50 text-sm">
                Click "Run Tests" to start the Puppeteer E2E test suite
              </p>
            </div>
          )}
        </motion.div>

        {/* Screenshot Modal */}
        <AnimatePresence>
          {showScreenshot && selectedTest?.screenshot && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScreenshot(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/10 rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto border border-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {selectedTest.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedTest.status)}
                      <span className="text-white/70">
                        {selectedTest.duration}ms
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowScreenshot(false)}
                    className="text-white/70 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                {selectedTest.error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
                    <p className="text-red-400 text-sm font-mono">
                      {selectedTest.error}
                    </p>
                  </div>
                )}
                <img
                  src={selectedTest.screenshot}
                  alt={`Screenshot for ${selectedTest.name}`}
                  className="w-full rounded-lg border border-white/20"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
