import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayCircle,
  CheckCircle,
  XCircle,
  Clock,
  ImageIcon,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import axios from 'axios';

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration?: number;
  error?: string;
  screenshot?: string;
  timestamp: string;
}

interface TestSuite {
  id: string;
  name: string;
  tests: TestResult[];
  startTime?: string;
  endTime?: string;
  totalDuration?: number;
}

interface WebSocketMessage {
  type: string;
  testId?: string;
  testName?: string;
  result?: TestResult;
  suite?: TestSuite;
  error?: string;
  isRunning?: boolean;
  lastSuite?: TestSuite;
}

const API_BASE = 'http://localhost:8080';
const WS_URL = 'ws://localhost:8080';

export default function PuppeteerSelfTest() {
  const [testSuite, setTestSuite] = useState<TestSuite | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket connection
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    setConnectionStatus('connecting');

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('connected');
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        handleWebSocketMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');

      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          connectWebSocket();
        }
      }, 3000);
    };
  };

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    console.log('WebSocket message:', message);

    switch (message.type) {
      case 'connected':
        if (message.lastSuite) {
          setTestSuite(message.lastSuite);
        }
        setIsRunning(message.isRunning || false);
        break;

      case 'test-started':
        setIsRunning(true);
        setTestSuite({
          id: `suite-${Date.now()}`,
          name: 'ThesisAI E2E Test Suite',
          tests: [],
          startTime: new Date().toISOString(),
        });
        break;

      case 'test-running':
        if (testSuite) {
          const newTest: TestResult = {
            id: message.testId || '',
            name: message.testName || '',
            status: 'running',
            timestamp: new Date().toISOString(),
          };
          setTestSuite({
            ...testSuite,
            tests: [...testSuite.tests, newTest],
          });
        }
        break;

      case 'test-completed':
        if (message.result && testSuite) {
          setTestSuite({
            ...testSuite,
            tests: testSuite.tests.map((test) =>
              test.id === message.result!.id ? message.result! : test
            ),
          });
        }
        break;

      case 'test-suite-completed':
        if (message.suite) {
          setTestSuite(message.suite);
        }
        setIsRunning(false);
        break;

      case 'error':
        console.error('Test error:', message.error);
        setIsRunning(false);
        break;
    }
  };

  const startTests = async () => {
    try {
      await axios.post(`${API_BASE}/api/test/run`);
    } catch (error) {
      console.error('Failed to start tests:', error);
      alert('Failed to start tests. Make sure the test server is running.');
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getTestStats = () => {
    if (!testSuite) return { passed: 0, failed: 0, total: 0 };

    const passed = testSuite.tests.filter((t) => t.status === 'passed').length;
    const failed = testSuite.tests.filter((t) => t.status === 'failed').length;
    const total = testSuite.tests.length;

    return { passed, failed, total };
  };

  const stats = getTestStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-navy to-academic-blue p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-white mb-2">
                Puppeteer Self-Test
              </h1>
              <p className="text-white/70">
                Comprehensive end-to-end testing suite with real-time results
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected'
                      ? 'bg-green-500'
                      : connectionStatus === 'connecting'
                      ? 'bg-yellow-500 animate-pulse'
                      : 'bg-red-500'
                  }`}
                />
                <span className="text-white/80 text-sm capitalize">
                  {connectionStatus}
                </span>
              </div>

              {/* Run Tests Button */}
              <button
                onClick={startTests}
                disabled={isRunning || connectionStatus !== 'connected'}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isRunning || connectionStatus !== 'connected'
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
                    <PlayCircle className="w-5 h-5" />
                    Run Tests
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Test Stats */}
          {testSuite && (
            <div className="grid grid-cols-4 gap-4">
              <StatCard
                label="Total Tests"
                value={stats.total}
                icon={<Clock className="w-6 h-6" />}
                color="blue"
              />
              <StatCard
                label="Passed"
                value={stats.passed}
                icon={<CheckCircle className="w-6 h-6" />}
                color="green"
              />
              <StatCard
                label="Failed"
                value={stats.failed}
                icon={<XCircle className="w-6 h-6" />}
                color="red"
              />
              <StatCard
                label="Duration"
                value={formatDuration(testSuite.totalDuration)}
                icon={<Clock className="w-6 h-6" />}
                color="amber"
              />
            </div>
          )}
        </div>

        {/* Test Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test List */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Test Results</h2>

            {!testSuite && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No test results yet. Click "Run Tests" to start.</p>
              </div>
            )}

            <div className="space-y-2">
              <AnimatePresence>
                {testSuite?.tests.map((test, index) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => setSelectedTest(test)}
                      className={`w-full flex items-center gap-3 p-4 rounded-lg transition-all ${
                        selectedTest?.id === test.id
                          ? 'bg-white/20 border-2 border-academic-gold'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {getStatusIcon(test.status)}
                      <div className="flex-1 text-left">
                        <p className="text-white font-medium">{test.name}</p>
                        <p className="text-white/50 text-sm">{formatDuration(test.duration)}</p>
                      </div>
                      {test.screenshot && <ImageIcon className="w-5 h-5 text-white/50" />}
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Test Details */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Test Details</h2>

            {!selectedTest ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">Select a test to view details</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Test Name */}
                <div>
                  <label className="text-white/60 text-sm block mb-1">Test Name</label>
                  <p className="text-white font-medium">{selectedTest.name}</p>
                </div>

                {/* Status */}
                <div>
                  <label className="text-white/60 text-sm block mb-1">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedTest.status)}
                    <span className="text-white capitalize">{selectedTest.status}</span>
                  </div>
                </div>

                {/* Duration */}
                {selectedTest.duration && (
                  <div>
                    <label className="text-white/60 text-sm block mb-1">Duration</label>
                    <p className="text-white">{formatDuration(selectedTest.duration)}</p>
                  </div>
                )}

                {/* Error */}
                {selectedTest.error && (
                  <div>
                    <label className="text-white/60 text-sm block mb-1">Error</label>
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                      <p className="text-red-200 font-mono text-sm">{selectedTest.error}</p>
                    </div>
                  </div>
                )}

                {/* Screenshot */}
                {selectedTest.screenshot && (
                  <div>
                    <label className="text-white/60 text-sm block mb-2">Screenshot</label>
                    <div className="relative rounded-lg overflow-hidden border-2 border-white/20">
                      <img
                        src={`${API_BASE}/api/test/screenshot/${selectedTest.screenshot}`}
                        alt={`Screenshot for ${selectedTest.name}`}
                        className="w-full h-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
                        }}
                      />
                    </div>
                    <a
                      href={`${API_BASE}/api/test/screenshot/${selectedTest.screenshot}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 text-academic-gold hover:text-academic-amber transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" />
                      View Full Size
                    </a>
                  </div>
                )}

                {/* Timestamp */}
                <div>
                  <label className="text-white/60 text-sm block mb-1">Timestamp</label>
                  <p className="text-white text-sm">
                    {new Date(selectedTest.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'amber';
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    red: 'text-red-400',
    amber: 'text-amber-400',
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={colorClasses[color]}>{icon}</div>
      </div>
    </div>
  );
}
