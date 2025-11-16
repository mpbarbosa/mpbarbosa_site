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
    
    # Execute Phase 2 AI analysis using shared library
    execute_phase2_ai_analysis \
        "$copilot_prompt" \
        "3" \
        "script_validation" \
        "Script_Reference_Validation" \
        "$issues" \
        "script reference validation" \
        "No automated issues found - skipping optional AI validation" \
        "Did Copilot identify script documentation issues?"
    
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
