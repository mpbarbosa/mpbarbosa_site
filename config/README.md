# Configuration Directory

This directory contains configuration files for the mpbarbosa_site project.

## Files

### paths.yaml (MOVED)
**Location**: `shell_scripts/workflow/config/paths.yaml`

This file has been moved to the workflow configuration directory for better organization.
See: `shell_scripts/workflow/config/` for the centralized path configuration.

### busca_vagas_node_app.service
Systemd service configuration for the Busca Vagas API backend (production only).

**Note**: This is a legacy location. The canonical service file is now maintained in the Busca Vagas sibling project at:
`/home/mpb/Documents/GitHub/busca_vagas/config/busca_vagas_node_app.service`

## Adding New Configuration

When adding new configuration files:
1. Document the file purpose in this README
2. Provide usage examples for common scenarios
3. Include deployment considerations
4. Update `.gitignore` if the file contains secrets

## Configuration Loading Best Practices

1. **Always use relative paths when possible** - Improves portability
2. **Load paths.yaml at script startup** - Centralized configuration
3. **Validate paths exist** - Check before operations
4. **Support environment overrides** - Allow ENV variables to override YAML
5. **Cache loaded configuration** - Avoid repeated file reads

## Environment-Specific Configuration

For environment-specific settings, use the `environment.current` field:
- `development`: Local development machine
- `staging`: Testing/staging server (if available)
- `production`: Live production server

Scripts can check this value to adjust behavior accordingly.

## Security Considerations

- **Never commit secrets** to paths.yaml or any config file
- **Use environment variables** for sensitive data (API keys, tokens)
- **Restrict permissions** on production config files
- **Document required secrets** without exposing values

## Related Documentation

- Main README: `/README.md`
- Deployment guides: `/docs/deployment-architecture/`
- Shell scripts documentation: `/shell_scripts/README.md`
