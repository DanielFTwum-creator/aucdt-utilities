# ThesisAI Deployment Guide

**Version:** 1.0.0
**Last Updated:** 2025-11-26
**Application:** ThesisAI Frontend - AI-Powered Thesis Assessment Platform

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Pre-Deployment Checklist](#2-pre-deployment-checklist)
3. [Deployment Options](#3-deployment-options)
4. [Local Development Deployment](#4-local-development-deployment)
5. [Docker Production Deployment](#5-docker-production-deployment)
6. [Cloud Platform Deployments](#6-cloud-platform-deployments)
7. [CI/CD Pipeline Setup](#7-cicd-pipeline-setup)
8. [Post-Deployment Verification](#8-post-deployment-verification)
9. [Rollback Procedures](#9-rollback-procedures)
10. [Troubleshooting Deployment Issues](#10-troubleshooting-deployment-issues)

---

## 1. Introduction

### 1.1 Purpose

This guide provides step-by-step instructions for deploying the ThesisAI frontend application to various environments, from local development to production cloud platforms.

### 1.2 Deployment Architecture

```
Development → Staging → Production
    ↓           ↓           ↓
  Local    Docker/VM    Cloud Platform
```

### 1.3 Prerequisites

Before beginning deployment, ensure you have:

- ✅ Access to the server or cloud platform
- ✅ Required credentials and permissions
- ✅ Domain name (for production)
- ✅ SSL certificate (for production)
- ✅ Backend API endpoint configured
- ✅ This repository cloned or downloaded

### 1.4 Deployment Environments

| Environment | Purpose | Access |
|-------------|---------|--------|
| Development | Local testing | localhost:3000 |
| Staging | Pre-production testing | staging.thesisai.com |
| Production | Live application | thesisai.com |

---

## 2. Pre-Deployment Checklist

### 2.1 Code Preparation

```bash
# 1. Ensure you're on the correct branch
git checkout main
git pull origin main

# 2. Verify code quality
pnpm lint

# 3. Run all tests
pnpm test

# 4. Build application
pnpm build

# 5. Verify build output
ls -lh dist/
```

**Expected output:**
- ✅ All tests passing
- ✅ No TypeScript errors
- ✅ Build completes successfully
- ✅ `dist/` folder contains HTML, JS, CSS files

### 2.2 Environment Configuration

**Create environment-specific files:**

**.env.development:**
```bash
VITE_API_URL=http://localhost:8080
VITE_APP_ENV=development
VITE_ENABLE_DEBUG=true
```

**.env.staging:**
```bash
VITE_API_URL=https://api-staging.thesisai.com
VITE_APP_ENV=staging
VITE_ENABLE_DEBUG=true
```

**.env.production:**
```bash
VITE_API_URL=https://api.thesisai.com
VITE_APP_ENV=production
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
```

### 2.3 Security Checklist

- [ ] No sensitive data in environment variables
- [ ] API keys stored securely (not in code)
- [ ] SSL certificate obtained and valid
- [ ] Firewall rules configured
- [ ] Security headers configured in nginx
- [ ] Rate limiting enabled
- [ ] CORS configured properly

### 2.4 Performance Checklist

- [ ] Code splitting implemented
- [ ] Images optimized
- [ ] Gzip compression enabled
- [ ] Browser caching configured
- [ ] CDN configured (optional)
- [ ] Lazy loading implemented

### 2.5 Backup Checklist

- [ ] Current production backed up
- [ ] Database backed up (backend responsibility)
- [ ] Configuration files saved
- [ ] Docker images tagged and saved
- [ ] Rollback plan documented

---

## 3. Deployment Options

### 3.1 Deployment Methods Comparison

| Method | Complexity | Cost | Scalability | Best For |
|--------|------------|------|-------------|----------|
| Local Development | Low | Free | N/A | Development |
| Docker (Single Server) | Medium | Low | Limited | Small projects |
| Docker Swarm | High | Medium | Good | Medium projects |
| Kubernetes | Very High | High | Excellent | Enterprise |
| Cloud PaaS (Vercel, Netlify) | Low | Medium | Excellent | Quick deployment |
| Cloud IaaS (AWS, GCP, Azure) | High | Variable | Excellent | Full control |

### 3.2 Recommended Deployment Path

**For Small Projects:**
```
Development (Local) → Docker (Single Server) → Production (Docker)
```

**For Medium Projects:**
```
Development (Local) → Staging (Docker) → Production (Cloud PaaS)
```

**For Enterprise:**
```
Development (Local) → Staging (Kubernetes) → Production (Kubernetes + CDN)
```

---

## 4. Local Development Deployment

### 4.1 Quick Start

```bash
# Clone repository
git clone https://github.com/DanielFTwum-creator/aucdt-utilities.git
cd aucdt-utilities

# Install dependencies
pnpm install

# Start development server
pnpm start
```

**Access application:** http://localhost:3000

### 4.2 With Backend API

```bash
# Terminal 1: Start backend (if available)
cd /path/to/backend
npm start  # Assuming backend runs on port 8080

# Terminal 2: Start frontend
cd /path/to/aucdt-utilities
pnpm start
```

**The Vite proxy will forward `/api` requests to `localhost:8080`**

### 4.3 Production Build Test

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

**Access preview:** http://localhost:4173

---

## 5. Docker Production Deployment

### 5.1 Prerequisites

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verify installation
docker --version
```

### 5.2 Build Docker Image

#### Step 1: Review Dockerfile

```dockerfile
# Multi-stage build for optimized image
FROM node:18-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Step 2: Build Image

```bash
cd /home/user/aucdt-utilities

# Build with version tag
sudo docker build -t thesisai-frontend:1.0.0 .

# Also tag as latest
sudo docker tag thesisai-frontend:1.0.0 thesisai-frontend:latest

# Verify image
sudo docker images | grep thesisai-frontend
```

**Expected output:**
```
thesisai-frontend   1.0.0   abc123def456   2 minutes ago   45.2MB
thesisai-frontend   latest  abc123def456   2 minutes ago   45.2MB
```

### 5.3 Run Container

#### Basic Deployment

```bash
sudo docker run -d \
  --name thesisai-frontend \
  --restart unless-stopped \
  -p 80:80 \
  thesisai-frontend:1.0.0
```

#### With Custom Configuration

```bash
sudo docker run -d \
  --name thesisai-frontend \
  --restart unless-stopped \
  -p 80:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf:ro \
  -v /var/log/nginx:/var/log/nginx \
  --memory="512m" \
  --cpus="1.0" \
  thesisai-frontend:1.0.0
```

#### With Docker Network (Recommended)

```bash
# Create network
sudo docker network create thesisai-network

# Run frontend
sudo docker run -d \
  --name thesisai-frontend \
  --network thesisai-network \
  --restart unless-stopped \
  -p 80:80 \
  thesisai-frontend:1.0.0

# Run backend (example)
sudo docker run -d \
  --name thesisai-backend \
  --network thesisai-network \
  --restart unless-stopped \
  -p 8080:8080 \
  thesisai-backend:1.0.0
```

### 5.4 Docker Compose Deployment

#### docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    image: thesisai-frontend:1.0.0
    container_name: thesisai-frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"  # If using SSL
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./ssl:/etc/nginx/ssl:ro  # SSL certificates
      - nginx-logs:/var/log/nginx
    networks:
      - thesisai-network
    depends_on:
      - backend
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  backend:
    image: thesisai-backend:1.0.0
    container_name: thesisai-backend
    restart: unless-stopped
    ports:
      - "8080:8080"
    networks:
      - thesisai-network
    environment:
      - NODE_ENV=production
      - PORT=8080
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  thesisai-network:
    driver: bridge

volumes:
  nginx-logs:
```

#### Deploy with Docker Compose

```bash
# Start services
sudo docker-compose up -d

# View logs
sudo docker-compose logs -f

# Check status
sudo docker-compose ps

# Stop services
sudo docker-compose down

# Update and restart
sudo docker-compose pull
sudo docker-compose up -d --force-recreate
```

### 5.5 SSL/TLS Configuration

#### Generate SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d thesisai.com -d www.thesisai.com

# Certificate location
ls -la /etc/letsencrypt/live/thesisai.com/
```

#### Update nginx.conf for SSL

```nginx
server {
    listen 80;
    server_name thesisai.com www.thesisai.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name thesisai.com www.thesisai.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=31536000" always;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Mount SSL Certificates

```yaml
# docker-compose.yml
services:
  frontend:
    volumes:
      - /etc/letsencrypt/live/thesisai.com/fullchain.pem:/etc/nginx/ssl/fullchain.pem:ro
      - /etc/letsencrypt/live/thesisai.com/privkey.pem:/etc/nginx/ssl/privkey.pem:ro
```

---

## 6. Cloud Platform Deployments

### 6.1 Vercel Deployment

**Vercel is ideal for quick, zero-config deployments.**

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login

```bash
vercel login
```

#### Step 3: Deploy

```bash
cd /home/user/aucdt-utilities

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Step 4: Configure Environment Variables

```bash
# Via CLI
vercel env add VITE_API_URL production

# Or via Vercel Dashboard:
# 1. Go to project settings
# 2. Navigate to Environment Variables
# 3. Add: VITE_API_URL = https://api.thesisai.com
```

#### vercel.json Configuration

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api.thesisai.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 6.2 Netlify Deployment

#### Method 1: Git Integration

1. Push code to GitHub
2. Go to https://app.netlify.com
3. Click "New site from Git"
4. Select repository
5. Configure build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`
6. Deploy

#### Method 2: CLI Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd /home/user/aucdt-utilities
netlify deploy --prod
```

#### netlify.toml Configuration

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "https://api.thesisai.com/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer-when-downgrade"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 6.3 AWS Deployment (EC2 + Docker)

#### Step 1: Launch EC2 Instance

```bash
# AWS CLI (or use AWS Console)
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --count 1 \
  --instance-type t3.small \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --subnet-id subnet-xxxxxxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=ThesisAI-Frontend}]'
```

#### Step 2: Connect to Instance

```bash
ssh -i your-key.pem ubuntu@ec2-xx-xx-xx-xx.compute.amazonaws.com
```

#### Step 3: Install Docker

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### Step 4: Deploy Application

```bash
# Clone repository
git clone https://github.com/DanielFTwum-creator/aucdt-utilities.git
cd aucdt-utilities

# Build Docker image
docker build -t thesisai-frontend:1.0.0 .

# Run container
docker run -d \
  --name thesisai-frontend \
  --restart unless-stopped \
  -p 80:80 \
  thesisai-frontend:1.0.0
```

#### Step 5: Configure Security Group

```bash
# Allow HTTP traffic
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow HTTPS traffic
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

### 6.4 AWS S3 + CloudFront (Static Hosting)

#### Step 1: Build Application

```bash
cd /home/user/aucdt-utilities
pnpm build
```

#### Step 2: Create S3 Bucket

```bash
aws s3 mb s3://thesisai-frontend
```

#### Step 3: Configure Bucket for Static Hosting

```bash
# Enable static website hosting
aws s3 website s3://thesisai-frontend \
  --index-document index.html \
  --error-document index.html

# Set bucket policy
cat > bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::thesisai-frontend/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket thesisai-frontend \
  --policy file://bucket-policy.json
```

#### Step 4: Upload Files

```bash
# Upload build files
aws s3 sync dist/ s3://thesisai-frontend \
  --delete \
  --cache-control "public, max-age=31536000, immutable"

# Set index.html cache
aws s3 cp s3://thesisai-frontend/index.html s3://thesisai-frontend/index.html \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html"
```

#### Step 5: Create CloudFront Distribution

```bash
# Create distribution config
cat > cloudfront-config.json <<EOF
{
  "CallerReference": "thesisai-$(date +%s)",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-thesisai-frontend",
        "DomainName": "thesisai-frontend.s3-website-us-east-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-thesisai-frontend",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    },
    "MinTTL": 0,
    "Compress": true
  },
  "Comment": "ThesisAI Frontend CDN",
  "Enabled": true
}
EOF

# Create distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

#### Step 6: Configure Custom Domain (Optional)

```bash
# Request SSL certificate
aws acm request-certificate \
  --domain-name thesisai.com \
  --subject-alternative-names www.thesisai.com \
  --validation-method DNS

# Add CNAME record in Route 53 or your DNS provider
# Point thesisai.com to d123456789abcd.cloudfront.net
```

### 6.5 Google Cloud Platform (GCP)

#### Using Cloud Run

```bash
# Build and push image to Container Registry
gcloud builds submit --tag gcr.io/your-project/thesisai-frontend

# Deploy to Cloud Run
gcloud run deploy thesisai-frontend \
  --image gcr.io/your-project/thesisai-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80
```

---

## 7. CI/CD Pipeline Setup

### 7.1 GitHub Actions

#### .github/workflows/deploy.yml

```yaml
name: Deploy ThesisAI Frontend

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8.15.0

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run linter
        run: pnpm lint

      - name: Run tests
        run: pnpm test

      - name: Build application
        run: pnpm build

  build-docker:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            yourusername/thesisai-frontend:latest
            yourusername/thesisai-frontend:${{ github.sha }}
          cache-from: type=registry,ref=yourusername/thesisai-frontend:latest
          cache-to: type=inline

  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build-docker
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/thesisai
            docker pull yourusername/thesisai-frontend:latest
            docker stop thesisai-frontend || true
            docker rm thesisai-frontend || true
            docker run -d \
              --name thesisai-frontend \
              --restart unless-stopped \
              -p 80:80 \
              yourusername/thesisai-frontend:latest
            docker image prune -f
```

#### Required Secrets

Add these in GitHub repository settings → Secrets:

- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password
- `SERVER_HOST`: Production server IP/hostname
- `SERVER_USER`: SSH username
- `SSH_PRIVATE_KEY`: SSH private key for server access

### 7.2 GitLab CI/CD

#### .gitlab-ci.yml

```yaml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_IMAGE: registry.gitlab.com/$CI_PROJECT_PATH

test:
  stage: test
  image: node:18-alpine
  before_script:
    - corepack enable
    - corepack prepare pnpm@8.15.0 --activate
  script:
    - pnpm install --frozen-lockfile
    - pnpm lint
    - pnpm test
    - pnpm build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

build-docker:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $DOCKER_IMAGE:latest -t $DOCKER_IMAGE:$CI_COMMIT_SHA .
    - docker push $DOCKER_IMAGE:latest
    - docker push $DOCKER_IMAGE:$CI_COMMIT_SHA
  only:
    - main

deploy-production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan $SERVER_HOST >> ~/.ssh/known_hosts
  script:
    - |
      ssh $SERVER_USER@$SERVER_HOST << 'EOF'
        docker pull $DOCKER_IMAGE:latest
        docker stop thesisai-frontend || true
        docker rm thesisai-frontend || true
        docker run -d \
          --name thesisai-frontend \
          --restart unless-stopped \
          -p 80:80 \
          $DOCKER_IMAGE:latest
        docker image prune -f
      EOF
  only:
    - main
  when: manual
```

---

## 8. Post-Deployment Verification

### 8.1 Health Checks

```bash
# 1. Check HTTP status
curl -I http://your-domain.com

# Expected: HTTP/1.1 200 OK

# 2. Check content loads
curl http://your-domain.com | grep "ThesisAI"

# 3. Check API proxy
curl -I http://your-domain.com/api/health

# 4. Test HTTPS (if configured)
curl -I https://your-domain.com
```

### 8.2 Performance Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Run load test (100 requests, 10 concurrent)
ab -n 100 -c 10 http://your-domain.com/

# Check response times
# Look for: Time per request, Failed requests
```

### 8.3 Browser Testing

**Manual Checklist:**

- [ ] Page loads correctly
- [ ] No console errors
- [ ] Styles render properly
- [ ] Navigation works
- [ ] Forms submit correctly
- [ ] API calls succeed
- [ ] Responsive design works (mobile, tablet, desktop)

**Automated Testing:**

```bash
# Install Playwright
pnpm add -D @playwright/test

# Create e2e test
# tests/e2e/smoke.spec.ts
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('http://your-domain.com');
  await expect(page).toHaveTitle(/ThesisAI/);
});

# Run tests
pnpm exec playwright test
```

### 8.4 Security Verification

```bash
# Check SSL/TLS configuration
curl https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com

# Check security headers
curl -I https://your-domain.com | grep -E "X-Frame|X-Content|Strict-Transport"

# Expected headers:
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# Strict-Transport-Security: max-age=31536000
```

### 8.5 Monitoring Setup

```bash
# Install monitoring agent (example: Prometheus Node Exporter)
sudo apt-get install prometheus-node-exporter

# Or use cloud monitoring
# - AWS CloudWatch
# - GCP Cloud Monitoring
# - Azure Monitor
# - Datadog
# - New Relic
```

---

## 9. Rollback Procedures

### 9.1 Quick Rollback (Docker)

```bash
# Stop current container
sudo docker stop thesisai-frontend

# Remove current container
sudo docker rm thesisai-frontend

# Run previous version
sudo docker run -d \
  --name thesisai-frontend \
  --restart unless-stopped \
  -p 80:80 \
  thesisai-frontend:1.0.0-previous

# Or using Docker Compose
sudo docker-compose down
sudo docker-compose up -d --force-recreate
```

### 9.2 Git-based Rollback

```bash
# Find commit to rollback to
git log --oneline -10

# Revert to specific commit
git checkout <commit-hash>

# Rebuild and redeploy
pnpm install
pnpm build
sudo docker build -t thesisai-frontend:rollback .
sudo docker run -d --name thesisai-frontend -p 80:80 thesisai-frontend:rollback
```

### 9.3 Vercel/Netlify Rollback

**Vercel:**
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>
```

**Netlify:**
```bash
# Via dashboard:
# 1. Go to Deploys tab
# 2. Find previous successful deployment
# 3. Click "Publish deploy"

# Or via CLI
netlify deploy --alias rollback
```

### 9.4 Rollback Verification

```bash
# 1. Check application version
curl http://your-domain.com/version

# 2. Verify functionality
curl http://your-domain.com | grep "expected-content"

# 3. Check logs for errors
sudo docker logs thesisai-frontend | grep -i error

# 4. Monitor metrics
# - Response times
# - Error rates
# - User traffic
```

---

## 10. Troubleshooting Deployment Issues

### 10.1 Build Failures

**Issue: `pnpm: command not found`**

```bash
# Solution: Install pnpm
npm install -g pnpm@8.15.0

# Or use corepack
corepack enable
corepack prepare pnpm@8.15.0 --activate
```

**Issue: TypeScript errors**

```bash
# Solution: Check for type errors
pnpm lint

# Fix errors and rebuild
pnpm build
```

**Issue: Out of memory during build**

```bash
# Solution: Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

### 10.2 Docker Issues

**Issue: Cannot connect to Docker daemon**

```bash
# Solution: Start Docker
sudo systemctl start docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

**Issue: Port already in use**

```bash
# Solution: Find and kill process
sudo lsof -i :80
sudo kill -9 <PID>

# Or use different port
docker run -p 8080:80 thesisai-frontend:1.0.0
```

**Issue: Container exits immediately**

```bash
# Solution: Check logs
docker logs thesisai-frontend

# Check nginx configuration
docker run --rm thesisai-frontend:1.0.0 nginx -t
```

### 10.3 SSL/TLS Issues

**Issue: Certificate errors**

```bash
# Solution: Verify certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test nginx configuration
sudo nginx -t
```

**Issue: Mixed content warnings**

```bash
# Solution: Ensure all resources use HTTPS
# Update nginx configuration to redirect HTTP → HTTPS
# Update API URLs to use HTTPS
```

### 10.4 Performance Issues

**Issue: Slow page load**

```bash
# Solution 1: Enable gzip compression
# (see nginx.conf)

# Solution 2: Optimize bundle size
pnpm build --mode production

# Solution 3: Use CDN
# Configure CloudFront, Cloudflare, or similar
```

**Issue: High memory usage**

```bash
# Solution: Limit container resources
docker run -d \
  --memory="512m" \
  --cpus="1.0" \
  thesisai-frontend:1.0.0
```

---

## Appendix

### A. Deployment Checklist

**Pre-Deployment:**
- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build completes successfully
- [ ] Environment variables configured
- [ ] SSL certificate obtained (production)
- [ ] Backup of current production
- [ ] Rollback plan documented

**Deployment:**
- [ ] Deploy to staging first
- [ ] Run smoke tests on staging
- [ ] Get stakeholder approval
- [ ] Deploy to production
- [ ] Run post-deployment tests

**Post-Deployment:**
- [ ] Verify application loads
- [ ] Check for console errors
- [ ] Test critical user paths
- [ ] Monitor logs for errors
- [ ] Monitor performance metrics
- [ ] Notify team of deployment

### B. Useful Commands Reference

```bash
# Docker
docker build -t image:tag .
docker run -d --name container -p 80:80 image:tag
docker ps
docker logs container
docker stop container
docker rm container
docker rmi image:tag

# Docker Compose
docker-compose up -d
docker-compose down
docker-compose logs -f
docker-compose ps
docker-compose restart

# Git
git pull origin main
git log --oneline -10
git checkout <commit>

# pnpm
pnpm install
pnpm build
pnpm test
pnpm start

# Nginx
nginx -t
nginx -s reload
systemctl status nginx
systemctl restart nginx

# System
df -h
free -h
top
netstat -tuln
```

### C. Support Resources

- **GitHub Repository:** https://github.com/DanielFTwum-creator/aucdt-utilities
- **Documentation:** See `README.md` and `ADMINISTRATOR_GUIDE.md`
- **Issues:** https://github.com/DanielFTwum-creator/aucdt-utilities/issues

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-26
**Next Review:** 2026-02-26

**Deployment Team Contact:**
- Technical Lead: [Contact Info]
- DevOps Engineer: [Contact Info]
- Support Team: [Contact Info]

---

*For deployment assistance, please open an issue on GitHub or contact the DevOps team.*
