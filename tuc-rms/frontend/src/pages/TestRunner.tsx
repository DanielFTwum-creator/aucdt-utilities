import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface TestSuite {
  name: string;
  filename: string;
  description: string;
}

const TestRunner: React.FC = () => {
  const { user } = useAuth();
  const [running, setRunning] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState('all');
  const [logs, setLogs] = useState<Array<{ type: 'out' | 'err' | 'info'; message: string }>>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({ passed: 0, failed: 0, total: 0 });

  const testSuites: TestSuite[] = [
    { name: 'All Tests', filename: 'all', description: 'Run all test suites' },
    { name: 'Authentication', filename: 'auth', description: '6 tests for login, credentials, rate limiting, logout' },
    { name: 'Admin Workflows', filename: 'admin-workflows', description: '10 tests for dashboard, users, courses, themes' },
    { name: 'Lecturer Workflows', filename: 'lecturer-workflows', description: '4 tests for lecturer-specific flows' },
    { name: 'Health Check', filename: 'health-check', description: 'API health endpoints' },
    { name: 'Accessibility', filename: 'accessibility', description: 'WCAG 2.1 compliance' },
  ];

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const runTests = async (suite: string) => {
    if (running) return;

    setRunning(true);
    setLogs([{ type: 'info', message: `Starting ${suite} tests...` }]);
    setStats({ passed: 0, failed: 0, total: 0 });

    try {
      const response = await fetch('/api/test/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suite }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Parse SSE stream
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6));
              if (event.out) {
                setLogs(prev => [...prev, { type: 'out', message: event.out }]);
                // Parse test results from output
                if (event.out.includes('passed')) {
                  const match = event.out.match(/(\d+) passed/);
                  if (match) setStats(s => ({ ...s, passed: parseInt(match[1]) }));
                }
                if (event.out.includes('failed')) {
                  const match = event.out.match(/(\d+) failed/);
                  if (match) setStats(s => ({ ...s, failed: parseInt(match[1]) }));
                }
              }
              if (event.err) {
                setLogs(prev => [...prev, { type: 'err', message: event.err }]);
              }
              if (event.done) {
                setLogs(prev => [
                  ...prev,
                  { type: 'info', message: `Tests completed with exit code ${event.exitCode}` }
                ]);
              }
            } catch (e) {
              // Not JSON, ignore
            }
          }
        }
      }
    } catch (error) {
      setLogs(prev => [
        ...prev,
        { type: 'err', message: `Error: ${error instanceof Error ? error.message : String(error)}` }
      ]);
    } finally {
      setRunning(false);
    }
  };

  if (user?.role !== 'registrar') {
    return (
      <div className='card' style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>Only administrators can access the test runner.</p>
      </div>
    );
  }

  return (
    <div className='test-runner-container'>
      <h1>Test Runner</h1>
      <p className='subtitle'>Run automated Playwright tests for TUC RMS</p>

      <div className='test-suite-selector'>
        <h3>Select Test Suite</h3>
        <div className='suite-grid'>
          {testSuites.map(suite => (
            <button
              key={suite.filename}
              className={`suite-button ${selectedSuite === suite.filename ? 'active' : ''}`}
              onClick={() => setSelectedSuite(suite.filename)}
              disabled={running}
            >
              <div className='suite-name'>{suite.name}</div>
              <div className='suite-description'>{suite.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className='test-controls'>
        <button
          onClick={() => runTests(selectedSuite)}
          disabled={running}
          className='btn-primary'
        >
          {running ? 'Running...' : 'Run Tests'}
        </button>
        <button
          onClick={() => setLogs([])}
          disabled={running}
          className='btn-secondary'
        >
          Clear Logs
        </button>
      </div>

      {stats.total > 0 && (
        <div className='test-stats'>
          <div className='stat passed'>
            <span className='stat-value'>{stats.passed}</span>
            <span className='stat-label'>Passed</span>
          </div>
          <div className='stat failed'>
            <span className='stat-value'>{stats.failed}</span>
            <span className='stat-label'>Failed</span>
          </div>
          <div className='stat total'>
            <span className='stat-value'>{stats.passed + stats.failed}</span>
            <span className='stat-label'>Total</span>
          </div>
        </div>
      )}

      <div className='test-logs'>
        <h3>Live Log Output</h3>
        <div className='log-container' role='status' aria-live='polite'>
          {logs.map((log, idx) => (
            <div key={idx} className={`log-line log-${log.type}`}>
              <span className='log-type'>[{log.type.toUpperCase()}]</span>
              <span className='log-message'>{log.message}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      <style>{`
        .test-runner-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 2rem;
        }

        .subtitle {
          color: var(--text-secondary, #666);
          margin-bottom: 2rem;
        }

        .test-suite-selector {
          margin-bottom: 2rem;
        }

        .test-suite-selector h3 {
          margin-bottom: 1rem;
        }

        .suite-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .suite-button {
          padding: 1rem;
          border: 2px solid var(--border-color, #ddd);
          border-radius: 0.5rem;
          background: var(--card-bg, white);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .suite-button:hover:not(:disabled) {
          border-color: var(--primary, #6B0020);
          background: var(--hover-bg, #f5f5f5);
        }

        .suite-button.active {
          border-color: var(--primary, #6B0020);
          background: var(--primary, #6B0020);
          color: white;
        }

        .suite-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .suite-name {
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .suite-description {
          font-size: 0.875rem;
          color: var(--text-secondary, #666);
          line-height: 1.4;
        }

        .suite-button.active .suite-description {
          color: rgba(255, 255, 255, 0.9);
        }

        .test-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .btn-primary, .btn-secondary {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: var(--primary, #6B0020);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--primary-dark, #4a0015);
        }

        .btn-secondary {
          background: var(--secondary, #ddd);
          color: var(--text, #333);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--secondary-dark, #bbb);
        }

        .btn-primary:disabled, .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .test-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat {
          padding: 1rem;
          border-radius: 0.5rem;
          text-align: center;
          background: var(--card-bg, white);
          border-left: 4px solid #ccc;
        }

        .stat.passed {
          border-left-color: #22c55e;
        }

        .stat.failed {
          border-left-color: #ef4444;
        }

        .stat.total {
          border-left-color: #3b82f6;
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text, #333);
        }

        .stat-label {
          display: block;
          font-size: 0.875rem;
          color: var(--text-secondary, #666);
        }

        .test-logs {
          margin-top: 2rem;
        }

        .test-logs h3 {
          margin-bottom: 1rem;
        }

        .log-container {
          background: var(--card-bg, #f9fafb);
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 0.5rem;
          padding: 1rem;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
          max-height: 600px;
          overflow-y: auto;
          line-height: 1.5;
        }

        .log-line {
          padding: 0.25rem 0;
          display: flex;
          gap: 0.5rem;
        }

        .log-type {
          font-weight: 600;
          min-width: 50px;
        }

        .log-out {
          color: var(--text, #333);
        }

        .log-err {
          color: #ef4444;
        }

        .log-info {
          color: #3b82f6;
        }

        .log-message {
          flex: 1;
          word-break: break-word;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
};

export default TestRunner;
