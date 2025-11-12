#!/bin/bash
################################################################################
# AI Helpers Module
# Purpose: AI prompt templates and Copilot CLI integration helpers
# Part of: Tests & Documentation Workflow Automation v2.0.0
################################################################################

# ==============================================================================
# COPILOT CLI DETECTION AND VALIDATION
# ==============================================================================

# Check if Copilot CLI is available
# Returns: 0 if available, 1 if not
is_copilot_available() {
    command -v copilot &> /dev/null
}

# Validate Copilot CLI and provide user feedback
# Usage: validate_copilot_cli
validate_copilot_cli() {
    if is_copilot_available; then
        print_success "GitHub Copilot CLI detected"
        return 0
    else
        print_warning "GitHub Copilot CLI not found"
        print_info "Install with: npm install -g @githubnext/github-copilot-cli"
        return 1
    fi
}

# ==============================================================================
# AI PROMPT BUILDING
# ==============================================================================

# Build a structured AI prompt with role, task, and standards
# Usage: build_ai_prompt <role> <task> <standards>
build_ai_prompt() {
    local role="$1"
    local task="$2"
    local standards="$3"
    
    cat << EOF
**Role**: ${role}

**Task**: ${task}

**Approach**: ${standards}
EOF
}

# Build a documentation analysis prompt
# Usage: build_doc_analysis_prompt <changed_files> <doc_files>
build_doc_analysis_prompt() {
    local changed_files="$1"
    local doc_files="$2"
    
    build_ai_prompt \
        "You are a senior technical documentation specialist with expertise in software architecture documentation, API documentation, and developer experience (DX) optimization." \
        "Based on the recent changes to the following files: ${changed_files}

Please update all related documentation including:
1. .github/copilot-instructions.md - Update project overview, architecture patterns, key files
2. README.md - Update if public-facing features or setup instructions changed
3. /docs/ directory - Update technical documentation for architecture or feature changes
4. shell_scripts/README.md - Update if shell scripts were modified
5. Inline code comments - Add/update comments for complex logic

Documentation to review: ${doc_files}" \
        "- Analyze the git diff to understand what changed
- Update only the documentation sections affected by these changes
- Be surgical and precise - don't modify unrelated documentation
- Ensure consistency in terminology, formatting, and style
- Maintain professional technical writing standards"
}

# Build a consistency analysis prompt
# Usage: build_consistency_prompt <files_to_check>
build_consistency_prompt() {
    local files_to_check="$1"
    
    build_ai_prompt \
        "You are a documentation specialist and information architect with expertise in content consistency, cross-reference validation, and documentation quality assurance." \
        "Perform a deep consistency analysis across the following documentation files: ${files_to_check}

Check for:
1. **Cross-Reference Accuracy** - All links and references point to correct locations
2. **Version Consistency** - Version numbers match across all files
3. **Terminology Consistency** - Same concepts use same terms throughout
4. **Format Consistency** - Headings, lists, code blocks follow same patterns
5. **Content Completeness** - No missing sections or incomplete information" \
        "- Read all documentation files thoroughly
- Create a comprehensive consistency report
- Identify specific inconsistencies with file names and line numbers
- Suggest fixes for each inconsistency found
- Prioritize issues by severity (Critical, High, Medium, Low)"
}

# Build a test strategy analysis prompt
# Usage: build_test_strategy_prompt <coverage_stats> <test_files>
build_test_strategy_prompt() {
    local coverage_stats="$1"
    local test_files="$2"
    
    build_ai_prompt \
        "You are a QA engineer and test automation specialist with expertise in test strategy, coverage analysis, and test-driven development (TDD)." \
        "Based on the current test coverage statistics: ${coverage_stats}

And existing test files: ${test_files}

Recommend:
1. **New tests to generate** - Identify untested or undertested code paths
2. **Test improvements** - Suggest enhancements to existing tests
3. **Coverage gaps** - Highlight areas with low or missing coverage
4. **Test patterns** - Recommend best practices for this codebase" \
        "- Analyze coverage reports to identify gaps
- Consider edge cases and error scenarios
- Recommend specific test cases with clear descriptions
- Prioritize tests by importance and coverage impact
- Follow Jest testing patterns and best practices"
}

# Build a code quality validation prompt
# Usage: build_quality_prompt <files_to_review>
build_quality_prompt() {
    local files_to_review="$1"
    
    build_ai_prompt \
        "You are a software quality engineer and code review specialist with expertise in code quality standards, best practices, and maintainability." \
        "Review the following files for code quality: ${files_to_review}

Analyze:
1. **Code Organization** - Logical structure and separation of concerns
2. **Naming Conventions** - Clear, consistent, and descriptive names
3. **Error Handling** - Proper error handling and edge cases
4. **Documentation** - Inline comments and function documentation
5. **Best Practices** - Following language-specific best practices
6. **Potential Issues** - Security concerns, performance issues, bugs" \
        "- Review each file systematically
- Identify specific issues with file names and line numbers
- Suggest concrete improvements
- Prioritize findings by severity
- Provide code examples for recommended fixes"
}

# ==============================================================================
# AI PROMPT EXECUTION
# ==============================================================================

# Execute a Copilot CLI prompt with proper error handling
# Usage: execute_copilot_prompt <prompt_text> [log_file]
execute_copilot_prompt() {
    local prompt_text="$1"
    local log_file="${2:-}"
    
    if [[ "$AUTO_MODE" == true ]]; then
        print_info "Auto mode: Skipping AI prompt execution"
        return 0
    fi
    
    if ! is_copilot_available; then
        print_warning "Copilot CLI not available, skipping AI analysis"
        return 1
    fi
    
    print_info "Executing Copilot CLI prompt..."
    
    if [[ -n "$log_file" ]]; then
        copilot -p "$prompt_text" --allow-all-tools 2>&1 | tee "$log_file"
    else
        copilot -p "$prompt_text" --allow-all-tools
    fi
    
    local exit_code=$?
    
    if [[ $exit_code -eq 0 ]]; then
        print_success "Copilot CLI analysis completed"
        return 0
    else
        print_error "Copilot CLI execution failed (exit code: $exit_code)"
        return 1
    fi
}

# Trigger an AI-enhanced step with confirmation
# Usage: trigger_ai_step <step_name> <prompt_builder_function> <args...>
trigger_ai_step() {
    local step_name="$1"
    local prompt_builder="$2"
    shift 2
    local args=("$@")
    
    if [[ "$AUTO_MODE" == true ]]; then
        print_info "Auto mode: Skipping AI step for ${step_name}"
        return 0
    fi
    
    if ! is_copilot_available; then
        print_info "Copilot CLI not available for ${step_name}"
        return 1
    fi
    
    if ! confirm_action "Run Copilot CLI for ${step_name}?" "y"; then
        print_info "Skipped AI analysis for ${step_name}"
        return 0
    fi
    
    local prompt=$("$prompt_builder" "${args[@]}")
    execute_copilot_prompt "$prompt"
}

# Export all AI helper functions
export -f is_copilot_available
export -f validate_copilot_cli
export -f build_ai_prompt
export -f build_doc_analysis_prompt
export -f build_consistency_prompt
export -f build_test_strategy_prompt
export -f build_quality_prompt
export -f execute_copilot_prompt
export -f trigger_ai_step
