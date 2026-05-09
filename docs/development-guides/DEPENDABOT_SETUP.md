# Dependabot Automated Dependency Monitoring

## Overview
This project uses **GitHub Dependabot** for automated dependency monitoring and security vulnerability detection. Dependabot automatically:
- Scans dependencies for known security vulnerabilities
- Creates pull requests to update outdated dependencies
- Groups updates intelligently (dev vs production dependencies)
- Provides automated security alerts

## Configuration Location
- **File**: `.github/dependabot.yml`
- **Documentation**: [GitHub Dependabot Configuration Options](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)

## Monitored Dependencies

### 1. NPM Dependencies (`/src/package.json`)
- **Schedule**: Weekly on Mondays at 09:00 (America/Sao_Paulo timezone)
- **Open PR Limit**: 5 concurrent pull requests
- **Grouping Strategy**:
  - `development-dependencies` - Groups all devDependencies updates
  - `production-dependencies` - Groups all dependencies updates
- **Commit Convention**: `chore(deps): update <package-name>`
- **Labels**: `dependencies`, `npm`
- **Auto-assigned**: @mpbarbosa (reviewer and assignee)

### 2. GitHub Actions Dependencies
- **Schedule**: Weekly on Mondays at 09:00 (America/Sao_Paulo timezone)
- **Open PR Limit**: 3 concurrent pull requests
- **Commit Convention**: `chore(ci): update <action-name>`
- **Labels**: `dependencies`, `github-actions`
- **Auto-assigned**: @mpbarbosa (reviewer and assignee)

## Features Enabled

### ✅ Security Alerts
Dependabot automatically:
- Scans for known vulnerabilities in dependencies
- Creates security advisories on the GitHub Security tab
- Prioritizes critical security updates
- Provides automated PRs for security patches

### ✅ Version Updates
- Weekly scheduled checks for outdated dependencies
- Intelligent grouping reduces PR noise
- Conventional commit messages for clean git history
- Automatic assignment and labeling for easier triage

### ✅ PR Management
- Limits concurrent PRs to avoid overwhelming review queue
- Groups related updates together
- Auto-assigns reviewers for accountability
- Applies consistent labels for filtering

## GitHub Repository Settings

### Required Configuration Steps
1. **Enable Dependabot Security Updates** (if not already enabled):
   - Go to: `Settings` → `Code security and analysis`
   - Enable: "Dependabot alerts"
   - Enable: "Dependabot security updates"

2. **Enable Dependabot Version Updates**:
   - Automatically enabled once `.github/dependabot.yml` is committed
   - Verify at: `Insights` → `Dependency graph` → `Dependabot`

3. **Configure Security Alerts Notifications**:
   - Go to: `Settings` → `Notifications`
   - Configure alert preferences for vulnerability notifications

### Optional Enhancements
- **Dependabot Secrets**: Configure if dependencies require authentication
- **Auto-merge Rules**: Set up GitHub Actions to auto-merge minor/patch updates
- **Required Status Checks**: Ensure tests pass before merging Dependabot PRs

## Workflow Integration

### Manual PR Review Process
1. Dependabot creates a PR on Monday mornings
2. Automated tests run (if configured)
3. Review PR details and changelog
4. Approve and merge if tests pass and changes are safe
5. Dependabot automatically rebases PRs if needed

### Handling Security Alerts
1. Security alerts appear in `Security` → `Dependabot alerts`
2. Dependabot creates high-priority PRs for vulnerabilities
3. Review severity and affected code paths
4. Test thoroughly before merging security updates
5. Document breaking changes if any

## Best Practices

### ✅ DO
- Review Dependabot PRs weekly to keep dependencies current
- Read changelogs for major version updates
- Test locally before merging dependency updates
- Keep Dependabot configuration up-to-date
- Monitor security alerts promptly

### ❌ DON'T
- Ignore security vulnerability alerts
- Auto-merge without running tests
- Disable Dependabot without alternative monitoring
- Let Dependabot PRs accumulate indefinitely
- Skip reading breaking change documentation

## Monitoring and Maintenance

### Check Dependabot Status
```bash
# View Dependabot configuration
cat .github/dependabot.yml

# Check for open Dependabot PRs
gh pr list --author "app/dependabot"

# View security alerts (requires GitHub CLI)
gh api repos/:owner/:repo/dependabot/alerts
```

### Troubleshooting
- **No PRs created**: Check Dependabot logs in `Insights` → `Dependency graph` → `Dependabot`
- **Authentication errors**: Verify repository access permissions
- **Invalid configuration**: GitHub will create an issue if `dependabot.yml` is invalid
- **Disabled Dependabot**: Check repository settings under `Code security and analysis`

## Related Documentation
- [GitHub Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Keeping Dependencies Updated](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates)
- [Configuring Dependabot Security Updates](https://docs.github.com/en/code-security/dependabot/dependabot-security-updates)

## Version History
- **v1.1.6** (2025-12-11): Initial Dependabot configuration
  - NPM dependencies monitoring for `/src/package.json`
  - GitHub Actions monitoring
  - Weekly scheduled updates
  - Grouped dependency updates (dev vs production)
  - Conventional commit message integration
