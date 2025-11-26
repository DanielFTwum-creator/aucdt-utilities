import express, { Request, Response } from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PuppeteerTestRunner, TestSuite, TestResult } from './test-runner.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Serve screenshots statically
app.use('/screenshots', express.static(join(process.cwd(), 'e2e/screenshots')));

// In-memory storage for test results
let lastTestSuite: TestSuite | null = null;
let isTestRunning = false;

// WebSocket clients for real-time updates
const wsClients: Set<WebSocket> = new Set();

// Broadcast message to all connected WebSocket clients
function broadcast(data: any) {
  const message = JSON.stringify(data);
  wsClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// API Routes

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * GET /api/test/status
 * Get current test execution status
 */
app.get('/api/test/status', (req: Request, res: Response) => {
  res.json({
    isRunning: isTestRunning,
    lastRun: lastTestSuite?.startTime || null,
  });
});

/**
 * GET /api/test/results
 * Get the latest test suite results
 */
app.get('/api/test/results', (req: Request, res: Response) => {
  if (!lastTestSuite) {
    return res.status(404).json({ error: 'No test results available' });
  }
  res.json(lastTestSuite);
});

/**
 * POST /api/test/run
 * Trigger a new test run
 */
app.post('/api/test/run', async (req: Request, res: Response) => {
  if (isTestRunning) {
    return res.status(409).json({
      error: 'Tests are already running',
      message: 'Please wait for the current test run to complete',
    });
  }

  // Start test run asynchronously
  res.json({
    message: 'Test run initiated',
    timestamp: new Date().toISOString(),
  });

  // Run tests in background
  runTests().catch((error) => {
    console.error('Test run failed:', error);
    broadcast({
      type: 'error',
      error: error.message,
    });
  });
});

/**
 * GET /api/test/screenshot/:filename
 * Get a specific screenshot
 */
app.get('/api/test/screenshot/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  const filepath = join(process.cwd(), 'e2e/screenshots', filename);

  try {
    const image = readFileSync(filepath);
    res.contentType('image/png');
    res.send(image);
  } catch (error) {
    res.status(404).json({ error: 'Screenshot not found' });
  }
});

/**
 * Run the test suite and broadcast progress
 */
async function runTests() {
  isTestRunning = true;

  broadcast({
    type: 'test-started',
    timestamp: new Date().toISOString(),
  });

  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const runner = new PuppeteerTestRunner(baseUrl);

    // Create a modified runner that broadcasts individual test results
    await runner.initialize();

    const suite: TestSuite = {
      id: `test-suite-${Date.now()}`,
      name: 'ThesisAI E2E Test Suite',
      tests: [],
      startTime: new Date().toISOString(),
    };

    // Define test functions
    const tests = [
      {
        id: 'test-01-page-load',
        name: 'Page Load and Basic Rendering',
        fn: async (page: any) => {
          await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
          const heading = await page.$('h2');
          if (!heading) throw new Error('Main heading not found');
          const headingText = await page.evaluate((el: any) => el?.textContent, heading);
          if (!headingText?.includes('AI-Powered Thesis Assessment')) {
            throw new Error('Incorrect heading text');
          }
        },
      },
      {
        id: 'test-02-header-navigation',
        name: 'Header Navigation Elements',
        fn: async (page: any) => {
          await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
          const logo = await page.$('svg');
          if (!logo) throw new Error('Logo icon not found');
          const featuresLink = await page.$('a[href="#features"]');
          const aboutLink = await page.$('a[href="#about"]');
          if (!featuresLink || !aboutLink) {
            throw new Error('Navigation links not found');
          }
        },
      },
      {
        id: 'test-03-hero-section',
        name: 'Hero Section Interaction',
        fn: async (page: any) => {
          await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
          const description = await page.evaluate(() => {
            const paragraphs = Array.from(document.querySelectorAll('p'));
            return paragraphs.find((p: any) =>
              p.textContent?.includes('Streamline your academic evaluation')
            );
          });
          if (!description) throw new Error('Hero description not found');
        },
      },
      {
        id: 'test-04-features-grid',
        name: 'Features Grid Display',
        fn: async (page: any) => {
          await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
          await page.waitForSelector('[id="features"]', { timeout: 5000 });
          const featureCards = await page.$$('[class*="backdrop-blur"]');
          if (featureCards.length < 3) {
            throw new Error(`Expected 3 feature cards, found ${featureCards.length}`);
          }
        },
      },
      {
        id: 'test-05-responsive-mobile',
        name: 'Responsive Design - Mobile',
        fn: async (page: any) => {
          await page.setViewport({ width: 375, height: 667 });
          await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
          const heading = await page.$('h2');
          if (!heading) throw new Error('Heading not visible on mobile');
        },
      },
      {
        id: 'test-06-responsive-tablet',
        name: 'Responsive Design - Tablet',
        fn: async (page: any) => {
          await page.setViewport({ width: 768, height: 1024 });
          await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
          const featuresSection = await page.$('[id="features"]');
          if (!featuresSection) throw new Error('Features section not found');
        },
      },
      {
        id: 'test-07-animations',
        name: 'Framer Motion Animations',
        fn: async (page: any) => {
          await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
          await page.waitForTimeout(1000);
          const heroOpacity = await page.evaluate(() => {
            const hero = document.querySelector('h2');
            return hero ? window.getComputedStyle(hero).opacity : '0';
          });
          if (parseFloat(heroOpacity) < 0.9) {
            throw new Error('Hero animation did not complete');
          }
        },
      },
      {
        id: 'test-08-footer',
        name: 'Footer Display and Content',
        fn: async (page: any) => {
          await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(500);
          const footerText = await page.evaluate(() => {
            const footer = document.querySelector('footer');
            return footer?.textContent;
          });
          if (!footerText?.includes('2025') || !footerText?.includes('ThesisAI')) {
            throw new Error('Footer content incorrect');
          }
        },
      },
      {
        id: 'test-09-keyboard-navigation',
        name: 'Accessibility - Keyboard Navigation',
        fn: async (page: any) => {
          await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
          await page.keyboard.press('Tab');
          await page.keyboard.press('Tab');
          const hasFocus = await page.evaluate(() => {
            return document.activeElement !== document.body;
          });
          if (!hasFocus) {
            throw new Error('Keyboard navigation not working properly');
          }
        },
      },
      {
        id: 'test-10-performance',
        name: 'Performance - Page Load Time',
        fn: async (page: any) => {
          const startTime = Date.now();
          await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 15000 });
          const loadTime = Date.now() - startTime;
          if (loadTime > 5000) {
            throw new Error(`Page load time too slow: ${loadTime}ms`);
          }
        },
      },
    ];

    // Run each test and broadcast results
    for (const test of tests) {
      broadcast({
        type: 'test-running',
        testId: test.id,
        testName: test.name,
      });

      const result = await runner.runTest(test.id, test.name, test.fn);
      suite.tests.push(result);

      broadcast({
        type: 'test-completed',
        result,
      });
    }

    await runner.cleanup();

    suite.endTime = new Date().toISOString();
    suite.totalDuration = suite.tests.reduce((sum, test) => sum + (test.duration || 0), 0);

    lastTestSuite = suite;

    broadcast({
      type: 'test-suite-completed',
      suite,
    });
  } catch (error) {
    console.error('Test execution error:', error);
    broadcast({
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    isTestRunning = false;
  }
}

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`Test runner server listening on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});

// WebSocket server for real-time updates
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log('WebSocket client connected');
  wsClients.add(ws);

  // Send current status on connection
  ws.send(
    JSON.stringify({
      type: 'connected',
      isRunning: isTestRunning,
      lastSuite: lastTestSuite,
    })
  );

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    wsClients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    wsClients.delete(ws);
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  wss.close(() => {
    server.close(() => {
      process.exit(0);
    });
  });
});

export default app;
