import type { ReputationState } from "../state/reputation";
import type { WeeklyInputs } from "../state/weeklyInputs";
import {
  MOMENTUM_REP_LOSS_MULTIPLIER,
  clampReputationScore,
  deriveReputationTier,
} from "../rules/reputation";

export type ReputationUpdateResult = {
  reputation: ReputationState;
};

export function updateReputation(
  reputation: ReputationState,
  inputs: WeeklyInputs,
  momentumActive: boolean,
): ReputationUpdateResult {
  let delta = inputs.reputationDelta ?? 0;

  if (delta < 0 && momentumActive && !inputs.reputationCatastrophic) {
    delta *= MOMENTUM_REP_LOSS_MULTIPLIER;
  }

  const score = clampReputationScore(reputation.score + delta);
  const tier = deriveReputationTier(score, reputation.tier);

  return {
    reputation: {
      score,
      tier,
    },
  };
}
