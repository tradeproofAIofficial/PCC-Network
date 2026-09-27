export interface PCCInput {
  baseline: number;
  observed: number;
  counterfactual: number;
  uncertainty: number;
  contributorShares: number[];
}

export interface PCCResult {
  incrementalEffect: number;
  lowerBound: number;
  upperBound: number;
  attributedValue: number[];
  confidenceBand: string;
}

export function calculatePCC(input: PCCInput): PCCResult {
  const incrementalEffect = input.observed - input.counterfactual;
  const lowerBound = incrementalEffect - input.uncertainty;
  const upperBound = incrementalEffect + input.uncertainty;

  const total = input.contributorShares.reduce(
    (sum, share) => sum + share,
    0
  );

  if (Math.abs(total - 1) > 0.000001) {
    throw new Error("Contributor shares must sum to 1.");
  }

  return {
    incrementalEffect,
    lowerBound,
    upperBound,
    attributedValue: input.contributorShares.map(
      (share) => incrementalEffect * share
    ),
    confidenceBand: "±$" + input.uncertainty.toLocaleString(),
  };
}