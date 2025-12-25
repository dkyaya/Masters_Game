import type { GameState } from "../state/gameState";
import { deriveFameTier } from "../rules/fameTiers";
import { updateFanbase } from "./fanbase";
import { updateMomentum } from "./momentum";

export function runWeeklySystems(state: GameState): GameState {
  const { fanbase: updatedFanbase, rng } = updateFanbase(
    state.fanbase,
    state.weeklyInputs,
    state.fameTier,
    state.momentum,
    state.rng,
  );

  const fameTier = deriveFameTier(updatedFanbase.total, state.fameTier);
  const momentumUpdate = updateMomentum(
    state.momentum,
    state.week,
    state.weeklyInputs.momentumEvents,
  );

  const events = state.transient.events.slice();
  if (momentumUpdate.triggeredEvent) {
    events.push("Momentum triggered");
  }

  return {
    ...state,
    fanbase: updatedFanbase,
    fameTier,
    momentum: momentumUpdate.momentum,
    rng,
    transient: {
      ...state.transient,
      events,
    },
  };
}
