import type { CreativeDirection, QualityLabel } from "../state/music";

export const QUALITY_MIN = 0.6;
export const QUALITY_MAX = 1.4;

export const CREATIVE_DIRECTION_BASE_QUALITY: Record<
  CreativeDirection,
  number
> = {
  Safe: 0.9,
  TrendChasing: 0.85,
  Experimental: 0.8,
  Personal: 0.88,
  VisualFirst: 0.82,
};

export const REFINEMENT_DELTA: Record<QualityLabel, number> = {
  Rough: 0.06,
  Solid: 0.03,
  Polished: 0.015,
};

export const QUALITY_PHASE_THRESHOLDS = {
  ROUGH_MAX: 0.95,
  SOLID_MAX: 1.15,
};

export const SKILL_QUALITY_BONUS = {
  SONGWRITING: 0.002,
  VOCALS: 0.0015,
  RHYTHM: 0.001,
  VIDEO_DIRECTING: 0.0005,
} as const;

export const BURNOUT_REFINEMENT_MULTIPLIER = {
  LOW: 1,
  MEDIUM: 0.85,
  HIGH: 0.65,
} as const;

export const DEFAULT_REFINEMENT_COST = 1;
export const DEFAULT_FOCUS_ADJUST_PENALTY = 0.05;

export function clampQuality(value: number): number {
  if (value < QUALITY_MIN) {
    return QUALITY_MIN;
  }
  if (value > QUALITY_MAX) {
    return QUALITY_MAX;
  }
  return value;
}

export function baseQualityForDirection(direction: CreativeDirection): number {
  return CREATIVE_DIRECTION_BASE_QUALITY[direction];
}

export function qualityLabelForQuality(quality: number): QualityLabel {
  if (quality < QUALITY_PHASE_THRESHOLDS.ROUGH_MAX) {
    return "Rough";
  }
  if (quality <= QUALITY_PHASE_THRESHOLDS.SOLID_MAX) {
    return "Solid";
  }
  return "Polished";
}
