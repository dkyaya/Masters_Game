import { describe, expect, it } from "vitest";
import { updateLabelUnlock } from "../src/systems/label";
import { createEmptyWeeklyInputs } from "../src/state/weeklyInputs";

describe("updateLabelUnlock", () => {
  it("unlocks when eligibility conditions are met", () => {
    const inputs = { ...createEmptyWeeklyInputs(), cashFlow: 0 };
    const result = updateLabelUnlock(
      { unlocked: false },
      "Established",
      "Credible",
      inputs,
      10,
    );

    expect(result.label.unlocked).toBe(true);
    expect(result.label.unlockedWeek).toBe(10);
  });

  it("does not unlock when criteria are missing", () => {
    const inputs = { ...createEmptyWeeklyInputs(), cashFlow: 0 };
    const result = updateLabelUnlock(
      { unlocked: false },
      "Rising",
      "Credible",
      inputs,
      10,
    );

    expect(result.label.unlocked).toBe(false);
  });
});
