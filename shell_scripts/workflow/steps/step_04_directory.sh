#!/bin/bash
################################################################################
# Step 4: AI-Powered Directory Structure Validation
# Purpose: Validate project directory structure and architectural organization
# Part of: Tests & Documentation Workflow Automation v2.0.0
################################################################################

# Main step function - validates directory structure with AI assistance
# Returns: 0 for success, 1 for failure
step4_validate_directory_structure() {
    print_step "4" "Validate Directory Structure"
    
    cd "$PROJECT_ROOT" || return 1
    
    local issues=0
    local structure_issues_file
    structure_issues_file=$(mktemp)
    TEMP_FILES+=("$structure_issues_file")
    
    # PHASE 1: Automated directory structure detection
    print_info "Phase 1: Automated directory structure detection..."
    
    # Check 1: Generate current directory structure
    print_info "Generating directory inventory..."
    local dir_tree=""
    if command -v tree &> /dev/null; then
        dir_tree=$(tree -d -L 3 -I 'node_modules|.git|coverage' --noreport 2>/dev/null || true)
    else
        # Fallback: use find if tree is not available
        dir_tree=$(find . -maxdepth 3 -type d ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/coverage/*" | sort)
    fi
    
    # Check 2: Validate expected critical directories exist
    print_info "Validating critical directories..."
    local critical_dirs=("src" "docs" "shell_scripts" ".github" "public")
    local missing_critical=0
    
    for dir in "${critical_dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            print_warning "Critical directory missing: $dir"
            echo "Missing critical: $dir" >> "$structure_issues_file"
            ((missing_critical++))
            ((issues++))
        fi
    done
    
    # Check 3: Identify undocumented directories
    print_info "Checking for undocumented directories..."
    local undocumented_dirs=0
    
    # Check if directories are mentioned in documentation
    if [[ -f "README.md" ]] || [[ -f ".github/copilot-instructions.md" ]]; then
        while IFS= read -r dir; do
            [[ -z "$dir" || "$dir" == "." ]] && continue
            local dir_name
            dir_name=$(basename "$dir")
            
            # Skip common/expected directories
            [[ "$dir_name" =~ ^(node_modules|\.git|coverage|\.vscode)$ ]] && continue
            
            # Check if directory is documented
            local is_documented=false
            if [[ -f "README.md" ]] && grep -q "$dir_name" "README.md" 2>/dev/null; then
                is_documented=true
            fi
            if [[ -f ".github/copilot-instructions.md" ]] && grep -q "$dir_name" ".github/copilot-instructions.md" 2>/dev/null; then
                is_documented=true
            fi
            
            if [[ "$is_documented" == false ]]; then
                print_warning "Undocumented directory: $dir"
                echo "Undocumented: $dir" >> "$structure_issues_file"
                ((undocumented_dirs++))
                ((issues++))
            fi
        done < <(find . -maxdepth 2 -type d ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/coverage/*" ! -path "*/.vscode" | tail -n +2)
    fi
    
    # Check 4: Validate structure consistency with documented structure
    print_info "Validating structure against documentation..."
    local doc_structure_mismatch=0
    
    # Extract directory structure from copilot-instructions if it exists
    if [[ -f ".github/copilot-instructions.md" ]]; then
        # Look for directory structure documentation
        if grep -q "directory structure\|Directory Structure\|File Structure" ".github/copilot-instructions.md" 2>/dev/null; then
            # Basic check: are the key directories mentioned?
            local key_dirs=("src" "docs" "shell_scripts" "public")
            for dir in "${key_dirs[@]}"; do
                if grep -q "$dir" ".github/copilot-instructions.md" 2>/dev/null; then
                    if [[ ! -d "$dir" ]]; then
                        print_warning "Documented directory not found: $dir"
                        echo "Doc mismatch: $dir (documented but missing)" >> "$structure_issues_file"
                        ((doc_structure_mismatch++))
                        ((issues++))
                    fi
                fi
            done
        fi
    fi
    
    # PHASE 2: AI-powered architectural analysis
    print_info "Phase 2: Preparing AI-powered architectural analysis..."
    
    # Gather directory metadata
    local dir_count
    dir_count=$(find . -maxdepth 3 -type d ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/coverage/*" | wc -l)
    local structure_issues_content
    structure_issues_content=$(cat "$structure_issues_file" 2>/dev/null || echo "   No automated issues detected")
    
    # Get directory tree for AI analysis
    local dir_tree
    dir_tree=$(tree -L 3 -d -I 'node_modules|.git|coverage' 2>/dev/null || find . -type d -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/coverage/*' | head -50)
    
    # Build comprehensive architectural analysis prompt using AI helper function
    local copilot_prompt
    copilot_prompt=$(build_step4_directory_prompt \
        "$dir_count" \
        "${CHANGE_SCOPE}" \
        "$missing_critical" \
        "$undocumented_dirs" \
        "$doc_structure_mismatch" \
        "$structure_issues_content" \
        "$dir_tree")

    echo ""
    echo -e "${CYAN}GitHub Copilot CLI Directory Structure Validation Prompt:${NC}"
    echo -e "${YELLOW}${copilot_prompt}${NC}\n"
    
    # Check if Copilot CLI is available
    if is_copilot_available; then
        print_info "GitHub Copilot CLI detected - ready for architectural analysis..."
        
        if [[ "$DRY_RUN" == true ]]; then
            print_info "[DRY RUN] Would invoke: copilot -p with architectural analysis prompt"
        else
            # Smart triggering
            if [[ "$issues" -gt 0 ]] || [[ "$INTERACTIVE_MODE" == true ]]; then
                if confirm_action "Run Copilot CLI for deep architectural analysis?" "y"; then
                    print_info "Starting Copilot CLI architectural analysis session..."
                    echo ""
                    
                    # Create log file with unique timestamp (same format as step 1)
                    local log_timestamp
                    log_timestamp=$(date +%Y%m%d_%H%M%S_%N | cut -c1-21)
                    local log_file="${LOGS_RUN_DIR}/step4_copilot_directory_structure_${log_timestamp}.log"
                    print_info "Logging output to: $log_file"
                    
                    # Execute Copilot prompt
                    execute_copilot_prompt "$copilot_prompt" "$log_file"
                    
                    print_success "Copilot CLI architectural analysis completed"
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
                                    save_step_issues "4" "Directory_Structure_Validation" "$organized_issues"
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
                    if confirm_action "Did Copilot identify structural or architectural issues?"; then
                        print_warning "Please review architectural recommendations before continuing"
                        if [[ "$INTERACTIVE_MODE" == true ]]; then
                            if ! confirm_action "Continue workflow with identified issues?"; then
                                print_error "Workflow paused - please address architectural issues"
                                return 1
                            fi
                        fi
                    fi
                else
                    print_warning "Skipped Copilot CLI architectural analysis"
                fi
            else
                print_info "No automated issues found - skipping optional architectural analysis"
                if confirm_action "Run optional Copilot architectural analysis anyway?"; then
                    # Create log file with unique timestamp (same format as step 1)
                    local log_timestamp
                    log_timestamp=$(date +%Y%m%d_%H%M%S_%N | cut -c1-21)
                    local log_file="${LOGS_RUN_DIR}/step4_copilot_directory_structure_${log_timestamp}.log"
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
                                    save_step_issues "4" "Directory_Structure_Validation" "$organized_issues"
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
    fi
    
    # Summary
    echo ""
    
    # Always save backlog file (even when no issues found)
    local step_issues=""
    if [[ $issues -eq 0 ]]; then
        print_success "Directory structure valid in automated checks ✅"
        save_step_summary "4" "Directory_Structure_Validation" "Project directory structure validated successfully. All expected directories present and properly organized." "✅"
        
        # Save success status to backlog
        step_issues="### Directory Structure Validation

**Total Issues:** 0
**Missing Critical Directories:** 0
**Status:** ✅ All Checks Passed

Project directory structure validated successfully. All expected directories present and properly organized.
"
    else
        print_warning "Found $issues structural issue(s) - review required"
        if [[ $missing_critical -gt 0 ]]; then
            print_error "Critical: $missing_critical critical directories missing!"
            save_step_summary "4" "Directory_Structure_Validation" "CRITICAL: ${missing_critical} critical directories missing. Found ${issues} total structural issues requiring immediate attention." "❌"
        else
            save_step_summary "4" "Directory_Structure_Validation" "Found ${issues} structural issues. Review missing or misorganized directories." "⚠️"
        fi
        
        # Save to backlog
        step_issues="### Directory Structure Issues Found

**Total Issues:** ${issues}
**Missing Critical Directories:** ${missing_critical}

"
        if [[ -f "$structure_issues_file" && -s "$structure_issues_file" ]]; then
            step_issues+="### Details

\`\`\`
$(cat "$structure_issues_file")
\`\`\`
"
        fi
    fi
    
    # Always save backlog file
    save_step_issues "4" "Directory_Structure_Validation" "$step_issues"
    
    update_workflow_status "step4" "✅"
}

# Export step function
export -f step4_validate_directory_structure
