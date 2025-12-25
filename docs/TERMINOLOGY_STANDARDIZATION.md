# Architecture Terminology Standardization

## 🎯 Objective
Standardize terminology across all documentation to eliminate confusion between deprecated git submodules and current sibling project architecture.

## 📋 Current State Analysis

### Architecture Reality
1. **Git Submodules**: DEPRECATED (`.gitmodules` is empty)
2. **Current Architecture**: Sibling projects in parent directory
   - `../music_in_numbers/` → Music in Numbers
   - `../guia_turistico/` → Guia Turístico
   - `../monitora_vagas/` → Monitora Vagas
   - `../busca_vagas/` → Busca Vagas (Backend API)

3. **Deployment Directory**: `public/submodules/`
   - **Note**: Directory name "submodules" is LEGACY naming
   - Contains deployed copies of sibling projects
   - Retained for URL backward compatibility

### Terminology Issues Found
- 336 references to "submodule" in src/ directory
- Mixed usage across 43+ documentation files
- Confusion between:
  - Git submodules (deprecated)
  - Sibling projects (current)
  - `public/submodules/` directory (legacy naming)

## 🔧 Standardization Rules

### 1. Preferred Terminology

| **OLD (Incorrect)** | **NEW (Correct)** | **Context** |
|---------------------|-------------------|-------------|
| "submodule" | "sibling project" | When referring to external repositories |
| "submodules directory" | "sibling projects deployment directory" | When referring to `public/submodules/` |
| "git submodule" | "independent repository" | When referring to project structure |
| "submodule architecture" | "sibling project architecture" | When describing the pattern |

### 2. Acceptable Uses of "submodule"

The term "submodule" should ONLY be used in these specific contexts:

1. **Directory Paths** (legacy naming retained):
   - `public/submodules/` (actual directory name)
   - URLs: `http://example.com/submodules/music_in_numbers/`

2. **Historical References**:
   - "Git submodules are deprecated"
   - "Previously used git submodules, now uses sibling architecture"
   - Documentation of migration from submodules to siblings

3. **File Names** (if renaming causes issues):
   - `pull_all_submodules.sh` → Mark as DEPRECATED
   - `push_all_submodules.sh` → Mark as DEPRECATED

### 3. Standard Phrases

Use these standardized phrases consistently:

**✅ CORRECT:**
- "Four sibling projects deployed to `public/submodules/` directory"
- "Sibling project architecture with legacy deployment directory naming"
- "Independent repositories managed as sibling projects"
- "Deployment staging: `public/submodules/` (legacy directory naming)"

**❌ INCORRECT:**
- "Submodules managed via git submodule"
- "Update submodules with git pull"
- "Submodule configuration in .gitmodules"

## 📝 Files Requiring Updates

### Priority 1: Critical Documentation (Update First)

1. **`.github/copilot-instructions.md`** (863 lines)
   - Lines 82, 84, 114-115, 134-135, 214, 330, 353, 358
   - Add terminology section
   - Clarify legacy naming

2. **`docs/README.md`** (365 lines)
   - Lines 111-200 (project structure)
   - Update all submodule references

3. **`docs/development-guides/GIT_BEST_PRACTICES_GUIDE.md`**
   - Line 6: Remove reference to `/src/submodules/README.md`
   - Update git workflow instructions

4. **`shell_scripts/README.md`**
   - Update script documentation
   - Clarify sibling project management

### Priority 2: Code and Configuration

5. **`src/index.html`**
   - Check for submodule references in comments
   - Update project link descriptions

6. **`shell_scripts/sync_to_public.sh`**
   - Add comments clarifying terminology
   - Update echo messages

7. **`shell_scripts/deploy_to_webserver.sh`**
   - Update documentation comments
   - Clarify deployment paths

### Priority 3: Testing Documentation

8. **`docs/testing-qa/*.md`**
   - Update test descriptions
   - Fix path references

9. **Test files in `src/__tests__/`**
   - Update test names and descriptions
   - Fix assertions checking for submodules

## 🚀 Implementation Plan

### Phase 1: Documentation Update (Day 1)
1. Update `.github/copilot-instructions.md` with terminology section
2. Update `docs/README.md` with standardized language
3. Fix `docs/development-guides/GIT_BEST_PRACTICES_GUIDE.md`

### Phase 2: Code Comments (Day 1-2)
4. Update shell script comments
5. Update HTML comments in src/
6. Add clarifying notes to deployment scripts

### Phase 3: Test Updates (Day 2)
7. Update test descriptions and assertions
8. Fix path references in test files
9. Update testing documentation

### Phase 4: Verification (Day 2)
10. Search for remaining "submodule" references
11. Verify all uses are appropriate (paths, historical)
12. Update this document with results

## 📚 Reference Implementation

### Example: Copilot Instructions Section

```markdown
### Sibling Projects Architecture

This project uses a **sibling project architecture** where four external repositories are maintained independently:

1. **Music in Numbers** (`../music_in_numbers/`)
2. **Guia Turístico** (`../guia_turistico/`)
3. **Monitora Vagas** (`../monitora_vagas/`)
4. **Busca Vagas** (`../busca_vagas/`)

**Deployment**: Sibling projects are deployed to `public/submodules/` directory.

**Note on "submodules" naming**: The `public/submodules/` directory name is legacy terminology retained for URL backward compatibility. This project does NOT use git submodules (`.gitmodules` is empty). All projects are independent repositories managed as siblings.

**Management**: Each sibling project is managed independently:
```bash
cd ../music_in_numbers && git pull && git push
cd ../guia_turistico && git pull && git push
cd ../monitora_vagas && git pull && git push
cd ../busca_vagas && git pull && git push
```
```

## ✅ Success Criteria

1. No references to "git submodule" commands in current workflow docs
2. Clear distinction between legacy directory naming and current architecture
3. Consistent use of "sibling project" terminology
4. All broken references fixed
5. No developer confusion about project structure

## 📊 Progress Tracking

- [ ] Phase 1: Documentation Update
- [ ] Phase 2: Code Comments
- [ ] Phase 3: Test Updates
- [ ] Phase 4: Verification
- [ ] Final review and sign-off

---

**Last Updated**: 2025-12-25  
**Status**: DRAFT - Ready for implementation
