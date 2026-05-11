#!/bin/bash

# Enhanced Windows-Optimized Disk Space Analyzer (FIXED VERSION)
# This script fixes the sed issues with special characters in paths

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/disk-analyser.log"
JSON_OUTPUT_FILE="$SCRIPT_DIR/disk-analysis-data.json"
NUM_DIRS=20
TARGET_DIRS=()
DEBUG_MODE=${DEBUG:-false}
MAX_DEPTH=4
EXPORT_JSON=${EXPORT_JSON:-true}

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# JSON data structure
JSON_DATA=""

# Initialize JSON structure
initialize_json_data() {
    JSON_DATA='{
  "analysis_metadata": {
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "script_version": "enhanced-v2.0-fixed",
    "max_depth": '$MAX_DEPTH',
    "target_directories": []
  },
  "directory_analysis": []
}'
}

# Enhanced logging function
log_message() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
    
    if [[ "$DEBUG_MODE" == "true" || "$level" != "DEBUG" ]]; then
        case "$level" in
            "ERROR")   echo -e "${RED}[ERROR]${NC} $message" >&2 ;;
            "WARNING") echo -e "${YELLOW}[WARNING]${NC} $message" ;;
            "SUCCESS") echo -e "${GREEN}[SUCCESS]${NC} $message" ;;
            "INFO")    echo -e "${BLUE}[INFO]${NC} $message" ;;
            "JSON")    echo -e "${PURPLE}[JSON]${NC} $message" ;;
            *)         echo -e "${CYAN}[DEBUG]${NC} $message" ;;
        esac
    fi
}

# Safe JSON escaping function
escape_json_string() {
    local input="$1"
    # Use printf and multiple steps to safely escape JSON strings
    printf '%s' "$input" | \
    sed 's/\\/\\\\/g' | \
    sed 's/"/\\"/g' | \
    sed 's/\t/\\t/g' | \
    sed 's/\r/\\r/g' | \
    sed 's/\n/\\n/g'
}

# Format size function
format_size() {
    local size_kb="$1"
    local size_b=$((size_kb * 1024))
    
    if [[ $size_b -ge 1099511627776 ]]; then
        echo "$(( (size_b + 549755813888) / 1099511627776 )).$(( ((size_b % 1099511627776) * 10) / 1099511627776 ))TB"
    elif [[ $size_b -ge 1073741824 ]]; then
        echo "$(( (size_b + 536870912) / 1073741824 )).$(( ((size_b % 1073741824) * 10) / 1073741824 ))GB"
    elif [[ $size_b -ge 1048576 ]]; then
        echo "$(( (size_b + 524288) / 1048576 )).$(( ((size_b % 1048576) * 10) / 1048576 ))MB"
    elif [[ $size_b -ge 1024 ]]; then
        echo "$(( (size_b + 512) / 1024 )).$(( ((size_b % 1024) * 10) / 1024 ))KB"
    else
        echo "${size_b}B"
    fi
}

# Format date function
format_date() {
    local timestamp="$1"
    if [[ -n "$timestamp" && "$timestamp" != "0" ]]; then
        date -d "@$timestamp" '+%d/%m/%Y' 2>/dev/null || echo "Unknown"
    else
        echo "Unknown"
    fi
}

# Add data to JSON structure (FIXED VERSION)
add_to_json_data() {
    local dir_path="$1"
    local size_kb="$2"
    local file_count="$3"
    local mod_timestamp="$4"
    local depth="$5"
    local parent_path="$6"
    local percentage="$7"
    
    if [[ "$EXPORT_JSON" != "true" ]]; then
        return
    fi
    
    local formatted_size=$(format_size "$size_kb")
    local mod_date=$(format_date "$mod_timestamp")
    local dir_name=$(basename "$dir_path")
    
    # Use safe JSON escaping
    local escaped_dir_path=$(escape_json_string "$dir_path")
    local escaped_dir_name=$(escape_json_string "$dir_name")
    local escaped_parent_path=$(escape_json_string "$parent_path")
    local escaped_formatted_size=$(escape_json_string "$formatted_size")
    local escaped_mod_date=$(escape_json_string "$mod_date")
    
    # Build JSON entry safely
    local json_entry=$(cat <<EOF
{
  "name": "$escaped_dir_name",
  "path": "$escaped_dir_path",
  "size_kb": $size_kb,
  "size_formatted": "$escaped_formatted_size",
  "file_count": $file_count,
  "modification_timestamp": $mod_timestamp,
  "modification_date": "$escaped_mod_date",
  "depth": $depth,
  "parent_path": "$escaped_parent_path",
  "percentage": $percentage
}
EOF
)
    
    # Remove newlines and extra spaces from json_entry
    json_entry=$(echo "$json_entry" | tr -d '\n\r' | sed 's/  */ /g')
    
    # Add to JSON_DATA using string manipulation (avoiding sed with problematic paths)
    if [[ "$JSON_DATA" == *'"directory_analysis": []'* ]]; then
        JSON_DATA="${JSON_DATA/"\"directory_analysis\": []"/"\"directory_analysis\": [$json_entry]"}"
    else
        JSON_DATA="${JSON_DATA/"\"directory_analysis\": ["/"\"directory_analysis\": [$json_entry, "}"
    fi
}

# Save JSON data to file
save_json_data() {
    if [[ "$EXPORT_JSON" == "true" && -n "$JSON_DATA" ]]; then
        log_message "JSON" "Saving JSON data to $JSON_OUTPUT_FILE"
        
        # Try to format with python if available, otherwise save as-is
        if command -v python3 >/dev/null 2>&1; then
            echo "$JSON_DATA" | python3 -m json.tool > "$JSON_OUTPUT_FILE" 2>/dev/null || echo "$JSON_DATA" > "$JSON_OUTPUT_FILE"
        else
            echo "$JSON_DATA" > "$JSON_OUTPUT_FILE"
        fi
        
        log_message "JSON" "JSON export completed successfully"
    fi
}

# Analyze single directory
analyze_single_directory() {
    local target_dir="$1"
    local start_time=$(date +%s)
    local temp_file="/tmp/disk_analysis_$$"
    local error_count=0
    
    log_message "INFO" "Starting analysis of: $target_dir"
    log_message "INFO" "Maximum depth: $MAX_DEPTH levels"
    log_message "INFO" "Requested results: $NUM_DIRS directories"
    
    if [[ ! -d "$target_dir" ]]; then
        log_message "ERROR" "Target directory does not exist: $target_dir"
        return 1
    fi
    
    if [[ ! -r "$target_dir" ]]; then
        log_message "ERROR" "Target directory is not readable: $target_dir"
        return 1
    fi
    
    echo -e "${CYAN}Analyzing disk usage in: $target_dir${NC}"
    echo "This may take several minutes for large directories..."
    echo
    
    # Calculate total size for percentage calculations
    log_message "INFO" "Calculating total directory size..."
    local total_size_kb=0
    if command -v du >/dev/null 2>&1; then
        total_size_kb=$(du -sk "$target_dir" 2>/dev/null | awk '{print $1}' || echo "0")
    fi
    log_message "INFO" "Total size calculated: ${total_size_kb}KB"
    
    # Run disk usage analysis with error handling
    {
        du -k "$target_dir" 2>"$temp_file.errors" | \
        sort -nr | \
        head -"$NUM_DIRS"
    } > "$temp_file.results"
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    # Process errors
    if [[ -s "$temp_file.errors" ]]; then
        log_message "WARNING" "Some directories were inaccessible in $target_dir:"
        head -10 "$temp_file.errors" | while read -r line; do
            log_message "WARNING" "Access denied: $line"
        done
        error_count=$(wc -l < "$temp_file.errors" 2>/dev/null || echo "0")
    fi
    
    # Display results
    local result_count=$(wc -l < "$temp_file.results" 2>/dev/null || echo "0")
    
    echo ""
    echo "Top $NUM_DIRS largest directories in $target_dir:"
    echo "================================================"
    
    if [[ $result_count -gt 0 ]]; then
        echo -e "${YELLOW}Rank Size        Files   %      Modified     Directory${NC}"
        echo "---- ----------- ------- ------ ------------ --------------------------------"
        
        local rank=1
        while IFS= read -r line; do
            if [[ -n "$line" ]]; then
                local size_kb=$(echo "$line" | awk '{print $1}')
                local directory=$(echo "$line" | awk '{$1=""; print $0}' | sed 's/^ *//')
                
                # Calculate percentage
                local percentage=0
                if [[ $total_size_kb -gt 0 ]]; then
                    percentage=$(( (size_kb * 1000) / total_size_kb ))
                    percentage=$(( percentage / 10 ))
                fi
                
                # Get file count
                local file_count=0
                if [[ -d "$directory" ]]; then
                    file_count=$(find "$directory" -maxdepth 1 -type f 2>/dev/null | wc -l || echo "0")
                fi
                
                # Get modification timestamp
                local mod_timestamp=0
                if [[ -d "$directory" ]]; then
                    mod_timestamp=$(stat -c %Y "$directory" 2>/dev/null || echo "0")
                fi
                
                # Format and display
                local formatted_size=$(format_size "$size_kb")
                local mod_date=$(format_date "$mod_timestamp")
                
                printf "%-4d %-11s %-7d %-6.1f %% %-12s %s\n" \
                    "$rank" "$formatted_size" "$file_count" "$percentage" "$mod_date" "$directory"
                
                # Add to JSON data
                local depth=1
                local parent_path=$(dirname "$directory")
                add_to_json_data "$directory" "$size_kb" "$file_count" "$mod_timestamp" "$depth" "$parent_path" "$percentage"
                
                log_message "INFO" "Top $rank: $formatted_size ($percentage%) - $directory"
                
                ((rank++))
            fi
        done < "$temp_file.results"
        
        echo ""
        echo -e "${GREEN}Analysis completed successfully!${NC}"
        echo -e "${BLUE}Duration: ${duration}s${NC}"
        if [[ $error_count -gt 0 ]]; then
            echo -e "${YELLOW}Warnings: $error_count directories inaccessible${NC}"
        fi
        echo -e "${PURPLE}Total directories analyzed: $result_count${NC}"
        
    else
        echo "No directories found or analysis failed."
        log_message "ERROR" "No results generated for $target_dir"
    fi
    
    # Cleanup
    rm -f "$temp_file.results" "$temp_file.errors"
    
    log_message "SUCCESS" "Analysis of $target_dir completed in ${duration}s"
}

# Detect target directory automatically
detect_target_directory() {
    log_message "INFO" "Auto-detecting target directory for Windows environment"
    
    local candidates=(
        "/c/Users"
        "/c/Program Files"
        "/c/Program Files (x86)"
        "/c"
    )
    
    for dir in "${candidates[@]}"; do
        log_message "DEBUG" "Checking candidate directory: $dir"
        
        if [[ -d "$dir" && -r "$dir" ]]; then
            log_message "INFO" "Selected target directory: $dir"
            echo "$dir"
            return 0
        fi
    done
    
    log_message "ERROR" "No suitable target directory found"
    return 1
}

# Parse command line arguments
parse_arguments() {
    # Handle --json-export flag
    for arg in "$@"; do
        if [[ "$arg" == "--json-export" ]]; then
            EXPORT_JSON=true
            # Remove this argument from the list
            set -- "${@/$arg}"
            break
        fi
    done
    
    if [[ $# -ge 1 ]] && [[ "$1" =~ ^[0-9]+$ ]]; then
        NUM_DIRS=$1
        shift
        TARGET_DIRS=("$@")
    else
        TARGET_DIRS=("$@")
    fi
    
    # Auto-detect target directory if none provided
    if [[ ${#TARGET_DIRS[@]} -eq 0 ]]; then
        detected_dir=$(detect_target_directory) || exit 1
        TARGET_DIRS=("$detected_dir")
    fi
}

# Display header
display_header() {
    echo "================================================"
    echo "Enhanced Windows Disk Space Analyzer (FIXED)"
    echo "================================================"
    echo "Log file: $LOG_FILE"
    if [[ "$EXPORT_JSON" == "true" ]]; then
        echo "JSON export: $JSON_OUTPUT_FILE"
    fi
    echo ""
}

# Main function
main() {
    # Initialize logging
    log_message "INFO" "=== ENHANCED DISK ANALYZER SCRIPT STARTED (FIXED VERSION) ==="
    log_message "INFO" "Script: $0"
    log_message "INFO" "Arguments: $*"
    
    # Parse arguments
    parse_arguments "$@"
    
    # Display header
    display_header
    
    # Initialize JSON data if export is enabled
    if [[ "$EXPORT_JSON" == "true" ]]; then
        initialize_json_data
        log_message "JSON" "JSON export enabled"
    fi
    
    # Log system information
    log_message "INFO" "Target Directories: ${TARGET_DIRS[*]}"
    log_message "INFO" "Requested results per directory: $NUM_DIRS"
    log_message "INFO" "JSON export enabled: $EXPORT_JSON"
    
    echo "Scanning for largest directories in:"
    for dir in "${TARGET_DIRS[@]}"; do
        echo "  - $dir"
    done
    echo ""
    
    # Analyze each target directory
    for target_dir in "${TARGET_DIRS[@]}"; do
        analyze_single_directory "$target_dir"
    done
    
    # Save JSON data if enabled
    if [[ "$EXPORT_JSON" == "true" ]]; then
        save_json_data
        echo ""
        echo -e "${PURPLE}JSON data exported to: $JSON_OUTPUT_FILE${NC}"
        echo -e "${CYAN}Upload this file to: https://64vrc4xoo7.space.minimax.io${NC}"
    fi
    
    log_message "INFO" "=== DISK ANALYSIS COMPLETED ==="
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
