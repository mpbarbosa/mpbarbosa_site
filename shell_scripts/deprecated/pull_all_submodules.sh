#!/bin/bash

# =============================================================================
# Pull All Submodules Script (DEPRECATED)
# =============================================================================
# ⚠️  DEPRECATION WARNING ⚠️
# This script is DEPRECATED as of December 2025.
# 
# REASON: The project has migrated from git submodules to sibling projects.
# All four projects (music_in_numbers, guia_turistico, monitora_vagas, 
# busca_vagas) are now managed as independent sibling repositories.
#
# RECOMMENDED WORKFLOW:
# Instead of using this script, manage each sibling project directly:
#
#   cd ../music_in_numbers && git pull
#   cd ../guia_turistico && git pull
#   cd ../monitora_vagas && git pull
#   cd ../busca_vagas && git pull
#
# See: .github/copilot-instructions.md for current sibling project workflow
# =============================================================================
# Description: Pulls the main repository and all submodules in proper hierarchical order
# Author: MP Barbosa
# Date: October 27, 2025
# Version: 1.1.0 (DEPRECATED - December 25, 2025)
#
# This script follows the git best practices guide for submodule management:
# 1. Main repository first (detects current branch dynamically)
# 2. All submodules with recursive flag
# 3. Individual verification for nested submodules using absolute paths
# 4. Safe stash management for local changes
# =============================================================================

set -e  # Exit on error
set -u  # Exit on undefined variable

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Display deprecation warning
echo -e "${RED}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║                    ⚠️  DEPRECATION WARNING ⚠️                     ║${NC}"
echo -e "${RED}╠════════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${RED}║ This script is DEPRECATED as of December 2025                     ║${NC}"
echo -e "${RED}║                                                                    ║${NC}"
echo -e "${RED}║ REASON: Project migrated from git submodules to sibling projects  ║${NC}"
echo -e "${RED}║                                                                    ║${NC}"
echo -e "${RED}║ RECOMMENDED: Use direct git commands in each project:             ║${NC}"
echo -e "${YELLOW}║   cd ../music_in_numbers && git pull                              ║${NC}"
echo -e "${YELLOW}║   cd ../guia_turistico && git pull                                ║${NC}"
echo -e "${YELLOW}║   cd ../monitora_vagas && git pull                                ║${NC}"
echo -e "${YELLOW}║   cd ../busca_vagas && git pull                                   ║${NC}"
echo -e "${RED}║                                                                    ║${NC}"
echo -e "${RED}║ See: .github/copilot-instructions.md for current workflow         ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
read -p "Press Enter to continue anyway, or Ctrl+C to exit..."
echo ""

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
STASH_MESSAGE="Temporary stash for pull operations - $(date)"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository!"
        exit 1
    fi
}

# Function to safely stash changes if needed
safe_stash() {
    local stash_needed=false
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        stash_needed=true
    fi
    
    # Check for untracked files that might interfere
    if [ -n "$(git ls-files --others --exclude-standard)" ]; then
        stash_needed=true
    fi
    
    if [ "$stash_needed" = true ]; then
        log_warning "Local changes detected. Stashing them safely..."
        git stash push --include-untracked -m "$STASH_MESSAGE"
        log_info "Changes stashed successfully"
        return 0  # Stash was created
    else
        log_info "No local changes to stash"
        return 1  # No stash was created
    fi
}

# Function to restore stash if it was created
restore_stash() {
    local stash_name="$1"
    if git stash list | grep -q "$stash_name"; then
        log_info "Restoring previously stashed changes..."
        if git stash pop "$(git stash list | grep "$stash_name" | cut -d: -f1)"; then
            log_success "Stash restored successfully"
        else
            log_warning "Stash restoration had conflicts. Please resolve manually."
        fi
    fi
}

# Function to pull main repository
pull_main_repo() {
    log_step "Step 1: Pulling main repository"
    
    # Get current branch name dynamically (supports any branch, not just main)
    local current_branch
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    # Fetch latest changes
    log_info "Fetching latest changes from origin..."
    git fetch origin
    
    # Check if we're behind
    local behind_count
    behind_count=$(git rev-list --count HEAD..origin/"$current_branch" 2>/dev/null || echo "0")
    
    if [ "$behind_count" -gt 0 ]; then
        log_info "Main repository is $behind_count commits behind origin/$current_branch"
        log_info "Pulling latest changes..."
        git pull origin "$current_branch"
        log_success "Main repository updated successfully"
    else
        log_success "Main repository is already up-to-date (branch: $current_branch)"
    fi
}

# Function to pull all submodules recursively
pull_submodules_recursive() {
    log_step "Step 2: Pulling all submodules recursively"
    
    # Check if there are any submodules
    if [ ! -f .gitmodules ]; then
        log_info "No submodules found in this repository"
        return 0
    fi
    
    # Fetch all submodules
    log_info "Fetching all submodules recursively..."
    git submodule foreach --recursive git fetch origin
    
    # Update all submodules to their latest remote versions
    log_info "Updating all submodules to latest remote versions..."
    git submodule update --remote --merge --recursive
    
    log_success "All submodules updated successfully"
}

# Function to verify individual submodules
verify_submodules() {
    log_step "Step 3: Verifying individual submodules"
    
    if [ ! -f .gitmodules ]; then
        return 0
    fi
    
    # Get list of all initialized submodules recursively using git submodule foreach
    # This is more reliable than parsing .gitmodules as it only includes initialized submodules
    local submodules
    submodules=$(git submodule foreach --quiet --recursive 'echo $displaypath' 2>/dev/null || echo "")
    
    if [ -z "$submodules" ]; then
        log_info "No initialized submodules found"
        return 0
    fi
    
    while IFS= read -r submodule; do
        # Convert to absolute path for reliable directory access across nested structures
        local submodule_path="$REPO_ROOT/$submodule"
        
        if [ -d "$submodule_path" ]; then
            log_info "Verifying submodule: $submodule"
            
            (
                cd "$submodule_path"
                local status
                status=$(git status --porcelain)
                local branch
                branch=$(git branch --show-current)
                local latest_commit
                latest_commit=$(git log --oneline -1)
                
                if [ -z "$status" ]; then
                    log_success "  ✓ $submodule: Clean (on $branch) - $latest_commit"
                else
                    log_warning "  ⚠ $submodule: Has local changes (on $branch) - $latest_commit"
                fi
            )
        else
            log_warning "Submodule directory not found: $submodule"
        fi
    done <<< "$submodules"
}

# Function to ensure all submodules are initialized
ensure_submodules_initialized() {
    log_step "Step 4: Ensuring all submodules are initialized"
    
    if [ ! -f .gitmodules ]; then
        return 0
    fi
    
    log_info "Initializing and updating all submodules recursively..."
    git submodule update --init --recursive
    
    log_success "All submodules initialized and updated"
}

# Function to show final status
show_final_status() {
    log_step "Final Status Summary"
    
    # Main repository status
    local main_commit
    main_commit=$(git log --oneline -1)
    log_info "Main repository: $main_commit"
    
    # Submodule status
    if [ -f .gitmodules ]; then
        log_info "Submodule status:"
        git submodule status --recursive | while read -r line; do
            log_info "  $line"
        done
    fi
    
    # Check for any uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null || [ -n "$(git ls-files --others --exclude-standard)" ]; then
        log_warning "There are uncommitted changes in the repository"
        git status --short
    else
        log_success "Repository is clean with no uncommitted changes"
    fi
}

# Main execution function
main() {
    log_info "=== Pull All Submodules Script ==="
    log_info "Starting comprehensive repository and submodule pull operation"
    log_info "Repository: $(basename "$REPO_ROOT")"
    log_info "Timestamp: $(date)"
    echo
    
    # Navigate to repository root
    cd "$REPO_ROOT"
    
    # Verify we're in a git repository
    check_git_repo
    
    # Safely stash local changes if needed
    local stash_created=false
    if safe_stash; then
        stash_created=true
    fi
    
    # Execute pull operations in proper order
    pull_main_repo
    echo
    
    pull_submodules_recursive
    echo
    
    verify_submodules
    echo
    
    ensure_submodules_initialized
    echo
    
    # Restore stash if it was created
    if [ "$stash_created" = true ]; then
        restore_stash "$STASH_MESSAGE"
        echo
    fi
    
    # Show final status
    show_final_status
    echo
    
    log_success "=== Pull operation completed successfully! ==="
    log_info "All repositories and submodules are now synchronized with their remote origins"
}

# Help function
show_help() {
    cat << EOF
Pull All Submodules Script

DESCRIPTION:
    Pulls the main repository and all submodules in proper hierarchical order.
    Follows git best practices for submodule management with safe stash handling.

USAGE:
    $0 [OPTIONS]

OPTIONS:
    -h, --help      Show this help message
    -v, --verbose   Enable verbose output (default: enabled)
    --dry-run       Show what would be done without executing

FEATURES:
    • Pulls main repository first
    • Recursively fetches and updates all submodules
    • Handles nested submodules properly
    • Safe stash management for local changes
    • Comprehensive status verification
    • Colored output for better visibility

EXAMPLES:
    $0                  # Pull everything
    $0 --help          # Show this help
    $0 --dry-run       # Preview operations

AUTHOR:
    MP Barbosa - $(date +%Y)

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -v|--verbose)
            # Verbose is already default
            shift
            ;;
        --dry-run)
            log_info "DRY RUN: Would execute the following operations:"
            log_info "1. Fetch and pull main repository"
            log_info "2. Fetch all submodules recursively"
            log_info "3. Update all submodules to latest remote versions"
            log_info "4. Verify individual submodule status"
            log_info "5. Initialize any missing submodules"
            log_info "6. Show final status summary"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Execute main function
main "$@"