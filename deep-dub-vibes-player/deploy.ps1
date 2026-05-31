# Deep Dub Vibes Player Deployment Script
# Deploys frontend (dist/) to techbridge.edu.gh

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/deep-dub-vibes-player/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Deep Dub Vibes Player Deployment Script
# Deploys frontend (dist/) to techbridge.edu.gh

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/deep-dub-vibes-player/",
    [switch]$Build = $true
)

Log "INFO" "=== DEEP DUB VIBES PLAYER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in deep-dub-vibes-player!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "[OK] .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p '$RemotePath' && rm -rf '$RemotePath'/* '$RemotePath/.htaccess' 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
scp -r -o StrictHostKeyChecking=no dist/. "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 20

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd '$RemotePath' && npm install --omit=dev --legacy-peer-deps 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /deep-dub-vibes-player/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3009/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3009/api/$1 [P,L]
  RewriteRule ^ /deep-dub-vibes-player/index.html [QSA,L]
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

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Stopping any existing backend process on port 3009..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3009/tcp || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd '$RemotePath' && NODE_ENV=production nohup node server.js > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '[OK] Frontend deployed' || echo '[ERROR] Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '[OK] Backend deployed' || echo '[ERROR] Backend missing'"

Log "SUCCESS" "`n[SUCCESS] Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/deep-dub-vibes-player/"
Log "INFO" "Backend: Running on port 3009 (internal)`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== DEEP DUB VIBES PLAYER DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath"
# Validate .env.local with required OAuth credentials
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found in deep-dub-vibes-player!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "[OK] .env.local validated with OAuth credentials"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    $env:CI = "true"
    $env:PNPM_HOME = "$env:APPDATA\pnpm"
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory on remote..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p '$RemotePath' && rm -rf '$RemotePath'/* '$RemotePath/.htaccess' 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
scp -r -o StrictHostKeyChecking=no dist/. "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 20

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.js" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd '$RemotePath' && npm install --omit=dev --legacy-peer-deps 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /deep-dub-vibes-player/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3009/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3009/api/$1 [P,L]
  RewriteRule ^ /deep-dub-vibes-player/index.html [QSA,L]
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

Log "INFO" "Copying .env file..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions and ownership..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln '$RemotePath' && chmod -R 755 '$RemotePath' && chmod 644 '$RemotePath/.htaccess' '$RemotePath/.env' 2>/dev/null || true" | Out-Null

Log "INFO" "Stopping any existing backend process on port 3009..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3009/tcp || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd '$RemotePath' && NODE_ENV=production nohup node server.js > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/index.html' && echo '[OK] Frontend deployed' || echo '[ERROR] Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f '$RemotePath/server.js' && echo '[OK] Backend deployed' || echo '[ERROR] Backend missing'"

Log "SUCCESS" "`n[SUCCESS] Deployment complete!" Green
Log "INFO" "Frontend: https://ai-tools.techbridge.edu.gh/deep-dub-vibes-player/"
Log "INFO" "Backend: Running on port 3009 (internal)`n"