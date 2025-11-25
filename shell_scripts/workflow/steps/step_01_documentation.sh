#!/bin/bash
################################################################################
# Step 1: AI-Powered Documentation Updates
# Purpose: Update documentation based on code changes with AI assistance
# Part of: Tests & Documentation Workflow Automation v1.5.0
# Version: 1.5.0
################################################################################

# Module version information
readonly STEP1_VERSION="1.5.0"
readonly STEP1_VERSION_MAJOR=1
readonly STEP1_VERSION_MINOR=5
readonly STEP1_VERSION_PATCH=0

# Get the module version
# Usage: step1_get_version [--format=simple|full|semver]
# Returns: Version string
step1_get_version() {
    local format="${1:---format=simple}"
    
    case "$format" in
        --format=simple|simple)
            echo "$STEP1_VERSION"
            ;;
        --format=full|full)
            echo "Step 1 (Documentation Updates) v$STEP1_VERSION"
            ;;
        --format=semver|semver)
            echo "Major: $STEP1_VERSION_MAJOR, Minor: $STEP1_VERSION_MINOR, Patch: $STEP1_VERSION_PATCH"
            ;;
        --format=json|json)
            echo "{\"version\":\"$STEP1_VERSION\",\"major\":$STEP1_VERSION_MAJOR,\"minor\":$STEP1_VERSION_MINOR,\"patch\":$STEP1_VERSION_PATCH}"
            ;;
        *)
            echo "$STEP1_VERSION"
            ;;
    esac
}

# Main step function - updates documentation based on git changes
# Returns: 0 for success, 1 for failure
step1_update_documentation() {
    print_step "1" "Update Related Documentation"
    
    cd "$PROJECT_ROOT" || return 1
    
    # Identify affected docs based on git diff (use cached git state)
    local changed_files
    changed_files=$(get_git_diff_files_output)
    
    print_info "Changed files detected:"
    echo "$changed_files" | head -20
    
    # Map files to documentation (intelligent routing)
    local docs_to_review=()
    
    if echo "$changed_files" | grep -q "shell_scripts/"; then
        docs_to_review+=("shell_scripts/README.md")
        print_info "→ shell_scripts modified - review shell_scripts/README.md"
    fi
    
    if echo "$changed_files" | grep -q "src/scripts/"; then
        docs_to_review+=("README.md")
        print_info "→ src/scripts modified - review README.md"
    fi
    
    if echo "$changed_files" | grep -q "docs/"; then
        print_info "→ Documentation files modified"
    fi
    
    # Build comprehensive GitHub Copilot CLI prompt for documentation updates
    print_info "Preparing GitHub Copilot CLI prompt for documentation updates..."
    
    local modified_files_list
    modified_files_list=$(echo "$changed_files" | tr '\n' ',' | sed 's/,$//')
    
    # Build AI prompt using helper function
    local copilot_prompt
    copilot_prompt=$(build_doc_analysis_prompt "$modified_files_list" "${docs_to_review[*]}")
    
    echo -e "\n${CYAN}GitHub Copilot CLI Prompt:${NC}"
    echo -e "${YELLOW}${copilot_prompt}${NC}\n"
    
    # Check if new GitHub Copilot CLI is available
    if is_copilot_available; then
        print_info "GitHub Copilot CLI detected - invoking documentation update..."
        
        if [[ "$DRY_RUN" == true ]]; then
            print_info "[DRY RUN] Would invoke: copilot -p with documentation prompt"
        else
            if confirm_action "Run GitHub Copilot CLI to update documentation?" "y"; then
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
                local log_file="${LOGS_RUN_DIR}/step1_copilot_documentation_update_${log_timestamp}.log"
                print_info "Logging output to: $log_file"
                
                # Execute Copilot prompt
                execute_copilot_prompt "$copilot_prompt" "$log_file"
                
                print_success "GitHub Copilot CLI session completed"
                print_info "Full session log saved to: $log_file"
                
                # Extract and save issues using library function
                extract_and_save_issues_from_log "1" "Update_Documentation" "$log_file"
            else
                print_warning "Skipped GitHub Copilot CLI - using manual review"
            fi
        fi
    else
        print_warning "GitHub Copilot CLI not found - using basic checks only"
        print_info "Install from: https://github.com/github/gh-copilot"
        print_info "Please use the prompt above with GitHub Copilot manually"
    fi
    
    # VERSION CONSISTENCY CHECK
    print_info "Checking version consistency across documentation..."
    local version_issues=""
    local version_check_failed=false
    
    # Check README.md for version references
    if [[ -f "README.md" ]]; then
        local readme_versions
        readme_versions=$(grep -n "workflow.*v1\.[0-9]\.0\|automation.*v1\.[0-9]\.0\|execute_tests_docs_workflow.*v1\.[0-9]\.0" README.md 2>/dev/null || true)
        if [[ -n "$readme_versions" ]]; then
            if echo "$readme_versions" | grep -qv "v${SCRIPT_VERSION}"; then
                print_warning "Version inconsistency detected in README.md"
                version_issues+="⚠️  **VERSION MISMATCH**: README.md contains outdated version references\n"
                version_issues+="   - Script version: v${SCRIPT_VERSION}\n"
                version_issues+="   - Found in README.md:\n"
                while IFS= read -r line; do
                    version_issues+="     Line $line\n"
                done <<< "$readme_versions"
                version_issues+="   - Update all references to v${SCRIPT_VERSION}\n\n"
                version_check_failed=true
            fi
        fi
    fi
    # Check .github/copilot-instructions.md for version references
    if [[ -f ".github/copilot-instructions.md" ]]; then
        local copilot_versions
        copilot_versions=$(grep -n "workflow.*v1\.[0-9]\.0\|automation.*v1\.[0-9]\.0\|execute_tests_docs_workflow.*v1\.[0-9]\.0" .github/copilot-instructions.md 2>/dev/null || true)
        if [[ -n "$copilot_versions" ]]; then
            if echo "$copilot_versions" | grep -qv "v${SCRIPT_VERSION}"; then
                print_warning "Version inconsistency detected in .github/copilot-instructions.md"
                version_issues+="⚠️  **VERSION MISMATCH**: .github/copilot-instructions.md contains outdated version references\n"
                version_issues+="   - Script version: v${SCRIPT_VERSION}\n"
                version_issues+="   - Found in copilot-instructions.md:\n"
                while IFS= read -r line; do
                    version_issues+="     Line $line\n"
                done <<< "$copilot_versions"
                version_issues+="   - Update all references to v${SCRIPT_VERSION}\n\n"
                version_check_failed=true
            fi
        fi
    fi
    
    # Save version check results if issues found
    if [[ "$version_check_failed" == true ]]; then
        local version_report="## Version Consistency Issues\n\n"
        version_report+="**Timestamp**: $(date '+%Y-%m-%d %H:%M:%S')\n"
        version_report+="**Current Script Version**: v${SCRIPT_VERSION}\n\n"
        version_report+="### Issues Detected\n\n"
        version_report+="$version_issues"
        version_report+="\n### Recommended Actions\n\n"
        version_report+="1. Update README.md to reference v${SCRIPT_VERSION}\n"
        version_report+="2. Update .github/copilot-instructions.md to reference v${SCRIPT_VERSION}\n"
        version_report+="3. Ensure all version references are consistent\n"
        
        save_step_issues "1" "Update_Documentation_Version_Check" "$(echo -e "$version_report")"
        print_warning "Version inconsistencies saved to backlog for review"
    else
        print_success "Version consistency check passed"
    fi
    
    # Fallback to manual editing if needed
    if [[ ${#docs_to_review[@]} -gt 0 ]] && [[ "$INTERACTIVE_MODE" == true ]]; then
        if confirm_action "Open documentation files for manual editing?"; then
            for doc in "${docs_to_review[@]}"; do
                if [[ -f "$doc" ]]; then
                    print_info "Opening: $doc"
                    ${EDITOR:-nano} "$doc"
                fi
            done
            
            # POST-EDIT VERIFICATION
            print_info "Running post-edit verification..."
            local verification_issues=""
            local verification_failed=false
            
            for doc in "${docs_to_review[@]}"; do
                if [[ -f "$doc" ]]; then
                    # Check for edit error indicators
                    if grep -q "No match found" "$doc" 2>/dev/null; then
                        print_error "Edit verification failed: 'No match found' error in $doc"
                        verification_issues+="❌ **CRITICAL**: 'No match found' error in \`$doc\`\n"
                        verification_failed=true
                    fi
                    
                    # Check for merge conflict markers
                    if grep -q "<<<<<<< HEAD\|=======" "$doc" 2>/dev/null; then
                        print_warning "Merge conflict markers detected in $doc"
                        verification_issues+="⚠️  **WARNING**: Merge conflict markers in \`$doc\`\n"
                        verification_failed=true
                    fi
                    
                    # Check for backup files
                    if [[ -f "${doc}~" ]] || [[ -f "${doc}.bak" ]]; then
                        print_warning "Backup files detected for $doc"
                        verification_issues+="ℹ️  **INFO**: Backup files found for \`$doc\`\n"
                    fi
                fi
            done
            
            if [[ "$verification_failed" == true ]]; then
                print_error "Post-edit verification detected issues"
                
                local verification_report="## Post-Edit Verification Issues\n\n"
                verification_report+="**Timestamp**: $(date '+%Y-%m-%d %H:%M:%S')\n"
                verification_report+="**Files Reviewed**: ${#docs_to_review[@]}\n\n"
                verification_report+="$verification_issues"
                verification_report+="\n### Action Required\n\n"
                verification_report+="1. Review flagged files manually\n"
                verification_report+="2. Fix incomplete edit operations\n"
                verification_report+="3. Remove merge conflict markers\n"
                
                save_step_issues "1" "Update_Documentation_Verification" "$(echo -e "$verification_report")"
                
                if ! confirm_action "Continue workflow despite verification issues?" "n"; then
                    print_error "Workflow halted for manual verification"
                    return 1
                fi
            else
                print_success "Post-edit verification passed"
            fi
        fi
    fi
    
    print_success "Documentation review complete"
    
    # Save step summary
    local summary_text="Reviewed ${#docs_to_review[@]} documentation files for consistency with recent code changes."
    save_step_summary "1" "Update_Documentation" "$summary_text" "✅"
    
    # Always save backlog file with final status
    local step_backlog="### Documentation Update Summary

**Files Reviewed:** ${#docs_to_review[@]}
**Change Scope:** ${CHANGE_SCOPE}
**Modified Files:** ${ANALYSIS_MODIFIED}
**Status:** ✅ Complete

Reviewed ${#docs_to_review[@]} documentation files for consistency with recent code changes.

### Documentation Files Reviewed

"
    for doc in "${docs_to_review[@]}"; do
        step_backlog+="- \`${doc}\`
"
    done
    
    if [[ ${#docs_to_review[@]} -eq 0 ]]; then
        step_backlog+="No documentation files required review based on recent changes.
"
    fi
    
    save_step_issues "1" "Update_Documentation" "$step_backlog"
    
    update_workflow_status "step1" "✅"
}

# Export step functions
export -f step1_update_documentation
export -f step1_get_version
