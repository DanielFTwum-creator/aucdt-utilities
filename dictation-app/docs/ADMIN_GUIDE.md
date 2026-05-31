# Dictation App — Administrator Guide v1.0

**Document ID:** TUC-ICT-ADMIN-2026-001  
**Status:** Final  
**Date:** May 31, 2026  
**Version:** 1.0  
**Audience:** IT Administrators & DevOps Engineers  
**Organization:** Techbridge University College (TUC)

---

## 1. Overview

This guide provides system administrators with procedures for deploying, maintaining, monitoring, and troubleshooting the Dictation App in production environments.

### Quick Links
- **Deployment Guide** — See DEPLOYMENT_GUIDE.md
- **Architecture** — See docs/ARCHITECTURE.md
- **Testing** — See TESTING_GUIDE.md
- **SRS** — See SRS_DICTATION_APP_v1.0.md

---

## 2. System Architecture

### 2.1 Components

```
┌─────────────────────────────────────────┐
│         Dictation App (Web)              │
│  ┌─────────────┐       ┌─────────────┐  │
│  │  React UI   │──────│ Tailwind CSS │  │
│  └─────────────┘       └─────────────┘  │
│         │                                 │
│         └──────────────┬──────────────┘  │
│                        │                  │
└─────────────────────────┼─────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
      ┌───▼────┐      ┌──▼──┐      ┌────▼──┐
      │ Vite   │      │Auth │      │IndexDB│
      │ Dev    │      │Gate │      │Storage│
      │Server  │      │OAuth│      │       │
      └────────┘      └─────┘      └───────┘
          │               │
          │      ┌────────┼────────┐
          │      │        │        │
      ┌───▼──┐  ┌▼─┐ ┌───▼───┐ ┌─▼───┐
      │Nginx │  │CM│ │Gemini │ │API  │
      │Proxy │  │S │ │API    │ │Auth │
      └──────┘  └──┘ └───────┘ └─────┘
       Port 80/443     Google Services
```

### 2.2 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 18.2+ |
| Language | TypeScript | 5.0+ |
| Styling | Tailwind CSS | 3.x |
| Build | Vite | 5.0+ |
| Runtime | Node.js | 18+ |
| AI | Google Gemini | 2.5 Flash |
| Auth | OAuth 2.0 | Google |
| Data | IndexedDB | HTML5 API |
| Testing | Cypress | 15.x |

---

## 3. Deployment

### 3.1 Prerequisites

**System Requirements:**
- Ubuntu 22.04 LTS or later
- 2GB RAM minimum (4GB recommended)
- 20GB disk space
- Node.js 18+ installed
- Docker 20.10+ (optional)

**Required Credentials:**
- Google OAuth credentials (Client ID + Secret)
- Google Gemini API key
- TLS certificate (for production HTTPS)

### 3.2 Pre-Deployment Checklist

```
☐ Infrastructure
  ☐ Server allocated and provisioned
  ☐ Domain name registered
  ☐ DNS records configured
  ☐ TLS certificate obtained
  ☐ Firewall rules configured (ports 80, 443)

☐ Credentials
  ☐ Google OAuth credentials obtained
  ☐ Gemini API key obtained
  ☐ API rate limits verified
  ☐ Credentials stored in secure vault

☐ Application
  ☐ Code reviewed by team
  ☐ Tests passing at 80%+ rate
  ☐ Build artifacts generated
  ☐ Dependencies verified

☐ Monitoring
  ☐ Log aggregation configured
  ☐ Error tracking set up
  ☐ Performance monitoring enabled
  ☐ Alerts configured
```

### 3.3 Production Deployment

**Step 1: Prepare Environment**

```bash
# SSH into production server
ssh admin@dictation-app.techbridge.edu.gh

# Create application directory
sudo mkdir -p /var/www/dictation-app
sudo chown node:node /var/www/dictation-app
cd /var/www/dictation-app

# Clone repository
git clone https://github.com/techbridge/dictation-app.git .
git checkout main
```

**Step 2: Install Dependencies**

```bash
# Install Node.js (if not present)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm@latest

# Install application dependencies
pnpm install --frozen-lockfile
```

---

## 4. Monitoring & Logging

### 4.1 Key Metrics

- CPU Usage: < 50%
- Memory Usage: < 80%
- Response Time: < 500ms (p95)
- Error Rate: < 0.1%
- Uptime: > 99.9%

### 4.2 Log Locations

```bash
# Application logs
journalctl -u dictation-app -f

# Nginx logs
/var/log/nginx/access.log
/var/log/nginx/error.log
```

---

## 5. Troubleshooting

### 5.1 Common Issues

**Application not loading:**

```bash
# Check service
sudo systemctl status dictation-app

# View logs
sudo journalctl -u dictation-app -n 50

# Restart
sudo systemctl restart dictation-app
```

**High memory usage:**

```bash
# Monitor
ps aux | grep node

# Restart
sudo systemctl restart dictation-app
```

---

## 6. Security

### 6.1 Server Hardening

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install firewall
sudo apt-get install -y ufw
sudo ufw default deny incoming
sudo ufw allow 22/tcp 80/tcp 443/tcp
sudo ufw enable

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

---

## 7. Backup & Recovery

### 7.1 Backup Strategy

```bash
# Backup application
tar -czf /backups/app_$(date +%Y%m%d).tar.gz /var/www/dictation-app/

# Restore from backup
cd /var/www/dictation-app
tar -xzf /backups/app_YYYYMMDD.tar.gz
sudo systemctl restart dictation-app
```

---

## 8. Updates & Patches

```bash
# Pull latest code
cd /var/www/dictation-app
git pull origin main

# Update dependencies
pnpm install

# Rebuild
pnpm build

# Restart
sudo systemctl restart dictation-app
```

---

## Sign-Off

**Status:** ✅ Final  
**Last Updated:** May 31, 2026  
**Maintained By:** Daniel Frempong Twum, Head of ICT

---

**Classification:** Internal Use - TUC IT Team Only

