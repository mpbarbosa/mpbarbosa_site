# Deprecated Scripts Directory

This directory contains shell scripts that are **no longer recommended** for use in the current project architecture.

## ⚠️ Deprecation Notice

**Effective Date**: December 25, 2025

All scripts in this directory have been deprecated due to the project's migration from **git submodules** to **sibling project architecture**.

## Deprecated Scripts

### 1. `pull_all_submodules.sh`
**Reason for Deprecation**: Designed for git submodule management, but project no longer uses git submodules.

**Current Recommended Workflow**:
```bash
# Pull each sibling project independently
cd ../music_in_numbers && git pull
cd ../guia_js && git pull
cd ../monitora_vagas && git pull
cd ../busca_vagas && git pull

# Pull main repository
cd mpbarbosa_site && git pull
```

### 2. `push_all_submodules.sh`
**Reason for Deprecation**: Designed for git submodule management, but project no longer uses git submodules.

**Current Recommended Workflow**:
```bash
# Push each sibling project independently
cd ../music_in_numbers && git add . && git commit -m "message" && git push
cd ../guia_js && git add . && git commit -m "message" && git push
cd ../monitora_vagas && git add . && git commit -m "message" && git push
cd ../busca_vagas && git add . && git commit -m "message" && git push

# Push main repository
cd mpbarbosa_site && git add . && git commit -m "message" && git push
```

## Why Keep Deprecated Scripts?

These scripts are retained for:

1. **Historical Reference**: Document the previous git submodule workflow
2. **Transition Period**: Allow teams still migrating to access old workflows
3. **Educational Purpose**: Demonstrate evolution of project architecture
4. **Rollback Safety**: Emergency fallback if needed (though not recommended)

## Migration Complete

**Git Submodules Status**: DEPRECATED (`.gitmodules` file is now empty)

**Current Architecture**: Four sibling projects managed independently:
- `../music_in_numbers` - Music in Numbers (Spotify analytics)
- `../guia_js` - Guia Turístico (Travel guide)
- `../monitora_vagas` - Monitora Vagas (Hotel monitoring)
- `../busca_vagas` - Busca Vagas (Backend API)

**Deployment**: Sibling projects are copied to `public/submodules/` via `sync_to_public.sh --step1`

## Running Deprecated Scripts

If you **must** run a deprecated script (not recommended):

```bash
# Both scripts will display a deprecation warning
./shell_scripts/deprecated/pull_all_submodules.sh
./shell_scripts/deprecated/push_all_submodules.sh

# You will be prompted to confirm before execution
```

## Documentation

For current sibling project workflow, see:
- **[Copilot Instructions](../../.github/copilot-instructions.md)** - Complete workflow documentation
- **[Shell Scripts README](../README.md)** - Active script documentation
- **[Two-Step Deployment Architecture](../../docs/deployment-architecture/TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md)** - Deployment workflow

## Removal Timeline

These scripts will be **completely removed** in a future version (planned: Q2 2026).

Until then, they remain available but **strongly discouraged** from use.

## Questions?

If you need help with the current sibling project workflow:
1. Check `.github/copilot-instructions.md` for complete documentation
2. Review `shell_scripts/README.md` for active script descriptions
3. Run `sync_to_public.sh --help` for deployment guidance

---

**Last Updated**: December 25, 2025  
**Status**: 🔴 Deprecated - Do not use for new work
