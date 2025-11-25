#!/bin/bash
################################################################################
# Step 3: AI-Powered Script Reference Validation
# Purpose: Validate shell script references and documentation accuracy
# Part of: Tests & Documentation Workflow Automation v2.0.0
# Version: 2.0.0
################################################################################

# Module version information
readonly STEP3_VERSION="2.0.0"
readonly STEP3_VERSION_MAJOR=2
readonly STEP3_VERSION_MINOR=0
readonly STEP3_VERSION_PATCH=0

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
    non_executable=$(fast_find "shell_scripts" "*.sh" 5 "node_modules" ".git" | while read -r f; do [[ ! -x "$f" ]] && echo "$f"; done)
    
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
    all_scripts=$(fast_find "shell_scripts" "*.sh" 5 "node_modules" ".git" | sort)
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
    
    # Gather all scripts for AI analysis (reuse cached result)
    # all_scripts already populated above
    
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
    
    # PHASE 2: Execute AI analysis with manual issue tracking
    if [[ "$DRY_RUN" == true ]]; then
        print_info "[DRY RUN] Would invoke: copilot -p with script reference validation prompt"
    else
        if confirm_action "Run GitHub Copilot CLI to validate script references?" "y"; then
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
            local log_file="${LOGS_RUN_DIR}/step3_copilot_script_validation_${log_timestamp}.log"
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
                            save_step_issues "3" "Script_Reference_Validation" "$organized_issues"
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
    
    # Save step results using shared library
    save_step_results \
        "3" \
        "Script_Reference_Validation" \
        "$issues" \
        "All script references valid in automated checks" \
        "Found ${issues} script reference issues. Review missing scripts, permission problems, or documentation gaps." \
        "$script_issues_file" \
        "$script_count"
    
    update_workflow_status "step3" "✅"
}

# Export step function
export -f step3_validate_script_references
