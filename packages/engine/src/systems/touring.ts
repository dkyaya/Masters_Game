import type { GameState } from "../state/gameState";
import type { TourOutcome, WeeklyInputs } from "../state/weeklyInputs";
import type { RngState } from "../state/rng";
import type { TourPlan, TourTier, TouringState } from "../state/touring";
import { MOMENTUM_MULTIPLIER } from "../rules/releaseDefaults";
import { isTierAtOrAbove } from "../rules/fameTiers";
import { burnoutPenalty } from "../rules/burnout";
import { getDisappointmentFactorRange } from "../rules/fanbaseRates";
import { nextRange } from "../state/rng";
import {
  TOUR_BAD_PERFORMANCE_THRESHOLD,
  TOUR_BANDWIDTH_COST,
  TOUR_COOLDOWN_BY_TIER,
  TOUR_COOLDOWN_PENALTY,
  TOUR_GAIN_RATE_RANGE,
  TOUR_MIN_FAME_BY_TIER,
  TOUR_MOMENTUM_THRESHOLD,
  TOUR_OVEREACH_ATTENDANCE_MULTIPLIER,
  TOUR_PRODUCTION_MULTIPLIER,
  TOUR_STRAIN_BASE,
  clampTourDuration,
  durationMultiplier,
} from "../rules/touring";

export type StartTourParams = {
  tier: TourTier;
  productionLevel: TourPlan["productionLevel"];
  durationWeeks: number;
  cooldownWeeks?: number;
  allowOverreach?: boolean;
  ignoreCooldown?: boolean;
};

export type TouringUpdateResult = {
  touring: TouringState;
  weeklyInputs: WeeklyInputs;
  rng: RngState;
};

function cloneInputs(inputs: WeeklyInputs): WeeklyInputs {
  return {
    ...inputs,
    releases: [...inputs.releases],
    socialPosts: [...inputs.socialPosts],
    momentumEvents: [...inputs.momentumEvents],
  };
}

function hasCatalogTraction(state: GameState): boolean {
  return state.music.releasedProjects.some((project) => project.hasTraction);
}

export function startTour(state: GameState, params: StartTourParams): GameState {
  if (state.touring.activeTour) {
    return state;
  }

  if (!hasCatalogTraction(state)) {
    return state;
  }

  const durationWeeks = clampTourDuration(params.durationWeeks);
  const minTier = TOUR_MIN_FAME_BY_TIER[params.tier];
  const fameOk = isTierAtOrAbove(state.fameTier, minTier);
  const allowOverreach = params.allowOverreach ?? false;

  if (!fameOk && !allowOverreach) {
    return state;
  }

  const ignoreCooldown = params.ignoreCooldown ?? false;
  const cooldownPenalty = state.touring.cooldownWeeksRemaining > 0 && ignoreCooldown;

  if (state.touring.cooldownWeeksRemaining > 0 && !ignoreCooldown) {
    return state;
  }

  const cooldownWeeks =
    params.cooldownWeeks ?? TOUR_COOLDOWN_BY_TIER[params.tier];

  const plan: TourPlan = {
    tier: params.tier,
    productionLevel: params.productionLevel,
    durationWeeks,
    weeksRemaining: durationWeeks,
    weekIndex: 0,
    cooldownWeeks,
    overreach: !fameOk,
    cooldownPenalty,
  };

  return {
    ...state,
    touring: {
      ...state.touring,
      activeTour: plan,
    },
  };
}

function updateTourPlan(plan: TourPlan): TourPlan {
  const nextWeeksRemaining = Math.max(0, plan.weeksRemaining - 1);
  return {
    ...plan,
    weeksRemaining: nextWeeksRemaining,
    weekIndex: plan.weekIndex + 1,
  };
}

export function updateTouring(state: GameState): TouringUpdateResult {
  const inputs = cloneInputs(state.weeklyInputs);
  let nextRng = state.rng;
  let touringState = state.touring;

  if (!state.touring.activeTour) {
    if (state.touring.cooldownWeeksRemaining > 0) {
      touringState = {
        ...state.touring,
        cooldownWeeksRemaining: Math.max(0, state.touring.cooldownWeeksRemaining - 1),
      };
    }

    return {
      touring: touringState,
      weeklyInputs: inputs,
      rng: nextRng,
    };
  }

  const plan = state.touring.activeTour;
  const gainRange = TOUR_GAIN_RATE_RANGE[plan.tier];
  const [gainRateRoll, gainRateRng] = nextRange(nextRng, gainRange.min, gainRange.max);
  nextRng = gainRateRng;

  const cooldownPenalty = plan.cooldownPenalty ? TOUR_COOLDOWN_PENALTY.FAN_GAIN : 1;
  const gainRate = gainRateRoll * cooldownPenalty;
  const attendanceRate = gainRange.max;

  let attendance = state.fanbase.total * attendanceRate;
  if (plan.overreach) {
    attendance *= TOUR_OVEREACH_ATTENDANCE_MULTIPLIER;
  }

  const momentumMultiplier = state.momentum.active
    ? MOMENTUM_MULTIPLIER.ACTIVE
    : MOMENTUM_MULTIPLIER.NONE;
  attendance *= momentumMultiplier;

  const basePerformance = attendanceRate > 0 ? gainRate / attendanceRate : 0;
  const productionMultiplier = TOUR_PRODUCTION_MULTIPLIER[plan.productionLevel];
  const burnoutEffect = 1 - burnoutPenalty(state.burnout.value);
  const performanceQuality = basePerformance * productionMultiplier * burnoutEffect;

  let lossAmount = 0;
  if (plan.overreach || performanceQuality < TOUR_BAD_PERFORMANCE_THRESHOLD) {
    const range = getDisappointmentFactorRange(state.fameTier);
    const [factor, disappointmentRng] = nextRange(nextRng, range.min, range.max);
    nextRng = disappointmentRng;
    lossAmount = state.fanbase.total * factor;
  }

  if (
    !state.momentum.active &&
    (plan.tier === "National" || plan.tier === "International") &&
    isTierAtOrAbove(state.fameTier, "Established") &&
    performanceQuality >= TOUR_MOMENTUM_THRESHOLD
  ) {
    inputs.momentumEvents.push({
      kind: plan.tier === "International" ? "career" : "major",
      successScore: performanceQuality,
      qualifies: true,
    });
  }

  const tourOutcome: TourOutcome = {
    attendance,
    performanceQuality,
    fameMultiplier: 1,
    lossAmount: lossAmount > 0 ? lossAmount : undefined,
  };

  const bandwidthCostBase = TOUR_BANDWIDTH_COST[plan.tier];
  const cooldownBandwidthPenalty = plan.cooldownPenalty
    ? TOUR_COOLDOWN_PENALTY.BANDWIDTH
    : 1;
  const bandwidthCost =
    bandwidthCostBase * state.bandwidth.costMultiplier * cooldownBandwidthPenalty;

  const baseStrain = TOUR_STRAIN_BASE[plan.tier];
  const strainMultiplier = durationMultiplier(plan.durationWeeks);
  const cooldownStrainPenalty = plan.cooldownPenalty ? TOUR_COOLDOWN_PENALTY.STRAIN : 1;
  const strain = baseStrain * strainMultiplier * cooldownStrainPenalty * (1 + state.burnout.value);

  inputs.tour = tourOutcome;
  inputs.bandwidthUsed += bandwidthCost;
  inputs.touringStrain += strain;

  let nextPlan = updateTourPlan(plan);
  let nextTouring: TouringState = {
    ...state.touring,
    activeTour: nextPlan,
  };

  if (nextPlan.weeksRemaining === 0) {
    nextTouring = {
      activeTour: undefined,
      cooldownWeeksRemaining: nextPlan.cooldownWeeks,
    };
  }

  return {
    touring: nextTouring,
    weeklyInputs: inputs,
    rng: nextRng,
  };
}
