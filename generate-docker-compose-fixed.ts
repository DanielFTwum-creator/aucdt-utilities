#!/usr/bin/env node
/**
 * Generate corrected docker-compose-all-apps.yml with actual app paths
 */

import { promises as fs } from 'fs';
import path from 'path';
import { Dirent } from 'fs';

interface AppConfig {
  name: string;
  serviceName: string;
  isBackendOnly: boolean;
  isFrontend: boolean;
}

interface PackageJson {
  dependencies?: Record<string, string>;
}

interface ServiceConfig {
  image?: string;
  build?: {
    context: string;
    dockerfile: string;
  };
  container_name?: string;
  ports?: string[];
  volumes?: string[];
  environment?: Record<string, string>;
  networks?: string[];
  restart?: string;
  healthcheck?: {
    test: string[];
    interval: string;
    timeout: string;
    retries: number;
  };
  depends_on?: string[];
}

interface ComposeConfig {
  version?: string; // Optional - deprecated in Docker Compose
  services: Record<string, ServiceConfig>;
  networks: {
    'tuc-network': {
      driver: string;
      ipam: {
        config: Array<{ subnet: string }>;
      };
    };
  };
}

/**
 * Sanitize directory names for Docker service names
 * Docker service names can only contain: a-z, 0-9, -, _
 */
function sanitizeServiceName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[@()[\]{}]/g, '') // Remove special characters
    .replace(/\s+/g, '-')        // Replace spaces with hyphens
    .replace(/[^a-z0-9-_]/g, '') // Remove any other invalid chars
    .replace(/-+/g, '-')         // Remove duplicate hyphens
    .replace(/^-|-$/g, '');      // Remove leading/trailing hyphens
}

async function generateDockerCompose(): Promise<void> {
  console.log('🔧 Generating corrected docker-compose-all-apps.yml...\n');

  // Get all directories with package.json
  const entries: Dirent[] = await fs.readdir('.', { withFileTypes: true });
  const apps: AppConfig[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const packageJsonPath = path.join(entry.name, 'package.json');

    try {
      await fs.access(packageJsonPath);
      const packageJson: PackageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

      // Check if it's a backend or frontend app
      const hasExpress = !!(packageJson.dependencies?.express || packageJson.dependencies?.['@types/express']);
      const hasReact = !!(packageJson.dependencies?.react || packageJson.dependencies?.['react-dom']);

      const isBackendOnly: boolean = hasExpress && !hasReact;
      const isFrontend: boolean = hasReact || (!hasExpress && !isBackendOnly);

      apps.push({
        name: entry.name,                    // Original directory name
        serviceName: sanitizeServiceName(entry.name), // Sanitized for Docker
        isBackendOnly,
        isFrontend,
      });
    } catch (err) {
      // No package.json
    }
  }

  console.log(`✅ Found ${apps.length} apps:`);
  console.log(`   • ${apps.filter(a => a.isFrontend).length} frontend apps`);
  console.log(`   • ${apps.filter(a => a.isBackendOnly).length} backend APIs\n`);

  // Generate docker-compose content
  const compose: ComposeConfig = {
    services: {}, // version field removed - deprecated in Docker Compose
    networks: {
      'tuc-network': {
        driver: 'bridge',
        ipam: {
          config: [
            {
              subnet: '172.20.0.0/16',
            },
          ],
        },
      },
    },
  };

  // Add NGINX gateway first
  compose.services['nginx-gateway'] = {
    image: 'nginx:alpine',
    container_name: 'nginx-gateway',
    ports: ['8080:80'],
    volumes: [
      './docker/nginx/nginx-all-apps.conf:/etc/nginx/nginx.conf:ro',
      './docker/nginx/html:/usr/share/nginx/html:ro',
    ],
    networks: ['tuc-network'],
    restart: 'unless-stopped',
    depends_on: apps.filter(a => a.isFrontend).map(a => a.serviceName),
  };

  // Add all apps
  for (const app of apps) {
    const serviceName = app.serviceName;

    if (app.isBackendOnly) {
      // Backend service (Express API)
      compose.services[serviceName] = {
        build: {
          context: `./${app.name}`,
          dockerfile: '../Dockerfile.fullstack',
        },
        container_name: serviceName,
        environment: {
          NODE_ENV: 'production',
          PORT: '3000',
        },
        networks: ['tuc-network'],
        restart: 'unless-stopped',
      };
    } else {
      // Frontend service (Vite/React)
      compose.services[serviceName] = {
        build: {
          context: `./${app.name}`,
          dockerfile: '../Dockerfile.vite',
        },
        container_name: serviceName,
        environment: {
          NODE_ENV: 'production',
        },
        networks: ['tuc-network'],
        restart: 'unless-stopped',
        healthcheck: {
          test: ['CMD', 'wget', '--quiet', '--tries=1', '--spider', 'http://localhost/health'],
          interval: '30s',
          timeout: '10s',
          retries: 3,
        },
      };
    }
  }

  // Convert to YAML format (simplified)
  let yaml = `# Docker Compose for ALL TUC Applications
# Generated: ${new Date().toISOString()}
# Total Services: ${Object.keys(compose.services).length} (${apps.length} apps + gateway)

networks:
  tuc-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

services:
`;

  // Add each service
  for (const [name, config] of Object.entries(compose.services) as [string, ServiceConfig][]) {
    yaml += `\n  ${name}:\n`;

    if (config.image) {
      yaml += `    image: ${config.image}\n`;
    }

    if (config.build) {
      yaml += `    build:\n`;
      yaml += `      context: ${config.build.context}\n`;
      yaml += `      dockerfile: ${config.build.dockerfile}\n`;
    }

    if (config.container_name) {
      yaml += `    container_name: ${config.container_name}\n`;
    }

    if (config.ports) {
      yaml += `    ports:\n`;
      for (const port of config.ports) {
        yaml += `      - "${port}"\n`;
      }
    }

    if (config.volumes) {
      yaml += `    volumes:\n`;
      for (const volume of config.volumes) {
        yaml += `      - ${volume}\n`;
      }
    }

    if (config.environment) {
      yaml += `    environment:\n`;
      for (const [key, value] of Object.entries(config.environment)) {
        yaml += `      ${key}: ${value}\n`;
      }
    }

    if (config.networks) {
      yaml += `    networks:\n`;
      for (const network of config.networks) {
        yaml += `      - ${network}\n`;
      }
    }

    if (config.restart) {
      yaml += `    restart: ${config.restart}\n`;
    }

    if (config.healthcheck) {
      yaml += `    healthcheck:\n`;
      yaml += `      test: ${JSON.stringify(config.healthcheck.test)}\n`;
      yaml += `      interval: ${config.healthcheck.interval}\n`;
      yaml += `      timeout: ${config.healthcheck.timeout}\n`;
      yaml += `      retries: ${config.healthcheck.retries}\n`;
    }

    if (config.depends_on && config.depends_on.length > 0) {
      yaml += `    depends_on:\n`;
      for (const dep of config.depends_on.slice(0, 10)) { // Limit to first 10 to avoid too long
        yaml += `      - ${dep}\n`;
      }
    }
  }

  // Write file
  await fs.writeFile('docker-compose-all-apps-FIXED.yml', yaml);

  console.log('✅ Generated: docker-compose-all-apps-FIXED.yml');
  console.log(`\n📊 Summary:`);
  console.log(`   Total services: ${Object.keys(compose.services).length}`);
  console.log(`   Apps: ${apps.length}`);
  console.log(`   Gateway: 1`);
  console.log(`\n🎯 Next steps:`);
  console.log(`   1. Review the file: docker-compose-all-apps-FIXED.yml`);
  console.log(`   2. Backup old file: mv docker-compose-all-apps.yml docker-compose-all-apps.yml.backup`);
  console.log(`   3. Use new file: mv docker-compose-all-apps-FIXED.yml docker-compose-all-apps.yml`);
  console.log(`   4. Test: docker-compose -f docker-compose-all-apps.yml up -d\n`);
}

generateDockerCompose().catch(console.error);
