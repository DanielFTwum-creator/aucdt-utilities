# Deployment Guide - TUC Blueprint OS

## 1. Environment Requirements
* **Runtime:** Node.js v18 or higher.
* **Package Manager:** npm v9 or higher.
* **Operating System:** Ubuntu 22.04 LTS (Recommended for production).

## 2. Local Development
To run the application in a development environment:

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```
The application will be available at `http://localhost:3000`.

## 3. Production Build & Deployment
The application uses a full-stack Express + Vite architecture.

### Step 1: Build the Client
```bash
npm run build
```
This generates the static assets in the `/dist` directory.

### Step 2: Start the Server
For production, set the environment variable:
```bash
export NODE_ENV=production
npm start
```

### Step 3: Nginx Configuration
If deploying behind Nginx (Plesk/Manual), use the following proxy configuration:

```nginx
server {
    listen 80;
    server_name your-domain.edu.gh;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 4. Verification Checklist
- [ ] `/api/health` returns status `operational`.
- [ ] Admin login bypass attempts are rejected.
- [ ] Theme persistence works across session clears.
