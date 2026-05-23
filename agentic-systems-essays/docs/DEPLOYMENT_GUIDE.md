# Deployment Guide [TUC-TAB-DPL]
### Document Reference: TUC-ICT-SRS-2026-102

**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**Owner:** Daniel Twum, Head of ICT  

This document describes how to deploy the Techbridge AI Blueprint web application to production on a Dockerized container environment managed via Plesk Web Host Edition over Nginx.

---

## ⚙️ Host System Pre-requisites
Garantee the host server (Plesk VPS node) complies with:
* **Operating System:** Ubuntu 22.04 LTS or CentOS Stream 9
* **Software:** Docker CE installed, Plesk Docker Extension activated, Nginx integrated.
* **Resources:** Minimal 2 vCPUs, 2 GB RAM, 15 GB SSD.

---

## 🐳 Docker Deployment Setup
The application is containerized to prevent port clashing on TUC's web network.

### Dockerfile
The project builds using a multi-stage compilation outputting static production files:
```dockerfile
# Build Phase
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Standalone Serving Phase
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

### Let's Encrypt HTTPS Setup on Plesk
1. Log in to the TUC Plesk administrator panel.
2. Select **Domains** > **blueprint.techbridge.edu.gh** (or target host).
3. Access the **SSL/TLS Certificates** section.
4. Issue a free certificate using **Let's Encrypt**:
   - Check "Secure the domain name".
   - Check "Secure Wildcard domain and WWW".
5. Enforce **HTTPS redirection** directly in Plesk.

---

## 🔀 Nginx Reverse-Proxy Ingress Mapping
Because external ingress relies entirely on Port 3000, Nginx is configured to handle traffic routing securely:

```nginx
server {
    listen 80;
    server_name blueprint.techbridge.edu.gh;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name blueprint.techbridge.edu.gh;

    ssl_certificate /etc/letsencrypt/live/blueprint.techbridge.edu.gh/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/blueprint.techbridge.edu.gh/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 🚀 Step-by-Step Production Commands
Execute this commands in your server SSH terminal:

1. Clone TUC TAB code:
   ```bash
   git clone https://github.com/techbridge/tab-blueprint.git /var/www/vhosts/blueprint.techbridge.edu.gh
   ```
2. Build Docker container image:
   ```bash
   docker build -t tuc-tab:1.0.0 .
   ```
3. Run container image binding internally on localhost Port 3000:
   ```bash
   docker run -d --name tuc-tab-app -p 3000:3000 --restart unless-stopped tuc-tab:1.0.0
   ```
4. Verify server is actively listening:
   ```bash
   docker ps -a
   curl -I http://localhost:3000
   ```
