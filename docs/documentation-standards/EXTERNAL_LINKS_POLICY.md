# External Links Policy

## Overview
All external hyperlinks on the mpbarbosa.com website must open in a new browser tab to ensure proper user experience and navigation patterns. This policy applies to all HTML files across the main site and submodules.

## Implementation Requirements

### Technical Standards
All external links (URLs pointing to domains outside mpbarbosa.com) must include:

1. **`target="_blank"`** - Opens link in new tab
2. **`rel="noopener noreferrer"`** - Security attributes to prevent tabnapping vulnerabilities

### Code Pattern
```html
<!-- ✅ CORRECT: External link with security -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">External Site</a>

<!-- ❌ INCORRECT: Missing security attributes -->
<a href="https://example.com" target="_blank">External Site</a>

<!-- ❌ INCORRECT: Opens in same tab -->
<a href="https://example.com">External Site</a>
```

## Rationale

### User Experience (UX)
1. **Preserves Context**: Users don't lose their place on the mpbarbosa.com site
2. **Expected Behavior**: Modern web convention for external navigation
3. **Multi-tasking**: Users can reference external content while browsing the portfolio
4. **Navigation Control**: Users maintain control over browser history and tabs

### Security Considerations
The `rel="noopener noreferrer"` attribute prevents:
- **Tabnapping Attacks**: External sites cannot access the `window.opener` object
- **Performance Issues**: New tab runs in separate process (prevents JavaScript blocking)
- **Referrer Leaking**: Prevents sending referrer information to external sites (privacy)

**Reference**: [OWASP - Tabnapping Prevention](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#tabnabbing)

## Accessibility Implications

### WCAG Compliance
Opening links in new windows/tabs has accessibility considerations per [WCAG 2.1 Success Criterion 3.2.5](https://www.w3.org/WAI/WCAG21/Understanding/change-on-request.html):

#### Best Practices
1. **Visual Indicators**: Consider adding external link icons (🔗 or ↗️)
2. **Screen Reader Announcements**: Add `aria-label` for clarity
3. **User Warnings**: Optionally include "Opens in new tab" in link text

#### Enhanced Accessibility Pattern
```html
<a href="https://example.com"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="External site (opens in new tab)">
   External Site
</a>
```

### Current Implementation
The current implementation uses basic `target="_blank" rel="noopener noreferrer"` without explicit screen reader warnings. This is acceptable but could be enhanced in future iterations.

## Scope of Application

### Affected Files
- **Main Site**: `src/index.html`
- **Git Submodules**:
  - `src/submodules/music_in_numbers/src/index.html`
  - `src/submodules/music_in_numbers/src/artist.html`
  - `src/submodules/guia_js/src/guia_js.html`
- **Sibling Projects**:
  - `../monitora_vagas/src/index.html`
  - `../busca_vagas/client/public/index.html`

### What Qualifies as External
- Full URLs with protocols: `https://`, `http://`, `//`
- Third-party domains: `html5up.net`, `github.com`, `developer.spotify.com`, etc.

### What Does NOT Qualify
- Internal anchors: `href="#about"`, `href="#contact"`
- Relative paths: `href="pages/project.html"`
- Submodule navigation: `href="submodules/music_in_numbers/src/"`
- Email links: `mailto:`
- Telephone links: `tel:`

## Maintenance Guidelines

### For New Content
When adding new links to any HTML file:

1. **Identify Link Type**: Determine if the URL points to an external domain
2. **Apply Pattern**: Use the correct attributes for external links
3. **Test Functionality**: Verify link opens in new tab during development
4. **Validate Security**: Ensure `rel="noopener noreferrer"` is present

### Code Review Checklist
- [ ] All external links have `target="_blank"`
- [ ] All external links have `rel="noopener noreferrer"`
- [ ] Internal navigation links do NOT have these attributes
- [ ] Links tested in development server
- [ ] No console errors from external resources

### Automated Validation
Consider implementing automated checks in future:
```bash
# Find external links without target="_blank"
grep -rn 'href="http' src/ | grep -v 'target="_blank"'

# Find target="_blank" without rel="noopener"
grep -rn 'target="_blank"' src/ | grep -v 'rel="noopener'
```

## Implementation History

### October 2025 - Initial Implementation
- **Date**: 2025-10-03
- **Scope**: Main site and all submodules
- **Files Modified**: 4 external links in `src/index.html`
- **Submodules**: Music in Numbers already compliant

### Audit Results
**Main Site (`src/index.html`)**:
- Line 30: HTML5 UP template link
- Line 31: Creative Commons license link
- Line 63: GitHub mpb_scripts repository link
- Line 351: HTML5 UP footer credit link

**Status**: ✅ All external links now compliant with policy

## Related Documentation
- [UX Documentation](UX_DOCUMENTATION.md) - Comprehensive user experience guide
- [Resource Path Guide](RESOURCE_PATH_GUIDE.md) - Path resolution for submodules
- [Modularization Report](MODULARIZATION_COMPLETION_REPORT.md) - Architecture achievements

## Support and Questions
For questions about this policy or implementation details, consult:
- `.github/copilot-instructions.md` - Project development guidelines
- GitHub Issues - Report bugs or suggest improvements
