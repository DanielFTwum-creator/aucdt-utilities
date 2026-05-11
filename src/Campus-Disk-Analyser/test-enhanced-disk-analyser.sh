#!/bin/bash

# Test-Enhanced Disk Space Analyzer (Linux Compatible for Testing)
# Based on the enhanced-disk-analyser.sh but adapted for cross-platform testing

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

# Enhanced logging function
log_message() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
    
    if [[ "$DEBUG_MODE" == "true" || "$level" != "DEBUG" ]]; then
        case "$level" in
            "ERROR")   echo -e "${RED}[ERROR]${NC} $message" >&2 ;;
            "WARNING") echo -e "${YELLOW}[WARNING]${NC} $message" >&2 ;;
            "INFO")    echo -e "${GREEN}[INFO]${NC} $message" >&2 ;;
            "PROGRESS") echo -e "${BLUE}[PROGRESS]${NC} $message" >&2 ;;
            "JSON")    echo -e "${CYAN}[JSON]${NC} $message" >&2 ;;
            *)         echo "[$level] $message" >&2 ;;
        esac
    fi
}

# Enhanced size formatting function
format_size() {
    local size_kb="$1"
    
    if [[ ! "$size_kb" =~ ^[0-9]+$ ]]; then
        echo "0B"
        return
    fi
    
    local size_bytes=$((size_kb * 1024))
    
    if [[ $size_bytes -lt 1024 ]]; then
        echo "${size_bytes}B"
    elif [[ $size_bytes -lt 1048576 ]]; then
        echo "$(awk "BEGIN {printf \"%.1fKB\", $size_bytes/1024}")"
    elif [[ $size_bytes -lt 1073741824 ]]; then
        echo "$(awk "BEGIN {printf \"%.1fMB\", $size_bytes/1048576}")"
    elif [[ $size_bytes -lt 1099511627776 ]]; then
        echo "$(awk "BEGIN {printf \"%.1fGB\", $size_bytes/1073741824}")"
    else
        echo "$(awk "BEGIN {printf \"%.1fTB\", $size_bytes/1099511627776}")"
    fi
}

# Calculate percentage of total usage
calculate_percentage() {
    local size_kb="$1"
    local total_kb="$2"
    
    if [[ $total_kb -eq 0 ]]; then
        echo "0.0"
        return
    fi
    
    awk "BEGIN {printf \"%.1f\", ($size_kb * 100) / $total_kb}"
}

# Get file count in directory
get_file_count() {
    local dir="$1"
    local file_count=0
    
    if [[ -d "$dir" && -r "$dir" ]]; then
        file_count=$(find "$dir" -maxdepth 1 -type f 2>/dev/null | wc -l)
    fi
    
    echo "$file_count"
}

# Get modification date
get_modification_date() {
    local dir="$1"
    
    if [[ -d "$dir" ]]; then
        if command -v stat >/dev/null 2>&1; then
            if [[ "$OSTYPE" == "darwin"* ]]; then
                stat -f %m "$dir" 2>/dev/null || echo "0"
            else
                stat -c %Y "$dir" 2>/dev/null || echo "0"
            fi
        else
            echo "0"
        fi
    else
        echo "0"
    fi
}

# Convert timestamp to readable date
format_date() {
    local timestamp="$1"
    
    if [[ "$timestamp" == "0" ]]; then
        echo "Unknown"
    else
        date -d "@$timestamp" '+%d/%m/%Y' 2>/dev/null || date -r "$timestamp" '+%d/%m/%Y' 2>/dev/null || echo "Unknown"
    fi
}

# Parse command line arguments
parse_arguments() {
    if [[ $# -ge 1 ]] && [[ "$1" =~ ^[0-9]+$ ]]; then
        NUM_DIRS=$1
        shift
        TARGET_DIRS=("$@")
    else
        TARGET_DIRS=("$@")
    fi
    
    # Use current directory or provided directory
    if [[ ${#TARGET_DIRS[@]} -eq 0 ]]; then
        TARGET_DIRS=("$(pwd)")
    fi
}

# Initialize JSON structure
init_json_data() {
    if [[ "$EXPORT_JSON" == "true" ]]; then
        log_message "JSON" "Initializing JSON data structure"
        JSON_DATA='{"analysis_metadata":{"timestamp":"'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'","script_version":"enhanced-v2.0-test","max_depth":'$MAX_DEPTH',"target_directories":['
        
        local first=true
        for dir in "${TARGET_DIRS[@]}"; do
            if [[ "$first" == "true" ]]; then
                first=false
            else
                JSON_DATA+=","
            fi
            JSON_DATA+='"'"$dir"'"'
        done
        
        JSON_DATA+=']},"directory_analysis":[]}'
    fi
}

# Add directory data to JSON
add_to_json() {
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
    
    # Escape JSON special characters
    dir_path=$(echo "$dir_path" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
    dir_name=$(echo "$dir_name" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
    parent_path=$(echo "$parent_path" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
    
    local json_entry='{"name":"'"$dir_name"'","path":"'"$dir_path"'","size_kb":'$size_kb',"size_formatted":"'"$formatted_size"'","file_count":'$file_count',"modification_timestamp":'$mod_timestamp',"modification_date":"'"$mod_date"'","depth":'$depth',"parent_path":"'"$parent_path"'","percentage":'$percentage'}'
    
    # Insert into JSON structure
    if [[ "$JSON_DATA" =~ \"directory_analysis\":\[\] ]]; then
        JSON_DATA=$(echo "$JSON_DATA" | sed 's/"directory_analysis":\[\]/"directory_analysis":['$json_entry']/')
    else
        JSON_DATA=$(echo "$JSON_DATA" | sed 's/"directory_analysis":\[/"directory_analysis":['$json_entry',/')
    fi
}

# Save JSON data to file
save_json_data() {
    if [[ "$EXPORT_JSON" == "true" && -n "$JSON_DATA" ]]; then
        log_message "JSON" "Saving JSON data to $JSON_OUTPUT_FILE"
        if command -v python3 >/dev/null 2>&1; then
            echo "$JSON_DATA" | python3 -c "import sys, json; print(json.dumps(json.load(sys.stdin), indent=2))" > "$JSON_OUTPUT_FILE" 2>/dev/null || echo "$JSON_DATA" > "$JSON_OUTPUT_FILE"
        else
            echo "$JSON_DATA" > "$JSON_OUTPUT_FILE"
        fi
        log_message "JSON" "JSON export completed successfully"
    fi
}

# Enhanced single directory analysis
analyze_single_directory() {
    local target_dir="$1"
    log_message "INFO" "=== ANALYZING DIRECTORY: $target_dir ==="
    
    local start_time=$(date +%s)
    local temp_file=$(mktemp)
    local error_count=0
    local total_size_kb=0
    
    log_message "PROGRESS" "Scanning $target_dir with depth $MAX_DEPTH..."
    
    # Get total size of target directory
    total_size_kb=$(du -sk "$target_dir" 2>/dev/null | cut -f1)
    if [[ -z "$total_size_kb" ]]; then
        total_size_kb=0
    fi
    
    # Enhanced du command with deeper scanning
    {
        du -k --max-depth=$MAX_DEPTH "$target_dir" 2>"$temp_file.errors" | sort -rn | head -n "$NUM_DIRS"
    } > "$temp_file.results"
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    # Process errors
    if [[ -s "$temp_file.errors" ]]; then
        log_message "WARNING" "Some directories were inaccessible in $target_dir:"
        head -5 "$temp_file.errors" | while read -r line; do
            log_message "WARNING" "Access issue: $line"
        done
        error_count=$(wc -l < "$temp_file.errors")
    fi
    
    # Enhanced results display
    local result_count=$(wc -l < "$temp_file.results")
    
    echo ""
    echo -e "${PURPLE}Top $NUM_DIRS largest directories in $target_dir:${NC}"
    echo "================================================================"
    printf "%-4s %-12s %-8s %-8s %-12s %s\n" "Rank" "Size" "Files" "%" "Modified" "Directory"
    echo "----------------------------------------------------------------"
    
    if [[ $result_count -gt 0 ]]; then
        local rank=1
        while IFS= read -r line; do
            if [[ -n "$line" ]]; then
                local size_kb=$(echo "$line" | awk '{print $1}')
                local directory=$(echo "$line" | awk '{$1=""; print $0}' | sed 's/^ *//')
                local formatted_size=$(format_size "$size_kb")
                local file_count=$(get_file_count "$directory")
                local mod_timestamp=$(get_modification_date "$directory")
                local mod_date=$(format_date "$mod_timestamp")
                local percentage=$(calculate_percentage "$size_kb" "$total_size_kb")
                local depth=$(echo "$directory" | tr -cd '/' | wc -c)
                local parent_dir=$(dirname "$directory")
                
                printf "%-4d %-12s %-8s %-8s%% %-12s %s\n" \
                    "$rank" "$formatted_size" "$file_count" "$percentage" "$mod_date" "$directory"
                
                # Add to JSON if enabled
                add_to_json "$directory" "$size_kb" "$file_count" "$mod_timestamp" \
                    "$depth" "$parent_dir" "$percentage"
                
                if [[ $rank -le 5 ]]; then
                    log_message "INFO" "Top $rank: $formatted_size ($percentage%) - $directory"
                fi
                ((rank++))
            fi
        done < "$temp_file.results"
    else
        echo "No directories found or all directories are inaccessible."
    fi
    
    echo ""
    echo -e "${GREEN}Scan Summary:${NC}"
    echo "Duration: ${duration}s | Errors: $error_count | Total Size: $(format_size "$total_size_kb")"
    
    log_message "INFO" "Completed analysis of $target_dir (${duration}s, $error_count errors)"
    
    rm -f "$temp_file" "$temp_file.results" "$temp_file.errors" 2>/dev/null
}

# Main enhanced disk analysis function
perform_disk_analysis() {
    log_message "INFO" "=== STARTING ENHANCED DISK ANALYSIS ==="
    log_message "INFO" "Number of targets: ${#TARGET_DIRS[@]}"
    log_message "INFO" "Requested results per target: $NUM_DIRS directories"
    log_message "INFO" "Maximum scanning depth: $MAX_DEPTH levels"
    
    # Initialize JSON data structure
    init_json_data
    
    local target_count=0
    for target_dir in "${TARGET_DIRS[@]}"; do
        ((target_count++))
        analyze_single_directory "$target_dir"
    done
    
    # Save JSON data
    save_json_data
    
    log_message "INFO" "=== ENHANCED DISK ANALYSIS COMPLETED ==="
}

# Display enhanced script header
display_header() {
    echo "=================================================="
    echo -e "${PURPLE}Enhanced Disk Space Analyzer v2.0 (Test)${NC}"
    echo "=================================================="
    echo "Features: Deep scanning, JSON export, cross-platform"
    echo "Log file: $LOG_FILE"
    if [[ "$EXPORT_JSON" == "true" ]]; then
        echo "JSON output: $JSON_OUTPUT_FILE"
    fi
    echo ""
}

# Main enhanced function
main() {
    # Initialize logging
    log_message "INFO" "=== TEST ENHANCED DISK ANALYZER SCRIPT STARTED ==="
    log_message "INFO" "Script: $0"
    log_message "INFO" "Arguments: $*"
    
    # Parse arguments
    parse_arguments "$@"
    
    # Display header
    display_header
    
    echo "Scanning for largest directories in:"
    printf "  - %s\n" "${TARGET_DIRS[@]}"
    echo "Maximum depth: $MAX_DEPTH levels"
    echo "This may take a few minutes..."
    echo ""
    
    # Perform the enhanced analysis
    perform_disk_analysis
    
    echo ""
    echo -e "${GREEN}Enhanced analysis complete!${NC}"
    echo "Check $LOG_FILE for detailed logs."
    if [[ "$EXPORT_JSON" == "true" ]]; then
        echo "Structured data available in $JSON_OUTPUT_FILE"
    fi
    log_message "INFO" "=== TEST ENHANCED DISK ANALYZER SCRIPT COMPLETED ==="
}

# Run main function with all arguments
main "$@"
