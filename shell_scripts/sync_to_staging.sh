#!/bin/bash

# =============================================================================
# MP Barbosa Site - Two-Step Deployment Script (Staging Repository)
# =============================================================================
# Description: Two-step deployment process for web serving with git staging
# Author: MP Barbosa
# Created: November 4, 2025
# Version: 3.0.0
# Updated: December 27, 2025 - Migration to mpbarbosa.com staging repository
#
# Step 1: Copy resources from /src to /mpbarbosa.com repository (staging with git)
# Step 2: Copy resources from /mpbarbosa.com to production web server directory
#
# This script enables flexible deployment workflows with git-versioned staging
# and production phases, supporting both individual step execution and full
# deployment pipeline with version control history.
#
# ARCHITECTURE CHANGE (v3.0.0):
# - OLD: src → public/ → production
# - NEW: src → ../mpbarbosa.com/ (git repo) → production
# - Benefit: Version control for staging, rollback capability, deployment history
# =============================================================================

set -e  # Exit on any error
set -u  # Exit on undefined variables

# =============================================================================
# VERSION TRACKING
# =============================================================================
SCRIPT_VERSION="3.0.0"

# =============================================================================
# CONFIGURATION
# =============================================================================

# Directory paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_DIR="$PROJECT_ROOT/src"
STAGING_DIR="$(cd "$PROJECT_ROOT/../mpbarbosa.com" && pwd)"  # v3.0.0: Git staging repository
PRODUCTION_DIR="/var/www/html"  # v3.0.0: Default production directory (override with --production-dir)

# Execution steps control (v3.0.0: Two-step deployment with git staging)
STEP_SOURCE_TO_STAGING=false     # Step 1: src → mpbarbosa.com (git staging)
STEP_STAGING_TO_PRODUCTION=false # Step 2: mpbarbosa.com → production (deployment)

# Script settings
DRY_RUN=false
VERBOSE=false
CREATE_BACKUP=true

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

print_info() {
    echo -e "${CYAN}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_step() {
    echo -e "${PURPLE}▶ ${1}${NC}"
}

# =============================================================================
# GENERIC COPY FUNCTIONS (REUSABLE)
# =============================================================================

# Generic function to copy a single file
# Usage: copy_single_file "source_file" "dest_file" "description" [required]
copy_single_file() {
    local source_file="$1"
    local dest_file="$2"
    local description="$3"
    local required="${4:-false}"
    
    if [[ ! -f "$source_file" ]]; then
        if [[ "$required" == "true" ]]; then
            print_error "$description not found: $source_file"
            return 1
        else
            print_warning "$description not found in source directory"
            print_info "  Expected: $source_file"
            return 0
        fi
    fi
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Create destination directory if needed
        mkdir -p "$(dirname "$dest_file")"
        
        cp "$source_file" "$dest_file"
        print_success "Copied: $description"
        
        if [[ "$VERBOSE" == "true" ]]; then
            print_info "  Source: $source_file"
            print_info "  Destination: $dest_file"
            print_info "  Size: $(du -h "$dest_file" | cut -f1)"
        fi
    else
        print_info "[DRY RUN] Would copy: $source_file → $dest_file"
    fi
    
    return 0
}

# Generic function to copy a directory with file filtering
# Usage: copy_directory "source_dir" "dest_dir" "description" "file_pattern" [required]
copy_directory() {
    local source_dir="$1"
    local dest_dir="$2"
    local description="$3"
    local file_pattern="$4"
    local required="${5:-false}"
    
    if [[ ! -d "$source_dir" ]]; then
        if [[ "$required" == "true" ]]; then
            print_error "$description directory not found: $source_dir"
            return 1
        else
            print_warning "$description directory not found in source"
            print_info "  Expected: $source_dir"
            return 0
        fi
    fi
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Create destination directory if it doesn't exist
        mkdir -p "$dest_dir"
        
        # Copy all files
        cp -r "$source_dir"/* "$dest_dir/"
        print_success "Copied: $description"
        
        if [[ "$VERBOSE" == "true" ]]; then
            print_info "  Source: $source_dir"
            print_info "  Destination: $dest_dir"
            
            # Count and list files based on pattern
            local file_count=$(find "$dest_dir" -name "$file_pattern" | wc -l)
            print_info "  Files copied: $file_count"
            
            if [[ $file_count -gt 0 && $file_count -le 10 ]]; then
                find "$dest_dir" -name "$file_pattern" -exec basename {} \; | while read -r file; do
                    local file_size=$(du -h "$dest_dir/$file" | cut -f1)
                    print_info "    - $file ($file_size)"
                done
            elif [[ $file_count -gt 10 ]]; then
                print_info "    (showing first 10 files)"
                find "$dest_dir" -name "$file_pattern" -exec basename {} \; | head -10 | while read -r file; do
                    local file_size=$(du -h "$dest_dir/$file" | cut -f1)
                    print_info "    - $file ($file_size)"
                done
            fi
        fi
    else
        print_info "[DRY RUN] Would copy: $source_dir → $dest_dir"
        
        if [[ "$VERBOSE" == "true" ]] && [[ -d "$source_dir" ]]; then
            local file_count=$(find "$source_dir" -name "$file_pattern" | wc -l)
            print_info "  Files to copy: $file_count"
            
            if [[ $file_count -gt 0 && $file_count -le 5 ]]; then
                find "$source_dir" -name "$file_pattern" -exec basename {} \; | while read -r file; do
                    local file_size=$(du -h "$source_dir/$file" | cut -f1)
                    print_info "    - $file ($file_size)"
                done
            fi
        fi
    fi
    
    return 0
}

# Generic function to copy multiple specific files from a directory
# Usage: copy_specific_files "source_dir" "dest_dir" "description" "file1 file2 file3"
copy_specific_files() {
    local source_dir="$1"
    local dest_dir="$2"
    local description="$3"
    local files="$4"
    
    if [[ ! -d "$source_dir" ]]; then
        print_warning "$description directory not found in source"
        print_info "  Expected: $source_dir"
        return 0
    fi
    
    local files_copied=0
    local files_array=($files)
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Create destination directory if it doesn't exist
        mkdir -p "$dest_dir"
        
        for file in "${files_array[@]}"; do
            if [[ -f "$source_dir/$file" ]]; then
                cp "$source_dir/$file" "$dest_dir/$file"
                print_success "Copied: $file"
                files_copied=$((files_copied + 1))
                
                if [[ "$VERBOSE" == "true" ]]; then
                    local file_size=$(du -h "$dest_dir/$file" | cut -f1)
                    print_info "  - $file ($file_size)"
                fi
            else
                print_warning "$file not found in $description"
            fi
        done
        
        if [[ $files_copied -gt 0 ]]; then
            print_success "$description: $files_copied files copied"
        fi
    else
        print_info "[DRY RUN] Would copy from: $source_dir → $dest_dir"
        
        if [[ "$VERBOSE" == "true" ]]; then
            local total_files=${#files_array[@]}
            local existing_files=0
            
            for file in "${files_array[@]}"; do
                if [[ -f "$source_dir/$file" ]]; then
                    existing_files=$((existing_files + 1))
                    local file_size=$(du -h "$source_dir/$file" | cut -f1)
                    print_info "    - $file ($file_size)"
                fi
            done
            
            print_info "  Files to copy: $existing_files of $total_files"
        fi
    fi
    
    return 0
}

# Generic function to validate copied files/directories
# Usage: validate_path "path" "description" "pattern" [required]
validate_path() {
    local path="$1"
    local description="$2"
    local pattern="$3"
    local required="${4:-false}"
    
    if [[ -f "$path" ]]; then
        print_success "$description present in public folder"
        
        if [[ "$VERBOSE" == "true" ]]; then
            local file_size=$(du -h "$path" | cut -f1)
            local file_modified=$(stat -c %y "$path" 2>/dev/null || stat -f %Sm "$path" 2>/dev/null)
            print_info "  Size: $file_size"
            print_info "  Modified: $file_modified"
        fi
        return 0
    elif [[ -d "$path" ]]; then
        local file_count=0
        if [[ "$pattern" == "image_files" ]]; then
            file_count=$(find "$path" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.bmp" -o -name "*.ico" \) | wc -l)
        elif [[ "$pattern" == "font_files" ]]; then
            file_count=$(find "$path" -type f \( -name "*.eot" -o -name "*.svg" -o -name "*.ttf" -o -name "*.woff" -o -name "*.woff2" -o -name "*.otf" \) | wc -l)
        elif [[ "$pattern" == "js_files" ]]; then
            file_count=$(find "$path" -type f \( -name "*.js" -o -name "*.mjs" \) | wc -l)
        elif [[ -n "$pattern" ]]; then
            file_count=$(find "$path" -name "$pattern" | wc -l)
        else
            file_count=$(find "$path" -type f | wc -l)
        fi
        
        if [[ $file_count -gt 0 ]]; then
            print_success "$description present in public folder ($file_count files)"
            
            if [[ "$VERBOSE" == "true" ]]; then
                local total_size=$(du -sh "$path" | cut -f1)
                print_info "  Directory: $path"
                print_info "  Total size: $total_size"
                print_info "  Files: $file_count"
            fi
        else
            print_warning "$description directory exists but contains no files"
        fi
        return 0
    else
        if [[ "$required" == "true" ]]; then
            print_error "$description not found in public folder"
            return 1
        else
            print_info "$description not found in public folder (optional)"
            return 0
        fi
    fi
}

# Show help information
show_help() {
    cat << EOF
MP Barbosa Site - Two-Step Deployment Script v${SCRIPT_VERSION}

USAGE:
    $0 [STEP_OPTIONS] [OPTIONS]

DESCRIPTION:
    Two-step deployment process for MP Barbosa site:
    Step 1: Copy resources from /src to /public folder for staging
    Step 2: Copy resources from /public to production web server directory

STEP OPTIONS (at least one required):
    --step1             Execute Step 1: Source → Public folder
    --step2             Execute Step 2: Public → Production folder
    --both-steps        Execute both steps sequentially
    --production-dir    Set custom production directory (default: /var/www/html)

GENERAL OPTIONS:
    --source <dir>      Source folder to deploy: dist or src (default: src)
    --dry-run           Preview operations without making changes
    --verbose           Show detailed output
    --no-backup         Skip creating backup of existing files
    --version           Show script version
    --help              Show this help message

EXAMPLES:
    $0 --step1                              # Copy source to public only
    $0 --step2                              # Copy public to production only
    $0 --both-steps                         # Execute both steps
    $0 --step1 --source dist               # Deploy from dist/ instead of src/
    $0 --step1 --dry-run --verbose          # Preview step 1 with details
    $0 --step2 --production-dir /var/www/mpbarbosa  # Custom production directory
    $0 --both-steps --no-backup --verbose   # Both steps without backup

DIRECTORIES:
    Source:      $SOURCE_DIR
    Public:      $STAGING_DIR
    Production:  $PRODUCTION_DIR (configurable)

FILES TO SYNC:
    - index.html (main landing page)
    - robots.txt (search engine crawler instructions)
    - humans.txt (team and technology credits)
    - styles/ (v2 CSS: v2.css)
    - scripts/ (v2 JS modules: v2.js)
    - favicon.svg
    - assets/css/ (CSS stylesheets and FontAwesome)
    - assets/js/ (JavaScript libraries and utilities)
    - assets/sass/ (SASS source files and partials)
    - assets/webfonts/ (FontAwesome web fonts)
    - images/ (Website images and graphics)
    - music_in_numbers/src/ (Music in Numbers sibling project)
    - guia_js/ (Guia JS sibling project)
    - monitora_vagas/src/ (Monitora Vagas legacy implementation)
    - monitora_vagas/public/ (Monitora Vagas modern v2.0.0)
    - busca_vagas/client/public/ (Busca Vagas frontend)
    - busca_vagas/src/ (Busca Vagas API server - backend only)
    - Additional resources can be added by extending this script

EOF
}

# Validate environment and directories
validate_environment() {
    print_step "Validating environment"
    
    # Check if we're in the right project directory
    if [[ ! -f "$PROJECT_ROOT/.github/copilot-instructions.md" ]]; then
        print_error "Not in MP Barbosa site project directory"
        print_info "Expected to find .github/copilot-instructions.md in project root"
        exit 1
    fi
    
    # Check if source directory exists
    if [[ ! -d "$SOURCE_DIR" ]]; then
        print_error "Source directory not found: $SOURCE_DIR"
        exit 1
    fi
    
    # Check if public directory exists, create if needed
    if [[ ! -d "$STAGING_DIR" ]]; then
        print_warning "Public directory not found, creating: $STAGING_DIR"
        if [[ "$DRY_RUN" == "false" ]]; then
            mkdir -p "$STAGING_DIR"
        fi
    fi
    
    print_success "Environment validation complete"
}

# Create backup of existing public files
create_backup() {
    if [[ "$CREATE_BACKUP" == "false" ]]; then
        return 0
    fi
    
    print_step "Creating backup of existing public files"
    
    local backup_timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_path="$STAGING_DIR/.backups/backup_$backup_timestamp"
    
    if [[ -d "$STAGING_DIR" ]] && [[ "$(ls -A "$STAGING_DIR" 2>/dev/null)" ]]; then
        if [[ "$DRY_RUN" == "false" ]]; then
            mkdir -p "$backup_path"
            
            # Copy existing public files to backup (excluding .backups directory)
            find "$STAGING_DIR" -mindepth 1 -maxdepth 1 ! -name ".backups" -exec cp -r {} "$backup_path/" \;
            
            print_success "Backup created: $backup_path"
            
            # Declaration
            local backup_count
            # Clean up old backups (keep only last 5)
            backup_count=$(find "$STAGING_DIR/.backups" -maxdepth 1 -type d -name "backup_*" | wc -l)
            if [[ $backup_count -gt 5 ]]; then
                find "$STAGING_DIR/.backups" -maxdepth 1 -type d -name "backup_*" | sort | head -n $((backup_count - 5)) | xargs rm -rf
                print_info "Cleaned up old backups (keeping last 5)"
            fi
        else
            print_info "[DRY RUN] Would create backup: $backup_path"
        fi
    else
        print_info "No existing files to backup"
    fi
}

# =============================================================================
# SPECIFIC COPY FUNCTIONS (USING REUSABLE COMPONENTS)
# =============================================================================

# Copy index.html file
copy_index_html() {
    print_step "Copying index.html"
    copy_single_file "$SOURCE_DIR/index.html" "$STAGING_DIR/index.html" "index.html" "true"
}

# Copy robots.txt file
copy_robots_txt() {
    print_step "Copying robots.txt"
    copy_single_file "$SOURCE_DIR/robots.txt" "$STAGING_DIR/robots.txt" "robots.txt" "false"
}

# Copy humans.txt file
copy_humans_txt() {
    print_step "Copying humans.txt"
    copy_single_file "$SOURCE_DIR/humans.txt" "$STAGING_DIR/humans.txt" "humans.txt" "false"
}

# Copy CSS assets folder
copy_css_assets() {
    print_step "Copying CSS assets"
    copy_directory "$SOURCE_DIR/assets/css" "$STAGING_DIR/assets/css" "CSS assets directory" "*.css" "false"
}

# Copy JavaScript assets folder
copy_js_assets() {
    print_step "Copying JavaScript assets"
    copy_directory "$SOURCE_DIR/assets/js" "$STAGING_DIR/assets/js" "JavaScript assets directory" "*.js" "false"
}

# Copy v2 styles folder (v2.css and any other stylesheets)
copy_styles() {
    print_step "Copying styles folder"
    copy_directory "$SOURCE_DIR/styles" "$STAGING_DIR/styles" "Styles directory (v2)" "*.css" "true"
}

# Copy v2 scripts folder (v2.js and any other ES modules)
copy_scripts() {
    print_step "Copying scripts folder"
    copy_directory "$SOURCE_DIR/scripts" "$STAGING_DIR/scripts" "Scripts directory (v2)" "*.mjs" "true"
}

# Copy favicon.svg
copy_favicon() {
    print_step "Copying favicon.svg"
    copy_single_file "$SOURCE_DIR/favicon.svg" "$STAGING_DIR/favicon.svg" "favicon.svg" "false"
}

# Copy SASS assets folder (with enhanced verbose output for SASS structure)
copy_sass_assets() {
    print_step "Copying SASS assets"
    
    local source_dir="$SOURCE_DIR/assets/sass"
    local dest_dir="$STAGING_DIR/assets/sass"
    
    # Use the generic copy_directory function
    copy_directory "$source_dir" "$dest_dir" "SASS assets directory" "*.scss" "false"
    
    # Add SASS-specific verbose information if directory exists and verbose is enabled
    if [[ "$VERBOSE" == "true" && -d "$dest_dir" && "$DRY_RUN" == "false" ]]; then
        local partial_count=$(find "$dest_dir" -name "_*.scss" | wc -l)
        local main_sass_files=$(find "$dest_dir" -maxdepth 1 -name "*.scss" ! -name "_*")
        local subdirs=$(find "$dest_dir" -maxdepth 1 -type d ! -path "$dest_dir")
        
        if [[ $partial_count -gt 0 ]]; then
            print_info "  Partial files: $partial_count"
        fi
        
        if [[ -n "$main_sass_files" ]]; then
            print_info "  Main SASS files:"
            echo "$main_sass_files" | while read -r file; do
                if [[ -f "$file" ]]; then
                    local file_name=$(basename "$file")
                    local file_size=$(du -h "$file" | cut -f1)
                    print_info "    - $file_name ($file_size)"
                fi
            done
        fi
        
        if [[ -n "$subdirs" ]]; then
            print_info "  SASS subdirectories:"
            echo "$subdirs" | while read -r dir; do
                if [[ -d "$dir" ]]; then
                    local dir_name=$(basename "$dir")
                    local dir_files=$(find "$dir" -name "*.scss" | wc -l)
                    print_info "    - $dir_name/ ($dir_files files)"
                fi
            done
        fi
    fi
}

# Copy webfonts folder
copy_webfonts() {
    print_step "Copying webfonts folder"
    
    local source_dir="$SOURCE_DIR/assets/webfonts"
    local dest_dir="$STAGING_DIR/assets/webfonts"
    
    if [[ ! -d "$source_dir" ]]; then
        print_warning "Webfonts directory not found in source"
        print_info "  Expected: $source_dir"
        return 0
    fi
    
    # Count all webfont files using proper find syntax
    local font_count=$(find "$source_dir" -type f \( -name "*.eot" -o -name "*.svg" -o -name "*.ttf" -o -name "*.woff" -o -name "*.woff2" -o -name "*.otf" \) | wc -l)
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Create destination directory if it doesn't exist
        mkdir -p "$dest_dir"
        
        # Copy all files
        cp -r "$source_dir"/* "$dest_dir/"
        print_success "Copied: Webfonts directory ($font_count font files)"
        
        if [[ "$VERBOSE" == "true" ]]; then
            print_info "  Source: $source_dir"
            print_info "  Destination: $dest_dir"
            print_info "  Font files copied: $font_count"
            
            # Show font files if not too many
            if [[ $font_count -gt 0 && $font_count -le 10 ]]; then
                find "$dest_dir" -type f \( -name "*.eot" -o -name "*.svg" -o -name "*.ttf" -o -name "*.woff" -o -name "*.woff2" -o -name "*.otf" \) | head -10 | while read file; do
                    local filename=$(basename "$file")
                    local filesize=$(du -h "$file" | cut -f1)
                    print_info "    - $filename ($filesize)"
                done
            elif [[ $font_count -gt 10 ]]; then
                find "$dest_dir" -type f \( -name "*.eot" -o -name "*.svg" -o -name "*.ttf" -o -name "*.woff" -o -name "*.woff2" -o -name "*.otf" \) | head -5 | while read file; do
                    local filename=$(basename "$file")
                    local filesize=$(du -h "$file" | cut -f1)
                    print_info "    - $filename ($filesize)"
                done
                print_info "    ... and $((font_count - 5)) more font files"
            fi
        fi
    else
        print_info "[DRY RUN] Would copy: $source_dir → $dest_dir"
        
        if [[ "$VERBOSE" == "true" ]]; then
            print_info "  Font files to copy: $font_count"
            
            if [[ $font_count -gt 0 && $font_count -le 5 ]]; then
                find "$source_dir" -type f \( -name "*.eot" -o -name "*.svg" -o -name "*.ttf" -o -name "*.woff" -o -name "*.woff2" -o -name "*.otf" \) | head -5 | while read file; do
                    local filename=$(basename "$file")
                    local filesize=$(du -h "$file" | cut -f1)
                    print_info "    - $filename ($filesize)"
                done
            elif [[ $font_count -gt 5 ]]; then
                find "$source_dir" -type f \( -name "*.eot" -o -name "*.svg" -o -name "*.ttf" -o -name "*.woff" -o -name "*.woff2" -o -name "*.otf" \) | head -3 | while read file; do
                    local filename=$(basename "$file")
                    local filesize=$(du -h "$file" | cut -f1)
                    print_info "    - $filename ($filesize)"
                done
                print_info "    ... and $((font_count - 3)) more font files"
            fi
        fi
    fi
    
    return 0
}

# Copy images folder
copy_images() {
    print_step "Copying images folder"
    
    local source_dir="$SOURCE_DIR/images"
    local dest_dir="$STAGING_DIR/images"
    
    if [[ ! -d "$source_dir" ]]; then
        print_warning "Images directory not found in source"
        print_info "  Expected: $source_dir"
        return 0
    fi

    # Declaration - SC2155
    local image_count
    # Count all image files using proper find syntax
    image_count=$(find "$source_dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.bmp" -o -name "*.ico" \) | wc -l)
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Create destination directory if it doesn't exist
        mkdir -p "$dest_dir"
        
        # Copy all files
        cp -r "$source_dir"/* "$dest_dir/"
        print_success "Copied: Images directory ($image_count image files)"
        
        if [[ "$VERBOSE" == "true" ]]; then
            print_info "  Source: $source_dir"
            print_info "  Destination: $dest_dir"
            print_info "  Image files copied: $image_count"
            
            # Show first few image files if not too many
            if [[ $image_count -gt 0 && $image_count -le 10 ]]; then
                find "$dest_dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.bmp" -o -name "*.ico" \) | head -10 | while read file; do

                   # Declaration - SC2155
                    local filename
                    local filesize

                    filename=$(basename "$file")
                    filesize=$(du -h "$file" | cut -f1)
                    print_info "    - $filename ($filesize)"
                done
            elif [[ $image_count -gt 10 ]]; then
                find "$dest_dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.bmp" -o -name "*.ico" \) | head -5 | while read file; do
                    # Declaration - SC2155
                    local filename
                    local filesize

                    filename=$(basename "$file")
                    filesize=$(du -h "$file" | cut -f1)
                    print_info "    - $filename ($filesize)"
                done
                print_info "    ... and $((image_count - 5)) more image files"
            fi
        fi
    else
        print_info "[DRY RUN] Would copy: $source_dir → $dest_dir"
        
        if [[ "$VERBOSE" == "true" ]]; then
            print_info "  Image files to copy: $image_count"
            
            if [[ $image_count -gt 0 && $image_count -le 5 ]]; then
                find "$source_dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.bmp" -o -name "*.ico" \) | head -5 | while read file; do
                    # Declaration - SC2155
                    local filename
                    local filesize
                    
                    filename=$(basename "$file")
                    filesize=$(du -h "$file" | cut -f1)
                    print_info "    - $filename ($filesize)"
                done
            elif [[ $image_count -gt 5 ]]; then
                find "$source_dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.bmp" -o -name "*.ico" \) | head -3 | while read file; do
                    # Declaration - SC2155
                    local filename
                    local filesize

                    filename=$(basename "$file")
                    filesize=$(du -h "$file" | cut -f1)
                    print_info "    - $filename ($filesize)"
                done
                print_info "    ... and $((image_count - 3)) more image files"
            fi
        fi
    fi
    
    return 0
}

# Copy Music in Numbers sibling project
copy_music_in_numbers_project() {
    print_step "Copying Music in Numbers project content"
    
    # Music in Numbers sibling project deployment
    # Location: ../music_in_numbers
    # Strategy: Copy src/ folder with complete module architecture
    
    local source_project="$PROJECT_ROOT/../music_in_numbers"
    local dest_dir="$STAGING_DIR/music_in_numbers"
    
    # Check if sibling project exists
    if [[ ! -d "$source_project" ]]; then
        print_warning "Music in Numbers sibling project not found"
        print_info "  Expected location: $source_project"
        print_info "  Skipping Music in Numbers deployment"
        return 0
    fi
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Create destination directory
        mkdir -p "$dest_dir"
        
        # Copy src folder (module architecture with HTML, scripts, styles)
        if [[ -d "$source_project/src" ]]; then
            # Declaration - SC2155
            local src_html
            local src_js
            local src_css
            
            src_html=$(find "$source_project/src" -maxdepth 1 -type f -name "*.html" 2>/dev/null | wc -l)
            src_js=$(find "$source_project/src/scripts" -type f \( -name "*.js" -o -name "*.mjs" \) 2>/dev/null | wc -l)
            src_css=$(find "$source_project/src/styles" -type f -name "*.css" 2>/dev/null | wc -l)
            
            # Copy complete src directory structure
            cp -r "$source_project/src" "$dest_dir/"
            print_success "Copied: Music in Numbers src/ folder ($src_html HTML, $src_js JS files, $src_css CSS files)"
            
            if [[ "$VERBOSE" == "true" ]]; then
                print_info "  Source: $source_project/src"
                print_info "  Destination: $dest_dir/src"
                print_info "  HTML files: $src_html"
                print_info "  JavaScript files: $src_js"
                print_info "  CSS files: $src_css"
            fi
        else
            print_warning "Music in Numbers src/ folder not found"
        fi
    else
        print_info "[DRY RUN] Would copy Music in Numbers project"
        
        if [[ -d "$source_project/src" ]]; then
            # Declaration - SC2155
            local src_html
            local src_js
            local src_css        
        
            src_html=$(find "$source_project/src" -maxdepth 1 -type f -name "*.html" 2>/dev/null | wc -l)
            src_js=$(find "$source_project/src/scripts" -type f \( -name "*.js" -o -name "*.mjs" \) 2>/dev/null | wc -l)
            src_css=$(find "$source_project/src/styles" -type f -name "*.css" 2>/dev/null | wc -l)
            
            print_info "  Source: $source_project/src"
            print_info "  Destination: $dest_dir/src"
            print_info "  HTML files to copy: $src_html"
            print_info "  JavaScript files to copy: $src_js"
            print_info "  CSS files to copy: $src_css"
        else
            print_warning "  Music in Numbers src/ folder not found at $source_project/src"
        fi
    fi
    
    return 0
}

# Copy Guia JS sibling project
copy_guia_js_project() {
    print_step "Copying Guia JS project content"
    
    # Guia JS sibling project deployment
    # Location: ../guia_js
    # Strategy: Run Vite production build (npm run build) then copy dist/ folder.
    #           Falls back to src/ with a warning if dist/ is unavailable after build.

    # Declaration - SC2155
    local source_project
    local dest_dir
    local copy_source

    source_project="$PROJECT_ROOT/../guia_js"
    dest_dir="$STAGING_DIR/guia_js"
    
    # Check if sibling project exists
    if [[ ! -d "$source_project" ]]; then
        print_warning "Guia JS sibling project not found"
        print_info "  Expected location: $source_project"
        print_info "  Skipping Guia Turistico deployment"
        return 0
    fi

    # --- Resolve copy source: prefer Vite dist/, fall back to src/ ---
    _resolve_guia_js_source() {
        # Attempt Vite production build if package.json defines a build script
        if [[ -f "$source_project/package.json" ]] && grep -q '"build"' "$source_project/package.json"; then
            print_info "  Running Vite production build for Guia JS..."
            if (cd "$source_project" && npm run build --silent 2>&1); then
                print_success "  Vite build succeeded"
            else
                print_warning "  Vite build failed; will attempt fallback"
            fi
        fi

        if [[ -d "$source_project/dist" ]]; then
            copy_source="$source_project/dist"
        elif [[ -d "$source_project/src" ]]; then
            print_warning "Guia JS dist/ not found after build; falling back to src/"
            copy_source="$source_project/src"
        else
            copy_source=""
        fi
    }

    if [[ "$DRY_RUN" == "false" ]]; then
        # Create destination directory
        mkdir -p "$dest_dir"

        _resolve_guia_js_source

        if [[ -n "$copy_source" ]]; then
            # Declaration - SC2155
            local src_html
            local src_js
            local src_css
            local src_dirs

            src_html=$(find "$copy_source" -type f -name "*.html" 2>/dev/null | wc -l)
            src_js=$(find "$copy_source" -type f \( -name "*.js" -o -name "*.mjs" \) 2>/dev/null | wc -l)
            src_css=$(find "$copy_source" -type f -name "*.css" 2>/dev/null | wc -l)
            src_dirs=$(find "$copy_source" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l)
            
            # Copy production build output
            cp -r "$copy_source"/. "$dest_dir/"
            print_success "Copied: Guia Turistico $(basename "$copy_source")/ ($src_html HTML, $src_js JS, $src_css CSS files, $src_dirs subdirectories)"
            
            if [[ "$VERBOSE" == "true" ]]; then
                print_info "  Source: $copy_source"
                print_info "  Destination: $dest_dir"
                print_info "  HTML files: $src_html"
                print_info "  JavaScript files: $src_js"
                print_info "  CSS files: $src_css"
                print_info "  Subdirectories: $src_dirs"
            fi
        else
            print_warning "Guia Turistico: no dist/ or src/ folder found; skipping"
        fi
    else
        print_info "[DRY RUN] Would build and copy Guia Turistico project"

        # Resolve without actually building in dry-run
        if [[ -d "$source_project/dist" ]]; then
            copy_source="$source_project/dist"
        elif [[ -d "$source_project/src" ]]; then
            copy_source="$source_project/src"
            print_warning "  [DRY RUN] dist/ not found; would fall back to src/"
        else
            copy_source=""
        fi

        if [[ -n "$copy_source" ]]; then
            # Declaration - SC2155
            local src_html
            local src_js
            local src_css
            local src_dirs
        
            src_html=$(find "$copy_source" -type f -name "*.html" 2>/dev/null | wc -l)
            src_js=$(find "$copy_source" -type f \( -name "*.js" -o -name "*.mjs" \) 2>/dev/null | wc -l)
            src_css=$(find "$copy_source" -type f -name "*.css" 2>/dev/null | wc -l)
            src_dirs=$(find "$copy_source" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l)
            
            print_info "  Source (would use): $copy_source"
            print_info "  Destination: $dest_dir"
            print_info "  HTML files to copy: $src_html"
            print_info "  JavaScript files to copy: $src_js"
            print_info "  CSS files to copy: $src_css"
            print_info "  Subdirectories to copy: $src_dirs"
        else
            print_warning "  [DRY RUN] No dist/ or src/ folder found"
        fi
    fi
    
    return 0
}

# Copy Monitora Vagas sibling project
copy_monitora_vagas_project() {
    print_step "Copying Monitora Vagas project content"
    
    # Monitora Vagas sibling project deployment
    # Location: ../monitora_vagas
    # Strategy: Copy both src/ and public/ folders with symlink resolution
    
    local source_project="$PROJECT_ROOT/../monitora_vagas"
    local dest_dir="$STAGING_DIR/monitora_vagas"
    
    # Check if sibling project exists
    if [[ ! -d "$source_project" ]]; then
        print_warning "Monitora Vagas sibling project not found"
        print_info "  Expected location: $source_project"
        print_info "  Skipping Monitora Vagas deployment"
        return 0
    fi
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Create destination directory
        mkdir -p "$dest_dir"
        
        # Copy src folder (legacy implementation)
        if [[ -d "$source_project/src" ]]; then
            local src_html=$(find "$source_project/src" -maxdepth 1 -type f -name "*.html" 2>/dev/null | wc -l)
            local src_js=$(find "$source_project/src" -maxdepth 1 -type f \( -name "*.js" -o -name "*.mjs" \) 2>/dev/null | wc -l)
            local src_dirs=$(find "$source_project/src" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l)
            
            # Use cp -rL to resolve symlinks
            cp -rL "$source_project/src" "$dest_dir/"
            print_success "Copied: Monitora Vagas src/ folder ($src_html HTML, $src_js JS files, $src_dirs subdirectories)"
            
            if [[ "$VERBOSE" == "true" ]]; then
                print_info "  Source: $source_project/src"
                print_info "  Destination: $dest_dir/src"
                print_info "  HTML files: $src_html"
                print_info "  JavaScript files: $src_js"
                print_info "  Subdirectories: $src_dirs"
            fi
        else
            print_warning "Monitora Vagas src/ folder not found"
        fi
        
        # Copy public folder (modern v2.0.0 implementation)
        if [[ -d "$source_project/public" ]]; then
            local pub_html=$(find "$source_project/public" -maxdepth 1 -type f -name "*.html" 2>/dev/null | wc -l)
            local pub_dirs=$(find "$source_project/public" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l)
            
            # Use cp -rL to resolve symlinks (public/ has symlinks to ../src/)
            cp -rL "$source_project/public" "$dest_dir/"
            print_success "Copied: Monitora Vagas public/ folder ($pub_html HTML files, $pub_dirs subdirectories)"
            
            if [[ "$VERBOSE" == "true" ]]; then
                print_info "  Source: $source_project/public"
                print_info "  Destination: $dest_dir/public"
                print_info "  HTML files: $pub_html"
                print_info "  Subdirectories: $pub_dirs"
            fi
        else
            print_warning "Monitora Vagas public/ folder not found"
        fi
    else
        print_info "[DRY RUN] Would copy: $source_project/src → $dest_dir/src"
        print_info "[DRY RUN] Would copy: $source_project/public → $dest_dir/public"
        
        if [[ "$VERBOSE" == "true" ]]; then
            print_info "  Source project: $source_project"
            print_info "  Destination: $dest_dir"
            print_info "  Method: cp -rL (with symlink resolution)"
        fi
    fi
    
    return 0
}

# Copy Busca Vagas sibling project
copy_busca_vagas_project() {
    print_step "Copying Busca Vagas project content"
    
    # Busca Vagas sibling project deployment
    # Location: ../busca_vagas
    # Strategy: Copy client/public/ folder and src/ API server code
    # Deployment: public/busca_vagas (backend API, not in submodules)
    
    local source_project="$PROJECT_ROOT/../busca_vagas"
    local dest_dir="$STAGING_DIR/busca_vagas"
    
    # Check if sibling project exists
    if [[ ! -d "$source_project" ]]; then
        print_warning "Busca Vagas sibling project not found"
        print_info "  Expected location: $source_project"
        print_info "  Skipping Busca Vagas deployment"
        return 0
    fi
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Create destination directory
        mkdir -p "$dest_dir"
        
        # Copy client/public folder (frontend HTML)
        if [[ -d "$source_project/client/public" ]]; then
            local html_count=$(find "$source_project/client/public" -maxdepth 1 -type f -name "*.html" 2>/dev/null | wc -l)
            local js_count=$(find "$source_project/client/public" -type f \( -name "*.js" -o -name "*.mjs" \) 2>/dev/null | wc -l)
            
            mkdir -p "$dest_dir/client"
            cp -r "$source_project/client/public" "$dest_dir/client/"
            print_success "Copied: Busca Vagas client/public/ folder ($html_count HTML, $js_count JS files)"
            
            if [[ "$VERBOSE" == "true" ]]; then
                print_info "  Source: $source_project/client/public"
                print_info "  Destination: $dest_dir/client/public"
                print_info "  HTML files: $html_count"
                print_info "  JavaScript files: $js_count"
            fi
        else
            print_warning "Busca Vagas client/public/ folder not found"
        fi
        
        # Copy src folder (API server code)
        if [[ -d "$source_project/src" ]]; then
            local src_js=$(find "$source_project/src" -type f \( -name "*.js" -o -name "*.mjs" \) 2>/dev/null | wc -l)
            local src_dirs=$(find "$source_project/src" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l)
            
            cp -r "$source_project/src" "$dest_dir/"
            print_success "Copied: Busca Vagas src/ folder ($src_js JS files, $src_dirs subdirectories)"
            
            if [[ "$VERBOSE" == "true" ]]; then
                print_info "  Source: $source_project/src"
                print_info "  Destination: $dest_dir/src"
                print_info "  JavaScript files: $src_js"
                print_info "  Subdirectories: $src_dirs"
            fi
        else
            print_warning "Busca Vagas src/ folder not found"
        fi
        
        # Copy package.json if exists (for dependency information)
        if [[ -f "$source_project/package.json" ]]; then
            cp "$source_project/package.json" "$dest_dir/"
            print_info "  Copied: package.json"
        fi
    else
        print_info "[DRY RUN] Would copy: $source_project/client/public → $dest_dir/client/public"
        print_info "[DRY RUN] Would copy: $source_project/src → $dest_dir/src"
        print_info "[DRY RUN] Would copy: $source_project/package.json → $dest_dir/package.json"
        
        if [[ "$VERBOSE" == "true" ]]; then
            print_info "  Source project: $source_project"
            print_info "  Destination: $dest_dir"
        fi
    fi
    
    return 0
}

# Copy additional resources (placeholder for future expansion)
copy_additional_resources() {
    print_step "Checking for additional resources"
    
    # Placeholder for future resource copying
    # Examples that could be added:
    # - copy_images
    # - copy_fonts
    # - copy_other_submodules
    
    print_info "Additional resources: None configured (can be extended)"
    
    # Future expansion example:
    # if [[ -d "$SOURCE_DIR/assets/images" ]]; then
    #     copy_image_assets
    # fi
}

# Validate copied files using reusable validation functions
validate_sync() {
    print_step "Validating synchronized files"
    
    local validation_errors=0
    
    # Define validation data: path, description, pattern, required
    local validations=(
        "$STAGING_DIR/index.html|index.html||true"
        "$STAGING_DIR/robots.txt|robots.txt||false"
        "$STAGING_DIR/humans.txt|humans.txt||false"
        "$STAGING_DIR/assets/css|CSS assets directory|*.css|false"
        "$STAGING_DIR/assets/js|JavaScript assets directory|*.js|false"
        "$STAGING_DIR/assets/sass|SASS assets directory|*.scss|false"
        "$STAGING_DIR/assets/webfonts|Webfonts directory|font_files|false"
        "$STAGING_DIR/images|Images directory|image_files|false"
        "$STAGING_DIR/music_in_numbers/src|Music in Numbers sibling project|*.html|false"
        "$STAGING_DIR/monitora_vagas/src|Monitora Vagas src folder|*.js|false"
        "$STAGING_DIR/monitora_vagas/public|Monitora Vagas public folder|*.html|false"
    )
    
    # Validate each path using the generic validation function
    for validation in "${validations[@]}"; do
        IFS='|' read -r path description pattern required <<< "$validation"
        
        if ! validate_path "$path" "$description" "$pattern" "$required"; then
            if [[ "$required" == "true" ]]; then
                validation_errors=$((validation_errors + 1))
            fi
        fi
    done
    
    # Add specific verbose information for SASS partials if needed
    if [[ "$VERBOSE" == "true" && -d "$STAGING_DIR/assets/sass" ]]; then
        local partial_count=$(find "$STAGING_DIR/assets/sass" -name "_*.scss" | wc -l)
        if [[ $partial_count -gt 0 ]]; then
            print_info "  SASS partial files: $partial_count"
        fi
    fi
    
    # Add specific verbose information for Music in Numbers files if needed
    if [[ "$VERBOSE" == "true" && -d "$STAGING_DIR/music_in_numbers/src" ]]; then
        for file in "index.html" "music_in_numbers.html"; do
            if [[ -f "$STAGING_DIR/music_in_numbers/src/$file" ]]; then
                local file_size=$(du -h "$STAGING_DIR/music_in_numbers/src/$file" | cut -f1)
                print_info "    - $file ($file_size)"
            fi
        done
    fi
    
    # Add specific verbose information for Busca Vagas files if needed
    if [[ "$VERBOSE" == "true" && -d "$STAGING_DIR/busca_vagas/client/public" ]]; then
        if [[ -f "$STAGING_DIR/busca_vagas/client/public/index.html" ]]; then
            local file_size=$(du -h "$STAGING_DIR/busca_vagas/client/public/index.html" | cut -f1)
            print_info "    - index.html ($file_size)"
        fi
    fi
    
    # Add specific verbose information for Monitora Vagas files if needed
    if [[ "$VERBOSE" == "true" && -d "$STAGING_DIR/monitora_vagas/src" ]]; then
        if [[ -f "$STAGING_DIR/monitora_vagas/src/index.html" ]]; then
            local file_size=$(du -h "$STAGING_DIR/monitora_vagas/src/index.html" | cut -f1)
            print_info "    - index.html ($file_size)"
        fi
    fi
    
    if [[ $validation_errors -eq 0 ]]; then
        print_success "All files validated successfully"
        return 0
    else
        print_error "Validation failed with $validation_errors errors"
        return 1
    fi
}

# Show summary of operations
show_summary() {
    print_header "DEPLOYMENT SUMMARY"
    
    echo -e "${WHITE}Project:${NC}      MP Barbosa Personal Website"
    echo -e "${WHITE}Source:${NC}       $SOURCE_DIR"
    echo -e "${WHITE}Public:${NC}       $STAGING_DIR"
    echo -e "${WHITE}Production:${NC}   $PRODUCTION_DIR"
    echo -e "${WHITE}Operation:${NC}    $(if [[ "$DRY_RUN" == "true" ]]; then echo "DRY RUN (preview only)"; else echo "DEPLOYMENT COMPLETED"; fi)"
    echo ""
    
    # Show which steps were executed
    echo -e "${WHITE}Steps Executed:${NC}"
    if [[ "$STEP_SOURCE_TO_STAGING" == "true" ]]; then
        echo -e "  ✓ Step 1: Source → Public"
    fi
    if [[ "$STEP_STAGING_TO_PRODUCTION" == "true" ]]; then
        echo -e "  ✓ Step 2: Public → Production"
    fi
    echo ""
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Show Step 1 results if executed
        if [[ "$STEP_SOURCE_TO_STAGING" == "true" ]]; then
            echo -e "${WHITE}Step 1 - Files in Public Folder:${NC}"
            if [[ -f "$STAGING_DIR/index.html" ]]; then
                echo -e "  ✓ index.html"
            fi
            if [[ -f "$STAGING_DIR/robots.txt" ]]; then
                echo -e "  ✓ robots.txt"
            fi
            if [[ -f "$STAGING_DIR/humans.txt" ]]; then
                echo -e "  ✓ humans.txt"
            fi
            if [[ -d "$STAGING_DIR/assets/css" ]]; then
                local css_count=$(find "$STAGING_DIR/assets/css" -name "*.css" | wc -l)
                echo -e "  ✓ CSS assets ($css_count files)"
            fi
            if [[ -d "$STAGING_DIR/assets/js" ]]; then
                local js_count=$(find "$STAGING_DIR/assets/js" -name "*.js" | wc -l)
                echo -e "  ✓ JavaScript assets ($js_count files)"
            fi
            if [[ -d "$STAGING_DIR/assets/sass" ]]; then
                local sass_count=$(find "$STAGING_DIR/assets/sass" -name "*.scss" | wc -l)
                echo -e "  ✓ SASS assets ($sass_count files)"
            fi
            if [[ -d "$STAGING_DIR/assets/webfonts" ]]; then
                local font_count=$(find "$STAGING_DIR/assets/webfonts" -type f \( -name "*.eot" -o -name "*.svg" -o -name "*.ttf" -o -name "*.woff" -o -name "*.woff2" -o -name "*.otf" \) | wc -l)
                echo -e "  ✓ Webfonts ($font_count files)"
            fi
            if [[ -d "$STAGING_DIR/images" ]]; then
                local image_count=$(find "$STAGING_DIR/images" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.bmp" -o -name "*.ico" \) | wc -l)
                echo -e "  ✓ Images ($image_count files)"
            fi
            if [[ -d "$STAGING_DIR/music_in_numbers/src" ]]; then
                local html_count=$(find "$STAGING_DIR/music_in_numbers/src" -maxdepth 1 -name "*.html" | wc -l)
                local js_count=$(find "$STAGING_DIR/music_in_numbers/src/scripts" -type f \( -name "*.js" -o -name "*.mjs" \) 2>/dev/null | wc -l)
                local css_count=$(find "$STAGING_DIR/music_in_numbers/src/styles" -type f -name "*.css" 2>/dev/null | wc -l)
                echo -e "  ✓ Music in Numbers sibling project ($html_count HTML, $js_count JS, $css_count CSS files)"
            fi
            if [[ -d "$STAGING_DIR/monitora_vagas/src" ]]; then
                local html_count=$(find "$STAGING_DIR/monitora_vagas/src" -maxdepth 1 -name "*.html" | wc -l)
                local js_count=$(find "$STAGING_DIR/monitora_vagas/src" -maxdepth 1 -type f \( -name "*.js" -o -name "*.mjs" \) | wc -l)
                echo -e "  ✓ Monitora Vagas submodule ($html_count HTML files, $js_count JS files)"
            fi
            echo ""
        fi
        
        # Show Step 2 results if executed
        if [[ "$STEP_STAGING_TO_PRODUCTION" == "true" && -d "$PRODUCTION_DIR" ]]; then
            echo -e "${WHITE}Step 2 - Files in Production:${NC}"
            local production_files=$(find "$PRODUCTION_DIR" -type f ! -path "*/.backups/*" | wc -l)
            local production_size=$(du -sh "$PRODUCTION_DIR" --exclude=".backups" 2>/dev/null | cut -f1 || echo "Unknown")
            echo -e "  ✓ Total files deployed: $production_files"
            echo -e "  ✓ Total size: $production_size"
            
            # Show critical files status
            if [[ -f "$PRODUCTION_DIR/index.html" ]]; then
                echo -e "  ✓ index.html deployed"
            fi
            if [[ -d "$PRODUCTION_DIR/submodules/music_in_numbers" ]]; then
                echo -e "  ✓ Music in Numbers sibling project deployed"
            fi
            if [[ -d "$PRODUCTION_DIR/monitora_vagas" ]]; then
                echo -e "  ✓ Monitora Vagas sibling project deployed"
            fi
            if [[ -f "/etc/systemd/system/busca_vagas_node_app.service" ]]; then
                echo -e "  ✓ Busca Vagas systemd service deployed"
            fi
            
            # Show service status if root and services were restarted
            if [[ $EUID -eq 0 ]]; then
                if systemctl is-active --quiet nginx 2>/dev/null; then
                    echo -e "  ✓ Nginx service running"
                fi
            fi
            echo ""
        fi
        
        # Show directory contents if verbose or single step
        if [[ "$VERBOSE" == "true" || ("$STEP_SOURCE_TO_STAGING" == "true" && "$STEP_STAGING_TO_PRODUCTION" == "false") ]]; then
            echo -e "${WHITE}Public Folder Contents:${NC}"
            if command -v tree >/dev/null 2>&1; then
                tree "$STAGING_DIR" -a -I ".backups"
            else
                find "$STAGING_DIR" -not -path "*/.backups/*" -type f | sort | sed 's|^'"$STAGING_DIR"'||' | sed 's|^/||'
            fi
            echo ""
        fi
        
        if [[ "$VERBOSE" == "true" || ("$STEP_STAGING_TO_PRODUCTION" == "true" && "$STEP_SOURCE_TO_STAGING" == "false") ]]; then
            echo -e "${WHITE}Production Folder Contents:${NC}"
            if command -v tree >/dev/null 2>&1; then
                tree "$PRODUCTION_DIR" -a -I ".backups"
            else
                find "$PRODUCTION_DIR" -not -path "*/.backups/*" -type f | sort | sed 's|^'"$PRODUCTION_DIR"'||' | sed 's|^/||'
            fi
        fi
    else
        echo -e "${WHITE}Preview Mode:${NC} Use without --dry-run to perform actual deployment"
        
        if [[ "$STEP_SOURCE_TO_STAGING" == "true" ]]; then
            echo -e "  → Step 1 would copy files from source to public folder"
        fi
        if [[ "$STEP_STAGING_TO_PRODUCTION" == "true" ]]; then
            echo -e "  → Step 2 would deploy files from public to production"
        fi
    fi
}

# =============================================================================
# STEP 2 FUNCTIONS - PUBLIC TO PRODUCTION
# =============================================================================

# Validate production environment and directories
validate_production_environment() {
    print_step "Validating production environment"
    
    # Check if public directory exists (required for step 2)
    if [[ ! -d "$STAGING_DIR" ]]; then
        print_error "Public directory not found: $STAGING_DIR"
        print_info "Run Step 1 first to populate the public directory"
        exit 1
    fi
    
    # Check if public directory has content
    if [[ ! "$(ls -A "$STAGING_DIR" 2>/dev/null)" ]]; then
        print_error "Public directory is empty: $STAGING_DIR"
        print_info "Run Step 1 first to populate the public directory"
        exit 1
    fi
    
    # Check if production directory exists, create if needed and has permissions
    if [[ ! -d "$PRODUCTION_DIR" ]]; then
        print_warning "Production directory not found: $PRODUCTION_DIR"
        if [[ "$DRY_RUN" == "false" ]]; then
            if mkdir -p "$PRODUCTION_DIR" 2>/dev/null; then
                print_success "Created production directory: $PRODUCTION_DIR"
            else
                print_error "Cannot create production directory: $PRODUCTION_DIR"
                print_info "Check permissions or run with sudo for system directories"
                exit 1
            fi
        else
            print_info "[DRY RUN] Would create production directory: $PRODUCTION_DIR"
        fi
    fi
    
    # Test write permissions to production directory
    if [[ "$DRY_RUN" == "false" ]]; then
        if [[ ! -w "$PRODUCTION_DIR" ]]; then
            print_error "No write permission to production directory: $PRODUCTION_DIR"
            print_info "Check permissions or run with sudo for system directories"
            exit 1
        fi
    fi
    
    print_success "Production environment validation complete"
}

# Create backup of existing production files
create_production_backup() {
    if [[ "$CREATE_BACKUP" == "false" ]]; then
        return 0
    fi
    
    print_step "Creating backup of existing production files"
    
    local backup_timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_path="$PRODUCTION_DIR/.backups/backup_$backup_timestamp"
    
    if [[ -d "$PRODUCTION_DIR" ]] && [[ "$(ls -A "$PRODUCTION_DIR" 2>/dev/null)" ]]; then
        if [[ "$DRY_RUN" == "false" ]]; then
            mkdir -p "$backup_path"
            
            # Copy existing production files to backup (excluding .backups directory)
            find "$PRODUCTION_DIR" -mindepth 1 -maxdepth 1 ! -name ".backups" -exec cp -r {} "$backup_path/" \;
            
            print_success "Production backup created: $backup_path"
            
            # Clean up old backups (keep only last 7)
            local backup_count=$(find "$PRODUCTION_DIR/.backups" -maxdepth 1 -type d -name "backup_*" | wc -l)
            if [[ $backup_count -gt 7 ]]; then
                find "$PRODUCTION_DIR/.backups" -maxdepth 1 -type d -name "backup_*" | sort | head -n $((backup_count - 7)) | xargs rm -rf
                print_info "Cleaned up old production backups (keeping last 7)"
            fi
        else
            print_info "[DRY RUN] Would create production backup: $backup_path"
        fi
    else
        print_info "No existing production files to backup"
    fi
}

# Copy files from public to production directory
copy_public_to_production() {
    print_step "Copying files from public to production directory"
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Use rsync for efficient synchronization if available, otherwise use cp
        if command -v rsync >/dev/null 2>&1; then
            local rsync_options="-av --delete"
            if [[ "$VERBOSE" == "false" ]]; then
                rsync_options+=" --quiet"
            fi
            
            rsync $rsync_options "$STAGING_DIR/" "$PRODUCTION_DIR/"
            print_success "Files synchronized using rsync"
        else
            # Remove existing files in production (except .backups)
            find "$PRODUCTION_DIR" -mindepth 1 -maxdepth 1 ! -name ".backups" -exec rm -rf {} +
            
            # Copy all files from public to production
            cp -r "$STAGING_DIR"/* "$PRODUCTION_DIR/"
            print_success "Files copied using cp"
        fi
        
        if [[ "$VERBOSE" == "true" ]]; then
            print_info "  Source: $STAGING_DIR"
            print_info "  Destination: $PRODUCTION_DIR"
            
            # Count files in production
            local total_files=$(find "$PRODUCTION_DIR" -type f ! -path "*/.backups/*" | wc -l)
            local total_size=$(du -sh "$PRODUCTION_DIR" --exclude=".backups" | cut -f1)
            print_info "  Total files deployed: $total_files"
            print_info "  Total size: $total_size"
        fi
    else
        print_info "[DRY RUN] Would copy: $STAGING_DIR → $PRODUCTION_DIR"
        
        if [[ "$VERBOSE" == "true" ]]; then
            local total_files=$(find "$STAGING_DIR" -type f | wc -l)
            local total_size=$(du -sh "$STAGING_DIR" | cut -f1)
            print_info "  Files to deploy: $total_files"
            print_info "  Total size: $total_size"
        fi
    fi
}

# Copy systemd service file for Busca Vagas Node.js API
# Note: Busca Vagas is now a sibling project, this is kept for backward compatibility
copy_systemd_service() {
    print_step "Checking for systemd service configuration"
    
    local service_file="$PROJECT_ROOT/config/busca_vagas_node_app.service"
    local systemd_dir="/etc/systemd/system"
    
    # Check if service file exists in config directory
    if [[ ! -f "$service_file" ]]; then
        print_info "No systemd service file found in config/ (expected for sibling project)"
        return 0
    fi
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Check if we have sudo privileges for systemd directory
        if [[ $EUID -ne 0 ]]; then
            print_warning "Not running as root - systemd service installation requires sudo"
            print_info "  Service file available at: $service_file"
            print_info "  To install manually, run:"
            echo ""
            print_info "    sudo cp $service_file $systemd_dir/"
            print_info "    sudo systemctl daemon-reload"
            print_info "    sudo systemctl enable busca_vagas_node_app.service"
            echo ""
            return 0
        fi
        
        # Copy service file to systemd directory
        print_info "Copying systemd service file..."
        if sudo cp "$service_file" "$systemd_dir/"; then
            print_success "Systemd service file copied to $systemd_dir/"
            print_info "  Note: Service daemon-reload will occur during service restart"
        else
            print_warning "Failed to copy systemd service file"
        fi
    else
        print_info "[DRY RUN] Would copy: $service_file → $systemd_dir/"
    fi
}

# Restart and enable system services (nginx, Node.js apps)
# Executed at the end of Step 2 to activate deployed changes
restart_system_services() {
    print_step "Restarting and enabling system services"
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Check if we have sudo privileges
        if [[ $EUID -ne 0 ]]; then
            print_warning "Not running as root - service restart requires sudo"
            print_info "  Skipping service restart"
            print_info "  Manually run the following commands:"
            echo ""
            print_info "    sudo systemctl daemon-reload"
            print_info "    sudo systemctl restart busca_vagas_node_app"
            print_info "    sudo systemctl restart nginx"
            echo ""
            return 0
        fi
        
        # Reload systemd daemon to recognize new/updated service files
        print_info "Reloading systemd daemon..."
        if systemctl daemon-reload 2>/dev/null; then
            print_success "Systemd daemon reloaded"
        else
            print_warning "Failed to reload systemd daemon"
        fi
        
        # Restart Busca Vagas Node.js API service
        print_info "Restarting Busca Vagas Node.js API service..."
        if systemctl restart busca_vagas_node_app 2>/dev/null; then
            print_success "Busca Vagas API service restarted successfully"
        else
            print_warning "Failed to restart Busca Vagas API service (may not be installed or running)"
        fi
        
        # Restart nginx web server
        print_info "Restarting nginx web server..."
        if systemctl restart nginx 2>/dev/null; then
            print_success "Nginx restarted successfully"
        else
            print_warning "Failed to restart nginx (may not be installed or running)"
        fi
        
        print_success "System services restart completed"
    else
        print_info "[DRY RUN] Would execute service restart commands:"
        print_info "  sudo systemctl daemon-reload"
        print_info "  sudo systemctl restart busca_vagas_node_app"
        print_info "  sudo systemctl restart nginx"
    fi
}

# Validate production deployment
validate_production_deployment() {
    print_step "Validating production deployment"
    
    local validation_errors=0
    
    # Check critical files exist in production
    local critical_files=(
        "index.html"
    )
    
    for file in "${critical_files[@]}"; do
        if [[ -f "$PRODUCTION_DIR/$file" ]]; then
            print_success "$file deployed successfully"
            
            if [[ "$VERBOSE" == "true" ]]; then
                local file_size=$(du -h "$PRODUCTION_DIR/$file" | cut -f1)
                local file_modified=$(stat -c %y "$PRODUCTION_DIR/$file" 2>/dev/null || stat -f %Sm "$PRODUCTION_DIR/$file" 2>/dev/null)
                print_info "  Size: $file_size"
                print_info "  Modified: $file_modified"
            fi
        else
            print_error "$file not found in production directory"
            validation_errors=$((validation_errors + 1))
        fi
    done
    
    # Check that production directory has expected structure
    if [[ -d "$PRODUCTION_DIR" ]]; then
        local deployed_files=$(find "$PRODUCTION_DIR" -type f ! -path "*/.backups/*" | wc -l)
        local public_files=$(find "$STAGING_DIR" -type f | wc -l)
        
        print_info "Production files: $deployed_files (expected: $public_files)"
        
        if [[ $deployed_files -eq $public_files ]]; then
            print_success "File count matches public directory"
        elif [[ $deployed_files -lt $public_files ]]; then
            print_warning "Production has fewer files than public directory"
        fi
    fi
    
    if [[ $validation_errors -eq 0 ]]; then
        print_success "Production deployment validation complete"
        return 0
    else
        print_error "Production validation failed with $validation_errors errors"
        return 1
    fi
}

# =============================================================================
# EXECUTION STEP FUNCTIONS
# =============================================================================

# Execute Step 1: Source to Public
execute_step_1() {
    print_header "STEP 1: SOURCE → PUBLIC FOLDER"
    
    validate_environment
    create_backup
    copy_index_html
    copy_robots_txt
    copy_humans_txt
    copy_css_assets
    copy_js_assets
    copy_styles
    copy_scripts
    copy_favicon
    copy_sass_assets
    copy_webfonts
    copy_images
    copy_music_in_numbers_project
    copy_guia_js_project
    copy_monitora_vagas_project
    copy_busca_vagas_project
    copy_additional_resources
    
    if [[ "$DRY_RUN" == "false" ]]; then
        validate_sync
    fi
    
    print_success "Step 1 completed: Files copied from source to public folder"
}

# Execute Step 2: Public to Production
execute_step_2() {
    print_header "STEP 2: PUBLIC → PRODUCTION FOLDER"
    
    validate_production_environment
    create_production_backup
    copy_public_to_production
    copy_systemd_service
    
    if [[ "$DRY_RUN" == "false" ]]; then
        validate_production_deployment
        restart_system_services
    else
        # Show what services would be restarted in dry-run mode
        restart_system_services
    fi
    
    print_success "Step 2 completed: Files deployed from public to production"
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --step1)
                STEP_SOURCE_TO_STAGING=true
                shift
                ;;
            --step2)
                STEP_STAGING_TO_PRODUCTION=true
                shift
                ;;
            --both-steps)
                STEP_SOURCE_TO_STAGING=true
                STEP_STAGING_TO_PRODUCTION=true
                shift
                ;;
            --source)
                if [[ -n "${2:-}" ]]; then
                    if [[ "$2" == "dist" || "$2" == "src" ]]; then
                        SOURCE_DIR="$PROJECT_ROOT/$2"
                        shift 2
                    else
                        print_error "--source requires 'dist' or 'src'"
                        exit 1
                    fi
                else
                    print_error "--source requires a value: dist or src"
                    exit 1
                fi
                ;;
            --production-dir)
                if [[ -n "${2:-}" ]]; then
                    PRODUCTION_DIR="$2"
                    shift 2
                else
                    print_error "--production-dir requires a directory path"
                    exit 1
                fi
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --no-backup)
                CREATE_BACKUP=false
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            --version)
                echo "MP Barbosa Site - Two-Step Deployment Script v${SCRIPT_VERSION}"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                print_info "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    # Validate that at least one step is specified
    if [[ "$STEP_SOURCE_TO_STAGING" == "false" && "$STEP_STAGING_TO_PRODUCTION" == "false" ]]; then
        print_error "At least one step must be specified"
        print_info "Use --step1, --step2, or --both-steps"
        print_info "Use --help for complete usage information"
        exit 1
    fi
    
    # Main execution flow
    print_header "MP BARBOSA SITE - TWO-STEP DEPLOYMENT"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_warning "DRY RUN MODE - No changes will be made"
    fi
    
    # Execute selected steps
    if [[ "$STEP_SOURCE_TO_STAGING" == "true" ]]; then
        execute_step_1
        
        if [[ "$STEP_STAGING_TO_PRODUCTION" == "true" ]]; then
            echo ""  # Add spacing between steps
        fi
    fi
    
    if [[ "$STEP_STAGING_TO_PRODUCTION" == "true" ]]; then
        execute_step_2
    fi
    
    show_summary
    
    # Final status messages
    if [[ "$DRY_RUN" == "false" ]]; then
        if [[ "$STEP_SOURCE_TO_STAGING" == "true" && "$STEP_STAGING_TO_PRODUCTION" == "true" ]]; then
            print_success "Two-step deployment completed successfully!"
            print_info "Files deployed from source to production via public staging"
        elif [[ "$STEP_SOURCE_TO_STAGING" == "true" ]]; then
            print_success "Step 1 completed successfully!"
            print_info "Files are ready in public folder for production deployment"
        elif [[ "$STEP_STAGING_TO_PRODUCTION" == "true" ]]; then
            print_success "Step 2 completed successfully!"
            print_info "Files deployed to production web server"
        fi
    else
        if [[ "$STEP_SOURCE_TO_STAGING" == "true" && "$STEP_STAGING_TO_PRODUCTION" == "true" ]]; then
            print_info "Dry run completed for both steps. Use without --dry-run to execute"
        elif [[ "$STEP_SOURCE_TO_STAGING" == "true" ]]; then
            print_info "Dry run completed for Step 1. Use without --dry-run to execute"
        elif [[ "$STEP_STAGING_TO_PRODUCTION" == "true" ]]; then
            print_info "Dry run completed for Step 2. Use without --dry-run to execute"
        fi
    fi
}

# Run main function with all arguments
main "$@"