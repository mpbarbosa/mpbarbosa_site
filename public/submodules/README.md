# Public Submodules Directory

This directory contains public content from the project's git submodules that should be exposed to the internet.

## Purpose

The `/public/submodules` folder serves as a mirror of selected content from `/src/submodules/` for:
- Public assets from subprojects (Music in Numbers, Guia Turístico, Monitora Vagas)
- Production-ready builds of submodule applications
- Static resources that need direct web access
- Demo versions and public showcases

## Structure

```
public/submodules/
├── README.md                    # This documentation
├── music_in_numbers/           # Spotify analytics public content
├── guia_turistico/             # Travel guide public content
└── monitora_vagas/             # Job monitoring public content
```

## Content Policy

### What Should Be Included
- ✅ Production builds of submodule applications
- ✅ Public demo versions
- ✅ Static assets (images, CSS, JS for web serving)
- ✅ Documentation and user guides
- ✅ Downloadable resources

### What Should NOT Be Included
- ❌ Source code and development files
- ❌ Private configuration files
- ❌ Development builds and test versions
- ❌ Git repositories (.git directories)
- ❌ Sensitive data or credentials

## Sync Process

Content should be synchronized from `/src/submodules/` using:
1. **Manual selection** of production-ready files
2. **Build processes** that generate public assets
3. **Automated sync scripts** (can be extended in `sync_to_public.sh`)
4. **Deployment pipelines** for each submodule

## Integration with Main Site

This directory enables:
- **Direct URL access** to submodule content
- **CDN distribution** of submodule assets
- **Independent deployment** of submodule builds
- **Load balancing** across different content types

## Submodule-Specific Guidelines

### Music in Numbers
- Production builds of the Spotify analytics application
- Static HTML/CSS/JS ready for web serving
- Demo versions with sample data

### Guia Turístico
- Travel guide public interface
- Tourism data and visualizations
- Public API endpoints (if applicable)

### Monitora Vagas
- Job monitoring dashboard public views
- Reports and analytics displays
- Public documentation

## Web Server Configuration

Web servers should be configured to serve this directory directly:
```nginx
# Nginx example
location /submodules/ {
    alias /var/www/mpbarbosa.com/submodules/;
    try_files $uri $uri/ =404;
}
```

## Security Considerations

- All files in this directory will be publicly accessible
- No authentication or access control applied
- Ensure no sensitive information is included
- Regular security audits recommended
- Consider rate limiting for API endpoints