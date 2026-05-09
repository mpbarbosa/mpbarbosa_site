#!/bin/bash

# enhance_prompt.sh - Enhance prompts using GitHub Copilot CLI
# Version: 1.1.7
# Created: 2025-11-09
# Last Modified: 2025-11-09
# Usage: ./enhance_prompt.sh "your prompt here"

set -euo pipefail

# Script version
VERSION="1.1.7"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display usage
usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS] "PROMPT"

Enhance a prompt using GitHub Copilot CLI with improved English, context, and technical language.

Arguments:
    PROMPT              The prompt to enhance (required)

Options:
    -h, --help          Show this help message
    --version           Show script version
    -m, --model MODEL   Specify AI model (claude-sonnet-4.5, gpt-5, etc.)
    -o, --output FILE   Save enhanced prompt to file
    -v, --verbose       Show detailed processing information

Examples:
    $(basename "$0") "Fix the login"
    $(basename "$0") -m gpt-5 "Add validation to form"
    $(basename "$0") -o enhanced.txt "Optimize database queries"

EOF
    exit 0
}

# Function to print colored messages
print_status() {
    local color=$1
    shift
    echo -e "${color}$*${NC}" >&2
}

# Parse command line arguments
MODEL=""
OUTPUT_FILE=""
VERBOSE=false
PROMPT=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            ;;
        --version)
            echo "$(basename "$0") version $VERSION"
            exit 0
            ;;
        -m|--model)
            MODEL="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
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

# Check if copilot CLI is available
if ! command -v copilot &> /dev/null; then
    print_status "$RED" "Error: GitHub Copilot CLI not found"
    print_status "$YELLOW" "Install it with: npm install -g @githubnext/github-copilot-cli"
    exit 1
fi

# Build the enhancement meta-prompt
META_PROMPT="You are a prompt enhancement expert. Enhance the following prompt by:

1. **Improving English**: Fix grammar, spelling, and sentence structure for clarity
2. **Adding Context**: Include relevant technical details, constraints, and assumptions
3. **Refining Technical Language**: Use precise terminology and industry-standard vocabulary

Original Prompt:
\"$PROMPT\"

Enhanced Prompt (provide ONLY the enhanced version without explanations):"

# Build copilot command
COPILOT_CMD="copilot --allow-all-tools --no-color --prompt"
if [[ -n "$MODEL" ]]; then
    COPILOT_CMD="$COPILOT_CMD --model $MODEL"
fi

# Show verbose information if requested
if [[ "$VERBOSE" = true ]]; then
    print_status "$BLUE" "=== Prompt Enhancement Configuration ==="
    print_status "$BLUE" "Original Prompt: $PROMPT"
    [[ -n "$MODEL" ]] && print_status "$BLUE" "Model: $MODEL"
    [[ -n "$OUTPUT_FILE" ]] && print_status "$BLUE" "Output File: $OUTPUT_FILE"
    print_status "$BLUE" "========================================"
    echo ""
fi

# Execute copilot CLI in non-interactive mode
print_status "$YELLOW" "Enhancing prompt..."

# Create temp file for full output
TEMP_OUTPUT=$(mktemp)
trap 'rm -f "$TEMP_OUTPUT"' EXIT

$COPILOT_CMD "$META_PROMPT" > "$TEMP_OUTPUT" 2>&1
EXIT_CODE=$?

if [[ $EXIT_CODE -ne 0 ]]; then
    print_status "$RED" "Error: Copilot CLI failed with exit code $EXIT_CODE"
    cat "$TEMP_OUTPUT" >&2
    exit $EXIT_CODE
fi

# Extract enhanced prompt by removing:
# - Lines starting with "Total" (usage stats)
# - Lines with model names (claude-sonnet, gpt-)  
# - Empty lines at start/end
# - "Enhanced Prompt:" label if present
ENHANCED_PROMPT=$(cat "$TEMP_OUTPUT" | \
    sed '/^Total usage/,$d' | \
    sed '/^Total duration/d' | \
    sed '/^Usage by model/d' | \
    sed '/^[[:space:]]*claude-sonnet/d' | \
    sed '/^[[:space:]]*gpt-/d' | \
    sed 's/^\*\*Enhanced Prompt:\*\*//' | \
    sed 's/^Enhanced Prompt://' | \
    sed '/^[[:space:]]*$/d' | \
    sed -e :a -e '/^\n*$/{$d;N;ba' -e '}')

if [[ -z "$ENHANCED_PROMPT" ]]; then
    print_status "$RED" "Error: No enhanced prompt generated"
    print_status "$YELLOW" "Full output:"
    cat "$TEMP_OUTPUT" >&2
    exit 1
fi

# Display the enhanced prompt
print_status "$GREEN" "=== Enhanced Prompt ==="
echo "$ENHANCED_PROMPT"
print_status "$GREEN" "======================="

# Save to file if requested
if [[ -n "$OUTPUT_FILE" ]]; then
    echo "$ENHANCED_PROMPT" > "$OUTPUT_FILE"
    print_status "$GREEN" "Enhanced prompt saved to: $OUTPUT_FILE"
fi

exit 0
