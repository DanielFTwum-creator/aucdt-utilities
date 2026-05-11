#!/usr/bin/env node
/**
 * Integrate Admin UI middleware into all backend Express servers
 * Adds static file serving and health check endpoints
 */

import { promises as fs } from 'fs';
import path from 'path';

const BACKEND_APIS = [
  'accommodation-management',
  'alumni-network',
  'backend',
  'career-services',
  'complaint-resolution-system',
  'enrollment-management-system',
  'event-management-system',
  'expense-tracking-system',
  'feedback-analysis-system',
  'health-wellness-portal',
  'lecture-assessment-system',
  'lecturer-assessment-portal',
  'library-management',
  'media-club-platform',
  'mentorship-program',
  'url-monitoring-service',
];

interface IntegrationResult {
  app: string;
  status: 'already_integrated' | 'integrated' | 'no_server_file' | 'error';
  message: string;
  serverFile?: string;
}

/**
 * Check if server file already has UI integration
 */
async function hasUIIntegration(content: string): Promise<boolean> {
  return (
    content.includes('express.static') &&
    (content.includes('public') || content.includes('index.html'))
  );
}

/**
 * Check if server file has health check endpoint
 */
async function hasHealthCheck(content: string): Promise<boolean> {
  return content.includes('/health');
}

/**
 * Find server entry point file
 */
async function findServerFile(appName: string): Promise<string | null> {
  const possiblePaths = [
    path.join(appName, 'src', 'server.ts'),
    path.join(appName, 'src', 'server.js'),
    path.join(appName, 'src', 'index.ts'),
    path.join(appName, 'src', 'index.js'),
    path.join(appName, 'server.ts'),
    path.join(appName, 'server.js'),
    path.join(appName, 'index.ts'),
    path.join(appName, 'index.js'),
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
 * Add UI integration to server file
 */
async function integrateUI(
  serverFile: string,
  content: string
): Promise<string> {
  const lines = content.split('\n');
  let modified = false;
  let newContent = '';

  // Check if TypeScript or JavaScript
  const isTypeScript = serverFile.endsWith('.ts');

  // Find the app initialization line
  const appInitIndex = lines.findIndex(
    (line) =>
      line.includes('express()') ||
      line.includes('const app') ||
      line.includes('let app')
  );

  if (appInitIndex === -1) {
    throw new Error('Could not find Express app initialization');
  }

  // Find import section
  const lastImportIndex = lines.findIndex((line, i) =>
    i > 0 && !line.startsWith('import') && !line.startsWith('//') && line.trim()
      ? true
      : false
  );

  // Add path import if not present
  if (!content.includes("import path from 'path'") && !content.includes('require("path")')) {
    if (isTypeScript) {
      lines.splice(lastImportIndex, 0, "import path from 'path';");
      modified = true;
    }
  }

  // Find where to add static middleware (after app initialization)
  let middlewareInsertIndex = appInitIndex + 1;

  // Skip any existing middleware to find a good insertion point
  while (
    middlewareInsertIndex < lines.length &&
    (lines[middlewareInsertIndex].includes('app.use') ||
      lines[middlewareInsertIndex].trim() === '')
  ) {
    middlewareInsertIndex++;
  }

  // Add static file serving
  if (!content.includes('express.static')) {
    const staticMiddleware = [
      '',
      "// Serve admin UI from public directory",
      "app.use(express.static(path.join(__dirname, '../public')));",
    ];
    lines.splice(middlewareInsertIndex, 0, ...staticMiddleware);
    modified = true;
    middlewareInsertIndex += staticMiddleware.length;
  }

  // Find routes section to add root route
  const routesStartIndex = lines.findIndex(
    (line, i) => i > middlewareInsertIndex && (line.includes('app.get') || line.includes('app.use'))
  );

  if (routesStartIndex !== -1 && !content.includes("res.sendFile") && !content.includes("'/'")) {
    const rootRoute = [
      '',
      "// Serve admin UI at root",
      "app.get('/', (req, res) => {",
      "  res.sendFile(path.join(__dirname, '../public', 'index.html'));",
      '});',
    ];
    lines.splice(routesStartIndex, 0, ...rootRoute);
    modified = true;
  }

  // Add health check if missing
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
    ];

    // Find where to insert (before app.listen or at end of routes)
    const listenIndex = lines.findIndex((line) => line.includes('app.listen'));
    const insertIndex = listenIndex !== -1 ? listenIndex : lines.length - 3;

    lines.splice(insertIndex, 0, ...healthCheck);
    modified = true;
  }

  return modified ? lines.join('\n') : content;
}

/**
 * Process a single backend API
 */
async function processBackend(appName: string): Promise<IntegrationResult> {
  try {
    // Check if public/index.html exists
    const publicHtmlPath = path.join(appName, 'public', 'index.html');
    try {
      await fs.access(publicHtmlPath);
    } catch {
      return {
        app: appName,
        status: 'error',
        message: 'No public/index.html found (run generate-backend-uis.js first)',
      };
    }

    // Find server file
    const serverFile = await findServerFile(appName);
    if (!serverFile) {
      return {
        app: appName,
        status: 'no_server_file',
        message: 'Could not find server entry point',
      };
    }

    // Read server file
    const content = await fs.readFile(serverFile, 'utf-8');

    // Check if already integrated
    const hasUI = await hasUIIntegration(content);
    const hasHealth = await hasHealthCheck(content);

    if (hasUI && hasHealth) {
      return {
        app: appName,
        status: 'already_integrated',
        message: 'Already has UI integration and health check',
        serverFile,
      };
    }

    // Integrate UI
    const newContent = await integrateUI(serverFile, content);

    // Backup original file
    await fs.writeFile(`${serverFile}.backup`, content);

    // Write modified file
    await fs.writeFile(serverFile, newContent);

    return {
      app: appName,
      status: 'integrated',
      message: `✅ Integrated UI middleware (backup: ${serverFile}.backup)`,
      serverFile,
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
 * Main function
 */
async function main(): Promise<void> {
  console.log('🔧 Integrating Admin UI into Backend APIs...\n');

  const results: IntegrationResult[] = [];

  for (const appName of BACKEND_APIS) {
    process.stdout.write(`[${BACKEND_APIS.indexOf(appName) + 1}/${BACKEND_APIS.length}] ${appName}... `);

    const result = await processBackend(appName);
    results.push(result);

    console.log(result.message);
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Integration Summary:');
  console.log(`   ✅ Integrated: ${results.filter((r) => r.status === 'integrated').length}`);
  console.log(`   ℹ️  Already integrated: ${results.filter((r) => r.status === 'already_integrated').length}`);
  console.log(`   ⚠️  No server file: ${results.filter((r) => r.status === 'no_server_file').length}`);
  console.log(`   ❌ Errors: ${results.filter((r) => r.status === 'error').length}`);
  console.log(`   📂 Total: ${results.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (results.filter((r) => r.status === 'error').length > 0) {
    console.log('⚠️  Errors:');
    results
      .filter((r) => r.status === 'error')
      .forEach((r) => {
        console.log(`   • ${r.app}: ${r.message}`);
      });
    console.log();
  }

  const successCount = results.filter(
    (r) => r.status === 'integrated' || r.status === 'already_integrated'
  ).length;

  if (successCount === BACKEND_APIS.length) {
    console.log('🎉 All backend APIs now have admin UI integration!\n');
  } else {
    console.log(`⚠️  ${BACKEND_APIS.length - successCount} backends need manual integration.\n`);
  }
}

main().catch(console.error);
