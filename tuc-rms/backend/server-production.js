// TUC Results Management System — Production Backend Server
// Enhanced with health checks, logging, error handling, and security headers

const dotenv = require('dotenv');
dotenv.config(); // must run before any module that reads process.env

const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { auditMiddleware } = require('./middleware');
const db = require('./db');

const app = express();
app.set('trust proxy', 1); // trust nginx/Apache reverse proxy for rate limiting
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================================
// MIDDLEWARE: CORS & BODY PARSING
// ============================================================================

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Audit middleware (logs authenticated POST/PUT/DELETE)
app.use(auditMiddleware);

// Rate limiting on login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// ============================================================================
// MIDDLEWARE: SECURITY HEADERS
// ============================================================================

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// ============================================================================
// MIDDLEWARE: REQUEST LOGGING
// ============================================================================

const logRequest = (req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;

  res.send = function(data) {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Status: ${res.statusCode} - ${duration}ms`);
    return originalSend.call(this, data);
  };

  next();
};

app.use(logRequest);

// ============================================================================
// HEALTH CHECK ENDPOINTS
// ============================================================================

app.get('/api/health', (req, res) => {
  const uptime = Math.floor(process.uptime());
  res.json({
    status: 'ok',
    service: 'tuc-rms-api',
    timestamp: new Date().toISOString(),
    uptime: uptime,
    environment: NODE_ENV
  });
});

app.get('/api/health/full', async (req, res) => {
  const uptime = Math.floor(process.uptime());
  const memUsage = process.memoryUsage();

  try {
    await db.execute('SELECT 1');
    res.json({
      status: 'ok',
      service: 'tuc-rms-api',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      environment: NODE_ENV,
      database: {
        status: 'ok',
        error: null
      },
      memory: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024)
      }
    });
  } catch (err) {
    res.json({
      status: 'degraded',
      service: 'tuc-rms-api',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      environment: NODE_ENV,
      database: {
        status: 'error',
        error: err.message
      },
      memory: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024)
      }
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'tuc-rms-api' });
});

// ============================================================================
// API ROUTES
// ============================================================================

try {
  app.use('/api/auth/login', loginLimiter);
  const authRouter = require('./routes/auth');
  app.use('/api/auth', authRouter);
  app.use('/api/users', require('./routes/users'));
  app.use('/api/students', require('./routes/students'));
  app.use('/api/courses', require('./routes/courses'));
  app.use('/api/results', require('./routes/results'));
  app.use('/api/reports', require('./routes/reports'));
  app.use('/api/dashboard', require('./routes/dashboard'));
  app.use('/api/test', require('./routes/test-runner'));

  console.log('[✓] All routes loaded successfully');
} catch (err) {
  console.error('[✗] Failed to load routes:', err.message);
  process.exit(1);
}

// ============================================================================
// SELF-SERVE API DOCS (OpenAPI 3 + Swagger UI) — GATED, off by default
// ============================================================================
// Only registered when SWAGGER_ENABLED=true, so this never exposes the auth-gated
// student-records API in production. Devs: run with SWAGGER_ENABLED=true, then open
// /api/docs (UI) / /api/docs.json (spec). Scaffold — extend per route module.
if (process.env.SWAGGER_ENABLED === 'true') {
  const OPENAPI_SPEC = {
    openapi: '3.0.3',
    info: {
      title: 'TUC RMS API',
      version: '1.0.0',
      description:
        'Records Management System backend (PM2 app `tuc-rms-api`, port 5000). ' +
        'Public: health probes + auth login. Authenticated (Bearer JWT) route groups: ' +
        '`/api/users`, `/api/students`, `/api/courses`, `/api/results`, `/api/reports`, ' +
        '`/api/dashboard` — see `backend/routes/*.js` for the full operation set. This spec ' +
        'documents the verified public endpoints + the API map; extend it per route module.',
    },
    tags: [
      { name: 'health' }, { name: 'auth' }, { name: 'users' }, { name: 'students' },
      { name: 'courses' }, { name: 'results' }, { name: 'reports' }, { name: 'dashboard' },
    ],
    components: {
      securitySchemes: { 'bearer-jwt': { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
    paths: {
      '/api/health': { get: { tags: ['health'], summary: 'Liveness probe', responses: { 200: { description: 'OK' } } } },
      '/api/health/full': { get: { tags: ['health'], summary: 'Full health (incl. DB)', responses: { 200: { description: 'OK' }, 503: { description: 'Degraded' } } } },
      '/api/auth/login': {
        post: {
          tags: ['auth'], summary: 'Login (rate-limited)',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } } } },
          responses: { 200: { description: 'Authenticated (token issued)' }, 401: { description: 'Invalid credentials' }, 429: { description: 'Too many attempts' } },
        },
      },
    },
  };
  const SWAGGER_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/><title>TUC RMS API</title>
<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"/></head>
<body><div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
<script>window.onload=function(){SwaggerUIBundle({url:'docs.json',dom_id:'#swagger-ui'});};</script>
</body></html>`;
  app.get('/api/docs.json', (req, res) => res.json(OPENAPI_SPEC));
  app.get('/api/docs', (req, res) => res.type('html').send(SWAGGER_HTML));
  console.log('[✓] API docs enabled at /api/docs (SWAGGER_ENABLED=true)');
}

// ============================================================================
// MIDDLEWARE: 404 HANDLER
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// MIDDLEWARE: GLOBAL ERROR HANDLER
// ============================================================================

app.use((err, req, res, next) => {
  console.error('[ERROR]', {
    message: err.message,
    stack: NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  const statusCode = err.status || 500;
  const message = NODE_ENV === 'production' ? 'Internal Server Error' : err.message;

  res.status(statusCode).json({
    error: err.name || 'Error',
    message,
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

const server = app.listen(PORT, process.env.HOST || 'localhost', () => {
  const url = `http://${process.env.HOST || 'localhost'}:${PORT}`;
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  TUC Results Management System — Backend Server           ║
╚════════════════════════════════════════════════════════════╝

Environment:  ${NODE_ENV}
Server:       ${url}
API Routes:   ${url}/api/*
Health Check: ${url}/api/health
Database:     ${process.env.DB_HOST}:${process.env.DB_PORT} → ${process.env.DB_NAME}
CORS Origin:  ${process.env.FRONTEND_URL}
Uptime:       Ready
  `);
});

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

process.on('SIGTERM', () => {
  console.log('[INFO] SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('[✓] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[INFO] SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('[✓] Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
  process.exit(1);
});

module.exports = server;
