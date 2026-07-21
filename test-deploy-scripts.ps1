# test-deploy-scripts.ps1
# Validates all fleet deploy.ps1 scripts without deploying anything.
# Checks: PS syntax, banner, dotfile block, manifest, staging, secrets gate (B), PM2 --update-env (B), port (B).
#
# Usage:
#   .\test-deploy-scripts.ps1                     # all deploy.ps1 scripts (61 as of 21 Jul 2026)
#   .\test-deploy-scripts.ps1 -Filter "glucose"   # single app
#   .\test-deploy-scripts.ps1 -ShowPass           # show PASS lines too (default: failures only)

param(
    [string]$Filter   = "",
    [switch]$ShowPass = $false
)

$ErrorActionPreference = "Continue"

# ── Backend apps and their expected ports (from SERVER_PORTS.md) ──────────────
$BackendApps = @{
    "markai"                                    = "3000"
    "peace-vinyl"                               = "3001"
    "biochemai"                                 = "3002"
    "tuc-ai-lab-catalog"                        = "3003"
    "groove-streamer"                           = "3004"
    "techbridge-ai-blueprint"                   = "3005"
    "glucose"                                   = "3006"
    "ai-email-drafter"                          = "3007"
    "deliberate-magic-reader"                   = "3008"
    "omniextract"                               = "3009"
    "orbit-walk-reminder"                       = "3010"
    "aucdt-msee-aptitude-test"                  = "3011"
    "dfs-website"                               = "3012"
    "deep-dub-vibes-player"                     = "3013"
    "dmcdai-digital-media-communication-design" = "3014"
    "willpro"                                   = "3015"
    "impact-ventures-dashboard"                 = "3016"
    "tuc-netscan-100"                           = "3017"
    "enhanced-youtube-genie"                    = "3018"
    "playgrow-smart-fun-for-bright-minds"       = "3019"
    "stockpulse"                                = "3020"
    "techbridge-media-club-platform"            = "3022"
    "techbridge-strategy-dashboard"             = "3023"
    "techbridge-technical-quiz-platform"        = "3024"
    "brand-guideline-checker"                   = "3026"
    "techbridge-student-population-register"    = "3027"
    "english-safari"                            = "3028"
    "ai-stand-up-workshop-prep-dashboard"       = "3029"
    "smartscale-ai-presentation-platform"       = "3030"
    "techbridge-poster-studio"                  = "3031"
    "tuc-rms"                                   = "5000"
}

# ── Find scripts ──────────────────────────────────────────────────────────────
$root    = $PSScriptRoot
$scripts = Get-ChildItem -Path $root -Filter "deploy.ps1" -Recurse -Depth 2 |
    Where-Object { $_.FullName -notmatch [regex]::Escape("tuc-wms\backend") } |
    Where-Object { $_.FullName -notmatch [regex]::Escape("tuc-wms\frontend") } |
    Where-Object { $_.FullName -notmatch "test-fleet-deploy" }

if ($Filter) {
    $scripts = $scripts | Where-Object { $_.Directory.Name -like "*$Filter*" }
}

$scripts = $scripts | Sort-Object { $_.Directory.Name }

# ── Header ────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  DEPLOY SCRIPT VALIDATION" -ForegroundColor Cyan
Write-Host "  $($scripts.Count) scripts | root: $root" -ForegroundColor DarkGray
Write-Host ""

$passCount = 0
$failCount = 0
$results   = @()

foreach ($script in $scripts) {
    $folder    = $script.Directory.Name
    $content   = Get-Content $script.FullName -Raw
    $isBackend = $BackendApps.ContainsKey($folder)
    $port      = if ($isBackend) { $BackendApps[$folder] } else { $null }
    $issues    = [System.Collections.Generic.List[string]]::new()

    # 1. PowerShell syntax
    $parseErrors = $null
    $null = [System.Management.Automation.Language.Parser]::ParseFile(
        $script.FullName, [ref]$null, [ref]$parseErrors
    )
    if ($parseErrors.Count -gt 0) {
        $issues.Add("SYNTAX: $($parseErrors[0].Message.Substring(0, [Math]::Min(80, $parseErrors[0].Message.Length)))")
    }

    # 2. Banner
    if ($content -notmatch "DEPLOYMENT") {
        $issues.Add("Missing DEPLOYMENT banner")
    }

    # 3. Dotfile block in .htaccess
    if ($content -notmatch 'FilesMatch.*\^\\\.') {
        $issues.Add("Missing dotfile block in .htaccess")
    }

    # 4. DEPLOYMENT_MANIFEST.json
    if ($content -notmatch "DEPLOYMENT_MANIFEST\.json") {
        $issues.Add("Missing DEPLOYMENT_MANIFEST.json")
    }

    # 5. Staging folder
    if ($content -notmatch "dist-deploy") {
        $issues.Add("Missing dist-deploy staging folder")
    }

    # 6. DryRun switch
    if ($content -notmatch 'DryRun') {
        $issues.Add("Missing -DryRun switch")
    }

    if ($isBackend) {
        # 7. Secrets gate
        if ($content -notmatch '\.env\.secrets\.local') {
            $issues.Add("Missing .env.secrets.local gate")
        }

        # 8. PM2 --update-env
        if ($content -notmatch '--update-env') {
            $issues.Add("Missing PM2 --update-env")
        }

        # 9. Correct port present
        if ($content -notmatch [regex]::Escape($port)) {
            $issues.Add("Expected port $port not found")
        }
    }

    $status = if ($issues.Count -eq 0) { "PASS" } else { "FAIL" }
    if ($status -eq "PASS") { $passCount++ } else { $failCount++ }

    $results += [PSCustomObject]@{
        Folder = $folder
        Type   = if ($isBackend) { "B" } else { "A" }
        Status = $status
        Issues = ($issues -join " | ")
    }
}

# ── Print results ─────────────────────────────────────────────────────────────
foreach ($r in $results) {
    if ($r.Status -eq "PASS" -and -not $ShowPass) { continue }

    $color  = if ($r.Status -eq "PASS") { "Green" } else { "Red" }
    $badge  = if ($r.Status -eq "PASS") { "  " } else { "  " }
    $type   = "[$($r.Type)]"
    $detail = if ($r.Issues) { "`n          $($r.Issues)" } else { "" }

    Write-Host "$badge $($r.Status)  $type  $($r.Folder)$detail" -ForegroundColor $color
}

# ── Summary ───────────────────────────────────────────────────────────────────
Write-Host ""
$summaryColor = if ($failCount -eq 0) { "Green" } else { "Yellow" }
Write-Host "  $passCount passed  |  $failCount failed  |  $($results.Count) total" -ForegroundColor $summaryColor

if ($failCount -eq 0) {
    Write-Host "  All scripts match the standard." -ForegroundColor Green
} else {
    Write-Host "  Run with -ShowPass to see all results." -ForegroundColor DarkGray
}
Write-Host ""

exit $(if ($failCount -gt 0) { 1 } else { 0 })
