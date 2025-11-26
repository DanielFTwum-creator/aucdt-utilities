# ThesisAI Administrator Guide

**Version:** 1.0.0
**Last Updated:** 2025-11-26
**Application:** ThesisAI Frontend - AI-Powered Thesis Assessment Platform
**License:** MIT

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Administrator Roles and Responsibilities](#3-administrator-roles-and-responsibilities)
4. [System Requirements](#4-system-requirements)
5. [Installation and Setup](#5-installation-and-setup)
6. [Configuration Management](#6-configuration-management)
7. [User Management](#7-user-management)
8. [System Monitoring](#8-system-monitoring)
9. [Backup and Recovery](#9-backup-and-recovery)
10. [Security Management](#10-security-management)
11. [Performance Optimization](#11-performance-optimization)
12. [Troubleshooting](#12-troubleshooting)
13. [Maintenance Procedures](#13-maintenance-procedures)
14. [Logging and Auditing](#14-logging-and-auditing)
15. [Disaster Recovery](#15-disaster-recovery)
16. [Scaling and Growth](#16-scaling-and-growth)
17. [Support and Resources](#17-support-and-resources)

---

## 1. Introduction

### 1.1 Purpose

This Administrator Guide provides comprehensive instructions for system administrators managing the ThesisAI frontend application. It covers installation, configuration, monitoring, maintenance, and troubleshooting procedures.

### 1.2 Audience

This guide is intended for:
- System Administrators
- DevOps Engineers
- IT Support Staff
- Platform Administrators

### 1.3 Prerequisites

Administrators should have:
- Strong Linux/Unix command-line experience
- Understanding of web application architecture
- Experience with Docker and containerization
- Knowledge of nginx web server
- Familiarity with Git version control
- Basic understanding of React applications

### 1.4 Document Conventions

- **Commands**: Shown in `monospace font`
- **File paths**: `/absolute/path/to/file`
- **Variables**: `${VARIABLE_NAME}`
- **Important notes**: 🔴 **CRITICAL** or ⚠️ **WARNING**
- **Best practices**: ✅ **RECOMMENDED**

---

## 2. System Overview

### 2.1 Architecture

ThesisAI Frontend is a modern single-page application (SPA) built with:

| Component | Technology | Version |
|-----------|------------|---------|
| Frontend Framework | React | 19.2.0 |
| Language | TypeScript | 5.9.3 |
| Build Tool | Vite | 7.2.4 |
| Package Manager | pnpm | 8.15.0 |
| Web Server (Production) | Nginx | Alpine |
| Container Runtime | Docker | Latest |

### 2.2 System Components

```
┌─────────────────┐
│  User Browser   │
└────────┬────────┘
         │ HTTP/HTTPS
         ▼
┌─────────────────┐
│  Nginx Server   │  ← Serves static files, proxies API
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌─────────┐
│ Static │ │ Backend │
│ Files  │ │   API   │
└────────┘ └─────────┘
```

### 2.3 File Structure

```
/home/user/aucdt-utilities/
├── src/                    # React source code
│   ├── main.tsx           # Application entry point
│   ├── App.tsx            # Main component
│   ├── index.css          # Global styles
│   └── test/              # Test suite
├── docs/                   # Documentation (this guide)
├── Dockerfile             # Container build instructions
├── nginx.conf             # Nginx configuration
├── vite.config.ts         # Build configuration
├── package.json           # Dependencies
└── pnpm-lock.yaml        # Dependency lockfile
```

---

## 3. Administrator Roles and Responsibilities

### 3.1 System Administrator

**Responsibilities:**
- Install and configure the application
- Monitor system health and performance
- Manage system updates and patches
- Configure security settings
- Perform backup and recovery operations
- Troubleshoot system issues

### 3.2 Application Administrator

**Responsibilities:**
- Configure application settings
- Manage user access (via backend)
- Monitor application logs
- Coordinate with backend administrators
- Manage frontend assets and configurations

### 3.3 Security Administrator

**Responsibilities:**
- Implement security policies
- Monitor security logs
- Manage SSL/TLS certificates
- Conduct security audits
- Respond to security incidents

---

## 4. System Requirements

### 4.1 Development Environment

**Minimum Requirements:**
- **OS**: Linux, macOS, or Windows (with WSL2)
- **RAM**: 4 GB
- **Disk Space**: 2 GB
- **Node.js**: v18 or higher
- **pnpm**: v8.15.0
- **Git**: Latest version

**Recommended:**
- **RAM**: 8 GB or more
- **CPU**: 4 cores
- **SSD**: For faster build times

### 4.2 Production Environment

**Minimum Requirements:**
- **OS**: Linux (Ubuntu 20.04+, RHEL 8+, or similar)
- **RAM**: 2 GB
- **Disk Space**: 5 GB
- **Docker**: 20.10+
- **Network**: Stable internet connection

**Recommended:**
- **RAM**: 4 GB or more
- **CPU**: 2+ cores
- **Load Balancer**: For high availability
- **CDN**: For static asset delivery

### 4.3 Browser Requirements

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Features:**
- ES2020 JavaScript support
- WebSocket support
- Modern CSS (Flexbox, Grid)

---

## 5. Installation and Setup

### 5.1 Development Installation

#### Step 1: Clone Repository

```bash
git clone https://github.com/DanielFTwum-creator/aucdt-utilities.git
cd aucdt-utilities
```

#### Step 2: Install pnpm

```bash
# Using npm
npm install -g pnpm@8.15.0

# Or using corepack (recommended)
corepack enable
corepack prepare pnpm@8.15.0 --activate
```

#### Step 3: Install Dependencies

```bash
pnpm install
```

#### Step 4: Verify Installation

```bash
# Check Node version
node --version  # Should be v18+

# Check pnpm version
pnpm --version  # Should be 8.15.0

# Run tests
pnpm test
```

#### Step 5: Start Development Server

```bash
pnpm start
# Application available at http://localhost:3000
```

### 5.2 Production Installation (Docker)

#### Step 1: Install Docker

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker
```

#### Step 2: Build Docker Image

```bash
cd /path/to/aucdt-utilities

# Build image
sudo docker build -t thesisai-frontend:1.0.0 .

# Verify image
sudo docker images | grep thesisai-frontend
```

#### Step 3: Run Container

```bash
# Run on port 80
sudo docker run -d \
  --name thesisai-frontend \
  -p 80:80 \
  --restart unless-stopped \
  thesisai-frontend:1.0.0

# Run on custom port (e.g., 8080)
sudo docker run -d \
  --name thesisai-frontend \
  -p 8080:80 \
  --restart unless-stopped \
  thesisai-frontend:1.0.0
```

#### Step 4: Verify Deployment

```bash
# Check container status
sudo docker ps | grep thesisai-frontend

# Check logs
sudo docker logs thesisai-frontend

# Test application
curl http://localhost:80
```

### 5.3 Production Installation (Direct)

#### Step 1: Build Application

```bash
cd /path/to/aucdt-utilities
pnpm install
pnpm build
```

Build output will be in `dist/` directory.

#### Step 2: Install Nginx

```bash
# Ubuntu/Debian
sudo apt-get install nginx

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Step 3: Configure Nginx

```bash
# Copy built files
sudo cp -r dist/* /var/www/thesisai/

# Create nginx config
sudo nano /etc/nginx/sites-available/thesisai
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/thesisai;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static asset caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Step 4: Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/thesisai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. Configuration Management

### 6.1 Environment Variables

#### Development Environment Variables

Create `.env.local` file:

```bash
# API Configuration
VITE_API_URL=http://localhost:8080

# Application Settings
VITE_APP_NAME=ThesisAI
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
```

#### Production Environment Variables

```bash
# API Configuration
VITE_API_URL=https://api.your-domain.com

# Application Settings
VITE_APP_NAME=ThesisAI
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
```

### 6.2 Nginx Configuration

**Location:** `/etc/nginx/conf.d/default.conf` (Docker) or `/etc/nginx/sites-available/thesisai` (Direct)

**Key Settings:**

```nginx
# Worker processes (adjust based on CPU cores)
worker_processes auto;

# Connection limits
events {
    worker_connections 1024;
}

# HTTP settings
http {
    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Rate limiting (DDoS protection)
    limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;
    limit_req zone=one burst=20 nodelay;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

### 6.3 Vite Configuration

**File:** `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,  // Set to true for debugging
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
  }
})
```

### 6.4 TypeScript Configuration

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## 7. User Management

### 7.1 User Roles

ThesisAI supports three user roles (managed by backend):

1. **Student**
   - Submit theses
   - View assessments
   - Respond to feedback

2. **Assessor**
   - Review theses
   - Provide assessments
   - Add comments

3. **Administrator**
   - Full system access
   - User management
   - System configuration

### 7.2 User Access Control

User authentication and authorization are handled by the backend API. The frontend:

- Stores authentication tokens (JWT) in localStorage
- Includes tokens in API requests
- Handles session expiration
- Manages role-based UI rendering

**⚠️ Important:** User management is performed via the backend API, not the frontend.

### 7.3 Session Management

**Default Settings:**
- Session timeout: 24 hours
- Refresh token: 7 days
- Remember me: 30 days

**To configure (backend):**
```bash
# Adjust JWT expiration in backend configuration
JWT_ACCESS_TOKEN_EXPIRES_IN=24h
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
```

---

## 8. System Monitoring

### 8.1 Application Monitoring

#### Docker Container Monitoring

```bash
# View container status
docker ps -a

# View resource usage
docker stats thesisai-frontend

# View logs (last 100 lines)
docker logs --tail 100 thesisai-frontend

# Follow logs in real-time
docker logs -f thesisai-frontend
```

#### Nginx Monitoring

```bash
# Check nginx status
sudo systemctl status nginx

# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log

# Check active connections
sudo nginx -T | grep worker_connections
```

### 8.2 Performance Monitoring

#### Key Metrics to Monitor

| Metric | Description | Alert Threshold |
|--------|-------------|----------------|
| Response Time | Page load time | > 3 seconds |
| Error Rate | 4xx/5xx errors | > 1% |
| CPU Usage | Container CPU | > 80% |
| Memory Usage | Container RAM | > 90% |
| Disk Usage | Available space | < 10% |

#### Monitoring Commands

```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check CPU usage
top -b -n 1 | head -20

# Check network connections
netstat -tuln | grep :80
```

### 8.3 Health Checks

#### Manual Health Check

```bash
# Test application availability
curl -I http://localhost:80

# Expected response:
# HTTP/1.1 200 OK
```

#### Automated Health Check Script

Create `/usr/local/bin/thesisai-healthcheck.sh`:

```bash
#!/bin/bash

URL="http://localhost:80"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $RESPONSE -eq 200 ]; then
    echo "✅ ThesisAI is healthy (HTTP $RESPONSE)"
    exit 0
else
    echo "❌ ThesisAI is unhealthy (HTTP $RESPONSE)"
    exit 1
fi
```

Run with cron:

```bash
# Edit crontab
crontab -e

# Add health check every 5 minutes
*/5 * * * * /usr/local/bin/thesisai-healthcheck.sh >> /var/log/thesisai-health.log 2>&1
```

---

## 9. Backup and Recovery

### 9.1 Backup Strategy

#### What to Backup

1. **Application Source Code**
   - Location: `/home/user/aucdt-utilities/`
   - Frequency: After each code change
   - Method: Git version control

2. **Configuration Files**
   - `/etc/nginx/`
   - `.env` files
   - `docker-compose.yml`
   - Frequency: After each configuration change

3. **Docker Images**
   - Frequency: After each build
   - Method: Docker registry or tar archives

4. **Static Assets** (if modified)
   - Location: `/var/www/thesisai/` or `dist/`
   - Frequency: After deployments

### 9.2 Backup Procedures

#### 1. Git Backup

```bash
# Ensure all changes are committed
cd /home/user/aucdt-utilities
git status
git add .
git commit -m "Backup: $(date +%Y-%m-%d)"
git push origin main
```

#### 2. Configuration Backup

```bash
#!/bin/bash
# backup-config.sh

BACKUP_DIR="/backup/thesisai/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup nginx config
cp -r /etc/nginx/ $BACKUP_DIR/nginx/

# Backup environment files
cp .env* $BACKUP_DIR/

# Backup Docker config
cp docker-compose.yml $BACKUP_DIR/ 2>/dev/null || true

# Create archive
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR

echo "✅ Backup completed: $BACKUP_DIR.tar.gz"
```

#### 3. Docker Image Backup

```bash
# Save Docker image to tar file
docker save thesisai-frontend:1.0.0 | gzip > thesisai-frontend-1.0.0.tar.gz

# Upload to backup location
scp thesisai-frontend-1.0.0.tar.gz backup-server:/backup/docker/
```

### 9.3 Recovery Procedures

#### Restore from Git

```bash
cd /home/user/aucdt-utilities
git fetch origin
git reset --hard origin/main
pnpm install
pnpm build
```

#### Restore Docker Image

```bash
# Download backup image
scp backup-server:/backup/docker/thesisai-frontend-1.0.0.tar.gz .

# Load image
docker load < thesisai-frontend-1.0.0.tar.gz

# Start container
docker run -d --name thesisai-frontend -p 80:80 thesisai-frontend:1.0.0
```

#### Restore Configuration

```bash
# Extract backup
tar -xzf backup-20251126.tar.gz

# Restore nginx config
sudo cp -r backup-20251126/nginx/* /etc/nginx/
sudo nginx -t
sudo systemctl reload nginx

# Restore environment files
cp backup-20251126/.env* /home/user/aucdt-utilities/
```

---

## 10. Security Management

### 10.1 Security Best Practices

✅ **RECOMMENDED Security Measures:**

1. **Use HTTPS in Production**
   - Install SSL/TLS certificate
   - Force HTTPS redirects
   - Enable HSTS headers

2. **Secure Nginx Configuration**
   - Disable server version disclosure
   - Implement rate limiting
   - Configure security headers

3. **Regular Updates**
   - Update npm packages monthly
   - Apply security patches immediately
   - Monitor CVE databases

4. **Access Control**
   - Use firewall (UFW, iptables)
   - Limit SSH access
   - Use SSH keys (disable password auth)

### 10.2 SSL/TLS Configuration

#### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal (test)
sudo certbot renew --dry-run
```

#### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=31536000" always;

    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 10.3 Firewall Configuration

```bash
# Install UFW
sudo apt-get install ufw

# Allow SSH (IMPORTANT: Do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 10.4 Security Auditing

#### Regular Security Checks

```bash
# Check for outdated packages
pnpm outdated

# Audit dependencies for vulnerabilities
pnpm audit

# Fix vulnerabilities
pnpm audit fix

# Check Docker image vulnerabilities (if using Trivy)
trivy image thesisai-frontend:1.0.0
```

#### Security Checklist

- [ ] HTTPS enabled with valid certificate
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Firewall rules configured
- [ ] SSH key-based authentication
- [ ] Regular package updates
- [ ] Access logs monitored
- [ ] Backup system tested
- [ ] Disaster recovery plan documented

---

## 11. Performance Optimization

### 11.1 Frontend Optimization

#### Build Optimization

```bash
# Production build with optimizations
pnpm build

# Analyze bundle size
pnpm add -D vite-plugin-visualizer
```

**vite.config.ts:**

```typescript
import { visualizer } from 'vite-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ],
  build: {
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        }
      }
    }
  }
})
```

### 11.2 Nginx Optimization

#### Caching Configuration

```nginx
# Browser caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}

# Gzip compression
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript
           application/json application/javascript application/xml+rss
           application/rss+xml font/truetype font/opentype
           application/vnd.ms-fontobject image/svg+xml;
```

#### Connection Optimization

```nginx
# Keep-alive settings
keepalive_timeout 65;
keepalive_requests 100;

# Buffer settings
client_body_buffer_size 10K;
client_header_buffer_size 1k;
client_max_body_size 8m;
large_client_header_buffers 2 1k;
```

### 11.3 Docker Optimization

#### Multi-stage Build Optimization

Already implemented in `Dockerfile`:

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
# ... build steps

# Stage 2: Runtime (smaller image)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

**Benefits:**
- Smaller image size (< 50 MB vs > 500 MB)
- Faster deployment
- Reduced attack surface

---

## 12. Troubleshooting

### 12.1 Common Issues

#### Issue 1: Application Not Loading

**Symptoms:**
- Blank page
- "Cannot GET /" error
- 404 errors

**Solutions:**

```bash
# Check if container is running
docker ps | grep thesisai-frontend

# Check nginx error logs
docker logs thesisai-frontend | grep error

# Verify files exist
docker exec thesisai-frontend ls /usr/share/nginx/html

# Check nginx configuration
docker exec thesisai-frontend nginx -t

# Restart container
docker restart thesisai-frontend
```

#### Issue 2: API Requests Failing

**Symptoms:**
- Network errors in browser console
- 502 Bad Gateway
- CORS errors

**Solutions:**

```bash
# Check nginx proxy configuration
docker exec thesisai-frontend cat /etc/nginx/conf.d/default.conf

# Verify backend is accessible
curl http://backend:8080/api/health

# Check network connectivity (from container)
docker exec thesisai-frontend ping backend

# Review nginx access logs
docker logs thesisai-frontend | grep "/api"
```

#### Issue 3: Slow Performance

**Symptoms:**
- Long page load times
- Unresponsive UI
- High CPU usage

**Solutions:**

```bash
# Check resource usage
docker stats thesisai-frontend

# Enable gzip compression in nginx
# (see nginx.conf configuration)

# Check bundle size
pnpm build
ls -lh dist/assets/

# Analyze network waterfall in browser DevTools
# Look for large files, slow requests

# Implement code splitting
# (see vite.config.ts optimization)
```

#### Issue 4: Build Failures

**Symptoms:**
- Docker build errors
- TypeScript compilation errors
- Missing dependencies

**Solutions:**

```bash
# Clean build
rm -rf node_modules dist
pnpm install
pnpm build

# Check Node version
node --version  # Should be v18+

# Check pnpm version
pnpm --version  # Should be 8.15.0

# Check TypeScript errors
pnpm lint

# View detailed build logs
docker build --no-cache -t thesisai-frontend .
```

### 12.2 Log Analysis

#### Access Logs

```bash
# View recent access logs
docker logs --tail 100 thesisai-frontend | grep "GET"

# Count requests by endpoint
docker logs thesisai-frontend | grep -oP '"\K[^"]*' | sort | uniq -c | sort -rn

# Find 404 errors
docker logs thesisai-frontend | grep ' 404 '

# Find slow requests (> 1 second)
docker logs thesisai-frontend | awk '$NF > 1.0 {print}'
```

#### Error Logs

```bash
# View all errors
docker logs thesisai-frontend 2>&1 | grep -i error

# View nginx errors
docker exec thesisai-frontend cat /var/log/nginx/error.log

# Monitor errors in real-time
docker logs -f thesisai-frontend 2>&1 | grep -i error
```

### 12.3 Emergency Procedures

#### Quick Rollback

```bash
# Stop current container
docker stop thesisai-frontend
docker rm thesisai-frontend

# Run previous version
docker run -d --name thesisai-frontend -p 80:80 thesisai-frontend:1.0.0-prev
```

#### Force Rebuild

```bash
# Remove all containers and images
docker stop thesisai-frontend
docker rm thesisai-frontend
docker rmi thesisai-frontend:1.0.0

# Rebuild from scratch
docker build --no-cache -t thesisai-frontend:1.0.0 .
docker run -d --name thesisai-frontend -p 80:80 thesisai-frontend:1.0.0
```

---

## 13. Maintenance Procedures

### 13.1 Regular Maintenance Tasks

#### Daily Tasks

- [ ] Monitor system health
- [ ] Review error logs
- [ ] Check disk space
- [ ] Verify backups completed

```bash
# Daily maintenance script
#!/bin/bash
echo "=== ThesisAI Daily Maintenance ==="
echo "Date: $(date)"

echo "\n1. Container Status:"
docker ps | grep thesisai-frontend

echo "\n2. Disk Usage:"
df -h | grep -E '^Filesystem|/$'

echo "\n3. Recent Errors:"
docker logs --since 24h thesisai-frontend 2>&1 | grep -i error | tail -10

echo "\n4. Resource Usage:"
docker stats --no-stream thesisai-frontend
```

#### Weekly Tasks

- [ ] Review security updates
- [ ] Analyze performance metrics
- [ ] Test backup restoration
- [ ] Update documentation

```bash
# Weekly maintenance script
#!/bin/bash
echo "=== ThesisAI Weekly Maintenance ==="

# Check for package updates
cd /home/user/aucdt-utilities
pnpm outdated

# Security audit
pnpm audit

# Test backup
/usr/local/bin/backup-config.sh
```

#### Monthly Tasks

- [ ] Update dependencies
- [ ] Review access logs
- [ ] Capacity planning
- [ ] Security audit

### 13.2 Update Procedures

#### Update Application Code

```bash
# Pull latest code
cd /home/user/aucdt-utilities
git pull origin main

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build for production
pnpm build

# Rebuild Docker image
docker build -t thesisai-frontend:1.1.0 .

# Deploy new version
docker stop thesisai-frontend
docker rm thesisai-frontend
docker run -d --name thesisai-frontend -p 80:80 thesisai-frontend:1.1.0
```

#### Update Dependencies

```bash
# Check outdated packages
pnpm outdated

# Update specific package
pnpm update package-name

# Update all packages (careful!)
pnpm update

# Test after updates
pnpm test
pnpm build
```

#### Update Nginx

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get upgrade nginx

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 13.3 Database Maintenance

**Note:** ThesisAI Frontend does not manage a database directly. Database maintenance is performed by the backend administrator.

**Frontend Considerations:**
- Ensure API endpoints are compatible after database schema changes
- Test frontend with updated backend APIs
- Update any hardcoded data structures if needed

---

## 14. Logging and Auditing

### 14.1 Log Locations

| Log Type | Location (Docker) | Location (Direct) |
|----------|-------------------|-------------------|
| Nginx Access | `docker logs thesisai-frontend` | `/var/log/nginx/access.log` |
| Nginx Error | `docker logs thesisai-frontend` | `/var/log/nginx/error.log` |
| Build Logs | Docker build output | `pnpm build` output |
| System Logs | `journalctl -u docker` | `journalctl -u nginx` |

### 14.2 Log Management

#### Log Rotation (Docker)

**docker-compose.yml:**

```yaml
services:
  frontend:
    image: thesisai-frontend:1.0.0
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

#### Log Rotation (Direct Nginx)

**/etc/logrotate.d/nginx:**

```
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
```

### 14.3 Audit Trail

#### What to Audit

1. **System Access**
   - SSH logins
   - sudo commands
   - File changes

2. **Application Changes**
   - Code deployments
   - Configuration changes
   - Container restarts

3. **Security Events**
   - Failed login attempts
   - SSL certificate renewals
   - Firewall rule changes

#### Audit Log Example

Create `/var/log/thesisai-audit.log`:

```bash
# Log deployment
echo "$(date -Iseconds) - DEPLOY - User: $USER - Version: 1.1.0" >> /var/log/thesisai-audit.log

# Log configuration change
echo "$(date -Iseconds) - CONFIG - User: $USER - File: nginx.conf" >> /var/log/thesisai-audit.log

# Log security event
echo "$(date -Iseconds) - SECURITY - SSL certificate renewed" >> /var/log/thesisai-audit.log
```

---

## 15. Disaster Recovery

### 15.1 Disaster Recovery Plan

#### Recovery Time Objective (RTO)

- **Target RTO**: 2 hours
- **Maximum tolerable downtime**: 4 hours

#### Recovery Point Objective (RPO)

- **Target RPO**: 24 hours
- **Maximum acceptable data loss**: 24 hours

### 15.2 Disaster Scenarios

#### Scenario 1: Server Hardware Failure

**Recovery Steps:**

1. Provision new server
2. Install Docker
3. Restore Docker image from backup
4. Start container
5. Update DNS (if IP changed)
6. Verify application

**Estimated Time:** 1-2 hours

#### Scenario 2: Data Corruption

**Recovery Steps:**

1. Stop container
2. Restore configuration from backup
3. Rebuild Docker image
4. Start container
5. Verify integrity

**Estimated Time:** 30 minutes

#### Scenario 3: Security Breach

**Recovery Steps:**

1. Isolate affected system
2. Analyze breach scope
3. Restore from clean backup
4. Apply security patches
5. Change all credentials
6. Monitor for suspicious activity

**Estimated Time:** 2-4 hours

### 15.3 Disaster Recovery Checklist

**Pre-Disaster:**
- [ ] Backup system tested and verified
- [ ] Documentation up to date
- [ ] Emergency contacts documented
- [ ] Disaster recovery plan reviewed
- [ ] Off-site backups configured

**During Disaster:**
- [ ] Incident documented
- [ ] Stakeholders notified
- [ ] Recovery process initiated
- [ ] Progress tracked

**Post-Disaster:**
- [ ] Service restored and verified
- [ ] Root cause analyzed
- [ ] Incident report completed
- [ ] DR plan updated
- [ ] Team debriefing conducted

---

## 16. Scaling and Growth

### 16.1 Horizontal Scaling

#### Load Balancer Setup (Nginx)

**Load Balancer Configuration:**

```nginx
upstream thesisai_backend {
    least_conn;
    server 192.168.1.10:80;
    server 192.168.1.11:80;
    server 192.168.1.12:80;
}

server {
    listen 80;
    server_name thesisai.com;

    location / {
        proxy_pass http://thesisai_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### Docker Swarm Deployment

```bash
# Initialize swarm
docker swarm init

# Create service
docker service create \
  --name thesisai-frontend \
  --replicas 3 \
  -p 80:80 \
  thesisai-frontend:1.0.0

# Scale service
docker service scale thesisai-frontend=5
```

### 16.2 Vertical Scaling

#### Increase Container Resources

**docker-compose.yml:**

```yaml
services:
  frontend:
    image: thesisai-frontend:1.0.0
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '1.0'
          memory: 2G
```

### 16.3 CDN Integration

#### CloudFlare Setup

1. Sign up for CloudFlare
2. Add your domain
3. Update DNS nameservers
4. Enable CDN features:
   - Auto minify (JS, CSS, HTML)
   - Brotli compression
   - Caching rules
   - DDoS protection

#### Cache Configuration

```nginx
# Set cache headers for CDN
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    add_header CDN-Cache-Control "public, max-age=31536000";
}
```

---

## 17. Support and Resources

### 17.1 Getting Help

**Issue Tracker:**
- GitHub: https://github.com/DanielFTwum-creator/aucdt-utilities/issues

**Documentation:**
- README: `/home/user/aucdt-utilities/README.md`
- CLAUDE.md: `/home/user/aucdt-utilities/CLAUDE.md`
- Architecture Diagrams: `/home/user/aucdt-utilities/docs/`

**Community:**
- Report bugs via GitHub Issues
- Request features via GitHub Discussions

### 17.2 Useful Commands Reference

```bash
# Docker Commands
docker ps                          # List running containers
docker logs -f <container>         # Follow logs
docker exec -it <container> sh     # Shell into container
docker stats                       # Resource usage
docker system prune               # Clean unused resources

# Nginx Commands
nginx -t                          # Test configuration
nginx -s reload                   # Reload configuration
systemctl status nginx            # Check status
journalctl -u nginx -f           # Follow logs

# System Commands
df -h                             # Disk usage
free -h                           # Memory usage
top                               # Process monitor
netstat -tuln                    # Network connections

# Application Commands
pnpm install                      # Install dependencies
pnpm test                        # Run tests
pnpm build                       # Production build
pnpm start                       # Dev server
```

### 17.3 Additional Resources

**Official Documentation:**
- React: https://react.dev/
- Vite: https://vitejs.dev/
- TypeScript: https://www.typescriptlang.org/
- Tailwind CSS: https://tailwindcss.com/
- Nginx: https://nginx.org/en/docs/
- Docker: https://docs.docker.com/

**Security Resources:**
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Mozilla Observatory: https://observatory.mozilla.org/
- SSL Labs: https://www.ssllabs.com/ssltest/

---

## Appendix

### A. Configuration Templates

#### A.1 Complete Nginx Configuration

See `nginx.conf` in repository.

#### A.2 Environment Variables Template

See `.env.example` (create if needed).

#### A.3 Docker Compose Template

```yaml
version: '3.8'

services:
  frontend:
    image: thesisai-frontend:1.0.0
    container_name: thesisai-frontend
    ports:
      - "80:80"
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    networks:
      - thesisai-network

  backend:
    image: thesisai-backend:1.0.0
    container_name: thesisai-backend
    ports:
      - "8080:8080"
    restart: unless-stopped
    networks:
      - thesisai-network

networks:
  thesisai-network:
    driver: bridge
```

### B. Troubleshooting Decision Tree

```
Problem: Application not accessible
├─ Container running?
│  ├─ No → Start container
│  └─ Yes → Continue
├─ Port accessible?
│  ├─ No → Check firewall
│  └─ Yes → Continue
├─ Nginx error logs show issues?
│  ├─ Yes → Fix config
│  └─ No → Continue
└─ Check browser console for errors
```

### C. Glossary

- **SPA**: Single-Page Application
- **CDN**: Content Delivery Network
- **SSL/TLS**: Secure Sockets Layer / Transport Layer Security
- **RTO**: Recovery Time Objective
- **RPO**: Recovery Point Objective
- **JWT**: JSON Web Token
- **CORS**: Cross-Origin Resource Sharing
- **DDoS**: Distributed Denial of Service

---

**Document Version:** 1.0.0
**Last Reviewed:** 2025-11-26
**Next Review Date:** 2026-02-26

**Prepared by:** System Administrator
**Approved by:** Project Manager

---

*For questions or clarifications, please open an issue on GitHub or contact the development team.*
