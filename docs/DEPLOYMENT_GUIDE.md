# ThesisAI Deployment Guide

**Version:** 1.0.0
**Last Updated:** November 24, 2025
**Target Environment:** Production

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Server Setup](#server-setup)
4. [Docker Installation](#docker-installation)
5. [Database Setup](#database-setup)
6. [Application Deployment](#application-deployment)
7. [SSL/TLS Configuration](#ssltls-configuration)
8. [Domain and DNS Configuration](#domain-and-dns-configuration)
9. [Post-Deployment Verification](#post-deployment-verification)
10. [Monitoring Setup](#monitoring-setup)
11. [Backup Configuration](#backup-configuration)
12. [Rollback Procedures](#rollback-procedures)
13. [Scaling Considerations](#scaling-considerations)
14. [Troubleshooting Deployment](#troubleshooting-deployment)

---

## 1. Overview

### Deployment Architecture

ThesisAI uses a containerized microservices architecture:

- **Frontend:** React SPA served by Nginx in Docker container
- **Backend:** REST API server in Docker container
- **Database:** PostgreSQL/MySQL in Docker container
- **Reverse Proxy:** Nginx as SSL termination and load balancer
- **Orchestration:** Docker Compose for container management

### Deployment Options

1. **Single Server Deployment** (Recommended for up to 500 users)
2. **Multi-Server Deployment** (For 500+ users, high availability)
3. **Cloud Deployment** (AWS, Azure, GCP)

This guide covers **Single Server Deployment** for production use.

---

## 2. Pre-Deployment Checklist

### Hardware Requirements

- [ ] Server with Ubuntu 20.04/22.04 LTS or CentOS 8+
- [ ] Minimum 4 CPU cores (8 recommended)
- [ ] Minimum 8GB RAM (16GB recommended)
- [ ] Minimum 100GB SSD storage (500GB recommended)
- [ ] Public static IP address
- [ ] Network connectivity with 1Gbps bandwidth

### Software Requirements

- [ ] Root or sudo access
- [ ] Domain name registered
- [ ] DNS access for domain configuration
- [ ] Email account for notifications (SMTP access)
- [ ] SSL certificate or ability to use Let's Encrypt

### Accounts and Credentials

- [ ] Server SSH key pair generated
- [ ] Database passwords prepared (strong, 20+ characters)
- [ ] JWT secret key generated (64+ characters)
- [ ] Email SMTP credentials
- [ ] Cloud storage credentials (optional, for file storage)

### Security Requirements

- [ ] Firewall rules planned
- [ ] SSH key-based authentication configured
- [ ] Password policy defined
- [ ] Backup strategy planned
- [ ] Disaster recovery plan documented

---

## 3. Server Setup

### 3.1 Initial Server Configuration

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    net-tools \
    ufw \
    fail2ban \
    unzip \
    ca-certificates \
    gnupg \
    lsb-release

# Set timezone
sudo timedatectl set-timezone Africa/Accra

# Verify timezone
timedatectl
```

### 3.2 Create Application User

```bash
# Create dedicated user for ThesisAI
sudo useradd -m -s /bin/bash thesisai
sudo usermod -aG docker thesisai
sudo usermod -aG sudo thesisai

# Set password
sudo passwd thesisai

# Create directory structure
sudo mkdir -p /opt/thesisai
sudo mkdir -p /var/log/thesisai
sudo mkdir -p /backup/thesisai
sudo chown -R thesisai:thesisai /opt/thesisai
sudo chown -R thesisai:thesisai /var/log/thesisai
sudo chown -R thesisai:thesisai /backup/thesisai
```

### 3.3 Configure SSH Security

```bash
# Edit SSH configuration
sudo vim /etc/ssh/sshd_config

# Recommended settings:
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes
# Port 2222  # Change from default 22

# Restart SSH service
sudo systemctl restart sshd
```

### 3.4 Configure Firewall

```bash
# Enable UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (adjust port if changed)
sudo ufw allow 2222/tcp comment 'SSH'

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

### 3.5 Configure Fail2Ban

```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Create local configuration
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Edit configuration
sudo vim /etc/fail2ban/jail.local

# Add/modify these settings:
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = 2222
logpath = /var/log/auth.log

# Start Fail2Ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check status
sudo fail2ban-client status
```

---

## 4. Docker Installation

### 4.1 Install Docker Engine

```bash
# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
docker --version
docker compose version

# Start and enable Docker
sudo systemctl enable docker
sudo systemctl start docker

# Test Docker installation
sudo docker run hello-world
```

### 4.2 Configure Docker

```bash
# Create Docker daemon configuration
sudo mkdir -p /etc/docker

sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "dns": ["8.8.8.8", "8.8.4.4"]
}
EOF

# Restart Docker
sudo systemctl restart docker

# Verify configuration
sudo docker info | grep -A 10 "Log"
```

### 4.3 Add User to Docker Group

```bash
# Add current user to docker group
sudo usermod -aG docker $USER

# Add thesisai user to docker group
sudo usermod -aG docker thesisai

# Apply group changes (logout and login, or run)
newgrp docker

# Test non-root Docker access
docker ps
```

---

## 5. Database Setup

### 5.1 Choose Database Engine

ThesisAI supports PostgreSQL (recommended) or MySQL.

#### Option A: PostgreSQL (Recommended)

```bash
# Create database directory
sudo mkdir -p /opt/thesisai/database/postgres
sudo chown -R thesisai:thesisai /opt/thesisai/database

# Pull PostgreSQL image
docker pull postgres:14-alpine

# Generate strong database password
DB_PASSWORD=$(openssl rand -base64 32)
echo "Database Password: $DB_PASSWORD"
# SAVE THIS PASSWORD SECURELY

# Run PostgreSQL container
docker run -d \
    --name thesisai-postgres \
    --restart unless-stopped \
    -e POSTGRES_DB=thesisai_db \
    -e POSTGRES_USER=thesisai_user \
    -e POSTGRES_PASSWORD="$DB_PASSWORD" \
    -e TZ=Africa/Accra \
    -v /opt/thesisai/database/postgres:/var/lib/postgresql/data \
    -p 5432:5432 \
    postgres:14-alpine

# Verify database is running
docker ps | grep postgres
docker logs thesisai-postgres
```

#### Option B: MySQL

```bash
# Create database directory
sudo mkdir -p /opt/thesisai/database/mysql
sudo chown -R thesisai:thesisai /opt/thesisai/database

# Pull MySQL image
docker pull mysql:8.0

# Generate strong database password
DB_PASSWORD=$(openssl rand -base64 32)
echo "Database Password: $DB_PASSWORD"

# Run MySQL container
docker run -d \
    --name thesisai-mysql \
    --restart unless-stopped \
    -e MYSQL_DATABASE=thesisai_db \
    -e MYSQL_USER=thesisai_user \
    -e MYSQL_PASSWORD="$DB_PASSWORD" \
    -e MYSQL_ROOT_PASSWORD="$(openssl rand -base64 32)" \
    -e TZ=Africa/Accra \
    -v /opt/thesisai/database/mysql:/var/lib/mysql \
    -p 3306:3306 \
    mysql:8.0

# Verify database is running
docker ps | grep mysql
docker logs thesisai-mysql
```

### 5.2 Initialize Database Schema

```bash
# Download schema file (or create from database-architecture.svg)
cd /opt/thesisai

# Create schema.sql file
cat > schema.sql <<'EOF'
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
    department VARCHAR(100),
    student_id VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_student_id ON users(student_id);

-- Theses table
CREATE TABLE theses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    abstract TEXT,
    field_of_study VARCHAR(100),
    degree_level VARCHAR(20) CHECK (degree_level IN ('bachelor', 'master', 'phd')),
    file_path VARCHAR(500),
    file_size BIGINT,
    file_hash VARCHAR(64),
    status VARCHAR(20) CHECK (status IN ('uploaded', 'processing', 'completed')),
    word_count INTEGER,
    submission_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_theses_user_id ON theses(user_id);
CREATE INDEX idx_theses_status ON theses(status);

-- Assessments table
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    assessor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    overall_score DECIMAL(5,2) CHECK (overall_score >= 0 AND overall_score <= 100),
    content_quality DECIMAL(5,2),
    structure_score DECIMAL(5,2),
    methodology_score DECIMAL(5,2),
    originality_score DECIMAL(5,2),
    plagiarism_score DECIMAL(5,2),
    assessment_type VARCHAR(20) CHECK (assessment_type IN ('ai', 'manual', 'hybrid')),
    status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_assessments_thesis_id ON assessments(thesis_id);
CREATE INDEX idx_assessments_assessor_id ON assessments(assessor_id);
CREATE INDEX idx_assessments_status ON assessments(status);

-- Feedback table
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    category VARCHAR(100),
    feedback_text TEXT,
    severity VARCHAR(20) CHECK (severity IN ('critical', 'major', 'minor', 'info')),
    page_number INTEGER,
    line_number INTEGER,
    suggestion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedback_assessment_id ON feedback(assessment_id);

-- Citations table
CREATE TABLE citations (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    citation_text TEXT,
    citation_type VARCHAR(50),
    page_number INTEGER,
    is_valid BOOLEAN DEFAULT true,
    validation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_citations_thesis_id ON citations(thesis_id);

-- Activity logs table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- System settings table
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    data_type VARCHAR(50),
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type VARCHAR(20) CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
EOF

# Apply schema to database (PostgreSQL)
docker exec -i thesisai-postgres psql -U thesisai_user -d thesisai_db < schema.sql

# Verify tables created
docker exec -it thesisai-postgres psql -U thesisai_user -d thesisai_db -c "\dt"
```

### 5.3 Create Initial Admin User

```bash
# Generate admin password hash
ADMIN_PASSWORD="ChangeThisSecurePassword123!"
ADMIN_HASH=$(docker run --rm -it python:3.9-alpine python3 -c \
    "import bcrypt; print(bcrypt.hashpw(b'$ADMIN_PASSWORD', bcrypt.gensalt()).decode())" | tr -d '\r')

echo "Admin Password: $ADMIN_PASSWORD"
echo "SAVE THIS PASSWORD SECURELY"

# Insert admin user
docker exec -i thesisai-postgres psql -U thesisai_user -d thesisai_db <<EOF
INSERT INTO users (email, password_hash, first_name, last_name, role, department, is_active, created_at, updated_at)
VALUES ('admin@aucdt.edu.gh', '$ADMIN_HASH', 'System', 'Administrator', 'admin', 'IT Department', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
EOF

# Verify admin user created
docker exec -it thesisai-postgres psql -U thesisai_user -d thesisai_db -c \
    "SELECT id, email, role FROM users WHERE role='admin';"
```

---

## 6. Application Deployment

### 6.1 Clone Repository

```bash
# Switch to thesisai user
su - thesisai

# Clone repository
cd /opt/thesisai
git clone https://github.com/DanielFTwum-creator/aucdt-utilities.git frontend
cd frontend

# Verify files
ls -la
```

### 6.2 Build Frontend Docker Image

```bash
cd /opt/thesisai/frontend

# Build Docker image
docker build -t thesisai-frontend:1.0.0 .
docker tag thesisai-frontend:1.0.0 thesisai-frontend:latest

# Verify image built
docker images | grep thesisai-frontend
```

### 6.3 Create Environment Configuration

```bash
# Create .env file
cd /opt/thesisai

cat > .env <<EOF
# Application Settings
NODE_ENV=production
APP_NAME=ThesisAI
APP_URL=https://thesisai.aucdt.edu.gh

# Frontend Settings
VITE_API_URL=https://thesisai.aucdt.edu.gh/api
VITE_APP_VERSION=1.0.0

# Backend API Settings
API_PORT=8080
API_HOST=0.0.0.0
API_BASE_PATH=/api

# Database Configuration
DB_TYPE=postgresql
DB_HOST=thesisai-postgres
DB_PORT=5432
DB_NAME=thesisai_db
DB_USER=thesisai_user
DB_PASSWORD=$DB_PASSWORD
DB_SSL=false
DB_POOL_MIN=2
DB_POOL_MAX=10

# JWT Authentication
JWT_SECRET=$(openssl rand -base64 64)
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# File Storage
STORAGE_TYPE=local
STORAGE_PATH=/app/uploads
MAX_FILE_SIZE=52428800

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=noreply@aucdt.edu.gh
SMTP_PASSWORD=YourEmailPasswordHere
EMAIL_FROM=ThesisAI <noreply@aucdt.edu.gh>

# Security
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW=15m
CORS_ORIGIN=https://thesisai.aucdt.edu.gh
SESSION_TIMEOUT=1800

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/thesisai/app.log
EOF

# Secure .env file
chmod 600 .env
```

### 6.4 Create Docker Compose Configuration

```bash
cd /opt/thesisai

cat > docker-compose.yml <<'EOF'
version: '3.8'

services:
  frontend:
    image: thesisai-frontend:latest
    container_name: thesisai-frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./logs/nginx:/var/log/nginx
    environment:
      - TZ=Africa/Accra
    networks:
      - thesisai-network
    restart: unless-stopped
    depends_on:
      - database

  database:
    image: postgres:14-alpine
    container_name: thesisai-postgres
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./backups:/backups
    env_file:
      - .env
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - TZ=Africa/Accra
    networks:
      - thesisai-network
    restart: unless-stopped

networks:
  thesisai-network:
    driver: bridge

volumes:
  postgres-data:
    driver: local
EOF

# Create log directories
mkdir -p logs/nginx
```

### 6.5 Deploy Application

```bash
cd /opt/thesisai

# Start services
docker compose up -d

# Check service status
docker compose ps

# View logs
docker compose logs -f

# Wait for services to be ready (30 seconds)
sleep 30

# Verify frontend is running
curl http://localhost/

# Check all containers are healthy
docker ps
```

---

## 7. SSL/TLS Configuration

### 7.1 Install Certbot

```bash
# Switch to root or sudo user
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Obtain SSL Certificate

```bash
# Stop Docker containers temporarily
cd /opt/thesisai
docker compose down

# Obtain certificate
sudo certbot certonly --standalone \
    -d thesisai.aucdt.edu.gh \
    --non-interactive \
    --agree-tos \
    -m admin@aucdt.edu.gh

# Verify certificate files
sudo ls -la /etc/letsencrypt/live/thesisai.aucdt.edu.gh/

# Create SSL directory
sudo mkdir -p /opt/thesisai/ssl
sudo cp /etc/letsencrypt/live/thesisai.aucdt.edu.gh/fullchain.pem /opt/thesisai/ssl/
sudo cp /etc/letsencrypt/live/thesisai.aucdt.edu.gh/privkey.pem /opt/thesisai/ssl/
sudo chown -R thesisai:thesisai /opt/thesisai/ssl
```

### 7.3 Configure Nginx for HTTPS

```bash
cd /opt/thesisai/frontend

# Backup original nginx config
cp nginx.conf nginx.conf.bak

# Create SSL-enabled nginx config
cat > nginx.conf <<'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name thesisai.aucdt.edu.gh;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name thesisai.aucdt.edu.gh;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    root /usr/share/nginx/html;
    index index.html;

    client_max_body_size 50M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

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

    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }

    access_log /var/log/nginx/thesisai_access.log;
    error_log /var/log/nginx/thesisai_error.log;
}
EOF

# Rebuild Docker image with new config
docker build -t thesisai-frontend:latest .
```

### 7.4 Update Docker Compose for SSL

```bash
cd /opt/thesisai

# Update docker-compose.yml to mount SSL certificates
cat >> docker-compose.yml.tmp <<'EOF'
version: '3.8'

services:
  frontend:
    image: thesisai-frontend:latest
    container_name: thesisai-frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./logs/nginx:/var/log/nginx
      - ./ssl:/etc/nginx/ssl:ro
    environment:
      - TZ=Africa/Accra
    networks:
      - thesisai-network
    restart: unless-stopped
    depends_on:
      - database

  database:
    image: postgres:14-alpine
    container_name: thesisai-postgres
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./backups:/backups
    env_file:
      - .env
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - TZ=Africa/Accra
    networks:
      - thesisai-network
    restart: unless-stopped

networks:
  thesisai-network:
    driver: bridge

volumes:
  postgres-data:
    driver: local
EOF

mv docker-compose.yml.tmp docker-compose.yml

# Restart services with SSL
docker compose down
docker compose up -d

# Verify HTTPS is working
curl -I https://thesisai.aucdt.edu.gh/
```

### 7.5 Setup Auto-Renewal

```bash
# Create renewal script
sudo cat > /usr/local/bin/renew-thesisai-ssl.sh <<'EOF'
#!/bin/bash
certbot renew --quiet --post-hook "
    cp /etc/letsencrypt/live/thesisai.aucdt.edu.gh/fullchain.pem /opt/thesisai/ssl/ && \
    cp /etc/letsencrypt/live/thesisai.aucdt.edu.gh/privkey.pem /opt/thesisai/ssl/ && \
    chown -R thesisai:thesisai /opt/thesisai/ssl && \
    cd /opt/thesisai && docker compose restart frontend
"
EOF

sudo chmod +x /usr/local/bin/renew-thesisai-ssl.sh

# Add to crontab (check daily at 3 AM)
sudo crontab -e
# Add: 0 3 * * * /usr/local/bin/renew-thesisai-ssl.sh >> /var/log/thesisai/ssl-renewal.log 2>&1
```

---

## 8. Domain and DNS Configuration

### 8.1 DNS Records

Configure the following DNS records with your domain registrar:

```
Type    Name                        Value                       TTL
A       thesisai.aucdt.edu.gh      YOUR_SERVER_PUBLIC_IP       3600
AAAA    thesisai.aucdt.edu.gh      YOUR_SERVER_IPV6 (optional) 3600
CNAME   www.thesisai.aucdt.edu.gh  thesisai.aucdt.edu.gh       3600
```

### 8.2 Verify DNS Propagation

```bash
# Check A record
dig thesisai.aucdt.edu.gh A +short

# Check from multiple locations
nslookup thesisai.aucdt.edu.gh 8.8.8.8

# Online tools
# https://dnschecker.org
# https://www.whatsmydns.net
```

---

## 9. Post-Deployment Verification

### 9.1 Service Health Checks

```bash
# Check all containers are running
docker ps

# Expected output: All containers should show "Up" status
# thesisai-frontend
# thesisai-postgres

# Check frontend health
curl -f http://localhost/health
curl -f https://thesisai.aucdt.edu.gh/health

# Check database connection
docker exec thesisai-postgres pg_isready -U thesisai_user

# View application logs
docker compose logs -f --tail=50
```

### 9.2 Functionality Testing

```bash
# Test homepage loads
curl -I https://thesisai.aucdt.edu.gh/

# Expected: HTTP 200 OK

# Test API endpoint (if backend deployed)
curl https://thesisai.aucdt.edu.gh/api/health

# Test file upload size limit
curl -F "file=@large-file.pdf" https://thesisai.aucdt.edu.gh/api/upload
```

### 9.3 Performance Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils -y

# Basic load test (100 requests, 10 concurrent)
ab -n 100 -c 10 https://thesisai.aucdt.edu.gh/

# Monitor response times
ab -n 1000 -c 50 -g performance.dat https://thesisai.aucdt.edu.gh/
```

### 9.4 Security Verification

```bash
# Test SSL certificate
openssl s_client -connect thesisai.aucdt.edu.gh:443 -servername thesisai.aucdt.edu.gh

# Online SSL test
# https://www.ssllabs.com/ssltest/

# Test security headers
curl -I https://thesisai.aucdt.edu.gh/ | grep -E "(Strict-Transport|X-Frame|X-Content)"

# Scan for vulnerabilities
sudo apt install nikto -y
nikto -h https://thesisai.aucdt.edu.gh
```

---

## 10. Monitoring Setup

### 10.1 Log Monitoring

```bash
# Real-time log monitoring
docker compose logs -f

# Filter specific service
docker compose logs -f frontend

# Search logs
docker compose logs | grep ERROR
```

### 10.2 Resource Monitoring

```bash
# Monitor container resources
docker stats

# Create monitoring script
cat > /usr/local/bin/thesisai-monitor.sh <<'EOF'
#!/bin/bash
echo "=== ThesisAI System Monitor ==="
echo "Date: $(date)"
echo ""
echo "--- Docker Containers ---"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "--- Container Resources ---"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
echo ""
echo "--- Disk Usage ---"
df -h / | tail -1
echo ""
echo "--- Database Size ---"
docker exec thesisai-postgres psql -U thesisai_user -d thesisai_db -c "
SELECT pg_size_pretty(pg_database_size('thesisai_db'));"
EOF

chmod +x /usr/local/bin/thesisai-monitor.sh

# Run monitoring
/usr/local/bin/thesisai-monitor.sh
```

### 10.3 Automated Alerts

```bash
# Create alert script
cat > /usr/local/bin/thesisai-alerts.sh <<'EOF'
#!/bin/bash
ALERT_EMAIL="admin@aucdt.edu.gh"

# Check if frontend is down
if ! curl -f http://localhost/health > /dev/null 2>&1; then
    echo "ThesisAI Frontend is DOWN!" | mail -s "ALERT: ThesisAI Frontend Down" $ALERT_EMAIL
fi

# Check database
if ! docker exec thesisai-postgres pg_isready -U thesisai_user > /dev/null 2>&1; then
    echo "ThesisAI Database is DOWN!" | mail -s "ALERT: ThesisAI Database Down" $ALERT_EMAIL
fi

# Check disk space (alert if >80%)
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Disk usage is at ${DISK_USAGE}%" | mail -s "ALERT: ThesisAI High Disk Usage" $ALERT_EMAIL
fi
EOF

chmod +x /usr/local/bin/thesisai-alerts.sh

# Schedule alerts (every 5 minutes)
crontab -e
# Add: */5 * * * * /usr/local/bin/thesisai-alerts.sh
```

---

## 11. Backup Configuration

### 11.1 Automated Backup Script

Already covered in Administrator Guide. Ensure backup script is running:

```bash
# Verify backup script exists
ls -la /usr/local/bin/thesisai-backup

# Test backup manually
sudo /usr/local/bin/thesisai-backup

# Verify backup files
ls -lh /backup/thesisai/

# Check backup cron job
crontab -l | grep backup
```

---

## 12. Rollback Procedures

### 12.1 Application Rollback

```bash
# Stop current version
cd /opt/thesisai
docker compose down

# Restore previous Docker image
docker tag thesisai-frontend:1.0.0 thesisai-frontend:latest

# Or rebuild from previous commit
cd frontend
git checkout <previous-commit-hash>
docker build -t thesisai-frontend:latest .

# Restart services
docker compose up -d

# Verify rollback
curl -I https://thesisai.aucdt.edu.gh/
```

### 12.2 Database Rollback

```bash
# Stop backend
docker compose down

# Restore database from backup
gunzip -c /backup/thesisai/db_backup_YYYYMMDD_HHMMSS.dump.gz | \
    docker exec -i thesisai-postgres pg_restore -U thesisai_user -d thesisai_db --clean

# Restart services
docker compose up -d
```

---

## 13. Scaling Considerations

### 13.1 Vertical Scaling

- Increase server resources (CPU, RAM, disk)
- Adjust Docker resource limits in docker-compose.yml
- Optimize database connection pooling

### 13.2 Horizontal Scaling

For production deployments with 500+ users:

- Deploy multiple frontend containers behind load balancer
- Separate database to dedicated server
- Implement Redis for session management
- Use cloud storage (S3) for file uploads
- Setup database replication (master-slave)

---

## 14. Troubleshooting Deployment

### Common Issues

#### Port Already in Use

```bash
# Check what's using port 80
sudo lsof -i :80
sudo netstat -tulpn | grep :80

# Stop conflicting service
sudo systemctl stop apache2
sudo systemctl stop nginx
```

#### Docker Permission Denied

```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### Database Connection Failed

```bash
# Check database is running
docker ps | grep postgres

# Check database logs
docker logs thesisai-postgres

# Test connection
docker exec -it thesisai-postgres psql -U thesisai_user -d thesisai_db
```

#### SSL Certificate Issues

```bash
# Renew certificate manually
sudo certbot renew --force-renewal

# Check certificate expiry
sudo certbot certificates
```

---

## Deployment Checklist

- [ ] Server provisioned and configured
- [ ] Docker and Docker Compose installed
- [ ] Database initialized with schema
- [ ] Admin user created
- [ ] Frontend Docker image built
- [ ] Environment variables configured
- [ ] Docker Compose services started
- [ ] SSL certificate obtained and configured
- [ ] DNS records configured
- [ ] Health checks passing
- [ ] Backups configured and tested
- [ ] Monitoring setup
- [ ] Firewall rules configured
- [ ] Documentation reviewed
- [ ] Team trained on operations

---

## Support

**AUCDT IT Department**
Email: itsupport@aucdt.edu.gh
Phone: +233 XXX XXX XXX

**Emergency Escalation**
After Hours: +233 XXX XXX XXX (24/7)

---

*Document Version: 1.0.0*
*Last Updated: November 24, 2025*
*Next Review: February 24, 2026*
