import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createNetScanApi } from './src/server/api.ts';
import { requireWmsAuth } from './src/server/wmsAuthMiddleware.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Main TUC NetScan REST API v1 prefix — gated by WMS SSO (TUC-ICT-SRS-2026-013).
// Every API call requires a valid @techbridge.edu.gh WMS session; closes the open-API exposure.
app.use('/api/v1', requireWmsAuth, createNetScanApi());

// Serve static compiled UI files in production (after npm run build)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Re-route fallback to index.html for Single Page App routing
app.get(/.*/, (req, res, next) => {
  // If it is asking for an API, send a proper 404 instead of returning index.html
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ status: 404, message: 'REST API endpoint not found.' });
    return;
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      // If index.html doesn't exist (e.g. running outside prod build context), display placeholder
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>TUC NetScan - Loading</title></head>
          <body style="font-family: sans-serif; padding: 2rem; background: #eaedf2; color: #1B3A6B; text-align: center;">
            <h2>TUC NetScan - Build is running</h2>
            <p>The static assets are being compiled. Please refresh in a moment...</p>
          </body>
        </html>
      `);
    }
  });
});

const PORT = process.env.PORT || 3017;
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[TUC NetScan] Unified full-stack server running on port ${PORT}`);
}).on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[TUC NetScan] FATAL: Port ${PORT} is already in use. Another instance may be running. Exiting.`);
    process.exit(1);
  }
  console.error('[TUC NetScan] Server error:', err);
  process.exit(1);
});
