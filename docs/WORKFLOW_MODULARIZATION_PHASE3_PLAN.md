# Workflow Modularization - Phase 3 Execution Plan

**Created:** 2025-11-12  
**Status:** READY TO BEGIN  
**Approach:** Incremental subphase extraction with per-step commits

---

## Overview

Phase 3 will extract all 12 step modules from the monolithic workflow script, with each step extracted, tested, and committed independently.

---

## Subphase Strategy

### Pattern for Each Subphase

1. **Extract** - Copy step function from monolith to new module file
2. **Test** - Validate syntax and function availability
3. **Document** - Add module header and export statement
4. **Commit** - Commit the single module with descriptive message
5. **Continue** - Proceed to next subphase

### Benefits of Incremental Approach

- ✅ **Reduced risk** - Each step validated before proceeding
- ✅ **Clear progress** - 12 distinct milestones
- ✅ **Easy rollback** - Can revert individual steps if needed
- ✅ **Better history** - Git log shows clear progression
- ✅ **Incremental testing** - Catch issues early

---

## Phase 3 Subphases

### Phase 3.1: Step 0 - Change Analysis
**File:** `steps/step_00_analyze.sh`  
**Function:** `step0_analyze_changes()`  
**Lines:** ~250  
**Purpose:** Pre-workflow git change analysis

### Phase 3.2: Step 1 - Documentation Updates
**File:** `steps/step_01_documentation.sh`  
**Function:** `step1_update_documentation()`  
**Lines:** ~300  
**Purpose:** AI-powered documentation updates

### Phase 3.3: Step 2 - Consistency Analysis
**File:** `steps/step_02_consistency.sh`  
**Function:** `step2_check_consistency()`  
**Lines:** ~250  
**Purpose:** Documentation consistency checking

### Phase 3.4: Step 3 - Script Reference Validation
**File:** `steps/step_03_script_refs.sh`  
**Function:** `step3_validate_script_references()`  
**Lines:** ~250  
**Purpose:** Shell script documentation validation

### Phase 3.5: Step 4 - Directory Structure
**File:** `steps/step_04_directory.sh`  
**Function:** `step4_validate_directory_structure()`  
**Lines:** ~300  
**Purpose:** Project structure validation

### Phase 3.6: Step 5 - Test Review
**File:** `steps/step_05_test_review.sh`  
**Function:** `step5_review_existing_tests()`  
**Lines:** ~280  
**Purpose:** Existing test suite analysis

### Phase 3.7: Step 6 - Test Generation
**File:** `steps/step_06_test_gen.sh`  
**Function:** `step6_generate_new_tests()`  
**Lines:** ~350  
**Purpose:** New test creation recommendations

### Phase 3.8: Step 7 - Test Execution
**File:** `steps/step_07_test_exec.sh`  
**Function:** `step7_execute_test_suite()`  
**Lines:** ~350  
**Purpose:** Jest test suite execution

### Phase 3.9: Step 8 - Dependency Validation
**File:** `steps/step_08_dependencies.sh`  
**Function:** `step8_validate_dependencies()`  
**Lines:** ~330  
**Purpose:** Package dependency checks

### Phase 3.10: Step 9 - Code Quality
**File:** `steps/step_09_quality.sh`  
**Function:** `step9_code_quality_validation()`  
**Lines:** ~350  
**Purpose:** Code quality validation

### Phase 3.11: Step 10 - Context Analysis
**File:** `steps/step_10_context.sh`  
**Function:** `step10_context_analysis()`  
**Lines:** ~350  
**Purpose:** Final workflow context review

### Phase 3.12: Step 11 - Git Finalization
**File:** `steps/step_11_git_final.sh`  
**Function:** `step11_git_finalization()`  
**Lines:** ~400  
**Purpose:** Commit and push changes

---

## Commit Message Template

```
feat(workflow): extract step XX module - phase 3.X

Extract step_XX_name.sh from monolithic workflow script.

Module Created:
- File: steps/step_XX_name.sh
- Lines: XXX
- Function: step_XX_function_name()

Features:
- [Brief description of step functionality]
- AI integration (if applicable)
- Backlog tracking
- Summary generation

Testing:
- Module syntax validated
- Function exported correctly
- Dependencies verified

Phase Progress: X of 12 step modules complete
Total Extracted: X,XXX lines

See: shell_scripts/workflow/steps/step_XX_name.sh
```

---

## Extraction Procedure

### For Each Subphase:

#### 1. Create Branch (First subphase only)
```bash
git checkout -b workflow-phase3
```

#### 2. Locate Step Function
```bash
grep -n "^step[0-9]_" execute_tests_docs_workflow.sh
```

#### 3. Extract to Module File
```bash
# View the function
view execute_tests_docs_workflow.sh [start_line:end_line]

# Create module with header
create steps/step_XX_name.sh
```

#### 4. Test Module
```bash
# Syntax check
bash -n steps/step_XX_name.sh

# Source test (with dependencies)
source lib/colors.sh
source lib/config.sh
source lib/utils.sh
source steps/step_XX_name.sh
declare -F step_XX_function_name
```

#### 5. Commit
```bash
git add steps/step_XX_name.sh
git commit -m "feat(workflow): extract step XX module - phase 3.X

[Use template above]"
```

#### 6. Continue to Next Subphase
Repeat steps 2-5 for next step module.

---

## Progress Tracking

### Subphase Checklist

- [ ] 3.1  - Step 0: Change Analysis
- [ ] 3.2  - Step 1: Documentation Updates
- [ ] 3.3  - Step 2: Consistency Analysis
- [ ] 3.4  - Step 3: Script Reference Validation
- [ ] 3.5  - Step 4: Directory Structure
- [ ] 3.6  - Step 5: Test Review
- [ ] 3.7  - Step 6: Test Generation
- [ ] 3.8  - Step 7: Test Execution
- [ ] 3.9  - Step 8: Dependency Validation
- [ ] 3.10 - Step 9: Code Quality
- [ ] 3.11 - Step 10: Context Analysis
- [ ] 3.12 - Step 11: Git Finalization

### Metrics to Track

| Subphase | Module | Lines | Commit | Status |
|----------|--------|-------|--------|--------|
| 3.1      | step_00_analyze.sh | ~250 | - | ⏳ |
| 3.2      | step_01_documentation.sh | ~300 | - | ⏳ |
| 3.3      | step_02_consistency.sh | ~250 | - | ⏳ |
| 3.4      | step_03_script_refs.sh | ~250 | - | ⏳ |
| 3.5      | step_04_directory.sh | ~300 | - | ⏳ |
| 3.6      | step_05_test_review.sh | ~280 | - | ⏳ |
| 3.7      | step_06_test_gen.sh | ~350 | - | ⏳ |
| 3.8      | step_07_test_exec.sh | ~350 | - | ⏳ |
| 3.9      | step_08_dependencies.sh | ~330 | - | ⏳ |
| 3.10     | step_09_quality.sh | ~350 | - | ⏳ |
| 3.11     | step_10_context.sh | ~350 | - | ⏳ |
| 3.12     | step_11_git_final.sh | ~400 | - | ⏳ |

---

## Dependencies Between Steps

### Step Execution Order (in workflow)
```
step0 → step1 → step2 → step3 → step4 → step5 → step6 
  → step7 → step8 → step9 → step10 → step11
```

### Common Dependencies (all steps)
- lib/colors.sh
- lib/config.sh
- lib/utils.sh
- lib/git_cache.sh (for git operations)
- lib/ai_helpers.sh (for AI-enhanced steps)
- lib/backlog.sh (for issue tracking)
- lib/summary.sh (for summary generation)

---

## Expected Timeline

### Per Subphase
- Extraction: 10-15 minutes
- Testing: 5 minutes
- Commit: 2 minutes
- **Total per step:** ~20 minutes

### Full Phase 3
- 12 subphases × 20 minutes = **~4 hours**
- Buffer for complexity: +2 hours
- **Total estimate:** 6 hours

### Breakdown by Complexity

**Simple Steps (3-4 each):**
- Steps 0, 2, 3: Change analysis, consistency, script refs
- Estimated: ~15 min each

**Medium Steps (3-5 each):**
- Steps 1, 4, 5, 8: Docs, directory, test review, dependencies
- Estimated: ~20 min each

**Complex Steps (6-8 each):**
- Steps 6, 7, 9, 10, 11: Test gen, test exec, quality, context, git
- Estimated: ~30 min each

---

## Testing Strategy

### Per Module Testing
```bash
# 1. Syntax validation
bash -n steps/step_XX_name.sh

# 2. Function export test
source steps/step_XX_name.sh
declare -F step_XX_function_name

# 3. Dependency test
source lib/colors.sh lib/config.sh lib/utils.sh
source steps/step_XX_name.sh
echo "Dependencies OK"
```

### Integration Testing
After all subphases complete:
```bash
# Source all modules and test orchestration
./execute_tests_docs_workflow.sh --dry-run
```

---

## Completion Criteria

### Per Subphase
- ✅ Module file created in steps/
- ✅ Syntax validation passes
- ✅ Function exported correctly
- ✅ Committed to git
- ✅ Progress documented

### Phase 3 Complete
- ✅ All 12 step modules extracted
- ✅ All modules syntax validated
- ✅ 12 commits made (one per subphase)
- ✅ Progress metrics updated
- ✅ Ready for Phase 4 (orchestrator refactor)

---

## Risk Mitigation

### Potential Issues

1. **Function dependencies**
   - Solution: Extract helper functions with main step function
   
2. **Variable scope**
   - Solution: Ensure all required variables are imported from lib/

3. **AI prompt complexity**
   - Solution: Use lib/ai_helpers.sh prompt builders

4. **Test integration**
   - Solution: Keep original script intact, only add new modules

### Rollback Strategy

If a subphase has issues:
```bash
# Revert last commit
git reset HEAD~1

# Fix issues and recommit
# ... make corrections ...
git add steps/step_XX_name.sh
git commit -m "..."
```

---

## Post-Phase 3 Actions

After completing all 12 subphases:

1. **Run Full Test Suite**
   ```bash
   ./test_modules.sh
   ```

2. **Update Documentation**
   - Update README.md with all step modules
   - Mark Phase 3 complete
   - Document Phase 4 plan

3. **Create Completion Report**
   - Document extraction metrics
   - List all 12 modules created
   - Show before/after comparison

4. **Merge to Main**
   ```bash
   git checkout main
   git merge workflow-phase3
   ```

5. **Begin Phase 4**
   - Refactor main orchestrator
   - Remove extracted code from monolith
   - Add source statements
   - Target: < 300 lines

---

## Quick Start

To begin Phase 3:

```bash
# 1. Create branch
git checkout -b workflow-phase3

# 2. Start with Phase 3.1
# Extract step0_analyze_changes()
# Create steps/step_00_analyze.sh
# Test and commit

# 3. Continue through 3.2-3.12
# Following the same pattern for each step
```

---

## References

- Split Plan: `/docs/WORKFLOW_SCRIPT_SPLIT_PLAN.md`
- Phase 1 Report: `/docs/WORKFLOW_MODULARIZATION_PHASE1_COMPLETION.md`
- Phase 2 Report: `/docs/WORKFLOW_MODULARIZATION_PHASE2_COMPLETION.md`
- Module README: `/shell_scripts/workflow/README.md`
- Original Script: `/shell_scripts/workflow/execute_tests_docs_workflow.sh`

---

**Status:** READY TO BEGIN  
**Next Action:** Start Phase 3.1 (Step 0: Change Analysis)  
**Estimated Time:** 6 hours for all 12 subphases
