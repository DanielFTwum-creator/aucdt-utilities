# DEPLOY GUIDE — TUC Project Deployment

> Complete guide to deploying Vite + React projects to techbridge.edu.gh via Plesk/Ubuntu.
> Reference this for all deployments. For deployment patterns, see PATTERNS.md §8.

---

## Quick Start (5 Minutes)

1. **Set up configuration:**
   ```powershell
   cd my-project
   Copy-Item ..\deploy.config.template.json deploy.config.json
   ```

2. **Edit deploy.config.json** — customise for your project:
   ```json
   {
     "projectName": "my-project",
     "remoteHost": "root@techbridge.edu.gh",
     "deployPath": "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/my-project",
     "buildTool": "pnpm",
     "outputDir": "dist",
     "requiredEnvVars": ["VITE_GOOGLE_CLIENT_ID"],
     "healthCheckUrl": "https://ai-tools.techbridge.edu.gh/my-project/"
   }
   ```

3. **Run deployment:**
   ```powershell
   .\deploy.template.ps1 -ConfigFile deploy.config.json -Build
   ```

4. **Visit URL** and verify:
   ```
   https://ai-tools.techbridge.edu.gh/my-project/
   ```

---

## Configuration File: deploy.config.json

Each project needs a `deploy.config.json` in its root directory. Copy from `deploy.config.template.json` and customise.

### Fields

| Field | Example | Notes |
|---|---|---|
| `projectName` | `peace-vinyl` | Human-readable name (used in logs) |
| `remoteHost` | `root@techbridge.edu.gh` | SSH target. Format: `user@host` or `user@ip` |
| `deployPath` | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace` | Absolute path on remote server (no trailing slash) |
| `buildTool` | `pnpm` | Either `pnpm` or `npm` (prefer `pnpm`) |
| `outputDir` | `dist` | Vite output directory (check `vite.config.ts`) |
| `requiredEnvVars` | `["VITE_GOOGLE_CLIENT_ID"]` | Array of env var names to validate before build |
| `healthCheckUrl` | `https://ai-tools.techbridge.edu.gh/peace/` | Full URL with trailing slash. Must be publicly reachable. |

### Path Guidelines

**Remote path must match:**
1. The actual Apache virtual host structure
2. The `.htaccess` RewriteBase path

Example for project `peace`:
- Remote path: `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace`
- RewriteBase: `/peace/`
- URL: `https://ai-tools.techbridge.edu.gh/peace/`

Verify remote path exists:
```bash
ssh root@techbridge.edu.gh 'ls -la /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/'
```

---

## Deployment Script: deploy.template.ps1

Copy `deploy.template.ps1` to your project as `deploy.ps1`, or run directly with `-ConfigFile` flag.

### Usage

```powershell
# Full deployment with build
.\deploy.ps1 -ConfigFile deploy.config.json -Build

# Deploy without building (use existing dist/)
.\deploy.ps1 -ConfigFile deploy.config.json

# Dry run (show what would happen, no SSH/SCP)
.\deploy.ps1 -ConfigFile deploy.config.json -DryRun

# Skip health checks (only if health check infrastructure issues)
.\deploy.ps1 -ConfigFile deploy.config.json -SkipHealthCheck
```

### 6-Step Deployment Process

**Step 1: Validate Configuration**
- Reads `deploy.config.json`
- Displays project, remote host, paths, build tool
- Fails if config file missing

**Step 2: Pre-flight Checks**
- Checks `.env.local` exists
- Validates all required env vars present (e.g., `VITE_GOOGLE_CLIENT_ID=xxx`)
- Checks `package.json` has `build` script
- Fails early if validation errors found

**Step 3: Build Project** (if `-Build` flag used)
- Runs `$buildTool build` (e.g., `pnpm build`)
- Captures errors and exits on build failure
- Shows build duration and status

**Step 4: Verify Build Output**
- Checks `dist/` (or custom `outputDir`) exists
- Validates `dist/` is not empty
- Checks `index.html` is present
- Reports file count and total size

**Step 5: Deploy to Remote**
- Creates directory structure via SSH
- Clears old deployment files
- Transfers files via SCP
- Creates `.htaccess` via SSH heredoc (no UTF-8 BOM)
- Sets file permissions (755 for dirs, 644 for .htaccess)

**Step 6: Health Checks** (if not skipped)
- Verifies `index.html` exists on remote
- Tests `.htaccess` syntax via `apache2ctl`
- Curls health check URL and expects HTTP 200
- Waits 5 seconds for server to settle

### Console Output Example

```
Step 1/6: Validating configuration... -ForegroundColor Cyan
  Project:        peace-vinyl
  Remote host:    root@66.226.72.199
  Deploy path:    /var/www/vhosts/.../peace
  Build tool:     pnpm
  Output dir:     dist
  Health check:   https://ai-tools.techbridge.edu.gh/peace/

Step 2/6: Pre-flight checks...
  ✅ All checks passed

Step 3/6: Building project...
  Running: pnpm build
  ✅ Build successful

Step 4/6: Verifying build output...
  ✅ Output verified: 145 files, 3.45 MB

Step 5/6: Deploying to remote server...
  Creating directory structure...
  Clearing old deployment...
  Deploying files via SCP...
  Creating .htaccess...
  Setting file permissions...
  ✅ Deployment complete

Step 6/6: Health checks...
  Checking remote index.html...
    ✅ index.html present
  Checking .htaccess syntax...
    ✅ .htaccess syntax OK
  Testing HTTP routing...
    ✅ HTTP 200 OK from https://ai-tools.techbridge.edu.gh/peace/
  ✅ All health checks passed

╔════════════════════════════════════════════════════════════╗
║  ✅ DEPLOYMENT COMPLETE                                    ║
╚════════════════════════════════════════════════════════════╝

Project:        peace-vinyl
Remote:         root@66.226.72.199
Path:           /var/www/vhosts/.../peace
Health check:   https://ai-tools.techbridge.edu.gh/peace/

Next steps:
  1. Visit https://ai-tools.techbridge.edu.gh/peace/ to verify
  2. Check browser console for errors (F12)
  3. Verify .env vars are present on remote
```

---

## Health Check Interpretation

### ✅ All Checks Passed
- Deployment successful
- Files transferred correctly
- Routing works
- Visit URL in browser to test fully

### ⚠️ index.html Missing
- Files didn't transfer completely
- SCP failed silently
- **Fix:** Run deployment again, check SSH connectivity

### ⚠️ .htaccess Syntax Error
- Apache won't parse rewrite rules
- User gets 404 or infinite redirects
- **Fix:** Check RewriteBase path matches deploy path (§8 in PATTERNS.md)

### ⚠️ HTTP Timeout / Connection Refused
- Server not reachable from local machine
- May be firewall or DNS issue
- **Fix:** Test manually: `curl https://ai-tools.techbridge.edu.gh/peace/`
- Deployment probably succeeded anyway — check via SSH

---

## Troubleshooting

### Build Failed

**Error:** `pnpm build` exits with non-zero code

**Causes:**
- Missing `.env.local` file
- Incorrect env var values
- TypeScript compilation error
- Vite config error

**Fix:**
1. Run `pnpm build` locally and read full error
2. Check `.env.local` exists and has all required vars
3. Fix TypeScript errors
4. Re-run deploy script

### Build Output Empty

**Error:** `dist/` directory exists but is empty

**Causes:**
- Vite config specifies wrong `outDir`
- Build succeeded but produced no files
- Dist directory cleared between build and deploy

**Fix:**
1. Check `vite.config.ts` for `outDir` setting
2. Run `pnpm build` locally and verify files in `dist/`
3. Don't delete `dist/` between build and deploy

### SCP Transfer Failed

**Error:** `Error: dist/ not found. Run with -Build flag.` (even though dist exists locally)

**Causes:**
- SCP timed out
- SSH key authentication failed
- Network interruption
- Target directory doesn't exist on remote

**Fix:**
1. Verify SSH key at `~/.ssh/id_rsa`:
   ```powershell
   Test-Path "$env:USERPROFILE\.ssh\id_rsa"
   ```
2. Test SSH connectivity:
   ```powershell
   ssh -o StrictHostKeyChecking=no root@techbridge.edu.gh 'echo OK'
   ```
3. Verify remote directory:
   ```powershell
   ssh root@techbridge.edu.gh 'mkdir -p /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/my-project'
   ```
4. Re-run deployment

### .htaccess Not Created

**Error:** Health check shows `.htaccess` missing or syntax error

**Causes:**
- SSH command failed silently
- .htaccess UTF-8 BOM added (old PowerShell pattern)
- RewriteBase path wrong

**Fix:**
1. Verify `.htaccess` on remote:
   ```powershell
   ssh root@techbridge.edu.gh 'cat /var/www/.../peace/.htaccess | head -5'
   ```
2. Check for BOM (should not be present):
   ```powershell
   ssh root@techbridge.edu.gh 'file /var/www/.../peace/.htaccess'
   ```
3. Verify RewriteBase matches deploy path (e.g., `/peace/`)
4. Test syntax on remote:
   ```powershell
   ssh root@techbridge.edu.gh 'apache2ctl -t'
   ```

### HTTP 404 on Deployed URL

**Symptom:** Files deployed but URL returns 404

**Causes:**
1. `.htaccess` not applied (syntax error or BOM)
2. RewriteBase path wrong
3. Files in wrong directory on remote
4. Apache mod_rewrite not enabled

**Fix:**
1. Check files are in correct location:
   ```powershell
   ssh root@techbridge.edu.gh 'ls /var/www/.../peace/index.html'
   ```
2. Check .htaccess syntax:
   ```powershell
   ssh root@techbridge.edu.gh 'apache2ctl -t'
   ```
3. Check .htaccess RewriteBase matches path:
   ```powershell
   ssh root@techbridge.edu.gh 'grep RewriteBase /var/www/.../peace/.htaccess'
   ```
4. Check Apache error logs:
   ```powershell
   ssh root@techbridge.edu.gh 'tail -20 /var/log/apache2/ai-tools.techbridge.edu.gh-error.log'
   ```

### Infinite Redirect Loop

**Symptom:** Browser stuck in redirect loop, tab keeps loading

**Causes:**
- .htaccess RewriteBase path wrong (e.g., `/peace/` when actual path is `/peace`)
- RewriteRule target wrong
- Apache mod_rewrite misconfigured

**Fix:**
1. Check RewriteBase matches URL path:
   - URL: `https://ai-tools.techbridge.edu.gh/peace/`
   - RewriteBase should be: `/peace/`
2. Clear browser cache (Ctrl+Shift+Delete)
3. Test with curl to isolate issue:
   ```bash
   curl -L -I https://ai-tools.techbridge.edu.gh/peace/
   ```

### SSH Key Not Found

**Error:** Warning about SSH key missing

**Fix:**
1. Generate SSH key:
   ```powershell
   ssh-keygen -t rsa -b 4096 -f "$env:USERPROFILE\.ssh\id_rsa" -N ""
   ```
2. Copy to server:
   ```powershell
   cat "$env:USERPROFILE\.ssh\id_rsa.pub" | ssh root@techbridge.edu.gh 'cat >> ~/.ssh/authorized_keys'
   ```

### Permission Denied on Remote

**Error:** `Permission denied (publickey)` or `Authentication failed`

**Causes:**
- SSH key not in remote `authorized_keys`
- Wrong username (should be `root` for Plesk servers)
- Remote SSH config doesn't allow password auth

**Fix:**
1. Verify SSH key is on remote:
   ```powershell
   ssh root@techbridge.edu.gh 'grep "YOUR_PUBLIC_KEY" ~/.ssh/authorized_keys'
   ```
2. Check remote SSH is working:
   ```powershell
   ssh -v root@techbridge.edu.gh 'echo OK'
   ```

---

## Per-Project Setup Checklist

When setting up deployment for a new project:

- [ ] Create `deploy.config.json` in project root (copy from template)
- [ ] Update `projectName`, `deployPath`, `healthCheckUrl`
- [ ] Verify `buildTool` matches project (pnpm or npm)
- [ ] Verify `outputDir` matches vite.config.ts
- [ ] List all required env vars in `requiredEnvVars`
- [ ] Verify `.env.local` exists locally with all vars set
- [ ] Verify remote `deployPath` exists: `ssh root@techbridge.edu.gh 'ls /var/www/vhosts/.../projectname'`
- [ ] Verify health check URL is publicly reachable (no auth walls)
- [ ] Run dry run: `.\deploy.ps1 -ConfigFile deploy.config.json -DryRun`
- [ ] Run actual deployment: `.\deploy.ps1 -ConfigFile deploy.config.json -Build`
- [ ] Visit health check URL and verify app loads
- [ ] Check browser console for errors (F12)

---

## Rollback Procedure

If deployment causes issues:

### Quick Rollback (Restore Previous Version)

1. **Via Git (if previous version tagged):**
   ```powershell
   ssh root@techbridge.edu.gh
   cd /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace
   git pull origin main  # or previous commit
   ```

2. **Manual Rollback (if git not available):**
   - Keep backup of previous dist/ directory
   - SSH to server: `ssh root@techbridge.edu.gh`
   - Restore from backup: `cp -r /backups/peace-2026-05-18/ /var/www/.../peace/`

### Prevention

- Always commit and tag releases: `git tag v1.0.0-peace`
- Keep dated backups of dist/ on server
- Test deployments on staging before production

---

## Environment Variables

### Sharing Credentials

TUC projects share `.env.local` from a central source (e.g., glucose):

```powershell
# In peace-vinyl/deploy.ps1
Copy-Item "../glucose/.env.local" "./.env.local" -Force
```

**Shared vars (across multiple projects):**
- `VITE_GOOGLE_CLIENT_ID` — Google OAuth client ID
- `VITE_GEMINI_API_KEY` — Google Gemini API key (if used)
- `VITE_ANTHROPIC_API_KEY` — Anthropic API key (if using Claude)

**Project-specific vars** (in individual `.env.local`):
- `VITE_API_ENDPOINT` — Project-specific backend URL
- `VITE_PROJECT_NAME` — App title for this deployment

### Adding New Env Vars

1. Add to central `glucose/.env.local`
2. Add var name to `deploy.config.json` `requiredEnvVars` array
3. Update all dependent projects' deploy configs
4. Re-deploy all projects that use the var

---

## Reference

- **Pattern Details:** PATTERNS.md §8 (Safe Deployment Pattern)
- **SSH Heredoc Issue:** PATTERNS.md §7 (.htaccess & BOM)
- **Remote Paths:** Ask Plesk admin or check Plesk control panel
- **Logs:** `ssh root@techbridge.edu.gh 'tail -50 /var/log/apache2/ai-tools.techbridge.edu.gh-error.log'`

---

*Last updated: May 2026 — Daniel Frempong Twum / TUC ICT*  
*Deployment patterns → see PATTERNS.md §8*
