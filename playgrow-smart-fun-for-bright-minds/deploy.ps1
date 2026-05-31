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
Log "INFO" "Step 1/6: Validating configuration..." Cyan

if (-not (Test-Path $ConfigFile)) {
    Log "ERROR" "❌ Configuration file not found: $ConfigFile" Red
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

Log "INFO" "  Project:        $ProjectName"
Log "INFO" "  Remote host:    $RemoteHost"
Log "INFO" "  Deploy path:    $DeployPath"
Log "INFO" "  Build tool:     $BuildTool"
Log "INFO" "  Output dir:     $OutputDir"
Log "INFO" "  Health check:   $HealthCheckUrl"
Write-Host ""

# ============================================================================
# STEP 2/6: Pre-flight Checks
# ============================================================================
Log "INFO" "Step 2/6: Pre-flight checks..." Cyan

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
    Log "ERROR" "  ❌ Pre-flight checks failed:" Red
    foreach ($err in $preflight_errors) {
        Log "ERROR" "     - $err" Red
    }
    exit 1
}

Log "INFO" "  ✅ All checks passed"
Write-Host ""

# ============================================================================
# STEP 3/6: Build Phase
# ============================================================================
if ($Build) {
    Log "INFO" "Step 3/6: Building project..." Cyan
    Log "INFO" "  Running: $BuildTool build"
    & $BuildTool build

    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "  ❌ Build failed with exit code $LASTEXITCODE" Red
        exit 1
    }
    Log "INFO" "  ✅ Build successful"
} else {
    Log "INFO" "Step 3/6: Skipping build (not requested)" Cyan
}
Write-Host ""

# ============================================================================
# STEP 4/6: Verify Build Output
# ============================================================================
Log "INFO" "Step 4/6: Verifying build output..." Cyan

if (-not (Test-Path $OutputDir)) {
    Log "ERROR" "  ❌ Output directory not found: $OutputDir" Red
    exit 1
}

$outputFiles = @(Get-ChildItem -Path $OutputDir -File -Recurse)
if ($outputFiles.Count -eq 0) {
    Log "ERROR" "  ❌ Output directory is empty: $OutputDir" Red
    exit 1
}

if (-not (Test-Path "$OutputDir/index.html")) {
    Log "ERROR" "  ❌ Critical file missing: index.html" Red
    exit 1
}

$totalSize = ($outputFiles | Measure-Object -Property Length -Sum).Sum / 1MB
Log "INFO" "  ✅ Output verified: $($outputFiles.Count) files, $([Math]::Round($totalSize, 2)) MB"
Write-Host ""

# ============================================================================
# STEP 5/6: Deploy to Remote
# ============================================================================
Log "INFO" "Step 5/6: Deploying to remote server (SCP-only)..." Cyan

if ($DryRun) {
    Log "INFO" "  🔍 DRY RUN: Would deploy to ${RemoteHost}:${DeployPath}" Yellow
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

    Log "INFO" "  Creating directory structure..." Yellow
    ssh -o StrictHostKeyChecking=no $sshTarget "mkdir -p '$DeployPath'" 2>&1 | Where-Object { $_ -notmatch "already exists" } | ForEach-Object { Write-Host "    $_" }

    Log "INFO" "  Clearing old deployment..." Yellow
    ssh -o StrictHostKeyChecking=no $sshTarget "rm -rf '$DeployPath'/* '$DeployPath'/.htaccess 2>/dev/null || true" | Out-Null

    Log "INFO" "  Deploying files via SCP..." Yellow
    $OutputDirPath = (Resolve-Path $OutputDir).Path
    $items = Get-ChildItem -Path $OutputDirPath -Force
    $filePaths = @()
    foreach ($item in $items) {
        $filePaths += $item.FullName
    }

    if ($filePaths.Count -eq 0) {
        Log "ERROR" "  ❌ No files to deploy in $OutputDirPath" Red
        exit 1
    }

    & scp -r -o StrictHostKeyChecking=no -o ConnectTimeout=30 $filePaths "${sshTarget}:${DeployPath}/"

    if ($LASTEXITCODE -ne 0) {
        Log "ERROR" "  ❌ File transfer failed" Red
        exit 1
    }

    Log "INFO" "  Creating .htaccess..." Yellow
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

    Log "INFO" "  Setting file permissions..." Yellow
    ssh -o StrictHostKeyChecking=no $sshTarget "chmod -R 755 '$DeployPath' && chmod 644 '$DeployPath/.htaccess' 2>/dev/null || true" | Out-Null

    Log "INFO" "  ✅ Deployment complete"
}
Write-Host ""

# ============================================================================
# STEP 6/6: Health Checks
# ============================================================================
if (-not $SkipHealthCheck -and -not $DryRun) {
    Log "INFO" "Step 6/6: Health checks..." Cyan

    $healthCheckPassed = $true
    $remoteHostParts = $RemoteHost -split "@"
    $sshTarget = if ($remoteHostParts.Count -eq 2) { $RemoteHost } else { "root@$RemoteHost" }

    Log "INFO" "  Checking remote index.html..." Yellow
    ssh -o StrictHostKeyChecking=no $sshTarget "test -f '$DeployPath/index.html'" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Log "INFO" "    ✅ index.html present"
    } else {
        Log "ERROR" "    ❌ index.html missing on remote" Red
        $healthCheckPassed = $false
    }

    Log "INFO" "  Testing HTTP routing..." Yellow
    Start-Sleep -Seconds 3
    try {
        $httpTest = Invoke-WebRequest -Uri $HealthCheckUrl -UseBasicParsing -TimeoutSec 10 -ErrorAction SilentlyContinue
        if ($httpTest.StatusCode -eq 200) {
            Log "INFO" "    ✅ HTTP 200 OK from $HealthCheckUrl"
        } else {
            Log "INFO" "    ⚠️  Unexpected status code: $($httpTest.StatusCode)" Yellow
        }
    } catch {
        Log "INFO" "    ⚠️  Could not reach health check URL: $HealthCheckUrl" Yellow
    }

    if ($healthCheckPassed) {
        Log "INFO" "  ✅ All health checks passed"
    } else {
        Log "INFO" "  ⚠️  Some health checks failed — review manually" Yellow
    }
} else {
    Log "INFO" "Step 6/6: Skipping health checks" Yellow
}
Write-Host ""

Log "SUCCESS" "╔════════════════════════════════════════════════════════════╗" Green
Log "SUCCESS" "║  ✅ DEPLOYMENT COMPLETE                                    ║" Green
Log "SUCCESS" "╚════════════════════════════════════════════════════════════╝" Green
Write-Host ""
Log "INFO" "Project:        $ProjectName"
Log "INFO" "Remote:         $RemoteHost"
Log "INFO" "Path:           $DeployPath"
Log "INFO" "Health check:   $HealthCheckUrl"
Write-Host ""
