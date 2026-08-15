/**
 * Procedural tile atlas generation.
 *
 * Swap point: replace `createTileset()` with a loader that draws a real
 * `tileset.png` into the same atlas layout. If replacing with real art,
 * use CC0 assets (Kenney, OpenGameArt, itch.io free tilesets).
 * Do not use ripped Nintendo or Square Enix sprites.
 */

import {
  OCEAN_FRAME_MS,
  PALETTE,
  TILE_SIZE,
  TileId,
  type TileIdValue,
} from '../config';

export type Tileset = {
  atlas: HTMLCanvasElement;
  /** Number of ocean animation frames in the atlas (horizontal). */
  oceanFrames: number;
  tick(nowMs: number): void;
  drawTile(
    ctx: CanvasRenderingContext2D,
    tileId: TileIdValue,
    dx: number,
    dy: number,
  ): void;
};

const ATLAS_COLS = 8;
const ATLAS_ROWS = 2;
/** Ocean occupies two frames in the atlas. */
const OCEAN_COL_FRAME0 = 5;
const OCEAN_COL_FRAME1 = 6;

function hex(i: number): string {
  return PALETTE[i] ?? PALETTE[0];
}

/** Deterministic 0..1 hash from tile seed + pixel coords. */
function dither(seed: number, x: number, y: number): number {
  let n = (seed * 374761393 + x * 668265263 + y * 2147483647) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n >>> 0) % 1000) / 1000;
}

function px(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: number,
): void {
  ctx.fillStyle = hex(color);
  ctx.fillRect(x, y, 1, 1);
}

function fill(
  ctx: CanvasRenderingContext2D,
  color: number,
  x = 0,
  y = 0,
  w = TILE_SIZE,
  h = TILE_SIZE,
): void {
  ctx.fillStyle = hex(color);
  ctx.fillRect(x, y, w, h);
}

function drawGrass(ctx: CanvasRenderingContext2D, seed: number): void {
  fill(ctx, 10);
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const d = dither(seed, x, y);
      if (d < 0.12) px(ctx, x, y, 9);
      else if (d > 0.88) px(ctx, x, y, 11);
    }
  }
}

function drawTallGrass(ctx: CanvasRenderingContext2D, seed: number): void {
  fill(ctx, 9);
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const d = dither(seed, x, y);
      if (d < 0.2) px(ctx, x, y, 12);
      else if (d > 0.75 && (x + y) % 3 === 0) px(ctx, x, y, 10);
      if ((x + y * 2) % 5 === 0 && d > 0.4) px(ctx, x, y, 13);
    }
  }
}

function drawForest(ctx: CanvasRenderingContext2D, seed: number): void {
  fill(ctx, 12);
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const d = dither(seed, x, y);
      if (d < 0.25) px(ctx, x, y, 13);
      else if (d > 0.85) px(ctx, x, y, 9);
    }
  }
  // Canopy blobs
  for (const [cx, cy, r] of [
    [4, 5, 3],
    [11, 4, 3],
    [8, 10, 4],
    [3, 11, 2],
  ] as const) {
    for (let y = cy - r; y <= cy + r; y++) {
      for (let x = cx - r; x <= cx + r; x++) {
        if (x < 0 || y < 0 || x >= TILE_SIZE || y >= TILE_SIZE) continue;
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy <= r * r) {
          px(ctx, x, y, dither(seed, x, y) < 0.35 ? 13 : 12);
        }
      }
    }
  }
  // Trunk hints
  fill(ctx, 21, 7, 12, 2, 4);
  fill(ctx, 21, 4, 13, 1, 2);
}

function drawMountain(ctx: CanvasRenderingContext2D, seed: number): void {
  fill(ctx, 6);
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const ridge = Math.abs(x - 8) + y * 0.4;
      const d = dither(seed, x, y);
      if (ridge < 6) px(ctx, x, y, d < 0.3 ? 7 : 8);
      else if (ridge < 10) px(ctx, x, y, d < 0.5 ? 6 : 7);
      else if (d < 0.15) px(ctx, x, y, 7);
    }
  }
  // Slope hatching
  for (let i = 0; i < 8; i++) {
    px(ctx, 2 + i, 10 + (i % 3), 0);
    px(ctx, 10 + (i % 4), 12 + (i % 2), 0);
  }
}

function drawPeak(ctx: CanvasRenderingContext2D, seed: number): void {
  drawMountain(ctx, seed + 17);
  // Snow cap
  for (let y = 0; y < 7; y++) {
    for (let x = 5 - y; x <= 10 + y; x++) {
      if (x < 0 || x >= TILE_SIZE) continue;
      const d = dither(seed, x, y);
      px(ctx, x, y, d < 0.2 ? 5 : d < 0.7 ? 8 : 23);
    }
  }
}

function drawOcean(
  ctx: CanvasRenderingContext2D,
  seed: number,
  frame: 0 | 1,
): void {
  fill(ctx, 1);
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const d = dither(seed, x, y);
      if (d < 0.08) px(ctx, x, y, 0);
      else if (d > 0.92) px(ctx, x, y, 2);
    }
  }
  // Horizontal wave line — shifts by frame
  const waveY = 6 + frame * 2;
  for (let x = 0; x < TILE_SIZE; x++) {
    const bump = ((x + frame * 3) % 4) - 1;
    px(ctx, x, waveY + bump, 3);
    if (x % 3 === frame) px(ctx, x, waveY + bump + 1, 2);
  }
  const waveY2 = 12 - frame;
  for (let x = 0; x < TILE_SIZE; x++) {
    const bump = ((x + 2 - frame * 2) % 5) - 2;
    if ((x + frame) % 2 === 0) px(ctx, x, waveY2 + bump, 2);
  }
}

function drawShallow(ctx: CanvasRenderingContext2D, seed: number): void {
  fill(ctx, 4);
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const d = dither(seed, x, y);
      if (d < 0.15) px(ctx, x, y, 3);
      else if (d > 0.85) px(ctx, x, y, 5);
      if ((x + y) % 7 === 0) px(ctx, x, y, 2);
    }
  }
}

function drawBeach(ctx: CanvasRenderingContext2D, seed: number): void {
  fill(ctx, 15);
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const d = dither(seed, x, y);
      if (d < 0.1) px(ctx, x, y, 14);
      else if (d > 0.9) px(ctx, x, y, 16);
    }
  }
}

function drawRoad(ctx: CanvasRenderingContext2D, seed: number): void {
  fill(ctx, 14);
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const d = dither(seed, x, y);
      if (d < 0.12) px(ctx, x, y, 21);
      else if (d > 0.88) px(ctx, x, y, 15);
    }
  }
  // Center worn strip
  fill(ctx, 15, 6, 0, 4, TILE_SIZE);
  for (let y = 0; y < TILE_SIZE; y += 2) {
    px(ctx, 7, y, 16);
  }
}

function drawBridge(ctx: CanvasRenderingContext2D, _seed: number): void {
  fill(ctx, 2);
  // Planks
  fill(ctx, 14, 2, 0, 12, TILE_SIZE);
  for (let y = 1; y < TILE_SIZE; y += 3) {
    fill(ctx, 21, 2, y, 12, 1);
  }
  // Rails
  fill(ctx, 17, 1, 0, 1, TILE_SIZE);
  fill(ctx, 17, 14, 0, 1, TILE_SIZE);
}

function drawTown(ctx: CanvasRenderingContext2D, seed: number): void {
  drawGrass(ctx, seed);
  // Small house marker
  fill(ctx, 7, 3, 7, 10, 7);
  fill(ctx, 18, 2, 4, 12, 4);
  // Roof peak
  for (let i = 0; i < 6; i++) {
    fill(ctx, 17, 7 - i, 3 + i, 2 + i * 2, 1);
  }
  px(ctx, 7, 10, 20);
  px(ctx, 8, 10, 20);
}

function drawCastle(ctx: CanvasRenderingContext2D, seed: number): void {
  drawGrass(ctx, seed);
  fill(ctx, 7, 2, 6, 12, 10);
  fill(ctx, 8, 3, 5, 10, 2);
  // Battlements
  for (let x = 2; x < 14; x += 3) {
    fill(ctx, 7, x, 3, 2, 3);
  }
  // Gate
  fill(ctx, 0, 6, 10, 4, 6);
  // Banner
  fill(ctx, 22, 7, 1, 2, 4);
  px(ctx, 7, 1, 18);
  px(ctx, 8, 1, 18);
}

type DrawFn = (ctx: CanvasRenderingContext2D, seed: number) => void;

const DRAWERS: Record<TileIdValue, DrawFn> = {
  [TileId.Grass]: drawGrass,
  [TileId.TallGrass]: drawTallGrass,
  [TileId.Forest]: drawForest,
  [TileId.Mountain]: drawMountain,
  [TileId.Peak]: drawPeak,
  [TileId.Ocean]: (ctx, seed) => drawOcean(ctx, seed, 0),
  [TileId.Shallow]: drawShallow,
  [TileId.Beach]: drawBeach,
  [TileId.Road]: drawRoad,
  [TileId.Bridge]: drawBridge,
  [TileId.Town]: drawTown,
  [TileId.Castle]: drawCastle,
};

function atlasIndex(tileId: TileIdValue): { col: number; row: number } {
  // Pack tile IDs into atlas; ocean frame 1 is a special second slot.
  if (tileId === TileId.Ocean) return { col: OCEAN_COL_FRAME0, row: 0 };
  if (tileId <= 4) return { col: tileId, row: 0 };
  // Shallow=6 → col 7 row 0; Beach=7 → col 0 row 1; etc.
  if (tileId === TileId.Shallow) return { col: 7, row: 0 };
  return { col: tileId - TileId.Beach, row: 1 };
}

/**
 * Build the procedural atlas. Later: swap this body for image loading
 * while keeping the same `Tileset` interface.
 */
export function createTileset(): Tileset {
  const atlas = document.createElement('canvas');
  atlas.width = ATLAS_COLS * TILE_SIZE;
  atlas.height = ATLAS_ROWS * TILE_SIZE;
  const ctx = atlas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Failed to create tileset atlas context');
  ctx.imageSmoothingEnabled = false;

  const tileIds = Object.values(TileId) as TileIdValue[];
  for (const id of tileIds) {
    if (id === TileId.Ocean) continue; // drawn below with frames
    const { col, row } = atlasIndex(id);
    ctx.save();
    ctx.translate(col * TILE_SIZE, row * TILE_SIZE);
    DRAWERS[id](ctx, id * 97 + 13);
    ctx.restore();
  }

  // Ocean frames
  ctx.save();
  ctx.translate(OCEAN_COL_FRAME0 * TILE_SIZE, 0);
  drawOcean(ctx, 505, 0);
  ctx.restore();
  ctx.save();
  ctx.translate(OCEAN_COL_FRAME1 * TILE_SIZE, 0);
  drawOcean(ctx, 505, 1);
  ctx.restore();

  let oceanFrame = 0;

  return {
    atlas,
    oceanFrames: 2,
    tick(nowMs: number) {
      oceanFrame = Math.floor(nowMs / OCEAN_FRAME_MS) % 2;
    },
    drawTile(dest, tileId, dx, dy) {
      let col: number;
      let row: number;
      if (tileId === TileId.Ocean) {
        col = oceanFrame === 0 ? OCEAN_COL_FRAME0 : OCEAN_COL_FRAME1;
        row = 0;
      } else {
        ({ col, row } = atlasIndex(tileId));
      }
      dest.drawImage(
        atlas,
        col * TILE_SIZE,
        row * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        dx,
        dy,
        TILE_SIZE,
        TILE_SIZE,
      );
    },
  };
}
