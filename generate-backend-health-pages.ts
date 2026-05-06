#!/usr/bin/env node
/**
 * Generate health check HTML pages for backend services without UIs
 * These are pure backend APIs that need monitoring dashboards
 */

import { promises as fs } from 'fs';
import path from 'path';

const BACKEND_SERVICES = [
  {
    name: 'internship-program',
    title: 'Internship Program API',
    description: 'Manages internship placements, applications, and tracking',
    port: 3001,
  },
  {
    name: 'research-portal',
    title: 'Research Portal API',
    description: 'Research project management and collaboration platform',
    port: 3002,
  },
  {
    name: 'techbridge-sentinel-agent',
    title: 'Techbridge Sentinel Agent',
    description: 'AI monitoring and alert management service',
    port: 3003,
  },
  {
    name: 'tsapro-mapping-review',
    title: 'TSAPro Mapping Review API',
    description: 'Timetable mapping review and conflict resolution service',
    port: 3004,
  },
];

interface ServiceConfig {
  name: string;
  title: string;
  description: string;
  port: number;
}

interface GenerationResult {
  service: string;
  status: 'success' | 'error';
  message: string;
}

/**
 * Generate health check HTML page
 */
function generateHealthCheckHTML(service: ServiceConfig): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${service.title} - Health Check</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 800px;
            width: 100%;
            padding: 40px;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
        }

        .header h1 {
            color: #2d3748;
            font-size: 32px;
            margin-bottom: 10px;
        }

        .header p {
            color: #718096;
            font-size: 16px;
        }

        .status-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .status-card h2 {
            font-size: 24px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .status-indicator {
            width: 12px;
            height: 12px;
            background: #48bb78;
            border-radius: 50%;
            display: inline-block;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .info-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 10px;
        }

        .info-label {
            font-size: 12px;
            opacity: 0.8;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .info-value {
            font-size: 20px;
            font-weight: 600;
        }

        .endpoints {
            background: #f7fafc;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 20px;
        }

        .endpoints h3 {
            color: #2d3748;
            margin-bottom: 15px;
            font-size: 20px;
        }

        .endpoint {
            background: white;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 10px;
            border-left: 4px solid #667eea;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .endpoint:last-child {
            margin-bottom: 0;
        }

        .endpoint-method {
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
        }

        .endpoint-path {
            color: #4a5568;
            font-family: 'Courier New', monospace;
            flex-grow: 1;
            margin-left: 15px;
        }

        .test-button {
            background: #48bb78;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s;
        }

        .test-button:hover {
            background: #38a169;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(72, 187, 120, 0.3);
        }

        .footer {
            text-align: center;
            color: #718096;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
        }

        .logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏥</div>
            <h1>${service.title}</h1>
            <p>${service.description}</p>
        </div>

        <div class="status-card">
            <h2>
                <span class="status-indicator"></span>
                Service Status: Healthy
            </h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Status</div>
                    <div class="info-value" id="status">Running</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Uptime</div>
                    <div class="info-value" id="uptime">--</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Port</div>
                    <div class="info-value">${service.port}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Last Check</div>
                    <div class="info-value" id="timestamp">--</div>
                </div>
            </div>
        </div>

        <div class="endpoints">
            <h3>API Endpoints</h3>
            <div class="endpoint">
                <span class="endpoint-method">GET</span>
                <span class="endpoint-path">/health</span>
                <button class="test-button" onclick="testEndpoint('/health')">Test</button>
            </div>
            <div class="endpoint">
                <span class="endpoint-method">GET</span>
                <span class="endpoint-path">/api/status</span>
                <button class="test-button" onclick="testEndpoint('/api/status')">Test</button>
            </div>
            <div class="endpoint">
                <span class="endpoint-method">GET</span>
                <span class="endpoint-path">/api/info</span>
                <button class="test-button" onclick="testEndpoint('/api/info')">Test</button>
            </div>
        </div>

        <div class="footer">
            <p><strong>${service.title}</strong></p>
            <p>Techbridge University College</p>
            <p id="current-time">Loading...</p>
        </div>
    </div>

    <script>
        // Update timestamp
        function updateTime() {
            const now = new Date();
            document.getElementById('current-time').textContent = now.toLocaleString();
            document.getElementById('timestamp').textContent = now.toLocaleTimeString();
        }

        // Fetch health data
        async function fetchHealth() {
            try {
                const response = await fetch('/health');
                const data = await response.json();

                if (data.status === 'healthy') {
                    document.getElementById('status').textContent = 'Healthy';
                    document.getElementById('status').style.color = '#48bb78';
                }

                if (data.uptime) {
                    const uptime = Math.floor(data.uptime);
                    const hours = Math.floor(uptime / 3600);
                    const minutes = Math.floor((uptime % 3600) / 60);
                    const seconds = uptime % 60;
                    document.getElementById('uptime').textContent =
                        \`\${hours}h \${minutes}m \${seconds}s\`;
                }
            } catch (error) {
                console.error('Health check failed:', error);
                document.getElementById('status').textContent = 'Error';
                document.getElementById('status').style.color = '#f56565';
            }
        }

        // Test endpoint
        async function testEndpoint(path) {
            try {
                const response = await fetch(path);
                const data = await response.json();
                alert(\`✅ Success!\\n\\n\${JSON.stringify(data, null, 2)}\`);
            } catch (error) {
                alert(\`❌ Error: \${error.message}\`);
            }
        }

        // Initialize
        updateTime();
        fetchHealth();
        setInterval(updateTime, 1000);
        setInterval(fetchHealth, 5000);
    </script>
</body>
</html>`;
}

/**
 * Create health check page for a service
 */
async function createHealthCheckPage(service: ServiceConfig): Promise<GenerationResult> {
  try {
    // Create public directory if it doesn't exist
    const publicDir = path.join(service.name, 'public');

    try {
      await fs.access(publicDir);
    } catch {
      await fs.mkdir(publicDir, { recursive: true });
    }

    // Generate HTML
    const html = generateHealthCheckHTML(service);
    const htmlPath = path.join(publicDir, 'index.html');

    await fs.writeFile(htmlPath, html);

    return {
      service: service.name,
      status: 'success',
      message: `✅ Created ${htmlPath}`,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      service: service.name,
      status: 'error',
      message: `Error: ${errorMessage}`,
    };
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log('🏥 Generating health check pages for backend services...\n');

  const results: GenerationResult[] = [];

  for (const service of BACKEND_SERVICES) {
    process.stdout.write(`[${BACKEND_SERVICES.indexOf(service) + 1}/${BACKEND_SERVICES.length}] ${service.name}... `);

    const result = await createHealthCheckPage(service);
    results.push(result);

    console.log(result.message);
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Health Check Generation Summary:');
  console.log(`   ✅ Created: ${results.filter((r) => r.status === 'success').length}`);
  console.log(`   ❌ Errors: ${results.filter((r) => r.status === 'error').length}`);
  console.log(`   📂 Total: ${results.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (results.filter((r) => r.status === 'success').length === BACKEND_SERVICES.length) {
    console.log('🎉 All health check pages generated successfully!\n');
    console.log('📝 Next Steps:');
    console.log('   1. Run: npx ts-node integrate-backend-health-pages.ts');
    console.log('   2. Start each service to test health pages');
    console.log('   3. Capture screenshots for catalogue\n');
  }
}

main().catch(console.error);
