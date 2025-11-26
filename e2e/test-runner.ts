import puppeteer, { Browser, Page } from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration?: number;
  error?: string;
  screenshot?: string;
  timestamp: string;
}

export interface TestSuite {
  id: string;
  name: string;
  tests: TestResult[];
  startTime?: string;
  endTime?: string;
  totalDuration?: number;
}

export class PuppeteerTestRunner {
  private browser: Browser | null = null;
  private baseUrl: string;
  private screenshotDir: string;

  constructor(baseUrl: string = 'http://localhost:3000', screenshotDir: string = './e2e/screenshots') {
    this.baseUrl = baseUrl;
    this.screenshotDir = screenshotDir;

    // Create screenshot directory if it doesn't exist
    try {
      mkdirSync(this.screenshotDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create screenshot directory:', error);
    }
  }

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private async takeScreenshot(page: Page, testId: string): Promise<string> {
    const filename = `${testId}-${Date.now()}.png`;
    const filepath = join(this.screenshotDir, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    return filename;
  }

  async runTest(
    testId: string,
    testName: string,
    testFn: (page: Page) => Promise<void>
  ): Promise<TestResult> {
    const startTime = Date.now();
    const result: TestResult = {
      id: testId,
      name: testName,
      status: 'running',
      timestamp: new Date().toISOString(),
    };

    if (!this.browser) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    const page = await this.browser.newPage();

    try {
      // Set viewport
      await page.setViewport({ width: 1280, height: 720 });

      // Run the test
      await testFn(page);

      // Take success screenshot
      const screenshot = await this.takeScreenshot(page, `${testId}-success`);

      result.status = 'passed';
      result.screenshot = screenshot;
      result.duration = Date.now() - startTime;
    } catch (error) {
      // Take failure screenshot
      const screenshot = await this.takeScreenshot(page, `${testId}-failure`);

      result.status = 'failed';
      result.error = error instanceof Error ? error.message : String(error);
      result.screenshot = screenshot;
      result.duration = Date.now() - startTime;
    } finally {
      await page.close();
    }

    return result;
  }

  async runAllTests(): Promise<TestSuite> {
    const suite: TestSuite = {
      id: `test-suite-${Date.now()}`,
      name: 'ThesisAI E2E Test Suite',
      tests: [],
      startTime: new Date().toISOString(),
    };

    try {
      await this.initialize();

      // Test 1: Page Load and Basic Rendering
      const test1 = await this.runTest(
        'test-01-page-load',
        'Page Load and Basic Rendering',
        async (page) => {
          await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });

          // Check for main heading
          const heading = await page.$('h2');
          if (!heading) throw new Error('Main heading not found');

          const headingText = await page.evaluate(el => el?.textContent, heading);
          if (!headingText?.includes('AI-Powered Thesis Assessment')) {
            throw new Error('Incorrect heading text');
          }
        }
      );
      suite.tests.push(test1);

      // Test 2: Header Navigation Elements
      const test2 = await this.runTest(
        'test-02-header-navigation',
        'Header Navigation Elements',
        async (page) => {
          await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });

          // Check for logo
          const logo = await page.$('svg');
          if (!logo) throw new Error('Logo icon not found');

          // Check for navigation links
          const featuresLink = await page.$('a[href="#features"]');
          const aboutLink = await page.$('a[href="#about"]');

          if (!featuresLink || !aboutLink) {
            throw new Error('Navigation links not found');
          }

          // Check for "Get Started" button
          const getStartedBtn = await page.$('button:has-text("Get Started")');
          if (!getStartedBtn) {
            // Alternative selector
            const buttons = await page.$$('button');
            const hasGetStarted = await Promise.all(
              buttons.map(btn => page.evaluate(el => el.textContent, btn))
            );
            if (!hasGetStarted.some(text => text?.includes('Get Started'))) {
              throw new Error('Get Started button not found');
            }
          }
        }
      );
      suite.tests.push(test2);

      // Test 3: Hero Section Interaction
      const test3 = await this.runTest(
        'test-03-hero-section',
        'Hero Section Interaction',
        async (page) => {
          await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });

          // Check for hero description
          const description = await page.evaluate(() => {
            const paragraphs = Array.from(document.querySelectorAll('p'));
            return paragraphs.find(p =>
              p.textContent?.includes('Streamline your academic evaluation')
            );
          });

          if (!description) throw new Error('Hero description not found');

          // Check for "Start Assessment" button
          const startBtn = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.find(btn => btn.textContent?.includes('Start Assessment'));
          });

          if (!startBtn) throw new Error('Start Assessment button not found');
        }
      );
      suite.tests.push(test3);

      // Test 4: Features Grid
      const test4 = await this.runTest(
        'test-04-features-grid',
        'Features Grid Display',
        async (page) => {
          await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });

          // Wait for features section
          await page.waitForSelector('[id="features"]', { timeout: 5000 });

          // Check for feature cards (should be 3)
          const featureCards = await page.$$('[class*="backdrop-blur"]');

          if (featureCards.length < 3) {
            throw new Error(`Expected 3 feature cards, found ${featureCards.length}`);
          }

          // Check for feature titles
          const titles = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('h3')).map(h3 => h3.textContent);
          });

          const expectedTitles = ['Document Analysis', 'AI Evaluation', 'Detailed Feedback'];
          const hasAllTitles = expectedTitles.every(title =>
            titles.some(t => t?.includes(title))
          );

          if (!hasAllTitles) {
            throw new Error('Not all expected feature titles found');
          }
        }
      );
      suite.tests.push(test4);

      // Test 5: Responsive Design (Mobile)
      const test5 = await this.runTest(
        'test-05-responsive-mobile',
        'Responsive Design - Mobile',
        async (page) => {
          await page.setViewport({ width: 375, height: 667 }); // iPhone SE
          await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });

          // Check if content is still visible
          const heading = await page.$('h2');
          if (!heading) throw new Error('Heading not visible on mobile');

          // Check if buttons are accessible
          const buttons = await page.$$('button');
          if (buttons.length < 2) {
            throw new Error('Buttons not properly rendered on mobile');
          }
        }
      );
      suite.tests.push(test5);

      // Test 6: Responsive Design (Tablet)
      const test6 = await this.runTest(
        'test-06-responsive-tablet',
        'Responsive Design - Tablet',
        async (page) => {
          await page.setViewport({ width: 768, height: 1024 }); // iPad
          await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });

          // Check grid layout
          const featuresSection = await page.$('[id="features"]');
          if (!featuresSection) throw new Error('Features section not found');

          // Verify cards are visible
          const cards = await page.$$('[class*="backdrop-blur"]');
          if (cards.length < 3) {
            throw new Error('Feature cards not properly displayed on tablet');
          }
        }
      );
      suite.tests.push(test6);

      // Test 7: Animation Rendering
      const test7 = await this.runTest(
        'test-07-animations',
        'Framer Motion Animations',
        async (page) => {
          await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });

          // Wait for animations to complete
          await page.waitForTimeout(1000);

          // Check if elements have been animated (opacity should be 1)
          const heroOpacity = await page.evaluate(() => {
            const hero = document.querySelector('h2');
            return hero ? window.getComputedStyle(hero).opacity : '0';
          });

          if (parseFloat(heroOpacity) < 0.9) {
            throw new Error('Hero animation did not complete');
          }
        }
      );
      suite.tests.push(test7);

      // Test 8: Footer Display
      const test8 = await this.runTest(
        'test-08-footer',
        'Footer Display and Content',
        async (page) => {
          await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });

          // Scroll to footer
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(500);

          // Check for footer content
          const footerText = await page.evaluate(() => {
            const footer = document.querySelector('footer');
            return footer?.textContent;
          });

          if (!footerText?.includes('2025') || !footerText?.includes('ThesisAI')) {
            throw new Error('Footer content incorrect');
          }
        }
      );
      suite.tests.push(test8);

      // Test 9: Accessibility - Keyboard Navigation
      const test9 = await this.runTest(
        'test-09-keyboard-navigation',
        'Accessibility - Keyboard Navigation',
        async (page) => {
          await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });

          // Tab through elements
          await page.keyboard.press('Tab');
          await page.keyboard.press('Tab');

          // Check if an element has focus
          const hasFocus = await page.evaluate(() => {
            return document.activeElement !== document.body;
          });

          if (!hasFocus) {
            throw new Error('Keyboard navigation not working properly');
          }
        }
      );
      suite.tests.push(test9);

      // Test 10: Performance - Page Load Time
      const test10 = await this.runTest(
        'test-10-performance',
        'Performance - Page Load Time',
        async (page) => {
          const startTime = Date.now();
          await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 15000 });
          const loadTime = Date.now() - startTime;

          // Page should load within 5 seconds
          if (loadTime > 5000) {
            throw new Error(`Page load time too slow: ${loadTime}ms`);
          }
        }
      );
      suite.tests.push(test10);

    } finally {
      await this.cleanup();
    }

    suite.endTime = new Date().toISOString();
    suite.totalDuration = suite.tests.reduce((sum, test) => sum + (test.duration || 0), 0);

    return suite;
  }
}

// Export for use as module
export default PuppeteerTestRunner;
