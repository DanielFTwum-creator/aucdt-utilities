import { TestSuiteResult } from '../test-runner.js';

// This module will attempt to run real Puppeteer tests if a browser is available
// Otherwise, it will throw an error and fallback to mock results

export async function execTests(): Promise<TestSuiteResult[]> {
  // Try to import puppeteer-core
  try {
    const puppeteerTests = await import('./puppeteer-tests.js');
    return await puppeteerTests.runPuppeteerTests();
  } catch (error) {
    console.log('Puppeteer browser not available, using fallback mode');
    throw new Error('Browser not available - using mock results');
  }
}
