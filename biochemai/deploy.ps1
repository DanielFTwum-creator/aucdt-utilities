# BioChemAI Deployment Script
# Strategy: SSH to server -> git clone -> build on server -> serve
# Avoids all Windows scp/tar file-transfer failures.

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/biochemai/",
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
Log "INFO" "BIOCHEMAI DEPLOYMENT" Cyan
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
$buildDir = "/tmp/biochemai_deploy_$commit"

$serverScript = @"
set -e

# Ensure pnpm is available
if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || npm install -g pnpm --silent
  export PATH="`$HOME/.local/share/pnpm:`$PATH"
fi
echo '[setup] pnpm version:' && pnpm --version

echo '[1/7] Cleaning previous temp build...'
rm -rf $buildDir

echo '[2/7] Cloning biochemai from GitHub (sparse, depth 1)...'
git clone --depth 1 --filter=blob:none --sparse '$repoUrl' $buildDir
cd $buildDir
# Remove monorepo workspace config so pnpm treats this as a standalone project
rm -f pnpm-workspace.yaml package.json
git sparse-checkout set biochemai
cd biochemai

echo '[3/7] Injecting .env.local for Vite build...'
cp /tmp/biochemai_env_$commit .env.local 2>/dev/null || echo 'Warning: .env.local not found — VITE_ vars will be empty'

echo '[4/7] Installing dependencies...'
pnpm install --no-frozen-lockfile --ignore-workspace --silent 2>/dev/null \
  || npm install --legacy-peer-deps --silent

echo '[5/7] Building...'
pnpm exec vite build 2>/dev/null || npx vite build

echo '[6/7] Deploying dist/ to web root...'
mkdir -p $RemotePath
cp -r dist/. $RemotePath
cp server.ts package.json $RemotePath

echo '[7/7] Installing backend deps...'
cd $RemotePath
pnpm install --prod --silent

echo 'Build and deploy complete.'
"@

# Stream .env.local to server BEFORE building — Vite needs it at build time
# VITE_* vars are inlined during `vite build`; without this, Google OAuth breaks.
Log "INFO" "Uploading .env.local to server for build..." Yellow
$envContent = Get-Content ".env.local" -Raw
$envContent | ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p /tmp && cat > /tmp/biochemai_env_$commit"
if ($LASTEXITCODE -eq 0) {
    Log "SUCCESS" ".env.local uploaded" Green
} else {
    Log "WARN" ".env.local upload failed — Google OAuth may not work in build" Yellow
}

ssh -o StrictHostKeyChecking=no $RemoteHost "$serverScript"

if ($LASTEXITCODE -ne 0) {
    Log "WARN" "Server deploy returned $LASTEXITCODE — check output above" Yellow
} else {
    Log "SUCCESS" "Server-side build and file sync complete" Green
}

# Clean up the uploaded env file
ssh -o StrictHostKeyChecking=no $RemoteHost "rm -f /tmp/biochemai_env_$commit" 2>$null | Out-Null

# Step 4: Write .htaccess
Log "INFO" "Step 4: Writing .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /biochemai/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3002/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3002/api/$1 [P,L]
  RewriteRule ^ /biochemai/index.html [QSA,L]
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
  if pm2 describe biochemai &>/dev/null; then
    pm2 reload biochemai --update-env && echo 'pm2: reloaded biochemai'
  else
    pm2 start server.ts --name biochemai --interpreter tsx -- --transpile-only && echo 'pm2: started biochemai'
  fi
  pm2 save --force &>/dev/null
else
  # Fallback: kill old process, start with --transpile-only (skips type-check, ~3x faster)
  fuser -k 3002/tcp 2>/dev/null || true
  setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &
  sleep 2
  echo 'tsx: started biochemai (transpile-only)'
fi
"@
ssh -o StrictHostKeyChecking=no $RemoteHost "$restartScript"
Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK index.html present' || echo 'X index.html MISSING'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3002' && echo 'OK port 3002 listening' || echo 'X port 3002 not up'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3002/api/health 2>/dev/null && echo ' (backend OK)' || echo ' (health endpoint not yet ready)'"

# Step 7: Cleanup temp build on server
ssh -o StrictHostKeyChecking=no $RemoteHost "rm -rf $buildDir" 2>$null | Out-Null

$elapsed = [math]::Round(((Get-Date) - $__deployStart).TotalSeconds, 1)
Log "SUCCESS" "========================================" Green
Log "SUCCESS" "DEPLOYMENT COMPLETE in ${elapsed}s" Green
Log "SUCCESS" "URL:  https://ai-tools.techbridge.edu.gh/biochemai" Green
Log "SUCCESS" "Port: 3002" Green
Log "SUCCESS" "========================================" Green
