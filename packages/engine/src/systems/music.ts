import type { GameState } from "../state/gameState";
import type {
  CreativeDirection,
  MusicProject,
  MusicState,
  ProductionFocus,
} from "../state/music";
import type { ReleaseOutcome } from "../state/weeklyInputs";
import {
  BURNOUT_REFINEMENT_MULTIPLIER,
  REFINEMENT_DELTA,
  DEFAULT_FOCUS_ADJUST_PENALTY,
  DEFAULT_REFINEMENT_COST,
  baseQualityForDirection,
  QUALITY_MAX,
  QUALITY_MIN,
  clampQuality,
  qualityLabelForQuality,
} from "../rules/musicQuality";
import {
  DEFAULT_FAME_MULTIPLIER,
  DEFAULT_HYPE_MATCH,
  baseReachForTier,
} from "../rules/releaseDefaults";

export type StartSingleParams = {
  initialQuality?: number;
  qualityCap?: number;
  weeklyRefinementCost?: number;
};

export type RefineProjectParams = {
  refinementDelta?: number;
  burnoutMultiplier?: number;
};

export type AdjustFocusParams = {
  penalty?: number;
};

export type ReleaseParams = {
  baseReach?: number;
  hypeMatch?: number;
  fameMultiplier?: number;
};

function buildProjectId(state: MusicState): string {
  return `single-${state.nextProjectId}`;
}

function updateActiveProject(
  state: GameState,
  project: MusicProject,
): GameState {
  return {
    ...state,
    music: {
      ...state.music,
      activeProject: project,
    },
  };
}

export function startSingleProject(
  state: GameState,
  params?: StartSingleParams,
): GameState {
  if (state.music.activeProject) {
    return state;
  }

  const quality = clampQuality(params?.initialQuality ?? QUALITY_MIN);
  const qualityCap = clampQuality(params?.qualityCap ?? QUALITY_MAX);
  const project: MusicProject = {
    id: buildProjectId(state.music),
    type: "Single",
    phase: "Direction",
    createdWeek: state.week,
    lastUpdatedWeek: state.week,
    quality,
    qualityCap,
    qualityLabel: qualityLabelForQuality(quality),
    weeklyRefinementCost: params?.weeklyRefinementCost ?? DEFAULT_REFINEMENT_COST,
  };

  return {
    ...state,
    music: {
      activeProject: project,
      nextProjectId: state.music.nextProjectId + 1,
    },
  };
}

export function setCreativeDirection(
  state: GameState,
  direction: CreativeDirection,
): GameState {
  const project = state.music.activeProject;
  if (!project || project.phase !== "Direction") {
    return state;
  }

  const baseQuality = clampQuality(baseQualityForDirection(direction));
  const quality = Math.min(baseQuality, project.qualityCap);
  const nextProject: MusicProject = {
    ...project,
    direction,
    phase: "Production",
    quality,
    qualityLabel: qualityLabelForQuality(quality),
    lastUpdatedWeek: state.week,
  };

  return updateActiveProject(state, nextProject);
}

export function setProductionFocus(
  state: GameState,
  productionFocus: ProductionFocus,
): GameState {
  const project = state.music.activeProject;
  if (!project || project.phase !== "Production") {
    return state;
  }

  const nextProject: MusicProject = {
    ...project,
    productionFocus,
    phase: "Iteration",
    lastUpdatedWeek: state.week,
  };

  return updateActiveProject(state, nextProject);
}

export function refineProject(
  state: GameState,
  params?: RefineProjectParams,
): GameState {
  const project = state.music.activeProject;
  if (!project || project.phase !== "Iteration") {
    return state;
  }

  const burnoutMultiplier =
    params?.burnoutMultiplier ?? BURNOUT_REFINEMENT_MULTIPLIER.LOW;
  const baseDelta = REFINEMENT_DELTA[project.qualityLabel];
  const delta = (params?.refinementDelta ?? baseDelta) * burnoutMultiplier;
  const nextQuality = clampQuality(
    Math.min(project.qualityCap, project.quality + delta),
  );
  const nextPhase =
    nextQuality >= project.qualityCap ? "ReleaseReady" : "Iteration";

  const nextProject: MusicProject = {
    ...project,
    phase: nextPhase,
    quality: nextQuality,
    qualityLabel: qualityLabelForQuality(nextQuality),
    lastUpdatedWeek: state.week,
  };

  return updateActiveProject(state, nextProject);
}

export function adjustProductionFocus(
  state: GameState,
  productionFocus: ProductionFocus,
  params?: AdjustFocusParams,
): GameState {
  const project = state.music.activeProject;
  if (!project || project.phase !== "Iteration") {
    return state;
  }

  const penalty = params?.penalty ?? DEFAULT_FOCUS_ADJUST_PENALTY;
  const nextQuality = clampQuality(project.quality - penalty);

  const nextProject: MusicProject = {
    ...project,
    productionFocus,
    quality: nextQuality,
    qualityLabel: qualityLabelForQuality(nextQuality),
    lastUpdatedWeek: state.week,
  };

  return updateActiveProject(state, nextProject);
}

export function prepareRelease(state: GameState): GameState {
  const project = state.music.activeProject;
  if (!project || project.phase !== "Iteration") {
    return state;
  }

  return updateActiveProject(state, {
    ...project,
    phase: "ReleaseReady",
    lastUpdatedWeek: state.week,
  });
}

export function delayRelease(state: GameState): GameState {
  const project = state.music.activeProject;
  if (!project || project.phase !== "ReleaseReady") {
    return state;
  }

  return updateActiveProject(state, {
    ...project,
    phase: "Iteration",
    lastUpdatedWeek: state.week,
  });
}

export function releaseSingle(
  state: GameState,
  params?: ReleaseParams,
): GameState {
  const project = state.music.activeProject;
  if (!project || project.phase !== "ReleaseReady") {
    return state;
  }

  const releaseOutcome: ReleaseOutcome = {
    baseReach: params?.baseReach ?? baseReachForTier(state.fameTier),
    quality: project.quality,
    hypeMatch: params?.hypeMatch ?? DEFAULT_HYPE_MATCH,
    fameMultiplier: params?.fameMultiplier ?? DEFAULT_FAME_MULTIPLIER,
  };

  return {
    ...state,
    music: {
      ...state.music,
      activeProject: undefined,
    },
    weeklyInputs: {
      ...state.weeklyInputs,
      releases: [...state.weeklyInputs.releases, releaseOutcome],
    },
    transient: {
      ...state.transient,
      events: [...state.transient.events, "Single released"],
    },
  };
}

export function scrapProject(state: GameState): GameState {
  const project = state.music.activeProject;
  if (!project) {
    return state;
  }

  return {
    ...state,
    music: {
      ...state.music,
      activeProject: undefined,
    },
    transient: {
      ...state.transient,
      events: [...state.transient.events, "Project scrapped"],
    },
  };
}
