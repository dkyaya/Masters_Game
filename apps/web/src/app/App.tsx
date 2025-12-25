// apps/web/src/app/App.tsx
import { SummaryScreen } from "./SummaryScreen";
import { useGame } from "@/hooks/useGame";

export default function App() {
  const { state, nextWeek } = useGame();
  return <SummaryScreen state={state} onNextWeek={nextWeek} />;
}
