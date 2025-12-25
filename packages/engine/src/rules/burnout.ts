export const BURNOUT_MIN = 0;
export const BURNOUT_MAX = 1;

export const BURNOUT_PENALTY_MAX = 0.5;
export const BURNOUT_COST_MAX = 0.5;
export const BURNOUT_VOLATILITY_MAX = 0.5;

export const BURNOUT_DECAY_RATE = 0.02;

export const BURNOUT_WARNING_THRESHOLDS = {
  MEDIUM: 0.35,
  HIGH: 0.7,
};

export function clampBurnout(value: number): number {
  if (value < BURNOUT_MIN) {
    return BURNOUT_MIN;
  }
  if (value > BURNOUT_MAX) {
    return BURNOUT_MAX;
  }
  return value;
}

export function burnoutPenalty(value: number): number {
  return Math.min(value * BURNOUT_PENALTY_MAX, BURNOUT_PENALTY_MAX);
}

export function burnoutCostMultiplier(value: number): number {
  return 1 + value * BURNOUT_COST_MAX;
}

export function burnoutVolatilityMultiplier(value: number): number {
  return 1 + value * BURNOUT_VOLATILITY_MAX;
}

export function burnoutWarning(value: number): string | null {
  if (value >= BURNOUT_WARNING_THRESHOLDS.HIGH) {
    return "You're pushing hard";
  }
  if (value >= BURNOUT_WARNING_THRESHOLDS.MEDIUM) {
    return "Things feel harder lately";
  }
  return null;
}
