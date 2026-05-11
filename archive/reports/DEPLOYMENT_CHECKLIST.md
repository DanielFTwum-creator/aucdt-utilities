# AUCDT Docker Deployment Checklist

## Pre-Deployment

### Environment Setup
- [ ] Docker Desktop installed (Windows/macOS)
- [ ] Docker Engine installed (Linux)
- [ ] Docker Compose v2.0+ installed (`docker compose --version`)
- [ ] Minimum 4 GB RAM available (8 GB+ recommended)
- [ ] At least 50 GB free disk space
- [ ] PowerShell v5.0+ or Bash shell available

### Project Setup
- [ ] All 83 app directories present with package.json
- [ ] Dockerfile.vite exists in root directory
- [ ] Dockerfile.dev exists in root directory (for development)
- [ ] docker/ directory contains nginx configuration
- [ ] No uncommitted changes in git

### Configuration Review
- [ ] Review generated docker-compose-all-apps.yml
- [ ] Verify app categories (core/standard/experimental)
- [ ] Check port assignments (8080 for gateway)
- [ ] Confirm network settings (172.20.0.0/16)
- [ ] Review environment variables (NODE_ENV=production)

## Building Phase

### Core Apps Build (6 apps)
- [ ] Run: `.\build-all-apps.ps1` (Windows) or `bash ./build-all-apps.sh` (Linux)
- [ ] Monitor build progress in console
- [ ] Check build-logs/ for any failures
- [ ] Verify all 6 core apps built successfully:
  - [ ] analytics-refactor
  - [ ] fees-comparison-dashboard
  - [ ] aucdt-analytics-dashboard
  - [ ] kanban-app
  - [ ] aucdt-website-react
  - [ ] techbridge-product-design-6r-design-portal

### Extended Build (66 additional apps)
- [ ] Run: `.\build-all-apps.ps1 -Profile standard`
- [ ] Monitor for failures (expected: minimal failures)
- [ ] Document any problematic apps
- [ ] Fix critical issues before continuing

### Full Build (83 apps)
- [ ] Run: `.\build-all-apps.ps1 -Profile all`
- [ ] Allow 60-90 minutes for completion
- [ ] Monitor system resources (RAM, CPU, disk)
- [ ] Review final summary report

## Deployment Phase

### Docker Compose Startup
- [ ] Generate fresh compose file: `.\generate-docker-compose-all.ps1`
- [ ] Review output for accuracy
- [ ] Choose deployment profile:
  - [ ] **Production**: `docker compose -f docker-compose-all-apps.yml up -d`
  - [ ] **Staging**: `docker compose -f docker-compose-all-apps.yml --profile standard up -d`
  - [ ] **Development**: `docker compose -f docker-compose-all-apps.yml --profile '*' up`

### Service Verification
- [ ] Check service status: `docker compose -f docker-compose-all-apps.yml ps`
- [ ] Verify all expected services are running
- [ ] Check for services in unhealthy state:
  - [ ] `docker compose -f docker-compose-all-apps.yml ps | grep -i unhealthy`
  - [ ] If found, check logs: `docker compose -f docker-compose-all-apps.yml logs <service>`

### Network Verification
- [ ] Verify network created: `docker network ls | grep aucdt-network`
- [ ] Check network connectivity: `docker network inspect aucdt-network`
- [ ] Test service-to-service communication:
  - [ ] `docker compose -f docker-compose-all-apps.yml exec nginx-gateway ping kanban-app`
  - [ ] Check /health endpoint responses

### Gateway Testing
- [ ] Test gateway is running: `curl http://localhost:8080/health`
- [ ] Expected response: "gateway healthy"
- [ ] Check nginx config: `docker exec aucdt-gateway cat /etc/nginx/conf.d/default.conf`

## Post-Deployment Validation

### Core Apps Access
- [ ] Analytics Refactor: `http://localhost:8080/analytics-refactor/`
- [ ] Kanban App: `http://localhost:8080/kanban-app/`
- [ ] AUCDT Analytics Dashboard: `http://localhost:8080/aucdt-analytics-dashboard/`
- [ ] Fees Dashboard: `http://localhost:8080/fees-comparison-dashboard/`
- [ ] AUCDT Website: `http://localhost:8080/aucdt-website-react/`
- [ ] Product Design Portal: `http://localhost:8080/techbridge-product-design-6r-design-portal/`

### Health Checks
- [ ] All services showing healthy status
- [ ] No services in "exited" state
- [ ] No services restarting repeatedly
- [ ] Check detailed health: `docker ps --format "table {{.Names}}\t{{.Status}}"`

### Resource Usage
- [ ] Check memory usage: `docker stats` (should be within limits)
- [ ] Monitor CPU: `docker stats` (should be < 50% at idle)
- [ ] Check disk usage: `docker system df`
- [ ] No obvious resource leaks

### Logging
- [ ] View all logs: `docker compose -f docker-compose-all-apps.yml logs --tail 100`
- [ ] Check for errors: `docker compose -f docker-compose-all-apps.yml logs 2>&1 | grep -i error`
- [ ] Verify no crash loops: `docker compose -f docker-compose-all-apps.yml ps | grep Restart`

### Network Connectivity
- [ ] Test DNS resolution: `docker compose -f docker-compose-all-apps.yml exec kanban-app ping nginx-gateway`
- [ ] Test cross-service communication (if applicable)
- [ ] Verify port mappings: `docker port <service>`

## Performance Baseline Establishment

### Metrics to Collect
- [ ] Average memory per service
- [ ] CPU utilization patterns
- [ ] Network I/O between services
- [ ] Startup time (time until all healthy)
- [ ] Response times for key endpoints

### Performance Benchmarks
- [ ] Core apps startup time: < 5 minutes target
- [ ] All 83 apps startup time: < 15 minutes target
- [ ] Memory usage stable after 5 minutes
- [ ] No memory leaks over 1-hour runtime
- [ ] CPU at idle: < 10%

## Troubleshooting Checklist

### If Service Fails to Start
- [ ] Check logs: `docker compose -f docker-compose-all-apps.yml logs <service>`
- [ ] Verify app directory exists
- [ ] Check package.json validity
- [ ] Review Dockerfile for app-specific requirements
- [ ] Test build locally: `docker compose -f docker-compose-all-apps.yml build <service>`

### If Services Can't Communicate
- [ ] Verify network exists: `docker network ls`
- [ ] Check network connectivity: `docker network inspect aucdt-network`
- [ ] Test from container: `docker compose -f docker-compose-all-apps.yml exec <service> ping <other-service>`
- [ ] Review firewall/networking rules

### If Out of Memory
- [ ] Check usage: `docker stats`
- [ ] Stop non-critical services: `docker compose -f docker-compose-all-apps.yml stop <service>`
- [ ] Remove stopped containers: `docker container prune`
- [ ] Increase system resources or reduce running services

### If Port Conflict
- [ ] Check port usage: `netstat -ano | findstr :8080` (Windows)
- [ ] Kill conflicting process or change port in compose file
- [ ] Rebuild: `docker compose -f docker-compose-all-apps.yml up -d`

## Documentation & Knowledge Transfer

### Documentation Review
- [ ] Read DOCKER_ECOSYSTEM_GUIDE.md
- [ ] Review DOCKER_QUICK_REFERENCE.md
- [ ] Understand deployment strategies
- [ ] Know troubleshooting procedures

### Team Training
- [ ] Brief team on basic commands
- [ ] Explain profile system
- [ ] Share common troubleshooting steps
- [ ] Distribute documentation links

### Knowledge Base
- [ ] Create runbook for daily operations
- [ ] Document custom configurations
- [ ] Record any deviations from standard setup
- [ ] Update documentation as needed

## Ongoing Operations

### Daily Checks
- [ ] Services running: `docker compose -f docker-compose-all-apps.yml ps`
- [ ] Check logs for errors: `docker compose -f docker-compose-all-apps.yml logs --tail 50`
- [ ] Monitor resource usage: `docker stats`
- [ ] Verify gateway responding: `curl http://localhost:8080/health`

### Weekly Maintenance
- [ ] Review build logs for failures
- [ ] Clean up unused images: `docker image prune -a`
- [ ] Remove unused volumes: `docker volume prune`
- [ ] Backup important data
- [ ] Update documentation

### Monthly Reviews
- [ ] Analyze performance metrics
- [ ] Plan capacity upgrades
- [ ] Review and update security settings
- [ ] Regenerate compose file if apps changed
- [ ] Update architecture documentation

## Scaling Strategy

### When to Scale
- [ ] Add more core apps → When production load increases
- [ ] Add standard apps → When feature requests increase
- [ ] Add experimental apps → For testing/development

### Scaling Steps
1. [ ] Update app categorization
2. [ ] Run generator: `.\generate-docker-compose-all.ps1`
3. [ ] Build new apps: `.\build-all-apps.ps1 -Profile standard`
4. [ ] Deploy: `docker compose -f docker-compose-all-apps.yml --profile standard up -d`
5. [ ] Verify all services healthy
6. [ ] Monitor resource usage
7. [ ] Adjust if needed

## Disaster Recovery

### Backup Strategy
- [ ] Document all custom configurations
- [ ] Keep compose file in version control
- [ ] Backup volume data if applicable
- [ ] Create recovery documentation

### Recovery Procedures
- [ ] Complete shutdown: `docker compose -f docker-compose-all-apps.yml --profile '*' down -v`
- [ ] Cleanup: `docker system prune -a`
- [ ] Regenerate: `.\generate-docker-compose-all.ps1`
- [ ] Rebuild: `.\build-all-apps.ps1 -Profile <desired>`
- [ ] Redeploy: `docker compose -f docker-compose-all-apps.yml up -d`

## Sign-Off

### Deployment Manager
- [ ] Name: ___________________
- [ ] Date: ___________________
- [ ] Status: ☐ APPROVED ☐ CONDITIONAL ☐ REJECTED
- [ ] Comments: _________________________________________________

### Technical Lead
- [ ] Name: ___________________
- [ ] Date: ___________________
- [ ] Status: ☐ APPROVED ☐ CONDITIONAL ☐ REJECTED
- [ ] Comments: _________________________________________________

### Operations Manager
- [ ] Name: ___________________
- [ ] Date: ___________________
- [ ] Status: ☐ APPROVED ☐ CONDITIONAL ☐ REJECTED
- [ ] Comments: _________________________________________________

## Rollback Plan

If deployment fails:
1. [ ] Stop all services: `docker compose -f docker-compose-all-apps.yml --profile '*' stop`
2. [ ] Revert to previous compose file (if available)
3. [ ] Rebuild from known good state
4. [ ] Test thoroughly before re-deployment
5. [ ] Document what went wrong
6. [ ] Plan corrective actions

---

**Deployment Date**: ___________________
**Status**: ☐ SUCCESSFUL ☐ FAILED ☐ PARTIAL
**Notes**: _________________________________________________________________

**Next Review Date**: ___________________
