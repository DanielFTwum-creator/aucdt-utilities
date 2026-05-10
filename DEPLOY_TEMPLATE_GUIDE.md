# Deployment Template Guide — All TUC Projects

**Reusable deployment scripts for any TUC React web app to Plesk/Ubuntu**

---

## Overview

Two master deployment templates enable automated deployments for all TUC projects:

- **deploy-template.ps1** — PowerShell version (Windows)
- **deploy-template.sh** — Bash version (macOS/Linux)

Both scripts:
- Build production bundles (optional)
- Create SPA routing .htaccess
- Generate deployment manifests
- Deploy via SSH/SCP
- Verify and report results

---

## Quick Start

### Using in Your Project

Each project should have a simple wrapper script that calls the template:

#### Windows: `deploy.ps1`
```powershell
# deploy.ps1 — Thin wrapper around the template
param([switch]$Build = $false, [switch]$Test = $false)

# Call template with project-specific values
& "..\..\deploy-template.ps1" `
    -ProjectName "ai-lab" `
    -SubdomainPath "ai-lab" `
    -Environment "production" `
    -Build:$Build `
    -Test:$Test
```

#### macOS/Linux: `deploy.sh`
```bash
#!/bin/bash
# deploy.sh — Thin wrapper around the template
../../deploy-template.sh "ai-lab" "ai-lab" "production" "root@66.226.72.199" "$@"
```

### Template Parameters

| Parameter | Example | Purpose |
|-----------|---------|---------|
| `ProjectName` | `ai-lab`, `luxthumb`, `learnaai` | Project identifier (display name) |
| `SubdomainPath` | `ai-lab`, `luxthumb`, `learnaai` | URL path (e.g., `/ai-lab`) |
| `Environment` | `production`, `staging` | Deployment target |
| `RemoteHost` | `root@66.226.72.199` | SSH host |
| `RemotePath` | Auto-generated | Remote deployment directory |

---

## Deployment URLs

All projects deploy to the same parent domain with different subdirectories:

| Project | Subdirectory | URL |
|---------|--------------|-----|
| LuxThumb Agent | `luxthumb` | `https://ai-tools.techbridge.edu.gh/luxthumb` |
| TUC AI Lab Catalog | `ai-lab` | `https://ai-tools.techbridge.edu.gh/ai-lab` |
| LearnAI | `learnaai` | `https://ai-tools.techbridge.edu.gh/learnaai` |
| BioChemAI | `biochemai` | `https://ai-tools.techbridge.edu.gh/biochemai` |
| ThesisAI | `thesisai` | `https://ai-tools.techbridge.edu.gh/thesisai` |

**Base path:** `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/`

---

## Usage Examples

### Deploy with Build (Recommended)

#### Windows
```powershell
cd ai-lab-project-directory
./deploy.ps1 -Build
```

#### macOS/Linux
```bash
cd ai-lab-project-directory
./deploy.sh --build
```

### Deploy Pre-Built (if already built)

#### Windows
```powershell
./deploy.ps1
```

#### macOS/Linux
```bash
./deploy.sh
```

### Test Locally Before Deploying

#### Windows
```powershell
./deploy.ps1 -Test
# Starts preview server at http://localhost:4173
# Verify everything works, then Ctrl+C to stop
./deploy.ps1 -Build  # Then deploy
```

#### macOS/Linux
```bash
./deploy.sh --test
# Same as above
./deploy.sh --build
```

### Dry Run (Check What Would Deploy)

#### Windows
```powershell
./deploy.ps1 -DryRun
```

#### macOS/Linux
```bash
./deploy.sh --dry-run
```

---

## What the Template Does

### 1. Validation
- Checks `dist/` directory exists (or builds it)
- Verifies SSH key is configured
- Confirms remote host is accessible

### 2. Package Preparation
```
Stage files:
  ├── dist/* (all built assets)
  ├── .htaccess (SPA routing)
  ├── DEPLOYMENT_MANIFEST.json (metadata)
  ├── privacy.html (if exists)
  ├── APPSTORE_READY.md (if exists)
  └── .env.example (if exists)
```

### 3. SPA Routing (.htaccess)
Creates dynamic `.htaccess` based on subdirectory:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /$SubdomainPath/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /$SubdomainPath/index.html [QSA,L]
</IfModule>
```

### 4. Deployment Manifest
Generates `DEPLOYMENT_MANIFEST.json`:

```json
{
  "ProjectName": "ai-lab",
  "Deployed": "2026-05-10 15:30:45",
  "DeployedBy": "daniel",
  "Version": "1.0.0",
  "Branch": "main",
  "Commit": "a1b2c3d",
  "Environment": "production",
  "URL": "https://ai-tools.techbridge.edu.gh/ai-lab"
}
```

### 5. SSH Deployment
```bash
1. mkdir -p $RemotePath           # Create directory
2. rm -rf $RemotePath/*           # Clear old files
3. scp -r ./staging/* $REMOTE_HOST:$RemotePath/
4. chmod -R 755 $RemotePath       # Set permissions
```

### 6. Verification
Shows:
- Files deployed count
- Deployment size
- URL to verify
- Curl command to test
- Log tail command for debugging

---

## Setting Up a New Project

### Step 1: Copy Template Scripts (One-time)
```bash
# In your project root
cp ../../deploy-template.ps1 .
cp ../../deploy-template.sh .
chmod +x deploy-template.sh
```

### Step 2: Create Project Wrapper
#### Windows: Create `deploy.ps1`
```powershell
param([switch]$Build = $false, [switch]$Test = $false)
& ".\deploy-template.ps1" `
    -ProjectName "my-project" `
    -SubdomainPath "my-project" `
    -Environment "production" `
    -Build:$Build `
    -Test:$Test
```

#### macOS/Linux: Create `deploy.sh`
```bash
#!/bin/bash
./deploy-template.sh "my-project" "my-project" "production" "root@66.226.72.199" "$@"
```

Make it executable:
```bash
chmod +x deploy.sh
```

### Step 3: Verify Before Deploying
```bash
# Build and test locally
npm run build
npm run preview

# Test deployment (dry run)
./deploy.ps1 -DryRun  # Windows
./deploy.sh --dry-run # macOS/Linux

# If satisfied, deploy
./deploy.ps1 -Build   # Windows
./deploy.sh --build   # macOS/Linux
```

---

## Deployment Checklist

Before deploying to production:

- [ ] `npm run build` succeeds without errors
- [ ] `npm run preview` shows no console errors
- [ ] All features tested in preview
- [ ] vite.config.ts has `base: './'`
- [ ] index.html has correct meta tags and theme CSS
- [ ] privacy.html exists if needed
- [ ] APPSTORE_READY.md updated if applicable
- [ ] SSH key configured: `~/.ssh/id_rsa`
- [ ] SSH key has server access: `ssh root@66.226.72.199 "echo OK"`
- [ ] Sufficient disk space: `ssh root@66.226.72.199 "df -h"`

---

## Verification After Deployment

### 1. Browser Test
```
https://ai-tools.techbridge.edu.gh/your-project
```

Should load immediately with all features working.

### 2. Curl Test
```bash
curl -I https://ai-tools.techbridge.edu.gh/your-project
# Should return: HTTP/1.1 200 OK
```

### 3. Check Manifest
```bash
curl https://ai-tools.techbridge.edu.gh/your-project/DEPLOYMENT_MANIFEST.json
# Should show your deployment details
```

### 4. Check Server Logs
```bash
ssh root@66.226.72.199 'tail -50 /var/log/apache2/ai-tools.techbridge.edu.gh-access.log | grep your-project'
# Should show 200 status codes, not 404
```

### 5. Test SPA Routing
```bash
# Direct link should work (not 404)
https://ai-tools.techbridge.edu.gh/your-project/resources/detail/123
```

If you get 404 on direct links, the .htaccess routing failed.

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf dist node_modules package-lock.json
pnpm install
pnpm build
```

### SSH Connection Fails
```bash
# Test SSH manually
ssh root@66.226.72.199 "whoami"
# Should return: root

# If fails, check:
# 1. SSH key exists: ls ~/.ssh/id_rsa
# 2. Key has permissions: chmod 600 ~/.ssh/id_rsa
# 3. Public key on server: ssh root@66.226.72.199 "grep $(cat ~/.ssh/id_rsa.pub) ~/.ssh/authorized_keys"
```

### Files Not Loading (404)
```bash
# Problem: .htaccess didn't deploy or subdirectory is wrong

# Check .htaccess exists
ssh root@66.226.72.199 "cat /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/YOUR-PROJECT/.htaccess"

# Check subdirectory matches
ssh root@66.226.72.199 "ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/"
# Should show your project directory

# Verify mod_rewrite is enabled
ssh root@66.226.72.199 "apache2ctl -M | grep rewrite"
# Should show: rewrite_module (shared)
```

### Deployment Hangs
```bash
# If SCP hangs, try increasing timeout
ssh -o ConnectTimeout=10 root@66.226.72.199 "echo OK"

# Or check server disk space
ssh root@66.226.72.199 "df -h /var/www/vhosts/"
```

---

## Multi-Project Deployment

Deploy all projects to production in sequence:

### Windows
```powershell
# One at a time
cd luxthumb-agent && .\deploy.ps1 -Build && cd ..
cd tuc-ai-lab-catalog && .\deploy.ps1 -Build && cd ..
cd learnaai && .\deploy.ps1 -Build && cd ..

# Or create a batch script:
# deploy-all.ps1
@(
    "luxthumb-agent",
    "tuc-ai-lab-catalog",
    "learnaai"
) | ForEach-Object {
    Write-Host "Deploying $_..." -ForegroundColor Cyan
    cd $_
    .\deploy.ps1 -Build
    cd ..
    Write-Host ""
}
```

### macOS/Linux
```bash
# One at a time
cd luxthumb-agent && ./deploy.sh --build && cd ..
cd tuc-ai-lab-catalog && ./deploy.sh --build && cd ..
cd learnaai && ./deploy.sh --build && cd ..

# Or create a batch script:
# deploy-all.sh
#!/bin/bash
for project in luxthumb-agent tuc-ai-lab-catalog learnaai; do
    echo "Deploying $project..."
    cd "$project"
    ./deploy.sh --build
    cd ..
    echo ""
done
```

---

## Integration with CI/CD (GitHub Actions)

Example workflow for automated deployments:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm build
      - name: Deploy
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ./deploy.sh --build
```

---

## Script Reference

### deploy-template.ps1 (PowerShell)

```powershell
./deploy-template.ps1 `
    -ProjectName "ai-lab" `
    -SubdomainPath "ai-lab" `
    -Environment "production" `
    -RemoteHost "root@66.226.72.199" `
    -Build `
    -Test `
    -DryRun
```

### deploy-template.sh (Bash)

```bash
./deploy-template.sh "ai-lab" "ai-lab" "production" "root@66.226.72.199" --build --test --dry-run
```

---

## Support & Questions

For deployment issues:

1. Check **server logs:** `ssh root@66.226.72.199 'tail -f /var/log/apache2/ai-tools.techbridge.edu.gh-error.log'`
2. Verify **SSH access:** `ssh root@66.226.72.199 "echo OK"`
3. Check **deployment manifest:** `curl https://ai-tools.techbridge.edu.gh/your-project/DEPLOYMENT_MANIFEST.json`
4. Review **script output** — most errors are clearly stated

Contact: **daniel.twum@techbridge.edu.gh**

---

**Last Updated:** 10 May 2026  
**Status:** Production Ready  
**Tested With:** luxthumb-agent, tuc-ai-lab-catalog
