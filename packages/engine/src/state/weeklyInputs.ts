import type { MomentumEvent } from "./momentum";

export type ReleaseOutcome = {
  type?: "Single" | "Album";
  baseReach: number;
  quality: number;
  hypeMatch: number;
  fameMultiplier: number;
  momentumMultiplier?: number;
  cohesion?: "Low" | "Medium" | "High";
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
  lossAmount?: number;
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
  reputationDelta?: number;
  reputationCatastrophic?: boolean;
  cashFlow: number;
  bandwidthUsed: number;
  touringStrain: number;
  controversyStrain: number;
  labelPressureStrain: number;
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
    reputationDelta: undefined,
    reputationCatastrophic: false,
    cashFlow: 0,
    bandwidthUsed: 0,
    touringStrain: 0,
    controversyStrain: 0,
    labelPressureStrain: 0,
  };
}
