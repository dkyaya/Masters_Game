export type MusicProjectType = "Single" | "Album";

export type MusicPhase =
  | "Direction"
  | "Production"
  | "Iteration"
  | "Cohesion"
  | "ReleaseReady";

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

export type CohesionLevel = "Low" | "Medium" | "High";

export type ReleasedProject = {
  id: string;
  type: MusicProjectType;
  releasedWeek: number;
  quality: number;
  cohesion?: CohesionLevel;
  hasTraction: boolean;
};

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
  cohesion?: CohesionLevel;
  focusAdjustments: number;
  weeklyRefinementCost: number;
};

export type MusicState = {
  activeProject?: MusicProject;
  nextProjectId: number;
  releasedProjects: ReleasedProject[];
};
