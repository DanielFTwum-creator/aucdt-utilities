const express = require('express');
const path = require('path');

const app = express();

// Serve health check page
app.use(express.static(path.join(__dirname, '../public')));

// Serve health check at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Internship Program',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    service: 'Internship Program',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Internship Program',
    description: 'Backend API service',
    version: '1.0.0',
    endpoints: ['/health', '/api/status', '/api/info'],
  });
});

// TODO: Add your original API routes here
// Example:
// app.get('/api/your-endpoint', (req, res) => {
//   res.json({ message: 'Your data' });
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Internship Program API with Health Check running on port ${PORT}`);
  console.log(`Health Dashboard: http://localhost:${PORT}`);
  console.log(`Health Endpoint: http://localhost:${PORT}/health`);
});

module.exports = app;
