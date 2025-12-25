import { describe, expect, it } from "vitest";
import { createInitialState } from "../src/state/gameState";
import {
  refineProject,
  releaseAlbum,
  releaseSingle,
  setAlbumCohesion,
  setCreativeDirection,
  setProductionFocus,
  startAlbumProject,
  startSingleProject,
} from "../src/systems/music";
import type { ProductionFocus } from "../src/state/music";

const balancedFocus: ProductionFocus = {
  writing: "Balanced",
  performance: "Balanced",
  polish: "Balanced",
};

describe("single music flow", () => {
  it("progresses to release and emits a release outcome", () => {
    let state = createInitialState(1);

    state = startSingleProject(state, { qualityCap: 0.96 });
    state = setCreativeDirection(state, "Safe");
    state = setProductionFocus(state, balancedFocus);
    state = refineProject(state);

    expect(state.music.activeProject?.phase).toBe("ReleaseReady");
    expect(state.music.activeProject?.qualityLabel).toBe("Solid");

    state = releaseSingle(state);

    expect(state.music.activeProject).toBeUndefined();
    expect(state.weeklyInputs.releases).toHaveLength(1);
    expect(state.weeklyInputs.releases[0].quality).toBeCloseTo(0.96, 5);
    expect(state.transient.events).toContain("Single released");
  });
});

describe("album music flow", () => {
  it("adds cohesion before release", () => {
    let state = createInitialState(1);

    state = startAlbumProject(state, { qualityCap: 0.96 });
    state = setCreativeDirection(state, "Safe");
    state = setProductionFocus(state, balancedFocus);
    state = refineProject(state);

    expect(state.music.activeProject?.phase).toBe("Cohesion");

    state = setAlbumCohesion(state, { cohesion: "High" });

    expect(state.music.activeProject?.phase).toBe("ReleaseReady");
    expect(state.music.activeProject?.cohesion).toBe("High");

    state = releaseAlbum(state);

    expect(state.music.activeProject).toBeUndefined();
    expect(state.weeklyInputs.releases).toHaveLength(1);
    expect(state.weeklyInputs.releases[0].type).toBe("Album");
    expect(state.transient.events).toContain("Album released");
  });
});
