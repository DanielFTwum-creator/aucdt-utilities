# Patois Lyricist OAuth 403 Fix

## Problem Diagnosis

The Google OAuth callback was returning **403 Forbidden** error at `https://ai-tools.techbridge.edu.gh/patois/auth/google/callback` because the backend server (`server.ts`) wasn't handling the OAuth callback, likely due to:

1. **Backend not running**: The Node.js `server.ts` which handles OAuth wasn't started on port 3004
2. **Deployment configuration incomplete**: The `.htaccess` rules or backend startup might not have been properly configured
3. **Missing proxy rules in local dev**: nginx.conf was missing proxy rules for `/auth/` routes

## Solution Implemented

### 1. Fixed nginx.conf (for local Docker development)
Added reverse proxy configuration to forward authentication and API routes to the Node.js backend:

```nginx
upstream patois_backend {
    server localhost:3004 fail_timeout=5s max_fails=3;
}

location /api/ {
    proxy_pass http://patois_backend$request_uri;
    # ... headers and cookie handling ...
}

location /auth/ {
    proxy_pass http://patois_backend$request_uri;
    # ... headers and cookie handling ...
}
```

**Key points:**
- `/api/*` and `/auth/*` routes proxy to backend on port 3004
- Uses `$request_uri` to preserve full path
- Proper headers and cookie forwarding
- SPA catch-all `try_files` placed AFTER proxy rules so it doesn't intercept backend routes

### 2. Updated package.json (for development)
Added scripts to make development easier:

```json
"start": "tsx server.ts",              // Run backend only (port 3004)
"dev:full": "concurrently \"tsx server.ts\" \"vite\" --kill-others-on-exit"  // Run full stack
```

Also added `concurrently` to devDependencies for concurrent execution.

## How OAuth Works

### Architecture Overview:
```
                    Production (deploy.ps1)              Local Dev (Docker)
                    ================================      ==================
User (Browser)  →   Apache at /patois/         →        nginx at localhost:80
                    (frontend HTML/JS)                   (frontend HTML/JS)
                        ↓
                    .htaccess routes /auth/*   →        nginx routes /auth/*
                    to localhost:3004                   to localhost:3004
                        ↓
                    Node.js server.ts          →        Node.js server.ts
                    (OAuth handler)                     (OAuth handler)
```

### OAuth Flow:
1. User clicks "Google Login" button
2. Frontend initiates OAuth with `redirect_uri = https://ai-tools.techbridge.edu.gh/patois/auth/google/callback`
3. User authenticates with Google
4. Google redirects to callback URL
5. **Web server** (Apache in prod, nginx in Docker) proxies request to port 3004
6. **server.ts** receives OAuth code
7. Exchanges code for Google tokens
8. Decodes JWT to extract user info (id, name, email)
9. Sets `patois_user` cookie with base64-encoded user data
10. Redirects to frontend with user data in URL as fallback
11. Frontend's AuthContext reads cookie/URL and authenticates user

## Production Deployment (deploy.ps1)

The `deploy.ps1` script handles the complete deployment:

**Step 4: Apache Configuration**
```powershell
RewriteCond %{REQUEST_URI} ^/patois/(api|auth)/ [NC,OR]
RewriteCond %{REQUEST_URI} ^/(api|auth)/ [NC]
RewriteRule ^(api|auth)/(.*)$ http://localhost:3004/$1/$2 [P,L,NC]
```
Rewrites `/patois/auth/*` and `/patois/api/*` to port 3004.

**Step 6-7: Backend Setup**
- Installs Node.js production dependencies
- Starts server.ts with PM2: `PORT=3004 pm2 start server.ts --name patois-lyricist`

## Environment Configuration

`.env.local` must contain (already configured):
```env
VITE_GOOGLE_CLIENT_ID=<GOOGLE_CLIENT_ID - value lives in .env.local>
VITE_GOOGLE_REDIRECT_URI=https://ai-tools.techbridge.edu.gh/patois/auth/google/callback
GOOGLE_CLIENT_SECRET=<GOOGLE_CLIENT_SECRET - value lives in .env.local, never in docs>
```

## Usage

### Local Development - Full Stack:
From local machine (Windows/Mac/Linux):
```bash
cd C:\Development\github\aucdt-utilities\patois-lyricist-v2.0.0
pnpm install                    # Install all dependencies (including concurrently)
pnpm run dev:full              # Runs backend (3004) + frontend (5173) concurrently
```

**Starts:**
- Backend: `http://localhost:3004`
- Frontend: `http://localhost:5173`
- Opens browser to frontend automatically

### Backend Only:
```bash
cd C:\Development\github\aucdt-utilities\patois-lyricist-v2.0.0
pnpm run start                 # Starts Node.js server on port 3004
```

### Frontend Only (if backend running elsewhere):
```bash
cd C:\Development\github\aucdt-utilities\patois-lyricist-v2.0.0
pnpm run dev                   # Starts Vite on port 5173
```

### Production Deployment:
From local machine (Windows):
```powershell
cd C:\Development\github\aucdt-utilities\patois-lyricist-v2.0.0
.\deploy.ps1 -Build
```

**Deployment details:**
- Builds frontend with `vite build`
- Copies `dist/` → `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/patois/`
- Copies `server.ts`, `package.json`, `pnpm-lock.yaml`
- Installs production dependencies
- Creates `.htaccess` at `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/patois/.htaccess`
- Starts backend with PM2: `PORT=3004 pm2 start server.ts --name patois-lyricist`
- Runs health checks on port 3004

**Remote server details:**
```
Host: root@techbridge.edu.gh
Web Root: /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/patois/
Backend Port: 3004
```

## Security Notes

⚠️ **IMPORTANT**: 
- `.env.local` contains `GOOGLE_CLIENT_SECRET` - NEVER commit to git (it's in `.gitignore`)
- In production, environment variables should be managed securely via deployment secrets
- Consider adding OAuth state validation to prevent CSRF attacks

## Troubleshooting

### OAuth 403 in Production:
SSH to `root@techbridge.edu.gh`:

1. **Backend running?** Check PM2 status:
   ```bash
   pm2 list
   ```
   - If not running: 
   ```bash
   cd /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/patois
   PORT=3004 pm2 start server.ts --name patois-lyricist --interpreter npx --interpreter-args tsx
   pm2 save
   ```

2. **Port 3004 accessible?** Check if backend is listening:
   ```bash
   ss -tlnp | grep 3004
   ```

3. **.htaccess deployed?** Check file exists and has rewrite rules:
   ```bash
   cat /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/patois/.htaccess | grep -A2 "api\|auth"
   ```

4. **Environment variables set?** Check .env file:
   ```bash
   cat /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/patois/.env
   ```
   Should contain:
   ```
   VITE_GOOGLE_CLIENT_ID=537671076222-...
   VITE_GOOGLE_REDIRECT_URI=https://ai-tools.techbridge.edu.gh/patois/auth/google/callback
   GOOGLE_CLIENT_SECRET=GOCSPX-...
   ```

5. **Check logs:**
   ```bash
   tail -f /var/log/apache2/error.log                # Apache errors
   pm2 logs patois-lyricist                          # Backend server logs
   tail -f /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/patois/merge_execution.log  # If applicable
   ```

6. **Test OAuth endpoint directly:**
   ```bash
   curl -v http://localhost:3004/auth/health
   ```
   Should return 200 status

### OAuth 403 in Local Docker Dev:
1. Backend running? `docker logs patois-lyricist-v2 | grep "Server running"`
2. Port 3004 exposed? Check docker-compose.yml has `3004:3004`
3. nginx proxy working? Check logs: `docker exec patois-lyricist-v2 tail -f /var/log/nginx/error.log`

### Cookie Not Being Set:
1. Check DevTools → Application → Cookies
2. Verify cookie path: should be `/patois` (production) or `/` (localhost)
3. Check if cross-domain cookie is blocked

### User Stays on Login Screen:
1. Check browser console for errors
2. Verify `VITE_GOOGLE_CLIENT_ID` in `.env.local` or environment
3. Check AuthContext.tsx implementation

## Files Modified

1. **nginx.conf** - Added upstream and proxy rules for `/auth/` and `/api/`
2. **package.json** - Added `start` and `dev:full` scripts and `concurrently` dependency
3. **docker-compose.yml** - Exposed port 3004 for backend testing (optional)
4. **This file (OAUTH_FIX.md)** - Documentation

## Next Steps

1. **Local Testing**: 
   ```bash
   cd C:\Development\github\aucdt-utilities\patois-lyricist-v2.0.0
   pnpm install && pnpm run dev:full
   ```
   Test OAuth flow at `http://localhost:5173/`

2. **Production Deployment**:
   ```powershell
   cd C:\Development\github\aucdt-utilities\patois-lyricist-v2.0.0
   .\deploy.ps1 -Build
   ```
   Then verify on production:
   ```bash
   ssh root@techbridge.edu.gh
   pm2 list
   curl http://localhost:3004/api/health
   ```

3. **Security**: Consider adding OAuth state validation in `C:\Development\github\aucdt-utilities\patois-lyricist-v2.0.0\server.ts` (line 74)
