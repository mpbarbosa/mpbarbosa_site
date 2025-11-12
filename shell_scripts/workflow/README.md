# Workflow Automation Module Documentation

**Version:** 2.0.0  
**Status:** Phase 1 Complete - Core Libraries Extracted  
**Last Updated:** 2025-11-12

---

## Overview

The Tests & Documentation Workflow Automation script has been modularized to improve maintainability, testability, and reusability. The refactoring splits the monolithic 4,337-line script into focused modules with single responsibilities.

---

## Module Architecture

### Directory Structure

```
shell_scripts/workflow/
├── execute_tests_docs_workflow.sh   # Main orchestrator (will be refactored)
├── lib/                              # Core library modules ✅ COMPLETE
│   ├── config.sh                     # Configuration and constants
│   ├── colors.sh                     # ANSI color definitions
│   ├── utils.sh                      # Utility functions
│   ├── git_cache.sh                  # Git state caching (v1.5.0)
│   ├── validation.sh                 # Pre-flight checks
│   ├── backlog.sh                    # Backlog tracking (TODO)
│   ├── summary.sh                    # Summary generation (TODO)
│   └── ai_helpers.sh                 # AI prompt templates (TODO)
└── steps/                            # Step modules (TODO)
    ├── step_00_analyze.sh
    ├── step_01_documentation.sh
    ├── step_02_consistency.sh
    ├── step_03_script_refs.sh
    ├── step_04_directory.sh
    ├── step_05_test_review.sh
    ├── step_06_test_gen.sh
    ├── step_07_test_exec.sh
    ├── step_08_dependencies.sh
    ├── step_09_quality.sh
    ├── step_10_context.sh
    └── step_11_git_final.sh
```

---

## Completed Modules (Phase 1 & 2)

### Phase 1 Modules (v2.0.0)

### 1. `lib/config.sh` (56 lines)
**Purpose:** Central configuration and constants

**Exports:**
- `SCRIPT_VERSION`, `SCRIPT_NAME`
- `PROJECT_ROOT`, `SRC_DIR`, `BACKLOG_DIR`, `SUMMARIES_DIR`, `LOGS_DIR`, `DOCS_DIR`
- `WORKFLOW_RUN_ID`, `BACKLOG_RUN_DIR`, `SUMMARIES_RUN_DIR`, `LOGS_RUN_DIR`
- `TOTAL_STEPS`, `DRY_RUN`, `INTERACTIVE_MODE`, `AUTO_MODE`
- `ANALYSIS_COMMITS`, `ANALYSIS_MODIFIED`, `CHANGE_SCOPE`

**Usage:**
```bash
source "$(dirname "$0")/lib/config.sh"
echo "Running $SCRIPT_NAME v$SCRIPT_VERSION"
```

### 2. `lib/colors.sh` (17 lines)
**Purpose:** ANSI color code definitions

**Exports:**
- `RED`, `GREEN`, `YELLOW`, `BLUE`, `CYAN`, `MAGENTA`, `NC`

**Usage:**
```bash
source "$(dirname "$0")/lib/colors.sh"
echo -e "${GREEN}Success!${NC}"
```

### 3. `lib/utils.sh` (224 lines)
**Purpose:** Common utility functions

**Functions:**
- `print_header()`, `print_success()`, `print_error()`, `print_warning()`, `print_info()`, `print_step()`
- `save_step_issues()`, `save_step_summary()`
- `confirm_action()`
- `cleanup()`
- `update_workflow_status()`, `show_progress()`

**Usage:**
```bash
source "$(dirname "$0")/lib/utils.sh"
print_success "Operation completed"
if confirm_action "Continue?" "y"; then
    # Do something
fi
```

### 4. `lib/git_cache.sh` (142 lines)
**Purpose:** Git state caching for performance optimization

**Functions:**
- `init_git_cache()` - Initialize cache once at workflow start
- `get_git_modified_count()`, `get_git_staged_count()`, `get_git_untracked_count()`, etc.
- `get_git_current_branch()`, `get_git_commits_ahead()`, `get_git_commits_behind()`
- `get_git_status_output()`, `get_git_diff_stat_output()`, `get_git_diff_files_output()`
- `is_deps_modified()`, `is_git_repo()`

**Usage:**
```bash
source "$(dirname "$0")/lib/git_cache.sh"
init_git_cache
modified_count=$(get_git_modified_count)
current_branch=$(get_git_current_branch)
```

### 5. `lib/validation.sh` (147 lines)
**Purpose:** Pre-flight checks and dependency validation

**Functions:**
- `check_prerequisites()` - Validates project structure, git, Node.js, npm
- `validate_dependencies()` - Ensures node_modules and Jest are available

**Usage:**
```bash
source "$(dirname "$0")/lib/validation.sh"
check_prerequisites
validate_dependencies
```

### Phase 2 Modules (v2.0.0)

### 6. `lib/backlog.sh` (90 lines)
**Purpose:** Workflow summary and backlog report generation

**Functions:**
- `create_workflow_summary()` - Creates comprehensive workflow execution summary

**Usage:**
```bash
source "$(dirname "$0")/lib/backlog.sh"
create_workflow_summary  # Called at end of workflow
```

### 7. `lib/summary.sh` (135 lines)
**Purpose:** Step-level summary generation helpers

**Functions:**
- `determine_step_status()` - Returns ✅, ⚠️, or ❌ based on findings
- `format_step_summary()` - Formats summary with consistent structure
- `create_progress_summary()` - One-line summary for progress tracking
- `generate_step_stats()` - Statistics from step execution
- `aggregate_summaries()` - Aggregates results from multiple steps

**Usage:**
```bash
source "$(dirname "$0")/lib/summary.sh"
status=$(determine_step_status 0 2)  # 0 errors, 2 warnings -> ⚠️
stats=$(generate_step_stats 10 2 3)  # 10 files, 2 issues, 3 warnings
```

### 8. `lib/ai_helpers.sh` (225 lines)
**Purpose:** AI prompt templates and Copilot CLI integration

**Functions:**
- `is_copilot_available()` - Check if Copilot CLI is installed
- `validate_copilot_cli()` - Validate and provide user feedback
- `build_ai_prompt()` - Build structured prompts (role, task, standards)
- `build_doc_analysis_prompt()` - Documentation analysis prompt
- `build_consistency_prompt()` - Consistency checking prompt
- `build_test_strategy_prompt()` - Test strategy prompt
- `build_quality_prompt()` - Code quality validation prompt
- `execute_copilot_prompt()` - Execute prompt with error handling
- `trigger_ai_step()` - Trigger AI-enhanced step with confirmation

**Usage:**
```bash
source "$(dirname "$0")/lib/ai_helpers.sh"
if is_copilot_available; then
    prompt=$(build_doc_analysis_prompt "$changed_files" "$docs")
    execute_copilot_prompt "$prompt"
fi
```

---

## Module Extraction Pattern

Each step module should follow this standard pattern:

### Template: `steps/step_XX_name.sh`

```bash
#!/bin/bash
################################################################################
# Step XX: [Step Name]
# Purpose: [Description of what this step does]
# Part of: Tests & Documentation Workflow Automation v2.0.0
################################################################################

# Main step function - called by workflow orchestrator
# Returns: 0 for success, 1 for failure
step_XX_function_name() {
    print_step "XX" "[Step Name]"
    
    cd "$PROJECT_ROOT"
    
    # Phase 1: Automated validation
    print_info "Phase 1: Automated validation..."
    
    # ... step-specific logic ...
    
    # Phase 2: AI-powered analysis (if applicable)
    if [[ "$AUTO_MODE" != true ]]; then
        print_info "Phase 2: AI-powered analysis..."
        
        # Build Copilot prompt
        local copilot_prompt="..."
        
        if command -v copilot &> /dev/null; then
            if confirm_action "Run Copilot analysis?" "y"; then
                copilot -p "$copilot_prompt" --allow-all-tools
            fi
        fi
    fi
    
    # Save backlog if issues found
    if [[ -n "$issues_found" ]]; then
        save_step_issues "XX" "[Step Name]" "$issues_found"
    fi
    
    # Save summary
    save_step_summary "XX" "[Step Name]" "$summary_content" "✅"
    
    # Update workflow status
    update_workflow_status "Step XX" "✅"
    
    return 0
}

# Export step function
export -f step_XX_function_name
```

---

## Extraction Procedure

To extract a step from the monolithic script:

1. **Locate the step function**
   ```bash
   grep -n "^stepX_" execute_tests_docs_workflow.sh
   ```

2. **Extract the function**
   - Copy the entire function (from opening `{` to closing `}`)
   - Include all helper functions specific to that step
   - Include AI persona prompts

3. **Create the module file**
   ```bash
   cat > steps/step_XX_name.sh << 'EOF'
   #!/bin/bash
   # ... paste extracted code ...
   EOF
   chmod +x steps/step_XX_name.sh
   ```

4. **Test the module**
   ```bash
   bash -n steps/step_XX_name.sh  # Syntax check
   ```

5. **Update the main orchestrator**
   - Add source statement: `source "$(dirname "$0")/steps/step_XX_name.sh"`
   - Call function in workflow: `step_XX_function_name`

---

## Remaining Work (Phase 2 & 3)

### Phase 2: Extract Remaining Libraries

- [ ] `lib/backlog.sh` - Backlog and issue tracking functions
  - Extract `create_workflow_summary()` and related functions
  - ~200 lines estimated

- [ ] `lib/summary.sh` - Summary generation functions  
  - Extract summary creation and formatting functions
  - ~150 lines estimated

- [ ] `lib/ai_helpers.sh` - AI prompt templates and helpers
  - Extract Copilot CLI integration functions
  - Extract persona templates
  - ~100 lines estimated

### Phase 3: Extract Step Modules

- [ ] `steps/step_00_analyze.sh` - Pre-workflow change analysis (~250 lines)
- [ ] `steps/step_01_documentation.sh` - Documentation updates (~300 lines)
- [ ] `steps/step_02_consistency.sh` - Consistency analysis (~250 lines)
- [ ] `steps/step_03_script_refs.sh` - Script reference validation (~250 lines)
- [ ] `steps/step_04_directory.sh` - Directory structure validation (~300 lines)
- [ ] `steps/step_05_test_review.sh` - Test review (~280 lines)
- [ ] `steps/step_06_test_gen.sh` - Test generation (~350 lines)
- [ ] `steps/step_07_test_exec.sh` - Test execution (~350 lines)
- [ ] `steps/step_08_dependencies.sh` - Dependency validation (~330 lines)
- [ ] `steps/step_09_quality.sh` - Code quality validation (~350 lines)
- [ ] `steps/step_10_context.sh` - Context analysis (~350 lines)
- [ ] `steps/step_11_git_final.sh` - Git finalization (~400 lines)

### Phase 4: Refactor Main Orchestrator

- [ ] Remove all extracted code from `execute_tests_docs_workflow.sh`
- [ ] Add source statements for all modules
- [ ] Simplify main() function to workflow coordination only
- [ ] Target: < 300 lines total
- [ ] Update help text and version to 2.0.0

---

## Testing Strategy

### Unit Testing
```bash
# Test each module independently
cd shell_scripts/workflow
for lib in lib/*.sh; do
    echo "Testing $lib..."
    bash -n "$lib"  # Syntax check
done

for step in steps/*.sh; do
    echo "Testing $step..."
    bash -n "$step"  # Syntax check
done
```

### Integration Testing
```bash
# Test complete workflow
./execute_tests_docs_workflow.sh --dry-run
./execute_tests_docs_workflow.sh --auto --dry-run
```

### Regression Testing
- Compare output before/after refactoring
- Verify all 13 steps execute correctly
- Check backlog generation works
- Verify summary generation works

---

## Benefits Achieved (Phase 1 & 2)

✅ **All library modules extracted** (8 modules, ~1,164 lines)  
✅ **Single responsibility** per module  
✅ **Reusable functions** across multiple scripts  
✅ **Easier testing** with 54 automated tests  
✅ **Clear dependencies** and interfaces  
✅ **Performance optimization** preserved (git caching)  
✅ **AI integration** modularized and testable  

---

## Version History

### v2.0.0 (2025-11-12) - Phase 1 & 2 Complete
- ✅ Created modular directory structure
- ✅ **Phase 1:** Extracted 5 core library modules (config, colors, utils, git_cache, validation)
- ✅ **Phase 2:** Extracted 3 remaining library modules (backlog, summary, ai_helpers)
- ✅ 54 automated tests (100% pass rate)
- ✅ Complete module documentation
- ✅ All library modules ready for production use

### v1.5.0 (Previous)
- Git state caching optimization
- 25-30% performance improvement

### v1.4.0
- Summary generation system

### v1.3.0
- Backlog tracking system

### v1.2.0
- AI-enhanced validation with Copilot CLI

---

## Contributing

When adding or modifying modules:

1. **Follow the established patterns** (see Module Extraction Pattern above)
2. **Include proper headers** with purpose and version
3. **Export functions** explicitly
4. **Add error handling** for all operations
5. **Support dry-run mode** via `$DRY_RUN` variable
6. **Support auto mode** via `$AUTO_MODE` variable
7. **Document all functions** with usage examples
8. **Test syntax** with `bash -n` before committing

---

## References

- Original monolithic script: `execute_tests_docs_workflow.sh` (4,337 lines)
- Split plan: `/docs/WORKFLOW_SCRIPT_SPLIT_PLAN.md`
- Performance optimization: `/docs/WORKFLOW_PERFORMANCE_OPTIMIZATION.md`
- Workflow automation plan: `/docs/TESTS_DOCS_WORKFLOW_AUTOMATION_PLAN.md`

---

**Maintained by:** MP Barbosa  
**Last Updated:** 2025-11-12  
**Status:** Phase 1 Complete - Core Libraries Ready
