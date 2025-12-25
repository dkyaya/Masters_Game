import type { FameTier } from "./fameTiers";
import type { ReputationTier } from "../state/reputation";
import { isTierAtOrAbove } from "./fameTiers";
import { isReputationTierAtOrAbove } from "./reputation";

export const LABEL_STABILITY_THRESHOLD = 0;

export function isLabelEligible(
  fameTier: FameTier,
  reputationTier: ReputationTier,
  cashFlow: number,
): boolean {
  return (
    isTierAtOrAbove(fameTier, "Established") &&
    isReputationTierAtOrAbove(reputationTier, "Credible") &&
    cashFlow >= LABEL_STABILITY_THRESHOLD
  );
}
