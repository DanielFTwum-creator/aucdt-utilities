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
        $envLines = @(Get-Content $envPath)
        foreach ($var in $RequiredEnvVars) {
            $found = $envLines | Where-Object { $_ -match "^$var=" }
            if (-not $found) {
                $preflight_errors += "Required env var missing in ${envPath}: $var"
            }
        }
    }
}

if (-not (Test-Path "package.json")) {
    $preflight_errors += "package.json not found"
} else {
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    if (-not $pkg.scripts.build) {
        $preflight_errors += "No 'build' script defined in package.json"
    }
}

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

    Write-Host "  Creating directory structure..." -ForegroundColor Yellow
    ssh -o StrictHostKeyChecking=no $sshTarget "mkdir -p '$DeployPath'" 2>&1 | Where-Object { $_ -notmatch "already exists" } | ForEach-Object { Write-Host "    $_" }

    Write-Host "  Clearing old deployment..." -ForegroundColor Yellow
    ssh -o StrictHostKeyChecking=no $sshTarget "rm -rf '$DeployPath'/* '$DeployPath'/.htaccess 2>/dev/null || true" | Out-Null

    Write-Host "  Deploying files via SCP..." -ForegroundColor Yellow
    $OutputDirPath = (Resolve-Path $OutputDir).Path
    $items = Get-ChildItem -Path $OutputDirPath -Force
    $filePaths = @()
    foreach ($item in $items) {
        $filePaths += $item.FullName
    }

    if ($filePaths.Count -eq 0) {
        Write-Host "  ❌ No files to deploy in $OutputDirPath" -ForegroundColor Red
        exit 1
    }

    & scp -r -o StrictHostKeyChecking=no -o ConnectTimeout=30 $filePaths "${sshTarget}:${DeployPath}/"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ❌ File transfer failed" -ForegroundColor Red
        exit 1
    }

    Write-Host "  Creating .htaccess..." -ForegroundColor Yellow
    $SubdomainPath = $DeployPath.Split("/")[-1]

    $htaccessContent = "<IfModule mod_rewrite.c>`n" +
                       "  RewriteEngine On`n" +
                       "  RewriteBase /$SubdomainPath/`n" +
                       "  RewriteCond %{REQUEST_FILENAME} -f [OR]`n" +
                       "  RewriteCond %{REQUEST_FILENAME} -d`n" +
                       "  RewriteRule ^ - [L]`n" +
                       "  RewriteRule ^ /$SubdomainPath/index.html [QSA,L]`n" +
                       "</IfModule>`n" +
                       "`n" +
                       "<IfModule mod_expires.c>`n" +
                       "  ExpiresActive On`n" +
                       "  <FilesMatch '\.(js|css|png|jpg|jpeg|gif|svg|woff2|woff|ttf|eot|ico)$'>`n" +
                       "    ExpiresDefault 'max-age=31536000'`n" +
                       "    Header set Cache-Control 'public, immutable'`n" +
                       "  </FilesMatch>`n" +
                       "  <FilesMatch '\.(html|json)$'>`n" +
                       "    ExpiresDefault 'max-age=0'`n" +
                       "    Header set Cache-Control 'public, must-revalidate'`n" +
                       "  </FilesMatch>`n" +
                       "</IfModule>`n" +
                       "`n" +
                       "<IfModule mod_headers.c>`n" +
                       "  <FilesMatch '\.(html)$'>`n" +
                       "    Header set Cache-Control 'public, must-revalidate, max-age=0'`n" +
                       "  </FilesMatch>`n" +
                       "</IfModule>"

    $htaccessContent | ssh -o StrictHostKeyChecking=no $sshTarget "cat > '$DeployPath/.htaccess'"

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
    $remoteHostParts = $RemoteHost -split "@"
    $sshTarget = if ($remoteHostParts.Count -eq 2) { $RemoteHost } else { "root@$RemoteHost" }

    Write-Host "  Checking remote index.html..." -ForegroundColor Yellow
    ssh -o StrictHostKeyChecking=no $sshTarget "test -f '$DeployPath/index.html'" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✅ index.html present"
    } else {
        Write-Host "    ❌ index.html missing on remote" -ForegroundColor Red
        $healthCheckPassed = $false
    }

    Write-Host "  Testing HTTP routing..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    try {
        $httpTest = Invoke-WebRequest -Uri $HealthCheckUrl -UseBasicParsing -TimeoutSec 10 -ErrorAction SilentlyContinue
        if ($httpTest.StatusCode -eq 200) {
            Write-Host "    ✅ HTTP 200 OK from $HealthCheckUrl"
        } else {
            Write-Host "    ⚠️  Unexpected status code: $($httpTest.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "    ⚠️  Could not reach health check URL: $HealthCheckUrl" -ForegroundColor Yellow
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

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ DEPLOYMENT COMPLETE                                    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Project:        $ProjectName"
Write-Host "Remote:         $RemoteHost"
Write-Host "Path:           $DeployPath"
Write-Host "Health check:   $HealthCheckUrl"
Write-Host ""
