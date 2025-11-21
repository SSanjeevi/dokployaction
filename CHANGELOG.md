# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Root `action.yml` for GitHub Marketplace publishing
- Comprehensive test workflow for validating actions
- Automated release workflow with major version tag updates
- Example workflows in `examples/workflows/` directory
- Detailed documentation for marketplace usage

### Changed
- Moved user-facing workflows from `.github/workflows/` to `examples/workflows/`
- Reorganized repository structure for marketplace publishing
- Updated README to focus on marketplace usage patterns
- Simplified repository structure for better usability

### Fixed
- Improved action validation and testing

## [1.0.0] - 2025-11-21

### Added
- Initial release with complete Dokploy deployment automation
- Deploy action with health checks and rollback
- Health check action with configurable retries
- Container cleanup action with prefix filtering
- SSL setup action for domain configuration
- Domain configuration action
- Rollback action for deployment recovery
- Complete lifecycle management workflow
- Blue-green deployment workflow
- Production deployment workflow
- Simple deployment workflow
- Test and deploy workflow
- Comprehensive documentation
- API reference guide
- Security best practices guide
- Troubleshooting guide

### Features
- Zero-downtime deployments
- Automatic health check verification
- Automatic rollback on failure
- Container lifecycle management
- Domain and SSL automation
- Multi-environment support
- Comprehensive error handling
- Detailed logging and reporting

---

## Version History

- **v1.0.0** (2025-11-21): Initial release
- **Unreleased**: Marketplace preparation and improvements

[Unreleased]: https://github.com/SSanjeevi/dokployaction/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/SSanjeevi/dokployaction/releases/tag/v1.0.0
