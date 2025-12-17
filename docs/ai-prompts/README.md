# AI Integration & Prompt Engineering

**Directory**: `docs/ai-prompts/`
**Purpose**: Documentation for AI-assisted development practices, prompt engineering standards, and GitHub Copilot integration patterns
**Last Updated**: December 15, 2025

## Overview

This directory contains documentation for integrating AI tools, particularly GitHub Copilot, into the development workflow. The focus is on establishing standards for prompt design, extraction, and centralization to maximize code reusability and maintainability.

## 📚 Documentation Files

### [AI Prompt Extraction Standard](AI_PROMPT_EXTRACTION_STANDARD.md)

**Version**: 1.0.0
**Status**: Active Project Standard
**Lines**: 227

Establishes the project standard for extracting AI prompts from workflow step modules into the centralized AI helpers library.

**Key Topics**:
- Reusability and maintainability benefits
- Standard extraction patterns (before/after examples)
- Integration with `shell_scripts/workflow/lib/ai_helpers.sh`
- Testing and documentation best practices
- YAML configuration for prompt templates

**Use Cases**:
- Converting inline AI prompts to reusable functions
- Standardizing prompt design across workflow steps
- Creating testable AI integration components

---

### [Copilot Prompt Scoping Guide](COPILOT_PROMPT_SCOPING_GUIDE.md)

**Lines**: 243

Best practices for GitHub Copilot prompt design and context management to maximize AI assistance quality.

**Key Topics**:
- Effective prompt scoping strategies
- Context window management
- Persona-based prompt design
- Task decomposition techniques
- Interactive vs. copy-paste workflows
- Error handling and graceful degradation

**Use Cases**:
- Designing prompts for GitHub Copilot CLI
- Managing conversation context in AI interactions
- Optimizing prompt length and structure
- Implementing multi-phase AI workflows

---

### [Prompt Extraction Refactoring](PROMPT_EXTRACTION_REFACTORING.md)

**Lines**: 201

Refactoring patterns for migrating from inline AI prompts to centralized, reusable prompt libraries.

**Key Topics**:
- Refactoring strategies for existing code
- Migration patterns from monolithic to modular prompts
- YAML externalization patterns
- Performance considerations
- Backward compatibility strategies

**Use Cases**:
- Refactoring legacy inline prompts
- Creating centralized prompt libraries
- Implementing YAML-based prompt configuration
- Maintaining backward compatibility during migration

## 🎯 Quick Start

### For New AI Integrations

1. **Read**: [Copilot Prompt Scoping Guide](COPILOT_PROMPT_SCOPING_GUIDE.md) - Learn effective prompt design
2. **Follow**: [AI Prompt Extraction Standard](AI_PROMPT_EXTRACTION_STANDARD.md) - Implement standard patterns
3. **Reference**: Existing implementations in `shell_scripts/workflow/lib/ai_helpers.sh`

### For Refactoring Existing Code

1. **Read**: [Prompt Extraction Refactoring](PROMPT_EXTRACTION_REFACTORING.md) - Migration strategies
2. **Follow**: [AI Prompt Extraction Standard](AI_PROMPT_EXTRACTION_STANDARD.md) - Target architecture
3. **Test**: Verify backward compatibility with existing workflows

## 🏗️ Architecture Context

### Integration with Workflow Automation

The AI prompt standards directly support the workflow automation system:

- **Location**: `shell_scripts/workflow/lib/ai_helpers.sh`
- **Configuration**: `shell_scripts/workflow/lib/ai_helpers.yaml`
- **Usage**: All 13 workflow steps (step_00 through step_12)
- **Pattern**: Functional prompt builders with dependency injection

### Key Benefits

1. **Reusability**: Prompts used across multiple workflow steps
2. **Maintainability**: Single source of truth for prompt templates
3. **Consistency**: Standardized prompt structure and persona definitions
4. **Testability**: Isolated functions for unit testing
5. **Documentation**: Self-documenting prompt library

## 📊 Usage Statistics

**Workflow Integration**:
- 13 workflow steps use centralized prompts
- 762 lines of YAML prompt templates
- 27 specialized AI personas defined
- 100% coverage across all workflow phases

**Code Metrics**:
- Total documentation: 671 lines
- Standards coverage: 3 comprehensive guides
- Implementation examples: Multiple real-world patterns

## 🔗 Related Documentation

### Workflow Automation
- [Workflow Modular Architecture](../../shell_scripts/workflow/README.md) - Complete module documentation
- [Workflow Modularization Phase 3](../workflow-automation/WORKFLOW_MODULARIZATION_PHASE3_COMPLETION.md) - Module extraction completion
- [Tests & Docs Workflow Plan](../workflow-automation/TESTS_DOCS_WORKFLOW_AUTOMATION_PLAN.md) - AI-powered workflow design

### Development Guides
- [Functional Core, Imperative Shell Guide](../development-guides/FUNCTIONAL_CORE_IMPERATIVE_SHELL_GUIDE.md) - Architectural patterns
- [Dependency Injection Best Practices](../development-guides/DEPENDENCY_INJECTION_BEST_PRACTICES.md) - DI patterns for AI integration

### Documentation Standards
- [Markdown Best Practices](../documentation-standards/MARKDOWN_BEST_PRACTICES.md) - Documentation style
- [Documentation Style Guide](../documentation-standards/DOCUMENTATION_STYLE_GUIDE.md) - Formatting conventions

## 🎓 Best Practices Summary

### Prompt Design Principles

1. **Be Specific**: Clearly define the AI's role and task
2. **Provide Context**: Include relevant project information
3. **Structure Output**: Specify expected format and structure
4. **Handle Errors**: Plan for graceful degradation
5. **Test Thoroughly**: Validate AI-generated outputs

### Integration Guidelines

1. **Extract Early**: Move prompts to library during initial development
2. **Use YAML**: Externalize long prompts to configuration files
3. **Document Well**: Include usage examples and context
4. **Version Control**: Track prompt changes with semantic versioning
5. **Test Coverage**: Write tests for prompt builder functions

### Common Patterns

**Persona-Based Prompts**:
```bash
build_documentation_specialist_prompt() {
    local context="$1"
    local task="$2"
    echo "**Role**: Senior technical documentation specialist
**Task**: $task
**Context**: $context"
}
```

**YAML Configuration**:
```yaml
personas:
  documentation_specialist:
    role: "Senior technical documentation specialist"
    expertise: ["technical writing", "API docs", "user guides"]
    context_requirements: ["project structure", "existing docs"]
```

**Dependency Injection**:
```bash
execute_ai_task() {
    local prompt_builder="$1"  # Function reference
    local context="$2"

    local prompt=$($prompt_builder "$context")
    copilot -p "$prompt"
}
```


## 📝 Contributing

When adding new AI integration documentation:

1. Follow the established structure (Overview, Key Topics, Use Cases)
2. Include practical examples and code snippets
3. Reference related workflow components
4. Update this README with new file information
5. Maintain consistent formatting and style

## 🔍 Troubleshooting

### Common Issues

**Q: Prompts producing inconsistent results?**
A: Review [Copilot Prompt Scoping Guide](COPILOT_PROMPT_SCOPING_GUIDE.md) for context management strategies.

**Q: How to migrate existing inline prompts?**
A: Follow [Prompt Extraction Refactoring](PROMPT_EXTRACTION_REFACTORING.md) migration patterns.

**Q: Need to create new AI integration?**
A: Use [AI Prompt Extraction Standard](AI_PROMPT_EXTRACTION_STANDARD.md) as template.

## 📅 Version History

- **v1.0.0** (January 13, 2025): Initial AI Prompt Extraction Standard
- **Current** (December 15, 2025): Complete directory with 3 comprehensive guides

## 📧 Feedback

For questions, suggestions, or improvements to AI integration practices, please refer to the main project documentation or workflow automation guides.

---

**Directory Structure**:
```
docs/ai-prompts/
├── README.md (this file)
├── AI_PROMPT_EXTRACTION_STANDARD.md
├── COPILOT_PROMPT_SCOPING_GUIDE.md
└── PROMPT_EXTRACTION_REFACTORING.md
```

**Total Documentation**: 671 lines + this README = comprehensive AI integration guide
