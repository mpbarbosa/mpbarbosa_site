#!/bin/bash

# =============================================================================
# MP Barbosa Site - Web Server Deployment Script
# =============================================================================
# Description: Deploys the mpbarbosa_site project to nginx web server directory
# Author: MP Barbosa
# Created: October 27, 2025
# Version: 1.0.0
#
# This script copies all website files recursively, including git submodules,
# to /var/www/mpbarbosa.com for nginx web server deployment.
# =============================================================================

set -e  # Exit on any error
set -u  # Exit on undefined variables

# =============================================================================
# CONFIGURATION
# =============================================================================

# Source and destination paths
SOURCE_DIR="/home/mpb/Documents/GitHub/mpbarbosa_site"
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
    
    # Check if source directory exists
    if [[ ! -d "$SOURCE_DIR" ]]; then
        print_error "Source directory does not exist: $SOURCE_DIR"
        exit 1
    fi
    
    # Check if source is a git repository
    if [[ ! -d "$SOURCE_DIR/.git" ]]; then
        print_error "Source directory is not a git repository: $SOURCE_DIR"
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
    
    cd "$SOURCE_DIR"
    
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
        find . -type f -not -path './.git/*' -not -path './shell_scripts/*' | head -20
        if [[ $(find . -type f -not -path './.git/*' -not -path './shell_scripts/*' | wc -l) -gt 20 ]]; then
            print_info "[DRY RUN] ... and $(( $(find . -type f -not -path './.git/*' -not -path './shell_scripts/*' | wc -l) - 20 )) more files"
        fi
        return 0
    fi
    
    # Create destination directory if it doesn't exist
    mkdir -p "$DEST_DIR"
    
    # Copy files, excluding git directories and shell scripts
    print_info "Copying source files..."
    rsync -av \
        --exclude='.git/' \
        --exclude='shell_scripts/' \
        --exclude='*.log' \
        --exclude='node_modules/' \
        --exclude='.vscode/' \
        --exclude='coverage/' \
        --exclude='__tests__/' \
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
    if [[ -f "$DEST_DIR/src/submodules/guia_turistico/src/andarilho.js" ]]; then
        chmod 755 "$DEST_DIR/src/submodules/guia_turistico/src/andarilho.js"
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
        "$DEST_DIR/src/index.html"
        "$DEST_DIR/src/styles/main.css"
        "$DEST_DIR/src/scripts/main.js"
    )
    
    for file in "${required_files[@]}"; do
        if [[ -f "$file" ]]; then
            print_success "Found: $(basename "$file")"
        else
            print_warning "Missing: $(basename "$file")"
        fi
    done
    
    # Check if submodules are present
    if [[ -d "$DEST_DIR/src/submodules/music_in_numbers" ]]; then
        print_success "Music in Numbers submodule deployed"
    fi
    
    if [[ -d "$DEST_DIR/src/submodules/guia_turistico" ]]; then
        print_success "Guia Turístico submodule deployed"
    fi
    
    if [[ -d "$DEST_DIR/src/submodules/monitora_vagas" ]]; then
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
    Copies all files recursively including git submodules to /var/www/mpbarbosa.com.

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
    • Source directory: $SOURCE_DIR
    • Destination directory: $DEST_DIR
    • Root/sudo access for web server permissions
    • rsync command available
    • nginx server (optional, for config validation)

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