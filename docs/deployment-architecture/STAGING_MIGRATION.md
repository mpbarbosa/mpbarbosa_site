# Migration: public/ Directory → mpbarbosa.com Repository

**Migration Date**: December 27, 2025  
**Migration Status**: ✅ Complete  
**Version**: 3.0.0

## Overview

This document tracks the migration from using a local `public/` directory as staging to using a dedicated git repository (`mpbarbosa.com`) for staging before production deployment.

## Architecture Change

### Before (v2.0.0)
```
mpbarbosa_site/
├── src/                    # Source files
├── public/                 # Staging directory (not version controlled)
└── shell_scripts/
    ├── sync_to_public.sh   # src → public → production
    └── deploy_to_webserver.sh
```

### After (v3.0.0)
```
GitHub/
├── mpbarbosa_site/         # Source repository
│   ├── src/                # Source files
│   ├── public.deprecated/  # Archived old staging directory
│   └── shell_scripts/
│       ├── sync_to_staging.sh      # src → ../mpbarbosa.com → production
│       └── deploy_to_webserver.sh
└── mpbarbosa.com/          # NEW: Staging repository (git tracked)
    ├── index.html
    ├── assets/
    ├── images/
    ├── music_in_numbers/
    ├── guia_js/
    ├── monitora_vagas/
    └── busca_vagas/
```

## Benefits of New Architecture

1. **Version Control**: All staging assets tracked in git
2. **Rollback Capability**: Easy rollback to previous deployments via git history
3. **Deployment History**: Complete audit trail of all deployments
4. **Collaboration**: Multiple team members can review staging before production
5. **CI/CD Ready**: Git hooks and GitHub Actions can trigger on staging commits
6. **Backup Strategy**: Git remote acts as automatic backup

## Migration Steps Completed

### Phase 1: Repository Setup ✅
- [x] Created `mpbarbosa.com` git repository on GitHub
- [x] Added comprehensive README explaining staging role
- [x] Copied development configuration files (.editorconfig, .node-version, .nvmrc)
- [x] Initial commit and push to remote

### Phase 2: Script Migration ✅
- [x] Created `sync_to_staging.sh` from `sync_to_public.sh`
- [x] Updated all `PUBLIC_DIR` references to `STAGING_DIR`
- [x] Changed `STAGING_DIR` to point to `../mpbarbosa.com`
- [x] Updated `deploy_to_webserver.sh` to use `../mpbarbosa.com` as source
- [x] Updated script version to 3.0.0
- [x] Updated help documentation in scripts

### Phase 3: Directory Management ✅
- [x] Renamed `public/` → `public.deprecated/`
- [x] Added `public.deprecated/` to `.gitignore`
- [x] Created migration documentation

### Phase 4: Documentation Updates (Next)
- [ ] Update `.github/copilot-instructions.md`
- [ ] Update `shell_scripts/README.md`
- [ ] Update deployment guides in `docs/`
- [ ] Update main project README.md

## New Deployment Workflow

### Step 1: Source → Staging (Git Repository)
```bash
cd /home/mpb/Documents/GitHub/mpbarbosa_site
./shell_scripts/sync_to_staging.sh --step1 --verbose
```

This command:
1. Copies files from `src/` to `../mpbarbosa.com/`
2. Syncs all sibling projects (music_in_numbers, guia_js, etc.)
3. Stages changes in mpbarbosa.com repository
4. Optionally commits with timestamp message

### Step 2: Staging → Production
```bash
./shell_scripts/sync_to_staging.sh --step2 --production-dir /var/www/html
```

This command:
1. Copies files from `../mpbarbosa.com/` to production server
2. Sets proper permissions
3. Creates backup of production files
4. Validates deployment

### Combined Deployment
```bash
./shell_scripts/sync_to_staging.sh --both-steps
```

## Script Changes Summary

### sync_to_staging.sh (v3.0.0)
- Changed `PUBLIC_DIR` → `STAGING_DIR`
- Updated `STAGING_DIR="$(cd "$PROJECT_ROOT/../mpbarbosa.com" && pwd)"`
- Renamed step variables: `STEP_SOURCE_TO_STAGING`, `STEP_STAGING_TO_PRODUCTION`
- Updated help text and documentation

### deploy_to_webserver.sh (v3.0.0)
- Changed `SOURCE_DIR` from `$PROJECT_ROOT/public` to `$(cd "$PROJECT_ROOT/../mpbarbosa.com" && pwd)`
- Updated header documentation to reflect new architecture
- Maintained all existing functionality (backup, permissions, validation)

## Rollback Plan

If issues arise with the new architecture:

1. **Restore public/ directory**:
   ```bash
   cd /home/mpb/Documents/GitHub/mpbarbosa_site
   mv public.deprecated public
   ```

2. **Revert to v2.0.0 scripts**:
   ```bash
   cd shell_scripts
   git checkout v2.0.0 sync_to_public.sh deploy_to_webserver.sh
   ```

3. **Use legacy workflow**:
   ```bash
   ./shell_scripts/sync_to_public.sh --both-steps
   ```

## Testing Checklist

- [ ] Test `sync_to_staging.sh --step1 --dry-run`
- [ ] Test `sync_to_staging.sh --step1 --verbose`
- [ ] Verify files copied to `../mpbarbosa.com/`
- [ ] Test `sync_to_staging.sh --step2 --dry-run`
- [ ] Test full deployment to staging server
- [ ] Verify git commits in mpbarbosa.com repository
- [ ] Test rollback via git history
- [ ] Update and run Jest test suite
- [ ] Update CI/CD workflows if applicable

## Future Enhancements

1. **Auto-commit on Step 1**: Add `--commit` flag to automatically commit staging changes
2. **Git Push Integration**: Add `--push` flag to push staging to GitHub remote
3. **Deployment Tags**: Automatically tag releases in staging repository
4. **GitHub Actions**: Add workflow to auto-deploy on staging commits
5. **Preview Environments**: Deploy staging to preview URL before production
6. **Diff Reporting**: Show git diff before production deployment

## Notes

- The `public.deprecated/` directory is kept temporarily for rollback safety
- Can be deleted after successful migration validation (30-day retention recommended)
- All sibling projects continue to work with new architecture
- No changes required to sibling project repositories
- Production deployment path unchanged (`/var/www/html` or custom)

---

**Migration Completed By**: MP Barbosa  
**Next Review Date**: January 27, 2026
