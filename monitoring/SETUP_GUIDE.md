# AUCDT Monitoring & Logging Setup Guide

Complete guide to monitoring, alerting, and log aggregation for all 12 PoC services.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUCDT Services (8 APIs)                     │
│  4000-4007: Ghana News, Brand Checker, MSEE, Assessment, etc.   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐    ┌────────────┐   ┌───────────┐
    │ Nginx    │    │ Docker     │   │ Prometheus│
    │ (LB/RP)  │    │ Daemon     │   │           │
    └──────────┘    └────────────┘   └─────┬─────┘
          │              │                   │
          │              │         ┌─────────▼────────┐
          │              │         │  Prometheus DB   │
          │              │         │  (TSDB storage)  │
          │              │         └──────────────────┘
          │              │
          ├──────────────┼─────────────────────────┐
          │              │                         │
          ▼              ▼                         ▼
    ┌──────────┐  ┌────────────┐    ┌──────────────────┐
    │Elasticsearch
    │  (Raw     │  │  Kibana    │    │ Monitoring Apps  │
    │Flogsfile) │  │  (Viz)     │    │ Grafana (opt)    │
    └──────────┘  └────────────┘    └──────────────────┘
```

## Quick Start (5 min)

### 1. Start Monitoring Stack

```bash
cd /path/to/aucdt-utilities

# Start all services with monitoring
docker-compose -f docker-compose-all-12-services.yml up -d

# Verify services
docker-compose ps
```

### 2. Access Monitoring Dashboards

| Service | URL | Credentials |
|---------|-----|-------------|
| **Prometheus** | http://localhost:9090 | None |
| **Kibana** | http://localhost:5601 | None |
| **Elasticsearch** | http://localhost:9200 | None |
| **Nginx** | http://localhost/health | None |

### 3. Check Service Health

```bash
# All services
curl http://localhost/status

# Individual APIs
curl http://localhost:4000/health  # Ghana News
curl http://localhost:4001/health  # Brand Checker
# ... etc for 4002-4007
```

## 1. Prometheus Configuration

### Location
`monitoring/prometheus.yml` — Prometheus scrape targets and intervals

### Configuration Highlights

```yaml
global:
  scrape_interval: 15s        # Collect metrics every 15 seconds
  evaluation_interval: 15s    # Evaluate alerts every 15 seconds

scrape_configs:
  - job_name: 'ghana-news-api'
    static_configs:
      - targets: ['localhost:4000']
    metrics_path: '/metrics'   # Expects /metrics endpoint on API
    scrape_interval: 30s       # Override for slower services
```

### Implementing Metrics in Your API

Each backend service should expose a `/metrics` endpoint:

```javascript
// Node.js example using prom-client

const prometheus = require('prom-client');

// Create a simple counter
const httpRequestCounter = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'status', 'path']
});

// Create a histogram for response times
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency',
  labelNames: ['method', 'status', 'path'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

// Middleware to track requests
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const statusCode = res.statusCode;
    
    httpRequestCounter.inc({
      method: req.method,
      status: statusCode,
      path: req.path
    });
    
    httpRequestDuration.observe({
      method: req.method,
      status: statusCode,
      path: req.path
    }, duration);
  });
  
  next();
});

// Expose metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});
```

### Key Metrics to Track

- **Request Count**: `http_requests_total{method, status}`
- **Response Time**: `http_request_duration_seconds` (histogram)
- **Active Connections**: `http_current_connections`
- **Database Query Time**: `db_query_duration_seconds`
- **Cache Hit Rate**: `cache_hits_total`, `cache_misses_total`
- **Background Jobs**: `jobs_completed_total`, `jobs_failed_total`

## 2. Prometheus Alerting Rules

### Location
`monitoring/prometheus-rules.yml` — Alert rule definitions

### Alert Rule Categories

#### Critical Alerts
- Service Down (> 2 minutes)
- Database unavailable
- Elasticsearch down
- High error rate (> 5% errors for 5 min)

#### Warning Alerts
- Slow responses (95th percentile > 5s)
- High memory usage (> 2GB for container)
- DB connection pool nearing full
- Disk space running low (< 10% free)

### Testing Alerts

```bash
# Query for current alerts
curl http://localhost:9090/api/v1/alerts

# Fire test alert manually
curl -X POST http://localhost:9090/api/v1/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "labels": {
      "alertname": "TestAlert",
      "severity": "warning"
    },
    "annotations": {
      "summary": "Test alert for verification"
    }
  }'

# Check alert status
curl http://localhost:9090/graph?expression=ALERTS
```

### Configure Alert Notifications

Add to `monitoring/prometheus.yml`:

```yaml
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']  # Optional: Add Alertmanager

rule_files:
  - monitoring/prometheus-rules.yml
```

To send alerts via **Slack** or **email**, deploy [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/).

## 3. Elasticsearch Logging

### Architecture

```
App Logs → Filebeat → Elasticsearch → Kibana (Visualization)
```

### 3a. Application Logging Setup

For structured logging, use JSON format:

```javascript
// Install winston
npm install winston

const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    // Console output (for Docker logs)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    // File output (sent to Elasticsearch via Filebeat)
    new winston.transports.File({
      filename: '/var/log/app.json',
      format: winston.format.json()
    })
  ]
});

// Use in routes
app.get('/api/data', (req, res) => {
  logger.info('Data requested', {
    method: req.method,
    path: req.path,
    userId: req.user?.id,
    timestamp: new Date()
  });
  // ...
});

logger.error('Error occurred', {
  error: error.message,
  stack: error.stack,
  severity: 'error'
});
```

### 3b. Docker Logging Config

Ensure JSON logging in `docker-compose-all-12-services.yml`:

```yaml
services:
  ghana-news-api:
    # ...
    logging:
      driver: "json-file"
      options:
        max-size: "10m"      # Rotate logs at 10MB
        max-file: "3"        # Keep last 3 rotated files
        labels: "service=ghana-news-api"  # Add service label
```

### 3c. Accessing Logs in Kibana

1. **Create Index Pattern**:
   - Go to Kibana: http://localhost:5601
   - Click "Management" → "Index Patterns"
   - Create pattern: `logs-*` or `app-*`

2. **Search Logs**:
   ```
   service.keyword: "ghana-news-api" AND level: "error"
   ```

3. **Create Visualizations**:
   - Count errors per service
   - Error rate over time
   - Top 10 error messages

4. **Build Dashboard**:
   - Combine visualizations
   - Add filters for date range, service, level
   - Pin to home screen

## 4. Nginx Monitoring

### Nginx Configuration

Update `monitoring/nginx.conf`:

```nginx
server {
  # Add stub_status for metrics
  location /nginx_status {
    stub_status on;
    allow all;
  }
}
```

### Prometheus Scrape Config

```yaml
scrape_configs:
  - job_name: 'nginx'
    static_configs:
      - targets: ['localhost:80']
    metrics_path: '/nginx_status'
    scrape_interval: 30s
```

### Key Nginx Metrics

- **Connections**: Active, waiting, reading, writing
- **Requests**: Total handled, accepts
- **Request Rate**: Requests per second

## 5. Database Monitoring

### MariaDB Exporter (Optional)

For detailed DB metrics, use [mysqld_exporter](https://github.com/prometheus/mysqld_exporter):

```bash
# Start exporter (in separate container or host)
docker run -d \
  --name=mysqld_exporter \
  -e DATA_SOURCE_NAME="appuser:apppass@(mariadb:3306)/" \
  -p 9104:9104 \
  prom/mysqld_exporter

# Add to prometheus.yml
scrape_configs:
  - job_name: 'mariadb'
    static_configs:
      - targets: ['localhost:9104']
```

### Key Database Metrics

- **Connections**: Current, max
- **Queries**: Slow query count, query time
- **Replication**: Lag, events
- **Tables**: Row count, index size
- **Memory**: Buffer pool usage

## 6. Viewing Prometheus Data

### PromQL Queries

Common queries for debugging:

```promql
# Request rate (req/sec) for each service
rate(http_requests_total[1m])

# Error rate percentage
(sum(rate(http_requests_total{status=~"5.."}[5m])) /
 sum(rate(http_requests_total[5m]))) * 100

# 95th percentile response time
histogram_quantile(0.95, http_request_duration_seconds_bucket)

# Memory usage per container
container_memory_usage_bytes / 1024 / 1024 / 1024

# CPU utilization
rate(container_cpu_usage_seconds_total[5m]) * 100
```

### Grafana Integration (Optional)

For richer dashboards, add Grafana to stack:

```yaml
grafana:
  image: grafana/grafana:latest
  ports:
    - "3000:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
  depends_on:
    - prometheus
```

Then:

1. Access: http://localhost:3000
2. Add data source: Prometheus (http://prometheus:9090)
3. Import dashboards:
   - Node Exporter Full
   - Nginx Dashboard
   - MariaDB Dashboard

## 7. Monitoring Dashboard Setup

### Create Custom Prometheus Dashboard

Go to http://localhost:9090/graph and add panels:

**Panel 1: Request Rate (per service, per minute)**
```promql
rate(http_requests_total[1m])
```

**Panel 2: Error Rate**
```promql
rate(http_requests_total{status=~"5.."}[5m])
```

**Panel 3: API Response Time (99th percentile)**
```promql
histogram_quantile(0.99, http_request_duration_seconds_bucket)
```

**Panel 4: Database Connections**
```promql
mysql_global_status_threads_connected
```

**Panel 5: Memory Usage**
```promql
container_memory_usage_bytes / 1024 / 1024 / 1024
```

## 8. Alerting Workflow

### Alert > Notification > Action

1. **Alert Fires** (Rule condition met):
   ```
   HighErrorRate: error_rate > 5% for 5 min
   ```

2. **Send Notification** (via Slack, email, PagerDuty):
   ```
   @channel Alert: HighErrorRate detected in ghana-news-api
   Error rate: 8.5%, threshold: 5%
   ```

3. **Investigate**:
   ```bash
   # Check service logs
   docker logs ghana-news-api
   
   # Query metrics
   curl 'http://localhost:9090/api/v1/query?query=...'
   
   # Check database
   mysql -u appuser -p ghana_news -e "SHOW PROCESSLIST;"
   ```

4. **Remediate**:
   ```bash
   # Restart service
   docker-compose restart ghana-news-api
   
   # Scale up
   docker-compose up -d --scale ghana-news-api=3
   ```

## 9. Troubleshooting

### Prometheus not scraping metrics

```bash
# Check targets
curl http://localhost:9090/api/v1/targets

# Verify service endpoint
curl http://localhost:4000/metrics

# Check Prometheus logs
docker logs aucdt-prometheus
```

### Elasticsearch not receiving logs

```bash
# Check Elasticsearch health
curl http://localhost:9200/_cluster/health

# View indices
curl http://localhost:9200/_cat/indices

# Test data insertion
curl -X POST http://localhost:9200/test/_doc \
  -H 'Content-Type: application/json' \
  -d '{"timestamp":"2025-02-24T12:00:00Z","message":"test"}'
```

### Alert not firing

```bash
# Check alert rules loaded
curl http://localhost:9090/api/v1/rules | jq '.data.groups'

# Manually evaluate rule
curl 'http://localhost:9090/api/v1/query?query=<rule_expression>'

# Check alert manager config
curl http://localhost:9093/api/v1/status
```

## 10. Best Practices

✅ **DO**:
- Set retention policy (30 days default in config)
- Rotate logs regularly (10M per file, 3 files default)
- Monitor monitoring services (Prometheus, Elasticsearch)
- Use structured logging (JSON format)
- Set meaningful alert thresholds
- Document custom metrics
- Back up Prometheus data regularly

❌ **DON'T**:
- Expose metrics endpoints publicly (restrict to internal IPs)
- Set alerting thresholds too high (miss problems)
- Store unlimited log history (expensive storage)
- Ignore alerts (respond within SLA)
- Log sensitive data (PII, credentials)

## 11. Production Checklist

- [ ] Prometheus retention set to 30+ days
- [ ] Alert rules defined and tested
- [ ] Elasticsearch backup configured
- [ ] Metrics exported by all services
- [ ] Nginx metrics enabled
- [ ] Database metrics active
- [ ] Log rotation enabled
- [ ] Kibana dashboards created
- [ ] Slack/email notifications working
- [ ] On-call schedule configured

## 12. References

- [Prometheus Documentation](https://prometheus.io/docs/)
- [PromQL Queries](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
- [Kibana](https://www.elastic.co/guide/en/kibana/current/index.html)
- [prom-client (Node.js)](https://github.com/siimon/prom-client)
- [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)

---

**Created**: February 2025  
**For**: AUCDT Utilities 12-service architecture  
**Status**: Production-ready
