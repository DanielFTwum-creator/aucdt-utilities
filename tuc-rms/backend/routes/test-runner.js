const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const { execFile } = require('child_process');
const path = require('path');

router.post('/run', auth, requireRole('registrar'), (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      message: 'Test runner is disabled in production environment'
    });
  }

  const { suite = 'all' } = req.body;

  // Build Playwright command
  let cmd;
  if (suite === 'all') {
    cmd = ['test', '--reporter=json'];
  } else {
    cmd = ['test', `tests/${suite}.spec.js`, '--reporter=json'];
  }

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const projectRoot = path.resolve(__dirname, '../../..');
  const child = execFile('npx', ['playwright', ...cmd], {
    cwd: projectRoot,
    timeout: 120000,
    maxBuffer: 10 * 1024 * 1024
  });

  // Stream stdout lines as SSE events
  if (child.stdout) {
    child.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          res.write(`data: ${JSON.stringify({ out: line })}\n\n`);
        }
      });
    });
  }

  // Stream stderr lines as SSE events
  if (child.stderr) {
    child.stderr.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          res.write(`data: ${JSON.stringify({ err: line })}\n\n`);
        }
      });
    });
  }

  // Send exit event when complete
  child.on('close', (code) => {
    res.write(`data: ${JSON.stringify({ done: true, exitCode: code })}\n\n`);
    res.end();
  });

  // Handle errors
  child.on('error', (error) => {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  });
});

module.exports = router;
