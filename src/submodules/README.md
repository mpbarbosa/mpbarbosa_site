# Personal Projects Submodules

This directory contains Git submodules for personal projects showcased on the MP Barbosa website.

## 📁 Project Structure

```
src/submodules/
├── README.md (this file)
├── music_in_numbers/      # 🎵 Music analytics platform
├── guia_turistico/        # 🗺️ Travel guide application
└── monitora_vagas/        # 💼 Job monitoring application
```

## 🎯 Submodules Overview

### 🎵 Music in Numbers
**Repository**: [mpbarbosa/music_in_numbers](https://github.com/mpbarbosa/music_in_numbers)
**Description**: Spotify analytics platform for music listening patterns and insights

**Key Features**:
- Real-time Spotify listening data analysis
- Music pattern visualization and trends
- Artist and track analytics
- Theme switching (light/dark/high-contrast)
- Custom Material Design implementation
- Complete modular architecture (85.8% code reduction achieved)

**Technology Stack**:
- HTML5, CSS3, JavaScript (ES6+)
- Material Design components
- Spotify Web API integration
- Modular architecture with 12+ specialized modules

**Access**: `https://mpbarbosa.com/submodules/music_in_numbers/src/`

---

### 🗺️ Guia Turístico
**Repository**: [mpbarbosa/guia_turistico](https://github.com/mpbarbosa/guia_turistico)
**Description**: Brazilian Portuguese travel guide application with geolocation features

**Key Features**:
- Location-based travel recommendations
- Geolocation and mapping integration
- Brazilian Portuguese user interface
- Address extraction and geocoding
- Material Design UX patterns
- Professional class extraction architecture

**Technology Stack**:
- HTML5, CSS3, JavaScript
- Material Design (Brazilian Portuguese)
- Geolocation APIs
- Custom JavaScript library (guia_js)
- 11 focused modules with single responsibility

**Access**: `https://mpbarbosa.com/submodules/guia_turistico/src/`

---

### 💼 Monitora Vagas
**Repository**: [mpbarbosa/monitora_vagas](https://github.com/mpbarbosa/monitora_vagas)
**Description**: Job listing monitoring and notification system

**Key Features**:
- Automated job listing monitoring
- Real-time notifications
- Custom filtering and search
- Job market trend analysis
- Custom design system

**Technology Stack**:
- HTML5, CSS3, JavaScript
- Custom design patterns
- Web scraping and monitoring
- Notification systems

**Access**: `https://mpbarbosa.com/submodules/monitora_vagas/src/`

## 🔧 Submodule Management

### Initial Setup

```bash
# Clone main repository with submodules
git clone --recursive git@github.com:mpbarbosa/mpbarbosa_site.git

# If already cloned without --recursive, initialize submodules
cd mpbarbosa_site
git submodule update --init --recursive
```

### Updating Submodules

**Using automation scripts (recommended):**
```bash
# Update all submodules from remote repositories
./shell_scripts/pull_all_submodules.sh

# Preview updates without executing
./shell_scripts/pull_all_submodules.sh --dry-run
```

**Manual update:**
```bash
# Update specific submodule
cd src/submodules/music_in_numbers
git pull origin main
cd ../../..

# Update all submodules
git submodule update --remote --merge
```

### Deploying Submodule Changes

**Using automation scripts (recommended):**
```bash
# Deploy changes to all submodules
./shell_scripts/push_all_submodules.sh --handle-stash

# Preview deployment without executing
./shell_scripts/push_all_submodules.sh --dry-run
```

**Manual deployment:**
```bash
# Navigate to submodule
cd src/submodules/music_in_numbers

# Make changes and commit
git add .
git commit -m "feat: add new feature"
git push origin main

# Update main repository to track new commit
cd ../../..
git add src/submodules/music_in_numbers
git commit -m "chore: update music_in_numbers submodule"
git push
```

## 📖 Git Submodule Workflow

### Understanding Submodules

Git submodules are separate repositories embedded within the main repository. Each submodule:
- Has its own Git history and remote repository
- Is tracked by the main repository as a specific commit reference
- Requires separate pull/push operations
- Can be developed independently

### Best Practices

1. **Always use automation scripts** for routine operations
   - `pull_all_submodules.sh` for updates
   - `push_all_submodules.sh` for deployments
   - Handles hierarchical dependencies correctly

2. **Commit submodule reference updates** separately
   ```bash
   git add src/submodules/project_name
   git commit -m "chore: update project_name submodule to latest"
   ```

3. **Keep main repository and submodules synchronized**
   - Update main repository after submodule commits
   - Test submodule changes before pushing to main

4. **Handle stash conflicts carefully**
   - Use `--handle-stash` flag with push script
   - Review stashed changes before applying

### Common Operations

**Check submodule status:**
```bash
git submodule status
```

**View submodule configuration:**
```bash
cat .gitmodules
```

**Update submodule URLs:**
```bash
git submodule set-url src/submodules/project_name NEW_URL
```

## 🚀 Deployment Integration

### Main Site Deployment

Submodules are automatically included in the two-step deployment process:

**Step 1: Source → Public (staging)**
```bash
./shell_scripts/sync_to_public.sh --step1
```

**Step 2: Public → Production**
```bash
./shell_scripts/sync_to_public.sh --step2
```

**Combined deployment:**
```bash
./shell_scripts/sync_to_public.sh --both-steps
```

### Files Deployed

The deployment process syncs:
- Music in Numbers: All HTML, CSS, JS, and module files
- Guia Turístico: All application files and libraries
- Monitora Vagas: All application files

See [Two-Step Deployment Architecture](/docs/TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md) for details.

## 🔗 Navigation Integration

Each submodule is accessible through:

1. **Main site navigation** (`src/index.html`)
   - Projetos (IA) section links to all projects

2. **Redirect pages** (`src/pages/`)
   - `music_in_numbers.html` → Music in Numbers
   - `guia_turistico.html` → Guia Turístico
   - `monitora_vagas.html` → Monitora Vagas

3. **Direct URLs**
   - `https://mpbarbosa.com/submodules/music_in_numbers/src/`
   - `https://mpbarbosa.com/submodules/guia_turistico/src/`
   - `https://mpbarbosa.com/submodules/monitora_vagas/src/`

## ⚠️ Important Notes

### Authentication Requirements

**Submodule operations require GitHub authentication:**
- SSH keys configured for `git@github.com`
- GitHub account with access to private repositories
- Proper permissions for each submodule repository

**Without authentication:**
- Submodule initialization will fail
- Project links will show 404 errors
- Main site will function normally (submodules are optional)

### Path Resolution

**Critical for submodule HTML files:**
- Use **relative paths only** for resources
- Never use absolute server-root paths (`/assets/...`)
- Test both access patterns:
  - Direct: `http://localhost:8080/submodules/music_in_numbers/src/`
  - Main site: Via redirect pages or navigation

See [Resource Path Guide](/docs/RESOURCE_PATH_GUIDE.md) for complete documentation.

### Design System Variations

Each submodule uses different design systems:
- **Music in Numbers**: Custom Material Design with theme switching
- **Guia Turístico**: Brazilian Portuguese Material Design UX
- **Monitora Vagas**: Custom design patterns

This is intentional and documented in the main README.md deprecation notice.

## 📊 Architectural Achievements

### Music in Numbers Modularization

**Outstanding transformation:**
- **Overall Code Reduction**: 85.8% (2,161 → 306 lines)
- **Index.html**: 84.5% reduction (1,581 → 246 lines) with 9 JavaScript modules
- **Artist.html**: 89.7% reduction (580 → 60 lines) with 3 specialized modules
- **Development Efficiency**: 50% faster implementation using established patterns
- **Zero Functionality Loss**: All features preserved with enhanced performance

### Guia Turístico Class Extraction

**Professional architecture:**
- **11 Focused Modules**: Each with single responsibility
- **Zero Breaking Changes**: Complete backward compatibility maintained
- **Dependency Injection**: Enterprise patterns for scalable architecture
- **Functional Core, Imperative Shell**: Clean separation of pure functions and side effects

See [Modularization Achievements](/docs/MODULARIZATION_ACHIEVEMENTS_SUMMARY.md) for details.

## 🛠️ Troubleshooting

### Submodule initialization fails

**Cause**: Authentication issues or network connectivity
**Solution**:
```bash
# Verify SSH access to GitHub
ssh -T git@github.com

# Re-initialize submodules
git submodule update --init --recursive
```

### Submodule shows uncommitted changes

**Cause**: Working directory changes or detached HEAD state
**Solution**:
```bash
# Navigate to submodule
cd src/submodules/project_name

# Check status
git status

# If detached HEAD, checkout main branch
git checkout main

# If uncommitted changes, commit or stash
git stash  # or git add && git commit
```

### Submodule not updating

**Cause**: Main repository tracking old commit reference
**Solution**:
```bash
# Update submodule to latest
cd src/submodules/project_name
git pull origin main
cd ../../..

# Update main repository reference
git add src/submodules/project_name
git commit -m "chore: update project_name to latest"
```

### 404 errors on submodule pages

**Cause**: Submodules not initialized or authentication failed
**Solution**:
- This is expected behavior when submodules aren't initialized
- Main site continues to function normally
- Initialize submodules if you have proper GitHub access

## 📚 Related Documentation

- **Main Project**: `/README.md` - Complete project overview
- **Deployment**: `/docs/TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md` - Deployment architecture
- **Shell Scripts**: `/shell_scripts/README.md` - Automation script documentation
- **Path Resolution**: `/docs/RESOURCE_PATH_GUIDE.md` - Path resolution strategies
- **Architecture**: `/docs/MODULARIZATION_ACHIEVEMENTS_SUMMARY.md` - Modularization details
- **Git Best Practices**: `/docs/GIT_BEST_PRACTICES_GUIDE.md` - Git workflow guide

## 🤝 Contributing

When working with submodules:

1. **Make changes in the submodule repository**
   ```bash
   cd src/submodules/project_name
   # Make changes, test, commit
   git push origin main
   ```

2. **Update main repository reference**
   ```bash
   cd ../../..
   git add src/submodules/project_name
   git commit -m "chore: update project_name submodule"
   git push
   ```

3. **Test deployment**
   ```bash
   ./shell_scripts/sync_to_public.sh --step1 --dry-run
   ```

4. **Deploy to production**
   ```bash
   ./shell_scripts/sync_to_public.sh --both-steps
   ```

---

**Last Updated**: November 9, 2025
**Maintained By**: MP Barbosa
**Status**: Active development

For questions or issues, refer to the main project documentation or individual submodule READMEs.
