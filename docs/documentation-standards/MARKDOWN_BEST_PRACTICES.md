# Markdown Best Practices Guide

> **Reference**: Based on [Markdown Guide](https://www.markdownguide.org/) standards
> **Purpose**: Prevent common markdown errors in documentation and AI-generated content
> **Last Updated**: November 2025

## Table of Contents
- [Common Markdown Errors to Avoid](#common-markdown-errors-to-avoid)
- [Basic Syntax Rules](#basic-syntax-rules)
- [Extended Syntax](#extended-syntax)
- [GitHub Flavored Markdown (GFM)](#github-flavored-markdown-gfm)
- [Accessibility Best Practices](#accessibility-best-practices)
- [AI-Generated Content Guidelines](#ai-generated-content-guidelines)

---

## Common Markdown Errors to Avoid

### 1. Missing Spaces After Hash Symbols
❌ **Wrong:**
```markdown
#Heading Without Space
##Another Heading
```

✅ **Correct:**
```markdown
# Heading With Space
## Another Heading
```

**Why**: Many parsers require a space after `#` for proper heading recognition.

### 2. Inconsistent Line Breaks Around Headings
❌ **Wrong:**
```markdown
Previous paragraph text.
## Heading Without Blank Line
Next paragraph starts immediately.
```

✅ **Correct:**
```markdown
Previous paragraph text.

## Heading With Blank Lines

Next paragraph starts after blank line.
```

**Why**: Ensures consistent rendering across all Markdown processors.

### 3. Incorrect Link Syntax
❌ **Wrong:**
```markdown
[Link text] (url)          <!-- Space between brackets and parentheses -->
[Link text](url "title")   <!-- Missing quotes or wrong quote style -->
<Link text>(url)           <!-- Mixing HTML and Markdown -->
```

✅ **Correct:**
```markdown
[Link text](url)
[Link text](url "Title with quotes")
[Link text](url 'Title with single quotes')
<https://example.com>      <!-- For bare URLs -->
```

### 4. Broken Relative Links
❌ **Wrong:**
```markdown
[Documentation](documentation.md)              <!-- Missing path -->
[Guide](./docs/guide.md/)                      <!-- Trailing slash on file -->
[README](README.MD)                            <!-- Case sensitivity issues -->
```

✅ **Correct:**
```markdown
[Documentation](./docs/documentation.md)
[Guide](./docs/guide.md)
[README](./README.md)
```

**Note**: Always use relative paths from the current file's location.

### 5. Missing Alt Text for Images
❌ **Wrong:**
```markdown
![](image.png)
![](https://example.com/image.jpg)
```

✅ **Correct:**
```markdown
![Descriptive alt text for accessibility](image.png)
![Architecture diagram showing system components](https://example.com/diagram.jpg)
```

**Why**: Essential for accessibility and SEO.

### 6. Incorrect Code Block Formatting
❌ **Wrong:**
```markdown
    Code indented with tabs
    Mixed tabs and spaces

```javascript
function test() {    <!-- Missing closing backticks -->
```

✅ **Correct:**
```markdown
    <!-- Indented code block (4 spaces or 1 tab) -->
    const example = "indented code";

<!-- Fenced code blocks with language identifier -->
```javascript
function test() {
  console.log("Hello World");
}
```
```

### 7. Skipping Heading Levels
❌ **Wrong:**
```markdown
# Main Title
### Skipped H2, went straight to H3
##### Skipped H4, went to H5
```

✅ **Correct:**
```markdown
# Main Title (H1)
## Section Heading (H2)
### Subsection Heading (H3)
#### Sub-subsection Heading (H4)
```

**Why**: Maintains document hierarchy and improves accessibility.

### 8. Inconsistent List Formatting
❌ **Wrong:**
```markdown
* Item 1
- Item 2              <!-- Mixed list markers -->
+ Item 3

1. First
3. Second             <!-- Wrong numbering -->
2. Third
```

✅ **Correct:**
```markdown
<!-- Unordered lists - use consistent marker -->
- Item 1
- Item 2
- Item 3

<!-- Ordered lists - use sequential or all "1." -->
1. First
2. Second
3. Third

<!-- Or let Markdown auto-number -->
1. First
1. Second
1. Third
```

### 9. Nested Lists Without Proper Indentation
❌ **Wrong:**
```markdown
- Parent item
- Nested item         <!-- Should be indented -->
- Another nested item

1. Parent
2. Nested             <!-- Wrong - should use 2-3 spaces -->
```

✅ **Correct:**
```markdown
- Parent item
  - Nested item (2 spaces)
  - Another nested item
    - Double nested (4 spaces)

1. Parent item
   - Nested bullet (3 spaces for ordered lists)
   - Another nested item
```

### 10. Incorrect Emphasis and Strong Emphasis
❌ **Wrong:**
```markdown
* italic*             <!-- Mismatched markers -->
**bold *              <!-- Unclosed markers -->
*** bold italic**     <!-- Wrong combination -->
```

✅ **Correct:**
```markdown
*italic* or _italic_
**bold** or __bold__
***bold italic*** or ___bold italic___
**_bold and italic_** or __*bold and italic*__
```

---

## Basic Syntax Rules

### Headings
```markdown
# H1 - Main Title (Use only once per document)
## H2 - Major Section
### H3 - Subsection
#### H4 - Sub-subsection
##### H5 - Minor heading
###### H6 - Smallest heading

<!-- Alternative H1 and H2 syntax (underline style) -->
Main Title
==========

Subtitle
--------
```

**Best Practices:**
- Use only one H1 per document (for SEO)
- Always include space after `#`
- Add blank lines before and after headings
- Don't skip heading levels

### Paragraphs and Line Breaks
```markdown
First paragraph.

Second paragraph (separated by blank line).

Line break example:
Add two spaces at end of line for line break.
This appears on next line without paragraph spacing.
```

**Best Practices:**
- Use blank lines to separate paragraphs
- Don't indent paragraphs
- Use two trailing spaces for line breaks (or `<br>` if preferred)

### Emphasis
```markdown
*Italic text* or _italic text_
**Bold text** or __bold text__
***Bold and italic*** or ___bold and italic___
~~Strikethrough~~ (GitHub Flavored Markdown)
```

### Lists

**Unordered Lists:**
```markdown
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

<!-- Alternative markers: *, + -->
* Item with asterisk
+ Item with plus
```

**Ordered Lists:**
```markdown
1. First item
2. Second item
3. Third item
   1. Nested ordered item
   2. Another nested item
4. Fourth item

<!-- Auto-numbering (all "1.") -->
1. First
1. Second
1. Third
```

### Links
```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Hover title")
[Relative link](./docs/guide.md)
[Reference-style link][reference-id]

<!-- Bare URLs -->
<https://www.example.com>
<email@example.com>

<!-- Reference definitions (at bottom of document) -->
[reference-id]: https://example.com "Optional Title"
```

### Images
```markdown
![Alt text](./images/photo.jpg)
![Alt text](https://example.com/image.png "Image title")

<!-- With reference -->
![Alt text][image-ref]

[image-ref]: ./images/diagram.png "Diagram description"
```

### Code

**Inline Code:**
```markdown
Use `backticks` for inline code.
For literal backticks: ``Use `backticks` in code``
```

**Code Blocks:**
```markdown
<!-- Indented (4 spaces or 1 tab) -->
    const example = "code block";
    console.log(example);

<!-- Fenced with language identifier -->
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

<!-- Without language identifier -->
```
Plain text code block
```
```

### Blockquotes
```markdown
> Single line blockquote

> Multi-line blockquote
> continues here
> and here

> Nested blockquotes
>> Second level
>>> Third level

> ## Blockquotes with other elements
>
> - Lists work
> - Inside blockquotes
>
> **Bold** and *italic* also work
```

### Horizontal Rules
```markdown
---

***

___

<!-- All three are equivalent, use one consistently -->
```

---

## Extended Syntax

### Tables
```markdown
| Header 1    | Header 2    | Header 3    |
| ----------- | ----------- | ----------- |
| Cell 1      | Cell 2      | Cell 3      |
| Cell 4      | Cell 5      | Cell 6      |

<!-- Alignment -->
| Left aligned | Center aligned | Right aligned |
| :----------- | :------------: | ------------: |
| Left         | Center         | Right         |
```

**Best Practices:**
- Align pipes for readability (optional)
- Use at least 3 hyphens in header separator
- Colons control alignment (`:---`, `:---:`, `---:`)

### Task Lists (GitHub Flavored Markdown)
```markdown
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task
  - [x] Nested completed task
  - [ ] Nested incomplete task
```

### Footnotes
```markdown
Here's a sentence with a footnote.[^1]

Another reference to a footnote.[^note]

[^1]: This is the first footnote.
[^note]: Named footnotes are easier to identify.
```

### Definition Lists
```markdown
Term 1
:   Definition 1

Term 2
:   Definition 2a
:   Definition 2b
```

### Heading IDs (Extended)
```markdown
### Custom Heading {#custom-id}

[Link to custom heading](#custom-id)
```

---

## GitHub Flavored Markdown (GFM)

### Auto-linking URLs
```markdown
Visit https://github.com automatically becomes a link.
Email email@example.com also auto-links.
```

### Emoji (GitHub)
```markdown
:smile: :heart: :thumbsup:

<!-- Renders as: 😄 ❤️ 👍 -->
```

### Syntax Highlighting
```markdown
```javascript
// JavaScript with syntax highlighting
const greeting = "Hello, World!";
console.log(greeting);
```

```python
# Python with syntax highlighting
def greet(name):
    return f"Hello, {name}!"
```

```bash
# Bash with syntax highlighting
echo "Hello, World!"
```
```

### Mentioning Users and Referencing Issues
```markdown
@username mentions a user
#123 references issue/PR #123
GH-123 also references issues
username/repo#123 references issue in another repo
```

### Alerts (GitHub, November 2023+)
```markdown
> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
```

---

## Accessibility Best Practices

### 1. Meaningful Alt Text
```markdown
<!-- Bad -->
![image](photo.jpg)
![pic](screenshot.png)

<!-- Good -->
![User dashboard showing analytics data](photo.jpg)
![Error message displayed in console](screenshot.png)
```

### 2. Descriptive Link Text
```markdown
<!-- Bad -->
Click [here](url) for more info.
Read more at [this link](url).

<!-- Good -->
Read the [installation guide](url) for setup instructions.
See [troubleshooting documentation](url) for common errors.
```

### 3. Proper Heading Hierarchy
```markdown
<!-- Bad -->
# Title
### Skipped H2

<!-- Good -->
# Title
## Section
### Subsection
```

### 4. Table Headers
```markdown
<!-- Always include header row -->
| Name    | Role       | Email           |
| ------- | ---------- | --------------- |
| John    | Developer  | john@email.com  |
| Sarah   | Designer   | sarah@email.com |
```

---

## AI-Generated Content Guidelines

### Common AI Markdown Mistakes

1. **Inconsistent formatting across responses**
   - Solution: Establish formatting conventions in prompts

2. **Missing blank lines around elements**
   - Solution: Always add blank lines before/after headings, lists, code blocks

3. **Incorrect relative paths**
   - Solution: Verify file structure before generating links

4. **Over-nested or under-nested lists**
   - Solution: Use 2-space indentation for unordered, 3-space for ordered

5. **Missing language identifiers in code blocks**
   - Solution: Always specify language for syntax highlighting

### AI Prompt Guidelines

When requesting markdown from AI tools like GitHub Copilot:

```markdown
Generate markdown documentation with these requirements:
- Use H1 only once for main title
- Include blank lines before/after all headings
- Use descriptive alt text for images
- Specify language for all code blocks
- Use consistent list markers (prefer "-" for bullets)
- Include reference links at bottom for repeated URLs
- Follow GitHub Flavored Markdown syntax
- Ensure proper heading hierarchy (no skipped levels)
```

### Validation Checklist

Before committing markdown documentation:

- [ ] Only one H1 heading per document
- [ ] Blank lines before and after headings
- [ ] Blank lines before and after lists
- [ ] Blank lines before and after code blocks
- [ ] Space after `#` in headings
- [ ] Descriptive alt text for all images
- [ ] Language specified for code blocks
- [ ] No skipped heading levels
- [ ] Consistent list markers
- [ ] Proper indentation for nested lists
- [ ] Links tested (especially relative paths)
- [ ] No trailing whitespace (except for line breaks)

---

## Tools and Validators

### Recommended Markdown Linters

**mdl (markdownlint Ruby gem)** - Recommended for this project:
```bash
# Install (requires Ruby)
gem install mdl

# Lint all markdown files (git-tracked only)
mdl --git-recurse --ignore-front-matter .

# Lint specific file
mdl README.md

# Show rule details
mdl --show-aliases
```

**markdownlint-cli** (Node.js alternative):
```bash
npm install -g markdownlint-cli
markdownlint '**/*.md'
```

**remark** (AST-based processor):
```bash
npm install -g remark-cli remark-preset-lint-recommended
remark --use remark-preset-lint-recommended .
```

### Online Validators
- [Markdown Guide](https://www.markdownguide.org/) - Official reference
- [Dillinger](https://dillinger.io/) - Online Markdown editor with preview
- [StackEdit](https://stackedit.io/) - In-browser Markdown editor
- [Markdown Syntax Visualizer](https://markkit.dev/syntax)

### Editor Extensions

**VSCode:**
- Markdown All in One
- markdownlint
- Markdown Preview Enhanced

**JetBrains IDEs:**
- Markdown (built-in)
- Grazie (grammar checking)

---

## Quick Reference

### Most Common Fixes

| Error | Fix |
|-------|-----|
| `#Heading` | `# Heading` (add space) |
| Missing blank lines | Add blank line before/after headings, lists, code |
| `[text] (url)` | `[text](url)` (remove space) |
| `![](image.png)` | `![Alt text](image.png)` |
| Skipped heading levels | Use sequential heading hierarchy |
| Mixed list markers | Choose one: `-`, `*`, or `+` |
| No language in code blocks | Add language identifier |
| Wrong nested list indent | Use 2 spaces (unordered) or 3 spaces (ordered) |

### Recommended Conventions

For consistency across documentation:

```markdown
# Use "-" for unordered lists
# Use sequential numbering for ordered lists
# Use triple backticks with language identifier for code blocks
# Use reference-style links for repeated URLs
# Use "---" for horizontal rules
# Add blank lines generously for readability
# Use sentence case for headings
# Keep line length ≤ 120 characters when possible
```

---

## Resources

- **Official Markdown Guide**: https://www.markdownguide.org/
- **GitHub Flavored Markdown Spec**: https://github.github.com/gfm/
- **CommonMark Spec**: https://commonmark.org/
- **Markdown Cheat Sheet**: https://www.markdownguide.org/cheat-sheet/
- **Basic Syntax**: https://www.markdownguide.org/basic-syntax/
- **Extended Syntax**: https://www.markdownguide.org/extended-syntax/

---

**Last Updated**: November 2025
**Maintained By**: MP Barbosa
**Version**: 1.0.0
