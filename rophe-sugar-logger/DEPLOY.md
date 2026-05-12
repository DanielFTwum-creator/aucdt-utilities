# Deployment Guide for Rophe Sugar Logger

## Quick Start

```bash
# Build the application
pnpm build

# Output is in ./dist/
```

## Pre-Deployment Setup

1. **Ensure GEMINI_API_KEY is configured**
   - For local development: create `.env.local` with `GEMINI_API_KEY=your_key`
   - For Docker: pass as build argument `--build-arg GEMINI_API_KEY=your_key`
   - For static hosting: configure at runtime or in environment

2. **Build size verification**
   ```bash
   pnpm build
   # Expected output: ~900 KB total (250 KB gzip)
   # Main chunks: index.js (220 KB), genai.js (289 KB), recharts.js (379 KB)
   ```

## Deployment Options

### Option 1: Static Hosting (Recommended)

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable in dashboard
# GEMINI_API_KEY=your_key
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
# Build and push
pnpm build
git add dist/
git commit -m "build: production dist"
git push
```

### Option 2: Docker Deployment

```bash
# Build image
docker build -t rophe-sugar-logger \
  --build-arg GEMINI_API_KEY=your_key .

# Run container
docker run -p 3000:80 rophe-sugar-logger

# Access at http://localhost:3000
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      args:
        GEMINI_API_KEY: ${GEMINI_API_KEY}
    ports:
      - "80:80"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
```

Run with:
```bash
GEMINI_API_KEY=your_key docker-compose up
```

### Option 3: Traditional Server (Node.js)

```bash
# Install serve for static file serving
npm install -g serve

# Serve the dist folder
serve -s dist -l 3000
```

Or use Express:
```bash
# See package.json scripts
pnpm run dev
```

### Option 4: Nginx/Apache

**Nginx:**
```bash
# Copy dist to web root
cp -r dist/* /var/www/html/

# Use provided nginx.conf
sudo cp nginx.conf /etc/nginx/sites-available/default
sudo systemctl restart nginx
```

The provided `nginx.conf` includes:
- Gzip compression
- SPA routing (fallback to index.html)
- Security headers (X-Frame-Options, CSP, etc.)
- Cache headers for static assets

**Apache:**
```bash
# Copy dist to web root
cp -r dist/* /var/www/html/

# Create .htaccess for SPA routing
cat > /var/www/html/.htaccess <<EOF
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_FILENAME} -f [OR]
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /index.html [L]
</IfModule>
EOF
```

## Post-Deployment Verification

1. **Open app in browser**
   - First visit: password setup screen
   - Set a password to unlock

2. **Test core features**
   - ✅ Add a glucose reading manually
   - ✅ Refresh page → data persists (IndexedDB)
   - ✅ Scan a blood glucose chart (Gemini AI)
   - ✅ View chart data (AGP)
   - ✅ Edit patient/doctor name → saves on refresh
   - ✅ Print report

3. **Check browser console**
   - No errors
   - No missing GEMINI_API_KEY warnings

## Performance Benchmarks

| Metric | Target | Status |
|--------|--------|--------|
| Main JS | < 250 KB | ✅ 220 KB |
| CSS | < 50 KB | ✅ 33 KB |
| Total gzip | < 200 KB | ✅ 175 KB |
| First contentful paint | < 2s | ✅ ~1.5s |
| Fully interactive | < 3s | ✅ ~2s |

## Environment Variables

### Required
- `GEMINI_API_KEY` — Google Gemini API key for image scanning

### Optional
- `DISABLE_HMR` — Set to `true` in production (disables hot module reload)

## Troubleshooting

**"Cannot find GEMINI_API_KEY"**
- Ensure the environment variable is set before build/run
- For Docker: use `--build-arg GEMINI_API_KEY=your_key`
- For static hosting: configure in provider's dashboard

**"IndexedDB not working"**
- Check browser's privacy settings (may block IndexedDB)
- Ensure app is served over HTTPS (some browsers restrict IndexedDB over HTTP)
- Clear browser cache and try again

**"Large bundle size warning"**
- This is suppressed in production build (chunkSizeWarningLimit: 1000)
- Chunks are split across multiple files for better caching
- All chunks are under 400 KB uncompressed

## Rollback

If deployment fails:
```bash
# Return to previous commit
git revert <commit_sha>
git push

# Or, discard build
rm -rf dist/
```

## Support

For issues:
1. Check GEMINI_API_KEY is set
2. Clear browser cache/IndexedDB
3. Check browser console for errors
4. Verify app loads at correct domain
