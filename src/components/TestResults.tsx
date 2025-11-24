import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Image as ImageIcon
} from 'lucide-react';

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

interface TestResultsProps {
  results: TestSuiteResult[];
}

export function TestResults({ results }: TestResultsProps) {
  return (
    <div className="space-y-6">
      {results.map((suite, index) => (
        <TestSuite key={index} suite={suite} />
      ))}
    </div>
  );
}

function TestSuite({ suite }: { suite: TestSuiteResult }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
    >
      {/* Suite Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-white/60" />
          ) : (
            <ChevronRight className="w-5 h-5 text-white/60" />
          )}
          <h3 className="text-xl font-semibold text-white">{suite.suiteName}</h3>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-green-400 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            {suite.totalPassed}
          </span>
          {suite.totalFailed > 0 && (
            <span className="text-red-400 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              {suite.totalFailed}
            </span>
          )}
          {suite.totalSkipped > 0 && (
            <span className="text-yellow-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {suite.totalSkipped}
            </span>
          )}
          <span className="text-white/60 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {(suite.totalDuration / 1000).toFixed(2)}s
          </span>
        </div>
      </button>

      {/* Suite Tests */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10"
          >
            <div className="p-4 space-y-3">
              {suite.tests.map((test, index) => (
                <TestItem key={index} test={test} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TestItem({ test }: { test: TestResult }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);

  const getStatusIcon = () => {
    switch (test.status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'skipped':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = () => {
    switch (test.status) {
      case 'passed':
        return 'border-green-500/30 bg-green-500/5';
      case 'failed':
        return 'border-red-500/30 bg-red-500/5';
      case 'skipped':
        return 'border-yellow-500/30 bg-yellow-500/5';
    }
  };

  return (
    <div className={`rounded-lg border ${getStatusColor()} overflow-hidden`}>
      {/* Test Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <span className="text-white font-medium">{test.name}</span>
        </div>

        <div className="flex items-center gap-3">
          {test.screenshot && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowScreenshot(!showScreenshot);
              }}
              className="text-white/60 hover:text-white transition-colors"
              title="View screenshot"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          )}
          <span className="text-white/60 text-sm">
            {test.duration}ms
          </span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-white/60" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white/60" />
          )}
        </div>
      </button>

      {/* Test Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10"
          >
            <div className="p-4 space-y-3">
              {/* Error Message */}
              {test.error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
                  <p className="text-red-400 text-sm font-medium mb-1">Error:</p>
                  <p className="text-white/80 text-sm">{test.error}</p>
                </div>
              )}

              {/* Test Steps */}
              {test.steps && test.steps.length > 0 && (
                <div className="space-y-2">
                  <p className="text-white/60 text-sm font-medium">Steps:</p>
                  {test.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      {step.status === 'passed' ? (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-white/70">{step.description}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Screenshot */}
              {showScreenshot && test.screenshot && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3"
                >
                  <p className="text-white/60 text-sm font-medium mb-2">Screenshot:</p>
                  <img
                    src={test.screenshot}
                    alt={`Screenshot for ${test.name}`}
                    className="rounded border border-white/20 max-w-full"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
