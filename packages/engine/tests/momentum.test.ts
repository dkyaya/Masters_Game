import { describe, expect, it } from "vitest";
import { updateMomentum } from "../src/systems/momentum";
import type { MomentumState } from "../src/state/momentum";

describe("updateMomentum", () => {
  it("activates momentum from qualifying event", () => {
    const state: MomentumState = {
      active: false,
      weeksRemaining: 0,
      kind: undefined,
      eventsThisYear: 0,
      yearIndex: 0,
    };

    const result = updateMomentum(state, 1, [
      { kind: "major", successScore: 10, qualifies: true },
    ]);

    expect(result.momentum.active).toBe(true);
    expect(result.momentum.weeksRemaining).toBe(3);
    expect(result.momentum.eventsThisYear).toBe(1);
  });

  it("ignores new events while active", () => {
    const state: MomentumState = {
      active: true,
      weeksRemaining: 2,
      kind: "minor",
      eventsThisYear: 1,
      yearIndex: 0,
    };

    const result = updateMomentum(state, 1, [
      { kind: "major", successScore: 10, qualifies: true },
    ]);

    expect(result.momentum.active).toBe(true);
    expect(result.momentum.weeksRemaining).toBe(1);
    expect(result.triggeredEvent).toBeUndefined();
    expect(result.momentum.eventsThisYear).toBe(1);
  });
});
