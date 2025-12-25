export type MusicProjectType = "Single";

export type MusicPhase = "Direction" | "Production" | "Iteration" | "ReleaseReady";

export type CreativeDirection =
  | "Safe"
  | "TrendChasing"
  | "Experimental"
  | "Personal"
  | "VisualFirst";

export type FocusLevel = "Emphasize" | "Balanced" | "DeEmphasize";

export type ProductionFocus = {
  writing: FocusLevel;
  performance: FocusLevel;
  polish: FocusLevel;
};

export type QualityLabel = "Rough" | "Solid" | "Polished";

export type MusicProject = {
  id: string;
  type: MusicProjectType;
  phase: MusicPhase;
  createdWeek: number;
  lastUpdatedWeek: number;
  direction?: CreativeDirection;
  productionFocus?: ProductionFocus;
  quality: number;
  qualityCap: number;
  qualityLabel: QualityLabel;
  weeklyRefinementCost: number;
};

export type MusicState = {
  activeProject?: MusicProject;
  nextProjectId: number;
};
