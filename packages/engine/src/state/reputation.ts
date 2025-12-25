export type ReputationTier =
  | "Unproven"
  | "Respected"
  | "Credible"
  | "Acclaimed"
  | "Elite";

export type ReputationState = {
  score: number;
  tier: ReputationTier;
};
