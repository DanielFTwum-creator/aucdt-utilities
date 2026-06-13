# ============================================================
# Dictation App — Deploy Script
# Remote : root@techbridge.edu.gh
# Path   : /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dictation/
# Usage  : .\deploy.ps1 -Build
# ============================================================

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dictation/",
    [switch]$Build = $false
)

$ErrorActionPreference = "Stop"
$__deployStart = Get-Date
$GITHUB_REPO   = "https://github.com/DanielFTwum-creator/aucdt-utilities.git"
$SUBFOLDER     = "dictation-app"

function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}

Log "INFO" "========================================" Cyan
Log "INFO" "DICTATION APP DEPLOYMENT" Cyan
Log "INFO" "========================================" Cyan
Log "INFO" "Remote : $RemoteHost"
Log "INFO" "Path   : $RemotePath"
Log "INFO" ""

# ── Step 1: Pre-flight ───────────────────────────────────────
Log "INFO" "Step 1: Pre-flight checks..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "WARN" ".env.local not found — deploying without env vars" Yellow
}
Log "SUCCESS" "Pre-flight OK" Green

# ── Step 2: Git state ────────────────────────────────────────
Log "INFO" "Step 2: Verifying git state..." Yellow
$commit = (git rev-parse --short HEAD 2>$null).Trim()
$branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
Log "INFO" "Commit : $commit on $branch"

try { git push origin $branch 2>&1 | Out-Null } catch { Log "WARN" "git push failed (non-fatal)" Yellow }

# ── Step 3: Build & Deploy ───────────────────────────────────
if ($Build) {
    Log "INFO" "Step 3: Server-side build (git clone + pnpm build)..." Yellow

    $buildDir = "/tmp/dictation_deploy_$commit"

    $serverScript = @"
set -e
log() { echo "[`$(date '+%Y-%m-%d %H:%M:%S')][SERVER] `$1"; }

if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || npm install -g pnpm --silent
  export PATH="`$HOME/.local/share/pnpm:`$PATH"
fi
log "pnpm `$(pnpm --version)"

log '[1/5] Cleaning previous temp build...'
rm -rf $buildDir
find /tmp -maxdepth 1 -name '*_deploy_*' -type d -mmin +30 -exec rm -rf {} + 2>/dev/null || true

log '[2/5] Cloning dictation-app (sparse, depth 1)...'
git clone --depth 1 --filter=blob:none --sparse '$GITHUB_REPO' $buildDir
cd $buildDir
git sparse-checkout set dictation-app
cd dictation-app

log '[3/5] Installing dependencies...'
npm install --silent

log '[4/5] Building...'
npm run build

log '[5/5] Deploying dist/ to web root...'
mkdir -p $RemotePath
rsync -a --delete dist/. $RemotePath
log 'Build and deploy complete.'
"@

    $b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($serverScript.Replace("`r", "")))
    # Cap the server-side build so a stalled pnpm install/build can't hang forever (GNU timeout → exit 124).
    $BuildTimeoutSec = 600
    ssh -o StrictHostKeyChecking=no $RemoteHost "echo $b64 | base64 -d | timeout $BuildTimeoutSec bash"
    if ($LASTEXITCODE -eq 0) {
        Log "SUCCESS" "Server-side build and file sync complete" Green
    } elseif ($LASTEXITCODE -eq 124) {
        Log "ERROR" "Server build exceeded ${BuildTimeoutSec}s and was aborted — check the slow box / retry" Red
    } else {
        Log "WARN" "Server build returned $LASTEXITCODE — check output above" Yellow
    }

    # Cleanup temp dir
    ssh -o StrictHostKeyChecking=no $RemoteHost "rm -rf $buildDir" 2>$null | Out-Null

} else {
    Log "INFO" "Step 3: Copying local dist/ to server..." Yellow

    if (-not (Test-Path "dist")) {
        Log "ERROR" "dist/ not found. Run with -Build flag." Red
        exit 1
    }

    ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf ${RemotePath}*"
    scp -r -o StrictHostKeyChecking=no dist/* "${RemoteHost}:${RemotePath}"
    Log "SUCCESS" "dist/* copied to server" Green
}

# ── Step 4: .htaccess ────────────────────────────────────────
Log "INFO" "Step 4: Writing .htaccess..." Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /dictation/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /dictation/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'no-cache, no-store, must-revalidate'
    Header set Pragma 'no-cache'
    Header set Expires '0'
  </FilesMatch>
</IfModule>
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > ${RemotePath}.htaccess" 2>$null

# ── Step 5: Permissi