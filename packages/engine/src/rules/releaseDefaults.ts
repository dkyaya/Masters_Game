import type { FameTier } from "./fameTiers";

export const HYPE_MATCH_RANGE = {
  PERFECT: 1.15,
  GOOD: 1,
  MISALIGNED: 0.85,
  OVERHYPED: 0.7,
} as const;

export const MOMENTUM_MULTIPLIER = {
  NONE: 1,
  ACTIVE: 1.25,
} as const;

export const DEFAULT_HYPE_MATCH = HYPE_MATCH_RANGE.GOOD;
export const DEFAULT_FAME_MULTIPLIER = 1;

export const SINGLE_BASE_REACH: Record<FameTier, number> = {
  Unknown: 120,
  Local: 800,
  Rising: 4_000,
  Established: 12_000,
  Star: 30_000,
  Superstar: 60_000,
};

export const ALBUM_BASE_REACH_MULTIPLIER = {
  LOW_COHESION: 1.5,
  MEDIUM_COHESION: 1.8,
  HIGH_COHESION: 2.2,
} as const;

export function baseReachForTier(tier: FameTier): number {
  return SINGLE_BASE_REACH[tier];
}
