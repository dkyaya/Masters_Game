import type { FanbaseState } from "../state/fanbase";
import type { MomentumState } from "../state/momentum";
import type { RngState } from "../state/rng";
import type { WeeklyInputs } from "../state/weeklyInputs";
import type { FameTier } from "../rules/fameTiers";
import {
  getDisappointmentFactorRange,
  getPassiveDecayRateRange,
} from "../rules/fanbaseRates";
import { nextRange } from "../state/rng";
import { MOMENTUM_MULTIPLIER } from "../rules/releaseDefaults";

export type FanbaseUpdateResult = {
  fanbase: FanbaseState;
  rng: RngState;
};

const MOMENTUM_GAIN_MULTIPLIER = MOMENTUM_MULTIPLIER.ACTIVE;
const MOMENTUM_LOSS_MULTIPLIER = 0.85;

function sumReleaseGains(
  inputs: WeeklyInputs,
  momentum: MomentumState,
  rng: RngState,
): [number, RngState] {
  let total = 0;
  let nextRng = rng;

  for (const release of inputs.releases) {
    let momentumMultiplier = release.momentumMultiplier ?? MOMENTUM_MULTIPLIER.NONE;

    if (release.momentumMultiplier === undefined && momentum.active) {
      momentumMultiplier = MOMENTUM_MULTIPLIER.ACTIVE;
    }

    total +=
      release.baseReach *
      release.quality *
      release.hypeMatch *
      release.fameMultiplier *
      momentumMultiplier;
  }

  return [total, nextRng];
}

function sumSocialGains(inputs: WeeklyInputs): number {
  return inputs.socialPosts.reduce(
    (total, post) =>
      total + post.engagementScore * post.fameMultiplier * post.postQuality,
    0,
  );
}

function sumTourEffects(inputs: WeeklyInputs): { gain: number; loss: number } {
  if (!inputs.tour) {
    return { gain: 0, loss: 0 };
  }

  const effect =
    inputs.tour.attendance *
    inputs.tour.performanceQuality *
    inputs.tour.fameMultiplier;

  if (inputs.tour.isLoss) {
    return { gain: 0, loss: Math.abs(effect) };
  }

  return { gain: effect, loss: 0 };
}

function scaleSegments(fanbase: FanbaseState, nextTotal: number): FanbaseState {
  const { core, casual, detractors } = fanbase;
  if (core === undefined || casual === undefined || detractors === undefined) {
    return { ...fanbase, total: nextTotal };
  }

  const segmentTotal = core + casual + detractors;
  if (segmentTotal <= 0) {
    return { ...fanbase, total: nextTotal };
  }

  const scale = nextTotal / segmentTotal;

  return {
    total: nextTotal,
    core: Math.round(core * scale),
    casual: Math.round(casual * scale),
    detractors: Math.round(detractors * scale),
  };
}

export function updateFanbase(
  fanbase: FanbaseState,
  inputs: WeeklyInputs,
  fameTier: FameTier,
  momentum: MomentumState,
  rng: RngState,
): FanbaseUpdateResult {
  const totalFans = fanbase.total;
  let nextRng = rng;

  const decayRange = getPassiveDecayRateRange(fameTier);
  const [decayRate, decayRng] = nextRange(
    nextRng,
    decayRange.min,
    decayRange.max,
  );
  nextRng = decayRng;

  const inactivityMultiplier = Math.max(inputs.inactivityMultiplier, 0);
  const passiveDecay = totalFans * decayRate * inactivityMultiplier;

  const [releaseGains, releaseRng] = sumReleaseGains(inputs, momentum, nextRng);
  nextRng = releaseRng;
  const socialGains = sumSocialGains(inputs);
  const tourEffects = sumTourEffects(inputs);

  let gains = releaseGains + socialGains + tourEffects.gain;
  let losses = tourEffects.loss;

  if (inputs.disappointment) {
    const disappointmentRange = getDisappointmentFactorRange(fameTier);
    const [factor, disappointmentRng] = nextRange(
      nextRng,
      disappointmentRange.min,
      disappointmentRange.max,
    );
    nextRng = disappointmentRng;
    losses += totalFans * factor;
  }

  const oversaturationFactor = Math.max(inputs.oversaturationFactor, 0);
  if (oversaturationFactor > 0) {
    losses += totalFans * oversaturationFactor;
  }

  const identityDriftFactor = Math.max(inputs.identityDriftFactor, 0);
  if (identityDriftFactor > 0 && fanbase.core !== undefined) {
    losses += fanbase.core * identityDriftFactor;
  }

  if (momentum.active) {
    gains *= MOMENTUM_GAIN_MULTIPLIER;
    losses *= MOMENTUM_LOSS_MULTIPLIER;
  }

  const net = gains - losses - passiveDecay;
  const nextTotal = Math.max(0, Math.round(totalFans + net));

  return {
    fanbase: scaleSegments(fanbase, nextTotal),
    rng: nextRng,
  };
}
