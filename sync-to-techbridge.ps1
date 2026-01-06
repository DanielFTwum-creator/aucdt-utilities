# ============================================================================
# Sync Script: AUCDT Utilities → Techbridge University College (PowerShell)
# ============================================================================
# This script syncs recent changes from aucdt-utilities to techbridge fork
# Run this from PowerShell on Windows
# ============================================================================

$ErrorActionPreference = "Stop"

# ============================================================================
# CONFIGURATION
# ============================================================================

$AUCDT_REPO = "C:\Users\DELL\OneDrive\Documents\Downloads\Development\github\aucdt-utilities"
$TECHBRIDGE_REPO = "C:\Users\DELL\OneDrive\Documents\Downloads\Development\github\aucdt-utilities\techbridge-university-college"

# Commits to cherry-pick (in order, excluding merge commits)
$COMMITS_TO_SYNC = @(
    "5b79df543b349ca2ae28a5cd9e80c117824bf57d",  # Phase 1: CLAUDE.md
    "51348cb0f62f3a4de594315e8515c8d6870967c2",  # Phase 2: React app source
    "749156c35155dd81ba2ab5c952030d4072f8f785",  # Phase 3: Testing infrastructure
    "6cd8aed92fe207512fb7c6363b76e662bedadf37",  # Phase 4: README.md
    "dc34208dad9216ff90d07c8a001160a7adedb3d7"   # Phase 5: Final documentation
)

# ============================================================================
# FUNCTIONS
# ============================================================================

function Write-Header {
    param($Message)
    Write-Host "`n============================================================================" -ForegroundColor Blue
    Write-Host $Message -ForegroundColor Blue
    Write-Host "============================================================================`n" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param($Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

# ============================================================================
# PRE-FLIGHT CHECKS
# ============================================================================

Write-Header "Pre-flight Checks"

if (-not (Test-Path "$AUCDT_REPO\.git")) {
    Write-Error "AUCDT repository not found at: $AUCDT_REPO"
    exit 1
}
Write-Success "AUCDT repository found"

if (-not (Test-Path "$TECHBRIDGE_REPO\.git")) {
    Write-Error "Techbridge repository not found at: $TECHBRIDGE_REPO"
    Write-Info "Please create the repository first or update the path in this script"
    exit 1
}
Write-Success "Techbridge repository found"

# ============================================================================
# SETUP REMOTE
# ============================================================================

Write-Header "Setting up Remote"

Set-Location $TECHBRIDGE_REPO

$currentBranch = git branch --show-current
Write-Info "Current branch in Techbridge repo: $currentBranch"

# Check if remote exists
$remotes = git remote
if ($remotes -contains "aucdt") {
    Write-Info "Remote 'aucdt' already exists"
} else {
    Write-Info "Adding AUCDT repository as remote 'aucdt'..."
    git remote add aucdt $AUCDT_REPO
    Write-Success "Remote 'aucdt' added"
}

Write-Info "Fetching changes from AUCDT repository..."
git fetch aucdt
Write-Success "Fetch complete"

# ============================================================================
# CHECK FOR UNCOMMITTED CHANGES
# ============================================================================

Write-Header "Checking Working Directory"

$status = git status --porcelain
if ($status) {
    Write-Warning "You have uncommitted changes in the Techbridge repository"
    Write-Info "Please commit or stash them before continuing"
    Write-Host ""
    git status --short
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Info "Sync cancelled"
        exit 1
    }
}

# ============================================================================
# SYNC COMMITS
# ============================================================================

Write-Header "Syncing Commits from AUCDT to Techbridge"

$syncCount = 0
$failedCount = 0

foreach ($commit in $COMMITS_TO_SYNC) {
    Set-Location $AUCDT_REPO
    $commitMsg = git log --format=%s -n 1 $commit

    Set-Location $TECHBRIDGE_REPO
    Write-Host ""
    Write-Info "Cherry-picking: $commit"
    Write-Host "    Message: $commitMsg"

    try {
        git cherry-pick $commit 2>&1 | Out-Null
        Write-Success "Successfully applied"
        $syncCount++
    } catch {
        Write-Error "Cherry-pick failed - possible conflicts"

        $choice = Read-Host "What would you like to do? (continue/skip/abort)"
        switch ($choice.ToLower()) {
            "continue" {
                Write-Info "Please resolve conflicts manually, then run this script again"
                exit 1
            }
            "skip" {
                git cherry-pick --skip 2>&1 | Out-Null
                Write-Warning "Commit skipped"
                $failedCount++
            }
            default {
                git cherry-pick --abort 2>&1 | Out-Null
                Write-Error "Sync aborted"
                exit 1
            }
        }
    }
}

# ============================================================================
# UPDATE BRANDING
# ============================================================================

Write-Header "Updating Branding (AUCDT → Techbridge)"

$updateBranding = Read-Host "Do you want to update branding? (y/N)"

if ($updateBranding -eq "y" -or $updateBranding -eq "Y") {
    $filesToUpdate = @(
        "README.md",
        "CLAUDE.md",
        "src\App.tsx",
        "package.json",
        "docs\README.md",
        "docs\SRS_ThesisAI_Frontend_Final.md"
    )

    foreach ($file in $filesToUpdate) {
        if (Test-Path $file) {
            Write-Info "Updating $file..."

            $content = Get-Content $file -Raw
            $content = $content -replace "African University College of Digital Technologies", "Techbridge University College"
            $content = $content -replace "AUCDT", "Techbridge"
            $content = $content -replace "aucdt-utilities", "techbridge-university-college"
            Set-Content $file -Value $content

            Write-Success "Updated $file"
        }
    }

    git add .
    $hasChanges = git diff --cached --quiet; $LASTEXITCODE -ne 0

    if ($hasChanges) {
        git commit -m "Update branding from AUCDT to Techbridge University College"
        Write-Success "Branding changes committed"
    } else {
        Write-Info "No branding changes to commit"
    }
} else {
    Write-Info "Skipping branding updates"
}

# ============================================================================
# SUMMARY
# ============================================================================

Write-Header "Sync Summary"

Write-Host ""
Write-Success "Successfully synced: $syncCount commits"
if ($failedCount -gt 0) {
    Write-Warning "Failed/Skipped: $failedCount commits"
}

Write-Host ""
Write-Info "Current status of Techbridge repository:"
git log --oneline -5

Write-Host ""
Write-Header "Next Steps"

Write-Host @"

1. Review the changes:
   cd $TECHBRIDGE_REPO
   git log --oneline -10

2. Test the application:
   pnpm install
   pnpm test
   pnpm build

3. Push to remote (if you have one configured):
   git push origin $currentBranch

"@

Write-Success "Sync complete!"
