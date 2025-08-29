# Templates & Configuration System Specification

## Overview

The copilot-auto package will include a comprehensive template and configuration system designed to make deployment setup as developer-friendly as possible. This system provides:

- **Dynamic service detection** from existing copilot folders
- **Pre-built templates** for common service types
- **Configuration validation** with real-time feedback
- **Required variables system** with automatic validation
- **Interactive setup wizard** for guided configuration

## Configuration File System

### File Formats
The system supports both YAML and JSON configuration formats:

**YAML (Recommended)**:
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

**JSON Alternative**:
```json
{
  "version": "1.0",
  "project": {
    "name": "my-copilot-project",
    "domain": "example.com"
  },
  "environments": {
    "staging": {
      "subdomain": "staging",
      "services": ["web", "api"],
      "required_vars": ["DATABASE_URL", "API_KEY"]
    }
  },
  "services": {
    "web": {
      "template": "static",
      "health_check": "/health",
      "resources": {
        "cpu": 0.25,
        "memory": 0.5
      }
    }
  }
}
```

### Configuration Schema
```typescript
interface Configuration {
  version: string;
  project: ProjectConfig;
  environments: Record<string, EnvironmentConfig>;
  services: Record<string, ServiceConfig>;
  hooks?: DeploymentHooks;
  templates?: Record<string, TemplateConfig>;
}

interface ProjectConfig {
  name: string;
  domain: string;
  description?: string;
}

interface EnvironmentConfig {
  subdomain: string;
  services: string[];
  required_vars: string[];
  resources?: ResourceConfig;
  variables?: Record<string, string>;
}

interface ServiceConfig {
  template: string;
  health_check?: string;
  resources?: ResourceConfig;
  variables?: Record<string, string>;
  custom?: Record<string, unknown>;
}

interface ResourceConfig {
  cpu: number;
  memory: number;
  storage?: number;
}

interface DeploymentHooks {
  pre_deploy?: string[];
  post_deploy?: string[];
  pre_rollback?: string[];
  post_rollback?: string[];
}
```

## Dynamic Service Detection

### Service Discovery
The system automatically scans the copilot folder structure to discover existing services:

```typescript
interface ServiceDiscovery {
  services: ServiceInfo[];
  environments: EnvironmentInfo[];
  requiredVars: string[];
  templates: TemplateInfo[];
}

interface ServiceInfo {
  name: string;
  path: string;
  type: 'web' | 'worker' | 'static' | 'api' | 'custom';
  framework?: string;
  language?: string;
  manifest?: Record<string, unknown>;
}

interface EnvironmentInfo {
  name: string;
  path: string;
  config: Record<string, unknown>;
}
```

### Discovery Process
1. **Scan copilot/services/** - Identify all service directories
2. **Parse manifest.yml** - Extract service configuration
3. **Detect framework** - Analyze Dockerfile and source code
4. **Identify dependencies** - Find required environment variables
5. **Suggest templates** - Recommend appropriate templates

### Implementation
```typescript
export async function discoverServices(
  copilotPath: string = './copilot'
): Promise<ServiceDiscovery> {
  const services = await scanServiceDirectories(copilotPath);
  const environments = await scanEnvironmentDirectories(copilotPath);
  const requiredVars = await extractRequiredVariables(services);
  const templates = await suggestTemplates(services);
  
  return { services, environments, requiredVars, templates };
}

export async function validateConfiguration(
  config: Configuration,
  discovery: ServiceDiscovery
): Promise<ValidationResult> {
  // Validate service references
  // Check template compatibility
  // Verify environment variables
  // Validate resource constraints
}
```

## Template System

### Pre-built Templates
The system includes templates for common service types:

#### Web Service Templates
1. **FastAPI (Python)**
   - Health check endpoint
   - CORS configuration
   - Environment variable handling
   - Minimal resource requirements

2. **Express (Node.js)**
   - REST API structure
   - Middleware setup
   - Error handling
   - Health check endpoint

3. **Flask (Python)**
   - Simple web application
   - Blueprint structure
   - Configuration management
   - Health check endpoint

#### Static Site Templates
1. **React**
   - Build process
   - Static file serving
   - Environment variable injection
   - Health check page

2. **Vue.js**
   - Build configuration
   - Static deployment
   - Environment setup
   - Health check endpoint

3. **Plain HTML/CSS/JS**
   - Simple static site
   - Basic structure
   - Health check page

#### Background Worker Templates
1. **Node.js Worker**
   - Message queue processing
   - Error handling
   - Graceful shutdown
   - Health check endpoint

2. **Python Worker**
   - Background task processing
   - Logging configuration
   - Error handling
   - Health monitoring

### Template Structure
```
templates/
├── fastapi/
│   ├── Dockerfile
│   ├── manifest.yml
│   ├── requirements.txt
│   ├── src/
│   │   ├── main.py
│   │   ├── health.py
│   │   └── config.py
│   └── template.json
├── express/
│   ├── Dockerfile
│   ├── manifest.yml
│   ├── package.json
│   ├── src/
│   │   ├── app.js
│   │   ├── health.js
│   │   └── config.js
│   └── template.json
└── static/
    ├── Dockerfile
    ├── manifest.yml
    ├── nginx.conf
    ├── src/
    │   ├── index.html
    │   ├── health.html
    │   └── assets/
    └── template.json
```

### Template Metadata
Each template includes metadata for validation and documentation:

```json
{
  "name": "fastapi",
  "description": "FastAPI web service template",
  "version": "1.0.0",
  "language": "python",
  "framework": "fastapi",
  "type": "web",
  "resources": {
    "min_cpu": 0.25,
    "min_memory": 0.5,
    "recommended_cpu": 0.5,
    "recommended_memory": 1.0
  },
  "required_vars": [
    {
      "name": "DATABASE_URL",
      "description": "Database connection string",
      "required": true,
      "sensitive": true
    },
    {
      "name": "API_KEY",
      "description": "External API key",
      "required": false,
      "sensitive": true
    }
  ],
  "optional_vars": [
    {
      "name": "DEBUG",
      "description": "Enable debug mode",
      "default": "false",
      "type": "boolean"
    }
  ],
  "health_check": {
    "endpoint": "/api/v1/ping",
    "method": "GET",
    "expected_status": 200
  }
}
```

## Required Variables System

### Variable Definition
The system provides comprehensive variable management:

```typescript
interface VariableRequirement {
  name: string;
  description: string;
  required: boolean;
  default?: string;
  pattern?: RegExp;
  sensitive: boolean;
  type: 'string' | 'number' | 'boolean' | 'url' | 'email';
  validation?: ValidationRule[];
}

interface ValidationRule {
  type: 'required' | 'pattern' | 'min_length' | 'max_length' | 'custom';
  value: unknown;
  message: string;
}
```

### Variable Sources
Variables can be defined at multiple levels:

1. **Template Level** - Base requirements for the template
2. **Service Level** - Service-specific variables
3. **Environment Level** - Environment-specific variables
4. **Project Level** - Global project variables

### Variable Validation
```typescript
export async function validateVariables(
  service: string,
  environment: string,
  provided: Record<string, string>,
  config: Configuration
): Promise<ValidationResult> {
  const requirements = await getVariableRequirements(service, environment, config);
  const results: ValidationResult[] = [];
  
  for (const req of requirements) {
    const value = provided[req.name];
    const result = await validateVariable(req, value);
    results.push(result);
  }
  
  return {
    valid: results.every(r => r.valid),
    errors: results.filter(r => !r.valid),
    warnings: results.filter(r => r.warning)
  };
}
```

### Variable Documentation
The system auto-generates documentation for required variables:

```markdown
# Required Environment Variables

## Service: api
- **DATABASE_URL** (required, sensitive): Database connection string
- **API_KEY** (optional, sensitive): External API key for third-party services

## Service: web
- **API_BASE_URL** (required): Base URL for API service
- **DEBUG** (optional): Enable debug mode (default: false)

## Environment: production
- **LOG_LEVEL** (required): Logging level (debug, info, warn, error)
- **METRICS_ENABLED** (optional): Enable metrics collection (default: true)
```

## Interactive Setup Wizard

### Wizard Flow
The setup wizard guides users through configuration:

1. **Project Discovery**
   - Scan existing copilot project
   - Detect services and environments
   - Identify current configuration

2. **Service Configuration**
   - Select services to deploy
   - Choose appropriate templates
   - Configure service-specific settings

3. **Environment Setup**
   - Define environment configurations
   - Set up environment variables
   - Configure resource requirements

4. **Variable Configuration**
   - Interactive variable input
   - Real-time validation
   - Secure input for sensitive data

5. **Configuration Generation**
   - Generate configuration files
   - Create template files
   - Set up deployment hooks

### Implementation
```typescript
export class SetupWizard {
  async run(): Promise<Configuration> {
    const project = await this.discoverProject();
    const services = await this.selectServices(project.services);
    const templates = await this.configureTemplates(services);
    const variables = await this.setupVariables(templates);
    const hooks = await this.configureHooks();
    
    return this.generateConfig({
      project,
      services,
      templates,
      variables,
      hooks
    });
  }
  
  private async discoverProject(): Promise<ProjectInfo> {
    // Auto-detect existing project structure
  }
  
  private async selectServices(available: ServiceInfo[]): Promise<string[]> {
    // Interactive service selection
  }
  
  private async configureTemplates(services: string[]): Promise<TemplateConfig[]> {
    // Template selection and configuration
  }
  
  private async setupVariables(requirements: VariableRequirement[]): Promise<Record<string, string>> {
    // Interactive variable input with validation
  }
}
```

## Configuration Validation

### Real-time Validation
The system provides immediate feedback on configuration:

```typescript
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
  severity: 'error' | 'warning';
}
```

### Validation Rules
1. **Schema Validation** - JSON Schema compliance
2. **Service Validation** - Service existence and compatibility
3. **Template Validation** - Template availability and requirements
4. **Variable Validation** - Required variables and formats
5. **Resource Validation** - Resource constraints and limits
6. **Dependency Validation** - Service dependencies and order

### Validation Implementation
```typescript
export class ConfigurationValidator {
  async validate(config: Configuration): Promise<ValidationResult> {
    const results: ValidationResult[] = [];
    
    results.push(await this.validateSchema(config));
    results.push(await this.validateServices(config));
    results.push(await this.validateTemplates(config));
    results.push(await this.validateVariables(config));
    results.push(await this.validateResources(config));
    
    return this.mergeResults(results);
  }
  
  private async validateSchema(config: Configuration): Promise<ValidationResult> {
    // JSON Schema validation
  }
  
  private async validateServices(config: Configuration): Promise<ValidationResult> {
    // Service existence and compatibility
  }
  
  private async validateTemplates(config: Configuration): Promise<ValidationResult> {
    // Template availability and requirements
  }
}
```

## Developer Experience Features

### Auto-completion
Shell completion for configuration files and CLI commands:

```bash
# Generate completion scripts
copilot-auto completion bash > ~/.local/share/bash-completion/completions/copilot-auto
copilot-auto completion zsh > ~/.zsh/completions/_copilot-auto
copilot-auto completion fish > ~/.config/fish/completions/copilot-auto.fish
```

### IDE Integration
VS Code extension for enhanced development experience:

- **Syntax highlighting** for configuration files
- **IntelliSense** for configuration schema
- **Validation** with real-time error reporting
- **Snippets** for common configuration patterns
- **Debugging** support for deployment issues

### Documentation Generation
Auto-generated documentation from configuration:

```typescript
export class DocumentationGenerator {
  async generateDocs(config: Configuration): Promise<Documentation> {
    return {
      readme: await this.generateReadme(config),
      deployment: await this.generateDeploymentGuide(config),
      variables: await this.generateVariableDocs(config),
      troubleshooting: await this.generateTroubleshootingGuide(config)
    };
  }
}
```

## Usage Examples

### Basic Configuration
```bash
# Initialize configuration
copilot-auto init

# Interactive setup
copilot-auto setup

# Validate configuration
copilot-auto validate

# Deploy with configuration
copilot-auto deploy --config copilot-auto.yaml
```

### Advanced Configuration
```bash
# Generate configuration from existing project
copilot-auto discover --output config.yaml

# Validate and fix configuration
copilot-auto validate --fix

# Generate documentation
copilot-auto docs --output docs/

# Create new service with template
copilot-auto create-service api --template fastapi
```

This comprehensive template and configuration system ensures that developers can quickly and easily set up deployments while maintaining flexibility and validation throughout the process.
