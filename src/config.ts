/** All tunable constants in one place. */

export const INTERNAL_WIDTH = 256;
export const INTERNAL_HEIGHT = 224;

/** Fixed logic rate (Hz). */
export const TICK_RATE = 60;
export const TICK_MS = 1000 / TICK_RATE;

/** Clamp frame delta to avoid spiral-of-death after backgrounding. */
export const MAX_FRAME_DELTA_MS = 100;

/** Show FPS counter in the corner when true. */
export const DEBUG_FPS = true;

/** Minimum preferred integer scale; fall back to fractional below this. */
export const MIN_INTEGER_SCALE = 2;

export const TILE_SIZE = 16;

/** Ocean wave animation period (~500ms at 60Hz ≈ 30 frames). */
export const OCEAN_FRAME_MS = 500;

/**
 * Fixed 24-color SNES-style overworld palette.
 * Every drawn pixel must come from this list. No gradients.
 */
export const PALETTE = [
  '#1a1c2c', // 0  near-black
  '#2d2b55', // 1  deep indigo (ocean deep)
  '#3b5dc9', // 2  ocean mid
  '#41a6f6', // 3  ocean light / wave
  '#5fcde4', // 4  shallow water
  '#94e2ff', // 5  foam / snow highlight
  '#566c86', // 6  mountain shadow
  '#8b9bb4', // 7  mountain mid / stone
  '#c0cbdc', // 8  peak snow / light stone
  '#3e8948', // 9  grass dark
  '#63c74d', // 10 grass mid
  '#a7f070', // 11 grass light
  '#265c42', // 12 forest dark
  '#193c3e', // 13 forest deepest / outline
  '#b86f50', // 14 dirt / road
  '#e4a672', // 15 sand / beach
  '#f4dfa2', // 16 sand light / path highlight
  '#8c3f2d', // 17 roof / castle brick dark
  '#c6513a', // 18 roof mid / town marker
  '#f77622', // 19 accent warm
  '#ffcd75', // 20 accent light / window
  '#2a2340', // 21 purple-brown shadow
  '#5d275d', // 22 castle trim
  '#ffffff', // 23 pure white (debug / snow tip)
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
export const PHASE2_CAMERA_TILE_X = 32;
export const PHASE2_CAMERA_TILE_Y = 28;
