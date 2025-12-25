import { describe, expect, it } from "vitest";
import { createInitialState } from "../src/state/gameState";
import { updateTouring, startTour } from "../src/systems/touring";
import { releaseSingle, setCreativeDirection, setProductionFocus, startSingleProject, refineProject } from "../src/systems/music";
import type { TourPlan } from "../src/state/touring";

const balancedFocus = {
  writing: "Balanced",
  performance: "Balanced",
  polish: "Balanced",
} as const;

describe("touring", () => {
  it("does not start without traction", () => {
    const state = createInitialState(1);

    const next = startTour(state, {
      tier: "Local",
      productionLevel: "Low",
      durationWeeks: 4,
    });

    expect(next.touring.activeTour).toBeUndefined();
  });

  it("sets cooldown when tour ends", () => {
    let state = createInitialState(1);
    state = startSingleProject(state, { qualityCap: 0.96 });
    state = setCreativeDirection(state, "Safe");
    state = setProductionFocus(state, balancedFocus);
    state = refineProject(state);
    state = releaseSingle(state);
    state = {
      ...state,
      fanbase: { total: 5_000 },
      fameTier: "Local",
    };

    state = startTour(state, {
      tier: "Local",
      productionLevel: "Low",
      durationWeeks: 4,
    });

    const activeTour = state.touring.activeTour as TourPlan;
    state = {
      ...state,
      touring: {
        ...state.touring,
        activeTour: {
          ...activeTour,
          weeksRemaining: 1,
        },
      },
    };

    const result = updateTouring(state);

    expect(result.touring.activeTour).toBeUndefined();
    expect(result.touring.cooldownWeeksRemaining).toBe(activeTour.cooldownWeeks);
    expect(result.weeklyInputs.tour).toBeDefined();
  });
});
