export interface TemplateInfo {
  name: string;
  type: "aai" | "generic" | "custom";
  description: string;
  services: Record<string, ServiceTemplate>;
  variables: VariableRequirement[];
  validation: ValidationRules;
  defaults: Record<string, any>;
}

export interface ServiceTemplate {
  name: string;
  type: string;
  manifest: string;
  resources: ResourceConfig;
  variables: VariableRequirement[];
  healthCheck: string;
}

export interface VariableRequirement {
  name: string;
  description: string;
  required: boolean;
  sensitive: boolean;
  pattern?: RegExp;
  default?: string;
}

export interface ValidationRules {
  domain?: RegExp;
  services?: string[];
  variables?: Record<string, RegExp>;
}

export interface ResourceConfig {
  cpu: number;
  memory: number;
  storage?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// AAI-specific templates
export const AAI_TEMPLATES: Record<string, TemplateInfo> = {
  flowise: {
    name: "flowise",
    type: "aai",
    description:
      "AAI Flowise service template with S3, Redis, and Auth0 integration",
    services: {
      flowise: {
        name: "flowise",
        type: "Load Balanced Web Service",
        manifest: "templates/aai/flowise/manifest.yml",
        resources: {
          cpu: 0.5,
          memory: 1.0,
        },
        variables: [
          {
            name: "AUTH0_CLIENT_ID",
            description: "Auth0 Client ID for authentication",
            required: true,
            sensitive: true,
          },
          {
            name: "AUTH0_CLIENT_SECRET",
            description: "Auth0 Client Secret for authentication",
            required: true,
            sensitive: true,
          },
          {
            name: "S3_STORAGE_BUCKET_NAME",
            description: "S3 bucket for file storage",
            required: true,
            sensitive: false,
          },
        ],
        healthCheck: "/api/v1/ping",
      },
    },
    variables: [
      {
        name: "AUTH0_DOMAIN",
        description: "Auth0 domain",
        required: true,
        sensitive: false,
      },
      {
        name: "AUTH0_AUDIENCE",
        description: "Auth0 audience",
        required: true,
        sensitive: false,
      },
    ],
    validation: {
      domain: /\.theanswer\.ai$/,
      services: ["flowise"],
      variables: {
        AUTH0_CLIENT_ID: /^[a-zA-Z0-9_-]+$/,
        S3_STORAGE_BUCKET_NAME: /^[a-z0-9-]+$/,
      },
    },
    defaults: {
      domain: "theanswer.ai",
      environment: "staging",
      region: "us-east-1",
    },
  },
  web: {
    name: "web",
    type: "aai",
    description: "AAI Web service template with Next.js and Auth0 integration",
    services: {
      web: {
        name: "web",
        type: "Load Balanced Web Service",
        manifest: "templates/aai/web/manifest.yml",
        resources: {
          cpu: 0.25,
          memory: 0.5,
        },
        variables: [
          {
            name: "AUTH0_BASE_URL",
            description: "Auth0 base URL",
            required: true,
            sensitive: false,
          },
          {
            name: "NEXT_PUBLIC_API_URL",
            description: "Public API URL",
            required: false,
            sensitive: false,
          },
        ],
        healthCheck: "/healthcheck",
      },
    },
    variables: [
      {
        name: "AUTH0_DOMAIN",
        description: "Auth0 domain",
        required: true,
        sensitive: false,
      },
      {
        name: "AUTH0_AUDIENCE",
        description: "Auth0 audience",
        required: true,
        sensitive: false,
      },
    ],
    validation: {
      domain: /\.theanswer\.ai$/,
      services: ["web"],
      variables: {
        AUTH0_BASE_URL: /^https?:\/\/.+$/,
      },
    },
    defaults: {
      domain: "theanswer.ai",
      environment: "staging",
      region: "us-east-1",
    },
  },
};

// Generic templates
export const GENERIC_TEMPLATES: Record<string, TemplateInfo> = {
  nodejs: {
    name: "nodejs",
    type: "generic",
    description: "Generic Node.js service template",
    services: {
      app: {
        name: "app",
        type: "Load Balanced Web Service",
        manifest: "templates/generic/nodejs/manifest.yml",
        resources: {
          cpu: 0.25,
          memory: 0.5,
        },
        variables: [
          {
            name: "NODE_ENV",
            description: "Node.js environment",
            required: false,
            sensitive: false,
            default: "production",
          },
          {
            name: "PORT",
            description: "Application port",
            required: false,
            sensitive: false,
            default: "3000",
          },
        ],
        healthCheck: "/health",
      },
    },
    variables: [],
    validation: {
      services: ["app"],
    },
    defaults: {
      environment: "staging",
      region: "us-east-1",
    },
  },
  python: {
    name: "python",
    type: "generic",
    description: "Generic Python service template",
    services: {
      app: {
        name: "app",
        type: "Load Balanced Web Service",
        manifest: "templates/generic/python/manifest.yml",
        resources: {
          cpu: 0.25,
          memory: 0.5,
        },
        variables: [
          {
            name: "PYTHONPATH",
            description: "Python path",
            required: false,
            sensitive: false,
            default: "/app",
          },
        ],
        healthCheck: "/health",
      },
    },
    variables: [],
    validation: {
      services: ["app"],
    },
    defaults: {
      environment: "staging",
      region: "us-east-1",
    },
  },
};

export async function loadTemplate(
  templateName: string
): Promise<TemplateInfo | null> {
  // First check AAI templates
  if (AAI_TEMPLATES[templateName]) {
    return AAI_TEMPLATES[templateName];
  }

  // Then check generic templates
  if (GENERIC_TEMPLATES[templateName]) {
    return GENERIC_TEMPLATES[templateName];
  }

  // TODO: Load custom templates from filesystem
  return null;
}

export async function listTemplates(): Promise<TemplateInfo[]> {
  const templates = [
    ...Object.values(AAI_TEMPLATES),
    ...Object.values(GENERIC_TEMPLATES),
  ];

  // TODO: Add custom templates from filesystem

  return templates;
}

export async function validateTemplate(
  template: TemplateInfo
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate template structure
  if (!template.name) {
    errors.push("Template must have a name");
  }

  if (!template.services || Object.keys(template.services).length === 0) {
    errors.push("Template must have at least one service");
  }

  // Validate services
  for (const [serviceName, service] of Object.entries(template.services)) {
    if (!service.name) {
      errors.push(`Service ${serviceName} must have a name`);
    }

    if (!service.healthCheck) {
      warnings.push(
        `Service ${serviceName} should have a health check endpoint`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export async function createServiceFromTemplate(
  template: ServiceTemplate,
  config: any
): Promise<void> {
  console.log("Service creation from template not yet implemented");
  console.log("Template:", template);
  console.log("Config:", config);
}

export function getDefaultTemplate(): TemplateInfo {
  // Return AAI flowise template as default
  return AAI_TEMPLATES.flowise!;
}

export function isAAITemplate(template: TemplateInfo): boolean {
  return template.type === "aai";
}
