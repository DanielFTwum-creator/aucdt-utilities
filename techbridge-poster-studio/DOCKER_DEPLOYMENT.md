# Docker Deployment Guide - TechBridge Poster Studio

## Quick Start (Local Testing)

```bash
# Build the image
docker build -t techbridge-poster-studio .

# Run the container
docker run -d \
  --name poster-studio \
  -p 3000:3000 \
  -v poster_outputs:/app/outputs \
  techbridge-poster-studio

# Access at http://localhost:3000/poster/
```

## Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# Access at http://localhost/poster/
# API at http://localhost/api/

# View logs
docker-compose logs -f poster-studio

# Stop
docker-compose down
```

## Production Deployment (Ubuntu Server)

### 1. Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Deploy Application

```bash
# Create app directory
sudo mkdir -p /var/app/poster-studio
cd /var/app/poster-studio

# Copy files from your machine
scp -r techbridge-poster-studio/* user@server:/var/app/poster-studio/

# Fix permissions
sudo chown -R $USER:$USER /var/app/poster-studio
```

### 3. Start Services

```bash
cd /var/app/poster-studio

# Build and run
docker-compose up -d

# Verify services
docker-compose ps
docker-compose logs -f
```

### 4. Setup SystemD Auto-Start

```bash
# Create systemd service
sudo tee /etc/systemd/system/poster-studio.service > /dev/null <<'SYSTEMD'
[Unit]
Description=TechBridge Poster Studio Docker
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
User=$USER
WorkingDirectory=/var/app/poster-studio
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
RemainAfterExit=true

[Install]
WantedBy=multi-user.target
SYSTEMD

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable poster-studio
sudo systemctl start poster-studio
```

### 5. Access Application

```
http://your-server/poster/          # Main app
http://your-server/api/generate     # PDF/PNG API
```

## Environment Variables

```bash
# Optional: Set environment variables
export GEMINI_API_KEY=your-key-here

docker-compose up -d
```

## Monitoring

```bash
# View container logs
docker-compose logs -f poster-studio

# Check container status
docker-compose ps

# Inspect container
docker inspect poster-studio

# Resource usage
docker stats poster-studio
```

## Backup & Data Persistence

```bash
# Backup outputs volume
docker run --rm -v poster_outputs:/data -v $(pwd):/backup \
  alpine tar czf /backup/poster_outputs.tar.gz -C /data .

# Restore
docker run --rm -v poster_outputs:/data -v $(pwd):/backup \
  alpine tar xzf /backup/poster_outputs.tar.gz -C /data
```

## Troubleshooting

### Container won't start
```bash
docker-compose logs poster-studio
docker-compose ps
```

### Port already in use
```bash
# Change port in docker-compose.yml
# ports:
#   - "8000:3000"  # Use 8000 instead
docker-compose up -d
```

### PDF export fails
```bash
# Ensure Playwright dependencies are installed in image
docker exec poster-studio npm list playwright
```

### High memory usage
```bash
# Limit memory in docker-compose.yml
# services:
#   poster-studio:
#     deploy:
#       resources:
#         limits:
#           memory: 2G
```

## Updating

```bash
cd /var/app/poster-studio

# Pull latest code
git pull  # or re-upload

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## Production Checklist

- [ ] Docker and Docker Compose installed
- [ ] Application deployed to `/var/app/poster-studio`
- [ ] `docker-compose up -d` confirms all services running
- [ ] Access http://your-server/poster/ works
- [ ] PDF/PNG export working via API
- [ ] Systemd service enabled for auto-start
- [ ] Logs monitored and clean
- [ ] Backups configured for outputs volume

## Quick Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f poster-studio

# SSH into container
docker exec -it poster-studio /bin/bash

# Rebuild image
docker-compose build --no-cache

# Clean up unused images/volumes
docker image prune -a
docker volume prune
```
