export interface ExecResult {
  ok: boolean;
  out: string;
}

export async function run(
  _cmd: string,
  _args: string[] = [],
  _opts: Record<string, unknown> = {}
): Promise<ExecResult> {
  console.log("Command execution not yet implemented");
  return { ok: true, out: "" };
}

export async function which(_bin: string): Promise<boolean> {
  console.log("Binary check not yet implemented");
  return true;
}
