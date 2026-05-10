#!/bin/bash
#
# Capacitor Batch Setup Script (Bash - macOS/Linux)
# Runs capacitor-setup-batch.ps1 with proper error handling
#
# USAGE:
#   ./run-capacitor-batch.sh capacitor-projects-example.csv
#   ./run-capacitor-batch.sh projects.csv --skip-build --skip-commit
#
# REQUIREMENTS:
#   - PowerShell 7+ (or pwsh)
#   - capacitor-setup-batch.ps1 in same directory
#   - Project CSV or JSON file

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PS_SCRIPT="$SCRIPT_DIR/capacitor-setup-batch.ps1"
LOG_FILE="$SCRIPT_DIR/batch-setup.log"

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ $# -eq 0 ]; then
    cat << 'EOF'

╔════════════════════════════════════════════════════════════════╗
║     Capacitor Batch Setup for TUC React Projects              ║
║     Bash Runner (macOS/Linux)                                 ║
╚════════════════════════════════════════════════════════════════╝

USAGE:
  ./run-capacitor-batch.sh PROJECT-FILE [OPTIONS]

EXAMPLES:
  ./run-capacitor-batch.sh capacitor-projects-example.csv
  ./run-capacitor-batch.sh projects.csv --skip-build
  ./run-capacitor-batch.sh projects.json --skip-commit

OPTIONS:
  --skip-build         Skip web bundle builds
  --skip-commit        Don't commit changes
  --continue-error     Continue if one project fails

FEATURES:
  ✓ Runs PowerShell script with proper permissions
  ✓ Displays progress and results
  ✓ Logs errors to batch-setup.log
  ✓ Shows colorized output

ESTIMATED TIME:
  - 5 projects: 15-25 minutes
  - 10 projects: 30-50 minutes
  - 50 projects: 2.5-4 hours

REQUIREMENTS:
  - PowerShell 7+ (brew install powershell on macOS)
  - capacitor-setup-batch.ps1 in same directory

EOF
    exit 1
fi

PROJECTS_FILE="$1"

# Validate files
if [ ! -f "$PROJECTS_FILE" ]; then
    echo -e "${RED}❌ Error: Projects file not found: $PROJECTS_FILE${NC}"
    exit 1
fi

if [ ! -f "$PS_SCRIPT" ]; then
    echo -e "${RED}❌ Error: Setup script not found: $PS_SCRIPT${NC}"
    exit 1
fi

# Check for PowerShell
if ! command -v pwsh &> /dev/null; then
    echo -e "${RED}❌ Error: PowerShell 7+ (pwsh) not found${NC}"
    echo "Install with: brew install powershell"
    exit 1
fi

# Display header
echo -e ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗"
echo -e "║         Capacitor Batch Setup - Starting                      ║"
echo -e "╚════════════════════════════════════════════════════════════════╝${NC}"
echo -e ""
echo "Projects file: $PROJECTS_FILE"
echo "Setup script:  $PS_SCRIPT"
echo "Log file:      $LOG_FILE"
echo "Timestamp:     $(date)"
echo ""

# Build PowerShell arguments
PS_ARGS="-NoProfile -ExecutionPolicy Bypass -File \"$PS_SCRIPT\" -ProjectsFile \"$PROJECTS_FILE\""

# Add optional parameters
shift
while [ $# -gt 0 ]; do
    case "$1" in
        --skip-build)
            PS_ARGS="$PS_ARGS -SkipBuild"
            echo "✓ Skip build: enabled"
            ;;
        --skip-commit)
            PS_ARGS="$PS_ARGS -SkipCommit"
            echo "✓ Skip commit: enabled"
            ;;
        --continue-error)
            PS_ARGS="$PS_ARGS -ContinueOnError"
            echo "✓ Continue on error: enabled"
            ;;
    esac
    shift
done

echo ""
echo "Running: pwsh $PS_ARGS"
echo ""

# Run PowerShell script with output to both console and log file
pwsh $PS_ARGS 2>&1 | tee "$LOG_FILE"
EXIT_CODE=${PIPESTATUS[0]}

# Display result
echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗"
    echo -e "║              ✅ Batch Setup Complete                          ║"
    echo -e "╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Log saved to: $LOG_FILE"
    echo ""
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════════╗"
    echo -e "║              ❌ Batch Setup Failed                            ║"
    echo -e "╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Exit code: $EXIT_CODE"
    echo "Log saved to: $LOG_FILE"
    echo ""
    exit 1
fi
