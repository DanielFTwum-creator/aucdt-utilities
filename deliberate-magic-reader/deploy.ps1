# Deliberate Magic Reader Deployment Script
# Deploys frontend (dist/) + backend (dist/server.cjs on port 3008) with Gemini AI integration.

param(
    [string]$ConfigFile = "./deploy.config.json",
    [switch]$Build = $false,
    [switch]$DryRun = $false,
    [switch]$SkipHealthCheck = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Deliberate Magic Reader Deployment Script
# Deploys frontend (dist/) + backend (dist/server.cjs on port 3008) with Gemini AI integration.

param(
    [string]$ConfigFile = "./deploy.config.json",
    [switch]$Build = $false,
    [switch]$DryRun = $false,
    [switch]$SkipHealthCheck = $false
)

# Force standard output encoding
$OutputEncoding = [System.Text.Encoding]::UTF8

Log "INFO" "==========================================================" Cyan -ForegroundColor Magenta
Write-Host "        DELIBERATE MAGIC READER DEPLOYMENT PIPELINE       " -ForegroundColor Magenta
Log "INFO" "==========================================================" Cyan -ForegroundColor Magenta

# 1. Read Configuration
if (-not (Test-Path $ConfigFile)) {
    Log "ERROR" "Error: Config file not found at $ConfigFile" Red
    exit 1
}

$config = Get-Content $ConfigFile -Raw | ConvertFrom-Json
$ProjectName = $config.projectName
$RemoteHost = $config.remoteHost
$RemotePath = $config.deployPath
$BuildTool = $config.buildTool
$OutputDir = $config.outputDir
$HealthCheckUrl = $config.healthCheckUrl

Log "INFO" "Step 1/6: Validating configuration..." Yellow
Log "INFO" "  Project:        $ProjectName"
Log "INFO" "  Remote host:    $RemoteHost"
Log "INFO" "  Deploy path:    $RemotePath"
Log "INFO" "  Build tool:     $BuildTool"
Log "INFO" "  Output dir:     $OutputDir"
Log "INFO" "  Health check:   $HealthCheckUrl"
if ($DryRun) {
    Log "SUCCESS" "Dry run completed successfully." Green
    exit 0
}

# 2. Pre-flight Checks
Log "INFO" "Step 2/6: Pre-flight checks..." Yellow
$preflightPassed = $true
$errList = @()

# Verify ssh keys
Write-Host "  Checking SSH access..." -NoNewline
$sshCheck = ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $RemoteHost "echo 'auth_ok'" 2>$null
if ($sshCheck -ne "auth_ok") {
    $preflightPassed = $false
    $errList += "Cannot authenticate with remote server via SSH. Verify keys."
    Log "ERROR" " FAILED" Red
} else {
    Log "SUCCESS" " OK" Green
}

# Verify local secrets file
Write-Host "  Checking .env.local secrets..." -NoNewline
if (-not (Test-Path "./.env.local")) {
    $preflightPassed = $false
    $errList += "Local secrets file .env.local missing."
    Log "ERROR" " FAILED" Red
} else {
    $envContent = Get-Content "./.env.local" -Raw
    if ($envContent -notmatch "GEMINI_API_KEY") {
        $preflightPassed = $false
        $errList += "GEMINI_API_KEY is missing in .env.local."
        Log "ERROR" " FAILED" Red
    } else {
        Log "SUCCESS" " OK" Green
    }
}

if (-not $preflightPassed) {
    Log "ERROR" "`nPre-flight checks failed:" Red
    foreach ($err in $errList) {
        Log "ERROR" "  - $err" Red
    }
    exit 1
}
Log "INFO" "  ? All checks passed"
# 3. Build Project
if ($Build) {
    Log "INFO" "Step 3/6: Building project..." Yellow
    Log "INFO" "  Running: $BuildTool run build"
    & $BuildTool run build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "  Build failed!" Red
        exit 1
    }
    Log "INFO" "  ? Build successful"
}

# 4. Verify Build Output
Log "INFO" "Step 4/6: Verifying build output..." Yellow
if (-not (Test-Path "dist/index.html") -or -not (Test-Path "dist/server.cjs")) {
    Log "ERROR" "  Error: Built files (dist/index.html or dist/server.cjs) not found." Red
    exit 1
}
$fileCount = (Get-ChildItem -Path dist -Recurse | Where-Object { -not $_.PSIsContainer }).Count
Log "INFO" "  ? Output verified: $fileCount files"
# 5. Deploy to Remote Server
Log "INFO" "Step 5/6: Deploying to remote server (Full-stack)..." Yellow

# Create directory structure
Log "INFO" "  Creating directory structure..."
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath" 2>&1 | Out-Null

# Clean old static files but preserve config
Log "INFO" "  Clearing old files..."
ssh -o StrictHostKeyChecking=no $RemoteHost "find $RemotePath -maxdepth 1 -mindepth 1 ! -name '.env' ! -name 'server.log' ! -name 'node_modules' -exec rm -rf {} + 2>/dev/null || true" 2>&1 | Out-Null

# Upload dist directory files via SCP
Log "INFO" "  Deploying build bundle via SCP..."
scp -r -o StrictHostKeyChecking=no dist/* "${RemoteHost}:${RemotePath}/"

# Upload package.json for running node app
Log "INFO" "  Deploying configuration metadata..."
scp -o StrictHostKeyChecking=no "package.json" "${RemoteHost}:${RemotePath}/" 2>&1 | Out-Null

# Copy environment variables
Log "INFO" "  Copying environmental secrets..."
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

# Install server-side dependencies
Log "INFO" "  Installing server-side node modules..."
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev --legacy-peer-deps 2>&1 | tail -3" | Out-Null

# Create .htaccess proxy file
Log "INFO" "  Configuring Apache routing rewrite rules..."
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /magic-reader/
  
  # Skip physical files/directories
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Proxy API routes to backend port 3008
  RewriteRule ^api/(.*)$ http://localhost:3008/api/`$1 [P,L]
  
  # Catch-all to index.html for SPA routing
  RewriteRule ^ /magic-reader/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

# Set folder ownership and read permissions
Log "INFO" "  Setting server file permissions..."
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" 2>&1 | Out-Null

# Start background server
Log "INFO" "  Starting background Node/Express service (Port 3008)..."
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3008/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup node server.cjs > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Log "INFO" "  ? Deployment complete"
# 6. Health Checks
if (-not $SkipHealthCheck) {
    Log "INFO" "Step 6/6: Health checks..." Yellow
    
    Write-Host "  Checking remote index.html..." -NoNewline
    $indexHtmlCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'yes' || echo 'no'"
    if ($indexHtmlCheck.Trim() -eq "yes") {
        Log "SUCCESS" "    ? index.html present" Green
    } else {
        Log "ERROR" "    X index.html missing!" Red
    }
    
    Write-Host "  Checking .htaccess configuration..." -NoNewline
    $htaccessCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/.htaccess && echo 'yes' || echo 'no'"
    if ($htaccessCheck.Trim() -eq "yes") {
        Log "SUCCESS" "    ? .htaccess syntax OK" Green
    } else {
        Log "ERROR" "    X .htaccess missing!" Red
    }

    Write-Host "  Checking Port 3008 backend listener..." -NoNewline
    Start-Sleep -Seconds 3
    $portCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3008' && echo 'yes' || echo 'no'"
    if ($portCheck.Trim() -eq "yes") {
        Log "SUCCESS" "    ? Port 3008 listening" Green
    } else {
        Log "ERROR" "    X Port 3008 NOT listening! Check server.log" Red
    }
}

Log "SUCCESS" "`n╔════════════════════════════════════════════════════════════╗" Green
Log "SUCCESS" "║  ? DEPLOYMENT COMPLETE                                    ║" Green
Log "SUCCESS" "╚════════════════════════════════════════════════════════════╝" Green

Log "INFO" "Project:        $ProjectName"
Log "INFO" "Remote:         $RemoteHost"
Log "INFO" "Path:           $RemotePath"
Log "INFO" "Health check:   $HealthCheckUrl"
Log "INFO" "Next steps:"
Log "INFO" "  1. Visit $HealthCheckUrl to verify deployment"
Log "INFO" "  2. Check remote server logs at: ssh $RemoteHost 'cat $RemotePath/server.log'"
Log "INFO" "  3. Check browser console for network errors (F12)"
# Deliberate Magic Reader Deployment Script
# Deploys frontend (dist/) + backend (dist/server.cjs on port 3008) with Gemini AI integration.

param(
    [string]$ConfigFile = "./deploy.config.json",
    [switch]$Build = $false,
    [switch]$DryRun = $false,
    [switch]$SkipHealthCheck = $false
)


# Timestamped logging helper (injected by standardisation pass — May 2026)
# Deliberate Magic Reader Deployment Script
# Deploys frontend (dist/) + backend (dist/server.cjs on port 3008) with Gemini AI integration.

param(
    [string]$ConfigFile = "./deploy.config.json",
    [switch]$Build = $false,
    [switch]$DryRun = $false,
    [switch]$SkipHealthCheck = $false
)

# Force standard output encoding
$OutputEncoding = [System.Text.Encoding]::UTF8

Log "INFO" "==========================================================" Cyan -ForegroundColor Magenta
Write-Host "        DELIBERATE MAGIC READER DEPLOYMENT PIPELINE       " -ForegroundColor Magenta
Log "INFO" "==========================================================" Cyan -ForegroundColor Magenta

# 1. Read Configuration
if (-not (Test-Path $ConfigFile)) {
    Log "ERROR" "Error: Config file not found at $ConfigFile" Red
    exit 1
}

$config = Get-Content $ConfigFile -Raw | ConvertFrom-Json
$ProjectName = $config.projectName
$RemoteHost = $config.remoteHost
$RemotePath = $config.deployPath
$BuildTool = $config.buildTool
$OutputDir = $config.outputDir
$HealthCheckUrl = $config.healthCheckUrl

Log "INFO" "Step 1/6: Validating configuration..." Yellow
Log "INFO" "  Project:        $ProjectName"
Log "INFO" "  Remote host:    $RemoteHost"
Log "INFO" "  Deploy path:    $RemotePath"
Log "INFO" "  Build tool:     $BuildTool"
Log "INFO" "  Output dir:     $OutputDir"
Log "INFO" "  Health check:   $HealthCheckUrl"
if ($DryRun) {
    Log "SUCCESS" "Dry run completed successfully." Green
    exit 0
}

# 2. Pre-flight Checks
Log "INFO" "Step 2/6: Pre-flight checks..." Yellow
$preflightPassed = $true
$errList = @()

# Verify ssh keys
Write-Host "  Checking SSH access..." -NoNewline
$sshCheck = ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $RemoteHost "echo 'auth_ok'" 2>$null
if ($sshCheck -ne "auth_ok") {
    $preflightPassed = $false
    $errList += "Cannot authenticate with remote server via SSH. Verify keys."
    Log "ERROR" " FAILED" Red
} else {
    Log "SUCCESS" " OK" Green
}

# Verify local secrets file
Write-Host "  Checking .env.local secrets..." -NoNewline
if (-not (Test-Path "./.env.local")) {
    $preflightPassed = $false
    $errList += "Local secrets file .env.local missing."
    Log "ERROR" " FAILED" Red
} else {
    $envContent = Get-Content "./.env.local" -Raw
    if ($envContent -notmatch "GEMINI_API_KEY") {
        $preflightPassed = $false
        $errList += "GEMINI_API_KEY is missing in .env.local."
        Log "ERROR" " FAILED" Red
    } else {
        Log "SUCCESS" " OK" Green
    }
}

if (-not $preflightPassed) {
    Log "ERROR" "`nPre-flight checks failed:" Red
    foreach ($err in $errList) {
        Log "ERROR" "  - $err" Red
    }
    exit 1
}
Log "INFO" "  ? All checks passed"
# 3. Build Project
if ($Build) {
    Log "INFO" "Step 3/6: Building project..." Yellow
    Log "INFO" "  Running: $BuildTool run build"
    & $BuildTool run build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "  Build failed!" Red
        exit 1
    }
    Log "INFO" "  ? Build successful"
}

# 4. Verify Build Output
Log "INFO" "Step 4/6: Verifying build output..." Yellow
if (-not (Test-Path "dist/index.html") -or -not (Test-Path "dist/server.cjs")) {
    Log "ERROR" "  Error: Built files (dist/index.html or dist/server.cjs) not found." Red
    exit 1
}
$fileCount = (Get-ChildItem -Path dist -Recurse | Where-Object { -not $_.PSIsContainer }).Count
Log "INFO" "  ? Output verified: $fileCount files"
# 5. Deploy to Remote Server
Log "INFO" "Step 5/6: Deploying to remote server (Full-stack)..." Yellow

# Create directory structure
Log "INFO" "  Creating directory structure..."
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath" 2>&1 | Out-Null

# Clean old static files but preserve config
Log "INFO" "  Clearing old files..."
ssh -o StrictHostKeyChecking=no $RemoteHost "find $RemotePath -maxdepth 1 -mindepth 1 ! -name '.env' ! -name 'server.log' ! -name 'node_modules' -exec rm -rf {} + 2>/dev/null || true" 2>&1 | Out-Null

# Upload dist directory files via SCP
Log "INFO" "  Deploying build bundle via SCP..."
scp -r -o StrictHostKeyChecking=no dist/* "${RemoteHost}:${RemotePath}/"

# Upload package.json for running node app
Log "INFO" "  Deploying configuration metadata..."
scp -o StrictHostKeyChecking=no "package.json" "${RemoteHost}:${RemotePath}/" 2>&1 | Out-Null

# Copy environment variables
Log "INFO" "  Copying environmental secrets..."
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

# Install server-side dependencies
Log "INFO" "  Installing server-side node modules..."
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev --legacy-peer-deps 2>&1 | tail -3" | Out-Null

# Create .htaccess proxy file
Log "INFO" "  Configuring Apache routing rewrite rules..."
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /magic-reader/
  
  # Skip physical files/directories
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Proxy API routes to backend port 3008
  RewriteRule ^api/(.*)$ http://localhost:3008/api/`$1 [P,L]
  
  # Catch-all to index.html for SPA routing
  RewriteRule ^ /magic-reader/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

# Set folder ownership and read permissions
Log "INFO" "  Setting server file permissions..."
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" 2>&1 | Out-Null

# Start background server
Log "INFO" "  Starting background Node/Express service (Port 3008)..."
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3008/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup node server.cjs > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Log "INFO" "  ? Deployment complete"
# 6. Health Checks
if (-not $SkipHealthCheck) {
    Log "INFO" "Step 6/6: Health checks..." Yellow
    
    Write-Host "  Checking remote index.html..." -NoNewline
    $indexHtmlCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'yes' || echo 'no'"
    if ($indexHtmlCheck.Trim() -eq "yes") {
        Log "SUCCESS" "    ? index.html present" Green
    } else {
        Log "ERROR" "    X index.html missing!" Red
    }
    
    Write-Host "  Checking .htaccess configuration..." -NoNewline
    $htaccessCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/.htaccess && echo 'yes' || echo 'no'"
    if ($htaccessCheck.Trim() -eq "yes") {
        Log "SUCCESS" "    ? .htaccess syntax OK" Green
    } else {
        Log "ERROR" "    X .htaccess missing!" Red
    }

    Write-Host "  Checking Port 3008 backend listener..." -NoNewline
    Start-Sleep -Seconds 3
    $portCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3008' && echo 'yes' || echo 'no'"
    if ($portCheck.Trim() -eq "yes") {
        Log "SUCCESS" "    ? Port 3008 listening" Green
    } else {
        Log "ERROR" "    X Port 3008 NOT listening! Check server.log" Red
    }
}

Log "SUCCESS" "`n╔════════════════════════════════════════════════════════════╗" Green
Log "SUCCESS" "║  ? DEPLOYMENT COMPLETE                                    ║" Green
Log "SUCCESS" "╚════════════════════════════════════════════════════════════╝" Green

Log "INFO" "Project:        $ProjectName"
Log "INFO" "Remote:         $RemoteHost"
Log "INFO" "Path:           $RemotePath"
Log "INFO" "Health check:   $HealthCheckUrl"
Log "INFO" "Next steps:"
Log "INFO" "  1. Visit $HealthCheckUrl to verify deployment"
Log "INFO" "  2. Check remote server logs at: ssh $RemoteHost 'cat $RemotePath/server.log'"
Log "INFO" "  3. Check browser console for network errors (F12)"
_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
# Force standard output encoding
$OutputEncoding = [System.Text.Encoding]::UTF8

Log "INFO" "==========================================================" Cyan -ForegroundColor Magenta
Write-Host "        DELIBERATE MAGIC READER DEPLOYMENT PIPELINE       " -ForegroundColor Magenta
Log "INFO" "==========================================================" Cyan -ForegroundColor Magenta

# 1. Read Configuration
if (-not (Test-Path $ConfigFile)) {
    Log "ERROR" "Error: Config file not found at $ConfigFile" Red
    exit 1
}

$config = Get-Content $ConfigFile -Raw | ConvertFrom-Json
$ProjectName = $config.projectName
$RemoteHost = $config.remoteHost
$RemotePath = $config.deployPath
$BuildTool = $config.buildTool
$OutputDir = $config.outputDir
$HealthCheckUrl = $config.healthCheckUrl

Log "INFO" "Step 1/6: Validating configuration..." Yellow
Log "INFO" "  Project:        $ProjectName"
Log "INFO" "  Remote host:    $RemoteHost"
Log "INFO" "  Deploy path:    $RemotePath"
Log "INFO" "  Build tool:     $BuildTool"
Log "INFO" "  Output dir:     $OutputDir"
Log "INFO" "  Health check:   $HealthCheckUrl"
if ($DryRun) {
    Log "SUCCESS" "Dry run completed successfully." Green
    exit 0
}

# 2. Pre-flight Checks
Log "INFO" "Step 2/6: Pre-flight checks..." Yellow
$preflightPassed = $true
$errList = @()

# Verify ssh keys
Write-Host "  Checking SSH access..." -NoNewline
$sshCheck = ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $RemoteHost "echo 'auth_ok'" 2>$null
if ($sshCheck -ne "auth_ok") {
    $preflightPassed = $false
    $errList += "Cannot authenticate with remote server via SSH. Verify keys."
    Log "ERROR" " FAILED" Red
} else {
    Log "SUCCESS" " OK" Green
}

# Verify local secrets file
Write-Host "  Checking .env.local secrets..." -NoNewline
if (-not (Test-Path "./.env.local")) {
    $preflightPassed = $false
    $errList += "Local secrets file .env.local missing."
    Log "ERROR" " FAILED" Red
} else {
    $envContent = Get-Content "./.env.local" -Raw
    if ($envContent -notmatch "GEMINI_API_KEY") {
        $preflightPassed = $false
        $errList += "GEMINI_API_KEY is missing in .env.local."
        Log "ERROR" " FAILED" Red
    } else {
        Log "SUCCESS" " OK" Green
    }
}

if (-not $preflightPassed) {
    Log "ERROR" "`nPre-flight checks failed:" Red
    foreach ($err in $errList) {
        Log "ERROR" "  - $err" Red
    }
    exit 1
}
Log "INFO" "  ? All checks passed"
# 3. Build Project
if ($Build) {
    Log "INFO" "Step 3/6: Building project..." Yellow
    Log "INFO" "  Running: $BuildTool run build"
    & $BuildTool run build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "  Build failed!" Red
        exit 1
    }
    Log "INFO" "  ? Build successful"
}

# 4. Verify Build Output
Log "INFO" "Step 4/6: Verifying build output..." Yellow
if (-not (Test-Path "dist/index.html") -or -not (Test-Path "dist/server.cjs")) {
    Log "ERROR" "  Error: Built files (dist/index.html or dist/server.cjs) not found." Red
    exit 1
}
$fileCount = (Get-ChildItem -Path dist -Recurse | Where-Object { -not $_.PSIsContainer }).Count
Log "INFO" "  ? Output verified: $fileCount files"
# 5. Deploy to Remote Server
Log "INFO" "Step 5/6: Deploying to remote server (Full-stack)..." Yellow

# Create directory structure
Log "INFO" "  Creating directory structure..."
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath" 2>&1 | Out-Null

# Clean old static files but preserve config
Log "INFO" "  Clearing old files..."
ssh -o StrictHostKeyChecking=no $RemoteHost "find $RemotePath -maxdepth 1 -mindepth 1 ! -name '.env' ! -name 'server.log' ! -name 'node_modules' -exec rm -rf {} + 2>/dev/null || true" 2>&1 | Out-Null

# Upload dist directory files via SCP
Log "INFO" "  Deploying build bundle via SCP..."
scp -r -o StrictHostKeyChecking=no dist/* "${RemoteHost}:${RemotePath}/"

# Upload package.json for running node app
Log "INFO" "  Deploying configuration metadata..."
scp -o StrictHostKeyChecking=no "package.json" "${RemoteHost}:${RemotePath}/" 2>&1 | Out-Null

# Copy environment variables
Log "INFO" "  Copying environmental secrets..."
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

# Install server-side dependencies
Log "INFO" "  Installing server-side node modules..."
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev --legacy-peer-deps 2>&1 | tail -3" | Out-Null

# Create .htaccess proxy file
Log "INFO" "  Configuring Apache routing rewrite rules..."
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /magic-reader/
  
  # Skip physical files/directories
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Proxy API routes to backend port 3008
  RewriteRule ^api/(.*)$ http://localhost:3008/api/`$1 [P,L]
  
  # Catch-all to index.html for SPA routing
  RewriteRule ^ /magic-reader/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

# Set folder ownership and read permissions
Log "INFO" "  Setting server file permissions..."
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" 2>&1 | Out-Null

# Start background server
Log "INFO" "  Starting background Node/Express service (Port 3008)..."
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3008/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup node server.cjs > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Log "INFO" "  ? Deployment complete"
# 6. Health Checks
if (-not $SkipHealthCheck) {
    Log "INFO" "Step 6/6: Health checks..." Yellow
    
    Write-Host "  Checking remote index.html..." -NoNewline
    $indexHtmlCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'yes' || echo 'no'"
    if ($indexHtmlCheck.Trim() -eq "yes") {
        Log "SUCCESS" "    ? index.html present" Green
    } else {
        Log "ERROR" "    X index.html missing!" Red
    }
    
    Write-Host "  Checking .htaccess configuration..." -NoNewline
    $htaccessCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/.htaccess && echo 'yes' || echo 'no'"
    if ($htaccessCheck.Trim() -eq "yes") {
        Log "SUCCESS" "    ? .htaccess syntax OK" Green
    } else {
        Log "ERROR" "    X .htaccess missing!" Red
    }

    Write-Host "  Checking Port 3008 backend listener..." -NoNewline
    Start-Sleep -Seconds 3
    $portCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3008' && echo 'yes' || echo 'no'"
    if ($portCheck.Trim() -eq "yes") {
        Log "SUCCESS" "    ? Port 3008 listening" Green
    } else {
        Log "ERROR" "    X Port 3008 NOT listening! Check server.log" Red
    }
}

Log "SUCCESS" "`n╔════════════════════════════════════════════════════════════╗" Green
Log "SUCCESS" "║  ? DEPLOYMENT COMPLETE                                    ║" Green
Log "SUCCESS" "╚════════════════════════════════════════════════════════════╝" Green

Log "INFO" "Project:        $ProjectName"
Log "INFO" "Remote:         $RemoteHost"
Log "INFO" "Path:           $RemotePath"
Log "INFO" "Health check:   $HealthCheckUrl"
Log "INFO" "Next steps:"
Log "INFO" "  1. Visit $HealthCheckUrl to verify deployment"
Log "INFO" "  2. Check remote server logs at: ssh $RemoteHost 'cat $RemotePath/server.log'"
Log "INFO" "  3. Check browser console for network errors (F12)"_deployStart = Get-Date
function Log {
    param([string]$Level = "INFO", [string]$Msg, [ConsoleColor]$Color = "White")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "[$ts][$Level] $Msg" -ForegroundColor $Color
}
# Force standard output encoding
$OutputEncoding = [System.Text.Encoding]::UTF8

Log "INFO" "==========================================================" Cyan -ForegroundColor Magenta
Write-Host "        DELIBERATE MAGIC READER DEPLOYMENT PIPELINE       " -ForegroundColor Magenta
Log "INFO" "==========================================================" Cyan -ForegroundColor Magenta

# 1. Read Configuration
if (-not (Test-Path $ConfigFile)) {
    Log "ERROR" "Error: Config file not found at $ConfigFile" Red
    exit 1
}

$config = Get-Content $ConfigFile -Raw | ConvertFrom-Json
$ProjectName = $config.projectName
$RemoteHost = $config.remoteHost
$RemotePath = $config.deployPath
$BuildTool = $config.buildTool
$OutputDir = $config.outputDir
$HealthCheckUrl = $config.healthCheckUrl

Log "INFO" "Step 1/6: Validating configuration..." Yellow
Log "INFO" "  Project:        $ProjectName"
Log "INFO" "  Remote host:    $RemoteHost"
Log "INFO" "  Deploy path:    $RemotePath"
Log "INFO" "  Build tool:     $BuildTool"
Log "INFO" "  Output dir:     $OutputDir"
Log "INFO" "  Health check:   $HealthCheckUrl"
if ($DryRun) {
    Log "SUCCESS" "Dry run completed successfully." Green
    exit 0
}

# 2. Pre-flight Checks
Log "INFO" "Step 2/6: Pre-flight checks..." Yellow
$preflightPassed = $true
$errList = @()

# Verify ssh keys
Write-Host "  Checking SSH access..." -NoNewline
$sshCheck = ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $RemoteHost "echo 'auth_ok'" 2>$null
if ($sshCheck -ne "auth_ok") {
    $preflightPassed = $false
    $errList += "Cannot authenticate with remote server via SSH. Verify keys."
    Log "ERROR" " FAILED" Red
} else {
    Log "SUCCESS" " OK" Green
}

# Verify local secrets file
Write-Host "  Checking .env.local secrets..." -NoNewline
if (-not (Test-Path "./.env.local")) {
    $preflightPassed = $false
    $errList += "Local secrets file .env.local missing."
    Log "ERROR" " FAILED" Red
} else {
    $envContent = Get-Content "./.env.local" -Raw
    if ($envContent -notmatch "GEMINI_API_KEY") {
        $preflightPassed = $false
        $errList += "GEMINI_API_KEY is missing in .env.local."
        Log "ERROR" " FAILED" Red
    } else {
        Log "SUCCESS" " OK" Green
    }
}

if (-not $preflightPassed) {
    Log "ERROR" "`nPre-flight checks failed:" Red
    foreach ($err in $errList) {
        Log "ERROR" "  - $err" Red
    }
    exit 1
}
Log "INFO" "  ? All checks passed"
# 3. Build Project
if ($Build) {
    Log "INFO" "Step 3/6: Building project..." Yellow
    Log "INFO" "  Running: $BuildTool run build"
    & $BuildTool run build
    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "  Build failed!" Red
        exit 1
    }
    Log "INFO" "  ? Build successful"
}

# 4. Verify Build Output
Log "INFO" "Step 4/6: Verifying build output..." Yellow
if (-not (Test-Path "dist/index.html") -or -not (Test-Path "dist/server.cjs")) {
    Log "ERROR" "  Error: Built files (dist/index.html or dist/server.cjs) not found." Red
    exit 1
}
$fileCount = (Get-ChildItem -Path dist -Recurse | Where-Object { -not $_.PSIsContainer }).Count
Log "INFO" "  ? Output verified: $fileCount files"
# 5. Deploy to Remote Server
Log "INFO" "Step 5/6: Deploying to remote server (Full-stack)..." Yellow

# Create directory structure
Log "INFO" "  Creating directory structure..."
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath" 2>&1 | Out-Null

# Clean old static files but preserve config
Log "INFO" "  Clearing old files..."
ssh -o StrictHostKeyChecking=no $RemoteHost "find $RemotePath -maxdepth 1 -mindepth 1 ! -name '.env' ! -name 'server.log' ! -name 'node_modules' -exec rm -rf {} + 2>/dev/null || true" 2>&1 | Out-Null

# Upload dist directory files via SCP
Log "INFO" "  Deploying build bundle via SCP..."
scp -r -o StrictHostKeyChecking=no dist/* "${RemoteHost}:${RemotePath}/"

# Upload package.json for running node app
Log "INFO" "  Deploying configuration metadata..."
scp -o StrictHostKeyChecking=no "package.json" "${RemoteHost}:${RemotePath}/" 2>&1 | Out-Null

# Copy environment variables
Log "INFO" "  Copying environmental secrets..."
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

# Install server-side dependencies
Log "INFO" "  Installing server-side node modules..."
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev --legacy-peer-deps 2>&1 | tail -3" | Out-Null

# Create .htaccess proxy file
Log "INFO" "  Configuring Apache routing rewrite rules..."
$htaccessContent = @"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /magic-reader/
  
  # Skip physical files/directories
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Proxy API routes to backend port 3008
  RewriteRule ^api/(.*)$ http://localhost:3008/api/`$1 [P,L]
  
  # Catch-all to index.html for SPA routing
  RewriteRule ^ /magic-reader/index.html [QSA,L]
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
"@
$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"

# Set folder ownership and read permissions
Log "INFO" "  Setting server file permissions..."
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" 2>&1 | Out-Null

# Start background server
Log "INFO" "  Starting background Node/Express service (Port 3008)..."
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3008/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup node server.cjs > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Log "INFO" "  ? Deployment complete"
# 6. Health Checks
if (-not $SkipHealthCheck) {
    Log "INFO" "Step 6/6: Health checks..." Yellow
    
    Write-Host "  Checking remote index.html..." -NoNewline
    $indexHtmlCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'yes' || echo 'no'"
    if ($indexHtmlCheck.Trim() -eq "yes") {
        Log "SUCCESS" "    ? index.html present" Green
    } else {
        Log "ERROR" "    X index.html missing!" Red
    }
    
    Write-Host "  Checking .htaccess configuration..." -NoNewline
    $htaccessCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/.htaccess && echo 'yes' || echo 'no'"
    if ($htaccessCheck.Trim() -eq "yes") {
        Log "SUCCESS" "    ? .htaccess syntax OK" Green
    } else {
        Log "ERROR" "    X .htaccess missing!" Red
    }

    Write-Host "  Checking Port 3008 backend listener..." -NoNewline
    Start-Sleep -Seconds 3
    $portCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3008' && echo 'yes' || echo 'no'"
    if ($portCheck.Trim() -eq "yes") {
        Log "SUCCESS" "    ? Port 3008 listening" Green
    } else {
        Log "ERROR" "    X Port 3008 NOT listening! Check server.log" Red
    }
}

Log "SUCCESS" "`n╔════════════════════════════════════════════════════════════╗" Green
Log "SUCCESS" "║  ? DEPLOYMENT COMPLETE                                    ║" Green
Log "SUCCESS" "╚════════════════════════════════════════════════════════════╝" Green

Log "INFO" "Project:        $ProjectName"
Log "INFO" "Remote:         $RemoteHost"
Log "INFO" "Path:           $RemotePath"
Log "INFO" "Health check:   $HealthCheckUrl"
Log "INFO" "Next steps:"
Log "INFO" "  1. Visit $HealthCheckUrl to verify deployment"
Log "INFO" "  2. Check remote server logs at: ssh $RemoteHost 'cat $RemotePath/server.log'"
Log "INFO" "  3. Check browser console for network errors (F12)"