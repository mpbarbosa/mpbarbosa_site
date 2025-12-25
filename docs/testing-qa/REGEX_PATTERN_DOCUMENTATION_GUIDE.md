# Regex Pattern Documentation in Test Files

## Overview

**Issue**: Test documentation contains regex patterns that may be confused with broken links or URLs by automated tools.

**Example Patterns**:
```
/javascript|JS/i
/modules?/i
/API|api/
```

These are **JavaScript regex patterns used in test assertions**, not file paths or URLs.

## Documentation Standards

### 1. Inline Regex Patterns

When documenting regex patterns inline in test documentation, use backticks for clarity:

✅ **GOOD**:
```markdown
Test uses regex pattern `/javascript|JS/i` to match "javascript" or "JS" case-insensitively.
```

✅ **BETTER** (with explanation):
```markdown
Test uses regex pattern matching:
- Pattern: `/javascript|JS/i`
- Matches: "javascript" OR "JS" (case-insensitive)
- Example: Matches "JavaScript", "javascript", "JS", "js"
```

❌ **BAD** (ambiguous):
```markdown
Test checks for /javascript|JS/i in content
```

### 2. Code Block Formatting

Always use code blocks for regex patterns in code examples:

```javascript
// ✅ GOOD: Clear context
expect(content).toMatch(`/javascript|JS/i`);  // Regex: matches "javascript" or "JS"

// ✅ BETTER: With explanation
// Test uses flexible regex pattern matching
expect(content).toMatch(`/javascript\\s+modules?/i`);  // Matches "javascript module(s)"
```

### 3. Pattern Documentation Table

For complex patterns, use a reference table:

| Pattern | Matches | Flags | Purpose |
|---------|---------|-------|---------|
| `/javascript|JS/i` | "javascript" OR "JS" | i (case-insensitive) | Language detection |
| `/modules?/i` | "module" OR "modules" | i (case-insensitive) | Module reference |
| `/ES\s*6/` | "ES6" or "ES 6" | none | Version matching |

### 4. Backticks vs Literals

**In Documentation** (use backticks for clarity):
```markdown
Pattern: `/pattern/flags`
```

**In JavaScript Code** (use regex literals):
```javascript
expect(content).toMatch(/pattern/flags);
```

## Common Patterns in Tests

### String Matching
```javascript
// Exact string (rigid)
expect(content).toContain('JavaScript');  // Only matches exact case

// Regex pattern (flexible)
expect(content).toMatch(`/javascript/i`);  // Matches any case
```

### Alternative Matching
```javascript
// Pattern: /option1|option2/
expect(content).toMatch(`/javascript|JS/i`);  // "javascript" OR "JS"
expect(content).toMatch(`/deployment|deploy/i`);  // "deployment" OR "deploy"
```

### Optional Characters
```javascript
// Pattern: /text?/
expect(content).toMatch(`/modules?/i`);  // "module" OR "modules"
expect(content).toMatch(`/file?name/`);  // "filname" OR "filename"
```

### Whitespace Matching
```javascript
// Pattern: /text\s+text/
expect(content).toMatch(`/javascript\\s+modules?/i`);  // "javascript module(s)" with space
expect(content).toMatch(`/ES\\s*6/`);  // "ES6" or "ES 6" (optional space)
```

## Automated Tool Considerations

### Link Checkers

Most markdown link checkers will flag regex patterns as broken links:

```
⚠️ WARNING: docs/testing-qa/file.md: /javascript|JS/i
```

**Solutions**:
1. Use backticks: `` `/pattern/` ``
2. Add inline comments: `// Regex pattern`
3. Configure link checker to ignore patterns
4. Document in README that these are intentional

### Grep/Search Tools

Regex patterns may appear in search results for `/`:

```bash
# This will find regex patterns (intentional)
grep -r "/\w\+/" docs/
```

**Solutions**:
1. Filter results: `grep -v "Regex pattern"`
2. Use context-aware searches
3. Document expected false positives

## Best Practices

### 1. Always Add Context

❌ **BAD**:
```markdown
expect(content).toMatch(/pattern/);
```

✅ **GOOD**:
```markdown
// Test uses regex pattern matching for flexibility
expect(content).toMatch(`/pattern/`);  // Regex: description of what it matches
```

### 2. Explain Complex Patterns

```javascript
// Complex regex: matches "ES" followed by optional space and digit(s)
// Examples: "ES6", "ES 6", "ES2015", "ES 2015"
expect(content).toMatch(`/ES\\s*\\d+/`);
```

### 3. Group Related Patterns

```javascript
// Language variations (all case-insensitive)
const languagePatterns = {
  javascript: `/javascript|JS/i`,  // "javascript" or "JS"
  typescript: `/typescript|TS/i`,  // "typescript" or "TS"
  python: `/python|py/i`          // "python" or "py"
};
```

### 4. Document in Test Comments

```javascript
describe('Documentation content tests', () => {
  test('should reference JavaScript modules', () => {
    // Using regex pattern matching for flexible string matching
    // Pattern /javascript\s+modules?/i matches:
    // - "javascript module" or "javascript modules"
    // - Case-insensitive
    expect(content).toMatch(/javascript\s+modules?/i);
  });
});
```

## Integration with Link Checkers

### markdown-link-check Configuration

Add to `.markdown-link-check.json`:

```json
{
  "ignorePatterns": [
    {
      "pattern": "^/\\w+.*/$"
    }
  ],
  "comment": "Ignore regex patterns (starts with / ends with /)"
}
```

### mdl (markdownlint) Configuration

Regex patterns typically don't trigger markdownlint issues, but if needed:

```ruby
# .mdlrc
rule 'MD034', :code_blocks => true  # Allow regex in inline code
```

## Examples from Project

### TEST_IMPROVEMENT_ROADMAP.md

**Before** (ambiguous):
```
expect(content).toMatch(/javascript|JS/i);
```

**After** (clear):
```javascript
// Use regex patterns for flexible matching
expect(content).toMatch(`/javascript|JS/i`);  // Regex: "javascript" OR "JS" (case-insensitive)
expect(content).toMatch(`/modules?/i`);  // Regex: "module" or "modules"
```

### FAILING_TESTS_ANALYSIS.md

**Before**:
```
Test checks /deployment/ pattern
```

**After**:
```markdown
Test uses regex pattern `/deployment|deploy/i` to match deployment-related terms flexibly.
```

## Quick Reference

### Common Regex Flags
- `i` - Case-insensitive matching
- `g` - Global matching (find all)
- `m` - Multi-line matching

### Common Regex Symbols
- `|` - OR operator (alternative)
- `?` - Optional (0 or 1 occurrence)
- `+` - One or more occurrences
- `*` - Zero or more occurrences
- `\s` - Whitespace character
- `\d` - Digit character
- `\w` - Word character (letter, digit, underscore)

### Pattern Documentation Template

```markdown
**Pattern**: `/pattern/flags`
**Matches**: Description of what matches
**Examples**: 
- ✅ "example1"
- ✅ "example2"
- ❌ "non-match"
**Purpose**: Why this pattern is used
```

---

**Last Updated**: 2025-12-25  
**Related**: TEST_IMPROVEMENT_ROADMAP.md, FAILING_TESTS_ANALYSIS.md  
**See Also**: Jest documentation on expect().toMatch()
