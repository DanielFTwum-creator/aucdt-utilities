import puppeteer, { Browser, Page } from 'puppeteer';

export interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshot?: string;
  steps?: string[];
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  totalDuration: number;
  passed: number;
  failed: number;
  skipped: number;
}

export class PuppeteerTestSuite {
  private browser: Browser | null = null;
  private baseUrl: string;
  private results: TestResult[] = [];

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async setup(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
      });
    } catch (error) {
      // Fallback to bundled Chrome if system Chrome not found
      try {
        this.browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
          ],
        });
      } catch (fallbackError) {
        throw new Error(`Failed to launch browser: ${error}`);
      }
    }
  }

  async teardown(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }

  private async captureScreenshot(page: Page): Promise<string> {
    const screenshot = await page.screenshot({ encoding: 'base64', fullPage: true });
    return `data:image/png;base64,${screenshot}`;
  }

  private async runTest(
    name: string,
    testFn: (page: Page) => Promise<{ steps: string[] }>
  ): Promise<TestResult> {
    const startTime = Date.now();
    const steps: string[] = [];

    if (!this.browser) {
      return {
        name,
        status: 'skipped',
        duration: 0,
        error: 'Browser not initialized',
      };
    }

    let page: Page | null = null;

    try {
      page = await this.browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      const result = await testFn(page);
      steps.push(...result.steps);

      const screenshot = await this.captureScreenshot(page);
      const duration = Date.now() - startTime;

      return {
        name,
        status: 'passed',
        duration,
        screenshot,
        steps,
      };
    } catch (error) {
      const screenshot = page ? await this.captureScreenshot(page) : undefined;
      const duration = Date.now() - startTime;

      return {
        name,
        status: 'failed',
        duration,
        error: error instanceof Error ? error.message : String(error),
        screenshot,
        steps,
      };
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async testPageLoad(): Promise<TestResult> {
    return this.runTest('Page Load Test', async (page) => {
      const steps: string[] = [];

      steps.push(`Navigating to ${this.baseUrl}`);
      await page.goto(this.baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });

      steps.push('Waiting for page title');
      const title = await page.title();
      if (!title) {
        throw new Error('Page title is empty');
      }
      steps.push(`Page title found: "${title}"`);

      steps.push('Checking for ThesisAI logo');
      const logo = await page.$('text=ThesisAI');
      if (!logo) {
        throw new Error('ThesisAI logo not found on page');
      }
      steps.push('ThesisAI logo verified');

      return { steps };
    });
  }

  async testHeaderNavigation(): Promise<TestResult> {
    return this.runTest('Header Navigation Test', async (page) => {
      const steps: string[] = [];

      steps.push(`Navigating to ${this.baseUrl}`);
      await page.goto(this.baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });

      steps.push('Checking Features link');
      const featuresLink = await page.$('a[href="#features"]');
      if (!featuresLink) {
        throw new Error('Features link not found');
      }
      steps.push('Features link found');

      steps.push('Checking About link');
      const aboutLink = await page.$('a[href="#about"]');
      if (!aboutLink) {
        throw new Error('About link not found');
      }
      steps.push('About link found');

      steps.push('Clicking Features link');
      await featuresLink.click();
      await page.waitForTimeout(500);
      steps.push('Features link clicked successfully');

      return { steps };
    });
  }

  async testHeroSection(): Promise<TestResult> {
    return this.runTest('Hero Section Test', async (page) => {
      const steps: string[] = [];

      steps.push(`Navigating to ${this.baseUrl}`);
      await page.goto(this.baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });

      steps.push('Verifying main heading');
      const heading = await page.$eval('h2', el => el.textContent);
      if (!heading || !heading.includes('AI-Powered Thesis Assessment')) {
        throw new Error('Main heading not found or incorrect');
      }
      steps.push(`Main heading verified: "${heading}"`);

      steps.push('Checking for Start Assessment button');
      const button = await page.$('button:has-text("Start Assessment")');
      if (!button) {
        throw new Error('Start Assessment button not found');
      }
      steps.push('Start Assessment button found');

      steps.push('Clicking Start Assessment button');
      await button.click();
      await page.waitForTimeout(500);
      steps.push('Start Assessment button clicked successfully');

      return { steps };
    });
  }

  async testFeatureCards(): Promise<TestResult> {
    return this.runTest('Feature Cards Test', async (page) => {
      const steps: string[] = [];

      steps.push(`Navigating to ${this.baseUrl}`);
      await page.goto(this.baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });

      steps.push('Scrolling to features section');
      await page.evaluate(() => {
        document.querySelector('#features')?.scrollIntoView();
      });
      await page.waitForTimeout(500);
      steps.push('Scrolled to features section');

      steps.push('Checking for Document Analysis card');
      const docAnalysis = await page.$('text=Document Analysis');
      if (!docAnalysis) {
        throw new Error('Document Analysis card not found');
      }
      steps.push('Document Analysis card found');

      steps.push('Checking for AI Evaluation card');
      const aiEval = await page.$('text=AI Evaluation');
      if (!aiEval) {
        throw new Error('AI Evaluation card not found');
      }
      steps.push('AI Evaluation card found');

      steps.push('Checking for Detailed Feedback card');
      const feedback = await page.$('text=Detailed Feedback');
      if (!feedback) {
        throw new Error('Detailed Feedback card not found');
      }
      steps.push('Detailed Feedback card found');

      steps.push('Verifying feature cards layout');
      const featuresSection = await page.$('#features');
      if (featuresSection) {
        const classes = await page.evaluate(el => el?.className, featuresSection);
        if (!classes.includes('grid')) {
          throw new Error('Features section does not have grid layout');
        }
        steps.push('Feature cards layout verified');
      }

      return { steps };
    });
  }

  async testResponsiveDesign(): Promise<TestResult> {
    return this.runTest('Responsive Design Test', async (page) => {
      const steps: string[] = [];

      // Test mobile viewport
      steps.push('Setting viewport to mobile (375x667)');
      await page.setViewport({ width: 375, height: 667 });

      steps.push(`Navigating to ${this.baseUrl}`);
      await page.goto(this.baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });
      steps.push('Mobile viewport loaded successfully');

      // Test tablet viewport
      steps.push('Setting viewport to tablet (768x1024)');
      await page.setViewport({ width: 768, height: 1024 });
      await page.reload({ waitUntil: 'networkidle0' });
      steps.push('Tablet viewport loaded successfully');

      // Test desktop viewport
      steps.push('Setting viewport to desktop (1920x1080)');
      await page.setViewport({ width: 1920, height: 1080 });
      await page.reload({ waitUntil: 'networkidle0' });
      steps.push('Desktop viewport loaded successfully');

      return { steps };
    });
  }

  async testAccessibility(): Promise<TestResult> {
    return this.runTest('Accessibility Test', async (page) => {
      const steps: string[] = [];

      steps.push(`Navigating to ${this.baseUrl}`);
      await page.goto(this.baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });

      steps.push('Checking for semantic HTML elements');
      const header = await page.$('header');
      const main = await page.$('main');
      const footer = await page.$('footer');
      const nav = await page.$('nav');

      if (!header || !main || !footer || !nav) {
        throw new Error('Missing semantic HTML elements');
      }
      steps.push('All semantic HTML elements found');

      steps.push('Verifying heading hierarchy');
      const h1 = await page.$('h1');
      const h2 = await page.$('h2');
      if (!h1 || !h2) {
        throw new Error('Heading hierarchy incomplete');
      }
      steps.push('Heading hierarchy verified');

      steps.push('Checking button accessibility');
      const buttons = await page.$$('button');
      if (buttons.length === 0) {
        throw new Error('No buttons found on page');
      }
      steps.push(`Found ${buttons.length} accessible buttons`);

      return { steps };
    });
  }

  async testPerformance(): Promise<TestResult> {
    return this.runTest('Performance Test', async (page) => {
      const steps: string[] = [];

      steps.push('Enabling performance tracking');
      await page.evaluateOnNewDocument(() => {
        (window as any).performance.mark('start');
      });

      steps.push(`Navigating to ${this.baseUrl}`);
      const startTime = Date.now();
      await page.goto(this.baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });
      const loadTime = Date.now() - startTime;

      steps.push(`Page loaded in ${loadTime}ms`);

      if (loadTime > 5000) {
        throw new Error(`Page load time (${loadTime}ms) exceeds threshold (5000ms)`);
      }
      steps.push('Performance test passed');

      steps.push('Checking for Cumulative Layout Shift');
      const cls = await page.evaluate(() => {
        return new Promise((resolve) => {
          let cls = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                cls += (entry as any).value;
              }
            }
          });
          observer.observe({ type: 'layout-shift', buffered: true });

          setTimeout(() => {
            observer.disconnect();
            resolve(cls);
          }, 1000);
        });
      });
      steps.push(`Cumulative Layout Shift: ${cls}`);

      return { steps };
    });
  }

  async runAllTests(): Promise<TestSuite> {
    const startTime = Date.now();

    await this.setup();

    const testResults = await Promise.all([
      this.testPageLoad(),
      this.testHeaderNavigation(),
      this.testHeroSection(),
      this.testFeatureCards(),
      this.testResponsiveDesign(),
      this.testAccessibility(),
      this.testPerformance(),
    ]);

    await this.teardown();

    const totalDuration = Date.now() - startTime;
    const passed = testResults.filter(r => r.status === 'passed').length;
    const failed = testResults.filter(r => r.status === 'failed').length;
    const skipped = testResults.filter(r => r.status === 'skipped').length;

    return {
      name: 'ThesisAI Critical User Journeys',
      tests: testResults,
      totalDuration,
      passed,
      failed,
      skipped,
    };
  }
}
