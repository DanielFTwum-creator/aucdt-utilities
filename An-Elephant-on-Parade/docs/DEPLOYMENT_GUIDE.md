# TUC Systems Deployment & Server Integration Guide
## Document Ref: TUC-DEP-GDE-2026-001
### Organisation: Techbridge University College (TUC), Oyibi, Ghana
### Approver: Daniel Twum, Head of ICT

---

## 1. Overview
The Techbridge AI Blueprint (TAB) companion web application is packageable as a high-density Single Page Application (SPA). This manual provides the formal instructions to deploy the build onto our server stack at TUC.

---

## 2. Option A: Deployment under Plesk Obsidian

Plesk Obsidian manages our on-premises server virtualization at the Oyibi campus. Follow these instructions to host the TAB shell:

1. **Create the Domain**:
   - In Plesk, click **Add Domain**.
   - Set the domain name to `tab.techbridge.edu.gh` (ensure TUC DNS zone maps this domain to the Plesk machine's public IP).
2. **Setup NodeJS / Static Hosting**:
   - Choose **Node.js** as the application handler (alternatively, configure as standard static HTML hosting if running purely as a client-side SPA).
   - Set the Document Root directly to `/httpdocs/dist` (the compiled React bundle folder).
3. **Deploying Files**:
   - Log in via FTP / SSH or use the built-in Plesk Git Extension.
   - Run the compiler script on your local node, then drag and drop the `/dist` directory files into Plesk's `/httpdocs` root.

---

## 3. Option B: Docker Container Deployment

For continuous, isolated virtualization, deploy TAB as a standard lightweight Docker service.

### 3.1 Write the Dockerfile
Create a secure multi-stage Docker build config in the repository root:
```dockerfile
# Stage 1: Compiling React assets
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serving static assets with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3.2 Command Line Deployment Workflow
```bash
# Build the image
docker build -t tuc/tab-companion:1.0.0 .

# Start the continuous service mapped to host Port 3000
docker run -d --name tab-app -p 3000:80 --restart unless-stopped tuc/tab-companion:1.0.0
```

---

## 4. Option C: Direct Nginx Reverse Proxy Setup

If hosting on a raw Ubuntu LTS server, configure Nginx to route ingress traffic to Port 3000:

1. Install Nginx:
   ```bash
   sudo apt update && sudo apt install nginx certbot python3-certbot-nginx -y
   ```
2. Create the host proxy configuration: `/etc/nginx/sites-available/tab.techbridge.edu.gh`
   ```nginx
   server {
       listen 80;
       server_name tab.techbridge.edu.gh;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
3. Enable and test:
   ```bash
   sudo ln -s /etc/nginx/sites-available/tab.techbridge.edu.gh /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```
4. Secure connections using Certbot (LetsEncrypt SSL):
   ```bash
   sudo certbot --nginx -d tab.techbridge.edu.gh
   ```
