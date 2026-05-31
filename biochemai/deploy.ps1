# BioChemAI Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3002) with Gemini proxy

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
    $line = "[$ts][$Level] $Msg"
    Write-Host $line -ForegroundColor $Color
}

Log "INFO"  "========================================"  Cyan
Log "INFO"  "BIOCHEMAI DEPLOYMENT"                      Cyan
Log "INFO"  "========================================"  Cyan
Log "INFO"  "Remote : $RemoteHost"
Log "INFO"  "Path   : $RemotePath"

# Validate .env.local
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

# Build if requested
if ($Build) {
    Log "INFO" "Step 2: Building..." Yellow
    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) { Log "ERROR" "Build failed!" Red; exit 1 }
    Log "SUCCESS" "Build complete" Green
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "dist/ not found — run with -Build flag" Red; exit 1
}

Log "INFO" "Step 3: Syncing to server..." Yellow
Log "INFO" "Creating remote directory..."
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..."
# Use native scp (no WSL bash wrapper) — copy each dist/ item individually
Get-ChildItem -Path "dist" | ForEach-Object {
    if ($_.PSIsContainer) {
        scp -r -o StrictHostKeyChecking=no "$($_.FullName)" "${RemoteHost}:${RemotePath}"
    } else {
        scp -o StrictHostKeyChecking=no "$($_.FullName)" "${RemoteHost}:${RemotePath}"
    }
}
if ($LASTEXITCODE -ne 0) { Log "WARN" "scp exited $LASTEXITCODE (non-fatal)" Yellow }
else { Log "SUCCESS" "Frontend files copied" Green }

Log "INFO" "Copying backend files..."
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..."
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Writing .htaccess..."
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
  # Hash-busted assets (cache indefinitely)
  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>
    ExpiresDefault 'max-age=31536000'
    Header set Cache-Control 'public, immutable'
  </FilesMatch>
  # HTML files (revalidate on every request)
  <FilesMatch '\.(html|json)$'>
    ExpiresDefault 'max-age=0'
    Header set Cache-Control 'public, must-revalidate'
  </FilesMatch>
</IfModule>

<IfModule mod_headers.c>
  # Disable browser caching for HTML as fallback
  <FilesMatch '\.(html)$'>
    Header set Cache-Control 'public, must-revalidate, max-age=0'
  </FilesMatch>
</IfModule>
'@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'" 2>&1 | Out-Null

Log "INFO" "Copying .env..."
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..."
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psaserv $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

Log "INFO" "Starting backend server (port 3002)..."
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3002/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && setsid nohup tsx server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Step 4: Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3002' && echo 'OK Port 3002 listening' || echo 'X Port 3002 NOT listening'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3002/api/health && echo ' (backend health OK)'"

$elapsed = [math]::Round(((Get-Date) - $__deployStart).TotalSeconds, 1)
Log "SUCCESS" "========================================"  Green
Log "SUCCESS" "DEPLOYMENT COMPLETE in ${elapsed}s"       Green
Log "SUCCESS" "URL:  https://ai-tools.techbridge.edu.gh/biochemai" Green
Log "SUCCESS" "Port: 3002" Green
Log "SUCCESS" "========================================" Green
