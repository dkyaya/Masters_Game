import type { GameState, TransientState } from "../state/gameState";
import { createSummary } from "../state/summary";
import { createEmptyWeeklyInputs } from "../state/weeklyInputs";
import type { SummaryItem } from "../state/summary";
import { runWeeklySystems } from "./weekly";
import { compareFameTier } from "../rules/fameTiers";
import { burnoutWarning } from "../rules/burnout";

function resetTransient(): TransientState {
  return {
    notifications: [],
    events: [],
  };
}

function formatSignedInt(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.abs(value)}`;
}

export function advanceWeek(state: GameState): GameState {
  const afterSystems = runWeeklySystems(state);
  const fanbaseDelta = afterSystems.fanbase.total - state.fanbase.total;
  const fameComparison = compareFameTier(afterSystems.fameTier, state.fameTier);
  const fameChange = fameComparison === 0 ? "—" : fameComparison > 0 ? "↑" : "↓";

  const careerSnapshotItems: SummaryItem[] = [
    { label: "Fame change", value: fameChange },
    { label: "Fanbase change", value: formatSignedInt(fanbaseDelta) },
    {
      label: "Momentum status",
      value: afterSystems.momentum.active ? "Active" : null,
    },
    {
      label: "Burnout pressure",
      value: burnoutWarning(afterSystems.burnout.value),
    },
  ];

  const summary = createSummary({
    careerSnapshotItems,
    notifications: afterSystems.transient.notifications,
    events: afterSystems.transient.events,
  });

  return {
    ...afterSystems,
    week: afterSystems.week + 1,
    weeklyInputs: createEmptyWeeklyInputs(),
    transient: resetTransient(),
    summary,
  };
}
