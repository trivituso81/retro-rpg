/** All tunable constants in one place. */

export const INTERNAL_WIDTH = 512;
export const INTERNAL_HEIGHT = 448;

/** Fixed logic rate (Hz). */
export const TICK_RATE = 60;
export const TICK_MS = 1000 / TICK_RATE;

/** Clamp frame delta to avoid spiral-of-death after backgrounding. */
export const MAX_FRAME_DELTA_MS = 100;

/** Show FPS counter in the corner when true. */
export const DEBUG_FPS = true;

/** Minimum preferred integer scale; fall back to fractional below this. */
export const MIN_INTEGER_SCALE = 2;

/** Classic 16×16 overworld tiles (real art atlas). */
export const TILE_SIZE = 16;

/** Ocean wave animation period. */
export const OCEAN_FRAME_MS = 500;

/**
 * Kept for icon generation / debug text. Game tiles now come from
 * `public/tiles/punyworld-overworld-tileset.png` (CC0 — Shade / Merchant Shade).
 */
export const PALETTE = [
  '#1b1f2a',
  '#1e3a5c',
  '#2f5f8a',
  '#4a87b0',
  '#6aa6b8',
  '#c9dde8',
  '#4a5568',
  '#7a8494',
  '#b8c0cc',
  '#3d5c38',
  '#5a7d45',
  '#7a9a55',
  '#2a4530',
  '#1a2e24',
  '#8a6a48',
  '#c4a06a',
  '#dcc898',
  '#6e3b2e',
  '#a05040',
  '#c87840',
  '#e8c878',
  '#3a3040',
  '#5a4060',
  '#eef2f6',
] as const;

export type PaletteIndex = number;

export const TileId = {
  Grass: 0,
  TallGrass: 1,
  Forest: 2,
  Mountain: 3,
  Peak: 4,
  Ocean: 5,
  Shallow: 6,
  Beach: 7,
  Road: 8,
  Bridge: 9,
  Town: 10,
  Castle: 11,
  Cave: 12,
} as const;

export type TileIdValue = (typeof TileId)[keyof typeof TileId];

export const TILE_CHAR: Record<string, TileIdValue> = {
  '.': TileId.Grass,
  ',': TileId.TallGrass,
  T: TileId.Forest,
  '^': TileId.Mountain,
  A: TileId.Peak,
  '~': TileId.Ocean,
  s: TileId.Shallow,
  b: TileId.Beach,
  r: TileId.Road,
  B: TileId.Bridge,
  t: TileId.Town,
  c: TileId.Castle,
  v: TileId.Cave,
};

export const PASSABLE: Record<TileIdValue, boolean> = {
  [TileId.Grass]: true,
  [TileId.TallGrass]: true,
  [TileId.Forest]: false,
  [TileId.Mountain]: false,
  [TileId.Peak]: false,
  [TileId.Ocean]: false,
  [TileId.Shallow]: false,
  [TileId.Beach]: true,
  [TileId.Road]: true,
  [TileId.Bridge]: true,
  [TileId.Town]: true,
  [TileId.Castle]: false,
  [TileId.Cave]: true,
};

/** Landmark footprint is always 2×2 tiles (NW anchor in map data). */
export const LANDMARK_SIZE = 2;

export const MAP_WIDTH = 64;
export const MAP_HEIGHT = 56;

/** Scenic camera focus — mountain pass town + castle approach. */
export const PHASE2_CAMERA_TILE_X = 32;
export const PHASE2_CAMERA_TILE_Y = 18;

export const TILESET_URL = '/tiles/punyworld-overworld-tileset.png';
