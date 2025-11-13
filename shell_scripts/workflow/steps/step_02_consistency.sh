#!/bin/bash
################################################################################
# Step 2: AI-Powered Documentation Consistency Analysis
# Purpose: Check documentation for broken references and consistency issues
# Part of: Tests & Documentation Workflow Automation v2.0.0
################################################################################

# Validates semantic version format (MAJOR.MINOR.PATCH)
# Arguments: $1 - version string to validate
# Returns: 0 if valid semver, 1 if invalid
validate_semver() {
    local version="$1"
    
    # Semantic versioning regex: MAJOR.MINOR.PATCH (optional v prefix)
    if [[ "$version" =~ ^v?([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
        return 0
    else
        return 1
    fi
}

# Extracts version numbers from documentation files
# Arguments: $1 - file path
# Returns: Array of version strings found
extract_versions_from_file() {
    local file="$1"
    
    # Extract version patterns: v1.2.3 or 1.2.3
    grep -oP 'v?[0-9]+\.[0-9]+\.[0-9]+' "$file" 2>/dev/null | sort -u || true
}

# Checks version consistency across documentation
# Returns: 0 if consistent, 1 if inconsistencies found
check_version_consistency() {
    local inconsistencies=0
    local version_map_file
    version_map_file=$(mktemp)
    TEMP_FILES+=("$version_map_file")
    
    print_info "Checking semantic version consistency across documentation..."
    
    # Find all markdown files
    while IFS= read -r md_file; do
        local versions
        versions=$(extract_versions_from_file "$md_file")
        
        while IFS= read -r version; do
            [[ -z "$version" ]] && continue
            
            # Validate semver format
            if ! validate_semver "$version"; then
                print_warning "Invalid semantic version format in $md_file: $version"
                echo "$md_file: $version (INVALID FORMAT)" >> "$version_map_file"
                ((inconsistencies++))
            else
                echo "$md_file: $version" >> "$version_map_file"
            fi
        done <<< "$versions"
    done < <(find . -name "*.md" -type f ! -path "*/node_modules/*" ! -path "*/.git/*" 2>/dev/null || true)
    
    # Check package.json version if exists
    if [[ -f "src/package.json" ]]; then
        local pkg_version
        pkg_version=$(grep -oP '"version":\s*"\K[^"]+' "src/package.json" 2>/dev/null || true)
        
        if [[ -n "$pkg_version" ]]; then
            if ! validate_semver "$pkg_version"; then
                print_warning "Invalid semantic version in package.json: $pkg_version"
                echo "package.json: $pkg_version (INVALID FORMAT)" >> "$version_map_file"
                ((inconsistencies++))
            else
                echo "package.json: $pkg_version" >> "$version_map_file"
            fi
        fi
    fi
    
    # Display version map
    if [[ -s "$version_map_file" ]]; then
        local total_versions
        total_versions=$(wc -l < "$version_map_file")
        print_info "Found $total_versions version reference(s)"
        
        if [[ $inconsistencies -gt 0 ]]; then
            print_warning "Version format issues detected:"
            cat "$version_map_file"
        fi
    fi
    
    return $inconsistencies
}

# Main step function - validates documentation consistency with AI assistance
# Returns: 0 for success, 1 for failure
step2_check_consistency() {
    print_step "2" "Check Documentation Consistency"
    
    cd "$PROJECT_ROOT" || return 1
    
    local issues_found=0
    local broken_refs_file
    broken_refs_file=$(mktemp)
    TEMP_FILES+=("$broken_refs_file")
    
    # PHASE 1: Automated broken link detection
    print_info "Phase 1: Automated broken link detection..."
    
    # Check semantic version consistency
    local version_issues=0
    check_version_consistency || version_issues=$?
    if [[ $version_issues -gt 0 ]]; then
        print_warning "Found $version_issues semantic versioning issue(s)"
        ((issues_found += version_issues))
    else
        print_success "All version numbers follow semantic versioning format ✅"
    fi
    
    # Check docs directory for broken references
    while IFS= read -r md_file; do
        # Extract file paths using regex (paths starting with /)
        local refs
        refs=$(grep -oP '(?<=\()(/[^)]+)(?=\))' "$md_file" 2>/dev/null || true)
        
        while IFS= read -r ref; do
            [[ -z "$ref" ]] && continue
            
            local full_path="${PROJECT_ROOT}${ref}"
            if [[ ! -e "$full_path" ]]; then
                print_warning "Broken reference in $md_file: $ref"
                echo "$md_file: $ref" >> "$broken_refs_file"
                ((issues_found++))
            fi
        done <<< "$refs"
    done < <(find docs -name "*.md" -type f 2>/dev/null || true)
    
    # Check README.md
    if [[ -f "README.md" ]]; then
        local refs
        refs=$(grep -oP '(?<=\()(/[^)]+)(?=\))' "README.md" 2>/dev/null || true)
        while IFS= read -r ref; do
            [[ -z "$ref" ]] && continue
            local full_path="${PROJECT_ROOT}${ref}"
            if [[ ! -e "$full_path" ]]; then
                print_warning "Broken reference in README.md: $ref"
                echo "README.md: $ref" >> "$broken_refs_file"
                ((issues_found++))
            fi
        done <<< "$refs"
    fi
    
    # Check .github/copilot-instructions.md (critical for CI/CD)
    if [[ -f ".github/copilot-instructions.md" ]]; then
        local refs
        refs=$(grep -oP '(?<=\()(/[^)]+)(?=\))' ".github/copilot-instructions.md" 2>/dev/null || true)
        while IFS= read -r ref; do
            [[ -z "$ref" ]] && continue
            local full_path="${PROJECT_ROOT}${ref}"
            if [[ ! -e "$full_path" ]]; then
                print_warning "Broken reference in .github/copilot-instructions.md: $ref"
                echo ".github/copilot-instructions.md: $ref" >> "$broken_refs_file"
                ((issues_found++))
            fi
        done <<< "$refs"
    fi
    
    # Gather documentation inventory for AI analysis
    local doc_files
    doc_files=$(find . -name "*.md" -type f ! -path "*/node_modules/*" ! -path "*/.git/*" | sort)
    local doc_count
    doc_count=$(echo "$doc_files" | wc -l)
    
    # Build AI prompt using helper function
    local broken_refs_content
    broken_refs_content=$(cat "$broken_refs_file" 2>/dev/null || echo "   No broken references detected")
    
    # Create comprehensive consistency prompt using AI helper function
    local copilot_prompt
    copilot_prompt=$(build_step2_consistency_prompt \
        "$doc_count" \
        "${CHANGE_SCOPE}" \
        "${ANALYSIS_MODIFIED}" \
        "$broken_refs_content" \
        "$doc_files")

    echo ""
    echo -e "${CYAN}GitHub Copilot CLI Consistency Analysis Prompt:${NC}"
    echo -e "${YELLOW}${copilot_prompt}${NC}\n"
    
    # Check if Copilot CLI is available for deep analysis
    if is_copilot_available; then
        print_info "GitHub Copilot CLI detected - ready for deep consistency analysis..."
        
        if [[ "$DRY_RUN" == true ]]; then
            print_info "[DRY RUN] Would invoke: copilot -p with consistency analysis prompt"
        else
            # Smart triggering: Auto-trigger if issues found, user choice if interactive
            if [[ "$issues_found" -gt 0 ]] || [[ "$INTERACTIVE_MODE" == true ]]; then
                if confirm_action "Run Copilot CLI for deep documentation consistency analysis?" "y"; then
                    print_info "Starting Copilot CLI consistency analysis session..."
                    print_info "This will analyze all documentation files for cross-references, versions, and accuracy"
                    echo ""
                    
                    # Create log file with unique timestamp
                    local log_timestamp
                    log_timestamp=$(date +%Y%m%d_%H%M%S_%N | cut -c1-21)
                    local log_file="${LOGS_RUN_DIR}/step2_copilot_consistency_analysis_${log_timestamp}.log"
                    print_info "Logging output to: $log_file"
                    
                    print_info "Log file: $log_file"
                    # Invoke Copilot CLI with the comprehensive prompt
                    execute_copilot_prompt "$copilot_prompt" "$log_file"
                    
                    print_success "Copilot CLI consistency analysis completed"
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
                                    save_step_issues "2" "Consistency_Analysis" "$organized_issues"
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
                    
                    # User feedback loop for issue resolution
                    if confirm_action "Did Copilot identify issues that need fixing?" "n"; then
                        print_warning "Please review and fix identified issues before continuing"
                        if [[ "$INTERACTIVE_MODE" == true ]]; then
                            if ! confirm_action "Continue workflow with identified issues?"; then
                                print_error "Workflow paused - please fix documentation issues"
                                return 1
                            fi
                        fi
                    fi
                else
                    print_warning "Skipped Copilot CLI deep analysis"
                fi
            else
                print_info "No broken references found - skipping optional deep analysis"
                if confirm_action "Run optional Copilot consistency analysis anyway?" "n"; then
                    # Create log file with unique timestamp (same format as step 1)
                    local log_timestamp
                    log_timestamp=$(date +%Y%m%d_%H%M%S_%N | cut -c1-21)
                    local log_file="${LOGS_RUN_DIR}/step2_copilot_consistency_analysis_${log_timestamp}.log"
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
                                    save_step_issues "2" "Consistency_Analysis" "$organized_issues"
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
    
    # Summary of automated checks
    echo ""
    
    # Always save backlog file (even when no issues found)
    local step_issues=""
    if [[ $issues_found -eq 0 ]]; then
        print_success "No broken references found in automated checks ✅"
        save_step_summary "2" "Consistency_Analysis" "All documentation cross-references validated successfully. No broken links detected across ${doc_count} documentation files." "✅"
        
        # Save success status to backlog
        step_issues="### Documentation Consistency Check

**Total Issues:** 0
**Status:** ✅ All Checks Passed

All documentation cross-references validated successfully. No broken links detected across ${doc_count} documentation files.
"
    else
        print_warning "Found $issues_found broken reference(s) - review required"
        save_step_summary "2" "Consistency_Analysis" "Found ${issues_found} broken references requiring attention. Review and fix broken links before proceeding." "⚠️"
        
        # Save broken references to backlog
        step_issues="### Broken References Found

**Total Issues:** ${issues_found}

"
        if [[ -f "$broken_refs_file" && -s "$broken_refs_file" ]]; then
            step_issues+="### Details

\`\`\`
$(cat "$broken_refs_file")
\`\`\`
"
        fi
    fi
    
    # Always save backlog file
    save_step_issues "2" "Consistency_Analysis" "$step_issues"
    
    update_workflow_status "step2" "✅"
}

# Export step function and helper functions
export -f step2_check_consistency
export -f validate_semver
export -f extract_versions_from_file
export -f check_version_consistency
