# AI Workflow Automation Directory

**Status**: 🤖 Automatically Managed  
**Version Control**: ❌ Gitignored (not tracked in repository)  
**Size**: ~1.3M (varies with workflow sessions)

---

## Purpose

This directory contains AI-powered workflow automation state, logs, and outputs generated during development sessions with GitHub Copilot and other AI tools.

## Directory Structure

```
.ai_workflow/
├── backlog/               # Workflow task backlog (work items, epics, tasks)
│   └── YYYYMMDD_HHMMSS/  # Timestamped workflow sessions
├── logs/                  # Workflow execution logs and debugging output
│   └── YYYYMMDD_HHMMSS/  # Timestamped log files
├── prompts/               # AI prompt templates and library
│   └── *.txt             # Reusable prompt templates
└── summaries/             # Workflow session summaries and reports
    └── YYYYMMDD_HHMMSS/  # Timestamped summary documents
```

## Subdirectories

### `backlog/`
**Purpose**: Stores workflow task backlogs and work item tracking.

**Contents**:
- Workflow session backlogs
- Task prioritization data
- Epic and story breakdowns
- Work item status tracking

**Naming**: `YYYYMMDD_HHMMSS/` (timestamp of session start)

### `logs/`
**Purpose**: Execution logs and debugging output from workflow automation.

**Contents**:
- Step execution logs
- Error messages and stack traces
- Performance metrics
- Debugging information

**Retention**: Logs from recent workflow sessions (typically last 15 runs)

### `prompts/`
**Purpose**: Library of reusable AI prompt templates.

**Contents**:
- Standardized prompt templates
- Prompt engineering patterns
- Context injection templates
- Best practices examples

**Files**: Plain text `.txt` files with descriptive names

### `summaries/`
**Purpose**: Session summaries and completion reports.

**Contents**:
- Workflow completion summaries
- Performance analytics
- Success metrics
- Lessons learned

**Format**: Markdown documents with session metadata

## Usage

### Automatic Management

This directory is **automatically managed** by workflow automation scripts. You typically don't need to interact with it directly.

**Automation Scripts**:
- `shell_scripts/workflow/run_tests_and_docs.sh` - Main workflow orchestrator
- `shell_scripts/cleanup_old_folders.sh` - Cleanup and retention management

### Manual Inspection

To review workflow session data:

```bash
# View recent workflow summaries
ls -lt .ai_workflow/summaries/ | head -5

# Read latest summary
cat .ai_workflow/summaries/$(ls -t .ai_workflow/summaries/ | head -1)/*.md

# Check logs for debugging
tail -50 .ai_workflow/logs/$(ls -t .ai_workflow/logs/ | head -1)/*.log
```

### Cleanup

Retention policy is managed automatically:

```bash
# Manual cleanup (keeps 15 most recent sessions)
./shell_scripts/cleanup_old_folders.sh
```

## Version Control

**Git Status**: ✅ Gitignored

This directory is listed in `.gitignore` (line 1) and is **not tracked in version control**.

**Rationale**:
- Session data is ephemeral and environment-specific
- Large file sizes (1.3M+) would bloat repository
- Contains potentially sensitive information (prompts, debugging data)
- Automatically regenerated on each workflow run

## Retention Policy

**Default Retention**: 15 most recent workflow sessions

**Cleanup Triggers**:
- Manual execution of `cleanup_old_folders.sh`
- Workflow completion (automatic cleanup)
- Monthly maintenance cycles

**Preserved Data**:
- Critical summary documents may be moved to `docs/workflow-automation/`
- Important prompts are extracted to `prompts/` directory (tracked in git)

## File Permissions

**Directory**: `drwxrwxr-x` (775)
**Files**: `-rw-rw-r--` (664)

Readable by user and group, allowing collaboration while maintaining security.

## Troubleshooting

### Directory Missing

If `.ai_workflow/` directory doesn't exist, it will be automatically created on the next workflow run.

```bash
# Manual creation (if needed)
mkdir -p .ai_workflow/{backlog,logs,prompts,summaries}
```

### Disk Space Issues

If directory size grows too large:

```bash
# Check current size
du -sh .ai_workflow/

# Run cleanup
./shell_scripts/cleanup_old_folders.sh

# Or manually remove old sessions
rm -rf .ai_workflow/logs/20241101_*  # Remove specific dated sessions
```

### Permission Issues

If you encounter permission errors:

```bash
# Fix permissions
chmod -R 775 .ai_workflow/
chmod -R 664 .ai_workflow/**/*.{txt,md,log}
```

## Best Practices

1. **Don't Commit**: Never add `.ai_workflow/` to version control
2. **Regular Cleanup**: Run cleanup script weekly or after major workflow sessions
3. **Extract Important Prompts**: Move valuable prompts to tracked `prompts/` directory
4. **Archive Summaries**: Move critical session summaries to `docs/` for permanent storage

## Related Documentation

- **[Workflow Automation Version Evolution](../docs/workflow-automation/WORKFLOW_AUTOMATION_VERSION_EVOLUTION.md)** - Workflow system history
- **[Tests & Documentation Workflow Plan](../docs/workflow-automation/TESTS_DOCS_WORKFLOW_AUTOMATION_PLAN.md)** - Comprehensive automation plan
- **[Cleanup Script Documentation](../shell_scripts/README.md)** - Cleanup utilities

---

**Last Updated**: 2025-12-25  
**Maintained By**: Workflow automation scripts  
**Support**: See workflow automation documentation in `docs/workflow-automation/`
