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
    
    cd "$PROJECT_ROOT"
    
    local issues=0
    local script_issues_file=$(mktemp)
    TEMP_FILES+=("$script_issues_file")
    
    # PHASE 1: Automated script reference validation
    print_info "Phase 1: Automated script reference validation..."
    
    # Check 1: Script reference checks - validate documented scripts exist
    if [[ -f "shell_scripts/README.md" ]]; then
        local script_refs=$(grep -oP '(?<=`\./)shell_scripts/[^`]+\.sh' "shell_scripts/README.md" 2>/dev/null || true)
        
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
    local non_executable=$(find shell_scripts -name "*.sh" ! -executable -type f 2>/dev/null || true)
    
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
    local all_scripts=$(find shell_scripts -name "*.sh" -type f 2>/dev/null | sort)
    local script_count=$(echo "$all_scripts" | wc -l)
    
    # Check 4: Undocumented script detection
    print_info "Checking for undocumented scripts..."
    local undocumented=0
    while IFS= read -r script; do
        [[ -z "$script" ]] && continue
        local script_name=$(basename "$script")
        
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
    
    local script_issues_content=$(cat "$script_issues_file" 2>/dev/null || echo "   No automated issues detected")
    
    # Build comprehensive script validation prompt
    local copilot_prompt="**Role**: You are a senior technical documentation specialist and DevOps documentation expert with expertise in shell script documentation, automation workflow documentation, and command-line tool reference guides.

**Task**: Perform comprehensive validation of shell script references and documentation quality for this project's automation scripts.

**Context:**
- Project: MP Barbosa Personal Website
- Shell Scripts Directory: shell_scripts/
- Total Scripts: $script_count
- Scope: ${CHANGE_SCOPE}
- Issues Found in Phase 1: $issues

**Phase 1 Automated Findings:**
$script_issues_content

**Available Scripts:**
$all_scripts

**Validation Tasks:**

1. **Script-to-Documentation Mapping:**
   - Verify every script in shell_scripts/ is documented in shell_scripts/README.md
   - Check that documented scripts actually exist
   - Validate script descriptions match actual functionality
   - Ensure usage examples are accurate and complete

2. **Reference Accuracy:**
   - Validate command-line arguments in documentation match script implementation
   - Check script version numbers are consistent
   - Verify cross-references between scripts are accurate
   - Validate file path references in script comments

3. **Documentation Completeness:**
   - Missing purpose/description for any scripts
   - Missing usage examples or command syntax
   - Missing prerequisite or dependency information
   - Missing output/return value documentation

4. **Shell Script Best Practices:**
   - Executable permissions properly documented
   - Shebang lines mentioned in documentation where relevant
   - Environment variable requirements documented
   - Error handling and exit codes documented

5. **Integration Documentation:**
   - Workflow relationships between scripts documented
   - Execution order or dependencies clarified
   - Common use cases and examples provided
   - Troubleshooting guidance available

**Files to Analyze:**
- shell_scripts/README.md
- All .sh files in shell_scripts/
- .github/copilot-instructions.md (for shell script references)
- Main README.md (for automation workflow mentions)

**Expected Output:**
- List of script reference issues with file:line locations
- Missing or incomplete script documentation
- Inconsistencies between code and documentation
- Recommendations for improving script documentation
- Priority level (Critical/High/Medium/Low) for each issue
- Actionable remediation steps with examples

**Documentation Standards to Apply:**
- Clear and concise command syntax documentation
- Comprehensive usage examples for each script
- Accurate parameter and option descriptions
- Proper shell script documentation conventions
- Integration and workflow clarity

Please analyze the shell script references and provide a detailed validation report with specific recommendations for documentation improvements."

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
                    
                    # Execute Copilot prompt
                    execute_copilot_prompt "$copilot_prompt"
                    
                    print_success "Copilot CLI script validation completed"
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
                    execute_copilot_prompt "$copilot_prompt"
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
    if [[ $issues -eq 0 ]]; then
        print_success "All script references valid in automated checks ✅"
        save_step_summary "3" "Script_Reference_Validation" "All shell script references validated. Documentation accurately reflects existing scripts and their permissions." "✅"
    else
        print_warning "Found $issues script reference issue(s) - review required"
        save_step_summary "3" "Script_Reference_Validation" "Found ${issues} script reference issues. Review missing scripts, permission problems, or documentation gaps." "⚠️"
        
        # Save to backlog
        local step_issues="### Script Reference Issues Found

**Total Issues:** ${issues}

"
        if [[ -f "$script_issues_file" && -s "$script_issues_file" ]]; then
            step_issues+="### Details

\`\`\`
$(cat "$script_issues_file")
\`\`\`
"
        fi
        save_step_issues "3" "Script_Reference_Validation" "$step_issues"
    fi
    
    update_workflow_status "step3" "✅"
}

# Export step function
export -f step3_validate_script_references
