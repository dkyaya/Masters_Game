export type TourTier = "Local" | "Regional" | "National" | "International";

export type ProductionLevel = "Low" | "Medium" | "High";

export type TourPlan = {
  tier: TourTier;
  productionLevel: ProductionLevel;
  durationWeeks: number;
  weeksRemaining: number;
  weekIndex: number;
  cooldownWeeks: number;
  overreach: boolean;
  cooldownPenalty: boolean;
};

export type TouringState = {
  activeTour?: TourPlan;
  cooldownWeeksRemaining: number;
};
