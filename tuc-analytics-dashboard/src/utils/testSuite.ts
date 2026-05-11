/**
 * Self-Testing Framework
 * Built-in testing capabilities for the dashboard
 */

export interface TestCase {
  id: string;
  name: string;
  description: string;
  testFn: () => Promise<TestResult>;
  category: 'component' | 'data' | 'functionality' | 'accessibility' | 'performance';
  severity: 'critical' | 'major' | 'minor';
}

export interface TestResult {
  testId: string;
  testName: string;
  status: 'passed' | 'failed' | 'skipped' | 'warning';
  duration: number;
  message?: string;
  error?: string;
  details?: Record<string, unknown>;
}

export class TestSuite {
  private tests: Map<string, TestCase> = new Map();
  private results: TestResult[] = [];
  private isRunning: boolean = false;

  /**
   * Register a new test case
   */
  public registerTest(test: TestCase): void {
    this.tests.set(test.id, test);
  }

  /**
   * Register multiple test cases
   */
  public registerTests(tests: TestCase[]): void {
    tests.forEach(test => this.registerTest(test));
  }

  /**
   * Run all registered tests
   */
  public async runAllTests(): Promise<TestResult[]> {
    if (this.isRunning) {
      console.warn('Tests are already running');
      return this.results;
    }

    this.isRunning = true;
    this.results = [];

    const tests = Array.from(this.tests.values());
    console.log(`Starting test run with ${tests.length} tests...`);

    for (const test of tests) {
      const result = await this.runTest(test);
      this.results.push(result);
    }

    this.isRunning = false;
    return this.results;
  }

  /**
   * Run tests by category
   */
  public async runTestsByCategory(category: TestCase['category']): Promise<TestResult[]> {
    const categoryTests = Array.from(this.tests.values()).filter(t => t.category === category);
    const results: TestResult[] = [];

    for (const test of categoryTests) {
      const result = await this.runTest(test);
      results.push(result);
    }

    return results;
  }

  /**
   * Run a single test
   */
  public async runTest(test: TestCase): Promise<TestResult> {
    const startTime = performance.now();

    try {
      const result = await test.testFn();
      const duration = performance.now() - startTime;

      return {
        testId: test.id,
        testName: test.name,
        status: result.status,
        duration,
        message: result.message,
        details: result.details
      };
    } catch (error) {
      const duration = performance.now() - startTime;

      return {
        testId: test.id,
        testName: test.name,
        status: 'failed',
        duration,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Get all test results
   */
  public getResults(): TestResult[] {
    return this.results;
  }

  /**
   * Get results by status
   */
  public getResultsByStatus(status: TestResult['status']): TestResult[] {
    return this.results.filter(r => r.status === status);
  }

  /**
   * Get test summary
   */
  public getSummary() {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    return {
      total: this.results.length,
      passed,
      failed,
      skipped,
      warnings,
      passRate: this.results.length > 0 ? (passed / this.results.length) * 100 : 0,
      totalDuration,
      success: failed === 0
    };
  }

  /**
   * Export results as JSON
   */
  public exportAsJSON(): string {
    return JSON.stringify({
      summary: this.getSummary(),
      results: this.results,
      timestamp: new Date().toISOString()
    }, null, 2);
  }

  /**
   * Export results as CSV
   */
  public exportAsCSV(): string {
    const headers = ['Test ID', 'Test Name', 'Status', 'Duration (ms)', 'Message', 'Error'];
    const rows = this.results.map(r => [
      r.testId,
      r.testName,
      r.status,
      r.duration.toFixed(2),
      r.message || '',
      r.error || ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    return csv;
  }

  /**
   * Clear all results
   */
  public clearResults(): void {
    this.results = [];
  }

  /**
   * Get registered tests
   */
  public getTests(): TestCase[] {
    return Array.from(this.tests.values());
  }
}

// Create and export singleton instance
export const testSuite = new TestSuite();

// Helper function to create a test case
export function createTest(
  name: string,
  description: string,
  testFn: () => Promise<TestResult>,
  category: TestCase['category'] = 'functionality',
  severity: TestCase['severity'] = 'major'
): TestCase {
  return {
    id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    testFn,
    category,
    severity
  };
}
