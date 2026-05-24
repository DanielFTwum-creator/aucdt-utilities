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

Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host "        DELIBERATE MAGIC READER DEPLOYMENT PIPELINE       " -ForegroundColor Magenta
Write-Host "==========================================================" -ForegroundColor Magenta

# 1. Read Configuration
if (-not (Test-Path $ConfigFile)) {
    Write-Host "Error: Config file not found at $ConfigFile" -ForegroundColor Red
    exit 1
}

$config = Get-Content $ConfigFile -Raw | ConvertFrom-Json
$ProjectName = $config.projectName
$RemoteHost = $config.remoteHost
$RemotePath = $config.deployPath
$BuildTool = $config.buildTool
$OutputDir = $config.outputDir
$HealthCheckUrl = $config.healthCheckUrl

Write-Host "Step 1/6: Validating configuration..." -ForegroundColor Yellow
Write-Host "  Project:        $ProjectName"
Write-Host "  Remote host:    $RemoteHost"
Write-Host "  Deploy path:    $RemotePath"
Write-Host "  Build tool:     $BuildTool"
Write-Host "  Output dir:     $OutputDir"
Write-Host "  Health check:   $HealthCheckUrl"

if ($DryRun) {
    Write-Host "Dry run completed successfully." -ForegroundColor Green
    exit 0
}

# 2. Pre-flight Checks
Write-Host "Step 2/6: Pre-flight checks..." -ForegroundColor Yellow
$preflightPassed = $true
$errList = @()

# Verify ssh keys
Write-Host "  Checking SSH access..." -NoNewline
$sshCheck = ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $RemoteHost "echo 'auth_ok'" 2>$null
if ($sshCheck -ne "auth_ok") {
    $preflightPassed = $false
    $errList += "Cannot authenticate with remote server via SSH. Verify keys."
    Write-Host " FAILED" -ForegroundColor Red
} else {
    Write-Host " OK" -ForegroundColor Green
}

# Verify local secrets file
Write-Host "  Checking .env.local secrets..." -NoNewline
if (-not (Test-Path "./.env.local")) {
    $preflightPassed = $false
    $errList += "Local secrets file .env.local missing."
    Write-Host " FAILED" -ForegroundColor Red
} else {
    $envContent = Get-Content "./.env.local" -Raw
    if ($envContent -notmatch "GEMINI_API_KEY") {
        $preflightPassed = $false
        $errList += "GEMINI_API_KEY is missing in .env.local."
        Write-Host " FAILED" -ForegroundColor Red
    } else {
        Write-Host " OK" -ForegroundColor Green
    }
}

if (-not $preflightPassed) {
    Write-Host "`nPre-flight checks failed:" -ForegroundColor Red
    foreach ($err in $errList) {
        Write-Host "  - $err" -ForegroundColor Red
    }
    exit 1
}
Write-Host "  ? All checks passed"

# 3. Build Project
if ($Build) {
    Write-Host "Step 3/6: Building project..." -ForegroundColor Yellow
    Write-Host "  Running: $BuildTool run build"
    & $BuildTool run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  Build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ? Build successful"
}

# 4. Verify Build Output
Write-Host "Step 4/6: Verifying build output..." -ForegroundColor Yellow
if (-not (Test-Path "dist/index.html") -or -not (Test-Path "dist/server.cjs")) {
    Write-Host "  Error: Built files (dist/index.html or dist/server.cjs) not found." -ForegroundColor Red
    exit 1
}
$fileCount = (Get-ChildItem -Path dist -Recurse | Where-Object { -not $_.PSIsContainer }).Count
Write-Host "  ? Output verified: $fileCount files"

# 5. Deploy to Remote Server
Write-Host "Step 5/6: Deploying to remote server (Full-stack)..." -ForegroundColor Yellow

# Create directory structure
Write-Host "  Creating directory structure..."
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath" 2>&1 | Out-Null

# Clean old static files but preserve config
Write-Host "  Clearing old files..."
ssh -o StrictHostKeyChecking=no $RemoteHost "find $RemotePath -maxdepth 1 -mindepth 1 ! -name '.env' ! -name 'server.log' ! -name 'node_modules' -exec rm -rf {} + 2>/dev/null || true" 2>&1 | Out-Null

# Upload dist directory files via SCP
Write-Host "  Deploying build bundle via SCP..."
scp -r -o StrictHostKeyChecking=no dist/* "${RemoteHost}:${RemotePath}/"

# Upload package.json for running node app
Write-Host "  Deploying configuration metadata..."
scp -o StrictHostKeyChecking=no "package.json" "${RemoteHost}:${RemotePath}/" 2>&1 | Out-Null

# Copy environment variables
Write-Host "  Copying environmental secrets..."
scp -o StrictHostKeyChecking=no ".env.local" "${RemoteHost}:${RemotePath}/.env" 2>&1 | Out-Null

# Install server-side dependencies
Write-Host "  Installing server-side node modules..."
ssh -o StrictHostKeyChecking=no $RemoteHost "cd $RemotePath && npm install --omit=dev --legacy-peer-deps 2>&1 | tail -3" | Out-Null

# Create .htaccess proxy file
Write-Host "  Configuring Apache routing rewrite rules..."
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
Write-Host "  Setting server file permissions..."
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess $RemotePath/.env 2>/dev/null || true" 2>&1 | Out-Null

# Start background server
Write-Host "  Starting background Node/Express service (Port 3008)..."
ssh -o StrictHostKeyChecking=no $RemoteHost "fuser -k 3008/tcp 2>/dev/null ; sleep 1 ; cd $RemotePath && NODE_ENV=production setsid nohup node server.cjs > server.log 2>&1 < /dev/null &" 2>&1 | Out-Null

Write-Host "  ? Deployment complete"

# 6. Health Checks
if (-not $SkipHealthCheck) {
    Write-Host "Step 6/6: Health checks..." -ForegroundColor Yellow
    
    Write-Host "  Checking remote index.html..." -NoNewline
    $indexHtmlCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/index.html && echo 'yes' || echo 'no'"
    if ($indexHtmlCheck.Trim() -eq "yes") {
        Write-Host "    ? index.html present" -ForegroundColor Green
    } else {
        Write-Host "    X index.html missing!" -ForegroundColor Red
    }
    
    Write-Host "  Checking .htaccess configuration..." -NoNewline
    $htaccessCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "test -f $RemotePath/.htaccess && echo 'yes' || echo 'no'"
    if ($htaccessCheck.Trim() -eq "yes") {
        Write-Host "    ? .htaccess syntax OK" -ForegroundColor Green
    } else {
        Write-Host "    X .htaccess missing!" -ForegroundColor Red
    }

    Write-Host "  Checking Port 3008 backend listener..." -NoNewline
    Start-Sleep -Seconds 3
    $portCheck = ssh -o StrictHostKeyChecking=no $RemoteHost "ss -tlnp 2>/dev/null | grep -q ':3008' && echo 'yes' || echo 'no'"
    if ($portCheck.Trim() -eq "yes") {
        Write-Host "    ? Port 3008 listening" -ForegroundColor Green
    } else {
        Write-Host "    X Port 3008 NOT listening! Check server.log" -ForegroundColor Red
    }
}

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ? DEPLOYMENT COMPLETE                                    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "Project:        $ProjectName"
Write-Host "Remote:         $RemoteHost"
Write-Host "Path:           $RemotePath"
Write-Host "Health check:   $HealthCheckUrl"

Write-Host "Next steps:"
Write-Host "  1. Visit $HealthCheckUrl to verify deployment"
Write-Host "  2. Check remote server logs at: ssh $RemoteHost 'cat $RemotePath/server.log'"
Write-Host "  3. Check browser console for network errors (F12)"
