import html2canvas from 'html2canvas';
import { TEST_SUITE, TestCase } from './testSuite';
import { auditService } from './auditService';

export interface TestResult {
  testId: string;
  passed: boolean;
  timestamp: number;
  screenshot?: string;
}

export const testRunner = {
  runAll: async (): Promise<TestResult[]> => {
    const results: TestResult[] = [];
    
    for (const test of TEST_SUITE) {
      console.log(`Running test: ${test.name}`);
      let passed = false;
      try {
        passed = await test.run();
      } catch (e) {
        console.error(`Test ${test.name} failed with error:`, e);
        passed = false;
      }

      let screenshot: string | undefined;
      try {
        const canvas = await html2canvas(document.body, { scale: 2 });
        screenshot = canvas.toDataURL('image/png');
      } catch (e) {
        console.error('Screenshot capture failed:', e);
      }

      const result: TestResult = {
        testId: test.id,
        passed,
        timestamp: Date.now(),
        screenshot
      };

      results.push(result);
      auditService.log('test_run', `Test ${test.name} ${passed ? 'PASSED' : 'FAILED'}`);
    }

    return results;
  }
};
