#!/bin/bash

# =============================================================================
# Push All Submodules Script
# =============================================================================
# Description: Pushes all modified files in proper hierarchical order (bottom-up)
# Author: MP Barbosa
# Date: October 27, 2025
# Version: 1.0.0
#
# This script follows the git best practices guide for submodule management:
# 1. Push deepest nested submodules first (bottom-up approach)
# 2. Push direct submodules 
# 3. Update main repository submodule references
# 4. Push main repository last
# 5. Handle stashed modifications if requested
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

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HANDLE_STASH=false

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

# Function to handle stashed modifications
handle_stashed_modifications() {
    if [ "$HANDLE_STASH" = false ]; then
        return 0
    fi
    
    log_step "Handling stashed modifications"
    
    local stash_list
    stash_list=$(git stash list)
    
    if [ -z "$stash_list" ]; then
        log_info "No stashes found"
        return 0
    fi
    
    log_info "Found the following stashes:"
    echo "$stash_list"
    echo
    
    read -p "Do you want to pop and commit the most recent stash? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Popping most recent stash..."
        if git stash pop; then
            log_success "Stash popped successfully"
            return 0  # Indicate that changes were popped
        else
            log_error "Failed to pop stash. Please resolve conflicts manually."
            exit 1
        fi
    else
        log_info "Skipping stash handling"
        return 1  # Indicate that no changes were popped
    fi
}

# Function to get all submodules in hierarchical order (deepest first)
get_submodules_hierarchical() {
    if [ ! -f .gitmodules ]; then
        return 0
    fi
    
    # Get all submodules recursively and sort by depth (deepest first)
    git submodule foreach --quiet --recursive 'echo $displaypath' | \
        awk '{ print gsub(/\//, "/") + 1, $0 }' | \
        sort -nr | \
        awk '{ print $2 }'
}

# Function to check if a directory has uncommitted changes
has_changes() {
    local dir="$1"
    
    # Convert to absolute path if relative
    if [[ ! "$dir" =~ ^/ ]]; then
        dir="$REPO_ROOT/$dir"
    fi
    
    # Check if directory exists
    if [ ! -d "$dir" ]; then
        return 1  # No changes if directory doesn't exist
    fi
    
    (
        cd "$dir"
        # Check for staged changes
        if ! git diff-index --quiet --cached HEAD -- 2>/dev/null; then
            return 0  # Has changes
        fi
        # Check for unstaged changes
        if ! git diff-index --quiet HEAD -- 2>/dev/null; then
            return 0  # Has changes
        fi
        # Check for untracked files
        if [ -n "$(git ls-files --others --exclude-standard)" ]; then
            return 0  # Has changes
        fi
        return 1  # No changes
    )
}

# Function to commit and push changes in a directory
commit_and_push() {
    local dir="$1"
    local context="$2"
    
    # Convert to absolute path if relative
    if [[ ! "$dir" =~ ^/ ]]; then
        dir="$REPO_ROOT/$dir"
    fi
    
    # Check if directory exists
    if [ ! -d "$dir" ]; then
        log_warning "Directory does not exist: $dir"
        return 0
    fi
    
    (
        cd "$dir"
        local repo_name
        repo_name=$(basename "$dir")
        
        log_info "Processing $context: $repo_name"
        
        if ! has_changes "$dir"; then
            log_info "  No changes to commit in $repo_name"
            return 0
        fi
        
        # Show what will be committed
        log_info "  Changes detected in $repo_name:"
        git status --short | sed 's/^/    /'
        
        # Ask for confirmation
        read -p "  Commit and push these changes? (y/N): " -n 1 -r
        echo
        
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_warning "  Skipping $repo_name"
            return 1
        fi
        
        # Add all changes
        git add .
        
        # Get commit message
        echo
        echo "  Enter commit message for $repo_name:"
        read -p "  Message: " commit_message
        
        if [ -z "$commit_message" ]; then
            commit_message="chore: Update $repo_name with latest changes"
        fi
        
        # Commit changes
        if git commit -m "$commit_message"; then
            log_success "  Committed changes in $repo_name"
        else
            log_error "  Failed to commit changes in $repo_name"
            return 1
        fi
        
        # Push changes
        log_info "  Pushing $repo_name to origin..."
        # Get current branch name
        local current_branch
        current_branch=$(git rev-parse --abbrev-ref HEAD)
        
        if git push origin "$current_branch"; then
            log_success "  Pushed $repo_name successfully (branch: $current_branch)"
        else
            log_error "  Failed to push $repo_name"
            return 1
        fi
    )
}

# Function to update submodule references in parent
update_submodule_references() {
    log_step "Updating submodule references in main repository"
    
    if [ ! -f .gitmodules ]; then
        log_info "No submodules to update references for"
        return 0
    fi
    
    local submodules_updated=false
    local submodules
    submodules=$(git config --file .gitmodules --get-regexp path | awk '{ print $2 }')
    
    for submodule in $submodules; do
        if [ -d "$submodule" ]; then
            # Check if submodule has new commits
            local submodule_status
            submodule_status=$(git submodule status "$submodule")
            
            if [[ $submodule_status == +* ]]; then
                log_info "Submodule $submodule has new commits"
                git add "$submodule"
                submodules_updated=true
            fi
        fi
    done
    
    if [ "$submodules_updated" = true ]; then
        log_info "Committing submodule reference updates..."
        
        echo "Enter commit message for submodule updates:"
        read -p "Message: " commit_message
        
        if [ -z "$commit_message" ]; then
            commit_message="chore: Update submodule references to latest commits"
        fi
        
        git commit -m "$commit_message"
        log_success "Submodule references updated"
    else
        log_info "No submodule reference updates needed"
    fi
}

# Function to push all repositories in proper order
push_all_repositories() {
    log_step "Pushing all repositories in proper hierarchical order (bottom-up)"
    
    # Get submodules in hierarchical order (deepest first)
    local submodules
    submodules=$(get_submodules_hierarchical)
    
    # Push submodules first (deepest to shallowest)
    for submodule in $submodules; do
        if [ -d "$submodule" ]; then
            commit_and_push "$submodule" "submodule"
        fi
    done
    
    # Update submodule references in main repository
    update_submodule_references
    
    # Push main repository last
    commit_and_push "." "main repository"
}

# Function to show repository structure
show_repository_structure() {
    log_step "Repository Structure"
    
    local main_commit
    main_commit=$(git log --oneline -1)
    log_info "Main repository: $main_commit"
    
    if [ -f .gitmodules ]; then
        log_info "Submodules:"
        git submodule status --recursive | while read -r line; do
            log_info "  $line"
        done
    else
        log_info "No submodules found"
    fi
}

# Main execution function
main() {
    log_info "=== Push All Submodules Script ==="
    log_info "Starting comprehensive repository and submodule push operation"
    log_info "Repository: $(basename "$REPO_ROOT")"
    log_info "Timestamp: $(date)"
    echo
    
    # Navigate to repository root
    cd "$REPO_ROOT"
    
    # Verify we're in a git repository
    check_git_repo
    
    # Show current repository structure
    show_repository_structure
    echo
    
    # Handle stashed modifications if requested
    local stash_handled=false
    if handle_stashed_modifications; then
        stash_handled=true
        echo
    fi
    
    # Push all repositories in proper order
    push_all_repositories
    echo
    
    # Show final status
    log_step "Final Status"
    show_repository_structure
    echo
    
    log_success "=== Push operation completed successfully! ==="
    log_info "All repositories have been processed in proper hierarchical order"
    
    if [ "$stash_handled" = true ]; then
        log_info "Stashed modifications were handled and committed"
    fi
}

# Help function
show_help() {
    cat << EOF
Push All Submodules Script

DESCRIPTION:
    Pushes all modified files in proper hierarchical order (bottom-up approach).
    Follows git best practices for submodule management with optional stash handling.

USAGE:
    $0 [OPTIONS]

OPTIONS:
    -h, --help          Show this help message
    -s, --handle-stash  Pop and commit stashed modifications
    --dry-run          Show what would be done without executing

FEATURES:
    • Bottom-up push strategy (deepest submodules first)
    • Interactive commit message prompts
    • Submodule reference updates in main repository  
    • Optional stash handling and commitment
    • Comprehensive status verification
    • Colored output for better visibility

PUSH ORDER:
    1. Deepest nested submodules first
    2. Direct submodules
    3. Update main repository submodule references  
    4. Main repository last

EXAMPLES:
    $0                      # Push all changes interactively
    $0 --handle-stash      # Include stashed modifications
    $0 --dry-run           # Preview operations
    $0 --help              # Show this help

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
        -s|--handle-stash)
            HANDLE_STASH=true
            shift
            ;;
        --dry-run)
            log_info "DRY RUN: Would execute the following operations:"
            log_info "1. Show current repository structure"
            log_info "2. Handle stashed modifications (if --handle-stash specified)"
            log_info "3. Push submodules in hierarchical order (deepest first)"
            log_info "4. Update submodule references in main repository"
            log_info "5. Push main repository"
            log_info "6. Show final status"
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