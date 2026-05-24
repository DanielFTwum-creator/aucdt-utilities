# TUC Project Deployment Script
# Safe deployment pattern using SSH pipe for .htaccess
# Prevents UTF-8 BOM issues and adds comprehensive health checks

param(
    [Parameter(Mandatory=$false)]
    [string]$ConfigFile = "deploy.config.json",
    [switch]$Build = $false,
    [switch]$DryRun = $false,
    [switch]$SkipHealthCheck = $false
)

$ErrorActionPreference = "Stop"

# ============================================================================
# STEP 1/6: Load Configuration
# ============================================================================
Write-Host "Step 1/6: Validating configuration..." -ForegroundColor Cyan

if (-not (Test-Path $ConfigFile)) {
    Write-Host "❌ Configuration file not found: $ConfigFile" -ForegroundColor Red
    exit 1
}

$config = Get-Content $ConfigFile | ConvertFrom-Json

$ProjectName = $config.projectName
$RemoteHost = $config.remoteHost
$DeployPath = $config.deployPath
$BuildTool = if ($config.buildTool) { $config.buildTool } else { "pnpm" }
$OutputDir = if ($config.outputDir) { $config.outputDir } else { "dist" }
$RequiredEnvVars = if ($config.requiredEnvVars) { $config.requiredEnvVars } else { @() }
$HealthCheckUrl = $config.healthCheckUrl

Write-Host "  Project:        $ProjectName"
Write-Host "  Remote host:    $RemoteHost"
Write-Host "  Deploy path:    $DeployPath"
Write-Host "  Build tool:     $BuildTool"
Write-Host "  Output dir:     $OutputDir"
Write-Host "  Health check:   $HealthCheckUrl"
Write-Host ""

# ============================================================================
# STEP 2/6: Pre-flight Checks
# ============================================================================
Write-Host "Step 2/6: Pre-flight checks..." -ForegroundColor Cyan

$preflight_errors = @()

# Check .env files
if ($RequiredEnvVars.Count -gt 0) {
    $envPath = ""
    if (Test-Path ".env.local") {
        $envPath = ".env.local"
    } elseif (Test-Path ".env") {
        $envPath = ".env"
    }

    if ($envPath -eq "") {
        $preflight_errors += "Neither .env.local nor .env found (required for env vars)"
    } else {
        $envContent = Get-Content $envPath
        foreach ($var in $RequiredEnvVars) {
            if ($envContent -notmatch "^$var=") {
                $preflight_errors += "Required env var missing in ${envPath}: $var"
            }
        }
    }
}

# Check package.json
if (-not (Test-Path "package.json")) {
    $preflight_errors += "package.json not found"
} else {
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    if (-not $pkg.scripts.build) {
        $preflight_errors += "No 'build' script defined in package.json"
    }
}

# Check output directory exists (if not building)
if (-not $Build -and -not (Test-Path $OutputDir)) {
    $preflight_errors += "$OutputDir/ not found. Run with -Build flag first."
}

if ($preflight_errors.Count -gt 0) {
    Write-Host "  ❌ Pre-flight checks failed:" -ForegroundColor Red
    foreach ($err in $preflight_errors) {
        Write-Host "     - $err" -ForegroundColor Red
    }
    exit 1
}

Write-Host "  ✅ All checks passed"
Write-Host ""

# ============================================================================
# STEP 3/6: Build Phase
# ============================================================================
if ($Build) {
    Write-Host "Step 3/6: Building project..." -ForegroundColor Cyan

    Write-Host "  Running: $BuildTool build"
    & $BuildTool build

    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ❌ Build failed with exit code $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✅ Build successful"
} else {
    Write-Host "Step 3/6: Skipping build (not requested)" -ForegroundColor Cyan
}
Write-Host ""

# ============================================================================
# STEP 4/6: Verify Build Output
# ============================================================================
Write-Host "Step 4/6: Verifying build output..." -ForegroundColor Cyan

if (-not (Test-Path $OutputDir)) {
    Write-Host "  ❌ Output directory not found: $OutputDir" -ForegroundColor Red
    exit 1
}

$outputFiles = @(Get-ChildItem -Path $OutputDir -File -Recurse)
if ($outputFiles.Count -eq 0) {
    Write-Host "  ❌ Output directory is empty: $OutputDir" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "$OutputDir/index.html")) {
    Write-Host "  ❌ Critical file missing: index.html" -ForegroundColor Red
    exit 1
}

$totalSize = ($outputFiles | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "  ✅ Output verified: $($outputFiles.Count) files, $([Math]::Round($totalSize, 2)) MB"
Write-Host ""

# ============================================================================
# STEP 5/6: Deploy to Remote
# ============================================================================
Write-Host "Step 5/6: Deploying to remote server (SCP-only)..." -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "  🔍 DRY RUN: Would deploy to ${RemoteHost}:${DeployPath}" -ForegroundColor Yellow
} else {
    # Parse remote host format
    $remoteHostParts = $RemoteHost -split "@"
    if ($remoteHostParts.Count -eq 2) {
        $remoteUser = $remoteHostParts[0]
        $remoteServer = $remoteHostParts[1]
        $sshTarget = $RemoteHost
    } else {
        $remoteUser = "root"
        $remoteServer = $RemoteHost
        $sshTarget = "root@$RemoteHost"
    }

    # Create directory structure
    Write-Host "  Creating directory structure..." -ForegroundColor Yellow
    ssh -o StrictHostKeyChecking=no $sshTarget "mkdir -p '$DeployPath'" 2>&1 | Where-Object { $_ -notmatch "already exists" } | ForEach-Object { Write-Host "    $_" }

    if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne 127) {
        Write-Host "  ❌ Failed to create directory on remote" -ForegroundColor Red
        exit 1
    }

    # Clear old files
    Write-Host "  Clearing old deployment..." -ForegroundColor Yellow
    ssh -o StrictHostKeyChecking=no $sshTarget "rm -rf '$DeployPath'/* '$DeployPath'/.htaccess 2>/dev/null || true" | Out-Null

    # Deploy files
    Write-Host "  Deploying files via SCP..." -ForegroundColor Yellow
    $OutputDirPath = (Resolve-Path $OutputDir).Path

    # Gather files to copy, including hidden items like .htaccess
    $items = Get-ChildItem -Path $OutputDirPath -Force
    $filePaths = @()
    foreach ($item in $items) {
        $filePaths += $item.FullName
    }

    if ($filePaths.Count -eq 0) {
        Write-Host "  ❌ No files to deploy in $OutputDirPath" -ForegroundColor Red
        exit 1
    }

    # Run native SCP command to transfer all files/folders in one go
    & scp -r -o StrictHostKeyChecking=no -o ConnectTimeout=30 $filePaths "${sshTarget}:${DeployPath}/"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ❌ File transfer failed" -ForegroundColor Red
        exit 1
    }

    # Create .htaccess via SSH pipe (prevents heredoc/BOM issues)
    Write-Host "  Creating .htaccess..." -ForegroundColor Yellow

    $SubdomainPath = $DeployPath.Split("/")[-1]

    $htaccessContent = "<IfModule mod_rewrite.c>`n" +
                       "  RewriteEngine On`n" +
                       "  RewriteBase /$SubdomainPath/`n" +
                       "  RewriteCond %{REQUEST_FILENAME} -f [OR]`n" +
                       "  RewriteCond %{REQUEST_FILENAME} -d`n" +
                       "  RewriteRule ^ - [L]`n" +
                       "  RewriteRule ^ /$SubdomainPath/index.html [QSA,L]`n" +
                       "</IfModule>"

    $htaccessContent | ssh -o StrictHostKeyChecking=no $sshTarget "cat > '$DeployPath/.htaccess'"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ⚠️  Warning: .htaccess creation may have failed" -ForegroundColor Yellow
    }

    # Set permissions
    Write-Host "  Setting file permissions..." -ForegroundColor Yellow
    ssh -o StrictHostKeyChecking=no $sshTarget "chmod -R 755 '$DeployPath' && chmod 644 '$DeployPath/.htaccess' 2>/dev/null || true" | Out-Null

    Write-Host "  ✅ Deployment complete"
}
Write-Host ""

# ============================================================================
# STEP 6/6: Health Checks
# ============================================================================
if (-not $SkipHealthCheck -and -not $DryRun) {
    Write-Host "Step 6/6: Health checks..." -ForegroundColor Cyan

    $healthCheckPassed = $true

    # Parse remote host format
    $remoteHostParts = $RemoteHost -split "@"
    $sshTarget = if ($remoteHostParts.Count -eq 2) { $RemoteHost } else { "root@$RemoteHost" }

    # Check 1: Remote index.html exists
    Write-Host "  Checking remote index.html..." -ForegroundColor Yellow
    ssh -o StrictHostKeyChecking=no $sshTarget "test -f '$DeployPath/index.html'" 2>&1 | Out-Null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✅ index.html present"
    } else {
        Write-Host "    ❌ index.html missing on remote" -ForegroundColor Red
        $healthCheckPassed = $false
    }

    # Check 2: .htaccess syntax
    Write-Host "  Checking .htaccess syntax..." -ForegroundColor Yellow
    ssh -o StrictHostKeyChecking=no $sshTarget "apache2ctl -t 2>&1 | grep -i syntax" 2>&1 | Out-Null

    if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq 1) {
        Write-Host "    ✅ .htaccess syntax OK"
    } else {
        Write-Host "    ⚠️  Cannot verify .htaccess syntax (apache2ctl not available)" -ForegroundColor Yellow
    }

    # Check 3: HTTP routing test (wait 5 seconds for server)
    Write-Host "  Testing HTTP routing (waiting 5 sec for server)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5

    $httpTest = $null
    try {
        $httpTest = Invoke-WebRequest -Uri $HealthCheckUrl -UseBasicParsing -TimeoutSec 10 -ErrorAction SilentlyContinue
        if ($httpTest.StatusCode -eq 200) {
            Write-Host "    ✅ HTTP 200 OK from $HealthCheckUrl"
        } else {
            Write-Host "    ⚠️  Unexpected status code: $($httpTest.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "    ⚠️  Could not reach health check URL (may be firewall/DNS)" -ForegroundColor Yellow
        Write-Host "       URL: $HealthCheckUrl" -ForegroundColor Yellow
    }

    if ($healthCheckPassed) {
        Write-Host "  ✅ All health checks passed"
    } else {
        Write-Host "  ⚠️  Some health checks failed — review manually" -ForegroundColor Yellow
    }
} else {
    Write-Host "Step 6/6: Skipping health checks" -ForegroundColor Yellow
}
Write-Host ""

# ============================================================================
# Summary
# ============================================================================
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ DEPLOYMENT COMPLETE                                    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Project:        $ProjectName"
Write-Host "Remote:         $RemoteHost"
Write-Host "Path:           $DeployPath"
Write-Host "Health check:   $HealthCheckUrl"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Visit $HealthCheckUrl to verify deployment"
Write-Host "  2. Check browser console for errors (F12)"
Write-Host "  3. Verify .env vars are present on remote"
Write-Host ""
