# ============================================================
# test-fleet-deploy.ps1
# Fleet compliance test for all deploy.ps1 scripts.
#
# Checks each script against the standard established in
# typing-tutorial/deploy.ps1 after the June 2026 hardening:
#   1. GitHub URL uses SSH (not HTTPS)
#   2. nvm sourcing block present
#   3. SSH deploy key config block present
#   4. nvm block appears BEFORE git clone (ordering)
#   5. Deploy key config appears BEFORE git clone (ordering)
#   6. No duplicate nvm blocks (idempotency)
#   7. PowerShell syntax parses without errors
#
# Usage:
#   .\test-fleet-deploy.ps1              # test all scripts
#   .\test-fleet-deploy.ps1 -Verbose     # show PASS lines too
#   .\test-fleet-deploy.ps1 -Script biochemai\deploy.ps1
#
# Exit code: 0 = all pass, 1 = failures found
# ============================================================

param(
    [string]$Script    = "",           # target a single script (relative path from aucdt-utilities\)
    [switch]$Verbose   = $false        # show PASS lines in output
)

$BASE   = Split-Path $MyInvocation.MyCommand.Path -Parent
$EXEMPT = @(
    "tuc-wms\backend\deploy.ps1"       # Java/Maven/systemd — no Node on server, no GitHub clone
)
$SPECIAL = @(
    "stockpulse\deploy.ps1"            # Local build + SCP; nvm needed for pnpm install via SSH
)

# ---- Helpers ---------------------------------------------------------------

function Write-Result {
    param([string]$Icon, [string]$Status, [string]$Name, [ConsoleColor]$Color)
    Write-Host ("  {0} [{1,-6}] {2}" -f $Icon, $Status, $Name) -ForegroundColor $Color
}

function Test-PSFile {
    param([string]$Path)
    $errors = $null
    $null = [System.Management.Automation.Language.Parser]::ParseFile($Path, [ref]$null, [ref]$errors)
    return $errors.Count -eq 0
}

function Get-LineNumber {
    param([string]$Content, [string]$Pattern)
    $lines = $Content -split "`n"
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match [regex]::Escape($Pattern)) { return $i }
    }
    return -1
}

# ---- Test runners ----------------------------------------------------------

function Invoke-StandardTests {
    param([string]$Rel, [string]$Path, [string]$Content)

    $checks = [ordered]@{
        "No HTTPS GitHub URL"     = $Content -notmatch 'https://github\.com/DanielFTwum-creator'
        "SSH URL correct"         = $Content -match 'git@github\.com:DanielFTwum-creator/aucdt-utilities\.git'
        "nvm block present"       = $Content -match 'NVM_DIR'
        "deploy key config"       = $Content -match 'github_deploy'
        "nvm before git clone"    = $(
                                        # Use 'git clone --' to match both argument orderings
                                        # while excluding log messages like "git clone + pnpm"
                                        $a = $Content.IndexOf('NVM_DIR')
                                        $b = $Content.IndexOf('git clone --')
                                        ($a -gt 0) -and ($b -gt 0) -and ($a -lt $b)
                                    )
        "SSH cfg before git clone"= $(
                                        $a = $Content.IndexOf('github_deploy')
                                        $b = $Content.IndexOf('git clone --')
                                        ($a -gt 0) -and ($b -gt 0) -and ($a -lt $b)
                                    )
        "No duplicate nvm blocks" = ($Content | Select-String -Pattern 'export NVM_DIR' -AllMatches).Matches.Count -eq 1
        "PowerShell syntax valid" = Test-PSFile $Path
    }
    return $checks
}

function Invoke-StockpulseTests {
    param([string]$Rel, [string]$Path, [string]$Content)

    # stockpulse: local build, no GitHub clone on server.
    # Needs nvm for server-side pnpm install and PM2 block.
    $checks = [ordered]@{
        "No HTTPS GitHub URL"          = $Content -notmatch 'https://github\.com/DanielFTwum-creator'
        "nvm in install script"        = $Content -match 'installScript[\s\S]{0,500}NVM_DIR'
        "nvm in PM2 block"             = $Content -match "pm2Cmd[\s\S]{0,200}NVM_DIR"
        "deploy key config present"    = $Content -match 'github_deploy'
        "base64 pipe used for install" = $Content -match 'base64 -d \| bash'
        "PowerShell syntax valid"      = Test-PSFile $Path
    }
    return $checks
}

# ---- Main ------------------------------------------------------------------

$files = Get-ChildItem -Path $BASE -Recurse -Filter "deploy.ps1" | Sort-Object FullName

if ($Script) {
    $target = Join-Path $BASE $Script
    $files = $files | Where-Object { $_.FullName -eq $target }
    if (-not $files) { Write-Host "Script not found: $Script" -ForegroundColor Red; exit 1 }
}

$totalPass = 0; $totalFail = 0; $totalExempt = 0
$failedScripts = @()

Write-Host ""
Write-Host "  FLEET DEPLOY.PS1 COMPLIANCE TEST" -ForegroundColor Cyan
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  |  $($files.Count) scripts" -ForegroundColor DarkGray
Write-Host "  ─────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

foreach ($f in $files) {
    $rel     = $f.FullName.Replace("$BASE\", "")
    $content = [System.IO.File]::ReadAllText($f.FullName)

    # ── Exempt ──
    if ($EXEMPT -contains $rel) {
        Write-Host "  — [EXEMPT] $rel" -ForegroundColor DarkGray
        Write-Host "             Java/Maven — no Node/GitHub clone on server" -ForegroundColor DarkGray
        $totalExempt++
        continue
    }

    # ── Run checks ──
    $checks = if ($SPECIAL -contains $rel) {
        Invoke-StockpulseTests $rel $f.FullName $content
    } else {
        Invoke-StandardTests   $rel $f.FullName $content
    }

    $failed = $checks.GetEnumerator() | Where-Object { -not $_.Value }

    if ($failed.Count -eq 0) {
        $totalPass++
        if ($Verbose) {
            Write-Host "  ✓ [PASS  ] $rel" -ForegroundColor Green
        } else {
            Write-Host "  ✓ [PASS  ] $rel" -ForegroundColor DarkGreen
        }
    } else {
        $totalFail++
        $failedScripts += $rel
        Write-Host "  ✗ [FAIL  ] $rel" -ForegroundColor Red
        foreach ($check in $failed) {
            Write-Host ("             ✗ {0}" -f $check.Key) -ForegroundColor Red
        }
    }
}

# ── Summary ─────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  ─────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ("  PASS: {0,3}   FAIL: {1,3}   EXEMPT: {2,3}   TOTAL: {3,3}" -f `
    $totalPass, $totalFail, $totalExempt, ($totalPass + $totalFail + $totalExempt)) `
    -ForegroundColor $(if ($totalFail -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($totalFail -eq 0) {
    Write-Host "  ALL SCRIPTS COMPLIANT" -ForegroundColor Green
    Write-Host ""
    exit 0
} else {
    Write-Host "  $totalFail SCRIPT(S) FAILED:" -ForegroundColor Red
    $failedScripts | ForEach-Object { Write-Host "    · $_" -ForegroundColor Red }
    Write-Host ""
    exit 1
}
