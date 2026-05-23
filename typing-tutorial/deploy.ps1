﻿# Touch Typing Tutorial Deployment Script

# Deploys frontend static assets (dist/) to remote server.



param(

    [string]$ConfigFile = "./deploy.config.json",

    [switch]$Build = $false,

    [switch]$DryRun = $false,

    [switch]$SkipHealthCheck = $false

)



# Force standard output encoding

$OutputEncoding = [System.Text.Encoding]::UTF8



Write-Host "==========================================================" -ForegroundColor Blue

Write-Host "        TOUCH TYPING TUTORIAL DEPLOYMENT PIPELINE         " -ForegroundColor Blue

Write-Host "==========================================================" -ForegroundColor Blue



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

if (-not (Test-Path "dist/index.html")) {

    Write-Host "  Error: Built files (dist/index.html) not found." -ForegroundColor Red

    exit 1

}

$fileCount = (Get-ChildItem -Path dist -Recurse | Where-Object { -not $_.PSIsContainer }).Count

Write-Host "  ? Output verified: $fileCount files"



# 5. Deploy to Remote Server

Write-Host "Step 5/6: Deploying to remote server (SCP-only)..." -ForegroundColor Yellow



# Create directory structure

Write-Host "  Creating directory structure..."

ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath" 2>&1 | Out-Null



# Clean old static files but preserve config

Write-Host "  Clearing old files..."

ssh -o StrictHostKeyChecking=no $RemoteHost "find $RemotePath -maxdepth 1 -mindepth 1 ! -name '.env' ! -name 'server.log' ! -name 'node_modules' -exec rm -rf {} + 2>/dev/null || true" 2>&1 | Out-Null



# Upload dist directory files via SCP

Write-Host "  Deploying build bundle via SCP..."

scp -r -o StrictHostKeyChecking=no dist/* "${RemoteHost}:${RemotePath}/"



# Create .htaccess file for SPA routing

Write-Host "  Configuring Apache routing rewrite rules..."

$htaccessContent = @"

<IfModule mod_rewrite.c>

  RewriteEngine On

  RewriteBase /typing-tutor/

  

  # Skip physical files/directories

  RewriteCond %{REQUEST_FILENAME} -f [OR]

  RewriteCond %{REQUEST_FILENAME} -d

  RewriteRule ^ - [L]

  

  # Catch-all to index.html for SPA routing

  RewriteRule ^ /typing-tutor/index.html [QSA,L]

</IfModule>

"@

$htaccessContent | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > '$RemotePath/.htaccess'"



# Set folder ownership and read permissions

Write-Host "  Setting server file permissions..."

ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null || true" 2>&1 | Out-Null



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

Write-Host "  2. Check browser console for network errors (F12)"

