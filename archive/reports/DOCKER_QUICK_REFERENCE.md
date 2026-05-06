# TUC Docker Quick Reference

## 🚀 Quick Start

```powershell
# Regenerate compose file (whenever you add new apps)
.\generate-docker-compose-all.ps1

# Build and run core apps
docker compose -f docker-compose-all-apps.yml up --build

# Run with standard apps
docker compose -f docker-compose-all-apps.yml --profile standard up --build

# Run all apps
docker compose -f docker-compose-all-apps.yml --profile '*' up --build
```

## 📊 App Statistics
- **Total**: 83 apps
- **Core**: 6 (always-on production apps)
- **Standard**: 66 (on-demand)
- **Experimental/AI**: 11 (optional)

## 🎯 Core Apps
1. analytics-refactor
2. fees-comparison-dashboard
3. tuc-analytics-dashboard
4. kanban-app
5. tuc-website-react
6. techbridge-product-design-6r-design-portal

## 🔍 Common Commands

### Start/Stop
```powershell
# Start core apps only
docker compose -f docker-compose-all-apps.yml up -d

# Start with standard apps
docker compose -f docker-compose-all-apps.yml --profile standard up -d

# Start all apps
docker compose -f docker-compose-all-apps.yml --profile '*' up -d

# Stop all
docker compose -f docker-compose-all-apps.yml --profile '*' stop

# Restart specific app
docker compose -f docker-compose-all-apps.yml restart kanban-app
```

### Logs & Status
```powershell
# View all logs (live)
docker compose -f docker-compose-all-apps.yml logs -f

# View specific app logs
docker compose -f docker-compose-all-apps.yml logs -f kanban-app

# Show status
docker compose -f docker-compose-all-apps.yml ps

# Show resource usage
docker stats
```

### Build
```powershell
# Build all core apps
docker compose -f docker-compose-all-apps.yml build

# Build specific app
docker compose -f docker-compose-all-apps.yml build kanban-app

# Build without cache
docker compose -f docker-compose-all-apps.yml build --no-cache

# Build with progress
docker compose -f docker-compose-all-apps.yml build --progress=plain
```

### Cleanup
```powershell
# Remove stopped containers
docker compose -f docker-compose-all-apps.yml rm

# Remove all (containers + volumes)
docker compose -f docker-compose-all-apps.yml down -v

# Remove all including standard/experimental
docker compose -f docker-compose-all-apps.yml --profile '*' down -v

# Remove dangling images
docker image prune -f
```

## 🌐 Access Apps

**Gateway**: `http://localhost:8080`

**Core Apps**:
- Analytics Refactor: `http://localhost:8080/analytics-refactor/`
- Kanban App: `http://localhost:8080/kanban-app/`
- TUC Analytics Dashboard: `http://localhost:8080/tuc-analytics-dashboard/`
- Fees Dashboard: `http://localhost:8080/fees-comparison-dashboard/`
- TUC Website: `http://localhost:8080/tuc-website-react/`
- Product Design Portal: `http://localhost:8080/techbridge-product-design-6r-design-portal/`

## 🏗️ Build Pipeline

```powershell
# Build core apps (6 apps)
.\build-all-apps.ps1

# Build with standard apps (72 apps)
.\build-all-apps.ps1 -Profile standard

# Build all apps (83 apps)
.\build-all-apps.ps1 -Profile all

# Check build logs
Get-Content .\build-logs\kanban-app.log
```

## 🔧 Troubleshooting

### App won't start
```powershell
# Check logs
docker compose -f docker-compose-all-apps.yml logs kanban-app

# Inspect container
docker inspect kanban-app

# Rebuild
docker compose -f docker-compose-all-apps.yml build --no-cache kanban-app
```

### Out of memory
```powershell
# Check memory usage
docker stats

# Reduce running apps
docker compose -f docker-compose-all-apps.yml down
docker compose -f docker-compose-all-apps.yml up  # Just core
```

### Port already in use
```powershell
# Check what's using port 8080
netstat -ano | findstr :8080

# Kill process
taskkill /PID <PID> /F

# Or change gateway port in compose file (8080:80)
```

### Network issues
```powershell
# Check network
docker network ls | grep tuc

# Inspect network
docker network inspect tuc-network

# Test service connectivity
docker compose -f docker-compose-all-apps.yml exec kanban-app ping nginx-gateway
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `docker-compose-all-apps.yml` | Main compose file (auto-generated) |
| `generate-docker-compose-all.ps1` | Generator script |
| `build-all-apps.ps1` | Build pipeline (Windows) |
| `Dockerfile.vite` | Production Dockerfile |
| `Dockerfile.dev` | Development Dockerfile |
| `DOCKER_ECOSYSTEM_GUIDE.md` | Full documentation |

## 🎓 Profiles Explained

```yaml
# Run only core (default)
docker compose -f docker-compose-all-apps.yml up

# Run core + standard apps
docker compose -f docker-compose-all-apps.yml --profile standard up

# Run core + experimental apps
docker compose -f docker-compose-all-apps.yml --profile experimental up

# Run everything
docker compose -f docker-compose-all-apps.yml --profile '*' up
```

## 📈 Performance Tips

1. **Start small**: Use default (core only) first
2. **Add gradually**: Use `--profile standard` to add more
3. **Monitor**: Use `docker stats` to watch resources
4. **Clean up**: Run `docker system prune` regularly
5. **Cache**: Don't use `--no-cache` unless necessary

## 🚨 When to Regenerate Compose

Run `generate-docker-compose-all.ps1` when:
- ✅ Adding new app directories
- ✅ Reorganizing app structure
- ✅ Changing core app definitions
- ✅ After major updates

## 💡 Pro Tips

```powershell
# Watch logs in real-time
docker compose -f docker-compose-all-apps.yml logs -f --tail 50

# Execute command in container
docker compose -f docker-compose-all-apps.yml exec kanban-app npm --version

# Copy files from container
docker compose -f docker-compose-all-apps.yml cp kanban-app:/app/dist ./output

# Shell into container
docker compose -f docker-compose-all-apps.yml exec kanban-app /bin/sh
```

## 🔐 Security Notes

- Apps run in isolated network (172.20.0.0/16)
- Health checks ensure only healthy services receive traffic
- Volume mounts are read-only where possible
- No default credentials exposed

## 📞 Support Resources

- Docker Docs: https://docs.docker.com
- Compose Docs: https://docs.docker.com/compose/
- Full Guide: See `DOCKER_ECOSYSTEM_GUIDE.md`

---

**Quick Help**: `docker compose -f docker-compose-all-apps.yml --help`

**Date**: February 2026 | **Apps**: 83 | **Profiles**: 3
