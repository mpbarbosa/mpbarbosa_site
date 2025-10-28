# Scripts Directory

This directory contains automation scripts for managing the MP Barbosa personal website project and its git submodules.

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
./scripts/pull_all_submodules.sh           # Pull everything
./scripts/pull_all_submodules.sh --help    # Show help
./scripts/pull_all_submodules.sh --dry-run # Preview operations
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
./scripts/push_all_submodules.sh                  # Push all changes interactively
./scripts/push_all_submodules.sh --handle-stash  # Include stashed modifications  
./scripts/push_all_submodules.sh --dry-run       # Preview operations
./scripts/push_all_submodules.sh --help          # Show help
```

**Push Order**:
1. Deepest nested submodules first
2. Direct submodules
3. Update main repository submodule references
4. Main repository last

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
├── scripts/                    # These automation scripts
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
./scripts/pull_all_submodules.sh

# End of day: push all changes
./scripts/push_all_submodules.sh

# Handle accumulated stashes
./scripts/push_all_submodules.sh --handle-stash
```

### Safe Operation Verification
```bash
# Preview what would be pulled
./scripts/pull_all_submodules.sh --dry-run

# Preview what would be pushed  
./scripts/push_all_submodules.sh --dry-run
```

### Emergency Recovery
```bash
# Pull with automatic stash handling
./scripts/pull_all_submodules.sh  # Automatically stashes and restores

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
    "command": "./scripts/pull_all_submodules.sh",
    "group": "build"
}
```

### Command Aliases
Add to your shell profile (`.bashrc`, `.zshrc`):
```bash
alias pullall='cd /path/to/mpbarbosa_site && ./scripts/pull_all_submodules.sh'
alias pushall='cd /path/to/mpbarbosa_site && ./scripts/push_all_submodules.sh'
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