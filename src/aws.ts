export interface AwsVerificationResult {
  ok: boolean;
  fatal?: boolean;
  reason?: 'cancelled' | 'expired';
}

export async function verifyAwsAccount(
  _confirmFn: (msg: string) => Promise<boolean>
): Promise<AwsVerificationResult> {
  console.log("AWS verification not yet implemented");
  return { ok: true };
}
