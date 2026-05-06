#!/usr/bin/env node
/**
 * Docker Compose Generator for TUC Utilities
 * Automatically discovers and generates docker-compose.yml for all 79 React apps
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  projectRoot: process.cwd(),
  composeVersion: '3.8',
  defaultPort: 3000,
  gatewayPort: 8080,
  networkSubnet: '172.20.0.0/16',
  profiles: {
    core: {
      description: 'Core production apps (always running)',
      priority: 1,
      apps: [
        'analytics-refactor',
        'fees-comparison-dashboard',
        'aucdt-analytics-dashboard',
        'kanban-app',
        'aucdt-website-react',
        'techbridge-product-design-6r-design-portal'
      ]
    },
    standard: {
      description: 'Standard apps (on-demand)',
      priority: 2,
      apps: []
    },
    experimental: {
      description: 'Experimental/AI apps (optional)',
      priority: 3,
      apps: []
    },
    dev: {
      description: 'Development mode services',
      priority: 4,
      apps: []
    }
  }
};

/**
 * Discover all apps with package.json
 */
function discoverApps() {
  const appRoot = CONFIG.projectRoot;
  const entries = fs.readdirSync(appRoot, { withFileTypes: true });
  
  const apps = [];
  const skipDirs = new Set([
    'docker', 'node_modules', '.github', '.claude', 'Document',
    '.git', 'dist', 'build', 'coverage'
  ]);

  for (const entry of entries) {
    if (entry.isDirectory() && !skipDirs.has(entry.name)) {
      const packageJsonPath = path.join(appRoot, entry.name, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          apps.push({
            name: entry.name,
            containerName: entry.name.replace(/\s+/g, '-').toLowerCase(),
            packageJson: pkg,
            hasReact: pkg.dependencies?.react || pkg.devDependencies?.react || false,
            isVite: pkg.devDependencies?.vite || false,
            isExperimental: entry.name.includes('ai-') || entry.name.includes('gemini') || entry.name.includes('genie')
          });
        } catch (e) {
          console.warn(`Failed to parse package.json for ${entry.name}`);
        }
      }
    }
  }

  return apps;
}

/**
 * Categorize apps into profiles
 */
function categorizeApps(apps) {
  const profiles = JSON.parse(JSON.stringify(CONFIG.profiles)); // Deep copy

  apps.forEach(app => {
    const inCoreProfile = profiles.core.apps.includes(app.name);
    
    if (inCoreProfile) {
      // Already in core
    } else if (app.isExperimental) {
      profiles.experimental.apps.push(app.name);
    } else {
      profiles.standard.apps.push(app.name);
    }
  });

  return profiles;
}

/**
 * Generate service configuration
 */
function generateService(app, port, profile = 'core', isDev = false) {
  const service = {
    build: {
      context: `./${app.name}`,
      dockerfile: isDev ? '../Dockerfile.dev' : '../Dockerfile.vite'
    },
    container_name: isDev ? `${app.containerName}-dev` : app.containerName,
    environment: {
      NODE_ENV: isDev ? 'development' : 'production'
    },
    networks: ['aucdt-network'],
    restart: 'unless-stopped'
  };

  // Add dev-specific config
  if (isDev) {
    service.volumes = [
      `./${app.name}:/app:cached`,
      '/app/node_modules'
    ];
    service.ports = [`${3000 + Math.floor(Math.random() * 1000)}:5173`];
  } else {
    // Add health check for prod
    service.healthcheck = {
      test: ['CMD', 'wget', '--quiet', '--tries=1', '--spider', 'http://localhost/health'],
      interval: '30s',
      timeout: '10s',
      retries: 3
    };
  }

  // Add profile if not core
  if (profile !== 'core') {
    service.profiles = [profile];
  }

  return service;
}

/**
 * Generate nginx config
 */
function generateNginxConfig(apps) {
  let config = `upstream gateway {\n    server localhost:8080;\n}\n\n`;
  config += `server {\n    listen 80;\n    server_name localhost;\n    root /usr/share/nginx/html;\n\n`;
  
  // Add location blocks for each app
  apps.forEach((app, idx) => {
    const port = 3000 + idx;
    config += `    location /${app.containerName}/ {\n`;
    config += `        proxy_pass http://${app.containerName}:3000/;\n`;
    config += `        proxy_set_header Host $host;\n`;
    config += `        proxy_set_header X-Real-IP $remote_addr;\n`;
    config += `        proxy_http_version 1.1;\n`;
    config += `        proxy_set_header Upgrade $http_upgrade;\n`;
    config += `        proxy_set_header Connection upgrade;\n`;
    config += `    }\n\n`;
  });

  config += `    location /health {\n`;
  config += `        access_log off;\n`;
  config += `        return 200 "gateway healthy\\n";\n`;
  config += `        add_header Content-Type text/plain;\n`;
  config += `    }\n\n`;
  config += `    location / {\n`;
  config += `        try_files $uri $uri/ /index.html;\n`;
  config += `    }\n`;
  config += `}\n`;

  return config;
}

/**
 * Generate docker-compose.yml
 */
function generateDockerCompose(apps, profiles) {
  const compose = {
    version: CONFIG.composeVersion,
    services: {
      'nginx-gateway': {
        image: 'nginx:alpine',
        container_name: 'aucdt-gateway',
        ports: [`${CONFIG.gatewayPort}:80`],
        volumes: [
          './docker/nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro',
          './docker/nginx/html:/usr/share/nginx/html:ro'
        ],
        depends_on: profiles.core.apps.slice(0, 5),
        networks: ['aucdt-network'],
        restart: 'unless-stopped',
        healthcheck: {
          test: ['CMD', 'wget', '--quiet', '--tries=1', '--spider', 'http://localhost/health'],
          interval: '30s',
          timeout: '10s',
          retries: 3
        }
      }
    },
    networks: {
      'aucdt-network': {
        driver: 'bridge',
        ipam: {
          config: [
            { subnet: CONFIG.networkSubnet }
          ]
        }
      }
    },
    volumes: {
      node_modules: {}
    }
  };

  // Add all apps as services
  apps.forEach((app, idx) => {
    const port = CONFIG.defaultPort + idx;
    const profile = profiles.core.apps.includes(app.name)
      ? 'core'
      : profiles.experimental.apps.includes(app.name)
      ? 'experimental'
      : 'standard';

    compose.services[app.name] = generateService(app, port, profile, false);
  });

  return compose;
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Discovering all React apps...');
  const apps = discoverApps();
  console.log(`✅ Found ${apps.length} apps with package.json\n`);

  console.log('📊 Categorizing apps into profiles...');
  const profiles = categorizeApps(apps);
  console.log(`Core: ${profiles.core.apps.length}`);
  console.log(`Standard: ${profiles.standard.apps.length}`);
  console.log(`Experimental: ${profiles.experimental.apps.length}\n`);

  console.log('🏗️ Generating docker-compose.yml...');
  const dockerCompose = generateDockerCompose(apps, profiles);
  
  const composePath = path.join(CONFIG.projectRoot, 'docker-compose-generated.yml');
  fs.writeFileSync(composePath, require('js-yaml').dump(dockerCompose, { lineWidth: -1 }));
  console.log(`✅ Generated: ${composePath}`);

  console.log('\n🌐 Generating nginx configuration...');
  const nginxConfig = generateNginxConfig(apps);
  const nginxPath = path.join(CONFIG.projectRoot, 'docker/nginx/nginx-generated.conf');
  fs.writeFileSync(nginxPath, nginxConfig);
  console.log(`✅ Generated: ${nginxPath}`);

  console.log('\n📋 App Summary:');
  console.log(`Total React Apps: ${apps.length}`);
  console.log(`Vite Apps: ${apps.filter(a => a.isVite).length}`);
  console.log(`Experimental (AI): ${apps.filter(a => a.isExperimental).length}`);

  return {
    apps,
    profiles,
    dockerCompose,
    nginxConfig
  };
}

// Run if executed directly
if (require.main === module) {
  try {
    const result = main();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = {
  discoverApps,
  categorizeApps,
  generateService,
  generateDockerCompose,
  main
};
