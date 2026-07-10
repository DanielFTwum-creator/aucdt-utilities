# patois-lyricist-v2.0.0 — Deploy Script
# URL: https://ai-tools.techbridge.edu.gh/patois-lyricist-v2.0.0/
# Usage: .\deploy.ps1 -Build

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    # Self-serving-Node deploy (reworked 2026-07-10). patois is unified to the fleet archetype
    # used by aitopia/fail2ban-ai/brand-guideline-checker: the Node process serves the SPA (from
    # dist/, under NODE_ENV=production), the WMS-guarded /api/, and the SPA fallback (incl.
    # /patois/auth/callback). nginx proxies ALL of /patois/ to localhost:3017 — no Apache, no
    # .htaccess, no two-folder split. Properties:
    #   (a) SPA -> RemotePath/dist/ (mirrored); backend + pnpm-workspace.yaml -> RemotePath,
    #   (b) preserves .env and node_modules (non-destructive; only dist/ is mirrored),
    #   (c) ensures NODE_ENV=production, installs with a frozen lockfile (Pattern 27), and
    #       pm2-restarts in place (cwd + PORT 3017 preserved; never delete + start-from-ecosystem).
    # Pre-deploy tarball -> /tmp for rollback. The one-time nginx `location /patois/ -> :3017`
    # change goes through the Pattern 26 gate, NOT this script.
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/lyricist/",
    [switch]$Build = $false
)

$ErrorActionPreference = "Stop"
$__deployStart = Get-Date
$GITHUB_REPO   = "git@github.com:DanielFTwum-creator/aucdt-utilities.git"
$SUBFOLDER     = "patois-lyricist-v2.0.0"

function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}

Log "INFO" "========================================" Cyan
Log "INFO" "patois-lyricist-v2.0.0 DEPLOYMENT" Cyan
Log "INFO" "========================================" Cyan
Log "INFO" "Remote : $RemoteHost"
Log "INFO" "Path   : $RemotePath"
Log "INFO" ""

Log "INFO" "Step 1: Pre-flight checks..." Yellow
Log "SUCCESS" "Pre-flight OK" Green

Log "INFO" "Step 2: Verifying git state..." Yellow
$commit = (git rev-parse --short HEAD 2>$null).Trim()
$branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
Log "INFO" "Commit : $commit on $branch"

if ($Build) {
    Log "INFO" "Step 3: Server-side build (git clone + pnpm build)..." Yellow
    $buildDir = "/tmp/patois-lyricist_deploy_$commit"
    $serverScript = @"
set -e
export NVM_DIR="`$HOME/.nvm"
[ -s "`$NVM_DIR/nvm.sh" ] && \. "`$NVM_DIR/nvm.sh"
nvm use 26 >/dev/null 2>&1 || true
mkdir -p ~/.ssh && chmod 700 ~/.ssh
if [ -f ~/.ssh/github_deploy ]; then
  chmod 600 ~/.ssh/github_deploy
  grep -q 'Host github.com' ~/.ssh/config 2>/dev/null || cat >> ~/.ssh/config << 'SSHCONF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_deploy
  IdentitiesOnly yes
  StrictHostKeyChecking no
SSHCONF
fi
log() { echo "[`$(date '+%Y-%m-%d %H:%M:%S')][SERVER] `$1"; }
if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || npm install -g pnpm --silent
  export PATH="`$HOME/.local/share/pnpm:`$PATH"
fi
log "pnpm `$(pnpm --version)"
log '[1/5] Cleaning previous temp build...'
rm -rf $buildDir
find /tmp -maxdepth 1 -name '*_deploy_*' -type d -mmin +30 -exec rm -rf {} + 2>/dev/null || true
log '[2/5] Cloning patois-lyricist-v2.0.0 (sparse, depth 1)...'
git clone --depth 1 --filter=blob:none --sparse '$GITHUB_REPO' $buildDir
cd $buildDir
git sparse-checkout set patois-lyricist-v2.0.0
cd patois-lyricist-v2.0.0
log '[3/5] Installing dependencies (frozen lockfile — Pattern 27)...'
pnpm install --frozen-lockfile --silent 2>/dev/null || pnpm install --no-frozen-lockfile --silent
log '[4/5] Building...'
if [ -f $RemotePath.env.local ]; then
  cp $RemotePath.env.local .env.local
elif [ -f $RemotePath.env ]; then
  cp $RemotePath.env .env.local
fi
touch .env.local
# WMS SSO needs no build-time VITE vars: sign-in is delegated to WMS, and
# VITE_WMS_BASE defaults to https://wms.techbridge.edu.gh in the client. The old
# VITE_GOOGLE_CLIENT_ID/REDIRECT_URI (bespoke Google OAuth) are no longer used.
./node_modules/.bin/vite build
log '[5/5] Deploying (self-serving-Node — Node serves the SPA from dist/)...'
mkdir -p $RemotePath
# Back up the live folder before overwriting anything (rollback = untar into RemotePath).
if [ -d ${RemotePath}dist ] || [ -f ${RemotePath}server.ts ]; then
  tar czf /tmp/lyricist-predeploy-`$(date +%Y%m%d-%H%M%S).tgz -C $RemotePath dist server.ts src 2>/dev/null || true
fi
# SPA is served by the Node process itself (server.ts express.static under NODE_ENV=production),
# so the build goes into dist/ inside the Node's cwd — NOT the folder root. Mirror it so stale
# hashed bundles are removed. .env and node_modules live outside dist/ and are untouched.
rsync -a --delete dist/ ${RemotePath}dist/
# Backend: server.ts + package.json/lock + pnpm-workspace.yaml (pnpm 11 reads settings from it)
# + the WMS SSO guard. ecosystem.config.js is intentionally NOT shipped — the live PM2 config
# (PORT 3017) is preserved by the in-place restart below.
cp server.ts package.json pnpm-lock.yaml pnpm-workspace.yaml $RemotePath 2>/dev/null || log 'Note: some files copied via scp instead'
mkdir -p ${RemotePath}src/server
cp src/server/wmsAuthMiddleware.ts ${RemotePath}src/server/ 2>/dev/null || log 'Note: wmsAuthMiddleware copied via scp instead'
# Self-serving-Node requires NODE_ENV=production (gates the express.static block). Not a secret.
touch ${RemotePath}.env
grep -q '^NODE_ENV=' ${RemotePath}.env || echo 'NODE_ENV=production' >> ${RemotePath}.env
log 'Build and deploy complete.'
"@
    $b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($serverScript.Replace("`r", "")))
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "echo $b64 | base64 -d | bash"
    if ($LASTEXITCODE -eq 0) { Log "SUCCESS" "Server-side build and file sync complete" Green }
    else { Log "WARN" "Server build returned $LASTEXITCODE" Yellow }
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "rm -rf $buildDir" 2>$null | Out-Null
    # Belt-and-braces: re-copy the backend files from the local checkout in case the server-side
    # cp missed any (ecosystem.config.js is deliberately excluded — see the in-place restart).
    Log "INFO" "Step 3b: Copying backend files to server..." Yellow
    scp -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 server.ts package.json pnpm-lock.yaml pnpm-workspace.yaml "${RemoteHost}:${RemotePath}" 2>$null | Out-Null
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "mkdir -p ${RemotePath}src/server" 2>$null | Out-Null
    scp -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 src/server/wmsAuthMiddleware.ts "${RemoteHost}:${RemotePath}src/server/" 2>$null | Out-Null
} else {
    Log "INFO" "Step 3: Copying local dist/ to server..." Yellow
    if (-not (Test-Path "dist")) { Log "ERROR" "dist/ not found. Run with -Build flag." Red; exit 1 }
    if (-not (Select-String -Path "dist/index.html" -Pattern '<script[^>]+(src="[^"]*\.js"|type="module")' -Quiet)) { Log "ERROR" "dist/index.html ships no JS bundle (missing module entry in index.html). Aborting deploy." Red; exit 1 }
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "mkdir -p $RemotePath"
    Write-Host "[NOTE] Generating .env configuration..." -ForegroundColor Cyan
    # Preferred path is -Build (server-side build). This fallback preserves the live .env and
    # is non-destructive; it does not write a pre-deploy backup (the -Build path does).
    ssh -o StrictHostKeyChecking=no $RemoteHost "
        cd $RemotePath
        [ -f .env ] || curl -s https://wms.techbridge.edu.gh/api/gemini/key | jq -r '.apiKey' | awk '{print \"GEMINI_PROXY_KEY=\"$1}' > .env
        grep -q '^NODE_ENV=' .env || echo 'NODE_ENV=production' >> .env
    "
    # Non-destructive: the SPA goes into dist/ (Node serves it); backend files overwrite; .env/node_modules stay.
    scp -r -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 dist "${RemoteHost}:${RemotePath}"
    scp -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 server.ts package.json pnpm-lock.yaml pnpm-workspace.yaml "${RemoteHost}:${RemotePath}"
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "mkdir -p ${RemotePath}src/server"
    scp -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 src/server/wmsAuthMiddleware.ts "${RemoteHost}:${RemotePath}src/server/"
    Log "SUCCESS" "dist/* and backend files copied to server" Green
}

Log "INFO" "Step 4: (self-serving-Node — no .htaccess; nginx proxies /patois/ to the Node)" Yellow
# The Node process serves the SPA, /api/, and the SPA fallback (incl. /patois/auth/callback).
# nginx routes all of /patois/ to localhost:3017 (a one-time config, applied via the Pattern 26
# gate — not this script). Apache/.htaccess is not in the path, so nothing is written here.

Log "INFO" "Step 5: Setting permissions..." Yellow
# chmod -R 755 would make .env world-readable; force it back to 600 so the secret is never exposed (SEC §12).
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "chown -R techbridge.edu.gh_md:psaserv $RemotePath && chmod -R 755 $RemotePath && chmod 600 ${RemotePath}.env 2>/dev/null; true" | Out-Null

Log "INFO" "Step 6: Installing backend dependencies..." Yellow
$nvmPrefix = 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 26 >/dev/null 2>&1 || true'
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "$nvmPrefix; cd $RemotePath && CI=true pnpm install --prod --frozen-lockfile --silent 2>/dev/null || CI=true pnpm install --prod --silent 2>/dev/null || npm install --omit=dev --silent"

Log "INFO" "Step 7: Restarting backend (PM2, in place)..." Yellow
$restartCmd = @"
if command -v pm2 &>/dev/null; then
  cd $RemotePath
  mkdir -p logs
  if pm2 describe patois-lyricist &>/dev/null; then
    # In-place restart preserves the running cwd (lyricist/) and PORT 3017. Do NOT
    # delete + start-from-ecosystem: ecosystem.config.js pins PORT 3004 and would move
    # the live app off 3017 (the fragility this rework exists to eliminate).
    pm2 restart patois-lyricist && echo 'pm2: restarted patois-lyricist in place (port preserved)'
  else
    PORT=3017 pm2 start server.ts --name patois-lyricist --interpreter npx --interpreter-args tsx --cwd $RemotePath && echo 'pm2: started patois-lyricist on 3017'
  fi
  pm2 save --force &>/dev/null
fi
"@
$b64r = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($restartCmd.Replace("`r", "")))
# NOTE: $b64r must be PowerShell-interpolated here (no backtick). The old `$b64r sent the
# literal string "$b64r" to the remote shell, so the decode|bash ran nothing and the PM2
# restart was a silent no-op — files synced but the process never reloaded (4-day uptimes).
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "echo $b64r | base64 -d | bash"

Log "INFO" "Health check..." Yellow
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "test -f ${RemotePath}index.html && echo 'OK index.html present' || echo 'MISSING index.html'"
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 $RemoteHost "ss -tlnp | grep -q ':3017' && echo 'OK port 3017 listening' || echo 'WARN port 3017 not found'"

$elapsed = [math]::Round(((Get-Date) - $__deployStart).TotalSeconds, 1)
$timeStr = if ($elapsed -ge 60) { "$([math]::Floor($elapsed/60))m $([math]::Round($elapsed%60,1))s" } else { "${elapsed}s" }
Log "SUCCESS" "========================================" Green
Log "SUCCESS" "DEPLOYMENT COMPLETE" Green
Log "SUCCESS" "URL  : https://ai-tools.techbridge.edu.gh/patois/" Green
Log "SUCCESS" "Time : $timeStr total" Green
Log "SUCCESS" "========================================" Green