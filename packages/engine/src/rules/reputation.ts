import type { ReputationTier } from "../state/reputation";

type ReputationTierRule = {
  tier: ReputationTier;
  min: number;
  max?: number;
};

const REPUTATION_TIER_RULES: ReputationTierRule[] = [
  { tier: "Unproven", min: 0, max: 150 },
  { tier: "Respected", min: 150, max: 350 },
  { tier: "Credible", min: 350, max: 600 },
  { tier: "Acclaimed", min: 600, max: 850 },
  { tier: "Elite", min: 850 },
];

const REPUTATION_TIER_ORDER: ReputationTier[] = REPUTATION_TIER_RULES.map(
  (rule) => rule.tier,
);

export const REPUTATION_DEMOTION_HYSTERESIS = 0.25;
export const REPUTATION_MAX_SCORE = 1000;
export const MOMENTUM_REP_LOSS_MULTIPLIER = 0.85;

export function clampReputationScore(value: number): number {
  if (value < 0) {
    return 0;
  }
  if (value > REPUTATION_MAX_SCORE) {
    return REPUTATION_MAX_SCORE;
  }
  return value;
}

export function tierForReputation(score: number): ReputationTier {
  for (let index = REPUTATION_TIER_RULES.length - 1; index >= 0; index -= 1) {
    const rule = REPUTATION_TIER_RULES[index];
    if (score >= rule.min) {
      return rule.tier;
    }
  }
  return "Unproven";
}

function tierIndex(tier: ReputationTier): number {
  return REPUTATION_TIER_ORDER.indexOf(tier);
}

export function compareReputationTier(a: ReputationTier, b: ReputationTier): number {
  const indexA = tierIndex(a);
  const indexB = tierIndex(b);
  if (indexA === indexB) {
    return 0;
  }
  return indexA > indexB ? 1 : -1;
}

export function isReputationTierAtOrAbove(
  current: ReputationTier,
  target: ReputationTier,
): boolean {
  return compareReputationTier(current, target) >= 0;
}

function getTierRule(tier: ReputationTier): ReputationTierRule {
  const rule = REPUTATION_TIER_RULES.find((entry) => entry.tier === tier);
  if (!rule) {
    throw new Error(`Unknown reputation tier: ${tier}`);
  }
  return rule;
}

export function deriveReputationTier(
  score: number,
  previousTier: ReputationTier,
): ReputationTier {
  const baseTier = tierForReputation(score);
  if (compareReputationTier(baseTier, previousTier) >= 0) {
    return baseTier;
  }

  const previousRule = getTierRule(previousTier);
  const demotionFloor = previousRule.min * (1 - REPUTATION_DEMOTION_HYSTERESIS);

  if (score < demotionFloor) {
    return baseTier;
  }

  return previousTier;
}
