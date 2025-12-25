# Public Assets Directory

This directory contains files that are intended to be served directly to users and exposed to the internet.

## Purpose

The `/public` folder serves as a centralized location for:
- Static assets that need direct HTTP access
- Files that will be served by web servers (nginx, Apache, etc.)
- Resources that should be publicly accessible via URL paths
- Assets that don't require processing or compilation

## Structure

```
public/
├── README.md           # This documentation
├── assets/            # Static assets (images, documents, etc.)
├── downloads/         # Files available for download
├── media/            # Images, videos, audio files
└── docs/             # Public documentation files
```

## Usage Guidelines

### What Should Go Here
- ✅ Static images, logos, favicons
- ✅ Downloadable files (PDFs, documents)
- ✅ Media files (videos, audio)
- ✅ Public documentation
- ✅ Static assets for web serving

### What Should NOT Go Here
- ❌ Source code files
- ❌ Configuration files with sensitive data
- ❌ Build artifacts that require processing
- ❌ Private or internal documentation
- ❌ Development-only files

## Deployment Integration

This folder is designed to be:
- Served directly by web servers (nginx, Apache)
- Accessible via direct URL paths
- Included in deployment scripts
- Synchronized with production servers

## Security Considerations

- All files in this directory will be publicly accessible
- Do not include sensitive information or credentials
- Ensure proper file permissions (readable but not executable)
- Consider file size limits for web serving

## Integration with Existing Project

This folder complements the existing project structure:
- `/src` - Source code and development files
- `/public` - Production-ready public assets
- `/docs` - Internal project documentation
- `/shell_scripts` - Deployment and automation tools

The deployment scripts in `/shell_scripts/deploy_to_webserver.sh` should be updated to include this directory in the production deployment process.