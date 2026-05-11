# Docker Quick Start - AUCDT Utilities

## 🚀 Get Started in 3 Steps

### 1. Install Docker Desktop
Download from: https://www.docker.com/products/docker-desktop/

### 2. Start Applications
```bash
# High priority apps only (6 apps)
docker-compose up

# All 78 apps
docker-compose --profile full up
```

### 3. Open Browser
Visit: **http://localhost:8080**

---

## 📦 What You Get

✅ **78 Vite applications** in Docker containers
✅ **Single gateway** at http://localhost:8080
✅ **Isolated environments** - no dependency conflicts
✅ **Hot reload** in dev mode
✅ **Production-ready** nginx serving

---

## 🎯 Common Commands

```bash
# Start (foreground)
docker-compose up

# Start (background)
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose up --build

# Clean everything
docker-compose down -v
docker system prune -a
```

---

## 🔧 Modes

### Production Mode (Default)
```bash
docker-compose up
```
- 6 high-priority apps
- Fast startup
- Optimized builds

### Full Mode (All Apps)
```bash
docker-compose --profile full up
```
- All 78 applications
- Takes longer to start
- More resources needed

### Development Mode (Hot Reload)
```bash
docker-compose --profile dev up analytics-refactor-dev
```
- Live code reloading
- Source maps enabled
- Direct port access (3001, 3002, etc.)

---

## 🌐 Access Apps

### Through Gateway (Recommended)
- **Landing Page:** http://localhost:8080
- **Analytics:** http://localhost:8080/analytics-refactor/
- **Fees Comparison:** http://localhost:8080/fees-comparison/
- **Kanban:** http://localhost:8080/kanban/

### Direct Access (Dev Mode Only)
- **Analytics Dev:** http://localhost:3001
- **Fees Comparison Dev:** http://localhost:3002

---

## 📊 System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 8 GB | 16 GB |
| CPU | 4 cores | 8 cores |
| Disk | 10 GB free | 20 GB free |

**Configure Docker Desktop:**
1. Settings → Resources → Memory: **8 GB**
2. Settings → Resources → CPUs: **4+**
3. Apply & Restart

---

## 🐛 Quick Troubleshooting

### Port Already in Use
```bash
# Change port in docker-compose.yml
ports:
  - "8081:80"  # Instead of 8080
```

### Build Fails
```bash
# Clean and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Out of Memory
- Increase Docker Desktop memory limit
- Or run fewer apps:
  ```bash
  docker-compose up analytics-refactor fees-comparison-dashboard
  ```

### Slow Performance
```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1
docker-compose build
```

---

## 📁 Files Overview

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Main config (6 high-priority apps) |
| `docker-compose-full.yml` | All 78 apps (generated) |
| `Dockerfile.vite` | Production build |
| `Dockerfile.dev` | Development build with HMR |
| `generate-docker-compose.sh` | Auto-generates full compose file |
| `DOCKER_GUIDE.md` | Complete documentation |

---

## 🎓 Next Steps

1. **Start simple:**
   ```bash
   docker-compose up
   ```

2. **Access apps:**
   Open http://localhost:8080

3. **Read full guide:**
   See `DOCKER_GUIDE.md` for advanced usage

4. **Develop with hot reload:**
   ```bash
   docker-compose --profile dev up analytics-refactor-dev
   ```

---

## 💡 Pro Tips

1. **Run in background:**
   ```bash
   docker-compose up -d
   docker-compose logs -f  # View logs
   ```

2. **Build only what changed:**
   ```bash
   docker-compose up --build analytics-refactor
   ```

3. **Shell access:**
   ```bash
   docker-compose exec analytics-refactor sh
   ```

4. **Check health:**
   ```bash
   docker ps  # See HEALTHY/UNHEALTHY status
   ```

5. **Clean regularly:**
   ```bash
   docker system prune  # Weekly cleanup
   ```

---

## ✨ Features

- ✅ **Multi-stage builds** for smaller images
- ✅ **Health checks** on all containers
- ✅ **Nginx gateway** with reverse proxy
- ✅ **Volume mounting** for dev mode
- ✅ **Network isolation** for security
- ✅ **Graceful shutdown** with proper signals

---

## 📚 Documentation

- **Full Guide:** `DOCKER_GUIDE.md`
- **Vite Migration:** `VITE_MIGRATION_SUMMARY.md`
- **Pipeline Guide:** `PIPELINE_DOCUMENTATION.md`

---

**Ready to start?**

```bash
docker-compose up
```

Then visit: http://localhost:8080

🎉 **That's it!** All 78 apps are now containerized and ready to test!
