# Backend Server Port Allocation

Each app's Node.js/Express backend listens on a unique port. Apache mod_rewrite proxies requests from the public subdirectory to the corresponding port.

| App | URL | Backend Port | Status | Notes |
|-----|-----|--------------|--------|-------|
| Glucose | `/glucose/` | 3001 | ✅ Configured | Via `process.env.PORT \|\| 3001` |
| Peace Vinyl | `/peace/` | 3002 | ✅ Configured | Via `process.env.PORT \|\| 3002` |
| TUC AI Lab | `/ai-lab/` | 3003 | 🔄 To Update | Currently hardcoded to 3000 |
| Groove Streamer | `/groove-streamer/` | 3004 | ⏳ To Update | Currently hardcoded to 3000 |
| BioChemAI | `/biochemai/` | 3005 | ⏳ No backend yet | Frontend-only; needs OAuth backend |
| WillPro | `/willpro/` | 3006 | ⏳ No backend yet | Frontend-only; needs OAuth backend |
| Email Drafter | `/email-drafter/` | 3007 | ✅ Configured | Via `process.env.PORT \|\| 3007` |
| Deliberate Magic Reader | `/magic-reader/` | 3008 | ✅ Configured | Via `process.env.PORT \|\| 3008` |

---

## .htaccess Proxy Configuration

For each app, the .htaccess file includes a proxy rule pointing to the correct backend port:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /[app-name]/
  
  # Skip physical files/directories
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Proxy OAuth callback to backend
  RewriteRule ^auth/google/callback http://localhost:PORT/auth/google/callback [P,L]
  
  # Proxy API routes to backend
  RewriteRule ^api/(.*)$ http://localhost:PORT/api/$1 [P,L]
  
  # Catch-all to index.html for SPA routing
  RewriteRule ^ /[app-name]/index.html [QSA,L]
</IfModule>
```

Replace `PORT` with the corresponding app port from the table above.

---

## Server Implementation Pattern

All server.ts/server.js files should use this pattern:

```typescript
const PORT = process.env.PORT || DEFAULT_PORT;

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

This allows:
1. Running servers on different ports locally (set PORT=3003)
2. Using hardcoded defaults if PORT env var not set

---

## How to Update (Next Steps)

### For TUC AI Lab (3000 → 3003)
1. Edit `server.ts`: `const PORT = process.env.PORT || 3003;`
2. Edit `deploy.ps1`: Update .htaccess proxy rule from `http://localhost:3000/` to `http://localhost:3003/`
3. Re-deploy

### For Groove Streamer (3000 → 3004)
Same as TUC AI Lab but with PORT 3004

### For BioChemAI & WillPro (Once OAuth Backends Are Built)
1. Create `server.ts` with OAuth handlers
2. Assign next available port (3005, 3006)
3. Deploy with corresponding .htaccess

---

## Testing Port Allocation Locally

To test multiple backends running simultaneously:

```bash
cd peace-vinyl && PORT=3002 npm start &
cd tuc-ai-lab-catalog && PORT=3003 npm start &
cd groove-streamer && PORT=3004 npm start &

# Test connectivity
curl http://localhost:3002/api/health
curl http://localhost:3003/api/health
curl http://localhost:3004/api/health
```

---

## Apache Verification

After deploying all apps, verify Apache proxying:

```bash
ssh root@66.226.72.199
ps aux | grep node  # Should show 6 processes listening on ports 3001-3006

# Test each proxy route
curl -v https://ai-tools.techbridge.edu.gh/glucose/
curl -v https://ai-tools.techbridge.edu.gh/peace/
curl -v https://ai-tools.techbridge.edu.gh/ai-lab/
curl -v https://ai-tools.techbridge.edu.gh/groove-streamer/
```

