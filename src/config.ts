export interface CopilotAutoConfig {
  version: string;
  project: ProjectConfig;
  environments: Record<string, EnvironmentConfig>;
  services: Record<string, ServiceConfig>;
  aws: AwsConfig;
  variables: VariableConfig;
}

export interface ProjectConfig {
  name: string;
  domain: string;
  defaultEnvironment: string;
}

export interface EnvironmentConfig {
  subdomain: string;
  services: string[];
  autoConfirm: boolean;
}

export interface ServiceConfig {
  template: string;
  healthCheck: string;
  resources: ResourceConfig;
}

export interface ResourceConfig {
  cpu: number;
  memory: number;
}

export interface AwsConfig {
  profile: string;
  region: string;
  autoConfirm: boolean;
}

export interface VariableConfig {
  required: string[];
  optional: string[];
}

export async function loadConfig(_configPath?: string): Promise<CopilotAutoConfig | null> {
  console.log("Config loading not yet implemented");
  return null;
}
