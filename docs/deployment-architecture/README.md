# Deployment Architecture Documentation

**MP Barbosa Personal Website - Deployment & Architecture Reference**

**Last Updated:** 2025-12-25  
**Architecture Version:** v2.0.0 (Two-Step Deployment)  
**Deployment Status:** Production Active

---

## 📚 Quick Navigation

### Primary Architecture Documents

1. **[TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md](TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md)** ⭐ **START HERE**
   - Complete two-step deployment architecture
   - Parametrized step control (--step1, --step2, --both-steps)
   - Production directory configuration
   - Comprehensive deployment workflow

2. **[SYNC_TO_PUBLIC_FUNCTIONAL_DOCUMENTATION.md](SYNC_TO_PUBLIC_FUNCTIONAL_DOCUMENTATION.md)**
   - Functional specification and workflow
   - User-facing deployment process
   - Step-by-step deployment guide

3. **[SYNC_TO_PUBLIC_TECHNICAL_DOCUMENTATION.md](SYNC_TO_PUBLIC_TECHNICAL_DOCUMENTATION.md)**
   - Technical implementation details
   - Script architecture and design patterns
   - Advanced configuration options

### Supporting Documentation

4. **[RESOURCE_PATH_GUIDE.md](RESOURCE_PATH_GUIDE.md)**
   - Path resolution strategies
   - Sibling project path management
   - Troubleshooting 404 errors

5. **[PATH_RESOLUTION_FIX_COMPLETION_REPORT.md](PATH_RESOLUTION_FIX_COMPLETION_REPORT.md)**
   - Historical path resolution fixes
   - Lessons learned from critical incidents
   - Best practices evolution

---

## 🚀 Quick Start - Deployment

### Two-Step Deployment Process

```bash
# Step 1: Source → Public (staging)
./shell_scripts/sync_to_public.sh --step1 --verbose

# Step 2: Public → Production (deployment)
./shell_scripts/sync_to_public.sh --step2 --production-dir /var/www/html

# Or both steps at once
./shell_scripts/sync_to_public.sh --both-steps
```

### Legacy Deployment (v2.0.0)

```bash
# Requires sync_to_public.sh --step1 to be run first
sudo ./shell_scripts/deploy_to_webserver.sh
```

---

## 📊 Architecture Overview

### Current Architecture (v2.0.0)

**Deployment Flow:**

```
Sibling Projects              Public Directory              Production Server
../music_in_numbers/    →    public/submodules/    →    /var/www/html
../guia_js/
../monitora_vagas/
../busca_vagas/

Main Site                     Staging                      Web Server
src/                    →    public/              →    /var/www/mpbarbosa.com
```

### Key Features

- ✅ **Two-Step Process**: Staging (public/) then production deployment
- ✅ **Parametrized Control**: Execute steps independently or together
- ✅ **Sibling Projects**: Four external projects deployed alongside main site
- ✅ **Backup System**: Automatic backups for both public and production
- ✅ **Validation**: Comprehensive environment and permission checks
- ✅ **Dry-Run Mode**: Preview operations before execution

---

## 📁 Directory Structure

```
mpbarbosa_site/
├── src/                           # Source files
│   ├── index.html                # Main landing page
│   ├── assets/                   # HTML5 UP Dimension template
│   └── pages/                    # Project redirect pages
│
├── public/                        # Deployment staging (sync_to_public.sh output)
│   ├── index.html                # Synchronized main page
│   ├── assets/                   # Synchronized assets
│   ├── api/                      # Busca Vagas API proxy
│   └── submodules/               # Sibling project deployment directory
│       ├── music_in_numbers/     # Spotify analytics
│       ├── guia_js/       # Travel guide
│       ├── monitora_vagas/       # Hotel monitoring
│       └── busca_vagas/          # Backend API
│
├── shell_scripts/                 # Deployment automation
│   ├── sync_to_public.sh         # Two-step deployment (v2.0.0)
│   ├── deploy_to_webserver.sh    # Legacy nginx deployment
│   └── deprecated/               # Deprecated submodule scripts
│
└── docs/deployment-architecture/ # This directory
    ├── README.md                 # This file
    ├── TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md
    ├── SYNC_TO_PUBLIC_FUNCTIONAL_DOCUMENTATION.md
    ├── SYNC_TO_PUBLIC_TECHNICAL_DOCUMENTATION.md
    ├── RESOURCE_PATH_GUIDE.md
    └── PATH_RESOLUTION_FIX_COMPLETION_REPORT.md
```

---

## 🔧 Deployment Scripts

### Primary Scripts

| Script | Purpose | Version | Status |
|--------|---------|---------|--------|
| `sync_to_public.sh` | Two-step deployment | v2.0.0 | ✅ Active |
| `deploy_to_webserver.sh` | Legacy nginx deployment | v2.0.0 | ✅ Active |

### Usage Examples

**Full Deployment**:
```bash
./shell_scripts/sync_to_public.sh --both-steps --verbose
```

**Staging Only**:
```bash
./shell_scripts/sync_to_public.sh --step1 --dry-run
```

**Production Only** (after staging):
```bash
./shell_scripts/sync_to_public.sh --step2
# Or legacy script:
sudo ./shell_scripts/deploy_to_webserver.sh
```

---

## 📖 Documentation Roadmap

### New to Deployment?

1. **Start Here**: [TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md](TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md)
2. **Understand Workflow**: [SYNC_TO_PUBLIC_FUNCTIONAL_DOCUMENTATION.md](SYNC_TO_PUBLIC_FUNCTIONAL_DOCUMENTATION.md)
3. **Path Issues?**: [RESOURCE_PATH_GUIDE.md](RESOURCE_PATH_GUIDE.md)

### Technical Deep Dive

1. **Architecture Details**: [TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md](TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md)
2. **Implementation**: [SYNC_TO_PUBLIC_TECHNICAL_DOCUMENTATION.md](SYNC_TO_PUBLIC_TECHNICAL_DOCUMENTATION.md)
3. **Historical Context**: [PATH_RESOLUTION_FIX_COMPLETION_REPORT.md](PATH_RESOLUTION_FIX_COMPLETION_REPORT.md)

### Troubleshooting

1. **Path Resolution**: [RESOURCE_PATH_GUIDE.md](RESOURCE_PATH_GUIDE.md) - Section "Common Issues"
2. **Deployment Failures**: [TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md](TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md) - Section "Troubleshooting"
3. **Script Issues**: [Shell Scripts README](../../shell_scripts/README.md)

---

## 🎯 Quick Reference

### Common Deployment Scenarios

**Scenario 1: First-Time Deployment**
```bash
./shell_scripts/sync_to_public.sh --both-steps
```

**Scenario 2: Update Main Site Only**
```bash
# Step 1: Sync changes to public/
./shell_scripts/sync_to_public.sh --step1

# Step 2: Deploy to production
./shell_scripts/sync_to_public.sh --step2
```

**Scenario 3: Update Sibling Projects**
```bash
# Update sibling project first
cd ../music_in_numbers && git pull

# Then sync and deploy
cd mpbarbosa_site
./shell_scripts/sync_to_public.sh --both-steps
```

**Scenario 4: Test Before Production**
```bash
# Dry-run step 1
./shell_scripts/sync_to_public.sh --step1 --dry-run

# Execute step 1
./shell_scripts/sync_to_public.sh --step1

# Verify public/ directory
ls -la public/

# Deploy to production
./shell_scripts/sync_to_public.sh --step2
```

---

## 📊 Architecture Evolution

### Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| v2.0.0 | 2025-12 | Two-step deployment architecture |
| v1.1.3 | 2025-11 | Initial deployment scripts |

### Migration Path

**From v1.1.3 to v2.0.0**:
- Introduced staging directory (`public/`)
- Parametrized step control
- Enhanced backup system
- Production directory configuration

**See**: [TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md](TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md) - Section "Changelog"

---

## 🔗 See Also

### Related Documentation

- **[Copilot Instructions](../../.github/copilot-instructions.md)** - Complete development workflow
- **[Shell Scripts README](../../shell_scripts/README.md)** - All automation scripts
- **[Testing Documentation](../testing-qa/README.md)** - Test suite and QA

### Sibling Projects

- **Music in Numbers** (`../music_in_numbers`) - Spotify analytics
- **Guia Turístico** (`../guia_js`) - Travel guide
- **Monitora Vagas** (`../monitora_vagas`) - Hotel monitoring
- **Busca Vagas** (`../busca_vagas`) - Backend API

### Workflow Automation

- **[Workflow Automation Version Evolution](../workflow-automation/WORKFLOW_AUTOMATION_VERSION_EVOLUTION.md)**
- **[Tests & Documentation Workflow Plan](../workflow-automation/TESTS_DOCS_WORKFLOW_AUTOMATION_PLAN.md)**

---

## 🆘 Getting Help

**Deployment Issues?**

1. Check [TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md](TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md) troubleshooting section
2. Review [RESOURCE_PATH_GUIDE.md](RESOURCE_PATH_GUIDE.md) for path issues
3. Run with `--dry-run` to preview operations
4. Check [Shell Scripts README](../../shell_scripts/README.md) for script documentation

**Path Resolution Issues?**

1. See [RESOURCE_PATH_GUIDE.md](RESOURCE_PATH_GUIDE.md) - Comprehensive troubleshooting
2. Review [PATH_RESOLUTION_FIX_COMPLETION_REPORT.md](PATH_RESOLUTION_FIX_COMPLETION_REPORT.md) - Lessons learned

**Questions About Architecture?**

1. Start with [TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md](TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md)
2. Read [SYNC_TO_PUBLIC_FUNCTIONAL_DOCUMENTATION.md](SYNC_TO_PUBLIC_FUNCTIONAL_DOCUMENTATION.md)
3. Dive into [SYNC_TO_PUBLIC_TECHNICAL_DOCUMENTATION.md](SYNC_TO_PUBLIC_TECHNICAL_DOCUMENTATION.md)

---

**Version:** 1.1.3  
**Last Updated:** 2025-12-25  
**Architecture:** v2.0.0 Two-Step Deployment  
**Maintained By:** MP Barbosa Development Team
