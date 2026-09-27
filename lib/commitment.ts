export interface CommitmentInput {
  contractName: string;
  baseline: number;
  counterfactual: number;
  uncertainty: number;
  methodology: string;
  attribution: number[];
}

function canonicalize(input: CommitmentInput): string {
  return JSON.stringify({
    attribution: input.attribution,
    baseline: input.baseline,
    contractName: input.contractName,
    counterfactual: input.counterfactual,
    methodology: input.methodology,
    uncertainty: input.uncertainty,
  });
}

export async function createCommitmentHash(
  input: CommitmentInput
): Promise<string> {
  const canonical = canonicalize(input);

  const encoded = new TextEncoder().encode(canonical);

  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}