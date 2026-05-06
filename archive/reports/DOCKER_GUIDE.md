# Docker Compose Guide - TUC Utilities

**Last Updated:** February 20, 2026
**Total Projects:** 78
**Docker Compose Version:** 3.8

---

## 🚀 Quick Start

### Run High Priority Apps (6 apps)
```bash
docker-compose up
```

Access at: **http://localhost:8080**

### Run ALL 78 Apps
```bash
docker-compose --profile full up
```

### Run in Development Mode (with hot reload)
```bash
docker-compose --profile dev up analytics-refactor-dev
```

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
4. [Usage Examples](#usage-examples)
5. [Available Profiles](#available-profiles)
6. [Accessing Applications](#accessing-applications)
7. [Development Workflow](#development-workflow)
8. [Troubleshooting](#troubleshooting)
9. [Performance Tips](#performance-tips)
10. [Advanced Usage](#advanced-usage)

---

## Overview

This Docker Compose setup allows you to:

✅ **Test all 78 apps** in one containerized environment
✅ **Access everything** through a single gateway (nginx)
✅ **Develop with hot reload** using dev profile
✅ **Deploy identical environments** across machines
✅ **Isolate dependencies** - no more "works on my machine"

### Architecture Diagram

```
┌─────────────────────────────────────────┐
│   Browser: http://localhost:8080        │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│   Nginx Gateway (Port 8080)             │
│   - Reverse Proxy                       │
│   - Load Balancer                       │
│   - Static Landing Page                 │
└─┬───────────────────────────────────────┘
  │
  ├─────► analytics-refactor        (container)
  ├─────► fees-comparison           (container)
  ├─────► tuc-analytics           (container)
  ├─────► kanban-app                (container)
  ├─────► tuc-website             (container)
  ├─────► techbridge-portal         (container)
  └─────► ... 72 more apps          (on-demand)
```

---

## Prerequisites

### Required Software

1. **Docker Desktop** (version 20.10+)
   - Windows: https://www.docker.com/products/docker-desktop/
   - Mac: https://www.docker.com/products/docker-desktop/
   - Linux: `sudo apt install docker.io docker-compose`

2. **Docker Compose** (version 2.0+)
   - Included with Docker Desktop
   - Linux: `sudo apt install docker-compose-plugin`

### Verify Installation

```bash
docker --version
# Docker version 24.0.0+

docker-compose --version
# Docker Compose version 2.20.0+
```

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 8 GB | 16 GB |
| CPU | 4 cores | 8 cores |
| Disk Space | 10 GB | 20 GB |
| Docker Memory | 4 GB | 8 GB |

**Configure Docker Desktop:**
1. Open Docker Desktop Settings
2. Resources → Memory: Set to 8 GB
3. Resources → CPUs: Set to 4+
4. Apply & Restart

---

## Architecture

### File Structure

```
tuc-utilities/
├── docker-compose.yml              # Main compose file (6 apps)
├── docker-compose-full.yml         # All 78 apps (generated)
├── Dockerfile.vite                 # Production build
├── Dockerfile.dev                  # Development build
├── generate-docker-compose.sh      # Generator script
├── docker/
│   ├── nginx/
│   │   ├── nginx.conf             # Reverse proxy config
│   │   └── html/
│   │       └── index.html         # Landing page
│   └── nginx-vite.conf            # Per-app nginx config
├── [78 project directories]/
└── DOCKER_GUIDE.md                # This file
```

### Docker Images

**Base Images:**
- `node:20-alpine` - Build stage (lightweight)
- `nginx:alpine` - Production runtime (ultra-lightweight)

**Custom Images (built on demand):**
- `tuc-utilities-analytics-refactor` - ~120 MB
- `tuc-utilities-fees-comparison` - ~115 MB
- ... (one per app)

### Networks

**tuc-network** (bridge)
- Subnet: 172.20.0.0/16
- All containers communicate on this network
- Gateway handles external access

---

## Usage Examples

### Example 1: Start Everything
```bash
# Generate full compose file (if not exists)
bash generate-docker-compose.sh

# Start all 78 apps
docker-compose -f docker-compose-full.yml --profile full up

# Or detached mode (background)
docker-compose -f docker-compose-full.yml --profile full up -d
```

### Example 2: Start High Priority Only
```bash
# Default docker-compose.yml has 6 high priority apps
docker-compose up

# Or detached
docker-compose up -d
```

### Example 3: Start Specific Apps
```bash
# Start only analytics and fees comparison
docker-compose up analytics-refactor fees-comparison-dashboard
```

### Example 4: Development Mode
```bash
# Start analytics in dev mode (hot reload)
docker-compose --profile dev up analytics-refactor-dev

# Your code changes in ./analytics-refactor/ will auto-reload!
```

### Example 5: Rebuild After Changes
```bash
# Rebuild and restart
docker-compose up --build

# Force rebuild
docker-compose build --no-cache
docker-compose up
```

### Example 6: View Logs
```bash
# All logs
docker-compose logs

# Specific app
docker-compose logs analytics-refactor

# Follow logs (real-time)
docker-compose logs -f fees-comparison-dashboard
```

### Example 7: Stop Everything
```bash
# Stop all containers
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop and remove images
docker-compose down --rmi all
```

---

## Available Profiles

Docker Compose uses profiles to organize apps:

### Default Profile (No Flag)

**Runs:** 6 high-priority apps

```bash
docker-compose up
```

**Apps:**
1. analytics-refactor
2. fees-comparison-dashboard
3. tuc-analytics-dashboard
4. kanban-app
5. tuc-website-react
6. techbridge-product-design-6r-design-portal

### Full Profile

**Runs:** All 78 apps

```bash
docker-compose --profile full up
```

**Apps:** All 78 Vite projects

### Dev Profile

**Runs:** Development versions with hot reload

```bash
docker-compose --profile dev up <app>-dev
```

**Features:**
- ✅ Hot Module Replacement (HMR)
- ✅ Source code mounted as volume
- ✅ Changes reflect instantly
- ✅ Debugger support

**Example:**
```bash
# Edit files in ./analytics-refactor/src/
# See changes instantly at http://localhost:3001
docker-compose --profile dev up analytics-refactor-dev
```

---

## Accessing Applications

### Gateway Landing Page

**URL:** http://localhost:8080

Shows all apps with status and links.

### Individual Apps (via Gateway)

| App | URL |
|-----|-----|
| Analytics Refactor | http://localhost:8080/analytics-refactor/ |
| Fees Comparison | http://localhost:8080/fees-comparison/ |
| TUC Analytics | http://localhost:8080/tuc-analytics/ |
| Kanban | http://localhost:8080/kanban/ |
| TUC Website | http://localhost:8080/tuc-website/ |
| Techbridge Portal | http://localhost:8080/techbridge-portal/ |

### Direct Access (Dev Mode)

| App (Dev Mode) | Port |
|----------------|------|
| analytics-refactor-dev | http://localhost:3001 |
| fees-comparison-dev | http://localhost:3002 |

---

## Development Workflow

### Typical Workflow

1. **Start dev container:**
   ```bash
   docker-compose --profile dev up analytics-refactor-dev
   ```

2. **Edit code:**
   ```bash
   # Files in ./analytics-refactor/src/
   code analytics-refactor/src/App.jsx
   ```

3. **See changes:**
   - Open http://localhost:3001
   - Changes auto-reload!

4. **Check logs:**
   ```bash
   docker-compose logs -f analytics-refactor-dev
   ```

5. **Stop when done:**
   ```bash
   docker-compose stop analytics-refactor-dev
   ```

### Hot Reload

Dev containers mount your source code:

```yaml
volumes:
  - ./analytics-refactor:/app:cached  # Your code
  - /app/node_modules                 # Isolated deps
```

**Cached mode** = faster on Mac/Windows

---

## Troubleshooting

### Issue: Port Already in Use

**Error:**
```
Error starting userland proxy: listen tcp4 0.0.0.0:8080: bind: address already in use
```

**Solution:**
```bash
# Find process using port 8080
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Mac/Linux

# Kill process or change port in docker-compose.yml:
ports:
  - "8081:80"  # Use 8081 instead
```

### Issue: Build Fails

**Error:**
```
ERROR [builder 4/6] RUN pnpm run build
```

**Solution:**
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild without cache
docker-compose build --no-cache <service-name>

# Test build locally first
cd <project-name>
npm install
npm run build
```

### Issue: Container Keeps Restarting

**Check health:**
```bash
docker ps -a
# Look for unhealthy containers

docker inspect <container-name>
# Check health status
```

**Solution:**
```bash
# View logs
docker-compose logs <service-name>

# Remove and rebuild
docker-compose down
docker-compose up --build
```

### Issue: Out of Memory

**Error:**
```
ERROR: Container killed due to OOM
```

**Solution:**
1. Increase Docker Desktop memory (Settings → Resources)
2. Run fewer apps:
   ```bash
   # Instead of all 78:
   docker-compose up analytics-refactor fees-comparison-dashboard
   ```

### Issue: Slow Builds

**Solution:**
```bash
# Use BuildKit (faster)
DOCKER_BUILDKIT=1 docker-compose build

# Or set in environment:
export DOCKER_BUILDKIT=1
docker-compose build
```

### Issue: Network Issues

**Reset network:**
```bash
docker-compose down
docker network prune
docker-compose up
```

---

## Performance Tips

### 1. Use BuildKit
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

### 2. Multi-stage Build Caching
Dockerfile already uses multi-stage builds for efficiency.

### 3. Layer Caching
```dockerfile
# Copy package.json first (better caching)
COPY package*.json ./
RUN npm install
COPY . .  # Source code changes don't invalidate deps
```

### 4. Prune Regularly
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a
```

### 5. Limit Simultaneous Builds
```bash
# Build sequentially
for service in analytics-refactor fees-comparison tuc-analytics; do
  docker-compose build $service
done
```

---

## Advanced Usage

### Custom Nginx Routes

Edit `docker/nginx/nginx.conf`:

```nginx
location /my-custom-app/ {
    proxy_pass http://my-custom-app/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
}
```

### Environment Variables

**Per-app .env:**
```bash
# kanban-app/.env
VITE_API_KEY=your_key
VITE_API_URL=http://api.example.com
```

**Docker Compose override:**
```yaml
# docker-compose.override.yml
services:
  analytics-refactor:
    environment:
      - VITE_CUSTOM_VAR=value
```

### Health Checks

All containers have health checks:

```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

**Check status:**
```bash
docker ps
# HEALTHY or UNHEALTHY in STATUS column
```

### Resource Limits

Limit CPU/memory per container:

```yaml
services:
  analytics-refactor:
    deploy:
      resources:
        limits:
          cpus: '0.5'      # Max 50% of 1 CPU
          memory: 512M     # Max 512 MB RAM
        reservations:
          memory: 256M     # Min 256 MB RAM
```

---

## Maintenance

### Regular Tasks

**Weekly:**
```bash
# Prune unused resources
docker system prune

# Update base images
docker-compose pull
docker-compose up --build
```

**Monthly:**
```bash
# Deep clean
docker system prune -a --volumes

# Rebuild everything
docker-compose build --no-cache
```

### Monitoring

**Check resource usage:**
```bash
docker stats

# Specific container
docker stats analytics-refactor
```

**Check disk usage:**
```bash
docker system df
```

---

## CI/CD Integration

### Build in CI

```yaml
# .gitlab-ci.yml example
build:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker-compose build
    - docker-compose push
```

### Test in CI

```yaml
test:
  script:
    - docker-compose up -d
    - docker-compose exec analytics-refactor npm test
    - docker-compose down
```

---

## Quick Reference

### Essential Commands

```bash
# Start
docker-compose up
docker-compose up -d                    # Detached
docker-compose --profile full up        # All apps

# Stop
docker-compose stop                     # Stop containers
docker-compose down                     # Stop and remove
docker-compose down -v                  # Also remove volumes

# Build
docker-compose build                    # Build all
docker-compose build <service>          # Build one
docker-compose build --no-cache         # Force rebuild

# Logs
docker-compose logs                     # All logs
docker-compose logs -f <service>        # Follow logs
docker-compose logs --tail=100 <service> # Last 100 lines

# Execute commands
docker-compose exec <service> sh        # Shell access
docker-compose exec <service> npm test  # Run tests

# List
docker-compose ps                       # Running containers
docker-compose images                   # Built images

# Cleanup
docker-compose down --rmi all          # Remove images
docker system prune -a                 # Deep clean
```

---

## FAQ

### Q: How much disk space do I need?
**A:** ~20 GB for all 78 apps + images + build cache.

### Q: Can I run this on Windows?
**A:** Yes! Use Docker Desktop for Windows. Git Bash recommended for scripts.

### Q: Do containers share dependencies?
**A:** No, each container is isolated with its own node_modules.

### Q: Can I use this in production?
**A:** Yes, but consider Kubernetes for production scale. This is perfect for dev/staging.

### Q: How do I add a new app?
**A:**
1. Create project with Vite
2. Run `bash generate-docker-compose.sh`
3. `docker-compose --profile full up`

### Q: Why is the first build so slow?
**A:** Docker downloads base images and installs all dependencies. Subsequent builds use cache and are much faster.

---

## Support

### Resources
- **Docker Docs:** https://docs.docker.com
- **Docker Compose Docs:** https://docs.docker.com/compose
- **Vite Docs:** https://vitejs.dev

### Getting Help

1. Check logs: `docker-compose logs <service>`
2. Rebuild: `docker-compose up --build`
3. Clean state: `docker-compose down -v && docker-compose up`

---

**Created:** February 20, 2026
**Maintained By:** Techbridge ICT Department
**Questions?** Contact Head of ICT

---

🎉 **You're all set!** Run `docker-compose up` and access http://localhost:8080
