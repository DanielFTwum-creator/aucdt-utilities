# AUCDT Analytics Dashboard - Deployment Guide

**Document Version:** 1.0  
**Last Updated:** January 15, 2026  
**Audience:** DevOps Engineers, System Administrators, Deployment Managers

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Development Environment Setup](#development-environment-setup)
3. [Production Build Process](#production-build-process)
4. [Deployment Targets](#deployment-targets)
5. [Configuration Management](#configuration-management)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

- [ ] All tests passing (unit and E2E)
- [ ] Code review completed and approved
- [ ] Security audit completed
- [ ] Accessibility audit completed (WCAG 2.1 AA)
- [ ] Documentation updated
- [ ] Dependencies updated and audited
- [ ] Staging environment validated
- [ ] Rollback plan prepared
- [ ] Team notified of deployment
- [ ] Backup of current production taken

---

## Development Environment Setup

### System Requirements

| Component | Requirement | Notes |
|-----------|-------------|-------|
| Node.js | 16.0+ | LTS version recommended |
| npm/yarn/pnpm | Latest | pnpm recommended (faster, better disk usage) |
| Git | Latest | For version control |
| Browser | Modern (ES6+) | Chrome, Firefox, Safari, Edge |
| RAM | 4GB+ | For development and build processes |
| Disk Space | 2GB+ | For node_modules and build artifacts |

### Installation Steps

1. **Clone Repository**
```bash
git clone https://github.com/aucdt-utilities/aucdt-analytics-dashboard.git
cd aucdt-analytics-dashboard
```

2. **Install Dependencies**
```bash
pnpm install
```
Or with npm:
```bash
npm install
```

3. **Verify Installation**
```bash
pnpm dev
```
Application should start on `http://localhost:5173`

4. **Run Tests**
```bash
pnpm test                  # Unit tests
pnpm test:e2e            # End-to-end tests
pnpm test:e2e:ui         # Interactive E2E testing
```

5. **Lint Code**
```bash
pnpm lint
```

---

## Production Build Process

### Build Commands

**Standard Production Build:**
```bash
pnpm build
```

This command:
1. Installs dependencies (if missing)
2. Runs TypeScript compiler
3. Bundles and minifies code with Vite
4. Generates optimized production assets
5. Cleans up temporary files

**Output Location:** `dist/` directory

### Build Configuration

Build settings are defined in `vite.config.ts`:

```typescript
{
  base: '/aucdt-analytics-dashboard/',  // Base path for deployment
  build: {
    target: 'es2020',                   // JavaScript target version
    minify: 'terser',                   // Minification method
    sourcemap: false,                   // No sourcemaps in production
    rollupOptions: {
      output: {
        // Code splitting configuration
      }
    }
  }
}
```

### Build Optimization

To optimize build size:

1. **Code Splitting:** Automatically splits code by route
2. **Tree Shaking:** Removes unused code
3. **Minification:** Reduces file sizes
4. **Compression:** Enable GZIP on server

### Build Verification

After building, verify:

```bash
# Check build output
ls -lah dist/

# Test build locally
pnpm preview

# Verify assets
file dist/assets/*
```

---

## Deployment Targets

### Option 1: Static Web Server

**Best for:** Simple deployments, GitHub Pages, CDNs

**Steps:**
1. Build the application: `pnpm build`
2. Upload `dist/` contents to static web server
3. Configure server to serve `index.html` for all routes
4. Set correct MIME types for assets
5. Enable caching headers

**Server Configuration Example (nginx):**

```nginx
server {
    listen 80;
    server_name analytics.aucdt.edu.au;

    root /var/www/aucdt-dashboard;
    index index.html;

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # HTTPS redirect
    listen 443 ssl http2;
    ssl_certificate /etc/ssl/certs/aucdt.crt;
    ssl_certificate_key /etc/ssl/private/aucdt.key;
}
```

### Option 2: Docker Container

**Best for:** Containerized deployments, Kubernetes, Cloud platforms

**Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Build and Deploy:**

```bash
# Build image
docker build -t aucdt-dashboard:latest .

# Run container
docker run -p 3000:80 aucdt-dashboard:latest

# Push to registry
docker tag aucdt-dashboard:latest registry.example.com/aucdt-dashboard:latest
docker push registry.example.com/aucdt-dashboard:latest
```

### Option 3: Cloud Platform Deployment

**Azure App Service:**

```bash
# Login to Azure
az login

# Create resource group
az group create -n aucdt-rg -l eastus

# Create App Service Plan
az appservice plan create -n aucdt-plan -g aucdt-rg --sku B1 --is-linux

# Create web app
az webapp create -n aucdt-dashboard -g aucdt-rg -p aucdt-plan --runtime "node|18"

# Deploy from local Git
az webapp up -n aucdt-dashboard -g aucdt-rg --runtime "node|18"
```

**AWS S3 + CloudFront:**

```bash
# Build application
pnpm build

# Upload to S3
aws s3 sync dist/ s3://aucdt-dashboard-bucket/

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/*"
```

**GitHub Pages:**

```bash
# Set homepage in package.json
"homepage": "https://username.github.io/aucdt-analytics-dashboard/"

# Build
pnpm build

# Deploy using gh-pages
npx gh-pages -d dist
```

---

## Configuration Management

### Environment Variables

Create `.env.production` file:

```bash
# API Configuration
VITE_API_URL=https://api.aucdt.edu.au
VITE_API_KEY=your-api-key-here

# Feature Flags
VITE_ENABLE_ADMIN_PANEL=true
VITE_ENABLE_TESTING_TAB=false
VITE_ENABLE_AUDIT_LOGS=true

# Application Settings
VITE_APP_NAME=AUCDT Analytics Dashboard
VITE_VERSION=1.0.0
```

### Data Configuration

Data files location: `public/data/`

**Required files:**
- `aucdt_dashboard_data.json`
- `enhanced_demographic_analytics.json`
- `corrected_multi_party_demographics.json`
- `funnel-data.json`
- `aucdt_aggregate_statistics.json`

To update data in production:

1. Prepare new data files locally
2. Validate data format and content
3. Upload to `public/data/` directory
4. Clear browser cache (hard refresh)
5. Verify data appears in dashboard

### Secrets Management

**In Development:**
- Use `.env.local` file (git-ignored)
- Never commit secrets to repository

**In Production:**
- Use environment variable injection
- Use secret management service (HashiCorp Vault, Azure Key Vault)
- Rotate secrets regularly
- Audit secret access

---

## Post-Deployment Verification

### Smoke Tests

After deployment, verify:

1. **Application Loads**
   ```bash
   curl -I https://analytics.aucdt.edu.au/
   # Should return 200 OK
   ```

2. **Assets Load**
   ```bash
   curl -I https://analytics.aucdt.edu.au/assets/main.js
   # Should return 200 OK
   ```

3. **Data Loads**
   - Open dashboard in browser
   - Verify all charts render
   - Check browser console for errors

4. **Admin Panel Works**
   - Click Admin button
   - Verify login modal appears
   - Attempt login with test credentials

5. **Theme Switching**
   - Click theme toggle buttons
   - Verify Light/Dark/High-contrast themes apply

### Browser Compatibility Testing

Test in:
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest
- [ ] Mobile browsers

### Performance Testing

```bash
# Load time test
curl -w "@curl-format.txt" https://analytics.aucdt.edu.au/

# PageSpeed test
curl https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://analytics.aucdt.edu.au/
```

**Target Metrics:**
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 3s
- Cumulative Layout Shift: < 0.1

---

## Monitoring & Maintenance

### Log Monitoring

Monitor these log types:

1. **Web Server Logs** (nginx/Apache)
   - Error logs for 5xx errors
   - Access logs for traffic patterns

2. **Browser Console**
   - JavaScript errors
   - Network errors
   - Performance warnings

3. **Audit Logs** (Admin Panel)
   - Admin actions
   - System events
   - User access

### Alerting

Set up alerts for:

- **High Error Rate:** > 1% of requests
- **Slow Response Time:** > 5 seconds
- **Server Down:** No response
- **Storage Full:** > 80% capacity
- **Security Events:** Failed logins, unusual access patterns

### Backup Strategy

**Daily Backups:**
```bash
# Backup configuration and data
tar -czf backup-$(date +%Y%m%d).tar.gz \
  dist/ \
  public/data/ \
  .env.production
```

**Retention Policy:**
- Daily backups: 7 days
- Weekly backups: 4 weeks
- Monthly backups: 12 months

---

## Rollback Procedures

### Quick Rollback

If issues are detected after deployment:

1. **Identify Previous Stable Version**
   ```bash
   git log --oneline | head -5
   ```

2. **Rollback to Previous Version**
   ```bash
   git revert <commit-hash>
   pnpm build
   # Deploy previous build
   ```

3. **Verify Rollback**
   - Test all functionality
   - Check admin panel
   - Verify data display

### Blue-Green Deployment

For zero-downtime rollback:

1. **Maintain Two Deployments:**
   - Blue (current production)
   - Green (new version)

2. **Route Traffic:**
   - Test Green environment
   - Switch load balancer to Green
   - Keep Blue as fallback

3. **If Issues Detected:**
   - Switch back to Blue
   - Investigate Green
   - Redeploy

### Database/Data Rollback

If data corruption occurs:

1. **Restore from Backup**
   ```bash
   # Stop application
   # Restore backup
   tar -xzf backup-YYYYMMDD.tar.gz
   # Restart application
   ```

2. **Verify Data Integrity**
   - Check all records
   - Verify charts render correctly
   - Test export functionality

---

## Troubleshooting

### Common Deployment Issues

#### Issue: Build Fails

**Error:** `npm ERR! code ERESOLVE`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try with force resolution
npm install --legacy-peer-deps

# Or use pnpm
pnpm install
```

#### Issue: Assets 404 Not Found

**Cause:** Incorrect base path configuration

**Solution:**
1. Check `vite.config.ts` base path matches deployment URL
2. Check web server serving static files correctly
3. Verify `dist/` directory uploaded completely

#### Issue: Data Not Loading

**Cause:** Data files missing or wrong path

**Solution:**
1. Verify all JSON files in `public/data/`
2. Check CORS headers if loading from different origin
3. Verify file permissions (readable)
4. Check browser console for error details

#### Issue: Admin Login Fails

**Cause:** Password reset or session issue

**Solution:**
1. Clear browser LocalStorage: `localStorage.clear()`
2. Close and reopen browser
3. Try in incognito mode
4. Verify admin credentials in documentation

---

## Post-Deployment Checklist

- [ ] Application loads and is responsive
- [ ] All tabs navigate correctly
- [ ] Charts render with data
- [ ] Export functionality works
- [ ] Admin panel accessible and functional
- [ ] Theme switching works
- [ ] No JavaScript errors in console
- [ ] Performance acceptable (< 3s load)
- [ ] Mobile responsive design works
- [ ] HTTPS enforced
- [ ] Monitoring and alerting configured
- [ ] Backup confirmed
- [ ] Rollback plan ready
- [ ] Stakeholders notified

---

**Document End**

---

**Version Control:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-15 | Initial deployment guide |

**Next Review:** Q2 2026
