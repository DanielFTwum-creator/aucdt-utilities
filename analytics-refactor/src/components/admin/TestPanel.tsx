/**
 * Self-Testing Admin Panel Component
 *
 * Provides automated health checks, system validation, and test reporting
 * for the Advanced Analytics Dashboard.
 *
 * Features:
 * - Data integrity validation
 * - Calculation accuracy testing
 * - Performance benchmarks
 * - Accessibility audit (placeholder for axe-core integration)
 * - Test report generation
 *
 * @component
 * @example
 * return <TestPanel currentData={data} onClose={() => setShowPanel(false)} />
 */

import React, { useState } from 'react';
import { validateDataIntegrity } from '../analytics/utils/dataValidation';
import {
  processRawData,
  calculateYearlyData,
  calculateAllTimeStats,
  calculateSummaryStats
} from '../analytics/utils/analyticsCalculations';

const TestPanel = ({ currentData, onClose }) => {
  const [testResults, setTestResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [selectedTests, setSelectedTests] = useState({
    dataIntegrity: true,
    calculations: true,
    performance: true,
    accessibility: false // Disabled by default (requires axe-core)
  });

  /**
   * Run all selected tests
   */
  const runAllTests = async () => {
    setRunning(true);
    const results = {
      timestamp: new Date().toISOString(),
      environment: {
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        dataRecords: currentData?.length || 0
      },
      tests: []
    };

    try {
      // Test 1: Data Integrity
      if (selectedTests.dataIntegrity) {
        const integrityTest = await testDataIntegrity(currentData);
        results.tests.push(integrityTest);
      }

      // Test 2: Calculation Accuracy
      if (selectedTests.calculations) {
        const calcTest = await testCalculationAccuracy(currentData);
        results.tests.push(calcTest);
      }

      // Test 3: Performance Benchmarks
      if (selectedTests.performance) {
        const perfTest = await testPerformance(currentData);
        results.tests.push(perfTest);
      }

      // Test 4: Accessibility (if enabled)
      if (selectedTests.accessibility) {
        const a11yTest = await testAccessibility();
        results.tests.push(a11yTest);
      }

      // Calculate overall pass/fail
      const passed = results.tests.filter(t => t.passed).length;
      const total = results.tests.length;
      results.summary = {
        total,
        passed,
        failed: total - passed,
        passRate: ((passed / total) * 100).toFixed(1)
      };

    } catch (error) {
      console.error('Error running tests:', error);
      results.error = error.message;
    }

    setTestResults(results);
    setRunning(false);
  };

  /**
   * Test 1: Data Integrity Validation
   */
  const testDataIntegrity = async (data) => {
    const startTime = performance.now();

    if (!data || data.length === 0) {
      return {
        name: 'Data Integrity',
        passed: false,
        duration: performance.now() - startTime,
        details: ['No data available to validate']
      };
    }

    const validation = validateDataIntegrity(data);
    const duration = performance.now() - startTime;

    return {
      name: 'Data Integrity',
      passed: validation.valid,
      duration: duration.toFixed(2),
      details: validation.valid
        ? [`✅ All ${validation.recordCount} records validated successfully`]
        : validation.errors
    };
  };

  /**
   * Test 2: Calculation Accuracy Testing
   */
  const testCalculationAccuracy = async (data) => {
    const startTime = performance.now();
    const failures = [];

    try {
      if (!data || data.length === 0) {
        throw new Error('No data available');
      }

      // Process data
      const processed = processRawData(data);

      // Test 1: Acceptance rate calculation
      const sampleRecord = processed.find(d => d.applicants > 0);
      if (sampleRecord) {
        const expectedRate = parseFloat((sampleRecord.accepted / sampleRecord.applicants * 100).toFixed(1));
        if (Math.abs(sampleRecord.acceptanceRate - expectedRate) > 0.1) {
          failures.push(`Acceptance rate mismatch: expected ${expectedRate}, got ${sampleRecord.acceptanceRate}`);
        }
      }

      // Test 2: Yearly aggregation
      const yearlyData = calculateYearlyData(processed);
      if (yearlyData.length === 0) {
        failures.push('Yearly aggregation returned no data');
      }

      // Test 3: All-time stats totals
      const allTimeStats = calculateAllTimeStats(processed);
      const manualTotal = processed.reduce((sum, d) => sum + d.signups, 0);
      if (allTimeStats.signups !== manualTotal) {
        failures.push(`All-time signups mismatch: expected ${manualTotal}, got ${allTimeStats.signups}`);
      }

      // Test 4: Summary stats
      const testData = [10, 20, 30, 40, 50];
      const summary = calculateSummaryStats(testData);
      if (summary.mean !== 30 || summary.median !== 30) {
        failures.push(`Summary stats incorrect: mean=${summary.mean}, median=${summary.median}`);
      }

    } catch (error) {
      failures.push(`Calculation error: ${error.message}`);
    }

    const duration = performance.now() - startTime;

    return {
      name: 'Calculation Accuracy',
      passed: failures.length === 0,
      duration: duration.toFixed(2),
      details: failures.length === 0
        ? ['✅ All calculations verified accurate']
        : failures
    };
  };

  /**
   * Test 3: Performance Benchmarks
   */
  const testPerformance = async (data) => {
    const benchmarks = [];
    const targets = {
      dataProcessing: 1000, // ms
      chartCalculation: 500,  // ms
      memoryUsage: 150       // MB
    };

    try {
      // Benchmark 1: Data processing time
      const processStart = performance.now();
      processRawData(data);
      const processTime = performance.now() - processStart;
      benchmarks.push({
        test: 'Data Processing',
        time: processTime.toFixed(2),
        target: targets.dataProcessing,
        passed: processTime < targets.dataProcessing
      });

      // Benchmark 2: Chart calculations
      const chartStart = performance.now();
      const processed = processRawData(data);
      calculateYearlyData(processed);
      const chartTime = performance.now() - chartStart;
      benchmarks.push({
        test: 'Chart Calculations',
        time: chartTime.toFixed(2),
        target: targets.chartCalculation,
        passed: chartTime < targets.chartCalculation
      });

      // Benchmark 3: Memory usage (if available)
      if (performance.memory) {
        const memoryMB = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
        benchmarks.push({
          test: 'Memory Usage',
          time: memoryMB,
          target: targets.memoryUsage,
          passed: parseFloat(memoryMB) < targets.memoryUsage
        });
      }

    } catch (error) {
      benchmarks.push({
        test: 'Performance Test',
        error: error.message,
        passed: false
      });
    }

    const allPassed = benchmarks.every(b => b.passed);
    const details = benchmarks.map(b =>
      b.passed
        ? `✅ ${b.test}: ${b.time}ms (target: ${b.target}ms)`
        : `❌ ${b.test}: ${b.time}ms exceeds target ${b.target}ms`
    );

    return {
      name: 'Performance Benchmarks',
      passed: allPassed,
      duration: 'N/A',
      details
    };
  };

  /**
   * Test 4: Accessibility Audit (placeholder)
   */
  const testAccessibility = async () => {
    // Note: This requires axe-core library to be loaded
    // For now, return a placeholder result

    const checks = [];

    try {
      // Check 1: Main content has role="main"
      const mainElement = document.querySelector('main');
      checks.push({
        check: 'Main landmark present',
        passed: !!mainElement
      });

      // Check 2: All images have alt text (sample check)
      const images = document.querySelectorAll('img');
      const missingAlt = Array.from(images).filter(img => !img.alt).length;
      checks.push({
        check: 'Images have alt text',
        passed: missingAlt === 0,
        details: missingAlt > 0 ? `${missingAlt} images missing alt text` : undefined
      });

      // Check 3: Headings hierarchy (sample check)
      const h1Count = document.querySelectorAll('h1').length;
      checks.push({
        check: 'Heading hierarchy (one h1)',
        passed: h1Count === 1
      });

      // Note: For full audit, integrate axe-core:
      // if (window.axe) {
      //   const results = await window.axe.run();
      //   return results.violations.length === 0;
      // }

    } catch (error) {
      checks.push({
        check: 'Accessibility audit',
        passed: false,
        error: error.message
      });
    }

    const allPassed = checks.every(c => c.passed);
    const details = checks.map(c =>
      c.passed
        ? `✅ ${c.check}`
        : `❌ ${c.check}${c.details ? `: ${c.details}` : ''}`
    );

    details.push('ℹ️ For comprehensive audit, integrate axe-core library');

    return {
      name: 'Accessibility Checks',
      passed: allPassed,
      duration: 'N/A',
      details
    };
  };

  /**
   * Export test results to JSON
   */
  const exportResults = () => {
    if (!testResults) return;

    const json = JSON.stringify(testResults, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Toggle test selection
   */
  const toggleTest = (testKey) => {
    setSelectedTests(prev => ({
      ...prev,
      [testKey]: !prev[testKey]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span className="text-4xl">🧪</span>
              Self-Testing Module
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Automated health checks and system validation
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Close test panel"
          >
            ✕
          </button>
        </div>

        {/* Test Selection */}
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Tests to Run:</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(selectedTests).map(([key, selected]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleTest(key)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Control Panel */}
        <div className="px-8 py-6 border-b border-gray-200">
          <button
            onClick={runAllTests}
            disabled={running || !Object.values(selectedTests).some(v => v)}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {running ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <span className="text-xl">▶️</span>
                Run Selected Tests
              </>
            )}
          </button>

          {testResults && (
            <button
              onClick={exportResults}
              className="ml-3 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
            >
              💾 Export Results
            </button>
          )}
        </div>

        {/* Test Results */}
        <div className="px-8 py-6">
          {!testResults && !running && (
            <div className="text-center text-gray-500 py-12">
              <p className="text-6xl mb-4">🎯</p>
              <p className="text-lg">Select tests and click "Run Selected Tests" to begin</p>
            </div>
          )}

          {testResults && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-2">Test Summary</h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm opacity-90">Total Tests</p>
                    <p className="text-3xl font-bold">{testResults.summary.total}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Passed</p>
                    <p className="text-3xl font-bold text-green-300">{testResults.summary.passed}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Failed</p>
                    <p className="text-3xl font-bold text-red-300">{testResults.summary.failed}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Pass Rate</p>
                    <p className="text-3xl font-bold">{testResults.summary.passRate}%</p>
                  </div>
                </div>
                <p className="text-sm opacity-75 mt-3">
                  Run at: {new Date(testResults.timestamp).toLocaleString()}
                </p>
              </div>

              {/* Individual Test Results */}
              {testResults.tests.map((test, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-lg border-2 ${
                    test.passed
                      ? 'bg-green-50 border-green-300'
                      : 'bg-red-50 border-red-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold flex items-center gap-2">
                      <span className="text-2xl">{test.passed ? '✅' : '❌'}</span>
                      {test.name}
                    </h4>
                    {test.duration && test.duration !== 'N/A' && (
                      <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                        ⏱️ {test.duration}ms
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {test.details?.map((detail, detailIdx) => (
                      <p key={detailIdx} className="text-sm text-gray-700 font-mono">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Environment Info */}
              <div className="bg-gray-100 p-4 rounded-lg text-sm">
                <h4 className="font-semibold text-gray-700 mb-2">Test Environment:</h4>
                <ul className="space-y-1 text-gray-600 font-mono text-xs">
                  <li><strong>Browser:</strong> {testResults.environment.userAgent}</li>
                  <li><strong>Viewport:</strong> {testResults.environment.viewport}</li>
                  <li><strong>Data Records:</strong> {testResults.environment.dataRecords}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPanel;
