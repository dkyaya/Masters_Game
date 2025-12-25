import { describe, expect, it } from "vitest";
import { updateFanbase } from "../src/systems/fanbase";
import { createRng } from "../src/state/rng";
import { createEmptyWeeklyInputs } from "../src/state/weeklyInputs";
import type { MomentumState } from "../src/state/momentum";

const baseMomentum: MomentumState = {
  active: false,
  weeksRemaining: 0,
  kind: undefined,
  eventsThisYear: 0,
  yearIndex: 0,
};

describe("updateFanbase", () => {
  it("applies release gains", () => {
    const inputs = {
      ...createEmptyWeeklyInputs(),
      releases: [
        {
          baseReach: 100,
          quality: 1,
          hypeMatch: 1,
          fameMultiplier: 1,
        },
      ],
    };

    const result = updateFanbase(
      { total: 0 },
      inputs,
      "Unknown",
      baseMomentum,
      createRng(1),
    );

    expect(result.fanbase.total).toBe(100);
  });

  it("applies momentum multiplier to gains", () => {
    const inputs = {
      ...createEmptyWeeklyInputs(),
      releases: [
        {
          baseReach: 100,
          quality: 1,
          hypeMatch: 1,
          fameMultiplier: 1,
        },
      ],
    };

    const momentum: MomentumState = {
      active: true,
      weeksRemaining: 2,
      kind: "minor",
      eventsThisYear: 1,
      yearIndex: 0,
    };

    const result = updateFanbase(
      { total: 0 },
      inputs,
      "Unknown",
      momentum,
      createRng(1),
    );

    expect(result.fanbase.total).toBe(156);
  });

  it("reduces fanbase on disappointment without gains", () => {
    const inputs = {
      ...createEmptyWeeklyInputs(),
      disappointment: true,
    };

    const result = updateFanbase(
      { total: 1_000 },
      inputs,
      "Local",
      baseMomentum,
      createRng(2),
    );

    expect(result.fanbase.total).toBeLessThan(1_000);
  });
});
