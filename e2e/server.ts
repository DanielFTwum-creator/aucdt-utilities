import express from 'express';
import cors from 'cors';
import { runE2ETests } from './tests/app.e2e';

const app = express();
const PORT = process.env.TEST_SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());

let currentTestRun: any = null;
let isRunning = false;

// Endpoint to start tests
app.post('/api/tests/run', async (req, res) => {
  if (isRunning) {
    return res.status(409).json({ error: 'Tests are already running' });
  }

  isRunning = true;
  res.json({ message: 'Tests started', status: 'running' });

  try {
    currentTestRun = await runE2ETests();
  } catch (error) {
    currentTestRun = {
      name: 'ThesisAI E2E Test Suite',
      tests: [],
      totalDuration: 0,
      passed: 0,
      failed: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  } finally {
    isRunning = false;
  }
});

// Endpoint to get test results
app.get('/api/tests/results', (req, res) => {
  if (isRunning) {
    return res.json({ status: 'running', results: null });
  }

  if (!currentTestRun) {
    return res.json({ status: 'not_started', results: null });
  }

  res.json({ status: 'completed', results: currentTestRun });
});

// Endpoint to get test status
app.get('/api/tests/status', (req, res) => {
  res.json({
    isRunning,
    hasResults: currentTestRun !== null,
  });
});

app.listen(PORT, () => {
  console.log(`🧪 E2E Test Server running on http://localhost:${PORT}`);
});
