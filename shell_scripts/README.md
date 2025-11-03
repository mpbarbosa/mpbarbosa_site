# Shell Scripts Directory

This directory contains shell automation scripts for managing the MP Barbosa personal website project and its git submodules.

## Available Scripts

### 🔄 `pull_all_submodules.sh`
**Purpose**: Pulls the main repository and all submodules in proper hierarchical order

**Features**:
- ✅ Pulls main repository first
- ✅ Recursively fetches and updates all submodules  
- ✅ Handles nested submodules properly
- ✅ Safe stash management for local changes
- ✅ Comprehensive status verification
- ✅ Colored output for better visibility

**Usage**:
```bash
./shell_scripts/pull_all_submodules.sh           # Pull everything
./shell_scripts/pull_all_submodules.sh --help    # Show help
./shell_scripts/pull_all_submodules.sh --dry-run # Preview operations
```

**Order of Operations**:
1. Fetch and pull main repository
2. Fetch all submodules recursively
3. Update all submodules to latest remote versions
4. Verify individual submodule status
5. Initialize any missing submodules
6. Show final status summary

---

### 🚀 `push_all_submodules.sh`
**Purpose**: Pushes all modified files in proper hierarchical order (bottom-up approach)

**Features**:
- ✅ Bottom-up push strategy (deepest submodules first)
- ✅ Interactive commit message prompts
- ✅ Submodule reference updates in main repository
- ✅ Optional stash handling and commitment
- ✅ Comprehensive status verification
- ✅ Colored output for better visibility

**Usage**:
```bash
./shell_scripts/push_all_submodules.sh                  # Push all changes interactively
./shell_scripts/push_all_submodules.sh --handle-stash  # Include stashed modifications  
./shell_scripts/push_all_submodules.sh --dry-run       # Preview operations
./shell_scripts/push_all_submodules.sh --help          # Show help
```

**Push Order**:
1. Deepest nested submodules first
2. Direct submodules
3. Update main repository submodule references
4. Main repository last

---

### 🌐 `deploy_to_webserver.sh`
**Purpose**: Deploys the website to nginx web server directory for production hosting

**Features**:
- ✅ Recursive file copying with rsync (including submodules)
- ✅ Automatic backup of existing deployment
- ✅ Git submodule handling and validation
- ✅ Web server permission setting (www-data)
- ✅ nginx configuration validation
- ✅ Comprehensive deployment validation
- ✅ Colored output for better visibility

**Usage**:
```bash
sudo ./shell_scripts/deploy_to_webserver.sh             # Full deployment (recommended)
./shell_scripts/deploy_to_webserver.sh --dry-run       # Preview deployment
./shell_scripts/deploy_to_webserver.sh --no-backup     # Deploy without backup
./shell_scripts/deploy_to_webserver.sh --help          # Show help
```

**Deployment Process**:
1. Validate environment and git submodules
2. Create backup of existing deployment
3. Copy files to /var/www/mpbarbosa.com (excluding .git and shell_scripts)
4. Set proper web server permissions (www-data:www-data)
5. Validate deployment structure
6. Check nginx configuration

---

### ✅ `validate_external_links.sh`
**Purpose**: Validates that all external links follow the security policy of opening in new tabs with proper attributes

**Features**:
- ✅ Scans all HTML files across main site and submodules
- ✅ Identifies external links (http/https URLs)
- ✅ Validates `target="_blank"` attribute presence
- ✅ Validates `rel="noopener noreferrer"` security attributes
- ✅ Colored output showing compliant and non-compliant links
- ✅ Comprehensive validation summary

**Usage**:
```bash
./shell_scripts/validate_external_links.sh      # Validate all external links
```

**Validation Criteria**:
- All `<a>` tags with external URLs must have `target="_blank"`
- All external links must include `rel="noopener noreferrer"` for security
- Excludes `<link>` tags (stylesheets/fonts don't need these attributes)

**Security Note**: The `rel="noopener noreferrer"` attribute prevents tabnapping attacks and protects user privacy. See `/docs/EXTERNAL_LINKS_POLICY.md` for complete details.

---

### 🤖 `enhance_prompt.sh`
**Purpose**: Enhances user prompts using GitHub Copilot CLI for improved clarity and technical language

**Features**:
- ✅ Improves English grammar and technical terminology
- ✅ Adds relevant context and technical details
- ✅ Preserves original intent while clarifying requirements
- ✅ Optimized for software development and technical tasks
- ✅ Colored output for better readability

**Usage**:
```bash
./shell_scripts/enhance_prompt.sh "your prompt here"
./shell_scripts/enhance_prompt.sh --help    # Show help
```

**Example**:
```bash
# Original: "fix the bug in the script"
# Enhanced: "Debug and resolve the logical error in the shell script, ensuring proper error handling and exit codes"
```

---

### 🚀 `copilot_with_enhanced_prompt.sh`
**Purpose**: Executes GitHub Copilot CLI with automatically enhanced prompts for better results

**Features**:
- ✅ Automatically enhances prompts using `enhance_prompt.sh`
- ✅ Shows both original and enhanced prompts for transparency
- ✅ Interactive confirmation before execution
- ✅ Seamless integration with GitHub Copilot CLI
- ✅ Colored output with clear formatting

**Usage**:
```bash
./shell_scripts/copilot_with_enhanced_prompt.sh "your prompt here"
./shell_scripts/copilot_with_enhanced_prompt.sh --help    # Show help
```

**Workflow**:
1. User provides natural language prompt
2. Script enhances prompt for clarity and context
3. Displays both original and enhanced versions
4. Prompts for confirmation
5. Executes GitHub Copilot with enhanced prompt

**Dependencies**: Requires `enhance_prompt.sh` in the same directory

---

## Git Best Practices Integration

Both scripts follow the comprehensive git best practices established in `/docs/GIT_BEST_PRACTICES_GUIDE.md`:

### ✅ **Proper Submodule Handling**
- Hierarchical operations (respect nesting levels)
- Safe stash management during operations
- Comprehensive error handling and validation
- Clear status reporting and verification

### ✅ **Repository Safety**
- Always check git repository validity before operations
- Preserve local changes through intelligent stashing
- Provide dry-run options for operation preview
- Interactive prompts for critical operations

### ✅ **Professional Standards**
- Conventional commit message formats encouraged
- Comprehensive logging with colored output
- Detailed help documentation and examples
- Error handling with graceful exit strategies

## Project Structure Context

These scripts are designed for the MP Barbosa personal website project structure:

```
mpbarbosa_site/ (main repository)
├── shell_scripts/              # These automation scripts
│   ├── pull_all_submodules.sh  # Repository synchronization
│   ├── push_all_submodules.sh  # Repository publishing
│   ├── deploy_to_webserver.sh  # Production deployment
│   └── README.md               # This documentation
├── src/submodules/
│   ├── guia_turistico/        # Travel guide project
│   │   └── src/libs/
│   │       ├── guia_js/       # JavaScript library (nested)
│   │       └── sidra/         # IBGE data library (nested) 
│   ├── monitora_vagas/        # Job monitoring project
│   └── music_in_numbers/      # Spotify analytics project
└── docs/                      # Documentation including git best practices
```

## Usage Examples

### Daily Development Workflow
```bash
# Start of day: pull all latest changes
./shell_scripts/pull_all_submodules.sh

# Validate external links policy compliance
./shell_scripts/validate_external_links.sh

# End of day: push all changes
./shell_scripts/push_all_submodules.sh

# Handle accumulated stashes
./shell_scripts/push_all_submodules.sh --handle-stash
```

### Production Deployment Workflow
```bash
# Preview deployment (recommended first)
./shell_scripts/deploy_to_webserver.sh --dry-run

# Deploy to production web server
sudo ./shell_scripts/deploy_to_webserver.sh

# Deploy without backup (if needed)
sudo ./shell_scripts/deploy_to_webserver.sh --no-backup
```

### Safe Operation Verification
```bash
# Preview what would be pulled
./shell_scripts/pull_all_submodules.sh --dry-run

# Preview what would be pushed  
./shell_scripts/push_all_submodules.sh --dry-run
```

### Emergency Recovery
```bash
# Pull with automatic stash handling
./shell_scripts/pull_all_submodules.sh  # Automatically stashes and restores

# Check repository status after operations
git status
git submodule status --recursive
```

## Error Handling

Both scripts include comprehensive error handling:

- **Git Repository Validation**: Ensures operations only run in valid git repositories
- **Network Connectivity**: Graceful handling of network issues during fetch/push
- **Merge Conflicts**: Clear instructions for manual resolution when needed
- **Permission Issues**: Helpful error messages for access problems
- **Stash Conflicts**: Safe handling of stash pop conflicts with user guidance

## Customization

The scripts can be customized by modifying these variables at the top of each file:

```bash
# Colors for output (can be disabled by setting to empty)
RED='\033[0;31m'
GREEN='\033[0;32m'
# ... etc

# Default behavior flags
HANDLE_STASH=false  # Set to true to always handle stashes
```

## Integration with IDE/Editor

These scripts can be integrated into IDEs and editors:

### VS Code Integration
Add to `.vscode/tasks.json`:
```json
{
    "label": "Pull All Submodules",
    "type": "shell", 
    "command": "./shell_scripts/pull_all_submodules.sh",
    "group": "build"
}
```

### Command Aliases
Add to your shell profile (`.bashrc`, `.zshrc`):
```bash
alias pullall='cd /path/to/mpbarbosa_site && ./shell_scripts/pull_all_submodules.sh'
alias pushall='cd /path/to/mpbarbosa_site && ./shell_scripts/push_all_submodules.sh'
alias deploysite='cd /path/to/mpbarbosa_site && sudo ./shell_scripts/deploy_to_webserver.sh'
alias deploypreview='cd /path/to/mpbarbosa_site && ./shell_scripts/deploy_to_webserver.sh --dry-run'
```

## Contributing

When contributing to these scripts:

1. **Follow bash best practices**: Use `set -e` and `set -u` for safety
2. **Maintain color coding**: Keep the consistent color scheme for output
3. **Add comprehensive help**: Update help functions for new features
4. **Test thoroughly**: Test with various repository states and edge cases
5. **Document changes**: Update this README with new features or usage patterns

## Version History

- **v1.0.0** (October 27, 2025): Initial release with full hierarchical submodule support
- **Features**: Pull/push scripts with proper order, stash handling, comprehensive logging

---

**Author**: MP Barbosa  
**Last Updated**: October 27, 2025  
**License**: Private project scripts