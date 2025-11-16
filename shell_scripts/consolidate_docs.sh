#!/usr/bin/env bash
# consolidate_docs.sh - Documentation consolidation and cleanup automation
# Version: 1.0.0
# Author: MP Barbosa
# Description: Implements documentation retention policy and consolidation strategy

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
DOCS_DIR="${PROJECT_ROOT}/docs"
REPORTS_DIR="${DOCS_DIR}/reports"
HISTORICAL_DIR="${REPORTS_DIR}/historical"
LOGS_DIR="${PROJECT_ROOT}/shell_scripts/workflow/logs"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Flags
DRY_RUN=false
VERBOSE=false
WEEKLY_REVIEW=false

# Statistics
REPORTS_ANALYZED=0
REPORTS_ARCHIVED=0
REPORTS_CONSOLIDATED=0
DUPLICATES_REMOVED=0
SYMLINKS_CREATED=0

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $*"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $*"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $*"
}

log_verbose() {
    if [[ "$VERBOSE" == true ]]; then
        echo -e "${CYAN}[VERBOSE]${NC} $*"
    fi
}

# Ensure directories exist
ensure_directories() {
    local dirs=(
        "$DOCS_DIR"
        "$REPORTS_DIR"
        "$HISTORICAL_DIR"
        "${LOGS_DIR}/archived_reports"
    )
    
    for dir in "${dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            if [[ "$DRY_RUN" == false ]]; then
                mkdir -p "$dir"
                log_info "Created directory: $dir"
            else
                log_info "[DRY RUN] Would create: $dir"
            fi
        fi
    done
}

# Analyze current state
analyze_current_state() {
    log_info "=== Analyzing Current Documentation State ==="
    
    # Count reports in project root
    local root_reports
    root_reports=$(find "$PROJECT_ROOT" -maxdepth 1 -type f \
        \( -name "*VALIDATION*" -o -name "*ANALYSIS*" -o -name "*REPORT*" \) \
        2>/dev/null | wc -l)
    
    echo "Reports in project root: $root_reports"
    
    # Count archived reports
    local archived_reports=0
    if [[ -d "${LOGS_DIR}/archived_reports" ]]; then
        archived_reports=$(find "${LOGS_DIR}/archived_reports" -type f -name "*.md" 2>/dev/null | wc -l)
    fi
    echo "Archived reports: $archived_reports"
    
    # Count symlinks
    local symlinks
    symlinks=$(find "$PROJECT_ROOT" -maxdepth 1 -type l -name "*LATEST*" 2>/dev/null | wc -l)
    echo "Latest symlinks: $symlinks"
    
    # Age of oldest report
    local oldest_report
    oldest_report=$(find "$PROJECT_ROOT" -maxdepth 1 -type f \
        \( -name "*VALIDATION*" -o -name "*ANALYSIS*" \) \
        -printf '%T+ %p\n' 2>/dev/null | sort | head -1 | awk '{print $1, $2}')
    
    if [[ -n "$oldest_report" ]]; then
        echo "Oldest report: $oldest_report"
    fi
    
    # Check for duplicates
    find_duplicates
    
    echo ""
    REPORTS_ANALYZED=$root_reports
}

# Find duplicate reports
find_duplicates() {
    local duplicates=0
    
    # Look for OLD, OLD2, etc. patterns
    while IFS= read -r file; do
        if [[ "$file" =~ _OLD[0-9]*.md$ ]]; then
            ((duplicates++))
            log_verbose "Found duplicate: $(basename "$file")"
        fi
    done < <(find "$PROJECT_ROOT" -maxdepth 1 -type f -name "*_OLD*.md" 2>/dev/null || true)
    
    if [[ $duplicates -gt 0 ]]; then
        log_warning "Found $duplicates duplicate/old reports"
    fi
    
    return 0
}

# Archive old reports using manage_reports.sh
archive_old_reports() {
    log_info "=== Archiving Old Reports ==="
    
    if [[ -f "${SCRIPT_DIR}/manage_reports.sh" ]]; then
        if [[ "$DRY_RUN" == true ]]; then
            log_info "[DRY RUN] Would run: manage_reports.sh archive ALL"
        else
            bash "${SCRIPT_DIR}/manage_reports.sh" archive ALL
            ((REPORTS_ARCHIVED++))
        fi
    else
        log_warning "manage_reports.sh not found - skipping automated archival"
    fi
}

# Consolidate duplicate reports
consolidate_duplicates() {
    log_info "=== Consolidating Duplicate Reports ==="
    
    # Find and handle _OLD files
    while IFS= read -r old_file; do
        if [[ -f "$old_file" ]]; then
            local basename
            basename=$(basename "$old_file")
            
            if [[ "$DRY_RUN" == true ]]; then
                log_info "[DRY RUN] Would archive: $basename"
            else
                # Move to archived_reports with timestamp
                local timestamp
                timestamp=$(date -r "$old_file" +%Y%m%d_%H%M%S 2>/dev/null || date +%Y%m%d_%H%M%S)
                local new_name="${basename%.md}_${timestamp}.md"
                
                mv "$old_file" "${LOGS_DIR}/archived_reports/$new_name"
                log_success "Archived: $basename → $new_name"
                ((DUPLICATES_REMOVED++))
            fi
        fi
    done < <(find "$PROJECT_ROOT" -maxdepth 1 -type f -name "*_OLD*.md" 2>/dev/null)
    
    if [[ $DUPLICATES_REMOVED -eq 0 ]]; then
        log_info "No duplicates found to consolidate"
    fi
}

# Create consolidated living documents
create_living_documents() {
    log_info "=== Creating Consolidated Living Documents ==="
    
    # Validation Trends Document
    local validation_trends="${REPORTS_DIR}/VALIDATION_TRENDS.md"
    
    if [[ "$DRY_RUN" == true ]]; then
        log_info "[DRY RUN] Would create: VALIDATION_TRENDS.md"
    else
        if [[ ! -f "$validation_trends" ]]; then
            cat > "$validation_trends" << 'EOF'
# Validation Trends and Analysis

**Last Updated:** $(date +%Y-%m-%d)  
**Status:** Living Document

## Overview

This document tracks validation trends across directory structure and shell script documentation checks.

## Latest Results

### Directory Structure Validation
- **Last Run:** See [DIRECTORY_STRUCTURE_VALIDATION_REPORT_LATEST.md](../../DIRECTORY_STRUCTURE_VALIDATION_REPORT_LATEST.md)
- **Status:** TBD
- **Issues:** 0
- **Warnings:** 0

### Shell Script Documentation Validation
- **Last Run:** See [SHELL_SCRIPT_DOCUMENTATION_VALIDATION_REPORT_LATEST.md](../../SHELL_SCRIPT_DOCUMENTATION_VALIDATION_REPORT_LATEST.md)
- **Status:** TBD
- **Issues:** 0
- **Warnings:** 0

## Historical Trends

### Month-over-Month Summary

| Month | Directory Issues | Script Doc Issues | Total Warnings | Status |
|-------|------------------|-------------------|----------------|--------|
| 2025-11 | TBD | TBD | TBD | 🟡 In Progress |

## Common Issues

### Directory Structure
- TBD

### Shell Script Documentation
- TBD

## Recommendations

1. Run validation checks weekly
2. Address warnings within 7 days
3. Update this document after each validation run

---

**Note:** This is a living document. Update after each validation cycle.
EOF
            log_success "Created: VALIDATION_TRENDS.md"
            ((REPORTS_CONSOLIDATED++))
        else
            log_info "VALIDATION_TRENDS.md already exists"
        fi
    fi
}

# Weekly review checklist
weekly_review() {
    log_info "=== Weekly Documentation Review ==="
    
    echo ""
    echo "Checklist:"
    echo ""
    
    # Check 1: Report count
    local root_count
    root_count=$(find "$PROJECT_ROOT" -maxdepth 1 -type f \
        \( -name "*VALIDATION*" -o -name "*ANALYSIS*" \) \
        ! -type l 2>/dev/null | wc -l)
    
    if [[ $root_count -le 5 ]]; then
        echo -e "${GREEN}✅${NC} Report count in root: $root_count (target: ≤5)"
    else
        echo -e "${RED}❌${NC} Report count in root: $root_count (target: ≤5)"
    fi
    
    # Check 2: Oldest report age
    local oldest_age
    oldest_age=$(find "$PROJECT_ROOT" -maxdepth 1 -type f \
        \( -name "*VALIDATION*" -o -name "*ANALYSIS*" \) \
        -mtime +30 2>/dev/null | wc -l)
    
    if [[ $oldest_age -eq 0 ]]; then
        echo -e "${GREEN}✅${NC} No reports older than 30 days"
    else
        echo -e "${YELLOW}⚠️${NC}  Found $oldest_age reports older than 30 days"
    fi
    
    # Check 3: Broken symlinks
    local broken_links=0
    while IFS= read -r link; do
        if [[ ! -e "$link" ]]; then
            ((broken_links++))
            log_verbose "Broken symlink: $link"
        fi
    done < <(find "$PROJECT_ROOT" -maxdepth 1 -type l 2>/dev/null)
    
    if [[ $broken_links -eq 0 ]]; then
        echo -e "${GREEN}✅${NC} No broken symlinks"
    else
        echo -e "${RED}❌${NC} Found $broken_links broken symlinks"
    fi
    
    # Check 4: Archive size
    if [[ -d "${LOGS_DIR}/archived_reports" ]]; then
        local archive_size
        archive_size=$(du -sh "${LOGS_DIR}/archived_reports" 2>/dev/null | cut -f1)
        echo -e "${BLUE}ℹ️${NC}  Archive directory size: $archive_size"
    fi
    
    echo ""
}

# Generate consolidation report
generate_report() {
    log_info "=== Consolidation Summary ==="
    echo ""
    echo "Reports analyzed: $REPORTS_ANALYZED"
    echo "Reports archived: $REPORTS_ARCHIVED"
    echo "Duplicates removed: $DUPLICATES_REMOVED"
    echo "Living documents created: $REPORTS_CONSOLIDATED"
    echo "Symlinks created: $SYMLINKS_CREATED"
    echo ""
}

# Main workflow
main() {
    # Parse flags first
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --dry-run)
                DRY_RUN=true
                log_info "DRY RUN MODE - No changes will be made"
                echo ""
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            *)
                break
                ;;
        esac
    done
    
    local action="${1:-help}"
    
    case "$action" in
        analyze)
            ensure_directories
            analyze_current_state
            ;;
            
        archive)
            ensure_directories
            analyze_current_state
            archive_old_reports
            generate_report
            ;;
            
        consolidate)
            ensure_directories
            analyze_current_state
            consolidate_duplicates
            create_living_documents
            generate_report
            ;;
            
        weekly-review)
            ensure_directories
            analyze_current_state
            weekly_review
            ;;
            
        execute)
            log_info "Running full consolidation workflow..."
            echo ""
            ensure_directories
            analyze_current_state
            archive_old_reports
            consolidate_duplicates
            create_living_documents
            generate_report
            log_success "Consolidation complete!"
            ;;
            
        help|--help)
            cat << EOF
Usage: $0 <action> [options]

Actions:
  analyze             Analyze current documentation state
  archive             Archive old reports using retention policy
  consolidate         Consolidate duplicates and create living documents
  weekly-review       Run weekly review checklist
  execute             Run full consolidation workflow
  
Options:
  --dry-run           Preview changes without executing
  --verbose           Enable verbose output
  --help              Show this help message

Examples:
  $0 analyze
  $0 --dry-run
  $0 execute
  $0 weekly-review
  $0 --verbose consolidate

Documentation:
  See /docs/DOCUMENTATION_RETENTION_POLICY.md for full policy details

Integration:
  This script works with manage_reports.sh for report lifecycle management
  
Automation:
  # Daily maintenance (2 AM)
  0 2 * * * cd /path/to/project && $0 execute
  
  # Weekly review (Sunday 3 AM)
  0 3 * * 0 cd /path/to/project && $0 weekly-review
EOF
            ;;
            
        *)
            log_error "Unknown action: $action"
            echo "Run '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Execute main function
main "$@"
