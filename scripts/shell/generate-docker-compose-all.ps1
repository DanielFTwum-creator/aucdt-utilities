# PowerShell Docker Compose Generator for All 79 Apps
# Discovers all apps and generates docker-compose.yml

$ErrorActionPreference = 'Stop'

Write-Host "Docker Compose Generator for TUC Utilities" -ForegroundColor Cyan
Write-Host "============================================="

# Discover all apps with package.json
function Discover-Apps {
    Write-Host "Scanning for React apps with package.json..." -ForegroundColor Yellow
    
    $skipDirs = @('docker', 'node_modules', '.github', '.claude', 'Document', '.git', 'dist', 'build', 'coverage')
    $apps = @()
    
    Get-ChildItem -Directory -ErrorAction SilentlyContinue | Where-Object {
        $skipDirs -notcontains $_.Name
    } | ForEach-Object {
        $packageJsonPath = Join-Path $_.FullName 'package.json'
        if (Test-Path $packageJsonPath) {
            try {
                $pkg = Get-Content $packageJsonPath | ConvertFrom-Json -ErrorAction SilentlyContinue
                if ($pkg) {
                    $app = @{
                        Name = $_.Name
                        ContainerName = $_.Name.ToLower() -replace '[^\w-]', '-'
                        Path = $_.FullName
                        HasReact = ($pkg.dependencies.react -or $pkg.devDependencies.react)
                        IsVite = ($pkg.devDependencies.vite)
                        IsExperimental = ($_.Name -match 'ai-|gemini|genie')
                        Package = $pkg
                    }
                    $apps += $app
                }
            } catch {
                # Skip on error
            }
        }
    }
    
    return $apps | Sort-Object Name
}

# Categorize apps
function Categorize-Apps {
    param([array]$Apps)
    
    Write-Host "Categorizing apps..." -ForegroundColor Yellow
    
    $coreApps = @(
        'analytics-refactor',
        'fees-comparison-dashboard',
        'tuc-analytics-dashboard',
        'kanban-app',
        'tuc-website-react',
        'techbridge-product-design-6r-design-portal'
    )
    
    $core = @()
    $standard = @()
    $experimental = @()
    
    $Apps | ForEach-Object {
        if ($coreApps -contains $_.Name) {
            $core += $_
        } elseif ($_.IsExperimental) {
            $experimental += $_
        } else {
            $standard += $_
        }
    }
    
    return @{
        core = $core
        standard = $standard
        experimental = $experimental
    }
}

# Main execution
function Main {
    try {
        # Discover apps
        $apps = Discover-Apps
        Write-Host "Found $($apps.Count) apps" -ForegroundColor Green
        
        # Categorize
        $profiles = Categorize-Apps -Apps $apps
        Write-Host "Core: $($profiles.core.Count) | Standard: $($profiles.standard.Count) | Experimental: $($profiles.experimental.Count)" -ForegroundColor Green
        
        # Build YAML
        $lines = @()
        $lines += "# Generated Docker Compose - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        $lines += "# Total Apps: $($apps.Count)"
        $lines += ""
        $lines += "version: '3.8'"
        $lines += ""
        $lines += "services:"
        $lines += "  nginx-gateway:"
        $lines += "    image: nginx:alpine"
        $lines += "    container_name: tuc-gateway"
        $lines += "    ports:"
        $lines += '      - "8080:80"'
        $lines += "    volumes:"
        $lines += '      - ./docker/nginx/nginx-all-apps.conf:/etc/nginx/conf.d/default.conf:ro'
        $lines += '      - ./docker/nginx/html:/usr/share/nginx/html:ro'
        $lines += "    depends_on:"
        $profiles.core | ForEach-Object {
            $lines += "      - $($_.ContainerName)"
        }
        $lines += "    networks:"
        $lines += "      - tuc-network"
        $lines += "    restart: unless-stopped"
        $lines += "    healthcheck:"
        $lines += '      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]'
        $lines += "      interval: 30s"
        $lines += "      timeout: 10s"
        $lines += "      retries: 3"
        $lines += ""
        
        # Add all apps
        $apps | ForEach-Object {
            $app = $_
            $profile = if ($profiles.core -contains $app) { 'core' }
                      elseif ($profiles.experimental -contains $app) { 'experimental' }
                      else { 'standard' }
            
            $lines += "  $($app.ContainerName):"
            $lines += "    build:"
            $lines += "      context: ./$($app.Name)"
            $lines += "      dockerfile: ../Dockerfile.vite"
            $lines += "    container_name: $($app.ContainerName)"
            $lines += "    environment:"
            $lines += "      NODE_ENV: production"
            $lines += "    networks:"
            $lines += "      - tuc-network"
            $lines += "    restart: unless-stopped"
            $lines += "    healthcheck:"
            $lines += '      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]'
            $lines += "      interval: 30s"
            $lines += "      timeout: 10s"
            $lines += "      retries: 3"
            
            if ($profile -ne 'core') {
                $lines += "    profiles:"
                $lines += "      - $profile"
            }
            $lines += ""
        }
        
        # Add networks
        $lines += "networks:"
        $lines += "  tuc-network:"
        $lines += "    driver: bridge"
        $lines += "    ipam:"
        $lines += "      config:"
        $lines += "        - subnet: 172.20.0.0/16"
        $lines += ""
        $lines += "volumes:"
        $lines += "  node_modules:"
        
        # Write file
        $outputPath = '.\docker-compose-all-apps.yml'
        $lines -join "`n" | Set-Content -Path $outputPath -Encoding UTF8
        
        Write-Host "Generated: $outputPath" -ForegroundColor Green
        Write-Host ""
        Write-Host "Summary:" -ForegroundColor Cyan
        Write-Host "  Total Apps: $($apps.Count)"
        Write-Host "  Vite Apps: $($apps | Where-Object { $_.IsVite } | Measure-Object).Count"
        Write-Host "  React Apps: $($apps | Where-Object { $_.HasReact } | Measure-Object).Count"
        Write-Host "  Experimental: $($profiles.experimental.Count)"
        Write-Host ""
        Write-Host "Usage:" -ForegroundColor Green
        Write-Host "  docker compose -f docker-compose-all-apps.yml up --build"
        
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

Main
