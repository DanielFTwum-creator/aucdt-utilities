# =============================================================
# update-react-version.ps1
# Updates React 19.2.4 → 19.2.5 across the entire monorepo
# Run from: c:\Development\github\aucdt-utilities
# =============================================================

param(
    [string]$Root = "c:\Development\github\aucdt-utilities",
    [string]$OldVer = "19.2.4",
    [string]$NewVer = "19.2.5"
)

$pkgUpdated  = 0
$pkgSkipped  = 0
$mdUpdated   = 0
$pkgLog      = [System.Collections.Generic.List[string]]::new()
$mdLog       = [System.Collections.Generic.List[string]]::new()

Write-Host ""
Write-Host "=============================================="
Write-Host " React Version Upgrade: $OldVer → $NewVer"
Write-Host " Root: $Root"
Write-Host "=============================================="
Write-Host ""

# ------------------------------------------------------------------
# PASS 1 — package.json files
# ------------------------------------------------------------------
Write-Host "[PASS 1] Scanning package.json files..."

$pkgFiles = Get-ChildItem -Path $Root -Recurse -Filter "package.json" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "/node_modules/" }

foreach ($file in $pkgFiles) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }

    if ($content -notmatch [regex]::Escape($OldVer)) {
        $pkgSkipped++
        continue
    }

    # Replace all variant forms: exact, ^, ~
    $newContent = $content `
        -replace [regex]::Escape("`"react`": `"$OldVer`""),           "`"react`": `"$NewVer`"" `
        -replace [regex]::Escape("`"react-dom`": `"$OldVer`""),       "`"react-dom`": `"$NewVer`"" `
        -replace [regex]::Escape("`"@types/react`": `"$OldVer`""),    "`"@types/react`": `"$NewVer`"" `
        -replace [regex]::Escape("`"@types/react-dom`": `"$OldVer`""),"`"@types/react-dom`": `"$NewVer`"" `
        -replace [regex]::Escape("`"react`": `"^$OldVer`""),          "`"react`": `"$NewVer`"" `
        -replace [regex]::Escape("`"react-dom`": `"^$OldVer`""),      "`"react-dom`": `"$NewVer`"" `
        -replace [regex]::Escape("`"react`": `"~$OldVer`""),          "`"react`": `"$NewVer`"" `
        -replace [regex]::Escape("`"react-dom`": `"~$OldVer`""),      "`"react-dom`": `"$NewVer`""

    if ($newContent -ne $content) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline -Encoding UTF8
        $rel = $file.FullName.Replace($Root + "\", "")
        $pkgLog.Add($rel)
        $pkgUpdated++
    }
}

Write-Host "[PASS 1] Done. Updated: $pkgUpdated | Already current / no match: $pkgSkipped"
Write-Host ""

# ------------------------------------------------------------------
# PASS 2 — Markdown & text docs (.md, .txt, .yml, .yaml, .ts, .tsx, .js)
# ------------------------------------------------------------------
Write-Host "[PASS 2] Scanning documentation and source files for version references..."

$docExts = @("*.md", "*.txt", "*.yml", "*.yaml")
$docFiles = foreach ($ext in $docExts) {
    Get-ChildItem -Path $Root -Recurse -Filter $ext -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "\\build\\" -and $_.FullName -notmatch "\\dist\\" }
}

foreach ($file in $docFiles) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    if ($content -notmatch [regex]::Escape($OldVer)) { continue }

    $newContent = $content -replace [regex]::Escape($OldVer), $NewVer

    if ($newContent -ne $content) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline -Encoding UTF8
        $rel = $file.FullName.Replace($Root + "\", "")
        $mdLog.Add($rel)
        $mdUpdated++
    }
}

Write-Host "[PASS 2] Done. Updated: $mdUpdated documentation files"
Write-Host ""

# ------------------------------------------------------------------
# REPORT
# ------------------------------------------------------------------
Write-Host "=============================================="
Write-Host " UPGRADE COMPLETE"
Write-Host "=============================================="
Write-Host ""
Write-Host "package.json files updated : $pkgUpdated"
Write-Host "Documentation files updated: $mdUpdated"
Write-Host "Total files changed        : $($pkgUpdated + $mdUpdated)"
Write-Host ""

if ($pkgLog.Count -gt 0) {
    Write-Host "--- package.json changes ---"
    foreach ($f in $pkgLog) { Write-Host "  [PKG] $f" }
    Write-Host ""
}

if ($mdLog.Count -gt 0) {
    Write-Host "--- Documentation changes ---"
    foreach ($f in $mdLog) { Write-Host "  [DOC] $f" }
    Write-Host ""
}

Write-Host "Next steps:"
Write-Host "  1. Run 'pnpm install' (or npm install) in any changed app to sync lockfiles"
Write-Host "  2. Verify builds:  node scripts/build-serve-screenshot.js --concurrency=2"
Write-Host "  3. Commit:  git add -A && git commit -m 'chore: upgrade React 19.2.4 → 19.2.5 across all projects'"
