#!/bin/bash
################################################################################
# Step 3: AI-Powered Script Reference Validation
# Purpose: Validate shell script references and documentation accuracy
# Part of: Tests & Documentation Workflow Automation v2.0.0
################################################################################

# Main step function - validates script references with AI assistance
# Returns: 0 for success, 1 for failure
step3_validate_script_references() {
    print_step "3" "Validate Script References"
    
    cd "$PROJECT_ROOT" || return 1
    
    local issues=0
    local script_issues_file
    script_issues_file=$(mktemp)
    TEMP_FILES+=("$script_issues_file")
    
    # PHASE 1: Automated script reference validation
    print_info "Phase 1: Automated script reference validation..."
    
    # Check 1: Script reference checks - validate documented scripts exist
    if [[ -f "shell_scripts/README.md" ]]; then
        local script_refs
        script_refs=$(grep -oP '(?<=`\./)shell_scripts/[^`]+\.sh' "shell_scripts/README.md" 2>/dev/null || true)
        
        while IFS= read -r script; do
            [[ -z "$script" ]] && continue
            
            if [[ ! -f "$script" ]]; then
                print_warning "Referenced script not found: $script"
                echo "Missing script reference: $script" >> "$script_issues_file"
                ((issues++))
            fi
        done <<< "$script_refs"
    fi
    
    # Check 2: Executable permission validation
    print_info "Checking executable permissions..."
    local non_executable
    non_executable=$(find shell_scripts -name "*.sh" ! -executable -type f 2>/dev/null || true)
    
    if [[ -n "$non_executable" ]]; then
        print_warning "Non-executable scripts found:"
        echo "$non_executable"
        while IFS= read -r script; do
            [[ -z "$script" ]] && continue
            echo "Non-executable: $script" >> "$script_issues_file"
        done <<< "$non_executable"
        ((issues++))
    fi
    
    # Check 3: Script inventory gathering
    print_info "Gathering script inventory..."
    local all_scripts
    all_scripts=$(find shell_scripts -name "*.sh" -type f 2>/dev/null | sort)
    local script_count
    script_count=$(echo "$all_scripts" | wc -l)
    
    # Check 4: Undocumented script detection
    print_info "Checking for undocumented scripts..."
    local undocumented=0
    while IFS= read -r script; do
        [[ -z "$script" ]] && continue
        local script_name
        script_name=$(basename "$script")
        
        # Check if script is mentioned in shell_scripts/README.md
        if [[ -f "shell_scripts/README.md" ]]; then
            if ! grep -q "$script_name" "shell_scripts/README.md" 2>/dev/null; then
                print_warning "Undocumented script: $script"
                echo "Undocumented: $script" >> "$script_issues_file"
                ((undocumented++))
                ((issues++))
            fi
        fi
    done <<< "$all_scripts"
    
    # PHASE 2: AI-powered script reference validation
    print_info "Phase 2: Preparing AI-powered script reference analysis..."
    
    local script_issues_content
    script_issues_content=$(cat "$script_issues_file" 2>/dev/null || echo "   No automated issues detected")
    
    # Gather all scripts for AI analysis
    local all_scripts
    all_scripts=$(find shell_scripts -name "*.sh" -type f 2>/dev/null | sort)
    
    # Build comprehensive script validation prompt using AI helper function
    local copilot_prompt
    copilot_prompt=$(build_step3_script_refs_prompt \
        "$script_count" \
        "${CHANGE_SCOPE}" \
        "$issues" \
        "$script_issues_content" \
        "$all_scripts")

    echo ""
    echo -e "${CYAN}GitHub Copilot CLI Script Reference Validation Prompt:${NC}"
    echo -e "${YELLOW}${copilot_prompt}${NC}\n"
    
    # Check if Copilot CLI is available
    if is_copilot_available; then
        print_info "GitHub Copilot CLI detected - ready for script reference validation..."
        
        if [[ "$DRY_RUN" == true ]]; then
            print_info "[DRY RUN] Would invoke: copilot -p with script validation prompt"
        else
            # Smart triggering
            if [[ "$issues" -gt 0 ]] || [[ "$INTERACTIVE_MODE" == true ]]; then
                if confirm_action "Run Copilot CLI for deep script reference validation?" "y"; then
                    print_info "Starting Copilot CLI script validation session..."
                    print_info "This will analyze shell scripts, documentation, and cross-references"
                    echo ""
                    
                    # Create log file with unique timestamp
                    local log_timestamp
                    log_timestamp=$(date +%Y%m%d_%H%M%S_%N | cut -c1-21)
                    local log_file="${LOGS_RUN_DIR}/step3_copilot_script_validation_${log_timestamp}.log"
                    print_info "Logging output to: $log_file"
                    
                    # Execute Copilot prompt
                    execute_copilot_prompt "$copilot_prompt" "$log_file"
                    
                    print_success "Copilot CLI script validation completed"
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
                                    save_step_issues "3" "Script_Reference_Validation" "$organized_issues"
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
                    if confirm_action "Did Copilot identify script documentation issues?" "n"; then
                        print_warning "Please review and update script documentation as recommended"
                        if [[ "$INTERACTIVE_MODE" == true ]]; then
                            if ! confirm_action "Continue workflow with identified issues?"; then
                                print_error "Workflow paused - please fix script documentation issues"
                                return 1
                            fi
                        fi
                    fi
                else
                    print_warning "Skipped Copilot CLI deep validation"
                fi
            else
                print_info "No automated issues found - skipping optional AI validation"
                if confirm_action "Run optional Copilot script validation anyway?"; then
                    # Create log file with unique timestamp (same format as step 1)
                    local log_timestamp
                    log_timestamp=$(date +%Y%m%d_%H%M%S_%N | cut -c1-21)
                    local log_file="${LOGS_RUN_DIR}/step3_copilot_script_validation_${log_timestamp}.log"
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
                                    save_step_issues "3" "Script_Reference_Validation" "$organized_issues"
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
        print_info "For deep analysis, use the prompt above manually with Copilot"
    fi
    
    # Summary
    echo ""
    
    # Always save backlog file (even when no issues found)
    local step_issues=""
    if [[ $issues -eq 0 ]]; then
        print_success "All script references valid in automated checks ✅"
        save_step_summary "3" "Script_Reference_Validation" "All shell script references validated. Documentation accurately reflects existing scripts and their permissions." "✅"
        
        # Save success status to backlog
        step_issues="### Script Reference Validation

**Total Issues:** 0
**Status:** ✅ All Checks Passed

All shell script references validated. Documentation accurately reflects existing scripts and their permissions.
"
    else
        print_warning "Found $issues script reference issue(s) - review required"
        save_step_summary "3" "Script_Reference_Validation" "Found ${issues} script reference issues. Review missing scripts, permission problems, or documentation gaps." "⚠️"
        
        # Save to backlog
        step_issues="### Script Reference Issues Found

**Total Issues:** ${issues}

"
        if [[ -f "$script_issues_file" && -s "$script_issues_file" ]]; then
            step_issues+="### Details

\`\`\`
$(cat "$script_issues_file")
\`\`\`
"
        fi
    fi
    
    # Always save backlog file
    save_step_issues "3" "Script_Reference_Validation" "$step_issues"
    
    update_workflow_status "step3" "✅"
}

# Export step function
export -f step3_validate_script_references
