# Copilot Auto-Deploy Package Development Plan

## Overview
Transform the existing bash script (`copilot-auto-deploy.sh`) and Node.js environment file creator (`create-env-files.js`) into a modern TypeScript ESM-first npm package (Node 20+ minimum) that makes Copilot deployments easier for developers. Built with AAI as the premier template and universal capabilities for broader adoption. Features intelligent configuration management, interactive prompts, automated workflows, and a comprehensive template system. Built with the latest development standards including ES modules as primary, dual ESM/CJS compatibility, and modern tooling.

## Project Goals
- ✅ **AAI-First Design** - Premier template with zero-config setup for AAI projects
- ✅ **Universal Capabilities** - Extensible for any domain and service type
- ✅ **Template System** - Comprehensive template inheritance and customization
- ✅ **Developer-friendly configuration management** - Simple config files with intelligent defaults
- ✅ **Interactive and automated workflows** - Guided setup with fallback to prompts
- ✅ **Modern TypeScript ESM-first package** (2025 standards with Node 20+)
- ✅ **ES Modules as primary** with dual ESM/CJS compatibility
- ✅ **Comprehensive unit and integration testing**
- ✅ **Minimal-cost demo deployments** for validation
- ✅ **CI/CD pipeline** with automated testing
- ✅ **Production-ready CLI** with proper error handling
- ✅ **Cross-platform compatibility** (with Windows considerations)
- ✅ **Domain switching logic** from `copilot-switch-app.sh`
- ✅ **Environment file creation** from `create-env-files.js`
- ✅ **Service-specific configurations** for flowise and web services

## Phase 1: Project Structure & Foundation (Week 1)

### 1.1 Initialize Project Structure
```
copilot-auto/
├── src/
│   ├── bin.ts              # CLI entry point
│   ├── deploy.ts           # Main deployment workflow (ported from copilot-auto-deploy.sh)
│   ├── aws.ts              # AWS verification logic
│   ├── printers.ts         # UI/console output (ported from bash script)
│   ├── exec.ts             # Command execution wrappers
│   ├── utils.ts            # Utilities and validators
│   ├── domain-switch.ts    # Domain switching logic (ported from copilot-switch-app.sh)
│   ├── env-files.ts        # Environment file creation (ported from create-env-files.js)
│   ├── config.ts           # Configuration management
│   └── setup.ts            # Interactive setup wizard
├── templates/              # Service templates
│   ├── aai/                # AAI-specific templates (default)
│   │   ├── flowise/        # AAI Flowise template
│   │   ├── web/            # AAI Web template
│   │   └── common/         # AAI common configurations
│   ├── generic/            # Universal templates
│   │   ├── nodejs/         # Generic Node.js template
│   │   ├── python/         # Generic Python template
│   │   ├── static/         # Generic static site template
│   │   └── api/            # Generic API template
│   └── custom/             # User-defined templates
├── scripts/                # Vendor scripts (for backward compatibility)
│   ├── copilot-switch-app.sh
│   └── create-env-files.js
├── docs/                   # Documentation (ported from OriginalScripts/copilot/docs/)
│   ├── route53-prerequisites.md
│   ├── S3_STORAGE_CONFIGURATION.md
│   └── env-file-creation.md
├── tests/
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── helpers/            # Test utilities
├── demo/                   # Demo environment
│   ├── minimal-app/        # Minimal test application
│   └── test-configs/       # Test configurations
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
└── README.md
```

### 1.2 Package Configuration
- **TypeScript ESM-first** with dual build (ESM primary + CJS compatibility)
- **Node 20+** minimum requirement (latest LTS)
- **ES Modules** as primary module system with `"type": "module"`
- **Modern dependencies**: execa@9, commander@12, prompts@2, js-yaml@4
- **Build tool**: tsup for efficient bundling with tree-shaking
- **Testing**: vitest with coverage and ESM support
- **Package exports**: Modern conditional exports for dual compatibility

### 1.3 Development Environment Setup
- **ESLint configuration** with TypeScript and ESM support
- **Prettier formatting** with modern rules
- **Git hooks** (husky) for pre-commit checks
- **Conventional commits** for automated releases
- **Modern Node.js tooling** (pnpm, latest npm)
- **ESM-aware development** with proper import/export syntax

## Phase 2: Core Implementation (Week 2)

### Implementation Strategy: AAI-First, Universal-Capable

#### Phase 2A: AAI-First Implementation (Week 2)
- **AAI-specific templates** - Flowise and web service templates
- **AAI branding** - TheAnswer AI branding and defaults
- **Zero-config setup** - Perfect compatibility with existing workflow
- **AAI validation rules** - Domain and service-specific validation

#### Phase 2B: Universal Foundation (Week 3)
- **Template system** - Extensible template architecture
- **Generic templates** - Node.js, Python, static, API templates
- **Configuration abstraction** - Domain-agnostic configuration
- **Template inheritance** - Customization and override system

#### Phase 2C: Ecosystem Growth (Week 4)
- **Template marketplace** - Community template sharing
- **Plugin system** - Custom integrations and extensions
- **Documentation** - Template development guides
- **Examples** - Real-world usage examples

### 2.1 Configuration Management System
**Purpose**: Make deployments easier through intelligent configuration

**Configuration File Location**: `copilot/copilot-auto.json` (default)

**Configuration Structure**:
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
  },
  "variables": {
    "required": ["AUTH0_CLIENT_ID", "AUTH0_CLIENT_SECRET"],
    "optional": ["DEBUG", "LOG_LEVEL"]
  }
}
```

**Configuration Features**:
- **Intelligent defaults** - Sensible defaults for common scenarios
- **Environment-specific settings** - Different configs per environment
- **Service templates** - Pre-configured service definitions
- **Variable management** - Required and optional environment variables
- **AWS integration** - Profile and region configuration

### 2.2 Interactive Setup Wizard
**Purpose**: Guide developers through initial configuration

**Wizard Flow**:
1. **Project discovery** - Auto-detect existing copilot project
2. **Environment setup** - Configure staging and production
3. **Service selection** - Choose which services to deploy
4. **Variable configuration** - Set up required environment variables
5. **AWS configuration** - Configure AWS profile and region
6. **Configuration generation** - Create copilot/copilot-auto.json

**Fallback Behavior**:
- If no config file exists → Run setup wizard
- If config is incomplete → Prompt for missing values
- If config is valid → Use configuration values

### 2.3 Core Modules Development
1. **config.ts** - Configuration management with intelligent defaults
2. **setup.ts** - Interactive setup wizard for initial configuration
3. **printers.ts** - ANSI-based UI components (ported from bash script)
4. **exec.ts** - Command execution with proper error handling
5. **utils.ts** - Validators, timeouts, and utilities
6. **aws.ts** - AWS account verification (ported from bash script)
7. **domain-switch.ts** - Domain switching logic (ported from copilot-switch-app.sh)
8. **env-files.ts** - Environment file creation (ported from create-env-files.js)
9. **deploy.ts** - Main deployment workflow (ported from copilot-auto-deploy.sh)
10. **bin.ts** - CLI interface

### 2.2 Key Features Implementation
- **AAI-First Design** - Zero-config setup for AAI projects with branded experience
- **Universal Template System** - Extensible templates for any domain/service
- **Configuration-first approach** - Config files with intelligent defaults
- **Interactive setup wizard** - Guided initial configuration
- **Fallback to prompts** - When config is missing or incomplete
- **AWS SSO token validation** with comprehensive error detection
- **Domain switching** with automatic app name generation
- **Environment file creation** with validation and templates
- **Copilot app/environment management**
- **Service deployment orchestration** (flowise and web)
- **Template inheritance** and customization
- **Proper error handling** and exit codes
- **Signal handling** (SIGINT/SIGTERM)

### 2.3 CLI Interface
```bash
copilot-auto [options]
  -e, --env <env>              Environment (staging|prod)
  -s, --subdomain <key>        Client domain key (e.g., acme)
  --services <list>            Comma-separated services (flowise,web)
  --yes                        Auto-confirm prompts
  --non-interactive            Fail if required values missing
  --debug                      Verbose output
  --dry-run                    Show commands without executing
  --config <file>              Path to configuration file (default: copilot/copilot-auto.json)
  --init                       Initialize configuration and templates
  --setup                      Run interactive setup wizard
```

## Phase 3: Testing Strategy (Week 3)

### 3.1 Unit Testing
- **AWS verification** - Token expiry, account confirmation
- **Domain switching** - App name generation logic
- **Environment file creation** - Template processing and validation
- **Command execution** - Success/failure scenarios
- **Validation logic** - Subdomain, environment validation
- **UI components** - Printer functions, formatting

### 3.2 Integration Testing
- **End-to-end workflows** - Complete deployment scenarios
- **Mock Copilot CLI** - Simulate copilot commands
- **Environment scenarios** - App exists/missing, env exists/missing
- **Service deployment** - Flowise and web service deployment

### 3.3 Test Infrastructure
- **Mock helpers** - Command execution stubs
- **Test fixtures** - Sample configurations and templates
- **Coverage reporting** - 90%+ target coverage

## Phase 4: Demo Environment & Minimal-Cost Testing (Week 4)

### 4.1 Demo Application Structure
```
demo/minimal-app/
├── copilot/
│   ├── .workspace
│   ├── addons/
│   ├── environments/
│   └── services/
│       ├── flowise/
│       └── web/
├── scripts/
│   ├── copilot-switch-app.sh
│   └── create-env-files.js
└── package.json
```

### 4.2 Minimal-Cost Services
- **flowise**: Minimal FastAPI app with health check (ported from existing)
- **web**: Static HTML with health check endpoint (ported from existing)
- **No databases** - Use in-memory storage
- **No external APIs** - Mock responses
- **Minimal compute** - Smallest possible container sizes

### 4.3 Demo Environment Strategy
- **Separate AWS account** for testing
- **Staging environment only** - No production deployments
- **Auto-cleanup** - TTL-based resource deletion
- **Cost monitoring** - CloudWatch alarms for budget
- **Minimal resources**:
  - 0.25 vCPU, 0.5GB RAM containers
  - No persistent storage
  - Minimal network resources

### 4.4 Demo Deployment Workflow
1. **Setup demo environment**
2. **Deploy minimal services**
3. **Verify health checks**
4. **Run integration tests**
5. **Cleanup resources**

## Phase 5: CI/CD Pipeline (Week 5)

### 5.1 GitHub Actions Workflow
```yaml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    - Unit tests
    - Integration tests
    - Code coverage
    - Linting
  
  build:
    - TypeScript compilation
    - Package bundling
    - Artifact creation
  
  demo-deploy:
    - Deploy to demo environment
    - Run smoke tests
    - Cleanup resources
  
  publish:
    - NPM publish (on release)
```

### 5.2 Quality Gates
- **Test coverage** > 90%
- **Lint score** = 0
- **Build success** required
- **Demo deployment** success required

## Phase 6: Documentation & Polish (Week 6)

### 6.1 Comprehensive Documentation
- **README.md** - Installation, usage, examples, troubleshooting
- **API documentation** - JSDoc comments with TypeScript types
- **CLI reference** - All options, examples, and exit codes
- **Troubleshooting guide** - Common issues and solutions
- **Developer guide** - Contributing, testing, and development setup
- **Architecture documentation** - Module relationships and design decisions
- **Port existing docs** - Route53 prerequisites, S3 configuration, env file creation

### 6.2 Templates & Configuration System
- **Service templates** - Pre-built templates for flowise and web services
- **Configuration templates** - YAML/JSON config files for different scenarios
- **Dynamic service detection** - Auto-discovery of services from copilot folders
- **Required variables system** - Dynamic validation of environment variables
- **CI/CD templates** - GitHub Actions, GitLab CI, and other pipeline examples
- **Custom deployment hooks** - Template system for pre/post deployment scripts

### 6.3 Developer Experience
- **Quick start templates** - Minimal working examples
- **Interactive setup wizard** - Guided configuration creation
- **Configuration validation** - Real-time validation of config files
- **Auto-completion** - Shell completion scripts (bash, zsh, fish)
- **IDE integration** - VS Code extensions and IntelliSense support

### 6.4 Performance & Security
- **Startup time** optimization
- **Memory usage** profiling
- **Security audit** - Dependency scanning and vulnerability checks
- **Package vulnerability scanning** - All dependencies must be latest non-vulnerable versions
- **Regular security audits** - Monthly dependency vulnerability checks
- **Security-focused CI/CD** - Automated vulnerability scanning in pipeline
- **Cross-platform** testing

## Implementation Priority Matrix

### High Priority (Must Have)
1. ✅ Core deployment workflow (ported from copilot-auto-deploy.sh)
2. ✅ AWS verification (ported from bash script)
3. ✅ Domain switching logic (ported from copilot-switch-app.sh)
4. ✅ Environment file creation (ported from create-env-files.js)
5. ✅ Unit testing framework
6. ✅ CLI interface
7. ✅ Error handling

### Medium Priority (Should Have)
1. ✅ Integration testing
2. ✅ Demo environment
3. ✅ CI/CD pipeline
4. ✅ Comprehensive documentation
5. ✅ Templates and configuration system
6. ✅ Cross-platform support

### Low Priority (Nice to Have)
1. ✅ Performance optimization
2. ✅ Advanced CLI features
3. ✅ Plugin system
4. ✅ Monitoring integration
5. ✅ IDE extensions and tooling

## Risk Mitigation

### Technical Risks
- **AWS API changes** - Version pinning, compatibility testing
- **Copilot CLI changes** - Version constraints, feature detection
- **Cross-platform issues** - Windows testing, WSL requirements
- **Domain switching complexity** - Thorough testing of app name generation

### Cost Risks
- **Demo environment costs** - Budget limits, auto-cleanup
- **Resource leaks** - Monitoring, alerting
- **Unexpected usage** - Rate limiting, cost controls

### Timeline Risks
- **Scope creep** - Strict prioritization
- **Testing complexity** - Incremental approach
- **Integration issues** - Early prototyping

## Success Metrics

### Technical Metrics
- **Test coverage** ≥ 90%
- **Build time** < 30 seconds
- **Startup time** < 2 seconds
- **Zero critical vulnerabilities**
- **Zero package vulnerabilities** - All dependencies scanned and updated
- **Security audit score** 100% - No security issues detected

### Quality Metrics
- **Zero production bugs** in core workflow
- **100% demo deployment success rate**
- **User satisfaction** > 4.5/5
- **Documentation completeness** 100%

### Cost Metrics
- **Demo environment cost** < $10/month
- **Resource cleanup** 100% success rate
- **No unexpected charges**

## Next Steps

1. **Review and approve** this plan
2. **Set up development environment**
3. **Begin Phase 1** implementation
4. **Weekly progress reviews**
5. **Adjust plan** based on findings

## Resources Required

### Development Tools
- Node.js 20+
- TypeScript 5.6+
- Git
- VS Code (recommended)

### AWS Resources (Demo)
- AWS account for testing
- IAM roles with minimal permissions
- CloudWatch for monitoring
- Budget alerts

### External Services
- GitHub for CI/CD
- NPM for package publishing
- Docker for container testing

---

**Estimated Timeline**: 6 weeks
**Team Size**: 1-2 developers
**Budget**: < $50/month for demo environment
**Risk Level**: Low-Medium
