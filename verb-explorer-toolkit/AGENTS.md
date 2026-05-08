# AGENTS.md — Deployment & Automation Guide

> Instructions for Claude agents (Haiku, Sonnet, Opus) automating tasks on this project.

---

## Deployment Automation

### Full Deployment Pipeline

When deploying the Verb Explorer Toolkit to Plesk:

```bash
# 1. Rebuild (ensure vite.config.ts has base: './')
npm run build

# 2. Create target directory
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "mkdir -p /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet"

# 3. Deploy via SCP (copy all dist contents)
scp -o StrictHostKeyChecking=no -r dist/* \
  root@ai-tools.techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/

# 4. Fix ownership (CRITICAL - never skip this)
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "chown -R techbridge.edu.gh_md:psacln /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet"

# 5. Fix permissions (directories: 755, files: 644)
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "chmod -R 755 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet && \
   find /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet -type f -exec chmod 644 {} \;"

# 6. Verify deployment
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/"
```

### Critical: Do NOT Skip Step 4 & 5

**Issue:** Files exist but are unreadable by web server (shows 404 or blank page)

**Root Cause:** SCP as root creates files owned by root; Plesk web server runs as `techbridge.edu.gh_md`

**Solution:** Always run `chown` and `chmod` after SCP deployment

**Verification:** Output should show:
```
-rw-r--r-- techbridge.edu.gh_md psacln  index.html
-rw-r--r-- techbridge.edu.gh_md psacln  app-icon.svg
drwxr-xr-x techbridge.edu.gh_md psacln  assets/
```

If owner is `root`, run the chown command again.

---

## Asset Path Configuration

### Vite Configuration

The `vite.config.ts` MUST include:
```typescript
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',  // ← This is CRITICAL for subdirectory deployments
    plugins: [react(), tailwindcss()],
    // ... rest of config
  };
});
```

### Why `base: './'`?

| Scenario | Path Type | Resolves To | Status |
|----------|-----------|-------------|--------|
| Root deploy (`/vet/`) | `./assets/` | `/vet/assets/` | ✅ Works |
| Root deploy (`/vet/`) | `/assets/` | `/assets/` | ❌ 404 |
| Subdomain deploy | `./assets/` | `./assets/` | ✅ Works |
| Subdomain deploy | `/assets/` | `/assets/` | ❌ 404 |

**Rule:** Always use `base: './'` for Plesk deployments.

### Verifying in Built Output

After `npm run build`, check dist/index.html:
```bash
grep "src=\|href=" dist/index.html
```

Should output:
```html
<script type="module" crossorigin src="./assets/index-593tSn8n.js"></script>
<link rel="stylesheet" crossorigin href="./assets/index-C_BPqOIj.css">
<link rel="apple-touch-icon" href="./app-icon.svg" />
```

All paths start with `./` — if any start with `/`, rebuild.

---

## Troubleshooting Checklist

| Symptom | Cause | Solution |
|---------|-------|----------|
| App loads, but JS/CSS 404 | Absolute asset paths | Check `vite.config.ts` has `base: './'`, rebuild, redeploy |
| Plesk shows empty folder | Ownership issue | Run `chown -R techbridge.edu.gh_md:psacln /path/to/vet` |
| Files exist in SSH but not Plesk UI | Cache/sync lag | Refresh Plesk (F5), wait 10s, check ownership |
| 403 Forbidden on assets | File permissions | Run `chmod 644` on files, `chmod 755` on dirs |
| App blank or slow loading | Browser cache | Ctrl+Shift+Del, clear cache, hard refresh Ctrl+F5 |

---

## Deployment Checklist (Before Running Deploy)

- [ ] Latest code pulled: `git pull origin claude/pdf-showcase-prototype-yuiXV`
- [ ] `vite.config.ts` has `base: './'`
- [ ] `npm run lint` passes (zero TypeScript errors)
- [ ] `npm run build` succeeds (no warnings)
- [ ] `dist/index.html` has `./assets/` (not `/assets/`)
- [ ] SSH access verified: `ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh "echo ok"`
- [ ] Know the exact target path: `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/`

---

## Post-Deployment Verification

After deployment completes:

1. **Verify files on server:**
   ```bash
   ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
     "find /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet -type f | head -5"
   ```
   Should list: index.html, app-icon.svg, manifest.webmanifest, assets/index-*.js, assets/index-*.css

2. **Verify ownership:**
   ```bash
   ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
     "ls -l /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/ | head -3"
   ```
   Should show owner `techbridge.edu.gh_md` (NOT `root`)

3. **Test in browser:**
   - Open: https://techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/
   - Check DevTools → Network tab
   - All assets should load (status 200, not 404)
   - App should render (not blank page)

---

## Error Handling

### If Deployment Fails

**Common failure points:**

1. **SCP hangs or times out**
   - Check SSH access: `ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh "uptime"`
   - If no response, server may be down — contact sysadmin

2. **mkdir fails: "Permission denied"**
   - Ensure SSH as root: `ssh root@... ` (not as domain user)

3. **chown fails: "invalid user"**
   - Double-check owner name: `techbridge.edu.gh_md` (with underscores, not hyphens)
   - Verify it exists: `ssh root@... "id techbridge.edu.gh_md"`

4. **App loads but shows blank page**
   - Check browser console for JS errors (F12 → Console)
   - Verify assets load: F12 → Network tab, look for 404s
   - If assets 404: assets paths are wrong (redo build + redeploy)

### Recovery Steps

If deployment goes wrong:

```bash
# 1. Clear target directory completely
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "rm -rf /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet"

# 2. Recreate from scratch
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "mkdir -p /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet"

# 3. Redeploy
scp -o StrictHostKeyChecking=no -r dist/* \
  root@ai-tools.techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/

# 4. Re-fix permissions
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "chown -R techbridge.edu.gh_md:psacln /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet && \
   chmod -R 755 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet && \
   find /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet -type f -exec chmod 644 {} \;"
```

---

## Agent Responsibilities

### Haiku Agent (Deployment & Ops)
- Build: `npm run build`
- Deploy: SCP files to server
- Fix permissions: `chown`, `chmod`
- Verify: SSH checks and file listing
- Cannot: Create signing certificates, manage DNS, approve production changes

### Sonnet Agent (Build & QA)
- Check `vite.config.ts` before build
- Verify build output (asset paths)
- Test locally before deployment approval
- Review error logs and troubleshoot
- Cannot: Deploy to production servers without explicit approval

### Opus Agent (Architecture & Planning)
- Review deployment strategy
- Decide on version bumps and tagging
- Plan migration steps (if major changes)
- Approve release to production
- Cannot: Execute deployment commands (delegate to Haiku)

---

## Quick Reference

**Deploy command (copy-paste, update path if different):**
```bash
#!/bin/bash
set -e

# Build
npm run build

# Create dir
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "mkdir -p /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet"

# Deploy
scp -o StrictHostKeyChecking=no -r dist/* \
  root@ai-tools.techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/

# Fix permissions
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh << 'EOF'
chown -R techbridge.edu.gh_md:psacln /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet
chmod -R 755 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet
find /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet -type f -exec chmod 644 {} \;
EOF

# Verify
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "echo '✅ Deployment complete' && ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/"
```

---

*Last Updated: 2026-05-08*  
*For: Verb Explorer Toolkit v1.0.0*
