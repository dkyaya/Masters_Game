export type MomentumKind = "minor" | "major" | "career";

export type MomentumState = {
  active: boolean;
  weeksRemaining: number;
  kind?: MomentumKind;
  eventsThisYear: number;
  yearIndex: number;
};

export type MomentumEvent = {
  kind: MomentumKind;
  successScore: number;
  qualifies: boolean;
};

export const MOMENTUM_DURATION_BY_KIND: Record<MomentumKind, number> = {
  minor: 2,
  major: 3,
  career: 4,
};

export const MAX_MOMENTUM_EVENTS_PER_YEAR = 5;
export const WEEKS_PER_YEAR = 52;

export function getYearIndex(week: number): number {
  return Math.floor((week - 1) / WEEKS_PER_YEAR);
}
