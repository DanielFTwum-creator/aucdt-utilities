# TUC AI Lab Catalog Deployment Script
# Deploys frontend (dist/) + backend (server.ts) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TUC AI Lab Catalog Deployment Script
# Deploys frontend (dist/) + backend (server.ts) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/",
    [switch]$Build = $true
)

Log "INFO" "=== TUC AI LAB CATALOG DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ OAuth credentials found in .env.local"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TUC AI Lab Catalog Deployment Script
# Deploys frontend (dist/) + backend (server.ts) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TUC AI Lab Catalog Deployment Script
# Deploys frontend (dist/) + backend (server.ts) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/",
    [switch]$Build = $true
)

Log "INFO" "=== TUC AI LAB CATALOG DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ OAuth credentials found in .env.local"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\tuc-ai-lab-catalog' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
# Note: WAF rule 210580 exclusion lives in Plesk vhost_ssl.conf (LocationMatch);
# NOT in .htaccess (SecRuleRemoveById is not permitted in .htaccess on this Plesk build).
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3003/callback [P,L]
  RewriteRule ^auth/google/callback http://localhost:3003/auth/google/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3003/api/$1 [P,L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
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

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3003/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab"
Log "INFO" "Backend running on port 3001 (internal)`n"
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TUC AI LAB CATALOG DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ OAuth credentials found in .env.local"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\tuc-ai-lab-catalog' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
# Note: WAF rule 210580 exclusion lives in Plesk vhost_ssl.conf (LocationMatch);
# NOT in .htaccess (SecRuleRemoveById is not permitted in .htaccess on this Plesk build).
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3003/callback [P,L]
  RewriteRule ^auth/google/callback http://localhost:3003/auth/google/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3003/api/$1 [P,L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
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

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3003/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab"
Log "INFO" "Backend running on port 3001 (internal)`n"
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TUC AI Lab Catalog Deployment Script
# Deploys frontend (dist/) + backend (server.ts) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TUC AI Lab Catalog Deployment Script
# Deploys frontend (dist/) + backend (server.ts) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/",
    [switch]$Build = $true
)

Log "INFO" "=== TUC AI LAB CATALOG DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ OAuth credentials found in .env.local"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\tuc-ai-lab-catalog' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
# Note: WAF rule 210580 exclusion lives in Plesk vhost_ssl.conf (LocationMatch);
# NOT in .htaccess (SecRuleRemoveById is not permitted in .htaccess on this Plesk build).
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3003/callback [P,L]
  RewriteRule ^auth/google/callback http://localhost:3003/auth/google/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3003/api/$1 [P,L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
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

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3003/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab"
Log "INFO" "Backend running on port 3001 (internal)`n"
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TUC AI LAB CATALOG DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ OAuth credentials found in .env.local"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\tuc-ai-lab-catalog' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
# Note: WAF rule 210580 exclusion lives in Plesk vhost_ssl.conf (LocationMatch);
# NOT in .htaccess (SecRuleRemoveById is not permitted in .htaccess on this Plesk build).
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3003/callback [P,L]
  RewriteRule ^auth/google/callback http://localhost:3003/auth/google/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3003/api/$1 [P,L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
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

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3003/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab"
Log "INFO" "Backend running on port 3001 (internal)`n"
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TUC AI Lab Catalog Deployment Script
# Deploys frontend (dist/) + backend (server.ts) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TUC AI Lab Catalog Deployment Script
# Deploys frontend (dist/) + backend (server.ts) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/",
    [switch]$Build = $true
)

Log "INFO" "=== TUC AI LAB CATALOG DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ OAuth credentials found in .env.local"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\tuc-ai-lab-catalog' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
# Note: WAF rule 210580 exclusion lives in Plesk vhost_ssl.conf (LocationMatch);
# NOT in .htaccess (SecRuleRemoveById is not permitted in .htaccess on this Plesk build).
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3003/callback [P,L]
  RewriteRule ^auth/google/callback http://localhost:3003/auth/google/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3003/api/$1 [P,L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
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

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3003/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab"
Log "INFO" "Backend running on port 3001 (internal)`n"
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TUC AI LAB CATALOG DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ OAuth credentials found in .env.local"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\tuc-ai-lab-catalog' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
# Note: WAF rule 210580 exclusion lives in Plesk vhost_ssl.conf (LocationMatch);
# NOT in .htaccess (SecRuleRemoveById is not permitted in .htaccess on this Plesk build).
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3003/callback [P,L]
  RewriteRule ^auth/google/callback http://localhost:3003/auth/google/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3003/api/$1 [P,L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
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

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3003/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab"
Log "INFO" "Backend running on port 3001 (internal)`n"
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
# Note: WAF rule 210580 exclusion lives in Plesk vhost_ssl.conf (LocationMatch);
# NOT in .htaccess (SecRuleRemoveById is not permitted in .htaccess on this Plesk build).
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3003/callback [P,L]
  RewriteRule ^auth/google/callback http://localhost:3003/auth/google/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3003/api/$1 [P,L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
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

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3003/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab"
Log "INFO" "Backend running on port 3001 (internal)`n"
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TUC AI LAB CATALOG DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ OAuth credentials found in .env.local"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# TUC AI Lab Catalog Deployment Script
# Deploys frontend (dist/) + backend (server.ts) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TUC AI Lab Catalog Deployment Script
# Deploys frontend (dist/) + backend (server.ts) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/",
    [switch]$Build = $true
)

Log "INFO" "=== TUC AI LAB CATALOG DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ OAuth credentials found in .env.local"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\tuc-ai-lab-catalog' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
# Note: WAF rule 210580 exclusion lives in Plesk vhost_ssl.conf (LocationMatch);
# NOT in .htaccess (SecRuleRemoveById is not permitted in .htaccess on this Plesk build).
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3003/callback [P,L]
  RewriteRule ^auth/google/callback http://localhost:3003/auth/google/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3003/api/$1 [P,L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
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

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3003/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab"
Log "INFO" "Backend running on port 3001 (internal)`n"
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TUC AI LAB CATALOG DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ OAuth credentials found in .env.local"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\tuc-ai-lab-catalog' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
# Note: WAF rule 210580 exclusion lives in Plesk vhost_ssl.conf (LocationMatch);
# NOT in .htaccess (SecRuleRemoveById is not permitted in .htaccess on this Plesk build).
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3003/callback [P,L]
  RewriteRule ^auth/google/callback http://localhost:3003/auth/google/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3003/api/$1 [P,L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
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

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3003/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab"
Log "INFO" "Backend running on port 3001 (internal)`n"
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# TUC AI Lab Catalog Deployment Script
# Deploys frontend (dist/) + backend (server.ts) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TUC AI Lab Catalog Deployment Script
# Deploys frontend (dist/) + backend (server.ts) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/",
    [switch]$Build = $true
)

Log "INFO" "=== TUC AI LAB CATALOG DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ OAuth credentials found in .env.local"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\tuc-ai-lab-catalog' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
# Note: WAF rule 210580 exclusion lives in Plesk vhost_ssl.conf (LocationMatch);
# NOT in .htaccess (SecRuleRemoveById is not permitted in .htaccess on this Plesk build).
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3003/callback [P,L]
  RewriteRule ^auth/google/callback http://localhost:3003/auth/google/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3003/api/$1 [P,L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
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

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3003/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab"
Log "INFO" "Backend running on port 3001 (internal)`n"
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TUC AI LAB CATALOG DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ OAuth credentials found in .env.local"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\tuc-ai-lab-catalog' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
# Note: WAF rule 210580 exclusion lives in Plesk vhost_ssl.conf (LocationMatch);
# NOT in .htaccess (SecRuleRemoveById is not permitted in .htaccess on this Plesk build).
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3003/callback [P,L]
  RewriteRule ^auth/google/callback http://localhost:3003/auth/google/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3003/api/$1 [P,L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
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

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3003/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab"
Log "INFO" "Backend running on port 3001 (internal)`n"
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# TUC AI Lab Catalog Deployment Script
# Deploys frontend (dist/) + backend (server.ts) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# TUC AI Lab Catalog Deployment Script
# Deploys frontend (dist/) + backend (server.ts) with OAuth support

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/",
    [switch]$Build = $true
)

Log "INFO" "=== TUC AI LAB CATALOG DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ OAuth credentials found in .env.local"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\tuc-ai-lab-catalog' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
# Note: WAF rule 210580 exclusion lives in Plesk vhost_ssl.conf (LocationMatch);
# NOT in .htaccess (SecRuleRemoveById is not permitted in .htaccess on this Plesk build).
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3003/callback [P,L]
  RewriteRule ^auth/google/callback http://localhost:3003/auth/google/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3003/api/$1 [P,L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
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

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3003/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab"
Log "INFO" "Backend running on port 3001 (internal)`n"
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== TUC AI LAB CATALOG DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}

$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "VITE_GOOGLE_CLIENT_ID") {
    Log "ERROR" "Error: VITE_GOOGLE_CLIENT_ID missing in .env.local" Red
    exit 1
}

Log "INFO" "✓ OAuth credentials found in .env.local"
# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm run build
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
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\tuc-ai-lab-catalog' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
# Note: WAF rule 210580 exclusion lives in Plesk vhost_ssl.conf (LocationMatch);
# NOT in .htaccess (SecRuleRemoveById is not permitted in .htaccess on this Plesk build).
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3003/callback [P,L]
  RewriteRule ^auth/google/callback http://localhost:3003/auth/google/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3003/api/$1 [P,L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
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

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3003/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab"
Log "INFO" "Backend running on port 3001 (internal)`n"
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --production 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
# Note: WAF rule 210580 exclusion lives in Plesk vhost_ssl.conf (LocationMatch);
# NOT in .htaccess (SecRuleRemoveById is not permitted in .htaccess on this Plesk build).
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ai-lab/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^callback http://localhost:3003/callback [P,L]
  RewriteRule ^auth/google/callback http://localhost:3003/auth/google/callback [P,L]
  RewriteRule ^api/(.*)$ http://localhost:3003/api/$1 [P,L]
  RewriteRule ^ /ai-lab/index.html [QSA,L]
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

Log "INFO" "Copying .env..." Yellow
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

Log "INFO" "Setting permissions..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3003/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 2

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo '✅ Frontend deployed' || echo '❌ Frontend missing'" | Out-Null
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo '✅ Backend deployed' || echo '❌ Backend missing'" | Out-Null

Write-Host ""
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab"
Log "INFO" "Backend running on port 3001 (internal)`n"
Log "SUCCESS" "✅ Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/ai-lab`n"