#!/usr/bin/env node
/**
 * Integrate health check pages into backend services without UIs
 * Adds Express middleware to serve static health dashboards
 */

import { promises as fs } from 'fs';
import path from 'path';

const BACKEND_SERVICES = [
  'internship-program',
  'research-portal',
  'techbridge-sentinel-agent',
  'tsapro-mapping-review',
];

interface IntegrationResult {
  service: string;
  status: 'success' | 'error' | 'already_integrated' | 'no_server_file';
  message: string;
  serverFile?: string;
}

/**
 * Find server entry point file
 */
async function findServerFile(serviceName: string): Promise<string | null> {
  const possiblePaths = [
    path.join(serviceName, 'src', 'server.ts'),
    path.join(serviceName, 'src', 'server.js'),
    path.join(serviceName, 'src', 'index.ts'),
    path.join(serviceName, 'src', 'index.js'),
    path.join(serviceName, 'server.ts'),
    path.join(serviceName, 'server.js'),
    path.join(serviceName, 'index.ts'),
    path.join(serviceName, 'index.js'),
  ];

  for (const filePath of possiblePaths) {
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      // File doesn't exist, try next
    }
  }

  return null;
}

/**
 * Check if already has Express integration
 */
function hasExpressIntegration(content: string): boolean {
  return content.includes('express()') || content.includes("require('express')") || content.includes("import express from 'express'");
}

/**
 * Check if has health check
 */
function hasHealthCheck(content: string): boolean {
  return content.includes('/health');
}

/**
 * Create Express wrapper for non-Express service
 */
function generateExpressWrapper(serviceName: string, originalFile: string): string {
  const displayName = serviceName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const isTypeScript = originalFile.endsWith('.ts');
  const requireSyntax = isTypeScript ? "import express from 'express';" : "const express = require('express');";
  const pathRequire = isTypeScript ? "import path from 'path';" : "const path = require('path');";

  return `${requireSyntax}
${pathRequire}

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
    service: '${displayName}',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    service: '${displayName}',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: '${displayName}',
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
  console.log(\`${displayName} API with Health Check running on port \${PORT}\`);
  console.log(\`Health Dashboard: http://localhost:\${PORT}\`);
  console.log(\`Health Endpoint: http://localhost:\${PORT}/health\`);
});

${isTypeScript ? 'export default app;' : 'module.exports = app;'}
`;
}

/**
 * Integrate health check into existing Express server
 */
async function integrateIntoExpressServer(serverFile: string, content: string): Promise<string> {
  const lines = content.split('\n');
  const isTypeScript = serverFile.endsWith('.ts');

  // Find app initialization
  const appInitIndex = lines.findIndex((line) =>
    line.includes('express()') || line.includes('const app') || line.includes('let app')
  );

  if (appInitIndex === -1) {
    throw new Error('Could not find Express app initialization');
  }

  // Find import section
  const lastImportIndex = lines.findIndex((line, i) =>
    i > 0 && !line.startsWith('import') && !line.startsWith('//') && !line.startsWith('const') && line.trim()
  );

  // Add path import if not present
  if (!content.includes("import path from 'path'") && !content.includes('require("path")') && !content.includes("require('path')")) {
    if (isTypeScript) {
      lines.splice(Math.max(lastImportIndex, 0), 0, "import path from 'path';");
    }
  }

  // Find middleware section
  let middlewareInsertIndex = appInitIndex + 1;
  while (
    middlewareInsertIndex < lines.length &&
    (lines[middlewareInsertIndex].includes('app.use') || lines[middlewareInsertIndex].trim() === '')
  ) {
    middlewareInsertIndex++;
  }

  // Add static file serving if not present
  if (!content.includes('express.static')) {
    const staticMiddleware = [
      '',
      '// Serve health check dashboard',
      "app.use(express.static(path.join(__dirname, '../public')));",
    ];
    lines.splice(middlewareInsertIndex, 0, ...staticMiddleware);
    middlewareInsertIndex += staticMiddleware.length;
  }

  // Add root route if not present
  if (!content.includes("app.get('/')") && !content.includes('app.get("/")')) {
    const rootRoute = [
      '',
      '// Serve health check page at root',
      "app.get('/', (req, res) => {",
      "  res.sendFile(path.join(__dirname, '../public', 'index.html'));",
      '});',
    ];
    lines.splice(middlewareInsertIndex, 0, ...rootRoute);
  }

  // Add health check if not present
  if (!hasHealthCheck(content)) {
    const healthCheck = [
      '',
      '// Health check endpoint',
      "app.get('/health', (req, res) => {",
      '  res.status(200).json({',
      "    status: 'healthy',",
      '    timestamp: new Date().toISOString(),',
      '    uptime: process.uptime(),',
      '  });',
      '});',
      '',
      "app.get('/api/status', (req, res) => {",
      '  res.json({',
      "    service: 'Backend API',",
      "    version: '1.0.0',",
      "    status: 'operational',",
      '    timestamp: new Date().toISOString(),',
      '  });',
      '});',
      '',
      "app.get('/api/info', (req, res) => {",
      '  res.json({',
      "    name: 'Backend API',",
      "    description: 'Backend API service',",
      "    version: '1.0.0',",
      "    endpoints: ['/health', '/api/status', '/api/info'],",
      '  });',
      '});',
    ];

    // Find where to insert (before app.listen or at end)
    const listenIndex = lines.findIndex((line) => line.includes('app.listen'));
    const insertIndex = listenIndex !== -1 ? listenIndex : lines.length - 3;

    lines.splice(insertIndex, 0, ...healthCheck);
  }

  return lines.join('\n');
}

/**
 * Process a single backend service
 */
async function processService(serviceName: string): Promise<IntegrationResult> {
  try {
    // Check if public/index.html exists
    const publicHtmlPath = path.join(serviceName, 'public', 'index.html');
    try {
      await fs.access(publicHtmlPath);
    } catch {
      return {
        service: serviceName,
        status: 'error',
        message: 'No public/index.html found (run generate-backend-health-pages.ts first)',
      };
    }

    // Find server file
    const serverFile = await findServerFile(serviceName);
    if (!serverFile) {
      return {
        service: serviceName,
        status: 'no_server_file',
        message: 'Could not find server entry point',
      };
    }

    // Read server file
    const content = await fs.readFile(serverFile, 'utf-8');

    // Check if it's an Express server or vanilla Node.js
    const isExpress = hasExpressIntegration(content);

    if (!isExpress) {
      // Create Express wrapper
      const wrapperPath = path.join(path.dirname(serverFile), 'server-with-health.js');
      const wrapperContent = generateExpressWrapper(serviceName, serverFile);

      await fs.writeFile(wrapperPath, wrapperContent);

      // Check package.json for express dependency
      const packageJsonPath = path.join(serviceName, 'package.json');
      let packageJson: any = {};

      try {
        packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      } catch {
        return {
          service: serviceName,
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
          service: serviceName,
          status: 'success',
          message: `✅ Created ${wrapperPath} (express added to deps) - Run: cd ${serviceName} && npm install`,
          serverFile: wrapperPath,
        };
      }

      return {
        service: serviceName,
        status: 'success',
        message: `✅ Created ${wrapperPath} - Start with: node ${wrapperPath}`,
        serverFile: wrapperPath,
      };
    }

    // It's Express - integrate directly
    const hasHealth = hasHealthCheck(content);

    if (hasHealth && content.includes('express.static')) {
      return {
        service: serviceName,
        status: 'already_integrated',
        message: 'Already has health check integration',
        serverFile,
      };
    }

    // Integrate health check
    const newContent = await integrateIntoExpressServer(serverFile, content);

    // Backup original
    await fs.writeFile(`${serverFile}.backup`, content);

    // Write modified file
    await fs.writeFile(serverFile, newContent);

    return {
      service: serviceName,
      status: 'success',
      message: `✅ Integrated health check (backup: ${serverFile}.backup)`,
      serverFile,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      service: serviceName,
      status: 'error',
      message: `Error: ${errorMessage}`,
    };
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log('🏥 Integrating health check pages into backend services...\n');

  const results: IntegrationResult[] = [];

  for (const serviceName of BACKEND_SERVICES) {
    process.stdout.write(`[${BACKEND_SERVICES.indexOf(serviceName) + 1}/${BACKEND_SERVICES.length}] ${serviceName}... `);

    const result = await processService(serviceName);
    results.push(result);

    console.log(result.message);
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Integration Summary:');
  console.log(`   ✅ Integrated: ${results.filter((r) => r.status === 'success').length}`);
  console.log(`   ℹ️  Already integrated: ${results.filter((r) => r.status === 'already_integrated').length}`);
  console.log(`   ⚠️  No server file: ${results.filter((r) => r.status === 'no_server_file').length}`);
  console.log(`   ❌ Errors: ${results.filter((r) => r.status === 'error').length}`);
  console.log(`   📂 Total: ${results.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (results.filter((r) => r.status === 'success' || r.status === 'already_integrated').length === BACKEND_SERVICES.length) {
    console.log('🎉 All backend services now have health check pages!\n');
    console.log('📝 Next Steps:');
    console.log('   1. For each service:');
    console.log('      - cd <service-name>');
    console.log('      - npm install (if express was added)');
    console.log('      - npm start or node src/server-with-health.js');
    console.log('   2. Open http://localhost:<port> to see health dashboard');
    console.log('   3. Capture screenshots for catalogue\n');
  } else {
    console.log(`⚠️  ${BACKEND_SERVICES.length - results.filter((r) => r.status === 'success').length} services need manual integration.\n`);
  }
}

main().catch(console.error);
