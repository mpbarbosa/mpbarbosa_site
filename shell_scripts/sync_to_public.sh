#!/bin/bash

# =============================================================================
# MP Barbosa Site - Public Folder Sync Script
# =============================================================================
# Description: Copies necessary resources from /src to /public for web serving
# Author: MP Barbosa
# Created: November 4, 2025
# Version: 1.0.0
#
# This script copies selected resources from the source directory to the public
# folder, making them ready for web server deployment and internet exposure.
# =============================================================================

set -e  # Exit on any error
set -u  # Exit on undefined variables

# =============================================================================
# CONFIGURATION
# =============================================================================

# Directory paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_DIR="$PROJECT_ROOT/src"
PUBLIC_DIR="$PROJECT_ROOT/public"

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
MP Barbosa Site - Public Folder Sync Script

USAGE:
    $0 [OPTIONS]

DESCRIPTION:
    Copies necessary resources from /src to /public folder for web serving.
    Initially copies /src/index.html and can be extended for additional resources.

OPTIONS:
    --dry-run           Preview operations without making changes
    --verbose           Show detailed output
    --no-backup         Skip creating backup of existing files
    --help              Show this help message

EXAMPLES:
    $0                          # Standard sync operation
    $0 --dry-run               # Preview what would be copied
    $0 --verbose               # Show detailed information
    $0 --no-backup --verbose   # Sync without backup, with details

DIRECTORIES:
    Source:      $SOURCE_DIR
    Public:      $PUBLIC_DIR

FILES TO SYNC:
    - index.html (main landing page)
    - robots.txt (search engine crawler instructions)
    - humans.txt (team and technology credits)
    - assets/css/ (CSS stylesheets and FontAwesome)
    - assets/js/ (JavaScript libraries and utilities)
    - assets/sass/ (SASS source files and partials)
    - assets/webfonts/ (FontAwesome web fonts)
    - images/ (Website images and graphics)
    - submodules/music_in_numbers/src/ (Music in Numbers HTML files)
    - submodules/music_in_numbers/src/scripts/ (Music in Numbers JavaScript modules)
    - submodules/music_in_numbers/src/styles/ (Music in Numbers CSS stylesheets)
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
    if [[ ! -d "$PUBLIC_DIR" ]]; then
        print_warning "Public directory not found, creating: $PUBLIC_DIR"
        if [[ "$DRY_RUN" == "false" ]]; then
            mkdir -p "$PUBLIC_DIR"
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
    local backup_path="$PUBLIC_DIR/.backups/backup_$backup_timestamp"
    
    if [[ -d "$PUBLIC_DIR" ]] && [[ "$(ls -A "$PUBLIC_DIR" 2>/dev/null)" ]]; then
        if [[ "$DRY_RUN" == "false" ]]; then
            mkdir -p "$backup_path"
            
            # Copy existing public files to backup (excluding .backups directory)
            find "$PUBLIC_DIR" -mindepth 1 -maxdepth 1 ! -name ".backups" -exec cp -r {} "$backup_path/" \;
            
            print_success "Backup created: $backup_path"
            
            # Clean up old backups (keep only last 5)
            local backup_count=$(find "$PUBLIC_DIR/.backups" -maxdepth 1 -type d -name "backup_*" | wc -l)
            if [[ $backup_count -gt 5 ]]; then
                find "$PUBLIC_DIR/.backups" -maxdepth 1 -type d -name "backup_*" | sort | head -n $((backup_count - 5)) | xargs rm -rf
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
    copy_single_file "$SOURCE_DIR/index.html" "$PUBLIC_DIR/index.html" "index.html" "true"
}

# Copy robots.txt file
copy_robots_txt() {
    print_step "Copying robots.txt"
    copy_single_file "$SOURCE_DIR/robots.txt" "$PUBLIC_DIR/robots.txt" "robots.txt" "false"
}

# Copy humans.txt file
copy_humans_txt() {
    print_step "Copying humans.txt"
    copy_single_file "$SOURCE_DIR/humans.txt" "$PUBLIC_DIR/humans.txt" "humans.txt" "false"
}

# Copy CSS assets folder
copy_css_assets() {
    print_step "Copying CSS assets"
    copy_directory "$SOURCE_DIR/assets/css" "$PUBLIC_DIR/assets/css" "CSS assets directory" "*.css" "false"
}

# Copy JavaScript assets folder
copy_js_assets() {
    print_step "Copying JavaScript assets"
    copy_directory "$SOURCE_DIR/assets/js" "$PUBLIC_DIR/assets/js" "JavaScript assets directory" "*.js" "false"
}

# Copy SASS assets folder (with enhanced verbose output for SASS structure)
copy_sass_assets() {
    print_step "Copying SASS assets"
    
    local source_dir="$SOURCE_DIR/assets/sass"
    local dest_dir="$PUBLIC_DIR/assets/sass"
    
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
    local dest_dir="$PUBLIC_DIR/assets/webfonts"
    
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
    local dest_dir="$PUBLIC_DIR/images"
    
    if [[ ! -d "$source_dir" ]]; then
        print_warning "Images directory not found in source"
        print_info "  Expected: $source_dir"
        return 0
    fi
    
    # Count all image files using proper find syntax
    local image_count=$(find "$source_dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.bmp" -o -name "*.ico" \) | wc -l)
    
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
                    local filename=$(basename "$file")
                    local filesize=$(du -h "$file" | cut -f1)
                    print_info "    - $filename ($filesize)"
                done
            elif [[ $image_count -gt 10 ]]; then
                find "$dest_dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.bmp" -o -name "*.ico" \) | head -5 | while read file; do
                    local filename=$(basename "$file")
                    local filesize=$(du -h "$file" | cut -f1)
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
                    local filename=$(basename "$file")
                    local filesize=$(du -h "$file" | cut -f1)
                    print_info "    - $filename ($filesize)"
                done
            elif [[ $image_count -gt 5 ]]; then
                find "$source_dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.bmp" -o -name "*.ico" \) | head -3 | while read file; do
                    local filename=$(basename "$file")
                    local filesize=$(du -h "$file" | cut -f1)
                    print_info "    - $filename ($filesize)"
                done
                print_info "    ... and $((image_count - 3)) more image files"
            fi
        fi
    fi
    
    return 0
}

# Copy Music in Numbers submodule files
copy_music_in_numbers_submodule() {
    print_step "Copying Music in Numbers submodule files"
    copy_specific_files "$SOURCE_DIR/submodules/music_in_numbers/src" "$PUBLIC_DIR/submodules/music_in_numbers/src" "Music in Numbers submodule" "index.html music_in_numbers.html artist.html"
}

# Copy Music in Numbers scripts folder
copy_music_in_numbers_scripts() {
    print_step "Copying Music in Numbers scripts folder"
    
    local source_dir="$SOURCE_DIR/submodules/music_in_numbers/src/scripts"
    local dest_dir="$PUBLIC_DIR/submodules/music_in_numbers/src/scripts"
    
    if [[ ! -d "$source_dir" ]]; then
        print_warning "Music in Numbers scripts directory not found in source"
        print_info "  Expected: $source_dir"
        return 0
    fi
    
    # Count all JavaScript files using proper find syntax
    local js_count=$(find "$source_dir" -type f \( -name "*.js" -o -name "*.mjs" \) | wc -l)
    local dirs_count=$(find "$source_dir" -mindepth 1 -type d | wc -l)
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Create destination directory if it doesn't exist
        mkdir -p "$dest_dir"
        
        # Copy all files and directories recursively
        cp -r "$source_dir"/* "$dest_dir/"
        print_success "Copied: Music in Numbers scripts ($js_count JavaScript files, $dirs_count subdirectories)"
        
        if [[ "$VERBOSE" == "true" ]]; then
            print_info "  Source: $source_dir"
            print_info "  Destination: $dest_dir"
            print_info "  JavaScript files: $js_count"
            print_info "  Subdirectories: $dirs_count"
            
            # Show main JavaScript files (root level)
            local main_js_files=$(find "$dest_dir" -maxdepth 1 \( -name "*.js" -o -name "*.mjs" \))
            if [[ -n "$main_js_files" ]]; then
                print_info "  Main JavaScript modules:"
                echo "$main_js_files" | head -10 | while read file; do
                    if [[ -f "$file" ]]; then
                        local filename=$(basename "$file")
                        local filesize=$(du -h "$file" | cut -f1)
                        print_info "    - $filename ($filesize)"
                    fi
                done
            fi
            
            # Show API subdirectories
            local api_dirs=$(find "$dest_dir" -mindepth 1 -maxdepth 1 -type d)
            if [[ -n "$api_dirs" ]]; then
                print_info "  API Class Architectures:"
                echo "$api_dirs" | while read dir; do
                    if [[ -d "$dir" ]]; then
                        local dirname=$(basename "$dir")
                        local files_in_dir=$(find "$dir" -name "*.js" | wc -l)
                        print_info "    - $dirname/ ($files_in_dir files)"
                    fi
                done
            fi
        fi
    else
        print_info "[DRY RUN] Would copy: $source_dir → $dest_dir"
        
        if [[ "$VERBOSE" == "true" ]]; then
            print_info "  JavaScript files to copy: $js_count"
            print_info "  Subdirectories to copy: $dirs_count"
            
            # Show preview of main files
            local main_js_files=$(find "$source_dir" -maxdepth 1 \( -name "*.js" -o -name "*.mjs" \))
            if [[ -n "$main_js_files" ]]; then
                print_info "  Main JavaScript modules to copy:"
                echo "$main_js_files" | head -5 | while read file; do
                    if [[ -f "$file" ]]; then
                        local filename=$(basename "$file")
                        local filesize=$(du -h "$file" | cut -f1)
                        print_info "    - $filename ($filesize)"
                    fi
                done
                
                local main_count=$(echo "$main_js_files" | wc -l)
                if [[ $main_count -gt 5 ]]; then
                    print_info "    ... and $((main_count - 5)) more main modules"
                fi
            fi
            
            # Show preview of API directories
            local api_dirs=$(find "$source_dir" -mindepth 1 -maxdepth 1 -type d)
            if [[ -n "$api_dirs" ]]; then
                print_info "  API architectures to copy:"
                echo "$api_dirs" | head -3 | while read dir; do
                    if [[ -d "$dir" ]]; then
                        local dirname=$(basename "$dir")
                        local files_in_dir=$(find "$dir" -name "*.js" | wc -l)
                        print_info "    - $dirname/ ($files_in_dir files)"
                    fi
                done
                
                local api_count=$(echo "$api_dirs" | wc -l)
                if [[ $api_count -gt 3 ]]; then
                    print_info "    ... and $((api_count - 3)) more API architectures"
                fi
            fi
        fi
    fi
    
    return 0
}

# Copy Music in Numbers styles folder
copy_music_in_numbers_styles() {
    print_step "Copying Music in Numbers styles folder"
    
    local source_dir="$SOURCE_DIR/submodules/music_in_numbers/src/styles"
    local dest_dir="$PUBLIC_DIR/submodules/music_in_numbers/src/styles"
    
    if [[ ! -d "$source_dir" ]]; then
        print_warning "Music in Numbers styles directory not found in source"
        print_info "  Expected: $source_dir"
        return 0
    fi
    
    # Count all CSS files using proper find syntax
    local css_count=$(find "$source_dir" -type f -name "*.css" | wc -l)
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Create destination directory if it doesn't exist
        mkdir -p "$dest_dir"
        
        # Copy all files
        cp -r "$source_dir"/* "$dest_dir/"
        print_success "Copied: Music in Numbers styles ($css_count CSS files)"
        
        if [[ "$VERBOSE" == "true" ]]; then
            print_info "  Source: $source_dir"
            print_info "  Destination: $dest_dir"
            print_info "  CSS files: $css_count"
            
            # Show detailed file information
            local css_files=$(find "$dest_dir" -maxdepth 1 -name "*.css")
            if [[ -n "$css_files" ]]; then
                print_info "  CSS files copied:"
                while IFS= read -r css_file; do
                    if [[ -f "$css_file" ]]; then
                        local filename=$(basename "$css_file")
                        local filesize=$(du -h "$css_file" | cut -f1)
                        print_info "    - $filename ($filesize)"
                    fi
                done <<< "$css_files"
            fi
        fi
    else
        print_info "[DRY RUN] Would copy: $source_dir → $dest_dir"
        
        if [[ "$VERBOSE" == "true" ]]; then
            print_info "  CSS files to copy: $css_count"
            
            # Show what files would be copied
            local css_files=$(find "$source_dir" -maxdepth 1 -name "*.css")
            if [[ -n "$css_files" ]]; then
                print_info "  CSS files to copy:"
                while IFS= read -r css_file; do
                    if [[ -f "$css_file" ]]; then
                        local filename=$(basename "$css_file")
                        local filesize=$(du -h "$css_file" | cut -f1)
                        print_info "    - $filename ($filesize)"
                    fi
                done <<< "$css_files"
            fi
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
        "$PUBLIC_DIR/index.html|index.html||true"
        "$PUBLIC_DIR/robots.txt|robots.txt||false"
        "$PUBLIC_DIR/humans.txt|humans.txt||false"
        "$PUBLIC_DIR/assets/css|CSS assets directory|*.css|false"
        "$PUBLIC_DIR/assets/js|JavaScript assets directory|*.js|false"
        "$PUBLIC_DIR/assets/sass|SASS assets directory|*.scss|false"
        "$PUBLIC_DIR/assets/webfonts|Webfonts directory|font_files|false"
        "$PUBLIC_DIR/images|Images directory|image_files|false"
        "$PUBLIC_DIR/submodules/music_in_numbers/src|Music in Numbers submodule|*.html|false"
        "$PUBLIC_DIR/submodules/music_in_numbers/src/scripts|Music in Numbers scripts|js_files|false"
        "$PUBLIC_DIR/submodules/music_in_numbers/src/styles|Music in Numbers styles|*.css|false"
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
    if [[ "$VERBOSE" == "true" && -d "$PUBLIC_DIR/assets/sass" ]]; then
        local partial_count=$(find "$PUBLIC_DIR/assets/sass" -name "_*.scss" | wc -l)
        if [[ $partial_count -gt 0 ]]; then
            print_info "  SASS partial files: $partial_count"
        fi
    fi
    
    # Add specific verbose information for Music in Numbers files if needed
    if [[ "$VERBOSE" == "true" && -d "$PUBLIC_DIR/submodules/music_in_numbers/src" ]]; then
        for file in "index.html" "music_in_numbers.html"; do
            if [[ -f "$PUBLIC_DIR/submodules/music_in_numbers/src/$file" ]]; then
                local file_size=$(du -h "$PUBLIC_DIR/submodules/music_in_numbers/src/$file" | cut -f1)
                print_info "    - $file ($file_size)"
            fi
        done
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
    print_header "SYNC SUMMARY"
    
    echo -e "${WHITE}Project:${NC}     MP Barbosa Personal Website"
    echo -e "${WHITE}Source:${NC}      $SOURCE_DIR"
    echo -e "${WHITE}Public:${NC}      $PUBLIC_DIR"
    echo -e "${WHITE}Operation:${NC}   $(if [[ "$DRY_RUN" == "true" ]]; then echo "DRY RUN (preview only)"; else echo "SYNC COMPLETED"; fi)"
    echo ""
    
    if [[ "$DRY_RUN" == "false" ]]; then
        echo -e "${WHITE}Files Synchronized:${NC}"
        echo -e "  ✓ index.html"
        if [[ -f "$PUBLIC_DIR/robots.txt" ]]; then
            echo -e "  ✓ robots.txt"
        fi
        if [[ -f "$PUBLIC_DIR/humans.txt" ]]; then
            echo -e "  ✓ humans.txt"
        fi
        if [[ -d "$PUBLIC_DIR/assets/css" ]]; then
            local css_count=$(find "$PUBLIC_DIR/assets/css" -name "*.css" | wc -l)
            echo -e "  ✓ CSS assets ($css_count files)"
        fi
        if [[ -d "$PUBLIC_DIR/assets/js" ]]; then
            local js_count=$(find "$PUBLIC_DIR/assets/js" -name "*.js" | wc -l)
            echo -e "  ✓ JavaScript assets ($js_count files)"
        fi
        if [[ -d "$PUBLIC_DIR/assets/sass" ]]; then
            local sass_count=$(find "$PUBLIC_DIR/assets/sass" -name "*.scss" | wc -l)
            echo -e "  ✓ SASS assets ($sass_count files)"
        fi
        if [[ -d "$PUBLIC_DIR/assets/webfonts" ]]; then
            local font_count=$(find "$PUBLIC_DIR/assets/webfonts" -type f \( -name "*.eot" -o -name "*.svg" -o -name "*.ttf" -o -name "*.woff" -o -name "*.woff2" -o -name "*.otf" \) | wc -l)
            echo -e "  ✓ Webfonts ($font_count files)"
        fi
        if [[ -d "$PUBLIC_DIR/images" ]]; then
            local image_count=$(find "$PUBLIC_DIR/images" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.bmp" -o -name "*.ico" \) | wc -l)
            echo -e "  ✓ Images ($image_count files)"
        fi
        if [[ -d "$PUBLIC_DIR/submodules/music_in_numbers/src" ]]; then
            local html_count=$(find "$PUBLIC_DIR/submodules/music_in_numbers/src" -maxdepth 1 -name "*.html" | wc -l)
            echo -e "  ✓ Music in Numbers submodule ($html_count HTML files)"
        fi
        if [[ -d "$PUBLIC_DIR/submodules/music_in_numbers/src/scripts" ]]; then
            local js_count=$(find "$PUBLIC_DIR/submodules/music_in_numbers/src/scripts" -type f \( -name "*.js" -o -name "*.mjs" \) | wc -l)
            local dirs_count=$(find "$PUBLIC_DIR/submodules/music_in_numbers/src/scripts" -mindepth 1 -type d | wc -l)
            echo -e "  ✓ Music in Numbers scripts ($js_count JS files, $dirs_count API architectures)"
        fi
        echo ""
        
        echo -e "${WHITE}Public Folder Contents:${NC}"
        if command -v tree >/dev/null 2>&1; then
            tree "$PUBLIC_DIR" -a -I ".backups"
        else
            find "$PUBLIC_DIR" -not -path "*/.backups/*" -type f | sort | sed 's|^'"$PUBLIC_DIR"'||' | sed 's|^/||'
        fi
    else
        echo -e "${WHITE}Preview Mode:${NC} Use without --dry-run to perform actual sync"
    fi
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
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
            *)
                print_error "Unknown option: $1"
                print_info "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    # Main execution flow
    print_header "MP BARBOSA SITE - PUBLIC FOLDER SYNC"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_warning "DRY RUN MODE - No changes will be made"
    fi
    
    validate_environment
    create_backup
    copy_index_html
    copy_robots_txt
    copy_humans_txt
    copy_css_assets
    copy_js_assets
    copy_sass_assets
    copy_webfonts
    copy_images
    copy_music_in_numbers_submodule
    copy_music_in_numbers_scripts
    copy_music_in_numbers_styles
    copy_additional_resources
    
    if [[ "$DRY_RUN" == "false" ]]; then
        validate_sync
    fi
    
    show_summary
    
    if [[ "$DRY_RUN" == "false" ]]; then
        print_success "Public folder sync completed successfully!"
        print_info "Files are ready for web server deployment"
    else
        print_info "Dry run completed. Use without --dry-run to perform actual sync"
    fi
}

# Run main function with all arguments
main "$@"