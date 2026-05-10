# Bitbucket Pipelines Setup Guide — TUC Projects

**Automated CI/CD deployment for all TUC React projects**

---

## Overview

Bitbucket Pipelines enables:
- ✅ Automatic builds on every commit
- ✅ Automated tests (lint, type checking)
- ✅ Automatic deployment to production on main branch
- ✅ Manual deployment to staging on-demand
- ✅ Build/test on every pull request

---

## Quick Setup

### Step 1: Copy Pipeline Configuration

```bash
# In your project root
cp ../../bitbucket-pipelines-template.yml ./bitbucket-pipelines.yml

# Edit the file (below)
```

### Step 2: Configure Environment Variables

In Bitbucket, go to: **Repository Settings → Pipelines → Repository variables**

Add these variables:

| Variable | Value | Example |
|----------|-------|---------|
| `PROJECT_NAME` | Your project name | `ai-lab` |
| `PROJECT_SUBDOMAIN` | Subdirectory in URL | `ai-lab` |
| `DEPLOY_USER` | SSH user | `root` |
| `DEPLOY_HOST` | Server hostname | `66.226.72.199` |
| `DEPLOY_PATH` | Remote directory | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab` |
| `SSH_DEPLOY_KEY` | Base64-encoded private key | (see below) |
| `SSH_HOST_KEY` | Server host key | (see below) |

### Step 3: Generate SSH Keys

#### Generate Deployment Key (One-time)

```bash
# Generate key pair (no passphrase!)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/tuc-deploy -N ""

# Get private key (base64 encoded for Bitbucket)
cat ~/.ssh/tuc-deploy | base64 -w 0
# Copy output → Bitbucket variable: SSH_DEPLOY_KEY

# Copy public key to server
cat ~/.ssh/tuc-deploy.pub | ssh root@66.226.72.199 "cat >> ~/.ssh/authorized_keys"
```

#### Get Server Host Key

```bash
# Get server's host key
ssh-keyscan -t rsa 66.226.72.199
# Output looks like: 66.226.72.199 ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQD...
# Paste entire output → Bitbucket variable: SSH_HOST_KEY
```

### Step 4: Test Pipeline

1. **Push to develop:** Tests should run automatically
2. **Open a PR:** Tests should run automatically
3. **Merge to main:** Should auto-deploy to production
4. **Check deployment:** `curl -I https://ai-tools.techbridge.edu.gh/your-project`

---

## Configuration for Each Project

### luxthumb-agent

```yaml
# bitbucket-pipelines.yml
PROJECT_NAME: luxthumb
PROJECT_SUBDOMAIN: luxthumb
DEPLOY_PATH: /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/luxthumb
```

### tuc-ai-lab-catalog

```yaml
PROJECT_NAME: ai-lab
PROJECT_SUBDOMAIN: ai-lab
DEPLOY_PATH: /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab
```

### LearnAI

```yaml
PROJECT_NAME: learnaai
PROJECT_SUBDOMAIN: learnaai
DEPLOY_PATH: /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/learnaai
```

### BioChemAI

```yaml
PROJECT_NAME: biochemai
PROJECT_SUBDOMAIN: biochemai
DEPLOY_PATH: /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/biochemai
```

### ThesisAI

```yaml
PROJECT_NAME: thesisai
PROJECT_SUBDOMAIN: thesisai
DEPLOY_PATH: /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/thesisai
```

---

## Pipeline Workflows

### Automatic Deployment (main → production)

```
Your local commit
     ↓
Push to main
     ↓
Bitbucket Pipeline triggers
     ↓
pnpm install
     ↓
pnpm build
     ↓
scp dist/* to production
     ↓
chmod 755 permissions
     ↓
✅ Live at https://ai-tools.techbridge.edu.gh/your-project
```

### Testing (develop, PR → build & lint)

```
Your local commit
     ↓
Push to develop or open PR
     ↓
Bitbucket Pipeline triggers
     ↓
pnpm install
     ↓
pnpm build
     ↓
pnpm lint
     ↓
✅ PR shows build status
```

### Manual Deployment (staging on-demand)

```
Bitbucket Repository → Pipelines
     ↓
Click "Custom" → "deploy-to-staging"
     ↓
Enter optional variables (or use defaults)
     ↓
Pipeline runs: build, lint, deploy to staging
     ↓
✅ Staging updated
```

---

## Manual Deployments

### Deploy to Production

1. Go to **Bitbucket → Pipelines**
2. Click **Custom pipelines**
3. Select **deploy-to-production**
4. Click **Run**
5. Wait for completion (3-5 minutes)
6. Verify: `https://ai-tools.techbridge.edu.gh/your-project`

### Deploy to Staging

1. Go to **Bitbucket → Pipelines**
2. Click **Custom pipelines**
3. Select **deploy-to-staging**
4. Click **Run**
5. Verify: `https://staging.ai-tools.techbridge.edu.gh/your-project`

---

## Monitoring Deployments

### View Build Log

1. **Bitbucket Repository → Pipelines**
2. Click the build number
3. Scroll through log to see:
   - Build steps (install, build, lint)
   - Deployment steps (scp, chmod)
   - Results and errors

### Check Deployment Status

```bash
# View manifest to confirm deployment
curl https://ai-tools.techbridge.edu.gh/your-project/DEPLOYMENT_MANIFEST.json

# Should show:
# {
#   "ProjectName": "your-project",
#   "Deployed": "2026-05-10T15:30:45Z",
#   "DeployedBy": "Bitbucket Pipeline",
#   "Commit": "a1b2c3d"
# }
```

### View Server Logs

```bash
ssh root@66.226.72.199 'tail -f /var/log/apache2/ai-tools.techbridge.edu.gh-access.log | grep your-project'
```

---

## Troubleshooting

### Pipeline Fails: "SSH key permission denied"

**Cause:** SSH key not authorized on server

**Fix:**
```bash
# Re-add public key to server
cat ~/.ssh/tuc-deploy.pub | ssh root@66.226.72.199 "cat >> ~/.ssh/authorized_keys"

# Verify
ssh -i ~/.ssh/tuc-deploy root@66.226.72.199 "whoami"
# Should return: root
```

### Pipeline Fails: "pnpm build timeout"

**Cause:** Build takes too long (> 15 minutes default)

**Fix:**
1. Check for large dependencies: `pnpm list --depth=0 | grep -E "^[a-z].*[0-9]MB"`
2. Remove unused dependencies: `pnpm remove <package>`
3. Or increase pipeline timeout in Bitbucket settings

### Pipeline Fails: "Disk space full"

**Cause:** Server running out of space

**Fix:**
```bash
# SSH to server
ssh root@66.226.72.199

# Check space
df -h /var/www/vhosts/

# Clear old deployments (keep only recent)
cd /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/
du -sh */  # See which take space

# Archive and delete old versions if needed
tar -czf backups/your-project-2026-05-01.tar.gz your-project/
rm -rf your-project/*

exit
```

### Pipeline Fails: "Cannot find dist/ in build step"

**Cause:** Build output not saved as artifact

**Fix:** Ensure `bitbucket-pipelines.yml` has:
```yaml
artifacts:
  - dist/**
```

### Deployment Shows "File not found: .htaccess"

**Cause:** .htaccess not in dist/ directory

**Fix:** The pipeline should create it. If not, verify in your project:
1. Check vite.config.ts has `base: './'`
2. Ensure pipeline creates .htaccess before deploy step
3. Or manually: `echo "<your htaccess>" > dist/.htaccess`

---

## Best Practices

### 1. Always Test Locally First

```bash
pnpm build
pnpm preview
# Test in browser before pushing
```

### 2. Use Pull Requests

- Never push directly to main
- Open PR → tests run → review → merge → auto-deploy
- Ensures code review before production

### 3. Monitor Deployments

- Check build log immediately after merge
- Verify deployment manifest
- Test live URL
- Monitor server logs for errors

### 4. Set Up Branch Protection

In Bitbucket: **Repository Settings → Branch permissions**

Require:
- ✅ Pull request approval
- ✅ Successful build
- ✅ No unresolved discussions

### 5. Clean Up Old Builds

In Bitbucket: **Repository Settings → Pipelines**

- Max pipeline file size: 100 KB (usually fine)
- Archive old builds after 30 days (optional)

---

## Environment Variables Reference

### Required Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `PROJECT_NAME` | Display name | `ai-lab` |
| `PROJECT_SUBDOMAIN` | URL subdirectory | `ai-lab` |
| `DEPLOY_USER` | SSH username | `root` |
| `DEPLOY_HOST` | Server IP or hostname | `66.226.72.199` |
| `DEPLOY_PATH` | Remote deployment path | `/var/www/vhosts/.../ai-lab` |
| `SSH_DEPLOY_KEY` | Base64-encoded private SSH key | (base64 of ~/.ssh/tuc-deploy) |
| `SSH_HOST_KEY` | Server's public host key | (output of ssh-keyscan) |

### Optional Variables (for staging)

| Variable | Purpose | Default |
|----------|---------|---------|
| `DEPLOY_USER_STAGING` | Staging SSH user | `DEPLOY_USER` |
| `DEPLOY_HOST_STAGING` | Staging server | `DEPLOY_HOST` |
| `DEPLOY_PATH_STAGING` | Staging path | `.../staging/{project}` |
| `SSH_DEPLOY_KEY_STAGING` | Staging SSH key | `SSH_DEPLOY_KEY` |

---

## Integration with Multiple Projects

Deploy multiple projects with shared SSH keys:

### Shared SSH Key Setup (One-time)

```bash
# Generate one key for all deployments
ssh-keygen -t rsa -b 4096 -f ~/.ssh/tuc-deploy-all -N ""

# Add to server
cat ~/.ssh/tuc-deploy-all.pub | ssh root@66.226.72.199 "cat >> ~/.ssh/authorized_keys"

# Create Bitbucket team variable (organization-level)
# This is shared by all team repositories
SSH_DEPLOY_KEY=<base64 of tuc-deploy-all>
SSH_HOST_KEY=<server host key>
DEPLOY_USER=root
DEPLOY_HOST=66.226.72.199
```

### Per-Project Variables

Each project's `bitbucket-pipelines.yml` only needs:
```yaml
PROJECT_NAME: your-project
PROJECT_SUBDOMAIN: your-subdomain
DEPLOY_PATH: /var/www/vhosts/.../your-subdomain
```

---

## Support

### Debug Information

When reporting issues, include:
1. Build log output (full text)
2. Pipeline configuration (sanitized)
3. What you expected vs. what happened
4. Recent git commit (short hash)

### Common Commands

```bash
# Test SSH connectivity from your machine
ssh -i ~/.ssh/tuc-deploy root@66.226.72.199 "echo OK"

# Check authorized keys on server
ssh root@66.226.72.199 "cat ~/.ssh/authorized_keys | grep $(cat ~/.ssh/tuc-deploy.pub)"

# View pipeline environment variables (check values are set)
# In Bitbucket: Repository Settings → Pipelines → Repository variables

# Monitor deployment in real-time
watch -n 5 "curl -s https://ai-tools.techbridge.edu.gh/your-project/DEPLOYMENT_MANIFEST.json | jq ."
```

---

**Last Updated:** 10 May 2026  
**Status:** Production Ready  
**Tested With:** luxthumb-agent, tuc-ai-lab-catalog
