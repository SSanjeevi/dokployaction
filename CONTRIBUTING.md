# Contributing to Dokploy GitHub Actions Templates

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## 🎯 How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. **Search existing issues** to avoid duplicates
2. **Create a new issue** with a clear title and description
3. **Include details**:
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Environment details (OS, versions, etc.)
   - Relevant logs or screenshots

### Suggesting Enhancements

We welcome suggestions for new features or improvements:

1. **Open an issue** with the `enhancement` label
2. **Describe the feature** and its benefits
3. **Provide examples** of how it would be used
4. **Discuss implementation** if you have ideas

### Contributing Code

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/dokployaction.git
cd dokployaction
```

#### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

#### 3. Make Changes

- Follow existing code style and conventions
- Add or update documentation as needed
- Test your changes thoroughly
- Keep commits focused and atomic

#### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new deployment strategy"
# or
git commit -m "fix: resolve health check timeout issue"
```

**Commit Message Format**:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

#### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference to related issues
- Screenshots or examples (if applicable)

## 📋 Development Guidelines

### Workflow Files

When creating or modifying workflows:

1. **Follow naming conventions**:
   - Use kebab-case: `my-workflow.yml`
   - Be descriptive: `blue-green-deploy.yml`

2. **Include comprehensive documentation**:
   - Purpose and use cases
   - Input/output descriptions
   - Usage examples

3. **Add error handling**:
   - Check for required inputs
   - Validate configurations
   - Provide helpful error messages

4. **Test thoroughly**:
   - Test with different configurations
   - Verify error scenarios
   - Check edge cases

### Documentation

When updating documentation:

1. **Keep it clear and concise**
2. **Use examples** to illustrate concepts
3. **Update all relevant files**
4. **Check for broken links**
5. **Maintain consistent formatting**

### Scripts

When adding or modifying scripts:

1. **Add shebang**: `#!/bin/bash`
2. **Include usage instructions**
3. **Add error handling**: `set -e`
4. **Validate inputs**
5. **Provide helpful output**
6. **Make scripts executable**: `chmod +x script.sh`

## 🧪 Testing

### Testing Workflows

1. **Create a test repository**
2. **Set up required secrets**
3. **Test with different configurations**
4. **Verify success and failure scenarios**
5. **Check logs for errors**

### Testing Scripts

```bash
# Test health check script
./scripts/health-check.sh https://example.com/health 5 3

# Test container cleanup
./scripts/cleanup-old-containers.sh \
  https://dokploy.example.com \
  dkp_test_key \
  myapp \
  2

# Test deployment validation
./scripts/validate-deployment.sh \
  https://dokploy.example.com \
  dkp_test_key \
  app_123
```

## 📝 Documentation Standards

### Markdown Files

- Use clear headings (H1 for title, H2 for sections)
- Include table of contents for long documents
- Use code blocks with language specification
- Add emojis for visual appeal (but don't overuse)
- Keep line length reasonable (80-120 characters)

### Code Comments

- Comment complex logic
- Explain "why" not "what"
- Keep comments up to date
- Use clear, concise language

### Examples

- Provide complete, working examples
- Include all required configuration
- Add comments to explain key parts
- Show both basic and advanced usage

## 🔍 Code Review Process

All contributions go through code review:

1. **Automated checks** run on PR creation
2. **Maintainers review** code and documentation
3. **Feedback provided** for improvements
4. **Approval required** before merging
5. **Squash and merge** to keep history clean

## 🎨 Style Guidelines

### YAML Files

```yaml
# Use 2 spaces for indentation
name: My Workflow

# Group related items
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Add comments for clarity
jobs:
  # Build and test the application
  build:
    name: Build Application
    runs-on: ubuntu-latest
```

### Shell Scripts

```bash
#!/bin/bash
# Script description

set -e  # Exit on error

# Configuration
VARIABLE_NAME="value"

# Functions
function_name() {
    local param=$1
    echo "Processing: $param"
}

# Main logic
main() {
    echo "Starting..."
    function_name "test"
    echo "Done!"
}

main "$@"
```

## 🏆 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Credited in commit history

## 📞 Getting Help

Need help contributing?

- **Open an issue** with your question
- **Join discussions** on GitHub
- **Check existing documentation**

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions make this project better for everyone. Thank you for taking the time to contribute!

---

**Questions?** Open an issue or start a discussion!

