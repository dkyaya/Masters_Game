import { describe, expect, it } from "vitest";
import { updateBurnout } from "../src/systems/burnout";
import type { BandwidthState } from "../src/state/bandwidth";
import { createEmptyWeeklyInputs } from "../src/state/weeklyInputs";

const baseBandwidth: BandwidthState = {
  base: 1,
  effective: 1,
  costMultiplier: 1,
  volatilityMultiplier: 1,
};

describe("updateBurnout", () => {
  it("accumulates when bandwidth is overused", () => {
    const inputs = { ...createEmptyWeeklyInputs(), bandwidthUsed: 2 };

    const result = updateBurnout({ value: 0 }, baseBandwidth, inputs);

    expect(result.burnout.value).toBeGreaterThan(0);
  });

  it("decays when no strain is present", () => {
    const inputs = createEmptyWeeklyInputs();

    const result = updateBurnout({ value: 0.5 }, baseBandwidth, inputs);

    expect(result.burnout.value).toBeCloseTo(0.48, 5);
  });
});
