# Peace & One Love Vinyl — Deployment Guide

## Production Deployment to ai-tools.techbridge.edu.gh/peace

### Prerequisites
- PowerShell 5.0+
- SSH access to `root@66.226.72.199`
- `glucose/.env.local` exists in the monorepo (shared TUC credentials)

### Quick Deploy

```powershell
# From peace-&-one-love-vinyl directory
./deploy.ps1 -Build
```

**What this does:**
1. Copies `.env.local` from glucose (shared org credentials)
2. Builds the Vite project (`npm run build`)
3. Creates production dist/ folder
4. SCP transfers dist files to Plesk server
5. Creates .htaccess for SPA routing
6. Sets permissions (techbridge.edu.gh_md:psacln)

### URL
Once deployed: **https://ai-tools.techbridge.edu.gh/peace**

### Environment Variables
Uses shared credentials from `glucose/.env.local`:
- `VITE_GOOGLE_CLIENT_ID` — TUC OAuth app
- `VITE_GOOGLE_REDIRECT_URI` — Redirect to /peace/auth/google/callback
- `VITE_GEMINI_API_KEY` — Google Gemini API key

### Troubleshooting

**SSH key issues:**
```powershell
ssh-add ~/.ssh/id_rsa
```

**Permission denied:**
Ensure SSH public key is in `/root/.ssh/authorized_keys` on server.

**Build fails:**
```powershell
npm install
npm run build
```

### Manual Deploy (if needed)
```bash
npm run build
scp -r dist/* root@66.226.72.199:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace/
```

---
**Last updated:** 2026-05-19  
**Maintainer:** Daniel Frempong Twum / TUC ICT
