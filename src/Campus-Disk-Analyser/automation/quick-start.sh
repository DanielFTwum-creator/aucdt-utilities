#!/bin/bash

# Lab Automation Quick Start Script
# Sets up automated disk analysis for Windows/macOS mixed lab environment

set -e  # Exit on any error

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/config.json"
LOG_FILE="$SCRIPT_DIR/quick-start-$(date +%Y%m%d-%H%M%S).log"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Logging function
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$level" in
        "ERROR")   echo -e "${RED}[ERROR]${NC} $message" >&2 ;;
        "WARNING") echo -e "${YELLOW}[WARNING]${NC} $message" ;;
        "SUCCESS") echo -e "${GREEN}[SUCCESS]${NC} $message" ;;
        "INFO")    echo -e "${BLUE}[INFO]${NC} $message" ;;
        "STEP")    echo -e "${CYAN}${BOLD}[STEP]${NC} $message" ;;
        *)         echo "$message" ;;
    esac
    
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# Display banner
show_banner() {
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════╗
║                    LAB AUTOMATION SETUP                     ║
║              Automated Disk Analysis System                 ║
║                  Windows & macOS Support                    ║
╚══════════════════════════════════════════════════════════════╝
EOF
}

# Check if running on macOS or Linux
check_platform() {
    case "$(uname)" in
        "Darwin")
            PLATFORM="macos"
            log "INFO" "Detected macOS platform"
            ;;
        "Linux")
            PLATFORM="linux"
            log "INFO" "Detected Linux platform"
            ;;
        *)
            PLATFORM="unknown"
            log "WARNING" "Unknown platform: $(uname)"
            ;;
    esac
}

# Check prerequisites
check_prerequisites() {
    log "STEP" "Checking prerequisites..."
    
    local missing_deps=()
    
    # Check bash
    if ! command -v bash >/dev/null 2>&1; then
        missing_deps+=("bash")
    fi
    
    # Check python3
    if ! command -v python3 >/dev/null 2>&1; then
        missing_deps+=("python3")
    fi
    
    # Check ssh
    if ! command -v ssh >/dev/null 2>&1; then
        missing_deps+=("ssh")
    fi
    
    # Check curl
    if ! command -v curl >/dev/null 2>&1; then
        missing_deps+=("curl")
    fi
    
    # Platform-specific checks
    if [[ "$PLATFORM" == "macos" ]]; then
        # Check if we can write to /usr/local/bin
        if [[ ! -w "/usr/local/bin" ]]; then
            log "WARNING" "/usr/local/bin not writable - will need sudo for installation"
        fi
    fi
    
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        log "ERROR" "Missing dependencies: ${missing_deps[*]}"
        log "INFO" "Please install missing dependencies and run again"
        return 1
    fi
    
    log "SUCCESS" "All prerequisites satisfied"
    return 0
}

# Interactive configuration
interactive_config() {
    log "STEP" "Setting up configuration..."
    
    # Copy template if config doesn't exist
    if [[ ! -f "$CONFIG_FILE" ]]; then
        if [[ -f "$SCRIPT_DIR/config-template.json" ]]; then
            cp "$SCRIPT_DIR/config-template.json" "$CONFIG_FILE"
            log "INFO" "Created configuration from template"
        else
            log "ERROR" "Configuration template not found"
            return 1
        fi
    fi
    
    echo
    echo -e "${BOLD}Configuration Setup${NC}"
    echo "==================="
    
    # Get basic settings
    echo -n "Enter your domain/organization name [yourdomain.com]: "
    read -r domain
    domain=${domain:-"yourdomain.com"}
    
    echo -n "Enter admin email address [admin@$domain]: "
    read -r admin_email
    admin_email=${admin_email:-"admin@$domain"}
    
    echo -n "Enter central share path [/shared/disk-analysis]: "
    read -r central_share
    central_share=${central_share:-"/shared/disk-analysis"}
    
    echo -n "Enable email notifications? (y/N): "
    read -r enable_email
    enable_email=${enable_email:-"n"}
    
    # Update configuration (basic replacement - in production use jq)
    if command -v jq >/dev/null 2>&1; then
        # Use jq for proper JSON manipulation
        temp_config=$(mktemp)
        jq --arg domain "$domain" \
           --arg email "$admin_email" \
           --arg share "$central_share" \
           --argjson email_enabled "$([ "$enable_email" = "y" ] && echo true || echo false)" \
           '.notifications.email.recipients[0] = $email |
            .notifications.email.enabled = $email_enabled |
            .central_collection.data_directories[0] = $share |
            .windows.central_share = $share |
            .macos.central_share = $share' \
           "$CONFIG_FILE" > "$temp_config"
        mv "$temp_config" "$CONFIG_FILE"
        log "SUCCESS" "Configuration updated with jq"
    else
        # Basic sed replacement
        sed -i.bak "s/yourdomain.com/$domain/g" "$CONFIG_FILE"
        sed -i.bak "s/admin@yourdomain.com/$admin_email/g" "$CONFIG_FILE"
        log "SUCCESS" "Configuration updated with sed"
    fi
    
    log "INFO" "Configuration saved to: $CONFIG_FILE"
}

# Setup directories
setup_directories() {
    log "STEP" "Setting up directories..."
    
    local directories=(
        "$HOME/LabAutomation"
        "$HOME/LabAutomation/logs"
        "$HOME/LabAutomation/config"
        "$HOME/LabAutomation/scripts"
    )
    
    for dir in "${directories[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            log "INFO" "Created directory: $dir"
        fi
    done
    
    # Copy scripts to installation directory
    local scripts=(
        "enhanced-disk-analyser.sh"
        "test-enhanced-disk-analyser.sh"
        "macos/automated-disk-monitor.sh"
        "windows/automated-disk-monitor.ps1"
        "central/lab-data-collector.py"
    )
    
    for script in "${scripts[@]}"; do
        if [[ -f "$SCRIPT_DIR/../$script" ]]; then
            cp "$SCRIPT_DIR/../$script" "$HOME/LabAutomation/scripts/"
            log "INFO" "Copied script: $script"
        fi
    done
    
    # Copy configuration
    cp "$CONFIG_FILE" "$HOME/LabAutomation/config/"
    
    log "SUCCESS" "Directory structure created"
}

# Test disk analyzer
test_disk_analyzer() {
    log "STEP" "Testing disk analyzer..."
    
    local test_script=""
    if [[ "$PLATFORM" == "macos" ]]; then
        test_script="$HOME/LabAutomation/scripts/test-enhanced-disk-analyser.sh"
    else
        test_script="$HOME/LabAutomation/scripts/enhanced-disk-analyser.sh"
    fi
    
    if [[ ! -f "$test_script" ]]; then
        log "ERROR" "Disk analyzer script not found: $test_script"
        return 1
    fi
    
    chmod +x "$test_script"
    
    # Run a quick test on user directory
    local test_dir="$HOME"
    if [[ "$PLATFORM" == "macos" ]]; then
        test_dir="/Users"
    fi
    
    log "INFO" "Running test analysis on: $test_dir"
    
    # Create a test output file
    local test_output="$HOME/LabAutomation/logs/test-analysis.json"
    
    if "$test_script" --json-export "$test_dir" > "$test_output" 2>&1; then
        log "SUCCESS" "Test analysis completed successfully"
        log "INFO" "Test output saved to: $test_output"
        
        # Show basic results
        if command -v jq >/dev/null 2>&1 && [[ -f "$test_output" ]]; then
            local total_dirs=$(jq '.directory_analysis | length' "$test_output" 2>/dev/null || echo "N/A")
            log "INFO" "Found $total_dirs directories in test analysis"
        fi
    else
        log "ERROR" "Test analysis failed"
        log "INFO" "Check the output in: $test_output"
        return 1
    fi
}

# Install automation (macOS)
install_macos_automation() {
    if [[ "$PLATFORM" != "macos" ]]; then
        return 0
    fi
    
    log "STEP" "Installing macOS automation..."
    
    local automation_script="$HOME/LabAutomation/scripts/automated-disk-monitor.sh"
    
    if [[ ! -f "$automation_script" ]]; then
        log "ERROR" "macOS automation script not found"
        return 1
    fi
    
    chmod +x "$automation_script"
    
    echo
    echo -n "Install system-wide automation (requires sudo)? (y/N): "
    read -r install_system
    
    if [[ "$install_system" = "y" || "$install_system" = "Y" ]]; then
        log "INFO" "Installing system-wide automation..."
        
        # Copy scripts to system location
        sudo mkdir -p /usr/local/bin/lab-automation
        sudo cp "$HOME/LabAutomation/scripts"/* /usr/local/bin/lab-automation/
        sudo chmod +x /usr/local/bin/lab-automation/*.sh
        
        # Install LaunchDaemon
        cd /usr/local/bin/lab-automation
        if sudo "$automation_script" --install; then
            log "SUCCESS" "macOS automation installed successfully"
            
            # Show status
            if sudo launchctl list | grep -q "com.lab.diskanalysis"; then
                log "SUCCESS" "LaunchDaemon is active"
            else
                log "WARNING" "LaunchDaemon may not be active"
            fi
        else
            log "ERROR" "macOS automation installation failed"
            return 1
        fi
    else
        log "INFO" "Skipping system-wide installation"
        log "INFO" "You can install manually later with: sudo $automation_script --install"
    fi
}

# Setup central collection
setup_central_collection() {
    log "STEP" "Setting up central collection..."
    
    local collector_script="$HOME/LabAutomation/scripts/lab-data-collector.py"
    
    if [[ ! -f "$collector_script" ]]; then
        log "WARNING" "Central collection script not found - skipping"
        return 0
    fi
    
    # Create central directories if they don't exist
    echo
    echo -n "Setup central data collection? (y/N): "
    read -r setup_central
    
    if [[ "$setup_central" = "y" || "$setup_central" = "Y" ]]; then
        local central_base="$HOME/LabCentral"
        
        mkdir -p "$central_base"/{data,reports,web-data,logs}
        
        # Test the collector
        if python3 "$collector_script" --help >/dev/null 2>&1; then
            log "SUCCESS" "Central collection script is functional"
            
            # Initialize database
            export PYTHONPATH="$SCRIPT_DIR:$PYTHONPATH"
            if python3 "$collector_script" --init-db 2>/dev/null; then
                log "SUCCESS" "Database initialized"
            else
                log "INFO" "Database may already exist or initialization not needed"
            fi
        else
            log "WARNING" "Central collection script has issues"
        fi
        
        log "INFO" "Central collection base: $central_base"
    else
        log "INFO" "Skipping central collection setup"
    fi
}

# Generate deployment commands
generate_deployment_commands() {
    log "STEP" "Generating deployment commands..."
    
    local deployment_file="$HOME/LabAutomation/deployment-commands.txt"
    
    cat > "$deployment_file" << EOF
LAB AUTOMATION DEPLOYMENT COMMANDS
Generated: $(date)
=====================================

WINDOWS DEPLOYMENT
------------------
# From Windows PowerShell (as Administrator):
.\deploy-windows.ps1 -ComputerNames "WIN-LAB-01,WIN-LAB-02,WIN-LAB-03" -Force

# Single system installation:
.\windows\automated-disk-monitor.ps1 -Install

MACOS DEPLOYMENT
----------------
# From macOS/Linux Terminal:
./deploy-macos.sh --computers "mac-lab-01.local,mac-lab-02.local" --user admin --force

# Single system installation:
sudo ./macos/automated-disk-monitor.sh --install

CENTRAL COLLECTION
------------------
# Start central data collection:
python3 central/lab-data-collector.py --collect

# Generate reports:
python3 central/lab-data-collector.py --report

VERIFICATION COMMANDS
--------------------
# Windows - Check scheduled task:
Get-ScheduledTask -TaskName "LabDiskAnalysis"

# macOS - Check LaunchDaemon:
sudo launchctl list | grep com.lab.diskanalysis

# Test analysis:
# Windows: .\enhanced-disk-analyser.sh /c/Users
# macOS:   ./test-enhanced-disk-analyser.sh /Users

WEB DASHBOARD
-------------
URL: https://64vrc4xoo7.space.minimax.io

SUPPORT FILES
-------------
Configuration: $CONFIG_FILE
Setup Log: $LOG_FILE
Installation: $HOME/LabAutomation/
EOF
    
    log "SUCCESS" "Deployment commands saved to: $deployment_file"
    
    echo
    echo -e "${BOLD}${GREEN}Next Steps:${NC}"
    echo "==========="
    echo "1. Review configuration: $CONFIG_FILE"
    echo "2. Deploy to Windows systems using PowerShell commands"
    echo "3. Deploy to macOS systems using Terminal commands"
    echo "4. Setup central collection on your server"
    echo "5. Access web dashboard: https://64vrc4xoo7.space.minimax.io"
    echo
    echo "Full deployment guide: $deployment_file"
}

# Show summary
show_summary() {
    log "STEP" "Setup Summary"
    
    echo
    echo -e "${BOLD}${GREEN}🎉 LAB AUTOMATION SETUP COMPLETE!${NC}"
    echo "================================="
    echo
    echo -e "${BOLD}What was configured:${NC}"
    echo "• ✅ Directory structure created"
    echo "• ✅ Scripts copied and tested"
    echo "• ✅ Configuration generated"
    if [[ "$PLATFORM" == "macos" ]]; then
        echo "• ✅ macOS automation ready"
    fi
    echo "• ✅ Deployment commands generated"
    echo
    echo -e "${BOLD}Key Locations:${NC}"
    echo "• Scripts: $HOME/LabAutomation/scripts/"
    echo "• Config: $HOME/LabAutomation/config/"
    echo "• Logs: $HOME/LabAutomation/logs/"
    echo "• Setup Log: $LOG_FILE"
    echo
    echo -e "${BOLD}Next Actions:${NC}"
    echo "1. 📋 Review and customize: $CONFIG_FILE"
    echo "2. 🖥️  Deploy to Windows systems (see deployment-commands.txt)"
    echo "3. 🍎 Deploy to macOS systems (see deployment-commands.txt)"
    echo "4. 🌐 View results at: https://64vrc4xoo7.space.minimax.io"
    echo
    echo -e "${BOLD}Support:${NC}"
    echo "• Setup Guide: $SCRIPT_DIR/SETUP_GUIDE.md"
    echo "• Deployment Commands: $HOME/LabAutomation/deployment-commands.txt"
    echo "• Configuration Template: $SCRIPT_DIR/config-template.json"
    echo
    echo -e "${YELLOW}Pro Tip:${NC} Start with a test deployment on 1-2 systems before full lab rollout!"
}

# Error handler
error_handler() {
    local exit_code=$?
    log "ERROR" "Setup failed with exit code: $exit_code"
    echo
    echo -e "${RED}❌ Setup encountered an error!${NC}"
    echo "Check the log file for details: $LOG_FILE"
    echo "You can re-run this script to continue setup."
    exit $exit_code
}

# Main setup function
main() {
    trap error_handler ERR
    
    show_banner
    
    log "INFO" "Starting Lab Automation setup..."
    log "INFO" "Log file: $LOG_FILE"
    
    check_platform
    check_prerequisites
    interactive_config
    setup_directories
    test_disk_analyzer
    install_macos_automation
    setup_central_collection
    generate_deployment_commands
    show_summary
    
    log "SUCCESS" "Lab Automation setup completed successfully!"
}

# Handle command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            echo "Lab Automation Quick Start Script"
            echo
            echo "Usage: $0 [OPTIONS]"
            echo
            echo "Options:"
            echo "  --help, -h     Show this help message"
            echo "  --config FILE  Use custom configuration file"
            echo "  --auto         Run with minimal prompts"
            echo
            echo "This script sets up automated disk analysis for mixed Windows/macOS labs."
            echo "It creates directory structure, copies scripts, and generates deployment commands."
            exit 0
            ;;
        --config)
            CONFIG_FILE="$2"
            shift 2
            ;;
        --auto)
            # Auto mode with minimal prompts - could add this functionality
            AUTO_MODE=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run main setup
main
