import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader,
  Download,
  Camera,
  RotateCcw,
  Zap
} from 'lucide-react';
import { testSuite, TestResult } from '@/utils/testSuite';

export const TestingTab: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [screenshotPath, setScreenshotPath] = useState<string>('');

  const categories = ['all', 'component', 'data', 'functionality', 'accessibility', 'performance'];

  const handleRunAllTests = async () => {
    setIsRunning(true);
    try {
      const testResults = await testSuite.runAllTests();
      setResults(testResults);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunByCategory = async (category: string) => {
    setIsRunning(true);
    try {
      if (category === 'all') {
        const testResults = await testSuite.runAllTests();
        setResults(testResults);
      } else {
        const testResults = await testSuite.runTestsByCategory(category as any);
        setResults(testResults);
      }
      setSelectedCategory(category);
    } finally {
      setIsRunning(false);
    }
  };

  const handleTakeScreenshot = async () => {
    try {
      // Use html2canvas for client-side screenshot
      const html2canvas = (await import('html2canvas')).default;
      const element = document.documentElement;
      const canvas = await html2canvas(element);
      const image = canvas.toDataURL('image/png');
      setScreenshotPath(image);
      setShowScreenshot(true);

      // Log screenshot capture
      const timestamp = new Date().toISOString();
      console.log(`Screenshot captured at ${timestamp}`);
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      alert('Screenshot capture requires html2canvas library');
    }
  };

  const handleExportResults = (format: 'json' | 'csv') => {
    const content = format === 'json' ? testSuite.exportAsJSON() : testSuite.exportAsCSV();
    const filename = `test-results-${Date.now()}.${format}`;
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearResults = () => {
    setResults([]);
    testSuite.clearResults();
  };

  const summary = testSuite.getSummary();
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const warnings = results.filter(r => r.status === 'warning').length;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Test Suite & Diagnostics</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleTakeScreenshot}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Screenshot
          </Button>
        </div>
      </div>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Test Execution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleRunAllTests}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning && <Loader className="w-4 h-4 animate-spin" />}
              Run All Tests
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                onClick={() => handleRunByCategory(cat)}
                disabled={isRunning}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>

          {results.length > 0 && (
            <div className="flex gap-2">
              <Button
                onClick={() => handleExportResults('json')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </Button>
              <Button
                onClick={() => handleExportResults('csv')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button
                onClick={handleClearResults}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Clear Results
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Summary */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold">{results.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Passed</p>
                <p className="text-2xl font-bold text-green-600">{passed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                <p className="text-2xl font-bold text-red-600">{failed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">{warnings}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pass Rate</p>
                <p className="text-2xl font-bold">{summary.passRate.toFixed(1)}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${summary.passRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map(result => (
                <div
                  key={result.testId}
                  className={`p-3 border rounded-lg ${
                    result.status === 'passed'
                      ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                      : result.status === 'failed'
                      ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                      : result.status === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {result.status === 'passed' && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                        {result.status === 'failed' && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        {result.status === 'warning' && (
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        )}
                        <span className="font-medium text-sm">{result.testName}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {result.message || result.error || 'No additional details'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Duration: {result.duration.toFixed(2)}ms
                      </p>
                    </div>
                    <Badge
                      variant={
                        result.status === 'passed'
                          ? 'default'
                          : result.status === 'failed'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {result.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Screenshot Modal */}
      {showScreenshot && screenshotPath && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-2xl max-h-96 overflow-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Screenshot</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowScreenshot(false)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent>
              <img src={screenshotPath} alt="Dashboard screenshot" className="w-full" />
            </CardContent>
          </Card>
        </div>
      )}

      {results.length === 0 && !isRunning && (
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            No test results yet. Click "Run All Tests" to start testing the dashboard.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TestingTab;
