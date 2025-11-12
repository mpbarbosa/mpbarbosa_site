#!/bin/bash
################################################################################
# Step 7: AI-Powered Test Execution and Analysis
# Purpose: Execute Jest test suite and analyze results with AI
# Part of: Tests & Documentation Workflow Automation v2.0.0
################################################################################

# Main step function - executes tests and analyzes results with AI
# Returns: 0 for success (or user override), 1 for failure
step7_execute_test_suite() {
    print_step "7" "Execute Full Test Suite with AI Analysis"
    
    cd "$SRC_DIR"
    
    local test_failures=0
    local test_results_file=$(mktemp)
    local coverage_summary_file=$(mktemp)
    TEMP_FILES+=("$test_results_file" "$coverage_summary_file")
    
    # PHASE 1: Automated test execution
    print_info "Phase 1: Executing Jest test suite..."
    
    # Check 1: Run full test suite
    print_info "Running tests with coverage..."
    local test_exit_code=0
    
    if [[ "$DRY_RUN" == true ]]; then
        print_info "[DRY RUN] Would execute: npm run test:coverage"
        test_exit_code=0
    else
        # Run tests and capture output
        if npm run test:coverage > "$test_results_file" 2>&1; then
            test_exit_code=0
            print_success "All tests passed ✅"
        else
            test_exit_code=$?
            test_failures=1
            print_warning "Some tests failed - analyzing results..."
        fi
    fi
    
    # Check 2: Parse test results
    print_info "Parsing test results..."
    local tests_total=0
    local tests_passed=0
    local tests_failed=0
    
    if [[ -f "$test_results_file" ]]; then
        # Extract Jest summary
        tests_total=$(grep -oP 'Tests:.*\K\d+(?= total)' "$test_results_file" 2>/dev/null || echo "0")
        tests_passed=$(grep -oP 'Tests:.*\K\d+(?= passed)' "$test_results_file" 2>/dev/null || echo "0")
        tests_failed=$(grep -oP 'Tests:.*\K\d+(?= failed)' "$test_results_file" 2>/dev/null || echo "0")
        
        print_info "Test Results: $tests_passed passed, $tests_failed failed, $tests_total total"
    fi
    
    # Check 3: Extract coverage metrics
    print_info "Analyzing coverage report..."
    local coverage_statements=0
    local coverage_branches=0
    local coverage_functions=0
    local coverage_lines=0
    
    if [[ -f "coverage/coverage-summary.json" ]]; then
        cp "coverage/coverage-summary.json" "$coverage_summary_file"
        
        # Extract total coverage percentages
        if command -v jq &> /dev/null; then
            coverage_statements=$(jq '.total.statements.pct' "$coverage_summary_file" 2>/dev/null || echo "0")
            coverage_branches=$(jq '.total.branches.pct' "$coverage_summary_file" 2>/dev/null || echo "0")
            coverage_functions=$(jq '.total.functions.pct' "$coverage_summary_file" 2>/dev/null || echo "0")
            coverage_lines=$(jq '.total.lines.pct' "$coverage_summary_file" 2>/dev/null || echo "0")
            
            print_info "Coverage: Statements: ${coverage_statements}%, Branches: ${coverage_branches}%, Functions: ${coverage_functions}%, Lines: ${coverage_lines}%"
        else
            print_warning "jq not found - detailed coverage parsing unavailable"
        fi
    else
        print_warning "Coverage report not found"
    fi
    
    # Check 4: Identify failed tests
    local failed_test_list=""
    if [[ $tests_failed -gt 0 ]] && [[ -f "$test_results_file" ]]; then
        # Extract failed test names
        failed_test_list=$(grep -A 5 "FAIL" "$test_results_file" 2>/dev/null || echo "Unable to extract failed tests")
    fi
    
    # PHASE 2: AI-powered test results analysis
    print_info "Phase 2: Preparing AI-powered test results analysis..."
    
    # Build test execution summary
    local execution_summary="Test Execution Summary:
- Total Tests: $tests_total
- Passed: $tests_passed
- Failed: $tests_failed
- Exit Code: $test_exit_code

Coverage Metrics:
- Statements: ${coverage_statements}%
- Branches: ${coverage_branches}%
- Functions: ${coverage_functions}%
- Lines: ${coverage_lines}%"
    
    local test_output=$(cat "$test_results_file" 2>/dev/null | head -100 || echo "Test output unavailable")
    
    # Build comprehensive test analysis prompt
    local copilot_prompt="**Role**: You are a senior CI/CD engineer and test results analyst with expertise in test execution diagnostics, failure root cause analysis, code coverage interpretation, performance optimization, and continuous integration best practices.

**Task**: Analyze test execution results, diagnose failures, and provide actionable recommendations for improving test suite quality and CI/CD integration.

**Context:**
- Project: MP Barbosa Personal Website (static HTML + JavaScript with ES Modules)
- Test Framework: Jest with ES Modules (experimental-vm-modules)
- Test Command: npm run test:coverage
- Exit Code: $test_exit_code
- Total Tests: $tests_total
- Passed: $tests_passed
- Failed: $tests_failed

**Test Execution Results:**
$execution_summary

**Test Output:**
$test_output

**Failed Tests:**
$failed_test_list

**Analysis Tasks:**

1. **Test Failure Root Cause Analysis:**
   - Identify why tests failed (assertion errors, runtime errors, timeouts)
   - Determine if failures are code bugs or test issues
   - Categorize failures (breaking changes, environment issues, flaky tests)
   - Provide specific fix recommendations for each failure
   - Priority level (Critical/High/Medium/Low) for each failure

2. **Coverage Gap Interpretation:**
   - Analyze coverage metrics (statements, branches, functions, lines)
   - Identify which modules have low coverage
   - Determine if coverage meets 80% target
   - Recommend areas for additional test coverage
   - Prioritize coverage improvements

3. **Performance Bottleneck Detection:**
   - Identify slow-running tests (if timing data available)
   - Detect tests with heavy setup/teardown
   - Find tests that could be parallelized
   - Recommend test execution optimizations
   - Suggest mocking strategies for faster tests

4. **Flaky Test Identification:**
   - Detect non-deterministic test behavior
   - Identify timing-dependent tests
   - Find tests with external dependencies
   - Recommend fixes for flaky tests
   - Suggest test isolation improvements

5. **CI/CD Optimization Recommendations:**
   - Suggest test splitting strategies for CI
   - Recommend caching strategies
   - Propose pre-commit hook configurations
   - Suggest coverage thresholds for CI gates
   - Recommend test parallelization approaches

**Expected Output:**
- Root cause analysis for each failure with file:line:test references
- Specific code fixes or test modifications needed
- Coverage improvement action plan
- Performance optimization recommendations
- Flaky test remediation steps
- CI/CD integration best practices
- Priority-ordered action items
- Estimated effort for each fix

Please provide a comprehensive test results analysis with specific, actionable recommendations."

    echo ""
    echo -e "${CYAN}GitHub Copilot CLI Test Results Analysis Prompt:${NC}"
    echo -e "${YELLOW}${copilot_prompt}${NC}\n"
    
    # Check if Copilot CLI is available
    if is_copilot_available; then
        print_info "GitHub Copilot CLI detected - ready for test results analysis..."
        
        if [[ "$DRY_RUN" == true ]]; then
            print_info "[DRY RUN] Would invoke: copilot -p with test analysis prompt"
        else
            # Smart triggering: Always analyze if tests failed
            if [[ $test_failures -gt 0 ]]; then
                print_warning "Tests failed - running AI failure analysis..."
                
                if confirm_action "Analyze test failures with Copilot CLI?"; then
                    print_info "Starting Copilot CLI test results analysis..."
                    echo ""
                    
                    # Execute Copilot prompt
                    execute_copilot_prompt "$copilot_prompt"
                    
                    print_success "Copilot CLI test analysis completed"
                    echo ""
                    
                    # User decision on proceeding
                    if ! confirm_action "Continue workflow despite test failures?"; then
                        print_error "Workflow paused - fix test failures before continuing"
                        return 1
                    else
                        test_exit_code=0
                    fi
                else
                    print_warning "Skipped AI analysis - manual review required"
                    if ! confirm_action "Continue anyway?"; then
                        return 1
                    else
                        test_exit_code=0
                    fi
                fi
            else
                print_success "All tests passed!"
                if [[ "$INTERACTIVE_MODE" == true ]]; then
                    if confirm_action "Run optional Copilot coverage analysis?"; then
                        execute_copilot_prompt "$copilot_prompt"
                    fi
                fi
            fi
        fi
    else
        print_warning "GitHub Copilot CLI not found - manual analysis required"
        print_info "Install from: https://github.com/github/gh-copilot"
        
        # Still fail workflow if tests failed
        if [[ $test_failures -gt 0 ]] && [[ "$INTERACTIVE_MODE" == true ]]; then
            if ! confirm_action "Continue despite test failures?"; then
                return 1
            else
                test_exit_code=0
            fi
        fi
    fi
    
    # Summary
    echo ""
    if [[ $test_exit_code -eq 0 ]]; then
        print_success "Test suite executed successfully ✅ ($tests_passed/$tests_total passed)"
        print_success "Coverage: Lines ${coverage_lines}%, Branches ${coverage_branches}%"
        save_step_summary "7" "Test_Execution" "All ${tests_total} tests passed. Coverage: ${coverage_lines}% lines, ${coverage_branches}% branches. Test suite healthy." "✅"
    else
        print_error "Test suite failed ❌ ($tests_failed/$tests_total failed)"
        if [[ "$AUTO_MODE" == false ]]; then
            print_warning "Review failures before continuing workflow"
        fi
        save_step_summary "7" "Test_Execution" "${tests_failed} of ${tests_total} tests failed. Review failures and fix broken tests. Coverage: ${coverage_lines}% lines." "❌"
    fi
    
    # Save to backlog
    local step_issues="### Test Execution Results

**Total Tests:** ${tests_total}
**Passed:** ${tests_passed}
**Failed:** ${tests_failed}
**Exit Code:** ${test_exit_code}

### Coverage Metrics

- **Statements:** ${coverage_statements}%
- **Branches:** ${coverage_branches}%
- **Functions:** ${coverage_functions}%
- **Lines:** ${coverage_lines}%

"
    if [[ $tests_failed -gt 0 ]] && [[ -f "$test_results_file" && -s "$test_results_file" ]]; then
        step_issues+="### Test Output

\`\`\`
$(cat "$test_results_file")
\`\`\`
"
    fi
    save_step_issues "7" "Test_Execution" "$step_issues"
    
    cd "$PROJECT_ROOT"
    update_workflow_status "step7" "✅"
    
    return $test_exit_code
}

# Export step function
export -f step7_execute_test_suite
