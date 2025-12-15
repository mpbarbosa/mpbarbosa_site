# Documentation Consolidation and Retention Policy

**Version:** 1.0.0  
**Effective Date:** 2025-11-13  
**Last Updated:** 2025-11-13

## Overview

This policy establishes guidelines for managing consistency analysis reports, validation reports, and other automated documentation to maintain a clean, organized repository while preserving historical context when needed.

## Policy Objectives

1. **Reduce Clutter** - Minimize the number of reports in the project root
2. **Preserve History** - Retain important historical snapshots for trend analysis
3. **Easy Access** - Ensure the latest information is always readily available
4. **Automated Management** - Minimize manual intervention through automation

## Document Categories

### Category 1: Living Documents
**Approach:** Single, continuously updated document  
**Location:** Project root or `/docs` directory  
**Retention:** Permanent (no archival)  
**Version Control:** Git history provides version tracking

**Examples:**
- `README.md`
- `.github/copilot-instructions.md`
- `/docs/*.md` (architectural documentation)

### Category 2: Timestamped Snapshots
**Approach:** Timestamped files with automatic archival  
**Location:** Project root → `/shell_scripts/workflow/logs/archived_reports` (after 30 days)  
**Retention:** 30 days active, 60 days archived (90 days total)  
**Latest Access:** Via `*_LATEST.md` symlinks

**Examples:**
- `DIRECTORY_STRUCTURE_VALIDATION_REPORT_YYYYMMDD_HHMMSS.md`
- `SHELL_SCRIPT_DOCUMENTATION_VALIDATION_REPORT_YYYYMMDD_HHMMSS.md`
- `TEST_FAILURE_ANALYSIS_YYYYMMDD_HHMMSS.md`

### Category 3: Workflow Outputs
**Approach:** Organized by workflow run ID  
**Location:** `/backlog/{workflow_run_id}/` and `/summaries/{workflow_run_id}/`  
**Retention:** 90 days  
**Cleanup:** Manual review before deletion

**Examples:**
- `/shell_scripts/workflow/backlog/20251113_163443/step*_*.md`
- `/summaries/20251113_163443/step*_summary.md`
- `/shell_scripts/workflow/logs/20251113_163443/step*_copilot_*.log`

## Retention Schedule

| Document Type | Active Period | Archive Period | Total Retention | Disposal |
|--------------|---------------|----------------|-----------------|----------|
| Living Documents | Permanent | N/A | Permanent | Never |
| Validation Reports | 30 days | 60 days | 90 days | Auto-delete |
| Analysis Reports | 30 days | 60 days | 90 days | Auto-delete |
| Workflow Backlog | 90 days | N/A | 90 days | Manual review |
| Workflow Summaries | 90 days | N/A | 90 days | Manual review |
| AI Session Logs | 30 days | 60 days | 90 days | Auto-delete |

## Naming Conventions

### Timestamped Reports
```
{REPORT_TYPE}_{YYYYMMDD_HHMMSS}.md
Example: DIRECTORY_STRUCTURE_VALIDATION_REPORT_20251113_163443.md
```

### Latest Symlinks
```
{REPORT_TYPE}_LATEST.md → {REPORT_TYPE}_{YYYYMMDD_HHMMSS}.md
Example: DIRECTORY_STRUCTURE_VALIDATION_REPORT_LATEST.md
```

### Workflow Outputs
```
/shell_scripts/workflow/backlog/{WORKFLOW_RUN_ID}/step{NN}_{STEP_NAME}.md
/summaries/{WORKFLOW_RUN_ID}/step{NN}_{STEP_NAME}_summary.md
/shell_scripts/workflow/logs/{WORKFLOW_RUN_ID}/step{NN}_{TYPE}_{TIMESTAMP}.log
```

## Automated Management

### Daily Maintenance (Recommended Cron Job)
```bash
# Run at 2 AM daily
0 2 * * * cd /path/to/project && ./shell_scripts/manage_reports.sh full-maintenance
```

### Weekly Review (Recommended)
```bash
# Run on Sundays at 3 AM
0 3 * * 0 cd /path/to/project && ./shell_scripts/consolidate_docs.sh --weekly-review
```

### Manual Operations
```bash
# Archive old reports
./shell_scripts/manage_reports.sh archive ALL

# Cleanup archived reports
./shell_scripts/manage_reports.sh cleanup

# Full maintenance (archive + cleanup)
./shell_scripts/manage_reports.sh full-maintenance

# List current state
./shell_scripts/manage_reports.sh list

# Consolidate documentation
./shell_scripts/consolidate_docs.sh --dry-run
./shell_scripts/consolidate_docs.sh --execute
```

## Migration Strategy

### Phase 1: Immediate Cleanup (Complete ✅)
- [x] Rename existing reports with timestamps
- [x] Create LATEST symlinks
- [x] Archive reports older than 30 days

### Phase 2: Establish Structure (In Progress)
- [ ] Create `/docs/reports/` directory for long-term retention
- [ ] Move critical reports to appropriate locations
- [ ] Update documentation references

### Phase 3: Automation (Planned)
- [ ] Add cron jobs for daily maintenance
- [ ] Implement weekly consolidation
- [ ] Set up monitoring for report accumulation

## Decision Matrix: Living vs Timestamped

Use this matrix to determine which approach to use for new documentation:

| Criteria | Living Document | Timestamped Snapshot |
|----------|----------------|---------------------|
| **Update Frequency** | Continuous/Ad-hoc | Scheduled/Automated |
| **Historical Value** | Low (git history sufficient) | High (trend analysis) |
| **File Size** | Any | Prefer <100KB |
| **Audience** | Developers/Users | Automation/Analysis |
| **Volatility** | High (frequent changes) | Low (periodic updates) |
| **Search Value** | High (referenced often) | Low (point-in-time data) |

**Examples:**

- **Living:** README, Architecture docs, API references
- **Timestamped:** Test reports, validation results, metrics snapshots

## Document Consolidation Process

### For Validation Reports

1. **Review** - Check all reports in project root
2. **Archive** - Move old reports (>30 days) to `/shell_scripts/workflow/logs/archived_reports/`
3. **Symlink** - Update `*_LATEST.md` symlinks to most recent
4. **Cleanup** - Delete archived reports older than 60 days

### For Analysis Reports

1. **Extract Insights** - Review all analysis reports
2. **Update Living Docs** - Incorporate insights into `/docs/` documentation
3. **Archive Historical** - Keep timestamped copies for trend analysis
4. **Remove Duplicates** - Delete redundant or superseded reports

### For Workflow Outputs

1. **Review Backlog** - Check `/backlog/` for unresolved issues
2. **Migrate Issues** - Move active issues to GitHub Issues or `/docs/BACKLOG.md`
3. **Archive Summaries** - Consolidate summaries into quarterly reports
4. **Cleanup Logs** - Remove AI session logs after 90 days

## Living Document Recommendations

### Recommended Structure
```
/docs/
├── architecture/
│   ├── OVERVIEW.md
│   ├── DEPLOYMENT.md
│   └── MODULARIZATION.md
├── development/
│   ├── SETUP.md
│   ├── TESTING.md
│   └── WORKFLOW.md
├── operations/
│   ├── MAINTENANCE.md
│   ├── TROUBLESHOOTING.md
│   └── MONITORING.md
└── reports/
    ├── QUARTERLY_SUMMARY_Q4_2025.md
    ├── VALIDATION_TRENDS.md
    └── QUALITY_METRICS.md
```

### Migration Candidates

Consider converting these to living documents:

1. **TEST_FAILURE_ANALYSIS.md** → `/docs/development/TESTING.md#Common-Failures`
2. **CONSISTENCY_ANALYSIS.md** → `/docs/development/QUALITY_METRICS.md`
3. Multiple validation reports → Single `/docs/reports/VALIDATION_TRENDS.md`

## Monitoring and Compliance

### Weekly Checks
- [ ] Count of reports in project root (target: ≤5)
- [ ] Age of oldest active report (target: <30 days)
- [ ] Archive directory size (warn if >100MB)
- [ ] Broken symlinks (target: 0)

### Monthly Reviews
- [ ] Review archived reports for permanent retention
- [ ] Update living documents with insights from timestamped reports
- [ ] Check compliance with retention schedule
- [ ] Adjust policy based on usage patterns

### Quarterly Activities
- [ ] Consolidate workflow summaries into quarterly report
- [ ] Review and update retention periods
- [ ] Clean up `/docs` structure
- [ ] Archive or delete old workflow runs

## Exception Handling

### Permanent Retention
Some reports may warrant permanent retention:
- First validation report of each type (baseline)
- Reports documenting major incidents or issues
- Reports with unique insights not captured elsewhere

**Process:**
1. Move to `/docs/reports/historical/`
2. Add `PERMANENT` prefix to filename
3. Document reason for retention in report frontmatter

### Emergency Recovery
If reports are accidentally deleted:
1. Check `/shell_scripts/workflow/logs/archived_reports/` for archived copies
2. Review git history for content
3. Re-run validation tools if necessary
4. Document recovery process for future reference

## Tools and Scripts

### Available Tools
- `manage_reports.sh` - Core report management (rename, archive, cleanup)
- `consolidate_docs.sh` - Documentation consolidation (to be created)
- Workflow automation for scheduled maintenance

### Planned Enhancements
- Dashboard for report statistics
- Automated trend analysis
- Integration with monitoring tools
- Email notifications for policy violations

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2025-11-13 | Initial policy document | MP Barbosa |

## References

- [File Management Strategy](../shell_scripts/manage_reports.sh)
- [Workflow Automation](../shell_scripts/workflow/README.md)
- [Session Manager Documentation](../shell_scripts/workflow/lib/SESSION_MANAGER.md)

---

**Policy Owner:** Development Team  
**Review Cycle:** Quarterly  
**Next Review:** 2026-02-13
