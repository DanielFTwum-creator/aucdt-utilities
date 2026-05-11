# Docker Deployment Guide — patois-lyricist-v2.0.0

## Overview

This guide covers building, testing, and deploying patois-lyricist-v2.0.0 using Docker. The containerised setup includes:

- **Multi-stage build** — Minimal production image (~50MB)
- **Nginx web server** — High-performance static file serving
- **Security headers** — SOC 2 compliance + OWASP guidelines
- **Health checks** — Automated container monitoring
- **Non-root user** — Security hardening
- **SPA routing** — Single Page App support (all routes → index.html)

---

## Prerequisites

- **Docker** ≥ 20.0 (`docker --version`)
- **Docker Compose** ≥ 1.29 (`docker-compose --version`)
- **Gemini API Key** — Set as `GEMINI_API_KEY` environment variable

---

## Quick Start (Docker Compose)

### 1. Setup Environment

```bash
cd patois-lyricist-v2.0.0

# Copy and configure .env file
cp .env.example .env.local
# Edit .env.local and add your Gemini API key:
#   GEMINI_API_KEY=your_api_key_here
```

### 2. Build & Start Container

```bash
# Build the image and start the container
docker-compose up --build

# Output should show:
#   patois-lyricist-v2 is now running on http://localhost:3000
```

### 3. Test the Application

Open http://localhost:3000 in your browser.

### 4. View Logs

```bash
# Follow logs in real-time
docker-compose logs -f

# View logs from specific service
docker-compose logs patois-lyricist
```

### 5. Stop Container

```bash
docker-compose down

# Remove all stopped containers and dangling images
docker-compose down --rmi unused --volumes
```

---

## Manual Docker Build & Run

### Build Image

```bash
cd patois-lyricist-v2.0.0

# Build with API key baked in (less secure)
docker build --build-arg GEMINI_API_KEY=your_key_here -t patois-lyricist:v2.0.0 .

# Or build without key (set at runtime)
docker build -t patois-lyricist:v2.0.0 .
```

### Run Container

```bash
# Basic run (port 3000 → container port 80)
docker run -d \
  --name patois-v2 \
  -p 3000:80 \
  -e GEMINI_API_KEY=${GEMINI_API_KEY} \
  patois-lyricist:v2.0.0

# With custom restart policy and memory limits
docker run -d \
  --name patois-v2 \
  -p 3000:80 \
  -e GEMINI_API_KEY=${GEMINI_API_KEY} \
  --restart unless-stopped \
  --memory=512m \
  --cpus=1 \
  patois-lyricist:v2.0.0
```

### Verify Container Is Running

```bash
# Check container status
docker ps | grep patois

# Check logs
docker logs -f patois-v2

# Test health endpoint
curl http://localhost:3000/health

# Expected response: "healthy"
```

### Stop & Remove Container

```bash
docker stop patois-v2
docker rm patois-v2
```

---

## Production Deployment

### Image Size

The final image is **~50–60 MB** (optimised for production):
- Base nginx:alpine ≈ 15 MB
- Compiled React app ≈ 30–40 MB

### Recommended Docker Registry Push

```bash
# Tag image for Docker Hub
docker tag patois-lyricist:v2.0.0 your-registry/patois-lyricist:v2.0.0

# Login to registry
docker login

# Push image
docker push your-registry/patois-lyricist:v2.0.0
```

### Kubernetes Deployment (Optional)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: patois-lyricist
  labels:
    app: patois-lyricist
    version: v2.0.0
spec:
  replicas: 3
  selector:
    matchLabels:
      app: patois-lyricist
  template:
    metadata:
      labels:
        app: patois-lyricist
        version: v2.0.0
    spec:
      containers:
      - name: patois-lyricist
        image: your-registry/patois-lyricist:v2.0.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
          protocol: TCP
        env:
        - name: GEMINI_API_KEY
          valueFrom:
            secretKeyRef:
              name: patois-secrets
              key: gemini-api-key
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
        resources:
          limits:
            memory: 512Mi
            cpu: 500m
          requests:
            memory: 256Mi
            cpu: 250m
        securityContext:
          readOnlyRootFilesystem: false
          allowPrivilegeEscalation: false
          capabilities:
            drop:
            - ALL
---
apiVersion: v1
kind: Service
metadata:
  name: patois-lyricist-service
spec:
  selector:
    app: patois-lyricist
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```

### Docker Swarm Deployment

```bash
# Initialize swarm (if not already)
docker swarm init

# Create service
docker service create \
  --name patois-lyricist \
  --replicas 3 \
  -p 80:80 \
  --env GEMINI_API_KEY=${GEMINI_API_KEY} \
  your-registry/patois-lyricist:v2.0.0

# View service status
docker service ls
docker service ps patois-lyricist

# Update service
docker service update --image your-registry/patois-lyricist:v2.0.0-new patois-lyricist

# Remove service
docker service rm patois-lyricist
```

---

## Security Best Practices

### 1. API Key Management

**Never** commit `.env.local` or API keys to version control. Use:

```bash
# Option 1: Docker Compose secrets (Swarm/K8s)
# Option 2: Environment file at runtime
docker run -e GEMINI_API_KEY=$(cat /path/to/secret) ...

# Option 3: Docker BuildKit with secrets
docker build --secret gemini_key=/path/to/key -t patois:v2 .
```

### 2. Content Security Policy (CSP)

The `security-headers.conf` enforces:
- Restrict script loading to self, CDNs, and Google APIs only
- Prevent inline scripts (except Tailwind, which is necessary)
- Disable plugins, payments, camera, microphone
- Block framing attacks (X-Frame-Options: DENY)

To verify headers:

```bash
curl -i http://localhost:3000 | grep -i "content-security-policy\|x-frame\|x-content-type"
```

### 3. Image Scanning

```bash
# Scan image for vulnerabilities (requires Docker Scout)
docker scout cves patois-lyricist:v2.0.0

# Or use Trivy
trivy image patois-lyricist:v2.0.0
```

### 4. Network Isolation

The docker-compose.yml creates an isolated bridge network (`patois-network`). To restrict external access:

```bash
# Run with --network none (no external connectivity)
docker run --network none patois-lyricist:v2.0.0

# Custom network with specific rules
docker network create --driver bridge patois-secure
docker run --network patois-secure patois-lyricist:v2.0.0
```

---

## Performance Tuning

### Memory & CPU Limits

```bash
docker run \
  --memory=512m \
  --memory-swap=512m \
  --cpus=1.0 \
  patois-lyricist:v2.0.0
```

### Caching Strategy

The Nginx configuration includes aggressive caching:
- **Static assets** (JS, CSS, images): 1 year cache (immutable)
- **HTML files**: No cache (allows SPA updates)
- **Health endpoint**: Not cached

Verify caching headers:

```bash
# Check static asset caching
curl -i http://localhost:3000/assets/index-xyz.js | grep -i cache-control

# Check HTML no-cache
curl -i http://localhost:3000/index.html | grep -i cache-control
```

---

## Troubleshooting

### Container Won't Start

```bash
# View error logs
docker logs patois-v2

# Run in foreground for debugging
docker run -it --rm patois-lyricist:v2.0.0 bash

# Check Nginx syntax
docker run --rm patois-lyricist:v2.0.0 nginx -t
```

### Port Already in Use

```bash
# Find process using port 3000
netstat -tlnp | grep 3000

# Use different port
docker run -p 8080:80 patois-lyricist:v2.0.0
```

### API Key Not Working

```bash
# Verify environment variable is set in container
docker exec patois-v2 env | grep GEMINI

# Check if API key is being passed correctly
docker run -e GEMINI_API_KEY=test-key patois-lyricist:v2.0.0 sh -c 'echo $GEMINI_API_KEY'
```

### Health Check Failing

```bash
# Manually test health endpoint
docker exec patois-v2 curl -f http://localhost:80/health

# View health status
docker ps | grep patois-v2  # Check "(healthy)" or "(unhealthy)"

# Increase health check timeout
# Edit docker-compose.yml: increase timeout and retries
```

---

## Maintenance

### Update Application

```bash
# 1. Rebuild image with new code
docker build -t patois-lyricist:v2.0.1 .

# 2. Test new image
docker run -p 3000:80 patois-lyricist:v2.0.1

# 3. Update docker-compose.yml tag (optional) and restart
docker-compose down && docker-compose up -d
```

### Clean Up Unused Images

```bash
# Remove dangling images
docker image prune -a -f

# Remove specific image
docker rmi patois-lyricist:v2.0.0
```

### Backup & Restore

Since this is a stateless SPA, no persistent storage backup is needed. However, preserve:
- `.env.local` (API keys)
- `docs/` (documentation)
- `migrated_prompt_history/` (if desired)

---

## Additional Resources

- **Docker Official Docs:** https://docs.docker.com/
- **Nginx Docs:** https://nginx.org/en/docs/
- **Google Gemini API:** https://ai.google.dev/
- **OWASP Security Headers:** https://owasp.org/www-project-secure-headers/
- **SOC 2 Compliance:** https://www.aicpa-cima.com/topic/soc-2

---

**Last Updated:** 2026-05-03
**Tested On:** Docker 29.3.1, nginx:alpine, node:22-alpine
