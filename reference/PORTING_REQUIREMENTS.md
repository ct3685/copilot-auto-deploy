# Porting Requirements: Original Scripts to TypeScript NPM Package

## Overview

This document outlines the specific requirements for porting the existing bash and Node.js scripts to the new TypeScript ESM npm package. The goal is to maintain 100% functional compatibility while modernizing the implementation.

## Original Scripts Analysis

### 1. copilot-auto-deploy.sh (342 lines)
**Purpose**: Main deployment orchestration script

**Key Components to Port**:
- **Color constants and UI functions** → `printers.ts`
- **AWS verification logic** → `aws.ts`
- **8-phase deployment workflow** → `deploy.ts`
- **Signal handling** → `bin.ts`
- **Input validation** → `utils.ts`
- **Command execution** → `exec.ts`

**Critical Features**:
- AWS SSO token expiry detection (3 patterns)
- Interactive prompts with timeouts
- Domain validation and processing
- Environment variable management
- Service selection with 15-second default
- Health check URL generation

### 2. copilot-switch-app.sh (70 lines)
**Purpose**: Domain switching and app name generation

**Key Components to Port**:
- **Domain validation** → `domain-switch.ts`
- **App name generation logic** → `domain-switch.ts`
- **Workspace file creation** → `domain-switch.ts`

**Critical Features**:
- Protocol validation (no HTTP/HTTPS)
- Special handling for "aai" domain
- Domain to app name conversion
- Workspace file generation

### 3. create-env-files.js (1024 lines)
**Purpose**: Environment file creation and validation

**Key Components to Port**:
- **Configuration validation** → `env-files.ts`
- **Template processing** → `env-files.ts`
- **Variable validation** → `env-files.ts`
- **Interactive prompts** → `env-files.ts`

**Critical Features**:
- Comprehensive variable validation
- Template-based file generation
- Auto-template creation
- Interactive and non-interactive modes
- Configuration validation rules

## Porting Specifications

### 1. printers.ts - UI Components
**Source**: copilot-auto-deploy.sh (lines 1-80)

**Requirements**:
```typescript
// Color constants (exact ANSI codes)
export const C = {
  RED: '\033[0;31m',
  GREEN: '\033[0;32m',
  YELLOW: '\033[1;33m',
  BLUE: '\033[0;34m',
  PURPLE: '\033[0;35m',
  CYAN: '\033[0;36m',
  WHITE: '\033[1;37m',
  NC: '\033[0m',
  BOLD: '\033[1m'
} as const;

// UI functions (exact output formatting)
export function header(text: string): void
export function phase(number: string, title: string): void
export function step(message: string): void
export function success(message: string): void
export function error(message: string): void
export function warn(message: string): void
export function info(message: string): void
export function deploymentSuccess(service: string, url?: string): void
```

**Validation**: Output must match bash script exactly

### 2. aws.ts - AWS Verification
**Source**: copilot-auto-deploy.sh (lines 82-130)

**Requirements**:
```typescript
export async function verifyAwsAccount(
  confirmFn: (msg: string) => Promise<boolean>
): Promise<AwsVerificationResult>

// Token expiry patterns (exact matches)
const EXPIRED_PATTERNS = [
  "Token has expired and refresh failed",
  "ExpiredToken",
  "The security token included in the request is expired"
];

// Environment variable display
- AWS_SESSION_EXPIRATION
- AWS_PROFILE
- AWS_REGION
- AWS_DEFAULT_REGION
```

**Validation**: Must handle all 3 expiry patterns and provide same error messages

### 3. domain-switch.ts - Domain Switching
**Source**: copilot-switch-app.sh (entire file)

**Requirements**:
```typescript
export function generateAppName(domain: string): string {
  // Handle special cases
  if (domain === "aai" || domain === "aai.theanswer.ai") {
    return "aai";
  }
  
  // Strip .theanswer.ai suffix, replace periods with hyphens
  let processed = domain.replace(/\.theanswer\.ai$/, '').replace(/\./g, '-');
  
  // Remove leading dashes
  processed = processed.replace(/^-*/, '');
  
  // Handle empty result
  if (!processed) return "aai";
  
  // Check for -aai suffix
  if (processed.endsWith('-aai')) {
    return processed;
  }
  
  return `${processed}-aai`;
}

export async function switchAppContext(clientDomain: string): Promise<DomainSwitchResult>
```

**Validation**: Must generate identical app names for all test cases

### 4. env-files.ts - Environment File Creation
**Source**: create-env-files.js (entire file)

**Requirements**:
```typescript
// Configuration validation (exact rules)
const CONFIGURATION_VALIDATION_VARS = {
  AUTH0_JWKS_URI: ['flowise', 'web'],
  AUTH0_ISSUER_BASE_URL: ['flowise', 'web'],
  AUTH0_BASE_URL: ['flowise', 'web'],
  AUTH0_AUDIENCE: ['flowise', 'web'],
  AUTH0_SCOPE: ['flowise', 'web'],
  AUTH0_TOKEN_SIGN_ALG: ['flowise', 'web'],
  AUTH0_DOMAIN: ['flowise', 'web'],
  AUTH0_ORGANIZATION_ID: ['flowise', 'web'],
  AUTH0_CLIENT_ID: ['flowise', 'web'],
  AUTH0_CLIENT_SECRET: ['flowise', 'web'],
  AAI_DEFAULT_OPENAI_API_KEY: ['flowise']
};

// Fixed defaults (exact values)
const FIXED_DEFAULTS = {
  APIKEY_PATH: '/var/efs/',
  SECRETKEY_PATH: '/var/efs/',
  LOG_PATH: '/var/efs/logs',
  DISABLE_FLOWISE_TELEMETRY: 'true',
  IFRAME_ORIGINS: '*',
  CORS_ORIGINS: '*',
  APIKEY_STORAGE_TYPE: 'db',
  AUTH0_SCOPE: '"openid profile email"',
  AUTH0_TOKEN_SIGN_ALG: 'RS256'
};
```

**Validation**: Must generate identical environment files

### 5. deploy.ts - Main Workflow
**Source**: copilot-auto-deploy.sh (lines 132-342)

**Requirements**:
```typescript
// 8 phases (exact order and content)
enum DeploymentPhase {
  PREREQUISITES = "1",
  DOMAIN_SELECTION = "2", 
  ENVIRONMENT_SELECTION = "3",
  APPLICATION_SETUP = "4",
  COPILOT_APPLICATION = "5",
  ENVIRONMENT_MANAGEMENT = "6",
  SERVICE_SELECTION = "7",
  SERVICE_DEPLOYMENT = "8"
}

// Service selection with 15-second timeout
export async function selectServices(
  timeout: number = 15000,
  defaultChoice: string = "1"
): Promise<string[]>

// Health check URL generation
export function getHealthCheckUrl(service: string, clientDomain: string): string {
  switch (service) {
    case "flowise":
      return `https://api.${clientDomain}/api/v1/ping`;
    case "web":
      return `https://${clientDomain}/healthcheck`;
    default:
      return "";
  }
}
```

**Validation**: Must follow exact same workflow and timing

## Service Templates

### 1. flowise Service Template
**Source**: OriginalScripts/copilot/flowise/manifest.yml

**Requirements**:
- Load Balanced Web Service configuration
- S3 storage integration
- Redis caching setup
- PostgreSQL database connection
- Auth0 integration
- Lacework sidecar configuration
- EFS volume mounting
- Health check endpoint

### 2. web Service Template
**Source**: OriginalScripts/copilot/web/manifest.yml

**Requirements**:
- Load Balanced Web Service configuration
- Static file serving
- Auth0 integration
- Environment variable injection
- Health check endpoint

## Environment Variables

### Required Variables (from create-env-files.js)
```typescript
// Auth0 Variables (required for both services)
AUTH0_JWKS_URI: string
AUTH0_ISSUER_BASE_URL: string
AUTH0_BASE_URL: string
AUTH0_AUDIENCE: string
AUTH0_SCOPE: string
AUTH0_TOKEN_SIGN_ALG: string
AUTH0_DOMAIN: string
AUTH0_ORGANIZATION_ID: string
AUTH0_CLIENT_ID: string
AUTH0_CLIENT_SECRET: string

// Flowise-specific variables
AAI_DEFAULT_OPENAI_API_KEY: string

// Optional services
FLAGSMITH_ENVIRONMENT_ID?: string
LANGFUSE_SECRET_KEY?: string
LANGFUSE_PUBLIC_KEY?: string
LANGFUSE_HOST?: string
```

## Testing Requirements

### 1. Unit Tests
- **AWS verification**: Test all 3 expiry patterns
- **Domain switching**: Test all app name generation cases
- **Environment files**: Test template processing and validation
- **Service selection**: Test timeout and default behavior

### 2. Integration Tests
- **Complete workflow**: End-to-end deployment simulation
- **Error scenarios**: AWS failures, validation errors
- **Service deployment**: Flowise and web service deployment

### 3. Compatibility Tests
- **Output comparison**: Verify identical output to original scripts
- **File generation**: Verify identical environment files
- **App name generation**: Verify identical app names

## Migration Strategy

### Phase 1: Core Porting
1. Port printers.ts (UI components)
2. Port aws.ts (AWS verification)
3. Port domain-switch.ts (domain switching)
4. Port env-files.ts (environment files)

### Phase 2: Workflow Integration
1. Port deploy.ts (main workflow)
2. Integrate all modules
3. Add CLI interface

### Phase 3: Testing & Validation
1. Unit tests for all modules
2. Integration tests for complete workflow
3. Compatibility tests against original scripts

### Phase 4: Enhancement
1. Add configuration system
2. Add template system
3. Add documentation

## Success Criteria

### Functional Compatibility
- [ ] All original script functionality preserved
- [ ] Identical output formatting
- [ ] Identical file generation
- [ ] Identical error handling

### Performance Requirements
- [ ] Startup time < 2 seconds
- [ ] Memory usage < 100MB
- [ ] Build time < 30 seconds

### Quality Requirements
- [ ] Test coverage ≥ 90%
- [ ] Zero critical vulnerabilities
- [ ] TypeScript strict mode compliance
- [ ] ESLint zero errors

### Documentation Requirements
- [ ] Port existing documentation
- [ ] Add API documentation
- [ ] Add usage examples
- [ ] Add troubleshooting guide

This porting specification ensures that the new TypeScript package maintains 100% compatibility with the existing bash and Node.js scripts while providing a modern, maintainable, and testable implementation.
