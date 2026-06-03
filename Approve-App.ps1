# ============================================================
# Approve-App.ps1 — ai-tools.techbridge.edu.gh pre-deploy gate
# ------------------------------------------------------------
# Validates an app against the failure classes that have taken
# down ai-tools apps. Run from an app folder, or pass -Path.
#
#   .\Approve-App.ps1                 # validate current folder
#   .\Approve-App.ps1 -Path biochemai # validate a sibling app
#   .\Approve-App.ps1 -PreBuild       # skip dist/ checks (no build yet)
#
# Exit 0 = APPROVED (safe to deploy). Exit 1 = REJECTED.
# deploy.ps1 calls this and aborts the deploy on a non-zero exit.
# ============================================================

param(
    [string]$Path = '.',
    [switch]$PreBuild,        # dist/ may not exist yet; skip bundle-content checks
    [int]$Port = 0            # expected port (deploy passes its $PORT for registry/collision checks)
)

$ErrorActionPreference = 'Stop'
$app   = (Resolve-Path $Path).Path
$name  = Split-Path $app -Leaf
$fails = New-Object System.Collections.Generic.List[string]
$warns = New-Object System.Collections.Generic.List[string]

function Pass($m) { Write-Host "  [PASS] $m" -ForegroundColor Green }
function Fail($m) { Write-Host "  [FAIL] $m" -ForegroundColor Red;    $script:fails.Add($m) }
function Warn($m) { Write-Host "  [WARN] $m" -ForegroundColor Yellow; $script:warns.Add($m) }
function Have($glob) { @(Get-ChildItem -Path $app -Filter $glob -File -ErrorAction SilentlyContinue).Count -gt 0 }

# Read text of matching files (recursive, excluding node_modules/dist) into one blob.
function ReadSrc([string[]]$globs) {
    $sb = New-Object System.Text.StringBuilder
    foreach ($g in $globs) {
        Get-ChildItem -Path $app -Filter $g -Recurse -File -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -notmatch '\\node_modules\\|\\dist\\' } |
            ForEach-Object { [void]$sb.AppendLine([IO.File]::ReadAllText($_.FullName)) }
    }
    $sb.ToString()
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " APPROVAL GATE: $name" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# ── 1. SECURITY: no API key / secret baked into the bundle ──
Write-Host "[1] Security — secrets must stay server-side" -ForegroundColor Yellow

$viteCfg = Get-ChildItem -Path $app -Filter 'vite.config.*' -File -ErrorAction SilentlyContinue | Select-Object -First 1
if ($viteCfg) {
    $vc = [IO.File]::ReadAllText($viteCfg.FullName)
    if ($vc -match "JSON\.stringify\(\s*env\.GEMINI_API_KEY") {
        Fail "vite.config injects GEMINI_API_KEY into the bundle (define block) — Google auto-revokes leaked keys"
    } else { Pass "no GEMINI_API_KEY define block in vite.config" }
    if ($vc -match "JSON\.stringify\(\s*env\.GOOGLE_CLIENT_SECRET" -or $vc -match "CLIENT_SECRET'\s*:\s*JSON\.stringify") {
        Fail "vite.config injects GOOGLE_CLIENT_SECRET into the bundle"
    } else { Pass "no client-secret define block in vite.config" }
} else { Warn "no vite.config found (not a Vite app?)" }

# .env must not expose VITE_GEMINI_API_KEY (VITE_ prefix = bundled)
$envText = ''
foreach ($ef in @('.env', '.env.local', '.env.production')) {
    $p = Join-Path $app $ef
    if (Test-Path $p) { $envText += [IO.File]::ReadAllText($p) }
}
if ($envText -match "(?m)^\s*VITE_GEMINI_API_KEY\s*=") {
    Fail "VITE_GEMINI_API_KEY in .env — the VITE_ prefix bakes it into the bundle. Use GEMINI_API_KEY (backend only)."
} else { Pass "no VITE_GEMINI_API_KEY in .env files" }

# Built bundle must contain no live key
if (-not $PreBuild) {
    $dist = Join-Path $app 'dist'
    if (Test-Path $dist) {
        $leak = Get-ChildItem -Path $dist -Recurse -File -Include '*.js','*.html','*.css' -ErrorAction SilentlyContinue |
                Select-String -Pattern 'AIzaSy[A-Za-z0-9_\-]{20,}' -List | Select-Object -First 1
        if ($leak) { Fail "API key (AIzaSy...) found in built bundle: $($leak.Path)" }
        else       { Pass "no API key in dist/ bundle" }
    } else { Warn "dist/ not built yet — bundle leak check skipped (run with -PreBuild to silence)" }
}

# ── 2. SERVER: vite import, Express 5 routes, NODE_ENV ──
Write-Host "[2] Server runtime correctness" -ForegroundColor Yellow

$serverFile = Get-ChildItem -Path $app -Filter 'server.*' -File -ErrorAction SilentlyContinue |
              Where-Object { $_.Name -match '^server\.(ts|js|mjs|cjs)$' } | Select-Object -First 1
if ($serverFile) {
    $srv = [IO.File]::ReadAllText($serverFile.FullName)

    # Static top-level vite import crashes prod after pnpm install --prod
    if ($srv -match "(?m)^\s*import\s+.*\bfrom\s+['""]vite['""]") {
        Fail "$($serverFile.Name): static top-level vite import — crashes prod (ERR_MODULE_NOT_FOUND). Use a dynamic import() inside the dev-only branch."
    } else { Pass "no static top-level vite import in server" }

    # Express 5 / path-to-regexp 8 rejects bare '*'
    if ($srv -match "app\.(get|use|all)\(\s*['""]\*['""]") {
        Fail "$($serverFile.Name): bare '*' route — invalid in Express 5. Use app.get(/.*/) or app.use(fn)."
    } else { Pass "no Express-5-incompatible bare '*' route" }

    # Port should come from env, not hardcoded
    if ($srv -match "process\.env\.PORT") { Pass "server reads process.env.PORT" }
    else { Warn "server does not reference process.env.PORT — may ignore the assigned port" }

    # .js file containing TS syntax (type annotations) → node can't parse it
    if ($serverFile.Extension -eq '.js' -and $srv -match "(?m)(function\s+\w+\s*\([^)]*:\s*\w|:\s*(string|number|boolean|Record<|Request|Response)\b|^\s*interface\s)") {
        Fail "$($serverFile.Name) has TypeScript syntax but a .js extension — rename to .ts and run with tsx"
    } else { Pass "server file extension matches its syntax" }

    # Every bare-package import must be a declared dependency
    $pkgPath = Join-Path $app 'package.json'
    if (Test-Path $pkgPath) {
        $pkg  = Get-Content $pkgPath -Raw | ConvertFrom-Json
        $deps = @()
        if ($pkg.dependencies)    { $deps += $pkg.dependencies.PSObject.Properties.Name }
        if ($pkg.devDependencies) { $deps += $pkg.devDependencies.PSObject.Properties.Name }
        $imports = [regex]::Matches($srv, "(?m)^\s*import\s+(?:.*?\s+from\s+)?['""]([^.][^'""]*)['""]") |
                   ForEach-Object { $_.Groups[1].Value }
        $missing = @()
        foreach ($imp in ($imports | Sort-Object -Unique)) {
            if ($imp -match '^node:') { continue }
            $base = if ($imp.StartsWith('@')) { ($imp -split '/')[0..1] -join '/' } else { ($imp -split '/')[0] }
            $builtin = @('fs','path','url','crypto','http','https','os','stream','util','events','child_process','buffer','zlib','net','dns')
            if ($builtin -contains $base) { continue }
            if ($deps -notcontains $base) { $missing += $base }
        }
        if ($missing.Count) { Fail "server imports not in package.json dependencies: $($missing -join ', ')" }
        else { Pass "all server imports are declared dependencies" }
    }
} else { Warn "no server file (static-only app?) — server checks skipped" }

# deploy.ps1 must start pm2 with NODE_ENV=production
$deploy = Join-Path $app 'deploy.ps1'
if (Test-Path $deploy) {
    $dp = [IO.File]::ReadAllText($deploy)
    if ($dp -match "pm2 start") {
        if ($dp -match "NODE_ENV=production[^\n]*pm2 start") { Pass "deploy starts pm2 with NODE_ENV=production" }
        else { Fail "deploy.ps1 pm2 start is missing NODE_ENV=production (server will run in dev mode / crash on vite)" }
    }
    # workspace must be copied to deploy path for the prod install's allowBuilds
    if ((Have 'pnpm-workspace.yaml') -and $dp -match "pnpm install --prod" -and $dp -notmatch "pnpm-workspace\.yaml") {
        Fail "deploy copies backend files but NOT pnpm-workspace.yaml — prod install can prompt-then-fail on build scripts"
    }
} else { Warn "no deploy.ps1 in app folder" }

# ── 3. INFRA: pnpm-only, workspace allowlist sane ──
Write-Host "[3] Package manager & build config" -ForegroundColor Yellow

if (Have 'package-lock.json') { Fail "package-lock.json present — pnpm-only policy (delete it)" }
else { Pass "no package-lock.json (pnpm-only)" }

$ws = Join-Path $app 'pnpm-workspace.yaml'
if (Test-Path $ws) {
    $wsTxt = [IO.File]::ReadAllText($ws)
    if ($wsTxt -match "set this to true or false") {
        Fail "pnpm-workspace.yaml has placeholder 'set this to true or false' — pnpm ignores it and prompts-then-fails. Use true/false booleans."
    } else { Pass "pnpm-workspace.yaml allowBuilds has no placeholder strings" }
}

# ── Verdict ──
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($fails.Count -eq 0) {
    Write-Host " APPROVED — $name is safe to deploy" -ForegroundColor Green
    if ($warns.Count) { Write-Host " ($($warns.Count) warning(s) — review but non-blocking)" -ForegroundColor Yellow }
    Write-Host "========================================" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host " REJECTED — $($fails.Count) blocking issue(s):" -ForegroundColor Red
    $fails | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    Write-Host "========================================" -ForegroundColor Cyan
    exit 1
}
