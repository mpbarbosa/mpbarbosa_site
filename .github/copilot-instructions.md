# Copilot Guidance: mpbarbosa-site-root

This file provides durable, high-signal guidance for Copilot-assisted development in this repository.

## Project Boundaries

- The primary source directory is `src/`, with stable submodules: `assets/`, `components/`, `coverage/`, `images/`, `pages/`, `scripts/`, `styles/`, and `v1/`.
- Do not make changes outside these layers unless explicitly required.

## Validation

- Use `npm test` to validate changes.

## Documentation and Reference

- For implementation details and authoritative project information, refer to:
  - `README.md`
  - `CHANGELOG.md`
  - `docs/ARCHITECTURE.md`
- Deployment helpers are documented in `shell_scripts/README.md`; the staging sync entrypoint is `shell_scripts/sync_to_staging.sh`.
- Do not duplicate file trees, dependency lists, or command walkthroughs here; link to the above documents as needed.

## Design Principles

- Respect the stable source layers and project boundaries.
- Prefer durable, minimal, and maintainable changes.
- If a rule or pattern is not explicitly stated here or in the referenced docs, do not assume it applies.

## Updates

- Update this file only when project boundaries, validation commands, or Copilot-specific guidance change.
- Do not use this file for status snapshots, implementation notes, or general documentation.
