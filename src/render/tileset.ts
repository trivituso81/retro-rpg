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
  oceanFrames: number;
  tick(nowMs: number): void;
  drawTile(
    ctx: CanvasRenderingContext2D,
    tileId: TileIdValue,
    dx: number,
    dy: number,
    tileX?: number,
    tileY?: number,
  ): void;
};

/** Variants per common terrain so adjacent tiles don't look stamped. */
const VARIANTS = 4;

/**
 * Atlas layout (4 cols × 11 rows of 16px):
 * rows 0–4: grass / tall / forest / mountain / peak (4 variants each)
 * rows 5–6: ocean frame 0 / 1 (4 variants)
 * rows 7–9: shallow / beach / road (4 variants)
 * row 10: bridge, town, castle
 */
const ATLAS_COLS = 4;
const ATLAS_ROWS = 11;

function hex(i: number): string {
  return PALETTE[i] ?? PALETTE[0];
}

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
  if (x < 0 || y < 0 || x >= TILE_SIZE || y >= TILE_SIZE) return;
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

/** Checker / Bayer-ish dither between two colors. */
function ditherFill(
  ctx: CanvasRenderingContext2D,
  a: number,
  b: number,
  seed: number,
  density = 0.5,
): void {
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const d = dither(seed, x, y);
      const bayer = ((x & 1) ^ (y & 1)) !== 0 ? 0.08 : -0.08;
      px(ctx, x, y, d + bayer < density ? a : b);
    }
  }
}

function blade(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: number,
): void {
  px(ctx, x, y, color);
  px(ctx, x, y - 1, color);
  if (dither(x * 3 + y, x, y) > 0.5) px(ctx, x, y - 2, color);
}

function drawGrass(ctx: CanvasRenderingContext2D, seed: number): void {
  // Soft vertical value wash (SNES plains often have subtle banding)
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const band = y < 5 ? 11 : y > 11 ? 9 : 10;
      const d = dither(seed, x, y);
      let c = band;
      if (d < 0.1) c = 9;
      else if (d > 0.9) c = 11;
      px(ctx, x, y, c);
    }
  }
  // Tufts / blade clusters — variant shifts placement
  const ox = seed % 4;
  const oy = (seed >> 2) % 3;
  const tufts: Array<[number, number]> = [
    [2 + ox, 4 + oy],
    [7, 3],
    [12 - (ox % 3), 5],
    [4, 9],
    [10 + (oy % 2), 10],
    [1, 13],
    [8, 14],
    [14, 12],
  ];
  for (const [tx, ty] of tufts) {
    blade(ctx, tx, ty, 9);
    if (dither(seed, tx, ty) > 0.4) blade(ctx, tx + 1, ty, 12);
  }
  // Tiny flower accents on some variants
  if (seed % 4 === 2) {
    px(ctx, 5, 7, 20);
    px(ctx, 11, 12, 18);
  }
}

function drawTallGrass(ctx: CanvasRenderingContext2D, seed: number): void {
  ditherFill(ctx, 9, 12, seed, 0.55);
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      if (((x + y + seed) % 3) === 0 && dither(seed, x, y) > 0.35) {
        px(ctx, x, y, 13);
      }
    }
  }
  // Dense vertical strokes
  for (let i = 0; i < 10; i++) {
    const x = (i * 3 + seed) % 15;
    for (let y = 2; y < 15; y++) {
      if ((y + i) % 2 === 0) px(ctx, x, y, 12);
      if ((y + i) % 4 === 0) px(ctx, x + 1, y, 9);
    }
  }
}

function canopyBlob(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  seed: number,
): void {
  for (let y = cy - r; y <= cy + r; y++) {
    for (let x = cx - r; x <= cx + r; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy > r * r) continue;
      const edge = dx * dx + dy * dy > (r - 1) * (r - 1);
      const d = dither(seed, x, y);
      let c = 12;
      if (edge) c = 13;
      else if (d < 0.25) c = 13;
      else if (d > 0.82) c = 9;
      else if (dy < -1 && d > 0.5) c = 10;
      px(ctx, x, y, c);
    }
  }
}

function drawForest(ctx: CanvasRenderingContext2D, seed: number): void {
  fill(ctx, 13);
  // Ground litter under canopy
  for (let y = 10; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      px(ctx, x, y, dither(seed, x, y) < 0.4 ? 12 : 9);
    }
  }
  const shift = seed % 3;
  canopyBlob(ctx, 4 + shift, 5, 4, seed);
  canopyBlob(ctx, 11 - shift, 4, 4, seed + 3);
  canopyBlob(ctx, 8, 9, 5, seed + 7);
  canopyBlob(ctx, 3, 11, 3, seed + 11);
  canopyBlob(ctx, 13, 12, 3, seed + 13);
  // Trunks
  fill(ctx, 21, 7, 11, 2, 5);
  fill(ctx, 0, 7, 11, 1, 5);
  fill(ctx, 21, 3 + shift, 12, 1, 3);
  fill(ctx, 21, 12 - shift, 12, 1, 3);
}

function drawMountain(ctx: CanvasRenderingContext2D, seed: number): void {
  // Base rock with diagonal light from top-left (classic OW cliff read)
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const shade = x + y * 0.6;
      let c = 6;
      if (shade < 8) c = 7;
      if (shade < 4) c = 8;
      if (dither(seed, x, y) < 0.08) c = 0;
      if (dither(seed + 1, x, y) > 0.93) c = 21;
      px(ctx, x, y, c);
    }
  }
  // Ridge line
  for (let x = 0; x < TILE_SIZE; x++) {
    const ry = 3 + ((x + seed) % 4);
    px(ctx, x, ry, 8);
    px(ctx, x, ry + 1, 7);
    if (x % 2 === 0) px(ctx, x, ry - 1, 5);
  }
  // Cliff face cracks
  for (let i = 0; i < 5; i++) {
    const x = 2 + i * 3 + (seed % 2);
    for (let y = 8; y < 15; y++) {
      if ((y + i) % 3 !== 0) px(ctx, x, y, 0);
    }
  }
  // Scree at base
  for (let x = 1; x < 15; x++) {
    if (dither(seed, x, 14) > 0.4) px(ctx, x, 14, 7);
    if (dither(seed, x, 15) > 0.5) px(ctx, x, 15, 6);
  }
}

function drawPeak(ctx: CanvasRenderingContext2D, seed: number): void {
  drawMountain(ctx, seed + 40);
  // Snow cap with soft dither edge
  for (let y = 0; y < 8; y++) {
    const half = 2 + y;
    for (let x = 8 - half; x <= 7 + half; x++) {
      const d = dither(seed, x, y);
      const edge = x === 8 - half || x === 7 + half || y === 7;
      let c = 23;
      if (edge) c = d < 0.5 ? 8 : 5;
      else if (d < 0.2) c = 5;
      else if (d > 0.85) c = 8;
      px(ctx, x, y, c);
    }
  }
  // Wind streaks
  px(ctx, 4, 2, 5);
  px(ctx, 5, 2, 23);
  px(ctx, 10, 3, 5);
}

function drawOcean(
  ctx: CanvasRenderingContext2D,
  seed: number,
  frame: 0 | 1,
): void {
  // Depth banding
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      let c = 1;
      if (y > 10) c = 2;
      const d = dither(seed, x, y);
      if (d < 0.06) c = 0;
      else if (d > 0.94) c = 2;
      px(ctx, x, y, c);
    }
  }
  // Primary wave (shifts with frame)
  const y0 = 5 + frame * 2;
  for (let x = 0; x < TILE_SIZE; x++) {
    const bump = Math.sin((x + frame * 4) * 0.9) > 0 ? 1 : 0;
    px(ctx, x, y0 + bump, 3);
    px(ctx, x, y0 + bump + 1, 2);
    if ((x + frame) % 4 === 0) px(ctx, x, y0 + bump - 1, 4);
  }
  // Secondary quieter swell
  const y1 = 11 - frame;
  for (let x = 0; x < TILE_SIZE; x++) {
    if ((x + seed + frame) % 2 === 0) {
      const bump = (x + frame * 2) % 3 === 0 ? 1 : 0;
      px(ctx, x, y1 + bump, 2);
    }
  }
  // Specular glints
  if (frame === 0) {
    px(ctx, 3, 3, 4);
    px(ctx, 12, 8, 3);
  } else {
    px(ctx, 7, 4, 4);
    px(ctx, 1, 9, 3);
  }
}

function drawShallow(ctx: CanvasRenderingContext2D, seed: number): void {
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const d = dither(seed, x, y);
      let c = 4;
      if (d < 0.15) c = 3;
      else if (d > 0.85) c = 5;
      if ((x + y * 2 + seed) % 9 === 0) c = 2;
      px(ctx, x, y, c);
    }
  }
  // Soft ripple arcs
  for (let x = 1; x < 15; x++) {
    px(ctx, x, 4 + ((x + seed) % 3), 5);
    px(ctx, x, 10 + ((x * 2 + seed) % 2), 3);
  }
}

function drawBeach(ctx: CanvasRenderingContext2D, seed: number): void {
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      // Wet sand toward "water" side of tile (bottom-ish bias)
      let c = y > 10 ? 14 : y > 6 ? 15 : 16;
      const d = dither(seed, x, y);
      if (d < 0.08) c = 14;
      if (d > 0.92) c = 16;
      px(ctx, x, y, c);
    }
  }
  // Shell / pebble dots
  px(ctx, 3 + (seed % 3), 5, 8);
  px(ctx, 11, 8 + (seed % 2), 23);
  px(ctx, 7, 12, 14);
}

function drawRoad(ctx: CanvasRenderingContext2D, seed: number): void {
  // Grass shoulders
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < 3; x++) px(ctx, x, y, dither(seed, x, y) < 0.5 ? 10 : 9);
    for (let x = 13; x < 16; x++) px(ctx, x, y, dither(seed, x, y) < 0.5 ? 10 : 9);
  }
  // Dirt bed
  fill(ctx, 14, 3, 0, 10, TILE_SIZE);
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 3; x < 13; x++) {
      const d = dither(seed, x, y);
      if (d < 0.12) px(ctx, x, y, 21);
      else if (d > 0.88) px(ctx, x, y, 15);
    }
  }
  // Worn center track
  fill(ctx, 15, 6, 0, 4, TILE_SIZE);
  for (let y = 0; y < TILE_SIZE; y += 2) {
    px(ctx, 7, y, 16);
    px(ctx, 8, y + 1, 14);
  }
  // Edge stones
  px(ctx, 3, 2 + (seed % 4), 7);
  px(ctx, 12, 8 + (seed % 3), 7);
}

function drawBridge(ctx: CanvasRenderingContext2D, _seed: number): void {
  // Water under
  fill(ctx, 2);
  for (let x = 0; x < TILE_SIZE; x++) {
    px(ctx, x, 3, 3);
    px(ctx, x, 12, 1);
  }
  // Planks
  fill(ctx, 14, 2, 1, 12, 14);
  for (let y = 2; y < 15; y += 3) {
    fill(ctx, 21, 2, y, 12, 1);
    fill(ctx, 15, 2, y + 1, 12, 1);
  }
  // Rails + posts
  fill(ctx, 17, 1, 0, 1, TILE_SIZE);
  fill(ctx, 17, 14, 0, 1, TILE_SIZE);
  for (const y of [2, 7, 12]) {
    fill(ctx, 0, 0, y, 2, 2);
    fill(ctx, 0, 14, y, 2, 2);
  }
}

function drawTown(ctx: CanvasRenderingContext2D, seed: number): void {
  drawGrass(ctx, seed + 90);
  // Path apron
  fill(ctx, 14, 5, 13, 6, 3);
  // Building body
  fill(ctx, 16, 3, 7, 10, 7);
  fill(ctx, 8, 3, 7, 10, 1);
  // Timber frame
  fill(ctx, 17, 3, 7, 1, 7);
  fill(ctx, 17, 12, 7, 1, 7);
  fill(ctx, 17, 3, 10, 10, 1);
  // Roof
  for (let i = 0; i < 7; i++) {
    fill(ctx, 18, 7 - i, 1 + i, 2 + i * 2, 1);
    fill(ctx, 17, 7 - i, 2 + i, 2 + i * 2, 1);
  }
  // Door + windows
  fill(ctx, 0, 7, 11, 2, 3);
  px(ctx, 5, 9, 20);
  px(ctx, 10, 9, 20);
  px(ctx, 5, 8, 0);
  px(ctx, 10, 8, 0);
  // Chimney smoke hint
  fill(ctx, 17, 11, 2, 2, 3);
  px(ctx, 12, 1, 8);
}

function drawCastle(ctx: CanvasRenderingContext2D, seed: number): void {
  drawGrass(ctx, seed + 120);
  // Keep
  fill(ctx, 7, 2, 5, 12, 11);
  fill(ctx, 8, 3, 5, 10, 2);
  fill(ctx, 6, 2, 14, 12, 2);
  // Battlements
  for (let x = 2; x <= 12; x += 3) {
    fill(ctx, 7, x, 2, 2, 3);
    fill(ctx, 8, x, 2, 2, 1);
  }
  // Gatehouse
  fill(ctx, 6, 5, 9, 6, 7);
  fill(ctx, 0, 6, 11, 4, 5);
  px(ctx, 7, 12, 21);
  px(ctx, 8, 12, 21);
  // Twin towers
  fill(ctx, 7, 1, 4, 3, 8);
  fill(ctx, 7, 12, 4, 3, 8);
  fill(ctx, 18, 1, 3, 3, 2);
  fill(ctx, 18, 12, 3, 3, 2);
  // Banner
  fill(ctx, 22, 7, 0, 2, 4);
  px(ctx, 7, 1, 18);
  px(ctx, 8, 2, 18);
  // Windows
  px(ctx, 4, 7, 20);
  px(ctx, 11, 7, 20);
  px(ctx, 4, 10, 0);
  px(ctx, 11, 10, 0);
}

type DrawFn = (ctx: CanvasRenderingContext2D, seed: number) => void;

function slotFor(
  tileId: TileIdValue,
  variant: number,
  oceanFrame = 0,
): { col: number; row: number } {
  const v = variant % VARIANTS;
  switch (tileId) {
    case TileId.Grass:
      return { col: v, row: 0 };
    case TileId.TallGrass:
      return { col: v, row: 1 };
    case TileId.Forest:
      return { col: v, row: 2 };
    case TileId.Mountain:
      return { col: v, row: 3 };
    case TileId.Peak:
      return { col: v, row: 4 };
    case TileId.Ocean:
      // rows 5–6 = frames; cols = variants
      return { col: v, row: 5 + oceanFrame };
    case TileId.Shallow:
      return { col: v, row: 7 };
    case TileId.Beach:
      return { col: v, row: 8 };
    case TileId.Road:
      return { col: v, row: 9 };
    case TileId.Bridge:
      return { col: 0, row: 10 };
    case TileId.Town:
      return { col: 1, row: 10 };
    case TileId.Castle:
      return { col: 2, row: 10 };
  }
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

  const drawers: Partial<Record<TileIdValue, DrawFn>> = {
    [TileId.Grass]: drawGrass,
    [TileId.TallGrass]: drawTallGrass,
    [TileId.Forest]: drawForest,
    [TileId.Mountain]: drawMountain,
    [TileId.Peak]: drawPeak,
    [TileId.Shallow]: drawShallow,
    [TileId.Beach]: drawBeach,
    [TileId.Road]: drawRoad,
    [TileId.Bridge]: drawBridge,
    [TileId.Town]: drawTown,
    [TileId.Castle]: drawCastle,
  };

  for (const [idStr, drawer] of Object.entries(drawers)) {
    const id = Number(idStr) as TileIdValue;
    const variants =
      id === TileId.Bridge || id === TileId.Town || id === TileId.Castle
        ? 1
        : VARIANTS;
    for (let v = 0; v < variants; v++) {
      const { col, row } = slotFor(id, v);
      ctx.save();
      ctx.translate(col * TILE_SIZE, row * TILE_SIZE);
      drawer!(ctx, id * 97 + v * 13 + 5);
      ctx.restore();
    }
  }

  // Ocean frames × variants
  for (let frame = 0 as 0 | 1; frame <= 1; frame = (frame + 1) as 0 | 1) {
    for (let v = 0; v < VARIANTS; v++) {
      const { col, row } = slotFor(TileId.Ocean, v, frame);
      ctx.save();
      ctx.translate(col * TILE_SIZE, row * TILE_SIZE);
      drawOcean(ctx, 505 + v * 17, frame);
      ctx.restore();
    }
  }

  let oceanFrame = 0;

  return {
    atlas,
    oceanFrames: 2,
    tick(nowMs: number) {
      oceanFrame = Math.floor(nowMs / OCEAN_FRAME_MS) % 2;
    },
    drawTile(dest, tileId, dx, dy, tileX = 0, tileY = 0) {
      const variant = (tileX * 3 + tileY * 5) & 3;
      const { col, row } =
        tileId === TileId.Ocean
          ? slotFor(tileId, variant, oceanFrame)
          : slotFor(tileId, variant);
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
