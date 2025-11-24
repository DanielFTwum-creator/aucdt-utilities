# ThesisAI Administrator Guide

**Version:** 1.0.0
**Last Updated:** November 24, 2025
**Maintained By:** AUCDT IT Department

---

## Table of Contents

1. [Introduction](#introduction)
2. [System Overview](#system-overview)
3. [User Management](#user-management)
4. [System Configuration](#system-configuration)
5. [Database Administration](#database-administration)
6. [Monitoring and Logging](#monitoring-and-logging)
7. [Backup and Recovery](#backup-and-recovery)
8. [Security Management](#security-management)
9. [Performance Optimization](#performance-optimization)
10. [Troubleshooting](#troubleshooting)
11. [Maintenance Procedures](#maintenance-procedures)
12. [API Management](#api-management)

---

## 1. Introduction

### Purpose
This guide provides comprehensive instructions for administrators managing the ThesisAI platform at African University College of Digital Technologies (AUCDT).

### Target Audience
- System Administrators
- Database Administrators
- DevOps Engineers
- IT Support Staff

### Prerequisites
- Linux system administration experience
- Docker and containerization knowledge
- Database management experience (PostgreSQL/MySQL)
- Basic networking and security concepts
- Familiarity with Nginx web server

---

## 2. System Overview

### Architecture Components

#### Frontend Layer
- **Technology:** React 19 + TypeScript 5.9
- **Build Tool:** Vite 7.2
- **Web Server:** Nginx (Alpine)
- **Port:** 80/443 (HTTP/HTTPS)
- **Container:** Docker-based deployment

#### Backend Layer
- **API Server:** Port 8080
- **Authentication:** JWT-based
- **File Processing:** Document parsing and analysis
- **AI Engine:** Machine learning models for assessment

#### Database Layer
- **Supported Engines:** PostgreSQL 14+ or MySQL 8.0+
- **Tables:** 8 main tables (users, theses, assessments, etc.)
- **Features:** Foreign key constraints, indexes, cascading deletes

### System Requirements

#### Production Environment
- **CPU:** 4+ cores (8+ recommended)
- **RAM:** 8GB minimum (16GB recommended)
- **Storage:** 100GB+ SSD
- **OS:** Ubuntu 20.04/22.04 LTS or CentOS 8+
- **Docker:** Version 20.10+
- **Docker Compose:** Version 2.0+

#### Network Requirements
- Public IP address or domain name
- SSL/TLS certificate (Let's Encrypt recommended)
- Firewall configuration for ports 80, 443, 8080

---

## 3. User Management

### 3.1 User Roles

#### Student Role
- Upload thesis documents
- View assessment results
- Access feedback and suggestions
- Track submission history

#### Faculty Role
- All student permissions
- Perform manual assessments
- Review AI-generated feedback
- Grade and approve theses
- Access departmental analytics

#### Administrator Role
- Full system access
- User management (create, modify, delete)
- System configuration
- Access to all data and analytics
- Database management
- Backup and restore operations

### 3.2 Creating Users

#### Via Database (Direct)
```sql
-- Create a new student user
INSERT INTO users (
    email, password_hash, first_name, last_name,
    role, department, student_id, is_active,
    created_at, updated_at
) VALUES (
    'student@aucdt.edu.gh',
    -- Use bcrypt hash for password
    '$2b$10$YourHashedPasswordHere',
    'John',
    'Doe',
    'student',
    'Computer Science',
    'CS2025001',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Create a faculty user
INSERT INTO users (
    email, password_hash, first_name, last_name,
    role, department, is_active,
    created_at, updated_at
) VALUES (
    'professor@aucdt.edu.gh',
    '$2b$10$YourHashedPasswordHere',
    'Jane',
    'Smith',
    'faculty',
    'Computer Science',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Create an administrator
INSERT INTO users (
    email, password_hash, first_name, last_name,
    role, department, is_active,
    created_at, updated_at
) VALUES (
    'admin@aucdt.edu.gh',
    '$2b$10$YourHashedPasswordHere',
    'Admin',
    'User',
    'admin',
    'IT Department',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
```

#### Password Hashing
Always use bcrypt with cost factor 10 or higher:

```bash
# Using Python
python3 -c "import bcrypt; print(bcrypt.hashpw(b'password123', bcrypt.gensalt()).decode())"

# Using Node.js
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('password123', 10, (err, hash) => console.log(hash));"
```

### 3.3 Modifying Users

#### Update User Information
```sql
-- Change user role
UPDATE users
SET role = 'faculty', updated_at = CURRENT_TIMESTAMP
WHERE email = 'user@aucdt.edu.gh';

-- Deactivate user account
UPDATE users
SET is_active = false, updated_at = CURRENT_TIMESTAMP
WHERE email = 'user@aucdt.edu.gh';

-- Reset user password
UPDATE users
SET password_hash = '$2b$10$NewHashedPassword', updated_at = CURRENT_TIMESTAMP
WHERE email = 'user@aucdt.edu.gh';

-- Update user department
UPDATE users
SET department = 'Engineering', updated_at = CURRENT_TIMESTAMP
WHERE email = 'user@aucdt.edu.gh';
```

### 3.4 Deleting Users

```sql
-- Soft delete (recommended) - deactivate instead of deleting
UPDATE users
SET is_active = false, updated_at = CURRENT_TIMESTAMP
WHERE id = 123;

-- Hard delete (WARNING: This will cascade delete related data)
DELETE FROM users WHERE id = 123;
```

### 3.5 Bulk User Import

```bash
# CSV format: email,first_name,last_name,role,department,student_id
# Example: student1@aucdt.edu.gh,John,Doe,student,Computer Science,CS2025001

# Import script (example)
while IFS=',' read -r email first_name last_name role department student_id; do
    # Generate temporary password
    temp_pass=$(openssl rand -base64 12)
    hash=$(python3 -c "import bcrypt; print(bcrypt.hashpw(b'$temp_pass', bcrypt.gensalt()).decode())")

    # Insert into database
    psql -U thesisai_user -d thesisai_db -c "
        INSERT INTO users (email, password_hash, first_name, last_name, role, department, student_id, is_active, created_at, updated_at)
        VALUES ('$email', '$hash', '$first_name', '$last_name', '$role', '$department', '$student_id', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);"

    echo "Created user: $email with password: $temp_pass"
done < users.csv
```

---

## 4. System Configuration

### 4.1 Environment Variables

Create `/etc/thesisai/.env` file:

```bash
# Application Settings
NODE_ENV=production
APP_NAME=ThesisAI
APP_URL=https://thesisai.aucdt.edu.gh

# Frontend Settings
VITE_API_URL=https://api.thesisai.aucdt.edu.gh
VITE_APP_VERSION=1.0.0

# Backend API Settings
API_PORT=8080
API_HOST=0.0.0.0
API_BASE_PATH=/api

# Database Configuration
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=thesisai_db
DB_USER=thesisai_user
DB_PASSWORD=YourSecurePasswordHere
DB_SSL=true
DB_POOL_MIN=2
DB_POOL_MAX=10

# JWT Authentication
JWT_SECRET=YourVeryLongAndSecureRandomSecretKey
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# File Storage
STORAGE_TYPE=s3
STORAGE_BUCKET=thesisai-documents
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY=YourAccessKey
STORAGE_SECRET_KEY=YourSecretKey
MAX_FILE_SIZE=52428800  # 50MB in bytes

# AI/ML Settings
AI_MODEL_PATH=/opt/thesisai/models
AI_CONFIDENCE_THRESHOLD=0.75
AI_MAX_PROCESSING_TIME=300  # seconds

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=noreply@aucdt.edu.gh
SMTP_PASSWORD=YourEmailPassword
EMAIL_FROM=ThesisAI <noreply@aucdt.edu.gh>

# Monitoring and Logging
LOG_LEVEL=info
LOG_FILE=/var/log/thesisai/app.log
ENABLE_METRICS=true
METRICS_PORT=9090

# Security
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW=15m
CORS_ORIGIN=https://thesisai.aucdt.edu.gh
SESSION_TIMEOUT=1800  # 30 minutes

# Backup
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *  # Daily at 2 AM
BACKUP_RETENTION_DAYS=30
BACKUP_LOCATION=/backup/thesisai
```

### 4.2 Nginx Configuration

Edit `/etc/nginx/sites-available/thesisai`:

```nginx
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
    ssl_certificate /etc/letsencrypt/live/thesisai.aucdt.edu.gh/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/thesisai.aucdt.edu.gh/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Frontend static files
    root /usr/share/nginx/html;
    index index.html;

    # Client max body size (for file uploads)
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Frontend routes (SPA)
    location / {
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # API proxy
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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }

    # Access and error logs
    access_log /var/log/nginx/thesisai_access.log;
    error_log /var/log/nginx/thesisai_error.log;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/thesisai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4.3 Docker Compose Configuration

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    image: thesisai-frontend:latest
    container_name: thesisai-frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    environment:
      - TZ=Africa/Accra
    networks:
      - thesisai-network
    restart: unless-stopped
    depends_on:
      - backend

  backend:
    image: thesisai-backend:latest
    container_name: thesisai-backend
    ports:
      - "8080:8080"
    volumes:
      - ./uploads:/app/uploads
      - ./logs/backend:/app/logs
    env_file:
      - .env
    environment:
      - TZ=Africa/Accra
    networks:
      - thesisai-network
    restart: unless-stopped
    depends_on:
      - database

  database:
    image: postgres:14-alpine
    container_name: thesisai-database
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./backups:/backups
    environment:
      - POSTGRES_DB=thesisai_db
      - POSTGRES_USER=thesisai_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - TZ=Africa/Accra
    networks:
      - thesisai-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: thesisai-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    networks:
      - thesisai-network
    restart: unless-stopped

networks:
  thesisai-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
```

### 4.4 SSL/TLS Certificate Setup

#### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d thesisai.aucdt.edu.gh

# Auto-renewal (cron job)
sudo crontab -e
# Add: 0 3 * * * /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
```

---

## 5. Database Administration

### 5.1 Database Connection

```bash
# PostgreSQL
psql -h localhost -U thesisai_user -d thesisai_db

# MySQL
mysql -h localhost -u thesisai_user -p thesisai_db
```

### 5.2 Database Schema Creation

```sql
-- See database-architecture.svg for full schema
-- Initialize database with schema

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

-- Additional tables: theses, assessments, feedback, citations,
-- activity_logs, system_settings, notifications
-- (Refer to database-architecture.svg for complete schema)
```

### 5.3 Database Maintenance

#### Vacuum and Analyze (PostgreSQL)
```sql
-- Manual vacuum
VACUUM ANALYZE;

-- Automatic vacuum configuration
ALTER SYSTEM SET autovacuum = on;
ALTER SYSTEM SET autovacuum_vacuum_scale_factor = 0.1;
ALTER SYSTEM SET autovacuum_analyze_scale_factor = 0.05;
SELECT pg_reload_conf();
```

#### Optimize Tables (MySQL)
```sql
OPTIMIZE TABLE users, theses, assessments, feedback;
```

### 5.4 Query Performance Monitoring

```sql
-- PostgreSQL: Check slow queries
SELECT
    query,
    calls,
    total_time,
    mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 6. Monitoring and Logging

### 6.1 Log Locations

```
/var/log/thesisai/
├── app.log                 # Application logs
├── error.log              # Error logs
├── access.log             # API access logs
├── nginx/
│   ├── access.log         # Nginx access logs
│   └── error.log          # Nginx error logs
└── database/
    └── postgresql.log     # Database logs
```

### 6.2 Log Rotation

Create `/etc/logrotate.d/thesisai`:

```
/var/log/thesisai/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload nginx > /dev/null 2>&1 || true
    endscript
}
```

### 6.3 System Monitoring Commands

```bash
# Check Docker containers
docker ps -a
docker stats

# View container logs
docker logs thesisai-frontend
docker logs thesisai-backend -f --tail 100

# Check disk usage
df -h
du -sh /var/lib/docker/*

# Check system resources
top
htop
free -h

# Check network connections
netstat -tulpn | grep -E ':(80|443|8080|5432)'
ss -tulpn | grep -E ':(80|443|8080|5432)'

# Check database connections
psql -U thesisai_user -d thesisai_db -c "SELECT count(*) FROM pg_stat_activity;"
```

### 6.4 Application Health Checks

```bash
# Frontend health check
curl -f http://localhost/health || echo "Frontend down"

# Backend API health check
curl -f http://localhost:8080/api/health || echo "Backend down"

# Database health check
pg_isready -h localhost -U thesisai_user

# Full system status script
cat > /usr/local/bin/thesisai-status << 'EOF'
#!/bin/bash
echo "=== ThesisAI System Status ==="
echo "Frontend: $(docker ps | grep thesisai-frontend | awk '{print $7}')"
echo "Backend: $(docker ps | grep thesisai-backend | awk '{print $7}')"
echo "Database: $(docker ps | grep thesisai-database | awk '{print $7}')"
echo "Disk Usage: $(df -h / | tail -1 | awk '{print $5}')"
echo "Memory Usage: $(free -h | grep Mem | awk '{print $3 "/" $2}')"
EOF
chmod +x /usr/local/bin/thesisai-status
```

---

## 7. Backup and Recovery

### 7.1 Database Backup

#### Automated Daily Backup Script

Create `/usr/local/bin/thesisai-backup`:

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/backup/thesisai"
DB_NAME="thesisai_db"
DB_USER="thesisai_user"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Database backup
echo "Starting database backup..."
pg_dump -U "$DB_USER" -Fc "$DB_NAME" > "$BACKUP_DIR/db_backup_$DATE.dump"

# Compress backup
gzip "$BACKUP_DIR/db_backup_$DATE.dump"

# Backup uploaded files
echo "Backing up uploaded files..."
tar -czf "$BACKUP_DIR/files_backup_$DATE.tar.gz" /app/uploads

# Remove old backups
find "$BACKUP_DIR" -name "*.dump.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $BACKUP_DIR/db_backup_$DATE.dump.gz"
```

Make executable and schedule:
```bash
chmod +x /usr/local/bin/thesisai-backup

# Add to crontab
crontab -e
# Add: 0 2 * * * /usr/local/bin/thesisai-backup >> /var/log/thesisai/backup.log 2>&1
```

### 7.2 Database Restore

```bash
# Stop backend service
docker stop thesisai-backend

# Restore from backup
gunzip -c /backup/thesisai/db_backup_20250124_020000.dump.gz | \
    pg_restore -U thesisai_user -d thesisai_db --clean

# Restore uploaded files
tar -xzf /backup/thesisai/files_backup_20250124_020000.tar.gz -C /

# Start backend service
docker start thesisai-backend
```

### 7.3 Disaster Recovery Plan

1. **Regular Backups:** Daily automated backups retained for 30 days
2. **Offsite Storage:** Copy backups to remote location weekly
3. **Backup Testing:** Monthly restore tests to verify backup integrity
4. **Documentation:** Maintain updated recovery procedures
5. **Recovery Time Objective (RTO):** 4 hours
6. **Recovery Point Objective (RPO):** 24 hours

---

## 8. Security Management

### 8.1 Security Best Practices

- Use strong passwords (minimum 12 characters)
- Enable two-factor authentication for admin accounts
- Regularly update system packages and dependencies
- Use HTTPS/TLS for all communications
- Implement rate limiting on API endpoints
- Regular security audits and penetration testing
- Monitor logs for suspicious activities
- Keep database access restricted to backend only

### 8.2 Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Fail2ban for SSH protection
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### 8.3 Security Audit Commands

```bash
# Check for security updates
sudo apt update
sudo apt list --upgradable

# Check open ports
sudo nmap -sT -O localhost

# Check failed login attempts
sudo grep "Failed password" /var/log/auth.log | tail -20

# Check active sessions
who
w

# Review database access
psql -U thesisai_user -d thesisai_db -c "SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 20;"
```

---

## 9. Performance Optimization

### 9.1 Database Optimization

```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_theses_user_id ON theses(user_id);
CREATE INDEX idx_theses_status ON theses(status);
CREATE INDEX idx_assessments_thesis_id ON assessments(thesis_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_feedback_assessment_id ON feedback(assessment_id);

-- PostgreSQL query plan analysis
EXPLAIN ANALYZE SELECT * FROM theses WHERE user_id = 123;
```

### 9.2 Nginx Optimization

Already included in configuration:
- Gzip compression
- Browser caching
- HTTP/2 support
- Connection keep-alive

### 9.3 Docker Resource Limits

Edit `docker-compose.yml`:

```yaml
services:
  backend:
    # ... other config
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

---

## 10. Troubleshooting

### 10.1 Common Issues

#### Frontend Not Loading

```bash
# Check nginx status
sudo systemctl status nginx
sudo nginx -t

# Check container
docker logs thesisai-frontend --tail 50

# Restart nginx
sudo systemctl restart nginx
```

#### API Connection Failed

```bash
# Check backend container
docker logs thesisai-backend --tail 100

# Check if port 8080 is accessible
curl http://localhost:8080/api/health

# Restart backend
docker restart thesisai-backend
```

#### Database Connection Error

```bash
# Check database container
docker logs thesisai-database

# Test connection
psql -h localhost -U thesisai_user -d thesisai_db -c "SELECT 1;"

# Check max connections
psql -U thesisai_user -d thesisai_db -c "SHOW max_connections;"
psql -U thesisai_user -d thesisai_db -c "SELECT count(*) FROM pg_stat_activity;"
```

#### High CPU Usage

```bash
# Identify process
top
ps aux | sort -nrk 3,3 | head -n 5

# Check long-running queries
psql -U thesisai_user -d thesisai_db -c "
SELECT pid, now() - query_start as duration, query
FROM pg_stat_activity
WHERE state = 'active' AND now() - query_start > interval '5 minutes';"
```

### 10.2 Emergency Procedures

#### System Unresponsive

```bash
# Full system restart
docker-compose down
docker-compose up -d

# Check all services
docker ps -a
```

#### Database Corruption

```bash
# Stop services
docker-compose down

# Restore from latest backup
/usr/local/bin/thesisai-restore /backup/thesisai/db_backup_latest.dump.gz

# Restart services
docker-compose up -d
```

---

## 11. Maintenance Procedures

### 11.1 Regular Maintenance Schedule

| Task | Frequency | Command |
|------|-----------|---------|
| System updates | Weekly | `sudo apt update && sudo apt upgrade` |
| Database vacuum | Weekly | `VACUUM ANALYZE;` |
| Log rotation | Daily | Automatic via logrotate |
| Backup verification | Monthly | Restore test backup |
| Security audit | Monthly | Review logs and access patterns |
| SSL certificate renewal | Every 60 days | `certbot renew` |
| Disk cleanup | Monthly | `docker system prune -a` |

### 11.2 Update Procedures

```bash
# Update frontend
docker pull thesisai-frontend:latest
docker-compose up -d frontend

# Update backend
docker pull thesisai-backend:latest
docker-compose up -d backend

# Update database
# Perform during maintenance window
docker-compose down database
docker pull postgres:14-alpine
docker-compose up -d database
```

---

## 12. API Management

### 12.1 API Endpoints

Refer to API documentation for complete list. Common endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/users` - List users (admin only)
- `POST /api/theses` - Upload thesis
- `GET /api/theses/:id` - Get thesis details
- `POST /api/assessments` - Create assessment
- `GET /api/assessments/:id` - Get assessment results

### 12.2 API Rate Limiting

Configured in backend `.env`:
```
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW=15m
```

### 12.3 API Monitoring

```bash
# Check API response times
tail -f /var/log/nginx/thesisai_access.log | awk '{print $4, $10, $11}'

# Count requests by endpoint
awk '{print $7}' /var/log/nginx/thesisai_access.log | sort | uniq -c | sort -rn
```

---

## Support and Contact

**AUCDT IT Department**
Email: itsupport@aucdt.edu.gh
Phone: +233 XXX XXX XXX
Emergency Hotline: +233 XXX XXX XXX (24/7)

**Documentation Repository**
GitHub: https://github.com/DanielFTwum-creator/aucdt-utilities

---

*Document Version: 1.0.0*
*Last Updated: November 24, 2025*
*Next Review: February 24, 2026*
