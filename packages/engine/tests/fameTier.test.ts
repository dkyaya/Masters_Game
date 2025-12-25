import { describe, expect, it } from "vitest";
import { deriveFameTier } from "../src/rules/fameTiers";

describe("deriveFameTier", () => {
  it("promotes immediately on crossing threshold", () => {
    expect(deriveFameTier(50_000, "Local")).toBe("Rising");
    expect(deriveFameTier(250_000, "Rising")).toBe("Established");
  });

  it("holds tier until dropping below hysteresis floor", () => {
    expect(deriveFameTier(200_000, "Established")).toBe("Established");
    expect(deriveFameTier(174_999, "Established")).toBe("Rising");
  });
});
