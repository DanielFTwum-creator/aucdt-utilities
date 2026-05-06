# ⚡ START HERE - Quick Build & Test

**Goal:** Build and test your 78 Vite apps in Docker in 3 simple steps!

---

## 🎯 Quick Start (15 minutes)

### Step 1: Start Docker Desktop ⏱️ 1 min

**Windows:**

- Start Menu → Search "Docker Desktop" → Click
- Wait for whale icon in system tray to show green

**Mac:**

- Applications → Docker Desktop → Open
- Wait for whale icon in menu bar to show green

**Verify it's running:**

```bash
docker ps
# Should show a table (even if empty)
```

---

### Step 2: Build & Start Apps ⏱️ 15-20 min (first time only!)

**Open terminal and run:**

```bash
cd C:/Users/DELL/OneDrive/Documents/Downloads/Development/aucdt-utilities

docker-compose up --build
```

**What happens:**

1. Downloads Docker images (2 min)
2. Installs dependencies for 6 apps (10 min)
3. Builds production bundles (5 min)
4. Starts all containers (1 min)

**Watch for this message:**

```
nginx-gateway | Gateway ready at :8080
```

✅ **Ready when you see:** "Gateway ready at :8080"

---

### Step 3: Test Your Apps ⏱️ 5 min

**Open browser:**

🌐 <http://localhost:8080>

**You should see:**

- Beautiful landing page
- List of 6 running apps
- Search functionality

**Click each app to test:**

1. Analytics Refactor
2. Fees Comparison Dashboard
3. AUCDT Analytics Dashboard
4. Kanban App
5. AUCDT Website
6. Techbridge Product Design Portal

✅ **Success when:** All apps load with styling and no errors!

---

## 🎉 That's It

**Total time:** ~20 minutes first time

**Next time:** Just `docker-compose up` (30 seconds!)

---

## 🐛 Quick Troubleshooting

### "Cannot connect to Docker daemon"

→ Docker Desktop not running - start it first!

### "Port 8080 already in use"

→ Something using port 8080 - stop it or change port in docker-compose.yml

### Build takes forever

→ Normal! First build downloads everything. Grab coffee ☕

---

## 📚 More Information

**For detailed step-by-step:** `DOCKER_BUILD_CHECKLIST.md`

**For complete guide:** `DOCKER_GUIDE.md`

**For quick reference:** `DOCKER_QUICK_START.md`

---

## 🚀 Commands You'll Use

```bash
# Start everything
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
Ctrl + C  (or: docker-compose down)
```

---

**Ready?** Start Docker Desktop, then run the command above! 🎊
