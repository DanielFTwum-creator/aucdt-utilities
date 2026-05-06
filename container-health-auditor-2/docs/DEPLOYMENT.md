# Deployment Guide - Container Health Auditor (App ID 110)

## 1. Prerequisites
- Kubernetes Cluster (v1.27+)
- Helm (v3.0+)
- Docker (v24.0+)
- Access to `infrastructure` namespace

## 2. Build & Push
```bash
# Build the Docker image
docker build -t cha:1.0.0 .

# Push to registry (replace with your registry)
docker push registry.example.com/cha:1.0.0
```

## 3. Deployment Configuration
Create a `values.yaml` file for Helm:

```yaml
replicaCount: 3
image:
  repository: registry.example.com/cha
  tag: "1.0.0"
resources:
  limits:
    cpu: 1000m
    memory: 2Gi
  requests:
    cpu: 500m
    memory: 1Gi
env:
  SENTINEL_API_URL: "http://sentinel-service:8080"
  PROMETHEUS_URL: "http://prometheus-service:9090"
```

## 4. Deploy to Kubernetes
```bash
helm install cha ./charts/cha -f values.yaml -n infrastructure
```

## 5. Verification
1. Check Pod status:
   ```bash
   kubectl get pods -n infrastructure -l app=cha
   ```
2. Verify Health Endpoint:
   ```bash
   kubectl port-forward svc/cha 8000:8000 -n infrastructure
   curl http://localhost:8000/health
   ```

## 6. Rollback Procedure
If issues arise, rollback to the previous revision:
```bash
helm rollback cha 0 -n infrastructure
```
