import type { LabelState } from "../state/label";
import type { WeeklyInputs } from "../state/weeklyInputs";
import type { FameTier } from "../rules/fameTiers";
import type { ReputationTier } from "../state/reputation";
import { isLabelEligible } from "../rules/label";

export type LabelUpdateResult = {
  label: LabelState;
  unlockedThisWeek: boolean;
};

export function updateLabelUnlock(
  label: LabelState,
  fameTier: FameTier,
  reputationTier: ReputationTier,
  inputs: WeeklyInputs,
  week: number,
): LabelUpdateResult {
  if (label.unlocked) {
    return { label, unlockedThisWeek: false };
  }

  if (isLabelEligible(fameTier, reputationTier, inputs.cashFlow)) {
    return {
      label: {
        unlocked: true,
        unlockedWeek: week,
      },
      unlockedThisWeek: true,
    };
  }

  return { label, unlockedThisWeek: false };
}
