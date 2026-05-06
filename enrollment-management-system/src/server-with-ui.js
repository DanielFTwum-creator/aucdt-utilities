const express = require('express');
const path = require('path');
const app = express();

// Serve admin UI static files
app.use(express.static(path.join(__dirname, '../public')));

// Serve admin UI at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Enrollment Management System',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Import and mount the original API routes
// The original server logic should be refactored into route handlers
// For now, we'll document that manual integration is needed

const PORT = process.env.PORT || 4029;

app.listen(PORT, () => {
  console.log(`Enrollment Management System API with Admin UI running on port ${PORT}`);
  console.log(`Admin UI: http://localhost:${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;
