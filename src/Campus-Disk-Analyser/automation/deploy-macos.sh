#!/bin/bash

# macOS Lab Automation Deployment Script
# Deploys disk analysis automation to macOS systems

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DISK_ANALYZER_SCRIPT="$SCRIPT_DIR/../test-enhanced-disk-analyser.sh"
AUTOMATION_SCRIPT="$SCRIPT_DIR/macos/automated-disk-monitor.sh"
CONFIG_FILE="$SCRIPT_DIR/config.json"
REMOTE_SCRIPT_PATH="/usr/local/bin/lab-automation"
CENTRAL_SHARE="/Volumes/lab-analysis"
LOG_FILE="./deployment-$(date +%Y%m%d-%H%M%S).log"

# Default target computers (can be overridden)
TARGET_COMPUTERS=()
SSH_USER="admin"
SSH_KEY=""
FORCE_DEPLOYMENT=false
TEST_ONLY=false

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging function
log_message() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_entry="[$timestamp] [$level] $message"
    
    case "$level" in
        "ERROR")   echo -e "${RED}[ERROR]${NC} $message" >&2 ;;
        "WARNING") echo -e "${YELLOW}[WARNING]${NC} $message" ;;
        "SUCCESS") echo -e "${GREEN}[SUCCESS]${NC} $message" ;;
        "INFO")    echo -e "${BLUE}[INFO]${NC} $message" ;;
        *)         echo "$message" ;;
    esac
    
    echo "$log_entry" >> "$LOG_FILE"
}

# Display usage
show_usage() {
    cat << EOF
macOS Lab Automation Deployment Script

Usage: $0 [OPTIONS]

Options:
    --computers "host1,host2,host3"    Target computers (comma-separated)
    --user USERNAME                    SSH username (default: admin)
    --key PATH                         SSH private key path
    --central-share PATH               Central share path (default: $CENTRAL_SHARE)
    --force                            Skip confirmation prompts
    --test-only                        Test deployment without installation
    --discover                         Auto-discover macOS systems on network
    --help                             Show this help message

Examples:
    $0 --computers "mac1.local,mac2.local" --user admin
    $0 --discover --force
    $0 --test-only --computers "mac1.local"

Prerequisites:
    - SSH access to target systems
    - Administrative privileges on target systems
    - Enhanced disk analyzer script available
    - Central share accessible from target systems
EOF
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --computers)
                IFS=',' read -ra TARGET_COMPUTERS <<< "$2"
                shift 2
                ;;
            --user)
                SSH_USER="$2"
                shift 2
                ;;
            --key)
                SSH_KEY="$2"
                shift 2
                ;;
            --central-share)
                CENTRAL_SHARE="$2"
                shift 2
                ;;
            --force)
                FORCE_DEPLOYMENT=true
                shift
                ;;
            --test-only)
                TEST_ONLY=true
                shift
                ;;
            --discover)
                discover_mac_systems
                shift
                ;;
            --help|-h)
                show_usage
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

# Check prerequisites
check_prerequisites() {
    log_message "INFO" "Checking deployment prerequisites..."
    
    local prereqs_ok=true
    
    # Check required files
    if [[ ! -f "$DISK_ANALYZER_SCRIPT" ]]; then
        log_message "ERROR" "Disk analyzer script not found: $DISK_ANALYZER_SCRIPT"
        prereqs_ok=false
    else
        log_message "SUCCESS" "✓ Disk analyzer script found"
    fi
    
    if [[ ! -f "$AUTOMATION_SCRIPT" ]]; then
        log_message "ERROR" "Automation script not found: $AUTOMATION_SCRIPT"
        prereqs_ok=false
    else
        log_message "SUCCESS" "✓ Automation script found"
    fi
    
    # Check SSH
    if ! command -v ssh >/dev/null 2>&1; then
        log_message "ERROR" "SSH client not available"
        prereqs_ok=false
    else
        log_message "SUCCESS" "✓ SSH client available"
    fi
    
    # Check rsync
    if ! command -v rsync >/dev/null 2>&1; then
        log_message "WARNING" "rsync not available, will use scp instead"
    else
        log_message "SUCCESS" "✓ rsync available"
    fi
    
    return $prereqs_ok
}

# Discover macOS systems on network
discover_mac_systems() {
    log_message "INFO" "Discovering macOS systems on network..."
    
    # Use nmap to discover systems if available
    if command -v nmap >/dev/null 2>&1; then
        local network=$(route -n get default | grep interface | awk '{print $2}')
        local subnet=$(ifconfig "$network" | grep "inet " | awk '{print $2}' | cut -d. -f1-3)
        
        log_message "INFO" "Scanning subnet: ${subnet}.0/24"
        
        # Scan for SSH services and identify macOS systems
        nmap -p 22 --open "${subnet}.0/24" 2>/dev/null | grep -B 2 "22/tcp open" | grep "Nmap scan report" | awk '{print $5}' > /tmp/discovered_hosts.txt
        
        # Test each host to see if it's macOS
        while IFS= read -r host; do
            if ssh -o ConnectTimeout=5 -o BatchMode=yes "$SSH_USER@$host" "uname" 2>/dev/null | grep -q "Darwin"; then
                TARGET_COMPUTERS+=("$host")
                log_message "SUCCESS" "Found macOS system: $host"
            fi
        done < /tmp/discovered_hosts.txt
        
        rm -f /tmp/discovered_hosts.txt
        
    else
        log_message "WARNING" "nmap not available for auto-discovery"
        log_message "INFO" "Try: brew install nmap"
    fi
    
    if [[ ${#TARGET_COMPUTERS[@]} -eq 0 ]]; then
        log_message "WARNING" "No macOS systems discovered automatically"
        log_message "INFO" "Please specify target computers manually using --computers option"
    else
        log_message "INFO" "Discovered ${#TARGET_COMPUTERS[@]} macOS systems"
    fi
}

# Test connectivity to a computer
test_connectivity() {
    local computer="$1"
    local ssh_opts="-o ConnectTimeout=10 -o BatchMode=yes"
    
    if [[ -n "$SSH_KEY" ]]; then
        ssh_opts="$ssh_opts -i $SSH_KEY"
    fi
    
    # Test basic SSH connectivity
    if ssh $ssh_opts "$SSH_USER@$computer" "echo 'Connection test successful'" >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Deploy automation to a single computer
deploy_to_computer() {
    local computer="$1"
    local ssh_opts="-o ConnectTimeout=30"
    
    if [[ -n "$SSH_KEY" ]]; then
        ssh_opts="$ssh_opts -i $SSH_KEY"
    fi
    
    log_message "INFO" "Deploying automation to $computer..."
    
    # Test connectivity
    if ! test_connectivity "$computer"; then
        log_message "ERROR" "Cannot connect to $computer"
        return 1
    fi
    
    # Create remote directory
    if ! ssh $ssh_opts "$SSH_USER@$computer" "sudo mkdir -p '$REMOTE_SCRIPT_PATH' && sudo chown $SSH_USER '$REMOTE_SCRIPT_PATH'" 2>/dev/null; then
        log_message "ERROR" "Failed to create remote directory on $computer"
        return 1
    fi
    
    # Copy files to remote computer
    local files_to_copy=(
        "$DISK_ANALYZER_SCRIPT:$REMOTE_SCRIPT_PATH/test-enhanced-disk-analyser.sh"
        "$AUTOMATION_SCRIPT:$REMOTE_SCRIPT_PATH/automated-disk-monitor.sh"
    )
    
    if [[ -f "$CONFIG_FILE" ]]; then
        files_to_copy+=("$CONFIG_FILE:$REMOTE_SCRIPT_PATH/config.json")
    fi
    
    for file_mapping in "${files_to_copy[@]}"; do
        local src="${file_mapping%:*}"
        local dest="${file_mapping#*:}"
        
        if command -v rsync >/dev/null 2>&1; then
            # Use rsync if available
            if ! rsync -avz -e "ssh $ssh_opts" "$src" "$SSH_USER@$computer:$dest" >/dev/null 2>&1; then
                log_message "ERROR" "Failed to copy $src to $computer"
                return 1
            fi
        else
            # Fallback to scp
            if ! scp $ssh_opts "$src" "$SSH_USER@$computer:$dest" >/dev/null 2>&1; then
                log_message "ERROR" "Failed to copy $src to $computer"
                return 1
            fi
        fi
        
        log_message "INFO" "  Copied $(basename "$src") → $dest"
    done
    
    # Set executable permissions
    ssh $ssh_opts "$SSH_USER@$computer" "chmod +x '$REMOTE_SCRIPT_PATH'/*.sh" 2>/dev/null
    
    # Install automation (if not test-only)
    if [[ "$TEST_ONLY" != "true" ]]; then
        local install_result
        install_result=$(ssh $ssh_opts "$SSH_USER@$computer" "cd '$REMOTE_SCRIPT_PATH' && sudo ./automated-disk-monitor.sh --install" 2>&1)
        local exit_code=$?
        
        if [[ $exit_code -eq 0 ]]; then
            log_message "SUCCESS" "  Automation installed successfully on $computer"
        else
            log_message "ERROR" "  Automation installation failed on $computer: $install_result"
            return 1
        fi
    else
        log_message "INFO" "  Test deployment completed (no installation)"
    fi
    
    log_message "SUCCESS" "Deployment to $computer completed successfully"
    return 0
}

# Generate deployment report
generate_deployment_report() {
    local -n results_ref=$1
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local successful=0
    local failed=0
    local total=${#results_ref[@]}
    
    for result in "${results_ref[@]}"; do
        if [[ "$result" == "true" ]]; then
            ((successful++))
        else
            ((failed++))
        fi
    done
    
    local success_rate
    if [[ $total -gt 0 ]]; then
        success_rate=$(( (successful * 100) / total ))
    else
        success_rate=0
    fi
    
    cat << EOF
MACOS LAB AUTOMATION DEPLOYMENT REPORT
Generated: $timestamp
======================================

SUMMARY
-------
Total Computers: $total
Successful: $successful
Failed: $failed
Success Rate: ${success_rate}%

DETAILED RESULTS
---------------
EOF
    
    local index=0
    for computer in "${TARGET_COMPUTERS[@]}"; do
        local status
        if [[ "${results_ref[$index]}" == "true" ]]; then
            status="SUCCESS"
        else
            status="FAILED"
        fi
        echo "$computer: $status"
        ((index++))
    done
    
    cat << EOF

NEXT STEPS
----------
1. Verify installations: Check LaunchDaemons on deployed systems
   sudo launchctl list | grep com.lab.diskanalysis
2. Monitor logs: $CENTRAL_SHARE/logs/
3. Web dashboard: https://64vrc4xoo7.space.minimax.io
4. Test run: Run 'automated-disk-monitor.sh --test' on target systems

TROUBLESHOOTING
--------------
- Check SSH connectivity and authentication
- Verify sudo privileges on target systems
- Ensure central share is accessible from target systems
- Review logs: $LOG_FILE

MANUAL VERIFICATION
------------------
To manually verify installation on a system:
ssh $SSH_USER@HOSTNAME "sudo launchctl list | grep com.lab.diskanalysis"
ssh $SSH_USER@HOSTNAME "ls -la $REMOTE_SCRIPT_PATH"
EOF
}

# Main deployment function
main_deployment() {
    log_message "INFO" "=== macOS Lab Automation Deployment ==="
    log_message "INFO" "Timestamp: $(date)"
    log_message "INFO" "Central Share: $CENTRAL_SHARE"
    log_message "INFO" "SSH User: $SSH_USER"
    log_message "INFO" "Test Only: $TEST_ONLY"
    
    # Check prerequisites
    if ! check_prerequisites; then
        log_message "ERROR" "Prerequisites check failed. Cannot proceed."
        return 1
    fi
    
    # Ensure we have target computers
    if [[ ${#TARGET_COMPUTERS[@]} -eq 0 ]]; then
        log_message "ERROR" "No target computers specified"
        log_message "INFO" "Use --computers option or --discover to find systems"
        show_usage
        return 1
    fi
    
    log_message "INFO" "Target computers: ${TARGET_COMPUTERS[*]}"
    
    # Confirm deployment
    if [[ "$FORCE_DEPLOYMENT" != "true" && "$TEST_ONLY" != "true" ]]; then
        echo -n "Deploy automation to ${#TARGET_COMPUTERS[@]} computers? (y/N): "
        read -r confirm
        if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
            log_message "INFO" "Deployment cancelled by user"
            return 0
        fi
    fi
    
    # Deploy to each computer
    local results=()
    local progress_count=0
    
    for computer in "${TARGET_COMPUTERS[@]}"; do
        ((progress_count++))
        echo "Progress: $progress_count/${#TARGET_COMPUTERS[@]} - Processing $computer"
        
        if deploy_to_computer "$computer"; then
            results+=("true")
        else
            results+=("false")
        fi
    done
    
    # Generate and display report
    local report
    report=$(generate_deployment_report results)
    echo "$report"
    
    # Save report to file
    local report_file="./deployment-report-$(date +%Y%m%d-%H%M%S).txt"
    echo "$report" > "$report_file"
    log_message "INFO" "Deployment report saved: $report_file"
    
    # Summary
    local successful=0
    for result in "${results[@]}"; do
        if [[ "$result" == "true" ]]; then
            ((successful++))
        fi
    done
    
    log_message "INFO" "Deployment completed: $successful/${#TARGET_COMPUTERS[@]} systems successful"
    
    return 0
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    parse_arguments "$@"
    main_deployment
fi
