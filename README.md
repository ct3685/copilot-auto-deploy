# @theanswer/copilot-auto

> Make AWS Copilot deployments easier with intelligent configuration management and automated workflows

[![npm version](https://badge.fury.io/js/%40theanswer%2Fcopilot-auto.svg)](https://badge.fury.io/js/%40theanswer%2Fcopilot-auto)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/theanswer/copilot-auto-deploy/actions/workflows/ci.yml/badge.svg)](https://github.com/theanswer/copilot-auto-deploy/actions/workflows/ci.yml)

## 🚀 Overview

`copilot-auto` is a modern TypeScript CLI tool that makes AWS Copilot deployments easier for developers. It provides intelligent configuration management, interactive setup wizards, and automated workflows to streamline your deployment process.

### ✨ Features

- **Configuration-First Approach** - Simple JSON config files with intelligent defaults
- **Interactive Setup Wizard** - Guided initial configuration with project discovery
- **Environment Management** - Staging and production environment configurations
- **Service Templates** - Pre-built templates for common service types (flowise, web)
- **AWS Integration** - Seamless AWS SSO and profile management
- **Variable Validation** - Comprehensive environment variable validation
- **Cross-Platform** - Works on macOS, Linux, and Windows (with WSL)

## 📦 Installation

### Global Installation
```bash
npm install -g @theanswer/copilot-auto
```

### Local Installation
```bash
npm install @theanswer/copilot-auto
```

### Prerequisites
- Node.js 20+ 
- AWS CLI v2
- AWS Copilot CLI
- jq (for JSON processing)

## 🎯 Quick Start

### First Time Setup
```bash
# Run the interactive setup wizard
copilot-auto --setup

# This will guide you through:
# 1. Project discovery
# 2. Environment configuration
# 3. Service selection
# 4. Variable setup
# 5. AWS configuration
```

### Basic Usage
```bash
# Deploy to staging (interactive)
copilot-auto deploy --env staging

# Deploy to production (non-interactive)
copilot-auto deploy --env production --non-interactive

# Deploy specific services
copilot-auto deploy --env staging --services flowise,web
```

## ⚙️ Configuration

### Configuration File Location
- **Default**: `copilot/copilot-auto.json`
- **Custom**: `--config <path>` flag

### Example Configuration
```json
{
  "version": "1.0",
  "project": {
    "name": "my-copilot-project",
    "domain": "theanswer.ai",
    "defaultEnvironment": "staging"
  },
  "environments": {
    "staging": {
      "subdomain": "staging.client",
      "services": ["flowise", "web"],
      "autoConfirm": false
    },
    "production": {
      "subdomain": "client",
      "services": ["flowise", "web"],
      "autoConfirm": true
    }
  },
  "services": {
    "flowise": {
      "template": "flowise",
      "healthCheck": "/api/v1/ping",
      "resources": {
        "cpu": 0.5,
        "memory": 1.0
      }
    },
    "web": {
      "template": "web",
      "healthCheck": "/healthcheck",
      "resources": {
        "cpu": 0.25,
        "memory": 0.5
      }
    }
  },
  "aws": {
    "profile": "default",
    "region": "us-east-1",
    "autoConfirm": false
  }
}
```

## 🛠️ CLI Commands

### Deploy Commands
```bash
# Deploy with interactive prompts
copilot-auto deploy

# Deploy to specific environment
copilot-auto deploy --env staging

# Deploy specific services
copilot-auto deploy --services flowise,web

# Non-interactive deployment
copilot-auto deploy --env production --non-interactive

# Dry run (show commands without executing)
copilot-auto deploy --dry-run
```

### Configuration Commands
```bash
# Run setup wizard
copilot-auto --setup

# Initialize configuration
copilot-auto --init

# Validate configuration
copilot-auto --validate

# Discover existing project
copilot-auto --discover
```

### Options
| Option              | Description                            |
| ------------------- | -------------------------------------- |
| `-e, --env`         | Environment (staging\|prod)            |
| `-s, --subdomain`   | Client domain key (e.g., acme)         |
| `--services`        | Comma-separated services (flowise,web) |
| `--yes`             | Auto-confirm prompts                   |
| `--non-interactive` | Fail if required values missing        |
| `--debug`           | Verbose output                         |
| `--dry-run`         | Show commands without executing        |
| `--config`          | Path to configuration file             |
| `--init`            | Initialize configuration and templates |
| `--setup`           | Run interactive setup wizard           |

## 🔧 Development

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm
- AWS CLI with demo-sso profile

### Setup Development Environment
```bash
# Clone the repository
git clone https://github.com/theanswer/copilot-auto-deploy.git
cd copilot-auto-deploy

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run in development mode
pnpm dev
```

### Testing
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test tests/unit/config.test.ts
```

### Demo Environment
```bash
# Setup demo environment
pnpm demo:setup

# Deploy to demo environment
pnpm demo:deploy

# Cleanup demo environment
pnpm demo:cleanup
```

### Code Quality
```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type check
pnpm type-check

# Format code
pnpm format
```

## 📚 Documentation

- **[Getting Started](docs/getting-started/)** - Installation and first steps
- **[Configuration Guide](docs/guides/)** - Configuration management
- **[CLI Reference](docs/reference/)** - Complete CLI documentation
- **[Examples](docs/examples/)** - Usage examples and templates
- **[Contributing](docs/contributing/)** - Development guidelines

## 🏗️ Architecture

### Module Structure
```
src/
├── bin.ts              # CLI entry point
├── config.ts           # Configuration management
├── setup.ts            # Interactive setup wizard
├── deploy.ts           # Main deployment workflow
├── aws.ts              # AWS verification logic
├── printers.ts         # UI/console output
├── exec.ts             # Command execution wrappers
├── utils.ts            # Utilities and validators
├── domain-switch.ts    # Domain switching logic
└── env-files.ts        # Environment file creation
```

### Key Components
- **Configuration Management** - JSON-based config with validation
- **Interactive Setup** - Guided configuration wizard
- **Service Templates** - Pre-built templates for common services
- **AWS Integration** - SSO token validation and profile management
- **Environment Management** - Multi-environment deployment support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/contributing/) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the test suite
6. Submit a pull request

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- 90%+ test coverage
- Conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/theanswer/copilot-auto-deploy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/theanswer/copilot-auto-deploy/discussions)
- **Email**: dev@theanswer.ai

## 🙏 Acknowledgments

- AWS Copilot team for the excellent CLI tool
- The open source community for inspiration and tools
- TheAnswer AI team for support and feedback

---

Made with ❤️ by [TheAnswer AI](https://theanswer.ai)