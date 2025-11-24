import express, { Request, Response } from 'express';
import cors from 'cors';
import { PuppeteerTestSuite, TestSuite } from './tests/critical-journeys.test';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Store test results
let latestTestResults: TestSuite | null = null;
let isTestRunning = false;

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get test status
app.get('/api/tests/status', (req: Request, res: Response) => {
  res.json({
    isRunning: isTestRunning,
    hasResults: latestTestResults !== null,
    timestamp: new Date().toISOString(),
  });
});

// Get latest test results
app.get('/api/tests/results', (req: Request, res: Response) => {
  if (!latestTestResults) {
    return res.status(404).json({
      error: 'No test results available',
      message: 'Please run tests first',
    });
  }

  res.json(latestTestResults);
});

// Run tests endpoint
app.post('/api/tests/run', async (req: Request, res: Response) => {
  if (isTestRunning) {
    return res.status(409).json({
      error: 'Tests already running',
      message: 'Please wait for the current test run to complete',
    });
  }

  // Start test run asynchronously
  isTestRunning = true;

  // Send immediate response
  res.json({
    message: 'Test run started',
    status: 'running',
    timestamp: new Date().toISOString(),
  });

  // Run tests in the background
  try {
    const baseUrl = req.body.baseUrl || 'http://localhost:3000';
    const testSuite = new PuppeteerTestSuite(baseUrl);
    const results = await testSuite.runAllTests();

    latestTestResults = results;
    console.log('Test run completed:', {
      passed: results.passed,
      failed: results.failed,
      skipped: results.skipped,
      duration: results.totalDuration,
    });
  } catch (error) {
    console.error('Test run failed:', error);
    latestTestResults = {
      name: 'ThesisAI Critical User Journeys',
      tests: [],
      totalDuration: 0,
      passed: 0,
      failed: 1,
      skipped: 0,
    };
  } finally {
    isTestRunning = false;
  }
});

// Run specific test endpoint
app.post('/api/tests/run/:testName', async (req: Request, res: Response) => {
  if (isTestRunning) {
    return res.status(409).json({
      error: 'Tests already running',
      message: 'Please wait for the current test run to complete',
    });
  }

  const testName = req.params.testName;
  const baseUrl = req.body.baseUrl || 'http://localhost:3000';

  isTestRunning = true;

  try {
    const testSuite = new PuppeteerTestSuite(baseUrl);
    await testSuite.setup();

    let result;
    switch (testName) {
      case 'pageLoad':
        result = await testSuite.testPageLoad();
        break;
      case 'headerNavigation':
        result = await testSuite.testHeaderNavigation();
        break;
      case 'heroSection':
        result = await testSuite.testHeroSection();
        break;
      case 'featureCards':
        result = await testSuite.testFeatureCards();
        break;
      case 'responsiveDesign':
        result = await testSuite.testResponsiveDesign();
        break;
      case 'accessibility':
        result = await testSuite.testAccessibility();
        break;
      case 'performance':
        result = await testSuite.testPerformance();
        break;
      default:
        await testSuite.teardown();
        isTestRunning = false;
        return res.status(404).json({
          error: 'Test not found',
          message: `Test "${testName}" does not exist`,
        });
    }

    await testSuite.teardown();

    res.json({
      test: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Test execution failed',
      message: error instanceof Error ? error.message : String(error),
    });
  } finally {
    isTestRunning = false;
  }
});

// Clear test results
app.delete('/api/tests/results', (req: Request, res: Response) => {
  latestTestResults = null;
  res.json({
    message: 'Test results cleared',
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Puppeteer Test Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   - GET  /api/health - Health check`);
  console.log(`   - GET  /api/tests/status - Get test status`);
  console.log(`   - GET  /api/tests/results - Get latest results`);
  console.log(`   - POST /api/tests/run - Run all tests`);
  console.log(`   - POST /api/tests/run/:testName - Run specific test`);
  console.log(`   - DELETE /api/tests/results - Clear results`);
});

export default app;
