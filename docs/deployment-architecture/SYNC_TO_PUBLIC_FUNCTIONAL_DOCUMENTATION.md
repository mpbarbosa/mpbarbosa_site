# 📋 Sync to Public - Functional Documentation

**Script:** `shell_scripts/sync_to_public.sh`  
**Version:** 2.0.0  
**Author:** MP Barbosa  
**Created:** November 4, 2025  
**Updated:** November 4, 2025 (Two-Step Deployment Architecture)  
**Purpose:** Website deployment preparation and asset synchronization

---

## 📖 Overview

The `sync_to_public.sh` script is a comprehensive asset synchronization tool designed for the MP Barbosa Personal Website project. Version 2.0.0 introduces the **Two-Step Deployment Architecture** featuring parametrized step control and flexible production directory configuration. It automates the process of copying selected resources from the development source directory (`/src`) to a public deployment directory (`/public`), with optional second-step deployment to production web servers, making them ready for internet exposure.

### 🎯 Primary Functions

1. **Asset Synchronization**: Copies HTML, CSS, JavaScript, and other web assets
2. **Deployment Preparation**: Organizes files for production web server deployment
3. **Backup Management**: Creates and maintains backups of existing public files
4. **Validation**: Ensures all copied files are correctly synchronized
5. **User Feedback**: Provides detailed progress reporting and operation summaries

---

## 🏗️ Script Architecture

### Core Design Principles
- **Modular Design**: Reusable generic functions with specific implementations
- **Error Handling**: Comprehensive error detection and graceful failure management
- **User Experience**: Colored output, progress indicators, and detailed feedback
- **Safety Features**: Dry-run capability and automatic backup creation
- **Extensibility**: Framework ready for easy addition of new asset types

### Architectural Layers
```
┌─────────────────────────────────────┐
│           USER INTERFACE            │
│     (Command-line arguments,        │
│      colored output, help)          │
├─────────────────────────────────────┤
│        SPECIFIC FUNCTIONS           │
│   (copy_index_html, copy_css_       │
│    assets, copy_sass_assets)        │
├─────────────────────────────────────┤
│        GENERIC FUNCTIONS            │
│  (copy_single_file, copy_directory, │
│   copy_specific_files, validate)    │
├─────────────────────────────────────┤
│         CORE UTILITIES              │
│    (print functions, validation,    │
│     backup management)              │
└─────────────────────────────────────┘
```

---

## 🚀 Functional Capabilities

### 1. Asset Type Management

#### **HTML Files**
- **index.html**: Main landing page (required)
- **robots.txt**: Search engine crawler instructions (optional)
- **humans.txt**: Team and technology credits (optional)

#### **Stylesheet Assets**
- **CSS Directory**: Complete `assets/css/` folder with all stylesheets
- **SASS Directory**: Complete `assets/sass/` folder with source files and partials
- **Enhanced SASS Support**: Detailed analysis of partial files and directory structure

#### **JavaScript Assets**
- **JS Directory**: Complete `assets/js/` folder with libraries and utilities
- **Module Support**: Handles both traditional and ES6 module structures

#### **Submodule Integration**
- **Music in Numbers**: Complete HTML, JavaScript modules, and CSS stylesheets
- **Monitora Vagas v2.0.0**: Dual-directory vanilla JavaScript application:
  - **src/ folder**: Legacy implementation (backward compatibility)
  - **public/ folder**: Modern architecture with:
    - Configuration layer (app.js, constants.js, environment.js, index.js)
    - BuscaVagasAPIClient class with fetch API and timeout handling
    - Modular CSS (global/, components/, pages/)
    - Archived UI versions (api-test.html, index-md3*.html)
    - Service worker (sw.js) for PWA support
    - Vendor libraries (jQuery, datepicker, Select2, Font Awesome 4.7, MDI Font)
    - Symlink resolution with cp -rL flag
- **Guia Turístico**: Travel guide application assets
- **Submodule Structure**: Maintains proper directory hierarchy for all subprojects

### 2. Operation Modes

#### **Standard Mode** (Default)
```bash
./sync_to_public.sh
```
- Performs actual file copying
- Creates backups automatically
- Validates all operations
- Provides standard progress feedback

#### **Dry Run Mode**
```bash
./sync_to_public.sh --dry-run
```
- Previews operations without making changes
- Shows what would be copied
- Validates source files existence
- Perfect for testing and planning

#### **Verbose Mode**
```bash
./sync_to_public.sh --verbose
```
- Detailed file information (sizes, paths, timestamps)
- Enhanced progress reporting
- File counting and listing
- SASS structure analysis

#### **No-Backup Mode**
```bash
./sync_to_public.sh --no-backup
```
- Skips backup creation for faster operations
- Useful for clean environments or temporary testing

### 3. Safety and Backup Features

#### **Automatic Backup System**
- **Timestamp-based**: Creates unique backup directories (`backup_YYYYMMDD_HHMMSS`)
- **Retention Management**: Automatically keeps only the last 5 backups
- **Selective Backup**: Excludes `.backups` directory from backup operations
- **Recovery Ready**: Complete file structure preservation for easy restoration

#### **Environment Validation**
- **Project Recognition**: Validates MP Barbosa site project structure
- **Directory Existence**: Verifies source directory availability
- **Path Resolution**: Dynamic path calculation from script location
- **Permission Checks**: Ensures write access to destination directories

---

## 📊 File Processing Workflow

### 1. Initialization Phase
```
Start → Parse Arguments → Validate Environment → Create Backup
```

### 2. Asset Copying Phase
```
Copy HTML Files → Copy CSS Assets → Copy JS Assets → 
Copy SASS Assets → Copy Submodules → Additional Resources
```

### 3. Validation Phase
```
Validate Files → Generate Summary → Display Results
```

### 4. Completion Phase
```
Status Report → Success/Error Messages → Exit
```

---

## 🎨 User Experience Features

### Visual Feedback System
- **🔵 Headers**: Section separators and major operations
- **🟢 Success**: Completed operations and validations
- **🟡 Warnings**: Optional files not found or minor issues
- **🔴 Errors**: Critical failures requiring attention
- **🟣 Steps**: Current operation progress indicators
- **🔵 Info**: Detailed information and file paths

### Output Examples

#### Standard Operation
```
================================
MP BARBOSA SITE - PUBLIC FOLDER SYNC
================================
▶ Validating environment
✓ Environment validation complete
▶ Creating backup of existing public files
✓ Backup created: /path/to/public/.backups/backup_20251104_143022
▶ Copying index.html
✓ Copied: index.html
```

#### Verbose Mode Additional Details
```
▶ Copying CSS assets
✓ Copied: CSS assets directory
ℹ   Source: /path/to/src/assets/css
ℹ   Destination: /path/to/public/assets/css
ℹ   Files copied: 8
ℹ     - main.css (24K)
ℹ     - bootstrap.min.css (142K)
ℹ     - fontawesome.min.css (58K)
```

---

## 🔧 Configuration and Customization

### Script Configuration Variables
```bash
SOURCE_DIR="$PROJECT_ROOT/src"          # Source files location
PUBLIC_DIR="$PROJECT_ROOT/public"       # Destination directory
DRY_RUN=false                          # Preview mode toggle
VERBOSE=false                          # Detailed output toggle
CREATE_BACKUP=true                     # Backup creation toggle
```

### Extensibility Framework

#### Adding New Asset Types
The script provides a structured approach for adding new file types:

```bash
# Example: Adding image assets
copy_image_assets() {
    print_step "Copying image assets"
    copy_directory "$SOURCE_DIR/assets/images" "$PUBLIC_DIR/assets/images" "Image assets directory" "*.{jpg,png,gif,svg}" "false"
}
```

#### Adding New Submodules
```bash
# Example: Adding another submodule
copy_other_submodule() {
    print_step "Copying Other Submodule files"
    copy_specific_files "$SOURCE_DIR/submodules/other_project/src" "$PUBLIC_DIR/submodules/other_project/src" "Other Project submodule" "index.html about.html"
}
```

---

## 📋 Command-Line Interface

### Syntax
```bash
./sync_to_public.sh [OPTIONS]
```

### Available Options
| Option | Description | Default |
|--------|-------------|---------|
| `--dry-run` | Preview operations without making changes | `false` |
| `--verbose` | Show detailed output including file sizes and paths | `false` |
| `--no-backup` | Skip creating backup of existing files | `false` (backups enabled) |
| `--step1` | Execute only Step 1 (Source → Public staging) | `false` |
| `--step2` | Execute only Step 2 (Public → Production deployment) | `false` |
| `--both-steps` | Execute both steps sequentially | `false` |
| `--production-dir` | Specify production directory path for Step 2 | `/var/www/html` |
| `--help` | Show help message and usage examples | N/A |

### Usage Examples

#### Basic Operations
```bash
# Standard sync operation (legacy - both steps)
./sync_to_public.sh

# Preview what would be copied
./sync_to_public.sh --dry-run

# Detailed operation with file information
./sync_to_public.sh --verbose

# Fast sync without backup
./sync_to_public.sh --no-backup
```

#### Two-Step Deployment Architecture (v2.0.0)
```bash
# Step 1: Source → Public (staging)
./sync_to_public.sh --step1 --verbose

# Step 2: Public → Production (deployment) 
./sync_to_public.sh --step2 --production-dir /var/www/html

# Combined deployment (both steps)
./sync_to_public.sh --both-steps

# Custom production directory
./sync_to_public.sh --step2 --production-dir /custom/web/root
```

#### Combined Options
```bash
# Preview with detailed information
./sync_to_public.sh --dry-run --verbose

# Fast detailed sync
./sync_to_public.sh --no-backup --verbose

# Help and documentation
./sync_to_public.sh --help
```

---

## 🔍 Validation and Quality Assurance

### File Validation System
The script includes comprehensive validation to ensure operation success:

#### **Required Files Validation**
- **index.html**: Must exist in source directory (deployment critical)
- **Exit on Failure**: Script terminates if required files are missing

#### **Optional Files Validation**
- **robots.txt, humans.txt**: Warned if missing but operation continues
- **Asset Directories**: Proceeds with warning if directories don't exist

#### **Post-Copy Validation**
- **File Existence**: Verifies all copied files are present in destination
- **Directory Structure**: Confirms proper directory hierarchy
- **File Counting**: Validates expected number of files in each category

### Error Handling Strategy
- **Early Detection**: Environment validation prevents common failures
- **Graceful Degradation**: Optional components don't block essential operations
- **Clear Error Messages**: Specific information about what went wrong
- **Recovery Guidance**: Suggestions for resolving common issues

---

## 📈 Performance and Efficiency

### Optimization Features
- **Generic Functions**: Eliminates code duplication (50% reduction in copy functions)
- **Conditional Processing**: Skip operations for non-existent optional resources
- **Efficient File Operations**: Uses system `cp` command for reliable copying
- **Selective Validation**: Only validates files that were attempted to be copied

### Resource Management
- **Memory Efficiency**: Minimal memory footprint using shell built-ins
- **Disk Space**: Automatic backup cleanup prevents storage bloat
- **Processing Speed**: Parallel-ready design for future enhancements

---

## 🛠️ Maintenance and Support

### Maintenance Tasks
1. **Regular Testing**: Verify script function with `--dry-run` before important deployments
2. **Backup Monitoring**: Periodically check backup directory size and cleanup
3. **Extension Updates**: Add new asset types as project requirements evolve
4. **Path Validation**: Ensure script works correctly when project structure changes

### Troubleshooting Common Issues

#### **"Not in MP Barbosa site project directory"**
- **Cause**: Script run from incorrect location
- **Solution**: Navigate to project root directory before running script

#### **"Source directory not found"**
- **Cause**: Missing `/src` directory in project
- **Solution**: Verify project structure and source directory location

#### **Permission Errors**
- **Cause**: Insufficient write permissions to destination directory
- **Solution**: Check directory permissions or run with appropriate privileges

#### **Files Not Copying**
- **Cause**: Source files may be missing or have permission issues
- **Solution**: Use `--verbose` mode to identify specific problematic files

---

## 🎯 Best Practices

### Recommended Usage Patterns

#### **Before Major Deployments**
```bash
# 1. Preview changes first
./sync_to_public.sh --dry-run --verbose

# 2. Perform actual sync with detailed output
./sync_to_public.sh --verbose
```

#### **Development Workflow**
```bash
# Quick sync during development (with backup safety)
./sync_to_public.sh

# Fast iteration without backups (development only)
./sync_to_public.sh --no-backup
```

#### **Production Deployments**
```bash
# Always use standard mode with backups for production
./sync_to_public.sh --verbose
```

### Integration with Deployment Pipeline
- **Pre-deployment Step**: Run sync script before web server deployment
- **CI/CD Integration**: Include script in automated deployment workflows
- **Version Control**: Sync script changes should be committed with related asset updates

---

## 📝 Summary

The `sync_to_public.sh` script provides a **professional-grade asset synchronization solution** for the MP Barbosa Personal Website project. With its **modular architecture**, **comprehensive safety features**, and **extensible design**, it serves as both a reliable deployment tool and a foundation for future expansion.

### Key Strengths
- ✅ **Reliability**: Comprehensive error handling and validation
- ✅ **Safety**: Automatic backups and dry-run capability
- ✅ **Usability**: Clear feedback and intuitive command-line interface
- ✅ **Maintainability**: Clean, documented, and modular code structure
- ✅ **Extensibility**: Easy to add new asset types and functionality

### Ideal Use Cases
- **Development to Production**: Preparing assets for web server deployment
- **Asset Management**: Organizing and synchronizing website resources
- **Deployment Automation**: Integration with automated deployment pipelines
- **Backup and Recovery**: Maintaining deployment history and rollback capability

This script represents a **mature, production-ready tool** that effectively bridges the gap between development assets and deployment-ready web content.

---

**Last Updated**: November 4, 2025  
**Documentation Status**: Complete  
**Script Version**: 1.0.0