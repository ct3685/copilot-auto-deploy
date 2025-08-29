# Technical Specification: Copilot Auto-Deploy Package

## Architecture Overview

### Design Principles
- **Modularity**: Each module has a single responsibility
- **Testability**: All business logic is unit testable
- **Error Handling**: Graceful degradation with clear error messages
- **Performance**: Fast startup and minimal resource usage
- **Security**: No secrets in logs, proper input validation

### Module Architecture
```
src/
├── bin.ts          # CLI entry point (thin wrapper)
├── deploy.ts       # Main orchestration logic
├── aws.ts          # AWS-specific operations
├── printers.ts     # UI/console output (pure functions)
├── exec.ts         # Command execution (abstraction layer)
└── utils.ts        # Utilities and validators (pure functions)
```

## Core Modules Specification

### 1. printers.ts - UI Components
**Purpose**: Handle all console output with consistent styling

**Key Functions**:
```typescript
// Constants
export const C: ColorConstants

// Core functions
export function header(text: string): void
export function phase(number: string, title: string): void
export function step(message: string): void
export function success(message: string): void
export function error(message: string): void
export function warn(message: string): void
export function info(message: string): void
export function deploymentSuccess(service: string, url?: string): void
```

**Design Decisions**:
- Use ANSI codes instead of chalk for faster startup
- Pure functions for easy testing
- Consistent color scheme throughout
- Box-drawing characters for visual appeal

### 2. exec.ts - Command Execution
**Purpose**: Abstract command execution with proper error handling

**Key Functions**:
```typescript
export interface ExecResult {
  ok: boolean;
  out: string;
}

export async function run(
  cmd: string, 
  args: string[] = [], 
  opts: Record<string, unknown> = {}
): Promise<ExecResult>

export async function which(bin: string): Promise<boolean>
```

**Design Decisions**:
- Use execa for better error handling
- Return structured results instead of throwing
- Support for preferLocal to use project binaries
- Cross-platform which() implementation

### 3. utils.ts - Utilities
**Purpose**: Pure utility functions and validators

**Key Functions**:
```typescript
export function lower(s: string | undefined | null): string
export function isValidSubdomain(s: string): boolean
export function isValidEnvironment(env: string): boolean
export async function askWithTimeout(
  prompt: string, 
  ms: number, 
  defaultValue: string
): Promise<string>
```

**Design Decisions**:
- Pure functions for easy testing
- Comprehensive input validation
- Timeout-based prompts for non-blocking UX
- Type-safe implementations

### 4. aws.ts - AWS Operations
**Purpose**: Handle AWS-specific operations and verification

**Key Functions**:
```typescript
export interface AwsVerificationResult {
  ok: boolean;
  fatal?: boolean;
  reason?: 'cancelled' | 'expired';
}

export async function verifyAwsAccount(
  confirmFn: (msg: string) => Promise<boolean>
): Promise<AwsVerificationResult>
```

**Design Decisions**:
- Comprehensive token expiry detection
- User confirmation for account verification
- Clear error messages with actionable steps
- Support for both interactive and non-interactive modes

### 5. deploy.ts - Main Workflow
**Purpose**: Orchestrate the complete deployment process

**Key Functions**:
```typescript
export interface DeployOptions {
  env?: string;
  subdomain?: string;
  services?: string[];
  yes?: boolean;
  nonInteractive?: boolean;
  debug?: boolean;
  dryRun?: boolean;
}

export async function deployFlow(opts: DeployOptions): Promise<void>
```

**Design Decisions**:
- Phased approach for clear progress indication
- Comprehensive error handling at each phase
- Support for partial deployments
- Environment variable management

### 6. bin.ts - CLI Interface
**Purpose**: Handle CLI argument parsing and orchestration

**Key Functions**:
```typescript
// Main CLI logic
const program = new Command()
  .name("copilot-auto")
  .description("Automated deployment for TheAnswer Copilot services")
  // ... options

// Signal handling
process.on("SIGINT", () => { /* cleanup */ });
process.on("SIGTERM", () => { /* cleanup */ });
```

**Design Decisions**:
- Thin wrapper around deploy.ts
- Commander.js for argument parsing
- Proper signal handling
- Clear error reporting
- Support for configuration files
- Auto-completion generation

## CLI Interface Specification

### Command Structure
```bash
copilot-auto [options]
```

### Options
| Option              | Type    | Required | Description                            |
| ------------------- | ------- | -------- | -------------------------------------- |
| `-e, --env`         | string  | No       | Environment (staging\|prod)            |
| `-s, --subdomain`   | string  | No       | Client domain key (e.g., acme)         |
| `--services`        | string  | No       | Comma-separated services (flowise,web) |
| `--yes`             | boolean | No       | Auto-confirm prompts                   |
| `--non-interactive` | boolean | No       | Fail if required values missing        |
| `--debug`           | boolean | No       | Verbose output                         |
| `--dry-run`         | boolean | No       | Show commands without executing        |
| `--config`          | string  | No       | Path to configuration file             |
| `--init`            | boolean | No       | Initialize configuration and templates |

### Exit Codes
| Code | Meaning                      |
| ---- | ---------------------------- |
| 0    | Success                      |
| 1    | General error                |
| 2    | Invalid input                |
| 130  | Interrupted (SIGINT/SIGTERM) |

## Testing Strategy

### Unit Testing
**Framework**: Vitest
**Coverage Target**: ≥90%

**Test Categories**:
1. **Pure Functions**: printers.ts, utils.ts
2. **Command Execution**: exec.ts with mocked execa
3. **AWS Operations**: aws.ts with mocked AWS CLI
4. **Workflow Logic**: deploy.ts with mocked dependencies

### Integration Testing
**Approach**: End-to-end workflow testing
**Mock Strategy**: Mock external commands (aws, copilot, jq)

**Test Scenarios**:
1. Happy path (app exists, env exists)
2. App creation flow
3. Environment creation flow
4. Service deployment flow
5. Error handling scenarios

### Test Infrastructure
```typescript
// Mock helpers
export function makeRunStub(map: RunMap): MockFunction
export function makeWhichStub(present: Set<string>): MockFunction

// Test fixtures
export const mockAwsResponses = {
  validToken: '{"Account":"123456789012"}',
  expiredToken: 'An error occurred (ExpiredToken)',
  // ...
}
```

## Configuration & Template System

### Configuration File Format
**Purpose**: Provide declarative configuration for deployments

**File Format**: YAML or JSON
```yaml
# copilot-auto.yaml
version: "1.0"
project:
  name: "my-copilot-project"
  domain: "example.com"
  
environments:
  staging:
    subdomain: "staging"
    services: ["web", "api"]
    required_vars:
      - DATABASE_URL
      - API_KEY
  production:
    subdomain: "prod"
    services: ["web", "api", "worker"]
    required_vars:
      - DATABASE_URL
      - API_KEY
      - REDIS_URL

services:
  web:
    template: "static"
    health_check: "/health"
    resources:
      cpu: 0.25
      memory: 0.5
  api:
    template: "fastapi"
    health_check: "/api/v1/ping"
    resources:
      cpu: 0.5
      memory: 1.0
  worker:
    template: "background"
    resources:
      cpu: 0.25
      memory: 0.5

hooks:
  pre_deploy:
    - "npm run build"
    - "npm run test"
  post_deploy:
    - "npm run health-check"
```

### Dynamic Service Detection
**Purpose**: Automatically discover services from copilot folder structure

**Implementation**:
```typescript
export interface ServiceDiscovery {
  services: ServiceInfo[];
  environments: EnvironmentInfo[];
  requiredVars: string[];
}

export async function discoverServices(
  copilotPath: string
): Promise<ServiceDiscovery>

export async function validateRequiredVars(
  vars: Record<string, string>,
  required: string[]
): Promise<ValidationResult>
```

### Template System
**Purpose**: Provide pre-built templates for common service types

**Template Categories**:
1. **Web Services**: FastAPI, Express, Flask, Django
2. **Static Sites**: React, Vue, Angular, plain HTML
3. **Background Workers**: Node.js, Python, Go
4. **Databases**: PostgreSQL, Redis, MongoDB
5. **Custom**: User-defined templates

**Template Structure**:
```
templates/
├── fastapi/
│   ├── Dockerfile
│   ├── manifest.yml
│   ├── requirements.txt
│   └── src/
├── express/
│   ├── Dockerfile
│   ├── manifest.yml
│   ├── package.json
│   └── src/
└── static/
    ├── Dockerfile
    ├── manifest.yml
    └── src/
```

### Required Variables System
**Purpose**: Dynamic validation of environment variables

**Features**:
- **Service-specific variables**: Different services require different vars
- **Environment-specific variables**: Staging vs production requirements
- **Template-specific variables**: Each template defines its own requirements
- **Validation**: Real-time validation of provided variables
- **Documentation**: Auto-generated documentation of required variables

**Implementation**:
```typescript
export interface VariableRequirement {
  name: string;
  description: string;
  required: boolean;
  default?: string;
  pattern?: RegExp;
  sensitive: boolean;
}

export interface ServiceVariables {
  service: string;
  variables: VariableRequirement[];
}

export async function validateVariables(
  service: string,
  environment: string,
  provided: Record<string, string>
): Promise<ValidationResult>
```

## Demo Environment Specification

### Minimal Application Structure
```
demo/minimal-app/
├── copilot/
│   ├── .workspace
│   ├── addons/
│   ├── environments/
│   │   └── staging/
│   └── services/
│       ├── flowise/
│       │   ├── Dockerfile
│       │   ├── manifest.yml
│       │   └── src/
│       └── web/
│           ├── Dockerfile
│           ├── manifest.yml
│           └── src/
├── scripts/
│   ├── copilot-switch-app.sh
│   └── create-env-files.js
└── package.json
```

### Service Specifications

#### flowise Service
- **Framework**: FastAPI (Python)
- **Resources**: 0.25 vCPU, 0.5GB RAM
- **Health Check**: `/api/v1/ping`
- **Features**: Minimal API with health endpoint

#### web Service
- **Framework**: Static HTML + Nginx
- **Resources**: 0.25 vCPU, 0.5GB RAM
- **Health Check**: `/healthcheck`
- **Features**: Static page with health endpoint

### Resource Constraints
- **CPU**: 0.25 vCPU per service
- **Memory**: 0.5GB RAM per service
- **Storage**: No persistent storage
- **Network**: Minimal outbound traffic
- **Cost Target**: < $10/month for demo environment

## Build Configuration

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### Build Tool Configuration (tsup)
```typescript
export default defineConfig([
  {
    entry: {
      bin: "src/bin.ts",
      deploy: "src/deploy.ts",
      // ... other entries
    },
    format: ["esm"],
    outDir: "dist/esm",
    target: "node20",
    sourcemap: true,
    dts: true,
    clean: true,
    banner: {
      js: (name) => name === "bin" ? "#!/usr/bin/env node" : ""
    }
  },
  {
    entry: { deploy: "src/deploy.ts" },
    format: ["cjs"],
    outDir: "dist/cjs",
    target: "node20",
    sourcemap: true,
    clean: false
  }
]);
```

## Package Configuration

### package.json Structure
```json
{
  "name": "@your-scope/copilot-auto",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "copilot-auto": "./dist/esm/bin.js"
  },
  "exports": {
    ".": {
      "import": "./dist/esm/deploy.js",
      "require": "./dist/cjs/deploy.cjs",
      "types": "./dist/esm/deploy.d.ts"
    }
  },
  "engines": {
    "node": ">=20.0.0"
  },
  "dependencies": {
    "commander": "^12.1.0",
    "execa": "^9.3.0",
    "prompts": "^2.4.2"
  }
}
```

## CI/CD Pipeline Specification

### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm coverage

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  demo-deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm demo:deploy
      - run: pnpm demo:test
      - run: pnpm demo:cleanup

  publish:
    runs-on: ubuntu-latest
    needs: [test, build, demo-deploy]
    if: github.event_name == 'release'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Security Considerations

### Input Validation
- All user inputs validated before use
- Subdomain validation prevents injection attacks
- Environment validation restricts to allowed values

### Secret Management
- No secrets logged to console
- Environment variables handled securely
- AWS credentials not exposed in output

### Command Injection Prevention
- Commands built with proper argument arrays
- No shell command interpolation
- Input sanitization for all parameters

## Performance Requirements

### Startup Time
- **Target**: < 2 seconds
- **Measurement**: Time from command execution to first output

### Memory Usage
- **Target**: < 100MB peak
- **Measurement**: RSS memory usage during execution

### Build Time
- **Target**: < 30 seconds
- **Measurement**: Full TypeScript compilation and bundling

## Error Handling Strategy

### Error Categories
1. **User Errors**: Invalid input, missing requirements
2. **System Errors**: AWS API failures, network issues
3. **Configuration Errors**: Missing files, invalid settings
4. **Execution Errors**: Command failures, timeouts

### Error Recovery
- Graceful degradation where possible
- Clear error messages with actionable steps
- Proper cleanup on failure
- Exit codes for automation

### Logging Strategy
- Structured error messages
- Debug mode for verbose output
- No sensitive information in logs
- Consistent error formatting

## Cross-Platform Compatibility

### Supported Platforms
- **Linux**: Ubuntu 20.04+, CentOS 8+
- **macOS**: 11.0+
- **Windows**: 10+ (with WSL or Git Bash)

### Platform-Specific Considerations
- **Windows**: Bash dependency, path separators
- **macOS**: Homebrew vs system tools
- **Linux**: Package manager differences

### Compatibility Testing
- Automated testing on multiple platforms
- CI/CD pipeline with matrix builds
- Manual testing on target platforms

## Developer Experience & Documentation

### Interactive Setup Wizard
**Purpose**: Guide users through initial configuration

**Features**:
- **Project discovery**: Auto-detect existing copilot projects
- **Service detection**: Scan and identify existing services
- **Template selection**: Choose appropriate templates for services
- **Variable configuration**: Interactive setup of required variables
- **Validation**: Real-time validation of configuration

**Implementation**:
```typescript
export interface SetupWizard {
  discoverProject(): Promise<ProjectInfo>;
  selectServices(available: ServiceInfo[]): Promise<string[]>;
  configureTemplates(services: string[]): Promise<TemplateConfig[]>;
  setupVariables(requirements: VariableRequirement[]): Promise<Record<string, string>>;
  generateConfig(): Promise<Configuration>;
}
```

### Auto-Completion System
**Purpose**: Provide shell completion for CLI commands

**Supported Shells**:
- **Bash**: Traditional completion
- **Zsh**: Advanced completion with descriptions
- **Fish**: Native fish completion

**Implementation**:
```bash
# Generate completion scripts
copilot-auto completion bash > ~/.local/share/bash-completion/completions/copilot-auto
copilot-auto completion zsh > ~/.zsh/completions/_copilot-auto
copilot-auto completion fish > ~/.config/fish/completions/copilot-auto.fish
```

### IDE Integration
**Purpose**: Provide IntelliSense and tooling support

**Features**:
- **VS Code Extension**: Syntax highlighting, IntelliSense, snippets
- **Configuration validation**: Real-time validation of config files
- **Template snippets**: Quick insertion of common patterns
- **Debugging support**: Integrated debugging for deployment issues

### Documentation System
**Purpose**: Comprehensive, developer-friendly documentation

**Documentation Structure**:
```
docs/
├── getting-started/
│   ├── installation.md
│   ├── quick-start.md
│   └── first-deployment.md
├── guides/
│   ├── configuration.md
│   ├── templates.md
│   ├── variables.md
│   └── troubleshooting.md
├── reference/
│   ├── cli.md
│   ├── config-schema.md
│   ├── templates.md
│   └── api.md
├── examples/
│   ├── basic-web-app.md
│   ├── full-stack-app.md
│   ├── microservices.md
│   └── ci-cd-integration.md
└── contributing/
    ├── development-setup.md
    ├── testing.md
    ├── architecture.md
    └── contributing.md
```

**Documentation Features**:
- **Interactive examples**: Copy-paste ready code snippets
- **Configuration examples**: Real-world configuration files
- **Troubleshooting guides**: Common issues and solutions
- **Video tutorials**: Screen recordings for complex workflows
- **API reference**: Complete TypeScript API documentation

## Future Enhancements

### Potential Features
1. **Plugin System**: Custom deployment hooks
2. **Advanced Configuration**: Multi-environment configs
3. **Monitoring Integration**: CloudWatch metrics
4. **Rollback Support**: Automatic rollback on failure
5. **Multi-Environment**: Parallel deployments
6. **Visual Dashboard**: Web-based deployment management
7. **Team Collaboration**: Shared configurations and templates

### Scalability Considerations
- Modular architecture supports feature additions
- Plugin system for extensibility
- Configuration-driven behavior
- API-first design for programmatic use

---

This technical specification provides the foundation for implementing a robust, maintainable, and scalable copilot-auto deployment package.
