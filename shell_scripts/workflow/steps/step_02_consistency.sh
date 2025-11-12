#!/bin/bash
################################################################################
# Step 2: AI-Powered Documentation Consistency Analysis
# Purpose: Check documentation for broken references and consistency issues
# Part of: Tests & Documentation Workflow Automation v2.0.0
################################################################################

# Main step function - validates documentation consistency with AI assistance
# Returns: 0 for success, 1 for failure
step2_check_consistency() {
    print_step "2" "Check Documentation Consistency"
    
    cd "$PROJECT_ROOT"
    
    local issues_found=0
    local broken_refs_file=$(mktemp)
    TEMP_FILES+=("$broken_refs_file")
    
    # PHASE 1: Automated broken link detection
    print_info "Phase 1: Automated broken link detection..."
    
    # Check docs directory for broken references
    while IFS= read -r md_file; do
        # Extract file paths using regex (paths starting with /)
        local refs=$(grep -oP '(?<=\()(/[^)]+)(?=\))' "$md_file" 2>/dev/null || true)
        
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
        local refs=$(grep -oP '(?<=\()(/[^)]+)(?=\))' "README.md" 2>/dev/null || true)
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
        local refs=$(grep -oP '(?<=\()(/[^)]+)(?=\))' ".github/copilot-instructions.md" 2>/dev/null || true)
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
    
    # PHASE 2: AI-powered consistency analysis with Copilot CLI
    print_info "Phase 2: Preparing comprehensive consistency analysis..."
    
    # Gather documentation inventory for AI analysis
    local doc_files=$(find . -name "*.md" -type f ! -path "*/node_modules/*" ! -path "*/.git/*" | sort)
    local doc_count=$(echo "$doc_files" | wc -l)
    
    # Build AI prompt using helper function
    local broken_refs_content=$(cat "$broken_refs_file" 2>/dev/null || echo "   No broken references detected")
    
    # Create comprehensive consistency prompt
    local copilot_prompt="**Role**: You are a senior technical documentation specialist and information architect with expertise in documentation quality assurance, technical writing standards, and cross-reference validation.

**Task**: Perform a comprehensive documentation consistency analysis for this project.

**Context:**
- Project: MP Barbosa Personal Website (static HTML with Material Design)
- Documentation files: $doc_count markdown files
- Scope: ${CHANGE_SCOPE}
- Recent changes: ${ANALYSIS_MODIFIED} files modified

**Analysis Tasks:**

1. **Cross-Reference Validation:**
   - Check if all referenced files/directories exist
   - Verify version numbers are consistent across all docs
   - Validate command examples match actual scripts

2. **Content Synchronization:**
   - Compare .github/copilot-instructions.md with README.md
   - Check if shell_scripts/README.md matches actual scripts in shell_scripts/
   - Verify package.json scripts match documented commands

3. **Architecture Consistency:**
   - Validate directory structure matches documented structure
   - Check if deployment steps in docs match actual deployment scripts
   - Verify submodule references are accurate

4. **Broken References Found:**
$broken_refs_content

5. **Quality Checks:**
   - Missing documentation for new features
   - Outdated version numbers or dates
   - Inconsistent terminology or naming conventions
   - Missing cross-references between related docs

**Files to Analyze:**
$doc_files

**Expected Output:**
- List of inconsistencies found with specific file:line references
- Recommendations for fixes with rationale
- Priority level (Critical/High/Medium/Low) for each issue
- Actionable remediation steps

**Documentation Standards to Apply:**
- Technical accuracy and precision
- Consistency in terminology and formatting
- Completeness of cross-references
- Version number accuracy across all files

Please analyze the documentation files and provide a detailed consistency report."

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
                    
                    # Invoke Copilot CLI with the comprehensive prompt
                    execute_copilot_prompt "$copilot_prompt"
                    
                    print_success "Copilot CLI consistency analysis completed"
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
                    execute_copilot_prompt "$copilot_prompt"
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
    if [[ $issues_found -eq 0 ]]; then
        print_success "No broken references found in automated checks ✅"
        save_step_summary "2" "Consistency_Analysis" "All documentation cross-references validated successfully. No broken links detected across ${doc_count} documentation files." "✅"
    else
        print_warning "Found $issues_found broken reference(s) - review required"
        save_step_summary "2" "Consistency_Analysis" "Found ${issues_found} broken references requiring attention. Review and fix broken links before proceeding." "⚠️"
        
        # Save broken references to backlog
        local step_issues="### Broken References Found

**Total Issues:** ${issues_found}

"
        if [[ -f "$broken_refs_file" && -s "$broken_refs_file" ]]; then
            step_issues+="### Details

\`\`\`
$(cat "$broken_refs_file")
\`\`\`
"
        fi
        save_step_issues "2" "Consistency_Analysis" "$step_issues"
    fi
    
    update_workflow_status "step2" "✅"
}

# Export step function
export -f step2_check_consistency
