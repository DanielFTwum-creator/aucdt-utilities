import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import routes from './src/server/routes.js';
import db from './src/server/db.js';
import { refreshWmsSession } from './src/server/wmsAuth.js';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3046;
const BASE_PATH = '/sickbay';

app.use(express.json());
app.use(cookieParser());

// Pattern 38: Strip sub-path prefix if nginx forwards unstripped /sickbay/api/...
app.use((req, _res, next) => {
  if (req.url.startsWith(`${BASE_PATH}/api/`)) {
    req.url = req.url.slice(BASE_PATH.length);
  }
  next();
});

// API Routes (Dual registration for sub-path resilience)
app.get(['/api/health', '/sickbay/api/health'], async (_req, res) => {
  let dbStatus = 'disconnected';
  try {
    await db.query('SELECT 1');
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'error';
  }
  res.json({
    status: 'healthy',
    app: 'sick-bay-management-system',
    service: 'sickbay',
    port: PORT,
    db: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.get(['/api/auth/session', '/sickbay/api/auth/session'], async (req, res) => {
  try {
    const refreshCookie = req.cookies?.wms_refresh;
    if (!refreshCookie) {
      return res.status(401).json({ error: 'No refresh token' });
    }
    const session = await refreshWmsSession(refreshCookie);
    res.json(session);
  } catch (error: any) {
    res.status(401).json({ error: 'Invalid session' });
  }
});

// Mount API routes
app.use('/api', routes);
app.use('/sickbay/api', routes);

// Pattern 35: WMS OAuth Relay (Exchange Google Auth Code)
app.post('/api/auth/google/token', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const wmsRelayUrl = process.env.WMS_OAUTH_RELAY_URL || 'https://wms.techbridge.edu.gh/api/oauth/google/exchange';
    const proxyKey = process.env.GEMINI_PROXY_KEY || '';

    const relayRes = await fetch(wmsRelayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gemini-Proxy-Key': proxyKey
      },
      body: JSON.stringify({ code, redirectUri })
    });

    const data = await relayRes.json();
    if (!relayRes.ok) {
      return res.status(relayRes.status).json(data);
    }

    res.json(data);
  } catch (error: any) {
    console.error('[OAuth Relay Error]:', error?.message || error);
    res.status(500).json({ error: 'Internal OAuth exchange error' });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static File Serving (Dual mount for both root & sub-path)
const DIST = fs.existsSync(path.join(__dirname, 'dist', 'index.html'))
  ? path.join(__dirname, 'dist')
  : __dirname;

// Serve documentation portal & guides static directory
const DOCS_DIR = path.join(__dirname, 'docs');
if (fs.existsSync(DOCS_DIR)) {
  app.use(['/docs', `${BASE_PATH}/docs`], express.static(DOCS_DIR));
}

app.use(BASE_PATH, express.static(DIST));
app.use(express.static(DIST));

// SPA Fallback for client-side routing
app.get('*', (_req, res) => {
  const indexFile = path.join(DIST, 'index.html');
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(404).send('Not found. Run pnpm build first.');
  }
});

app.listen(PORT, () => {
  console.log(`[SickBay Backend] Listening on port ${PORT} (sub-path: ${BASE_PATH})`);
});
