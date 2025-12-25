import type { MomentumEvent } from "./momentum";

export type ReleaseOutcome = {
  baseReach: number;
  quality: number;
  hypeMatch: number;
  fameMultiplier: number;
  momentumMultiplier?: number;
};

export type SocialPostOutcome = {
  engagementScore: number;
  fameMultiplier: number;
  postQuality: number;
};

export type TourOutcome = {
  attendance: number;
  performanceQuality: number;
  fameMultiplier: number;
  isLoss?: boolean;
};

export type WeeklyInputs = {
  releases: ReleaseOutcome[];
  socialPosts: SocialPostOutcome[];
  tour?: TourOutcome;
  disappointment: boolean;
  oversaturationFactor: number;
  identityDriftFactor: number;
  inactivityMultiplier: number;
  momentumEvents: MomentumEvent[];
};

export function createEmptyWeeklyInputs(): WeeklyInputs {
  return {
    releases: [],
    socialPosts: [],
    tour: undefined,
    disappointment: false,
    oversaturationFactor: 0,
    identityDriftFactor: 0,
    inactivityMultiplier: 1,
    momentumEvents: [],
  };
}
