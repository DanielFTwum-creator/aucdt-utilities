# ============================================================
# DFS Website — Cypress Test Runner (Pattern 13)
# Wraps all Cypress output with HH:mm:ss timestamps.
# Usage:
#   .\run-tests.ps1           — run all suites
#   .\run-tests.ps1 -Suite site
#   .\run-tests.ps1 -Suite book
#   .\run-tests.ps1 -Suite admin
#   .\run-tests.ps1 -Open     — interactive Cypress UI
# ============================================================

param(
    [ValidateSet('all', 'site', 'book', 'admin')]
    [string]$Suite = 'all',
    [switch]$Open
)

$ErrorActionPreference = 'Stop'
$START = Get-Date
$CONFIG = 'cypress.config.js'

function Log($level, $msg, $color = 'White') {
    $ts = (Get-Date).ToString('HH:mm:ss')
    Write-Host "[$ts][$level] $msg" -ForegroundColor $color
}

Log 'INFO' '========================================'  Cyan
Log 'INFO' 'DFS Website — Cypress Test Runner'       Cyan
Log 'INFO' "Suite : $Suite"
Log 'INFO' '========================================'  Cyan

# Open interactive mode
if ($Open) {
    Log 'INFO' 'Opening Cypress UI...' Yellow
    pnpm exec cypress open --config-file $CONFIG
    exit 0
}

# Map suite → spec path
$specs = @{
    'site'  = 'cypress/e2e/site.cy.ts'
    'book'  = 'cypress/e2e/book.cy.ts'
    'admin' = 'cypress/e2e/admin.cy.ts'
}

function Run-Suite($name, $spec) {
    Log 'INFO' "Running suite: $name ($spec)" Yellow
    # Pattern 13: timestamp every line of Cypress output
    if ($spec) {
        pnpm exec cypress run --config-file $CONFIG --spec $spec |
            ForEach-Object { "$((Get-Date).ToString('HH:mm:ss')) $_" }
    } else {
        pnpm exec cypress run --config-file $CONFIG |
            ForEach-Object { "$((Get-Date).ToString('HH:mm:ss')) $_" }
    }
    return $LASTEXITCODE
}

$results = @{}

if ($Suite -eq 'all') {
    foreach ($entry in $specs.GetEnumerator()) {
        $exit = Run-Suite $entry.Key $entry.Value
        $results[$entry.Key] = $exit
        Log 'INFO' "Suite $($entry.Key): exit $exit" $(if ($exit -eq 0) { 'Green' } else { 'Red' })
    }
} else {
    $exit = Run-Suite $Suite $specs[$Suite]
    $results[$Suite] = $exit
}

# Summary
$elapsed = [math]::Round(((Get-Date) - $START).TotalSeconds, 1)
Log 'INFO' '========================================'  Cyan
Log 'INFO' "Test run complete in ${elapsed}s"         Cyan

$passed = ($results.Values | Where-Object { $_ -eq 0 }).Count
$failed = ($results.Values | Where-Object { $_ -ne 0 }).Count

foreach ($r in $results.GetEnumerator()) {
    $status = if ($r.Value -eq 0) { 'PASS' } else { 'FAIL' }
    $color  = if ($r.Value -eq 0) { 'Green' } else { 'Red' }
    Log 'INFO' "  $status  $($r.Key)" $color
}

Log 'INFO' "Passed: $passed  Failed: $failed" $(if ($failed -eq 0) { 'Green' } else { 'Red' })
Log 'INFO' '========================================'  Cyan

if ($failed -gt 0) { exit 1 }
