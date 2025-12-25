import type { GameState } from "../state/gameState";
import { deriveFameTier } from "../rules/fameTiers";
import { updateFanbase } from "./fanbase";
import { updateMomentum } from "./momentum";
import { updateBurnout } from "./burnout";
import { updateTouring } from "./touring";
import { updateReputation } from "./reputation";
import { updateLabelUnlock } from "./label";

export function runWeeklySystems(state: GameState): GameState {
  const touringUpdate = updateTouring(state);
  const { fanbase: updatedFanbase, rng } = updateFanbase(
    state.fanbase,
    touringUpdate.weeklyInputs,
    state.fameTier,
    state.momentum,
    touringUpdate.rng,
  );

  const fameTier = deriveFameTier(updatedFanbase.total, state.fameTier);
  const momentumUpdate = updateMomentum(
    state.momentum,
    state.week,
    touringUpdate.weeklyInputs.momentumEvents,
  );

  const burnoutUpdate = updateBurnout(
    state.burnout,
    state.bandwidth,
    touringUpdate.weeklyInputs,
  );

  const reputationUpdate = updateReputation(
    state.reputation,
    touringUpdate.weeklyInputs,
    state.momentum.active,
  );

  const labelUpdate = updateLabelUnlock(
    state.label,
    fameTier,
    reputationUpdate.reputation.tier,
    touringUpdate.weeklyInputs,
    state.week,
  );

  const events = state.transient.events.slice();
  if (momentumUpdate.triggeredEvent) {
    events.push("Momentum triggered");
  }
  if (labelUpdate.unlockedThisWeek) {
    events.push("Label creation unlocked");
  }

  return {
    ...state,
    weeklyInputs: touringUpdate.weeklyInputs,
    touring: touringUpdate.touring,
    fanbase: updatedFanbase,
    fameTier,
    momentum: momentumUpdate.momentum,
    burnout: burnoutUpdate.burnout,
    bandwidth: burnoutUpdate.bandwidth,
    reputation: reputationUpdate.reputation,
    label: labelUpdate.label,
    rng,
    transient: {
      ...state.transient,
      events,
    },
  };
}
