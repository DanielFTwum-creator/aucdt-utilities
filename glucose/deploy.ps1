# Glucose Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3006) with Gemini proxy

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Glucose Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3006) with Gemini proxy

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/",
    [switch]$Build = $true
)

Log "INFO" "=== GLUCOSE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}
$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "GEMINI_API_KEY") {
    Log "ERROR" "Error: GEMINI_API_KEY missing in .env.local" Red
    exit 1
}
Log "SUCCESS" "OK .env.local validated" Green

# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# Glucose Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3006) with Gemini proxy

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Glucose Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3006) with Gemini proxy

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/",
    [switch]$Build = $true
)

Log "INFO" "=== GLUCOSE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}
$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "GEMINI_API_KEY") {
    Log "ERROR" "Error: GEMINI_API_KEY missing in .env.local" Red
    exit 1
}
Log "SUCCESS" "OK .env.local validated" Green

# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\glucose' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /glucose/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
  RewriteRule ^ /glucose/index.html [QSA,L]
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
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3006/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3006' && echo 'OK Port 3006 listening' || echo 'X Port 3006 NOT listening'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3006/api/health && echo ' (backend health OK)'"

Write-Host ""
Log "SUCCESS" "Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/glucose"
Log "INFO" "Backend port: 3006`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== GLUCOSE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}
$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "GEMINI_API_KEY") {
    Log "ERROR" "Error: GEMINI_API_KEY missing in .env.local" Red
    exit 1
}
Log "SUCCESS" "OK .env.local validated" Green

# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\glucose' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /glucose/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
  RewriteRule ^ /glucose/index.html [QSA,L]
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
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3006/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3006' && echo 'OK Port 3006 listening' || echo 'X Port 3006 NOT listening'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3006/api/health && echo ' (backend health OK)'"

Write-Host ""
Log "SUCCESS" "Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/glucose"
Log "INFO" "Backend port: 3006`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# Glucose Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3006) with Gemini proxy

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Glucose Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3006) with Gemini proxy

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/",
    [switch]$Build = $true
)

Log "INFO" "=== GLUCOSE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}
$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "GEMINI_API_KEY") {
    Log "ERROR" "Error: GEMINI_API_KEY missing in .env.local" Red
    exit 1
}
Log "SUCCESS" "OK .env.local validated" Green

# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\glucose' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /glucose/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
  RewriteRule ^ /glucose/index.html [QSA,L]
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
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3006/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3006' && echo 'OK Port 3006 listening' || echo 'X Port 3006 NOT listening'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3006/api/health && echo ' (backend health OK)'"

Write-Host ""
Log "SUCCESS" "Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/glucose"
Log "INFO" "Backend port: 3006`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== GLUCOSE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}
$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "GEMINI_API_KEY") {
    Log "ERROR" "Error: GEMINI_API_KEY missing in .env.local" Red
    exit 1
}
Log "SUCCESS" "OK .env.local validated" Green

# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\glucose' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /glucose/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
  RewriteRule ^ /glucose/index.html [QSA,L]
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
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3006/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3006' && echo 'OK Port 3006 listening' || echo 'X Port 3006 NOT listening'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3006/api/health && echo ' (backend health OK)'"

Write-Host ""
Log "SUCCESS" "Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/glucose"
Log "INFO" "Backend port: 3006`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# Glucose Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3006) with Gemini proxy

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Glucose Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3006) with Gemini proxy

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/",
    [switch]$Build = $true
)

Log "INFO" "=== GLUCOSE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}
$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "GEMINI_API_KEY") {
    Log "ERROR" "Error: GEMINI_API_KEY missing in .env.local" Red
    exit 1
}
Log "SUCCESS" "OK .env.local validated" Green

# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\glucose' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /glucose/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
  RewriteRule ^ /glucose/index.html [QSA,L]
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
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3006/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3006' && echo 'OK Port 3006 listening' || echo 'X Port 3006 NOT listening'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3006/api/health && echo ' (backend health OK)'"

Write-Host ""
Log "SUCCESS" "Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/glucose"
Log "INFO" "Backend port: 3006`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== GLUCOSE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}
$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "GEMINI_API_KEY") {
    Log "ERROR" "Error: GEMINI_API_KEY missing in .env.local" Red
    exit 1
}
Log "SUCCESS" "OK .env.local validated" Green

# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\glucose' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /glucose/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
  RewriteRule ^ /glucose/index.html [QSA,L]
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
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3006/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3006' && echo 'OK Port 3006 listening' || echo 'X Port 3006 NOT listening'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3006/api/health && echo ' (backend health OK)'"

Write-Host ""
Log "SUCCESS" "Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/glucose"
Log "INFO" "Backend port: 3006`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /glucose/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
  RewriteRule ^ /glucose/index.html [QSA,L]
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
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3006/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3006' && echo 'OK Port 3006 listening' || echo 'X Port 3006 NOT listening'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3006/api/health && echo ' (backend health OK)'"

Write-Host ""
Log "SUCCESS" "Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/glucose"
Log "INFO" "Backend port: 3006`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== GLUCOSE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}
$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "GEMINI_API_KEY") {
    Log "ERROR" "Error: GEMINI_API_KEY missing in .env.local" Red
    exit 1
}
Log "SUCCESS" "OK .env.local validated" Green

# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
# Native PowerShell scp (no WSL bash required)
Get-ChildItem -Path "dist" | ForEach-Object {
    if (# Glucose Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3006) with Gemini proxy

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Glucose Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3006) with Gemini proxy

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/",
    [switch]$Build = $true
)

Log "INFO" "=== GLUCOSE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}
$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "GEMINI_API_KEY") {
    Log "ERROR" "Error: GEMINI_API_KEY missing in .env.local" Red
    exit 1
}
Log "SUCCESS" "OK .env.local validated" Green

# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\glucose' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /glucose/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
  RewriteRule ^ /glucose/index.html [QSA,L]
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
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3006/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3006' && echo 'OK Port 3006 listening' || echo 'X Port 3006 NOT listening'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3006/api/health && echo ' (backend health OK)'"

Write-Host ""
Log "SUCCESS" "Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/glucose"
Log "INFO" "Backend port: 3006`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== GLUCOSE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}
$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "GEMINI_API_KEY") {
    Log "ERROR" "Error: GEMINI_API_KEY missing in .env.local" Red
    exit 1
}
Log "SUCCESS" "OK .env.local validated" Green

# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\glucose' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /glucose/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
  RewriteRule ^ /glucose/index.html [QSA,L]
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
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3006/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3006' && echo 'OK Port 3006 listening' || echo 'X Port 3006 NOT listening'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3006/api/health && echo ' (backend health OK)'"

Write-Host ""
Log "SUCCESS" "Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/glucose"
Log "INFO" "Backend port: 3006`n".PSIsContainer) { scp -r -o StrictHostKeyChecking=no "$(# Glucose Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3006) with Gemini proxy

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Glucose Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3006) with Gemini proxy

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/",
    [switch]$Build = $true
)

Log "INFO" "=== GLUCOSE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}
$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "GEMINI_API_KEY") {
    Log "ERROR" "Error: GEMINI_API_KEY missing in .env.local" Red
    exit 1
}
Log "SUCCESS" "OK .env.local validated" Green

# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\glucose' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /glucose/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
  RewriteRule ^ /glucose/index.html [QSA,L]
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
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3006/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3006' && echo 'OK Port 3006 listening' || echo 'X Port 3006 NOT listening'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3006/api/health && echo ' (backend health OK)'"

Write-Host ""
Log "SUCCESS" "Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/glucose"
Log "INFO" "Backend port: 3006`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== GLUCOSE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}
$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "GEMINI_API_KEY") {
    Log "ERROR" "Error: GEMINI_API_KEY missing in .env.local" Red
    exit 1
}
Log "SUCCESS" "OK .env.local validated" Green

# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\glucose' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /glucose/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
  RewriteRule ^ /glucose/index.html [QSA,L]
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
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3006/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3006' && echo 'OK Port 3006 listening' || echo 'X Port 3006 NOT listening'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3006/api/health && echo ' (backend health OK)'"

Write-Host ""
Log "SUCCESS" "Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/glucose"
Log "INFO" "Backend port: 3006`n".FullName)" "${RemoteHost}:${RemotePath}" }
    else { scp -o StrictHostKeyChecking=no "$(# Glucose Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3006) with Gemini proxy

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/",
    [switch]$Build = $true
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Glucose Deployment Script
# Deploys frontend (dist/) + backend (server.ts on port 3006) with Gemini proxy

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/",
    [switch]$Build = $true
)

Log "INFO" "=== GLUCOSE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}
$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "GEMINI_API_KEY") {
    Log "ERROR" "Error: GEMINI_API_KEY missing in .env.local" Red
    exit 1
}
Log "SUCCESS" "OK .env.local validated" Green

# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\glucose' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /glucose/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
  RewriteRule ^ /glucose/index.html [QSA,L]
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
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3006/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3006' && echo 'OK Port 3006 listening' || echo 'X Port 3006 NOT listening'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3006/api/health && echo ' (backend health OK)'"

Write-Host ""
Log "SUCCESS" "Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/glucose"
Log "INFO" "Backend port: 3006`n"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
Log "INFO" "=== GLUCOSE DEPLOYMENT ===" Cyan
Log "INFO" "Remote: $RemoteHost"
Log "INFO" "Path: $RemotePath`n"
# Validate .env.local
Log "INFO" "Validating .env.local..." Yellow
if (-not (Test-Path "./.env.local")) {
    Log "ERROR" "Error: .env.local not found!" Red
    exit 1
}
$envContent = Get-Content "./.env.local" -Raw
if ($envContent -notmatch "GEMINI_API_KEY") {
    Log "ERROR" "Error: GEMINI_API_KEY missing in .env.local" Red
    exit 1
}
Log "SUCCESS" "OK .env.local validated" Green

# Build if requested
if ($Build) {
    Log "INFO" "Building..." Yellow
    pnpm exec vite build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "Build failed!" Red
        exit 1
    }
}

if (-not (Test-Path "dist")) {
    Log "ERROR" "Error: dist/ not found. Run with -Build flag." Red
    exit 1
}

Log "INFO" "Creating directory..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/* $RemotePath/.htaccess 2>/dev/null || true" | Out-Null

Log "INFO" "Copying frontend files..." Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\glucose' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>&1 | head -20"

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /glucose/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
  RewriteRule ^ /glucose/index.html [QSA,L]
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
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3006/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3006' && echo 'OK Port 3006 listening' || echo 'X Port 3006 NOT listening'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3006/api/health && echo ' (backend health OK)'"

Write-Host ""
Log "SUCCESS" "Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/glucose"
Log "INFO" "Backend port: 3006`n".FullName)" "${RemoteHost}:${RemotePath}" }
}

Log "INFO" "Copying backend files..." Yellow
scp -o StrictHostKeyChecking=no "server.ts" "package.json" "${RemoteHost}:${RemotePath}" 2>&1 | Select-Object -First 5

Log "INFO" "Installing backend dependencies..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev 2>&1 | tail -3" | Out-Null

Log "INFO" "Creating .htaccess..." Yellow
$htaccessContent = @'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /glucose/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteCond %{HTTP:Upgrade} !websocket [NC]
  RewriteCond %{HTTP:Connection} !Upgrade [NC]
  RewriteRule ^api/(.*)$ http://localhost:3006/api/$1 [P,L]
  RewriteRule ^ /glucose/index.html [QSA,L]
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
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null; true" | Out-Null

Log "INFO" "Starting backend server..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3006/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup tsx --transpile-only server.ts > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Start-Sleep -Seconds 3

Log "INFO" "Health checks..." Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'OK Frontend deployed' || echo 'X Frontend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/server.ts && echo 'OK Backend deployed' || echo 'X Backend missing'"
ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3006' && echo 'OK Port 3006 listening' || echo 'X Port 3006 NOT listening'"
ssh -o StrictHostKeyChecking=no $RemoteHost "curl -sS -o /dev/null -w 'HTTP %{http_code}' http://localhost:3006/api/health && echo ' (backend health OK)'"

Write-Host ""
Log "SUCCESS" "Deployment complete!" Green
Log "INFO" "URL: https://ai-tools.techbridge.edu.gh/glucose"
Log "INFO" "Backend port: 3006`n"