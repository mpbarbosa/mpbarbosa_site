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
- Dedicated `/shell_scripts/workflow/logs/` directory for AI session logs and execution traces
- Reduced AI invocations with strategic Copilot CLI usage
- Enhanced logging with PID tracking for multi-instance support

**Output Directories**:
- `/shell_scripts/workflow/logs/` - Raw execution traces and AI session logs (NEW in v1.5.0)
- `/shell_scripts/workflow/backlog/` - Detailed issue reports (introduced in v1.3.0)
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

### Version 2.1.0 (Current)
**Release Date**: December 25, 2025

**Architecture Migration - Sibling Projects**:
- ✅ **Complete migration from submodules to sibling projects** (all projects moved to top level of public/)
- ✅ Busca Vagas moved from `public/submodules/busca_vagas/` to `public/busca_vagas/`
- ✅ Guia Turístico moved from `public/submodules/guia_js/` to `public/guia_js/`
- ✅ Music in Numbers moved from `public/submodules/music_in_numbers/` to `public/music_in_numbers/`
- ✅ Monitora Vagas continues at `public/monitora_vagas/` (already migrated)
- ✅ **Removed `public/submodules/` directory entirely** - Clean architecture achieved
- ✅ Updated all deployment functions (`copy_busca_vagas_project`, `copy_guia_js_project`, `copy_music_in_numbers_project`)
- ✅ All projects now deploy to consistent top-level structure
- ✅ Terminology standardization: "sibling projects" vs deprecated "git submodules"

**Documentation Updates**:
- Updated deployment architecture diagrams
- Removed legacy "submodules" terminology from comments
- Added migration notes to BUSCA_VAGAS_RESTRUCTURING.md, GUIA_TURISTICO_RESTRUCTURING.md, MUSIC_IN_NUMBERS_RESTRUCTURING_COMPLETE.md
- See [docs/TERMINOLOGY_STANDARDIZATION.md](../docs/TERMINOLOGY_STANDARDIZATION.md) for complete architecture guide

**Breaking Changes**:
- URL structure changed: `/submodules/{project}/` → `/{project}/`
- Nginx redirects recommended for backward compatibility:
  ```nginx
  location ~ ^/submodules/(.*)$ {
      return 301 /$1;
  }
  ```

### Version 2.0.0
**Release Date**: November 9, 2025

**Features**:
- ✅ Two-step deployment architecture (Source → Public → Production)
- ✅ Parametrized step control (--step1, --step2, --both-steps)
- ✅ Flexible production directory configuration (default: /var/www/html)
- ✅ Sibling projects deployment (Music in Numbers, Guia Turístico, Busca Vagas, Monitora Vagas)
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
- Sibling project validation (checks project root)
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

## `pull_all_submodules.sh` (DEPRECATED)

**Status**: ⚠️ DEPRECATED as of December 25, 2025
**Reason**: Project migrated from git submodules to sibling project architecture

### Migration Note
This script is no longer needed. Sibling projects are now managed independently:

```bash
# Old way (deprecated)
./shell_scripts/pull_all_submodules.sh

# New way (use standard git commands in each project)
cd ../music_in_numbers && git pull
cd ../guia_js && git pull
cd ../monitora_vagas && git pull
cd ../busca_vagas && git pull
```

See [docs/development-guides/GIT_BEST_PRACTICES_GUIDE.md](../docs/development-guides/GIT_BEST_PRACTICES_GUIDE.md) for sibling project management.

### Historical Features (Prior to Deprecation)
**Features**:
- Hierarchical submodule updates (bottom-up)
- Dry-run mode
- Comprehensive error handling
- Progress reporting

---

## `push_all_submodules.sh` (DEPRECATED)

**Status**: ⚠️ DEPRECATED as of December 25, 2025
**Reason**: Project migrated from git submodules to sibling project architecture

### Migration Note
This script is no longer needed. Sibling projects are now managed independently:

```bash
# Old way (deprecated)
./shell_scripts/push_all_submodules.sh

# New way (use standard git commands in each project)
cd ../music_in_numbers && git push
cd ../guia_js && git push
cd ../monitora_vagas && git push
cd ../busca_vagas && git push
```

See [docs/development-guides/GIT_BEST_PRACTICES_GUIDE.md](../docs/development-guides/GIT_BEST_PRACTICES_GUIDE.md) for sibling project management.

### Historical Features (Prior to Deprecation)
**Features**:
- Hierarchical submodule deployment (bottom-up)
- Stash handling (--handle-stash)
- Dry-run mode
- Safety checks and confirmations

---

## Monitora Vagas Project Updates

### December 25, 2025 - Direct Fetch API Integration
**Recent Enhancements**:
- ✅ Replaced API client service layer with direct fetch implementation
- ✅ Added interactive hotel selection dropdown with dynamic population
- ✅ Implemented form submission with comprehensive validation
- ✅ Added Brazilian date format support (dd/mm/yyyy → ISO 8601 conversion)
- ✅ Enhanced error handling with AbortController for timeout management
- ✅ Added loading states and user feedback during API calls
- ✅ Implemented result display with success/error alerts

**Architecture Improvements**:
- Simplified architecture by removing intermediate API client layer
- Direct fetch calls with native error handling
- Timeout management: 600s for weekend search, configurable for other operations
- Comprehensive try-catch error handling with user-friendly messages
- Visual feedback with disabled buttons during async operations

**Component Updates**:
- `index.html`: Full form submission implementation with hotel selection
- `QuickSearch.js`: Direct fetch integration replacing apiClient dependency
- `api-test.html`: Enhanced testing interface with updated endpoints

**API Integration**:
- `/api/vagas/hoteis` - Dynamic hotel list fetching
- `/api/vagas/search?checkin=...&checkout=...` - Vacancy search with date parameters
- `/api/vagas/search/weekends?count=N` - Multi-weekend search automation

### November 27, 2025 - Hotel Selection API
**Features Added** (Commit 2ec947c):
- ✅ Hotel selection API endpoint integration
- ✅ Guest counter functionality
- ✅ Enhanced UI components for hotel search

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

**Last Updated**: December 25, 2025
