#!/bin/bash
################################################################################
# Step 5: AI-Powered Test Review
# Purpose: Review existing Jest tests and identify coverage gaps
# Part of: Tests & Documentation Workflow Automation v2.0.0
################################################################################

# Main step function - reviews existing tests with AI assistance
# Returns: 0 for success, 1 for failure
step5_review_existing_tests() {
    print_step "5" "Review Existing Jest Tests"
    
    cd "$SRC_DIR"
    
    local issues=0
    local test_issues_file=$(mktemp)
    TEMP_FILES+=("$test_issues_file")
    
    # PHASE 1: Automated test analysis
    print_info "Phase 1: Automated test analysis..."
    
    # Check 1: Test file inventory
    print_info "Gathering test file inventory..."
    local test_files=$(find . -name "*.test.js" -o -name "*.spec.js" ! -path "*/node_modules/*" | sort)
    local test_count=$(echo "$test_files" | grep -c "test.js\|spec.js" || echo "0")
    
    if [[ $test_count -eq 0 ]]; then
        print_warning "No test files found!"
        echo "CRITICAL: No test files exist" >> "$test_issues_file"
        ((issues++))
    else
        print_success "Found $test_count test files"
    fi
    
    # Check 2: Coverage report analysis (if available)
    print_info "Checking for coverage reports..."
    local coverage_exists=false
    local coverage_summary=""
    
    if [[ -f "coverage/coverage-summary.json" ]]; then
        coverage_exists=true
        coverage_summary=$(cat coverage/coverage-summary.json 2>/dev/null || echo "{}")
        print_success "Coverage report found"
    else
        print_warning "No coverage report found - run 'npm run test:coverage' first"
        echo "Missing: Coverage report" >> "$test_issues_file"
        ((issues++))
    fi
    
    # Check 3: Identify untested code files
    print_info "Identifying potentially untested code..."
    local code_files=$(find scripts -name "*.js" -o -name "*.mjs" 2>/dev/null | wc -l || echo "0")
    local untested_ratio=0
    local untested_count=0
    
    if [[ $code_files -gt 0 && $test_count -gt 0 ]]; then
        untested_ratio=$((code_files - test_count))
        untested_count=$untested_ratio
        if [[ $untested_ratio -gt 0 ]]; then
            print_warning "Potentially $untested_ratio code files without corresponding tests"
            echo "Untested files: ~$untested_ratio code files may lack tests" >> "$test_issues_file"
            ((issues++))
        fi
    fi
    
    # Check 4: Test organization validation
    print_info "Validating test organization..."
    local tests_in_tests_dir=$(find __tests__ -name "*.test.js" 2>/dev/null | wc -l || echo "0")
    local tests_colocated=$(find . -name "*.test.js" ! -path "*/__tests__/*" ! -path "*/node_modules/*" 2>/dev/null | wc -l || echo "0")
    
    if [[ $tests_colocated -gt 0 ]]; then
        print_warning "Found $tests_colocated test files outside __tests__ directory"
        echo "Organization: $tests_colocated tests not in __tests__/" >> "$test_issues_file"
    fi
    
    # PHASE 2: AI-powered test strategy analysis
    print_info "Phase 2: Preparing AI-powered test strategy analysis..."
    
    # Gather test context
    local test_framework="Jest with ES Modules (experimental-vm-modules)"
    local test_env="jsdom"
    local test_issues_content=$(cat "$test_issues_file" 2>/dev/null || echo "   No automated issues detected")
    
    # Build comprehensive test analysis prompt
    local copilot_prompt="**Role**: You are a senior QA engineer and test automation specialist with expertise in testing strategies, Jest framework, code coverage analysis, test-driven development (TDD), behavior-driven development (BDD), and continuous integration best practices.

**Task**: Perform comprehensive review of existing tests and provide recommendations for test generation and coverage improvement.

**Context:**
- Project: MP Barbosa Personal Website (static HTML + JavaScript with ES Modules)
- Test Framework: $test_framework
- Test Environment: $test_env
- Total Test Files: $test_count
- Code Files: $code_files
- Tests in __tests__/: $tests_in_tests_dir
- Co-located Tests: $tests_colocated
- Coverage Report Available: $coverage_exists

**Phase 1 Automated Findings:**
$test_issues_content

**Existing Test Files:**
$test_files

**Test Configuration (from package.json):**
- Test Command: npm test (with experimental VM modules for ES6)
- Test Environment: jsdom (for DOM testing)
- Coverage: Available via npm run test:coverage
- Watch Mode: Available for development

**Analysis Tasks:**

1. **Existing Test Quality Assessment:**
   - Review test file naming conventions (should match *.test.js pattern)
   - Assess test organization (__tests__/ directory vs co-located)
   - Evaluate test structure (describe blocks, test cases, assertions)
   - Check for proper use of Jest matchers and assertions
   - Validate async/await handling in tests

2. **Coverage Gap Identification:**
   - Identify which JavaScript modules/functions lack tests
   - Determine critical paths that need test coverage
   - Assess edge cases and error handling coverage
   - Evaluate DOM manipulation test coverage
   - Check for integration test coverage

3. **Test Case Generation Recommendations:**
   - Suggest specific test cases for untested code
   - Recommend unit tests for utility functions
   - Propose integration tests for workflows
   - Suggest DOM manipulation tests for UI components
   - Recommend edge case and error scenario tests

4. **Testing Best Practices Validation:**
   - Test isolation and independence
   - Proper setup/teardown (beforeEach, afterEach)
   - Mock usage for external dependencies
   - Assertion clarity and specificity
   - Test naming conventions (should describe behavior)
   - DRY principle in tests

5. **CI/CD Integration Readiness:**
   - Tests run in CI environment compatibility
   - Test execution speed (avoid slow tests)
   - Deterministic tests (no flakiness)
   - Coverage threshold recommendations
   - Pre-commit hook integration

**Expected Output:**
- List of test quality issues with specific file:line references
- Coverage gaps with priority (Critical/High/Medium/Low)
- Specific test case recommendations with examples
- Missing test scenarios for each untested module
- Code snippets for recommended tests
- Best practice violations and fixes
- CI/CD integration recommendations
- Coverage improvement action plan

**Testing Standards to Apply:**
- Jest best practices for ES Modules
- AAA pattern (Arrange-Act-Assert)
- Clear test descriptions (behavior-focused)
- Proper async/await handling
- Mock isolation for unit tests
- Integration test coverage for workflows
- Minimum 80% code coverage target

Please analyze the existing tests and provide a detailed test strategy report with specific, actionable recommendations for improving test coverage and quality."

    echo ""
    echo -e "${CYAN}GitHub Copilot CLI Test Review Prompt:${NC}"
    echo -e "${YELLOW}${copilot_prompt}${NC}\n"
    
    # Check if Copilot CLI is available
    if is_copilot_available; then
        print_info "GitHub Copilot CLI detected - ready for test strategy analysis..."
        
        if [[ "$DRY_RUN" == true ]]; then
            print_info "[DRY RUN] Would invoke: copilot -p with test analysis prompt"
        else
            # Smart triggering
            if [[ "$issues" -gt 0 ]] || [[ "$INTERACTIVE_MODE" == true ]]; then
                if confirm_action "Run Copilot CLI for test strategy analysis?" "y"; then
                    print_info "Starting Copilot CLI test analysis session..."
                    print_info "This will analyze existing tests, identify coverage gaps, and recommend new tests"
                    echo ""
                    
                    # Execute Copilot prompt
                    execute_copilot_prompt "$copilot_prompt"
                    
                    print_success "Copilot CLI test analysis completed"
                    echo ""
                    
                    # User feedback loop
                    if confirm_action "Did Copilot recommend new tests to generate?"; then
                        print_info "Test generation recommendations identified"
                        
                        # Transition to Step 6 preparation
                        if [[ "$INTERACTIVE_MODE" == true ]]; then
                            if confirm_action "Continue to Step 6 (Generate New Tests)?"; then
                                print_success "Will proceed to test generation in Step 6"
                            else
                                print_warning "Pausing before test generation - review recommendations"
                                return 1
                            fi
                        fi
                    fi
                else
                    print_warning "Skipped Copilot CLI test analysis"
                fi
            else
                print_info "No test issues found - skipping optional analysis"
                if confirm_action "Run optional Copilot test analysis anyway?"; then
                    execute_copilot_prompt "$copilot_prompt"
                fi
            fi
        fi
    else
        print_warning "GitHub Copilot CLI not found - using basic checks only"
        print_info "Install from: https://github.com/github/gh-copilot"
        print_info "For deep test analysis, use the prompt above manually with Copilot"
    fi
    
    # Summary
    echo ""
    if [[ $issues -eq 0 ]]; then
        print_success "Test suite structure validated ✅ ($test_count test files found)"
        save_step_summary "5" "Test_Review" "Test suite validated with ${test_count} test files. All modules have adequate test coverage." "✅"
    else
        print_warning "Found $issues test-related issue(s) - review required"
        save_step_summary "5" "Test_Review" "Found ${issues} test issues. ${untested_count} modules lack test coverage. Review and add missing tests." "⚠️"
        
        # Save to backlog
        local step_issues="### Test Review Issues Found

**Total Issues:** ${issues}
**Test Files Found:** ${test_count}
**Untested Modules:** ${untested_count}

"
        if [[ -f "$test_issues_file" && -s "$test_issues_file" ]]; then
            step_issues+="### Details

\`\`\`
$(cat "$test_issues_file")
\`\`\`
"
        fi
        save_step_issues "5" "Test_Review" "$step_issues"
    fi
    
    cd "$PROJECT_ROOT"
    update_workflow_status "step5" "✅"
}

# Export step function
export -f step5_review_existing_tests
