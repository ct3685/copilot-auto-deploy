export interface DeployOptions {
  env?: string;
  subdomain?: string;
  services?: string[];
  yes?: boolean;
  nonInteractive?: boolean;
  debug?: boolean;
  dryRun?: boolean;
}

export async function deployFlow(opts: DeployOptions): Promise<void> {
  console.log("Deploy flow not yet implemented");
  console.log("Options:", opts);
}
