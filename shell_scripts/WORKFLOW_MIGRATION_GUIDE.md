# Workflow Migration Guide

**Script:** `migrate_workflow_to_ai_workflow.sh`  
**Version:** 1.1.8  
**Date:** December 18, 2025  
**Purpose:** Migrate workflow automation to dedicated ai_workflow repository

---

## Overview

The workflow automation system has grown significantly in importance, relevance, and complexity. This migration script transfers all workflow-related files from the mpbarbosa_site repository to a new dedicated `ai_workflow` repository.

### Rationale for Migration

**Complexity Growth:**

- 29 modules (16 libraries + 13 steps)
- 8,264 lines of production code
- 37 comprehensive tests
- Extensive documentation (23 files, 364KB)

**Benefits of Separation:**

- Dedicated version control and release management
- Focused development and testing
- Independent deployment cycles
- Clear separation of concerns
- Easier collaboration and contributions

---

## What Gets Migrated

### Documentation Files

**Source:** `docs/workflow-automation/`  
**Target:** `ai_workflow/docs/workflow-automation/`  
**Count:** 23 markdown files (364KB)

Key files:

- COMPREHENSIVE_WORKFLOW_EXECUTION_ANALYSIS.md
- SHORT_TERM_ENHANCEMENTS_COMPLETION.md
- WORKFLOW_AUTOMATION_VERSION_EVOLUTION.md
- All phase completion reports
- All functional requirements
- All implementation guides

### Script Files

**Source:** `shell_scripts/workflow/`  
**Target:** `ai_workflow/shell_scripts/workflow/`  
**Count:** 225 files (14MB)

Includes:

- Main orchestrator: `execute_tests_docs_workflow.sh`
- 16 library modules in `lib/`
- 13 step modules in `steps/`
- Test suites and utilities
- Configuration files (YAML, etc.)
- Supporting documentation

---

## Migration Process

### Phase 1: Pre-Migration

1. **Backup Creation**
   - Automatic backup to `backups/workflow_migration_YYYYMMDD_HHMMSS/`
   - Includes both documentation and scripts
   - Creates backup metadata file

2. **Validation**
   - Verifies source project structure
   - Checks target repository (creates if needed)
   - Analyzes files to migrate

### Phase 2: Migration

1. **Target Preparation**
   - Creates `ai_workflow/` directory (if needed)
   - Initializes git repository (if needed)
   - Creates directory structure (if needed)

2. **File Transfer**
   - Copies documentation with rsync
   - Copies scripts with rsync
   - Preserves file permissions
   - Makes scripts executable

3. **Repository Setup**
   - Creates MIGRATION_README.md
   - Creates .gitignore
   - Creates .github folder
   - Creates initial commit

### Phase 3: Verification

1. **File Validation**
   - Counts migrated files
   - Verifies key files exist
   - Checks directory structure

2. **Summary Generation**
   - Creates migration log
   - Generates summary report
   - Provides next steps

---

## Usage

### Preview Migration (Dry Run)

```bash
cd /home/mpb/Documents/GitHub/mpbarbosa_site/shell_scripts
./migrate_workflow_to_ai_workflow.sh --dry-run
```

**What happens:**

- Shows files that would be migrated
- Displays target structure
- No actual changes made
- Safe to run multiple times

### Execute Migration

```bash
cd /home/mpb/Documents/GitHub/mpbarbosa_site/shell_scripts
./migrate_workflow_to_ai_workflow.sh
```

**What happens:**

- Creates backup
- Migrates all files
- Sets up git repository
- Creates initial commit
- Generates summary

### Command Options

```bash
# Show help
./migrate_workflow_to_ai_workflow.sh --help

# Show version
./migrate_workflow_to_ai_workflow.sh --version

# Dry run mode
./migrate_workflow_to_ai_workflow.sh --dry-run
```

---

## Post-Migration Steps

### 1. Verify Migration

```bash
# Navigate to new repository
cd /home/mpb/Documents/GitHub/ai_workflow

# Check files
ls -la
tree -L 2  # If tree is installed

# View migration readme
cat MIGRATION_README.md
```

### 2. Run Tests

```bash
# Navigate to workflow scripts
cd shell_scripts/workflow/lib

# Run test suite
./test_enhancements.sh

# Expected: 37 tests, 100% pass rate
```

### 3. Test Workflow

```bash
# Navigate to workflow directory
cd shell_scripts/workflow

# Dry run test
./execute_tests_docs_workflow.sh --dry-run

# Full workflow test (optional)
./execute_tests_docs_workflow.sh --auto
```

### 4. Update mpbarbosa_site Repository

After successful migration, update the original repository:

**A. Remove migrated files:**

```bash
cd /home/mpb/Documents/GitHub/mpbarbosa_site

# Remove workflow directory (keep this script)
rm -rf shell_scripts/workflow

# Remove workflow documentation
rm -rf docs/workflow-automation
```

**B. Update .github/copilot-instructions.md:**

```markdown
## Workflow Automation

**Status:** Migrated to dedicated repository

The workflow automation system has been moved to its own repository:
- **Repository:** ai_workflow
- **Location:** /home/mpb/Documents/GitHub/ai_workflow
- **Migration Date:** December 18, 2025

For workflow documentation and scripts, see the ai_workflow repository.
```

**C. Update README.md:**
Add note about workflow migration:

```markdown
## Related Projects

### AI Workflow Automation
The workflow automation system has been separated into its own repository.
See: [ai_workflow](../ai_workflow) for complete documentation and scripts.
```

### 5. Set Up Remote Repository

```bash
cd /home/mpb/Documents/GitHub/ai_workflow

# Add remote
git remote add origin <repository-url>

# Push to remote
git push -u origin main

# Verify
git remote -v
```

### 6. Configure GitHub Repository

**Repository Settings:**

- Description: "AI-powered workflow automation system with metrics, change detection, and parallelization"
- Topics: bash, workflow-automation, ai, github-copilot, shell-scripts
- Branch protection for main branch
- Enable GitHub Actions (if needed)

---

## Rollback Procedure

If migration needs to be reversed:

### 1. Restore from Backup

```bash
cd /home/mpb/Documents/GitHub/mpbarbosa_site

# Find backup
ls -lht backups/ | head -5

# Restore workflow scripts
cp -r backups/workflow_migration_YYYYMMDD_HHMMSS/shell_scripts_workflow shell_scripts/workflow

# Restore documentation
cp -r backups/workflow_migration_YYYYMMDD_HHMMSS/docs_workflow-automation docs/workflow-automation
```

### 2. Verify Restoration

```bash
# Check workflow exists
ls -la shell_scripts/workflow

# Check documentation exists
ls -la docs/workflow-automation

# Run tests
cd shell_scripts/workflow/lib
./test_enhancements.sh
```

### 3. Remove ai_workflow (Optional)

```bash
cd /home/mpb/Documents/GitHub
rm -rf ai_workflow
```

---

## Troubleshooting

### Issue: Target repository already exists with files

**Solution:**

```bash
# Backup existing ai_workflow
mv ai_workflow ai_workflow_backup_$(date +%Y%m%d_%H%M%S)

# Run migration again
cd mpbarbosa_site/shell_scripts
./migrate_workflow_to_ai_workflow.sh
```

### Issue: Permission denied

**Solution:**

```bash
# Make script executable
chmod +x migrate_workflow_to_ai_workflow.sh

# Check directory permissions
ls -la shell_scripts/
```

### Issue: Git commit fails

**Solution:**

```bash
# Configure git if needed
cd ai_workflow
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Try commit again
git add .
git commit -m "feat: initial workflow automation repository"
```

### Issue: rsync not found

**Solution:**

```bash
# Install rsync
sudo apt-get install rsync  # Ubuntu/Debian
# or
brew install rsync  # macOS
```

### Issue: Files not migrated

**Check:**

1. Verify source paths exist
2. Check migration log: `cat workflow_migration_log_*.txt`
3. Run with dry-run to see what would be copied
4. Verify disk space: `df -h`

---

## Migration Log

The script creates a detailed log file:

- **Location:** `shell_scripts/workflow_migration_log_YYYYMMDD_HHMMSS.txt`
- **Contents:** All migration actions with timestamps
- **Use:** Troubleshooting and audit trail

**Example log entries:**

```
[2025-12-18 04:47:20] Migration started (v1.1.8)
[2025-12-18 04:47:20] Dry run: false
[2025-12-18 04:47:21] Source project validated: /home/mpb/Documents/GitHub/mpbarbosa_site
[2025-12-18 04:47:21] Target is git repository: /home/mpb/Documents/GitHub/ai_workflow
[2025-12-18 04:47:22] Backup created: backups/workflow_migration_20251218_044722
[2025-12-18 04:47:23] Migrated 23 documentation files
[2025-12-18 04:47:25] Migrated 225 script files
[2025-12-18 04:47:26] Created MIGRATION_README.md
[2025-12-18 04:47:26] Created .gitignore
[2025-12-18 04:47:27] Created initial commit
[2025-12-18 04:47:27] Migration completed successfully
```

---

## File Structure After Migration

### ai_workflow Repository

```text
ai_workflow/
├── .git/                              # Git repository
├── .gitignore                         # Ignore workflow artifacts
├── MIGRATION_README.md                # Migration documentation
│
├── docs/
│   └── workflow-automation/           # Complete documentation (23 files)
│       ├── COMPREHENSIVE_WORKFLOW_EXECUTION_ANALYSIS.md
│       ├── SHORT_TERM_ENHANCEMENTS_COMPLETION.md
│       └── ... (21 more files)
│
└── shell_scripts/
    └── workflow/                      # Complete workflow system (225 files)
        ├── execute_tests_docs_workflow.sh  # Main orchestrator
        ├── lib/                       # 16 library modules
        │   ├── metrics.sh
        │   ├── change_detection.sh
        │   ├── dependency_graph.sh
        │   └── ... (13 more modules)
        └── steps/                     # 13 step modules
            ├── step_00_analyze.sh
            └── ... (12 more steps)
```

### mpbarbosa_site Repository (After Cleanup)

```text
mpbarbosa_site/
├── shell_scripts/
│   ├── migrate_workflow_to_ai_workflow.sh  # Migration script (kept)
│   ├── WORKFLOW_MIGRATION_GUIDE.md         # This guide (kept)
│   └── ... (other scripts)
│
├── backups/
│   └── workflow_migration_YYYYMMDD_HHMMSS/  # Backup (kept)
│       ├── docs_workflow-automation/
│       └── shell_scripts_workflow/
│
├── .github/
│   └── copilot-instructions.md         # Updated with migration note
│
└── README.md                           # Updated with project link
```

---

## Success Criteria

Migration is successful when:

- ✅ All 23 documentation files migrated
- ✅ All 225 script files migrated
- ✅ Git repository initialized
- ✅ Initial commit created
- ✅ Tests pass (37/37)
- ✅ MIGRATION_README.md created
- ✅ .gitignore created
- ✅ Backup created
- ✅ Migration log generated
- ✅ Workflow executable from new location

---

## References

### Related Documentation

- `ai_workflow/MIGRATION_README.md` - New repository overview
- `ai_workflow/docs/workflow-automation/` - Complete workflow docs
- `ai_workflow/shell_scripts/workflow/README.md` - Module documentation

### Original Documentation

- `.github/copilot-instructions.md` - Workflow section (to be updated)
- `docs/workflow-automation/` - Source documentation (to be removed)
- `shell_scripts/workflow/` - Source scripts (to be removed)

---

## Support

### Questions or Issues?

1. **Check the migration log:**

   ```bash
   cat shell_scripts/workflow_migration_log_*.txt
   ```

2. **Run dry-run again:**

   ```bash
   ./migrate_workflow_to_ai_workflow.sh --dry-run
   ```

3. **Review backup:**

   ```bash
   ls -la backups/workflow_migration_*/
   ```

4. **Restore from backup if needed** (see Rollback Procedure above)

---

**Script Version:** 1.1.8  
**Created:** December 18, 2025  
**Status:** Ready for execution ✅
