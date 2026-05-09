# Documentation Style Guide

**Version**: 1.3.0
**Date**: 2025-11-09
**Status**: Active

---

## Purpose

This guide establishes consistent formatting and style conventions for all documentation in the MP Barbosa projects, ensuring professional presentation and improved readability.

## Table of Contents

1. [Date Formatting Standards](#date-formatting-standards)
2. [Emoji Usage Guidelines](#emoji-usage-guidelines)
3. [Header Formatting](#header-formatting)
4. [Document Structure](#document-structure)
   - [Table of Contents](#table-of-contents)
5. [Code Examples](#code-examples)
6. [Cross-References](#cross-references)

---

## Date Formatting Standards

### Overview

Consistent date formatting improves readability and prevents confusion across documentation. Use the appropriate format based on context.

### Standard Date Formats

#### 1. Filenames with Timestamps

**Format**: `YYYYMMDD_HHMMSS` (ISO 8601 basic format)

**Use for**:
- Timestamped log files
- Backup files
- Report snapshots
- Automated workflow outputs

**Examples**:
```
logs/workflow_execution_20251109_140530.log
backlog/issues_20251106_212858.md
summaries/completion_20251107_093045.md
```

**Why**: Lexicographic sorting matches chronological order, no timezone ambiguity.

#### 2. Filenames with Dates Only

**Format**: `YYYYMMDD` (ISO 8601 basic format, date only)

**Use for**:
- Daily reports
- Date-specific documentation
- Version snapshots

**Examples**:
```
docs/DOCUMENTATION_UPDATE_SUMMARY_20251109.md
docs/DOCUMENTATION_CONSISTENCY_ANALYSIS_REPORT_20251106.md
reports/deployment_summary_20251107.md
```

**Why**: Clear chronological ordering, compact, unambiguous.

#### 3. Document Metadata

**Format**: `YYYY-MM-DD` (ISO 8601 extended format)

**Use for**:
- Document headers (**Date**: field)
- Version history entries
- Technical documentation metadata
- Script version tracking

**Examples**:
```markdown
**Date**: 2025-11-09
**Last Updated**: 2025-11-07
**Created**: 2025-11-06
```

**Why**: International standard, machine-readable, unambiguous, sortable.

#### 4. Human-Readable Dates in Content

**Format**: `Month DD, YYYY` (full month name)

**Use for**:
- Document body text
- User-facing descriptions
- Completion reports
- Narrative sections

**Examples**:
```markdown
The project was completed on November 9, 2025.
Last review conducted: October 27, 2025.
As of November 6, 2025, all features are implemented.
```

**Why**: Easy to read, familiar to users, clear in context.

#### 5. Abbreviated Dates (When Space Limited)

**Format**: `MMM DD, YYYY` (three-letter month abbreviation)

**Use for**:
- Tables with limited space
- Inline references where brevity needed
- Quick status updates

**Examples**:
```markdown
| Version | Release Date |
|---------|--------------|
| v1.5.0  | Nov 7, 2025  |
| v1.4.0  | Nov 6, 2025  |
| v1.2.0  | Nov 4, 2025  |
```

**Why**: Compact, still clear, widely understood.

### Date Format Reference Table

| Context | Format | Example | Use Case |
|---------|--------|---------|----------|
| **Filename (timestamp)** | `YYYYMMDD_HHMMSS` | `20251109_140530` | Logs, backups, automated outputs |
| **Filename (date)** | `YYYYMMDD` | `20251109` | Daily reports, dated docs |
| **Document metadata** | `YYYY-MM-DD` | `2025-11-09` | Headers, version tracking |
| **Body text** | `Month DD, YYYY` | `November 9, 2025` | Narrative, descriptions |
| **Tables/compact** | `MMM DD, YYYY` | `Nov 9, 2025` | Limited space contexts |

### Best Practices

#### ✅ DO

- Use ISO 8601 formats for metadata and filenames
- Use full month names in narrative text
- Be consistent within each document
- Include timezone if time is specified (prefer UTC)
- Use 24-hour format for times (14:05:30 not 2:05:30 PM)

**Example - Metadata with timezone**:
```markdown
**Date**: 2025-11-09
**Timestamp**: 2025-11-09T20:05:48Z (UTC)
```

#### ❌ DON'T

- Mix date formats within same context
- Use ambiguous formats like `11/09/25` (US vs EU confusion)
- Use two-digit years (`25` instead of `2025`)
- Abbreviate months inconsistently (Nov vs. Nov. vs November)
- Omit timezone when time is critical

**❌ AVOID these ambiguous formats**:
```markdown
11/9/2025     # Ambiguous (US: Nov 9, EU: Sept 11)
9-11-2025     # Ambiguous
11/9/25       # Two-digit year ambiguous
Nov. 9, 2025  # Inconsistent punctuation
```

### Time Formatting

When including time, follow these conventions:

#### Timestamp with Date (ISO 8601)

```markdown
**Timestamp**: 2025-11-09T20:05:48Z
**Created**: 2025-11-06T14:30:00Z
```

Format: `YYYY-MM-DDTHH:MM:SSZ` (Z indicates UTC)

#### Time Only (24-hour format)

```markdown
Build started at 14:05:30
Deployment completed at 20:15:45
```

Format: `HH:MM:SS` (24-hour clock)

#### Duration

```markdown
Execution time: 2m 53s
Build duration: 3h 15m
Elapsed: 45s
```

Format: Use appropriate units (h/m/s), be concise.

### Version History Date Format

Always use ISO 8601 extended format in version history:

```markdown
### v1.1.7 (2025-11-09)

- Enhanced code block guidelines
- Language identifier best practices

### v1.1.7 (2025-11-09)

- Initial style guide creation
```

### Changelog Date Format

Follow Keep a Changelog convention with ISO 8601:

```markdown
## [2.0.0] - 2025-11-06

### Added
- Two-step deployment architecture

## [1.5.0] - 2025-11-07

### Added
- Git state caching for performance
```

### Examples from This Project

#### Correct Usage

**Filename**:
```
docs/DOCUMENTATION_UPDATE_SUMMARY_20251109.md  ✅
logs/workflow_execution_20251107_093045.log    ✅
```

**Metadata**:
```markdown
**Version**: 1.1.7
**Date**: 2025-11-09  ✅
**Last Updated**: 2025-11-07  ✅
```

**Body Text**:
```markdown
The workflow automation was completed on November 7, 2025.  ✅
As of November 9, 2025, all documentation is updated.  ✅
```

#### Inconsistent Usage to Avoid

```markdown
**Date**: November 9, 2025  ❌ (metadata should use YYYY-MM-DD)
**Last Updated**: Nov 7, 2025  ❌ (metadata should use YYYY-MM-DD)
File: report_20251109.md  ✅
File: report_Nov_9_2025.md  ❌ (use YYYYMMDD)
```

---

## Emoji Usage Guidelines

### When to Use Emojis

**✅ RECOMMENDED for:**
- **Summary/Report documents** (e.g., completion reports, analysis reports)
- **User-facing guides** (e.g., UX documentation, README files)
- **Workflow automation output** (e.g., logs, summaries, backlog)
- **Quick reference sections** within technical documents

**❌ AVOID for:**
- **Technical API documentation**
- **Code-focused guides** (e.g., architecture patterns, best practices)
- **Formal specification documents**
- **Academic or research-oriented content**

### Emoji Style Patterns

When using emojis, follow these consistent patterns:

#### Pattern 1: Section Headers with Leading Emoji

```markdown
## 📋 Executive Summary
## 🎯 Key Objectives
## 📊 Results Analysis
## ✅ Achievements
## 🚀 Next Steps
```

**Use case**: Summary documents, completion reports, analysis documents

#### Pattern 2: Status Indicators

```markdown
✅ Completed
❌ Failed
⚠️  Warning
🔍 In Review
📝 Documentation
🏆 Achievement
```

**Use case**: Checklists, status reports, issue tracking

#### Pattern 3: Document Type Indicators

```markdown
> **📋 Document Type: Implementation Report**
> **📄 Document Scope: Canonical Reference**
> **🔗 Related Documents**: See [...]
```

**Use case**: Document metadata headers (added in Issues #19, #20, #21)

### Recommended Emoji Palette

Use this consistent set of emojis across all documents:

| Category | Emojis | Usage |
|----------|--------|-------|
| **Structure** | 📋 📄 📚 📖 | Document types, table of contents |
| **Goals** | 🎯 🎨 🏆 | Objectives, design, achievements |
| **Data** | 📊 📈 📉 | Metrics, statistics, analysis |
| **Process** | 🚀 🔧 ⚙️ 🛠️ | Deployment, tools, configuration |
| **Status** | ✅ ❌ ⚠️ 🔍 | Success, failure, warning, review |
| **Actions** | 📝 💡 🔗 ✨ | Documentation, ideas, links, highlights |
| **Code** | 💻 🎯 📦 | Programming, scope, packages |

### Consistency Within Documents

**Rule**: Once you choose a style (emoji or no-emoji), maintain it throughout the document.

**Example - Consistent WITH emojis:**
```markdown
## 📋 Overview
## 🎯 Objectives
## 📊 Results
## ✅ Conclusion
```

**Example - Consistent WITHOUT emojis:**
```markdown
## Overview
## Objectives
## Results
## Conclusion
```

**❌ AVOID mixing styles:**
```markdown
## 📋 Overview        # Has emoji
## Objectives         # No emoji - INCONSISTENT
## 📊 Results         # Has emoji
## Conclusion         # No emoji - INCONSISTENT
```

---

## Header Formatting

### Document Title (H1)

```markdown
# Document Title

> **📋 Document Type: [Type]**
> Brief description or metadata

**Version**: 1.1.7
**Date**: 2025-11-09
```

### Major Sections (H2)

- Use sentence case or title case consistently
- Add emojis if document style calls for it
- Leave blank line before and after

```markdown
## Section Name

Content here...

## Next Section
```

### Subsections (H3-H6)

- Use title case
- Generally avoid emojis at this level
- Keep hierarchy clear

```markdown
### Subsection Name
#### Detail Level
```

---

## Document Structure

### Standard Document Template

```markdown
# Document Title

> **📋 Document Type: [Type]**
> Description

**Version**: X.Y.Z
**Date**: YYYY-MM-DD
**Status**: [Active/Historical/Draft]

---

## Overview

Brief introduction...

## Table of Contents

1. [Section 1](#section-1)
2. [Section 2](#section-2)

---

## Section 1

Content...

## Section 2

Content...

---

## Related Documentation

- [Document 1](path/to/doc1.md)
- [Document 2](path/to/doc2.md)

---

**Last Updated**: YYYY-MM-DD
**Maintained By**: [Name/Team]
```

### Document Type Headers

Based on Issues #17, #19, #20, #21 resolutions:

**Canonical Reference:**
```markdown
> **📋 Document Scope: MP Barbosa Projects - Canonical Reference**
```

**Project-Specific Version:**
```markdown
> **📋 Document Scope: [Project Name] Specific**
```

**Duplicate Copy:**
```markdown
> **📋 Document Distribution: Submodule Copy ([Project Name])**
```

**Analysis Document:**
```markdown
> **📋 Document Type: Analysis & Planning**
```

**Implementation Report:**
```markdown
> **📋 Document Type: Implementation Completion Report**
```

### Table of Contents

#### When to Include a TOC

Include a table of contents when documents meet these criteria:

**✅ REQUIRED for:**
- Documents over 500 lines
- Multi-section technical guides
- Reference documentation with many topics
- Documents with deep section hierarchy (3+ levels)

**✅ RECOMMENDED for:**
- Documents over 300 lines
- Documents with 5+ major sections
- Tutorial or how-to guides
- Architecture documentation

**❌ OPTIONAL for:**
- Documents under 300 lines
- Single-topic focused documents
- Quick reference guides
- Short completion reports

#### TOC Format

Use markdown anchor links with numbered or unnumbered lists:

**Standard Format (Numbered):**
```markdown
## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Configuration](#configuration)
   - [Basic Setup](#basic-setup)
   - [Advanced Options](#advanced-options)
4. [API Reference](#api-reference)
5. [Examples](#examples)
6. [Troubleshooting](#troubleshooting)
```

**Alternative Format (Unnumbered):**
```markdown
## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
  - [Basic Setup](#basic-setup)
  - [Advanced Options](#advanced-options)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
```

#### TOC Placement

Place the table of contents after metadata and before main content:

```markdown
# Document Title

> **📋 Document Type: Technical Guide**

**Version**: 1.1.7
**Date**: 2025-11-09
**Status**: Active

---

## Table of Contents

1. [Section 1](#section-1)
2. [Section 2](#section-2)

---

## Section 1

Content here...
```

#### TOC Best Practices

**✅ DO:**
- Use descriptive section names
- Match TOC entries exactly to header text
- Keep TOC depth to 2-3 levels maximum
- Update TOC when adding/removing sections
- Use horizontal rules (---) to separate TOC from content

**❌ DON'T:**
- Include every subsection (too detailed)
- Mix anchor formats within same TOC
- Create TOC for short documents (<300 lines)
- Use manual page numbers (markdown doesn't support)

#### Anchor Link Format

GitHub Markdown automatically creates anchors from headers:

**Header to Anchor Conversion:**
```markdown
## Getting Started          → #getting-started
## API Reference            → #api-reference
## Advanced Configuration   → #advanced-configuration
## FAQs & Troubleshooting   → #faqs--troubleshooting
```

**Rules:**
- Convert to lowercase
- Replace spaces with hyphens
- Remove special characters (keep hyphens)
- Ampersands (&) become double hyphens (--)

#### Multi-Level TOC Example

For complex documents with subsections:

```markdown
## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
   - [Prerequisites](#prerequisites)
   - [Quick Start](#quick-start)
   - [Advanced Installation](#advanced-installation)
3. [Configuration](#configuration)
   - [Basic Settings](#basic-settings)
   - [Advanced Settings](#advanced-settings)
4. [Usage](#usage)
   - [Common Tasks](#common-tasks)
   - [Advanced Usage](#advanced-usage)
5. [Troubleshooting](#troubleshooting)
6. [Reference](#reference)
```

#### Documents That Should Have TOC

Based on project analysis, these documents would benefit from TOC:

**Documents over 500 lines (REQUIRED):**
- `docs/FUNCTIONAL_CORE_IMPERATIVE_SHELL_GUIDE.md` (1,742 lines) ⚠️
- `docs/DOCUMENTATION_CONSISTENCY_ANALYSIS_REPORT_20251109.md` (1,350 lines) ✅ Has TOC
- `docs/DOCUMENTATION_CONSISTENCY_ANALYSIS_REPORT_20251107.md` (1,202 lines) ✅ Has TOC
- `docs/DOCUMENTATION_CONSISTENCY_ANALYSIS_REPORT.md` (1,028 lines) ⚠️
- `docs/PYTHON_MIGRATION_PLAN.md` (772 lines) ⚠️
- `docs/DOCUMENTATION_STYLE_GUIDE.md` (772 lines) ✅ Has TOC
- `docs/DEPENDENCY_INJECTION_BEST_PRACTICES.md` (771 lines) ✅ Has TOC
- `shell_scripts/README.md` (669 lines) ⚠️
- `docs/TESTS_DOCS_WORKFLOW_AUTOMATION_PLAN.md` (564 lines) ⚠️
- `docs/COMPREHENSIVE_UX_DOCUMENTATION.md` (558 lines) ⚠️
- `docs/TWO_STEP_DEPLOYMENT_ARCHITECTURE_V2.md` (501 lines) ⚠️

**Documents 300-500 lines (RECOMMENDED):**
- `docs/WORKFLOW_AUTOMATION_PHASE2_COMPLETION.md` (499 lines) ⚠️
- `.github/copilot-instructions.md` (494 lines) ⚠️
- `docs/SYNC_TO_PUBLIC_TECHNICAL_DOCUMENTATION.md` (487 lines) ⚠️
- `docs/WORKFLOW_AUTOMATION_VERSION_EVOLUTION.md` (482 lines) ⚠️
- `docs/GIT_BEST_PRACTICES_GUIDE.md` (441 lines) ✅ Has TOC
- `docs/SYNC_TO_PUBLIC_FUNCTIONAL_DOCUMENTATION.md` (422 lines) ⚠️
- `docs/WORKFLOW_PERFORMANCE_OPTIMIZATION.md` (361 lines) ⚠️
- `docs/MODULARIZATION_ACHIEVEMENTS_SUMMARY.md` (311 lines) ⚠️

**Status**: 6/19 long documents have TOC (32% coverage)

---

## Code Examples

### Inline Code

Use single backticks for:
- File names: `package.json`
- Commands: `npm install`
- Variables: `SCRIPT_VERSION`
- Short code: `const x = 5`

### Code Blocks

**Always specify a language identifier** for proper syntax highlighting:

#### Shell Scripts and Commands

**✅ PREFERRED: Use `bash`**
```bash
#!/bin/bash
echo "Example script"
cd /path/to/directory
./script.sh
```

**❌ AVOID: `sh` or no language**
```sh
# Less specific, avoid
echo "Example"
```

```
# No syntax highlighting, avoid
echo "Example"
```

**Rationale**: `bash` provides better syntax highlighting and is the most common shell in the project.

#### JavaScript

```javascript
function example() {
  return "Hello World";
}

const data = { version: "1.1.7" };
```

#### JSON

```json
{
  "version": "1.1.7",
  "scripts": {
    "test": "jest"
  }
}
```

#### HTML

```html
<!DOCTYPE html>
<html>
  <head><title>Example</title></head>
  <body><h1>Hello</h1></body>
</html>
```

#### CSS

```css
.example {
  color: #333;
  font-size: 16px;
}
```

#### Markdown Examples

When showing markdown syntax in documentation, use `markdown`:

```markdown
## Example Header
**Bold text** and *italic text*
```

#### Python

```python
def example():
    return "Hello World"

data = {"version": "1.1.7"}
```

### Language Identifier Best Practices

| Language | Identifier | Usage |
|----------|------------|-------|
| Shell scripts | `bash` | Preferred for all shell commands/scripts |
| Shell scripts | `sh` | ❌ Avoid - use `bash` instead |
| JavaScript | `javascript` or `js` | Both acceptable |
| JSON | `json` | Configuration files, API responses |
| HTML | `html` | Markup examples |
| CSS | `css` | Styling examples |
| Markdown | `markdown` or `md` | Both acceptable |
| Python | `python` or `py` | Both acceptable |
| Plain text | ``` | Only when no language applies |

### Command Examples

Show both command and expected output:

```bash
$ npm test

> mpbarbosa-landing-page@1.1.7 test
> jest

PASS  __tests__/main.test.js
✓ should work (5ms)
```

For commands with prompts, use `$` or `#` prefix:

```bash
# As root
# systemctl restart nginx

# As regular user
$ npm install
```

### Multi-Language Code Blocks

When showing multiple languages in sequence, label each clearly:

**JavaScript:**
```javascript
const config = { port: 8080 };
```

**Equivalent in Python:**
```python
config = {"port": 8080}
```

---

## Cross-References

### Internal Links

**Within same directory:**
```markdown
See [Related Document](RELATED_DOCUMENT.md)
```

**To parent directory:**
```markdown
See [Main README](../README.md)
```

**Absolute from repository root:**
```markdown
See [Documentation](/docs/README.md)
```

### External Links

```markdown
[GitHub Repository](https://github.com/mpbarbosa/mpbarbosa_site)
[HTML5 UP](https://html5up.net)
```

### Document Relationships

Based on Issues #19, #20, #21 patterns:

**Analysis → Implementation:**
```markdown
> **Implementation**: See [IMPLEMENTATION.md](IMPLEMENTATION.md) for completed details.
```

**Canonical → Specific:**
```markdown
> **Submodule Versions**: Each submodule may have project-specific customization.
```

**Duplicate → Canonical:**
```markdown
> **Canonical Version**: See [/docs/GUIDE.md](../../../docs/GUIDE.md)
```

---

## Best Practices

### ✅ DO

- Maintain consistency within each document
- Use emojis purposefully, not decoratively
- Keep header hierarchy clear (H1 → H2 → H3)
- Add metadata to important documents
- Cross-reference related documents
- Update "Last Updated" dates when modifying

### ❌ DON'T

- Mix emoji and non-emoji styles in same document
- Overuse emojis (1-2 per section maximum)
- Skip header levels (H1 → H3)
- Use decorative emojis without meaning
- Create circular cross-references
- Leave outdated dates

---

## Current Emoji Usage Patterns

### Documents WITH Emoji Headers (Keep as-is)

High emoji usage (appropriate for their purpose):
- `COMPREHENSIVE_UX_DOCUMENTATION.md` (19 emojis) - User-facing guide
- `DOCUMENTATION_CONSISTENCY_ANALYSIS_REPORT_20251109.md` (20 emojis) - Analysis report
- `WORKFLOW_AUTOMATION_PHASE2_COMPLETION.md` (18 emojis) - Completion report
- `DOCUMENTATION_UPDATE_SUMMARY_20251106.md` (12 emojis) - Summary document
- `DOCUMENTATION_CONSISTENCY_ANALYSIS_REPORT.md` (9 emojis) - Analysis report

### Documents WITHOUT Emoji Headers (Keep as-is)

No emojis (appropriate for technical content):
- `GIT_BEST_PRACTICES_GUIDE.md` - Technical guide
- `EXTERNAL_LINKS_IMPLEMENTATION_SUMMARY.md` - Technical implementation
- `DEPENDENCY_INJECTION_BEST_PRACTICES.md` - Architecture patterns
- `COPILOT_PROMPT_SCOPING_GUIDE.md` - Technical guide

### Recommendation

**No changes needed** - Current usage is appropriate:
- Summary/report documents use emojis ✅
- Technical guides avoid emojis ✅
- Each document is internally consistent ✅

---

## Version History

### v1.3.0 (2025-11-09)

- **Added Table of Contents guidelines** (Issue #25)
- Established TOC requirements based on document length
- Documented TOC format and placement standards
- Added anchor link conversion rules
- Created TOC coverage analysis for project documents
- Identified 13 documents that need TOC (6 already have)

### v1.2.0 (2025-11-09)

- **Added comprehensive date formatting standards** (Issue #24)
- Established YYYYMMDD_HHMMSS for filenames with timestamps
- Established YYYYMMDD for filenames with dates only
- Established YYYY-MM-DD (ISO 8601) for document metadata
- Established "Month DD, YYYY" for human-readable body text
- Added date format reference table
- Documented time formatting conventions
- Added version history and changelog date standards

### v1.1.7 (2025-11-09)

- **Enhanced code block guidelines** (Issue #23)
- Added language identifier best practices
- Established `bash` as preferred shell script identifier
- Documented multi-language code block patterns
- Added comprehensive language identifier reference table

### v1.1.7 (2025-11-09)

- Initial style guide creation
- Documented emoji usage patterns
- Established header formatting rules
- Defined document structure templates
- Created based on Issue #22 analysis

---

## Related Documentation

- [Documentation README](README.md) - Documentation index
- [Git Best Practices Guide](GIT_BEST_PRACTICES_GUIDE.md) - Version control guidelines
- [Copilot Prompt Scoping Guide](COPILOT_PROMPT_SCOPING_GUIDE.md) - AI prompting best practices

---

**Last Updated**: 2025-11-09
**Maintained By**: MP Barbosa
**Status**: Active
