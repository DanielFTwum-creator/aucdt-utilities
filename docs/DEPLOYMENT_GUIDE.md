# 🎓 Techbridge University College - Deployment Guide

## Architecture
The suite uses a containerized architecture managed by Docker Compose.
- **Gateway:** Nginx (Port 8080)
- **Frontend Apps:** Vite/React (Served as static files or via Nginx)
- **Backend APIs:** Node.js/Express (Port 3000-4000 range)

## Prerequisites
- Docker & Docker Compose
- Node.js 20+
- pnpm (Package Manager)

## Quick Start
1. **Sync Projects:** `pnpm install` in root.
2. **Build All:** `docker-compose -f docker-compose-all-apps.yml build`
3. **Run All:** `docker-compose -f docker-compose-all-apps.yml up -d`

## Troubleshooting Build Failures
- **Unused Locals:** If a build fails due to `TS6133`, ensure `tsconfig.json` has `"noUnusedLocals": false` or fix the code.
- **Docker Cache:** Run `docker system prune -a --force` to clear corrupted build layers.

## Configuration
- **Nginx Config:** `docker/nginx/nginx-all-apps.conf`
- **Compose File:** `docker-compose-all-apps.yml`

---
*Last Updated: March 11, 2026*
