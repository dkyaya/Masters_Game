// apps/web/src/app/SummaryScreen.tsx
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { GameState, SummarySection } from "@engine";

interface Props {
  state: GameState;
  onNextWeek: () => void;
}

function SummarySectionCard({ section }: { section: SummarySection }) {
  const hasItems = section.items.length > 0;

  return (
    <Card className="p-4 space-y-2">
      <h2 className="font-medium">{section.title}</h2>
      {hasItems ? (
        <div className="space-y-1">
          {section.items.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex gap-3">
              <span className="w-44 text-sm text-muted-foreground">
                {item.label}
              </span>
              <span className="text-sm">{item.value ?? "—"}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">—</div>
      )}
    </Card>
  );
}

export function SummaryScreen({ state, onNextWeek }: Props) {
  const { summary } = state;
  const notifications = summary.notificationsAndEvents.items;

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold">Week {state.week} Summary</h1>

      <SummarySectionCard section={summary.careerSnapshot} />

      <Separator />

      <SummarySectionCard section={summary.financialSummary} />

      <Separator />

      <SummarySectionCard section={summary.musicPerformance} />

      {summary.industryContext ? (
        <>
          <Separator />
          <SummarySectionCard section={summary.industryContext} />
        </>
      ) : null}

      <Separator />

      <Card className="p-4 space-y-2">
        <h2 className="font-medium">{summary.notificationsAndEvents.title}</h2>
        {notifications.length > 0 ? (
          <div className="space-y-1">
            {notifications.map((item, index) => (
              <div key={`${item}-${index}`} className="text-sm">
                • {item}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">—</div>
        )}
      </Card>

      <button
        onClick={onNextWeek}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Advance Week
      </button>
    </div>
  );
}
