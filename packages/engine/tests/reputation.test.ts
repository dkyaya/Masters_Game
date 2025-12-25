import { describe, expect, it } from "vitest";
import { updateReputation } from "../src/systems/reputation";
import { createEmptyWeeklyInputs } from "../src/state/weeklyInputs";
import type { ReputationState } from "../src/state/reputation";

describe("updateReputation", () => {
  it("applies gains and promotes tiers immediately", () => {
    const inputs = { ...createEmptyWeeklyInputs(), reputationDelta: 200 };
    const state: ReputationState = { score: 100, tier: "Unproven" };

    const result = updateReputation(state, inputs, false);

    expect(result.reputation.score).toBe(300);
    expect(result.reputation.tier).toBe("Respected");
  });

  it("uses hysteresis before demotion", () => {
    const inputs = { ...createEmptyWeeklyInputs(), reputationDelta: -60 };
    const state: ReputationState = { score: 350, tier: "Credible" };

    const result = updateReputation(state, inputs, false);

    expect(result.reputation.tier).toBe("Credible");
  });

  it("reduces losses during momentum unless catastrophic", () => {
    const inputs = { ...createEmptyWeeklyInputs(), reputationDelta: -100 };
    const state: ReputationState = { score: 400, tier: "Credible" };

    const result = updateReputation(state, inputs, true);

    expect(result.reputation.score).toBeGreaterThan(300);
  });
});
