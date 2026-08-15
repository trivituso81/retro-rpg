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

/** 32×32 tiles at 512×448 ≈ same on-screen tile count as SNES 16×16 @ 256×224, with 4× pixel detail. */
export const TILE_SIZE = 32;

/** Ocean wave animation period (~500ms at 60Hz ≈ 30 frames). */
export const OCEAN_FRAME_MS = 500;

/**
 * Fixed 24-color Super Famicom overworld palette.
 * Muted / slightly desaturated — closer to FF6 / Chrono Trigger than NES neons.
 * Every drawn pixel must come from this list. No gradients.
 */
export const PALETTE = [
  '#1b1f2a', // 0  near-black outline
  '#1e3a5c', // 1  ocean deep
  '#2f5f8a', // 2  ocean mid
  '#4a87b0', // 3  ocean light / wave
  '#6aa6b8', // 4  shallow water
  '#c9dde8', // 5  foam / snow bright
  '#4a5568', // 6  mountain shadow
  '#7a8494', // 7  mountain mid
  '#b8c0cc', // 8  stone light / snow mid
  '#3d5c38', // 9  grass dark (olive)
  '#5a7d45', // 10 grass mid
  '#7a9a55', // 11 grass light
  '#2a4530', // 12 forest canopy dark
  '#1a2e24', // 13 forest deepest / trunk
  '#8a6a48', // 14 dirt / road
  '#c4a06a', // 15 sand / beach
  '#dcc898', // 16 sand light / worn path
  '#6e3b2e', // 17 roof / brick dark
  '#a05040', // 18 roof mid / town
  '#c87840', // 19 warm accent
  '#e8c878', // 20 window / lamp
  '#3a3040', // 21 cool shadow
  '#5a4060', // 22 castle trim
  '#eef2f6', // 23 snow tip / highlight
] as const;

export type PaletteIndex = number;

/** Numeric tile IDs stored in the parsed map. */
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
};

export const MAP_WIDTH = 64;
export const MAP_HEIGHT = 56;

/** Default camera focus (tile coords) until the player exists. */
export const PHASE2_CAMERA_TILE_X = 28;
export const PHASE2_CAMERA_TILE_Y = 24;
