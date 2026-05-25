// TUC Results Management System — Production Backend Server
// Enhanced with health checks, logging, error handling, and security headers

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
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
  res.json({
    status: 'TUC RMS Online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'tuc-rms-api' });
});

// ============================================================================
// API ROUTES
// ============================================================================

try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/students', require('./routes/students'));
  app.use('/api/courses', require('./routes/courses'));
  app.use('/api/results', require('./routes/results'));
  app.use('/api/reports', require('./routes/reports'));
  app.use('/api/dashboard', require('./routes/dashboard'));
  
  console.log('[✓] All routes loaded successfully');
} catch (err) {
  console.error('[✗] Failed to load routes:', err.message);
  process.exit(1);
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
