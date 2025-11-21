# Dokploy GitHub Actions

> **Production-ready GitHub Actions for Dokploy deployments with best practices, security, and automation**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Dokploy](https://img.shields.io/badge/Dokploy-Compatible-blue)](https://dokploy.com)
[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Ready-green)](https://github.com/features/actions)
[![Marketplace](https://img.shields.io/badge/GitHub%20Marketplace-Published-blue)](https://github.com/marketplace/actions/dokploy-deployment-suite)

Deploy to Dokploy from GitHub Actions with a single line of code. Includes health checks, automatic rollback, zero-downtime deployments, and comprehensive lifecycle management.

## ⚡ Quick Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Dokploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: SSanjeevi/dokployaction@v1
        with:
          dokploy-url: ${{ secrets.DOKPLOY_URL }}
          api-key: ${{ secrets.DOKPLOY_API_KEY }}
          application-id: 'your-app-id'
          docker-image: 'ghcr.io/user/app:latest'
          enable-health-check: true
          health-check-url: 'https://app.com/health'
          cleanup-old-containers: true
          rollback-on-failure: true
```

That's it! Your application will be deployed with health checks, cleanup, and automatic rollback on failure.

## 🚀 Features

### ✨ Simple Yet Powerful

- **🎯 One-Line Deployment**: Use the main action with a single `uses:` statement
- **🧩 Modular Actions**: Mix and match individual actions for custom workflows
- **📋 Ready-Made Examples**: Copy and customize complete workflow templates
- **🔒 Security First**: Built-in secret management and secure credential handling

### 🏥 Reliability & Health

- **Health Checks**: Automatic health verification after deployment
- **Auto Rollback**: Rollback automatically on deployment or health check failure
- **Container Cleanup**: Remove old containers after successful deployment
- **Zero Downtime**: Blue-green deployment pattern (see examples)

### 📦 Complete Lifecycle Management

- **Project Management**: Create and manage Dokploy projects
- **Environment Setup**: Automated environment provisioning
- **Application Config**: Docker, domains, SSL, environment variables
- **Deployment Control**: Deploy, rollback, scale, monitor

### 🎓 Easy to Use

- **GitHub Marketplace**: Install with one click from GitHub Marketplace
- **Well Documented**: Comprehensive guides and API reference
- **Example Workflows**: 7+ production-ready workflow templates
- **Troubleshooting**: Common issues and solutions documented

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Reusable Actions](#reusable-actions)
- [Reusable Workflows](#reusable-workflows)
- [Workflow Templates](#workflow-templates)
- [Configuration](#configuration)
- [Security Best Practices](#security-best-practices)
- [Examples](#examples)
- [API Operations](#api-operations)
- [Troubleshooting](#troubleshooting)

## 🎯 Quick Start

### 1. Prerequisites

- Dokploy instance running and accessible
- GitHub repository with your application
- Dokploy API key (generate from Dokploy dashboard)
- Docker image registry (GitHub Container Registry, Docker Hub, etc.)

### 2. Setup Secrets

Add these secrets to your GitHub repository (`Settings` → `Secrets and variables` → `Actions`):

```yaml
Required Secrets:
  DOKPLOY_URL: https://your-dokploy-instance.com
  DOKPLOY_API_KEY: your-api-key-here

Optional Secrets (for private registries):
  REGISTRY_USERNAME: your-registry-username
  REGISTRY_PASSWORD: your-registry-token
```

### 3. Choose Your Approach

**Option A: Use the Complete Action (Easiest)**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Dokploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: SSanjeevi/dokployaction@v1
        with:
          dokploy-url: ${{ secrets.DOKPLOY_URL }}
          api-key: ${{ secrets.DOKPLOY_API_KEY }}
          application-id: 'your-app-id'
          docker-image: 'ghcr.io/user/app:latest'
          enable-health-check: true
          health-check-url: 'https://app.com/health'
          cleanup-old-containers: true
```

**Option B: Use Individual Actions (More Control)**
```yaml
steps:
  - name: Deploy
    uses: SSanjeevi/dokployaction/actions/deploy@v1
    with:
      dokploy-url: ${{ secrets.DOKPLOY_URL }}
      api-key: ${{ secrets.DOKPLOY_API_KEY }}
      application-id: 'app_123'
      docker-image: 'ghcr.io/user/app:latest'
  
  - name: Health Check
    uses: SSanjeevi/dokployaction/actions/health-check@v1
    with:
      health-check-url: 'https://app.com/health'
```

**Option C: Use Example Workflows (Full Templates)**

Browse complete workflow examples in [`examples/workflows/`](examples/workflows/):
- **Simple Deployment**: Basic deployment workflow
- **Production Deployment**: Full-featured with health checks and rollback
- **Blue-Green Deployment**: Zero-downtime deployments
- **Complete Lifecycle**: Full project/environment/app management

See [examples/workflows/README.md](examples/workflows/README.md) for detailed usage instructions.

## 📁 Repository Structure

```
dokployaction/
├── action.yml                             # 🎯 Main action for GitHub Marketplace
├── actions/                               # 🧩 Reusable composite actions
│   ├── deploy/                            # Deploy action
│   ├── health-check/                      # Health check action
│   ├── cleanup-containers/                # Container cleanup action
│   ├── setup-ssl/                         # SSL setup action
│   ├── configure-domain/                  # Domain configuration action
│   └── rollback/                          # Rollback action
├── .github/
│   └── workflows/
│       ├── test-actions.yml               # 🧪 Test and validate actions
│       └── publish-release.yml            # 📦 Publish to marketplace
├── examples/
│   ├── workflows/                         # 📋 Example workflow templates
│   │   ├── simple-deploy.yml              # Basic deployment
│   │   ├── production-deploy.yml          # Production-ready
│   │   ├── blue-green-deploy.yml          # Zero-downtime
│   │   ├── complete-lifecycle.yml         # Full lifecycle
│   │   ├── test-and-deploy.yml            # With testing
│   │   ├── reusable-deploy.yml            # Reusable workflow
│   │   └── reusable-blue-green.yml        # Reusable blue-green
│   ├── basic/                             # Basic usage examples
│   └── advanced/                          # Advanced scenarios
├── docs/
│   ├── API_REFERENCE.md                   # Dokploy API documentation
│   ├── SECURITY.md                        # Security best practices
│   ├── TROUBLESHOOTING.md                 # Common issues & solutions
│   └── WORKFLOWS.md                       # Workflow documentation
├── scripts/
│   ├── health-check.sh                    # Health check script
│   ├── cleanup-old-containers.sh          # Container cleanup
│   └── validate-deployment.sh             # Deployment validation
└── README.md                              # This file
```

## 🎯 Reusable Actions

Modular composite actions you can use in any workflow. No need to understand Dokploy API details!

### Available Actions

| Action | Description | Usage |
|--------|-------------|-------|
| **deploy** | Deploy Docker image | `uses: your-org/dokployaction/actions/deploy@v1` |
| **health-check** | Verify application health | `uses: your-org/dokployaction/actions/health-check@v1` |
| **cleanup-containers** | Remove old containers | `uses: your-org/dokployaction/actions/cleanup-containers@v1` |
| **setup-ssl** | Configure SSL/TLS | `uses: your-org/dokployaction/actions/setup-ssl@v1` |
| **configure-domain** | Set up custom domain | `uses: your-org/dokployaction/actions/configure-domain@v1` |
| **rollback** | Rollback deployment | `uses: your-org/dokployaction/actions/rollback@v1` |

### Quick Example

```yaml
- name: Deploy
  uses: your-org/dokployaction/actions/deploy@v1
  with:
    dokploy-url: ${{ secrets.DOKPLOY_URL }}
    api-key: ${{ secrets.DOKPLOY_API_KEY }}
    application-id: 'app_123'
    docker-image: 'ghcr.io/user/app:latest'

- name: Health Check
  uses: your-org/dokployaction/actions/health-check@v1
  with:
    health-check-url: 'https://app.com/health'
```

📖 **Full documentation**: [actions/README.md](actions/README.md) | [REUSABLE_ACTIONS_GUIDE.md](REUSABLE_ACTIONS_GUIDE.md)

---

## 🔄 Reusable Workflows

Complete workflows you can call from any repository. Just configure and go!

### 1. Reusable Deploy Workflow

Simple deployment with health checks and optional cleanup.

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    uses: your-org/dokployaction/.github/workflows/reusable-deploy.yml@v1
    with:
      docker-image: 'ghcr.io/user/app:latest'
      application-id: 'app_123'
      health-check-url: 'https://app.com/health'
      enable-health-check: true
      cleanup-containers: true
      rollback-on-failure: true
    secrets:
      DOKPLOY_URL: ${{ secrets.DOKPLOY_URL }}
      DOKPLOY_API_KEY: ${{ secrets.DOKPLOY_API_KEY }}
```

### 2. Reusable Blue-Green Workflow

Zero-downtime deployment with automatic rollback.

```yaml
name: Blue-Green Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    uses: your-org/dokployaction/.github/workflows/reusable-blue-green.yml@v1
    with:
      docker-image: 'ghcr.io/user/app:latest'
      application-id: 'app_123'
      health-check-url: 'https://app.com/health'
      container-prefix: 'myapp-prod'
      keep-old-containers: 2
    secrets:
      DOKPLOY_URL: ${{ secrets.DOKPLOY_URL }}
      DOKPLOY_API_KEY: ${{ secrets.DOKPLOY_API_KEY }}
```

📖 **See examples**: [examples/reusable/](examples/reusable/)

---

## 📋 Workflow Templates

Complete workflow templates you can copy to your repository.

### 1. Simple Deployment

Perfect for getting started quickly.

```yaml
name: Simple Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    uses: ./.github/workflows/simple-deploy.yml
    secrets:
      DOKPLOY_URL: ${{ secrets.DOKPLOY_URL }}
      DOKPLOY_API_KEY: ${{ secrets.DOKPLOY_API_KEY }}
```

### 2. Production Deployment

Includes health checks, rollback, and comprehensive logging.

```yaml
name: Production Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    uses: ./.github/workflows/production-deploy.yml
    with:
      environment: production
      health-check-enabled: true
      cleanup-old-containers: true
    secrets:
      DOKPLOY_URL: ${{ secrets.DOKPLOY_URL }}
      DOKPLOY_API_KEY: ${{ secrets.DOKPLOY_API_KEY }}
```

### 3. Blue-Green Deployment

Zero-downtime deployments with automatic rollback.

```yaml
name: Blue-Green Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    uses: ./.github/workflows/blue-green-deploy.yml
    with:
      container-prefix: myapp
      wait-for-healthy: true
      health-check-timeout: 300
    secrets:
      DOKPLOY_URL: ${{ secrets.DOKPLOY_URL }}
      DOKPLOY_API_KEY: ${{ secrets.DOKPLOY_API_KEY }}
```

## 🔐 Security Best Practices

1. **Use GitHub Secrets**: Never hardcode credentials
2. **OIDC Authentication**: Use OpenID Connect for cloud providers
3. **Least Privilege**: Grant minimum required permissions
4. **Secret Scanning**: Enable GitHub secret scanning
5. **Audit Logs**: Review deployment logs regularly
6. **API Key Rotation**: Rotate Dokploy API keys periodically

See [SECURITY.md](docs/SECURITY.md) for detailed security guidelines.

## 📚 Documentation

- [API Reference](docs/API_REFERENCE.md) - Complete Dokploy API documentation
- [Workflow Guide](docs/WORKFLOWS.md) - Detailed workflow explanations
- [Security Guide](docs/SECURITY.md) - Security best practices
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Dokploy](https://dokploy.com) - The amazing deployment platform
- [GitHub Actions](https://github.com/features/actions) - CI/CD platform
- Community contributors

## 📞 Support

- [Dokploy Documentation](https://docs.dokploy.com)
- [GitHub Issues](https://github.com/yourusername/dokployaction/issues)
- [Dokploy Discord](https://discord.gg/dokploy)

