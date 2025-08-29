export function lower(str: string): string {
  return str.toLowerCase();
}

export function onSig(sig: string, handler: () => void): void {
  process.on(sig, handler);
}

export function removeSigHandlers(): void {
  process.removeAllListeners('SIGINT');
  process.removeAllListeners('SIGTERM');
}

export async function askWithTimeout(
  _prompt: string, 
  _ms: number, 
  defaultValue: string
): Promise<string> {
  console.log("Timeout prompt not yet implemented");
  return defaultValue;
}
