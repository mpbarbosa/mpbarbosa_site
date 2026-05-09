#!/usr/bin/env bash
# manage_reports.sh - Automated report file management with timestamp-based naming
# Version: 1.1.8
# Author: MP Barbosa
# Description: Manages consistency validation reports with automatic archiving and cleanup

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPORTS_DIR="${PROJECT_ROOT}"
ARCHIVE_DIR="${PROJECT_ROOT}/shell_scripts/workflow/logs/archived_reports"
ARCHIVE_DAYS=30

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Report patterns
declare -A REPORT_TYPES=(
    ["DIRECTORY_STRUCTURE"]="DIRECTORY_STRUCTURE_VALIDATION_REPORT"
    ["SHELL_SCRIPT"]="SHELL_SCRIPT_DOCUMENTATION_VALIDATION_REPORT"
    ["TEST_FAILURE"]="TEST_FAILURE_ANALYSIS"
)

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

# Create archive directory if it doesn't exist
ensure_archive_dir() {
    if [[ ! -d "${ARCHIVE_DIR}" ]]; then
        mkdir -p "${ARCHIVE_DIR}"
        log_info "Created archive directory: ${ARCHIVE_DIR}"
    fi
}

# Generate timestamp-based filename
generate_timestamped_name() {
    local report_type="$1"
    local timestamp
    timestamp=$(date +"%Y%m%d_%H%M%S")
    echo "${report_type}_${timestamp}.md"
}

# Create symlink to latest report
create_latest_symlink() {
    local report_type="$1"
    local latest_file="$2"
    local symlink_name="${report_type}_LATEST.md"
    local symlink_path="${REPORTS_DIR}/${symlink_name}"
    
    # Remove existing symlink if it exists
    if [[ -L "${symlink_path}" ]]; then
        rm "${symlink_path}"
    fi
    
    # Create new symlink (relative path)
    ln -s "$(basename "${latest_file}")" "${symlink_path}"
    log_success "Created symlink: ${symlink_name} → $(basename "${latest_file}")"
}

# Rename report with timestamp
rename_report_with_timestamp() {
    local report_type="$1"
    local original_name="${REPORT_TYPES[$report_type]}.md"
    local original_path="${REPORTS_DIR}/${original_name}"
    
    if [[ ! -f "${original_path}" ]]; then
        log_warning "Report not found: ${original_name}"
        return 1
    fi
    
    local new_name
    new_name=$(generate_timestamped_name "${REPORT_TYPES[$report_type]}")
    local new_path="${REPORTS_DIR}/${new_name}"
    
    mv "${original_path}" "${new_path}"
    log_success "Renamed: ${original_name} → ${new_name}"
    
    # Create latest symlink
    create_latest_symlink "${REPORT_TYPES[$report_type]}" "${new_path}"
    
    echo "${new_path}"
}

# Archive old reports (older than ARCHIVE_DAYS)
archive_old_reports() {
    local report_type="$1"
    local pattern="${REPORT_TYPES[$report_type]}_*.md"
    local archived_count=0
    
    ensure_archive_dir
    
    log_info "Archiving ${report_type} reports older than ${ARCHIVE_DAYS} days..."
    
    # Find and archive old reports
    while IFS= read -r file; do
        if [[ -f "${file}" ]]; then
            local file_age_days
            if [[ -x "$(command -v stat)" ]]; then
                # Linux
                file_age_days=$(( ($(date +%s) - $(stat -c %Y "${file}" 2>/dev/null || stat -f %m "${file}")) / 86400 ))
            else
                file_age_days=0
            fi
            
            if (( file_age_days > ARCHIVE_DAYS )); then
                local basename
                basename=$(basename "${file}")
                mv "${file}" "${ARCHIVE_DIR}/${basename}"
                log_success "Archived: ${basename} (${file_age_days} days old)"
                ((archived_count++))
            fi
        fi
    done < <(find "${REPORTS_DIR}" -maxdepth 1 -name "${pattern}" -type f)
    
    if (( archived_count == 0 )); then
        log_info "No ${report_type} reports to archive"
    else
        log_success "Archived ${archived_count} ${report_type} report(s)"
    fi
}

# Cleanup old archived reports
cleanup_archives() {
    local cleanup_days=$((ARCHIVE_DAYS * 2))  # Keep archives for double the archive period
    local deleted_count=0
    
    if [[ ! -d "${ARCHIVE_DIR}" ]]; then
        log_info "No archive directory to clean"
        return 0
    fi
    
    log_info "Cleaning archived reports older than ${cleanup_days} days..."
    
    while IFS= read -r file; do
        if [[ -f "${file}" ]]; then
            rm "${file}"
            log_success "Deleted: $(basename "${file}")"
            ((deleted_count++))
        fi
    done < <(find "${ARCHIVE_DIR}" -type f -name "*.md" -mtime +${cleanup_days})
    
    if (( deleted_count == 0 )); then
        log_info "No archived reports to delete"
    else
        log_success "Deleted ${deleted_count} old archived report(s)"
    fi
}

# List current reports
list_reports() {
    echo ""
    log_info "=== Current Reports ==="
    
    for report_type in "${!REPORT_TYPES[@]}"; do
        local pattern="${REPORT_TYPES[$report_type]}"
        echo ""
        echo -e "${YELLOW}${report_type}:${NC}"
        
        # Show latest symlink
        local symlink="${REPORTS_DIR}/${pattern}_LATEST.md"
        if [[ -L "${symlink}" ]]; then
            local target
            target=$(readlink "${symlink}")
            echo -e "  ${GREEN}→ LATEST:${NC} ${target}"
        fi
        
        # Show timestamped reports
        local count=0
        while IFS= read -r file; do
            local basename
            basename=$(basename "${file}")
            local size
            size=$(du -h "${file}" | cut -f1)
            local date
            date=$(stat -c %y "${file}" 2>/dev/null | cut -d' ' -f1 || stat -f %Sm -t %Y-%m-%d "${file}")
            echo "  - ${basename} (${size}, ${date})"
            ((count++))
        done < <(find "${REPORTS_DIR}" -maxdepth 1 -name "${pattern}_*.md" -type f | sort -r)
        
        if (( count == 0 )); then
            echo "  (no timestamped reports)"
        fi
    done
    
    echo ""
    log_info "=== Archived Reports ==="
    if [[ -d "${ARCHIVE_DIR}" ]]; then
        local archive_count
        archive_count=$(find "${ARCHIVE_DIR}" -type f -name "*.md" 2>/dev/null | wc -l)
        echo "  Total archived: ${archive_count} reports"
        echo "  Location: ${ARCHIVE_DIR}"
    else
        echo "  (no archive directory)"
    fi
    echo ""
}

# Main workflow
main() {
    local action="${1:-help}"
    
    case "${action}" in
        rename)
            local report_type="${2:-}"
            if [[ -z "${report_type}" ]] || [[ ! -v REPORT_TYPES[$report_type] ]]; then
                log_error "Invalid report type. Available: ${!REPORT_TYPES[*]}"
                exit 1
            fi
            rename_report_with_timestamp "${report_type}"
            ;;
            
        archive)
            local report_type="${2:-ALL}"
            if [[ "${report_type}" == "ALL" ]]; then
                for type in "${!REPORT_TYPES[@]}"; do
                    archive_old_reports "${type}"
                done
            elif [[ -v REPORT_TYPES[$report_type] ]]; then
                archive_old_reports "${report_type}"
            else
                log_error "Invalid report type. Available: ${!REPORT_TYPES[*]}"
                exit 1
            fi
            ;;
            
        cleanup)
            cleanup_archives
            ;;
            
        full-maintenance)
            log_info "Running full maintenance routine..."
            echo ""
            
            # Archive old reports
            for report_type in "${!REPORT_TYPES[@]}"; do
                archive_old_reports "${report_type}"
            done
            
            echo ""
            # Cleanup old archives
            cleanup_archives
            
            echo ""
            log_success "Full maintenance completed"
            ;;
            
        list)
            list_reports
            ;;
            
        help|*)
            cat << EOF
Usage: $0 <action> [options]

Actions:
  rename <TYPE>         Rename report with timestamp and create latest symlink
                        Types: ${!REPORT_TYPES[*]}
  
  archive [TYPE|ALL]    Archive reports older than ${ARCHIVE_DAYS} days
                        Default: ALL
  
  cleanup               Delete archived reports older than $((ARCHIVE_DAYS * 2)) days
  
  full-maintenance      Run archive and cleanup for all reports
  
  list                  List all current and archived reports
  
  help                  Show this help message

Examples:
  $0 rename DIRECTORY_STRUCTURE
  $0 archive SHELL_SCRIPT
  $0 archive ALL
  $0 cleanup
  $0 full-maintenance
  $0 list

Configuration:
  Reports directory: ${REPORTS_DIR}
  Archive directory: ${ARCHIVE_DIR}
  Archive threshold: ${ARCHIVE_DAYS} days
  Cleanup threshold: $((ARCHIVE_DAYS * 2)) days
EOF
            ;;
    esac
}

# Execute main function
main "$@"
