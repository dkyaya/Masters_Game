import { createSummary } from "./summary";
import type { SummaryPayload } from "./summary";
import { createRng, type RngState } from "./rng";
import type { FanbaseState } from "./fanbase";
import { tierForFanbase } from "../rules/fameTiers";
import type { FameTier } from "../rules/fameTiers";
import type { MomentumState } from "./momentum";
import { getYearIndex } from "./momentum";
import { createEmptyWeeklyInputs, type WeeklyInputs } from "./weeklyInputs";
import type { MusicState } from "./music";

export type TransientState = {
  notifications: string[];
  events: string[];
};

export type GameState = {
  week: number;
  rng: RngState;
  fanbase: FanbaseState;
  fameTier: FameTier;
  momentum: MomentumState;
  weeklyInputs: WeeklyInputs;
  music: MusicState;
  transient: TransientState;
  summary: SummaryPayload;
};

export function createInitialState(seed?: number): GameState {
  const transient: TransientState = {
    notifications: [],
    events: [],
  };

  const fanbase: FanbaseState = {
    total: 0,
  };

  const fameTier = tierForFanbase(fanbase.total);

  return {
    week: 1,
    rng: createRng(seed),
    fanbase,
    fameTier,
    momentum: {
      active: false,
      weeksRemaining: 0,
      kind: undefined,
      eventsThisYear: 0,
      yearIndex: getYearIndex(1),
    },
    weeklyInputs: createEmptyWeeklyInputs(),
    music: {
      activeProject: undefined,
      nextProjectId: 1,
    },
    transient,
    summary: createSummary({
      notifications: transient.notifications,
      events: transient.events,
    }),
  };
}
