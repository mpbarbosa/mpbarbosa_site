#!/usr/bin/env bash
################################################################################
# Script: cleanup_old_folders.sh
# Description: Clean up backlog, logs, and summaries folders, keeping only
#              the last 15 subfolders (sorted by modification time).
# Version: 1.1.4
# Author: MP Barbosa
# Created: 2025-11-11
################################################################################

set -euo pipefail

# Color codes for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Script configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
KEEP_COUNT=15
readonly FOLDERS_TO_CLEAN=("backlog" "logs" "summaries")

# Flags
DRY_RUN=false
VERBOSE=false

################################################################################
# Functions
################################################################################

print_info() {
    echo -e "${BLUE}[INFO]${NC} $*"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $*"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $*"
}

show_usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Clean up backlog, logs, and summaries folders, keeping only the last 15 subfolders.

OPTIONS:
    -d, --dry-run       Show what would be deleted without actually deleting
    -v, --verbose       Show detailed output
    -k, --keep N        Keep N most recent subfolders (default: 15)
    -h, --help          Show this help message

EXAMPLES:
    # Dry run to preview what would be deleted
    $(basename "$0") --dry-run

    # Clean up folders, keeping last 20 subfolders
    $(basename "$0") --keep 20

    # Clean up with verbose output
    $(basename "$0") --verbose

EOF
}

cleanup_folder() {
    local folder_path="$1"
    local folder_name=$(basename "$folder_path")
    
    if [[ ! -d "$folder_path" ]]; then
        print_warning "Folder does not exist: $folder_path"
        return 0
    fi
    
    print_info "Processing folder: $folder_name"
    
    # Get list of subdirectories sorted by modification time (newest first)
    local subdirs=()
    while IFS= read -r -d '' dir; do
        subdirs+=("$dir")
    done < <(find "$folder_path" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\0' | sort -zrn | cut -zd' ' -f2-)
    
    local total_count=${#subdirs[@]}
    
    if [[ $total_count -eq 0 ]]; then
        print_info "  No subfolders found in $folder_name"
        return 0
    fi
    
    print_info "  Found $total_count subfolders in $folder_name"
    
    if [[ $total_count -le $KEEP_COUNT ]]; then
        print_success "  Keeping all $total_count subfolders (≤ $KEEP_COUNT)"
        return 0
    fi
    
    local delete_count=$((total_count - KEEP_COUNT))
    print_info "  Will keep $KEEP_COUNT most recent, delete $delete_count oldest"
    
    # Delete oldest subfolders (those beyond KEEP_COUNT)
    local deleted=0
    for ((i=KEEP_COUNT; i<total_count; i++)); do
        if [[ "$VERBOSE" == true ]]; then
            print_info "  Preparing to delete subfolder $((i - KEEP_COUNT + 1)) of $delete_count"
            print_info " index: $i; total_count: $total_count; keep_count: $KEEP_COUNT"
        fi
        local dir_to_delete="${subdirs[$i]}"
        local dir_basename=$(basename "$dir_to_delete")
        
        if [[ "$DRY_RUN" == true ]]; then
            print_warning "  [DRY RUN] Would delete: $dir_basename"
            if [[ "$VERBOSE" == true ]]; then
                echo "    Path: $dir_to_delete"
            fi
        else
            if [[ "$VERBOSE" == true ]]; then
                print_info "  Deleting: $dir_basename"
                echo "    Path: $dir_to_delete"
            fi
            rm -rf "$dir_to_delete"
            ((deleted++)) || true
            if [[ "$VERBOSE" == true ]]; then
                print_success "    Deleted: $dir_basename"
            fi
        fi
    done
    
    if [[ "$DRY_RUN" == false ]]; then
        print_success "  Deleted $deleted subfolders from $folder_name"
    fi
    if [[ "$VERBOSE" == true ]]; then
        print_info "  Finished processing $folder_name"
    fi
}

################################################################################
# Main Script
################################################################################

main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -d|--dry-run)
                DRY_RUN=true
                shift
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            -k|--keep)
                if [[ -n "${2:-}" ]] && [[ "$2" =~ ^[0-9]+$ ]]; then
                    KEEP_COUNT=$2
                    shift 2
                else
                    print_error "Invalid value for --keep: ${2:-}"
                    exit 1
                fi
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Print header
    echo "========================================================================"
    echo "Folder Cleanup Script"
    echo "========================================================================"
    echo "Project Root: $PROJECT_ROOT"
    echo "Keep Count:   $KEEP_COUNT subfolders"
    if [[ "$DRY_RUN" == true ]]; then
        echo -e "Mode:         ${YELLOW}DRY RUN${NC} (no changes will be made)"
    else
        echo -e "Mode:         ${RED}LIVE${NC} (folders will be deleted)"
    fi
    echo "========================================================================"
    echo
    
    # Process each folder
    local total_processed=0
    print_info "Folders to clean: ${FOLDERS_TO_CLEAN[*]}"
    echo
    for folder_name in "${FOLDERS_TO_CLEAN[@]}"; do
        # All folders (backlog, logs, summaries) are in shell_scripts/workflow/
        local folder_path="$SCRIPT_DIR/workflow/$folder_name"
        print_info "Starting processing of $folder_name"
        cleanup_folder "$folder_path"
        print_info "Completed processing of $folder_name"
        ((total_processed++)) || true
        print_info "Finished processing $folder_name"
        echo
    done
    
    # Print summary
    echo "========================================================================"
    print_success "Cleanup complete! Processed $total_processed folders."
    if [[ "$DRY_RUN" == true ]]; then
        print_info "This was a dry run. Use without --dry-run to actually delete folders."
    fi
    echo "========================================================================"
}

# Execute main function
main "$@"
