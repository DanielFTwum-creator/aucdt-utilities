# tuc Utilities - Complete Docker Ecosystem Guide

## Overview

The tuc Utilities project now contains **83 React applications** fully integrated into a Docker ecosystem with automated discovery, profiled deployment, and CI/CD support.

## Architecture

### Apps Breakdown
- **Core Apps (6)**: Always-running production apps
  - analytics-refactor
  - fees-comparison-dashboard
  - tuc-analytics-dashboard
  - kanban-app
  - tuc-website-react
  - techbridge-product-design-6r-design-portal

- **Standard Apps (66)**: On-demand apps
  - academic-performance-app
  - drone-showcase
  - english-safari
  - pdf-extractor-app
  - presentation-app
  - umoja-react-app
  - ... and 60 more

- **Experimental/AI Apps (11)**: AI and experimental features
  - ai-code-reviewer
  - ai-studio-directives
  - ai-utilities
  - ai_facebook_bot
  - sentinel-agent
  - ... and 6 more

### Network Architecture

```
        ┌─────────────────────┐
        │  nginx-gateway:8080 │
        └──────────┬──────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ┌───▼────┐         ┌──────▼─────┐
    │ Core   │         │ Standard/  │
    │ Apps   │         │ Experimental
    │ (6)    │         │ Apps (77)  │
    └────────┘         └────────────┘
        
    Subnet: 172.20.0.0/16
    Gateway: 8080
```

## Generated Files

### 1. `docker-compose-all-apps.yml`
Complete compose file with all 83 services, generated from `generate-docker-compose-all.ps1`

**Profiles:**
- Default (core apps only)
- `--profile standard` (core + standard apps)
- `--profile experimental` (core + experimental apps)
- `--profile '*'` (all apps)

### 2. Build Pipelines
- **PowerShell**: `build-all-apps.ps1` - Windows build orchestration
- **Bash**: `build-all-apps.sh` - Unix/Linux build orchestration

### 3. Generators
- **PowerShell**: `generate-docker-compose-all.ps1` - Auto-discovers and generates compose file
- **Node.js**: `generate-docker-compose-all.js` - Alternative generator with advanced filtering

## Quick Start

### Run Core Apps Only (Default)
```powershell
docker compose -f docker-compose-all-apps.yml up --build
```

### Run Core + Standard Apps
```powershell
docker compose -f docker-compose-all-apps.yml --profile standard up --build
```

### Run All Apps (Core + Standard + Experimental)
```powershell
docker compose -f docker-compose-all-apps.yml --profile '*' up --build
```

### Run Specific Profile
```powershell
# Standard apps only
docker compose -f docker-compose-all-apps.yml --profile standard up --build

# Experimental apps only
docker compose -f docker-compose-all-apps.yml --profile experimental up --build
```

## Build Pipeline Usage

### PowerShell Build Pipeline
```powershell
# Build core apps (default)
.\build-all-apps.ps1

# Build core + standard apps
.\build-all-apps.ps1 -Profile standard

# Build all apps
.\build-all-apps.ps1 -Profile all

# Parallel build (experimental)
.\build-all-apps.ps1 -Parallel -MaxConcurrent 3
```

### Bash Build Pipeline
```bash
# Build core apps
bash ./build-all-apps.sh

# View available options
bash ./build-all-apps.sh --help
```

## Docker Compose Commands

### List All Services
```powershell
docker compose -f docker-compose-all-apps.yml config --services
```

### View Specific Service Config
```powershell
docker compose -f docker-compose-all-apps.yml config --services | grep "kanban"
```

### Build Specific App
```powershell
docker compose -f docker-compose-all-apps.yml build tuc-analytics-dashboard
```

### Check Service Status
```powershell
docker compose -f docker-compose-all-apps.yml ps
```

### View Logs
```powershell
# All services
docker compose -f docker-compose-all-apps.yml logs -f

# Specific service
docker compose -f docker-compose-all-apps.yml logs -f kanban-app

# Last 100 lines
docker compose -f docker-compose-all-apps.yml logs --tail 100 analytics-refactor
```

### Stop Services
```powershell
# Stop core apps
docker compose -f docker-compose-all-apps.yml stop

# Stop all including standard/experimental
docker compose -f docker-compose-all-apps.yml --profile '*' stop

# Remove containers and volumes
docker compose -f docker-compose-all-apps.yml down -v
```

## Accessing Apps

### Gateway Routing (Recommended)
All apps are accessible through nginx-gateway at `http://localhost:8080`

**App Endpoints:**
- Core apps: `http://localhost:8080/<app-name>/`
- Standard apps: `http://localhost:8080/<app-name>/` (when running with --profile standard)
- Example: `http://localhost:8080/kanban-app/`

### Direct Access (Dev)
When running with specific ports, apps are accessible directly:
- Analytics Refactor: `http://localhost:3001`
- Fees Dashboard: `http://localhost:3002`
- etc.

## Regenerating docker-compose.yml

Run the generator script whenever you add new apps:

```powershell
# Generate updated docker-compose file
.\generate-docker-compose-all.ps1

# This will:
# 1. Discover all apps with package.json
# 2. Categorize into core/standard/experimental
# 3. Generate docker-compose-all-apps.yml
# 4. Show summary statistics
```

## Health Checks

All services include health checks:
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3 failures before marking unhealthy
- **Health Endpoint**: `http://localhost/health`

View health status:
```powershell
docker compose -f docker-compose-all-apps.yml ps
```

## Networking

- **Network Name**: `tuc-network`
- **Driver**: bridge
- **Subnet**: 172.20.0.0/16
- **Gateway**: 172.20.0.1

Services communicate via service names:
```
http://kanban-app/
http://tuc-analytics-dashboard/
http://analytics-refactor/
```

## Troubleshooting

### Build Failures
```powershell
# View build logs
Get-Content .\build-logs\<app-name>.log

# Rebuild specific app with verbose output
docker compose -f docker-compose-all-apps.yml build --no-cache <app-name>
```

### Container Won't Start
```powershell
# Check logs
docker compose -f docker-compose-all-apps.yml logs <service-name>

# Inspect container
docker inspect <container-id>

# Check health status
docker ps -a --filter "name=<service-name>"
```

### Network Issues
```powershell
# Verify network exists
docker network ls | grep tuc-network

# Inspect network
docker network inspect tuc-network

# Test connectivity between containers
docker compose -f docker-compose-all-apps.yml exec <service> wget -qO- http://<other-service>/health
```

### Memory Issues
```powershell
# Check resource usage
docker stats

# Limit memory for a service (edit docker-compose-all-apps.yml):
# deploy:
#   resources:
#     limits:
#       memory: 512M
#     reservations:
#       memory: 256M
```

## Performance Optimization

### Caching
- All builds use Docker layer caching
- `.dockerignore` excludes unnecessary files
- Vite builds are cached between runs

### Parallel Builds
```powershell
# Build multiple apps in parallel (requires BuildKit)
$env:DOCKER_BUILDKIT=1
docker compose -f docker-compose-all-apps.yml build --parallel
```

### Memory Optimization
For systems with limited RAM, run subsets:
```powershell
# Only core apps (6 containers)
docker compose -f docker-compose-all-apps.yml up

# Core + 10 standard apps
docker compose -f docker-compose-all-apps.yml --profile standard up
```

## Deployment Strategies

### Development
```powershell
# Use Dockerfile.dev for hot reload
# Edit docker-compose-all-apps.yml to change dockerfile: ../Dockerfile.dev
docker compose -f docker-compose-all-apps.yml up
```

### Staging
```powershell
# Run standard profile (66 apps)
docker compose -f docker-compose-all-apps.yml --profile standard up --build
```

### Production
```powershell
# Run only core apps (6 critical services)
docker compose -f docker-compose-all-apps.yml up --build -d
```

## Monitoring

### Container Metrics
```powershell
# Real-time stats
docker stats

# Historical stats (requires Docker Compose v2.7+)
docker compose -f docker-compose-all-apps.yml stats

# Log all container activity
docker events --filter type=container
```

### Service Health
```powershell
# Check all service health
docker compose -f docker-compose-all-apps.yml ps

# Watch for changes
docker compose -f docker-compose-all-apps.yml ps --watch
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build All Apps

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - run: |
          docker compose -f docker-compose-all-apps.yml build --progress=plain
```

### GitLab CI Example
```yaml
build_apps:
  stage: build
  script:
    - docker compose -f docker-compose-all-apps.yml build
  artifacts:
    reports:
      dotenv: build.log
```

## Statistics

- **Total Apps**: 83
- **React Apps**: 83
- **Vite Apps**: 78
- **Core Apps**: 6
- **Standard Apps**: 66
- **Experimental Apps**: 11
- **Default Port**: 3000+
- **Gateway Port**: 8080
- **Network Subnet**: 172.20.0.0/16

## File Structure
```
tuc-utilities/
├── docker-compose-all-apps.yml          # Generated main compose file
├── docker-compose.yml                    # Legacy (6 core apps)
├── generate-docker-compose-all.ps1       # Generator (Windows)
├── generate-docker-compose-all.js        # Generator (Node.js)
├── build-all-apps.ps1                    # Build pipeline (Windows)
├── build-all-apps.sh                     # Build pipeline (Unix/Linux)
├── Dockerfile.vite                       # Production Dockerfile
├── Dockerfile.dev                        # Development Dockerfile
├── docker/
│   └── nginx/
│       ├── nginx-all-apps.conf           # Generated nginx config
│       └── html/                         # Static files
├── build-logs/                           # Build logs
└── [83 app directories]/
    └── package.json
```

## Next Steps

1. **Generate compose file**: Run `.\generate-docker-compose-all.ps1`
2. **Build apps**: Run `.\build-all-apps.ps1 -Profile core`
3. **Start services**: Run `docker compose -f docker-compose-all-apps.yml up --build`
4. **Access gateway**: Open `http://localhost:8080`
5. **Monitor**: Run `docker stats` to watch resource usage

## Support

For issues or questions:
1. Check `build-logs/` for build errors
2. Run `docker compose logs -f <service>` for runtime errors
3. Review this guide's Troubleshooting section
4. Check Docker documentation: https://docs.docker.com/

---

**Generated**: February 21, 2026
**Total Apps Managed**: 83
**Last Updated**: Auto-generated by discover process
