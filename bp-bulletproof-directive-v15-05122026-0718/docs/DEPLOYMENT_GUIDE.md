# Deployment Guide

**Institution:** Techbridge University College (TUC)
**Document ID:** TUC-INC-2026-005

## 1. Environment Requirements
- **OS:** Ubuntu 22.04 LTS minimum
- **Node.js:** v20.x or higher
- **React:** v19.2.5 (CRITICAL REQUIREMENT)
- **Java:** JDK 17 (for Spring Boot Backend)
- **Python:** 3.10+ (for API layer)
- **Database:** MySQL 8.x or MariaDB 10.6+
- **Proxy/Web Server:** Nginx latest stable
- **Docker:** latest engine

## 2. Build and Deployment Commands

### Frontend Build
*Note: Due to the React 19.2.5 requirement, strictly use standard npm installation. Do not downgrade React versions under any circumstances.*
```bash
npm install
npm run build
```
This produces heavily optimised static assets in the `/dist` directory.

### Backend Application Start
```bash
# Node.js Support Services
cd backend
npm install
pm2 start server.js --name "tuc-app"

# Java Core API
cd core-api
./mvnw clean package
java -jar target/tuc-core-0.0.1-SNAPSHOT.jar &

# Python FastAPI Service
cd analytics
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 3. Server Configuration (Nginx / PM2 / Docker)

### PM2 Process Management
Ensure that PM2 persists across reboots:
```bash
pm2 save
pm2 startup
```

### Nginx Reverse Proxy
Create a server block in `/etc/nginx/sites-available/tuc`:
```nginx
server {
    listen 80;
    server_name tuc.example.com;

    location / {
        root /var/www/tuc/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/tuc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 4. Post-Deployment Verification Checklist
- [ ] Database credentials connect successfully (verify core-api logs).
- [ ] Frontend loads correctly without HTTP 500 errors.
- [ ] `package.json` verified to ensure exactly React 19.2.5 is deployed.
- [ ] Admin authentication is functional and logs correctly record IP origins.
- [ ] Playwright Self-Test execution passes against production replica configurations.
- [ ] TLS/SSL certificates are correctly mapped via Let's Encrypt / Certbot.
