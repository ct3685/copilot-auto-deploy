export interface SetupWizard {
  discoverProject(): Promise<ProjectInfo>;
  configureEnvironments(): Promise<EnvironmentConfig[]>;
  selectServices(): Promise<string[]>;
  configureVariables(): Promise<VariableConfig>;
  configureAws(): Promise<AwsConfig>;
  generateConfig(): Promise<CopilotAutoConfig>;
}

export interface ProjectInfo {
  name: string;
  path: string;
  hasCopilot: boolean;
}

export interface EnvironmentConfig {
  name: string;
  subdomain: string;
  services: string[];
  autoConfirm: boolean;
}

export interface VariableConfig {
  required: string[];
  optional: string[];
}

export interface AwsConfig {
  profile: string;
  region: string;
  autoConfirm: boolean;
}

export interface CopilotAutoConfig {
  version: string;
  project: any;
  environments: Record<string, EnvironmentConfig>;
  services: any;
  aws: AwsConfig;
  variables: VariableConfig;
}

export async function runSetupWizard(_projectPath: string): Promise<CopilotAutoConfig> {
  console.log("Setup wizard not yet implemented");
  throw new Error("Setup wizard not yet implemented");
}
