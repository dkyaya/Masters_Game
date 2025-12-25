import { useCallback, useState } from "react";
import { advanceWeek, createInitialState } from "@engine";
import type { GameState } from "@engine";

export function useGame(): { state: GameState; nextWeek: () => void } {
  const [state, setState] = useState<GameState>(() => createInitialState());

  const nextWeek = useCallback(() => {
    setState((current) => advanceWeek(current));
  }, []);

  return { state, nextWeek };
}
