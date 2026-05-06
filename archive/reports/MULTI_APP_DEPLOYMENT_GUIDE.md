# Multi-App Docker Deployment Guide

Complete orchestration guide for deploying all 12 PoC services with monitoring.

## Prerequisites

- **Docker Engine** 20.10+ ([install](https://docs.docker.com/engine/install/))
- **Docker Compose** 2.0+ ([install](https://docs.docker.com/compose/install/))
- **Git** for cloning repository
- **SSH** access to Ubuntu server (if deploying to remote)
- **Min Resources**: 4GB RAM, 20GB disk, multi-core CPU

## Architecture

```
docker-compose-all-12-services.yml
├── Services (8 APIs)
│   ├── ghana-news-api (4000)
│   ├── brand-checker-api (4001)
│   ├── msee-aptitude-api (4002)
│   ├── lecture-assessment-api (4003)
│   ├── asapro-api (4004)
│   ├── sentinel-api (4005)
│   ├── analytics-api (4006)
│   └── tsapro-api (4007)
├── Database
│   └── mariadb:11.4 (3306)
├── Monitoring
│   ├── prometheus (9090)
│   ├── elasticsearch (9200)
│   └── kibana (5601)
└── Routing
    └── nginx (80/443)
```

## Quick Start (Local Development)

### 1. Clone Repository

```bash
git clone https://github.com/DanielFTwum-creator/aucdt-utilities.git
cd aucdt-utilities
```

### 2. Build & Start Services

```bash
# Pull latest images
docker-compose -f docker-compose-all-12-services.yml pull

# Start all services (builds missing images)
docker-compose -f docker-compose-all-12-services.yml up -d

# Wait 30-60s for services to initialize
docker-compose ps

# Check health
curl http://localhost/status
```

### 3. Verify All Services

```bash
# Health checks
for port in {4000..4007}; do
  echo "Testing port $port..."
  curl -s http://localhost:$port/health | jq .
done

# Database
mysql -u appuser -p -h 127.0.0.1 -e "SELECT VERSION();"

# Monitoring UIs
echo "Prometheus:   http://localhost:9090"
echo "Kibana:       http://localhost:5601"
echo "Services:     http://localhost/status"
```

## Step-by-Step Deployment (Production)

### Phase 1: Server Preparation (10 min)

```bash
# SSH into Ubuntu server
ssh user@your-server-ip
sudo -i

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Phase 2: Clone & Configure (5 min)

```bash
# Clone repository
mkdir -p /opt
cd /opt
git clone https://github.com/DanielFTwum-creator/aucdt-utilities.git
cd aucdt-utilities

# Create environment files (one per service)
mkdir -p .env-local
cat > .env-local/maria.env << 'EOF'
MYSQL_ROOT_PASSWORD=rootpass123!
MYSQL_USER=appuser
MYSQL_PASSWORD=apppass123!
MYSQL_DATABASE=aucdt_main
EOF

# Change permissions
chmod 600 .env-local/maria.env
```

### Phase 3: Check Resource Requirements

```bash
# Estimate disk space
du -sh docker-compose-all-12-services.yml
du -sh .

# Check available resources
free -h          # RAM
df -h            # Disk
nproc            # CPU cores

# Recommendation
# Minimum: 4GB RAM, 30GB disk, 2 CPUs
# Recommended: 8GB+ RAM, 50GB+ disk, 4+ CPUs
```

### Phase 4: Build Docker Images (15 min)

```bash
# Build all backend services
docker-compose -f docker-compose-all-12-services.yml build --parallel

# Verify builds
docker images | grep -E "ghana-news|brand-checker|msee|lecture|asapro|sentinel|analytics|tsapro"
```

### Phase 5: Start Services (Staged)

**Option A: All at Once** (if resources sufficient)
```bash
docker-compose -f docker-compose-all-12-services.yml up -d

# Wait for startup
docker-compose logs -f mariadb
# Wait for "ready for connections" message, Ctrl+C
```

**Option B: Staged Startup** (to prevent resource exhaustion)
```bash
# Start core services first
docker-compose -f docker-compose-all-12-services.yml up -d mariadb nginx

# Wait for MariaDB
sleep 60

# Start monitoring
docker-compose -f docker-compose-all-12-services.yml up -d prometheus elasticsearch kibana

# Wait for ES
sleep 30

# Start backend services one by one
for service in ghana-news-api brand-checker-api msee-aptitude-api lecture-assessment-api \
               asapro-api sentinel-api analytics-api tsapro-api; do
  echo "Starting $service..."
  docker-compose -f docker-compose-all-12-services.yml up -d $service
  sleep 10
done
```

### Phase 6: Health Checks (5 min)

```bash
# Container status
docker-compose -f docker-compose-all-12-services.yml ps

# All containers running?
docker ps --format "table {{.Names}}\t{{.Status}}"

# Test APIs
curl http://localhost:4000/health  # Ghana News
curl http://localhost:4001/health  # Brand Checker
# ... test remaining services

# Verify database
mysql -u appuser -p -h localhost -e "SHOW DATABASES;"

# Prometheus scrape targets
curl http://localhost:9090/api/v1/targets | jq '.data.activeTargets | length'
```

### Phase 7: Initialize Databases (5 min)

```bash
# Each service has a separate database (auto-initialized in docker-compose)
# Verify with:
mysql -u appuser -p -h localhost -e "SHOW DATABASES;"
# Should see: aucdt_main, ghana_news, brand_checker, msee_aptitude, lecture_assessment, asapro, sentinel, analytics, tsapro

# Create indices in Kibana (if using Elasticsearch)
# Visit http://localhost:5601 and follow prompts to create index pattern
```

### Phase 8: Configure Reverse Proxy (SSL Optional)

```bash
# For HTTPS, add certificates to ./certs/
mkdir -p ./certs

# Option A: Self-signed (testing)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ./certs/key.pem -out ./certs/cert.pem

# Option B: Let's Encrypt (production)
# Install certbot first:
apt install certbot
certbot certonly --standalone -d api.aucdt.edu.gh
# Copy certs to ./certs/

# Uncomment HTTPS section in monitoring/nginx.conf
# Restart nginx
docker-compose -f docker-compose-all-12-services.yml restart nginx
```

## Verification Checklist

```bash
# ✅ All 12 services running
docker-compose ps | grep -c "Up"  # Should output: 12 (or 15 with monitoring)

# ✅ MariaDB accessible
mysql -u appuser -p -h localhost -e "SELECT @@version;"

# ✅ All APIs responding
for i in {4000..4007}; do echo "=== Port $i ===" && curl -s http://localhost:$i/health || echo "FAILED"; done

# ✅ Prometheus scraping
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets | length'

# ✅ Elasticsearch storing data
curl -s http://localhost:9200/_cluster/health | jq '.status'

# ✅ Nginx routing
curl -s http://localhost/status | head -20

# ✅ Logs being collected
docker-compose logs --tail=10 ghana-news-api
```

## Monitoring Dashboards

### Prometheus
- **URL**: http://localhost:9090
- **Status**: Targets → http://localhost:9090/graph
- **Query examples**:
  ```promql
  up                          # Service status
  rate(http_requests_total[1m])  # Request rate
  container_memory_usage_bytes   # Memory usage
  ```

### Kibana
- **URL**: http://localhost:5601
- **Setup**: Create Index Pattern (logs-*)
- **Explore**: Discover → search logs by service, level, timestamp

### Nginx Status
- **URL**: http://localhost/status
- **Shows**: All service endpoints + health links

## Common Operations

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f ghana-news-api

# Last 100 lines, one service
docker-compose logs --tail=100 brand-checker-api

# Since timestamp
docker-compose logs --since 10m

# Follow + timestamps
docker-compose logs -f -t msee-aptitude-api
```

### Scale a Service

```bash
# Run multiple instances (requires shared DB)
docker-compose -f docker-compose-all-12-services.yml up -d --scale ghana-news-api=3

# Nginx will load-balance automatically
curl http://localhost/api/news/health  # May hit different container each time
```

### Restart Services

```bash
# Single service
docker-compose restart ghana-news-api

# Multiple services
docker-compose restart ghana-news-api brand-checker-api msee-aptitude-api

# All services
docker-compose restart

# Full recreate (careful!)
docker-compose up -d --force-recreate
```

### Update Service Code

```bash
# Pull latest code
git pull origin main

# Rebuild affected service
docker-compose build ghana-news-api

# Restart with new image
docker-compose up -d ghana-news-api

# Verify
curl http://localhost:4000/health
```

### Backup Database

```bash
# Export all databases
docker exec aucdt-mariadb mysqldump -u appuser -p --all-databases > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
docker exec -i aucdt-mariadb mysql -u appuser -p < backup_20250224_120000.sql
```

## Troubleshooting

### Service won't start

```bash
# Check logs
docker logs <container-name>

# Verify port not in use
netstat -tlnp | grep :4000

# Restart
docker-compose up -d <service>
```

### Out of memory

```bash
# Check usage
docker stats

# Find heavy container
docker stats --no-stream | sort -k4 -hr | head -5

# Increase memory limit in docker-compose.yml
#   deploy:
#     resources:
#       limits:
#         memory: 2G
```

### Database connection errors

```bash
# Test connection
mysql -u appuser -p -h localhost -e "SELECT 1;"

# Check MariaDB logs
docker logs aucdt-mariadb

# Verify network
docker network ls
docker network inspect aucdt-network
```

### Prometheus not scraping

```bash
# Check targets
curl http://localhost:9090/api/v1/targets

# Test endpoint directly
curl http://localhost:4000/metrics

# Check Prometheus config
docker exec aucdt-prometheus cat /etc/prometheus/prometheus.yml
```

## Production Hardening

```bash
# 1. Set resource limits
docker-compose -f docker-compose-all-12-services.yml up -d --limit=4

# 2. Use read-only volumes where possible
# 3. Enable restart policies (already in compose file)
# 4. Set up log rotation (already configured: max 10m, 3 files)
# 5. Network segmentation (use named network: aucdt-network)
# 6. Secrets management
#    - Use Docker secrets for sensitive data
#    - Or external .env files (not in git!)
# 7. Regular backups
#    - Daily mysqldump
#    - Weekly Prometheus snapshots
#    - Elasticsearch backup

# 8. Monitoring the monitor
#    - Alert if Prometheus down
#    - Alert if Elasticsearch down
#    - Redundant monitoring setup
```

## Scaling Considerations

### Horizontal Scaling

```bash
# Multiple API instances (share DB)
docker-compose up -d --scale ghana-news-api=3
docker-compose up -d --scale brand-checker-api=2

# Load balance with Nginx (automatic via DNS name)
```

### Vertical Scaling

Increase in docker-compose file:
```yaml
ghana-news-api:
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 2G
```

## Next Steps

1. **Add Alertmanager** for notifications (Slack, email)
2. **Configure Grafana** for rich dashboards
3. **Set up backups** to external storage (S3, Azure)
4. **Enable TLS/SSL** with Let's Encrypt
5. **Implement CDN** for static assets
6. **Add API Gateway** (Kong, Traefik)
7. **Set up CI/CD** to auto-deploy on git push
8. **Configure log shipping** to centralized location

## Support & Debugging

```bash
# System information
docker version
docker info

# Detailed service config
docker-compose config

# Network inspection
docker network inspect aucdt-network

# Resource statistics
docker stats --no-stream

# Event stream
docker events
```

---

**Status**: Production-ready  
**Last Updated**: February 2025  
**Estimated Deploy Time**: 20-30 minutes
