#!/usr/bin/env node
/**
 * Integrate Admin UI into vanilla Node.js HTTP backends
 * These backends use http.createServer instead of Express
 */

import { promises as fs } from 'fs';
import path from 'path';

const VANILLA_HTTP_BACKENDS = [
  'enrollment-management-system',
  'event-management-system',
  'expense-tracking-system',
  'feedback-analysis-system',
  'lecture-assessment-system',
  'media-club-platform',
  'url-monitoring-service',
];

interface IntegrationResult {
  app: string;
  status: 'success' | 'error' | 'skipped';
  message: string;
}

/**
 * Generate Express wrapper for vanilla HTTP server
 */
function generateExpressWrapper(appName: string, originalPort: number = 3000): string {
  const displayName = appName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return `const express = require('express');
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
    service: '${displayName}',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Import and mount the original API routes
// The original server logic should be refactored into route handlers
// For now, we'll document that manual integration is needed

const PORT = process.env.PORT || ${originalPort};

app.listen(PORT, () => {
  console.log(\`${displayName} API with Admin UI running on port \${PORT}\`);
  console.log(\`Admin UI: http://localhost:\${PORT}\`);
  console.log(\`Health Check: http://localhost:\${PORT}/health\`);
});

module.exports = app;
`;
}

/**
 * Create Express wrapper file
 */
async function createExpressWrapper(appName: string): Promise<IntegrationResult> {
  try {
    // Check if public/index.html exists
    const publicHtmlPath = path.join(appName, 'public', 'index.html');
    try {
      await fs.access(publicHtmlPath);
    } catch {
      return {
        app: appName,
        status: 'error',
        message: 'No public/index.html found',
      };
    }

    // Find original server file to extract port
    const serverFile = path.join(appName, 'src', 'index.js');
    let port = 3000;

    try {
      const content = await fs.readFile(serverFile, 'utf-8');
      const portMatch = content.match(/PORT\s*=\s*.*?\|\|\s*(\d+)/);
      if (portMatch) {
        port = parseInt(portMatch[1], 10);
      }
    } catch {
      // Use default port
    }

    // Create Express wrapper
    const wrapperPath = path.join(appName, 'src', 'server-with-ui.js');
    const wrapperContent = generateExpressWrapper(appName, port);

    await fs.writeFile(wrapperPath, wrapperContent);

    // Check if express is in dependencies
    const packageJsonPath = path.join(appName, 'package.json');
    let packageJson: any = {};

    try {
      packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    } catch {
      return {
        app: appName,
        status: 'error',
        message: 'Could not read package.json',
      };
    }

    // Add express if missing
    if (!packageJson.dependencies?.express) {
      if (!packageJson.dependencies) {
        packageJson.dependencies = {};
      }
      packageJson.dependencies.express = '^4.18.2';

      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

      return {
        app: appName,
        status: 'success',
        message: `✅ Created ${wrapperPath} (express added to deps) - Run: cd ${appName} && npm install`,
      };
    }

    return {
      app: appName,
      status: 'success',
      message: `✅ Created ${wrapperPath} - Start with: node src/server-with-ui.js`,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      app: appName,
      status: 'error',
      message: `Error: ${errorMessage}`,
    };
  }
}

/**
 * Create README for manual integration
 */
async function createIntegrationGuide(): Promise<void> {
  const guide = `# Vanilla HTTP Backend Integration Guide

## Overview

7 backends use vanilla Node.js \`http.createServer()\` instead of Express.
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

Each backend now has a \`src/server-with-ui.js\` file that serves the admin UI.

**Steps:**
\`\`\`bash
# For each backend:
cd <backend-name>

# Install express if needed
npm install

# Start with UI wrapper
node src/server-with-ui.js

# Access admin UI
open http://localhost:<port>
\`\`\`

**Note:** The wrapper serves the admin UI and health endpoint. You'll need to manually
integrate your API routes into the Express app in \`server-with-ui.js\`.

### Option 2: Convert to Express (Best Long-term)

**Steps:**
1. Install Express: \`npm install express\`
2. Replace \`http.createServer()\` with Express app
3. Convert request handlers to Express routes
4. Add static file serving for admin UI
5. Update package.json "start" script

**Example Conversion:**

**Before (Vanilla HTTP):**
\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/api/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data: [] }));
  }
});

server.listen(3000);
\`\`\`

**After (Express):**
\`\`\`javascript
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
\`\`\`

### Option 3: Keep Vanilla HTTP + Add Static Server

Run two servers:
- Original HTTP server on original port
- Express server for UI on different port

**Not recommended** - increases complexity

## Testing Integration

After integration:

\`\`\`bash
# Start the backend
npm run dev  # or node src/server-with-ui.js

# Test admin UI
curl http://localhost:<port>  # Should return HTML

# Test health check
curl http://localhost:<port>/health  # Should return JSON

# Open in browser
open http://localhost:<port>
\`\`\`

## Deployment

Update Dockerfile to use the Express wrapper:

\`\`\`dockerfile
CMD ["node", "src/server-with-ui.js"]
\`\`\`

Or update package.json:

\`\`\`json
{
  "scripts": {
    "start": "node src/server-with-ui.js"
  }
}
\`\`\`

## Notes

- Express wrappers are generated in \`src/server-with-ui.js\`
- Original server files are unchanged
- You can gradually migrate API routes to Express
- Admin UI files are in \`public/index.html\`

Generated: ${new Date().toISOString()}
`;

  await fs.writeFile('VANILLA-HTTP-INTEGRATION-GUIDE.md', guide);
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log('🔧 Creating Express wrappers for vanilla HTTP backends...\n');

  const results: IntegrationResult[] = [];

  for (const appName of VANILLA_HTTP_BACKENDS) {
    process.stdout.write(
      `[${VANILLA_HTTP_BACKENDS.indexOf(appName) + 1}/${VANILLA_HTTP_BACKENDS.length}] ${appName}... `
    );

    const result = await createExpressWrapper(appName);
    results.push(result);

    console.log(result.message);
  }

  // Create integration guide
  await createIntegrationGuide();
  console.log('\n📄 Created: VANILLA-HTTP-INTEGRATION-GUIDE.md');

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Vanilla HTTP Integration Summary:');
  console.log(`   ✅ Wrappers created: ${results.filter((r) => r.status === 'success').length}`);
  console.log(`   ❌ Errors: ${results.filter((r) => r.status === 'error').length}`);
  console.log(`   📂 Total: ${results.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📝 Next Steps:');
  console.log('   1. Review VANILLA-HTTP-INTEGRATION-GUIDE.md');
  console.log('   2. For each backend:');
  console.log('      - cd <backend-name>');
  console.log('      - npm install (if express was added)');
  console.log('      - node src/server-with-ui.js');
  console.log('   3. Manually integrate API routes into Express wrappers\n');
}

main().catch(console.error);
