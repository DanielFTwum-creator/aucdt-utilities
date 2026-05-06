#!/usr/bin/env node
/**
 * Generate Simple Admin UIs for Backend APIs
 * Creates index.html for each backend service without UI
 */

const fs = require('fs').promises;
const path = require('path');

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

function generateHTML(appName) {
  const displayName = appName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${displayName} API - Admin Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 900px;
            width: 100%;
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .status {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            margin-top: 20px;
        }

        .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #10b981;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .content {
            padding: 40px;
        }

        .section {
            margin-bottom: 30px;
        }

        .section h2 {
            color: #1f2937;
            font-size: 1.5rem;
            margin-bottom: 15px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .info-card {
            background: #f9fafb;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }

        .info-card h3 {
            color: #667eea;
            font-size: 0.9rem;
            text-transform: uppercase;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .info-card p {
            color: #1f2937;
            font-size: 1.1rem;
            font-weight: 500;
        }

        .endpoints {
            background: #f9fafb;
            border-radius: 10px;
            padding: 20px;
        }

        .endpoint {
            display: flex;
            align-items: center;
            padding: 12px;
            background: white;
            margin-bottom: 10px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }

        .endpoint:last-child {
            margin-bottom: 0;
        }

        .method {
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 0.85rem;
            margin-right: 15px;
            min-width: 60px;
            text-align: center;
        }

        .method.get { background: #10b981; color: white; }
        .method.post { background: #3b82f6; color: white; }
        .method.put { background: #f59e0b; color: white; }
        .method.delete { background: #ef4444; color: white; }

        .path {
            color: #1f2937;
            font-family: 'Courier New', monospace;
            font-size: 0.95rem;
        }

        .test-panel {
            background: #f9fafb;
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
        }

        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn:active {
            transform: translateY(0);
        }

        .response {
            background: #1f2937;
            color: #10b981;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            margin-top: 15px;
            display: none;
            white-space: pre-wrap;
            word-break: break-all;
        }

        .response.show {
            display: block;
        }

        .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 0.9rem;
        }

        .badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${displayName}</h1>
            <p>REST API Service</p>
            <div class="status">
                <div class="status-indicator"></div>
                <span>API Running</span>
            </div>
        </div>

        <div class="content">
            <div class="section">
                <h2>Service Information</h2>
                <div class="info-grid">
                    <div class="info-card">
                        <h3>Service Name</h3>
                        <p>${appName}</p>
                    </div>
                    <div class="info-card">
                        <h3>Version</h3>
                        <p>1.0.0</p>
                    </div>
                    <div class="info-card">
                        <h3>Environment</h3>
                        <p>Production</p>
                    </div>
                    <div class="info-card">
                        <h3>Port</h3>
                        <p>3000</p>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>API Endpoints</h2>
                <div class="endpoints">
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <span class="path">/health</span>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <span class="path">/api/v1/${appName}</span>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <span class="path">/api/v1/${appName}/:id</span>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <span class="path">/api/v1/${appName}</span>
                    </div>
                    <div class="endpoint">
                        <span class="method put">PUT</span>
                        <span class="path">/api/v1/${appName}/:id</span>
                    </div>
                    <div class="endpoint">
                        <span class="method delete">DELETE</span>
                        <span class="path">/api/v1/${appName}/:id</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>API Health Check</h2>
                <div class="test-panel">
                    <button class="btn" onclick="checkHealth()">Test Health Endpoint</button>
                    <div id="response" class="response"></div>
                </div>
            </div>

            <div class="section">
                <h2>Documentation</h2>
                <p style="color: #6b7280; line-height: 1.6;">
                    This is a RESTful API service for ${displayName}.
                    For complete API documentation, please refer to the OpenAPI/Swagger documentation
                    or contact the development team.
                </p>
                <p style="margin-top: 15px;">
                    <span class="badge">Express.js</span>
                    <span class="badge" style="background: #3b82f6;">TypeScript</span>
                    <span class="badge" style="background: #f59e0b;">REST API</span>
                </p>
            </div>
        </div>

        <div class="footer">
            <p>© 2026 Techbridge University College | ICT Department</p>
            <p style="margin-top: 5px;">Generated by TUC Backend UI Generator</p>
        </div>
    </div>

    <script>
        async function checkHealth() {
            const responseEl = document.getElementById('response');
            responseEl.textContent = 'Loading...';
            responseEl.classList.add('show');

            try {
                const response = await fetch('/health');
                const data = await response.json();

                responseEl.textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                responseEl.textContent = 'Error: ' + error.message + '\\n\\nNote: Health endpoint may not be implemented yet.';
            }
        }

        // Auto-check health on load
        window.addEventListener('load', () => {
            setTimeout(checkHealth, 1000);
        });
    </script>
</body>
</html>`;
}

async function generateAllBackendUIs() {
  console.log('🎨 Generating Admin UIs for Backend APIs...\n');

  let success = 0;
  let failed = 0;

  for (const appName of BACKEND_APIS) {
    const appDir = path.join(process.cwd(), appName);
    const publicDir = path.join(appDir, 'public');
    const indexPath = path.join(publicDir, 'index.html');

    try {
      // Check if app directory exists
      await fs.access(appDir);

      // Create public directory
      await fs.mkdir(publicDir, { recursive: true });

      // Generate and write HTML
      const html = generateHTML(appName);
      await fs.writeFile(indexPath, html);

      console.log(`✅ ${appName} - UI generated`);
      success++;

    } catch (error) {
      console.log(`❌ ${appName} - Failed: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Summary:`);
  console.log(`   ✅ Success: ${success}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📂 Total: ${BACKEND_APIS.length}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  console.log('🎯 Next Steps:');
  console.log('   1. Run screenshot capture again to capture new UIs');
  console.log('   2. Test backend UIs: npm run dev in each backend app');
  console.log('   3. Update Docker builds to serve these UIs\n');
}

generateAllBackendUIs().catch(console.error);
