#!/bin/bash

# AUCDT Portal Testing Suite - Setup Script
# This script automates the setup process

set -e  # Exit on error

echo "================================================"
echo "AUCDT Portal Testing Suite - Setup"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check Node.js installation
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "Please install Node.js v18 or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher required (current: $(node -v))"
    exit 1
fi

print_success "Node.js $(node -v) detected"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

print_success "npm $(npm -v) detected"

# Install dependencies
echo ""
echo "Installing dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Install Playwright browsers
echo ""
echo "Installing Playwright browsers..."
echo "This may take a few minutes..."
if npx playwright install; then
    print_success "Playwright browsers installed successfully"
else
    print_error "Failed to install Playwright browsers"
    exit 1
fi

# Create .env file if it doesn't exist
echo ""
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    print_success ".env file created"
    print_warning "Please edit .env file with your test credentials"
    echo ""
    echo "Edit .env with your preferred editor:"
    echo "  nano .env"
    echo "  or"
    echo "  code .env"
else
    print_warning ".env file already exists"
fi

# Create necessary directories
echo ""
echo "Creating directories..."
mkdir -p test-results/screenshots
mkdir -p test-results/html-report
mkdir -p playwright-report
print_success "Directories created"

# Display next steps
echo ""
echo "================================================"
echo "Setup Complete! 🎉"
echo "================================================"
echo ""
echo "Next Steps:"
echo ""
echo "1. Configure test credentials:"
echo "   ${YELLOW}nano .env${NC}"
echo ""
echo "2. Run your first test:"
echo "   ${GREEN}npm test${NC}"
echo ""
echo "3. Or run in UI mode:"
echo "   ${GREEN}npm run test:ui${NC}"
echo ""
echo "4. View results:"
echo "   ${GREEN}npm run test:report${NC}"
echo ""
echo "For more information, see README.md or QUICKSTART.md"
echo ""
