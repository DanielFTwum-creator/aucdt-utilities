import React, { useState } from 'react';
import './SelfTestTab.css';

function SelfTestTab() {
  const [testRunning, setTestRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);

  const tests = [
    {
      name: 'API Health Check',
      description: 'Verify backend API is accessible',
      run: async () => {
        try {
          const response = await fetch('http://localhost:8080/api/health');
          return response.ok;
        } catch {
          return false;
        }
      },
    },
    {
      name: 'Programmes Endpoint',
      description: 'Fetch all programmes from the database',
      run: async () => {
        try {
          const response = await fetch('http://localhost:8080/api/programmes');
          return response.ok;
        } catch {
          return false;
        }
      },
    },
    {
      name: 'Lecturers Endpoint',
      description: 'Fetch all lecturers from the database',
      run: async () => {
        try {
          const response = await fetch('http://localhost:8080/api/lecturers');
          return response.ok;
        } catch {
          return false;
        }
      },
    },
    {
      name: 'Courses Endpoint',
      description: 'Fetch all courses from the database',
      run: async () => {
        try {
          const response = await fetch('http://localhost:8080/api/courses');
          return response.ok;
        } catch {
          return false;
        }
      },
    },
    {
      name: 'Authentication',
      description: 'Test admin login functionality',
      run: async () => {
        try {
          const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'admin123' }),
          });
          return response.ok;
        } catch {
          return false;
        }
      },
    },
  ];

  const handleRunTests = async () => {
    setTestRunning(true);
    setTestResults([]);
    setCurrentTestIndex(0);

    for (let i = 0; i < tests.length; i++) {
      setCurrentTestIndex(i);
      const test = tests[i];

      try {
        const passed = await test.run();
        setTestResults((prev) => [
          ...prev,
          {
            name: test.name,
            description: test.description,
            passed,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } catch (err) {
        setTestResults((prev) => [
          ...prev,
          {
            name: test.name,
            description: test.description,
            passed: false,
            error: err.message,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }

      // Simulate delay for visual effect
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setTestRunning(false);
  };

  const passedCount = testResults.filter((r) => r.passed).length;
  const totalCount = testResults.length;
  const allPassed = passedCount === totalCount && totalCount > 0;

  return (
    <div className="self-test-tab">
      <h2>E2E Self-Testing Suite</h2>

      <div className="test-description">
        <p>
          This testing suite runs automated tests to verify the stability and functionality of the
          LEMS application. Click the button below to start the tests.
        </p>
      </div>

      <div className="test-controls">
        <button
          className="run-tests-button"
          onClick={handleRunTests}
          disabled={testRunning}
        >
          {testRunning ? `Running Tests (${currentTestIndex + 1}/${tests.length})...` : 'Run E2E Test Suite'}
        </button>
      </div>

      {testRunning && (
        <div className="test-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentTestIndex + 1) / tests.length) * 100}%` }}
            />
          </div>
          <p>Running test {currentTestIndex + 1} of {tests.length}...</p>
        </div>
      )}

      {testResults.length > 0 && (
        <div className="test-results">
          <div className={`results-summary ${allPassed ? 'passed' : 'failed'}`}>
            <h3>{allPassed ? 'All Tests Passed!' : 'Some Tests Failed'}</h3>
            <p>
              {passedCount} of {totalCount} tests passed
            </p>
          </div>

          <div className="test-results-list">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`test-result ${result.passed ? 'passed' : 'failed'}`}
              >
                <div className="result-header">
                  <span className="result-icon">
                    {result.passed ? 'PASS' : 'FAIL'}
                  </span>
                  <div className="result-info">
                    <h4>{result.name}</h4>
                    <p>{result.description}</p>
                  </div>
                  <span className="result-time">{result.timestamp}</span>
                </div>
                {result.error && (
                  <div className="result-error">
                    <p>Error: {result.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SelfTestTab;

