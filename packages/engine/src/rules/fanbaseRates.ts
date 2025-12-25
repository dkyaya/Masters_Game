import type { FameTier } from "./fameTiers";

type Range = {
  min: number;
  max: number;
};

const PASSIVE_DECAY_RATES: Record<FameTier, Range> = {
  Unknown: { min: 0.001, max: 0.003 },
  Local: { min: 0.002, max: 0.004 },
  Rising: { min: 0.003, max: 0.006 },
  Established: { min: 0.004, max: 0.008 },
  Star: { min: 0.006, max: 0.012 },
  Superstar: { min: 0.008, max: 0.015 },
};

const DISAPPOINTMENT_SMALL_RANGE: Range = { min: 0.002, max: 0.005 };
const DISAPPOINTMENT_STAR_RANGE: Range = { min: 0.01, max: 0.03 };

export function getPassiveDecayRateRange(tier: FameTier): Range {
  return PASSIVE_DECAY_RATES[tier];
}

export function getDisappointmentFactorRange(tier: FameTier): Range {
  if (tier === "Star" || tier === "Superstar") {
    return DISAPPOINTMENT_STAR_RANGE;
  }

  return DISAPPOINTMENT_SMALL_RANGE;
}
