/**
 * Backend Admin UI Middleware
 * Add this to any Express backend to serve the admin UI
 *
 * Usage in server.js or index.js:
 * const adminUI = require('./backend-ui-middleware');
 * app.use(adminUI);
 */

const express = require('express');
const path = require('path');

module.exports = function backendUIMiddleware(app) {
  // Serve static files from public directory
  const publicPath = path.join(__dirname, 'public');

  app.use(express.static(publicPath));

  // Serve admin UI at root
  app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  // Health check endpoint
  if (!app._router.stack.some(r => r.route && r.route.path === '/health')) {
    app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: process.env.npm_package_name || 'backend-api',
      });
    });
  }

  console.log('✅ Admin UI middleware loaded - serving at http://localhost:3000');

  return app;
};
