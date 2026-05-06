# Vanilla HTTP Backend Integration Guide

## Overview

7 backends use vanilla Node.js `http.createServer()` instead of Express.
These backends need manual integration for the Admin UI.

## Backends Requiring Manual Integration

1. enrollment-management-system
2. event-management-system
3. expense-tracking-system
4. feedback-analysis-system
5. lecture-assessment-system
6. media-club-platform
7. url-monitoring-service

## Integration Options

### Option 1: Use Generated Express Wrapper (Recommended)

Each backend now has a `src/server-with-ui.js` file that serves the admin UI.

**Steps:**
```bash
# For each backend:
cd <backend-name>

# Install express if needed
npm install

# Start with UI wrapper
node src/server-with-ui.js

# Access admin UI
open http://localhost:<port>
```

**Note:** The wrapper serves the admin UI and health endpoint. You'll need to manually
integrate your API routes into the Express app in `server-with-ui.js`.

### Option 2: Convert to Express (Best Long-term)

**Steps:**
1. Install Express: `npm install express`
2. Replace `http.createServer()` with Express app
3. Convert request handlers to Express routes
4. Add static file serving for admin UI
5. Update package.json "start" script

**Example Conversion:**

**Before (Vanilla HTTP):**
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/api/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data: [] }));
  }
});

server.listen(3000);
```

**After (Express):**
```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve admin UI
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// API routes
app.get('/api/data', (req, res) => {
  res.json({ data: [] });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(3000);
```

### Option 3: Keep Vanilla HTTP + Add Static Server

Run two servers:
- Original HTTP server on original port
- Express server for UI on different port

**Not recommended** - increases complexity

## Testing Integration

After integration:

```bash
# Start the backend
npm run dev  # or node src/server-with-ui.js

# Test admin UI
curl http://localhost:<port>  # Should return HTML

# Test health check
curl http://localhost:<port>/health  # Should return JSON

# Open in browser
open http://localhost:<port>
```

## Deployment

Update Dockerfile to use the Express wrapper:

```dockerfile
CMD ["node", "src/server-with-ui.js"]
```

Or update package.json:

```json
{
  "scripts": {
    "start": "node src/server-with-ui.js"
  }
}
```

## Notes

- Express wrappers are generated in `src/server-with-ui.js`
- Original server files are unchanged
- You can gradually migrate API routes to Express
- Admin UI files are in `public/index.html`

Generated: 2026-03-11T17:19:11.191Z
