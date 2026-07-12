# LECTURER AI — DEPLOYMENT & ON-PREMISE INFRASTRUCTURE GUIDE
## DOCUMENT REF: TUC-DEP-GUIDE-2026
### INFRASTRUCTURE: Docker, Plesk Obsidian, Nginx Reverse Proxy, Let's Encrypt

---

## 1. INFRASTRUCTURE DESIGN
LecturerAI is structured as a robust, containerised full-stack application running on the TUC on-premise servers. 

```
+------------------+       HTTPS       +-------------------------+
|  Public Browser  |<----------------->|  Plesk / Nginx Ingress  | (Port 443, SSL)
+------------------+                   +-------------------------+
                                                    |
                                            Reverse Proxy (Pass-thru)
                                                    v
                                       +-------------------------+
                                       | Docker Container (Core) | (Port 3000)
                                       +-------------------------+
```

---

## 2. STEP-BY-STEP DOCKER CONTAINER INSTALLATION

Deploy LecturerAI on any standard Linux Server with Docker and Plesk Obsidian.

### Step 1: Clone and Prepare Workspace
Navigate to your Plesk file manager directory or SSH root and clone the codebase:
```bash
git clone https://github.com/techbridge-u/tuc-lecturer-ai.git /var/www/vhosts/techbridge.edu.gh/lecturer-ai
cd /var/www/vhosts/techbridge.edu.gh/lecturer-ai
```

### Step 2: Establish Environment Variables
Configure the system-wide API credentials inside `.env`. Create a copy of the template:
```bash
cp .env.example .env
nano .env
```
Ensure the variables are populated as follows:
```env
# .env file content
NODE_ENV=production
PORT=3000
GEMINI_API_KEY=AIzaSyD_your_secure_server_only_gemini_key
```

### Step 3: Build the Docker Image
Execute the standard production Docker image build:
```bash
docker build -t tuc-lecturer-ai-prod:latest .
```

### Step 4: Run the Container
Spawn a background Docker process binding the inner Express listener exclusively to host port `3000`:
```bash
docker run -d \
  --name tuc-lecturer-ai-instance \
  -p 3000:3000 \
  --restart unless-stopped \
  -v /var/www/vhosts/techbridge.edu.gh/lecturer-ai/logs:/app/logs \
  --env-file .env \
  tuc-lecturer-ai-prod:latest
```

---

## 3. PLESK OBSIDIAN & NGINX INGRESS REVERSE PROXY CONFIGURATION

Plesk Obsidian manages SSL and routes web requests. Follow these configurations inside Plesk:

1.  **Domain Association**: Connect domain `lecturerai.techbridge.edu.gh` to your Plesk Subscription.
2.  **SSL/TLS Setup**: Trigger the **Let's Encrypt** plugin. Secure your domain and request automatic 90-day renewals.
3.  **Docker Proxy Rules**: Inside your domain dashboard, click **Docker Proxy Rules** and establish:
    *   **Docker Container**: `tuc-lecturer-ai-instance`
    *   **Port Mapping**: Route port `80/443` traffic to container port `3000`.
4.  **Custom Nginx Directives**: Add the following commands to your Plesk Nginx configuration block to handle high-concurrency training workloads:
    ```nginx
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 180s;
        proxy_connect_timeout 60s;
    }
    ```

---

## 4. TELEMETRY, HEALTH MONITORING & LOG ROTATION
Ensure the container logs don't saturate on-premise storage:
*   **Docker Health Check**: Pinging `http://localhost:3000/api/health` must yield status `{"status": "ok"}`.
*   **Log Rotator**: Configure log rotation on the host at `/etc/logrotate.d/tuc-lecturer-ai`:
    ```text
    /var/www/vhosts/techbridge.edu.gh/lecturer-ai/logs/*.log {
        daily
        rotate 14
        compress
        delaycompress
        missingok
        notifempty
        copytruncate
    }
    ```
