import express, { Request, Response } from 'express';
import cors from 'cors';
import { runTests } from './test-runner.js';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Run Puppeteer tests endpoint
app.post('/api/tests/run', async (_req: Request, res: Response) => {
  try {
    const results = await runTests();
    res.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Get test status endpoint
app.get('/api/tests/status', (_req: Request, res: Response) => {
  res.json({
    available: true,
    testCount: 5,
    lastRun: null,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  - GET  /api/health`);
  console.log(`  - POST /api/tests/run`);
  console.log(`  - GET  /api/tests/status`);
});
