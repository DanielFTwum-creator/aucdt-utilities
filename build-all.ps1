# Build all apps in the monorepo
# Usage: .\build-all.ps1 [--filter "pattern"] [--parallel] [--quiet]

param(
    [string]$filter = "",
    [switch]$parallel = $false,
    [switch]$quiet = $false
)

$rootDir = Get-Location
$buildLog = @()
$errors = @()
$skipped = @()

function Write-Status {
    param([string]$message, [string]$color = "White")
    if (-not $quiet) {
        Write-Host $message -ForegroundColor $color
    }
}

function Test-BuildScript {
    param([string]$packageJson)

    if (-not (Test-Path $packageJson)) {
        return $false
    }

    $content = Get-Content $packageJson -Raw | ConvertFrom-Json
    return $null -ne $content.scripts.build
}

# Discover all buildable apps
$apps = @()
Get-ChildItem -Directory -Path $rootDir | ForEach-Object {
    $appPath = $_.FullName
    $appName = $_.Name
    $packageJson = Join-Path $appPath "package.json"

    if (Test-BuildScript $packageJson) {
        if ($filter -eq "" -or $appName -match $filter) {
            $apps += @{
                Name = $appName
                Path = $appPath
            }
        }
    }
}

if ($apps.Count -eq 0) {
    Write-Status "No buildable apps found." "Yellow"
    exit 0
}

Write-Status "Found $($apps.Count) buildable app(s)`n" "Cyan"

$successCount = 0
$failCount = 0

if ($parallel) {
    Write-Status "Building in parallel mode..." "Cyan"
    $apps | ForEach-Object -Parallel {
        $app = $_
        $appName = $app.Name
        $appPath = $app.Path

        Write-Host "[$appName] Building..." -ForegroundColor "Gray"

        try {
            Push-Location $appPath
            & pnpm install --frozen-lockfile 2>&1 | Out-Null
            & pnpm build 2>&1 | Out-Null
            Write-Host "[$appName] ✓ Success" -ForegroundColor "Green"
            Pop-Location
        } catch {
            Write-Host "[$appName] ✗ Failed: $_" -ForegroundColor "Red"
            Pop-Location
        }
    } -ThrottleLimit 4
} else {
    Write-Status "Building sequentially..." "Cyan"

    foreach ($app in $apps) {
        $appName = $app.Name
        $appPath = $app.Path

        Write-Status "`n► Building: $appName" "Cyan"

        try {
            Push-Location $appPath

            # Install dependencies
            Write-Status "  Installing dependencies..." "Gray"
            & pnpm install --frozen-lockfile 2>&1 | Out-Null
            if ($LASTEXITCODE -ne 0) {
                throw "pnpm install failed"
            }

            # Build
            Write-Status "  Running build..." "Gray"
            & pnpm build 2>&1 | Out-Null
            if ($LASTEXITCODE -ne 0) {
                throw "pnpm build failed"
            }

            Write-Status "  ✓ Success" "Green"
            $buildLog += @{
                App = $appName
                Status = "Success"
            }
            $successCount++

        } catch {
            Write-Status "  ✗ Failed: $_" "Red"
            $errors += $appName
            $failCount++
        } finally {
            Pop-Location
        }
    }
}

# Summary
Write-Status "`n$('='*60)" "White"
Write-Status "BUILD SUMMARY" "Cyan"
Write-Status "$('='*60)" "White"
Write-Status "Total apps:     $($apps.Count)" "White"
Write-Status "Successful:     $successCount" "Green"
if ($failCount -gt 0) {
    Write-Status "Failed:         $failCount" "Red"
    Write-Status "`nFailed apps:" "Red"
    $errors | ForEach-Object { Write-Status "  - $_" "Red" }
}
Write-Status "$('='*60)" "White"

exit $failCount
