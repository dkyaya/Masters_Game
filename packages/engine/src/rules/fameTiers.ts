export type FameTier =
  | "Unknown"
  | "Local"
  | "Rising"
  | "Established"
  | "Star"
  | "Superstar";

type FameTierRule = {
  tier: FameTier;
  min: number;
  max?: number;
};

const FAME_TIER_RULES: FameTierRule[] = [
  { tier: "Unknown", min: 0, max: 5_000 },
  { tier: "Local", min: 5_000, max: 50_000 },
  { tier: "Rising", min: 50_000, max: 250_000 },
  { tier: "Established", min: 250_000, max: 1_000_000 },
  { tier: "Star", min: 1_000_000, max: 5_000_000 },
  { tier: "Superstar", min: 5_000_000 },
];

const FAME_TIER_ORDER: FameTier[] = FAME_TIER_RULES.map((rule) => rule.tier);

export const FAME_DEMOTION_HYSTERESIS = 0.3;

export function getFameTierRule(tier: FameTier): FameTierRule {
  const rule = FAME_TIER_RULES.find((entry) => entry.tier === tier);
  if (!rule) {
    throw new Error(`Unknown fame tier: ${tier}`);
  }
  return rule;
}

export function tierForFanbase(totalFans: number): FameTier {
  for (let index = FAME_TIER_RULES.length - 1; index >= 0; index -= 1) {
    const rule = FAME_TIER_RULES[index];
    if (totalFans >= rule.min) {
      return rule.tier;
    }
  }
  return "Unknown";
}

function tierIndex(tier: FameTier): number {
  return FAME_TIER_ORDER.indexOf(tier);
}

export function isTierAtOrAbove(current: FameTier, target: FameTier): boolean {
  return tierIndex(current) >= tierIndex(target);
}

export function compareFameTier(a: FameTier, b: FameTier): number {
  const indexA = tierIndex(a);
  const indexB = tierIndex(b);
  if (indexA === indexB) {
    return 0;
  }
  return indexA > indexB ? 1 : -1;
}

export function deriveFameTier(
  totalFans: number,
  previousTier: FameTier,
): FameTier {
  const baseTier = tierForFanbase(totalFans);

  if (isTierAtOrAbove(baseTier, previousTier)) {
    return baseTier;
  }

  const previousRule = getFameTierRule(previousTier);
  const demotionFloor = previousRule.min * (1 - FAME_DEMOTION_HYSTERESIS);

  if (totalFans < demotionFloor) {
    return baseTier;
  }

  return previousTier;
}
