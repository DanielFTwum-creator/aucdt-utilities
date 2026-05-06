#!/bin/bash

# Enhanced Windows-Optimized Disk Space Analyzer with JSON Export
# Backward compatible with PowerDesk-style data visualization
# Supports comprehensive analysis with structured data export

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/disk-analyser.log"
JSON_OUTPUT_FILE="$SCRIPT_DIR/disk-analysis-data.json"
NUM_DIRS=20
TARGET_DIRS=()
DEBUG_MODE=${DEBUG:-false}
MAX_DEPTH=4  # Enhanced depth scanning
EXPORT_JSON=${EXPORT_JSON:-true}

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Progress indicator variables
TOTAL_DIRS_TO_SCAN=0
CURRENT_DIR_COUNT=0

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
            stat -c %Y "$dir" 2>/dev/null || echo "0"
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
        date -d "@$timestamp" '+%d/%m/%Y' 2>/dev/null || echo "Unknown"
    fi
}

# Enhanced tree structure generation
generate_tree_structure() {
    local base_dir="$1"
    local current_depth="$2"
    local max_depth="$3"
    local prefix="$4"
    local is_last="$5"
    
    if [[ $current_depth -gt $max_depth ]]; then
        return
    fi
    
    local dir_name=$(basename "$base_dir")
    local size_kb=$(du -sk "$base_dir" 2>/dev/null | cut -f1)
    local file_count=$(get_file_count "$base_dir")
    local mod_timestamp=$(get_modification_date "$base_dir")
    local mod_date=$(format_date "$mod_timestamp")
    local formatted_size=$(format_size "$size_kb")
    
    # Create tree structure symbol
    local tree_symbol="├── "
    if [[ "$is_last" == "true" ]]; then
        tree_symbol="└── "
    fi
    
    # Print current directory info
    printf "%s%s%s %s [%s files] [%s]\n" \
        "$prefix" "$tree_symbol" "$dir_name" \
        "$formatted_size" "$file_count" "$mod_date"
    
    # Update prefix for children
    local new_prefix="$prefix"
    if [[ "$is_last" == "true" ]]; then
        new_prefix="${prefix}    "
    else
        new_prefix="${prefix}│   "
    fi
    
    # Process subdirectories
    if [[ $current_depth -lt $max_depth && -d "$base_dir" && -r "$base_dir" ]]; then
        local subdirs=()
        while IFS= read -r -d '' subdir; do
            subdirs+=("$subdir")
        done < <(find "$base_dir" -maxdepth 1 -type d ! -path "$base_dir" -print0 2>/dev/null | sort -z)
        
        local total_subdirs=${#subdirs[@]}
        local current_index=0
        
        for subdir in "${subdirs[@]}"; do
            ((current_index++))
            local is_last_child="false"
            if [[ $current_index -eq $total_subdirs ]]; then
                is_last_child="true"
            fi
            
            generate_tree_structure "$subdir" $((current_depth + 1)) "$max_depth" \
                "$new_prefix" "$is_last_child"
        done
    fi
}

# Target directory detection (enhanced with better Windows support)
detect_target_directory() {
    log_message "DEBUG" "Auto-detecting appropriate target directory..."
    
    local candidates=(
        "/c/Users/$USER/AppData"
        "/c/Users/$USERNAME/AppData"
        "$USERPROFILE/AppData"
        "/c/Users/$USER"
        "/c/Users/$USERNAME"
        "/c/Users"
        "/c/Program Files"
        "/c/Program Files (x86)"
        "/c"
    )
    
    for dir in "${candidates[@]}"; do
        local normalized_dir=$(echo "$dir" | sed 's|\\|/|g' | sed 's|^[A-Z]:|/c|')
        log_message "DEBUG" "Checking candidate directory: $normalized_dir"
        
        if [[ -d "$normalized_dir" && -r "$normalized_dir" ]]; then
            log_message "INFO" "Selected target directory: $normalized_dir"
            echo "$normalized_dir"
            return 0
        fi
    done
    
    log_message "ERROR" "No suitable target directory found"
    return 1
}

# Parse command line arguments (enhanced)
parse_arguments() {
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

# Enhanced system information logging
log_system_info() {
    log_message "INFO" "=== ENHANCED WINDOWS SYSTEM INFORMATION ==="
    log_message "INFO" "Target Directories: ${TARGET_DIRS[*]}"
    log_message "INFO" "Requested results per directory: $NUM_DIRS"
    log_message "INFO" "Maximum scanning depth: $MAX_DEPTH"
    log_message "INFO" "JSON export enabled: $EXPORT_JSON"
    log_message "INFO" "JSON output file: $JSON_OUTPUT_FILE"
    log_message "INFO" "Script directory: $SCRIPT_DIR"
    log_message "INFO" "Log file: $LOG_FILE"
    log_message "INFO" "User: $USER (USERNAME: $USERNAME)"
    log_message "INFO" "Home: $HOME"
    log_message "INFO" "PWD: $PWD"
    log_message "INFO" "Shell: $SHELL"
    log_message "INFO" "OS Type: $OSTYPE"
    log_message "INFO" "Debug mode: $DEBUG_MODE"
}

# Check for Windows admin privileges
check_windows_admin() {
    log_message "DEBUG" "Checking Windows administrator privileges..."
    
    if command -v net.exe >/dev/null 2>&1; then
        if net.exe session >/dev/null 2>&1; then
            log_message "INFO" "Running with administrator privileges"
            return 0
        else
            log_message "WARNING" "Not running with administrator privileges - some directories may be inaccessible"
            return 1
        fi
    else
        log_message "WARNING" "Cannot determine administrator status"
        return 1
    fi
}

# Enhanced environment validation
validate_environment() {
    log_message "INFO" "Starting enhanced Windows environment validation"
    local validation_errors=0
    
    # Check if we're in a Windows environment
    if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "cygwin" ]]; then
        log_message "WARNING" "Not detected as Windows environment (OSTYPE: $OSTYPE)"
        ((validation_errors++))
    fi
    
    # Check Git Bash specific paths
    if [[ ! -d "/c" ]]; then
        log_message "WARNING" "Git Bash C: drive mount not found at /c"
        ((validation_errors++))
    fi
    
    # Validate target directories
    log_message "INFO" "Validating target directories: ${TARGET_DIRS[*]}"
    for dir in "${TARGET_DIRS[@]}"; do
        if [[ ! -d "$dir" ]]; then
            log_message "ERROR" "Target directory does not exist: $dir"
            ((validation_errors++))
        elif [[ ! -r "$dir" ]]; then
            log_message "WARNING" "Target directory is not readable: $dir"
        fi
    done
    
    # Check required commands
    local required_commands=("du" "sort" "head" "awk" "sed" "find" "stat" "date")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            log_message "ERROR" "Required command not found: $cmd"
            ((validation_errors++))
        fi
    done
    
    # Check write permissions for output files
    if ! touch "$LOG_FILE" 2>/dev/null; then
        log_message "ERROR" "Cannot write to log file: $LOG_FILE"
        ((validation_errors++))
    fi
    
    if [[ "$EXPORT_JSON" == "true" ]] && ! touch "$JSON_OUTPUT_FILE" 2>/dev/null; then
        log_message "ERROR" "Cannot write to JSON output file: $JSON_OUTPUT_FILE"
        ((validation_errors++))
    fi
    
    log_message "INFO" "Environment validation completed ($validation_errors errors)"
    
    if [[ $validation_errors -gt 0 ]]; then
        log_message "ERROR" "Environment validation failed - some features may not work properly"
        return 1
    fi
    
    return 0
}

# Initialize JSON structure
init_json_data() {
    if [[ "$EXPORT_JSON" == "true" ]]; then
        log_message "JSON" "Initializing JSON data structure"
        JSON_DATA='{"analysis_metadata":{"timestamp":"'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'","script_version":"enhanced-v2.0","max_depth":'$MAX_DEPTH',"target_directories":['
        
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
    
    # Escape JSON special characters safely
    dir_path=$(printf '%s\n' "$dir_path" | sed 's/\\/\\\\/g; s/"/\\"/g')
    dir_name=$(printf '%s\n' "$dir_name" | sed 's/\\/\\\\/g; s/"/\\"/g')
    parent_path=$(printf '%s\n' "$parent_path" | sed 's/\\/\\\\/g; s/"/\\"/g')
    
    local json_entry='{"name":"'"$dir_name"'","path":"'"$dir_path"'","size_kb":'$size_kb',"size_formatted":"'"$formatted_size"'","file_count":'$file_count',"modification_timestamp":'$mod_timestamp',"modification_date":"'"$mod_date"'","depth":'$depth',"parent_path":"'"$parent_path"'","percentage":'$percentage'}'
    
    # Insert into JSON structure using string replacement instead of sed
    if [[ "$JSON_DATA" == *'"directory_analysis":[]'* ]]; then
        JSON_DATA="${JSON_DATA/\"directory_analysis\":\[\]/\"directory_analysis\":\[$json_entry\]}"
    else
        JSON_DATA="${JSON_DATA/\"directory_analysis\":\[/\"directory_analysis\":\[$json_entry,}"
    fi
}

# Save JSON data to file
save_json_data() {
    if [[ "$EXPORT_JSON" == "true" && -n "$JSON_DATA" ]]; then
        log_message "JSON" "Saving JSON data to $JSON_OUTPUT_FILE"
        echo "$JSON_DATA" | python3 -m json.tool > "$JSON_OUTPUT_FILE" 2>/dev/null || echo "$JSON_DATA" > "$JSON_OUTPUT_FILE"
        log_message "JSON" "JSON export completed successfully"
    fi
}

# Enhanced progress reporting
show_progress() {
    local current="$1"
    local total="$2"
    local operation="$3"
    
    local percentage=0
    if [[ $total -gt 0 ]]; then
        percentage=$(( (current * 100) / total ))
    fi
    
    printf "\r${BLUE}[PROGRESS]${NC} %s: %d/%d (%d%%) " "$operation" "$current" "$total" "$percentage"
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
        head -10 "$temp_file.errors" | while read -r line; do
            log_message "WARNING" "Access denied: $line"
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
    
    # Display tree structure for top directory
    if [[ $result_count -gt 0 ]]; then
        echo ""
        echo -e "${CYAN}Directory Tree Structure (depth $MAX_DEPTH):${NC}"
        echo "================================================================"
        generate_tree_structure "$target_dir" 1 3 "" "true"
    fi
    
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
        show_progress "$target_count" "${#TARGET_DIRS[@]}" "Analyzing directories"
        analyze_single_directory "$target_dir"
    done
    
    # Save JSON data
    save_json_data
    
    log_message "INFO" "=== ENHANCED DISK ANALYSIS COMPLETED ==="
}

# Display enhanced script header
display_header() {
    echo "=================================================="
    echo -e "${PURPLE}Enhanced Windows Disk Space Analyzer v2.0${NC}"
    echo "=================================================="
    echo "Features: Deep scanning, JSON export, tree view"
    echo "Log file: $LOG_FILE"
    if [[ "$EXPORT_JSON" == "true" ]]; then
        echo "JSON output: $JSON_OUTPUT_FILE"
    fi
    echo ""
}

# Display enhanced usage information
display_usage() {
    echo "Usage: $0 [number_of_results] [directory1] [directory2] ..."
    echo ""
    echo "Enhanced Features:"
    echo "  - Deep directory scanning (up to 4 levels)"
    echo "  - File count analysis per directory"
    echo "  - Modification date tracking"
    echo "  - JSON data export for visualization"
    echo "  - Tree structure display"
    echo "  - Percentage calculations"
    echo ""
    echo "Examples:"
    echo "  $0                          # Auto-detect and show top 20 directories"
    echo "  $0 10                       # Auto-detect and show top 10 directories"
    echo "  $0 /c/Users                 # Analyze /c/Users and show top 20"
    echo "  $0 15 /c/Users /c/Program*  # Show top 15 from specified directories"
    echo ""
    echo "Environment variables:"
    echo "  DEBUG=true                  # Enable debug logging"
    echo "  EXPORT_JSON=false          # Disable JSON export"
    echo ""
    echo "Output files:"
    echo "  disk-analyser.log          # Detailed execution log"
    echo "  disk-analysis-data.json    # Structured data for visualization"
    echo ""
}

# Enhanced cleanup function
cleanup() {
    log_message "INFO" "Enhanced script execution completed - cleaning up"
    # Remove any temporary files that might be left behind
    rm -f /tmp/tmp.* 2>/dev/null
    
    # Finalize JSON if not already done
    if [[ "$EXPORT_JSON" == "true" && -n "$JSON_DATA" ]]; then
        save_json_data
    fi
}

# Main enhanced function
main() {
    # Set up cleanup trap
    trap cleanup EXIT
    
    # Initialize logging
    log_message "INFO" "=== ENHANCED DISK ANALYZER SCRIPT STARTED ==="
    log_message "INFO" "Script: $0"
    log_message "INFO" "Arguments: $*"
    
    # Parse arguments
    parse_arguments "$@"
    
    # Display header
    display_header
    
    # Show usage if help requested
    if [[ "$1" == "-h" || "$1" == "--help" ]]; then
        display_usage
        exit 0
    fi
    
    # Log system information
    log_system_info
    
    # Validate environment
    if ! validate_environment; then
        log_message "ERROR" "Environment validation failed - exiting"
        exit 1
    fi
    
    # Check privileges
    check_windows_admin
    
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
    log_message "INFO" "=== ENHANCED DISK ANALYZER SCRIPT COMPLETED ==="
}

# Run main function with all arguments
main "$@"
