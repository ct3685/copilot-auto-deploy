# Configuration Management: Making Copilot Deployments Easier

## Overview

The copilot-auto npm package is designed to make AWS Copilot deployments easier for developers through intelligent configuration management. Built with **AAI as the premier template** and **universal capabilities** for broader adoption. The goal is to reduce the cognitive load of deployment setup while maintaining flexibility and power through a comprehensive template system.

## Configuration Philosophy

### AAI-First, Universal-Capable Approach
- **AAI Default**: Zero-config setup for AAI projects with branded experience
- **Universal Options**: Extensible for any domain and service type
- **Template System**: Comprehensive template inheritance and customization
- **Configuration-First**: Use configuration files for automation and consistency
- **Interactive Fallback**: Guided setup wizard for initial configuration

### Developer Experience Goals
- **Zero-config startup**: Sensible defaults for common scenarios
- **Progressive disclosure**: Start simple, add complexity as needed
- **Validation**: Real-time feedback on configuration issues
- **Documentation**: Inline help and examples

## Configuration File Structure

### Location
**Default**: `copilot/copilot-auto.json`
**Custom**: `--config <path>` flag

### Schema
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
      "autoConfirm": false,
      "resources": {
        "cpu": 0.25,
        "memory": 0.5
      }
    },
    "production": {
      "subdomain": "client",
      "services": ["flowise", "web"],
      "autoConfirm": true,
      "resources": {
        "cpu": 0.5,
        "memory": 1.0
      }
    }
  },
  "services": {
    "flowise": {
      "template": "flowise",
      "healthCheck": "/api/v1/ping",
      "resources": {
        "cpu": 0.5,
        "memory": 1.0
      },
      "variables": {
        "required": ["AUTH0_CLIENT_ID", "AUTH0_CLIENT_SECRET"],
        "optional": ["DEBUG", "LOG_LEVEL"]
      }
    },
    "web": {
      "template": "web",
      "healthCheck": "/healthcheck",
      "resources": {
        "cpu": 0.25,
        "memory": 0.5
      },
      "variables": {
        "required": ["AUTH0_BASE_URL"],
        "optional": ["NEXT_PUBLIC_API_URL"]
      }
    }
  },
  "aws": {
    "profile": "default",
    "region": "us-east-1",
    "autoConfirm": false
  },
  "variables": {
    "global": {
      "required": ["AUTH0_DOMAIN", "AUTH0_AUDIENCE"],
      "optional": ["DEBUG", "LOG_LEVEL"]
    },
    "templates": {
      "auth0": {
        "AUTH0_SCOPE": '"openid profile email"',
        "AUTH0_TOKEN_SIGN_ALG": "RS256"
      }
    }
  },
  "hooks": {
    "preDeploy": ["npm run build", "npm run test"],
    "postDeploy": ["npm run health-check"]
  }
}
```

## Configuration Discovery

### File Discovery Order
1. `--config <path>` (explicit path)
2. `copilot/copilot-auto.json` (default location)
3. `copilot-auto.json` (project root)
4. `.copilot-auto.json` (hidden file)

### Auto-Discovery Features
- **Project detection**: Auto-detect existing copilot project
- **Service detection**: Scan copilot/services/ for existing services
- **Environment detection**: Scan copilot/environments/ for existing environments
- **Template detection**: Auto-suggest appropriate templates

## Interactive Setup Wizard

### When to Run
- **No config file exists**
- **--setup flag is provided**
- **Config file is invalid or incomplete**

### Wizard Flow
```typescript
interface SetupWizard {
  // 1. Project Discovery
  discoverProject(): Promise<ProjectInfo>;
  
  // 2. Environment Configuration
  configureEnvironments(): Promise<EnvironmentConfig[]>;
  
  // 3. Service Selection
  selectServices(): Promise<string[]>;
  
  // 4. Variable Configuration
  configureVariables(): Promise<VariableConfig>;
  
  // 5. AWS Configuration
  configureAws(): Promise<AwsConfig>;
  
  // 6. Configuration Generation
  generateConfig(): Promise<CopilotAutoConfig>;
}
```

### Example Wizard Session
```bash
$ copilot-auto --setup

🔍 Discovering project...
✅ Found existing copilot project: my-app

📋 Environment Configuration
Which environments do you want to configure?
❯ staging
  production
  both

🌐 Domain Configuration
Enter your client domain (e.g., acme.theanswer.ai): acme.theanswer.ai
Staging subdomain will be: staging.acme.theanswer.ai

🚀 Service Selection
Which services do you want to deploy?
❯ flowise and web
  flowise only
  web only

🔐 Variable Configuration
Required variables for your services:
- AUTH0_CLIENT_ID: [Enter value]
- AUTH0_CLIENT_SECRET: [Enter value]

☁️ AWS Configuration
AWS Profile (default): default
AWS Region (us-east-1): us-east-1

✅ Configuration saved to: copilot/copilot-auto.json
```

## Configuration Validation

### Validation Rules
```typescript
interface ValidationRule {
  field: string;
  required: boolean;
  type: 'string' | 'array' | 'object' | 'boolean';
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  enum?: string[];
  custom?: (value: any) => boolean;
  message: string;
}

const validationRules: ValidationRule[] = [
  {
    field: 'project.name',
    required: true,
    type: 'string',
    pattern: /^[a-z0-9-]+$/,
    message: 'Project name must contain only lowercase letters, numbers, and hyphens'
  },
  {
    field: 'environments',
    required: true,
    type: 'object',
    message: 'At least one environment must be configured'
  }
];
```

### Validation Features
- **Schema validation**: JSON Schema compliance
- **Business logic validation**: Custom validation rules
- **Cross-reference validation**: Service references, variable dependencies
- **Real-time feedback**: Immediate validation during setup

## Environment-Specific Configuration

### Environment Inheritance
```json
{
  "environments": {
    "staging": {
      "subdomain": "staging.client",
      "autoConfirm": false,
      "resources": {
        "cpu": 0.25,
        "memory": 0.5
      }
    },
    "production": {
      "subdomain": "client",
      "autoConfirm": true,
      "resources": {
        "cpu": 0.5,
        "memory": 1.0
      }
    }
  }
}
```

### Environment Overrides
- **Resource scaling**: Different CPU/memory for staging vs production
- **Auto-confirmation**: Require confirmation for staging, auto-confirm for production
- **Service selection**: Deploy all services to production, selective for staging

## Service Templates

### Built-in Templates
```json
{
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
  }
}
```

### Template Features
- **Pre-configured manifests**: Ready-to-use copilot manifest files
- **Resource defaults**: Sensible defaults for each service type
- **Health checks**: Pre-configured health check endpoints
- **Variable requirements**: Required and optional variables per template

## Variable Management

### Variable Sources
1. **Global variables**: Applied to all services
2. **Service-specific variables**: Applied to specific services
3. **Environment variables**: Applied to specific environments
4. **Template variables**: Default values from templates

### Variable Validation
```typescript
interface VariableRequirement {
  name: string;
  description: string;
  required: boolean;
  sensitive: boolean;
  pattern?: RegExp;
  default?: string;
}

const variableRequirements: Record<string, VariableRequirement[]> = {
  flowise: [
    {
      name: "AUTH0_CLIENT_ID",
      description: "Auth0 Client ID for authentication",
      required: true,
      sensitive: true
    },
    {
      name: "DEBUG",
      description: "Enable debug mode",
      required: false,
      sensitive: false,
      default: "false"
    }
  ]
};
```

## Usage Examples

### Basic Usage (No Config)
```bash
# First time - runs setup wizard
copilot-auto deploy

# Uses interactive prompts for missing values
```

### With Configuration
```bash
# Use default config file
copilot-auto deploy --env staging

# Use custom config file
copilot-auto deploy --config my-config.json --env production

# Non-interactive mode (uses config values)
copilot-auto deploy --env production --non-interactive
```

### Configuration Management
```bash
# Initialize new configuration
copilot-auto --init

# Run setup wizard
copilot-auto --setup

# Validate configuration
copilot-auto --validate

# Generate configuration from existing project
copilot-auto --discover
```

## Best Practices

### Configuration Organization
- **Keep configs in copilot/**: Maintains project organization
- **Use environment-specific settings**: Different configs for staging/production
- **Version your configs**: Include version field for future compatibility
- **Document customizations**: Add comments for team members

### Security Considerations
- **Don't commit secrets**: Use environment variables for sensitive data
- **Use AWS profiles**: Leverage AWS credential management
- **Validate inputs**: Prevent injection attacks through validation
- **Audit configurations**: Regular review of configuration files

### Team Collaboration
- **Shared templates**: Common service templates for consistency
- **Configuration examples**: Provide examples for different scenarios
- **Documentation**: Inline documentation for configuration options
- **Validation**: Automated validation in CI/CD pipelines

## Migration from Original Scripts

### Automatic Migration
```bash
# Migrate existing project
copilot-auto --migrate

# This will:
# 1. Scan existing copilot/ directory
# 2. Detect services and environments
# 3. Generate configuration file
# 4. Preserve existing settings
```

### Manual Migration
1. **Run setup wizard**: `copilot-auto --setup`
2. **Configure environments**: Set up staging and production
3. **Configure services**: Select and configure services
4. **Set variables**: Configure required environment variables
5. **Test deployment**: Verify configuration works correctly

This configuration management approach ensures that developers can quickly and easily set up Copilot deployments while maintaining the flexibility and power needed for complex scenarios.
