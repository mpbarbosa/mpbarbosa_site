# Shell Scripts Changelog

This document tracks version history and changes for shell scripts in the mpbarbosa_site project.

---

## `execute_tests_docs_workflow.sh`

### Version 1.5.0 (Current)
**Release Date**: November 9, 2025

**Features**:
- ✅ 13-step comprehensive workflow automation
- ✅ AI-powered analysis with GitHub Copilot CLI integration
- ✅ 11 specialized AI personas for domain-specific tasks
- ✅ Two-phase validation architecture (Automated + AI-powered)
- ✅ Conventional commit message generation with git context
- ✅ Smart triggering modes: Auto, Interactive, Dry-run
- ✅ Progress tracking and workflow state management
- ✅ Comprehensive error handling with colored output
- ✅ Graceful Copilot CLI degradation with fallbacks

**Architecture**:
- Professional persona selection strategy for AI tasks
- Modern Copilot CLI integration with copy-paste workflow
- Copy-paste friendly AI interaction patterns
- Context-aware prompts with repository analysis

**Performance Optimization (NEW in v1.5.0)**:
- Git state caching for 40% reduction in git command executions
- Dedicated `/logs/` directory for AI session logs and execution traces
- Reduced AI invocations with strategic Copilot CLI usage
- Enhanced logging with PID tracking for multi-instance support

**Output Directories**:
- `/logs/` - Raw execution traces and AI session logs (NEW in v1.5.0)
- `/backlog/` - Detailed issue reports (introduced in v1.3.0)
- `/summaries/` - High-level conclusions (introduced in v1.4.0)

### Version 1.4.0
**Release Date**: November 6, 2025

**Changes from v1.3.0**:
- ✅ Added `/summaries/` directory for quick-reference conclusions
- ✅ Enhanced AI persona specialization with 11 domain experts
- ✅ Improved Copilot CLI integration patterns
- ✅ Refined two-phase validation checks
- ✅ Better error messages and user guidance
- ✅ Summary files with ✅/⚠️/❌ status indicators

**Output Enhancement**:
- Summary generation for all 13 workflow steps
- 2-3 sentence conclusions for rapid review
- Status indicators for quick scanning

### Version 1.3.0
**Release Date**: November 5, 2025

**Changes from v1.2.0**:
- ✅ Added `/backlog/` directory for detailed issue tracking
- ✅ Graceful Copilot CLI detection and fallbacks
- ✅ Improved interactive mode UX
- ✅ Enhanced dry-run mode output
- ✅ Refined conventional commit message templates
- ✅ Comprehensive issue reports per workflow step

**Output Enhancement**:
- Backlog tracking system with detailed findings
- File/line references for all issues
- Raw validation tool output preservation

### Version 1.2.0
**Initial Documented Release**

**Core Features**:
- 13-step workflow implementation
- Basic GitHub Copilot CLI integration
- Auto/Interactive/Dry-run modes
- Progress tracking system
- Conventional commit support

---

## `sync_to_public.sh`

### Version 2.0.0 (Current)
**Release Date**: November 9, 2025

**Features**:
- ✅ Two-step deployment architecture (Source → Public → Production)
- ✅ Parametrized step control (--step1, --step2, --both-steps)
- ✅ Flexible production directory configuration (default: /var/www/html)
- ✅ Music in Numbers submodule support with complete module architecture
- ✅ Enhanced backup system for both public and production directories
- ✅ Production environment validation with permission checks
- ✅ Comprehensive error handling with colored output
- ✅ Dry-run mode for safe operation preview
- ✅ Proper web server permissions (755 dirs, 644 files)
- ✅ **Comprehensive test coverage** (849-line Jest test suite, 53 tests, 52/53 passing - 98.1%)
- ✅ **Version tracking** with SCRIPT_VERSION variable (v2.0.0)
- ✅ **--version option** for quick version display

**Architecture**:
- Step 1: Source → Public (staging)
- Step 2: Public → Production (deployment)
- Combined: Both steps in one command

**Test Coverage** (Added November 9, 2025):
- 849 lines of comprehensive Jest tests in `src/__tests__/shell_scripts.test.js`
- 53 tests total, 52/53 passing (98.1% success rate)
- Test categories: Structure (3), Content (15), Functionality (18), Dry-run (2), Integration (15)
- Tests cover: script structure, configuration, utility functions, copy operations, step control, error handling

**Version Tracking** (Added November 9, 2025):
- SCRIPT_VERSION variable for programmatic access
- --version command-line option
- Version displayed in help header
- Consistent with other shell scripts (execute_tests_docs_workflow.sh)

---

## `deploy_to_webserver.sh` (Legacy)

### Version 2.0.0 (Current)
**Release Date**: November 9, 2025
**Status**: Legacy script, use `sync_to_public.sh --both-steps` for modern deployments

**Purpose**: Direct deployment to nginx production directory

**Requirements**: 
- Must run `sync_to_public.sh --step1` first to prepare files
- Requires sudo for web server directory access
- Uses /public directory as source (changed in v2.0.0)

**Features**:
- Production deployment from /public to /var/www/mpbarbosa.com
- Backup system with timestamp-based versioning
- Permission management (755/644) with www-data ownership
- Dry-run mode for safe preview
- Git submodule validation (checks project root)
- **Comprehensive test coverage** (849-line shared Jest test suite, 53 tests, 52/53 passing - 98.1%)

**Architecture Changes (v2.0.0)**:
- SOURCE_DIR changed from `PROJECT_ROOT` to `PROJECT_ROOT/public`
- Git validation checks project root instead of source directory
- Public directory existence validation before deployment
- Simplified rsync operations (no exclusions, all files pre-staged)
- Path updates for new public directory structure

**Test Coverage** (Shared with sync_to_public.sh):
- Covered by comprehensive Jest tests in `src/__tests__/shell_scripts.test.js`
- Tests validate: script structure, deployment flow, permission management, backup functionality

---

## `pull_all_submodules.sh`

### Current Version
**Features**:
- Hierarchical submodule updates (bottom-up)
- Dry-run mode
- Comprehensive error handling
- Progress reporting

---

## `push_all_submodules.sh`

### Current Version
**Features**:
- Hierarchical submodule deployment (bottom-up)
- Stash handling (--handle-stash)
- Dry-run mode
- Safety checks and confirmations

---

## Version Control Best Practices

### Semantic Versioning
All scripts follow semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking changes or architectural redesigns
- **MINOR**: New features, non-breaking enhancements
- **PATCH**: Bug fixes, documentation updates

### Update Process
When updating a script version:
1. Update VERSION variable in the script file
2. Update references in `shell_scripts/README.md`
3. Update references in `.github/copilot-instructions.md`
4. Document changes in this CHANGELOG.md
5. Test thoroughly before committing

### Documentation Sync
All version references must be synchronized across:
- Script file itself (VERSION variable)
- `shell_scripts/README.md` (script headers)
- `.github/copilot-instructions.md` (usage examples)
- This CHANGELOG.md (version history)

---

**Last Updated**: November 9, 2025
