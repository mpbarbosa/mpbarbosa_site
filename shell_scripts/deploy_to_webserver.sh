#!/bin/bash

# =============================================================================
# MP Barbosa Site - Web Server Deployment Script
# =============================================================================
# Description: Deploys the mpbarbosa_site project to nginx web server directory
# Author: MP Barbosa
# Created: October 27, 2025
# Version: 3.0.0
# Updated: December 27, 2025 - Migration to mpbarbosa.com staging repository
#
# ARCHITECTURE NOTE (v3.0.0):
# This script now deploys from the ../mpbarbosa.com git repository instead of /public.
# The ../mpbarbosa.com directory is prepared by sync_to_staging.sh --step1.
#
# For modern deployments, use the two-step workflow:
#   1. ./shell_scripts/sync_to_staging.sh --step1  # Prepare staging repository
#   2. ./shell_scripts/deploy_to_webserver.sh      # Deploy to production
#
# Or use the integrated two-step deployment:
#   ./shell_scripts/sync_to_staging.sh --both-steps --production-dir /var/www/mpbarbosa.com
# =============================================================================

set -e  # Exit on any error
set -u  # Exit on undefined variables

# =============================================================================
# CONFIGURATION
# =============================================================================

# Source and destination paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_DIR="$(cd "$PROJECT_ROOT/../mpbarbosa.com" && pwd)"  # v3.0.0: Deploy from staging repository
DEST_DIR="/var/www/mpbarbosa.com"
BACKUP_DIR="/var/www/backups/mpbarbosa.com"

# Deployment settings
CREATE_BACKUP=true
SET_PERMISSIONS=true
VALIDATE_SUBMODULES=true
DRY_RUN=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${WHITE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_step() {
    echo -e "${CYAN}➤ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

# =============================================================================
# VALIDATION FUNCTIONS
# =============================================================================

validate_environment() {
    print_step "Validating deployment environment..."
    
    # Show detected source directory
    print_info "Detected source directory: $SOURCE_DIR"
    
    # Check if source directory exists
    if [[ ! -d "$SOURCE_DIR" ]]; then
        print_error "Source directory does not exist: $SOURCE_DIR"
        exit 1
    fi
    
    # Check if project root is a git repository
    if [[ ! -d "$PROJECT_ROOT/.git" ]]; then
        print_error "Project root is not a git repository: $PROJECT_ROOT"
        exit 1
    fi
    
    # Check if public directory exists (v2.0.0 architecture requirement)
    # The public directory must be prepared by sync_to_public.sh --step1 before deployment
    if [[ ! -d "$SOURCE_DIR" ]]; then
        print_error "Public directory does not exist: $SOURCE_DIR"
        print_info "Run sync_to_public.sh --step1 first to prepare deployment files"
        exit 1
    fi
    
    # Check if running as root or with sudo for web server permissions
    if [[ $EUID -ne 0 ]]; then
        print_warning "Not running as root. You may need sudo privileges for web server deployment."
        print_info "Consider running: sudo $0 $*"
    fi
    
    # Validate destination directory parent exists
    DEST_PARENT=$(dirname "$DEST_DIR")
    if [[ ! -d "$DEST_PARENT" ]]; then
        print_error "Destination parent directory does not exist: $DEST_PARENT"
        exit 1
    fi
    
    print_success "Environment validation complete"
}

validate_submodules() {
    if [[ "$VALIDATE_SUBMODULES" != "true" ]]; then
        return 0
    fi
    
    print_step "Validating git submodules..."
    
    cd "$PROJECT_ROOT"
    
    # Check if submodules are initialized
    if [[ -f ".gitmodules" ]]; then
        local submodule_status
        submodule_status=$(git submodule status --recursive)
        
        if echo "$submodule_status" | grep -q "^-"; then
            print_warning "Some submodules are not initialized:"
            echo "$submodule_status" | grep "^-" || true
            print_info "Consider running: git submodule update --init --recursive"
        fi
        
        if echo "$submodule_status" | grep -q "^+"; then
            print_warning "Some submodules have uncommitted changes:"
            echo "$submodule_status" | grep "^+" || true
        fi
        
        print_success "Submodule validation complete"
    else
        print_info "No submodules found in project"
    fi
}

# =============================================================================
# BACKUP FUNCTIONS
# =============================================================================

create_backup() {
    if [[ "$CREATE_BACKUP" != "true" ]]; then
        return 0
    fi
    
    if [[ ! -d "$DEST_DIR" ]]; then
        print_info "No existing deployment found, skipping backup"
        return 0
    fi
    
    print_step "Creating backup of existing deployment..."
    
    # Create backup directory if it doesn't exist
    mkdir -p "$BACKUP_DIR"
    
    # Generate timestamp for backup
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_path="$BACKUP_DIR/backup_$timestamp"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_info "[DRY RUN] Would create backup: $backup_path"
        return 0
    fi
    
    # Create backup
    cp -r "$DEST_DIR" "$backup_path"
    
    # Compress backup to save space
    tar -czf "$backup_path.tar.gz" -C "$(dirname "$backup_path")" "$(basename "$backup_path")"
    rm -rf "$backup_path"
    
    print_success "Backup created: $backup_path.tar.gz"
    
    # Clean old backups (keep last 5)
    print_step "Cleaning old backups (keeping last 5)..."
    cd "$BACKUP_DIR"
    ls -t backup_*.tar.gz 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true
    print_success "Old backup cleanup complete"
}

# =============================================================================
# CLEANUP FUNCTIONS
# =============================================================================

clean_destination() {
    print_step "Cleaning destination directory for fresh deployment..."
    
    if [[ ! -d "$DEST_DIR" ]]; then
        print_info "Destination directory doesn't exist, skipping cleanup"
        return 0
    fi
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_info "[DRY RUN] Would remove existing directory: $DEST_DIR"
        return 0
    fi
    
    # Remove the destination directory completely
    rm -rf "$DEST_DIR"
    
    print_success "Destination directory cleaned: $DEST_DIR"
}

# =============================================================================
# DIRECTORY PREPARATION FUNCTIONS
# =============================================================================

create_target_directory() {
    print_step "Creating target directory structure..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_info "[DRY RUN] Would create target directory: $DEST_DIR"
        print_info "[DRY RUN] Would create backup directory: $BACKUP_DIR"
        return 0
    fi
    
    # Create destination directory with proper permissions
    mkdir -p "$DEST_DIR"
    
    # Create backup directory if it doesn't exist
    mkdir -p "$BACKUP_DIR"
    
    # Set initial ownership if running as root
    if [[ $EUID -eq 0 ]]; then
        chown www-data:www-data "$DEST_DIR"
        chmod 755 "$DEST_DIR"
        print_success "Target directory created with web server ownership: $DEST_DIR"
    else
        print_success "Target directory created: $DEST_DIR"
        print_info "Run with sudo to set proper web server ownership"
    fi
    
    print_success "Backup directory ready: $BACKUP_DIR"
}

# =============================================================================
# DEPLOYMENT FUNCTIONS
# =============================================================================

deploy_files() {
    print_step "Deploying files to web server directory..."
    
    cd "$SOURCE_DIR"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_info "[DRY RUN] Would copy files from: $SOURCE_DIR"
        print_info "[DRY RUN] Would copy files to: $DEST_DIR"
        
        # Show what would be copied
        print_info "[DRY RUN] Files and directories that would be copied:"
        find . -type f | head -20
        if [[ $(find . -type f | wc -l) -gt 20 ]]; then
            print_info "[DRY RUN] ... and $(( $(find . -type f | wc -l) - 20 )) more files"
        fi
        return 0
    fi
    
    # Copy all files from public directory (already prepared by sync_to_public.sh)
    # No exclusions needed since public directory contains only deployment-ready files
    print_info "Copying deployment-ready files from public directory..."
    rsync -av \
        --delete \
        "$SOURCE_DIR/" "$DEST_DIR/"
    
    print_success "File deployment complete"
}

set_permissions() {
    if [[ "$SET_PERMISSIONS" != "true" ]]; then
        return 0
    fi
    
    print_step "Setting web server permissions..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_info "[DRY RUN] Would set ownership to www-data:www-data"
        print_info "[DRY RUN] Would set directory permissions to 755"
        print_info "[DRY RUN] Would set file permissions to 644"
        return 0
    fi
    
    # Set ownership to web server user
    chown -R www-data:www-data "$DEST_DIR"
    
    # Set appropriate permissions
    find "$DEST_DIR" -type d -exec chmod 755 {} \;
    find "$DEST_DIR" -type f -exec chmod 644 {} \;
    
    # Make specific files executable if needed
    if [[ -f "$DEST_DIR/submodules/guia_turistico/src/andarilho.js" ]]; then
        chmod 755 "$DEST_DIR/submodules/guia_turistico/src/andarilho.js"
    fi
    
    print_success "Permissions set successfully"
}

# =============================================================================
# VALIDATION FUNCTIONS
# =============================================================================

validate_deployment() {
    print_step "Validating deployment..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_info "[DRY RUN] Would validate deployment structure"
        return 0
    fi
    
    # Check if main files exist
    local required_files=(
        "$DEST_DIR/index.html"
        "$DEST_DIR/assets/css/main.css"
        "$DEST_DIR/assets/js/main.js"
    )
    
    for file in "${required_files[@]}"; do
        if [[ -f "$file" ]]; then
            print_success "Found: $(basename "$file")"
        else
            print_warning "Missing: $(basename "$file")"
        fi
    done
    
    # Check if submodules are present
    if [[ -d "$DEST_DIR/submodules/music_in_numbers" ]]; then
        print_success "Music in Numbers submodule deployed"
    fi
    
    if [[ -d "$DEST_DIR/submodules/guia_turistico" ]]; then
        print_success "Guia Turístico submodule deployed"
    fi
    
    if [[ -d "$DEST_DIR/monitora_vagas" ]]; then
        print_success "Monitora Vagas submodule deployed"
    fi
    
    # Show deployment summary
    local file_count=$(find "$DEST_DIR" -type f | wc -l)
    local dir_count=$(find "$DEST_DIR" -type d | wc -l)
    
    print_info "Deployment summary:"
    print_info "  • Files deployed: $file_count"
    print_info "  • Directories: $dir_count"
    print_info "  • Deployment path: $DEST_DIR"
    
    print_success "Deployment validation complete"
}

# =============================================================================
# NGINX INTEGRATION
# =============================================================================

check_nginx_config() {
    print_step "Checking nginx configuration..."
    
    if ! command -v nginx &> /dev/null; then
        print_warning "nginx command not found, skipping configuration check"
        return 0
    fi
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_info "[DRY RUN] Would test nginx configuration"
        return 0
    fi
    
    # Test nginx configuration
    if nginx -t 2>/dev/null; then
        print_success "nginx configuration is valid"
        
        # Suggest reload if everything is ok
        print_info "To apply changes, run: sudo systemctl reload nginx"
    else
        print_warning "nginx configuration test failed"
        print_info "Check nginx configuration before reloading"
    fi
}

# =============================================================================
# HELP AND USAGE
# =============================================================================

show_help() {
    cat << EOF
MP Barbosa Site - Web Server Deployment Script

DESCRIPTION:
    Deploys the mpbarbosa_site project to nginx web server directory.
    Copies all deployment-ready files from /public directory to /var/www/mpbarbosa.com.
    Use sync_to_public.sh first to prepare files in the public directory.

USAGE:
    $0 [OPTIONS]

OPTIONS:
    -h, --help          Show this help message
    -v, --verbose       Enable verbose output (default: enabled)
    --dry-run           Show what would be done without executing
    --no-backup         Skip creating backup of existing deployment
    --no-permissions    Skip setting web server permissions
    --no-submodule-check Skip git submodule validation

FEATURES:
    • Recursive file copying with rsync
    • Automatic backup of existing deployment
    • Git submodule handling and validation
    • Web server permission setting (www-data)
    • nginx configuration validation
    • Comprehensive deployment validation
    • Colored output for better visibility

EXAMPLES:
    $0                          # Deploy with all features
    sudo $0                     # Deploy with root privileges (recommended)
    $0 --dry-run               # Preview deployment without executing
    $0 --no-backup             # Deploy without creating backup

REQUIREMENTS:
    • Public directory: $SOURCE_DIR (prepared by sync_to_public.sh)
    • Destination directory: $DEST_DIR
    • Root/sudo access for web server permissions
    • rsync command available
    • nginx server (optional, for config validation)
    
WORKFLOW:
    1. Run: ./shell_scripts/sync_to_public.sh
    2. Run: sudo ./shell_scripts/deploy_to_webserver.sh

AUTHOR:
    MP Barbosa - 2025
EOF
}

# =============================================================================
# MAIN EXECUTION FLOW
# =============================================================================

main() {
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
                DRY_RUN=true
                shift
                ;;
            --no-backup)
                CREATE_BACKUP=false
                shift
                ;;
            --no-permissions)
                SET_PERMISSIONS=false
                shift
                ;;
            --no-submodule-check)
                VALIDATE_SUBMODULES=false
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                print_info "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    # Print header
    print_header "MP Barbosa Site - Web Server Deployment"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_warning "DRY RUN MODE - No changes will be made"
        echo
    fi
    
    # Execute deployment steps
    validate_environment
    validate_submodules
    create_backup
    clean_destination
    create_target_directory
    deploy_files
    set_permissions
    validate_deployment
    check_nginx_config
    
    # Success message
    echo
    print_header "Deployment Complete!"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_info "This was a dry run. No actual changes were made."
        print_info "Run without --dry-run to perform the actual deployment."
    else
        print_success "Website successfully deployed to: $DEST_DIR"
        print_info "Files are now accessible via nginx web server"
        
        if command -v systemctl &> /dev/null; then
            print_info "To reload nginx: sudo systemctl reload nginx"
        fi
    fi
    
    echo
    print_info "Deployment log available in terminal output above"
}

# =============================================================================
# SCRIPT EXECUTION
# =============================================================================

# Only run main if script is executed directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi