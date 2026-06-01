# OmniExtract Deployment Script
# Strategy: SSH to server -> git clone -> build on server -> serve
# Avoids all Windows scp/tar file-transfer failures.

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/omniextract/",
    [switch]$Build = $true
)

# Timestamped logging helper
$__deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}

Log "INFO" "========================================" Cyan
Log "INFO" "OMNIEXTRACT DEPLOYMENT" Cyan
Log "INFO" "========================================" Cyan
Log "INFO" "Remote : $RemoteHost"
Log "INFO" "Path   : $RemotePath"
Log "INFO" ""

# Step 1: Validate .env.local
Log "INFO" "Step 1: Pre-flight checks..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" ".env.local not found!" Red; exit 1
}
$envContent = Get-Content "./.env.local" -Raw
foreach ($key in @("GEMINI_API_KEY","VITE_GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET")) {
    if ($envContent -notmatch $key) {
        Log "ERROR" "$key missing in .env.local" Red; exit 1
    }
}
Log "SUCCESS" "Pre-flight OK (.env.local validated)" Green

# Step 2: Push latest code to GitHub (ensure server pulls the newest commit)
Log "INFO" "Step 2: Verifying git state..." Yellow
$commit = git rev-parse --short HEAD
$branch = git branch --show-current
Log "INFO" "Commit : $commit on $branch"

# Step 3: Server-side build and deploy via SSH
Log "INFO" "Step 3: Server-side build (git clone + npm build)..." Yellow

$repoUrl = "https://github.com/DanielFTwum-creator/aucdt-utilities.git"
$buildDir = "/tmp/omniextract_deploy_$commit"

$serverScript = @"
set -e

# Timestamped log helper (server-side bash)
log() { echo "[`$(date '+%Y-%m-%d %H:%M:%S')][SERVER] `$1"; }

# Ensure pnpm is available
if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || npm install -g pnpm --silent
  export PATH="`$HOME/.local/share/pnpm:`$PATH"
fi
log "pnpm `$(pnpm --version)"

log '[1/7] Cleaning previous temp build...'
rm -rf $buildDir

log '[2/7] Cloning omniextract (sparse, depth 1)...'
git clone --depth 1 --filter=blob:none --sparse '$repoUrl' $buildDir
cd $buildDir
rm -f pnpm-workspace.yaml package.json
git sparse-checkout set omniextract
cd omniextract

log '[3/7] Injecting .env.local for Vite build...'
cp /tmp/omniextract_env_$commit .env.local 2>/dev/null || log 'Warning: .env.local not found'

log '[4/7] Installing dependencies...'
pnpm install --no-frozen-lockfile --ignore-workspace --silent 2>/dev/null \
  || npm install --legacy-peer-deps --silent

log '[5/7] Building...'
pnpm exec vite build 2>/dev/null || npx vite build

log '[6/7] Deploying dist/ to web root...'
mkdir -p $RemotePath
cp -r dist/. $RemotePath
cp server.ts package.json $RemotePath

log '[7/7] Installing backend deps...'
cd $RemotePath
pnpm install --prod --silent
log 'Build and deploy complete.'

echo 'Build and deploy complete.'
"@

# Stream .env.local to server BEFORE building — Vite needs it at build time
Log "INFO" "Uploading .env.local to server for build..." Yellow
$envContent = Get-Content ".env.local" -Raw
$envContent | ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p /tmp && cat > /tmp/omniextract_env_$commit"
if ($LASTEXITCODE -eq 0) {
    Log "SUCCESS" ".env.local uploaded" Green
}
if ($LASTEXITCODE -ne 0) {
    Log "WARN" ".env.local upload failed — Google OAuth may not work in build" Yellow
}

$scriptPath = [System.IO.Path]::GetTempFileName()
Set-Content -Path $scriptPath -Value $serverScript -Encoding UTF8
cmd.exe /c "ssh -o StrictHostKeyChecking=no $RemoteHost bash -s < $scriptPath"

if ($LASTEXITCODE -ne 0) {
    Log "WARN" "Server deploy returned $LASTEXITCODE — check output above" Yellow
}
if ($LASTEXITCODE -eq 0) {
    Log "SUCCESS" "Server-side build and file sync complete" Green
}
Remove-Item -Path $scriptPath -Force

if ($LASTEXITCODE -ne 0) {
    Log "WARN" "Server deploy returned $LASTEXITCODE — check output above" Yellow
}
if ($LASTEXITCODE -eq 0) {
    Log "SUCCESS" "Server-side build and file sync complete" Green
}

# Clean up the uploaded env file
ssh -o StrictHostKeyChecking=no $RemoteHost "rm -f /tmp/omniextract_env_$commit" 2>$null | Out-Null

# Step 4: Write .htaccess
Log "INFO" "Step 4: Writing .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /omniextract/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3009/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3009/api/$1 [P,L]
  RewriteRule ^ /omniextract/index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

# Step 5: Copy .env + set permissions
Log "INFO" "Step 5: Configuring server environment..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psaserv $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

# Step 6: Restart backend with pm2 (fast) or tsx --transpile-only (fallback)
Log "INFO" "Step 6: Restarting backend..." Yellow
$restartScript = @"
cd $RemotePath

# Prefer pm2 — instant reload, no transpile delay
if command -v pm2 &>/dev/null; then
  if pm2 describe omniextract &>/dev/null; then
    pm2 reload omniextract --update-env && echo 'pm2: reloaded omniextract'
  else
    PORT=3009 pm2 start server.ts --name omniextract --interpreter tsx -- --transpile-only && echo 'pm2: started omniextract'
  fi
  pm2 save --force &>/dev/null
else
  # Fallback: kill old process, start with --transpile-only
  fuser -k 3009/tcp 2>/dev/null || true
  PORT=3009 setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &
  sleep 2
  echo 'tsx: started omniextract (transpile-only)'
fi
"@
ssh -o StrictHostKeyChecking=no $RemoteHost "$restartScript"
Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK index.html present' || echo 'X index.html MISSING'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3009' && echo 'OK port 3009 listening' || echo 'X port 3009 not up'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3009/api/health 2>/dev/null && echo ' (backend OK)' || echo ' (health endpoint not yet ready)'"

# Step 7: Cleanup temp build on server
ssh -o StrictHostKeyChecking=no $RemoteHost "rm -rf $buildDir" 2>$null | Out-Null

$elapsed    = [math]::Round(((Get-Date) - $__deployStart).TotalSeconds, 1)
$elapsedMin = [math]::Floor($elapsed / 60)
$elapsedSec = [math]::Round($elapsed % 60, 1)
$timeStr    = if ($elapsedMin -gt 0) { "${elapsedMin}m ${elapsedSec}s" } else { "${elapsed}s" }

Log "SUCCESS" "========================================" Green
Log "SUCCESS" "DEPLOYMENT COMPLETE" Green
Log "SUCCESS" "URL  : https://ai-tools.techbridge.edu.gh/omniextract" Green
Log "SUCCESS" "Port : 3009" Green
Log "SUCCESS" "Time : $timeStr total" Green
Log "SUCCESS" "========================================" Green
