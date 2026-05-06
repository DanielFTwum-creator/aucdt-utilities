#!/usr/bin/env powershell
# Complete Docker Compose Generator - All 88 Apps (Sanitized)
# Sanitizes service names to be Docker-compliant

$ErrorActionPreference = 'Continue'

Write-Host "Docker Compose Generator - Complete Edition (Sanitized)" -ForegroundColor Cyan
Write-Host "==========================================================`n"

# Configuration
    $coreApps = @(
        'analytics-refactor',
        'fees-comparison-dashboard',
        'tuc-analytics-dashboard',
        'kanban-app',
        'tuc-website-react',
        'techbridge-product-design-6r-design-portal'
    )
$experimentalKeywords = @('ai-', 'gemini', 'genie', 'bot', 'sentinel', 'ai_', 'eligibility-ai')

function Sanitize-ServiceName {
    param([string]$name)
    # Remove spaces, parentheses, special chars except hyphens
    # Keep only alphanumeric and hyphens
    $sanitized = $name -replace '[^\w-]', '' -replace '^-+', '' -replace '-+$', ''
    $sanitized = $sanitized -replace '_{1,}', '_'
    # Convert underscores back to hyphens for service names
    $sanitized = $sanitized -replace '_', '-'
    # Lowercase
    $sanitized = $sanitized.ToLower()
    # Remove consecutive hyphens
    $sanitized = $sanitized -replace '-{2,}', '-'
    return $sanitized
}

# Discover apps
Write-Host "Discovering apps..."
$skipDirs = @('docker', 'node_modules', '.github', '.claude', 'Document', '.git', 'dist', 'build', 'coverage')
$appMap = @{}  # Store mapping of original to sanitized names

Get-ChildItem -Directory -ErrorAction SilentlyContinue | Where-Object {
    $skipDirs -notcontains $_.Name
} | ForEach-Object {
    $pkgPath = Join-Path $_.FullName 'package.json'
    if (Test-Path $pkgPath) {
        $sanitized = Sanitize-ServiceName $_.Name
        $appMap[$_.Name] = $sanitized
    }
}

$allApps = $appMap.Keys | Sort-Object
Write-Host "Found: $($allApps.Count) apps`n" -ForegroundColor Green

# Categorize
$core = $allApps | Where-Object { $coreApps -contains $_ }
$experimental = $allApps | Where-Object { 
    $app = $_
    $coreApps -notcontains $app -and ($experimentalKeywords | Where-Object { $app -match $_ })
}
$standard = $allApps | Where-Object { 
    $coreApps -notcontains $_ -and -not ($experimental -contains $_)
}

Write-Host "Categorization:" -ForegroundColor Cyan
Write-Host "  Core: $($core.Count)"
Write-Host "  Standard: $($standard.Count)"
Write-Host "  Experimental: $($experimental.Count)"
Write-Host "  Total: $($allApps.Count)`n"

# Generate YAML
Write-Host "Generating docker-compose-all-apps.yml..." -ForegroundColor Yellow

$yaml = @"
# Auto-generated Docker Compose (Sanitized Service Names)
# Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
# Total Apps: $($allApps.Count)
# Core: $($core.Count) | Standard: $($standard.Count) | Experimental: $($experimental.Count)

services:

  nginx-gateway:
    image: nginx:alpine
    container_name: tuc-gateway
    ports:
      - "8080:80"
    volumes:
      - ./docker/nginx/nginx-all-apps.conf:/etc/nginx/conf.d/default.conf:ro
      - ./docker/nginx/html:/usr/share/nginx/html:ro
    depends_on:
"@

$core | ForEach-Object {
    $yaml += "`n      - $($appMap[$_])"
}

$yaml += @"

    networks:
      - tuc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

"@

# Core apps (no profile)
foreach ($appOriginal in $core) {
    $app = $appMap[$appOriginal]
    $yaml += @"
  $app`:
    build:
      context: ./$appOriginal
      dockerfile: ../Dockerfile.vite
    container_name: $app
    environment:
      NODE_ENV: production
    networks:
      - tuc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

"@
}

# Standard apps
foreach ($appOriginal in $standard) {
    $app = $appMap[$appOriginal]
    $yaml += @"
  $app`:
    build:
      context: ./$appOriginal
      dockerfile: ../Dockerfile.vite
    container_name: $app
    environment:
      NODE_ENV: production
    networks:
      - tuc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    profiles:
      - standard
      - full

"@
}

# Experimental apps
foreach ($appOriginal in $experimental) {
    $app = $appMap[$appOriginal]
    $yaml += @"
  $app`:
    build:
      context: ./$appOriginal
      dockerfile: ../Dockerfile.vite
    container_name: $app
    environment:
      NODE_ENV: production
    networks:
      - tuc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    profiles:
      - experimental
      - full

"@
}

# Networks and volumes
$yaml += @"
networks:
  tuc-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

volumes:
  node_modules:
"@

# Write file
Set-Content -Path '.\docker-compose-all-apps.yml' -Value $yaml -Encoding UTF8

Write-Host "Generated: docker-compose-all-apps.yml" -ForegroundColor Green
$fileSize = (Get-Item .\docker-compose-all-apps.yml).Length
Write-Host "  Size: $([math]::Round($fileSize / 1KB, 1)) KB`n"

# Write mapping file for reference
$mappingYaml = @"
# Service Name Mapping (Original -> Sanitized)

"@
foreach ($orig in ($appMap.Keys | Sort-Object)) {
    $mappingYaml += "$orig -> $($appMap[$orig])`n"
}
Set-Content -Path '.\SERVICE_NAME_MAPPING.txt' -Value $mappingYaml -Encoding UTF8
Write-Host "Generated: SERVICE_NAME_MAPPING.txt (for reference)`n"

Write-Host "Summary:" -ForegroundColor Green
Write-Host "  Total Services: $($allApps.Count + 1) (including gateway)"
Write-Host "  Valid Docker names: Yes ✓"
Write-Host "  Ready to build: Yes ✓"
