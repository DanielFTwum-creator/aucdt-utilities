#!/usr/bin/env pwsh
<#
.SYNOPSIS
Deployment script for Rophe Sugar Logger

.DESCRIPTION
Builds and deploys rophe-sugar-logger to various platforms.

.PARAMETER Action
Build, Docker, or Help

.EXAMPLE
.\deploy.ps1 -Action Build
.\deploy.ps1 -Action Docker
#>

param(
    [ValidateSet('Build', 'Docker', 'Serve', 'Help')]
    [string]$Action = 'Help'
)

function Write-Step {
    param([string]$Message)
    Write-Host "📌 $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Show-Help {
    Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║     Rophe Sugar Logger Deployment Script                       ║
╚════════════════════════════════════════════════════════════════╝

USAGE:
  .\deploy.ps1 -Action <Build|Docker|Serve|Help>

ACTIONS:
  Build     Build the production bundle (generates ./dist/)
  Docker    Build and run Docker container locally
  Serve     Start local development server
  Help      Show this help message

EXAMPLES:
  # Build for production
  .\deploy.ps1 -Action Build

  # Build Docker image and run
  .\deploy.ps1 -Action Docker

  # Start dev server
  .\deploy.ps1 -Action Serve

PREREQUISITES:
  • Node.js 24+ (for Docker: Docker must be installed)
  • pnpm (install: npm install -g pnpm)
  • GEMINI_API_KEY environment variable set

DEPLOYMENT GUIDES:
  See DEPLOY.md for detailed deployment options for:
    • Static hosting (Vercel, Netlify, GitHub Pages)
    • Docker/Docker Compose
    • Traditional servers (Nginx, Apache, Node.js)

"@
}

function Build-App {
    Write-Step "Building rophe-sugar-logger production bundle..."

    if (-not (Test-Path "package.json")) {
        Write-Error-Custom "package.json not found. Run from rophe-sugar-logger directory."
        exit 1
    }

    # Check for GEMINI_API_KEY
    if (-not $env:GEMINI_API_KEY) {
        Write-Info "GEMINI_API_KEY not set. Build will use build-time default."
        Write-Info "Set it before deployment: `$env:GEMINI_API_KEY='your_key'"
    }

    # Install dependencies if needed
    if (-not (Test-Path "node_modules")) {
        Write-Step "Installing dependencies..."
        & pnpm install
        if ($LASTEXITCODE -ne 0) {
            Write-Error-Custom "Dependency installation failed"
            exit 1
        }
    }

    # Build
    Write-Step "Running production build..."
    & pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Build failed"
        exit 1
    }

    Write-Success "Build complete!"
    Write-Host ""
    Write-Host "Distribution files are ready in ./dist/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📊 Build artifacts:" -ForegroundColor Cyan
    if (Test-Path "dist") {
        Get-ChildItem -Path "dist/assets" | Select-Object Name, @{
            Name = 'Size'
            Expression = { '{0:N0} KB' -f ($_.Length / 1024) }
        } | Format-Table -AutoSize
    }

    Write-Host ""
    Write-Host "🚀 Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Deploy ./dist/ to your hosting platform"
    Write-Host "  2. Set GEMINI_API_KEY environment variable at runtime"
    Write-Host "  3. Access app at your deployment URL"
    Write-Host ""
    Write-Host "📖 For detailed deployment instructions, see DEPLOY.md" -ForegroundColor Cyan
}

function Deploy-Docker {
    Write-Step "Building Docker image for rophe-sugar-logger..."

    if (-not (Test-Path "Dockerfile")) {
        Write-Error-Custom "Dockerfile not found. Run from rophe-sugar-logger directory."
        exit 1
    }

    # Check Docker
    try {
        $null = docker --version
    }
    catch {
        Write-Error-Custom "Docker is not installed or not in PATH"
        exit 1
    }

    $imageName = "rophe-sugar-logger:latest"

    if (-not $env:GEMINI_API_KEY) {
        Write-Error-Custom "GEMINI_API_KEY environment variable not set"
        Write-Info "Set it with: `$env:GEMINI_API_KEY='your_key'"
        exit 1
    }

    Write-Step "Building image: $imageName"
    & docker build -t $imageName `
        --build-arg GEMINI_API_KEY=$env:GEMINI_API_KEY `
        .

    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Docker build failed"
        exit 1
    }

    Write-Success "Docker image built!"
    Write-Host ""
    Write-Host "🚀 To run the container:" -ForegroundColor Cyan
    Write-Host "  docker run -p 3000:80 $imageName" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🌐 Then access at: http://localhost:3000" -ForegroundColor Yellow
    Write-Host ""
    Write-Info "On first visit, set your admin password to unlock the app"
}

function Start-DevServer {
    Write-Step "Starting development server..."

    if (-not (Test-Path "package.json")) {
        Write-Error-Custom "package.json not found. Run from rophe-sugar-logger directory."
        exit 1
    }

    # Install dependencies if needed
    if (-not (Test-Path "node_modules")) {
        Write-Step "Installing dependencies..."
        & pnpm install
        if ($LASTEXITCODE -ne 0) {
            Write-Error-Custom "Dependency installation failed"
            exit 1
        }
    }

    if (-not $env:GEMINI_API_KEY) {
        Write-Info "Warning: GEMINI_API_KEY not set. Image upload will not work."
        Write-Info "Set it with: `$env:GEMINI_API_KEY='your_key'"
    }

    Write-Success "Starting dev server (port 3000)..."
    Write-Host ""
    & pnpm dev
}

# Main execution
switch ($Action) {
    'Build' { Build-App }
    'Docker' { Deploy-Docker }
    'Serve' { Start-DevServer }
    'Help' { Show-Help }
    default { Show-Help }
}
