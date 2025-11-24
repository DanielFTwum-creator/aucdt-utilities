import { launch, Page, Browser } from 'puppeteer-core';
import * as chromeLauncher from 'chrome-launcher';

export interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'running';
  duration?: number;
  error?: string;
  screenshot?: string;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  totalDuration: number;
  passed: number;
  failed: number;
}

export async function launchBrowser(): Promise<{ browser: Browser; chrome: any }> {
  // Launch Chrome using chrome-launcher
  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });

  // Connect Puppeteer to the launched Chrome instance
  const browser = await launch({
    executablePath: chrome.path,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 720 },
  });

  return { browser, chrome };
}

export async function takeScreenshot(page: Page): Promise<string> {
  const screenshot = await page.screenshot({ encoding: 'base64', fullPage: true });
  return `data:image/png;base64,${screenshot}`;
}
