import type { FameTier } from "./fameTiers";
import type { ProductionLevel, TourTier } from "../state/touring";

export const TOUR_DURATION_RANGE = {
  MIN: 4,
  MAX: 16,
};

export const TOUR_COOLDOWN_BY_TIER: Record<TourTier, number> = {
  Local: 2,
  Regional: 3,
  National: 4,
  International: 6,
};

export const TOUR_MIN_FAME_BY_TIER: Record<TourTier, FameTier> = {
  Local: "Local",
  Regional: "Rising",
  National: "Established",
  International: "Star",
};

export const TOUR_GAIN_RATE_RANGE: Record<TourTier, { min: number; max: number }> = {
  Local: { min: 0.005, max: 0.02 },
  Regional: { min: 0.008, max: 0.03 },
  National: { min: 0.01, max: 0.04 },
  International: { min: 0.02, max: 0.06 },
};

export const TOUR_BANDWIDTH_COST: Record<TourTier, number> = {
  Local: 0.3,
  Regional: 0.5,
  National: 0.8,
  International: 1.1,
};

export const TOUR_STRAIN_BASE: Record<TourTier, number> = {
  Local: 0.05,
  Regional: 0.1,
  National: 0.18,
  International: 0.28,
};

export const TOUR_PRODUCTION_MULTIPLIER: Record<ProductionLevel, number> = {
  Low: 0.9,
  Medium: 1,
  High: 1.1,
};

export const TOUR_COOLDOWN_PENALTY = {
  FAN_GAIN: 0.85,
  BANDWIDTH: 1.2,
  STRAIN: 1.3,
};

export const TOUR_OVEREACH_ATTENDANCE_MULTIPLIER = 0.6;

export const TOUR_BAD_PERFORMANCE_THRESHOLD = 0.5;

export const TOUR_MOMENTUM_THRESHOLD = 1.05;

export function clampTourDuration(durationWeeks: number): number {
  if (durationWeeks < TOUR_DURATION_RANGE.MIN) {
    return TOUR_DURATION_RANGE.MIN;
  }
  if (durationWeeks > TOUR_DURATION_RANGE.MAX) {
    return TOUR_DURATION_RANGE.MAX;
  }
  return durationWeeks;
}

export function durationMultiplier(durationWeeks: number): number {
  const normalized = durationWeeks / TOUR_DURATION_RANGE.MAX;
  return 1 + normalized * normalized;
}
