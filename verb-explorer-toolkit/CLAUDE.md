# CLAUDE.md — Verb Explorer Toolkit

> This file is read automatically by Claude Code on every session.
> It governs development standards, deployment procedures, and known issues for this project.

---

## Project Overview

**Name:** Verb Explorer Toolkit  
**Version:** 1.0.0  
**Status:** Active Development → App Store/Play Store Submission (Phase 2)  
**Stack:** React 19 + TypeScript 5.8 + Vite 6 + Tailwind CSS 4 + Capacitor 8

**Purpose:** Interactive educational toolkit for Class 4 students to discover, research, and create profile cards for English verbs. Fully offline, no external APIs (local-first architecture).

---

## Build & Deployment

### Quick Commands

```bash
npm install          # Install dependencies
npm run build        # Build for production (outputs to dist/)
npm run dev          # Start dev server (port 3000)
npm run cap:sync     # Sync to iOS/Android native projects
npm run cap:ios      # Open Xcode project
npm run cap:android  # Open Android Studio project
```

### Critical: Asset Paths for Subdirectory Deployment

⚠️ **IMPORTANT:** This app is deployed to a subdirectory, NOT the domain root.

**Deployment Path:**
```
/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/
https://ai-tools.techbridge.edu.gh/vet/
```

**vite.config.ts MUST have:**
```typescript
base: './',  // Relative paths, NOT absolute /assets/
```

**Why:** 
- Absolute paths `/assets/` resolve to domain root
- Relative paths `./assets/` resolve to current directory
- Subdirectory deployment requires relative paths

**If paths break after build:**
1. Check `vite.config.ts` has `base: './'`
2. Run `npm run build`
3. Redeploy dist/ to server
4. Test in browser DevTools (Network tab) to verify asset loads

---

## Deployment to Plesk

### Server Details
- **Host:** ai-tools.techbridge.edu.gh (or techbridge.edu.gh for subdomains)
- **SSH Access:** `ssh root@ai-tools.techbridge.edu.gh`
- **Web Root:** `/var/www/vhosts/techbridge.edu.gh/` (for subdomains)
- **Domain Config:** Plesk File Manager

### SCP Deployment Steps

**1. Build locally**
```bash
npm run build
```

**2. Deploy to server**
```bash
# Create target directory if needed
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "mkdir -p /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet"

# Copy files
cd dist/
scp -o StrictHostKeyChecking=no -r ./* \
  root@ai-tools.techbridge.edu.gh:/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/
```

**3. Fix permissions (CRITICAL!)**
```bash
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh << 'EOF'
# Change ownership to domain user
chown -R techbridge.edu.gh_md:psacln \
  /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet

# Set directory permissions (755)
chmod -R 755 /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet

# Set file permissions (644)
find /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet \
  -type f -exec chmod 644 {} \;
EOF
```

**Why permissions matter:**
- SCP as root creates files owned by root
- Plesk web server runs as `techbridge.edu.gh_md` user
- Files must be readable by web server user
- Without `chown`, Plesk shows files but web server can't read them

**Verify deployment:**
```bash
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/vet/"
```

Files should show owner `techbridge.edu.gh_md` and permissions starting with `rw-r--r--` (644).

**Live URL:** https://ai-tools.techbridge.edu.gh/vet/

---

## Common Issues & Solutions

### Issue: App loads but assets (JS, CSS) return 404

**Cause:** Absolute paths in index.html (`/assets/...` instead of `./assets/...`)

**Fix:**
1. Edit `vite.config.ts`: ensure `base: './'`
2. Run `npm run build`
3. Redeploy `dist/` to server
4. Clear browser cache (Ctrl+Shift+Del)

### Issue: Plesk File Manager shows files as empty

**Cause:** Files exist on server but Plesk interface isn't syncing

**Fix:**
1. Verify files with SSH: `ssh root@... "ls -la /path/to/vet/"`
2. Refresh Plesk page (F5)
3. Check permissions: files should be owned by `techbridge.edu.gh_md`

### Issue: SCP deployment seems to work but files aren't accessible

**Cause:** Ownership/permissions not fixed after SCP

**Fix:**
```bash
ssh -o StrictHostKeyChecking=no root@ai-tools.techbridge.edu.gh \
  "chown -R techbridge.edu.gh_md:psacln /path/to/vet && \
   chmod -R 755 /path/to/vet && \
   find /path/to/vet -type f -exec chmod 644 {} \;"
```

---

## Development Standards

### Code Quality
- `npm run lint` must pass (TypeScript strict mode)
- No console errors or warnings in production build
- All imports used (no dead code)
- No hardcoded API keys or secrets

### Git Workflow
- Commit messages: descriptive, under 50 chars title + body
- One feature per commit
- Tag releases: `v1.0.0`, `v1.0.1`, etc.
- Push to `claude/pdf-showcase-prototype-yuiXV` branch

### Testing
- Test locally: `npm run dev` on iPhone/Android simulator or actual device
- Test on Plesk: Visit deployed URL after each build
- Check DevTools Network tab for 404 errors on assets
- Verify data persistence: reload page, check localStorage

---

## Mobile App Submission (iOS & Android)

See `DEPLOYMENT_GUIDE.md` and `PRE_LAUNCH_CHECKLIST.md` for full details.

**Phase Status:**
- Phase 1: Development ✅ Complete
- Phase 2: Screenshots & metadata (In Progress)
- Phase 3-7: Testing → Submission → Post-launch (Pending)

**Key Notes:**
- Bundle ID: `com.techbridge.verbexplorer`
- App ID: `com.techbridge.verbexplorer`
- Min iOS: 13.0 | Min Android: 8.0
- Capacitor handles native bridges (no custom Swift/Kotlin needed yet)

---

## Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Currently used:
- `GEMINI_API_KEY` (optional, for future AI verb discovery feature)

Never commit `.env.local` or `.env` files.

---

## Known Limitations (v1.0.0)

- ❌ No cloud sync (all data local to device)
- ❌ No user accounts or login
- ❌ No multiplayer/sharing features
- ❌ No AI verb discovery (planned for v1.1)
- ❌ Cannot open files from device (local app only)

---

## Support & Contacts

| Role | Name | Email |
|------|------|-------|
| Project Lead | Daniel Twum | daniel.twum@techbridge.edu.gh |
| Deployment | Plesk/Server Admin | root@ai-tools.techbridge.edu.gh |
| Legal/Privacy | TUC Legal | ict@techbridge.edu.gh |

---

## Session Checklist

When starting work on this project:

- [ ] Read this file
- [ ] Check `git log --oneline -5` for recent changes
- [ ] Run `npm install` if dependencies changed
- [ ] Run `npm run lint` to catch TypeScript errors
- [ ] If deploying: verify `vite.config.ts` has `base: './'`
- [ ] If deploying: test locally first with `npm run dev`
- [ ] If deploying: remember to fix permissions after SCP

---

*Last Updated: 2026-05-08*  
*Updated by: Claude Haiku 4.5*
