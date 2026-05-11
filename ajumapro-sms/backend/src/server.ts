import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db/database.js';
import { incrementRequests, incrementErrors } from './routes/diagnostics.js';
import authRoutes from './routes/auth.js';
import auditRoutes from './routes/audit.js';
import diagnosticsRoutes from './routes/diagnostics.js';
import performanceRoutes from './routes/performance.js';
import dbRoutes from './routes/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = parseInt(process.env.PORT ?? '3001', 10);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';
const NODE_ENV = process.env.NODE_ENV ?? 'development';

// Initialise database
initDb();

const app = express();

// Security headers (relaxed for dev)
app.use(helmet({
  contentSecurityPolicy: NODE_ENV === 'production',
}));

// CORS
app.use(cors({
  origin: NODE_ENV === 'production' ? false : FRONTEND_ORIGIN,
  credentials: true,
}));

// Rate limiting on API
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(express.json());

// Request tracking middleware
app.use((req, res, next) => {
  incrementRequests();
  res.on('finish', () => {
    if (res.statusCode >= 400) incrementErrors();
  });
  next();
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/diagnostics', diagnosticsRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/db', dbRoutes);

// Health check (unauthenticated)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

// Serve React frontend in production
// STATIC_PATH env var: relative to cwd (Docker). Falls back to sibling dist/ in dev.
const distPath = process.env.STATIC_PATH
  ? path.join(process.cwd(), process.env.STATIC_PATH)
  : path.join(__dirname, '../../dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[ajumapro-sms] Backend running on http://localhost:${PORT}`);
  console.log(`[ajumapro-sms] Environment: ${NODE_ENV}`);
});
