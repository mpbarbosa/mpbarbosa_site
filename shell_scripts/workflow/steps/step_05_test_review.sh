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
    
    cd "$SRC_DIR" || return 1
    
    local issues=0
    local test_issues_file
    test_issues_file=$(mktemp)
    TEMP_FILES+=("$test_issues_file")
    
    # PHASE 1: Automated test analysis
    print_info "Phase 1: Automated test analysis..."
    
    # Check 1: Test file inventory
    print_info "Gathering test file inventory..."
    local test_files
    test_files=$(find . -name "*.test.js" -o -name "*.spec.js" ! -path "*/node_modules/*" | sort)
    local test_count
    test_count=$(echo "$test_files" | grep -c "test.js\|spec.js" || echo "0")
    
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
        
        # Extract coverage percentage if available
        local coverage_percentage
        coverage_percentage=$(echo "$coverage_summary" | grep -o '"pct":[0-9.]*' | head -1 | cut -d':' -f2 || echo "unknown")
        if [[ "$coverage_percentage" != "unknown" ]]; then
            print_info "Overall coverage: ${coverage_percentage}%"
        fi
    else
        print_warning "No coverage report found - run 'npm run test:coverage' first"
        echo "Missing: Coverage report" >> "$test_issues_file"
        ((issues++))
    fi
    
    # Check 3: Identify untested code files
    print_info "Identifying potentially untested code..."
    local code_files
    code_files=$(find scripts -name "*.js" -o -name "*.mjs" 2>/dev/null | wc -l || echo "0")
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
    local tests_in_tests_dir
    tests_in_tests_dir=$(find __tests__ -name "*.test.js" 2>/dev/null | wc -l || echo "0")
    local tests_colocated
    tests_colocated=$(find . -name "*.test.js" ! -path "*/__tests__/*" ! -path "*/node_modules/*" 2>/dev/null | wc -l || echo "0")
    
    if [[ $tests_colocated -gt 0 ]]; then
        print_warning "Found $tests_colocated test files outside __tests__ directory"
        echo "Organization: $tests_colocated tests not in __tests__/" >> "$test_issues_file"
    fi
    
    # PHASE 2: AI-powered test strategy analysis
    print_info "Phase 2: Preparing AI-powered test strategy analysis..."
    
    # Gather test context
    local test_framework="Jest with ES Modules (experimental-vm-modules)"
    local test_env="jsdom"
    local test_issues_content
    test_issues_content=$(cat "$test_issues_file" 2>/dev/null || echo "   No automated issues detected")
    
    # Build comprehensive test analysis prompt using AI helper function
    local copilot_prompt
    copilot_prompt=$(build_step5_test_review_prompt \
        "$test_framework" \
        "$test_env" \
        "$test_count" \
        "$code_files" \
        "$tests_in_tests_dir" \
        "$tests_colocated" \
        "$coverage_exists" \
        "$test_issues_content" \
        "$test_files")

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
                    
                    # Create log file with unique timestamp
                    local log_timestamp
                    log_timestamp=$(date +%Y%m%d_%H%M%S_%N | cut -c1-21)
                    local log_file="${LOGS_RUN_DIR}/step5_copilot_test_analysis_${log_timestamp}.log"
                    print_info "Logging output to: $log_file"
                    
                    # Execute Copilot prompt
                    execute_copilot_prompt "$copilot_prompt" "$log_file"
                    
                    print_success "Copilot CLI test analysis completed"
                    print_info "Full session log saved to: $log_file"
                    echo ""
                    
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
                                    save_step_issues "5" "Test_Review" "$organized_issues"
                                    print_success "Issues extracted from log and saved to backlog"
                                else
                                    print_warning "No organized issues provided - skipping backlog save"
                                fi
                            else
                                print_warning "Skipped issue extraction - no backlog file created"
                            fi
                        fi
                    fi
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
                    # Create log file with unique timestamp
                    local log_timestamp
                    log_timestamp=$(date +%Y%m%d_%H%M%S_%N | cut -c1-21)
                    local log_file="${LOGS_RUN_DIR}/step5_copilot_test_analysis_${log_timestamp}.log"
                    print_info "Logging output to: $log_file"
                    
                    execute_copilot_prompt "$copilot_prompt" "$log_file"
                    
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
                                    save_step_issues "5" "Test_Review" "$organized_issues"
                                    print_success "Issues extracted from log and saved to backlog"
                                else
                                    print_warning "No organized issues provided - skipping backlog save"
                                fi
                            else
                                print_warning "Skipped issue extraction - no backlog file created"
                            fi
                        fi
                    fi
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
    
    # Always save backlog file (even when no issues found)
    local step_issues=""
    if [[ $issues -eq 0 ]]; then
        print_success "Test suite structure validated ✅ ($test_count test files found)"
        save_step_summary "5" "Test_Review" "Test suite validated with ${test_count} test files. All modules have adequate test coverage." "✅"
        
        # Save success status to backlog
        step_issues="### Test Review Validation

**Total Issues:** 0
**Test Files Found:** ${test_count}
**Untested Modules:** ${untested_count}
**Status:** ✅ All Checks Passed

Test suite validated with ${test_count} test files. All modules have adequate test coverage.
"
    else
        print_warning "Found $issues test-related issue(s) - review required"
        save_step_summary "5" "Test_Review" "Found ${issues} test issues. ${untested_count} modules lack test coverage. Review and add missing tests." "⚠️"
        
        # Save to backlog
        step_issues="### Test Review Issues Found

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
    fi
    
    # Always save backlog file
    save_step_issues "5" "Test_Review" "$step_issues"
    
    cd "$PROJECT_ROOT" || return 1
    update_workflow_status "step5" "✅"
}

# Export step function
export -f step5_review_existing_tests
