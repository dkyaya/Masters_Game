import type { MomentumEvent, MomentumState } from "../state/momentum";
import {
  getYearIndex,
  MAX_MOMENTUM_EVENTS_PER_YEAR,
  MOMENTUM_DURATION_BY_KIND,
} from "../state/momentum";

export type MomentumUpdateResult = {
  momentum: MomentumState;
  triggeredEvent?: MomentumEvent;
};

function selectMomentumEvent(events: MomentumEvent[]): MomentumEvent | undefined {
  if (events.length === 0) {
    return undefined;
  }

  return events.reduce((best, current) =>
    current.successScore > best.successScore ? current : best,
  );
}

export function updateMomentum(
  current: MomentumState,
  week: number,
  events: MomentumEvent[],
): MomentumUpdateResult {
  const yearIndex = getYearIndex(week);
  const hadMomentum = current.active;

  let eventsThisYear = current.eventsThisYear;
  if (current.yearIndex !== yearIndex) {
    eventsThisYear = 0;
  }

  let active = current.active;
  let weeksRemaining = current.weeksRemaining;
  let kind = current.kind;

  if (active) {
    weeksRemaining = Math.max(0, weeksRemaining - 1);
    if (weeksRemaining === 0) {
      active = false;
      kind = undefined;
    }
  }

  let triggeredEvent: MomentumEvent | undefined;

  if (!hadMomentum && !active && eventsThisYear < MAX_MOMENTUM_EVENTS_PER_YEAR) {
    const qualifying = events.filter((event) => event.qualifies);
    const chosen = selectMomentumEvent(qualifying);
    if (chosen) {
      active = true;
      kind = chosen.kind;
      weeksRemaining = MOMENTUM_DURATION_BY_KIND[chosen.kind];
      eventsThisYear += 1;
      triggeredEvent = chosen;
    }
  }

  return {
    momentum: {
      active,
      weeksRemaining,
      kind,
      eventsThisYear,
      yearIndex,
    },
    triggeredEvent,
  };
}
