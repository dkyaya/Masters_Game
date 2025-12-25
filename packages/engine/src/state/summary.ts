export type SummaryItem = {
  label: string;
  value: string | number | null;
};

export type SummarySection = {
  title: string;
  items: SummaryItem[];
};

export type SummaryListSection = {
  title: string;
  items: string[];
};

export type SummaryPayload = {
  careerSnapshot: SummarySection;
  financialSummary: SummarySection;
  musicPerformance: SummarySection;
  industryContext?: SummarySection;
  notificationsAndEvents: SummaryListSection;
};

export type SummaryInput = {
  careerSnapshotItems?: SummaryItem[];
  financialSummaryItems?: SummaryItem[];
  musicPerformanceItems?: SummaryItem[];
  industryContext?: SummarySection;
  notifications?: string[];
  events?: string[];
};

export function createSummary(input?: SummaryInput): SummaryPayload {
  const notificationsAndEvents = [
    ...(input?.notifications ?? []),
    ...(input?.events ?? []),
  ];

  return {
    careerSnapshot: {
      title: "Career Snapshot",
      items: input?.careerSnapshotItems ?? [],
    },
    financialSummary: {
      title: "Financial Summary",
      items: input?.financialSummaryItems ?? [],
    },
    musicPerformance: {
      title: "Music Performance",
      items: input?.musicPerformanceItems ?? [],
    },
    industryContext: input?.industryContext,
    notificationsAndEvents: {
      title: "Notifications & Events",
      items: notificationsAndEvents,
    },
  };
}
