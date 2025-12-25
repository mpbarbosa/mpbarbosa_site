# Busca Vagas Directory Restructuring

## Change Summary

**Date**: 2025-12-25  
**Type**: Architecture Improvement  
**Impact**: Directory structure, deployment scripts, documentation

### What Changed

Moved `public/submodules/busca_vagas/` → `public/busca_vagas/`

**Rationale**: Busca Vagas is a backend API service, not a client-side sibling project like Music in Numbers or Guia Turístico. The `/api` endpoint is served separately from the static site content.

### Architecture Clarification

#### Sibling Projects (Client-Side)
Located in `public/submodules/` (legacy naming for URL compatibility):
- **Music in Numbers** - Spotify analytics frontend
- **Guia Turístico** - Travel guide frontend
- **Monitora Vagas** - Hotel monitoring frontend

#### Backend API (Server-Side)
Located in `public/busca_vagas/` (NOT in submodules):
- **Busca Vagas** - Node.js/Express API server with Puppeteer scraping
- Serves `/api` endpoint for hotel vacancy data
- Deployed as systemd service (`busca_vagas_node_app.service`)

### Files Updated

#### 1. Directory Structure ✅
```bash
# Before
public/submodules/busca_vagas/
├── client/public/
└── src/

# After
public/busca_vagas/
├── client/public/
└── src/
```

#### 2. Deployment Scripts ✅

**shell_scripts/sync_to_public.sh**:
- Line 878: `$PUBLIC_DIR/submodules/busca_vagas` → `$PUBLIC_DIR/busca_vagas`
- Line 1017-1019: Updated validation paths
- Lines 372-373: Updated documentation comments
- Lines 870-880: Updated `copy_busca_vagas_project()` function

#### 3. Documentation ✅

**.github/copilot-instructions.md**:
- Lines 151-154: Updated file structure diagram
- Lines 193-197: Updated public directory structure
- Lines 301-316: Clarified Busca Vagas as backend API
- Removed from submodules section

#### 4. Tests ✅
- No test files reference `submodules/busca_vagas`
- No updates needed

#### 5. HTML/JavaScript Files ✅
- No direct references to `submodules/busca_vagas` in src/
- Monitora Vagas uses `/api` endpoint (proxy in production)
- No URL changes needed

### Production Deployment Impact

#### Nginx Configuration
The Busca Vagas API should be served via reverse proxy:

```nginx
# /api endpoint proxies to Node.js service
location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

#### Systemd Service
No changes needed - service configuration remains the same:
```bash
/etc/systemd/system/busca_vagas_node_app.service
```

### URL Structure

#### Before (Incorrect)
- API: `https://mpbarbosa.com/submodules/busca_vagas/api/...` ❌
- Frontend: `https://mpbarbosa.com/submodules/busca_vagas/client/public/` ❌

#### After (Correct)
- API: `https://mpbarbosa.com/api/...` ✅ (nginx proxy)
- Frontend: `https://mpbarbosa.com/busca_vagas/client/public/` ✅
- Service: Backend runs on `localhost:3000` ✅

### Verification Steps

1. **Check directory structure**:
```bash
ls -la public/busca_vagas/
# Should show: client/, src/
```

2. **Test deployment**:
```bash
./shell_scripts/sync_to_public.sh --step1 --verbose
# Should copy to public/busca_vagas/
```

3. **Verify API endpoint** (production):
```bash
curl https://www.mpbarbosa.com/api/health
# Should return API health status
```

4. **Check systemd service**:
```bash
sudo systemctl status busca_vagas_node_app.service
# Should show: active (running)
```

### Migration Checklist

- [x] Move directory from `public/submodules/busca_vagas/` to `public/busca_vagas/`
- [x] Update `shell_scripts/sync_to_public.sh` deployment paths
- [x] Update `.github/copilot-instructions.md` documentation
- [x] Update `shell_scripts/sync_to_public.sh` comments and output structure
- [x] Verify no test failures
- [x] Verify no HTML/JS references need updating
- [ ] Test deployment in production (pending)
- [ ] Verify nginx proxy configuration (production)
- [ ] Verify systemd service still works (production)

### Breaking Changes

**None** - This is an internal directory restructuring. All public URLs remain the same:
- API endpoint: `/api` (unchanged)
- Monitora Vagas client: Uses `/api` endpoint (unchanged)
- No client-facing URL changes

### Related Files

- `shell_scripts/sync_to_public.sh` - Deployment script
- `.github/copilot-instructions.md` - Architecture documentation
- `docs/TERMINOLOGY_STANDARDIZATION.md` - Terminology guide
- `public/busca_vagas/` - New location
- `../busca_vagas/` - Sibling project source (unchanged)

### Notes

- Busca Vagas is the only backend service in the project
- All other sibling projects (Music in Numbers, Guia Turístico, Monitora Vagas) are client-side only
- The `public/submodules/` directory now exclusively contains client-side projects
- This change improves architectural clarity and separation of concerns

---

**Status**: ✅ Complete - Ready for production testing  
**Next Steps**: Deploy to staging/production and verify nginx proxy configuration
