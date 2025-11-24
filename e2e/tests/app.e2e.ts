import { Page } from 'puppeteer-core';
import { launchBrowser, takeScreenshot, TestResult, TestSuite } from '../puppeteer.config';

const BASE_URL = process.env.VITE_TEST_URL || 'http://localhost:3000';

export async function runE2ETests(): Promise<TestSuite> {
  const testSuite: TestSuite = {
    name: 'ThesisAI E2E Test Suite',
    tests: [],
    totalDuration: 0,
    passed: 0,
    failed: 0,
  };

  const { browser, chrome } = await launchBrowser();
  const startTime = Date.now();

  try {
    const page = await browser.newPage();

    // Test 1: Page loads successfully
    await runTest(testSuite, page, 'Page loads successfully', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const title = await page.title();
      if (!title) throw new Error('Page title is empty');
    });

    // Test 2: Header elements are visible
    await runTest(testSuite, page, 'Header elements are visible', async () => {
      await page.waitForSelector('header');
      const logoText = await page.$eval('h1', el => el.textContent);
      if (logoText !== 'ThesisAI') throw new Error(`Expected "ThesisAI", got "${logoText}"`);

      const featuresLink = await page.$('a[href="#features"]');
      const aboutLink = await page.$('a[href="#about"]');
      if (!featuresLink || !aboutLink) throw new Error('Navigation links not found');
    });

    // Test 3: Hero section displays correctly
    await runTest(testSuite, page, 'Hero section displays correctly', async () => {
      const heading = await page.$eval('h2', el => el.textContent);
      if (!heading?.includes('AI-Powered Thesis Assessment')) {
        throw new Error('Hero heading not found');
      }

      const startButton = await page.$('button::-p-text(Start Assessment)');
      if (!startButton) throw new Error('Start Assessment button not found');
    });

    // Test 4: Feature cards are rendered
    await runTest(testSuite, page, 'Three feature cards are rendered', async () => {
      await page.waitForSelector('#features');
      const cards = await page.$$('#features > div > div');
      if (cards.length !== 3) {
        throw new Error(`Expected 3 feature cards, found ${cards.length}`);
      }

      const titles = await Promise.all(
        cards.map(card => card.$eval('h3', el => el.textContent))
      );

      const expectedTitles = ['Document Analysis', 'AI Evaluation', 'Detailed Feedback'];
      expectedTitles.forEach(title => {
        if (!titles.includes(title)) {
          throw new Error(`Feature card "${title}" not found`);
        }
      });
    });

    // Test 5: Navigation links work
    await runTest(testSuite, page, 'Navigation to features section works', async () => {
      const featuresLink = await page.$('a[href="#features"]');
      await featuresLink?.click();
      await page.waitForTimeout(500);

      // Check if features section is in view
      const isVisible = await page.$eval('#features', el => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight;
      });

      if (!isVisible) throw new Error('Features section not scrolled into view');
    });

    // Test 6: Buttons are clickable
    await runTest(testSuite, page, 'Start Assessment button is clickable', async () => {
      const button = await page.$('button::-p-text(Start Assessment)');
      if (!button) throw new Error('Start Assessment button not found');

      await button.click();
      await page.waitForTimeout(300);

      // Verify button still exists (no navigation yet)
      const buttonStillExists = await page.$('button::-p-text(Start Assessment)');
      if (!buttonStillExists) throw new Error('Button disappeared after click');
    });

    // Test 7: Responsive design - Mobile view
    await runTest(testSuite, page, 'Responsive design works on mobile', async () => {
      await page.setViewport({ width: 375, height: 667 });
      await page.reload({ waitUntil: 'networkidle0' });

      const header = await page.$('header');
      if (!header) throw new Error('Header not found in mobile view');

      // Check that feature cards stack vertically
      await page.waitForSelector('#features');
      const featuresGrid = await page.$('#features');
      if (!featuresGrid) throw new Error('Features grid not found');
    });

    // Test 8: Footer is present
    await runTest(testSuite, page, 'Footer displays copyright information', async () => {
      await page.setViewport({ width: 1280, height: 720 });
      await page.reload({ waitUntil: 'networkidle0' });

      const footer = await page.$('footer');
      if (!footer) throw new Error('Footer not found');

      const copyrightText = await footer.$eval('p', el => el.textContent);
      if (!copyrightText?.includes('2025 ThesisAI')) {
        throw new Error('Copyright text not found');
      }
    });

    // Test 9: Animations are present
    await runTest(testSuite, page, 'Page animations are present', async () => {
      await page.reload({ waitUntil: 'networkidle0' });

      // Wait for framer-motion animations
      await page.waitForTimeout(1000);

      const mainSection = await page.$('main > div');
      if (!mainSection) throw new Error('Main section not found');
    });

    // Test 10: Get Started button in header
    await runTest(testSuite, page, 'Get Started button in header works', async () => {
      const getStartedButton = await page.$('header button::-p-text(Get Started)');
      if (!getStartedButton) throw new Error('Get Started button not found');

      await getStartedButton.click();
      await page.waitForTimeout(300);
    });

    await page.close();
  } catch (error) {
    console.error('Test suite error:', error);
  } finally {
    await browser.close();
    await chrome.kill();
  }

  testSuite.totalDuration = Date.now() - startTime;
  return testSuite;
}

async function runTest(
  suite: TestSuite,
  page: Page,
  name: string,
  testFn: () => Promise<void>
): Promise<void> {
  const result: TestResult = {
    name,
    status: 'running',
  };

  suite.tests.push(result);
  const startTime = Date.now();

  try {
    await testFn();
    result.status = 'passed';
    result.duration = Date.now() - startTime;
    suite.passed++;

    // Take screenshot on success
    try {
      result.screenshot = await takeScreenshot(page);
    } catch (e) {
      // Screenshot failed, continue anyway
    }
  } catch (error) {
    result.status = 'failed';
    result.duration = Date.now() - startTime;
    result.error = error instanceof Error ? error.message : 'Unknown error';
    suite.failed++;

    // Take screenshot on failure
    try {
      result.screenshot = await takeScreenshot(page);
    } catch (e) {
      // Screenshot failed, continue anyway
    }
  }
}
