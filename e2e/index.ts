#!/usr/bin/env node
/**
 * Puppeteer Test Runner Entry Point
 *
 * This script can be run in two modes:
 * 1. Server mode (default): Starts the test runner server with WebSocket support
 * 2. CLI mode: Runs tests once and outputs results to console
 */

import './server.js';

console.log('🚀 Puppeteer Test Runner Server started');
console.log('📊 API endpoints available at http://localhost:8080');
console.log('🔌 WebSocket server ready for real-time updates');
console.log('');
console.log('Available endpoints:');
console.log('  GET  /api/health           - Health check');
console.log('  GET  /api/test/status      - Get test status');
console.log('  GET  /api/test/results     - Get latest results');
console.log('  POST /api/test/run         - Trigger test run');
console.log('  GET  /screenshots/:file    - Get screenshot');
