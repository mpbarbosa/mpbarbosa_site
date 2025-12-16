# AI Prompt Extraction Standard

**Version**: 1.0.0  
**Date**: 2025-01-13  
**Status**: Active Project Standard

## Overview

This document establishes the project standard for extracting AI prompts from workflow step modules into the centralized AI helpers library.

## Purpose

- **Reusability**: AI prompts can be reused across multiple workflow steps
- **Maintainability**: Centralized prompts are easier to update and improve
- **Consistency**: All steps use the same prompt building patterns
- **Testing**: Isolated prompt functions are easier to test
- **Documentation**: AI prompt library serves as documentation for AI integration patterns

## Standard Practice

### 1. Extract AI Prompts to Library

All AI prompts used in workflow steps MUST be extracted to `shell_scripts/workflow/lib/ai_helpers.sh` as reusable functions.

**Before** (Anti-pattern):
```bash
# In step file: step_02_consistency.sh
local copilot_prompt="**Role**: You are a senior technical documentation specialist...

**Task**: Perform a comprehensive documentation consistency analysis...
# ... 50+ lines of embedded prompt text
"
```

**After** (Correct pattern):
```bash
# In ai_helpers.sh
build_step2_consistency_prompt() {
    local doc_count="$1"
    local change_scope="$2"
    local modified_count="$3"
    local broken_refs_content="$4"
    local doc_files="$5"

    cat << 'EOF'
**Role**: You are a senior technical documentation specialist...
**Task**: Perform a comprehensive documentation consistency analysis...
EOF
}

## In step file: step_02_consistency.sh
local copilot_prompt
copilot_prompt=$(build_step2_consistency_prompt \
    "$doc_count" \
    "${CHANGE_SCOPE}" \
    "${ANALYSIS_MODIFIED}" \
    "$broken_refs_content" \
    "$doc_files")
```

### 2. Naming Convention

Prompt builder functions MUST follow this naming pattern:

```bash
build_step{N}_{description}_prompt
```

**Examples**:
- `build_step2_consistency_prompt` - Step 2 consistency analysis
- `build_step11_git_commit_prompt` - Step 11 git commit message generation
- `build_step12_markdown_lint_prompt` - Step 12 markdown linting

### 3. Function Structure

All prompt builder functions MUST:

1. Accept parameters for dynamic content
2. Use heredoc (`cat << EOF`) for multi-line prompts
3. Include proper parameter expansion with `${variable}` syntax
4. Return the complete prompt string
5. Be exported for use in step modules

**Template**:
```bash
# Build {description} prompt (Step {N})
# Usage: build_step{N}_{description}_prompt [param1] [param2] ...
build_step{N}_{description}_prompt() {
    local param1="$1"
    local param2="$2"

    cat << 'EOF'
**Role**: You are a {role description}

**Task**: {task description}

**Context:**
- Project: ${PROJECT_NAME}
- Parameter 1: ${param1}
- Parameter 2: ${param2}

**Analysis Tasks:**
{task details}

**Expected Output:**
{output format}
EOF
}

## Export the function
export -f build_step{N}_{description}_prompt
```

### 4. Required Sections

All AI prompts MUST include these sections:

1. **Role**: AI persona definition with expertise areas
2. **Task**: Clear description of what the AI should do
3. **Context**: Project information and relevant data
4. **Analysis Tasks** or **Requirements**: Detailed task breakdown
5. **Expected Output**: Format and structure of desired response
6. **Standards** or **Approach**: Guidelines for AI to follow

### 5. Documentation Requirements

Each prompt builder function MUST include:

- Function comment header with description
- Usage example with parameter names
- Step number reference in function name and comment
- Export statement at end of ai_helpers.sh

## Implementation Checklist

When extracting a new AI prompt:

- [ ] Create `build_step{N}_{description}_prompt` function in ai_helpers.sh
- [ ] Move prompt text from step file to new function
- [ ] Identify dynamic values and add as function parameters
- [ ] Update step file to call prompt builder function
- [ ] Add export statement to ai_helpers.sh
- [ ] Test prompt generation with sample data
- [ ] Document function with usage comment
- [ ] Update this standard if new patterns emerge

## Benefits

### Code Reduction
- **Step files**: 50-100 lines of prompt text removed per step
- **Reusability**: Same prompt can be used across multiple steps
- **Total savings**: ~500-1000 lines across all 13 workflow steps

### Maintainability
- **Single source of truth**: Update prompt in one place
- **Version control**: Easy to track prompt evolution
- **Testing**: Isolated functions easier to unit test
- **Review**: AI prompts are easier to review in centralized library

### Quality Improvements
- **Consistency**: All prompts follow same structure
- **Best practices**: Prompt engineering patterns documented
- **Refinement**: Easier to A/B test and improve prompts
- **Knowledge sharing**: New team members can learn from prompt library

## Example: Step 2 Consistency Analysis

### Original Implementation (Before)
**File**: `shell_scripts/workflow/steps/step_02_consistency.sh` (53 lines of embedded prompt)

```bash
local copilot_prompt="**Role**: You are a senior technical...
# ... 50 more lines ...
Please analyze the documentation files and provide a detailed consistency report."
```

### Extracted Implementation (After)

**File**: `shell_scripts/workflow/lib/ai_helpers.sh`
```bash
build_step2_consistency_prompt() {
    local doc_count="$1"
    local change_scope="$2"
    local modified_count="$3"
    local broken_refs_content="$4"
    local doc_files="$5"

    cat << 'EOF'
**Role**: You are a senior technical documentation specialist...
# ... complete prompt with parameter expansion ...
EOF
}
export -f build_step2_consistency_prompt
```

**File**: `shell_scripts/workflow/steps/step_02_consistency.sh`
```bash
local copilot_prompt
copilot_prompt=$(build_step2_consistency_prompt \
    "$doc_count" \
    "${CHANGE_SCOPE}" \
    "${ANALYSIS_MODIFIED}" \
    "$broken_refs_content" \
    "$doc_files")
```

**Result**:

- Step file reduced by 53 lines
- Prompt now reusable
- Easier to maintain and test
- Better separation of concerns

## Compliance

All workflow steps using AI prompts MUST comply with this standard. Non-compliant implementations should be refactored during code review or maintenance cycles.

## Related Documentation

- **AI Integration Guide**: `shell_scripts/workflow/README.md`
- **AI Helpers Library**: `shell_scripts/workflow/lib/ai_helpers.sh`
- **Workflow Architecture**: `docs/WORKFLOW_MODULARIZATION_PHASE3_COMPLETION.md`

## Revision History

| Version | Date       | Changes                                    |
|---------|------------|--------------------------------------------|
| 1.0.0   | 2025-01-13 | Initial standard based on Step 2 extraction |
