# ROPHE Glucose Logger - Backend Server Setup

## Prerequisites
- Node.js 18+ installed on production server
- PM2 (process manager) for running Node server
- Nginx configured as reverse proxy
- SSH access to production server

## Local Testing

### Terminal 1: Start Backend API Server
```bash
pnpm dev:server
# Output: [GLUCOSE-API] Server running on http://0.0.0.0:3001
```

### Terminal 2: Start Frontend Dev Server
```bash
pnpm dev
# Output: VITE v6.4.2 ready in XXX ms
# → Local: http://localhost:3000/
```

The Vite dev server automatically proxies `/api/*` requests to `http://localhost:3001` (see vite.config.ts).

## Production Deployment

### Step 1: Deploy Frontend (Static Files)
```bash
pnpm build
./deploy.ps1 -Build
# Deploys dist/ to /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/
```

### Step 2: Deploy Backend Server

SSH into your production server:
```bash
ssh root@techbridge.edu.gh
```

Navigate to glucose directory:
```bash
cd /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose
```

Install dependencies:
```bash
npm install @anthropic-ai/sdk dotenv express
```

### Step 3: Start Backend with PM2

Install PM2 globally (if not already installed):
```bash
npm install -g pm2
```

Start the server:
```bash
pm2 start server.ts --name "glucose-api" --interpreter tsx
pm2 save
pm2 startup
```

Check status:
```bash
pm2 list
pm2 logs glucose-api
```

### Step 4: Configure Nginx Reverse Proxy

Copy the provided nginx.conf to your Nginx sites-available:
```bash
cp nginx.conf /etc/nginx/sites-available/ai-tools.techbridge.edu.gh
ln -s /etc/nginx/sites-available/ai-tools.techbridge.edu.gh /etc/nginx/sites-enabled/
```

Test Nginx configuration:
```bash
nginx -t
```

Reload Nginx:
```bash
systemctl reload nginx
```

## Architecture

```
Client (Browser)
    ↓ HTTPS
    ↓
Nginx (Reverse Proxy)
    ├─ /glucose/* → Static Files (dist/)
    └─ /api/* → Node Backend (localhost:3001)
         ↓
    Node.js (server.ts)
         ↓
    Claude API (3.5 Sonnet)
```

## Environment Variables

The backend reads from `.env.local`:
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

**Important:** Never commit `.env.local` to git. Set it on the production server:
```bash
echo "VITE_ANTHROPIC_API_KEY=sk-ant-..." > .env.local
chmod 600 .env.local
```

## Monitoring

### Check Backend Logs
```bash
pm2 logs glucose-api
```

### Check Nginx Logs
```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
# Or check Plesk logs if using Plesk panel
tail -f /var/log/plesk/nginx/error.log
```

### Health Check
```bash
curl https://ai-tools.techbridge.edu.gh/api/health
# Output: {"status":"ok","timestamp":"2026-01-26T..."}
```

## Troubleshooting

### 502 Bad Gateway
- Check backend is running: `pm2 list`
- Check backend logs: `pm2 logs glucose-api`
- Verify Nginx proxy config: `nginx -t`
- Check if port 3001 is listening: `netstat -tuln | grep 3001`

### API Key Not Found
- Verify `.env.local` exists: `cat .env.local`
- Check permissions: `ls -la .env.local` (should be 600)
- Restart backend: `pm2 restart glucose-api`

### Image Scanning Fails
- Check Claude API key is valid
- Check account has sufficient credits
- Review error in `pm2 logs glucose-api`

## Updating the Backend

After pulling new code:
```bash
npm install
pm2 restart glucose-api
```

## Rollback

If deployment fails:
```bash
git revert <commit_hash>
npm install
pm2 restart glucose-api
```

## Support

For issues:
1. Check `pm2 logs glucose-api` for backend errors
2. Check `/var/log/nginx/error.log` for proxy errors
3. Test API directly: `curl -X POST https://ai-tools.techbridge.edu.gh/api/health`
4. Contact: daniel.twum@techbridge.edu.gh
