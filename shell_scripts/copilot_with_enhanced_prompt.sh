#!/bin/bash

# copilot_with_enhanced_prompt.sh - Execute Copilot with an enhanced prompt
# Usage: ./copilot_with_enhanced_prompt.sh "your prompt here"

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENHANCE_SCRIPT="$SCRIPT_DIR/enhance_prompt.sh"

# Function to display usage
usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS] "PROMPT"

Enhance a prompt and execute it with GitHub Copilot CLI in two stages:
  1. Enhance the prompt (better English, context, technical language)
  2. Execute the enhanced prompt with Copilot CLI

Arguments:
    PROMPT              The original prompt to enhance and execute (required)

Options:
    -h, --help          Show this help message
    -m, --model MODEL   Specify AI model for both enhancement and execution
    --enhance-model M   Specify AI model only for enhancement step
    --exec-model M      Specify AI model only for execution step
    -s, --save FILE     Save enhanced prompt to file before execution
    -v, --verbose       Show detailed processing information
    --show-enhanced     Display the enhanced prompt before execution
    --dry-run           Only enhance the prompt, don't execute it

Examples:
    $(basename "$0") "Fix the login"
    $(basename "$0") -m claude-sonnet-4.5 "Add validation to form"
    $(basename "$0") --show-enhanced "Optimize database queries"
    $(basename "$0") --dry-run -s enhanced.txt "Debug authentication"

EOF
    exit 0
}

# Function to print colored messages
print_status() {
    local color=$1
    shift
    echo -e "${color}$*${NC}" >&2
}

# Function to print section headers
print_section() {
    echo "" >&2
    print_status "$CYAN" "═══════════════════════════════════════════════════════════"
    print_status "$CYAN" "$1"
    print_status "$CYAN" "═══════════════════════════════════════════════════════════"
}

# Parse command line arguments
MODEL=""
ENHANCE_MODEL=""
EXEC_MODEL=""
SAVE_FILE=""
VERBOSE=false
SHOW_ENHANCED=false
DRY_RUN=false
PROMPT=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            ;;
        -m|--model)
            MODEL="$2"
            shift 2
            ;;
        --enhance-model)
            ENHANCE_MODEL="$2"
            shift 2
            ;;
        --exec-model)
            EXEC_MODEL="$2"
            shift 2
            ;;
        -s|--save)
            SAVE_FILE="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        --show-enhanced)
            SHOW_ENHANCED=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -*)
            print_status "$RED" "Error: Unknown option: $1"
            usage
            ;;
        *)
            PROMPT="$1"
            shift
            ;;
    esac
done

# Validate prompt argument
if [[ -z "$PROMPT" ]]; then
    print_status "$RED" "Error: Prompt is required"
    usage
fi

# Check if enhance_prompt.sh exists
if [[ ! -f "$ENHANCE_SCRIPT" ]]; then
    print_status "$RED" "Error: Enhancement script not found at: $ENHANCE_SCRIPT"
    exit 1
fi

if [[ ! -x "$ENHANCE_SCRIPT" ]]; then
    print_status "$RED" "Error: Enhancement script is not executable: $ENHANCE_SCRIPT"
    print_status "$YELLOW" "Fix with: chmod +x $ENHANCE_SCRIPT"
    exit 1
fi

# Check if copilot CLI is available
if ! command -v copilot &> /dev/null; then
    print_status "$RED" "Error: GitHub Copilot CLI not found"
    print_status "$YELLOW" "Install it with: npm install -g @githubnext/github-copilot-cli"
    exit 1
fi

# Determine models to use
FINAL_ENHANCE_MODEL="${ENHANCE_MODEL:-$MODEL}"
FINAL_EXEC_MODEL="${EXEC_MODEL:-$MODEL}"

# Show configuration if verbose
if [[ "$VERBOSE" = true ]]; then
    print_section "Configuration"
    print_status "$BLUE" "Original Prompt: $PROMPT"
    [[ -n "$FINAL_ENHANCE_MODEL" ]] && print_status "$BLUE" "Enhancement Model: $FINAL_ENHANCE_MODEL"
    [[ -n "$FINAL_EXEC_MODEL" ]] && print_status "$BLUE" "Execution Model: $FINAL_EXEC_MODEL"
    [[ -n "$SAVE_FILE" ]] && print_status "$BLUE" "Save Enhanced To: $SAVE_FILE"
    [[ "$DRY_RUN" = true ]] && print_status "$BLUE" "Mode: Dry Run (enhancement only)"
fi

# Build enhancement command
ENHANCE_CMD="$ENHANCE_SCRIPT"
[[ -n "$FINAL_ENHANCE_MODEL" ]] && ENHANCE_CMD="$ENHANCE_CMD --model $FINAL_ENHANCE_MODEL"
[[ -n "$SAVE_FILE" ]] && ENHANCE_CMD="$ENHANCE_CMD --output $SAVE_FILE"

# Step 1: Enhance the prompt
print_section "Step 1: Enhancing Prompt"

# Create temp file to capture the output
TEMP_FILE=$(mktemp)
trap 'rm -f "$TEMP_FILE"' EXIT

# Run enhance script and capture output, strip color codes
$ENHANCE_CMD "$PROMPT" 2>&1 | sed 's/\x1b\[[0-9;]*m//g' > "$TEMP_FILE"
ENHANCE_EXIT_CODE=${PIPESTATUS[0]}

if [[ $ENHANCE_EXIT_CODE -ne 0 ]]; then
    print_status "$RED" "Error: Prompt enhancement failed with exit code $ENHANCE_EXIT_CODE"
    cat "$TEMP_FILE" >&2
    exit $ENHANCE_EXIT_CODE
fi

# Extract the enhanced prompt (between the === markers)
ENHANCED_PROMPT=$(grep -A 1000 "^=== Enhanced Prompt ===" "$TEMP_FILE" | \
    grep -B 1000 "^=======================" | \
    grep -v "^===" | \
    sed '/^$/d')

if [[ -z "$ENHANCED_PROMPT" ]]; then
    print_status "$RED" "Error: No enhanced prompt found"
    print_status "$YELLOW" "Full output:"
    cat "$TEMP_FILE" >&2
    exit 1
fi

# Always show the enhanced prompt
print_section "Enhanced Prompt"
echo "$ENHANCED_PROMPT"

# Exit if dry-run
if [[ "$DRY_RUN" = true ]]; then
    print_status "$GREEN" "✓ Dry run completed - enhanced prompt shown above"
    exit 0
fi

# Step 2: Execute with Copilot CLI
print_section "Step 2: Executing Enhanced Prompt with Copilot"

# Build copilot execution command
COPILOT_CMD="copilot --allow-all-tools --prompt"
[[ -n "$FINAL_EXEC_MODEL" ]] && COPILOT_CMD="$COPILOT_CMD --model $FINAL_EXEC_MODEL"

# Execute the enhanced prompt
$COPILOT_CMD "$ENHANCED_PROMPT"
EXEC_EXIT_CODE=$?

if [[ $EXEC_EXIT_CODE -ne 0 ]]; then
    print_status "$RED" "Error: Copilot execution failed with exit code $EXEC_EXIT_CODE"
    exit $EXEC_EXIT_CODE
fi

print_section "Completed Successfully"
print_status "$GREEN" "✓ Prompt enhanced and executed"

exit 0
