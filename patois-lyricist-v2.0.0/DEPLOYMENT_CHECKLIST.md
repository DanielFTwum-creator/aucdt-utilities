# Patois Lyricist v2.0.0 - Deployment Checklist

## OAuth 403 Fix - Implementation Status

### ✅ Files Modified

1. **nginx.conf** 
   - Path: `C:\Development\github\aucdt-utilities\patois-lyricist-v2.0.0\nginx.conf`
   - Changes: Added upstream proxy (localhost:3004) and location blocks for `/auth/` and `/api/`
   - Purpose: Local Docker development - proxies backend routes to Node.js server

2. **package.json**
   - Path: `C:\Development\github\aucdt-utilities\patois-lyricist-v2.0.0\package.json`
   - Changes: 
     - Added `"start": "tsx server.ts"` script
     - Added `"dev:full": "concurrently \"tsx server.ts\" \"vite\" --kill-others-on-exit"` script
     - Added `concurrently` to devDependencies
   - Purpose: Enable running backend server and full stack locally

3. **docker-compose.yml**
   - Path: `C:\Development\github\aucdt-utilities\patois-lyricist-v2.0.0\docker-compose.yml`
   - Changes: Exposed port 3004 for backend, added OAuth environment variables
   - Purpose: Allow testing backend and OAuth locally in Docker

4. **OAUTH_FIX.md**
   - Path: `C:\Development\github\aucdt-utilities\patois-lyricist-v2.0.0\OAUTH_FIX.md`
   - Content: Complete documentation with troubleshooting
   - Purpose: Reference guide for OAuth flow, deployment, and troubleshooting

5. **Dockerfile**
   - Path: `C:\Development\github\aucdt-utilities\patois-lyricist-v2.0.0\Dockerfile`
   - Status: Reverted to original (frontend-only build)
   - Note: Production doesn't use Docker; uses deploy.ps1 instead

### 📋 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                     │
├─────────────────────────────────────────────────────────────┤
│ Method: PowerShell script (deploy.ps1)                       │
│ Server: root@techbridge.edu.gh                              │
│ Path: /var/www/vhosts/techbridge.edu.gh/...../patois/      │
│                                                              │
│ 1. Frontend served by Apache (/patois/)                     │
│ 2. .htaccess rewrites /auth/* and /api/* → localhost:3004  │
│ 3. Backend: Node.js server.ts on port 3004 (via PM2)       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  LOCAL DEVELOPMENT DEPLOYMENT                │
├─────────────────────────────────────────────────────────────┤
│ Method: Docker + nginx OR npm scripts                        │
│ Ports: Frontend 5173, Backend 3004, nginx 3000              │
│                                                              │
│ Option A - Full Stack (Docker):                             │
│ docker-compose up                                            │
│ nginx (3000) proxies /auth/* to backend (3004)              │
│                                                              │
│ Option B - Native Node.js:                                  │
│ pnpm run dev:full                                            │
│ Runs backend + frontend concurrently                         │
└─────────────────────────────────────────────────────────────┘
```

### 🚀 Testing Procedures

#### Local Development (Native):
```bash
cd C:\Development\github\aucdt-utilities\patois-lyricist-v2.0.0
pnpm install
pnpm run dev:full
```
- Backend logs: Shows "Server running on http://localhost:3004"
- Frontend: http://localhost:5173
- Test OAuth at: http://localhost:5173 (login button)

#### Local Development (Docker):
```bash
cd C:\Development\github\aucdt-utilities\patois-lyricist-v2.0.0
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3004 (exposed)
- Test OAuth at: http://localhost:3000

#### Production Deployment:
```powershell
cd C:\Development\github\aucdt-utilities\patois-lyricist-v2.0.0
.\deploy.ps1 -Build
```
Then verify:
```bash
ssh root@techbridge.edu.gh
pm2 list                                    # Check backend running
curl http://localhost:3004/api/health       # Verify port 3004
cat /var/www/vhosts/.../patois/.htaccess   # Check Apache config
```

### 🔍 Verification Checklist

- [ ] Local dev: `pnpm install` succeeds
- [ ] Local dev: `pnpm run dev:full` starts backend + frontend
- [ ] Local dev: Google login button visible
- [ ] Local dev: OAuth redirects to backend without 403
- [ ] Local dev: Frontend receives user info and authenticates
- [ ] Production: `deploy.ps1 -Build` completes without errors
- [ ] Production: PM2 shows `patois-lyricist` running: `pm2 list`
- [ ] Production: Port 3004 listening: `ss -tlnp | grep 3004`
- [ ] Production: `.htaccess` exists with rewrite rules
- [ ] Production: Google OAuth flow works end-to-end

### 🛠️ Key Files Reference

| File | Location | Purpose |
|------|----------|---------|
| server.ts | `C:\Dev\...\patois-lyricist-v2.0.0\server.ts` | OAuth handler, API proxy |
| AuthContext.tsx | `C:\Dev\...\patois-lyricist-v2.0.0\contexts\AuthContext.tsx` | Frontend auth state |
| LoginView.tsx | `C:\Dev\...\patois-lyricist-v2.0.0\components\LoginView.tsx` | Google login button |
| nginx.conf | `C:\Dev\...\patois-lyricist-v2.0.0\nginx.conf` | Local dev proxy config |
| deploy.ps1 | `C:\Dev\...\patois-lyricist-v2.0.0\deploy.ps1` | Production deployment |
| .env.local | `C:\Dev\...\patois-lyricist-v2.0.0\.env.local` | OAuth credentials |

### 🔐 Environment Variables

Required in `.env.local` or via deployment:
```
VITE_GOOGLE_CLIENT_ID=<GOOGLE_CLIENT_ID - value lives in .env.local>
VITE_GOOGLE_REDIRECT_URI=https://ai-tools.techbridge.edu.gh/patois/auth/google/callback
GOOGLE_CLIENT_SECRET=<GOOGLE_CLIENT_SECRET - value lives in .env.local, never in docs>
GEMINI_PROXY_KEY=<from WMS>
```

### 📝 Notes

- **Docker**: Used for local development only, NOT production
- **Production**: Uses Apache + PM2, NOT Docker
- **OAuth State**: Currently not validated - consider adding for security
- **Port Mapping**: Local port 3004 (backend), 5173 (frontend Vite), 3000 (nginx if Docker)
- **.env.local**: Contains secrets, NEVER commit to git (in .gitignore)

---
Generated: 2026-06-25
Status: OAuth 403 fix implemented and documented
