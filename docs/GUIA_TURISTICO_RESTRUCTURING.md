# Guia Turístico Directory Restructuring

## Change Summary

**Date**: 2025-12-25  
**Type**: Architecture Improvement  
**Impact**: Directory structure, deployment scripts, documentation, HTML references

### What Changed

Moved `public/submodules/guia_turistico/` → `public/guia_turistico/`

**Rationale**: Continue architecture standardization - move client-side projects out of legacy `submodules/` directory. Only Music in Numbers remains in `submodules/` for backward compatibility.

### Architecture Clarification

#### Client-Side Projects (Top-Level in public/)
- **Guia Turístico** - `public/guia_turistico/` ✅ (moved)
- **Monitora Vagas** - `public/monitora_vagas/` (already moved)
- **Busca Vagas** - `public/busca_vagas/` (already moved, backend API)

#### Legacy Submodules Directory
- **Music in Numbers** - `public/submodules/music_in_numbers/` (remains for URL compatibility)

### Files Updated

#### 1. Directory Structure ✅
```bash
# Before
public/submodules/guia_turistico/
├── README.md
├── index.html
├── index.js
└── ...

# After
public/guia_turistico/
├── README.md
├── index.html
├── index.js
└── ...
```

#### 2. HTML References ✅

**src/pages/guia-turistico.html**:
```html
<!-- Before -->
<meta http-equiv="refresh" content="0; url=../submodules/guia_turistico/src/index.html" />

<!-- After -->
<meta http-equiv="refresh" content="0; url=../guia_turistico/index.html" />
```

**src/index.html** (line 110):
```html
<!-- Before -->
<a href="submodules/guia_turistico/" target="_blank" rel="noopener noreferrer">

<!-- After -->
<a href="guia_turistico/" target="_blank" rel="noopener noreferrer">
```

#### 3. Deployment Scripts ✅

**shell_scripts/sync_to_public.sh**:
- Line 734: `$PUBLIC_DIR/submodules/guia_turistico` → `$PUBLIC_DIR/guia_turistico`
- Line 369: Updated documentation comment
- Function `copy_guia_turistico_project()` updated

#### 4. Documentation ✅

**.github/copilot-instructions.md**:
- Lines 89-93: Updated deployment description
- Lines 194-199: Updated file structure diagram
- Lines 217-220: Updated redirect page comments
- Lines 373-376: Updated access method testing paths

#### 5. Tests ✅
- No test files reference `submodules/guia_turistico`
- Coverage reports are generated files (will update on next test run)
- No manual test updates needed

### URL Structure

#### Before
- Project: `https://mpbarbosa.com/submodules/guia_turistico/` ❌
- Via redirect: `https://mpbarbosa.com/pages/guia-turistico.html` → old path

#### After
- Project: `https://mpbarbosa.com/guia_turistico/` ✅
- Via redirect: `https://mpbarbosa.com/pages/guia-turistico.html` → new path
- Direct link from main page works

### Verification Steps

1. **Check directory structure**:
```bash
ls -la public/guia_turistico/
# Should show: HTML, JS, CSS files
```

2. **Test deployment**:
```bash
./shell_scripts/sync_to_public.sh --step1 --verbose
# Should copy to public/guia_turistico/
```

3. **Test HTML redirect**:
```bash
cd src && npm start
# Visit: http://localhost:8080/pages/guia-turistico.html
# Should redirect to: /guia_turistico/
```

4. **Test main page link**:
```bash
# Visit: http://localhost:8080/
# Click "Guia Turístico" in Projetos (IA) section
# Should open: /guia_turistico/ in new tab
```

### Migration Checklist

- [x] Move directory from `public/submodules/guia_turistico/` to `public/guia_turistico/`
- [x] Update `src/pages/guia-turistico.html` redirect path
- [x] Update `src/index.html` project link
- [x] Update `shell_scripts/sync_to_public.sh` deployment path
- [x] Update `.github/copilot-instructions.md` documentation
- [x] Verify no test failures
- [ ] Test deployment in production (pending)
- [ ] Verify all project links work (pending)
- [ ] Update nginx configuration if needed (pending)

### Breaking Changes

**Minor** - Redirect path changed:
- Old: `/submodules/guia_turistico/`
- New: `/guia_turistico/`
- Impact: Bookmarks to old URL will break
- Mitigation: Consider nginx redirect rule (optional)

### Nginx Redirect (Optional)

To maintain backward compatibility, add to nginx config:
```nginx
# Redirect old guia_turistico path to new location
location /submodules/guia_turistico {
    return 301 /guia_turistico$request_uri;
}
```

### Related Files

- `shell_scripts/sync_to_public.sh` - Deployment script
- `.github/copilot-instructions.md` - Architecture documentation
- `src/index.html` - Main page project link
- `src/pages/guia-turistico.html` - Redirect page
- `public/guia_turistico/` - New location
- `../guia_turistico/` - Sibling project source (unchanged)

### Architecture Status

After this change, the directory structure is:

```
public/
├── busca_vagas/              # Backend API
├── guia_turistico/           # Travel guide (moved) ✅
├── monitora_vagas/           # Hotel monitoring
└── submodules/               # Legacy directory
    └── music_in_numbers/     # Only remaining project
```

**Next Step**: Consider moving Music in Numbers to `public/music_in_numbers/` to complete the migration and remove the `submodules/` directory entirely.

### Notes

- Guia Turístico is deployed from `../guia_turistico/src/*` (copies all files to root of destination)
- Project includes: HTML, JavaScript, CSS, and libs/guia_js library
- This change improves consistency with Monitora Vagas and Busca Vagas locations
- The `public/submodules/` directory now only contains Music in Numbers

---

**Status**: ✅ Complete - Ready for production testing  
**Next Steps**: Deploy to staging/production and test all links
