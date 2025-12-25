import type { BandwidthState } from "../state/bandwidth";
import type { BurnoutState } from "../state/burnout";
import type { WeeklyInputs } from "../state/weeklyInputs";
import {
  BURNOUT_DECAY_RATE,
  burnoutCostMultiplier,
  burnoutPenalty,
  burnoutVolatilityMultiplier,
  clampBurnout,
} from "../rules/burnout";

export type BurnoutUpdateResult = {
  burnout: BurnoutState;
  bandwidth: BandwidthState;
};

export function updateBurnout(
  burnout: BurnoutState,
  bandwidth: BandwidthState,
  inputs: WeeklyInputs,
): BurnoutUpdateResult {
  const penalty = burnoutPenalty(burnout.value);
  const effectiveBandwidth = bandwidth.base * (1 - penalty);

  const safeBase = bandwidth.base > 0 ? bandwidth.base : 1;
  const overuse = Math.max(0, inputs.bandwidthUsed - effectiveBandwidth);
  const overuseRatio = overuse / safeBase;

  const strain =
    Math.max(0, inputs.touringStrain) +
    Math.max(0, inputs.controversyStrain) +
    Math.max(0, inputs.labelPressureStrain);

  let nextValue = burnout.value + overuseRatio + strain;

  if (overuseRatio === 0 && strain === 0) {
    nextValue -= BURNOUT_DECAY_RATE;
  }

  const clamped = clampBurnout(nextValue);

  return {
    burnout: {
      value: clamped,
    },
    bandwidth: {
      ...bandwidth,
      effective: effectiveBandwidth,
      costMultiplier: burnoutCostMultiplier(clamped),
      volatilityMultiplier: burnoutVolatilityMultiplier(clamped),
    },
  };
}
