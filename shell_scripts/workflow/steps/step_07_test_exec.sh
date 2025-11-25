#!/bin/bash
################################################################################
# Step 7: AI-Powered Test Execution and Analysis
# Purpose: Execute Jest test suite and analyze results with AI
# Part of: Tests & Documentation Workflow Automation v2.0.0
# Version: 2.0.0
################################################################################

# Module version information
readonly STEP7_VERSION="2.0.0"
readonly STEP7_VERSION_MAJOR=2
readonly STEP7_VERSION_MINOR=0
readonly STEP7_VERSION_PATCH=0

# Main step function - executes tests and analyzes results with AI
# Returns: 0 for success (or user override), 1 for failure
step7_execute_test_suite() {
    print_step "7" "Execute Full Test Suite with AI Analysis"
    
    cd "$SRC_DIR" || return 1
    
    local test_failures=0
    local test_results_file
    local coverage_summary_file
    
    test_results_file=$(mktemp)
    coverage_summary_file=$(mktemp)
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
    
    local test_output
    test_output=$(cat "$test_results_file" 2>/dev/null | head -100 || echo "Test output unavailable")
    
    # Build comprehensive test analysis prompt using AI helper function
    local copilot_prompt
    copilot_prompt=$(build_step7_test_exec_prompt \
        "$test_exit_code" \
        "$tests_total" \
        "$tests_passed" \
        "$tests_failed" \
        "$execution_summary" \
        "$test_output" \
        "$failed_test_list")

    echo ""
    echo -e "${CYAN}GitHub Copilot CLI Test Results Analysis Prompt:${NC}"
    echo -e "${YELLOW}${copilot_prompt}${NC}\n"
    
    # PHASE 2: Execute AI analysis with manual issue tracking
    if [[ "$DRY_RUN" == true ]]; then
        print_info "[DRY RUN] Would invoke: copilot -p with test results analysis prompt"
    else
        if confirm_action "Run GitHub Copilot CLI to analyze test results?" "y"; then
            # Save prompt to temporary file for tracking
            local temp_prompt_file
            temp_prompt_file=$(mktemp)
            TEMP_FILES+=("$temp_prompt_file")
            echo "$copilot_prompt" > "$temp_prompt_file"
            
            # Invoke Copilot CLI
            print_info "Starting Copilot CLI session..."
            
            # Create log file with unique timestamp
            local log_timestamp
            log_timestamp=$(date +%Y%m%d_%H%M%S_%N | cut -c1-21)
            local log_file="${LOGS_RUN_DIR}/step7_copilot_test_analysis_${log_timestamp}.log"
            print_info "Logging output to: $log_file"
            
            # Execute Copilot prompt
            execute_copilot_prompt "$copilot_prompt" "$log_file"
            
            print_success "GitHub Copilot CLI session completed"
            print_info "Full session log saved to: $log_file"
            
            # Ask user if they want to save issues from the Copilot session
            if confirm_action "Do you want to save issues from the Copilot session to the backlog?" "n"; then
                if [[ -f "$log_file" ]]; then
                    local log_content
                    log_content=$(cat "$log_file")
                    
                    # Build issue extraction prompt using helper function
                    local extract_prompt
                    extract_prompt=$(build_issue_extraction_prompt "$log_file" "$log_content")

                    echo -e "\n${CYAN}Issue Extraction Prompt:${NC}"
                    echo -e "${YELLOW}${extract_prompt}${NC}\n"
                    
                    if confirm_action "Run GitHub Copilot CLI to extract and organize issues from the log?" "y"; then
                        sleep 1
                        print_info "Starting Copilot CLI session for issue extraction..."
                        copilot -p "$extract_prompt" --allow-all-tools
                        
                        print_info "Please copy the organized issues from Copilot output."
                        print_info "Paste the organized issues (multi-line input). Type 'END' on a new line when finished:"
                        
                        local organized_issues=""
                        local line
                        while IFS= read -r line; do
                            if [[ "$line" == "END" ]]; then
                                break
                            fi
                            organized_issues+="${line}"$'\n'
                        done
                        
                        if [[ -n "$organized_issues" ]]; then
                            save_step_issues "7" "Test_Execution" "$organized_issues"
                            print_success "Issues extracted from log and saved to backlog"
                        else
                            print_warning "No organized issues provided - skipping backlog save"
                        fi
                    else
                        print_warning "Skipped issue extraction - no backlog file created"
                    fi
                else
                    print_error "Log file not found: $log_file"
                    print_warning "Cannot extract issues without log file"
                fi
            fi
        else
            print_warning "Skipped GitHub Copilot CLI - using manual review"
        fi
    fi
    
    # Handle test failure workflow continuation
    if [[ $test_failures -gt 0 ]]; then
        if ! confirm_action "Continue workflow despite test failures?"; then
            print_error "Workflow paused - fix test failures before continuing"
            return 1
        else
            test_exit_code=0
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
    
    cd "$PROJECT_ROOT" || return 1
    update_workflow_status "step7" "✅"
    
    return $test_exit_code
}

# Export step function
export -f step7_execute_test_suite
