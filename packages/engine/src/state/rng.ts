export type RngState = {
  seed: number;
};

export function createRng(seed = 1): RngState {
  const normalized = seed >>> 0;
  return {
    seed: normalized === 0 ? 1 : normalized,
  };
}

export function nextFloat(rng: RngState): [number, RngState] {
  let x = rng.seed;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  const nextSeed = x >>> 0;
  return [nextSeed / 4294967296, { seed: nextSeed }];
}

export function nextRange(
  rng: RngState,
  min: number,
  max: number,
): [number, RngState] {
  const [value, next] = nextFloat(rng);
  return [min + value * (max - min), next];
}
