# Bitbucket Pipelines Documentation

**Last Updated:** February 20, 2026
**Repository:** aucdt-utilities
**Total Projects:** 89

---

## Overview

This repository uses Bitbucket Pipelines for continuous integration and deployment (CI/CD). The pipeline automatically builds and deploys projects when changes are pushed to the repository.

### Pipeline Features

✅ **Automatic Builds** - Projects build automatically on push
✅ **Smart Changesets** - Only builds projects that have changes
✅ **Parallel Execution** - Multiple projects build simultaneously
✅ **WAR Deployment** - Automatic deployment to Tomcat server
✅ **Pull Request Validation** - Builds and tests PRs before merge
✅ **Manual Triggers** - Custom pipelines for bulk operations

---

## Project Types

### 1. WAR Deployments (Tomcat Server)

These projects are built as WAR files and deployed to the Tomcat server at **66.226.72.199**:

| Project | WAR Name | Status |
|---------|----------|--------|
| fees-comparison-dashboard | fees-comparison.war | ✅ Active |
| aucdt-analytics-dashboard | aucdt-analytics.war | ✅ Active |
| kanban-app | kanban.war | ✅ Active |
| applicant-dashboard | applicant-dashboard.war | ✅ Active |
| lecturer-assessment-system | lecturer-assessment.war | ✅ Active |

**Deployment Process:**
1. Install dependencies with pnpm
2. Build production assets (`npm run build`)
3. Copy WEB-INF directory to dist/
4. Create WAR file from dist/
5. SCP WAR to Tomcat webapps directory
6. Tomcat auto-deploys the WAR

### 2. Static Builds (High Priority)

These projects build static assets but don't auto-deploy:

- analytics-refactor
- aucdt-website-react
- techbridge-product-design-6r-design-portal
- techbridge-scholarship-portal

**Build Process:**
1. Install dependencies
2. Run `npm run build`
3. Store artifacts in Bitbucket

### 3. Standard Vite Projects (75 projects)

All other Vite projects build on the `master` branch, default catch-all step, or via custom pipelines.

---

## Pipeline Triggers

### Default Pipeline (Any Branch)

Runs when code is pushed to **any branch**.

**What it does:**
- Builds only projects with changes (using changesets)
- Runs WAR deployments in parallel
- Builds high-priority static projects
- Stores build artifacts
- **NEW**: Catch-all step builds any of the 89 projects not listed individually

**Parallel Steps:**
- Up to 9 projects build simultaneously
- Reduces total build time significantly

### Master Branch Pipeline

Runs when code is pushed to **master** branch only.

**What it does:**
- Production deployments
- Builds all changed Vite projects
- More thorough validation

### Pull Request Pipeline

Runs when a pull request is created or updated.

**What it does:**
- Builds all changed projects
- Runs tests (if available)
- **Does NOT deploy** (validation only)
- Provides feedback on PR

### Custom Pipelines (Manual Trigger)

You can manually trigger these from Bitbucket:

#### `deploy-all-war-projects`
- Deploys all 5 WAR projects to Tomcat
- Use when you need to redeploy everything

#### `build-all-projects`
- Builds all 89 projects
- Use after major dependency updates
- Shows detailed summary of successes/failures
- Uses 2x size runner for performance

---

## Changesets (Smart Building)

The pipeline uses **changesets** to only build projects that have changes.

### How It Works

Each WAR deployment has a changeset configuration:

```yaml
changesets:
  includePaths:
    - 'fees-comparison-dashboard/**'
```

**This means:**
- Pipeline only runs if files in `fees-comparison-dashboard/` changed
- Saves time and resources
- Faster feedback on builds

### Example

If you only change files in `analytics-refactor/`, then:
- ✅ `analytics-refactor` builds
- ⏭️  Other 77 projects skip (no changes)

---

## Build Configuration

### Node Version
- **Image:** `node:20-alpine`
- Lightweight Alpine Linux with Node.js 20

### Package Manager
- **Primary:** pnpm (via corepack)
- **Fallback:** npm

### Caching
Two caches speed up builds:
1. **node cache** - node_modules
2. **pnpm cache** - pnpm store (~/.local/share/pnpm/store)

### Build Commands
```bash
pnpm install --frozen-lockfile  # Install deps
pnpm run build                  # Build production
```

---

## Deployment Server

### Tomcat Server Details
- **IP:** 66.226.72.199
- **User:** root
- **Tomcat Path:** /opt/tomcat/webapps/
- **Protocol:** SCP (SSH)

### How Deployment Works

1. **Build** - Project builds locally in pipeline
2. **Package** - Creates WAR file with WEB-INF
3. **Transfer** - SCP uploads WAR to Tomcat
4. **Deploy** - Tomcat automatically deploys WAR
5. **Live** - Application accessible at http://66.226.72.199/app-name

### WAR Structure
```
app-name.war
├── index.html
├── assets/
│   ├── index-abc123.js
│   └── index-def456.css
└── WEB-INF/
    └── web.xml
```

---

## How to Use

### For Regular Development

**Just push your code!**

```bash
git add .
git commit -m "Update feature X"
git push
```

The pipeline will:
1. Detect which projects changed
2. Build only those projects
3. Deploy if it's a WAR project
4. Notify you of success/failure

### For Pull Requests

1. Create a PR in Bitbucket
2. Pipeline automatically builds changed projects
3. Check build status before merging
4. Merge when green ✅

### For Manual Deployment

**Option 1: Deploy all WAR projects**
1. Go to Bitbucket Pipelines
2. Click "Run pipeline"
3. Select `deploy-all-war-projects`
4. Click "Run"

**Option 2: Build all 78 projects**
1. Go to Bitbucket Pipelines
2. Click "Run pipeline"
3. Select `build-all-projects`
4. Click "Run"
5. Review summary at end

---

## Troubleshooting

### Build Fails: "Cannot find module 'vite'"

**Cause:** Dependencies not installed

**Solution:**
```yaml
# Already in pipeline:
pnpm install --frozen-lockfile || npm install
```

### Build Fails: "npm ERR! missing script: build"

**Cause:** Project doesn't have build script

**Solution:** Add to project's package.json:
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

### WAR Deployment Fails: "WEB-INF not found"

**Cause:** Project missing WEB-INF directory

**Solution:**
```bash
# Create WEB-INF directory in project root
mkdir -p WEB-INF
```

Add web.xml:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee" version="3.1">
    <display-name>Your App Name</display-name>
    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
    </welcome-file-list>
</web-app>
```

### SCP Fails: "Connection refused"

**Cause:** SSH keys not configured in Bitbucket

**Solution:**
1. Go to Repository Settings > SSH keys
2. Add server's public key
3. Re-run pipeline

### Build Times Out

**Cause:** Project too large or slow build

**Solution:** Increase step size:
```yaml
- step:
    size: 2x  # Use 2x resources
```

---

## Performance Optimization

### Current Setup
- **Parallel Steps:** 9 projects simultaneously
- **Caching:** node + pnpm caches enabled
- **Changesets:** Only build what changed

### Build Time Estimates

| Scenario | Time | Projects Built |
|----------|------|----------------|
| Single project change | 2-5 min | 1 |
| Multiple projects (3-5) | 5-10 min | 3-5 |
| Full build (all 89) | 45-60 min | 89 |
| WAR deployment | 3-7 min | 1 |

### Tips for Faster Builds

1. **Push related changes together** - One commit for related files
2. **Don't clear cache** - Let Bitbucket cache work
3. **Use changesets** - Default pipeline uses them
4. **Merge PRs quickly** - Avoid stale builds

---

## Adding a New Project

### For WAR Deployment Project

1. **Create WEB-INF directory** in project root:
   ```bash
   mkdir -p your-project/WEB-INF
   ```

2. **Add web.xml:**
   ```bash
   touch your-project/WEB-INF/web.xml
   ```

3. **Add to pipeline:**
   ```yaml
   - step:
       name: Build and Deploy Your Project
       script:
         - cd your-project
         - npm install
         - npm run build
         - mkdir -p dist/WEB-INF
         - cp -rf WEB-INF/* dist/WEB-INF/
         - cd dist
         - apk add --no-cache zip openssh-client
         - zip -r your-project.war *
         - scp your-project.war root@66.226.72.199:/opt/tomcat/webapps/
       changesets:
         includePaths:
           - 'your-project/**'
   ```

### For Standard Vite Project

**No pipeline changes needed!**

The `build-all-projects` custom pipeline will automatically pick it up.

---

## Monitoring Builds

### Where to Check

1. **Bitbucket UI:**
   - Repository > Pipelines
   - See all runs, status, logs

2. **Email Notifications:**
   - Automatic on build failure
   - Configure in Bitbucket settings

3. **Commit Status:**
   - Green checkmark = passed
   - Red X = failed
   - Yellow dot = running

### Build Logs

Each step shows:
- Install output
- Build output
- Deployment output (if applicable)
- Error messages (if failed)

**To view:**
1. Click on pipeline run
2. Click on step name
3. Scroll through logs

---

## Security Notes

### SSH Keys
- SSH key for deployment stored in Bitbucket
- Never commit private keys to repository
- Rotate keys periodically

### Secrets
- Store sensitive values in Bitbucket Variables
- Access via `$VARIABLE_NAME`
- Never hardcode passwords/tokens

### Server Access
- Only pipeline has server access
- Deployment user is `root` (should use dedicated deploy user)
- Consider restricting SSH access by IP

---

## Migration Notes

### Changes from Old Pipeline

**Old (5 projects):**
- fees-comparison-dashboard
- lecture-assessment (❌ doesn't exist)
- math-adventure (❌ doesn't exist)
- applicant-dashboard
- aucdt-applicant-dashboard (❌ doesn't exist)

**New (5 actual projects):**
- fees-comparison-dashboard ✅
- aucdt-analytics-dashboard ✅
- kanban-app ✅
- applicant-dashboard ✅
- lecturer-assessment-system ✅

### What Changed
1. ✅ Removed non-existent projects
2. ✅ Added actual projects with WEB-INF
3. ✅ Updated all projects to use Vite 7.3.1
4. ✅ Added changesets for efficiency
5. ✅ Added custom pipeline for bulk builds
6. ✅ Added PR validation pipeline

---

## Custom Pipeline Reference

### deploy-all-war-projects
```bash
# Manually trigger from Bitbucket UI
# Deploys: fees-comparison-dashboard, aucdt-analytics-dashboard,
#          kanban-app, applicant-dashboard, lecturer-assessment-system
```

### build-all-projects
```bash
# Manually trigger from Bitbucket UI
# Builds all 89 projects
# Shows summary: SUCCESS / FAILED / SKIPPED
# Fails pipeline if any build fails
```

---

## FAQ

### Q: Do I need to manually trigger builds?
**A:** No! Builds trigger automatically on push.

### Q: How do I deploy only one project?
**A:** Just change files in that project and push. Changesets handle the rest.

### Q: Can I test before deploying?
**A:** Yes! Create a PR. Pipeline builds without deploying.

### Q: How do I know if my build passed?
**A:** Check Bitbucket Pipelines page or look for commit status icon.

### Q: What if build fails?
**A:** Check logs, fix issue, push again. Build re-runs automatically.

### Q: Can I skip the pipeline?
**A:** Add `[skip ci]` to your commit message:
```bash
git commit -m "Update docs [skip ci]"
```

### Q: How do I update the pipeline?
**A:** Edit `bitbucket-pipelines.yml` and push. Changes apply immediately.

---

## Quick Reference

### File Locations
- **Pipeline Config:** `bitbucket-pipelines.yml`
- **Updated Config:** `bitbucket-pipelines-updated.yml` (not active yet)
- **This Documentation:** `PIPELINE_DOCUMENTATION.md`

### Common Commands
```bash
# Local test (before pushing)
npm install
npm run build

# Check if project has Vite
ls vite.config.js

# Check if project needs WAR deployment
ls WEB-INF/

# View pipeline status
# (Go to Bitbucket > Pipelines)
```

### Support
- **Pipeline Issues:** Check Bitbucket logs
- **Build Issues:** Check project's package.json
- **Deployment Issues:** Check Tomcat logs on server

---

## Activating the New Pipeline

To use the updated pipeline:

```bash
# Backup old pipeline
mv bitbucket-pipelines.yml bitbucket-pipelines-old.yml

# Activate new pipeline
mv bitbucket-pipelines-updated.yml bitbucket-pipelines.yml

# Commit and push
git add bitbucket-pipelines.yml
git commit -m "Update pipeline for Vite 7.3.1 and all 89 projects"
git push
```

**⚠️ Important:** Test in a feature branch first!

---

**Last Updated:** February 20, 2026
**Maintained By:** Techbridge ICT Department
**Questions?** Contact Head of ICT
