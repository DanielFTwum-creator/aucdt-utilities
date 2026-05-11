#!/bin/bash

# macOS Automated Disk Analysis Monitor
# Bash script for macOS systems with native Terminal integration

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/config.json"
DISK_ANALYZER_SCRIPT="${SCRIPT_DIR}/../test-enhanced-disk-analyser.sh"
OUTPUT_DIR="/Users/Shared/LabData/DiskAnalysis"
CENTRAL_SHARE="/Volumes/lab-analysis"  # Adjust for your network share
LOG_FILE="${OUTPUT_DIR}/logs/automation.log"
ANALYSIS_TARGETS=("/Users" "/Applications" "/System/Volumes/Data")
PLIST_NAME="com.lab.diskanalysis"
PLIST_PATH="/Library/LaunchDaemons/${PLIST_NAME}.plist"

# Default schedule configuration
SCHEDULE_HOUR="02"
SCHEDULE_MINUTE="00"
SCHEDULE_DAYS="1,3,5"  # Monday, Wednesday, Friday (0=Sunday)

# Notification configuration
ENABLE_EMAIL_NOTIFICATIONS=true
SMTP_SERVER="mail.yourdomain.com"
EMAIL_FROM="lab-monitoring@yourdomain.com"
EMAIL_TO="admin@yourdomain.com"

ENABLE_SLACK_NOTIFICATIONS=false
SLACK_WEBHOOK_URL=""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging function
log_message() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_entry="[$timestamp] [$level] $message"
    
    # Console output with colors
    case "$level" in
        "ERROR")   echo -e "${RED}[ERROR]${NC} $message" >&2 ;;
        "WARNING") echo -e "${YELLOW}[WARNING]${NC} $message" ;;
        "SUCCESS") echo -e "${GREEN}[SUCCESS]${NC} $message" ;;
        "INFO")    echo -e "${BLUE}[INFO]${NC} $message" ;;
        *)         echo "$message" ;;
    esac
    
    # File logging
    mkdir -p "$(dirname "$LOG_FILE")"
    echo "$log_entry" >> "$LOG_FILE"
}

# Load configuration from JSON file
load_config() {
    if [[ -f "$CONFIG_FILE" ]]; then
        log_message "INFO" "Loading configuration from: $CONFIG_FILE"
        # Note: In production, use jq for proper JSON parsing
        # For now, using basic grep/sed for key values
        if command -v jq >/dev/null 2>&1; then
            # Use jq if available
            OUTPUT_DIR=$(jq -r '.outputDirectory // "/Users/Shared/LabData/DiskAnalysis"' "$CONFIG_FILE")
            CENTRAL_SHARE=$(jq -r '.centralShare // "/Volumes/lab-analysis"' "$CONFIG_FILE")
            # Add more config parsing as needed
        else
            log_message "WARNING" "jq not found, using default configuration"
        fi
    else
        log_message "INFO" "No configuration file found, using defaults"
    fi
}

# Check if running as root (required for system-wide scheduling)
check_privileges() {
    if [[ $EUID -eq 0 ]]; then
        log_message "INFO" "Running with root privileges"
        return 0
    else
        log_message "WARNING" "Not running as root - some operations may require sudo"
        return 1
    fi
}

# Check if disk analyzer script is available
check_disk_analyzer() {
    if [[ -f "$DISK_ANALYZER_SCRIPT" && -x "$DISK_ANALYZER_SCRIPT" ]]; then
        log_message "SUCCESS" "Disk analyzer script found: $DISK_ANALYZER_SCRIPT"
        return 0
    else
        log_message "ERROR" "Disk analyzer script not found or not executable: $DISK_ANALYZER_SCRIPT"
        return 1
    fi
}

# Initialize directory structure
initialize_directories() {
    local directories=(
        "$OUTPUT_DIR"
        "$OUTPUT_DIR/daily"
        "$OUTPUT_DIR/weekly"
        "$OUTPUT_DIR/monthly"
        "$OUTPUT_DIR/logs"
    )
    
    for dir in "${directories[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            log_message "SUCCESS" "Created directory: $dir"
        fi
    done
}

# Run disk analysis
run_disk_analysis() {
    local analysis_type="${1:-daily}"
    local timestamp=$(date '+%Y%m%d-%H%M%S')
    local hostname=$(hostname -s)
    local output_file="${OUTPUT_DIR}/${analysis_type}/${hostname}-${timestamp}.json"
    
    log_message "INFO" "Starting $analysis_type disk analysis..."
    log_message "INFO" "Output file: $output_file"
    
    # Check if script is available
    if ! check_disk_analyzer; then
        log_message "ERROR" "Cannot proceed without disk analyzer script"
        return 1
    fi
    
    local analysis_success=true
    local analysis_summary=""
    
    for target in "${ANALYSIS_TARGETS[@]}"; do
        if [[ -d "$target" ]]; then
            log_message "INFO" "Analyzing: $target"
            
            # Run the enhanced disk analyzer
            if "$DISK_ANALYZER_SCRIPT" --json-export "$target" > "${output_file}.tmp" 2>&1; then
                log_message "SUCCESS" "Analysis completed for: $target"
                analysis_summary="${analysis_summary}\n✓ $target - OK"
            else
                log_message "ERROR" "Analysis failed for: $target"
                analysis_summary="${analysis_summary}\n✗ $target - FAILED"
                analysis_success=false
            fi
        else
            log_message "WARNING" "Target directory does not exist: $target"
            analysis_summary="${analysis_summary}\n⚠ $target - NOT FOUND"
        fi
    done
    
    # Move temp file to final location if successful
    if [[ -f "${output_file}.tmp" ]]; then
        mv "${output_file}.tmp" "$output_file"
    fi
    
    # Copy to central share if available
    if [[ -d "$CENTRAL_SHARE" ]]; then
        if cp "$output_file" "$CENTRAL_SHARE/" 2>/dev/null; then
            log_message "SUCCESS" "Analysis copied to central share: $CENTRAL_SHARE"
        else
            log_message "WARNING" "Failed to copy to central share (may not be mounted)"
        fi
    fi
    
    # Generate analysis report
    local report="Disk Analysis Report - $(date '+%Y-%m-%d %H:%M:%S')
    
System: $hostname
Type: $analysis_type
Output: $output_file

Analysis Results:$(echo -e "$analysis_summary")

System Status:
$(get_system_health)

Web Dashboard: https://64vrc4xoo7.space.minimax.io
"
    
    if $analysis_success; then
        log_message "SUCCESS" "Disk analysis completed successfully"
        send_notification "Analysis Complete" "$report" "SUCCESS"
    else
        log_message "ERROR" "Disk analysis completed with errors"
        send_notification "Analysis Completed with Errors" "$report" "WARNING"
    fi
    
    return $analysis_success
}

# Get system health information
get_system_health() {
    local health_info=""
    
    # System uptime
    local uptime=$(uptime | awk '{print $3}' | sed 's/,//')
    health_info="Uptime: $uptime"
    
    # Disk space
    health_info="${health_info}\nDisk Space:"
    while IFS= read -r line; do
        if [[ "$line" != "Filesystem"* ]]; then
            health_info="${health_info}\n  $line"
        fi
    done < <(df -h | grep -E '^/dev/')
    
    # Memory usage
    local memory_info=$(vm_stat | grep -E 'Pages (free|active|inactive|speculative|wired down)' | awk '{print $3}' | sed 's/\.//' | paste -sd' ' -)
    health_info="${health_info}\nMemory: Active pages in use"
    
    # Load average
    local load_avg=$(uptime | awk -F'load averages:' '{print $2}')
    health_info="${health_info}\nLoad Average:$load_avg"
    
    echo -e "$health_info"
}

# Send notifications
send_notification() {
    local subject="$1"
    local body="$2"
    local type="${3:-INFO}"
    
    # Email notification
    if [[ "$ENABLE_EMAIL_NOTIFICATIONS" == "true" ]]; then
        # Use mail command if available
        if command -v mail >/dev/null 2>&1; then
            echo "$body" | mail -s "[$type] Lab Disk Analysis - $subject" "$EMAIL_TO"
            log_message "SUCCESS" "Email notification sent"
        else
            log_message "WARNING" "mail command not available for email notifications"
        fi
    fi
    
    # Slack notification
    if [[ "$ENABLE_SLACK_NOTIFICATIONS" == "true" && -n "$SLACK_WEBHOOK_URL" ]]; then
        local color="good"
        case "$type" in
            "ERROR") color="danger" ;;
            "WARNING") color="warning" ;;
        esac
        
        local slack_payload=$(cat <<EOF
{
    "text": "[$type] $subject",
    "attachments": [
        {
            "color": "$color",
            "text": "$body"
        }
    ]
}
EOF
)
        
        if command -v curl >/dev/null 2>&1; then
            curl -X POST -H 'Content-type: application/json' --data "$slack_payload" "$SLACK_WEBHOOK_URL" >/dev/null 2>&1
            log_message "SUCCESS" "Slack notification sent"
        else
            log_message "WARNING" "curl not available for Slack notifications"
        fi
    fi
    
    # macOS notification (local)
    if command -v osascript >/dev/null 2>&1; then
        osascript -e "display notification \"$subject\" with title \"Lab Disk Analysis\" subtitle \"$type\""
    fi
}

# Create LaunchDaemon plist for scheduling
create_launch_daemon() {
    log_message "INFO" "Creating LaunchDaemon plist: $PLIST_PATH"
    
    cat > "$PLIST_PATH" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>$PLIST_NAME</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>$SCRIPT_DIR/$(basename "$0")</string>
        <string>--run</string>
    </array>
    <key>StartCalendarInterval</key>
    <array>
        <dict>
            <key>Weekday</key>
            <integer>1</integer>
            <key>Hour</key>
            <integer>$SCHEDULE_HOUR</integer>
            <key>Minute</key>
            <integer>$SCHEDULE_MINUTE</integer>
        </dict>
        <dict>
            <key>Weekday</key>
            <integer>3</integer>
            <key>Hour</key>
            <integer>$SCHEDULE_HOUR</integer>
            <key>Minute</key>
            <integer>$SCHEDULE_MINUTE</integer>
        </dict>
        <dict>
            <key>Weekday</key>
            <integer>5</integer>
            <key>Hour</key>
            <integer>$SCHEDULE_HOUR</integer>
            <key>Minute</key>
            <integer>$SCHEDULE_MINUTE</integer>
        </dict>
    </array>
    <key>StandardOutPath</key>
    <string>$OUTPUT_DIR/logs/launchd.log</string>
    <key>StandardErrorPath</key>
    <string>$OUTPUT_DIR/logs/launchd-error.log</string>
    <key>RunAtLoad</key>
    <false/>
</dict>
</plist>
EOF

    # Set proper permissions
    chown root:wheel "$PLIST_PATH"
    chmod 644 "$PLIST_PATH"
    
    log_message "SUCCESS" "LaunchDaemon plist created successfully"
}

# Install automation
install_automation() {
    log_message "INFO" "Installing macOS disk analysis automation"
    
    # Check privileges
    if ! check_privileges; then
        log_message "ERROR" "Root privileges required for installation"
        echo "Please run: sudo $0 --install"
        return 1
    fi
    
    # Initialize directories
    initialize_directories
    
    # Check disk analyzer
    if ! check_disk_analyzer; then
        log_message "ERROR" "Disk analyzer script not available"
        return 1
    fi
    
    # Create LaunchDaemon
    create_launch_daemon
    
    # Load LaunchDaemon
    if launchctl load "$PLIST_PATH"; then
        log_message "SUCCESS" "LaunchDaemon loaded successfully"
        send_notification "Automation Installed" "macOS disk analysis automation has been installed and scheduled."
    else
        log_message "ERROR" "Failed to load LaunchDaemon"
        return 1
    fi
    
    log_message "SUCCESS" "Installation completed successfully"
    log_message "INFO" "Schedule: $SCHEDULE_DAYS at $SCHEDULE_HOUR:$SCHEDULE_MINUTE"
    log_message "INFO" "Logs: $LOG_FILE"
    log_message "INFO" "Output: $OUTPUT_DIR"
}

# Uninstall automation
uninstall_automation() {
    log_message "INFO" "Uninstalling macOS disk analysis automation"
    
    # Check privileges
    if ! check_privileges; then
        log_message "ERROR" "Root privileges required for uninstallation"
        echo "Please run: sudo $0 --uninstall"
        return 1
    fi
    
    # Unload LaunchDaemon
    if launchctl unload "$PLIST_PATH" 2>/dev/null; then
        log_message "SUCCESS" "LaunchDaemon unloaded"
    fi
    
    # Remove plist file
    if [[ -f "$PLIST_PATH" ]]; then
        rm "$PLIST_PATH"
        log_message "SUCCESS" "LaunchDaemon plist removed"
    fi
    
    send_notification "Automation Removed" "macOS disk analysis automation has been uninstalled."
    log_message "SUCCESS" "Uninstallation completed successfully"
}

# Show status
show_status() {
    log_message "INFO" "=== macOS Disk Analysis Automation Status ==="
    log_message "INFO" "Hostname: $(hostname)"
    log_message "INFO" "Script: $0"
    log_message "INFO" "Config: $CONFIG_FILE"
    log_message "INFO" "Output Directory: $OUTPUT_DIR"
    log_message "INFO" "LaunchDaemon: $PLIST_PATH"
    
    # Check if installed
    if [[ -f "$PLIST_PATH" ]]; then
        log_message "SUCCESS" "✓ LaunchDaemon installed"
        
        # Check if loaded
        if launchctl list | grep -q "$PLIST_NAME"; then
            log_message "SUCCESS" "✓ LaunchDaemon loaded"
        else
            log_message "WARNING" "✗ LaunchDaemon not loaded"
        fi
    else
        log_message "WARNING" "✗ LaunchDaemon not installed"
    fi
    
    # Check components
    log_message "INFO" "Component Status:"
    if check_disk_analyzer; then
        log_message "SUCCESS" "  ✓ Disk analyzer script"
    else
        log_message "ERROR" "  ✗ Disk analyzer script"
    fi
    
    if [[ -d "$OUTPUT_DIR" ]]; then
        log_message "SUCCESS" "  ✓ Output directory"
    else
        log_message "WARNING" "  ✗ Output directory"
    fi
    
    if [[ -d "$CENTRAL_SHARE" ]]; then
        log_message "SUCCESS" "  ✓ Central share accessible"
    else
        log_message "WARNING" "  ✗ Central share not accessible"
    fi
    
    # Show recent analyses
    if [[ -d "$OUTPUT_DIR/daily" ]]; then
        local recent_count=$(find "$OUTPUT_DIR/daily" -name "*.json" -mtime -7 | wc -l)
        log_message "INFO" "Recent analyses (last 7 days): $recent_count"
    fi
}

# Display usage information
show_usage() {
    cat << EOF
macOS Automated Disk Analysis Monitor

Usage: $0 [OPTIONS]

Options:
    --install           Install automation (requires sudo)
    --uninstall         Uninstall automation (requires sudo)
    --run               Run disk analysis now
    --status            Show automation status
    --test              Test run without scheduling
    --config FILE       Use custom configuration file
    --help              Show this help message

Examples:
    sudo $0 --install           # Install automation
    $0 --run                    # Run analysis manually
    $0 --status                 # Check status
    sudo $0 --uninstall         # Remove automation

Configuration:
    Edit $CONFIG_FILE to customize settings
    
Logs:
    $LOG_FILE
    
Web Dashboard:
    https://64vrc4xoo7.space.minimax.io
EOF
}

# Main function
main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --install)
                load_config
                install_automation
                exit $?
                ;;
            --uninstall)
                uninstall_automation
                exit $?
                ;;
            --run)
                load_config
                initialize_directories
                run_disk_analysis
                exit $?
                ;;
            --test)
                load_config
                initialize_directories
                log_message "INFO" "Running test analysis..."
                run_disk_analysis "test"
                exit $?
                ;;
            --status)
                load_config
                show_status
                exit 0
                ;;
            --config)
                CONFIG_FILE="$2"
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
        shift
    done
    
    # Default action - show usage
    show_usage
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
