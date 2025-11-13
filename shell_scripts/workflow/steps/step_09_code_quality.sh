#!/bin/bash
################################################################################
# Step 9: AI-Powered Code Quality Validation
# Purpose: Validate code quality, detect anti-patterns, assess maintainability
# Part of: Tests & Documentation Workflow Automation v2.0.0
################################################################################

# Main step function - validates code quality with AI assistance
# Returns: 0 for success, 1 for failure
step9_code_quality_validation() {
    print_step "9" "Code Quality Validation"
    
    cd "$SRC_DIR"
    
    local quality_issues=0
    local quality_report=$(mktemp)
    TEMP_FILES+=("$quality_report")
    
    # PHASE 1: Automated code quality checks
    print_info "Phase 1: Automated code quality analysis..."
    
    # Check 1: Enumerate code files
    print_info "Enumerating code files..."
    local js_files=$(find . -name "*.js" -o -name "*.mjs" 2>/dev/null | wc -l)
    local html_files=$(find . -name "*.html" 2>/dev/null | wc -l)
    local css_files=$(find . -name "*.css" 2>/dev/null | wc -l)
    local total_files=$((js_files + html_files + css_files))
    
    print_info "Code files: $js_files JS, $html_files HTML, $css_files CSS (Total: $total_files)"
    echo "File count: $js_files JavaScript, $html_files HTML, $css_files CSS" >> "$quality_report"
    
    # Check 2: Analyze file sizes and complexity
    print_info "Analyzing code complexity..."
    local large_files_count=0
    local large_files_list=""
    
    # Find JavaScript files over 300 lines
    while IFS= read -r file; do
        [[ -z "$file" ]] && continue
        local line_count=$(wc -l < "$file" 2>/dev/null || echo 0)
        if [[ $line_count -gt 300 ]]; then
            ((large_files_count++))
            large_files_list+="  - $file ($line_count lines)\n"
            echo "Large file: $file ($line_count lines)" >> "$quality_report"
        fi
    done < <(find . -name "*.js" -o -name "*.mjs" 2>/dev/null)
    
    if [[ $large_files_count -gt 0 ]]; then
        print_warning "Found $large_files_count large files (>300 lines) - may need refactoring"
        ((quality_issues++))
    else
        print_success "All files are reasonably sized"
    fi
    
    # Check 3: Naming convention validation
    print_info "Validating naming conventions..."
    local naming_issues=0
    
    # Check for non-kebab-case HTML files
    while IFS= read -r file; do
        [[ -z "$file" ]] && continue
        local basename=$(basename "$file")
        if [[ "$basename" =~ [A-Z_] ]]; then
            ((naming_issues++))
            echo "Naming issue: $file (not kebab-case)" >> "$quality_report"
        fi
    done < <(find . -name "*.html" 2>/dev/null)
    
    if [[ $naming_issues -gt 0 ]]; then
        print_warning "Found $naming_issues naming convention issues"
        ((quality_issues++))
    else
        print_success "Naming conventions followed"
    fi
    
    # Check 4: Detect potential code duplication
    print_info "Checking for potential code duplication..."
    local duplicate_patterns=0
    
    # Look for common duplicate patterns
    if command -v grep &> /dev/null; then
        # Count function declarations
        local function_count=$(grep -r "^function\|^const.*=.*function\|^export function" . --include="*.js" --include="*.mjs" 2>/dev/null | wc -l)
        echo "Function declarations: $function_count" >> "$quality_report"
        
        # Basic check: if too many functions in small codebase
        if [[ $function_count -gt 100 ]] && [[ $js_files -lt 10 ]]; then
            print_warning "High function count relative to file count - check for duplication"
            ((duplicate_patterns++))
        fi
    fi
    
    # Check 5: Validate ES Module patterns
    print_info "Validating ES Module usage..."
    local module_issues=0
    
    # Check for proper import/export usage
    while IFS= read -r file; do
        [[ -z "$file" ]] && continue
        
        # Check if file uses modern ES modules
        if grep -q "^import\|^export" "$file" 2>/dev/null; then
            # Good - using ES modules
            :
        elif grep -q "require(" "$file" 2>/dev/null; then
            # Found CommonJS pattern
            echo "Module issue: $file uses require() instead of import" >> "$quality_report"
            ((module_issues++))
        fi
    done < <(find . -name "*.js" -o -name "*.mjs" 2>/dev/null | grep -v node_modules | grep -v vendor)
    
    if [[ $module_issues -gt 0 ]]; then
        print_warning "Found $module_issues files using CommonJS instead of ES modules"
        ((quality_issues++))
    fi
    
    # Check 6: Code organization assessment
    print_info "Assessing code organization..."
    local dirs_with_js=$(find . -type f \( -name "*.js" -o -name "*.mjs" \) -exec dirname {} \; 2>/dev/null | sort -u | wc -l)
    
    echo "Code organization: JavaScript files spread across $dirs_with_js directories" >> "$quality_report"
    
    # PHASE 2: AI-powered code quality review
    print_info "Phase 2: Preparing AI-powered code quality review..."
    
    # Build quality summary
    local quality_summary="Code Quality Analysis Summary:
- Total Files: $total_files ($js_files JS, $html_files HTML, $css_files CSS)
- Large Files (>300 lines): $large_files_count
- Naming Convention Issues: $naming_issues
- Module Pattern Issues: $module_issues
- Code Organization: $dirs_with_js directories
- Quality Issues: $quality_issues"
    
    # Sample problematic files for review
    local sample_files=$(find . -name "*.js" -o -name "*.mjs" 2>/dev/null | grep -v node_modules | head -5)
    local sample_code=""
    
    for file in $sample_files; do
        [[ -z "$file" ]] && continue
        sample_code+="
File: $file
Lines: $(wc -l < "$file" 2>/dev/null || echo 0)
Preview:
$(head -30 "$file" 2>/dev/null)
---
"
    done
    
    local quality_report_content=$(cat "$quality_report" 2>/dev/null || echo "   No critical issues detected")
    
    # Build comprehensive code quality prompt using AI helper function
    local copilot_prompt
    copilot_prompt=$(build_step9_code_quality_prompt \
        "$total_files" \
        "$js_files" \
        "$html_files" \
        "$css_files" \
        "$quality_summary" \
        "$quality_report_content" \
        "$large_files_list" \
        "$sample_code")

    echo ""
    echo -e "${CYAN}GitHub Copilot CLI Code Quality Review Prompt:${NC}"
    echo -e "${YELLOW}${copilot_prompt}${NC}\n"
    
    # Check if Copilot CLI is available
    if is_copilot_available; then
        print_info "GitHub Copilot CLI detected - ready for code quality review..."
        
        if [[ "$DRY_RUN" == true ]]; then
            print_info "[DRY RUN] Would invoke: copilot -p with code quality prompt"
        else
            # Smart triggering
            if [[ $quality_issues -gt 0 ]] || [[ "$INTERACTIVE_MODE" == true ]]; then
                if confirm_action "Run Copilot CLI for code quality review?"; then
                    print_info "Starting Copilot CLI code quality analysis..."
                    echo ""
                    
                    # Create log file with unique timestamp
                    local log_timestamp
                    log_timestamp=$(date +%Y%m%d_%H%M%S_%N | cut -c1-21)
                    local log_file="${LOGS_RUN_DIR}/step9_copilot_quality_review_${log_timestamp}.log"
                    print_info "Logging output to: $log_file"
                    
                    # Execute Copilot prompt
                    execute_copilot_prompt "$copilot_prompt" "$log_file"
                    
                    print_success "Copilot CLI code quality review completed"
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
                                    save_step_issues "9" "Code_Quality_Validation" "$organized_issues"
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
                    
                    # User action on critical issues
                    if [[ $quality_issues -gt 3 ]]; then
                        if confirm_action "Multiple code quality issues found - continue workflow?"; then
                            print_warning "Continuing despite quality issues - address in future iterations"
                        else
                            print_error "Workflow paused - improve code quality first"
                            cd "$PROJECT_ROOT"
                            return 1
                        fi
                    fi
                else
                    print_warning "Skipped Copilot code quality review"
                fi
            else
                print_info "No major quality issues - skipping optional review"
                if confirm_action "Run optional code quality optimization review?"; then
                    # Create log file with unique timestamp
                    local log_timestamp
                    log_timestamp=$(date +%Y%m%d_%H%M%S_%N | cut -c1-21)
                    local log_file="${LOGS_RUN_DIR}/step9_copilot_quality_review_${log_timestamp}.log"
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
                                    save_step_issues "9" "Code_Quality_Validation" "$organized_issues"
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
    if [[ $quality_issues -eq 0 ]]; then
        print_success "Code quality validation passed ✅ ($total_files files analyzed)"
        save_step_summary "9" "Code_Quality_Validation" "Code quality validated across ${total_files} files. All quality standards met." "✅"
        
        # Save success status to backlog
        step_issues="### Code Quality Validation

**Total Issues:** 0
**Files Analyzed:** ${total_files}
**Status:** ✅ All Checks Passed

Code quality validated across ${total_files} files. All quality standards met.
"
    else
        print_warning "Found $quality_issues code quality area(s) for improvement"
        print_info "Review recommendations above for code quality enhancements"
        save_step_summary "9" "Code_Quality_Validation" "Found ${quality_issues} code quality improvements needed across ${total_files} files. Review and apply quality enhancements." "⚠️"
        
        # Save to backlog
        step_issues="### Code Quality Issues Found

**Total Issues:** ${quality_issues}
**Files Analyzed:** ${total_files}

"
        if [[ -f "$quality_report" && -s "$quality_report" ]]; then
            step_issues+="### Details

\`\`\`
$(cat "$quality_report")
\`\`\`
"
        fi
    fi
    
    # Always save backlog file
    save_step_issues "9" "Code_Quality_Validation" "$step_issues"
    
    cd "$PROJECT_ROOT"
    update_workflow_status "step9" "✅"
}

# Export step function
export -f step9_code_quality_validation
